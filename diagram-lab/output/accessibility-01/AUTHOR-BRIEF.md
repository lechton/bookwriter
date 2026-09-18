# AUTHOR BRIEF — writing one lecture for accessibility-01

Paste this brief plus the question row into the writing model. The full rules live in `instructions.md`; this page is the working subset that fits a small context. When the build log is clean, the lecture is mechanically done.

## Input you receive

- One row from `../../questions-accessibility/questions.md`: number, tier (`❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED`), topic tag, question text, hook. The hook is the seed of your opening scenario; grow it, do not replace it.

## Write `md-lectures/{n}.md` with this skeleton, in this order

1. Line 1, exactly: `# Lecture {n}: {Short Title}`
2. Line 2, exactly: `> INTERVIEW QUESTION | {tier} | {question text copied verbatim}`
3. Blank line, then the Opening Ladder: 5 to 7 numbered beats in this order: the scene, the failure moment, the question (a clear, direct sentence stating the visible conflict), the danger, the mystery, the promise. No sentence over 20 words, no em-dashes, and never name the lecture's mechanism term in the ladder (the term is earned in the body). One actor throughout, every noun exactly one thing, and mechanism words in disguise are banned: write the visible behavior instead ("the blue ring that shows where the keyboard is", "the image description text"). Each beat makes sense read alone. The build generates the "Imagine this scenario:" lead; never write it yourself.
4. Right after the ladder, the first `### ` section: a catchy title naming the idea, then prose that opens the teaching.
5. Body sections with `### ` headings only (`## ` forces a PDF page break; save it for end-of-lecture audit sections). Every technical section strictly follows the **Harmonious Code + UI Step Rhythm**:
   - **Text Lead-in:** Every `### ` heading MUST open with 2–3 sentences of conceptual framing before any code or canvas appears (avoids floated `h3` marginalia collisions in PDF layout).
   - **Snippet Precedes UI:** Under the section, a minimal code snippet directly precedes the UI canvas every single time, presenting the minimal code contrast with end-of-line comments (e.g. `<!-- **WRONG:** ... -->` vs `<!-- **RIGHT:** ... -->`). Never put comments on their own line inside code blocks; separate-line `**DO NOT DO THIS:**` and `**DO THIS:**` leads belong strictly above summary mini-fences.
   - **Minimal UI Canvas (`layout="compare"`):** Maximum 2 elements per comparison (one `wrong="..."`, one `right="..."`). Default to `width="2/3"` (~660px centered) to save vertical page budget. No black bottom console strip.
   - **Dark Surface Simulation (`surface="dark"`):** When testing contrast on dark containers/footers, set `surface="dark"` so contrast failures (e.g. 1.1:1 ratio) realistically blend into the dark slate card.
   - **Tight Control Attachment & Ghost Outlines:** Outlines wrap tightly around the interactive control itself (`.ui-control-wrapper`). When focus is stripped (`outline: none`), use `ghost` (dashed red ring + `✕ 0px` badge) so invisible focus is visually emphasized. Pair with a status note chip (`note="..."`).
   - **Analytical Derivation:** Directly follows the canvas, explaining the perceptual and technical contrast. Repeat this loop for sequential comparison steps: `[Text -> Code -> UI -> Derivation]` $\to$ `[Text -> Code -> UI -> Derivation]`.
