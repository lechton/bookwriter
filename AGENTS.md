# AGENTS.md — Bookwriter Workspace Law

A lean, shareable workspace of interview-lecture projects (React, Vue, CSS, Accessibility, Svelte, NestJS, FastAPI). Every project is self-contained: it carries its own law, question pipeline, build script, and figures.

## Default Operational Root

All operations, shell commands, file inspections, and project workflows are rooted at the workspace root (this folder). All relative paths in docs and code resolve from here. Never hardcode machine-specific absolute paths anywhere in tracked files.

## Project Registry (shorthand ➔ folder ➔ pipeline)

| Shorthand | Folder | Topic |
| --- | --- | --- |
| `react 01` | `projects/react-01` | React Core & Architecture Q01–Q180 |
| `react 02` | `projects/react-02` | React 19 Core with 4 Unified Invariants |
| `react 03` | `projects/react-03` | React 19 Production Lectures v3 |
| `react 04` | `projects/react-04` | React 19 Production Lectures v4 (skills system) |
| `react 05` | `projects/react-05` | React 19 Production Lectures v5 |
| `react 06` | `projects/react-06` | React 19 Production Lectures v6 (Q01–Q13) |
| `vue 01` | `projects/vue-01` | Vue 3 Core & Architecture |
| `css 01` | `projects/css-01` | CSS Interview Lectures |
| `accessibility 01` / `a11y 01` | `projects/accessibility-01` | Accessibility & Performance Lectures |
| `svelte 01..03` | `projects/svelte-01..03` | Svelte 5 / SvelteKit Lectures |
| `nestjs 01` | `projects/nestjs-01` | NestJS Lectures |
| `fastapi 01` | `projects/fastapi-01` | FastAPI Core & Architecture |

Shared assets (not per-project):
- `questions/` — shared question banks: `react/`, `vue/`, `css/`, `accessibility/`, `nestjs/`, `svelte/` (the 210-question Svelte 5 + SvelteKit curriculum). Some projects carry their own bank inside the project folder (e.g. `projects/fastapi-01/questions/`).
- `assets/` — shared stylesheets used by generated card/diagram HTML (referenced as `../../../assets/...` from build output folders).
- `tools/` — workspace tooling: `resolve.mjs` (config resolver), `check-links.mjs` (link verifier), `shot.mjs` (screenshot helper).

Whenever executing a command (e.g. `node src/build-lectures.mjs`), set the working directory to the active project folder under `projects/`.

## Machine Paths & The Config Law (Hardcore Expectation)

This workspace is shared across machines. Machine-specific locations MUST NEVER be hardcoded in tracked files. They live in per-user config:

- `bookwriter-project.json` — committed template with placeholder values and the key schema.
- `bookwriter-project.local.json` — gitignored; each collaborator fills their real absolute paths here.

Config keys: `corpus` (documentation corpus folder), `gdrive` (Google Drive `bookwriter-google` folder), `archive` (bookwriter-old archive), `external.svelte` / `external.svelteDev2026` (external source repos), `screenshots` (local screenshots folder).

Resolve any key: `node tools/resolve.mjs <key>` (e.g. `node tools/resolve.mjs corpus`). Scripts read config through the same mechanism (see `tools/shot.mjs` for the pattern). Agents asked to open the corpus, archive, or external repo MUST resolve the key first instead of guessing paths.

## Corpus Citation Convention

The documentation corpus (formerly the in-repo `documentation official/` folder) now lives outside the repo, at the path configured under the `corpus` key (on the owner's machine: the Google Drive copy). Citations keep the stable textual form `documentation official/<track>/...` — a corpus-relative subpath, independent of where the corpus physically lives. Example: `documentation official/css/README.md` means `<corpus>/css/README.md`. Build scripts validate citations by this textual format only; no build reads the corpus from disk.

## Workspace Hygiene

- Link integrity gate: `node tools/check-links.mjs` must report zero broken path links (MISSING entries are planned-but-unauthored lecture files; GENERATED entries are gitignored build outputs).
- Generated outputs (`md-lectures-html/`, `md-lectures-pdf/`, `*.pdf`, etc.) are gitignored; rebuild them with each project's own pipeline.
- Historical materials (legacy Pencil pipeline, experiment labs, superseded instructions, the pre-restructure tree) live in the archive configured under the `archive` key — outside this repo.

## Control Directives

- `"nnn"` — chat-only discussion; never edit files or run modifying commands.
- `"ppp"` — proceed immediately: author, edit, and build without asking further confirmation.
- `"ppi"` — proceed to edit instructions and/or skills files only; stop when instruction and skill editing is finished; never touch lectures or other files.
- `"iii"` — when there is a problem, focus on the instructions that enabled it: examine pruning or editing them, and present proposed instruction changes broken down by section with exact diffs before approval.

## Rule Authoring

When any AI agent creates, reviews, or modifies instructions, prompts, or skills, first consult the meta-rules: `projects/react-04/skills/prompt-writing/SKILL.md` and `projects/react-04/skills/prompt-writing/quality-checklist.md`, plus `projects/react-04/skills/README.md` and `projects/react-04/skills/RULE-TAGS.md`. Mirrors are kept in sync at `projects/react-05/skills/` and `projects/react-06/skills/v6.3/`.

### The Golden Rule: De-Prescribe Before Adding Rules

1. *The Reflexive Ban Fallacy*: models default to proposing bans, inventing negative prohibitions, and using authoritarian language ("never do this").
2. *The Exclusionary Fallacy*: models interpret positive guidance ("do this") as forbidding everything else.

The FIRST remedy for unwanted model behavior is a subtle edit to existing rules that removes the prescriptions or conflicts creating the problem — prune the root cause instead of stacking new bans. Keep the instruction system lean and grounded in clear standards.

## Project Law

Each project's full authoring law, briefs, checklists, figure systems, and skills live inside the project folder (`projects/<name>/instructions.md`, `AUTHOR-BRIEF.md`, `skills/`, etc.). Read the project's own law before authoring for it. Cross-project references use relative links from the citing file.

## Always-on Conventions

- Never hard-wrap. One continuous line per paragraph, bullet, or prompt, in every file.
- Lectures are TTS-safe: no code, no symbols a synthetic voice cannot read, no em-dashes; a standalone lesson that never addresses whoever commissioned it.
- Organic Lexical Audit (OLA): introduce new terms through visceral, real-world, high-stakes scenarios where the newbie would physically hit a wall without the concept.
- Typology tagging: every interview question carries its curriculum typology (`❱ CORE`, `❱❱ MORE`, `❱❱❱ ADVANCED`), formatted as `> INTERVIEW QUESTION | ❱ CORE | [Question text]`.
- Zero code comments in summary snippets; use `right`/`wrong` fence tags with `**DO THIS:**` / `**DO NOT DO THIS:**` headers above the block.
- Zero em-dashes. Zero hard-wraps.
