# FastAPI Question Bank (Frozen Curriculum)

This project hosts its question bank locally, exactly like `react-lecture-03`: the `questions/` folder inside the project is the single source of truth for every lecture. One lecture is written per question, same numbering, continuous 1–60 with zero gaps.

## File layout

```
fastapi-01/questions/
├── README.md       ← this file (curriculum architecture and authoring process)
├── topics.md       ← controlled vocabulary of 58 hashtags (one tag per question)
└── questions.md    ← the full 60-question curriculum, strictly ordered, continuous numbering 1–60
```

## Curriculum Architecture

The question bank consists of **60 questions** divided into two parts:
- **Part One: FastAPI Core (Q01–Q35)**: Protocol and ASGI runtime, parameter extraction, validation errors, Pydantic core data modeling, response filtering, status codes, error handling, and dependency injection.
- **Part Two: Production Architecture, Persistence, Security, and Scale (Q36–Q60)**: Multi-module architecture with `APIRouter`, configuration settings with `pydantic-settings`, SQLModel database persistence, async database sessions, Alembic migrations, password hashing, JWT authentication, RBAC scopes, background tasks, CORS, ASGI middleware traps, rate limiting, WebSockets, Server-Sent Events, event loop starvation, TestClient testing, Docker containerization, multi-worker process models, reverse proxies with `root_path`, and production hardening.

## Row format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|

- **#**: Stable unique ID, continuous 1–60. Any lecture is cited by its question number ("write the lecture for Q42").
- **Tier**: `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth; Part Two suffixes ` (Production)`.
- **Topic**: Exactly one hashtag from `topics.md` (controlled vocabulary; API names verbatim in snake_case, concept tags snake_case otherwise).
- **Question**: Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook**: Pain-point framing anchored in The National Times backend publishing platform. Becomes the seed of the lecture's Opening Ladder.

## Pedagogical Invariants

1. **Zero-Gap First-Time Learner Path**: A developer encountering FastAPI for the first time reads `❱ CORE` in sequence (Q01–Q35, then Q36–Q60). Every primitive is grounded in physical reality (sockets, HTTP packets, memory objects) before decorators or abstractions appear.
2. **Senior Interview Defense and Depth**: Every question investigates runtime cause, client or browser effects, memory layout, event-loop scheduling, and failure boundaries, equipping developers to defend architectural choices under senior technical interviews.

## Authoring process (per question)

1. Pick the question row from `questions.md`.
2. Phase 1: write the pre-lecture blueprint `md-pre-lectures/{nn}.md` (per `PRE-LECTURE-INSTRUCTIONS.md`).
3. Phase 2: write the production lecture `md-lectures/{n}.md` (per `AUTHOR-BRIEF.md` and `instructions.md`), grounded in the local FastAPI documentation corpus (`documentation official/fastapi/official/`).
4. Build and gate: `node src/build-lectures.mjs`; a clean build with zero warnings is the mechanical gate.

## Status

**FROZEN (60 questions established).**
