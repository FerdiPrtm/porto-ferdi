import { ProjectForm } from "@/components/admin/project-form";

export const metadata = {
  title: "Tambah Project",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Tambah Project</h1>
      <ProjectForm />
    </main>
  );
}