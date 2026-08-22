# Skill: How To Write The Booklet (The Printed Code Companion To A Lecture)

This skill is the COUNTERPART to `write_lecture.md`. That skill produces the spoken audio script, and by deliberate rule it contains NO raw code: it narrates every symbol in spoken English and keeps sending the student to "the booklet" ("look at the first code block in your booklet", "turn to the to do list example", "look at the J S Output tab"). THIS skill produces that booklet: the printed companion the student holds in their hands and rests their eyes on while their ears follow the lecture.

The lecture carries the EXPLANATION. The booklet carries the CODE. The two are twins, made to be used together. You are now building the second twin from the first.

---

ROLE AND GOAL

You are given a finished lecture script (audio style, code free) and the original documentation sources that lecture was built from. You return the booklet: a clean, navigable, printable markdown document containing every piece of code the lecture refers to, laid out in the lecture's own order, faithfully sourced from the original documentation, and labeled so that every single pointer in the lecture ("the first code block", "the raw example about a person", "the second button snippet") resolves to a clearly marked block on the page.

The student reading the booklet is looking at code while a voice explains it. So the booklet is CODE FORWARD, but it is not code-only: every block carries a short, clear, punchy note that says what the code shows and why it matters. Three things make a good booklet, and this skill is organized around them: COMPLETENESS (no code missing), FORMAT (clean markdown that renders, with a filename on every block), and VOICE (every word high-voltage and direct).

---

THE PRIME DIRECTIVE: NO CODE LEFT BEHIND

This is the rule that outranks every other rule, and it is the whole reason this skill exists.

Every piece of code that the lecture points to, and every piece of code in the original documentation sources that the lecture's topic covers, MUST appear in the booklet. Nothing is dropped, nothing is summarized away, nothing is "left as an exercise". If the source documentation shows it and the lecture touches it, it is in the booklet, in full, verbatim.

There are two completeness obligations, and you must satisfy both:

1. POINTER COMPLETENESS. Walk the lecture line by line. Every time it points the student at the booklet, that pointer must resolve to a real, clearly labeled block. No pointer may dangle. If the lecture says "look at the second button snippet", there must be a block the student's eye lands on that is unmistakably the second button snippet.

2. SOURCE COMPLETENESS. Walk the original documentation sources for this lecture (they are listed per lecture in the table of contents file, under each lecture title). Every code block, every snippet, every terminal command, every compiler output example in those sources that belongs to this lecture's topic must appear in the booklet. The original documentation is the master inventory of code. The booklet may not contain LESS code than the documentation does on the topics it covers.

The union of those two sets, what the lecture points to AND what the documentation contains, is the floor, not the ceiling. When in doubt, include the code. A booklet errs by omission, never by completeness.

---

WHAT YOU WORK FROM (YOUR TWO INPUTS)

1. THE LECTURE. The finished script. This gives you the ORDER, the FRAMING, and the POINTERS. The booklet follows the lecture's sequence and section structure, not the documentation's. The lecture reorders and reframes the source material for teaching; the booklet mirrors the lecture so the student can follow along in real time.

2. THE ORIGINAL DOCUMENTATION SOURCES. Listed for each lecture in the table of contents file (`TOC_lectures_svelte.md`), under the lecture's title, as a bullet list of source file paths. These are where the actual code lives. You go to these files and lift the code out, verbatim. You also CITE these files in the booklet so the student and the instructor can always trace a block back to its origin and read it in full context.

If a lecture's framing invents an illustrative example that is NOT in the documentation (the lecturer sometimes builds a small scenario for the audio, like a hand written counter in plain JavaScript, or a React comparison), you still reconstruct that exact code faithfully from the lecturer's spoken description, and you mark it clearly as reconstructed or for comparison. See SOURCE FIDELITY and FRAMEWORK COMPARISON below.

---

THE BUILD PROCEDURE (FOLLOW IN ORDER)

Do these steps in this order. Do not skip the inventory steps; they are how the prime directive gets satisfied.

