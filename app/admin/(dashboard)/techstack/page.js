"use client";

import { useCallback, useEffect, useState } from "react";
import StackIcon from "tech-stack-icons";
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
  const [iconQuery, setIconQuery] = useState("");
  const [iconSuggestions, setIconSuggestions] = useState([]);
  const [iconExactMatch, setIconExactMatch] = useState(false);
  const [iconSearchLoading, setIconSearchLoading] = useState(false);
  const groupedList = CATEGORIES.map((category) => ({
    category,
    items: list
      .filter((row) => row?.category === category)
      .slice()
      .sort((a, b) => String(a?.name ?? "").localeCompare(String(b?.name ?? ""))),
  })).filter((group) => group.items.length > 0);

  const load = useCallback(async () => {
    const r = await fetch("/api/techstacks");
    const d = await r.json();
    setList(Array.isArray(d.techstack) ? d.techstack : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch updates state after network resolves
    load();
  }, [load]);

  function startNew() {
    setEditingId(null);
    setForm(empty);
    setIconQuery("");
    setIconSuggestions([]);
    setIconExactMatch(false);
    setMsg({ type: "", text: "" });
  }

  function startEdit(row) {
    setEditingId(idStr(row));
    setForm({
      name: row.name ?? "",
      category: row.category ?? "Frontend",
      icon: row.icon ?? "",
    });
    setIconQuery(row.icon ?? "");
    setMsg({ type: "", text: "" });
  }

  useEffect(() => {
    let cancelled = false;

    async function runSearch() {
      setIconSearchLoading(true);
      try {
        const q = encodeURIComponent(iconQuery);
        const res = await fetch(`/api/admin/techstack/icons?q=${q}`);
        const data = await res.json();
        if (cancelled) return;
        setIconSuggestions(Array.isArray(data.icons) ? data.icons : []);
        setIconExactMatch(Boolean(data.exactMatch));
      } catch {
        if (cancelled) return;
        setIconSuggestions([]);
        setIconExactMatch(false);
      } finally {
        if (!cancelled) setIconSearchLoading(false);
      }
    }

    runSearch();
    return () => {
      cancelled = true;
    };
  }, [iconQuery]);

  async function onSubmit(e) {
    e.preventDefault();
    const iconName = form.icon.trim().toLowerCase();
    if (!iconName) {
      setMsg({ type: "err", text: "Enter a tech-stack-icons icon key (e.g. nextjs)." });
      return;
    }
    if (!iconExactMatch) {
      setMsg({ type: "err", text: "Select a valid icon key from suggestions before saving." });
      return;
    }
    setBusy(true);
    setMsg({ type: "", text: "" });
    const body = {
      name: form.name.trim(),
      category: form.category,
      icon: iconName,
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
          Uses `tech-stack-icons` npm package. Store icon keys like `nextjs`, `react`, `mongodb`.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="text-sm font-semibold">Skills</h2>
          {list.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
              No items.
            </div>
          ) : (
            <div className="mt-3 space-y-4">
              {groupedList.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {group.category}
                  </h3>
                  <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
                    {group.items.map((row) => {
                      const id = idStr(row);
                      return (
                        <li key={id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                          <div className="flex min-w-0 items-center gap-3">
                            {row.icon ? (
                              <span className="size-10 shrink-0 rounded-lg border border-border bg-muted/30 p-1">
                                <StackIcon name={row.icon.trim().toLowerCase()} className="size-full" />
                              </span>
                            ) : (
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-foreground">{row.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{row.icon}</p>
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
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
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
            <input
              className={inputClass}
              value={iconQuery}
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                setIconQuery(value);
                setForm((f) => ({ ...f, icon: value }));
              }}
              placeholder="Search icon name (example: nextjs)"
              required
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Type to search, then click a suggestion. Only valid keys can be saved.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {iconSuggestions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    setIconQuery(icon);
                    setForm((f) => ({ ...f, icon }));
                    setIconExactMatch(true);
                  }}
                  className={cn(
                    "rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-muted",
                    form.icon === icon && "border-primary bg-primary/10 text-primary",
                  )}
                >
                  {icon}
                </button>
              ))}
              {!iconSearchLoading && iconSuggestions.length === 0 ? (
                <span className="text-[11px] text-muted-foreground">No matches found.</span>
              ) : null}
            </div>
            {iconSearchLoading ? (
              <p className="mt-1 text-[11px] text-muted-foreground">Searching icons...</p>
            ) : null}
            {iconExactMatch ? (
              <p className="mt-1 text-[11px] text-green-600">Valid icon selected.</p>
            ) : iconQuery.trim() ? (
              <p className="mt-1 text-[11px] text-destructive">Choose one of the suggested keys.</p>
            ) : null}
            {iconExactMatch && form.icon.trim() ? (
              <span className="mt-2 inline-flex size-14 items-center justify-center rounded-lg border border-border bg-muted/30 p-2">
                <StackIcon name={form.icon.trim().toLowerCase()} className="size-full" />
              </span>
            ) : null}
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
