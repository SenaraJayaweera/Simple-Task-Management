export const PRIORITIES = ["Low", "Medium", "High"];

export const STATUSES = ["Pending", "In Progress", "Completed"];

export const PRIORITY_STYLES = {
  High: {
    text: "text-priority-high",
    bg: "bg-priority-high",
    soft: "bg-priority-high-soft",
    ring: "ring-priority-high/40",
  },
  Medium: {
    text: "text-priority-medium",
    bg: "bg-priority-medium",
    soft: "bg-priority-medium-soft",
    ring: "ring-priority-medium/40",
  },
  Low: {
    text: "text-priority-low",
    bg: "bg-priority-low",
    soft: "bg-priority-low-soft",
    ring: "ring-priority-low/40",
  },
};

export const STATUS_STYLES = {
  Pending: {
    text: "text-status-pending",
    bg: "bg-status-pending",
    soft: "bg-status-pending-soft",
  },
  "In Progress": {
    text: "text-status-progress",
    bg: "bg-status-progress",
    soft: "bg-status-progress-soft",
  },
  Completed: {
    text: "text-status-completed",
    bg: "bg-status-completed",
    soft: "bg-status-completed-soft",
  },
};

export const STORAGE_KEY = "ledger.tasks.v1";
