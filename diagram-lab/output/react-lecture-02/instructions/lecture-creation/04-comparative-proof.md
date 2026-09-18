# 04 — Invariant 4: Comparative Proof & Visual Substrate

A feature's purpose is only clear when the student sees what breaks when it is missing. Truth is established through disciplined contrast.

Every lecture in this curriculum must strictly obey Comparative Proof and the Visual Substrate standard.

---

## 1. The High-Stakes Failure Wall (Organic Lexical Audit)

Never introduce a React feature simply because it exists in the API. Put the student in front of a high-stakes failure wall where omitting the feature causes silent data corruption, stale closures, layout thrashing, or an infinite re-render loop. The student must feel that without this tool, their production application will crash.

---

## 2. Symmetrical Duels & The Inverted Pyramid of Truth

Never guide the student down a naive garden path only to reveal pages later that the code was broken.
- **Upfront Compound Idioms:** Teach companion patterns together from line one:
  - Teach `useState` with functional updaters (`setCount(c => c + 1)`) when state depends on previous state.
  - Teach `useEffect` with its mandatory cleanup return function.
  - Teach controlled inputs with `value` and `onChange` together.
  - Teach list rendering with database IDs (`key={item.id}`) from the very first snippet.
- **Symmetrical Code Duels:** Contrast broken and correct patterns using side-by-side or consecutive ` ```jsx wrong ` and ` ```jsx right ` blocks, preceded by `**DO NOT DO THIS:**` and `**DO THIS:**`.
- **The Interview Tip as Architectural Synthesis:** The `> [!TIP] **To impress the interviewer:**` callout must **never introduce new operational facts, syntax, or platform gotchas for the first time**. The tip is reserved exclusively for high-level architectural synthesis: comparing React's pull reconciliation to Vue's push reactivity, analyzing memory vs CPU trade-offs, or articulating the business impact of migration decisions.

---

## 3. The "Never Text-Only" Law (Anti-Ugly Gate & Visual Substrate)

A figure is an illustration of spatial, temporal, mechanical, or physical reality. Wrapping plain bullet lists, text paragraphs, or tables in borders without an authentic diagram is **strictly forbidden**.
- **Authentic Graphical Substrate:** Every figure must feature real UI controls, Fiber reconciliation pointers, state dispatch tracks, or component hierarchy trees.
- **React Component Explorer (RCE) Standard:**
  - macOS window chrome with red, yellow, green window dots and title bar.
  - Left Sidebar (28–30%): Project file tree with `.jsx`/`.tsx` badges and `.active` component pill.
  - Right Live Stage (70%): Component boundary tag, props chips, and authentic rendered UI.
  - Palette: React Cyan (`#087ea4`, `#149eca`), Slate (`#0f172a`, `#23272f`), Emerald (`#059669`), Crimson (`#9f1239`).
  - The Rule of 3: Collection renders show strictly 3 items (mathematically sufficient; zero clutter).
  - Height Budget: 380px–420px total height for seamless single-page fit.

---

## ↳ EMBEDDED SELF-AUDIT GATE 4: COMPARATIVE PROOF & VISUAL SUBSTRATE

Before approving any section under Invariant 4, verify these 4 binary assertions:
- [ ] **1. High-Stakes Wall Grounding:** Is the feature justified by a concrete production catastrophe (data corruption, stale closure, infinite loop) rather than abstract convenience?
- [ ] **2. Upfront Compound Idioms:** Are companion patterns (updater functions, cleanup returns, keys) taught upfront without delayed truth-bombs?
- [ ] **3. Clean Symmetrical Duels:** Do wrong/right blocks use clean ` ```jsx wrong ` / ` ```jsx right ` fences under `**DO NOT DO THIS:**` / `**DO THIS:**` without inline comments?
- [ ] **4. Genuine Graphical Substrate:** Does every figure contain an authentic graphical substrate (RCE window, state chips, component trees) with zero text-only bordered cards?

---

## The Zero-Defect Production Pipeline Gate (Mechanical Build Rigor)

Even a pedagogically brilliant lecture is defective if it violates publication formatting or fails automated compilation. Every lecture must pass this final mechanical gate:

- [ ] **1. Official Citation Verification:** Does the lecture include at least one verbatim quote cited strictly from `documentation official/React 19 Sept 2026/react.dev/src/content/...` (or `resources/...`)?
- [ ] **2. Zero Prince Compiler Warnings:** Does `node src/build-lectures.mjs` execute with **ZERO warnings**? (`warn` is a defect).
- [ ] **3. Single-Line Wrapping:** Is every paragraph, bullet point, and callout formatted on a single continuous line (zero hard-wrapping)?
- [ ] **4. Zero Em-Dashes:** Are em-dashes (`—` or `--`) 100% purged from prose, code, and headings?
- [ ] **5. Closing Table Formatting:** Is the closing comparison table strictly 3 columns, with header `**TITLE**<br>(subtitle)` and divider `| ---: | :--- | :--- |`?
- [ ] **6. Inspection Image Cleanup:** Are all temporary inspection PNGs purged from the workspace via `node src/clean-inspection-images.mjs`?
