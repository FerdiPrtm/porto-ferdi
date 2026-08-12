import { createPublicClient } from "@/lib/supabase/public";

export async function getProfile() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getProjects() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getFeaturedProjects(limit = 3) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getProjectBySlug(slug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getSkills() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  return data ?? [];
}

export async function getExperiences() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getEducations() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("educations")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}