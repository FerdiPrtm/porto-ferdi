"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";

async function requireAdmin() {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    throw new Error("Unauthorized: hanya admin yang bisa mengelola project.");
  }
  return supabase;
}

export async function createProject(
  input: ProjectInput
): Promise<{ error: string } | null> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await requireAdmin();

  const { error } = await supabase.from("projects").insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description ?? null,
    tech_stack: parsed.data.techStack,
    image_url: parsed.data.imageUrl ?? null,
    demo_url: parsed.data.demoUrl ?? null,
    repo_url: parsed.data.repoUrl ?? null,
    is_featured: parsed.data.isFeatured,
    sort_order: parsed.data.sortOrder,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah dipakai, gunakan slug lain." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  input: ProjectInput
): Promise<{ error: string } | null> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }

  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("projects")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description ?? null,
      tech_stack: parsed.data.techStack,
      image_url: parsed.data.imageUrl ?? null,
      demo_url: parsed.data.demoUrl ?? null,
      repo_url: parsed.data.repoUrl ?? null,
      is_featured: parsed.data.isFeatured,
      sort_order: parsed.data.sortOrder,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah dipakai, gunakan slug lain." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  redirect("/admin/projects");
}

export async function deleteProject(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string } | null> {
  const id = String(formData.get("id") ?? "");

  const supabase = await requireAdmin();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}