6. Code fences: ` ```html title="index.html" ` is the default (semantic markup, ARIA, loading attributes ARE the topic); reach for ` ```svelte title="SubscribeForm.svelte" ` only when component logic carries the mechanism (runes, actions, event handlers; real Svelte 5: `$state` not stores, `onclick` not `on:click`), plus `css` and `javascript` fences where needed. Real, runnable, National Times world, every line under about 80 characters, dense (every line renders as a numbered row). Comments at the END of the code line (`; // annotation`, `<!-- annotation -->` in HTML, or `/* annotation */` in CSS), never on their own line. Verdicts inside comments lead with `**RIGHT:**` / `**WRONG:**` plus one caps load-bearing word in `**bold**`. Never write check or cross emoji.
7. The quoting law: at least one verbatim quote from the corpus as a blockquote, followed by the attribution line with the citation path, for example `*W3C WAI, Introduction to Web Accessibility, `resources/accessibility/wai/pages/fundamentals/introduction/index.md`*`. Copy the exact words from the local file; the corpus handout at `documentation official/accessibility-performance/README.md` says what each source is authoritative for; the build warns when no citation path exists.
8. At least one `> [!TIP]` callout with a `**To impress the interviewer:**` lead at the moment the tip matters, and `> [!KEY]` for one-line takeaways.
9. Right before the Summary, `### Where you will meet this`: 3 to 5 one-line uses of the concept in apps the reader knows, each one pictureable moment plus what the concept does there.
10. `### Glossary` directly before the Summary: 4 to 6 core terms introduced or reinforced in the lecture, each formatted on a single continuous line as `- **Term**: Plain-English definition and practical role without em-dashes.`
11. Close with `### Summary` as a Streetwise Review from an experienced developer's daily perspective: lead with the bold `**Technical Title**` on its own line, open directly with practical context (never "Look,"), use `❒ {Subtitle}` headers, numbered points with `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` sub-lines, `➔ NEVER / ALWAYS / IF ... THEN` principles, right/wrong mini-fences with the verdict in the fence tag (` ```html right `) and the `**DO THIS:**` / `**DO NOT DO THIS:**` line above (never comments inside the block), and end with the closing table as the LAST block: strictly 3 columns (`| | **COL B**<br>(subtitle) | **COL C**<br>(subtitle) |`), divider exactly `| ---: | :--- | :--- |`, bold dimensions first in every row, `<br>` between separate backticked code parts (never inside backticks). Transposition Law: when comparing 3 or more concepts (e.g. POUR principles, WCAG levels), transpose the table so the concepts are the rows, never expanding to 4 or 5 columns.

## Hard format rules

- One continuous line per paragraph, bullet, and table row. Never hard-wrap. No em-dashes anywhere.
- Section Rhythm & Page 2 Fit: Sections always start with 2–3 sentences of text before code/UI. Keep Section 1 lead-in strictly to 2–3 sentences (3–4 lines) and code to 2–4 lines without mid-line wrapping so Heading, lead-in, code, and 2/3 compare canvas fit together on Page 2 with zero awkward splits. Minimal code precedes minimal UI canvas every single time under a section. Always explain before or after the code and UI.
- Canvas Minimal Comparison Law: Max 2 elements per canvas (`layout="compare"`), default to `width="2/3"`, no black bottom console strip, tight control attachment, use `ghost` for stripped outlines, use `surface="dark"` for dark surface contrast tests, suppress numbered `(1)` focus badges in compare mode, and position screen reader speech bubbles directly below controls with a centered upward pointer (`▲`).
- Table Transposition Law: strictly 3 columns in the closing table. Transpose multi-entity comparisons so concepts are rows.
- Canvas Diversity Law: Strictly adhere to the 6 UI Archetypes (Editorial, Media Player, Navigation, Modal, Card Grid, Interactive Widget) and the Core Tranche Blueprint in `instructions.md`. Strict ban on default input+button forms outside Q18-Q19. Two-lecture distance rule: never repeat an archetype in consecutive lectures.
- Keep every technical term and define it in plain English in the same sentence; define through experience (the known thing plus one change), teach only the change.
- Build around the one thing: one attribute, one element swap, one panel annotation. Show it early and alone.
- Raise the strongest naive alternative first (why not just a placeholder? why not just aria-label everywhere? why not just Lighthouse?) and answer it before weaker strawmen.
- Grep `md-lectures/` before baptizing a term; if taught earlier, re-anchor with `(see Lecture N)` and deepen.
- Organic Lexical Audit: every new term enters through a visceral moment where the newbie physically hits a wall without it.
- Length: 800 to 1,200 words (ADVANCED may reach 1,500).

## Source of truth for the mechanism

Read the matching local documentation before writing: `documentation official/accessibility-performance/` (handout: its `README.md`; path map: `resources/INDEX.md`; books: `books/INDEX.md`). Anchor every technical claim to the corpus and quote the defining sentence verbatim with its path. Standards outrank docs; docs outrank books; the archived web.dev snapshot and the 2019 Palani book are never called current.

## When you are done

Run `node src/build-lectures.mjs` from the project folder (`diagram-lab/output/accessibility-01/`). Read the log: a `warn` line is a format violation you must fix in the source and rebuild; a `note` line is safe. Zero warnings means the lecture passes the mechanical gate. Then the eight-gate final read: ladder laws kept, one thing centered, naive alternative answered, quote verbatim and cited, canvas serves the mechanism, code runs, summary streetwise, table closes the file.
