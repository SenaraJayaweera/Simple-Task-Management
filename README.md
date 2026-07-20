# Task Ledger

A simple task manager: React (Vite) frontend + Express/MongoDB REST API.

<img width="1917" height="876" alt="Screenshot 2026-07-20 152047" src="https://github.com/user-attachments/assets/19ff52d4-e7b8-4db6-93dc-152924a39798" />


<img width="1917" height="870" alt="Screenshot 2026-07-20 152027" src="https://github.com/user-attachments/assets/89080b93-9a97-4576-b7a9-7ff56db9948f" />



## Features

- Create, edit, delete tasks
- Filter by priority / status, and search by title or description
- Inline status updates (Pending / In Progress / Completed)
- Task stats (counts by status)
- Persisted in MongoDB via a REST API

## Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | React, Vite, Tailwind CSS |
| Backend  | Node.js, Express 5, Mongoose |
| Database | MongoDB |
| Validation | express-validator |

## Project structure

```
.
├── backend/                  # Express + MongoDB API
│   ├── server.js             # entry point
│   └── src/
│       ├── config/db.js      # Mongo connection
│       ├── controllers/      # route handlers
│       ├── middleware/       # validation, error handling
│       ├── models/Task.js    # Mongoose schema
│       ├── routes/           # /api/tasks routes
│       └── utils/seed.js     # optional sample data
│
├── src/                       # React frontend
│   ├── components/            # TaskForm, TaskCard, FilterBar, etc.
│   ├── hooks/useTasks.js       # data layer — talks to the API
│   └── utils/
│       ├── api.js               # fetch wrapper for the tasks API
│       └── date.js               # due-date formatting/parsing
├── public/
├── index.html
├── vite.config.js
└── package.json                # frontend package.json (root of the repo)
```

## Prerequisites

- Node.js 18+
- A running MongoDB instance (local, Docker, or Atlas)

## Getting started

### 1. Clone the repo

```bash
git clone <this-repo-url>
cd task-manager
```

### 2. Backend setup

From the repo root:

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/task-ledger
PORT=5000
NODE_ENV=development
```

Start the API:

```bash
npm run dev        # nodemon, auto-restarts on changes
# or
npm start           # plain node
```

Verify it's running:

```bash
curl http://localhost:5000/api/health
# {"success":true,"message":"API is healthy."}
```

Optional — seed sample tasks:

```bash
npm run seed
```

### 3. Frontend setup

From the repo root (in a separate terminal, alongside the running backend):

```bash
npm install
```

By default the frontend calls `http://localhost:5000/api/tasks`. To override, create
a `.env` file at the repo root:

```env
VITE_API_URL=http://localhost:5000/api/tasks
```

Start the dev server:

```bash
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

## API reference

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint         | Description                          |
|--------|------------------|---------------------------------------|
| GET    | `/`              | List tasks (supports `priority`, `status`, `search`, `sort`, `page`, `limit`) |
| GET    | `/stats`         | Task counts by status/priority        |
| GET    | `/:id`           | Get a single task                     |
| POST   | `/`              | Create a task                         |
| PUT    | `/:id`           | Update a task                         |
| PATCH  | `/:id/status`    | Update only a task's status           |
| DELETE | `/:id`           | Delete a task                         |

