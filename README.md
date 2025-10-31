# Agri-Link

A full‑stack crop aggregation platform where farmers collaborate to meet order demands.

- Frontend: Next.js (App Router), React, TailwindCSS, shadcn/ui (optional), lucide-react
- Backend: Flask, Flask‑RESTful, SQLAlchemy
- Database: PostgreSQL (Render) in production, SQLite in local dev fallback
- Deployment: Frontend on Vercel, Backend on Render

## Monorepo structure

- agri-link-frontend/ — Next.js app (App Router)
- agri-link-backend/ — Flask API

## Key features

- Orders listing with client‑side pagination
- Collaboration Hub with Active/Inactive filtering
- Collaboration details with contribution form hidden at 100%
- Offers creation and immediate display
- AI Assistant chat powered by OpenAI (via backend proxy)

## URLs and routes

Frontend (examples):
- /farmer/dashboard/orders — Orders list
- /farmer/dashboard/collaborations — Collaboration Hub
- /farmer/dashboard/collaborations/[id] — Collaboration details
- /farmer/dashboard/assistant — AI Assistant

Backend API (examples):
- GET /offers
- POST /api/collaborations
- GET /api/collaborations
- GET /api/collaborations/:id
- POST /api/collaborations/:id/contributions
- POST /ai/chat
- GET / — Health text: "Welcome to Agri Link Backend APIs"

## Environment variables

Frontend (Next.js):
- NEXT_PUBLIC_API — Base URL of the backend API (e.g., https://agri-link-project1.onrender.com)
- NEXT_PUBLIC_FALLBACK_FARMER_ID — Optional numeric id for example data

Backend (Flask):
- DATABASE_URL — PostgreSQL connection string (postgresql://…)
- ALLOWED_ORIGINS — Comma‑separated list of exact origins allowed by CORS (e.g., https://your-vercel.vercel.app,http://localhost:3000)
- OPENAI_API_KEY — Required to enable /ai/chat
- SECRET_KEY — Recommended for Flask sessions
- DB_PATH, FALLBACK_DB_PATH — Optional for local SQLite

## Local development

Prereqs: Node 18+, Python 3.10+, npm, pip, virtualenv

1) Backend
- cd agri-link-backend
- python -m venv venv && source venv/bin/activate
- pip install -r requirements.txt
- Create .env (not committed):
  OPENAI_API_KEY=your_key
  # SECRET_KEY=your_secret
  # DATABASE_URL=postgresql://…  (omit to use local SQLite)
- Run: python app.py (or flask run)
- Visit: http://127.0.0.1:5555/

2) Frontend
- cd agri-link-frontend
- npm install
- Create .env.local (not committed):
  NEXT_PUBLIC_API=http://127.0.0.1:5555
  # NEXT_PUBLIC_FALLBACK_FARMER_ID=1
- npm run dev
- Visit: http://localhost:3000

## Production deployment

Backend (Render):
- Root Directory: agri-link-backend/
- Procfile provided: web: gunicorn app:app --bind 0.0.0.0:$PORT
- Environment variables:
  - DATABASE_URL (or attach Render PostgreSQL)
  - ALLOWED_ORIGINS=https://<your-vercel>.vercel.app,http://localhost:3000
  - OPENAI_API_KEY
  - SECRET_KEY (recommended)
- Health: GET /

Frontend (Vercel):
- Root Directory: agri-link-frontend/
- Build Command: next build
- Output Directory: .next
- Environment variables:
  - NEXT_PUBLIC_API=https://<your-render>.onrender.com
- Redeploy after changing env vars (NEXT_PUBLIC_* are baked at build time)

## CORS and credentials

- The frontend uses credentials: "include" in fetch by default.
- Backend must respond with a specific Access-Control-Allow-Origin (no "*") and set Access-Control-Allow-Credentials: true.
- Ensure ALLOWED_ORIGINS exactly matches your frontend origin (no trailing slash).

## Active vs Inactive (Collaborations)

- Active: overall progress < 100%
- Inactive: overall progress >= 100%
- Progress = min(100, round(sum(contributed_weight)/sum(weight_demand) * 100)) across all crops in a collaboration.
- On inactive details pages, the contribution form is hidden and an info note is shown.

## Common troubleshooting

- Failed to fetch on frontend
  - NEXT_PUBLIC_API not set or incorrect
  - Backend CORS missing your origin in ALLOWED_ORIGINS
  - Redeploy both after env changes

- AI Assistant: "api_key must be set" / "Server missing OPENAI_API_KEY"
  - Set OPENAI_API_KEY on Render, save, redeploy
  - Test: curl -X POST https://<render>/ai/chat -H "Content-Type: application/json" -d '{"message":"Hello"}'

- Hydration mismatch warning
  - Often from extensions injecting attributes; optionally add suppressHydrationWarning on <html>
  - Avoid Date.now()/new Date()/Math.random() during SSR renders; move to useEffect

- Next.js build error: useSearchParams needs Suspense
  - Wrap client component usage under <Suspense> or avoid useSearchParams during prerender

- Type option error: Invalid value for '--ignoreDeprecations'
  - Remove ignoreDeprecations from tsconfig/jsconfig

## API quick tests

Offers
```
curl -sS https://<render>/offers
```

AI Chat
```
curl -sS -X POST https://<render>/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

## License

MIT PNM
