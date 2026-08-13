"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import { sendMessage } from "@/lib/actions/messages";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  function onSubmit(values: ContactInput) {
    setError(null);
    startTransition(async () => {
      const result = await sendMessage(values);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setIsSuccess(true);
      reset();
    });
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 px-6 py-12 text-center">
        <CircleCheck className="size-10 text-primary" />
        <h2 className="text-lg font-semibold">Pesan terkirim!</h2>
        <p className="text-sm text-muted-foreground">
          Terima kasih, saya akan segera membalas pesan Anda.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSuccess(false)}
        >
          Kirim pesan lagi
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          type="text"
          placeholder="Nama Anda"
          autoComplete="name"
          disabled={isPending}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@contoh.com"
          autoComplete="email"
          disabled={isPending}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Pesan</Label>
        <Textarea
          id="message"
          placeholder="Tulis pesan Anda di sini..."
          rows={6}
          disabled={isPending}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}
