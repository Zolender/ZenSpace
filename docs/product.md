# Carrel — Product

> Your quiet place to learn.

Status: pre-build. This document is the source of truth for _what_ we build and _why_.
Technical choices live in [`architecture.md`](architecture.md) and [`decisions/`](decisions/).

---

## 1. Vision

Students keep their learning scattered: slides in WhatsApp groups, notes in random folders,
past papers as blurry photos, revision as last-minute panic. Carrel brings the pieces into one
calm space and connects them into a single loop: **collect your material, study it with a tutor
that knows it, and remember it until the exam and beyond.**

Carrel is not a wall of features. It is one loop, done well.

## 2. First user

A university student at the **University of Kigali (UoK)**, undergraduate or master's.

- Takes notes on a **laptop** in class.
- Receives **typed slides as PDFs** (sometimes with images and diagrams).
- Has access to **past exam papers**, usually as phone photos.
- Sits **exams every month**, so there is always an exam coming.
- Is short on money and on reliable internet.

Later audiences (other universities, high school, lecturers, professionals) are on the
[roadmap](#6-roadmap), not in V1.

## 3. Product principles

1. **The AI teaches. It does not do the work.** It asks, hints, checks, and explains. How much it
   gives away is the student's choice, within limits.
2. **Grounded in your material.** The tutor answers from the student's own slides and cites
   the slide it used. If the material doesn't cover something, it says so.
3. **Calm by default.** One clear action per screen. Premium, quiet, no clutter.
4. **Reward real work.** Streaks and rewards count reviews completed and sessions finished,
   not app opens.
5. **Exam-aware.** Every course has a next exam date, and the app uses it to decide what matters now.

## 4. The core loop

```
 Collect ──────▶ Study ──────▶ Remember ──────▶ Progress
 slides, notes,   timed session   exam-aware       streak, weak topics,
 past papers      with the tutor  flashcard review readiness for the exam
      ▲                                                  │
      └──────────────── next session starts here ◀───────┘
```

Everything else (daily plan, quick capture, notes) supports this loop.

### The tutor

The tutor has **methods** (what kind of session it is) and **two dials** (how it behaves).

| Method   | Purpose                                                 | Kind     |
| -------- | ------------------------------------------------------- | -------- |
| Explain  | Teaches a topic from the student's slides               | Learning |
| Socratic | Only asks questions and leads the student to the answer | Learning |
| Feynman  | The student explains; the tutor finds the gaps          | Learning |
| Drill    | Rapid recall questions                                  | Revision |
| Exam sim | Timed, no help, graded at the end                       | Revision |

| Dial           | Range                                                          |
| -------------- | -------------------------------------------------------------- |
| **Strictness** | "Gives answers when asked" → "Never gives answers, hints only" |
| **Level**      | High school → Undergraduate → Master's                         |

### Sessions

- Timed: 10 minutes to 1 hour, chosen by the student.
- Breaks are **inside** the session (a short timer with the next question waiting), because
  students who leave for a break often don't come back.
- Every session ends with a **hook**: what's due tomorrow and the concept that needs work.

### Past papers

Students photograph past papers. Carrel extracts the questions, lets the student practise them,
grades the answers, explains using the course slides, and shows which topics come up again and again.
Uploaded papers are **private to the student** in V1.

### Exam-aware review

Flashcards come from sessions, slides, and past papers. Review is scheduled with spaced repetition
(FSRS). As a course's exam date gets close, reviews for that course are pulled forward. After the
exam, spacing returns to normal so the knowledge carries into finals.

## 5. V1 scope (~9 weeks)

Assumes ~15 hours/week of product-owner time. The code is written with an AI pair and reviewed by the owner.

### Milestone 0 — Foundation (~1 week)

- Monorepo scaffold, CI with coverage gates and boundary checks.
- Test setup: unit, integration (real Postgres/Redis), Playwright with a fake AI.
- Preview and production deploys.
- One thin flow working end to end: sign in → API → database → screen.

### Milestone 1 — "Study with my slides" (~weeks 2–4)

- Courses with exam dates. PDF upload, processing, and viewer.
- Tutor that answers from the slides and cites them (reads slide images too).
- Methods: Explain and Socratic. Both dials.
- Timed sessions with the end-of-session hook.
- **Checkpoint:** 2–3 friendly testers.

### Milestone 2 — "Pass my exam" (~weeks 5–7)

- Past-paper upload (photos or PDF), question extraction, exam practice with AI grading.
- Flashcard generation and exam-aware daily review.
- Streak based on real work.
- **Checkpoint:** beta with 5–10 UoK students, timed before a monthly exam.

### Milestone 3 — "My study space" (~weeks 8–9+)

- Notes editor with folders inside courses.
- Daily plan and morning quick capture.
- Progress view. Per-user AI usage limits. In-app feedback.

## 6. Roadmap

| Phase                  | When (approx.) | What                                                                                                                                                                                     |
| ---------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **V1 — Study loop**    | Months 1–2     | Milestones 0–3 above                                                                                                                                                                     |
| **2 — Sustainable**    | Months 3–4     | MoMo / Airtel Money payments, subscription tiers and credits, rewards that earn credits, AI note improver (accept/reject changes), achievements, **mobile companion** (review + capture) |
| **3 — Personal coach** | Months 4–6     | Goals set with the AI, "today" suggestions (AI proposes, student decides), weak-topic insights, remaining tutor methods                                                                  |
| **4 — Class layer**    | Months 6–9     | Shared course spaces, lecturer view (publish material, anonymous class weak spots, quizzes)                                                                                              |
| **5 — Widen**          | Months 9–12+   | Other Rwandan universities, high school, French and Kinyarwanda, native mobile app. Professionals: parked                                                                                |

## 7. Out of scope for V1

Written down so we can say no quickly.

- Mobile app (web on laptop only; responsive, but not optimised for phone).
- Payments, subscriptions, credits (usage is metered but not charged).
- Lecturer accounts, shared courses, sharing past papers between students.
- AI-generated study plans and goals.
- Languages other than English.
- Scanned or handwritten _slides_ (past-paper photos are supported).
- Offline mode.
- Anything for professionals.

## 8. Success metrics (for the beta)

- **Retention:** at least half of testers still active in week 3 without reminders.
- **Real use:** testers complete a review on 3+ days per week.
- **The honest test:** before an exam, testers open Carrel on their own, not WhatsApp and their PDFs.
- **Cost:** AI spend per active student stays below what a student could realistically pay.

## 9. Open questions

| #   | Question                                                             | Decide by                                     |
| --- | -------------------------------------------------------------------- | --------------------------------------------- |
| 1   | Which AI provider(s)?                                                | Bake-off, before building the tutor           |
| 2   | Folder-first or course-first organisation for notes?                 | User flows discussion                         |
| 3   | Pricing and free vs. paid split                                      | End of beta, from real usage costs            |
| 4   | How rewards convert to credits without being gamed                   | Phase 2                                       |
| 5   | Past-paper sharing: copyright and academic integrity                 | Before Phase 4                                |
| 6   | Will UoK lecturers welcome or resist this?                           | Talk to 2–3 lecturers during beta             |
| 7   | Rwanda data protection law (2021): registration, storing data abroad | **Early**, since it may affect hosting region |
| 8   | Campus connectivity: do we need offline support?                     | Ask beta testers                              |
| 9   | "Carrel": domains, app stores, trademark                             | Before public launch                          |
| 10  | Does a professionals mode ever belong here?                          | Parked until after Phase 3                    |
