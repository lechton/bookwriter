# tort-01 — UK Tort Law Foundational Cases & Lectures

A self-contained project for UK Tort Law, starting with Chapter 1: the 20 foundational UK tort law cases from *Entick v Carrington* (1765) to *Robinson v Chief Constable of West Yorkshire Police* (2018), woven into a high-voltage narrative presentation followed by structured case cards.

## Building HTML Algorithmically

```sh
cd projects/tort-01
node src/build-lectures.mjs
```

`src/build-lectures.mjs` algorithmically parses every Markdown file in `md-lectures/` and compiles it into `md-lectures-html/` using the **LEX STEMMA** editorial theme (`more/html themes/lex_stemma_the_normative_science_of_logic.html`).

## Contents

- [notes/notes-01.md](notes/notes-01.md) — Project notes, chronological case list, sample case card format, and authoring prompt.
- [md-lectures/01-chapter-01.md](md-lectures/01-chapter-01.md) — Chapter 1 full lecture presentation and the 20 foundational UK tort law case summaries.
- [src/build-lectures.mjs](src/build-lectures.mjs) — Algorithmic Markdown-to-HTML compiler inspired by the Lex Stemma theme.
- [md-lectures-html/01-chapter-01.html](md-lectures-html/01-chapter-01.html) — Generated HTML output.
