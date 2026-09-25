# Carrel — Architecture

How the system is shaped and why. Each significant choice has a record in [`decisions/`](decisions/).

---

## 1. System overview

```
   Web (Next.js)          Mobile (Expo, Phase 2)
          \                    /
           ▼                  ▼
    ┌──────────────────────────────────┐
    │  API (NestJS, modular monolith)  │  ← all business rules live here
    └──────────────────────────────────┘
        │            │            │
   Postgres      Storage     Job queue (Redis / BullMQ)
  + pgvector    (Supabase)         │
  (Supabase)                       ▼
        ▲                 ┌──────────────────┐
        └──────────────── │ Worker (same     │ ──▶ AI providers
                          │ codebase, no     │
                          │ HTTP)            │
                          └──────────────────┘
```

**Rule:** clients never hold business logic. "Can this user see this PDF?", "is this answer
correct?", "how many AI credits are left?" are answered by the API only. Adding a client means
building screens, not re-implementing rules.

## 2. Components

| Component | Tech | Responsibility |
|---|---|---|
| Web | Next.js (App Router), TypeScript | UI only. Talks to the API through the generated client. No DB or AI access |
| API | NestJS | HTTP API, auth checks, business rules, AI calls for interactive features (tutor turns) |
| Worker | Same NestJS codebase, `worker.ts` entry | Slow jobs: document processing, question extraction, flashcard generation |
| Database | Supabase Postgres + pgvector | All relational data and slide embeddings |
| Auth | Supabase Auth (Google + email link) | Issues JWTs; the API verifies them on every request |
| Files | Supabase Storage, private buckets | PDFs and images, reached only through short-lived signed URLs |
| Queue | BullMQ on Redis | Job hand-off between API and worker, with retries |
| AI | Vercel AI SDK behind our own `ai` package | Provider-agnostic calls, versioned prompts |

## 3. Key flows

### Upload and process slides (async)

```
Student uploads PDF
  → web gets a signed upload URL from the API, uploads to Storage
  → API saves document row (status: processing) and enqueues `document.ingest`
  → UI shows "Preparing your slides…" and polls status

Worker picks up `document.ingest`
  → extract text per page
  → describe images on pages that need it (vision model)
  → chunk by slide, embed, store chunks with page numbers
  → status: ready
```

Slow work never runs inside a user request. Jobs are **idempotent**: re-running one gives the
same result, so retries are safe.

### Tutor turn (streaming)

```
Student sends a message in a session
  → API checks ownership and usage limits
  → retrieves the most relevant slide chunks (pgvector)
  → builds the prompt: method + strictness + level + chunks + recent history
  → streams the reply to the client (SSE), with citations to slide pages
  → records tokens and cost in `usage`
```

The tutor has **no tools**. It can only talk. Text inside uploaded documents is treated as data,
so a malicious PDF can't make the tutor do anything harmful.

### Review

```
Student opens today's review
  → API asks `scheduling` which cards are due (FSRS + exam-date adjustment)
  → student grades each card → next due date computed and stored
```

## 4. Repository layout

```
carrel/
├── apps/
│   ├── web/                        Next.js, frontend only
│   │   └── src/
│   │       ├── app/                routes and layouts only, kept thin
│   │       │   ├── (marketing)/    public landing, pricing
│   │       │   ├── (auth)/         sign-in
│   │       │   └── (app)/          logged-in: today, courses, study, review
│   │       ├── features/           one folder per feature (components, hooks, queries, tests)
│   │       ├── components/ui/      design-system building blocks
│   │       ├── lib/                API client setup, auth, analytics
│   │       └── i18n/               every UI string
│   │
│   ├── api/                        NestJS, modular monolith
│   │   ├── src/
│   │   │   ├── main.ts             HTTP entry
│   │   │   ├── worker.ts           job worker entry (same modules, no HTTP)
│   │   │   ├── modules/
│   │   │   │   ├── identity/       users, profiles, account deletion and export
│   │   │   │   ├── courses/        courses, folders, exam dates
│   │   │   │   ├── documents/      uploads and processing pipeline
│   │   │   │   ├── tutor/          sessions, methods, dials, citations
│   │   │   │   ├── practice/       past-paper questions, grading
│   │   │   │   ├── review/         flashcards, review sessions
│   │   │   │   ├── notes/          (M3)
│   │   │   │   ├── planning/       today plan, quick capture (M3)
│   │   │   │   ├── progress/       streaks, stats
│   │   │   │   └── usage/          AI cost metering, rate limits
│   │   │   └── common/             auth guard, errors, config, logging
│   │   └── test/                   integration tests (real Postgres + Redis)
│   │
│   └── mobile/                     Expo (Phase 2)
│
├── packages/
│   ├── contracts/     zod schemas for every API request/response
│   ├── api-client/    typed client generated from the OpenAPI spec
│   ├── db/            Drizzle schema, migrations, seed
│   ├── ai/            provider adapters, versioned prompts
│   │   └── evals/     eval cases and runner
│   ├── scheduling/    FSRS + exam-aware logic (pure)
│   └── tokens/        design tokens shared by web and mobile
│
├── services/
│   └── ingest-py/     Python worker, only if needed
├── e2e/               Playwright flows across web + API
├── infra/
│   ├── docker/        Dockerfiles for API and worker
│   └── compose.yaml   local Redis
├── supabase/          local Supabase config
├── tooling/           shared tsconfig, eslint, vitest config
├── docs/
└── .github/           CI, PR template
```

