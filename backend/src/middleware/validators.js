import { body, param, query, validationResult } from "express-validator";
import { PRIORITY_VALUES, STATUS_VALUES } from "../models/Task.js";

export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

export const validateCreateTask = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters."),
  body("priority")
    .notEmpty()
    .withMessage("Priority is required.")
    .isIn(PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${PRIORITY_VALUES.join(", ")}.`),
  body("status")
    .optional()
    .isIn(STATUS_VALUES)
    .withMessage(`Status must be one of: ${STATUS_VALUES.join(", ")}.`),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required.")
    .isISO8601()
    .withMessage("Due date must be a valid date."),
  handleValidation,
];

export const validateUpdateTask = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters."),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty.")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters."),
  body("priority")
    .optional()
    .isIn(PRIORITY_VALUES)
    .withMessage(`Priority must be one of: ${PRIORITY_VALUES.join(", ")}.`),
  body("status")
    .optional()
    .isIn(STATUS_VALUES)
    .withMessage(`Status must be one of: ${STATUS_VALUES.join(", ")}.`),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date."),
  handleValidation,
];

export const validateStatusUpdate = [
  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(STATUS_VALUES)
    .withMessage(`Status must be one of: ${STATUS_VALUES.join(", ")}.`),
  handleValidation,
];

export const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid task id."),
  handleValidation,
];

export const validateTaskQuery = [
  query("priority").optional().isIn(PRIORITY_VALUES).withMessage("Invalid priority filter."),
  query("status").optional().isIn(STATUS_VALUES).withMessage("Invalid status filter."),
  query("search").optional().trim().isLength({ max: 200 }),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be 1-100."),
  query("sort").optional().isIn(["dueDate", "-dueDate", "createdAt", "-createdAt"]),
  handleValidation,
];
