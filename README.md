# Fuel EU Compliance Dashboard

## Overview
- Hexagonal backend with inbound HTTP adapters and outbound repos
- Frontend React app served by Vite with Express mounted under /api
- Shared domain constants and formula utilities in `shared/`

## Structure
- frontend/: React UI, hooks, pages, components
- backend/: Express server, core services, ports, adapters, DB infra
- shared/: TypeScript DTOs, constants, compute helpers

## Run
- npm install
- Optional: set DATABASE_URL and run `npm run db:migrate`
- Dev: `npm run dev` (UI at http://localhost:8080, API at /api)
- Build: `npm run build` then `npm start`
- Tests: `npm test`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`

## Backend APIs
- GET /api/routes
- POST /api/routes/:id/baseline
- GET /api/routes/comparison
- GET /api/compliance/cb?shipId&year&intensity&fuel
- GET /api/compliance/adjusted-cb?shipId&year
- GET /api/compliance/adjusted-members?year
- GET /api/banking/records?shipId&year
- POST /api/banking/bank { shipId, year, amount }
- POST /api/banking/apply { shipId, year, amount }
- POST /api/pools { year, members }

## Notes
- Without DATABASE_URL, backend falls back to memory repos
- With DATABASE_URL, Postgres repos are used
