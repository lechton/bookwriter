---
name: move-steps-for-a-surprise
description: "The move for a result on the page that the reader would not expect: the steps that cause it."
---

# Steps for a Surprise #2026_11_07_11_group_2

## When to use it

Use it only when the page does something the reader would not expect. If the reader would expect the result, one sentence is enough, and there are no steps.

## How to do it

1. Say what the page shows.
2. Give the reason in steps, in the order they happen, one step per sentence. Use a numbered list for three or more steps.
3. The steps show what the reader cannot see in the code: what the browser does, what React does, and what changes between two renders.

A question may open the steps when it is about one general rule, as in the Lecture 05 example below. When the steps are about state, setters, and handlers, give the answer first, as [lecture/SKILL.md](../lecture/SKILL.md) says.

## A good and a bad example

**PROPER** (Lecture 05):

> The word `StoryCard` does not exist anywhere inside our card file! Inside the card file, the function is still named `ArticleCard`. Why doesn't JavaScript complain that `StoryCard` is missing?
>
> Because the import line has no curly braces, JavaScript does not search the card file for a function named `StoryCard`. Instead, it does two simple steps:
> 1. Go to the card file and grab whatever single function is marked `export default`, which is `ArticleCard`.
> 2. Give that function the new local name `StoryCard` inside our main file, so we can render it as `<StoryCard />`.

**COUNTER-EXAMPLE** (Lecture 21, written under `v10.3`):

> The highlighted line looks dense, so here it is in order:
> 1. JavaScript reads the text in the box and counts its letters.
> 2. It checks whether that count is exactly 0. The answer is `true` or `false`.
> 3. It stores that answer in `applyButton.disabled`.

*Why this fails*: Nothing here surprises the reader, so the steps only read the line aloud. One sentence was enough: the button stays off while the box is empty.
