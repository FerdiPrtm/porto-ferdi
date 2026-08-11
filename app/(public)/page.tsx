export const metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Portfolio <span className="text-primary">Coming Soon</span>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Public site diisi pada Sprint 6. Struktur project sudah siap: Next.js
        (App Router), TypeScript, Tailwind, shadcn/ui, dan Supabase.
      </p>
    </main>
  );
}