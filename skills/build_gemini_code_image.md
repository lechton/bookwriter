# Skill: How To Build A Gemini Code-Image (The Three-Block Generative Figure)

This skill produces an alternative kind of course figure: a three-block teaching image generated with Gemini from a written prompt, rather than a deterministic HTML/CSS Pencil card. Where a Pencil card is rendered to the pixel from code you control, a Gemini code-image is described in words and generated, then run by hand — you author one prompt file, paste its prompt into Gemini, and save the resulting PNG. Reach for it when you want a richer, designed code-explainer than a strict Pencil card: a clean code editor, a line-by-line explanation keyed to it, and a designed concept panel.

The look and rules below were settled by iteration and are now fixed. The canonical reference is `Pencil/build-gemini/04_extra_javascript_1/01-prototype-chain.md`; figures `02`–`05` in the same folder are worked examples on the same template. When in doubt, match them exactly.

---

## THE OUTPUT FILE

- One file per figure, at `Pencil/build-gemini/<lesson>/<NN-slug>.md`, mirroring the Pencil card naming (e.g. `04_extra_javascript_1/05-proxy-traps.md`).
- The file contains ONLY the prompt — the words you paste into Gemini — and nothing else: no title headers, no notes, no metadata, no "paste-ready" labels.
- NEVER hard-wrap or manually break lines, in this file or any other; every paragraph is one continuous line and the editor soft-wraps. A paste-ready prompt with mid-line breaks is broken.
- The generated PNG is saved by hand after a good result into `Pencil/build 02/<lesson>/png-gemini/` (the manual Gemini reference images for the build-2 figures; this part is not scripted). The figure DESCRIPTIONS that seed these prompts live in `Pencil/build 02/<lesson>/md-img/`, shared with the deterministic Pencil route (see `build_pencil_image_2.md`), whose renders go to `png/`.

---

## THE FIXED SHAPE: A TITLE AND THREE BLOCKS

Every figure is one tall portrait image (about 2:3) with a prominent moral-lesson title at the very top, then three blocks stacked top to bottom, each separated from the next by a single thin horizontal divider: (1) the CODE EDITOR, which shows clean code only; (2) the LINE-BY-LINE block, which explains the lines that need it, keyed to the editor by line number; (3) the HOW-IT-WORKS concept block. The image is print-friendly and literal — never a metaphor or a scene. Splitting the code from its explanation (rather than interleaving comments) is the whole point: it keeps even complex code readable.

---

## THE RULES (EACH IS FIXED; EXAMPLES ARE REAL)

### RULE 1 — The title is the moral lesson, on top

Every figure opens, at the very top above the first block, with one clear title stating what the student should remember — the lesson, not a generic label like "The Code". It is a precise, memorable, declarative sentence in proper terminology, set as the largest and most prominent type in the figure, bold and full width.

Examples: figure 1 → "Own Properties First, Then Inherited from the Prototype"; figure 4 → "A Getter Runs a Function Every Time You Read It"; figure 5 → "A Proxy Intercepts Every Read and Write Through Traps".

### RULE 2 — Block 1 is a code editor showing only clean code

Draw a polished, good-looking modern code editor spanning the full width: a slim title bar with three window dots and a filename tab (e.g. `proxy.js`), and a clear line-number gutter numbering every line. Each line is its own full-width row; unused space to its right stays white. The code is the most prominent code in the figure — heavy-weight monospace with a confident professional light-theme syntax palette. There are NO inline comments, NO interleaved explanations, and nothing in any margin; all explanation lives in Block 2.

### RULE 3 — Block 2 is "Line by Line", keyed by number, with permanent zebra shading

A separate block beneath the editor, headed "Line by Line", that explains only the lines which genuinely need it (skip trivial lines such as a lone closing brace). Lay it out as a clean vertical list of entries; each entry begins with a small teal rounded line-number badge whose number exactly matches that line's number in the editor gutter, then the explanation in a clean neo-grotesque at a comfortable, fully readable size, never small. Bind the list with permanent alternating row shading: the first entry on a faint light-grey band, the next plain white, the next faint light-grey, and so on, the same zebra-stripe pattern as the editor, kept very faint and low-ink. The badge numbers must match the editor exactly so a reader maps each explanation to its code line by number.

Example (figure 5): badge 3 — "The get trap runs on every property read: it logs the access, then returns the real value from target — your code runs in the gap before the value comes back."

### RULE 4 — Block 3 is the "How the <thing> Works" concept block

Headed "How the <thing> Works" (e.g. "How the Lookup Works", "How the Proxy Works"), built from compact, well-made components, not loose prose: a slim outlined rule callout box; a small clean diagram with elegant uniform design-quality arrows and short captions; a row of compact outcome boxes (a teal check box for each resolved case, and a grey dashed cross box for a failing case or a neutral grey box for a contrast); a tidy row of small bordered glossary cards defining the key terms; and a one-line takeaway. A soft amber highlighter marker wash sits behind only a few load-bearing terms, text staying dark and legible.

Example outcome boxes (figure 1): teal check "piece.headline → own property, on piece → 'Markets rally'"; grey dashed cross "piece.author → on nothing up the chain → undefined". Example glossary card (figure 5): "trap — the handler a proxy runs for one kind of operation, such as get or set".

