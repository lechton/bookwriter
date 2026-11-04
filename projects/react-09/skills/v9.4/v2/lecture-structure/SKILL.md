---
name: lecture-structure-v2
description: "River Version (v2) lecture structure for the first draft `01-01-md-DRAFT-lectures/v2/{NN}.md` and the lecture `01-02-md-LECTURES/v2/{NN}.md`. Governs the three zones of a River lecture: Zone 1, the general concepts introduction or runway; Zone 2, the principles 1 to N that grow one example step by step; and Zone 3, the complete example, the summary table, and For the Interview."
---

# River Version (`v2`) Lecture Structure (`01-02-md-LECTURES/v2/{NN}.md`)

## 1. Where the structure comes from #2026_10_24_01_group_1

The first draft, `01-01-md-DRAFT-lectures/v2/{NN}.md`, follows the headings below. The lecture, `01-02-md-LECTURES/v2/{NN}.md`, keeps them and may adapt them when the simplified pages read better another way. #2026_10_24_02_group_1

A River lecture flows through three zones in one forward movement. The Original Version taught the principles twice, once as abstract questions and again in a practical example at the end. The River Version teaches them once, on one example that grows from Principle 1 to Principle N. Each lesson has its own example, chosen anew in its map under [map-principles/SKILL.md](../map-principles/SKILL.md) Section 5B. #2026_10_24_03_group_1

1. **Zone 1, the runway**: why the concept exists on a real page, the shortest first taste of it, the elements it divides, the facts from earlier lessons it stands on, the project setup, and a preview of the principles.
2. **Zone 2, the principles**: each `## N. Principle N: ...` starts at its root, teaches any plain JavaScript it needs, grows the example by one step, and closes with a `> [!PRINCIPLE]` card.
3. **Zone 3, the close**: the complete example once, the order in which React calls its components, a summary table, and For the Interview.

## 2. Zone 1: the runway #2026_10_24_01_group_1

Zone 1 gives the reader the big picture and the ideas they need before Principle 1. Its subsections come in this order:

### 2.1 Header and interview question banner
```markdown
# Lecture {NN}: [Chapter Title]
> INTERVIEW QUESTION | ❱ CORE | [Exact question text from `questions/questions.md`]
```

### 2.2 The Opening Essence and why we need this concept (`## What ... Do` or `## Why We ...`)
- **The Opening Essence first**: before introducing the lesson's project files, open with the chapter's **Opening Essence** under [opening-essence/SKILL.md](../opening-essence/SKILL.md): strip away all project furniture, show the naked mechanism in its simplest lines (`<MyComponent>`, `John`, `article`, `count`), elaborate every nuance of confusion in direct language (*"Yes, it is the exact same thing!"* or *"It may look the same, or work the same at first, but it is NOT the same thing!"*), unlock any technical word through its everyday human image, and pair it with a `tree` Box-to-Boxes figure.
- **The real page problem**: after the reader sees the naked mechanism, show the page situation where this mechanism is needed. A browser preview or a `tree` comparison follows when it shows the problem better than words, such as twenty copied cards against one reusable component.
- **The example**: small, believable to a junior and a senior developer, and clear in a little browser window. Each page element enters only in the principle that needs it. The example is the one this lesson's map chose; a page from an earlier lesson returns only when the map chose it, and without back-references such as *"As we saw in Lecture 1..."*. #2026_10_24_03_group_1
- **The kinds of things the chapter divides or compares**: for example, built-in HTML tags known to the browser and component tags known only to React, or the four tools for conditional rendering.
- **Light prerequisites and project setup**: one or two plain sentences per prerequisite, and one paragraph on how the files are organized. When the lesson spans several files or folders, a ```` ```files ```` panel follows that paragraph.

A runway subsection carries a figure only when the figure shows a distinction the text has just made. The rejected Lecture 02 draft placed a figure in every subsection with almost no sentences between them, and the reader had nothing to hold on to.

### 2.3 Preview of the chapter's principles (`### [N] Principles of ...`)
1. A bold `**PRINCIPLES:**` lead-in and a numbered list, one item per principle, stating the big-picture idea in plain human words. **Never drop untaught code names, project variable names, or multi-step bug chains into this preview before those principles have been taught.**
2. A four-column table: `| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |`, written in plain human words without spoiler info bombs.

## 3. Zone 2: the principles #2026_10_24_01_group_1

The principles follow the cause-before-effect order of [content-benchmarks/SKILL.md](../content-benchmarks/SKILL.md) Section 2.8. Each `## N. Principle N: [Title]` advances the example by one step in this rhythm:

1. **The Opening Essence (`###` opening)**: open directly with the principle's **Opening Essence** under [opening-essence/SKILL.md](../opening-essence/SKILL.md) before touching the project files: show the naked mechanism, state directly whether two things are *"the exact same thing!"* or *"may look the same, or work the same at first, but are NOT the same thing!"*, unlock the technical word through its everyday human image, and lay out every combination and possible order (`A` before `B` vs. `B` before `A`) step by step. **Never front-load `- In daily coding:` / `- In an interview:` spoiler bullet dumps at the start of a principle before the reader has seen the mechanism and its shapes.**
2. **Plain JavaScript first, when the principle rests on it**: a short `Plain JavaScript` snippet and, when it helps, a `tree` figure. Examples: calling a function against handing it over, the three naming styles, the semicolon JavaScript inserts after a bare `return`, a function made again on every call.
3. **The example grows by one step**: one sentence before each code block, one step per block, as in content-benchmarks Sections 2.4 to 2.7. Show the page, the Console, or the Elements panel when this step changes something there.
4. **The `> [!PRINCIPLE]` card**: the bold title, the italic one-line rule, the explanation in human words as in content-benchmarks Section 2.12 (where the distilled daily-coding and interview takeaway now belongs, after every piece has been shown on stage), and the `**DO THIS:**` and `**DO NOT DO THIS:**` blocks described in [code-and-figures/SKILL.md](../code-and-figures/SKILL.md) Section 3.

**PROPER (a complete principle's heading sequence, from Lecture 09 Principle 1)**:
```markdown
## 1. Principle 1: Pass Wrapped JSX Through the Built-In `children` Prop
### Why wrapped elements only appear where your component writes `{children}`
### How React puts wrapped elements into `props.children`
### Mistake 1: Forgetting `{children}` inside the component
### Mistake 2: Renaming `children` to a custom prop name
### Rendering `{children}` inside the component
```

**COUNTER-EXAMPLE (the same principle with multi-clause slogans and wordy mistake titles)**:
```markdown
## 1. Principle 1: Pass Wrapped JSX Through the Built-In `children` Prop
### A component function does not show nested tags until it renders `children`, and the prop name is fixed as `children`
### How the build packs nested tags into `props.children`
### Mistake 1: Nesting tags inside the card tag without rendering `{children}` in the card file
### Mistake 2: Unpacking a custom parameter name such as `badges` instead of `children`
### Unpacking `children` and placing `{children}` inside the card
```

## 4. Zone 3: the complete example and For the Interview #2026_10_24_01_group_1

1. **`## Putting All [N] Principles Together ...`**: the complete working code once, a `tree` figure of the order in which React calls each component, and a summary table such as `| Aspect | The Plain JavaScript Habit | The React Rule |`.
2. **`## For the Interview`**:
   - **`### How to Answer Clearly in 30 Seconds`**: a natural spoken answer that covers the definition and every principle, built from the map's `## Interview Points`.
   - **`### Three Classic Follow-Up Questions Interviewers Ask`**: numbered questions and answers for the follow-ups interviewers really ask, closed with a `tree dir=right` comparison.
