# 0007. BullMQ + Redis for background jobs

- Status: Accepted
- Date: 2026-09-25

## Context

Document processing, question extraction, and flashcard generation take seconds to minutes.
They must not block user requests.

## Decision

BullMQ on Redis. The API enqueues jobs, and the worker (same codebase, `worker.ts`) processes
them. Jobs are idempotent and retried with backoff. Job status is reflected on the related row
(e.g. `documents.status`).

## Alternatives

- **Managed job services (Trigger.dev, Inngest):** a good fit for serverless. Unnecessary now
  that the API is a long-lived server.
- **pg-boss (Postgres queue):** one less service, but weaker NestJS integration and tooling.

## Consequences

- Redis is one more service to run (Railway).
- BullMQ has a Python client, so a Python worker (`services/ingest-py`) can consume the same queues.
