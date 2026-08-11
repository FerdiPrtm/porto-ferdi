import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSkill } from "@/lib/actions/skills";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kelola Skills",
  robots: { index: false, follow: false },
};

export default async function AdminSkillsPage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, category, icon, level, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
        <Button render={<Link href="/admin/skills/new" />}>
          + Tambah Skill
        </Button>
      </div>

      {!skills || skills.length === 0 ? (
        <p className="text-muted-foreground">
          Belum ada skill. Klik &quot;Tambah Skill&quot; untuk mulai.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-2 font-medium">Nama</th>
                <th className="px-4 py-2 font-medium">Kategori</th>
                <th className="px-4 py-2 font-medium">Level</th>
                <th className="px-4 py-2 font-medium">Urutan</th>
                <th className="px-4 py-2 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium">
                    {skill.icon && `${skill.icon} `}
                    {skill.name}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {skill.category ?? "—"}
                  </td>
                  <td className="px-4 py-2">{skill.level}/5</td>
                  <td className="px-4 py-2">{skill.sort_order}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <Link href={`/admin/skills/${skill.id}/edit`} />
                        }
                      >
                        Edit
                      </Button>
                      <DeleteButton action={deleteSkill} id={skill.id} />
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