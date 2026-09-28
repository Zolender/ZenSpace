# 0010. Vercel (web) + Railway (API, worker, Redis)

- Status: Accepted
- Date: 2026-09-25

## Context

The web app is Next.js, and the API and worker are long-running Node processes needing Redis.

## Decision

Web on Vercel (preview per PR). API, worker, and Redis on Railway as Docker containers.
Supabase for data. All server components in the same region.

## Alternatives

- **Everything on one VPS:** cheapest, but we'd own patching, TLS, and deploys.
- **Fly.io / Render:** comparable. Railway chosen for its simple PR environments.

## Consequences

- Vercel's free plan is non-commercial, so we upgrade before charging users.
- Region is EU for now and revisited after the Rwanda data-protection check.
- Dockerfiles keep the API portable between hosts.
