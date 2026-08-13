import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteExperience } from "@/lib/actions/experiences";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kelola Pengalaman",
  robots: { index: false, follow: false },
};

function formatDates(
  start: string | null,
  end: string | null
): string {
  const startLabel = start
    ? new Date(start + "T00:00:00").toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })
    : "—";
  const endLabel = end
    ? new Date(end + "T00:00:00").toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })
    : "Sekarang";
  return `${startLabel}–${endLabel}`;
}

export default async function AdminExperiencesPage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  const { data: experiences } = await supabase
    .from("experiences")
    .select("id, title, company, start_date, end_date, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pengalaman</h1>
        <Button render={<Link href="/admin/experiences/new" />}>
          + Tambah Pengalaman
        </Button>
      </div>

      {!experiences || experiences.length === 0 ? (
        <p className="text-muted-foreground">
          Belum ada pengalaman. Klik &quot;Tambah Pengalaman&quot; untuk mulai.
        </p>
      ) : (
        <div className="overflow-x-auto overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-white/[0.03] text-left">
                <th className="px-4 py-2 font-medium">Posisi</th>
                <th className="px-4 py-2 font-medium">Perusahaan</th>
                <th className="px-4 py-2 font-medium">Periode</th>
                <th className="px-4 py-2 font-medium">Urutan</th>
                <th className="px-4 py-2 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((experience) => (
                <tr key={experience.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium">{experience.title}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {experience.company}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {formatDates(experience.start_date, experience.end_date)}
                  </td>
                  <td className="px-4 py-2">{experience.sort_order}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <Link
                            href={`/admin/experiences/${experience.id}/edit`}
                          />
                        }
                      >
                        Edit
                      </Button>
                      <DeleteButton
                        action={deleteExperience}
                        id={experience.id}
                      />
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