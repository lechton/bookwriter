---
name: check
description: "How a River lecture in react-10 is checked: the writer's own read of the first draft, the second read by a fresh thread that writes the final lecture, the runtime check in lab/ with the build, and the short report."
---

# Checking a River Lecture #2026_11_07_11_group_5

## 1. Step A: the writer reads the first draft

The thread that wrote `01-01-md-DRAFT-lectures/v1/{NN}.md` reads it once from top to bottom, as the tired reader of [lecture/SKILL.md](../lecture/SKILL.md). It answers the questions in *Before you finish* in that file and fixes every "no". It also replaces every invented word, as Step B, item 1, describes. #2026_11_08_01_group_3

## 2. Step B: a fresh thread writes the final lecture

A thread that did not write the draft reads it and writes the final lecture to `01-02-md-LECTURES/v1/{NN}.md`. It leaves the draft unchanged.

Read the draft twice, and look for one kind of problem each time:

1. **Too much.**
   - A sentence that tells again what the code or its comment already shows.
   - A question before the answer, in a passage about state, setters, props, and handlers.
   - Steps for a result the reader would expect.
   - An earlier lesson taught again.
   - Dramatic fragments, punchlines, and morals that add no fact.
   - A whole tag written inside a sentence instead of in a code block.
   - A word used as a name that is not in `## Terms` of the map and is not an everyday word in its everyday sense. It is invented jargon: replace it with the React or web word, or with plain words, everywhere it appears, and report it.
2. **Something missing.**
   - A word of this lesson that no sentence explains.
   - A result the reader would not expect, with no steps behind it.
   - Two ways side by side with no straight verdict.
   - A name that appears from nowhere.
   - A version named "box B" or "Way 1" instead of by its one difference.
   - An event without the person who does it, such as "after every key".

Fix both kinds. A short text that skips a step is not clear. A long text that tells what the reader can already read is not clear either.

Every fact stays true. Use the map `01-01-map-principles/v1/{NN}.md` to check a fact when you change it.

**PROPER** (approved Lecture 04, the opening):

> Look at any real website: an online shop shows twenty product cards, and a news site shows twenty article cards. If you build that whole page inside one giant function, you end up copying and pasting the same card markup twenty times. Tomorrow, when you want to change the card's design, you have to hunt through hundreds of lines and edit all twenty copies by hand.

**COUNTER-EXAMPLE** (rejected Lecture 04 draft):

> Let's start by pulling one `<article>` out of `App` and putting it into its own function called `ArticleCard`. We add a `console.log('ArticleCard runs')` inside it so we can see every time the function actually runs:

*Why this fails*: It starts with three code names before the reader knows what problem the function solves.

When you finish, answer the questions in *Before you finish* again. Also check that every browser preview draws real controls, shows only what a real page shows, shows every Console message React prints, and keeps one width for every state of the same page, as [figures/SKILL.md](../figures/SKILL.md) Section 4 describes.

## 3. Step C: run the lecture's code, then build

A fresh Opus thread checks that the lecture tells the truth about React. It works in the one installed test project, `lab/`, described in [lab/README.md](../../../lab/README.md). Do not create another React project.

1. List every claim the reader will trust: each code block, browser preview, Console block, error screen, quoted message, and sentence about what React, the browser, or Vite does.
2. Write test cases in `lab/cases/{NN}/` and run them with `node lab/check.mjs`.
3. Where React does something different, fix the lecture in the same plain voice, and run the case again.
4. Build with `node src/build-river.mjs {NN}` from `projects/react-10`. Fix every parenthesis and every orphan highlight the build lists. The lists of long sentences and of code in prose are only hints. Reread each sentence on them, and change it only if a tired reader would stumble on it. A long sentence that reads in one breath stays.
5. Run `node ../../tools/check-links.mjs` from `projects/react-10`. It must report zero broken links.
6. Check that `01-03-md-lectures-HTML/v1/{NN}.html` and `01-04-md-lectures-PDF/v1/{NN}.pdf` exist. If one is missing, report the build output and stop.
7. Write `lab/reports/{NN}.md` last: each case, the command, the claims it covers, and each fix with the old and new text.

**PROPER** (format of a report line, from the lab's own example case):

```markdown
- Case: lab/cases/example, run with `node lab/check.mjs lab/cases/example --click "::-p-text(Add to cart)"`.
- Claims: the page shows "Items: 2", then "Items: 3" and a third line "Eggs" after one click; the Console shows the missing key error.
- Matched: the page lines, and the Console line "Each child in a list should have a unique "key" prop." with "Check the render method of `App`." under it, as React 19.3.1 prints it.
- Fixed: nothing.
```

**COUNTER-EXAMPLE** (the Lesson 15 run of 2026-11-05): the writer built two separate React projects in `/tmp`, about 74 MB each, to test facts in the map. The lecture itself was never run.

**COUNTER-EXAMPLE** (the Lecture 21 run of 2026-11-07): the writer rewrote 47 sentences only because the build listed them as long or as holding code.

*Why this fails*: The lists are hints. Nobody asked whether a tired reader would stumble on those sentences.

## 4. The short report

The questions above are for you while you work. Do not report them one by one. Report:
- the file links,
- what you fixed, quoting only the text you changed,
- anything that failed or was skipped.

**COUNTER-EXAMPLE**: "Built 03.html and 03.pdf. Prose audit: 0 parenthesis violations, 0 sentences over 28 words. Link check: 0 broken." It reports only what a script counted, and says nothing about what the reader meets.
