# 0005. Drizzle ORM, migrations in git

- Status: Accepted
- Date: 2026-09-25

## Context
We want a typed schema, reviewable migrations, and SQL we can reason about.

## Decision
Drizzle ORM in `packages/db`. Schema changes are migration files committed to git and applied
by CI. No schema edits in dashboards.

## Alternatives
- **Prisma:** popular with NestJS, but heavier runtime and less control over SQL.
- **Supabase client only:** ties data access to Supabase and to row-level security as the main auth layer.

## Consequences
- Every environment has the same schema, and the schema's history is visible in git.
- Supabase-managed schemas (e.g. `auth`) are referenced, not owned, by our migrations.
