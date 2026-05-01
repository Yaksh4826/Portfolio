"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground";

function idStr(doc) {
  if (!doc?._id) return "";
  return typeof doc._id === "string" ? doc._id : doc._id.toString?.() ?? String(doc._id);
}

const empty = {
  company: "",
  role: "",
  location: "",
  duration: "",
  descriptionText: "",
  technologiesText: "",
};

function linesToDesc(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function AdminExperiencePage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/experiences", { credentials: "include" });
    const d = await r.json();
    setList(Array.isArray(d.experiences) ? d.experiences : []);
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
    const desc = Array.isArray(row.description) ? row.description.join("\n") : "";
    const tech = Array.isArray(row.technologies) ? row.technologies.join(", ") : "";
    setForm({
      company: row.company ?? "",
      role: row.role ?? "",
      location: row.location ?? "",
      duration: row.duration ?? "",
      descriptionText: desc,
      technologiesText: tech,
    });
    setMsg({ type: "", text: "" });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    const body = {
      company: form.company.trim(),
      role: form.role.trim(),
      location: form.location.trim() || undefined,
      duration: form.duration.trim() || undefined,
      description: linesToDesc(form.descriptionText),
      technologies: form.technologiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        const r = await fetch(`/api/admin/experiences/${editingId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Update failed");
      } else {
        const r = await fetch("/api/admin/experiences", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Create failed");
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
    if (!confirm("Delete this experience?")) return;
    await fetch(`/api/admin/experiences/${id}`, { method: "DELETE", credentials: "include" });
    if (editingId === id) startNew();
    await load();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Experience</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Each bullet is one line under Description. Tags are comma-separated.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-sm font-semibold">Entries</h2>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
            {list.length === 0 ? (
              <li className="p-4 text-sm text-muted-foreground">No experience rows.</li>
            ) : (
              list.map((row) => {
                const id = idStr(row);
                return (
                  <li key={id} className="flex flex-wrap items-start justify-between gap-2 p-4">
                    <div>
                      <p className="font-medium text-foreground">{row.role}</p>
                      <p className="text-sm text-muted-foreground">{row.company}</p>
                      <p className="text-xs text-muted-foreground">{row.duration}</p>
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
          <h2 className="text-sm font-semibold">{editingId ? "Edit entry" : "New entry"}</h2>
          {editingId ? (
            <button type="button" onClick={startNew} className="text-xs text-primary hover:underline">
              Clear
            </button>
          ) : null}
          <Field label="Role" required>
            <input
              className={inputClass}
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              required
            />
          </Field>
          <Field label="Company" required>
            <input
              className={inputClass}
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              required
            />
          </Field>
          <Field label="Location">
            <input
              className={inputClass}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </Field>
          <Field label="Duration" hint='e.g. "Jan 2024 – Present"'>
            <input
              className={inputClass}
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            />
          </Field>
          <Field label="Description bullets" hint="One line per bullet">
            <textarea
              className={cn(inputClass, "min-h-[100px] resize-y")}
              value={form.descriptionText}
              onChange={(e) => setForm((f) => ({ ...f, descriptionText: e.target.value }))}
            />
          </Field>
          <Field label="Technologies" hint="Comma-separated">
            <input
              className={inputClass}
              value={form.technologiesText}
              onChange={(e) => setForm((f) => ({ ...f, technologiesText: e.target.value }))}
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
            {busy ? "Saving…" : editingId ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <div>
      <label className="text-xs font-medium">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {hint ? <p className="text-[0.65rem] text-muted-foreground">{hint}</p> : null}
      {children}
    </div>
  );
}
