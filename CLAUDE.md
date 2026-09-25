# Carrel

A calm study space for university students: collect course material, study it with an AI tutor
grounded in that material, and remember it with exam-aware spaced review.

**Status:** pre-scaffold. Only docs exist. Next: user flows, then Milestone 0 (foundation).

## Read first
- `docs/product.md`: what we build and why, scope, roadmap, open questions.
- `docs/architecture.md`: system shape, repo layout, boundary rules, testing.
- `docs/decisions/`: one record per decision. Add a new record when a decision changes.

## Working agreement
- The owner decides product and architecture. Claude writes code and explains the reasoning.
  The owner reviews every PR.
- Work happens on a branch and lands through a PR. PR descriptions say **what changed and why**.
- Commit messages: clear and imperative. **No co-author or AI attribution trailers.**
- Don't start large changes without agreeing the approach first.

## Code conventions
- **Comments are short.** Only say what a function is for, or what would break if it changed.
  No narration of what the code obviously does.
- **TDD.** Write the failing test first. Keep coverage gates green (see `docs/decisions/0009-testing-strategy.md`).
- **Respect boundaries** (`docs/architecture.md` §4): `domain/` stays framework-free, modules
  import each other only via `index.ts`, clients never import `db` or `ai`.
- **Business rules live in the API**, never in web or mobile.
- **Every use case checks ownership.** Every endpoint gets a cross-user access test.
- **All UI strings go in `i18n/`.**
- API shapes are defined once as zod schemas in `packages/contracts`.
- AI calls go through `packages/ai` only. Prompts are versioned. Record usage and cost.

## Never commit
- Real course material (UoK slides, past papers). It belongs to lecturers.
- Secrets or `.env` files.
