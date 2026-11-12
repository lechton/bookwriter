Lesson NN = 14
skill version SV = v11.1

# Prelecture prompt: Lesson `{NN}`, skills `{SV}`

Paste this prompt into a new chat. This chat writes the prelecture of Lesson `{NN}`, checks it against the React documentation, and then stops so I can read it. It does not write the lecture. The lecture has its own prompt, [lecture_v11.1.md](lecture_v11.1.md).

## What this chat does, overall

1. **Writes the prelecture** `01-01-md-PRE-lectures/v1/{NN}.md`: the definitions written in full, and every other piece the lecture needs as short facts (the names, the terms, the screen, the intro, the principles, the order).
2. **Checks it** against the React documentation, and fixes the prelecture where the documentation says something different.
3. **Stops**, and gives me the link to the prelecture.

## What to focus on

1. **The definitions.** Write them in full, in the words the lecture will use, by Section 1 of `skills/{SV}/definitions/SKILL.md`: read every GOOD and BAD pair there before writing. Make each definition for this lecture, and fit each reminder to the reader of this chapter.
2. **The facts.** Every runtime claim comes from the React documentation, quoted, or is marked `unconfirmed` until the lab run of the lecture puts the real message in.
3. **The screen.** Choose a screen for this lesson, as Section 3 of `skills/{SV}/prelecture/SKILL.md` says: one that needs this lesson's idea, that developers really use at work, made of things everyone knows, with the fewest parts that make the point.
4. **The names and the terms.** Every name is clear at first sight, with one reading only. Every term is a React or web word, a standard computer science term the lesson really needs, or an everyday word. No invented words.
5. **The principles.** Each principle is "do this, do not do that", with its real beginner mistake, its wrong code and right code, and its proof on the screen.
6. **The order.** The Order part gives each definition and each principle one place in the lecture.

## Workspace rules

- Work in `projects/react-11` on River Version (`v1`) Lesson `{NN}` (bank row `{NN}` in [questions/questions.md](../questions/questions.md)).
- Use only the skills in `skills/{SV}/` (start with [skills/{SV}/README.md](../skills/v11.1/README.md)).
- Do not read anything from `projects/react-09`.
- Follow the workspace law in [AGENTS.md](../../../AGENTS.md): zero em-dashes, zero hard-wraps, TTS-safe prose.
- Never overwrite, delete, or hand-move an existing prelecture or lecture file. If `01-01-md-PRE-lectures/v1/{NN}.md` already exists, stop and tell me so I can retire it with `archive_lecture.py` first.
- Do not commit anything.

---

## Step 1: Load the skills

- [skills/{SV}/README.md](../skills/v11.1/README.md)
- [skills/{SV}/prelecture/SKILL.md](../skills/v11.1/prelecture/SKILL.md) (the whole file; Section 5 gives the order of the prelecture)
- [skills/{SV}/definitions/SKILL.md](../skills/v11.1/definitions/SKILL.md) (Section 1 in full, with every GOOD and BAD pair)
- [skills/{SV}/lecture/SKILL.md](../skills/v11.1/lecture/SKILL.md)
- [skills/{SV}/titles/SKILL.md](../skills/v11.1/titles/SKILL.md)
- [skills/{SV}/intro/SKILL.md](../skills/v11.1/intro/SKILL.md) and its three intros: [14.md](../skills/v11.1/intro/14.md), [15.md](../skills/v11.1/intro/15.md), [16.md](../skills/v11.1/intro/16.md)
- [skills/{SV}/examples/SKILL.md](../skills/v11.1/examples/SKILL.md)

---

## Step 2: Read the inputs

- Bank row `{NN}` in [questions/questions.md](../questions/questions.md).
- The syllabus card `01-01-map/{NN}.md`. If the card does not exist, work from the bank row and say so in the report.
- The official React documentation: find it with `node ../../tools/resolve.mjs corpus`, and read every `learn/` and `reference/` page on the topic, including every Pitfall, Deep Dive, Recap, and Challenge.
- How earlier lectures defined each idea this lesson reminds: the lectures in `01-02-md-LECTURES/v1/` and in its `archive/` folder (in `archive/`, the files stamped `2026-11-12-0220`).

---

## Step 3: Write the prelecture

- **Target file**: `01-01-md-PRE-lectures/v1/{NN}.md`
- Write it part by part, in the order of Section 5 of `prelecture/SKILL.md`.
- Write the definitions in full, in the owner's voice. Keep every other part as short facts.
- Answer the questions in *Before you finish* of `prelecture/SKILL.md` and Section 7 of `definitions/SKILL.md`, and fix every "no".

---

## Step 4: Check the prelecture

- Load [skills/{SV}/check/SKILL.md](../skills/v11.1/check/SKILL.md) (Step A).
- Check every definition and every rule against the React documentation it cites.
- Where the documentation says something different, fix the prelecture.
- Do not run any code. The lab runs later, on the lecture.

---

## Step 5: Stop and report

Stop here. Do not write the lecture. Report briefly:
- The absolute file URL of the prelecture `01-01-md-PRE-lectures/v1/{NN}.md`
- Its definitions and its principles, by title
- What you fixed after the check
- Anything that failed or was skipped
