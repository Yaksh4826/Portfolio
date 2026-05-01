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

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    const body = {
      name: form.name.trim(),
      category: form.category,
      icon: form.icon.trim(),
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
          Icon should be a URL (e.g. CDN or SVG link). Use upload elsewhere if needed.
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
                    <div>
                      <p className="font-medium text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.category} · {row.icon?.slice(0, 48)}
                        {(row.icon?.length ?? 0) > 48 ? "…" : ""}
                      </p>
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
          <Field label="Icon URL">
            <input
              className={inputClass}
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              required
            />
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
