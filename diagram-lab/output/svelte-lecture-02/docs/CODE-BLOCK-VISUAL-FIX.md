# Brief: Fix the lecture code-block rendering to match the Pencil reference

## Summary for Antigravity

I am building a lecture pipeline at `/Users/techton/lechton/research-code/svelte dev 2026/diagram-lab/output/svelte-lecture-01/`. Each lecture is a Markdown file in `md-lectures/NN.md`, rendered to HTML and PDF by `src/build-lectures.mjs` using the stylesheet `src/lecture.css`. The build embeds a custom syntax highlighter I wrote that produces editor-style code blocks. **The rendered output looks broken and nothing like the reference design it is supposed to mimic.** I cannot see images in this client, so I am writing this brief for Antigravity (which can read images and has great CSS/design intuition) to diagnose and fix the gap.

The reference design lives in a sibling project at `/Users/techton/lechton/research-code/svelte dev 2026/Pencil/`. I want my lecture pipeline's code blocks to look **visually identical** to that reference.

## The two screenshots to compare

These are the two files to open side-by-side:

- **My broken output (pre-last screenshot):**
  `/Users/techton/Images/CleanShotX/CleanShot 2026-07-22 at 02.08.18@2x.png`

- **The reference design (last screenshot, the target look):**
  `/Users/techton/Images/CleanShotX/CleanShot 2026-07-22 at 02.08.31@2x.png`

The user description of the gap: my output is "broken / misaligned" and "everything looks wrong." Beyond that, the user could not articulate specific differences — they just see that the two don't match. Antigravity needs to look at both images and identify the concrete visual gaps.

## Where the reference design lives (the source of truth)

The reference is the figure-03 design system used across the Pencil book:

- **Reference CSS (the canonical style):**
  `/Users/techton/lechton/research-code/svelte dev 2026/Pencil/styles/figure-03.css`

- **Reference PDF (full chapter, 34 pages of the look we want):**
  `/Users/techton/lechton/research-code/svelte dev 2026/Pencil/book/out/04_extra_javascript_1.pdf`

- **Reference HTML (the same chapter as HTML):**
  `/Users/techton/lechton/research-code/svelte dev 2026/Pencil/book/out/04_extra_javascript_1.html`

- **Reference hand-curated card HTML (one example of the editor code block):**
  `/Users/techton/lechton/research-code/svelte dev 2026/Pencil/cards 05/04_extra_javascript_1/01-prototype/card.html`

The reference's editor block uses hand-curated HTML where authors write tokens like `<span class="kw">let</span>` directly. Comments are written as `<span class="cmt">→ on the <b>prototype</b></span>` — note the literal `→` arrow, not `//`. The CSS paints: thin grey border, light grey editor chrome with three dots and a centered filename tab, monospace code at 15px, zebra striping on even rows, deep-magenta keywords (`#93275a`), teal function calls (`#156a64`), green strings (`#1a7d2e`), orange runes (`#c2410c`), and comments in IBM Plex Sans Condensed at 15.5px in muted grey (`#4b5563`) with bold runs in darker grey (`#374151`).

## Where my output lives (the thing that's broken)

Project root: `/Users/techton/lechton/research-code/svelte dev 2026/diagram-lab/output/svelte-lecture-01/`

- **My build script (Markdown → HTML with auto-highlighter):**
  `src/build-lectures.mjs`

