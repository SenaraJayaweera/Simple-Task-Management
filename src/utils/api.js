const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks";

async function handleResponse(res) {
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Request failed with status ${res.status}`);
  }

  if (!res.ok) {
    const message =
      json?.errors?.map((e) => e.message).join(" ") ||
      json?.message ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return json;
}

// Mongo returns `_id`; the rest of the app expects `id`.
function normalizeTask(task) {
  if (!task) return task;
  const { _id, ...rest } = task;
  return { id: _id, ...rest };
}

export async function fetchTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(query ? `${API_BASE}?${query}` : API_BASE);
  const json = await handleResponse(res);
  return json.data.map(normalizeTask);
}

export async function createTask(task) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const json = await handleResponse(res);
  return normalizeTask(json.data);
}

export async function updateTaskRequest(id, updates) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const json = await handleResponse(res);
  return normalizeTask(json.data);
}

export async function updateTaskStatusRequest(id, status) {
  const res = await fetch(`${API_BASE}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const json = await handleResponse(res);
  return normalizeTask(json.data);
}

export async function deleteTaskRequest(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  await handleResponse(res);
  return id;
}
