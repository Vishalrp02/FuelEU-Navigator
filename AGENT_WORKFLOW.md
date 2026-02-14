# Agent Workflow

## Goals
- Keep core isolated from frameworks (hexagonal)
- Validate inputs, compute CB, banking, pooling per spec
- Provide clear logs and verification steps

## Steps Used
- Plan: define tasks and todos
- Implement: ports/adapters, services, shared formulas
- Verify: typecheck, lint (no errors), tests (unit+http)
- Run: dev server, preview URL, check terminal logs

## Prompts & Logs
- Prompts describe intent and constraints
- Dev server logs: start info, errors reported as JSON with messages
- Migration logs use `console.info`

## Validation
- TypeScript strict enabled
- ESLint clean (no errors)
- Tests cover compute, services, and endpoints
- Manual smoke via OpenPreview and HTTP requests
