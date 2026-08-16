# Adama City CCTV Registration and GIS System

Full-stack application scaffold: an Express backend and a React + Vite frontend for CCTV registration, incident reporting, and GIS integrations.

**Repository structure**
- backend/: Express API, migrations, models, and routes
  - config/: DB helpers ([config/database.js](backend/config/database.js))
  - controllers/: route handlers
  - middleware/: express middleware (error handler, auth)
  - migrations/: SQL migrations
  - models/: DB models
  - routes/: API routes
  - server.js: app entrypoint
  - package.json
  - .env.example
- frontend/: React + Vite client
  - index.html
  - src/: React sources
  - vite.config.js
  - package.json

## Quick start (Docker)
1. Install Docker Desktop and enable WSL2 on Windows.
2. From repository root:

```bash
docker compose up --build -d
```

3. Apply migrations (run inside backend container):

```bash
docker compose exec backend sh -c "DATABASE_URL=postgres://postgres:postgres@db:5433/adama_cctv node migrate.js"
```

4. Open the app endpoints:

- Backend health: http://localhost:5000/api/health
- Frontend (Vite): http://localhost:5173

## Local development (no Docker)

Backend:

```bash
cd backend
npm install
# copy .env.example to .env and edit DATABASE_URL
cp .env.example .env
npm run migrate
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Notes & improvements made
- Added `backend/.env.example` to simplify local env setup.
- Centralized Express error handler in `backend/middleware/errorHandler.js` and improved `server.js` startup flow.
- `backend/config/database.js` already contains safe DB creation and migration helpers.

If you'd like, I can:
- Add authentication middleware and JWT support.
- Harden CORS and rate-limiting for production.
- Create minimal frontend pages for Camera registration and incident reporting.

Tell me which improvements you'd like next.