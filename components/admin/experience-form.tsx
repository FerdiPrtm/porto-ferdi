"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { createExperience, updateExperience } from "@/lib/actions/experiences";
import {
  experienceSchema,
  type ExperienceInput,
} from "@/lib/validations/experience";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ExperienceRecord = {
  id: string;
  title: string;
  company: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
};

export function ExperienceForm({
  experience,
}: {
  experience?: ExperienceRecord;
}) {
  const isEdit = Boolean(experience);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema) as Resolver<ExperienceInput>,
    defaultValues: {
      title: experience?.title ?? "",
      company: experience?.company ?? "",
      startDate: experience?.start_date ?? "",
      endDate: experience?.end_date ?? "",
      description: experience?.description ?? "",
      sortOrder: experience?.sort_order ?? 0,
    },
  });

  function onSubmit(values: ExperienceInput) {
    setError(null);
    startTransition(async () => {
      const result = experience
        ? await updateExperience(experience.id, values)
        : await createExperience(values);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="title">Posisi *</Label>
        <Input
          id="title"
          placeholder="Frontend Developer"
          disabled={isPending}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Perusahaan *</Label>
        <Input
          id="company"
          placeholder="PT Contoh Teknologi"
          disabled={isPending}
          {...register("company")}
        />
        {errors.company && (
          <p className="text-sm text-destructive">{errors.company.message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start-date">Mulai</Label>
          <Input
            id="start-date"
            type="date"
            disabled={isPending}
            {...register("startDate")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">Selesai</Label>
          <Input
            id="end-date"
            type="date"
            disabled={isPending}
            {...register("endDate")}
          />
          <p className="text-xs text-muted-foreground">
            Kosongkan jika masih berjalan.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Ceritakan tanggung jawab dan pencapaianmu..."
          disabled={isPending}
          {...register("description")}
        />
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

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Tambah Pengalaman"}
        </Button>
        <Button variant="outline" render={<Link href="/admin/experiences" />}>
          Batal
        </Button>
      </div>
    </form>
  );
}