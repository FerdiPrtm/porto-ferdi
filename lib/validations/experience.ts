import { z } from "zod";
import { dateOrEmpty, textOrEmpty } from "@/lib/validations/helpers";

export const experienceSchema = z.object({
  title: z.string().trim().min(1, "Jabatan wajib diisi.").max(120),
  company: z.string().trim().min(1, "Perusahaan wajib diisi.").max(120),
  description: textOrEmpty(5000),
  startDate: dateOrEmpty(),
  endDate: dateOrEmpty(),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;