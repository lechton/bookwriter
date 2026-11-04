---
name: simplify-v2
description: "River Version (v2) simplify pass. A fresh Argon thread that did not write the first draft reads `01-01-md-DRAFT-lectures/v2/{NN}.md`, assumes it is convoluted from top to bottom, and writes the clear lecture to `01-02-md-LECTURES/v2/{NN}.md`."
---

# River Version (`v2`): Simplify the First Draft #2026_10_24_02_group_2

Run this in a fresh thread that did not write the first draft. Read `01-01-md-DRAFT-lectures/v2/{NN}.md` and write the simplified lecture to `01-02-md-LECTURES/v2/{NN}.md`. Leave the first draft unchanged.

A first draft always comes out more convoluted than it should be, even when its writer tried hard to make it easy to read. Assume this draft has the problem from top to bottom. Change your mind only where the text already reads as clearly as [Lecture 04](../../../../01-02-md-LECTURES/v2/04.md) and [Lecture 05](../../../../01-02-md-LECTURES/v2/05.md). Then rewrite the lecture for maximum clarity, so it reads like those lectures.

Every fact stays true. The principle map `01-01-map-principles/v2/{NN}.md` is there only to check a fact when a rewrite touches one. Code blocks, figures, captions, and tables are text too, and they are simplified the same way.

Check [opening-essence/SKILL.md](../opening-essence/SKILL.md) first:
1. If the draft drops the reader into the lesson's project files before showing the naked mechanism in its simplest lines, or if it uses a technical word (*imperative*, *spreading*, *children*, *destructuring*) to define itself instead of unlocking its everyday human image and stating directly whether two things are ***"the exact same thing"*** or ***"may look the same, or work the same at first, but are NOT the same thing"***, add or rewrite that Opening Essence before the project code begins.
2. **Eliminate every info bomb and front-loaded spoiler dump**: Delete any front-loaded `- **In daily coding**:` / `- **In an interview**:` bullet dumps at the start of a principle that announce bugs (`top-level props arrive as undefined`, `NaN`) or ordering verdicts (`putting A after B overwrites B`) before the reader has seen the underlying shapes on stage. Whenever two things can be combined or ordered (`A` and `B`), first tell the reader they can be combined, then lay out both possible positions (`A` before `B`, meaning `A` is first and `B` is last, versus `B` before `A`, meaning `B` is first and `A` is last), and only then trace what happens in each position.

**Convoluted** (rejected Lecture 07 first draft):
> The module entry and Vite: a module script tag loads the startup file, and Vite translates JSX tags and package names for the browser.

**Convoluted** (rejected Lecture 04 draft):
> Let's start by pulling one `<article>` out of `App` and putting it into its own function called `ArticleCard`. We add a `console.log('ArticleCard runs')` inside it so we can see every time the function actually runs:

**Clear** (approved Lecture 04):
> Look at any real website: an online shop shows twenty product cards, and a news site shows twenty article cards. If you build that whole page inside one giant function, you end up copying and pasting the same card markup twenty times. Tomorrow, when you want to change the card's design, you have to hunt through hundreds of lines and edit all twenty copies by hand.

**Convoluted** (rejected Lecture 04 draft):
> On the last line, `addEventListener` receives `sayHello` without parentheses. Our code does not call `sayHello()` there.

**Clear** (approved Lecture 04):
> **Where did the parentheses go?** Look at the last line above. With parentheses, our code calls the function right now. Without parentheses, we hand the function itself to the browser.

## Headings: Convoluted vs. Clear

Simplify every `##` and `###` heading so it states the concept, comparison, mistake, or step in plain, direct words:

- **Convoluted**: `### Hardcoded text inside a component stamps out identical copies`
  **Clear**: `### Why hardcoded text inside a component repeats the same card`
- **Convoluted**: `### Old HTML script tags share one global space, but each module file keeps its names private`
  **Clear**: `### How module files keep their functions private`
- **Convoluted**: `### A file can have only one default export, so a file with multiple components exports them by name`
  **Clear**: `### Default export vs. named exports`
- **Convoluted**: `### Mistake 1: Nesting tags inside the card tag without rendering {children} in the card file`
  **Clear**: `### Mistake 1: Forgetting {children} inside the component`
- **Convoluted**: `### Mistake 2: Mismatching the attribute name in the parent and the property name in the child`
  **Clear**: `### Mistake 2: Using different prop names in the parent and the child`
- **Convoluted**: `### Mistake 1: Omitting readTime on the second card without a default value in the card file`
  **Clear**: `### Mistake 1: Omitting an optional prop without a default value`
- **Convoluted**: `### A new function tells React to destroy the old input box and build a new one`
  **Clear**: `### Why a recreated component function destroys the input box`
- **Convoluted**: `### Our complete city news project with children, spread attributes, and a default reading time`
  **Clear**: `### The complete project files`

