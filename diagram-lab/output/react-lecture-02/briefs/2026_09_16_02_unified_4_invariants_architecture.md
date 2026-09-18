# Brief 02 — Architectural Consolidation: The 4 Unified Invariants & Holistic Instruction Integration

Date: 2026-09-16 · Number: 02 · Status: active / canon

## Why We Consolidated

As the instruction suites evolved through `css-01` and `vue-01`, pedagogical laws grew through historical accretion (accumulating 18 numbered laws, multiple separate principles, and overlapping checklists). This created three structural defects:
1. **Instruction Sprawl & Attention Decay**: Authoring LLMs were given ~2,150 lines of instructions across 4 files, causing attention drift where middle laws were routinely dropped.
2. **Duplicate Drift**: Rules were defined in `instructions.md`, re-explained in `PEDAGOGICAL-CLARITY.md`, checked in `AUDIT-CHECKLIST.md`, and summarized in `AUTHOR-BRIEF.md`.
3. **Local Patching Pathology**: When a new rule was introduced, AI agents appended bullets to single files in isolation, introducing contradictions and semantic drift.

## The Consolidation: The 4 Unified Invariants in `instructions/`

All 18 historical laws and clarity principles are consolidated into modular numbered files inside `instructions/`:
- `instructions/00-project-governance.md`: Project charter, the Holistic Instruction Integration Law, lecture anatomy, and build pipeline.
- `instructions/01-cognitive-contract.md`: Invariant 1 (Reader Profile, Tone, Anti-Jargon) + Embedded Self-Audit Gate 1.
- `instructions/02-concept-lifecycle.md`: Invariant 2 (Anchor, Baptism, 4 Pillars, Invisible Scaffolding) + Embedded Self-Audit Gate 2.
- `instructions/03-harmonious-step-rhythm.md`: Invariant 3 (4-Beat Measure, macOS Code Fidelity, Zero Orphan Syntax, 1:1 Sync) + Embedded Gate 3.
- `instructions/04-comparative-proof.md`: Invariant 4 (High-Stakes Walls, Symmetrical Duels, Visual Substrate) + Embedded Gate 4 + Production Pipeline Gate.
- `instructions/05-figure-design-system.md`: RCE visual specifications, palette, window chrome, and template catalog.

## Elimination of Redundant Files
- `AUDIT-CHECKLIST.md` is retired and deleted. Its assertions are now embedded 1:1 directly within each Invariant in `instructions/`.
- Root clutter was purged: `instructions.md`, `PEDAGOGICAL-CLARITY.md`, and `FIGURE-DESIGN-SYSTEM.md` were transformed into the modular `instructions/00-` through `05-` suite.

## The Holistic Instruction Integration Law (The Anti-Patching Ban)
Enshrined in `instructions/00-project-governance.md` and `AGENTS.md`:
- Isolated local patches are strictly banned.
- Every new instruction must undergo an **Ecosystem Impact Audit**, be **Semantically Harmonized** into the canonical Invariant, and **Atomically Synchronized** across all documentation files (`instructions/`, `AUTHOR-BRIEF.md`, `README.md`, `AGENTS.md`) in a single pass.
