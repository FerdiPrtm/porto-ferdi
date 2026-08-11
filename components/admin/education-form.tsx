"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { createEducation, updateEducation } from "@/lib/actions/educations";
import {
  educationSchema,
  type EducationInput,
} from "@/lib/validations/education";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type EducationRecord = {
  id: string;
  school: string;
  degree: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
};

export function EducationForm({
  education,
}: {
  education?: EducationRecord;
}) {
  const isEdit = Boolean(education);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationInput>({
    resolver: zodResolver(educationSchema) as Resolver<EducationInput>,
    defaultValues: {
      school: education?.school ?? "",
      degree: education?.degree ?? "",
      startDate: education?.start_date ?? "",
      endDate: education?.end_date ?? "",
      sortOrder: education?.sort_order ?? 0,
    },
  });

  function onSubmit(values: EducationInput) {
    setError(null);
    startTransition(async () => {
      const result = education
        ? await updateEducation(education.id, values)
        : await createEducation(values);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="school">Sekolah / Universitas *</Label>
        <Input
          id="school"
          placeholder="Universitas Contoh"
          disabled={isPending}
          {...register("school")}
        />
        {errors.school && (
          <p className="text-sm text-destructive">{errors.school.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="degree">Gelar / Jurusan</Label>
        <Input
          id="degree"
          placeholder="S.Kom. Teknik Informatika"
          disabled={isPending}
          {...register("degree")}
        />
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
              : "Tambah Pendidikan"}
        </Button>
        <Button variant="outline" render={<Link href="/admin/educations" />}>
          Batal
        </Button>
      </div>
    </form>
  );
}