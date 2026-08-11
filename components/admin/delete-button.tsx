"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";

type DeleteAction = (
  prev: unknown,
  formData: FormData
) => Promise<{ error?: string } | null>;

export function DeleteButton({
  action,
  id,
  label = "Hapus",
  confirmText = "Hapus item ini? Tindakan tidak dapat dibatalkan.",
}: {
  action: DeleteAction;
  id: string;
  label?: string;
  confirmText?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        disabled={pending}
      >
        {pending ? "..." : label}
      </Button>
      {state?.error && (
        <p className="mt-1 text-sm text-destructive">{state.error}</p>
      )}
    </form>
  );
}