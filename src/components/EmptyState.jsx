export default function EmptyState({ hasAnyTasks, onNewTask }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center px-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-raised border border-border">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5v-9Z"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-ink-faint"
          />
          <path d="M7 10h6M7 7h6M7 13h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-ink-faint" />
        </svg>
      </div>
      <h3 className="font-display text-base font-semibold text-ink">
        {hasAnyTasks ? "No tasks match these filters" : "Your ledger is empty"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-muted">
        {hasAnyTasks
          ? "Try widening your search or clearing a filter."
          : "Add your first task to start tracking what's due, in progress, and done."}
      </p>
      {!hasAnyTasks && (
        <button
          onClick={onNewTask}
          className="mt-5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:brightness-110 transition"
        >
          Add a task
        </button>
      )}
    </div>
  );
}
