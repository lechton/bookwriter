---
name: verification-v2
description: "River Version (v2) quality gates. Stage A checks the first draft `01-01-md-DRAFT-lectures/v2/{NN}.md` by reading it as a learner. Stage B checks the lecture `01-02-md-LECTURES/v2/{NN}.md` after the simplify pass, then runs the build and link scripts last."
---

# River Version (`v2`) Quality Gates

## Why reading comes before scripts #2026_10_24_01_group_4

A script can count parentheses and long sentences. It cannot tell whether a paragraph tells its story off stage, recites the code below it, or leaves a renamed import unexplained. Lectures 03 and 06 passed every script and were still hard to read. So the reading gates come first, and the scripts run last. #2026_10_24_02_group_1

1. **Stage A: the first draft**, checked by the thread that wrote it.
2. **Stage B: the lecture**, checked by the fresh thread that simplified it, with the build and the links last.

## Stage A: the first draft #2026_10_24_02_group_1

Read `01-01-md-DRAFT-lectures/v2/{NN}.md` from top to bottom as a learner who meets the idea for the first time.

- [ ] **A1. Read before writing**: Did you read the reference sections in [content-benchmarks/SKILL.md](../content-benchmarks/SKILL.md) Section 1 and the principle map `01-01-map-principles/v2/{NN}.md`, and no Original Version (`v1`) file?
- [ ] **A2. First read**: Can every sentence be understood on the first read, without going back?
- [ ] **A3. Voice**: Does every paragraph sound like [Lecture 04](../../../../01-02-md-LECTURES/v2/04.md) and follow [lecture-voice/SKILL.md](../lecture-voice/SKILL.md): one idea per sentence, plain words for the parts, code names only where the reader must learn them, zero parentheses, and results with their conditions?
- [ ] **A4. One sentence before every block**: Does every code block have its own sentence above it, introducing one step in plain words?
- [ ] **A5. Code and browser match**: Does every browser preview show exactly what the code beside it renders, every heading, line, card, and badge, and nothing it does not render?
- [ ] **A6. Figures follow the text**: Has every idea in every figure, table, and preview already been said in the sentences above it?
- [ ] **A7. Principle cards**: Does every card explain its rule from the root in human words, as in content-benchmarks Section 2.12, with the syntax left to its blocks?

## Stage B: the lecture #2026_10_24_02_group_2

- [ ] **B1. Simplified**: Did you rewrite the first draft from top to bottom under [simplify/SKILL.md](../simplify/SKILL.md) into `01-02-md-LECTURES/v2/{NN}.md`, and leave the first draft unchanged?
- [ ] **B2. Facts and previews**: Is every fact still true, and does every browser preview still show exactly what its code renders after the rewrite?
- [ ] **B3. Build**: `node src/build-river.mjs {NN}` from `projects/react-09`. The HTML and PDF build cleanly. When River Prose Surveillance flags a line, reread that paragraph and rewrite it as a reader would want it, not only until the counter reaches zero. A clean counter says nothing about the reading.
- [ ] **B4. Links**: `node ../../tools/check-links.mjs` from `projects/react-09` reports zero broken links.
- [ ] **B5. Files**: Do `01-03-md-lectures-HTML/v2/{NN}.html` and `01-04-md-lectures-PDF/v2/{NN}.pdf` exist? If either is missing, report the build output and stop.

## The completion report #2026_10_24_01_group_4

Each thread reports its own stage, one line per gate, in order, quoting text where a gate asks for it, and the script output last.

### PROPER (report shape; the rewrite it quotes is the approved Lecture 03 fix recorded in the convolution brief)

```markdown
- A1: Read Lecture 04, the two reference sections in Lectures 05 and 02, and map 03. No v1 file opened.
- A4: Rewrote one lead-in that recited the block: "Suppose a developer stores `title` and `author` in two constants at the top of `ArticleCard`. Then the developer writes `title` inside `<h2>` and `src="{avatarUrl}"` on the `<img>` tag:" became "In our card, suppose we store the article's title in a variable at the top of the function, and then we write that word directly between the heading tags without curly braces:".
- B3: build-river 03 built; surveillance flagged one sentence in Principle 3, reread and split.
- B4: 0 broken links.
```

### COUNTER-EXAMPLE (a mechanical-only report)

```markdown
Built 03.html and 03.pdf. Prose audit: 0 parenthesis violations, 0 sentences > 28 words. Link check: 0 broken.
```

*Why this fails*: It reports only what a script counted, so none of the faults the reader meets are checked.
