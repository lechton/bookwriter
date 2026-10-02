# bookwriter

A lean, shareable workspace of interview-lecture projects. Each project under `projects/` is self-contained: it carries its own authoring law (`instructions.md`, `AUTHOR-BRIEF.md`), question pipeline, build script (`src/build-lectures.mjs`), and figures. Markdown lecture sources compile to styled HTML and PDF.

## Structure

```
bookwriter/
├── AGENTS.md                       workspace law (read this first)
├── bookwriter-project.json         machine-path template (committed)
├── bookwriter-project.local.json   your real paths (gitignored; you create it)
├── projects/                       13 self-contained lecture projects
│   ├── react-01 .. react-06        React core, architecture, production lectures
│   ├── vue-01  css-01  accessibility-01
│   ├── svelte-01 .. svelte-03      Svelte 5 / SvelteKit
│   └── nestjs-01  fastapi-01
├── questions/                      shared question banks (react/ vue/ css/ accessibility/ nestjs/ svelte/)
├── assets/                         shared stylesheets for generated card/diagram HTML
└── tools/                          resolve.mjs  check-links.mjs  shot.mjs
```

## Onboarding (new machine, 2 minutes)

1. Clone the repo.
2. `cp bookwriter-project.json bookwriter-project.local.json` and fill in real absolute paths for your machine. Keys: `corpus` (documentation corpus), `gdrive` (Google Drive folder), `archive` (historical archive), `external.svelte` / `external.svelteDev2026` (source repos), `screenshots`. The local file is gitignored; never commit it.
3. Verify: `node tools/resolve.mjs corpus` prints your corpus path. `node tools/check-links.mjs` reports zero broken links.

Nothing else is machine-specific. All in-repo references are relative; all machine-specific locations resolve through the config.

## Building a project

```sh
cd projects/react-06
node src/build-lectures.mjs
```

Each project documents its own pipeline in its `instructions.md` and `README`-level docs. Generated outputs (`md-lectures-html/`, `md-lectures-pdf/`, `*.pdf`) are gitignored; rebuild them locally.

## Projects

| Project | Topic |
| --- | --- |
| react-01 | React Core & Architecture (Q01–Q180) |
| react-02 | React 19 Core with 4 Unified Invariants |
| react-03 .. react-06 | React 19 Production Lectures, versions 3–6 (v6 introduces the versioned skills system) |
| vue-01 | Vue 3 Core & Architecture |
| css-01 | CSS Interview Lectures |
| accessibility-01 | Accessibility & Performance Lectures |
| svelte-01 .. svelte-03 | Svelte 5 / SvelteKit Lectures (210-question curriculum) |
| nestjs-01 | NestJS Lectures |
| fastapi-01 | FastAPI Core & Architecture |

## Tooling

- `node tools/resolve.mjs <key>` — print a configured machine path.
- `node tools/check-links.mjs` — verify every relative markdown link resolves (CI-grade hygiene gate).
- `node tools/shot.mjs <dir> <name> [width]` — headless Chrome screenshot helper for visual review.

Agents: read `AGENTS.md` before working in this workspace.
