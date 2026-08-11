import { z } from "zod";
import { textOrEmpty } from "@/lib/validations/helpers";

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Nama skill wajib diisi.").max(60),
  category: textOrEmpty(60),
  level: z.coerce.number().int().min(1).max(5).default(3),
  icon: textOrEmpty(60),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;