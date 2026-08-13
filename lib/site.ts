import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const siteName = "Portofolio";
export const siteDescription =
  "Portofolio pribadi — lihat project, pengalaman, dan keahlian yang pernah dikerjakan.";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Open Graph lengkap per halaman. Catatan: object `openGraph` yang
 * didefinisikan di page/layout anak MENGGANTI (bukan merge) openGraph dari
 * layout induk, jadi field seperti `siteName` dan `images` harus diisi eksplisit.
 */
export function openGraphMeta(
  path: string,
  extra?: Exclude<Metadata["openGraph"], undefined>
): Metadata["openGraph"] {
  return {
    type: "website",
    siteName,
    url: absoluteUrl(path),
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        type: "image/png",
        alt: siteName,
      },
    ],
    ...extra,
  };
}
