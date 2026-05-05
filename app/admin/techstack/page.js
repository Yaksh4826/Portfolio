"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground";

const CATEGORIES = ["Frontend", "Backend", "AI/ML", "Robotics", "Tools"];

function idStr(doc) {
  if (!doc?._id) return "";
  return typeof doc._id === "string" ? doc._id : doc._id.toString?.() ?? String(doc._id);
}

const empty = { name: "", category: "Frontend", icon: "" };

export default function AdminTechStackPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch("/api/techstacks");
    const d = await r.json();
    setList(Array.isArray(d.techstack) ? d.techstack : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startNew() {
    setEditingId(null);
    setForm(empty);
    setMsg({ type: "", text: "" });
  }

  function startEdit(row) {
    setEditingId(idStr(row));
    setForm({
      name: row.name ?? "",
      category: row.category ?? "Frontend",
      icon: row.icon ?? "",
    });
    setMsg({ type: "", text: "" });
  }

  async function onPickIcon(e) {
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
      setForm((f) => ({ ...f, icon: d.url }));
      setMsg({ type: "ok", text: "Icon uploaded to Cloudinary." });
    } catch (err) {
      setMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const iconUrl = form.icon.trim();
    if (!iconUrl) {
      setMsg({ type: "err", text: "Upload an icon image (Cloudinary)." });
      return;
    }
    setBusy(true);
    setMsg({ type: "", text: "" });
    const body = {
      name: form.name.trim(),
      category: form.category,
      icon: iconUrl,
    };
    try {
      if (editingId) {
        const r = await fetch(`/api/admin/techstack/${editingId}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || d.message || "Update failed");
      } else {
        const r = await fetch("/api/admin/techstack", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || d.message || "Create failed");
      }
      setMsg({ type: "ok", text: "Saved." });
      startNew();
      await load();
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Failed" });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/admin/techstack/${id}`, { method: "DELETE", credentials: "include" });
    if (editingId === id) startNew();
    await load();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tech stack</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Icons are uploaded to Cloudinary (same as project images). PNG or SVG recommended.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="text-sm font-semibold">Skills</h2>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
            {list.length === 0 ? (
              <li className="p-4 text-sm text-muted-foreground">No items.</li>
            ) : (
              list.map((row) => {
                const id = idStr(row);
                return (
                  <li key={id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {row.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin preview, any host
                        <img
                          src={row.icon}
                          alt=""
                          className="size-10 shrink-0 rounded-lg border border-border bg-muted/30 object-contain p-1"
                        />
                      ) : (
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                          —
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{row.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{row.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(id)}
                        className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
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

        <form
          onSubmit={onSubmit}
          className="h-fit space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold">{editingId ? "Edit skill" : "New skill"}</h2>
          {editingId ? (
            <button type="button" onClick={startNew} className="text-xs text-primary hover:underline">
              Clear
            </button>
          ) : null}
          <Field label="Name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </Field>
          <Field label="Category">
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Icon">
            <div className="mt-1 flex flex-wrap items-center gap-3">
              {form.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.icon}
                  alt=""
                  className="size-14 rounded-lg border border-border bg-muted/30 object-contain p-1"
                />
              ) : (
                <span className="flex size-14 items-center justify-center rounded-lg border border-dashed border-border text-[10px] text-muted-foreground">
                  No file
                </span>
              )}
              <div className="flex flex-col gap-2">
                <label className="inline-flex w-fit cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPickIcon}
                    disabled={uploading || busy}
                  />
                  <span
                    className={cn(
                      "rounded-md border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground",
                      (uploading || busy) && "pointer-events-none opacity-50",
                    )}
                  >
                    {uploading ? "Uploading…" : "Upload to Cloudinary"}
                  </span>
                </label>
                {form.icon ? (
                  <button
                    type="button"
                    className="w-fit text-xs text-destructive hover:underline"
                    onClick={() => setForm((f) => ({ ...f, icon: "" }))}
                    disabled={busy || uploading}
                  >
                    Remove icon
                  </button>
                ) : null}
              </div>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Saved value is the Cloudinary URL returned after upload.
            </p>
          </Field>
          {msg.text ? (
            <p className={cn("text-sm", msg.type === "ok" ? "text-green-600" : "text-destructive")}>
              {msg.text}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Saving…" : editingId ? "Update" : "Add skill"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}
