Lesson NN = 29
Skill version SV = v11.3
Path to Save a Copy PSC = "bookwriter/projects/react-11/01-03-md-lectures-HTML/v1/theme1"
Tag name TAG = "argon"
Name pattern = {NN}-{TAG} (for example 31-gpt.md, 31-gpt.html, 31-gpt.pdf)

# Rewrite prompt: Lesson `{NN}`, skills `{SV}`, name `{NN}-{TAG}`

Paste this prompt into a new chat. This chat takes the finished Lesson `{NN}` of React project 10 and rewrites it radically for React project 11, by `skills/{SV}/rewrite/SKILL.md`. Every file it creates is named `{NN}-{TAG}`.

## Forbidden: reading any earlier rewrite of Lesson {NN}

The purpose of this chat is to write a new rewrite from scratch, so that nothing from an earlier attempt shapes it.

- It is forbidden to open, read, search, grep, or diff any earlier rewrite of Lesson `{NN}` in `projects/react-11`, even when it sits in the same folder as the new file. This covers `{NN}.md`, `{NN}.html`, `{NN}.pdf`, every other `{NN}-*` file (such as `{NN}-novel.md` or `{NN}-gpt.html`), every copy in an `archive/` subfolder, and every file in `{PSC}`.
- Check whether a file exists by its exact name only. Do not search the contents of these folders.
- Your only content source is the react-10 chapter. Your only standards are the skills in Step 2 and the two demo chapters in Step 3. The demo chapters are allowed even when their number is `{NN}`.

## Naming: every new file follows {NN}-{TAG}

- The rewrite: `projects/react-11/01-02-md-LECTURES/v1/{NN}-{TAG}.md`
- The HTML: `projects/react-11/01-03-md-lectures-HTML/v1/theme1/{NN}-{TAG}.html`
- The PDF: `projects/react-11/01-04-md-lectures-PDF/v1/theme1/{NN}-{TAG}.pdf`
- The copies: `{PSC}/{NN}-{TAG}.md`, `{PSC}/{NN}-{TAG}.html`, `{PSC}/{NN}-{TAG}.pdf`
- Never write to `{NN}.md`, `{NN}.html`, or `{NN}.pdf`. The new files sit beside them, so nothing is retired and `archive_lecture.py` is not run.

## What this chat does, overall

1. **Reads the source chapter** `projects/react-10/01-02-md-LECTURES/v1/{NN}.md`, and leaves it unchanged.
2. **Writes the rewrite** `projects/react-11/01-02-md-LECTURES/v1/{NN}-{TAG}.md`, from top to bottom, by the rewrite skill, without reading any earlier rewrite.
3. **Reads it once** and fixes what fails.
4. **Builds the HTML and the PDF** with `node src/build-river.mjs {NN}-{TAG}`.
5. **Saves a copy** of the three files to `{PSC}`.
6. **Stops**, and gives me the links.

## What to focus on

1. **The rewrite skill comes first.** Where another skill says something different, follow `skills/{SV}/rewrite/SKILL.md`.
2. **The examples carry the standard.** Study the definitions, the good demo chapter, the bad demo chapter, and the titles in the rewrite skill before you write a line.
3. **Straight to the point.** No long introduction. Start with the essence, a sentence the reader can keep in mind, and repeat it in several places.
4. **Precise words.** "It is an object", "it is an `<input>` field", never "it is a box".
5. **Nothing true is lost.** Keep every fact, every principle, and every piece of code the reader needs from the source chapter. Cut only what is long, repeated, or vague.
6. **The titles.** Every principle title has the shape of the good titles in the rewrite skill: the name from the code, then what it guarantees. Start the example page with `## SECTION |`, every principle with `## PRINCIPLE |`, and every "A vs. B" title with `## VS |`.

## Ultimate Test

Before you approve each and every paragraph, each and every section, each and every sentence, ask yourself:

[ ] Is this how a senior developer would explain it to a junior developer, so that the junior understands what is REALLY going on?

