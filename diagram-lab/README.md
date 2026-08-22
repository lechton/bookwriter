# diagram-lab — Svelte Review Cards

A self-contained design lab for **flashcard-style review notes**: one question per card, a short answer, one key code example, one deterministic diagram, one takeaway. The house style is an exam review guide (think USMLE prep books): precise, scannable, built for self-testing.

No runtime JavaScript anywhere. Every diagram is hand-authored HTML + CSS from a fixed pattern library, so output is deterministic: same markup in, same figure out, identical in Chrome and Prince.

## Build

```bash
node src/build.mjs svelte-demo            # md → html/*.html + pdf/*.pdf (Prince)
node src/build.mjs svelte-demo --no-pdf   # md → html only
node src/shot.mjs svelte-demo deck        # dev: screenshot into html/_shots/
```

## Folders

| Folder | Holds | Written by |
|---|---|---|
| `output/<demo>/md/` | the card sources — **author here, never touch html/pdf** | you / the AI |
| `output/<demo>/html/` | one HTML per card plus `deck.html` (all cards, one document) | `src/build.mjs` |
| `output/<demo>/pdf/` | one PDF per card plus `deck.pdf` | Prince via `build.mjs` |
| `assets/styles/` | `base.css` (tokens, page, code) · `cards.css` (card chrome) · `diagrams.css` (the pattern library) | rare edits |
| `assets/fonts/` | self-hosted Inter + IBM Plex Mono (print-safe) | — |
| `src/` | `build.mjs`, `shot.mjs` | — |

## Anatomy of a card

````markdown
## Q4 — Prop drilling: the reader object is needed three levels down — what is the cost?

@tags components, props, architecture

**Answer.** The direct reply, two or three sentences, the verdict first.

**Why it works.** The mechanism in one short paragraph. Optional; only when the answer needs a why.
## 01 — Title
@tags X, Y

**Q. Interview question here?**

**Answer.** Direct technical solution. One line per paragraph. Start with a practical, concrete, real-world angle (e.g., "Normally you do X, but what if you need to auto-save to localStorage?"). Ground it in reality so it never sounds like science fiction.

```svelte title="App.svelte"
<script>
// Valid code only
</script>
```

<div class="dg">
(diagram markup from one pattern below — NO blank lines inside)
</div>

> **Summary.** Punchy, jargon-free explanation. Vary the transition (e.g., "This is important because", "This matters because"). Do NOT repeat "This is huge" every time. Use short, crisp sentences. Avoid confusing adjectives or accidental jargon (like "stray timers").
````

Authoring contract:

- **One line per paragraph. Never hard-wrap.** (House rule, all files.)
- Labels the renderer styles: `**Answer.**`, `**Why it works.**`, `**Source.**`, and `> **The move.**` (blockquote). Other `**X.**` labels work too and get neutral styling.
- Code fences: ` ```svelte title="File.svelte"` — the title becomes the filename tab. Keep snippets to the one key example; this is a review card, not a tutorial.
- Diagram HTML is pasted raw into the markdown. **No blank lines inside the markup block** (a blank line ends the raw block).
- The world is the National Times: article cards, clap buttons, the comment thread, `session.reader`. Keep code idiomatic Svelte 5.

### Teaching Hard Concepts
When a topic is fundamentally confusing (like reactivity inside loops, untracking variables, or memory management):
1. **Be brutally direct.** Assume the reader is confused. State exactly what the code does that they aren't expecting.
2. **Break it apart.** Instead of writing clever inline code like `fetch(untrack(() => token))`, pull the confusing part into a dedicated line with a variable: `const token = untrack(() => sessionToken);` so the reader sees the exact step.
3. **Show the "Before and After" or "Cause and Effect."** Your diagram must explicitly show the difference between normal behavior and the new behavior (e.g., showing a normal variable triggering a re-run, right next to an untracked variable being ignored).
4. **Use concrete use-cases.** No 'foo/bar' or abstract counters. Use `sessionToken`, `shoppingCart`, `theme`, etc., so they understand *why* the tool exists.

## The diagram pattern library

IMPORTANT!  before writing any diagram you need to  study the following 2 sources in detail, 

Folder: '/Users/techton/lechton/research-code/svelte dev 2026/diagram-lab/docs'
File 1: demo_diagrams.md (demo with excellent diagrams inside)
File 2: Gemini_instructions.md (instructions with the philosophy of design)

Take notice of the (a) structure (b) creativity (c) innovation of diagrams found in this demo, check the examples along with the file of the instructions. Then, and only then, try to adapt a creative way to present the topic of each card in a unique diagram that fits the message of the card, 

IMPORTANT:  a diagram must be always (a) is print-friendly (e.g. not black background) but (b) very professional, with (c) maximum clarity to the viewer that understands the KEY informations, distinctions, operations etc from the card he reads. 



## Notes

- The Prince watermark in the corner appears when Prince runs unlicensed; it vanishes with a license file. Drafts carry it, finals should not.
- `shot.mjs` uses puppeteer-core from `../Pencil/node_modules` and your installed Chrome; it is a dev convenience, not part of the build.
