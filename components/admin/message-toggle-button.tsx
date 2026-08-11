"use client";

import { useTransition } from "react";
import { setMessageRead } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";

export function MessageToggleButton({
  id,
  isRead,
}: {
  id: string;
  isRead: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setMessageRead(id, !isRead);
        })
      }
    >
      {isPending
        ? "..."
        : isRead
          ? "Tandai Belum Dibaca"
          : "Tandai Dibaca"}
    </Button>
  );
}