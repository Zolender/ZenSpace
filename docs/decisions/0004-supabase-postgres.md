# 0004. Supabase: Postgres, Auth, Storage, pgvector

- Status: Accepted
- Date: 2026-09-25

## Context

The data is relational (courses → documents → chunks, cards → reviews). We need auth that
works for web and mobile, private file storage, and vector search over slide text.

## Decision

Supabase for Postgres, Auth (Google + email link), and Storage. pgvector in the same database
for embeddings. The API verifies Supabase JWTs. Clients never query tables directly.

## Alternatives

- **Firebase:** document model fits relational data poorly, and read-based pricing grows fast.
- **Separate vector database:** another service to run and pay for, with no benefit at our scale.
- **Self-hosted Postgres:** more ops work now. Still possible later, because Postgres is portable.

## Consequences

- The free tier pauses inactive projects and has limited backups, so we add our own daily
  backup before beta data exists.
- Region choice depends on the data-protection check (product open question #7).
