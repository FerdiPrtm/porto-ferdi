export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminIndexPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
      <p className="text-muted-foreground">
        Dashboard &amp; proteksi auth dikerjakan di Sprint 2.
      </p>
    </main>
  );
}