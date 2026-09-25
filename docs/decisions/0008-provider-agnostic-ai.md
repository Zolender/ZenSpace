# 0008. Provider-agnostic AI layer, chosen by bake-off

- Status: Accepted
- Date: 2026-09-25

## Context
AI is the main running cost, and students can pay little. Prices and quality change fast.
The tutor's value depends on following rules (strictness, citations), not just price.

## Decision
All AI calls go through `packages/ai`, built on the Vercel AI SDK. Prompts are versioned in
code. Models are chosen per task (e.g. cheap model for extraction, stronger model for tutoring
and grading). The first choice is made by a **bake-off** on real UoK material, judged on rule-following,
citation accuracy, reading of past-paper photos, grading fairness, and cost.

Candidates (Sept 2026): DeepSeek V4.1 Flash, Gemini Flash, Claude Haiku 4.5 / Sonnet 5.

## Alternatives
- **Pick one provider now:** fast, but locks in a guess.

## Consequences
- Switching models is configuration, not a rewrite.
- Provider-specific features (e.g. native PDF citations) are used only behind the adapter.
- Data residency and privacy of each provider must be stated in the privacy policy.
