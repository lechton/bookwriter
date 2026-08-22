

You are asked to write lectures following the precise skill of lecture writing found here: /skills/write_lecture.md

Source: 

- You are given access to the full documentaiton of Svelte and Svelte Kit inside this folder /documentation 2026 June

- You are asked to consider deeply the topic at hand, the points that demand philosophical and operational clarity and consult every other possible source before writing a lecture to incorporate pearls of wisdom that may not exist in the given documentation. So you are asked to search other resources online that explain key features and functioning of Svelte 5 

You write for a reader who has already experience in React (years ago, now mostly forgotten) and some experience with Vue (also now mostly forgotten). You are asked to raise key points of comparison between frameworks. But, this is also important, never drop reference to other frameworks without explaining it, make sure you present with clarity the idiosyncratic nature of Svelte 5 for a user that needs refresh and is interested in conceptual clarity.


Sections: you will discuss with the user how to construct proper sections


Outlines (the booklet that goes to the student):

After a lecture is written, you produce its booklet, the printed code companion the lecture keeps pointing to ("look at the code block in your booklet"). Follow the precise skill of booklet writing found here: /skills/write_outline_v02.md

- Build the booklet FROM the finished lecture and the original documentation sources. The lecture script deliberately contains no code; the booklet carries all of it.

- Be complete: every code block the lecture points to, and every snippet in the lecture's documentation sources, must appear, verbatim and traceable to its source file. No code left behind.

- Format and voice are fixed by the skill: clean markdown that renders (a blank line between every block, each code block under its own ### header), a filename inside every code fence written as title="...", and every word of prose in the same high-voltage, direct style.

- Save each booklet in the outlines folder, named as the lecture's twin plus an _outline suffix (for example, the lecture 03_state.md becomes 03_state_outline.md).


Q&A digests (the problem-driven review companion):

A third artifact, alongside the lecture and the booklet. Where the lecture narrates and the booklet carries the code, the Q&A digest poses problems and solves them, built for fast review. Follow the precise skill found here: /skills/write_qa.md

- It digests the Svelte documentation into problem-and-answer pairs. Keep in mind the discussion documents in /documentation 2026 June/claude-discussions ("SvelteKit Reframed as Problems" and the "50 SvelteKit concepts" export): they are the template for the problem-first framing, the voice, and the canonical examples.

- Every entry opens with a real problem, never a definition. Two flavors: how-do-I, and why-did-this-break. Anchor every problem in The National Times, and add creative edge cases on top, even tangential ones.

- Every entry shows, in order: the theory (distilled), a map of the components every time (a small ASCII sketch of the files and how they relate), and then the full, short contents of each named file. Show the file name and complete contents each time, kept minimal. Do NOT use snippets; show component relationships as separate real .svelte files.

- Coverage is a curated digest, not no-code-left-behind: the problems worth reviewing, not every snippet.

- Save each digest in the output/svelte/qa folder, named as the lecture's twin plus a _qa suffix (for example, the lecture 04_state.md becomes 04_state_qa.md).


Figures (the Pencil image cards):

A fourth artifact: the diagrams a lecture, booklet, or Q&A digest embeds with a normal Markdown image reference. Figures are authored as HTML/CSS and rendered to a deterministic PNG by a headless Chrome — never hand-drawn, never an AI image, so they are reproducible, diff-able, and traceable. Follow the precise skill found here: /skills/build_pencil_image.md

- The pipeline lives in /Pencil (render.mjs, fonts/, cards/, build/). Each figure is one self-contained card.html with an element id="card", grouped by lesson in Pencil/cards/<lesson>/<NN-slug>/.

- Every card obeys the fixed THREE-PANEL PATTERN: (1) a real, correct code snippet, (2) a numbered EXECUTION FLOW that traces what happens step by step at runtime, (3) a SUMMARY with the key phrases highlighted. A concept earns a card only if it has both code AND a genuine runtime flow; bare definitions, comparisons, and static structures do not fit.

- Plan a lesson's figures as a titles-only shot list saved beside the digest as <lesson>_images_list.md, then build each card from it.

- Render with `node render.mjs <match>`; publish with `--publish`, which copies the PNG to output/svelte/images/<lesson>/<NN-slug>.png and prints the Markdown reference to paste.


Gemini code-images (the generative figure alternative):

A fifth artifact: an alternative two-panel teaching figure generated with Gemini from a written prompt, instead of a deterministic Pencil card. Follow the precise skill found here: /skills/build_gemini_code_image.md

- Each figure is one prompt file at Pencil/build-gemini/<lesson>/<NN-slug>.md that contains only the prompt; the image is generated by hand in Gemini and saved into Pencil/build 02/<lesson>/png-gemini/.

- Fixed shape: a moral-lesson title on top, then a code editor showing the code, then a line-by-line block, then a third "Explanation" block; print-friendly white, literal not allegory, and never any broken lines in the prompt file.


Pencil build-2 figures (the deterministic three-block figure — the current main figure route):

A sixth artifact: the same three-block design as the Gemini code-image, but authored as HTML/CSS and rendered deterministically by Pencil. Follow the precise skill found here: /skills/build_pencil_image_2.md

- Each figure is a lean card.html at Pencil/cards 02/<lesson>/<NN-slug>/ that links the shared kit Pencil/styles/figure.css (the theme: light VS-Code editor with colored Mac dots and zebra rows, IBM Plex Sans/Mono/Condensed, and "Explanation" as the always-named third block).

- Each lesson folder Pencil/build 02/<lesson>/ holds three subfolders: md-img/ = the image descriptions (build the card from these), png/ = the Pencil renders, png-gemini/ = the manual Gemini reference images.

- Render from Pencil/: PENCIL_CARDS="cards 02" PENCIL_OUT="build 02" node render.mjs <match> (renders into png/; add PENCIL_VW=1100 only if a card is wider than the 820 viewport).
