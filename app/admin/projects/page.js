"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  summary: "",
  thumbnail: "",
  tags: "",
  githubUrl: "",
  liveUrl: "",
  completedDate: "",
};

function tagsToString(tags) {
  return Array.isArray(tags) ? tags.filter(Boolean).join(", ") : "";
}

function idStr(doc) {
  if (!doc?._id) return "";
  return typeof doc._id === "string" ? doc._id : doc._id.toString?.() ?? String(doc._id);
}

const inputClass =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground";

export default function AdminProjectsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/projects", { credentials: "include" });
    const d = await r.json();
    setList(Array.isArray(d.projects) ? d.projects : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startNew() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage({ type: "", text: "" });
  }

  function startEdit(p) {
    setEditingId(idStr(p));
    setForm({
      title: p.title ?? "",
      slug: p.slug ?? "",
      description: p.description ?? "",
      summary: p.summary ?? "",
      thumbnail: p.thumbnail ?? "",
      tags: tagsToString(p.tags),
      githubUrl: p.githubUrl ?? "",
      liveUrl: p.liveUrl ?? "",
      completedDate: p.completedDate ? String(p.completedDate).slice(0, 10) : "",
    });
    setMessage({ type: "", text: "" });
  }

  async function onPickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setMessage({ type: "", text: "" });
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
      setForm((f) => ({ ...f, thumbnail: d.url }));
      setMessage({ type: "ok", text: "Image uploaded — URL filled in below." });
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        summary: form.summary.trim() || undefined,
        thumbnail: form.thumbnail.trim() || undefined,
        tags: form.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        githubUrl: form.githubUrl.trim() || undefined,
        liveUrl: form.liveUrl.trim() || undefined,
      };
      if (form.completedDate) {
        payload.completedDate = new Date(form.completedDate).toISOString();
      }
    try {
      if (editingId) {
        const r = await fetch(`/api/admin/projects/${editingId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          throw new Error(d.error || "Could not save");
        }
      } else {
        const r = await fetch("/api/admin/projects", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          throw new Error(d.error || "Could not create");
        }
      }
      setMessage({ type: "ok", text: editingId ? "Project updated." : "Project created." });
      startNew();
      await load();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Request failed",
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this project permanently?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE", credentials: "include" });
    if (editingId === id) startNew();
    await load();
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading projects…</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Thumbnail: paste a URL or upload to Cloudinary (requires env vars).
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-sm font-semibold text-foreground">All projects</h2>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
            {list.length === 0 ? (
              <li className="p-4 text-sm text-muted-foreground">No projects yet.</li>
            ) : (
              list.map((p) => {
                const id = idStr(p);
                return (
                  <li key={id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                    <div>
                      <p className="font-medium text-foreground">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(id)}
                        className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              {editingId ? "Edit project" : "New project"}
            </h2>
            {editingId ? (
              <button
                type="button"
                onClick={startNew}
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear
              </button>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <Field label="Title" required>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </Field>
            <Field label="Slug" required>
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
              />
            </Field>
            <Field label="Summary" hint="Short line for cards">
              <input
                className={inputClass}
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              />
            </Field>
            <Field label="Description" required hint="Longer story (paragraphs OK)">
              <textarea
                className={cn(inputClass, "min-h-[120px] resize-y")}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
            </Field>
            <Field label="Thumbnail URL">
              <input
                className={inputClass}
                value={form.thumbnail}
                onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                placeholder="https://… or Cloudinary URL"
              />
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickImage}
                  disabled={uploading}
                />
                <span className="rounded-md border border-border bg-muted/50 px-2 py-1 font-medium text-foreground">
                  {uploading ? "Uploading…" : "Upload image"}
                </span>
              </label>
            </Field>
            <Field label="Tags" hint="Comma-separated">
              <input
                className={inputClass}
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="Next.js, MongoDB"
              />
            </Field>
            <Field label="Live URL">
              <input
                className={inputClass}
                value={form.liveUrl}
                onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
              />
            </Field>
            <Field label="GitHub URL">
              <input
                className={inputClass}
                value={form.githubUrl}
                onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
              />
            </Field>
            <Field label="Completed date">
              <input
                type="date"
                className={inputClass}
                value={form.completedDate}
                onChange={(e) => setForm((f) => ({ ...f, completedDate: e.target.value }))}
              />
            </Field>

            {message.text ? (
              <p
                className={cn(
                  "text-sm",
                  message.type === "ok" ? "text-green-700 dark:text-green-400" : "text-destructive",
                )}
                role={message.type === "err" ? "alert" : undefined}
              >
                {message.text}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Update project" : "Create project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {hint ? <p className="text-[0.65rem] text-muted-foreground">{hint}</p> : null}
      <div className="mt-1">{children}</div>
    </div>
  );
}
