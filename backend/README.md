# Task Ledger — Backend

REST API for the Task Ledger app, built with Node.js, Express, and MongoDB (Mongoose).

## Stack

- Node.js + Express 5
- MongoDB + Mongoose
- express-validator for request validation
- dotenv for config, cors for cross-origin requests

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and point `MONGODB_URI` at your database — a local MongoDB instance or a MongoDB Atlas cluster both work.

```bash
# Local MongoDB must be running first, e.g.:
# mongod --dbpath /path/to/data

npm run dev      # starts on http://localhost:5000 with auto-reload
```

Optional: seed a few sample tasks

```bash
npm run seed
```

## Project structure

```
server.js                    entry point
src/
  app.js                     express app + middleware wiring
  config/db.js                mongoose connection
  models/Task.js               schema + validation
  controllers/taskController.js  route handlers
  routes/taskRoutes.js          /api/tasks routes
  middleware/validators.js       request validation rules
  middleware/errorHandler.js     404 + centralized error handling
  utils/seed.js                 sample data seeder
```

## Data model

```js
{
  title: String,        // required, 3-120 chars
  description: String,  // required, up to 2000 chars
  priority: String,     // required — "Low" | "Medium" | "High"
  status: String,       // "Pending" | "In Progress" | "Completed" (default "Pending")
  dueDate: Date,         // required
  createdAt: Date,       // auto
  updatedAt: Date        // auto
}
```

## API reference

Base URL: `http://localhost:5000/api`

All responses follow `{ success: boolean, data?, message?, errors? }`.

### Health check
`GET /health` → `{ success: true, message: "API is healthy." }`

### List tasks
`GET /tasks`

Query params (all optional):
| Param | Description |
|---|---|
| `priority` | `Low` \| `Medium` \| `High` |
| `status` | `Pending` \| `In Progress` \| `Completed` |
| `search` | matches against title or description |
| `sort` | `dueDate` (default), `-dueDate`, `createdAt`, `-createdAt` |
| `page` | default `1` |
| `limit` | default `50`, max `100` |

```
GET /api/tasks?priority=High&status=Pending&search=proposal&page=1&limit=20
```

Response:
```json
{
  "success": true,
  "count": 2,
  "total": 2,
  "page": 1,
  "totalPages": 1,
  "data": [ { "_id": "...", "title": "...", "...": "..." } ]
}
```

### Task stats
`GET /tasks/stats` → counts by status and priority, used for dashboard summaries.

### Get one task
`GET /tasks/:id`

### Create a task
`POST /tasks`
```json
{
  "title": "Draft Q3 proposal",
  "description": "Outline scope and pricing.",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2026-08-01"
}
```
`status` is optional and defaults to `Pending`. All other fields are required and validated.

### Update a task
`PUT /tasks/:id` — send any subset of `title`, `description`, `priority`, `status`, `dueDate`.

### Update only the status
`PATCH /tasks/:id/status`
```json
{ "status": "In Progress" }
```

### Delete a task
`DELETE /tasks/:id`

## Validation & error handling

- Every write is validated both at the request layer (`express-validator`) and the schema layer (Mongoose), so invalid data can't reach the database even if a request bypasses the route validators.
- Validation failures return `400` with a list of field-level messages:
  ```json
  { "success": false, "message": "Validation failed.", "errors": [{ "field": "title", "message": "Title needs at least 3 characters." }] }
  ```
- Unknown routes return `404`; unexpected errors return `500`. Invalid MongoDB ids return `400` rather than crashing the server.

## Connecting the React frontend

In the frontend, replace the `useTasks` localStorage hook with calls to this API (e.g. via `fetch` or `axios`) against `http://localhost:5000/api/tasks`. Enable CORS is already handled server-side via the `cors` package.
