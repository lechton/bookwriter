---
name: principle-definition
description: Guides the writing of every `> [!PRINCIPLE]` box (title, definition, side notes, code pair) by one reading test and a casebook of analysed good and bad boxes, plus the minimum syntax the build needs.
---

# Principle Definition

This skill governs the principle box: its title, its definition, its side notes, and its code pair. Load it whenever a principle is drafted, in the blueprint or the lecture. The explanation under the box belongs to principled-theory; comments on code lines belong to code-blocks. #2026_10_06_04_group_2

## What a Box Is For | 01 | One Surprise, Said Plainly #2026_10_06_04_group_2

A principle is a place where React does not do what the reader expects. The box tells the reader what they would expect, what actually happens, and what to write instead, in words they can picture on the first read. Its code pair shows the same thing in code the reader can copy. #2026_10_06_04_group_2

Notes: There is no fixed order of parts and no fixed length. The reader's own questions decide the order: a box about a setter asks "when does this run?", a box about the rogue zero asks "what does the screen show?". The casebook shows how different boxes follow different questions. #2026_10_06_04_group_2

## The Reading Test | 02 | Would a Beginner Get It on One Read? #2026_10_06_04_group_2

- [ ] Read the box as someone who knows only the lessons before this one. Can they picture every phrase (a number on the screen, a function that runs, a click), and could they say back what to write and why? If a phrase makes them ask "what is that?" or "later than what?", rewrite it in what they would see or do. #2026_10_06_04_group_2
- [ ] Is every claim true in React 19 and shown by the lesson's proofs? A warning is not a crash, and a development-only behavior is not a production bug. #2026_10_06_04_group_2

## Study the Casebook and Adapt | 03 | Take the Moves, Not the Words #2026_10_06_04_group_2

- [ ] Before drafting, read `examples.md` beside this file. Each case gives the context, a failing box quoted from a real run, a better box, and an analysis of what the reader is asking and what changed. #2026_10_06_04_group_2
- [ ] Take the moves the analyses name (follow the reader's question, say what they would see, use the code name when the reader already knows it). Do not take the cases' wording, variable names, sentence count, or shape into a lesson that teaches something else. #2026_10_06_04_group_2

## Where the Facts Come From | 04 | The Map and the Proofs #2026_10_06_04_group_2

- [ ] The principle map gives what is true: the surprise, which lesson owns it, its terms, and whether the right card is a must or a preference (its Review Point label). The verified proofs give what the code prints. Neither gives the wording; write the box from the reader's question, not from the map's sentences. #2026_10_06_04_group_2

## Syntax the Build Needs | 05 | Mechanics Only #2026_10_06_04_group_2

These are build requirements, checked by `diagnose-lecture` and the build, not standards of quality. #2026_10_06_04_group_2

- [ ] The box opens with `> [!PRINCIPLE]` and the header `> **Principle N: Title**`, numbered without gaps across the lecture. #2026_09_25_03_group_1 revised by #2026_10_06_04_group_2
- [ ] Side notes follow the definition as `> >> phrase : explanation`, one per line; each phrase appears in the definition with the same words. #2026_10_04_09_group_1 revised by #2026_10_06_04_group_2
- [ ] Bullets, when two look-alike things must be told apart, are consecutive `> - ` lines with one blank `>` line before and after the list. #2026_10_04_09_group_1 revised by #2026_10_06_04_group_2
- [ ] The box ends with a code pair. Use `*We should do this:*` and `*We should not do this:*` when the wrong code breaks (Review Point label Do, Do not, or Condition); use `*It is best practice to do this:*` and `*Instead of doing this:*` when both versions run (label Prefer or Avoid). #2026_10_04_11_group_1 revised by #2026_10_06_04_group_2
- [ ] Each code line of a card sits in its own backticks on its own `> ` line, keeps its indentation inside the backticks, stays within 68 characters, and each card carries at least one end-of-line comment saying what that line does or prints. #2026_09_26_14_group_1 revised by #2026_10_06_04_group_2
- [ ] No em-dashes and no hard wraps. #2026_10_06_04_group_2
