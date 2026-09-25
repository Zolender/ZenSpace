# 0013. Docker usage and environments

- Status: Accepted
- Date: 2026-09-25

## Context
The owner's laptop is busy with other work and shouldn't be required to run the stack.
The API and worker need a portable production image. Integration tests need real Postgres and Redis.

## Decision

**Environments**
- **Preview** per PR (web on Vercel, pointing at the staging API).
- **Staging**, auto-deployed from `dev`, built in Milestone 0.
- **Production**, deployed from `main`, added before the beta.
- Hosted Supabase projects for staging and production. No local Supabase stack.
- Code is written and tested in Claude sessions and CI. The owner reviews PRs and previews in a browser.
  GitHub Codespaces is the option for hands-on coding without local setup.

**Docker**
- In dev, app code runs natively. Only dependencies (Redis) run in Docker, and even that is optional.
- Tests use Testcontainers for throwaway Postgres and Redis, in CI and in Claude sessions.
- **One image for API and worker**, started with different commands (`main.js`, `worker.js`).
- Multi-stage build: `turbo prune` to the API's dependency graph, dependencies in a cached
  layer, and a final stage with only built output and production dependencies.
- Base image `node:<LTS>-slim` (Debian). Not Alpine: PDF and image libraries are unreliable on musl.
- The image runs as a non-root user, exposes `/health`, and shuts down gracefully (the worker
  finishes or releases its current job on SIGTERM).
- Configuration comes from env vars only, and no secrets are baked into images.
- CI builds the image on every PR without deploying it.
- The web app is not containerised. Vercel builds it natively.

## Alternatives
- **Fully containerised local dev:** slow file watching and heavy on the laptop, for no gain at our size.
- **Local Supabase stack:** about a dozen containers. Too heavy for a busy laptop.
- **Self-managed VPS (e.g. with Coolify):** cheaper at scale, but we'd own patching, backups,
  and security. Docker keeps this option open.

## Consequences
- The owner needs only a browser and GitHub to work on the project day to day.
- Staging is shared, so migrations are applied only on merge to `dev`.
- Claude sessions need network access to container registries (Docker Hub) for Testcontainers.
  This is set in the cloud environment's network settings.
- Staging on Railway costs a few dollars a month. Confirm plan limits at setup.
