# Decision records

One file per significant decision: what we chose, what else we considered, and why.
When a decision changes, add a new record that supersedes the old one. Don't rewrite history.

| # | Decision | Status |
|---|---|---|
| [0001](0001-monorepo.md) | Monorepo with pnpm workspaces + Turborepo | Accepted |
| [0002](0002-nestjs-modular-monolith.md) | NestJS API as a modular monolith | Accepted |
| [0003](0003-nextjs-frontend-only.md) | Next.js as a frontend-only web app | Accepted |
| [0004](0004-supabase-postgres.md) | Supabase: Postgres, Auth, Storage, pgvector | Accepted |
| [0005](0005-drizzle-migrations.md) | Drizzle ORM, migrations in git | Accepted |
| [0006](0006-zod-contracts-openapi.md) | zod contracts + OpenAPI, not tRPC | Accepted |
| [0007](0007-bullmq-background-jobs.md) | BullMQ + Redis for background jobs | Accepted |
| [0008](0008-provider-agnostic-ai.md) | Provider-agnostic AI layer, chosen by bake-off | Accepted |
| [0009](0009-testing-strategy.md) | TDD with per-layer coverage gates | Accepted |
| [0010](0010-hosting.md) | Vercel (web) + Railway (API, worker, Redis) | Accepted |
| [0011](0011-fsrs-exam-aware.md) | FSRS with exam-aware adjustment | Accepted |
| [0012](0012-name-carrel.md) | Product name: Carrel | Accepted |
| [0013](0013-docker-and-environments.md) | Docker usage and environments | Accepted |
| [0014](0014-api-and-data-conventions.md) | API and data conventions | Accepted |
| [0015](0015-domains-and-auth.md) | Domains and authentication flow | Accepted |

## Template

```md
# NNNN. Title

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD

## Context
What problem or force makes this decision necessary.

## Decision
What we chose.

## Alternatives
What else we considered and why not.

## Consequences
What gets easier, what gets harder, what we must watch.
```
