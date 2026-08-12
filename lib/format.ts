export function formatDateRange(
  start: string | null,
  end: string | null,
  locale = "id-ID"
): string {
  const format = (value: string) =>
    new Date(value + "T00:00:00").toLocaleDateString(locale, {
      month: "short",
      year: "numeric",
    });

  const startLabel = start ? format(start) : "—";
  const endLabel = end ? format(end) : "Sekarang";
  return `${startLabel} – ${endLabel}`;
}

export function formatDate(value: string, locale = "id-ID"): string {
  return new Date(value).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function truncate(value: string, length: number): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}…`;
}