"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactForm({ className }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong.");
      }
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50 via-emerald-50/80 to-teal-50/60 px-6 py-8 text-center shadow-[0_8px_30px_-12px_rgba(16,185,129,0.25)] dark:border-emerald-800/55 dark:from-emerald-950/50 dark:via-emerald-950/35 dark:to-teal-950/25",
          className,
        )}
        role="status"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-200">
          <CheckCircle2 className="size-7" strokeWidth={2} aria-hidden />
        </div>
        <p className="mt-5 text-lg font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
          Your message is on its way
        </p>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/85 dark:text-emerald-100/85">
          Thank you for taking the time to reach out. I read every note with care and will reply
          as soon as I can. Here&apos;s hoping we get to build something meaningful together.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-4", className)}
      noValidate
    >
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none ring-primary/20 transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none ring-primary/20 transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-y rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none ring-primary/20 transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2"
          placeholder="What would you like to work on?"
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:opacity-60 sm:h-11"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
