# Brief 03 — Image Pipeline Governance & Instruction Prescription

Date: 2026-09-16 · Number: 03 · Status: active / canon

## 1. Executive Summary & Why We Are Updating

During the production of Lecture 02 in `diagram-lab/output/react-lecture-02/lab/01-forensic-investigator/`, our initial automated image generation workflow encountered three critical failure modes:
1. **Perspective & Typographic Scale Distortion (The Auto-Zoom Pathology):** When an image description contained low information density (e.g., 2–3 nodes in `02_01`), the diffusion generator automatically zoomed in by ~2.5× to fill the 3:2 canvas, inflating node cards to 70% canvas height and rendering balloon headline letters.
2. **Aesthetic Invariant Erosion (Prompt Pollution):** Attempting to force both high-density interview facts and styling instructions into single ad-hoc generation prompts overwhelmed the diffusion model's latent attention, causing it to discard core aesthetic invariants (dropping purple dashed strokes, omitting circular waypoint dots, generating nested solid peach containers, and drawing scribbled document clip-art).
3. **API Rate-Limiting / 429 Quota Exhaustion:** Automated generation via `gemini-3.1-flash-image` hit hard server-side quotas (`429 RESOURCE_EXHAUSTED`), halting agent execution for multiple hours.

### The Breakthrough Solution
We transitioned to a **Two-Tier Structured Prompting & Manual Intake Workflow**:
- Pure spatial descriptions are authored in `images-md/`.
- Assembled two-part prompts (`## Description` + `## Design Theme`) are compiled into a dedicated `images-md-prompt/` folder.
- Images are generated externally in **Google Flow** and placed manually into modular lecture subfolders: `images/{lecture_num:02d}/{seq:02d}.jpeg`.
- A test-drive on Lecture 02 ([01.jpeg](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/lab/01-forensic-investigator/images/02/01.jpeg) through [05.jpeg](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/lab/01-forensic-investigator/images/02/05.jpeg)) proved that this workflow achieves 10/10 publication-grade consistency, flawless 2D orthogonal perspective, identical typographic scale, and 100% aesthetic compliance.

This brief outlines **everything that must be codified across the instruction suite** to make this workflow permanent and airtight.

---

## 2. Comprehensive Gap Analysis: What Must Be Done to the Instructions

Under the **Holistic Instruction Integration Law** (enshrined in `instructions/lecture-creation/00-project-governance.md` and `AGENTS.md`), isolated local patches are strictly banned. Every new rule must undergo an Ecosystem Impact Audit and be atomically synchronized across all documentation layers in a single pass.

Below is the complete inventory of updates required across the codebase:

### Layer A: Master Aesthetic Template (`prompts/image_prompt_01.md`)
*Current State:* Contains Sections 1 through 4 (Palette, Container Architecture, Component Nodes, Composition). Lacks explicit camera distance, scale laws, and anti-clip-art enforcement.
*Required Additions:*
1. **Section 5: Uniform Camera Perspective & Scale Law (The Anti-Zoom Invariant):**
   - **Strict Orthogonal Camera:** Flat 2D top-down orthogonal schematic view from a standardized, fixed camera distance. Zero isometric angle, zero 3D tilt, zero perspective distortion.
   - **Fixed Modular Scale:** All rectangular nodes must occupy compact dimensions (maximum 20%–25% of container height).
   - **The Low-Density Negative Space Law:** When a diagram features few elements (e.g., 2 or 3 nodes), the generator must NEVER zoom in or enlarge nodes/text to fill the canvas. Elements must occupy a compact central band with wide lavender negative space above and below.
   - **Typographic Uniformity:** All text must render in small editorial monospace font (titles 16px, labels 12px–14px equivalent).
2. **Anti-Clip-Art & Anti-Scribble Ban (Section 3):**
   - Explicitly forbid hand-drawn document sheets, scribbled icons, or glyphs (`<..>`, `</>`). Every entity must be a clean, geometric peach rectangular card.
3. **Connector Invariant Reinforcement (Section 3):**
   - Reiterate that ALL connecting lines must be dashed purple (`stroke 2px`, `stroke-dasharray "6 6"`, `#8a5af7`) with a centered solid purple waypoint dot (`10px` diameter). Solid lines are strictly prohibited.
4. **Delicate Dashed Grouping Law Reinforcement (Section 2):**
   - Sub-groups, lanes, or trees must be demarcated ONLY by delicate dashed purple lines (`1.5px`) with zero background fill. Nested solid-fill containers (e.g. peach boxes inside lavender) are permanently banned.

---

### Layer B: Image Creation Operational Constitution (`instructions/image-creation/01-uncertainty-audit-and-prompt-engineering.md`)
*Current State:* Assumes automated tool calls via `generate_image`, only recognizes `images-md/` and `images/`, and lacks the perspective invariant.
*Required Additions:*
1. **Codify the 3-Directory Architecture (Section 4):**
   - `lab/<path>/images-md/{NN}_{seq}_{slug}.md`: Pure spatial description text (1 unformatted paragraph, zero visual styling directives, high-yield interview topology).
   - `lab/<path>/images-md-prompt/{NN}_{seq}_{slug}.md`: The compiled two-part prompt file ready for copy-paste into Google Flow (`## Description` + `## Design Theme`).
   - `lab/<path>/images/{NN:02d}/{seq:02d}.jpeg`: The destination folder for finished manual image assets.
