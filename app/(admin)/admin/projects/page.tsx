import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kelola Projects",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, slug, is_featured, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Button render={<Link href="/admin/projects/new" />}>
          + Tambah Project
        </Button>
      </div>

      {!projects || projects.length === 0 ? (
        <p className="text-muted-foreground">
          Belum ada project. Klik &quot;Tambah Project&quot; untuk mulai.
        </p>
      ) : (
        <div className="overflow-x-auto overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-white/[0.03] text-left">
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Featured</th>
                <th className="px-4 py-2 font-medium">Urutan</th>
                <th className="px-4 py-2 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b last:border-0"
                >
                  <td className="px-4 py-2 font-medium">{project.title}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {project.slug}
                  </td>
                  <td className="px-4 py-2">
                    {project.is_featured ? "Ya" : "—"}
                  </td>
                  <td className="px-4 py-2">{project.sort_order}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <Link href={`/admin/projects/${project.id}/edit`} />
                        }
                      >
                        Edit
                      </Button>
                      <DeleteButton action={deleteProject} id={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}