# 0011. FSRS with exam-aware adjustment

- Status: Accepted
- Date: 2026-09-25

## Context

UoK students sit monthly exams. Classic spaced repetition spreads reviews over long intervals
and ignores deadlines.

## Decision

FSRS (via `ts-fsrs`) as the base scheduler, in the pure `packages/scheduling` package. On top of
it, an exam-aware layer: as a course's exam date approaches, due dates for that course's cards are
pulled forward so everything is seen before the exam. After the exam, normal FSRS spacing resumes.

## Alternatives

- **SM-2 (classic Anki):** simpler, but less accurate than FSRS.
- **Pure cramming schedule:** helps the exam, hurts long-term retention for finals.

## Consequences

- Pure code, so the mobile app can run it offline later.
- The exam-aware rules are core product logic: strict TDD, ≥ 90% coverage.