STEP 1. INVENTORY THE LECTURE'S POINTERS. Read the lecture from the top and write down, in order, every reference it makes to the booklet. Capture the ORDINAL or descriptive name the lecture uses, the SECTION it sits in, and WHAT the code must contain. This list is your pointer checklist.

STEP 2. GATHER ALL SOURCE CODE. Open every documentation source file listed for this lecture in the table of contents. Copy out, verbatim, every code block, snippet, terminal command, and compiler output example. Keep the original filename comments and formatting. This is your source inventory.

STEP 3. MAP POINTERS TO SOURCE CODE. For each pointer, find the source code that satisfies it. Follow the lecture's granularity: if the lecture points at a piece separately, the booklet shows it as its own labeled block. Flag any lecturer invented examples for reconstruction.

STEP 4. LAY OUT THE BOOKLET IN THE LECTURE'S ORDER. Build section by section, mirroring the lecture's section titles. Under each, place the blocks in the order the lecture reaches them, numbered so ordinals resolve.

STEP 5. FILL THE GAPS FOR SOURCE COMPLETENESS. Compare your layout against your full source inventory. Any code in the docs that the lecture covers but did not explicitly point to still belongs in the booklet. Add it.

STEP 6. WRITE THE FRAMINGS AND NOTES, IN VOICE. Give every section its short framing and every block its notes, all high-voltage and direct (see VOICE). Add the filename, the source citation, and works/trap markers. Clear and complete, never cryptic.

STEP 7. FORMAT AND VERIFY. Apply the MARKDOWN FORMAT rules (including a filename on every code fence) so every block renders cleanly, then run the FINAL VERIFICATION CHECKLIST. Not done until every pointer resolves, no source code is absent, the markdown renders, every fence has its filename, and every word is in voice.

---

SOURCE FIDELITY (THE CODE MUST BE TRUE)

Code is not like case law, where you are encouraged to add a missing year from your own knowledge. Code is exact. A wrong character is a wrong lesson. So:

- REPRODUCE CODE VERBATIM from the documentation source. Do not paraphrase it, do not "clean it up", do not rename variables, do not change quotation marks. Strip only the docs' own tooling directives (twoslash markers like `// @filename`, `// ---cut---`, `// @errors`, and the `+++...+++` highlight markers), and turn a `/// file:` comment into the fence's `title="..."` (see FILENAMES below). Everything else stays exactly as written.
- NEVER INVENT API OR SYNTAX. If you are not certain a snippet is exactly what the source shows, go back and read the source again. Do not fill a gap with plausible looking code from memory. An invented snippet that does not compile is worse than no snippet. (Inventing a sensible FILENAME is fine and required; inventing CODE is never allowed.)
- CITE EVERY BLOCK. Name the source file it came from, on the Source line, so the block is traceable.
- MARK ANYTHING NOT FROM THE SVELTE DOCS. Reconstructed illustrations are marked "reconstructed from the lecture". Framework comparisons are marked "for comparison".
- PRESERVE THE COMPILER OUTPUT EXAMPLES. When the docs show what the compiler emits (the "J S Output"), include it verbatim, marked as compiler output.

---

MARKDOWN FORMAT: MAKE EVERY BLOCK RENDER

The booklet is opened in markdown-to-HTML tools (GitHub, Obsidian, Typora, pandoc, the VS Code preview). Markdown that looks fine as plain text can collapse into a run-on paragraph once rendered. The rule that prevents this is simple and absolute:

PUT A BLANK LINE BETWEEN EVERY BLOCK-LEVEL ELEMENT. Two different things never share a run of lines. A header, a paragraph, a code fence, a metadata line, a list: each is separated from the next by a blank line. This one rule is what was missing in sloppy booklets, and it is what makes consecutive notes render as separate items instead of one merged sentence.

The fixed anatomy of a SECTION, in order:

