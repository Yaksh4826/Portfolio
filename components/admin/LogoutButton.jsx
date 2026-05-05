"use client";

import { logoutAction } from "@/app/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logoutAction} className="mt-2">
      <button
        type="submit"
        className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
      >
        Log out
      </button>
    </form>
  );
}
