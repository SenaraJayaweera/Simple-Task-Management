import { useEffect, useRef, useState } from "react";
import { PRIORITIES, STATUSES } from "../utils/constants";
import { todayISO } from "../utils/date";

const emptyForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

export default function TaskForm({ open, onClose, onSubmit, initialTask }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);
  const isEdit = Boolean(initialTask);

  useEffect(() => {
    if (open) {
      setForm(
        initialTask
          ? {
              title: initialTask.title,
              description: initialTask.description || "",
              priority: initialTask.priority,
              status: initialTask.status,
              dueDate: initialTask.dueDate || "",
            }
          : emptyForm
      );
      setErrors({});
      setTimeout(() => titleRef.current?.focus(), 30);
    }
  }, [open, initialTask]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    else if (form.title.trim().length < 3)
      next.title = "Title needs at least 3 characters.";
    if (!form.description.trim()) next.description = "Description is required.";
    if (!form.priority) next.priority = "Choose a priority.";
    if (!form.dueDate) next.dueDate = "Due date is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
    });
  }

  function field(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-8 sm:py-14"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg">
        <div className="absolute -top-3 left-8 h-6 w-16 rounded-t-md bg-accent" />
        <form
          onSubmit={handleSubmit}
          noValidate
          className="relative rounded-xl border border-border bg-surface-raised shadow-2xl shadow-black/40"
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              {isEdit ? "Edit task" : "New task"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Title
              </label>
              <input
                ref={titleRef}
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => field("title", e.target.value)}
                placeholder="e.g. Prepare investor update"
                className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-shadow ${
                  errors.title
                    ? "border-priority-high focus:ring-priority-high/40"
                    : "border-border focus:ring-accent/40"
                }`}
              />
              {errors.title && <p className="mt-1.5 text-xs text-priority-high">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => field("description", e.target.value)}
                placeholder="What needs to happen, and any context worth remembering."
                className={`w-full resize-none rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 transition-shadow ${
                  errors.description
                    ? "border-priority-high focus:ring-priority-high/40"
                    : "border-border focus:ring-accent/40"
                }`}
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-priority-high">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Priority
                </label>
                <select
                  id="priority"
                  value={form.priority}
                  onChange={(e) => field("priority", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Due date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  min={isEdit ? undefined : todayISO()}
                  value={form.dueDate}
                  onChange={(e) => field("dueDate", e.target.value)}
                  className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 transition-shadow [color-scheme:dark] ${
                    errors.dueDate
                      ? "border-priority-high focus:ring-priority-high/40"
                      : "border-border focus:ring-accent/40"
                  }`}
                />
                {errors.dueDate && <p className="mt-1.5 text-xs text-priority-high">{errors.dueDate}</p>}
              </div>
            </div>

            {isEdit && (
              <div>
                <label htmlFor="status" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => field("status", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:brightness-110 active:brightness-95 transition"
            >
              {isEdit ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
