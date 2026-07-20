import { useState } from "react";
import PriorityTag from "./PriorityTag";
import StatusControl from "./StatusControl";
import { PRIORITY_STYLES } from "../utils/constants";
import { getDueMeta } from "../utils/date";

const DUE_TONE_CLASSES = {
  danger: "text-priority-high",
  warning: "text-priority-medium",
  muted: "text-ink-muted",
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const priorityStyle = PRIORITY_STYLES[task.priority];
  const due = getDueMeta(task.dueDate, task.status);
  const isDone = task.status === "Completed";

  return (
    <div
      className={`group relative flex overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-border-soft ${
        isDone ? "opacity-70" : ""
      }`}
    >
      <div className={`w-1.5 shrink-0 ${priorityStyle.bg}`} />

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className={`font-display text-[15px] font-semibold text-ink break-words ${
                isDone ? "line-through decoration-ink-faint" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-ink-muted break-words">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              aria-label="Edit task"
              className="rounded-md p-1.5 text-ink-faint hover:bg-white/5 hover:text-ink transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11.3 2.3a1.5 1.5 0 0 1 2.1 2.1L5.8 12H3.5v-2.3z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => setConfirmingDelete(true)}
              aria-label="Delete task"
              className="rounded-md p-1.5 text-ink-faint hover:bg-priority-high-soft hover:text-priority-high transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3.5 4.5h9M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5l.5 8a1 1 0 0 0 1 .9h4a1 1 0 0 0 1-.9l.5-8"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <PriorityTag priority={task.priority} />
          <StatusControl status={task.status} onChange={(s) => onStatusChange(task.id, s)} />
          <span className={`ml-auto font-mono-tight text-xs ${DUE_TONE_CLASSES[due.tone]}`}>
            {due.label}
          </span>
        </div>
      </div>

      {confirmingDelete && (
        <div
          className="absolute inset-0 flex items-center justify-center gap-3 bg-surface/95 backdrop-blur-sm px-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="text-sm text-ink">Delete this task?</span>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-md bg-priority-high px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 transition"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmingDelete(false)}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
