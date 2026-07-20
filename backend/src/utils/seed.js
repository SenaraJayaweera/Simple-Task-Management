import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { connectDB } from "../config/db.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

function daysFromNow(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

const sampleTasks = [
  {
    title: "Draft Q3 client proposal",
    description: "Outline scope, timeline, and pricing for the Nexora renewal.",
    priority: "High",
    status: "In Progress",
    dueDate: daysFromNow(2),
  },
  {
    title: "Review pull request #482",
    description: "Check the auth refactor for edge cases before merging.",
    priority: "Medium",
    status: "Pending",
    dueDate: daysFromNow(0),
  },
  {
    title: "Update onboarding docs",
    description: "Refresh screenshots and add the new SSO setup steps.",
    priority: "Low",
    status: "Completed",
    dueDate: daysFromNow(-3),
  },
];

async function seed() {
  await connectDB();
  await Task.deleteMany({});
  await Task.insertMany(sampleTasks);
  console.log(`Seeded ${sampleTasks.length} tasks.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
