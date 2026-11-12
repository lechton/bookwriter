Lesson NN = 14
skill version SV = v11.1

# Lecture prompt: Lesson `{NN}`, skills `{SV}`

Paste this prompt into a new chat, after I have read and approved the prelecture of Lesson `{NN}`. The prelecture has its own prompt, [prelecture_v11.1.md](prelecture_v11.1.md).

## What this chat does, overall

1. **Writes the lecture** `01-02-md-LECTURES/v1/{NN}.md`, from top to bottom, from the prelecture `01-01-md-PRE-lectures/v1/{NN}.md`.
2. **Reads it once as the tired reader** and fixes what fails, by *Before you finish* in `skills/{SV}/lecture/SKILL.md`.
3. **Builds the HTML** (and the PDF) of the lecture with `node src/build-river.mjs {NN}`.
4. **Stops**, and gives me the links to the lecture and to its HTML.

The check and the lab run come later, in a separate step.

## What to focus on

1. **The prelecture is the source.** The lecture uses the prelecture's definitions as written, its names, its screen, and its Order part. The prelecture stays unchanged.
2. **The tired reader.** Write for a reader who is tired and in a hurry, and who knows only what the earlier lessons taught and what this lecture has said so far, as `skills/{SV}/lecture/SKILL.md` says.
3. **The intro.** The lecture starts with the title, the short question under it, the interview question, and then the intro of `skills/{SV}/intro/SKILL.md`.
4. **One screen.** The lecture opens on the prelecture's screen and builds that same screen.
5. **Each definition once.** Each definition sits where the Order part places it, once, in a definition box or in the text, never in both.
6. **Plain words.** Every paragraph passes the checklist of `skills/{SV}/clarity/SKILL.md`. Only React and web words, and no invented words.
7. **The titles.** Start the example page with `## SECTION |`, every principle with `## PRINCIPLE |`, and every "A vs. B" title with `## VS |`, as `skills/{SV}/lecture/SKILL.md` says. The build turns these tags into the torn band, the principle badge, and the A vs B board.

## Workspace rules

- Work in `projects/react-11` on River Version (`v1`) Lesson `{NN}` (bank row `{NN}` in [questions/questions.md](../questions/questions.md)).
- Use only the skills in `skills/{SV}/` (start with [skills/{SV}/README.md](../skills/v11.1/README.md)).
- Do not read anything from `projects/react-09`.
- Follow the workspace law in [AGENTS.md](../../../AGENTS.md): zero em-dashes, zero hard-wraps, TTS-safe prose.
- Never overwrite, delete, or hand-move an existing prelecture or lecture file. If `01-02-md-LECTURES/v1/{NN}.md` already exists, stop and tell me so I can retire it with `archive_lecture.py` first.
- Do not commit anything.

---

## Step 1: Check that the prelecture is ready

- Check that `01-01-md-PRE-lectures/v1/{NN}.md` exists. If not, stop and tell me to run [prelecture_v11.1.md](prelecture_v11.1.md) first.
- Check that `01-02-md-LECTURES/v1/{NN}.md` does not exist yet. If it exists, stop and say so.

---

## Step 2: Load the skills

- [skills/{SV}/README.md](../skills/v11.1/README.md)
- [skills/{SV}/lecture/SKILL.md](../skills/v11.1/lecture/SKILL.md) (the whole file; *The parts of a lecture* gives the order and the title tags)
- [skills/{SV}/definitions/SKILL.md](../skills/v11.1/definitions/SKILL.md)
- [skills/{SV}/intro/SKILL.md](../skills/v11.1/intro/SKILL.md) and its three intros: [14.md](../skills/v11.1/intro/14.md), [15.md](../skills/v11.1/intro/15.md), [16.md](../skills/v11.1/intro/16.md)
- [skills/{SV}/examples/SKILL.md](../skills/v11.1/examples/SKILL.md) (read the entry closest to this lesson before writing the opening)
- [skills/{SV}/clarity/SKILL.md](../skills/v11.1/clarity/SKILL.md) (write every paragraph by its checklist)
- The five moves: [smallest-code-first.md](../skills/v11.1/moves/smallest-code-first.md), [side-by-side.md](../skills/v11.1/moves/side-by-side.md), [everyday-image.md](../skills/v11.1/moves/everyday-image.md), [steps-for-a-surprise.md](../skills/v11.1/moves/steps-for-a-surprise.md), [both-orders-first.md](../skills/v11.1/moves/both-orders-first.md)
- [skills/{SV}/figures/SKILL.md](../skills/v11.1/figures/SKILL.md) (code blocks, browser previews, file panels, principle cards, definition boxes)
- [skills/{SV}/titles/SKILL.md](../skills/v11.1/titles/SKILL.md)

---

## Step 3: Read the inputs

- The prelecture at `01-01-md-PRE-lectures/v1/{NN}.md` (leave it unchanged).
- The lectures listed in `skills/{SV}/lecture/SKILL.md`, *Lectures to read for their sound*.

---

## Step 4: Write the lecture

- **Target file**: `01-02-md-LECTURES/v1/{NN}.md`
- Write the whole lecture from top to bottom, from the prelecture, in the order of *The parts of a lecture* in `lecture/SKILL.md`.
- Use the prelecture's definitions as written, its names, its screen, and its Order part.
- Start the example page with `## SECTION |`, every principle with `## PRINCIPLE |`, and every "A vs. B" title with `## VS |`.

---

## Step 5: Read it once as the tired reader

- Read the lecture once from top to bottom, as the tired reader of `lecture/SKILL.md`.
- Answer the questions in *Before you finish* of `lecture/SKILL.md`, and fix every "no".
- Do not run the lab.

---

## Step 6: Build the HTML

- From `projects/react-11`, run `node src/build-river.mjs {NN}`.
- Check that `01-03-md-lectures-HTML/v1/theme1/{NN}.html` and `01-04-md-lectures-PDF/v1/theme1/{NN}.pdf` exist. If one is missing, report the build output and stop.

---

## Step 7: Stop and report

Stop here. Report briefly:
- The absolute file URL of the lecture `01-02-md-LECTURES/v1/{NN}.md`
- The absolute file URL of the HTML `01-03-md-lectures-HTML/v1/theme1/{NN}.html`
- What you fixed in Step 5
- Anything that failed or was skipped
