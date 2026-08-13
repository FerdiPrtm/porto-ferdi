"use client";

import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <CircleAlert className="size-10 text-destructive" />
      <h1 className="text-2xl font-bold tracking-tight">
        Terjadi kesalahan
      </h1>
      <p className="text-muted-foreground">
        Gagal memuat halaman ini. Silakan coba lagi.
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </main>
  );
}
