import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteEducation } from "@/lib/actions/educations";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kelola Pendidikan",
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

export default async function AdminEducationsPage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  const { data: educations } = await supabase
    .from("educations")
    .select("id, school, degree, start_date, end_date, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pendidikan</h1>
        <Button render={<Link href="/admin/educations/new" />}>
          + Tambah Pendidikan
        </Button>
      </div>

      {!educations || educations.length === 0 ? (
        <p className="text-muted-foreground">
          Belum ada pendidikan. Klik &quot;Tambah Pendidikan&quot; untuk mulai.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-2 font-medium">Sekolah</th>
                <th className="px-4 py-2 font-medium">Gelar</th>
                <th className="px-4 py-2 font-medium">Periode</th>
                <th className="px-4 py-2 font-medium">Urutan</th>
                <th className="px-4 py-2 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {educations.map((education) => (
                <tr key={education.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium">{education.school}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {education.degree ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {formatDates(education.start_date, education.end_date)}
                  </td>
                  <td className="px-4 py-2">{education.sort_order}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <Link
                            href={`/admin/educations/${education.id}/edit`}
                          />
                        }
                      >
                        Edit
                      </Button>
                      <DeleteButton
                        action={deleteEducation}
                        id={education.id}
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