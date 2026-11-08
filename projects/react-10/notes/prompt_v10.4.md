Lesson NN = 14
skill version SV = v10.4

## Goal & Workspace Rules
- Work in `projects/react-10` on **River Version (`v1`) Lesson `{NN}`** (bank row `{NN}` in `questions/questions.md`).
- Use only the skills in `skills/{SV}/` (start with `skills/{SV}/README.md`).
- Never read the **Original Version** maps, drafts, lectures, or skills in `projects/react-09` (its `v1` folders and `skills/v9.x/v1/`).
- Follow the workspace law in `AGENTS.md`:
  - Zero em-dashes
  - Zero hard-wraps
  - TTS-safe prose
- Never overwrite, delete, or hand-move an existing lecture or draft file. If any file this prompt would write already exists, stop and tell me so I can retire it with `archive_lecture.py` first.
- Do not commit anything.

---

## Step 1: Principle Map (written by you in this thread)
- **Target file**:
  - `01-01-map-principles/v1/{NN}.md`
- **Skills to load**:
  - `skills/{SV}/v1/map/SKILL.md`
  - `skills/{SV}/v1/writing/SKILL.md`
- **Inputs to read**:
  - Bank row `{NN}` in `questions/questions.md`
  - Syllabus card `01-01-map/{NN}.md` (if the card does not exist, work from the bank row and note that in the report)
  - Official React corpus
- **What to do**:
  - If `01-01-map-principles/v1/{NN}.md` already exists, check it against Section 6 of `skills/{SV}/v1/map/SKILL.md`. Keep it if it passes, or stop and list the failures if it fails.
  - If it does not exist, take every runtime behavior and exact string from the official React corpus, mark a string the corpus does not give as `unconfirmed`, write the map under those two skills, and pass the Completion Gate. The runtime check happens in Step 4, on the lecture.
  - Keep facts only in the map (never drafted lecture sentences).

---

## Step 2: First Draft (in a new Argon thread in High mode)
- **Thread setup**:
  - Use `synara_capabilities` to pick the exact **Argon** provider and model (never guess a slug).
  - Set reasoning effort / mode to **High** (`high`).
  - Create a new Synara thread with the message below and wait until it finishes:

> Work in `projects/react-10` on River Version (`v1`) Lesson `{NN}`.
>
> **1. Load these skills first** (never read Original Version files from `projects/react-09`):
> - `skills/{SV}/README.md`
> - `skills/{SV}/v1/writing/SKILL.md`
> - `skills/{SV}/v1/figures/SKILL.md`
> - `skills/{SV}/v1/check/SKILL.md` (Step A)
>
> **2. Read these inputs**:
> - The lectures listed in `skills/{SV}/v1/writing/SKILL.md` Section 9
> - The principle map at `01-01-map-principles/v1/{NN}.md`
>
> **3. Write the first draft**:
> - Write the whole lecture from top to bottom, one principle at a time, to:
>   - `01-01-md-DRAFT-lectures/v1/{NN}.md`
> - If that file already exists, stop and say so.
> - Run `check` Step A and fix anything that fails.
> - Do not run the build, and do not write `01-02-md-LECTURES/v1/{NN}.md`.
>
> **4. Report briefly**:
> - Absolute file URL of `01-01-md-DRAFT-lectures/v1/{NN}.md`
> - What you fixed
> - Anything that failed

---

## Step 3: Final Lecture (in a second new Argon thread in High mode)
- **Thread setup**:
  - Create a **second** fresh Synara thread (one that did not write the draft) using the exact **Argon** provider and model in **High** (`high`) mode, and wait until it finishes:

> Work in `projects/react-10` on River Version (`v1`) Lesson `{NN}`.
>
> **1. Load these skills first** (never read Original Version files from `projects/react-09`):
> - `skills/{SV}/README.md`
> - `skills/{SV}/v1/writing/SKILL.md`
> - `skills/{SV}/v1/figures/SKILL.md`
> - `skills/{SV}/v1/check/SKILL.md` (Step B)
>
> **2. Write the final lecture from the draft**:
> - Read the first draft at:
>   - `01-01-md-DRAFT-lectures/v1/{NN}.md` (leave the draft file unchanged)
> - Rewrite it from top to bottom into:
>   - `01-02-md-LECTURES/v1/{NN}.md`
> - Follow `check` Step B: make dense text plain, and add every missing explanation and missing step, even when the lecture gets longer.
> - If `01-02-md-LECTURES/v1/{NN}.md` already exists, stop and say so.
>
> **3. Answer the questions in `writing` Section 11** and fix anything that fails. Do not run the build; Step 4 builds after the runtime check.
>
> **4. Report briefly**:
> - Absolute file URL of the lecture `.md`
> - What you fixed
> - Anything that failed

---

## Step 4: Runtime Check & Build (in a third new Opus thread in High mode)
- **Thread setup**:
  - Create a **third** fresh Synara thread using the exact **Opus** provider and model in **High** (`high`) mode, and wait until it finishes:

> Work in `projects/react-10` on River Version (`v1`) Lesson `{NN}`.
>
> **1. Load these first**:
> - `skills/{SV}/README.md`
> - `skills/{SV}/v1/check/SKILL.md` (Step C)
> - `skills/{SV}/v1/figures/SKILL.md`
> - `skills/{SV}/v1/writing/SKILL.md`
> - `lab/README.md`
>
> **2. Check the lecture against React**:
> - Read `01-02-md-LECTURES/v1/{NN}.md` and list every runtime claim: code blocks, previews, `devconsole` and `overlay` blocks, quoted warnings and errors, and sentences about what React, the browser, or Vite does.
> - Write cases in `lab/cases/{NN}/` and run them with `node lab/check.mjs`. Use the installed `lab/`; do not create another React project.
> - Fix the lecture in place where it differs from the report, in the plain voice of `writing`, and run the changed cases again.
>
> **3. Run the rest of `check` Step C**: the build, the link check, and the files. Write `lab/reports/{NN}.md` last.
>
> **4. Report briefly**:
> - Absolute file URLs of `lab/reports/{NN}.md`, the lecture `.md`, the `.html`, and the `.pdf`
> - What you fixed
> - Anything that failed

---

## Guardrails & Final Report
- Do not write the draft or the lecture yourself, and never pass your own wording for the lecture to the Argon threads.
- If you cannot create or wait for a Synara thread, stop after Step 1 and print the Step 2, Step 3, and Step 4 messages so I can paste them into new threads myself.
- **In your final report, list**:
  - Absolute file URL of the map: `01-01-map-principles/v1/{NN}.md` (and whether it was new or reused)
  - Absolute file URL of the first draft: `01-01-md-DRAFT-lectures/v1/{NN}.md`
  - Absolute file URL of the final lecture: `01-02-md-LECTURES/v1/{NN}.md`
  - Absolute file URL of the HTML: `01-03-md-lectures-HTML/v1/{NN}.html`
  - Absolute file URL of the PDF: `01-04-md-lectures-PDF/v1/{NN}.pdf`
  - Absolute file URL of the check report: `lab/reports/{NN}.md`
  - Short reports from the three threads, plus anything that failed or was skipped
