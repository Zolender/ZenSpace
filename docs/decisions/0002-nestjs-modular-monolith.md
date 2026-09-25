# 0002. NestJS API as a modular monolith

- Status: Accepted
- Date: 2026-09-25

## Context
Web and a future mobile app need one shared backend. The owner knows TypeScript and is
learning NestJS. Code is AI-written and owner-reviewed, so readability for the reviewer matters.

## Decision
A single NestJS application, split into domain modules (`identity`, `courses`, `documents`,
`tutor`, `practice`, `review`, `notes`, `planning`, `progress`, `usage`). Each module has
`domain/`, `application/`, `infrastructure/`, `http/` and a public `index.ts`. The worker is
a second entry point of the same app.

## Alternatives
- **Hono / Fastify:** lighter and faster, but no built-in structure. We'd have to invent it.
- **FastAPI (Python):** best AI/PDF ecosystem, but two languages from day one and no shared types.
- **Microservices:** operational cost far beyond what a part-time team can carry.

## Consequences
- One deployable, one database, simple transactions.
- Module boundaries are enforced by tooling (dependency-cruiser) so a module can be
  extracted into its own service later if needed.
- NestJS's default DTO classes can't be shared with frontends. Solved by 0006.
