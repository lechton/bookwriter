# React 19 Production Lectures — Skills System (`v9.1`)

Version **`v9.1`** contains **two completely separate skill sets** inside `skills/v9.1/` so that rules from the two lecture formats never mix:

1. **`skills/v9.1/v1/` — Original Version (`v1`)**:
   - The multi-stage pipeline (`01-01-map-principles/v1/` $\rightarrow$ `01-01-md-PRE-lectures/v1/` $\rightarrow$ `01-02-md-LECTURES/v1/` $\rightarrow$ `02-01-md-revised-1..4/v1/`).
   - Preserved untouched for all existing `v1` lectures.
2. **`skills/v9.1/v2/` — River Version (`v2`)**:
   - The streamlined two-step River pipeline (`01-01-map-principles/v2/{NN}.md` $\rightarrow$ `01-02-md-LECTURES/v2/{NN}.md` $\rightarrow$ `01-03-md-lectures-HTML/v2/{NN}.html` & `01-04-md-lectures-PDF/v2/{NN}.pdf`).
   - Combines a comprehensive **General Concepts Introduction (The Runway)** before Principle 1 with **Unified River Principles** that grow one practical example progressively from Principle 1 to Principle N without repeating the chapter a second time at the end.

---

## Canonical Version Names

| Version Tag | Canonical Name | Skills Folder | Principle Maps Folder | Lectures Folder | HTML / PDF Build Output |Build Script |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`v1`** | **Original Version** | `skills/v9.1/v1/` | `01-01-map-principles/v1/` | `01-02-md-LECTURES/v1/` | `01-03-md-lectures-HTML/v1/`<br>`01-04-md-lectures-PDF/v1/` | `node src/build-lectures.mjs` |
| **`v2`** | **River Version** | `skills/v9.1/v2/` | `01-01-map-principles/v2/` | `01-02-md-LECTURES/v2/` | `01-03-md-lectures-HTML/v2/`<br>`01-04-md-lectures-PDF/v2/` | `node src/build-river.mjs` |

> **Strict Separation Rule**:
> - When authoring or auditing a **River Version (`v2`)** map or lecture, load **only** the skills in `skills/v9.1/v2/`. Never load `skills/v9.1/v1/`.
> - When maintaining an **Original Version (`v1`)** map or lecture, load **only** the skills in `skills/v9.1/v1/`.

---

## Part A: River Version (`v2`) Skills (`skills/v9.1/v2/`)

| # | Skill | File | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | **`map-principles-v2`** | [v2/map-principles/SKILL.md](v2/map-principles/SKILL.md) | Authors `01-01-map-principles/v2/{NN}.md`: Corpus & Chrome verification, `Candidate Ledger` scope routing, `Terms` inventory, `General Concepts Introduction (Runway Plan)`, philosophical `Root Distinction` per principle, `Real Beginner Mistake` vs. `Interview Depth`, and `River Progression` + `Pertinent Division & Visual Comparison`. |
| 2 | **`lecture-structure-v2`** | [v2/lecture-structure/SKILL.md](v2/lecture-structure/SKILL.md) | Governs the 3-zone architecture of `01-02-md-LECTURES/v2/{NN}.md`: Zone 1 (Comprehensive General Concepts Introduction / The Runway), Zone 2 (Unified River Principles 1..N), and Zone 3 (Complete Final Code, Summary Table, and For the Interview). |
| 3 | **`lecture-voice-v2`** | [v2/lecture-voice/SKILL.md](v2/lecture-voice/SKILL.md) | Enforces water-like CEFR B2 single-idea sentences, division of labor between plain-English prose and code blocks, Root-First philosophical pedagogy (`###` titles grounded in the root distinction), strictly chronological code explanations, zero parentheses `( )` in prose/headings/diagrams, and zero fake suspense. |
| 4 | **`code-and-figures-v2`** | [v2/code-and-figures/SKILL.md](v2/code-and-figures/SKILL.md) | Enforces short 3 to 10 line one-step-at-a-time code snippets during explanations with `~token~` highlight balloons and comments, inline ```` ```tree ```` Box-to-Boxes diagrams (`✓` green `+` vs. `✗` red `!`, `DO` vs. `DO NOT`), and `> [!PRINCIPLE]` cards. |
| 5 | **`verification-v2`** | [v2/verification/SKILL.md](v2/verification/SKILL.md) | **Mandatory Quality & Pre-Flight Gate**: Enforces the three-stage `- [ ]` checklist sequence—Stage A (Pre-Writing Checkboxes, including reading accepted reference chapters `04.md` and `01.md` first), Stage B (Human Reading Quality Checkboxes verified and reported item-by-item BEFORE any script runs), and Stage C (`build-river.mjs` and `check-links.mjs` ONLY AFTER Stages A & B pass). |

---

## Part B: Original Version (`v1`) Skills (`skills/v9.1/v1/`)

All 18 Original Version (`v1`) and Revision 3/4 skills live untouched inside `skills/v9.1/v1/`:
- [v1/map-principles/SKILL.md](v1/map-principles/SKILL.md)
- [v1/pre-lecture/SKILL.md](v1/pre-lecture/SKILL.md)
- [v1/lecture-structure/SKILL.md](v1/lecture-structure/SKILL.md)
- [v1/lecture-voice/SKILL.md](v1/lecture-voice/SKILL.md)
- [v1/pedagogical-crossroads/SKILL.md](v1/pedagogical-crossroads/SKILL.md)
- [v1/code-blocks/SKILL.md](v1/code-blocks/SKILL.md)
- [v1/code-comment-audit/SKILL.md](v1/code-comment-audit/SKILL.md)
- [v1/ui-panels/SKILL.md](v1/ui-panels/SKILL.md)
- [v1/figures/SKILL.md](v1/figures/SKILL.md)
- [v1/principle-definition/SKILL.md](v1/principle-definition/SKILL.md)
- [v1/principled-theory/SKILL.md](v1/principled-theory/SKILL.md)
- [v1/lecture-revision/SKILL.md](v1/lecture-revision/SKILL.md)
- [v1/verification/SKILL.md](v1/verification/SKILL.md)
- [v1/build/SKILL.md](v1/build/SKILL.md)
- [v1/summary-edition/SKILL.md](v1/summary-edition/SKILL.md)
- [v1/summary-figures/SKILL.md](v1/summary-figures/SKILL.md)
- [v1/summary-audit/SKILL.md](v1/summary-audit/SKILL.md)
- [v1/summary-revision-4/SKILL.md](v1/summary-revision-4/SKILL.md)

---

## Part C: Shared Meta-Rules (`skills/v9.1/prompt-writing/`)

- [prompt-writing/SKILL.md](prompt-writing/SKILL.md) — Meta-rules for authoring and refining skills (*Prune Before Banning*, *Teach by Living Example*, *General Standards Over Micro-Regulations*).
- [prompt-writing/quality-checklist.md](prompt-writing/quality-checklist.md) — Pre-commit quality gate for skill edits.
- [RULE-TAGS.md](RULE-TAGS.md) — Tag index across the skill suite.
