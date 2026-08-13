"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/guard";
import { createPublicClient } from "@/lib/supabase/public";
import {
  contactSchema,
  type ContactInput,
} from "@/lib/validations/contact";

export async function sendMessage(
  values: ContactInput
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Input tidak valid.",
    };
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function setMessageRead(id: string, isRead: boolean) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("messages")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
}

export async function deleteMessage(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string } | null> {
  const id = String(formData.get("id") ?? "");

  const supabase = await requireAdmin();
  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
  redirect("/admin/messages");
}