Bad example: Put ref={inputRef} on a tag, and React puts the real element into inputRef.current. Then your event handler calls the browser's own methods on it, such as focus.

Comment: this is NOT how a senior developer would explain it to a junior so that it makes sense.

Good example: "Remember getElementById? We use it in JavaScript to grab elements, and we can do something similar in React. In plain JavaScript, you grab the element yourself: document.getElementById('name'). In React, you never create the elements by hand. React creates them for you, from your JSX, so you have nothing to grab. A ref is how you ask React: 'When you create this <input>, give it to me!'. Eventually React puts it into inputRef.current. From then on, it is the same <input> element you know from plain JavaScript, so for example you can call focus() on it."

Plain JavaScript: document.getElementById('name').focus()
React: blabla (add code)

## Workspace rules

- Read the source in `projects/react-10`. Write only the `{NN}-{TAG}` files in `projects/react-11` and their copies in `{PSC}`.
- Use only the skills in `skills/{SV}/` of `projects/react-11`.
- Do not read anything from `projects/react-09`.
- Do not read any earlier rewrite of Lesson `{NN}` (see "Forbidden: reading any earlier rewrite of Lesson {NN}").
- Follow the workspace law in [AGENTS.md](../../../AGENTS.md): zero em-dashes, zero hard-wraps, TTS-safe prose.
- Never overwrite, delete, or hand-move an existing file.
- Do not commit anything.

---

## Step 1: Check the files

- Check that the source `projects/react-10/01-02-md-LECTURES/v1/{NN}.md` exists. If not, stop and say so.
- Check, by exact name only, whether `{NN}-{TAG}.md`, `{NN}-{TAG}.html`, or `{NN}-{TAG}.pdf` already exists in `projects/react-11` or in `{PSC}`. If any of them exists, stop and say so. Do not open it.
- Check that the folder `{PSC}` exists. If not, create it.

---

## Step 2: Load the skills

- [skills/{SV}/rewrite/SKILL.md](../skills/v11.3/rewrite/SKILL.md) (the whole file, with every example)
- [skills/{SV}/figures/SKILL.md](../skills/v11.3/figures/SKILL.md) (only for the exact syntax of code blocks, highlights, browser previews, principle cards, and definition boxes)
- [skills/{SV}/lecture/SKILL.md](../skills/v11.3/lecture/SKILL.md) (only *The parts of a lecture*, for the title tags)

---

## Step 3: Read the inputs

- The source chapter: [react-10 Lesson {NN}](../../react-10/01-02-md-LECTURES/v1/) `{NN}.md` (leave it unchanged).
- The good demo chapter: [30-novel-v2.md](../01-02-md-LECTURES/v1/30-novel-v2.md).
- The bad demo chapter: [17-gemini3.8.md](../01-02-md-LECTURES/v1/17-gemini3.8.md).
- Nothing else.

---

## Step 4: Write the rewrite

- **Target file**: `projects/react-11/01-02-md-LECTURES/v1/{NN}-{TAG}.md`
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

## Step 6: Build the HTML and the PDF

- From `projects/react-11`, run `node src/build-river.mjs {NN}-{TAG}`.
- Fix every violation the build lists, and build again until it lists none.
- Check that `01-03-md-lectures-HTML/v1/theme1/{NN}-{TAG}.html` and `01-04-md-lectures-PDF/v1/theme1/{NN}-{TAG}.pdf` exist. If one is missing, report the build output and stop.

---

## Step 7: Save a copy

- Copy `{NN}-{TAG}.md`, `{NN}-{TAG}.html`, and `{NN}-{TAG}.pdf` from their folders in `projects/react-11` to `{PSC}`.
- Leave the originals where they are.

---

## Step 8: Stop and report

Stop here. Report briefly:
- The absolute file URL of the rewrite `01-02-md-LECTURES/v1/{NN}-{TAG}.md`
- The absolute file URL of the HTML `01-03-md-lectures-HTML/v1/theme1/{NN}-{TAG}.html`
- The absolute file URLs of the three copies in `{PSC}`
- What you fixed in Step 5
- Anything that failed or was skipped
