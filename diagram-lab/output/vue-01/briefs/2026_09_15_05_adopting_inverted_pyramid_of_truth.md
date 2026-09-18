# Brief 05 — Adopting the Inverted Pyramid of Truth: Banning Delayed Truth-Bombs in vue-01

Date: 2026-09-15 · Number: 05 · Status: pedagogical law adopted

## 1. Provenance and Context

In the sibling CSS project (`diagram-lab/output/css-01/briefs/2026_09_14_05_the_delayed_truth_bomb.md`), a systematic structural defect was uncovered across earlier lecture series (`accessibility-01` and early drafts of `css-01`): **The Delayed Truth-Bomb (or Garden-Path Pedagogy)**.

In this defect, a lecture spent 70–80% of its runtime developing a textbook explanation through intermediate steps (Concept A $\to$ B $\to$ C), encouraging the reader to accept it as an invincible solution, only to abruptly drop a catastrophic revelation (Concept D) in Section 4 or quarantined inside the callout block `> [!TIP] **To impress the interviewer:**`.

Examples from earlier projects included:
- Celebrating custom ARIA focus traps for pages, only for the interview tip to reveal that native `<dialog>` renders them obsolete.
- Teaching CSS `display: flex; align-items: center; justify-content: center;` as the definitive centering champion, only for Section 4 to reveal that overflowing content suffers permanent data loss without `align-items: safe center`.
- Teaching `flex: 1` as balanced columns, only to reveal later that it blows out without `min-width: 0`.

## 2. Manifestation in Vue 3 (Why This Matters for vue-01)

If unconstrained, authoring models in Vue 3 will naturally reproduce this exact flaw:
1. **The `reactive()` Destructuring Trap:** An author spends three sections praising `reactive()` as the cleaner alternative to `ref()` because it eliminates `.value`, only to reveal in a late section or tip that destructuring `const { count } = state` completely breaks reactivity.
2. **The Keyless `v-for` Trap:** An author introduces `v-for="item in items"` as simple list rendering, only to later apologize and introduce `:key` as an emergency bugfix for DOM re-ordering bugs.
3. **The Uncleaned Composable Trap:** An author builds a clean composable listening to `window.addEventListener('resize', ...)`, hiding the memory leak until the final interview tip notes that omitting `onScopeDispose()` leaves dangling listeners in single-page applications.
4. **The SSR Node.js Boundary Trap:** An author writes `localStorage.getItem('token')` inside `<script setup>` during client discussions, only to drop a truth-bomb during SSR that this immediately crashes the server process with `ReferenceError: localStorage is not defined`.

## 3. Adopted Prescriptive Remedies for vue-01

To prevent this distortion from day one, `vue-01` has integrated **Law 3 into `PEDAGOGICAL-CLARITY.md`** and item 3 of `AUTHOR-BRIEF.md`:

### 1. The Inverted Pyramid of Operational Reality
State the governing production condition upfront in Section 1 alongside the basic mechanism. Never present a naive pattern as a triumph and apologize for it later.

### 2. Compound Idioms Over Isolated Declarations
When a Vue primitive requires a companion declaration to be robust in production, teach them together as an indivisible compound idiom from the outset:
- `reactive()` destructuring $\to$ always paired with `toRefs()`.
- `v-for` list rendering $\to$ always paired with `:key`.
- Custom composable subscriptions $\to$ always paired with `onScopeDispose()` / `onUnmounted()`.
- Shallow state mutations $\to$ always paired with replacement or `triggerRef()`.
- Browser API access in isomorphic code $\to$ always guarded by `onMounted()`.

### 3. The Interview Tip as Architectural Synthesis
The `> [!TIP] **To impress the interviewer:**` callout must **never be an omission dump**. It must never introduce a fatal platform trap or missing rule for the first time. The interview tip is reserved strictly for high-level architectural synthesis: comparing Vue's push-based reactivity with React's pull reconciliation, evaluating memory vs CPU performance trade-offs, and discussing large-scale enterprise system design.