### Inside an API module

```
modules/<name>/
├── domain/          pure rules: no NestJS, DB, or AI imports
├── application/     use cases (what this module can do)
├── infrastructure/  DB repositories, queue producers/consumers, AI adapters
├── http/            controllers
└── index.ts         the module's public surface
```

Thin modules may skip `domain/` if they have no real rules. Don't add layers for ceremony.

### Boundary rules (enforced in CI by dependency-cruiser)

1. Apps may import packages. Packages never import apps.
2. `domain/` imports nothing framework- or IO-related.
3. Modules import each other **only** through `index.ts`.
4. `apps/web` and `apps/mobile` never import `db` or `ai`.

Rule 3 keeps each module separable. If `documents` ever becomes its own service (e.g. in Python),
the boundary already exists.

## 5. API contract

- REST. Request and response shapes are **zod schemas** in `packages/contracts`.
- NestJS validates with those schemas (`nestjs-zod`) and generates an **OpenAPI** spec.
- `packages/api-client` is generated from the spec and used by web and mobile.
- The same schemas validate forms on the client, so validation is never written twice.
- OpenAPI keeps the door open for non-TypeScript services and clients.

## 6. Environments and deployment

| Environment | Deployed from | Web | API + worker + Redis | Data |
|---|---|---|---|---|
| Preview | each PR | Vercel preview | uses staging API | staging Supabase |
| Staging | `dev` | Vercel | Railway (staging) | Supabase project (staging) |
| Production | `main` | Vercel | Railway (production) | Supabase project (production) |
| Tests | CI and Claude sessions | — | Testcontainers | throwaway Postgres + Redis |

- Development doesn't depend on the owner's laptop. Code is written and tested in Claude
  sessions and CI, and reviewed through PRs and preview URLs. Local dev (native `pnpm dev`, with
  Redis in Docker, against the staging Supabase project) stays possible but optional.
- Staging exists from Milestone 0. Production is added before the beta.
- Migrations reach staging only when a PR merges into `dev`, so an unmerged migration can't
  break the shared staging database.
- `main` deploys to production after CI passes. Nothing reaches `main` without review.
- Schema changes are migration files in `packages/db`, never dashboard edits.
- Docker details: [`decisions/0013-docker-and-environments.md`](decisions/0013-docker-and-environments.md).
- Server components (API, DB, worker, Redis) share **one region**. Static assets come from the CDN.
  EU for now; may change after the data-protection check (product open question #7).
- Secrets live in platform env vars, never in the repo.

## 7. Testing

TDD: failing test → code → refactor. Coverage is collected from the first commit and gated per layer.

| Layer | Tooling | Gate |
|---|---|---|
| `domain/`, `packages/scheduling` | Vitest unit tests, strict TDD | ≥ 90% |
| `application/` use cases | Vitest with in-memory fakes | ≥ 80% |
| `infrastructure/` | Vitest + Testcontainers (real Postgres, Redis) | measured |
| HTTP endpoints | Supertest, incl. auth and **cross-user access** cases | every endpoint |
| Web components with logic | Vitest + Testing Library, MSW for the API | measured |
| User flows | Playwright against web + API, **fake AI provider** | critical flows |
| AI behaviour | Evals in `packages/ai/evals` | pass rate tracked; nightly / on demand |

Real course material (UoK slides, past papers) is **never committed**. Eval fixtures that use
it live in private storage; the repo holds only material we create.

## 8. Cross-cutting concerns

- **Authorization:** every use case checks ownership. Cross-user tests are required per endpoint.
- **AI cost:** every AI call records tokens and cost per user (`usage` module). Per-user rate
  limits. Spending caps set on provider accounts.
- **Uploads:** size and MIME type checked. Private buckets. Signed URLs with short expiry.
- **Observability:** Sentry (errors), PostHog (product analytics, session replay in beta),
  structured logs.
- **i18n:** all UI strings in `i18n/` from day one. English only for now.
- **Low bandwidth:** small bundles, the PDF viewer loaded only when needed.
- **Privacy:** account deletion and data export from the start.
