import Task from "../models/Task.js";
import { asyncHandler } from "../middleware/errorHandler.js";

function notFoundError(id) {
  const err = new Error(`Task not found with id ${id}.`);
  err.statusCode = 404;
  return err;
}

// GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const { priority, status, search, sort = "dueDate", page = 1, limit = 50 } = req.query;

  const filter = {};
  if (priority) filter.priority = priority;
  if (status) filter.status = status;
  if (search) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(limitNum),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    data: tasks,
  });
});

// GET /api/tasks/stats
export const getTaskStats = asyncHandler(async (req, res) => {
  const [byStatus, byPriority, total] = await Promise.all([
    Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
    Task.countDocuments(),
  ]);

  const toMap = (arr) => arr.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});

  res.status(200).json({
    success: true,
    data: {
      total,
      byStatus: toMap(byStatus),
      byPriority: toMap(byPriority),
    },
  });
});

// GET /api/tasks/:id
export const getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(notFoundError(req.params.id));
  res.status(200).json({ success: true, data: task });
});

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;
  const task = await Task.create({ title, description, priority, status, dueDate });
  res.status(201).json({ success: true, data: task });
});

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res, next) => {
  const allowed = ["title", "description", "priority", "status", "dueDate"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key))
  );

  const task = await Task.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
    context: "query",
  });

  if (!task) return next(notFoundError(req.params.id));
  res.status(200).json({ success: true, data: task });
});

// PATCH /api/tasks/:id/status
export const updateTaskStatus = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true, context: "query" }
  );

  if (!task) return next(notFoundError(req.params.id));
  res.status(200).json({ success: true, data: task });
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return next(notFoundError(req.params.id));
  res.status(200).json({ success: true, data: { id: req.params.id } });
});