1. The section header: `## ❒ N.M Section Title`, where `N.M` is the SAME section number as the matching lecture section (the lecture number, a dot, the section's position: `1.1`, `1.2`, and so on for lecture one). The booklet and the lecture share these numbers exactly, so the listener can jump between them by number. Mirrors a lecture section.
2. A section framing: ONE short, high-voltage paragraph right under the header (see VOICE). Never open a section cold on raw code.
3. Then, for each code block, the block anatomy below.

The fixed anatomy of a BLOCK, in order:

1. A block header: `### ▶ Block N — a clear caption`. A real H3, so blocks are navigable and the lecture's ordinals ("the second button snippet") resolve by counting them within the section.
2. A Source line: ``**◆ Source:** `02-runes/02-$state.md` ``. One line. For non-doc code, write ``**◆ Source:** reconstructed from the lecture`` or ``for comparison``.
3. The fenced code block, carrying both its language tag AND a filename (see FILENAMES). Verbatim code inside.
4. The notes, as a BULLET LIST. Each note is one `- ` item, led by its symbol and a bold hook, then the explanation. Put a blank line between items (a "loose" list) so multi-sentence notes breathe.

Hard don'ts:

- Do not write metadata or notes as bare consecutive lines. With no blank line between them, markdown merges them into one paragraph. Notes are ALWAYS bullet-list items; the Source line is ALWAYS its own line with blank lines around it.
- Do not lean on the symbols (▶ ◆ 🔑) as a substitute for real structure. The `###` header is what makes a block a block; the symbol only decorates it.
- Do not give Source its own `### ◆ Source` header. Keep it on its line. One H3 per block, so the document outline and any auto-generated table of contents stay clean.

---

FILENAMES: EVERY CODE FENCE CARRIES title="..."

Always put a filename inside the code fence, in a `title="..."` attribute on the info line, like this:

```python title="TodoApp/routers/auth.py"
create_user_model = Users(
    email=create_user_request.email,
    role=create_user_request.role,
    is_active=True,
)
```

Most markdown-to-HTML tools render `title="..."` as a small filename tab on top of the code block, which is exactly the label the student needs to know which file they are looking at. So the filename lives INSIDE the code, not on a separate line.

How to choose the filename:

- USE THE DOCS' FILENAME when they give one (their `/// file: state.svelte.js` comment becomes `title="state.svelte.js"`).
- DECIDE A SENSIBLE ONE when the docs give none. Pick the obvious file for the code: `App.svelte` for component code, `state.svelte.js` for a shared reactive module, `index.js` for plain JavaScript, `Counter.jsx` or `Counter.vue` for a framework comparison. A decided filename is required, not optional, so the block always has a clear home.
- KEEP A DESCRIPTIVE SUFFIX when the docs use one, for example `title="state.svelte.js (compiler output)"` for a compiler output block.

The ONLY exception: skip the `title` when it would be pure noise, on a one-line snippet or a short continuation fragment that obviously lives in the file the block just above it already named (the toggle and push lines that act on a list declared one block earlier). When in doubt, add the filename. The default is always to label it.

---

VOICE: HIGH-VOLTAGE AND DIRECT (ALL PROSE)

Every word of explanatory prose in the booklet, the section framings and all the notes, is written in one voice: high-voltage and direct. This is the house style, not optional flavor. Code stays verbatim and metadata stays plain, but ALL prose is punchy.

What high-voltage means, concretely:

- Short sentences. Many short beat one long. Break every long sentence in two.
- Plain, everyday words. Cut abstraction. "Hold your data, with its methods right alongside" beats "bundle data together with the methods that act on it".
- Active voice, direct address. "You mark each field yourself", not "fields must be marked".
- Concrete contrasts, not abstract description. "Plain objects reactive automatically, but not classes" beats "class instances are treated differently".
- No hedging, no throat-clearing. Cut "it is worth noting that", "in general", "one might say". Just say it.
- Rhythm and punch. A short standalone line lands a point: "But here's the catch:" or "No free ride here." Use them.
- Explain jargon on the spot. Drop the term, then translate it: "non-enumerable. Translation: loop over the keys and they won't show up."

The transformation, from flat to high-voltage. This is the bar for every framing and every note:

FLAT: "A class is a natural way to bundle data together with the methods that act on it, and a class can absolutely hold reactive state. The catch is that Svelte treats a class instance differently from a plain object, so you have to mark the reactive fields yourself."

HIGH-VOLTAGE: "Classes are great for holding data with their methods. And yes, a class can hold reactive state. But here's the catch: Svelte makes plain objects reactive automatically, but not classes. With a class, you mark each reactive field yourself."

Same facts. Half the friction. Write everything to that bar.

---

TABLES: FOR COMPARISONS AND TYPOLOGIES (KEEP THEM NARROW)

Some material is far clearer as a table than as prose or a bullet list. Reach for a markdown table whenever the content is a COMPARISON (this versus that), a TYPOLOGY (the kinds of a thing), a MAPPING (each X goes to a Y), or a small piece of STRUCTURED REFERENCE (the fields of an object, the options of a feature). A table preserves the parallel structure the eye wants, so the reader can scan down a column and compare at a glance. The moment you catch yourself writing "A does this, while B does that, and C does the other," stop and make a table.

But a booklet is PRINTED, on a page of fixed width, so a wide table is a disaster: it spills off the edge, or it shrinks the text to nothing. So there is one hard rule and one strong preference.

The hard rule: a table has AT MOST THREE OR FOUR COLUMNS. Never more. Four is the ceiling, three is the comfortable norm, two is often plenty.

The strong preference: prefer a tall, narrow table to a short, wide one. More rows is good; more columns is bad. A long table that runs down the page prints cleanly and scans easily; a wide table that runs off the side does neither. So plan every table to grow downward, not sideways.

When a comparison seems to want many columns, do one of three things rather than widen it:

- TRANSPOSE it. Put the few things being compared across the top as columns, and their many attributes down the side as rows. Comparing two or three runes across eight qualities is two or three columns and eight rows, tall and narrow, not eight columns and three rows, wide and unprintable.
- SPLIT it. Two focused three-column tables beat one sprawling six-column table.
- MOVE detail into the notes. Cells hold short phrases, not paragraphs. If a cell wants a whole sentence, put the short label in the cell and the sentence in a bullet note beneath the table. Short cells are what keep the columns narrow.

Cells are short by discipline: a word, a phrase, a number, a lecture reference. The instant a cell needs real explanation, that explanation belongs in a note under the table, not in the cell.

Worked shapes, all three or fewer columns. A typology, one row per kind:

```
| File | What it is | Example |
|---|---|---|
| `.svelte` | a component (a box) | `ArticleCard.svelte` |
| `.svelte.ts` | a module that can use runes | `session.svelte.ts` |
| `.ts` | a plain module, no runes | `api.ts`, `format-date.ts` |
```

A comparison, TRANSPOSED so the few things are columns and the many attributes are rows:

```
| Aspect | Section | Tag |
|---|---|---|
| How many | a handful, fixed | thousands, open |
| Per article | one | many |
| Example | World, Sports | war, election |
```

A mapping, two columns, as long down the page as it needs to be:

```
| In the example | Full lecture |
|---|---|
| The clap count | 4 — `$state` |
| "5 min read" | 5 — `$derived` |
| The live ticker | 6 — `$effect` |
```

Use a table when it earns its place, keep it to three or four columns, and let it grow down the page rather than across it.

---

THE NOTES: CLEAR, COMPLETE, AND STILL NOT A TRANSCRIPT

Each note explains what the block shows AND why it matters, and it stands on its own. A reader holding only the booklet, with no audio playing, understands it. That usually takes a few short sentences, not one clause. Cryptic fragments are a defect. A telegram like "class instances are NOT auto proxied" tells the reader nothing about why they should care; spend the sentences to make it land.

But complete is not the same as a transcript. The booklet does NOT retell the lecture. Leave out the narrative build-up, the "feel the pain" story, the repetition, the long framework-comparison arc. Those belong to the audio. The note's job is narrower and sharper: illuminate THIS code. What it shows, why it matters, what trap or surprise rides along. Say that, clearly, in high-voltage style, then stop.

So the dial sits at: clear, complete, comprehensible alone, punchy, and still not a retelling. Fuller than a telegram. Tighter than the lecture. A few short sentences per note is the sweet spot.

Every note leads with its symbol and a bold hook, so the page is scannable:

- 🔑 the key line, or the central move the block makes.
- ➔ what to notice, and why it matters.
- ⚠️ the trap, the surprise, or the rare-but-real footnote.
- ✔️ / ✖️ used on the block CAPTION when the block is half of a works/breaks pair.

---

HOW TO PRESENT EACH CODE BLOCK (THE WORKED SHAPE)

Put it all together, format plus filename plus voice, and a block looks like this. This is the exact target for every block:

````
## ❒ State Inside Classes

Classes are great for holding data with their methods. And yes, a class can hold reactive state. But here's the catch: Svelte makes plain objects reactive automatically, but not classes. With a class, you mark each reactive field yourself. This section shows the two ways to do it, plus one surprise to watch for.

### ▶ Block 1 — The Todo class: reactive fields, two ways

**◆ Source:** `02-runes/02-$state.md`

```js title="todo.svelte.js"
class Todo {
    done = $state(false);

    constructor(text) {
        this.text = $state(text);
    }

    reset() {
        this.text = '';
        this.done = false;
    }
}
```

- 🔑 **Two spots for the rune. Pick either.** Put it on the field: `done = $state(false)`. Or on the first assignment in the constructor: `this.text = $state(text)`. Both make the property reactive. Mix them freely, like this `Todo` does.

- ➔ **Why bother marking them?** Hand `$state` a plain object or array, and Svelte wraps it automatically. Hand it a class instance, and it does not. Wrapping a whole class could break its methods and private fields. So you opt in, one field at a time.

- ⚠️ **One surprise to pocket.** The compiler turns `done` and `text` into hidden get/set methods. That makes them non-enumerable. Translation: loop over the instance's keys and they won't show up. Rare, but real.
````

That block has everything: a navigable H3 header, a one-line source citation, verbatim code wearing its filename, and three notes that are clear, complete, scannable, and high-voltage, each its own list item with a blank line around it so it renders.

---

THE SYMBOL AND LABEL SYSTEM (PRINT THE LEGEND AT THE TOP OF EVERY BOOKLET)

Use these consistently, and print the legend at the very top of each booklet so the student holds the key.

- ❒  — Major section. On the `##` section header. Mirrors a lecture section.
- ▶  — A numbered code block, on its `###` header ("▶ Block 1"), so ordinals resolve.
- ★  — The canonical, headline block of a section. At most one per concept. Optional.
- title="..." — the filename, inside the code fence, rendered as a tab on the code block.
- ◆  — Source: the documentation file the code came from (or "reconstructed" / "for comparison").
- 🔑 — Key line: the one line, or central move, the block turns on.
- ➔  — What to notice: why the block matters.
- ⚙️ — Compiler emits: the lower level JavaScript the compiler produces (the "J S Output"). Show it verbatim, marked.
- ✔️ — Works: correct, idiomatic code. On a works/breaks caption, follow the tick with a spelled word ("✔️ Works").
- ✖️ — Trap: the broken anti-pattern the lecture warns against. ALWAYS follow the cross with a spelled word ("✖️ Trap", "✖️ Breaks", "✖️ No") so the negative is explicit and survives being read aloud.
- ⚠️ — Caution: a surprise, gotcha, or rare-but-real footnote.

Framework comparison blocks carry a plain bold label on the caption line: REACT (for comparison), VUE (for comparison), SOLID (for comparison).

---

RESOLVING THE LECTURE'S POINTERS (EVERY REFERENCE MUST LAND)

The lecture refers to the booklet in several ways. Each imposes a requirement:

- BY ORDINAL: "the first code block", "the second button snippet". Number your `### ▶ Block N` headers within each section so the counting matches.
- BY DESCRIPTION: "the to do list code block", "the raw example about a person", "the Todo class". Put those same words in the block caption.
- BY ZONE OR PAGE: "the skeleton at the top of the dot svelte files page". Group blocks under a clearly titled section matching that name.
- BY TOOL OR ARTIFACT: "the J S Output tab", "the command block". Include the artifact as a real block: the "J S Output" is a `⚙️` compiler-output block; the "command block" is a terminal block tagged `sh`.
- BY CONTRAST: "the broken example", "the version that works". Present both, adjacent, with `✖️ Trap` and `✔️ Works` on their captions.

After layout, re-read the lecture once more and tick off each pointer against the page. A pointer that does not resolve is a defect.

---

FRAMEWORK COMPARISON SNIPPETS (SHOW WHAT THE LECTURE DESCRIBES)

The lectures compare Svelte to React and Vue on nearly every point, and they narrate the other framework's code in spoken words. The student benefits from SEEING that code, not only hearing it. So:

- When the lecture narrates a React, Vue, or Solid snippet, reconstruct it as a real, correct code block, near the Svelte block it is contrasted with. Give it a sensible filename too (`Counter.jsx`, `Counter.vue`).
- Label it on the caption line: REACT (for comparison), VUE (for comparison), or SOLID (for comparison). Never let a comparison block be mistaken for Svelte source.
- Keep it minimal and exactly as the lecture frames it. You are illustrating the lecture's contrast, not teaching React.
- On the Source line, write ``**◆ Source:** reconstructed from the lecture's comparison`` (no false documentation citation).

---

ORGANIZATION AND NAVIGATION

- MIRROR THE LECTURE'S STRUCTURE, NUMBERS AND ALL. The booklet's title is the lecture's title (marked as the companion). The booklet's `## ❒` sections are the lecture's section subtitles, in the same order AND carrying the same section numbers: lecture section `## 1.3 Foo` becomes booklet section `## ❒ 1.3 Foo`. The numbers must match exactly, section for section, because that is how the listener jumps between the audio and the booklet. For a lecture section that genuinely has no code (pure orientation, the recap), keep the numbered header and write one short high-voltage line in its place, so the sync never breaks.
- TITLES CLEAR AND IN SYMMETRY. Captions are crisp and, where natural, symmetric. If one block is "✔️ The fix that works", a neighbor is "✖️ The trap that breaks".
- CRISP, NEVER CRYPTIC. "Block about the class" is a failure. "The Todo class: reactive fields, two ways" is right: it tells the student exactly what the block is, by eye, before the audio reaches it.

---

STRUCTURE OF THE OUTPUT FILE

Produce one markdown file per lecture, in the `outlines` folder, named as the lecture's twin plus an `_outline` suffix: lecture `03_state.md` gets booklet `03_state_outline.md`. ALWAYS end a booklet filename with `_outline.md`, so the lecture and its booklet are never confused. The file contains, in order:

1. A TITLE line: the lecture's exact title, which begins with its number in the form `# NN | Title` (so the two artifacts are twins). For example: `# 03 | State Is Just A Variable: Reactivity In Svelte Five`. Use the same zero-padded number as the file name, and the same number as the lecture it twins.
2. A ONE LINE NOTE, in voice, telling the student this is the printed companion to the audio lecture of the same name, read alongside it.
3. THE LEGEND of symbols, so the key is always in hand.
4. A SOURCES line listing the documentation files this booklet draws from (the list under the lecture's title in the table of contents).
5. THE SECTIONS, mirroring the lecture, each a `## ❒` header with its framing paragraph and its blocks.

Use real markdown with real fenced code blocks and correct language tags throughout. This is the one document in the course that is allowed, and required, to be full of real code.

---

EXTENSIVENESS, AND NO AI FRAMING

- BE EXTENSIVE. Do NOT trim for length or worry about tokens. A booklet that omits a snippet to save space has failed its one job. Cover every block, every variant, every command, every compiler output, every comparison the lecture invoked.
- NO AI INTRODUCTION OR CONCLUSION. Do not open with "Here is the booklet" or close with a summary of what you did. Produce the booklet itself, starting at its title.

---

BAD versus BETTER (WORKED EXAMPLE)

The same section, done wrong and done right. The bad one renders as a run-on, has no filename on the code, and reads like a telegram; the good one renders cleanly, labels the file, and reads in voice.

Bad (no blank lines, so metadata and notes merge into one paragraph; no filename on the fence; flat, cryptic prose):

````
## ❒ State Inside Classes
### ▶ Block 1 — The Todo class
```js
class Todo {
    done = $state(false);
    constructor(text) { this.text = $state(text); }
}
```
◆ Source: 02-runes/02-$state.md
🔑 Key lines: done = $state(false), this.text = $state(text).
➔ What to notice: class instances are NOT auto proxied.
⚠️ Caution: compiler makes done/text non-enumerable.
````

Better (blank line between every element, a filename in the fence, notes as a loose bullet list, every word high-voltage):

````
## ❒ State Inside Classes

Classes are great for holding data with their methods. And yes, a class can hold reactive state. But here's the catch: Svelte makes plain objects reactive automatically, but not classes. With a class, you mark each reactive field yourself. This section shows the two ways to do it, plus one surprise to watch for.

### ▶ Block 1 — The Todo class: reactive fields, two ways

**◆ Source:** `02-runes/02-$state.md`

```js title="todo.svelte.js"
class Todo {
    done = $state(false);

    constructor(text) {
        this.text = $state(text);
    }

    reset() {
        this.text = '';
        this.done = false;
    }
}
```

- 🔑 **Two spots for the rune. Pick either.** Put it on the field: `done = $state(false)`. Or on the first assignment in the constructor: `this.text = $state(text)`. Both make the property reactive. Mix them freely, like this `Todo` does.

- ➔ **Why bother marking them?** Hand `$state` a plain object or array, and Svelte wraps it automatically. Hand it a class instance, and it does not. Wrapping a whole class could break its methods and private fields. So you opt in, one field at a time.

- ⚠️ **One surprise to pocket.** The compiler turns `done` and `text` into hidden get/set methods. That makes them non-enumerable. Translation: loop over the instance's keys and they won't show up. Rare, but real.
````

---

FINAL VERIFICATION CHECKLIST (DO NOT SHIP THE BOOKLET UNTIL ALL PASS)

1. POINTER COMPLETENESS: every reference the lecture makes to the booklet resolves to a clearly labeled block. No dangling pointer.
2. SOURCE COMPLETENESS: every code block, snippet, command, and compiler output in the lecture's documentation sources appears in the booklet, verbatim.
3. ORDINALS MATCH: where the lecture counts ("first", "second", "next"), the `### ▶ Block N` headers count the same way in the same section.
4. CAPTIONS MATCH DESCRIPTIONS: where the lecture names a block ("the raw example", "the Todo class"), a caption contains those words.
5. FIDELITY: every Svelte block is verbatim from its source, tooling directives stripped, with the right language tag. Nothing paraphrased, nothing invented.
6. CITATIONS: every block names its source on its Source line, or is marked "reconstructed" / "for comparison".
7. FILENAMES: every code fence carries a `title="..."` (from the docs, or a sensible invented one), except a one-line or short continuation fragment where it would be pure noise.
8. FORMAT RENDERS: a blank line between every block-level element; every block is a `### ▶` header; notes are a loose bullet list; no Source-as-its-own-header; no run-on lines.
9. VOICE: every framing and every note is high-voltage and direct, short sentences, plain words, concrete contrasts. No flat, abstract, hedged prose anywhere.
10. NOTES CLEAR AND COMPLETE: no cryptic fragments. Each note says what the block shows AND why it matters, and stands on its own without the audio, yet does not retell the lecture.
11. TRAPS, CURES, COMPILER OUTPUT: works/breaks pairs marked adjacent with ✔️ and ✖️; the ⚙️ compiler-output block present wherever the lecture leans on it.
12. NAMING AND STRUCTURE: the file is `<lecture>_outline.md` in the `outlines` folder; same title as the lecture; same section order, with the SAME section numbers (`## ❒ N.M`) as the matching lecture sections; ❒ on every major section; legend and sources at the top.
13. TABLES NARROW: every table is at most three or four columns and prints cleanly; any comparison that would be wider is transposed, split, or has its detail moved into notes beneath it.

If any check fails, the booklet is not done. Completeness first. Format so it renders, with a filename on every block. Voice on every word.
