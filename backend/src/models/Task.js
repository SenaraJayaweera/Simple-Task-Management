import mongoose from "mongoose";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "In Progress", "Completed"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [3, "Title needs at least 3 characters."],
      maxlength: [120, "Title cannot exceed 120 characters."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters."],
    },
    priority: {
      type: String,
      required: [true, "Priority is required."],
      enum: {
        values: PRIORITIES,
        message: "Priority must be one of: Low, Medium, High.",
      },
      default: "Medium",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: STATUSES,
        message: "Status must be one of: Pending, In Progress, Completed.",
      },
      default: "Pending",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required."],
    },
  },
  { timestamps: true }
);

taskSchema.index({ priority: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });

export const PRIORITY_VALUES = PRIORITIES;
export const STATUS_VALUES = STATUSES;

export default mongoose.model("Task", taskSchema);
