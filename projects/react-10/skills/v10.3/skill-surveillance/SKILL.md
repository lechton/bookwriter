---
name: skill-surveillance
description: "How to write and edit the skills in skills/v10.3/. Read it before any skill edit, together with prompt-writing/SKILL.md and prompt-writing/quality-checklist.md."
---

# Writing and Editing the Skills (`skills/v10.3/`) #2026_11_06_02_group_6

## Why this file is short

A writer copies the style of what it reads. When the skills were long and dense, the lectures came out long and dense. In `v10.2`, eight skill files held about 135,000 characters. The lectures followed the rules, and the reader still did not understand them. In `v10.3`, four files say the same things in plain words.

## How to edit a skill

1. **Write the skill the way you want the lecture written.** Use B2 English and short sentences. Say exactly what to do, with a real example. If a tired reader could not follow the skill, the writer will not follow it either.
2. **Fix before you add.** When a lecture goes wrong, first find the rule that caused it, and change or remove that rule. Add a new rule only when no existing rule covers the problem.
3. **One rule, one place.** If a rule already lives in one file, link to it. Do not copy it into another file.
4. **Show it, with one good and one bad example.** The good example is approved lecture text or the owner's own words, and its label names the source. The bad example is a rejected draft or an invented failure, labelled as such. Under the bad example, write *Why this fails* in plain words. Where steps are missing, list them.
5. **Keep the build's limits out of the skills.** If a skill says "at most 28 words", the writer writes 28 words every time. Describe what good text looks like instead.
6. **Keep each file short enough to read in a few minutes.** When a file grows, cut what is repeated or no longer needed before you add more.
7. **Check the other skills.** After an edit, look for older examples in the other files that now say the opposite, and fix them.
8. **Record the edit.** Tag each new section `#YYYY_MM_DD_NN_group_M`, add one row per group to [RULE-TAGS.md](../RULE-TAGS.md), and write a brief in `brief/brief_YYYY_MM_DD_NN.md`, as [prompt-writing/quality-checklist.md](../prompt-writing/quality-checklist.md) describes.

## A good and a bad skill rule

**PROPER** ([writing/SKILL.md](../v1/writing/SKILL.md) Section 2, `v10.3`):

> New code brings new words, such as `value`, `defaultValue`, `onChange`, `e.target.value`, or `setName`. The first time a word appears, write one plain sentence that says what it is, what it does, and who provides it: the browser, React, JavaScript, or our own code.

**COUNTER-EXAMPLE** (`v10.2`, opening-essence move 3):

> Unlock the technical word through its everyday human image, then draw it in a `tree` figure: Never drop a technical term as cold jargon. Connect the word to the physical picture inside it.

*Why this fails*: The writer cannot tell whether `onChange` is a "technical word". The words "unlock", "cold jargon", and "physical picture" have to be decoded before they can be followed. In Lecture 20, the writer gave everyday pictures for "default" and "controlled", and never explained `value` or `onChange`.
