Lesson NN = 14
skill version SV = v11.3

## Goal & Workspace Rules
- Work in `projects/react-11` on **River Version (`v1`) Lesson `{NN}`** (bank row `{NN}` in `questions/questions.md`).
- Use only the skills in `skills/{SV}/` (start with `skills/{SV}/README.md`).
- Never read the **Original Version** maps, drafts, lectures, or skills in `projects/react-09` (its `v1` folders and `skills/v9.x/v1/`).
- Follow the workspace law in `AGENTS.md`:
  - Zero em-dashes
  - Zero hard-wraps
  - TTS-safe prose
- Never overwrite, delete, or hand-move an existing prelecture or lecture file. If any file this prompt would write already exists, stop and tell me so I can retire it with `archive_lecture.py` first.
- Do not commit anything.

---

## Step 1: Prelecture (written by you in this thread)
- **Target file**:
  - `01-01-md-PRE-lectures/v1/{NN}.md`
- **Skills to load**:
  - `skills/{SV}/prelecture/SKILL.md`
  - `skills/{SV}/definitions/SKILL.md`
  - `skills/{SV}/lecture/SKILL.md`
  - `skills/{SV}/titles/SKILL.md`
  - `skills/{SV}/intro/SKILL.md` (and its three intros: `14.md`, `15.md`, `16.md`)
  - `skills/{SV}/examples/SKILL.md`
- **Inputs to read**:
  - Bank row `{NN}` in `questions/questions.md`
  - Syllabus card `01-01-map/{NN}.md` (if the card does not exist, work from the bank row and note that in the report)
  - The earlier lectures in `01-02-md-LECTURES/v1/` that define the ideas this lesson reminds
  - Official React corpus
- **What to do**:
  - Write the prelecture under those skills, part by part, in the order of Section 5 of `prelecture/SKILL.md`.
  - Write the definitions in full, in the owner's voice. Keep every other part as short facts.

---

## Step 2: Prelecture Check (in this thread)
- **Skills to load**:
  - `skills/{SV}/check/SKILL.md` (Step A)
- **What to do**:
  - Run Step A: check every definition and rule against the documentation, and fix the prelecture where the documentation differs. Do not run any code.

---

## Step 3: The Owner Reads the Prelecture
- Stop here. Give me the absolute file URL of the prelecture, the list of its definitions and principles, and anything that failed in the check.
- Wait for my approval before Step 4. If I wrote "ppp", go on without waiting.

---

## Step 4: Lecture (in a new Argon thread in High mode)
- **Thread setup**:
  - Use `synara_capabilities` to pick the exact **Argon** provider and model (never guess a slug).
  - Set reasoning effort / mode to **High** (`high`).
  - Create a new Synara thread with the message below and wait until it finishes:

> Work in `projects/react-11` on River Version (`v1`) Lesson `{NN}`.
>
> **1. Load these skills first** (never read Original Version files from `projects/react-09`):
> - `skills/{SV}/README.md`
> - `skills/{SV}/lecture/SKILL.md`
> - `skills/{SV}/definitions/SKILL.md`
> - `skills/{SV}/intro/SKILL.md` (and its three intros: `14.md`, `15.md`, `16.md`)
> - `skills/{SV}/examples/SKILL.md` (read the entry closest to this lesson before writing the opening)
> - `skills/{SV}/clarity/SKILL.md` (write every paragraph by its checklist)
> - `skills/{SV}/moves/` (all five files)
> - `skills/{SV}/figures/SKILL.md`
> - `skills/{SV}/titles/SKILL.md`
> - `skills/{SV}/check/SKILL.md` (Step B)
>
> **2. Read these inputs**:
> - The lectures listed in `skills/{SV}/lecture/SKILL.md`, *Lectures to read for their sound*
> - The prelecture at `01-01-md-PRE-lectures/v1/{NN}.md` (leave it unchanged)
>
> **3. Write the lecture**:
> - Write the whole lecture from top to bottom, from the prelecture, to:
>   - `01-02-md-LECTURES/v1/{NN}.md`
> - Use the prelecture's definitions as written, its names, its screen, and its Order part.
> - The titles: start the example page with `## SECTION |`, every principle with `## PRINCIPLE |`, and every "A vs. B" title with `## VS |`, as `lecture/SKILL.md` says.
> - If that file already exists, stop and say so.
> - Run `check` Step B and fix anything that fails.
> - Do not run the build.
>
> **4. Report briefly**:
> - Absolute file URL of `01-02-md-LECTURES/v1/{NN}.md`
> - What you fixed
> - Anything that failed

