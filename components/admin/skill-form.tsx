"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { createSkill, updateSkill } from "@/lib/actions/skills";
import { skillSchema, type SkillInput } from "@/lib/validations/skill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type SkillRecord = {
  id: string;
  name: string;
  category: string | null;
  level: number;
  icon: string | null;
  sort_order: number;
};

export function SkillForm({ skill }: { skill?: SkillRecord }) {
  const isEdit = Boolean(skill);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema) as Resolver<SkillInput>,
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      level: skill?.level ?? 3,
      icon: skill?.icon ?? "",
      sortOrder: skill?.sort_order ?? 0,
    },
  });

  function onSubmit(values: SkillInput) {
    setError(null);
    startTransition(async () => {
      const result = skill
        ? await updateSkill(skill.id, values)
        : await createSkill(values);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Nama Skill *</Label>
        <Input
          id="name"
          placeholder="React, Next.js, PostgreSQL..."
          disabled={isPending}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Input
            id="category"
            placeholder="Frontend, Backend, Tools..."
            disabled={isPending}
            {...register("category")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            placeholder="Nama icon (mis. lucide react)"
            disabled={isPending}
            {...register("icon")}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="level">Level (1-5)</Label>
          <Input
            id="level"
            type="number"
            min={1}
            max={5}
            className="w-24"
            disabled={isPending}
            {...register("level")}
          />
          {errors.level && (
            <p className="text-sm text-destructive">{errors.level.message}</p>
          )}
        </div>
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
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Skill"}
        </Button>
        <Button variant="outline" render={<Link href="/admin/skills" />}>
          Batal
        </Button>
      </div>
    </form>
  );
}