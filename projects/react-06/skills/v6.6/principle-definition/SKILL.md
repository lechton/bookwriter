---
name: principle-definition
description: The rules for every `> [!PRINCIPLE]` box (title, text, side notes, code pair), the casebook of owner-approved boxes with their failed drafts, and the syntax the build needs.
---

# Principle Definition

This skill governs the principle box. Load it whenever a principle is drafted or reviewed, in the blueprint or the lecture. The paragraph under the box belongs to principled-theory. #2026_10_06_05_group_2

Before writing a box, read `examples.md` beside this file. It holds only boxes the owner approved, each with the failed drafts before it and why they failed. Take the moves, not the topic, names, or length. #2026_10_06_05_group_2

## The Rules | 01 | What the Owner Enforced, Box by Box #2026_10_06_05_group_2

- [ ] **Basics first.** Does the box first state, in its own plain sentence, the fact it stands on (what the code normally does, what the reader already knows) and what the reader expects? A fact the principle depends on never hides in a side clause. (Casebook Cases 2, 3, 6) #2026_10_06_05_group_2
- [ ] **A title the reader understands at once.** Is the title one plain sentence in sentence case (capitalize only the first word and proper names; code stays in backticks)? Does it make one claim, in words the reader already has: what they see (the screen, the page, a click, a run of the component), and no word the lesson is still teaching (render, commit, trigger)? Does it name a thing or a moment, never an abstraction such as "what differs", and never join two claims with "so"? (Cases 2, 5, 7) #2026_10_07_01_group_1

  - PROPER EXAMPLE: `Each run of a component starts its variables over` (one claim, words the reader has, a moment they can picture).
  - PROPER EXAMPLE: `Call a setter only when the user clicks` (written by the owner; it names the moment).
  - PROPER EXAMPLE: `Running a component again does not rebuild the page` (names the reader's fear and answers it).
  - COUNTER-EXAMPLE: `The Commit Changes Only What Differs, So Typed Text Stays` (Title Case; "commit" is the word being taught; "what differs" is abstract; "so" joins two claims). The owner: "very cryptic".
  - COUNTER-EXAMPLE: `A State Change Runs Its Component and Every Component Inside It` ("its component" leaves the reader asking which one).
  - COUNTER-EXAMPLE: `Assigning a Local Variable Does Not Ask React to Render` (Case 1, the October 6 run: a machinery word, and React treated as a person who is asked).

- [ ] **Then what really happens, step by step.** Does it say what happens in the order it happens, with things the reader can see: a value on the screen, a line that runs again, a message in the console? (Cases 1, 4) #2026_10_06_05_group_2
- [ ] **Show, do not claim.** Does every "does not" come with the step that would make it happen? React is never a person who looks, wants, waits, or is asked. (Case 1) #2026_10_06_05_group_2
- [ ] **General names.** Does the box use general names (`count`, `setCount`, `Counter`, a component, the screen) and nothing from the lesson's story: no component, variable, label, or character from the lesson's example? The story goes in the paragraph under the box. (Case 1) #2026_10_06_05_group_2
- [ ] **No riddles.** Is every sentence clear on its own? No "later" without "than what", no "something", no stacked "suppose... and then...", no edge case before the rule. (Case 2) #2026_10_06_05_group_2
- [ ] **No words the reader lacks.** Does the box avoid machinery words (render, render cycle, memory slot, call order) and invented terms? A word taught in a later principle appears only with a pointer to where it is taught ("as Principle 3 shows"). A side note is given only for a term the box itself needs, with the same words. (Cases 1, 3, 4, 6) #2026_10_06_05_group_2
- [ ] **One idea.** Does the box hold one idea, or one idea and the question it raises next? (Case 4) #2026_10_06_05_group_2
- [ ] **Code that stands alone.** Does each card include the lines it needs to be read alone (the declaration as well as the change), and does its comment say what the reader would see? (Cases 1, 3) #2026_10_06_05_group_2
- [ ] **True.** Is every claim true in React 19 and shown by the lesson's verified proofs? #2026_10_06_05_group_2

## The Four Sequential Principle Passes | 01B | Strict Verification Order #2026_10_07_02_group_1

Never proceed to the next pass until the preceding pass is checked. The algorithmic pass is forbidden until the human legibility passes pass. #2026_10_07_02_group_1

- [ ] **Pass 1: Benchmark Casebook Alignment.** Have you carefully studied the approved examples and failed drafts in `examples.md`? Does this box adopt an approved move from the owner's cases and strictly avoid the rejected patterns (no glossaries, no machinery words, general names only)? *(ONLY if Pass 1 is checked, proceed to Pass 2)* #2026_10_07_02_group_1
- [ ] **Pass 2: The "Picture It" Test (Observable Reality).** Can a tired reader instantly picture what is on the screen or which line is running in the editor? Are abstract claims ("what differs", "state drift across cycles") replaced with physical observations (the button shows 0, the next line runs)? *(ONLY if Pass 2 is checked, proceed to Pass 3)* #2026_10_07_02_group_1
- [ ] **Pass 3: Plain JavaScript First (For Engine & Lifecycle Topics).** When the principle explains how React runs code or updates state, does it start with the plain JavaScript execution fact before introducing any framework behavior or React label? (`count` is just a constant number 0 in this function call; never open with "called a snapshot" or "stored in React's queue"). *(ONLY if Pass 3 is checked, proceed to Pass 4)* #2026_10_07_02_group_1
- [ ] **Pass 4: Algorithmic & Build Pass (The Mechanical Gate).** ONLY if Passes 1–3 pass: Does `node src/diagnose-lecture.mjs {NN}` report 0 invariant failures, and does `node src/build-lectures.mjs` compile clean HTML and PDF? #2026_10_07_02_group_1

## Syntax the Build Needs | 02 | Mechanics Only #2026_10_06_05_group_2

These are checked by `diagnose-lecture` and the build. #2026_10_06_05_group_2

- [ ] The box opens with `> [!PRINCIPLE]` and `> **Principle N: Title in sentence case**`, numbered without gaps. #2026_10_06_05_group_2 revised by #2026_10_07_01_group_1
- [ ] Key technical terms are bolded on their first formal introduction in the box prose (such as `**batching**`, `**updater function**`, `**state variable**`), matching any accompanying side notes (`> >> phrase : ...`) and subsequent Glossary entries. #2026_10_07_05_group_2
- [ ] Side notes follow the text as `> >> phrase : explanation`, one per line. #2026_10_06_05_group_2
- [ ] Bullets, used only when one piece of code holds two things the reader must tell apart, are `> - ` lines with a blank `>` line before and after the list. #2026_10_06_05_group_2
- [ ] The box ends with its code. When the map's `Real Mistake` is filled, that is a pair: `*We should do this:*` / `*We should not do this:*` when the wrong code breaks, `*It is best practice to do this:*` / `*Instead of doing this:*` when both run. When it is `none`, the box ends with one `*We should do this:*` card. #2026_10_06_05_group_2 revised by #2026_10_06_09_group_2
- [ ] Each code line sits in its own backticks on its own `> ` line, keeps its indentation, stays within 68 characters, and each card has at least one end-of-line comment. #2026_10_06_05_group_2
- [ ] No em-dashes, no hard wraps. #2026_10_06_05_group_2

## Adding to the Casebook | 03 | Only After Approval #2026_10_06_05_group_2

- [ ] A box enters `examples.md` only after the owner approves it, together with the drafts the owner rejected and the reason, in the owner's words where possible. A new rule enters the list above only when the owner enforced it on a real box. #2026_10_06_05_group_2
