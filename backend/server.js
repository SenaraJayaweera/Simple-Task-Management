import dotenv from "dotenv";
dotenv.config({ quiet: true });

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Task Ledger API running on http://localhost:${PORT}`);
  });
}

start();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err.message);
  process.exit(1);
});
