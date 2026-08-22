# archive/build/v01 — original global build script

This is a verbatim snapshot of `diagram-lab/src/build.mjs` captured on 2026-07-21, preserved here for reference before `online-demo-01` diverged to its own local builder.

## What it served

The global `diagram-lab/src/build.mjs` was the single build pipeline for every project under `diagram-lab/output/`. It was invoked as:

```sh
node src/build.mjs <demo-name>
```

From inside `diagram-lab/`, e.g. `node src/build.mjs online-demo-01`. The `<demo-name>` argument resolved to `output/<demo-name>/`, and the script then:

1. Read every `output/<demo-name>/md/*.md` file (sorted, skipping `*.thinking.md`).
2. Parsed a custom markdown subset into blocks (question headers, `@tags` chips, labelled paragraphs, fenced code with optional `title=`, raw HTML `<div class="dg">` diagrams, blockquote "move" callouts, bullet lists).
3. **Stripped** any paragraph beginning with `Design description:` — this was the workaround that motivated the restructure. The image-generator spec was co-located in the card markdown but was never meant to appear on the card itself.
4. Injected the matching `output/<demo-name>/diagrams/<name>.html` snippet (if present) into each card section.
5. Wrote one standalone `output/<demo-name>/html/<name>.html` per card plus a combined `output/<demo-name>/html/deck.html`.
6. Rendered each HTML to `output/<demo-name>/pdf/<name>.pdf` via Prince.

## Why it is archived here

`online-demo-01` now uses a local builder at `online-demo-01/src/build.mjs` that reads from `md-card/` instead of `md/`. The `Design description:` strip hack is no longer needed because design descriptions now live in `md-design/`. The global `diagram-lab/src/build.mjs` is **untouched** and continues to serve every other project under `output/` (`exp-001_state`, `exp-002_key`, `exp-003_new-topics`, `exp-004_gallery`, `exp-005_redraw`, `javascript-demo`, `javascript-demo-02`, `svelte-demo`).

## When to consult this archive

- You need to remember the original invocation form `node src/build.mjs <demo-name>`.
- You need to understand why the `Design description:` strip ever existed.
- You want to migrate another `output/*` project to the `md-card/` + `md-design/` split and want a baseline diff.