### RULE 5 — Print-friendly and grayscale-safe

Predominantly white background, low ink coverage, near-black ink and dark slate for text and lines. The figure must remain fully understandable in pure black-and-white: never let colour be the only thing distinguishing two states — also use solid versus dashed lines, a check or cross mark, heavier versus lighter borders, and explicit labels. No large dark blocks, no dark editor chrome, no heavy shadows, no gradients.

### RULE 6 — Two accents, plus the editor's syntax palette

Outside the editor, use exactly two semantic accents and nothing more: a deep teal-green for the concept's key element and for the Block-2 line-number badges, and a soft amber used ONLY as a highlighter marker behind a few words in Block 3. The code editor is the one place with rich colour — a self-contained professional syntax palette for the code tokens only. Everything else is grayscale.

### RULE 7 — Typography

The editor uses bold syntax-coloured heavy-weight monospace. The Line-by-Line entries use a clean neo-grotesque at a comfortable, fully readable size with teal line-number badges. The title and the block headings use a clean neo-grotesque, the title the largest and most prominent type in the figure.

### RULE 8 — Literal, not allegory; adapt per concept

Use proper, nuanced terminology and a literal depiction of the mechanism. Never centre the teaching on a metaphor or scene, and forbid the obvious ones outright (closure: no vault/safe/lockbox; module: no warehouse/front-desk; proxy: no gatekeeper/bouncer; getter: no wizard/disguise). A metaphor may appear only locally inside a single label, never as the spine. Adapt the specifics to each concept: the teal accent always marks the one element THAT concept is about, and the Block-3 diagram takes whatever shape fits (a chain, a capture graph, a cross-file share, an interception flow).

### RULE 9 — Headings and forbidden words

Render the real title and headings; never print the literal words "top block", "bottom block", "block one", "block two", "upper panel", or "lower panel" anywhere in the image. No mascots, characters, cartoon or sticker styling, neon or rainbow colour (outside the code syntax palette), busy backgrounds, or warped/invented text.

---

## THE BUILD PROCEDURE (IN ORDER)

1. Pick the one concept and write its moral-lesson title (RULE 1).
2. Write the smallest correct code that demonstrates it, one meaningful statement per numbered line; verify it against the documentation.
3. Decide which lines need explanation (skip trivial ones) and write each as a Block-2 entry keyed by line number, anticipating the reader's confusion (RULE 3).
4. Design Block 3: the rule, the diagram shape, the outcome boxes, the glossary terms, the takeaway (RULE 4).
5. Choose the teal key element for this concept (RULE 8).
6. Assemble the prompt as one file of single-line paragraphs, following the skeleton below; the file holds only the prompt.
7. Paste into Gemini, generate, inspect, iterate the prompt, and save the chosen PNG.

---

## THE PROMPT SKELETON (COPY, THEN FILL — ALL ON SINGLE LINES)

Paragraph 1 — frame: "Create a premium, print-friendly technical explainer figure that teaches <the moral lesson>, composed as three blocks stacked vertically inside one tall portrait image (orientation about 2:3) ...". Then the white/low-ink/grayscale-safe sentence; the prominent main title text displayed large and bold across the very top; the three block descriptions (a code editor, a "Line by Line" block, a "How the <thing> Works" block); the "do not print top block / block one" instruction; the register sentence.

Paragraph 2 — Block 1, the editor: clean code only with no inline comments, the chrome (window dots, filename tab, line-number gutter), full-width rows, the bold syntax palette, then the exact numbered code lines.

Paragraph 3 — Block 2, "Line by Line": the RULE 3 instruction word-for-word (a separate block, teal line-number badges matching the gutter, only the lines that need it, comfortable readable size, permanent alternating shade), then the exact entries each keyed by its badge number.

Paragraph 4 — Block 3, "How the <thing> Works": the heading, the rule callout text, the diagram, the outcome boxes, the glossary cards, the amber highlights, and the takeaway line (RULE 4).

Paragraph 5 — colour and print rules (RULE 5 and RULE 6). Paragraph 6 — typography (RULE 7). Paragraph 7 — the "avoid entirely" list (inline comments in the editor, small line-by-line text, mismatched badge numbers, the forbidden words, allegory, etc.).

---

## CANONICAL REFERENCE AND CHECKLIST

The locked reference is `Pencil/build-gemini/04_extra_javascript_1/01-prototype-chain.md`; figures `02`–`05` are worked examples on the same three-block template. Not done until all hold:

- The file contains only the prompt, and not one line is hard-wrapped.
- A prominent moral-lesson title sits on top; below it, three blocks in order — clean code editor, "Line by Line", "How it works".
- The editor shows clean code only, with no inline comments; all per-line explanation lives in Block 2, keyed by matching line numbers.
- Block 2 explains only the lines that need it, at a comfortable readable size, with permanent alternating shading and teal badges that exactly match the editor gutter.
- Exactly two accents (teal + amber) outside the editor; teal also marks the line-number badges; the editor carries the only rich syntax colour.
- The figure is white, low-ink, and readable in pure grayscale; no allegory as the spine; the words "top block"/"bottom block"/"block one" never appear in the image.
