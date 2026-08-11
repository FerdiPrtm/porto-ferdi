"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/guard";
import {
  educationSchema,
  type EducationInput,
} from "@/lib/validations/education";

export async function createEducation(
  input: EducationInput
): Promise<{ error: string } | null> {
  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await requireAdmin();

  const { error } = await supabase.from("educations").insert({
    school: parsed.data.school,
    degree: parsed.data.degree ?? null,
    start_date: parsed.data.startDate ?? null,
    end_date: parsed.data.endDate ?? null,
    sort_order: parsed.data.sortOrder,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/educations");
  redirect("/admin/educations");
}

export async function updateEducation(
  id: string,
  input: EducationInput
): Promise<{ error: string } | null> {
  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("educations")
    .update({
      school: parsed.data.school,
      degree: parsed.data.degree ?? null,
      start_date: parsed.data.startDate ?? null,
      end_date: parsed.data.endDate ?? null,
      sort_order: parsed.data.sortOrder,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/educations");
  redirect("/admin/educations");
}

export async function deleteEducation(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string } | null> {
  const id = String(formData.get("id") ?? "");

  const supabase = await requireAdmin();
  const { error } = await supabase.from("educations").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/educations");
  redirect("/admin/educations");
}