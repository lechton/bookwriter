---
name: principled-theory
description: Governs the theory before the principles, the paragraph under each principle box, the choice of an honest code pair, map traceability, and zero new concepts after the principles.
---

# Principled Theory

This skill governs everything around the principle boxes: the theory that prepares them, the paragraph under each box, and the sections after them. The box itself belongs to `principle-definition`, whose rules also apply here wherever they are not about the box alone. #2026_10_06_05_group_3

Notes: Approved examples of the paragraph under the box will be added to `principle-definition/examples.md` once the owner approves them. Until then, the rules below stand alone. #2026_10_06_05_group_3

## Theory Before the Principles | 01 | Nothing Unexplained #2026_09_25_03_group_1 revised by #2026_10_06_05_group_3

- [ ] Does a theory section (`### ...`) before `### Principles of React: {Topic}` explain, in plain words, the basics the principles stand on, so no box meets the reader with an idea they have not seen? #2026_09_25_03_group_1 revised by #2026_10_06_05_group_3
- [ ] Does the theory avoid deferring a basic explanation to the practical example ("we will see how this works later")? #2026_10_06_05_group_3

## The Paragraph Under the Box | 02 | The Rule on the Lesson's Own Example #2026_10_06_05_group_3

- [ ] Does the paragraph show the box's rule on the lesson's own example, with its names (the story's component, variables, and characters belong here, not in the box)? #2026_10_06_05_group_3
- [ ] Does it follow the box's rules: basics first, then what happens in the order it happens, shown and not claimed (React never looks, waits, or is asked), no riddles, no machinery words? #2026_10_06_05_group_3
- [ ] Does it add what the box left out (the real values, the exact console line or error, the variation the reader will meet) instead of repeating the box's words? #2026_10_06_05_group_3
- [ ] Is every output it quotes verified by the lesson's proofs, in a titled code block where the reader must see the code? A block already shown earlier is named by its title, not printed again. #2026_09_26_16_group_1 revised by #2026_10_06_03_group_4 and #2026_10_06_05_group_3
- [ ] Does it trace only the layers the principle touches, ending in what the reader can see (the screen, the console, DevTools, the build output)? #2026_09_26_09_group_1 revised by #2026_10_06_03_group_6
- [ ] When it names another lesson, does it do so in an ordinary sentence ("Lecture 16 explains why"), never as a closing formula repeated under every box? #2026_10_06_05_group_3

## Choosing the Code Pair | 03 | Honest and Readable Alone #2026_09_26_06_group_1 revised by #2026_10_06_05_group_3

- [ ] Do both cards show peer code from the same file and language, never an HTML tag against a JavaScript call, a terminal command, or identical code with different comments? #2026_09_27_12_group_1 revised by #2026_10_06_05_group_3
- [ ] Does the wrong card show a mistake developers really make in this topic, not a strawman or a trivial typo? #2026_09_26_06_group_1 revised by #2026_10_06_05_group_3
- [ ] When no honest same-file pair exists, is the topic raised in the map as possibly not a principle, instead of forcing a card? #2026_10_06_05_group_3

## Map Traceability | 04 | The Map Decides the Principles #2026_09_26_19_group_1 revised by #2026_10_06_05_group_3

- [ ] Do the lecture's principles and their order come from the approved `01-01-map-principles/{nn}.md`, one box per map principle, none added, merged, or split? #2026_09_26_19_group_1 revised by #2026_10_06_05_group_3
- [ ] Are the map's `Prerequisite` rows one-line recalls and its `Preview` rows one sentence, each naming the owner lesson? #2026_09_26_21_group_2 revised by #2026_10_06_05_group_3

## After the Principles | 05 | Zero New Concepts #2026_09_24_02_group_1 revised by #2026_10_06_05_group_3

- [ ] Do the practical example, `### Where you will meet this`, `### Glossary`, `## Beyond the basics`, and `### Summary` use only what the theory and principles taught? #2026_09_24_02_group_1 revised by #2026_10_06_05_group_3
- [ ] Are `> [!TIP]` callouts titled `**To impress the interviewer:**` short, true, and in the lesson's plain words, and are `> [!WILD]` callouts kept for real surprises? #2026_09_24_02_group_1 revised by #2026_10_06_05_group_3
