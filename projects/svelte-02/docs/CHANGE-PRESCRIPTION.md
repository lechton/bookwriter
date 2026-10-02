# Change Prescription — svelte-lecture-02

Goal: make 210 lectures possible with small-context models (Antigravity / Gemini), keep the visual quality, and make every written rule match what the build really does. The plan is deliberately small: six file changes, one CSS line, one new check mode, one one-page brief. Nothing touches the bubble comment design, the glyph stripping, or the highlighter.

## 1. New length standard: about 1,000 words per lecture

The written rule (2,500 to 3,000 words) matches nothing on disk. The real average of the 23 existing lectures is 794 words; the only long one (23, at 2,038 words) is also the one whose Summary table broke across pages. Replace the rule with: standard lectures target 800 to 1,200 words, about 1,000 on average. ADVANCED questions may run to 1,500. A lecture of this size fits one small-model session, produces a 6 to 8 page PDF, and keeps the Summary plus table safely inside one page. Delete the old length rule and the philosophy paragraph under it.

## 2. Kill the plan phase; the question bank is the plan

Every question row already carries a Question (the topic), a Hook (the lecture opening, by the bank's own design), and a Topic tag (the scope). A separate Pedagogical Plan with a stop-and-approve gate duplicates that and makes you the bottleneck for 200 lectures. Remove the Mandatory Two-Step Authoring Workflow from instructions.md. One exception: for ADVANCED questions the writer may save a five-line outline to md-lectures-plan/{n}.md as its own working note, with no approval gate and no obligation.

## 3. Parts become optional, with a named home

At 1,000 words most lectures need no splitting. Keep the parts technique only for long ADVANCED lectures: write parts to md-lectures-plan/{n}-part1.md, part2, and so on (the previously missing location), then concatenate into md-lectures/{n}.md and build. Each part session starts by re-reading the outline and the previous part's last paragraph, which is how a forgetful model stays continuous.

## 4. New phase: the polish pass (second model, full edit authority)

Today nothing may edit a finished lecture except the append-only audit. Add a polish phase between writing and audit: a second model, or a fresh session, receives the lecture plus the build warnings and may edit anything. Its job list: add at least one interview [!TIP] callout (lectures 19 and 23 currently have none), add or sharpen [!KEY] takeaways, verify the Summary and closing table, fix every warning the build printed, then rebuild. The polish model ends by running the build; a clean build is its definition of done.

## 5. The build becomes the referee (check mode)

Prose rules fail under context pressure; lecture 23 proved it (malformed table, no callouts). Teach build-lectures.mjs to check, on every run, printing warnings that never block: interview-question line present on line 2; at least one alert callout in the file; a `### Summary` section followed by a closing table; the table's first header cell empty; the divider row `| ---: | :--- |`; lecture title format `# Lecture {n}: ...`. The comment-only auto-merge already works this way (its note in the log is the model to follow). The warning list doubles as the polish model's work list, which is what makes the multi-model workflow safe: any writer, any size, same gate.

## 6. One CSS line so tables never split

Add `page-break-inside: avoid` (and `break-inside: avoid`) to the `table` rule in src/lecture.css. Prince will then move a whole small table to the next page instead of stranding a row. With lectures back to about 1,000 words, Summary sections fit one page again, and this line is insurance for the exceptions. Verify on lecture 23 after the rebuild.

## 7. Make the docs tell the truth

instructions.md still describes a parallel-right arrow comment design that the build replaced with bubbles below the line, and promises that `✔️`/`✖️` glyphs survive when the build strips them on purpose (the owner confirmed both behaviors are desired as-is). Rewrite the Code Block Format section to describe reality: bubbles below lines with upward tails, glyphs stripped, `<script>` wrappers and blank lines rendered as numbered rows, comment-only lines auto-merged with a log note. Then create AUTHOR-BRIEF.md, a one-page distillation (title format, question line, heading levels, comment rules, table skeleton, callouts, length target, no hard wraps). The brief is what gets pasted into a small model; instructions.md remains the master reference for humans.

## 8. Touch up lectures 19 and 23 only

Lecture 23: fix its closing table to the canonical shape (empty first header cell, `**TITLE**<br>(subtitle)` headers, `| ---: | :--- |` divider) and add one interview TIP callout; keep its length. Lecture 19: add its missing TIP callout. No other lecture changes.

## 9. Explicitly not doing

No changes to the bubble design, glyph stripping, or highlighter. No revival of the review-table pipeline (folders stay empty until the owner wants them). No edits to root AGENTS.md, whose glyph rule remains correct for the Pencil book. The card and data-flow pipelines are untouched.

## 10. Order of work and acceptance

Execute in this order, cheapest and safest first: (1) CSS line, then rebuild and confirm lecture 23's table no longer splits; (2) fix lectures 23 and 19 sources; (3) add the build checks; (4) rewrite instructions.md sections and write AUTHOR-BRIEF.md. Acceptance: a full rebuild with zero warnings on all 23 lectures, lecture 23's table whole on one page, every lecture carrying at least one interview tip, and a fresh small-model test that writes one new lecture using only AUTHOR-BRIEF.md plus its question row, with the build catching every format slip it makes.
