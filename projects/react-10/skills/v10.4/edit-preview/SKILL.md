---
name: edit-preview
description: "How to show the owner every edit in projects/react-10 before making it: a rendered, side-by-side diff in the chat. Read it before any edit to a skill, a lecture, a map, a brief, a note, or a script in react-10."
---

# Show Every Edit Before You Make It #2026_11_07_08_group_1

## When this applies

Before you change any file in `projects/react-10`, show the owner what will change, and wait for the owner's approval. This covers the skills in `skills/v10.4/` first of all, and also lectures, maps, drafts, briefs, notes, lab cases, and build scripts.

Two control words change the order:
- **"ppp"** means the owner has already approved. Make the edit, then show the same diff as the report of what changed.
- **"nnn"** means no edits. Show a diff only when the owner asks to see a proposal.

Files that a build writes, such as the HTML and the PDF, and the moves that `archive_lecture.py` makes, are not shown as diffs. Show the source change that produces them, and name the generated files in one sentence.

## How to show the diff

1. Draw the diff with Synara's visual tool, `synara_show_visual`, passing one complete HTML page in `html`, and place the block it returns in your reply. Never paste HTML tags or a code fence into the chat: the chat shows tags as raw text, and code does not wrap.
2. Give each file its own panel. The panel header names the file path from the workspace root and the section.
3. Put **Before** on the left and **After** on the right. Mark removed text in red with a line through it, and added text in green. Keep only enough unchanged text around each change for the owner to see where it sits. Let long lines wrap.
4. For a new file, the Before column says "New file", and the After column shows the whole text. For a deleted file, the After column says "File deleted".
5. Under the visual, say in plain words what each change does and what it will change in later work.
6. After approval, make exactly the edit you showed. If the edit has to change, show the new diff first.

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
<div class="file">projects/react-10/skills/v10.4/v1/writing/SKILL.md · Section 3</div>
<div class="grid">
<div class="col before"><div class="h">Before</div>Unchanged text <del>removed text</del></div>
<div class="col after"><div class="h">After</div>Unchanged text <ins>added text</ins></div>
</div>
</div>
</body></html>
```

## A good and a bad way to show an edit

**PROPER** (2026-11-07, accepted by the owner). The diff is drawn with `synara_show_visual`. Its header names `projects/react-10/skills/v10.4/v1/writing/SKILL.md`, Section 3. Before and After sit side by side, the removed sentence is red and struck through, the added sentence is green, and long lines wrap.

**COUNTER-EXAMPLE** (2026-11-07, rejected by the owner). The same diff is written as HTML tags in the text of the reply:

> `<p><b>File:</b> projects/react-10/skills/v10.4/v1/writing/SKILL.md, Section 3</p> <table> <tr><th>Before</th><th>After</th></tr> ...`

*Why this fails*: The chat does not render HTML written in a reply, so the owner saw one long line of raw tags and could not see what would change. A diff in a code fence fails the same way, because code does not wrap. The owner said: "I want you to actually show html actually render html here in the chat."
