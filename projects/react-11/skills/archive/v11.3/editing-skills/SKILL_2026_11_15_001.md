---
name: editing-skills
description: "How to write and edit the skills in skills/v11.3/, and how to show the owner every edit before making it. Read it before any change to a skill, a brief, a prelecture, a lecture, or a script in react-11."
---

# Writing and Editing the Skills #2026_11_07_11_group_6

## Who reads a skill

Picture the owner at the end of a long day. The owner is tired, reads fast, and stops reading when a sentence is hard. Write every skill for that reader.

The model that writes the lectures reads the skill too. It copies the style of what it reads. A cryptic skill gives cryptic lectures.

If the owner cannot follow a rule on the first read, the rule is badly written. Rewrite the rule. Do not explain it in the chat instead.

## How to write

1. **Use everyday words.** Write at B2 level: words a good student of English knows. If a word needs a dictionary, use a simpler one. Use a technical word only when the reader will meet it in the code, such as `useState` or `onChange`.
2. **Write short sentences.** Put one idea in each sentence. If a sentence has two "and"s, or a long part between commas, split it.
3. **Say what to do first.** Start each rule with the action, in plain words. Give the reason after it, in one or two sentences.
4. **Say the full case.** Write "If the reader would not expect what happens on the screen", not "When the result surprises". A short phrase saves words for the writer and costs time for the reader.
5. **Do not invent labels.** Words such as "the Angle", "the cut test", or "ping-pong" mean nothing to a new reader. If you must use a label, explain it in the same sentence where it first appears.

## The owner's words are legal text #2026_11_09_05_group_1

Every edit that carries the owner's words follows the Tech-Lawyer Rule, Principle 6 in the workspace [AGENTS.md](../../../../../AGENTS.md): quote the owner, group the quote, interpret it with fidelity, add no new spin without approval, list your own sentences under the diff, and show the diff first.

## How to edit a skill

1. **Fix before you add.** When a lecture goes wrong, find the rule that caused it, and change or remove that rule. Add a new rule only when no rule covers the problem.
2. **One rule, one place.** If a rule already lives in one file, link to it. Do not copy it.
3. **Show it with a good and a bad example.** The good example is approved lecture text or the owner's own words, and its label names the source. The bad example is a rejected draft, labelled as such. Under the bad example, write *Why this fails* in one sentence.
4. **Keep the build's limits out of the skills.** If a skill says "at most 28 words", the writer writes 28 words every time. Describe what good text looks like instead.
5. **Keep each file short enough to read in a few minutes.** When a file grows, cut what is repeated before you add more.
6. **Record the edit.** Tag each new section `#YYYY_MM_DD_NN_group_M`. Add one row per group to [RULE-TAGS.md](../RULE-TAGS.md). Write a brief in `brief/brief_YYYY_MM_DD_NN.md`, and add its row to `brief/01_TOC.md`.

## Do not let an example grow into a big rule

When the owner likes a passage and asks to keep it as an example, write the rule for exactly what the owner liked, and nothing wider. "If the reader would not expect the result, walk through the steps" is what an example can teach. "Always show the steps" is a rule the owner never asked for.

- Under the diff, tell the owner about every rule or build check written around the example, and where it reaches beyond the example.
- When you remove a rule that reached too far, keep the example that inspired it.
- When you add a rule, search every file in `skills/v11.3/` for older examples that teach the opposite. Fix them in the same batch, and tell the owner which ones.

**COUNTER-EXAMPLE** (`v10.4` writing Section 3): the owner liked the Lecture 05 passage that walks through two steps to explain `StoryCard`. The model wrote around it "A result without its steps is not an explanation", and the owner was not told. In Lecture 21, the opening then spent a whole paragraph on a one-line click handler.

*Why this fails*: The example taught steps for a surprise. The rule asked for steps everywhere.

## Show every edit before you make it

Before you change any file in `projects/react-11`, show the owner what will change, and wait for approval. Two control words change this:
- **"ppp"** means the owner has already approved. Make the edit, then show the same diff as the report.
- **"nnn"** means no edits. Talk only.

Files that a build writes, such as the HTML and the PDF, are not shown. Show the source change, and name the generated files in one sentence.

How to show the diff:
1. Draw it with Synara's visual tool, `synara_show_visual`, passing one complete HTML page in `html`. Place the block it returns in your reply. Never paste HTML tags or a code fence into the chat, because the chat shows them as raw text.
2. Give each file its own panel. The header names the file path from the workspace root and the section.
3. Put **Before** on the left and **After** on the right. Removed text is red with a line through it. Added text is green. Let long lines wrap.
4. For a new file, Before says "New file", and After shows the whole text.
5. Under the visual, say in plain words what each change does.
6. After approval, make exactly the edit you showed. If it has to change, show the new diff first.

Start from this page, and add one `panel` per file:

```html
<!doctype html><html><head><meta charset="utf-8"><style>
body{font-family:-apple-system,Inter,sans-serif;margin:0;padding:16px;color:#1f2933;background:#fff}
.panel{margin-bottom:18px}
.file{font:600 13px ui-monospace,Menlo,monospace;background:#eef2f7;padding:8px 12px;border-radius:6px 6px 0 0;border:1px solid #d5dde8}
.grid{display:grid;grid-template-columns:1fr 1fr;border:1px solid #d5dde8;border-top:0}
.col{padding:12px 14px;line-height:1.55;font-size:14.5px;white-space:pre-wrap;word-wrap:break-word}
.before{background:#fff6f6;border-right:1px solid #d5dde8}.after{background:#f4fbf5}
.h{font:700 11px sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6b7785;margin-bottom:6px}
del{background:#ffd7d5;color:#8a1c14;text-decoration:line-through}
ins{background:#c9f0cf;color:#11551f;text-decoration:none}
</style></head><body>
<div class="panel">
<div class="file">projects/react-11/skills/v11.3/lecture/SKILL.md · How to write each sentence</div>
<div class="grid">
<div class="col before"><div class="h">Before</div>Unchanged text <del>removed text</del></div>
<div class="col after"><div class="h">After</div>Unchanged text <ins>added text</ins></div>
</div>
</div>
</body></html>
```

**COUNTER-EXAMPLE** (2026-11-07, rejected by the owner): the diff was written as HTML tags in the text of the reply, `<p><b>File:</b> ...</p> <table> <tr><th>Before</th><th>After</th></tr> ...`.

*Why this fails*: The chat does not draw HTML written in a reply, so the owner saw one long line of raw tags.

## The workspace rules

Every instruction edit also follows [prompt-writing/SKILL.md](../prompt-writing/SKILL.md) and [prompt-writing/quality-checklist.md](../prompt-writing/quality-checklist.md).