2. **Codify Invariant 5 in Section 5:**
   - Add **"The Uniform Camera Perspective & Scale Invariant"** to the existing 4 visual invariants (Pure White Bleed, Singular Container, Delicate Dashed Grouping, Centered Internal Titles).
3. **Overhaul the 4-Stage Operational Lifecycle (Section 6):**
   - **Stage (a) - Cognitive Friction Scan & Spatial Prompting:** Author pure spatial descriptions in `images-md/` with bounded coordinates and high-yield interview anchors.
   - **Stage (b) - Authoritative Lexical Verification & Markdown Baptism:** Audit terms against official React 19 documentation; add `> [svg image] ...` notes in `{NN}.md` to introduce every diagram term before the figure.
   - **Stage (c) - Prompt Compilation in `images-md-prompt/` & Manual Generation:** Assemble the prompt in `images-md-prompt/` containing `## Description` and `## Design Theme`. The human author pastes this into Google Flow, saves the result into `images/{NN:02d}/{seq:02d}.jpeg`. Automated `generate_image` calls are removed from this track.
   - **Stage (d) - Lecture Markdown Embedding & Lab Build:** Embed the image using `![Caption](images/{NN:02d}/{seq:02d}.jpeg)`, build the lab via `node lab/build-lab.mjs {path_num}`, and visually verify the PDF.

---

### Layer C: Track 2 Workflow Prompts (`instructions/image-creation/prompts/images.md`)
*Current State:* Contains legacy prompts referencing obsolete single-stage image execution.
*Required Additions:*
- Update the prompt recipes to guide agents through:
  1. Authoring spatial descriptions in `images-md/`.
  2. Compiling the complete prompt files in `images-md-prompt/`.
  3. Pausing for human asset intake in `images/{NN}/`.
  4. Updating lecture markdown links and building the lab PDF.

---

### Layer D: Master Instructions Architecture (`instructions/README.md`)
*Current State:* Track 2 references only `images-md/` and `generate_image`.
*Required Additions:*
- Update Track 2 scope to reflect the 3-folder architecture (`images-md/`, `images-md-prompt/`, `images/{NN}/`).
- Document the external generation workflow (Google Flow) and the anti-zoom scale invariant.

---

### Layer E: Root Workspace Constitution (`AGENTS.md`)
*Current State:* Mentions the 4-Stage Image Lifecycle with automated `generate_image` and `lab/<path>/images/` flat placement.
*Required Additions:*
- Under **React Interview Lectures (`diagram-lab/output/react-lecture-02`)**:
  - Update the 4-Stage Image Lifecycle to reflect the `images-md-prompt/` compilation and manual intake into `images/{NN:02d}/{seq:02d}.jpeg`.
  - Formally record the **Anti-Zoom / Uniform Camera Perspective Law**, the **Delicate Dashed Grouping Law**, and the **No-Clip-Art Law**.

---

### Layer F: Lecture Creation Governance (`instructions/lecture-creation/00-project-governance.md` & `AUTHOR-BRIEF.md`)
*Current State:* Refers generally to images in `images/`.
*Required Additions:*
- Standardize the canonical markdown image embed path across Track 1 and Track 2 as:
  ```markdown
  ![Descriptive Alt Text](images/{NN:02d}/{seq:02d}.jpeg)
  ```

---

## 3. Summary of Files to Modify in the Synchronization Pass

| File Path | Component Area | Target Modification |
| :--- | :--- | :--- |
| [`prompts/image_prompt_01.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/prompts/image_prompt_01.md) | Master Theme | Add Section 5 (Perspective & Scale Law), anti-clip-art ban, dashed path rules. |
| [`instructions/image-creation/01-uncertainty-audit-and-prompt-engineering.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/image-creation/01-uncertainty-audit-and-prompt-engineering.md) | Track 2 Governance | Add `images-md-prompt/`, Invariant 5, overhaul Stage (c) for Google Flow manual intake. |
| [`instructions/image-creation/prompts/images.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/image-creation/prompts/images.md) | Prompt Templates | Update agent prompt recipes to reflect the new two-part compilation workflow. |
| [`instructions/README.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/README.md) | Master Dispatcher | Harmonize Track 2 description with the 3-folder architecture and manual intake. |
| [`AGENTS.md`](file:///Users/techton/lechton/research-code/bookwriter/AGENTS.md) | Workspace Rules | Update React Interview Lectures section with new image paths, perspective laws, and intake flow. |
| [`instructions/lecture-creation/00-project-governance.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/instructions/lecture-creation/00-project-governance.md) | Track 1 Governance | Document canonical image link syntax (`images/{NN:02d}/{seq:02d}.jpeg`). |
| [`AUTHOR-BRIEF.md`](file:///Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/AUTHOR-BRIEF.md) | Author Brief | Synchronize image file path expectations. |
