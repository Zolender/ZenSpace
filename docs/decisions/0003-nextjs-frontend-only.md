# 0003. Next.js as a frontend-only web app

- Status: Accepted
- Date: 2026-09-25

## Context
The API owns all business logic (0002). The web app needs a public landing page with good
SEO and a logged-in app.

## Decision
Next.js (App Router). It renders UI and calls the API through `packages/api-client`. It never
imports `db` or `ai`, and it holds no business rules. This is enforced in CI.

## Alternatives
- **Vite + React SPA:** simpler, but weaker for the public landing page.
- **Next.js as full backend:** a mobile app couldn't reuse its logic.

## Consequences
- The owner's existing Next.js knowledge applies directly.
- We must resist putting logic in Next.js server actions. They may only call the API.
