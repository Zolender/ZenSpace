# 0014. API and data conventions

- Status: Accepted
- Date: 2026-09-28

## Context
These conventions are expensive to change once code and clients exist, especially after a
mobile app ships and old versions stay installed.

## Decision

**API**
- All routes under `/v1`.
- Errors use RFC 9457 problem details with a stable machine-readable `code`. Clients map codes
  to translated messages. The API never returns user-facing prose.
- Cursor-based pagination.
- Every request carries a request ID (generated if absent), returned in a header and included in every log line.

**Data**
- Primary keys are UUIDv7.
- Timestamps are `timestamptz`, stored in UTC. Each profile stores an IANA timezone
  (default `Africa/Kigali`). "Today", streaks, and due reviews are computed in that timezone.
- Account deletion is a hard delete of all rows and stored files, performed by a background job.

**Access**
- Every row a user owns has an `owner_id`.
- Each module exposes one policy function per resource (e.g. `canReadCourse(user, course)`).
  Endpoints never check ownership inline. Phase 4 sharing changes the policy, not the endpoints.

**Config**
- Environment variables are validated with zod at boot. Invalid config stops the process with a clear error.

**Tooling**
- Node and pnpm versions are pinned in the repo (`.nvmrc`, `engines`, `packageManager`).

## Alternatives
- **Serial integer IDs:** leak counts and are guessable in URLs.
- **Offset pagination:** slow and inconsistent on large, changing lists.
- **Per-endpoint ownership checks:** easy to forget, and hard to change for sharing.

## Consequences
- More structure up front. In exchange, versioning, i18n, and sharing don't require rewrites later.
