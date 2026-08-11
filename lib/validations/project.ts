import { z } from "zod";

const urlOrEmpty = (message: string) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().url(message).optional()
  );

const textOrEmpty = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().max(max).optional()
  );

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title wajib diisi.")
    .max(120, "Maksimal 120 karakter."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi.")
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya huruf kecil, angka, dan tanda hubung (-)."
    ),
  description: textOrEmpty(5000),
  techStack: z
    .array(z.string().trim().min(1))
    .max(30, "Maksimal 30 tech stack."),
  imageUrl: urlOrEmpty("URL gambar tidak valid."),
  demoUrl: urlOrEmpty("URL demo tidak valid."),
  repoUrl: urlOrEmpty("URL repo tidak valid."),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;