"use client";

import { useActionState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton({ className }: { className?: string }) {
  const [, action, pending] = useActionState(signOut, null);

  return (
    <form action={action} className={className}>
      <Button
        type="submit"
        variant="outline"
        disabled={pending}
        className="w-full gap-2"
      >
        <LogOut className="size-4" />
        {pending ? "Keluar..." : "Logout"}
      </Button>
    </form>
  );
}
