export function formatDueDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDueMeta(dateStr, status) {
  if (!dateStr) return { label: "No due date", tone: "muted" };
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (status === "Completed") {
    return { label: formatDueDate(dateStr), tone: "muted" };
  }
  if (diffDays < 0) {
    return { label: `Overdue \u00b7 ${formatDueDate(dateStr)}`, tone: "danger" };
  }
  if (diffDays === 0) {
    return { label: "Due today", tone: "warning" };
  }
  if (diffDays === 1) {
    return { label: "Due tomorrow", tone: "warning" };
  }
  return { label: formatDueDate(dateStr), tone: "muted" };
}

export function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}