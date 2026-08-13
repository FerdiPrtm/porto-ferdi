import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi saya untuk kolaborasi atau pertanyaan.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-14">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Hubungi Saya</h1>
        <p className="text-muted-foreground">
          Ada pertanyaan atau ingin berkolaborasi? Kirim pesan lewat formulir di
          bawah.
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
