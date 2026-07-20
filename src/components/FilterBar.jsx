import { PRIORITIES, STATUSES } from "../utils/constants";

export default function FilterBar({ filters, onChange, counts }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  const hasActiveFilters =
    filters.priority !== "All" || filters.status !== "All" || filters.query.trim() !== "";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3.5 sm:flex-row sm:items-center">
      <div className="relative flex-1 min-w-[180px]">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M13 13L10.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={filters.query}
          onChange={(e) => set("query", e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SelectPill
          label="Priority"
          value={filters.priority}
          options={["All", ...PRIORITIES]}
          onChange={(v) => set("priority", v)}
        />
        <SelectPill
          label="Status"
          value={filters.status}
          options={["All", ...STATUSES]}
          onChange={(v) => set("status", v)}
        />

        {hasActiveFilters && (
          <button
            onClick={() => onChange({ priority: "All", status: "All", query: "" })}
            className="rounded-lg px-3 py-2 text-xs font-medium text-ink-muted hover:text-accent transition-colors"
          >
            Clear filters
          </button>
        )}

        <span className="ml-1 whitespace-nowrap font-mono-tight text-xs text-ink-faint">
          {counts.shown} of {counts.total}
        </span>
      </div>
    </div>
  );
}

function SelectPill({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none cursor-pointer rounded-lg border border-border bg-bg py-2 pl-3 pr-8 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "All" ? `${label}: All` : o}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-ink-faint"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
