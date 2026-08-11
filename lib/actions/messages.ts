"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/guard";

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