"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Ctrl+Shift+A (not fired from form fields): opens a hidden gateway dialog to admin login.
 */
export default function AdminShortcutConsole() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) close();
  }, [pathname, close]);

  useEffect(() => {
    function isTypingContext() {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if ("isContentEditable" in el && el.isContentEditable) return true;
      return false;
    }

    function onKeyDown(e) {
      if (pathname?.startsWith("/admin")) return;
      if (e.repeat) return;
      if (!e.ctrlKey || !e.shiftKey || e.code !== "KeyA") return;
      if (isTypingContext()) return;

      e.preventDefault();
      setOpen(true);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onEscape(e) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, close]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-950 px-5 py-4 shadow-2xl ring-1 ring-white/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-console-title"
      >
        <h2 id="admin-console-title" className="sr-only">
          Admin gateway
        </h2>
        <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-zinc-100">
          <span className="text-emerald-500/95">portfolio</span>
          <span className="text-zinc-500">:</span>
          <span className="text-sky-400/90">~</span>
          <span className="text-zinc-500">$ </span>
          <span className="text-zinc-300">access --privileged</span>
          {"\n"}
          <span className="text-zinc-600">●</span>
          {" "}
          <span className="text-zinc-500">authenticated channel ready</span>
        </pre>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/admin/login"
            onClick={close}
            className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-100 px-3 text-sm font-medium text-zinc-950 transition hover:bg-white"
          >
            Continue
          </Link>
          <button
            type="button"
            className="text-sm text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
