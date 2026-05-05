"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="mx-auto w-full max-w-xs px-4">
      <form action={formAction} className="flex flex-col gap-4">
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-label="Password"
          placeholder="Password"
          className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-offset-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-500"
        />
        {state?.message ? (
          <p className="text-center text-sm text-red-400" role="alert">
            {state.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-zinc-100 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Continue"}
        </button>
      </form>
      <p className="mt-8 text-center text-xs text-zinc-500">
        <Link href="/" className="underline-offset-2 hover:text-zinc-300 hover:underline">
          Back to site
        </Link>
      </p>
    </div>
  );
}
