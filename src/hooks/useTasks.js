import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTaskRequest,
  updateTaskStatusRequest,
  deleteTaskRequest,
} from "../utils/api";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTasks({ limit: 100 });
        if (!cancelled) setTasks(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function addTask(task) {
    setError(null);
    try {
      const created = await createTask(task);
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function updateTask(id, updates) {
    setError(null);
    try {
      const updated = await updateTaskRequest(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function deleteTask(id) {
    setError(null);
    try {
      await deleteTaskRequest(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function setStatus(id, status) {
    setError(null);
    try {
      const updated = await updateTaskStatusRequest(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  return { tasks, loading, error, addTask, updateTask, deleteTask, setStatus };
}
