---
name: principled-theory
description: Governs the runway before the principles, the question and answer around each principle box, the choice of an honest code pair, map traceability, and zero new concepts after the principles.
---

# Principled Theory

This skill governs everything around the principle boxes: the runway that prepares them, the question and the answer that lead to each box, and the sections after them. The box itself belongs to `principle-definition`, whose rules also apply here wherever they are not about the box alone. The order of the parts belongs to `lecture-structure` Sections 12 and 12C. #2026_10_06_05_group_3 revised by #2026_10_10_01_group_6

Notes: Approved examples of the answer before the box will be added to `principle-definition/examples.md` once the owner approves them. Until then, the rules below and the cycle example in `lecture-structure` Section 12C stand alone. #2026_10_06_05_group_3 revised by #2026_10_10_01_group_6

## Theory Before the Principles | 01 | Nothing Unexplained #2026_09_25_03_group_1 revised by #2026_10_06_05_group_3 and #2026_10_10_01_group_6

- [ ] Do the runway sections (`### ...`) before `### Principles of React: {Topic}` explain, in plain words, every idea and code form the questions, answers, and boxes use, as planned in the blueprint's `[runway]` elements, so no box meets the reader with an idea they have not seen? #2026_09_25_03_group_1 revised by #2026_10_06_05_group_3 and #2026_10_10_01_group_6
- [ ] Does the theory avoid deferring a basic explanation to the practical example ("we will see how this works later")? #2026_10_06_05_group_3

## The Answer Before the Box | 02 | The Rule on the Lesson's Own Example #2026_10_06_05_group_3 revised by #2026_10_10_01_group_6

The answer does the work that a paragraph under the box used to do: it shows the rule on the lesson's own example before the box states it in general names. The box closes the cycle, and the next question follows it directly. #2026_10_10_01_group_6

- [ ] Does the answer show what happens on the lesson's own example, with its names (the story's component, variables, and values belong here, not in the box)? #2026_10_06_05_group_3 revised by #2026_10_10_01_group_6
- [ ] Does it follow the box's rules: basics first, then what happens in the order it happens, shown and not claimed (React never looks, waits, or is asked), no riddles, no machinery words? #2026_10_06_05_group_3
- [ ] Does it recall, in a few words, each idea the runway or an earlier lecture taught ("the updater from the start of this lecture", "as Lecture 16 showed"), instead of teaching it again or using it without a word? #2026_10_10_01_group_6
- [ ] Does it give what the box leaves out (the real values, the exact console line or error, the variation the reader will meet), so the box can stay general? #2026_10_06_05_group_3 revised by #2026_10_10_01_group_6
- [ ] Is every output it quotes verified by the lesson's proofs, in a titled code block where the reader must see the code? A block already shown earlier is named by its title, not printed again. #2026_09_26_16_group_1 revised by #2026_10_06_03_group_4 and #2026_10_06_05_group_3
- [ ] Does it trace only the layers the principle touches, ending in what the reader can see (the screen, the console, DevTools, the build output)? #2026_09_26_09_group_1 revised by #2026_10_06_03_group_6
- [ ] When it names another lesson, does it do so in an ordinary sentence ("Lecture 16 explains why"), never as a closing formula repeated in every answer? #2026_10_06_05_group_3 revised by #2026_10_10_01_group_6

## Choosing the Code Pair | 03 | Honest and Readable Alone #2026_09_26_06_group_1 revised by #2026_10_06_05_group_3

- [ ] Do both cards show peer code from the same file and language, never an HTML tag against a JavaScript call, a terminal command, or identical code with different comments? #2026_09_27_12_group_1 revised by #2026_10_06_05_group_3
- [ ] Does the wrong card show the map's `Real Mistake`, a mistake developers really make in this topic, not a strawman or a trivial typo? #2026_09_26_06_group_1 revised by #2026_10_06_05_group_3 and #2026_10_06_09_group_2
- [ ] When the map's `Real Mistake` is `none`, does the box end with the right card alone, instead of a wrong card made up to complete a pair? #2026_10_06_05_group_3 revised by #2026_10_06_09_group_2
- [ ] Is the right card code the reader has already seen work in this cycle's answer, never a form the lecture shows for the first time inside the box? #2026_10_10_01_group_6

## Map Traceability | 04 | The Map Decides the Principles #2026_09_26_19_group_1 revised by #2026_10_06_05_group_3, #2026_10_07_05_group_1, and #2026_10_11_06_group_1

- [ ] Do the lecture's principles and their order come from the approved `01-01-map-principles/{nn}.md`, one question cycle and one box per map principle, none added, merged, or split? #2026_09_26_19_group_1 revised by #2026_10_06_05_group_3 and #2026_10_10_01_group_6
- [ ] When the obvious fix has a catch, does the same answer carry it to the end (the junior fix, what it still gets wrong, the senior fix) instead of leaving a fix the author knows is incomplete for the next question (`lecture-structure` Section 12C)? #2026_10_11_06_group_1
- [ ] When a `Model` principle names a later principle as its `Fix In`, does the model's cycle show the mistake, explain it, and show the fix, while the later cycle opens with the case the model's cycle did not show (its own `Real Mistake` or its boundary)? Two boxes that carry the same pair are one idea told twice, and a merged box loses the later principle's boundary. #2026_10_10_01_group_6
- [ ] Are the map's `Prerequisite` rows one-line recalls and its `Preview` rows one sentence, each naming the owner lesson? #2026_09_26_21_group_2 revised by #2026_10_06_05_group_3
- [ ] **The map contract is architecture, not story.** The map contract governs the architectural principles, their order, ledger dispositions, mechanisms, and runtime defects. The illustrative story names, component names, or fictional setups in the map's Friction and Under the Hood fields are scratch scaffolding; authors must replace any idiosyncratic or contrived map names (such as "free passes", "promotion desk", or newsroom CMS entities) with universal, everyday UI elements (such as `TicketOrder`, `ShoppingCart`, `LikeCounter`, `ItemQuantity`). #2026_10_07_05_group_1

## After the Principles | 05 | Zero New Concepts #2026_09_24_02_group_1 revised by #2026_10_06_05_group_3

- [ ] Do the practical example, `### Where you will meet this`, `### For the interview`, `### Glossary`, `## Beyond the basics`, and `### Summary` use only what the runway and the question cycles taught? #2026_09_24_02_group_1 revised by #2026_10_06_05_group_3 and #2026_10_10_01_group_6
- [ ] Are `> [!TIP]` callouts titled `**To impress the interviewer:**` short, true, and in the lesson's plain words, and are `> [!WILD]` callouts kept for real surprises? #2026_09_24_02_group_1 revised by #2026_10_06_05_group_3
