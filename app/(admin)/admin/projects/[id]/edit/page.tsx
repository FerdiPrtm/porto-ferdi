import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata = {
  title: "Edit Project",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
      <ProjectForm project={project} />
    </main>
  );
}