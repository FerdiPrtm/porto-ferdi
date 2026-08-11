import { z } from "zod";
import { emailOrEmpty, textOrEmpty, urlOrEmpty } from "@/lib/validations/helpers";

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Nama lengkap wajib diisi.").max(120),
  tagline: textOrEmpty(160),
  bio: textOrEmpty(5000),
  email: emailOrEmpty(),
  avatarUrl: urlOrEmpty("URL avatar tidak valid."),
  cvUrl: urlOrEmpty("URL CV tidak valid."),
  socialLinks: z
    .object({
      github: urlOrEmpty("URL github tidak valid."),
      linkedin: urlOrEmpty("URL linkedin tidak valid."),
      twitter: urlOrEmpty("URL twitter tidak valid."),
    })
    .partial()
    .default({}),
});

export type ProfileInput = z.infer<typeof profileSchema>;