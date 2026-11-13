Lesson NN = 31
skill version SV = v11.2

# Rewrite prompt: Lesson `{NN}`, skills `{SV}`

Paste this prompt into a new chat. This chat takes the finished Lesson `{NN}` of React project 10 and rewrites it radically for React project 11, by `skills/{SV}/rewrite/SKILL.md`.

## What this chat does, overall

1. **Reads the source chapter** `projects/react-10/01-02-md-LECTURES/v1/{NN}.md`, and leaves it unchanged.
2. **Writes the rewrite** `projects/react-11/01-02-md-LECTURES/v1/{NN}.md`, from top to bottom, by the rewrite skill.
3. **Reads it once** and fixes what fails.
4. **Builds the HTML** (and the PDF) with `node src/build-river.mjs {NN}`.
5. **Stops**, and gives me the links to the rewrite and to its HTML.

## What to focus on

1. **The rewrite skill comes first.** Where another skill says something different, follow `skills/{SV}/rewrite/SKILL.md`.
2. **The examples carry the standard.** Study the definitions, the good demo chapter, the bad demo chapter, and the titles in the rewrite skill before you write a line.
3. **Straight to the point.** No long introduction. Start with the essence, a sentence the reader can keep in mind, and repeat it in several places.
4. **Precise words.** "It is an object", "it is an `<input>` field", never "it is a box".
5. **Nothing true is lost.** Keep every fact, every principle, and every piece of code the reader needs from the source chapter. Cut only what is long, repeated, or vague.
6. **The titles.** Every principle title has the shape of the good titles in the rewrite skill: the name from the code, then what it guarantees. Start the example page with `## SECTION |`, every principle with `## PRINCIPLE |`, and every "A vs. B" title with `## VS |`.


## Ultimate Test

Before you approve each and every paragraph, each and every section, each and every sentence, ask yourself: 


[ ] Is this is how a senior developer would explain to a junior developer for him to understand what is REALLY going on? 

Bad Example: Put ref={inputRef} on a tag, and React puts the real element into inputRef.current. Then your event handler calls the browser's own methods on it, such as focus.

Comment: this is NOT how a senior developer would explain to a junior, in order to make sense 

Good example: "Remember getElementById? We use it in Javascript to grap elements, we can do something similar with React. In plain JavaScript, you grab the element yourself: document.getElementById('name'). In React, you never create the elements by hand. React creates them for you, from your JSX, so you have nothing to grab. A ref is how you ask React: 'When you create this <input>, give it to me!'. Eventually React puts it into inputRef.current. From then on, it is the same <input> element you know from plain JavaScript, for example you can call focus() on it. "

Plain javascript: document.getElementById('name').focus()
React: blabla (add code)



## Workspace rules

- Read the source in `projects/react-10`. Write only in `projects/react-11`.
- Use only the skills in `skills/{SV}/` of `projects/react-11`.
- Do not read anything from `projects/react-09`.
- Follow the workspace law in [AGENTS.md](../../../AGENTS.md): zero em-dashes, zero hard-wraps, TTS-safe prose.
- Never overwrite, delete, or hand-move an existing lecture file. Retire it with `archive_lecture.py`, as Step 1 says.
- Do not commit anything.

---

## Step 1: Check the files

- Check that the source `projects/react-10/01-02-md-LECTURES/v1/{NN}.md` exists. If not, stop and say so.
- Check whether `projects/react-11/01-02-md-LECTURES/v1/{NN}.md` already exists. If it does, retire it first, as the rewrite skill says: from `projects/react-11`, run `python3 archive_lecture.py {NN} --dry-run`, then `python3 archive_lecture.py {NN}`, and note the moves for the report.

---

## Step 2: Load the skills

- [skills/{SV}/rewrite/SKILL.md](../skills/v11.2/rewrite/SKILL.md) (the whole file, with every example)
- [skills/{SV}/figures/SKILL.md](../skills/v11.2/figures/SKILL.md) (only for the exact syntax of code blocks, highlights, browser previews, principle cards, and definition boxes)
- [skills/{SV}/lecture/SKILL.md](../skills/v11.2/lecture/SKILL.md) (only *The parts of a lecture*, for the title tags)

---

## Step 3: Read the inputs

- The source chapter: [react-10 Lesson {NN}](../../react-10/01-02-md-LECTURES/v1/) `{NN}.md` (leave it unchanged).
- The good demo chapter: [30-novel-v2.md](../01-02-md-LECTURES/v1/30-novel-v2.md).
- The bad demo chapter: [17-gemini3.8.md](../01-02-md-LECTURES/v1/17-gemini3.8.md).

---

## Step 4: Write the rewrite

- **Target file**: `projects/react-11/01-02-md-LECTURES/v1/{NN}.md`
- Write the whole chapter from top to bottom, by the rewrite skill.
- Keep the title, the short question under it, and the interview question line of the source, in the same form as the good demo chapter.

---

## Step 5: Read it once

- Read the rewrite once from top to bottom, as a junior developer who knows basic JavaScript.
- Search it for "box", "pocket", and "drawer". Each hit must name a real thing the build draws, such as a definition box. Replace every other hit with the precise word.
- Check every principle title against the good titles in the rewrite skill.
- Look for large blocks of text, the failure of the bad demo chapter, and split them.
- Fix every problem you find.

---

## Step 6: Build the HTML

- From `projects/react-11`, run `node src/build-river.mjs {NN}`.
- Fix every violation the build lists, and build again until it lists none.
- Check that `01-03-md-lectures-HTML/v1/theme1/{NN}.html` and `01-04-md-lectures-PDF/v1/theme1/{NN}.pdf` exist. If one is missing, report the build output and stop.

---

## Step 7: Stop and report

Stop here. Report briefly:
- The absolute file URL of the rewrite `01-02-md-LECTURES/v1/{NN}.md`
- The absolute file URL of the HTML `01-03-md-lectures-HTML/v1/theme1/{NN}.html`
- The files moved to the archive in Step 1, if any
- What you fixed in Step 5
- Anything that failed or was skipped