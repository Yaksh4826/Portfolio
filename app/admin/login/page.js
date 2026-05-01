"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** No automatic redirect from this page — stops “always logged in” loops. Middleware still guards /admin. */

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError("Invalid secret keyword.");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h1 className="text-xl font-semibold text-foreground">Admin sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your secret keyword. Middleware + cookie guard the admin area — no silent auto-login here.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="admin-keyword" className="text-sm font-medium text-foreground">
            Secret keyword
          </label>
          <input
            id="admin-keyword"
            type="password"
            autoComplete="off"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/admin" className="text-muted-foreground underline underline-offset-2 hover:text-foreground">
          Already signed in? Open dashboard →
        </Link>
      </p>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-2 hover:text-foreground">
          Back to site
        </Link>
      </p>
    </div>
  );
}
