# MyTutor

MyTutor is a study helper for years 1-12. Students upload a photo of a problem along with a
description, and MyTutor explains where they went wrong and how to approach it — with the
final answer revealed last.

## Structure

```
MyTutor/
├── backend/    Rust + Axum API server (Claude API integration)
└── frontend/   React + TypeScript app (Vite)
```

- **Backend**: Rust + Axum, calls the Claude API for problem analysis, falls back to local
  rule-based feedback if no API key is configured.
- **Frontend**: React + TypeScript (Vite), calls the backend's `/api/tutor` endpoint.

## Running locally

### 1) Configure the Claude API key

```bash
cp backend/.env.example backend/.env
# then edit backend/.env and set ANTHROPIC_API_KEY
```

### 2) Start the backend

```bash
cd backend
cargo run
```

The API server runs on `http://127.0.0.1:3000`.

### 3) Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).
