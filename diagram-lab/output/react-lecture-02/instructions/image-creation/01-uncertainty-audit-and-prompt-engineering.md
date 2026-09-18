# 01 — Cognitive Uncertainty Audit & Image Prompt Engineering (react-lecture-02)

This document is the operational specification and creative standard for the **Image Creation AI Iteration**. This AI iteration operates exclusively after a lecture has been drafted, focusing 100% of its cognitive capacity on identifying mental bottlenecks and generating minimalist, high-impact conceptual diagram descriptions.

---

## 1. The 4-Topic Minimum Cognitive Audit

When an AI iteration processes a lecture file (`md-lectures/{nn}.md` or `lab/<path>/{nn}.md`), it must first conduct a thorough pedagogical scan to isolate concepts that fall into two categories:

1. **Uncertain / Conflated Topics:** Concepts where the student intuitively blurs two fundamentally distinct ideas (e.g., confusing static HTML text files with the browser's live in-memory DOM tree; confusing function argument passing with immutable component props; confusing Virtual DOM with a browser iframe).
2. **Difficult to Grasp / Hidden Engine Machinery:** Concepts where internal runtime routines are invisible to the eye (e.g., imperative DOM query drift across multiple files; Fiber reconciler dual-tree diffing; state snapshot closure freezing; layout thrashing from interleaved DOM reads and writes).

> **MANDATORY AUDIT GATE: MINIMUM 4 TOPICS PER LECTURE**  
> Every lecture processed by this iteration must produce at least 4 distinct conceptual image descriptions. Never stop at 1 or 2 high-level diagrams.

---

## 2. Creative Minimization: Unbloating to the Essential Core

The supreme philosophy of this iteration is **Creative Minimization**:
- **Strip the Syntax:** Never describe lines of JSX, curly braces, or JavaScript statements inside an image prompt.
- **Find the Mechanical Topology:** Identify the core spatial relationship that explains the concept:
  - Is it a comparison between two parallel trees of information?
  - Is it two opposing horizontal vectors showing request and response?
  - Is it a single central authority broadcasting state to multiple perimeter subscriber nodes?
  - Is it a sequential pipeline where an intermediate filter catches a defect?
- **Restraint Over Complexity:** Include only the minimal number of geometric nodes, arrows, and pill badges necessary to cement the mental model. A student looking at the resulting diagram should grasp the distinction in under three seconds.

---

## 3. The Pure Spatial Description Standard

The prompt author must write a single, cohesive textual description describing the physical layout of the diagram:
- **What to Include:**
  - Spatial orientation (horizontal, vertical, symmetrical split, radial).
  - Shape and arrangement of nodes (e.g., rectangular endpoint blocks, circular hubs, hierarchical tree nodes).
  - Connections and pathways (e.g., parallel paths, opposing directional arrows, dashed connector lines with midpoint waypoint dots).
  - Exact text labels for nodes and floating pill badges (e.g., node labeled "HTML File", badge labeled "Browser Parser", node labeled "Live DOM Tree").
- **What to Strictly Exclude:**
  - **Zero Visual Aesthetic Directives:** Do NOT mention hex color codes (e.g. `#f4ecfd`, `#8a5af7`), font families, stroke widths, corner radii, or drop shadow styling. All visual aesthetics are governed by the standalone theme in [`lab/01-forensic-investigator/prompts/image_prompt_01.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/lab/01-forensic-investigator/prompts/image_prompt_01.md) and will be applied downstream.
  - **Zero Unexplained Acronyms or Metric Shorthand (The Anti-Acronym Ban):** Strictly forbid unexplained networking or system acronyms (`RTT`, `TTL`, `TTFB`, `MTU`, `CDN`, `P99`) and pseudo-math (`$3\times\text{ RTT}$`). Always use plain, tangible physical English describing what actually happens (e.g., "Three Round Trips Over the Internet" instead of "3x RTT"; "Single Parallel Server Query" instead of "1x RTT").
  - **The "Tired Reader with Headache" Test for Labels:** Every word on a card, pill badge, or lane header must pass the Oxford 3000 / CEFR B2 vocabulary test. A tired developer with a headache must understand every card in under two seconds without reaching for a computer networking dictionary.
  - **Zero Frame Metadata:** Do NOT include diagram titles, captions, figure numbers (e.g. "Figure 1"), or legend boxes.
  - **Zero Markdown Formatting:** Do NOT include markdown headers (`#`), bullet points, bold tags, or conversational intros in the prompt file.

---

## 4. Output File Format & Scoping Laws

1. **The 3-Directory Architecture:**
   - **Markdown Prompt Descriptions:** Must be saved in an `images-md/` directory inside the respective lab folder:
     ```
     lab/<path>/images-md/{lecture_num:02d}_{seq:02d}_{concept_slug}.md
     ```
     Contains strictly one unformatted paragraph of pure spatial description text.
   - **Compiled Google Flow Prompts:** Must be saved in a sibling `images-md-prompt/` directory:
     ```
     lab/<path>/images-md-prompt/{lecture_num:02d}_{seq:02d}_{concept_slug}.md
     ```
     Contains the two-part prompt formatted for instant copy-paste into Google Flow (`## Description` + `## Design Theme`).
   - **Rendered Image Assets:** Generated raster images are saved manually into lecture-numbered subdirectories in `images/`:
     ```
     lab/<path>/images/{lecture_num:02d}/{seq:02d}.jpeg
     ```

2. **File Naming & Directory Conventions:**
   ```
   images-md/{lecture_num:02d}_{seq:02d}_{concept_slug}.md         # pure description
   images-md-prompt/{lecture_num:02d}_{seq:02d}_{concept_slug}.md  # assembled Google Flow prompt
   images/{lecture_num:02d}/{seq:02d}.jpeg                         # finished image asset
   ```
   Examples for Lecture 02:
   - `images-md/02_01_vite_esm_dev_server.md`
   - `images-md-prompt/02_01_vite_esm_dev_server.md`
   - `images/02/01.jpeg`

3. **Pure Description Content Law:**
   Each `.md` file in `images-md/` must contain **strictly one unformatted paragraph of pure spatial description text**, focusing on topology, flow direction, and high-yield interview concepts, with zero mention of colors, hex codes, or font styling.

---

## 5. Visual Invariants for Print Bleed & Group Hierarchy

When authoring spatial descriptions and compiling generation prompts, the author must strictly enforce five visual invariants:

1. **The Pure White Print-Bleed Law:** The canvas background outside the diagram container must be strictly pure solid white (`#ffffff` / RGB 255, 255, 255). Never allow gray, cream, or off-white `#fcfcfc` margins, ensuring the artwork blends invisibly into physical book pages.
2. **The Singular Container Law:** The diagram frame has exactly one soft lavender tint (`#f4ecfd`) background signaling the outer boundary of the figure. **Never create mini-backgrounds, secondary tinted cards, or shaded horizontal strata planes inside the container.**
3. **The Delicate Dashed Grouping Law:** When elements form logical sub-clusters, trees, or comparison lanes, demarcate them using **delicate dashed perimeter lines** (1.5px dashed stroke in `#d2bbf6` or `#8a5af7`) or open whitespace geometry—**never tinted fill planes**.
4. **The Centered Internal Title Law:** Titles for internal blocks, sub-groups, trees, or comparison lanes MUST be horizontally CENTERED directly above or within their respective dashed perimeter or block, rendered in monospace uppercase with the **exact same vibrant purple accent color (`#8a5af7`)** used for connector lines. The top-left position is reserved strictly for overarching, whole-image indicative labels (if any).
5. **The Uniform Camera Perspective & Scale Law (The Anti-Zoom Invariant):**
   - **Strict Orthogonal Camera:** Flat 2D top-down orthogonal schematic view from a fixed, standardized camera distance. Zero isometric angle, zero 3D tilt, zero perspective distortion.
   - **Fixed Modular Scale:** All rectangular nodes must occupy compact dimensions (maximum 20%–25% of container height).
   - **The Low-Density Negative Space Law:** When a diagram features few elements (e.g., 2 or 3 nodes), the generator must NEVER zoom in and NEVER enlarge the nodes or typography to fill the canvas. Elements must occupy a compact central band with wide lavender negative space above and below.
   - **Typographic Uniformity:** All text across all diagrams must use the exact same small editorial monospace font scale (captions 11pt, labels 12px–14px, titles 16px equivalent). Never render oversized headline-scale letters.
   - **Anti-Clip-Art Invariant:** Strictly forbid hand-drawn document sheets, scribbled icons, or glyphs (`<..>`, `</>`). Every entity is a clean, geometric peach rectangular card.
   - **Mandatory Dashed Paths:** All connector lines must be dashed purple (`#8a5af7`, `stroke-dasharray "6 6"`) with a solid 10px circular waypoint dot centered at their midpoint. Solid connector lines are banned.

---

## 6. The 4-Stage Operational Lifecycle & Lexical Audit Law

Every image creation iteration must execute the following 4 stages in strict chronological order:

### Stage (a): Cognitive Friction Scan & Spatial Prompting (`images-md/`)
- Scan the lecture text to isolate at least 4 mental bottlenecks (uncertain distinctions or hidden engine routines).
- Author pure spatial descriptions with bounded coordinates and high-yield interview anchors in `images-md/{lecture_num:02d}_{seq:02d}_{slug}.md`.

### Stage (b): Authoritative Lexical Verification & The "Diagram Serves the Lecture" Law
- **CRITICAL PREREQUISITE: This stage MUST occur BEFORE generating or rendering any image.**
- **The "Diagram Serves the Lecture" Law (Closing the Guide-Note Backdoor):**
  - A diagram exists solely to illustrate what the lecture body has ALREADY taught in accessible B2 English.
  - The diagram must NEVER introduce concepts, formulas, or abbreviations that are absent from the lecture.
  - **THE GUIDE-NOTE BACKDOOR BAN:** The `> [svg image]` guide note is strictly for brief visual framing (e.g. summarizing the visual comparison). **Using the guide note as a dumping ground or cheat code to smuggle unbaptized technical jargon, networking metrics, or formulas (`RTT`, `TTFB`, `$3\times\text{ RTT}$`) into the text is strictly forbidden.** If a diagram concept requires terms not already explained in the lecture prose, you must simplify the diagram in `images-md/` to use plain English, NOT force jargon into the lecture text.
- **The Strict Official Documentation Jargon Law:**
  - Audit every technical term, node label, and badge in the spatial description against official documentation (`documentation official/React 19 Sept 2026/react.dev/`, MDN, WHATWG/W3C).
  - ONLY technical jargon that is standard, explicitly found in official documentation, AND accessible at the B2 CEFR level is permitted.
  - **NO INVENTED OR ALLEGORICAL PSEUDO-TERMS:** Metaphorical engineering terms not found in official documentation (such as "Automated Delta Auditor") are strictly prohibited.
  - **NO OBSCURE NETWORKING/CS ACRONYMS:** Never import low-level infrastructure abbreviations (`RTT`, `TTL`, `P99`, `MTU`) onto diagram cards or badges.
- **The "Every Term Must Be Explicit in the Text First" Invariant:**
  - **EVERY TECHNICAL TERM IN THE IMAGE MUST BE EXPLICIT IN THE TEXT BEFORE THE IMAGE.**
  - No diagram may introduce technical vocabulary that the student has not already encountered in the preceding prose.
  - Diagram guide notes must be written in plain B2 English with ZERO LaTeX math formulas (`$...$`):
    ```markdown
    > [svg image] In production, React's **Reconciliation** diffing calculates the precise changes across the component tree, executing a single **Batched DOM Commit** to shield the browser from **Layout Thrashing** and redundant reflows.
    ```

### Stage (c): Prompt Compilation in `images-md-prompt/` & External Generation
- **Compile Ready-to-Copy Prompts:**
  Create `lab/<path>/images-md-prompt/{lecture_num:02d}_{seq:02d}_{slug}.md` containing the two standardized sections:
  ```markdown
  ## Description

  <pure spatial description from images-md/>

  ## Design Theme

  <complete design system from prompts/image_prompt_01.md including Section 5 Perspective & Scale Law>
  ```
- **External Generation & Manual Intake:**
  - The author copies the compiled prompt into **Google Flow** (or equivalent high-fidelity image tool).
  - Save the resulting high-resolution asset into the lecture's dedicated image directory:
    ```
    lab/<path>/images/{lecture_num:02d}/{seq:02d}.jpeg
    ```

### Stage (d): Lecture Markdown Embedding & Lab Build Verification
- **Embed in Lecture:** Once the asset exists in `images/{lecture_num:02d}/{seq:02d}.jpeg`, embed it into `{lecture_num:02d}.md` with the diagram image placed first, directly followed by its numbered diagram callout:
  ```markdown
  ![Descriptive Title](images/{lecture_num:02d}/{seq:02d}.jpeg)

  > [svg image] Brief summary of the visual mechanism in plain B2 English...
  ```
  The compiler automatically styles the callout as a diagram card under the image, numbered sequentially as `Diagram {lecture}.{n}` with an architecture node-tree SVG icon, with page-break-avoidance rules preventing split pages.
- **Compile the Laboratory:** Run `node lab/build-lab.mjs {path_num}`.
- **Visual Verification:** Inspect rendered PDF pages to confirm 1:1 code-figure synchronization, centered internal titles, singular container boundaries, and pure white paper bleed. Purge all temporary inspection PNGs.
