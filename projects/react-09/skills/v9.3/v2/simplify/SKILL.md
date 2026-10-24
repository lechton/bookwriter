---
name: simplify-v2
description: "River Version (v2) simplify pass. A fresh Argon thread that did not write the first draft reads `01-01-md-DRAFT-lectures/v2/{NN}.md`, assumes it is convoluted from top to bottom, and writes the clear lecture to `01-02-md-LECTURES/v2/{NN}.md`."
---

# River Version (`v2`): Simplify the First Draft #2026_10_24_02_group_2

Run this in a fresh thread that did not write the first draft. Read `01-01-md-DRAFT-lectures/v2/{NN}.md` and write the simplified lecture to `01-02-md-LECTURES/v2/{NN}.md`. Leave the first draft unchanged.

A first draft always comes out more convoluted than it should be, even when its writer tried hard to make it easy to read. Assume this draft has the problem from top to bottom. Change your mind only where the text already reads as clearly as [Lecture 04](../../../../01-02-md-LECTURES/v2/04.md) and [Lecture 05](../../../../01-02-md-LECTURES/v2/05.md). Then rewrite the lecture for maximum clarity, so it reads like those lectures.

Every fact stays true. The principle map `01-01-map-principles/v2/{NN}.md` is there only to check a fact when a rewrite touches one. Code blocks, figures, captions, and tables are text too, and they are simplified the same way.

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
