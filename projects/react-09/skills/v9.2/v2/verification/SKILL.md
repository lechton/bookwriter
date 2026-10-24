---
name: verification-v2
description: "River Version (v2) quality gates for the pre-lecture `01-01-md-PRE-lectures/v2/{NN}.md` and the lecture `01-02-md-LECTURES/v2/{NN}.md`. Stage A checks the pre-lecture's content before any lecture page is written. Stage B checks the lecture by reading it as a learner, including every change it made to the pre-lecture's staging. Stage C runs the build and link scripts last."
---

# River Version (`v2`) Quality Gates

## Why reading comes before scripts #2026_10_24_01_group_4

A script can count parentheses and long sentences. It cannot tell whether a paragraph tells its story off stage, recites the code below it, or leaves a renamed import unexplained. Lectures 03 and 06 passed every script and were still hard to read. So the reading gates come first, and each one is answered by quoting the text, because a summary of your own work always says it passed.

1. **Stage A: the pre-lecture's content**, before the lecture is written.
2. **Stage B: the lecture's reading**, before any script runs.
3. **Stage C: the build and the links**, last.

## Stage A: the pre-lecture's content #2026_10_24_01_group_3

- [ ] **A1. Read before writing**: Did you read the reference sections in [pre-lecture/SKILL.md](../pre-lecture/SKILL.md) Section 5 and the principle map `01-01-map-principles/v2/{NN}.md`, and no Original Version (`v1`) file?
- [ ] **A2. Real sentences**: Is every beat a sentence the reader will read, in River voice, and not a note about a sentence? Does no beat copy the map's wording?
- [ ] **A3. The Content Gates report**: Does the pre-lecture end with the `## Content Gates` section of pre-lecture Section 6, with every line filled by quoting the beats?
- [ ] **A4. The lead-in ledger**: Read every sentence in the ledger next to the block it introduces. Does any sentence recite names the block already shows, or tell more than one event? Rewrite it in the beats, then copy it again.
- [ ] **A5. No stacked blocks**: Does every code block have its own sentence above it?
- [ ] **A6. One principle at a time**: Was each principle read as a learner and checked against pre-lecture Section 4 before the next one was written?

## Stage B: the lecture's reading #2026_10_24_01_group_1

Read `01-02-md-LECTURES/v2/{NN}.md` from top to bottom as a learner who meets the idea for the first time.

- [ ] **B1. First read**: Can every sentence be understood on the first read, without going back?
- [ ] **B2. Voice**: Does every paragraph sound like [Lecture 04](../../../../01-02-md-LECTURES/v2/04.md) and follow [lecture-voice/SKILL.md](../lecture-voice/SKILL.md): one idea per sentence, plain words for the parts, code names only where the reader must learn them, zero parentheses, and results with their conditions?
- [ ] **B3. Changes from the pre-lecture**: List every place where the lecture changed the staging: a new, moved, merged, or cut block or beat. For each, which benchmarks of pre-lecture Section 4 did you check again, and does the changed part still pass them?
- [ ] **B4. Lead-ins in the finished lecture**: Copy the sentence above every code block in the lecture into the report, in order. Does each one still introduce one step in plain words?
- [ ] **B5. Code and browser match**: Does every browser preview show exactly what the code beside it renders, every heading, line, card, and badge, and nothing it does not render?
- [ ] **B6. Figures follow the text**: Has every idea in every figure, table, and preview already been said in the sentences above it?
- [ ] **B7. Principle cards**: Does every card explain its rule from the root in human words, as in pre-lecture Section 4.12, with the syntax left to its blocks?

## Stage C: the build and the links #2026_10_24_01_group_4

Run these only after Stages A and B are reported.

- [ ] **C1. Build**: `node src/build-river.mjs {NN}` from `projects/react-09`. The HTML and PDF build cleanly. When River Prose Surveillance flags a line, reread that paragraph against Stage B and rewrite it as a reader would want it, not only until the counter reaches zero. A clean counter says nothing about the stages above.
- [ ] **C2. Links**: `node ../../tools/check-links.mjs` from `projects/react-09` reports zero broken links.

## The completion report #2026_10_24_01_group_4

The report gives one line per gate, in order, quoting text where the gate asks for it, and the script output last.

### PROPER (report shape; the rewrite it quotes is the approved Lecture 03 fix recorded in the convolution brief)

```markdown
- A1: Read Lecture 04, the two reference sections in Lectures 05 and 02, and map 03. No v1 file opened.
- A4: Lead-in ledger checked, 31 sentences. Rewrote one that recited the block: "Suppose a developer stores `title` and `author` in two constants at the top of `ArticleCard`. Then the developer writes `title` inside `<h2>` and `src="{avatarUrl}"` on the `<img>` tag:" became "In our card, suppose we store the article's title in a variable at the top of the function, and then we write that word directly between the heading tags without curly braces:".
- A5: No stacked blocks.
- B3: The lecture merged beats 3 and 4 of Principle 2 and added one Console block. Rechecked 4.4, 4.5, and 4.9 for that section: pass.
- B4: Lead-ins copied below, 33 sentences, all one step in plain words.
- C1: build-river 03 built; surveillance flagged one sentence in Principle 3, reread and split.
- C2: 0 broken links.
```

### COUNTER-EXAMPLE (a mechanical-only report)

```markdown
Built 03.html and 03.pdf. Prose audit: 0 parenthesis violations, 0 sentences > 28 words. Link check: 0 broken.
```

*Why this fails*: It reports only what a script counted, so none of the faults the reader meets are checked.
