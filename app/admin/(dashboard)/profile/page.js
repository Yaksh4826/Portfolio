"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground";

const empty = {
  name: "",
  tagLine: "",
  bio: "",
  avatar: "",
  github: "",
  linkedin: "",
  email: "",
};

export default function AdminProfilePage() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // avatar uploading
  const [uploadingResume, setUploadingResume] = useState(false); // resume uploading
  const [msg, setMsg] = useState({ type: "", text: "" });

  const load = useCallback(async () => {
    const r = await fetch("/api/profile");
    const d = await r.json();
    const p = Array.isArray(d.profileData) ? d.profileData[0] : null;
    if (p) {
      setForm({
        name: p.name ?? "",
        tagLine: p.tagLine ?? "",
        bio: p.bio ?? "",
        avatar: p.avatar ?? "",
        github: p.socials?.github ?? "",
        linkedin: p.socials?.linkedin ?? "",
        email: p.socials?.email ?? "",
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onPickAvatar(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setMsg({ type: "", text: "" });
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || d.message || "Upload failed");
      setForm((f) => ({ ...f, avatar: d.url }));
      setMsg({ type: "ok", text: "Avatar uploaded." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  async function onPickResume(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingResume(true);
    setMsg({ type: "", text: "" });

    try {
      const fd = new FormData(); // FIXED name
      fd.append("file", file);

      const res = await fetch("/api/admin/upload-resume", {
        method: "POST",
        body: fd,
        credentials: "include", // FIXED
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Upload failed");

      console.log("Resume uploaded:", data.url);
      setMsg({ type: "ok", text: "Resume uploaded." });

      // If you want to store resume URL in form:
      // setForm((f) => ({ ...f, resume: data.url }));
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploadingResume(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    const body = {
      name: form.name.trim(),
      tagLine: form.tagLine.trim(),
      bio: form.bio.trim(),
      avatar: form.avatar.trim() || undefined,
      socials: {
        github: form.github.trim() || undefined,
        linkedin: form.linkedin.trim() || undefined,
        email: form.email.trim() || undefined,
      },
    };
    try {
      const r = await fetch("/api/admin/profile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Save failed");
      setMsg({ type: "ok", text: d.message || "Profile saved." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading profile…</p>;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upserts the single profile document used on the homepage.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Field label="Name">
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </Field>
        <Field label="Tagline">
          <input
            className={inputClass}
            value={form.tagLine}
            onChange={(e) => setForm((f) => ({ ...f, tagLine: e.target.value }))}
          />
        </Field>
        <Field label="Bio">
          <textarea
            className={cn(inputClass, "min-h-[100px] resize-y")}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          />
        </Field>
        <Field label="Avatar URL">
          <input
            className={inputClass}
            value={form.avatar}
            onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
            placeholder="Image URL"
          />
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input type="file" accept="image/*" className="hidden" onChange={onPickAvatar} disabled={uploading} />
            <span className="rounded-md border border-border bg-muted/50 px-2 py-1 font-medium text-foreground">
              {uploading ? "Uploading…" : "Upload to Cloudinary"}
            </span>
          </label>
        </Field>

        <Field label="Resume">
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={onPickResume}
              disabled={uploadingResume}
            />
            <span className="rounded-md border border-border bg-muted/50 px-2 py-1 font-medium text-foreground">
              {uploadingResume ? "Uploading…" : "Upload Resume"}
            </span>
          </label>
        </Field>

        <Field label="GitHub URL">
          <input
            className={inputClass}
            value={form.github}
            onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
          />
        </Field>
        <Field label="LinkedIn URL">
          <input
            className={inputClass}
            value={form.linkedin}
            onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
          />
        </Field>
        <Field label="Email (display)">
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </Field>

        {msg.text ? (
          <p
            className={cn("text-sm", msg.type === "ok" ? "text-green-700 dark:text-green-400" : "text-destructive")}
          >
            {msg.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
