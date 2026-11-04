Lesson NN = 12
skill version SV = v9.4

## Goal & Workspace Rules
- Work in `projects/react-09` on **River Version (`v2`) Lesson `{NN}`** (bank row `{NN}` in `questions/questions.md`).
- Use only the skills in `skills/{SV}/` (start with `skills/{SV}/README.md`).
- Never read **Original Version (`v1`)** maps, drafts, lectures, or skills.
- Follow the workspace law in `AGENTS.md`:
  - Zero em-dashes
  - Zero hard-wraps
  - TTS-safe prose
- Never overwrite, delete, or hand-move an existing lecture or draft file. If any file this prompt would write already exists, stop and tell me so I can retire it with `archive_lecture.py` first.
- Do not commit anything.

---

## Step 1: Principle Map (written by you in this thread)
- **Target file**:
  - `01-01-map-principles/v2/{NN}.md`
- **Skills to load**:
  - `skills/{SV}/v2/map-principles/SKILL.md`
  - `skills/{SV}/v2/opening-essence/SKILL.md`
- **Inputs to read**:
  - Bank row `{NN}` in `questions/questions.md`
  - Syllabus card `01-01-map/{NN}.md` (if the card does not exist, work from the bank row and note that in the report)
  - Official React corpus
- **What to do**:
  - If `01-01-map-principles/v2/{NN}.md` already exists, check it against the Completion Gate of `skills/{SV}/v2/map-principles/SKILL.md`. Keep it if it passes, or stop and list the failures if it fails.
  - If it does not exist, verify every runtime behavior in headless Chrome, write the map under those two skills, and pass the Completion Gate.
  - Keep facts only in the map (never drafted lecture sentences).

---

## Step 2: First Draft (in a new Argon thread in High mode)
- **Thread setup**:
  - Use `synara_capabilities` to pick the exact **Argon** provider and model (never guess a slug).
  - Set reasoning effort / mode to **High** (`high`).
  - Create a new Synara thread with the message below and wait until it finishes:

> Work in `projects/react-09` on River Version (`v2`) Lesson `{NN}`.
>
> **1. Load these skills first** (never read `v1` files):
> - `skills/{SV}/README.md`
> - `skills/{SV}/v2/opening-essence/SKILL.md`
> - `skills/{SV}/v2/lecture-structure/SKILL.md`
> - `skills/{SV}/v2/lecture-voice/SKILL.md`
> - `skills/{SV}/v2/content-benchmarks/SKILL.md`
> - `skills/{SV}/v2/code-and-figures/SKILL.md`
> - `skills/{SV}/v2/verification/SKILL.md` (Stage A)
>
> **2. Read these inputs**:
> - The reference sections listed in `skills/{SV}/v2/content-benchmarks/SKILL.md` Section 1
> - The principle map at `01-01-map-principles/v2/{NN}.md`
>
> **3. Write the first draft**:
> - Write the whole lecture from top to bottom, one principle at a time, to:
>   - `01-01-md-DRAFT-lectures/v2/{NN}.md`
> - If that file already exists, stop and say so.
> - Run `verification` Stage A and fix anything that fails.
> - Do not run the build, and do not write `01-02-md-LECTURES/v2/{NN}.md`.
>
> **4. Report briefly**:
> - Absolute file URL of `01-01-md-DRAFT-lectures/v2/{NN}.md`
> - What you fixed
> - Anything that failed

---

## Step 3: Simplify & Build (in a second new Argon thread in High mode)
- **Thread setup**:
  - Create a **second** fresh Synara thread (one that did not write the draft) using the exact **Argon** provider and model in **High** (`high`) mode, and wait until it finishes:

> Work in `projects/react-09` on River Version (`v2`) Lesson `{NN}`.
>
> **1. Load these skills first** (never read `v1` files):
> - `skills/{SV}/README.md`
> - `skills/{SV}/v2/simplify/SKILL.md`
> - `skills/{SV}/v2/opening-essence/SKILL.md`
> - `skills/{SV}/v2/lecture-structure/SKILL.md`
> - `skills/{SV}/v2/lecture-voice/SKILL.md`
> - `skills/{SV}/v2/content-benchmarks/SKILL.md`
> - `skills/{SV}/v2/code-and-figures/SKILL.md`
> - `skills/{SV}/v2/verification/SKILL.md` (Stage B)
>
> **2. Simplify the draft into the final lecture**:
> - Read the first draft at:
>   - `01-01-md-DRAFT-lectures/v2/{NN}.md` (leave the draft file unchanged)
> - Simplify it from top to bottom into:
>   - `01-02-md-LECTURES/v2/{NN}.md`
> - Follow `simplify` and `opening-essence` (Moves 1–4, zero info bombs).
> - If `01-02-md-LECTURES/v2/{NN}.md` already exists, stop and say so.
>
> **3. Run Verification Stage B & Build**:
> - From `projects/react-09`, run:
>   - `node src/build-river.mjs {NN}`
>   - `node ../../tools/check-links.mjs`
> - Confirm that both outputs exist and have zero surveillance/link errors:
>   - `01-03-md-lectures-HTML/v2/{NN}.html`
>   - `01-04-md-lectures-PDF/v2/{NN}.pdf`
>
> **4. Report briefly**:
> - Absolute file URLs of the lecture `.md`, the `.html`, and the `.pdf`
> - What you fixed
> - Anything that failed

---

## Guardrails & Final Report
- Do not write the draft or the lecture yourself, and never pass your own wording for the lecture to the Argon threads.
- If you cannot create or wait for a Synara thread, stop after Step 1 and print the Step 2 and Step 3 messages so I can paste them into new Argon threads myself.
- **In your final report, list**:
  - Absolute file URL of the map: `01-01-map-principles/v2/{NN}.md` (and whether it was new or reused)
  - Absolute file URL of the first draft: `01-01-md-DRAFT-lectures/v2/{NN}.md`
  - Absolute file URL of the final lecture: `01-02-md-LECTURES/v2/{NN}.md`
  - Absolute file URL of the HTML: `01-03-md-lectures-HTML/v2/{NN}.html`
  - Absolute file URL of the PDF: `01-04-md-lectures-PDF/v2/{NN}.pdf`
  - Short reports from both Argon threads, plus anything that failed or was skipped
