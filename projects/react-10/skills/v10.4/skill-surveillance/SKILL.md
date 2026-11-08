---
name: skill-surveillance
description: "How to write and edit the skills in skills/v10.4/. Read it before any skill edit, together with prompt-writing/SKILL.md and prompt-writing/quality-checklist.md."
---

# Writing and Editing the Skills (`skills/v10.4/`) #2026_11_06_02_group_6

## Why this file is short

A writer copies the style of what it reads. When the skills were long and dense, the lectures came out long and dense. In `v10.2`, eight skill files held about 135,000 characters. The lectures followed the rules, and the reader still did not understand them. In `v10.3`, four files say the same things in plain words.

## How to edit a skill

1. **Write the skill the way you want the lecture written.** Use plain English, and let each sentence follow from the one before. Say exactly what to do, with a real example. If a reader could not follow the skill on one read, the writer will not follow it either. #2026_11_07_03_group_3 Follow [skill-style/SKILL.md](../skill-style/SKILL.md) for every word you write in a skill. #2026_11_07_10_group_1
2. **Fix before you add.** When a lecture goes wrong, first find the rule that caused it, and change or remove that rule. Add a new rule only when no existing rule covers the problem.
3. **One rule, one place.** If a rule already lives in one file, link to it. Do not copy it into another file.
4. **Show it, with one good and one bad example.** The good example is approved lecture text or the owner's own words, and its label names the source. The bad example is a rejected draft or an invented failure, labelled as such. Under the bad example, write *Why this fails* in plain words. Where steps are missing, list them.
5. **Keep the build's limits out of the skills.** If a skill says "at most 28 words", the writer writes 28 words every time. Describe what good text looks like instead.
6. **Keep each file short enough to read in a few minutes.** When a file grows, cut what is repeated or no longer needed before you add more.
7. **Check the other skills.** After an edit, look for older examples in the other files that now say the opposite, and fix them, as *The curse of AI skill writing* below describes. #2026_11_07_09_group_1
8. **Record the edit.** Tag each new section `#YYYY_MM_DD_NN_group_M`, add one row per group to [RULE-TAGS.md](../RULE-TAGS.md), and write a brief in `brief/brief_YYYY_MM_DD_NN.md`, as [prompt-writing/quality-checklist.md](../prompt-writing/quality-checklist.md) describes.
9. **Show the edit before you make it.** Draw every proposed edit as a rendered diff in the chat, and wait for the owner's approval, as [edit-preview/SKILL.md](../edit-preview/SKILL.md) describes. #2026_11_07_08_group_1

## The curse of AI skill writing #2026_11_07_09_group_1

The owner sees a good passage and asks to keep it in the skills as an example. The model that edits the skill rarely stops at the example. It turns the example into a general rule, and that rule controls far more than the owner asked for. One good walk through the steps behind a surprising result becomes "always show the steps". One short opening becomes a word limit. The same happens when a rule becomes a build check, such as the 28-word sentence limit in `src/build-river.mjs`.

The owner knows the good example, because the owner chose it. The owner rarely sees the rule written around it, or what that rule does to every later lecture. The damage shows up lectures later, in text the owner never connects to that example.

The curse has a mirror image. When the owner sees the damage and asks to remove the rule, the model is tempted to delete the good example with it, because the two were written together. The example was never the problem. The rule that read too much into it was. Deleting both loses what the owner wanted, and the confusion about what the example taught stays.

There is a third form. A new, good rule is written, and an old example that teaches the opposite stays in the file, often still labelled PROPER. The writer reads two lessons that contradict each other, and copies the one that is more vivid.

So, every time you add, change, or remove an example:
1. Say in one sentence what the owner liked in it, and write the rule for exactly that situation, nothing wider. "When a result on the screen surprises the reader, walk through the steps that cause it" is what the example teaches. "Always show the steps" is micromanagement the owner never asked for.
2. Warn the owner. Under the diff that [edit-preview/SKILL.md](../edit-preview/SKILL.md) asks for, list every rule or build check written around the example, say what it will change in later lectures, and say plainly where it reaches beyond the example.
3. When you remove a rule that reached too far, keep the example that inspired it, and rewrite the rule around what the example really taught. Remove the example only when the owner no longer wants what it shows.
4. When you add a rule, search every file in `skills/v10.4/` for older examples that teach the opposite, and retire or relabel them in the same batch. Tell the owner which ones.

**COUNTER-EXAMPLE** (writing Section 3, 2026-11-06). The owner liked the Lecture 05 passage that walks through two steps to explain why `StoryCard` works although the card file never names it. The model kept the example and wrote around it "A result without its steps is not an explanation", plus a fixed order for every visible idea: the page, the code, the page after each action, then the steps. The owner was not told. In Lecture 21, the opening then spent a whole paragraph narrating a one-line click handler that the reader already understood from Lessons 10 and 12.

*Why this fails*: The example taught one thing: steps for a surprising result. The rule around it asked for steps everywhere, and nobody warned the owner.

**PROPER** (the same example, scoped and announced). The rule says: "When a single piece of code does something on the screen that the reader would not predict, walk through the steps that cause it, as Lecture 05 does for `StoryCard`. When the result is just what the code says, one sentence is enough." The note under the diff says: "This rule applies only to surprising results. It does not add steps where the code already says what happens."

**COUNTER-EXAMPLE** (the third form, writing skill, 2026-11-07). Section 1 rejects an opening that says "No line of our code touches the Name box. Yet the Name box is empty. So who emptied it?". Section 3 of the same file still shows "No line of our code removes the letters. So who removes them?" as PROPER.

*Why this fails*: The same move carries opposite labels in one file, so the writer cannot tell which one the owner wants. Lecture 21 copied the move: "`handleApply` has no line that hides the red message. So who removed it?"
## A good and a bad skill rule

**PROPER** ([writing/SKILL.md](../v1/writing/SKILL.md) Section 2, `v10.4`): #2026_11_06_03_group_1

> - **The lesson's own words**, such as `value`, `defaultValue`, and `onChange` in the lesson on controlled inputs. They carry the lesson. Explain each one in plain words: what it does and who provides it, the browser, React, JavaScript, or our own code. Explain it when the reader needs it: usually right after the reader sees what it does on the page, or when the page does something strange and the reader asks why.

**COUNTER-EXAMPLE** (`v10.2`, opening-essence move 3):

> Unlock the technical word through its everyday human image, then draw it in a `tree` figure: Never drop a technical term as cold jargon. Connect the word to the physical picture inside it.

*Why this fails*: The writer cannot tell whether `onChange` is a "technical word". The words "unlock", "cold jargon", and "physical picture" have to be decoded before they can be followed. In Lecture 20, the writer gave everyday pictures for "default" and "controlled", and never explained `value` or `onChange`.

**COUNTER-EXAMPLE** (`v10.3`, writing Section 2): "The first time a word appears, write one plain sentence that says what it is, what it does, and who provides it."

*Why this fails*: The rule fires on every new code word, whether the lesson is about it or not. In Lecture 21, a lesson about state, the writer explained `classList`, `async`, `await`, `try`, `catch`, and `finally` one by one, and the lecture became a tour of the code. A rule that fixes one failure must also say where it stops.
