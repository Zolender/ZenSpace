# 0009. TDD with per-layer coverage gates

- Status: Accepted
- Date: 2026-09-25

## Context

The owner wants TDD and coverage visibility from the start. A single global coverage target
tends to produce tests that mirror implementation and slow down change.

## Decision

- Test-first for all logic. PRs show tests alongside the change.
- Vitest across the monorepo. Testcontainers for real Postgres and Redis. Supertest for HTTP.
  Testing Library + MSW for web. Playwright for end-to-end flows with a fake AI provider.
- Coverage collected from the first commit, reported on every PR, gated per layer:
  `domain/` and `packages/scheduling` ≥ 90%, `application/` ≥ 80%, others measured.
- Every endpoint has an authorization test proving one user can't access another's data.
- AI behaviour is tested by evals (`packages/ai/evals`), run nightly or on demand.

## Alternatives

- **Global coverage threshold:** simple, but rewards low-value tests.
- **Mocked database in tests:** fast, but hides real query and migration bugs.

## Consequences

- CI is slower because of containers, so we cache and parallelise.
- Evals cost money, so they don't run on every PR.
