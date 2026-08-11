"use client";

import { useActionState } from "react";
import { deleteProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";

export function ProjectDeleteButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteProject, null);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Hapus project ini? Tindakan tidak dapat dibatalkan."
          )
        ) {
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
        {pending ? "..." : "Hapus"}
      </Button>
      {state?.error && (
        <p className="mt-1 text-sm text-destructive">{state.error}</p>
      )}
    </form>
  );
}