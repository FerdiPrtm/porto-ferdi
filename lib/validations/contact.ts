import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi.")
    .max(100, "Maksimal 100 karakter."),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .max(255, "Maksimal 255 karakter.")
    .email("Email tidak valid."),
  message: z
    .string()
    .trim()
    .min(1, "Pesan wajib diisi.")
    .max(5000, "Maksimal 5000 karakter."),
});

export type ContactInput = z.infer<typeof contactSchema>;