- **My stylesheet (the CSS that's not landing the look):**
  `src/lecture.css`

- **My rendered lecture HTML (open this in a browser to see the broken look):**
  `md-lectures-html/49.html`

- **My rendered lecture PDF:**
  `md-lectures-pdf/49.pdf`

- **My lecture Markdown source (what gets rendered):**
  `md-lectures/49.md`

## The key architectural difference

**The reference hand-writes the HTML for every code block.** Authors literally type `<span class="kw">let</span>` and `<span class="cmt">→ on the <b>prototype</b></span>` into the card HTML. There is no automated highlighter in the reference project — every token is hand-curated to look exactly right.

**My pipeline auto-highlights.** Authors write plain Markdown with `// comments` and the build script tokenizes and renders. This is the right architecture for a lecture pipeline (we can't hand-curate hundreds of code blocks), but it means the auto-highlighter has to produce HTML that — combined with my CSS — looks visually equivalent to the hand-curated reference. Right now it doesn't.

## What I've already tried (and what is currently in place)

My current state, after several rounds of fixes:

1. **HTML structure**: My highlighter produces `<figure class="codeblock editor"><div class="bar">...<span class="tab">filename</span></div><div class="code"><div class="row"><span class="num">N</span><span class="src">...tokens...</span></div>...</div></figure>`. This structure matches the reference.
2. **Editor chrome always rendered** (dots + filename tab), defaulting the filename from the fence language when `title=` is missing (`svelte` → `App.svelte`, etc.).
3. **`<script>` / `</script>` / `<style>` wrapper tags auto-stripped** so they don't pollute the numbered rows.
4. **Blank lines dropped** so there are no empty numbered rows.
5. **Fonts**: CSS lists `"IBM Plex Mono"` first for code and `"IBM Plex Sans Condensed"` first for comments, with fallbacks. Fonts are NOT bundled — relying on system install or fallback.
6. **Sheet wrap**: `figure.codeblock.editor` has `padding: 18px`, `border-radius: 14px`, and the same shadow recipe as the reference's `.sheet`.
7. **Page background** changed from white to `#fafafa` for depth.
8. **Comment rule**: `//` followed by space or end-of-line becomes `→`. URLs like `https://example.com` are preserved. Empty trailing `//` is dropped. `**bold**` inside comments becomes `<b>bold</b>`.

Despite all this, the user says it still looks broken. So one or more of these is wrong in practice:
- The CSS values may not produce the right look (font sizes, spacing, colors, padding).
- The font stack may be falling back because IBM Plex isn't installed.
- The `figure.codeblock` (old) and `figure.codeblock.editor` (new) rules in my CSS may conflict.
- The `<figure>` element's default browser margins may be fighting my styles.
- The `transform: translateY(1px)` on `.tab` may misalign with `.bar` in a non-flex context.
- Prince (the PDF renderer) may be ignoring flexbox in some way that breaks row layout.
- Something I'm not seeing because I can't see the image.

## What Antigravity should do

1. **Open both screenshots** and articulate the specific visual gaps in plain language. Not "looks wrong" — things like "the dots are missing," "the tab is overlapping the bar," "keywords are not magenta," "line numbers are cut off," "the box has no border," etc.
2. **Open my `md-lectures-html/49.html` in a browser** (or render the PDF) and compare with the reference card HTML at `Pencil/cards 05/04_extra_javascript_1/01-prototype/card.html`.
3. **Diff my `src/lecture.css` editor section against `Pencil/styles/figure-03.css`** and identify which specific CSS values are wrong, missing, or conflicting. The reference is the source of truth; my CSS should mirror its values.
4. **Decide whether to keep the auto-highlighter architecture** (preferred) or simplify it. If the auto-highlighter is producing HTML that cannot be styled to match the reference, the fix may need to be in the HTML output, not just the CSS.
5. **Edit `src/lecture.css` and `src/build-lectures.mjs`** to close the gap. Then run `node src/build-lectures.mjs` from inside the project folder to rebuild, and verify the new `md-lectures-pdf/49.pdf` against the reference.

## Constraints

- **All edits must be local to `/Users/techton/lechton/research-code/svelte dev 2026/diagram-lab/output/svelte-lecture-01/`.** Do not modify anything in the `Pencil/` folder — that's the immutable reference. Do not modify the card pipeline (`build-cards.mjs`) — only the lecture pipeline.
- **The project must remain self-contained.** Any CSS values, fonts, or logic must be copied inline into `src/lecture.css` and `src/build-lectures.mjs`. No `@import` of the reference CSS, no symlinks.
- **The Markdown authoring contract is sacred.** Authors write plain Markdown fences with `//` comments. The `//` → `→` transformation, wrapper-tag stripping, blank-line dropping, and token highlighting all happen in the build script. Do not push styling concerns back onto authors.
- **The build command stays the same**: `node src/build-lectures.mjs` (or `--no-pdf` for HTML only), invoked from inside the project folder.
- **PDF rendering is via Prince XML.** Prince has excellent CSS support but is not a browser — some modern CSS (especially flexbox edge cases) may render differently than Chrome. If a layout works in browser but breaks in Prince, prefer a Prince-friendly alternative.
- **No new dependencies** without checking with the user first. The project is currently zero-dependency (pure Node). Using a highlighter library like Prism or Shiki would change that.

## Self-contained reference excerpts (so Antigravity doesn't need to grep)

### The reference's editor CSS (verbatim from `Pencil/styles/figure-03.css`)

```css
:root{
  --ink:#1f2937; --muted:#6b7280; --page:#ffffff; --edge:#e5e7eb; --band:#f4f4f4;
  --accent:#246a63; --hl:#ffdf70;
  --kw:#93275a; --fn:#156a64;
  --sans:"IBM Plex Sans","Inter",-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:"IBM Plex Mono","JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
}

.editor{border:1px solid #9ca3af;border-radius:8px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.bar{display:flex;align-items:flex-end;padding:10px 12px 0;background:#f0f0f0;border-bottom:1px solid #9ca3af}
.dots{display:flex;gap:8px;margin:0 16px 10px 4px}
.dot{width:12px;height:12px;border-radius:50%;background:#bfbfbf}
.tab{background:#fff;border:1px solid #9ca3af;border-bottom:none;border-radius:6px 6px 0 0;padding:4px 16px;font-family:var(--mono);font-size:13px;font-weight:700;color:#1f2937;transform:translateY(1px)}
.code{font-family:var(--mono);font-size:15px;background:#fff;padding:4px 0 8px}
.row{display:flex;align-items:center;padding:4px 0}
.code .row:nth-child(even){background:#f4f4f4}
.num{width:48px;flex:none;text-align:center;color:#9ca3af;font-weight:700;user-select:none}
.src{padding:0 8px;white-space:pre;color:#1f2937}
.cmt{font-family:"IBM Plex Sans Condensed",var(--sans);font-size:15.5px;font-weight:400;color:#4b5563;margin-left:18px}
.cmt b{font-weight:700;color:#374151}
.kw{color:var(--kw);font-weight:700}
.fn{color:var(--fn);font-weight:700}
.nl{color:var(--kw);font-weight:700}
.str{color:#1a7d2e;font-weight:700}
.rune{color:#c2410c;font-weight:700}
```

Key observations about the reference:
- `.editor` is the OUTER chrome border (`border-radius: 8px`, light shadow).
- `.bar` is INSIDE the editor, with its OWN `#f0f0f0` background and bottom border.
- The reference does NOT wrap `.editor` in a `.sheet` — `.editor` IS the visible block.
- Page background in the reference is white (`--page: #ffffff`), not grey. The "soft grey stage" comes from a different layer (`#card`), not the page itself.
- `.code` font-size is `15px` (not `0.92rem`).
- `.tab` font-size is `13px` (not `0.82rem`).
- `.cmt` font-size is `15.5px` (not `0.96rem`).

### The reference's hand-curated HTML (one block, verbatim from `Pencil/cards 05/04_extra_javascript_1/01-prototype/card.html`)

```html
<div class="bar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span class="tab">js_review/examples/Article.js</span></div>
<div class="code">
  <div class="row"><span class="num">1</span><span class="src"><span class="kw">class</span> <span class="fn">Article</span> {</span></div>
  <div class="row"><span class="num">2</span><span class="src">  <span class="fn">publish</span>() { <span class="kw">return</span> <span class="str">"published"</span>; }<span class="cmt">→ on the <b>prototype</b></span></span></div>
  <div class="row"><span class="num">3</span><span class="src">}</span></div>
  <div class="row"><span class="num">4</span><span class="src"><span class="kw">const</span> piece = <span class="kw">new</span> <span class="fn">Article</span>();<span class="cmt">→ a <b>new</b> instance</span></span></div>
  <div class="row"><span class="num">5</span><span class="src">piece.headline = <span class="str">"Markets rally"</span>;<span class="cmt">→ adds an <b>own</b> prop</span></span></div>
  <div class="row"><span class="num">6</span><span class="src">console.log(piece.headline);<span class="cmt">→ "Markets rally" found on <b>piece</b></span></span></div>
  <div class="row"><span class="num">7</span><span class="src">console.log(piece.<span class="fn">publish</span>());<span class="cmt">→ "published" from the <b>prototype</b></span></span></div>
  <div class="row"><span class="num">8</span><span class="src">console.log(piece.author);<span class="cmt">→ <b>undefined</b> — not on the chain</span></span></div>
</div>
```

Note: the reference uses `<div class="editor">` as the wrapper, NOT `<figure>`. My pipeline uses `<figure class="codeblock editor">`. Browser default `<figure>` styling includes `margin: 1em 0` and `padding: 0`, which may interact badly with my own margin/padding rules. Worth verifying whether changing to a plain `<div>` removes artifacts.

### My current editor CSS (verbatim from `src/lecture.css`)

```css
:root {
	--code-kw: #93275a;
	--code-fn: #156a64;
	--code-nl: #93275a;
	--code-str: #1a7d2e;
	--code-rune: #c2410c;
	--code-edge: #9ca3af;
	--code-bar: #f0f0f0;
	--code-zebra: #f4f4f4;
	--code-num: #9ca3af;
	--code-cmt: #4b5563;
	--code-cmt-b: #374151;
}

figure.codeblock.editor {
	margin: 1.6rem 0;
	padding: 18px;
	background: #fff;
	border: 1px solid #e5e7eb;
	border-radius: 14px;
	overflow: hidden;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
}

figure.codeblock.editor .bar {
	display: flex;
	align-items: flex-end;
	padding: 10px 12px 0;
	background: var(--code-bar);
	border-bottom: 1px solid var(--code-edge);
}

figure.codeblock.editor .dots { display: flex; gap: 8px; margin: 0 16px 10px 4px; }
figure.codeblock.editor .dot { width: 12px; height: 12px; border-radius: 50%; background: #bfbfbf; }
figure.codeblock.editor .tab {
	background: #fff;
	border: 1px solid var(--code-edge);
	border-bottom: none;
	border-radius: 6px 6px 0 0;
	padding: 4px 16px;
	font-family: "IBM Plex Mono", "JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace;
	font-size: 0.82rem;
	font-weight: 700;
	color: #1f2937;
	transform: translateY(1px);
}

figure.codeblock.editor .code {
	font-family: "IBM Plex Mono", "JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace;
	font-size: 0.92rem;
	background: #fff;
	padding: 4px 0 8px;
}

figure.codeblock.editor .row {
	display: flex;
	align-items: center;
	padding: 4px 0;
	line-height: 1.5;
}

figure.codeblock.editor .row:nth-child(even) { background: var(--code-zebra); }
figure.codeblock.editor .num {
	width: 48px;
	flex: none;
	text-align: center;
	color: var(--code-num);
	font-weight: 700;
	user-select: none;
	-webkit-user-select: none;
}
figure.codeblock.editor .src {
	padding: 0 12px;
	white-space: pre;
	color: #1f2937;
	flex: 1;
	overflow-x: auto;
}
figure.codeblock.editor .cmt {
	font-family: "IBM Plex Sans Condensed", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
	font-size: 0.96rem;
	font-weight: 400;
	color: var(--code-cmt);
	margin-left: 18px;
}
figure.codeblock.editor .cmt b { font-weight: 700; color: var(--code-cmt-b); }
.kw { color: var(--code-kw); font-weight: 700; }
.fn { color: var(--code-fn); font-weight: 700; }
.nl { color: var(--code-nl); font-weight: 700; }
.str { color: var(--code-str); font-weight: 700; }
.rune { color: var(--code-rune); font-weight: 700; }
```

### My current HTML output for one code block (from `md-lectures-html/49.html`)

```html
<figure class="codeblock editor"><div class="bar"><div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div><span class="tab">App.svelte</span></div><div class="code"><div class="row"><span class="num">1</span><span class="src">	<span class="kw">let</span> { initialCount } = <span class="rune">$props</span>();</span></div>
<div class="row"><span class="num">2</span><span class="src">	<span class="cmt">→ This only reads initialCount ONCE during creation</span></span></div>
<div class="row"><span class="num">3</span><span class="src">	<span class="kw">let</span> count = <span class="rune">$state</span>(initialCount);</span></div>
<div class="row"><span class="num">4</span><span class="src">&lt;p&gt;Count is: {count}&lt;/p&gt;</span></div></div></figure>
```

Structurally this is very close to the reference. The differences are surface CSS: my padding is `18px` (reference has none on `.editor` itself), my border-radius is `14px` (reference is `8px`), my shadow is heavier (`0 10px 15px` vs `0 1px 2px`), my font sizes are in `rem` (reference uses `px`).

## Suspected root causes (Antigravity, please verify against the screenshots)

These are the things I suspect are wrong, in order of likelihood. Please verify each against the actual images:

1. **The `<figure>` element's default browser/Prince styling** (`margin: 1em 0; padding: 0; text-align: center`) may be misaligning the block or adding unwanted centering. The reference uses `<div class="editor">` with no figure semantics.
2. **My double wrapping** (`figure.codeblock.editor` with `padding: 18px` AND containing `.bar` which has its own padding) may be producing nested chrome that looks nothing like the reference's flat `.editor > .bar` structure.
3. **My font sizes in `rem`** may compute differently than the reference's `px` values. `0.92rem` at `html { font-size: 17px }` = `15.6px`, close to the reference's `15px` but not exact.
4. **My heavy drop shadow** (`0 10px 15px -3px rgba(0,0,0,.10)`) may look out of place against the reference's subtle `0 1px 2px rgba(0,0,0,.05)`. The heavy shadow is the `.sheet` recipe, but the reference's `.editor` itself uses a SUBTLE shadow because the depth comes from the surrounding sheet, not the editor.
5. **`transform: translateY(1px)` on `.tab`** may not work in Prince the way it does in browsers, leaving the tab misaligned with the bar.
6. **IBM Plex is not installed on this system**, so all the Plex font-family declarations fall back. The fallback chain still works, but the typography is NOT what the reference shows.
7. **The page background `#fafafa`** may be making the white code block look grey-washed instead of crisp.
8. **My `.src` has `padding: 0 12px`**; the reference has `padding: 0 8px`. The extra horizontal padding may be visible.
9. **`figure.codeblock` (old) and `figure.codeblock.editor` (new) CSS rules may conflict** in ways I didn't catch, especially around `overflow`, `padding`, or `border-radius`.

## What "done" looks like

- `md-lectures-html/49.html` opened in a browser visually matches the reference card HTML opened in a browser. Specifically:
  - Editor chrome: thin grey border, light grey bar, three grey dots, centered filename tab
  - Code rows: monospace, 15px-ish, zebra striping on alternate rows, centered grey line numbers
  - Tokens colored: keywords magenta, functions teal, strings green, runes orange
  - Comments: sans-serif, slightly larger, muted grey, with `→` arrow prefix and bold runs
  - Block sits cleanly on the page without double-wrapping or alignment artifacts
- `md-lectures-pdf/49.pdf` opened in Preview matches the same look (Prince rendering may differ slightly from Chrome, but the gap should be minimal).
- All the auto-highlighter rules still work: `//` → `→`, URL preservation, `**bold**` in comments, wrapper-tag stripping, blank-line dropping, default filename derivation.
- The fix is fully local to `svelte-lecture-01/`. No edits to `Pencil/`.

## How to verify after the fix

From inside the project folder:

```sh
node src/build-lectures.mjs --no-pdf   # quick HTML rebuild
node src/build-lectures.mjs            # full HTML + PDF rebuild
```

Then open `md-lectures-html/49.html` in a browser and compare side-by-side with `Pencil/cards 05/04_extra_javascript_1/01-prototype/card.html` (also opened in a browser).

For the PDF: open `md-lectures-pdf/49.pdf` in Preview and compare with `Pencil/book/out/04_extra_javascript_1.pdf`.

## Pointers into my project

- **Project instructions** (full workflow spec): `instructions.md`
- **Code Block Format section in instructions**: search for `## Code Block Format` in `instructions.md`
- **The full lecture.css**: `src/lecture.css` (~375 lines)
- **The full build-lectures.mjs**: `src/build-lectures.mjs` (~330 lines, highlighter is around lines 95–230)
- **One rendered lecture**: `md-lectures-html/49.html`
- **One source lecture**: `md-lectures/49.md`

## Communication notes

- The user values plain, honest communication. If something is broken, say so plainly. If a fix is risky, flag it.
- The user does not want external file references in the project — everything must be copied inline.
- The user has explicitly flagged that Antigravity (a separate AI tool with image reading and CSS expertise) is being brought in for this specific visual gap. Lean into that strength.
- Do not modify the card pipeline, the `Pencil/` folder, or anything outside `svelte-lecture-01/`.
