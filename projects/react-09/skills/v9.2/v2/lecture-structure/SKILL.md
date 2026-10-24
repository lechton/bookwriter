---
name: lecture-structure-v2
description: "River Version (v2) lecture structure for `01-02-md-LECTURES/v2/{NN}.md` and for the headings of its pre-lecture. Governs the three zones of a River lecture: Zone 1, the general concepts introduction or runway; Zone 2, the principles 1 to N that grow one example step by step; and Zone 3, the complete example, the summary table, and For the Interview."
---

# River Version (`v2`) Lecture Structure (`01-02-md-LECTURES/v2/{NN}.md`)

## 1. Where the structure comes from #2026_10_24_01_group_1

The pre-lecture, `01-01-md-PRE-lectures/v2/{NN}.md`, copies the headings below and stages every section in beats under [pre-lecture/SKILL.md](../pre-lecture/SKILL.md). The lecture follows those headings and may adapt them when the finished pages read better another way.

A River lecture flows through three zones in one forward movement. The Original Version taught the principles twice, once as abstract questions and again in a practical example at the end. The River Version teaches them once, on one example that grows from Principle 1 to Principle N.

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

### 2.2 Why we need this concept (`## Why We ...`)
- **The real page problem**: open with a page situation the reader recognizes at once. A browser preview or a `tree` comparison follows when it shows the problem better than words, such as twenty copied cards against one reusable component.
- **The example**: small, believable to a junior and a senior developer, and clear in a little browser window. Each page element enters only in the principle that needs it. An example from an earlier chapter returns only when it fits naturally, without back-references such as *"As we saw in Lecture 1..."*.
- **First taste of the mechanism**: the shortest two-step preview, with a figure when it helps.
- **The two kinds of things the chapter divides**: for example, built-in HTML tags known to the browser and component tags known only to React.
- **Light prerequisites and project setup**: one or two plain sentences per prerequisite, and one paragraph on how the files are organized. When the lesson spans several files or folders, a ```` ```files ```` panel follows that paragraph.

A runway subsection carries a figure only when the figure shows a distinction the text has just made. The rejected Lecture 02 draft placed a figure in every subsection with almost no sentences between them, and the reader had nothing to hold on to.

### 2.3 Preview of the chapter's principles (`### Four Principles of ...`)
1. A bold `**PRINCIPLES:**` lead-in and a numbered list, one item per principle, naming its daily bug and its interview trap in plain words.
2. A four-column table: `| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |`.

## 3. Zone 2: the principles #2026_10_24_01_group_1

The principles follow the cause-before-effect order of [pre-lecture/SKILL.md](../pre-lecture/SKILL.md) Section 4.8. Each `## N. Principle N: [Title]` advances the example by one step in this rhythm:

1. **The root (`###` opening)**: the root distinction and why it matters in daily coding and in an interview, as in pre-lecture Section 4.1.
2. **Plain JavaScript first, when the principle rests on it**: a short `Plain JavaScript` snippet and, when it helps, a `tree` figure. Examples: calling a function against handing it over, the three naming styles, the semicolon JavaScript inserts after a bare `return`, a function made again on every call.
3. **The example grows by one step**: one sentence before each code block, one step per block, as in pre-lecture Sections 4.4 to 4.7. Show the page, the Console, or the Elements panel when this step changes something there.
4. **The `> [!PRINCIPLE]` card**: the bold title, the italic one-line rule, the explanation in human words as in pre-lecture Section 4.12, and the `**DO THIS:**` and `**DO NOT DO THIS:**` blocks described in [code-and-figures/SKILL.md](../code-and-figures/SKILL.md) Section 3.

## 4. Zone 3: the complete example and For the Interview #2026_10_24_01_group_1

1. **`## Putting All [N] Principles Together ...`**: the complete working code once, a `tree` figure of the order in which React calls each component, and a summary table such as `| Aspect | The Plain JavaScript Habit | The React Rule |`.
2. **`## For the Interview`**:
   - **`### How to Answer Clearly in 30 Seconds`**: a natural spoken answer that covers the definition and every principle, built from the map's `## Interview Points`.
   - **`### Three Classic Follow-Up Questions Interviewers Ask`**: numbered questions and answers for the follow-ups interviewers really ask, closed with a `tree dir=right` comparison.
