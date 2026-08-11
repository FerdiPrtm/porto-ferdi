"use client";

import { useActionState } from "react";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [, action, pending] = useActionState(signOut, null);

  return (
    <form action={action}>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Keluar..." : "Logout"}
      </Button>
    </form>
  );
}