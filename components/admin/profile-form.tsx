"use client";

import { useState, useTransition } from "react";
import { useRef } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteAvatar, updateProfile } from "@/lib/actions/profile";
import { uploadFile } from "@/lib/supabase/upload";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ProfileRecord = {
  id: string;
  full_name: string;
  tagline: string | null;
  bio: string | null;
  email: string | null;
  avatar_url: string | null;
  cv_url: string | null;
  social_links: {
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
  } | null;
};

export function ProfileForm({ profile }: { profile: ProfileRecord }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState<"avatar" | "cv" | null>(null);
  const [deletingAvatar, setDeletingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileInput>,
    defaultValues: {
      fullName: profile.full_name ?? "",
      tagline: profile.tagline ?? "",
      bio: profile.bio ?? "",
      email: profile.email ?? "",
      avatarUrl: profile.avatar_url ?? "",
      cvUrl: profile.cv_url ?? "",
      socialLinks: {
        github: profile.social_links?.github ?? "",
        linkedin: profile.social_links?.linkedin ?? "",
        twitter: profile.social_links?.twitter ?? "",
      },
    },
  });

  async function handleFile(
    kind: "avatar" | "cv",
    file: File | undefined
  ) {
    if (!file) return;
    setUploading(kind);
    setError(null);
    const bucket = kind === "avatar" ? "project-images" : "cv";
    const folder = kind === "avatar" ? "avatars" : "files";
    const { url, error: uploadError } = await uploadFile(file, bucket, folder);
    setUploading(null);
    if (uploadError) {
      setError(uploadError);
      return;
    }
    setValue(kind === "avatar" ? "avatarUrl" : "cvUrl", url, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  const avatarUrl = getValues("avatarUrl");
  const cvUrl = getValues("cvUrl");

  function handleDeleteAvatar() {
    if (!window.confirm("Hapus foto profil? Tindakan tidak dapat dibatalkan.")) {
      return;
    }
    setError(null);
    setDeletingAvatar(true);
    startTransition(async () => {
      const result = await deleteAvatar();
      if (result?.error) {
        setError(result.error);
        setDeletingAvatar(false);
      }
    });
  }

  function onSubmit(values: ProfileInput) {
    setError(null);
    startTransition(async () => {
      const result = await updateProfile(values);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="full-name">Nama Lengkap *</Label>
        <Input
          id="full-name"
          placeholder="Ferdi"
          disabled={isPending || uploading !== null}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          placeholder="Fullstack Web Developer"
          disabled={isPending || uploading !== null}
          {...register("tagline")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={5}
          placeholder="Perkenalan singkat..."
          disabled={isPending || uploading !== null}
          {...register("bio")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="kontak@email.com"
          disabled={isPending || uploading !== null}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Foto Avatar</Label>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading !== null}
            onChange={(e) => handleFile("avatar", e.target.files?.[0])}
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading !== null}
              onClick={() => avatarInputRef.current?.click()}
            >
              {uploading === "avatar" ? "Uploading..." : "Upload Foto"}
            </Button>
            {avatarUrl && (
              <a
                href={avatarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-[200px] truncate text-sm text-muted-foreground underline"
              >
                {avatarUrl}
              </a>
            )}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={!avatarUrl || deletingAvatar || uploading !== null}
              onClick={handleDeleteAvatar}
            >
              {deletingAvatar ? "Menghapus..." : "Hapus Foto"}
            </Button>
          </div>
          <input type="hidden" {...register("avatarUrl")} />
        </div>

        <div className="space-y-2">
          <Label>File CV</Label>
          <input
            ref={cvInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={uploading !== null}
            onChange={(e) => handleFile("cv", e.target.files?.[0])}
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading !== null}
              onClick={() => cvInputRef.current?.click()}
            >
              {uploading === "cv" ? "Uploading..." : "Upload CV"}
            </Button>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-[200px] truncate text-sm text-muted-foreground underline"
              >
                {cvUrl}
              </a>
            )}
          </div>
          <input type="hidden" {...register("cvUrl")} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="github">Github</Label>
          <Input
            id="github"
            placeholder="https://github.com/..."
            disabled={isPending || uploading !== null}
            {...register("socialLinks.github")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/..."
            disabled={isPending || uploading !== null}
            {...register("socialLinks.linkedin")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter / X</Label>
          <Input
            id="twitter"
            placeholder="https://x.com/..."
            disabled={isPending || uploading !== null}
            {...register("socialLinks.twitter")}
          />
        </div>
      </div>
      {errors.socialLinks && (
        <p className="text-sm text-destructive">
          {errors.socialLinks.github?.message ??
            errors.socialLinks.linkedin?.message ??
            errors.socialLinks.twitter?.message}
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending || uploading !== null}>
          {isPending ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </div>
    </form>
  );
}