---

## Step 5: Second Read (in a second new Argon thread in High mode)
- **Thread setup**:
  - Create a **second** fresh Synara thread (one that did not write the lecture) using the exact **Argon** provider and model in **High** (`high`) mode, and wait until it finishes:

> Work in `projects/react-11` on River Version (`v1`) Lesson `{NN}`.
>
> **1. Load these skills first** (never read Original Version files from `projects/react-09`):
> - `skills/{SV}/README.md`
> - `skills/{SV}/lecture/SKILL.md`
> - `skills/{SV}/definitions/SKILL.md`
> - `skills/{SV}/clarity/SKILL.md`
> - `skills/{SV}/moves/` (all five files)
> - `skills/{SV}/figures/SKILL.md`
> - `skills/{SV}/titles/SKILL.md`
> - `skills/{SV}/check/SKILL.md` (Step C)
>
> **2. Read the lecture again and fix it in place**:
> - Read `01-02-md-LECTURES/v1/{NN}.md` and the prelecture at `01-01-md-PRE-lectures/v1/{NN}.md` (leave the prelecture unchanged).
> - Follow `check` Step C: make dense text plain, add every missing explanation and missing step, and keep each definition where the prelecture's Order part places it.
> - Check the titles: start the example page with `## SECTION |`, every principle with `## PRINCIPLE |`, and every "A vs. B" title with `## VS |`, as `lecture/SKILL.md` says.
>
> **3. Answer the questions in *Before you finish* in `lecture/SKILL.md`** and fix anything that fails. Do not run the build.
>
> **4. Report briefly**:
> - Absolute file URL of the lecture `.md`
> - What you fixed
> - Anything that failed

---

## Step 6: Runtime Check & Build (in a third new Opus thread in High mode)
- **Thread setup**:
  - Create a **third** fresh Synara thread using the exact **Opus** provider and model in **High** (`high`) mode, and wait until it finishes:

> Work in `projects/react-11` on River Version (`v1`) Lesson `{NN}`.
>
> **1. Load these first**:
> - `skills/{SV}/README.md`
> - `skills/{SV}/check/SKILL.md` (Step D)
> - `skills/{SV}/figures/SKILL.md`
> - `skills/{SV}/lecture/SKILL.md`
> - `lab/README.md`
>
> **2. Check the lecture against React**:
> - Read `01-02-md-LECTURES/v1/{NN}.md` and list every runtime claim: code blocks, previews, `devconsole` and `overlay` blocks, quoted warnings and errors, and sentences about what React, the browser, or Vite does.
> - Write cases in `lab/cases/{NN}/` and run them with `node lab/check.mjs`. Use the installed `lab/`; do not create another React project.
> - Fix the lecture in place where it differs from the report, in the plain voice of `lecture`, and run the changed cases again.
>
> **3. Run the rest of `check` Step D**: the build, the link check, and the files. Write `lab/reports/{NN}.md` last.
>
> **4. Report briefly**:
> - Absolute file URLs of `lab/reports/{NN}.md`, the lecture `.md`, the `.html`, and the `.pdf`
> - What you fixed
> - Anything that failed

---

## Guardrails & Final Report
- Do not write the lecture yourself, and never pass your own wording for the lecture to the Argon threads. The definitions in the prelecture are the only lecture text you write.
- If you cannot create or wait for a Synara thread, stop after Step 3 and print the Step 4, Step 5, and Step 6 messages so I can paste them into new threads myself.
- **In your final report, list**:
  - Absolute file URL of the prelecture: `01-01-md-PRE-lectures/v1/{NN}.md`
  - Absolute file URL of the lecture: `01-02-md-LECTURES/v1/{NN}.md`
  - Absolute file URL of the HTML: `01-03-md-lectures-HTML/v1/theme1/{NN}.html`
  - Absolute file URL of the PDF: `01-04-md-lectures-PDF/v1/theme1/{NN}.pdf`
  - Absolute file URL of the check report: `lab/reports/{NN}.md`
  - Short reports from the three threads, plus anything that failed or was skipped
