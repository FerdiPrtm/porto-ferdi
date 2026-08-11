"use client";

import { useRef, useState, useTransition } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { createProject, updateProject } from "@/lib/actions/projects";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export type ProjectRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tech_stack: string[] | null;
  image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  sort_order: number;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectForm({ project }: { project?: ProjectRecord }) {
  const isEdit = Boolean(project);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [techStackText, setTechStackText] = useState<string>(
    project?.tech_stack?.join(", ") ?? ""
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.image_url ?? null
  );
  const [slugPreview, setSlugPreview] = useState<string>(project?.slug ?? "");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema) as Resolver<ProjectInput>,
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      description: project?.description ?? "",
      techStack: project?.tech_stack ?? [],
      imageUrl: project?.image_url ?? "",
      demoUrl: project?.demo_url ?? "",
      repoUrl: project?.repo_url ?? "",
      isFeatured: project?.is_featured ?? false,
      sortOrder: project?.sort_order ?? 0,
    },
  });

  const currentSlug = slugPreview;
  const slugWasEdited = useRef(isEdit);

  function handleTitleBlur() {
    if (slugWasEdited.current) return;
    const next = slugify(getValues("title"));
    if (next) {
      setSlugPreview(next);
      setValue("slug", next);
    }
  }

  function handleSlugChange(value: string) {
    slugWasEdited.current = true;
    setSlugPreview(value);
    setValue("slug", value, { shouldValidate: true });
  }

  function handleTechStackChange(value: string) {
    setTechStackText(value);
    setValue(
      "techStack",
      value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      { shouldValidate: true }
    );
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("project-images")
        .upload(path, file, { upsert: false, cacheControl: "3600" });
      if (error) throw error;

      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      setValue("imageUrl", data.publicUrl, { shouldValidate: true });
      setImagePreview(data.publicUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Upload gambar gagal."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function onSubmit(values: ProjectInput) {
    setError(null);
    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, values)
        : await createProject(values);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Nama project"
          disabled={isPending}
          {...register("title")}
          onBlur={handleTitleBlur}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          placeholder="nama-project"
          disabled={isPending}
          {...register("slug")}
          onChange={(e) => handleSlugChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Dipakai di URL: /projects/{currentSlug || "nama-project"}
        </p>
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Jelaskan project ini..."
          disabled={isPending}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Gambar Project</Label>
        <Input
          type="file"
          accept="image/*"
          disabled={uploading || isPending}
          onChange={handleImageChange}
        />
        {uploading && (
          <p className="text-sm text-muted-foreground">Mengupload...</p>
        )}
        {uploadError && (
          <p className="text-sm text-destructive">{uploadError}</p>
        )}
        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview}
            alt="Pratinjau gambar project"
            className="h-32 w-48 rounded-lg border object-cover"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tech-stack">Tech Stack</Label>
        <Input
          id="tech-stack"
          placeholder="React, Next.js, Supabase (pisah dengan koma)"
          disabled={isPending}
          value={techStackText}
          onChange={(e) => handleTechStackChange(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="demo-url">Link Demo</Label>
          <Input
            id="demo-url"
            placeholder="https://..."
            disabled={isPending}
            {...register("demoUrl")}
          />
          {errors.demoUrl && (
            <p className="text-sm text-destructive">{errors.demoUrl.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="repo-url">Link Repository</Label>
          <Input
            id="repo-url"
            placeholder="https://github.com/..."
            disabled={isPending}
            {...register("repoUrl")}
          />
          {errors.repoUrl && (
            <p className="text-sm text-destructive">{errors.repoUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Controller
          control={control}
          name="isFeatured"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="is-featured"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isPending}
              />
              <Label htmlFor="is-featured">Featured (tampil di home)</Label>
            </div>
          )}
        />
        <div className="space-y-2">
          <Label htmlFor="sort-order">Urutan</Label>
          <Input
            id="sort-order"
            type="number"
            min={0}
            max={9999}
            className="w-24"
            disabled={isPending}
            {...register("sortOrder")}
          />
          {errors.sortOrder && (
            <p className="text-sm text-destructive">
              {errors.sortOrder.message}
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending || uploading}>
          {isPending
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Buat Project"}
        </Button>
        <Button variant="outline" render={<Link href="/admin/projects" />}>
          Batal
        </Button>
      </div>
    </form>
  );
}