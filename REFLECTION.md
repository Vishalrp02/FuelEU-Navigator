# Reflection

## Rationale
- Restructured to `/frontend` and `/backend` to align responsibilities
- Kept shared DTOs and compute helpers in `shared/` for type-safe integration
- Enabled TypeScript strict and ESLint to improve correctness and maintainability

## Lessons
- Vite dev paths must match folder changes (index.html entry)
- Strict typing surfaces hidden issues (any, type-only imports)
- Clear adapter boundaries simplify switching between Postgres and memory repos

## Next
- Add runtime schema validation for inbound HTTP via zod
- Expand tests on pooling edge cases and banking operations
