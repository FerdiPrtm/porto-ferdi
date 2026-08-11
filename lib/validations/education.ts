import { z } from "zod";
import { dateOrEmpty, textOrEmpty } from "@/lib/validations/helpers";

export const educationSchema = z.object({
  school: z.string().trim().min(1, "Sekolah/universitas wajib diisi.").max(120),
  degree: textOrEmpty(120),
  startDate: dateOrEmpty(),
  endDate: dateOrEmpty(),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type EducationInput = z.infer<typeof educationSchema>;