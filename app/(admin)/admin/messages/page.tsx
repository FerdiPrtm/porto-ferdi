import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/guard";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMessage } from "@/lib/actions/messages";
import { MessageToggleButton } from "@/components/admin/message-toggle-button";

export const metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  if (!(await isAdmin(supabase))) {
    redirect("/admin/login");
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, name, email, message, is_read, created_at")
    .order("created_at", { ascending: false });

  const unreadCount =
    messages?.filter((message) => !message.is_read).length ?? 0;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
        <span className="text-sm text-muted-foreground">
          {unreadCount} belum dibaca
        </span>
      </div>

      {!messages || messages.length === 0 ? (
        <p className="text-muted-foreground">
          Belum ada pesan masuk dari pengunjung.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-2xl border p-5 ${
                message.is_read
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-primary/40 bg-primary/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-medium">{message.name}</span>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-sm text-muted-foreground underline"
                    >
                      {message.email}
                    </a>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  {!message.is_read && (
                    <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      Baru
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <MessageToggleButton id={message.id} isRead={message.is_read} />
                  <DeleteButton
                    action={deleteMessage}
                    id={message.id}
                    label="Hapus"
                    confirmText="Hapus pesan ini? Tindakan tidak dapat dibatalkan."
                  />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {message.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}