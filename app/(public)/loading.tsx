export default function PublicLoading() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-6 px-6 py-20">
      <div className="size-28 animate-pulse rounded-full bg-muted" />
      <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="h-9 w-72 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
      <div className="h-4 w-full max-w-lg animate-pulse rounded bg-muted" />
    </main>
  );
}
