# 03 — Invariant 3: Harmonious Step Rhythm & Explanatory Proximity

Every technical section of the lecture follows an unbending pedagogical cadence. This rhythm prevents cognitive overload, eliminates layout collisions in PrinceXML, and ensures the reader never sees code without immediate visual and analytical grounding.

Every lecture in this curriculum must strictly obey Harmonious Step Rhythm.

---

## 1. The 4-Beat Measure

Every technical section follows an unbreakable 4-beat measure:

```
┌─────────────────────────────────────────────────────────────┐
│ BEAT 1: Introductory Framing Prose (2–3 concise sentences)  │
│         Establishes the problem and mechanical intent.      │
├─────────────────────────────────────────────────────────────┤
│ BEAT 2: Minimal Code Snippet (max 8–12 lines)               │
│         Shows the exact implementation in a macOS window.   │
├─────────────────────────────────────────────────────────────┤
│ BEAT 3: React Component Explorer (RCE) Figure               │
│         Visualizes the resulting UI, DOM, or data flow.     │
├─────────────────────────────────────────────────────────────┤
│ BEAT 4: Analytical Derivation & Authoritative Quotation     │
│         Deconstructs the engine mechanics with citations.   │
└─────────────────────────────────────────────────────────────┘
```

For multi-step lessons, repeat this 4-beat measure cleanly. In Section 1, Beat 3 is strictly mandatory (the opening code must never sit naked). For subsequent technical sections, Beat 3 is visual-first by default: prioritize showing a clean UI or comparison panel whenever code changes state or layout, while allowing purely analytical derivations, TypeScript definitions, or minor helpers to breathe naturally in prose.

---

## 2. Code Editor Window Fidelity

- **Top-Level macOS Window Chrome:** Every body code snippet renders inside a clean macOS editor window complete with traffic-light dots (red, yellow, green), an active filename tab (e.g. `title="CartDrawer.jsx"`), and clean line numbers.
- **End-of-Line Annotations:** Comments must live at the END of code lines (`// annotation`), never as standalone comment paragraphs inside the code block. Verdicts lead with `**RIGHT:**` and `**WRONG:**`.

---

## 3. Zero-Orphan-Syntax & Explanatory Proximity

- **8–12 Line Snippet Budget:** Body code snippets must never exceed 8 to 12 lines of active code. Dumping full multi-element component templates is strictly banned.
- **Zero Orphan Syntax:** Every declared prop, hook call, state variable, attribute, or parameter in a snippet MUST be explicitly named, unpacked, and mechanically justified in the surrounding prose. Never leave an unexplained prop sitting in the editor.
- **Ban on Back-to-Back Code Blocks:** Placing two code blocks consecutively without intervening explanatory prose is strictly prohibited. Every snippet must follow: `[Prose Framing] -> [Snippet (max 8-12 lines)] -> [Visual / Prose Derivation]`.

---

## 4. Strict 1:1 Code-to-Figure Synchronization

### A. The Component Code Synchronization Rule
Every component name, state variable, prop name, and UI label rendered in an RCE figure MUST appear in the code snippet directly above it. Never invent undeclared component names, arbitrary props, or phantom state values in the diagram.

### B. The Scaffolding Artifact Law (CLI Setup & Tooling Commands)
When Beat 2 is a project scaffolding command (e.g., `npm create vite@latest ...`, `npx create-next-app ...`), Beat 3 MUST display the exact, pristine out-of-the-box scaffolded state:
- **Sidebar:** Highlights the scaffolded entry file (`src/App.tsx` or `src/page.tsx`) alongside the minimal project tree (`index.html`, `vite.config.ts`, `package.json`, `src/main.tsx`).
- **Stage Canvas:** Renders the **canonical default starter demo** (e.g. `Vite + React`, the default starter counter button `count is 0`, and the prompt `Edit src/App.tsx and save to test HMR`).
- **Strict Ban on Future Custom Components:** It is strictly forbidden to display custom domain components (e.g., news desks, election counters, checkout drawers) in a scaffolding figure. Custom domain features may only appear in subsequent sections after the developer in the narrative actually opens their editor and authors them.

### C. The Law of Chronological Narrative Fidelity (The Arrow of Time)
An engineering lecture is a forward-moving narrative timeline. An RCE figure must strictly reflect the state of the codebase at that exact moment in time:
- A component cannot exist in the project file tree or on the explorer stage before it has been authored in the narrative.
- If an engineer has only run `npm create vite`, `LiveDesk.tsx` does not exist in the universe yet. Displaying it in the file tree or canvas is an anachronism (**Chronological Teleportation** / **Future Feature Leak**) that shatters cause-and-effect for the student.
- Progress step-by-step: first show the scaffolded template, then show the engineer opening the file to replace it with the domain feature.

---

## 5. The Target & Arrow Principle

Every event handler, hook, and prop is an arrow pointing at a target. Never discuss `onClick`, `onChange`, or state setters without explicitly showing both the triggering physical DOM element and the state variable or action it modifies.

---

## ↳ EMBEDDED SELF-AUDIT GATE 3: HARMONIOUS RHYTHM & PROXIMITY

Before approving any section under Invariant 3, verify these 5 binary assertions:
- [ ] **1. 4-Beat Measure Integrity:** Does every `###` section strictly follow: Framing Prose (2–3 sentences) $\to$ Minimal Code $\to$ RCE Figure $\to$ Analytical Derivation?
- [ ] **2. 8–12 Line Snippet Budget:** Is every code snippet strictly 8 to 12 lines of active code, styled as a macOS editor window with a filename tab?
- [ ] **3. Zero Orphan Syntax:** Is every declared variable, hook parameter, prop, and attribute explicitly analyzed in the text? Are back-to-back code blocks 100% absent?
- [ ] **4. 1:1 Code-to-Figure Sync:** Does every token, variable, and prop in the figure exist in the code snippet directly preceding it?
- [ ] **5. Chronological Narrative Fidelity & Scaffolding Check:** Does the figure strictly represent what has been authored up to this exact point? If Beat 2 is a scaffolding CLI command, does Beat 3 show the pristine default starter template (`src/App.tsx` with default counter) rather than leaking unwritten custom domain features?
