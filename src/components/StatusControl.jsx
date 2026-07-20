import { STATUS_STYLES, STATUSES } from "../utils/constants";

export default function StatusControl({ status, onChange }) {
  const style = STATUS_STYLES[status];
  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Update task status"
        className={`appearance-none cursor-pointer rounded-md border border-border-soft ${style.soft} ${style.text} py-1.5 pl-3 pr-7 text-xs font-semibold font-mono-tight uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-accent/50`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="bg-surface-raised text-ink">
            {s}
          </option>
        ))}
      </select>
      <svg
        className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 ${style.text}`}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
