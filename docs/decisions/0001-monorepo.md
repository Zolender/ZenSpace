# 0001. Monorepo with pnpm workspaces + Turborepo

- Status: Accepted
- Date: 2026-09-25

## Context

We will have a web app, an API, a worker, and later a mobile app and possibly a Python
service. They share types, validation schemas, and design tokens. The owner wants frontend
and backend in separate folders within one repository.

## Decision

One repository. `apps/` for deployables, `packages/` for shared code, `services/` for
non-TypeScript services. pnpm workspaces for dependencies, Turborepo for builds and caching.

## Alternatives

- **Separate repos per app:** shared code would need publishing and versioning. Too much overhead for one person.
- **Nx:** more powerful, but heavier and more to learn than we need.

## Consequences

- A change to a shared schema and every place that uses it lands in one PR.
- CI must only build and test what changed (Turborepo handles this).
- Python services sit outside Turborepo's graph and need their own CI job.
