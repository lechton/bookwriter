---
name: verification-v1
description: "River Version (v1) quality gates. Stage A checks the first draft `01-01-md-DRAFT-lectures/v1/{NN}.md` by reading it as a learner. Stage B checks the lecture `01-02-md-LECTURES/v1/{NN}.md` after the simplify pass by reading it. Stage C runs the lecture's code in `lab/`, fixes what differs from React, then runs the build and link scripts last."
---

# River Version (`v1`) Quality Gates

## Why reading comes before scripts #2026_10_24_01_group_4

A script can count parentheses and long sentences. It cannot tell whether a paragraph tells its story off stage, recites the code below it, or leaves a renamed import unexplained. Lectures 03 and 06 passed every script and were still hard to read. So the reading gates come first, and the scripts run last. #2026_10_24_02_group_1

1. **Stage A: the first draft**, checked by the thread that wrote it.
2. **Stage B: the lecture**, checked by the fresh thread that simplified it.
3. **Stage C: the runtime check**, by a fresh thread that runs the lecture's code in `lab/`, with the build and the links last. #2026_11_05_02_group_1

## Stage A: the first draft #2026_10_24_02_group_1

Read `01-01-md-DRAFT-lectures/v1/{NN}.md` from top to bottom as a learner who meets the idea for the first time.

- [ ] **A1. Read before writing**: Did you read [opening-essence/SKILL.md](../opening-essence/SKILL.md), the reference sections in [content-benchmarks/SKILL.md](../content-benchmarks/SKILL.md) Section 1, and the principle map `01-01-map-principles/v1/{NN}.md`, and no Original Version file from `projects/react-09`?
- [ ] **A1B. Opening Essence & Zero Info Bombs**: Does the lecture open Zone 1 and each Principle in Zone 2 with the naked mechanism before the project files, unlocking every technical word through its everyday human meaning and elaborating every nuance of confusion in direct language (*"Yes, it is the exact same thing!"* or *"It may look the same, or work the same at first, but it is NOT the same thing!"*) as required by [opening-essence/SKILL.md](../opening-essence/SKILL.md)? Are there **zero front-loaded spoiler dumps** (`- In daily coding:` / `- In an interview:` at the top of principles) and **zero info bombs** that state a bug or an ordering rule (`A after B` vs. `A before B`) before showing the underlying shapes and laying out both possible positions (`A` first and `B` second vs. `B` first and `A` second)?
- [ ] **A2. First read**: Can every sentence be understood on the first read, without going back?
- [ ] **A3. Voice**: Does every paragraph sound like [Lecture 04](../../../../01-02-md-LECTURES/v1/04.md) and follow [lecture-voice/SKILL.md](../lecture-voice/SKILL.md): one idea per sentence, plain words for the parts, code names only where the reader must learn them, zero parentheses, and results with their conditions?
- [ ] **A4. One sentence before every block**: Does every code block have its own sentence above it, introducing one step in plain words?
- [ ] **A5. Code and browser match**: Does every browser preview show exactly what the code beside it renders, every heading, line, card, and badge, and nothing it does not render?
- [ ] **A6. Figures follow the text**: Has every idea in every figure, table, and preview already been said in the sentences above it?
- [ ] **A7. Principle cards**: Does every card explain its rule from the root in human words, as in content-benchmarks Section 2.12, with the syntax left to its blocks?

## Stage B: the lecture #2026_10_24_02_group_2

- [ ] **B1. Simplified**: Did you rewrite the first draft from top to bottom under [simplify/SKILL.md](../simplify/SKILL.md) into `01-02-md-LECTURES/v1/{NN}.md`, and leave the first draft unchanged?
- [ ] **B2. Facts and previews**: Is every fact still true, and does every browser preview still show exactly what its code renders after the rewrite?

## Stage C: the runtime check #2026_11_05_02_group_1

The reader trusts every page, Console line, and error the lecture shows. A map checked in a browser does not protect the lecture, because two writers change the text after the map. So the check runs on the lecture itself, in the one installed project `lab/` described in [lab/README.md](../../../../lab/README.md).

- [ ] **C1. Every claim run**: Does every code block, `page`, `shop`, `mail`, or `dom` preview, `devconsole` and `overlay` block, quoted warning or error, and sentence about what React, the browser, or Vite does have a case in `lab/cases/{NN}/` whose report shows it?
- [ ] **C2. Lecture matches the runtime**: Where the report differed, does the lecture now say what the runtime did, in the River voice, with the case run again after the fix?
- [ ] **C3. Build**: `node src/build-river.mjs {NN}` from `projects/react-10`. The HTML and PDF build cleanly. When River Prose Surveillance flags a line, reread that paragraph and rewrite it as a reader would want it, not only until the counter reaches zero. A clean counter says nothing about the reading. #2026_10_24_02_group_2
- [ ] **C4. Links**: `node ../../tools/check-links.mjs` from `projects/react-10` reports zero broken links. #2026_10_24_02_group_2
- [ ] **C5. Files**: Do `01-03-md-lectures-HTML/v1/{NN}.html` and `01-04-md-lectures-PDF/v1/{NN}.pdf` exist? If either is missing, report the build output and stop. #2026_10_24_02_group_2
- [ ] **C6. Report last**: Is `lab/reports/{NN}.md` written after everything above passes, naming each case, the command, the claims it covers, and each fix with the old and the new text?

### PROPER (format sample of `lab/reports/{NN}.md`; the case and its output are the lab's own `cases/example` run)

```markdown
- Case: lab/cases/example, run with `node lab/check.mjs lab/cases/example --click "::-p-text(Add to cart)"`.
- Claims: the page shows "Items: 2", then "Items: 3" and a third line "Eggs" after one click; the Console shows the missing key error.
- Matched: the page lines, and the Console line "Each child in a list should have a unique "key" prop." with "Check the render method of `App`." under it, as React 19.3.1 prints it.
- Fixed: nothing.
```

### COUNTER-EXAMPLE (the Lesson 15 map run of 2026-11-05)

The map writer built two separate React projects in `/tmp`, about 74 MB each, with several driver scripts and dev server logs, to test facts that two later writers were then free to change. The lecture itself was never run.

## The completion report #2026_10_24_02_group_4

The gates are questions you ask yourself while you work, not items to report one by one. Report briefly: the file URLs, what you fixed, and anything that failed or was skipped. Quote only text you changed.

### PROPER (report shape; the rewrite it quotes is the approved Lecture 03 fix recorded in the convolution brief)

```markdown
- Lecture: 01-02-md-LECTURES/v1/03.md, with its HTML and PDF.
- Fixed: one lead-in that recited the block: "Suppose a developer stores `title` and `author` in two constants at the top of `ArticleCard`. Then the developer writes `title` inside `<h2>` and `src="{avatarUrl}"` on the `<img>` tag:" became "In our card, suppose we store the article's title in a variable at the top of the function, and then we write that word directly between the heading tags without curly braces:".
- Build: build-river 03 built; surveillance flagged one sentence in Principle 3, reread and split. 0 broken links.
```

### COUNTER-EXAMPLE (a mechanical-only report)

```markdown
Built 03.html and 03.pdf. Prose audit: 0 parenthesis violations, 0 sentences > 28 words. Link check: 0 broken.
```

*Why this fails*: It reports only what a script counted, so none of the faults the reader meets are checked.
