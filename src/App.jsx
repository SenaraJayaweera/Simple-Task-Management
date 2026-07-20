import { useMemo, useState } from "react";
import { useTasks } from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";
import FilterBar from "./components/FilterBar";
import EmptyState from "./components/EmptyState";
import { STATUSES } from "./utils/constants";

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, setStatus } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ priority: "All", status: "All", query: "" });

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.priority !== "All" && t.priority !== filters.priority) return false;
      if (filters.status !== "All" && t.status !== filters.status) return false;
      if (filters.query.trim()) {
        const q = filters.query.trim().toLowerCase();
        const haystack = `${t.title} ${t.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") return 1;
      if (b.status === "Completed" && a.status !== "Completed") return -1;
      const dateA = a.dueDate || "9999-12-31";
      const dateB = b.dueDate || "9999-12-31";
      return dateA.localeCompare(dateB);
    });
  }, [filteredTasks]);

  const counts = useMemo(() => {
    const byStatus = STATUSES.reduce((acc, s) => {
      acc[s] = tasks.filter((t) => t.status === s).length;
      return acc;
    }, {});
    return { total: tasks.length, byStatus };
  }, [tasks]);

  function openNewTaskForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function handleSubmit(data) {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setFormOpen(false);
    setEditingTask(null);
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono-tight text-xs uppercase tracking-[0.2em] text-accent">
                Task Ledger
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                What's on the board
              </h1>
            </div>
            <button
              onClick={openNewTaskForm}
              className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg hover:brightness-110 active:brightness-95 transition"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              New task
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:max-w-md">
            {STATUSES.map((s) => (
              <div key={s} className="rounded-lg border border-border bg-surface px-3 py-2.5">
                <p className="font-mono-tight text-[20px] font-semibold text-ink leading-none">
                  {counts.byStatus[s] || 0}
                </p>
                <p className="mt-1 text-[11px] font-medium text-ink-muted">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            counts={{ shown: sortedTasks.length, total: tasks.length }}
          />
        </div>

        {sortedTasks.length === 0 ? (
          <EmptyState hasAnyTasks={tasks.length > 0} onNewTask={openNewTaskForm} />
        ) : (
          <div className="flex flex-col gap-3">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditForm}
                onDelete={deleteTask}
                onStatusChange={setStatus}
              />
            ))}
          </div>
        )}
      </main>

      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        initialTask={editingTask}
      />
    </div>
  );
}
