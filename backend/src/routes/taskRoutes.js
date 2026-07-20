import { Router } from "express";
import {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";
import {
  validateCreateTask,
  validateUpdateTask,
  validateStatusUpdate,
  validateMongoId,
  validateTaskQuery,
} from "../middleware/validators.js";

const router = Router();

router.get("/stats", getTaskStats);
router.get("/", validateTaskQuery, getTasks);
router.get("/:id", validateMongoId, getTaskById);
router.post("/", validateCreateTask, createTask);
router.put("/:id", validateMongoId, validateUpdateTask, updateTask);
router.patch("/:id/status", validateMongoId, validateStatusUpdate, updateTaskStatus);
router.delete("/:id", validateMongoId, deleteTask);

export default router;
