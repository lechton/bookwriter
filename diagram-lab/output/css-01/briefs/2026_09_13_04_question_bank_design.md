# Brief 04 — Question Bank Design: nature, quality, and order of the css-01 questions

Date: 2026-09-13 · Number: 04 · Status: first review round executed; bank grown 54 to 60, still DRAFT for remaining review items

## Review decisions recorded 2026-09-13 (second round, after corpus assembly)

Question numbers in the proposal body below refer to the original 54-row draft; the bank files are authoritative.

1. **Canon audit performed.** The front-end-interview-handbook CSS canon (27 questions, fetched live because the local repo file moved to the website) was mapped against the draft: 24 fully covered, CSS sprites judged obsolete for 2026, and two genuine gaps confirmed (Block Formatting Context, canon question 5; visually-hidden content, canon question 10). Scale analysis: the framework banks are API-count-driven (Svelte 5 + SvelteKit 210, React + React Server 180, NestJS 200, each covering two subjects), while CSS interviews are mechanism-driven; the accessibility benchmark's 54 is the correct family scale, so growth is surgical, not framework-style.
2. **Six rows added in dependency order, with renumbering** (permitted because the bank is still pre-approval; after final approval, growth is append-only): Q5 margin collapsing (CORE, after box model), Q10 formatting contexts (CORE, after floats), Q28 hiding content (MORE), Q29 intrinsic sizing (MORE), Q30 subgrid (MORE), Q57 logical properties and RTL (MORE, Part Three). New tier distribution: **30 CORE / 23 MORE / 7 ADVANCED**.
3. **Free fold-ins applied to existing rows:** `@scope` into Q31 (nesting_layers), `aspect-ratio` into Q49 (fluid_layouts), relative colors and `color-mix()` into Q12 (colors), `@font-face` into Q13 (typography), right-to-left selector matching into Q14 (selectors), `will-change` and containment into Q22 (transitions_animations). Cross-references updated: fluid layouts hook now points to Q20 (math functions), dark mode hook to Q24 (custom properties).
4. **Six new topic tags registered** in `topics.md` (`#margin_collapsing`, `#formatting_contexts`, `#hiding_content`, `#intrinsic_sizing`, `#subgrid`, `#logical_properties`); mechanical audit re-run: 60 rows, continuous numbering, zero orphan tags either direction.
5. **Still open for the next review round:** the cuts debate (Q13 typography, Q25 backgrounds — both now carry fold-ins, strengthening the case to keep), grid-before-flex ordering, the Less question count, the canvas blueprint mapping, and final numbering freeze.

## The benchmark numbers

The accessibility bank holds 54 questions across two domains (34 accessibility + 20 performance), tiered 26 CORE / 15 MORE / 13 ADVANCED, ordered so a lecture only depends on concepts earlier lectures taught. The react bank holds 12 core lectures plus a server track. For css-01, "clarity and comprehensiveness at the accessibility level" means: every mechanism a working frontend developer can be asked about appears exactly once, in dependency order, with one interview-register question and one visceral hook, and no two questions compete for the same mechanism.

## The quality criteria (inherited, restated for CSS)

1. **One mechanism per question.** "What is the cascade?" and "How is specificity calculated?" are separate rows because they are separate mechanisms; a lecture teaches one thing early and alone.
2. **Interview register.** Every row reads the way an interviewer asks it: "How do you center a div?", "Why does z-index sometimes do nothing?", "When does grid beat flexbox?".
3. **Visceral hooks in the National Times world.** Each hook is a pain moment with stakes: a broken checkout, a vanished footer, a style war of escalation. Hooks grow into Opening Ladders; they are never abstract.
4. **Dependency order.** No lecture needs a concept a later lecture teaches (custom properties before dark mode, specificity before BEM, media queries before container queries).
5. **Cross-reference, never re-teach.** Part 3 deliberately links to accessibility-01 Lectures 14 (contrast), 15 (zoom/reflow), and 17 (touch targets) instead of duplicating them; the two series interlock.

## The proposed architecture: 54 questions, three parts

Total **54** mirrors the accessibility scale and gives each track room to breathe.

**Part One — CSS Review (Q01–Q26).** The mechanisms every interview touches, in two waves.
- ❱ CORE "The Cascade and the Box" (Q01–Q12): cascade, specificity, inheritance, box model, display, positioning, stacking contexts, floats, units, colors, typography, classic selectors.
- ❱ CORE "Layout" (Q13–Q18): flexbox axes, flex items, grid tracks, grid placement, the centering classic, the math functions (`calc/min/max/clamp`).
- ❱❱ MORE "Mechanics and Modern CSS" (Q19–Q25): pseudo-classes vs pseudo-elements, transitions and animations, transforms, custom properties, backgrounds, overflow, modern selectors (`:is/:where/:has`).
- ❱❱❱ ADVANCED (Q26): native nesting and `@layer` — the cascade's newest contracts.

**Part Two — BEM Methodology with LESS and SASS (Q27–Q40).** Naming first, then Sass in depth, then Less, then the honest trade-offs.
- ❱ CORE (Q27–Q30): why a methodology at all, BEM grammar, elements vs modifiers in depth, BEM's real trade-offs.
- ❱❱ MORE (Q31–Q37): the methodology landscape (OOCSS/SMACSS/ITCSS/CUBE/utility-first), Sass basics, mixins vs functions vs extend, the `@use`/`@forward` module system, maps and loops, BEM+Sass together, Less for the legacy codebase.
- ❱❱❱ ADVANCED (Q38–Q40): preprocessor pitfalls (over-nesting, extend bloat), what still justifies a preprocessor against modern native CSS, and the styling-strategy system-design question (BEM+Sass vs CSS Modules vs CSS-in-JS vs utility-first).

**Part Three — Responsive, Accessible, Cross-Browser CSS (Q41–Q54).**
- ❱ CORE (Q41–Q46): the viewport meta, media queries and mobile-first, breakpoint strategy, fluid layouts and fluid type, responsive images, responsive patterns for nav and tables.
- ❱❱ MORE (Q47–Q51): container queries, dark mode with `prefers-color-scheme`, user-need media features (`prefers-reduced-motion`, `prefers-contrast`, `forced-colors`), touch and pointer media features, and the CSS side of WCAG (zoom, reflow, text spacing) with explicit cross-links to the accessibility series.
- ❱❱❱ ADVANCED (Q52–Q54): reset vs normalize vs modern baselines, `@supports` and progressive enhancement, and the systematic cross-browser testing workflow.

**Tier distribution: 28 CORE / 19 MORE / 7 ADVANCED.** Deliberately front-loaded: CSS interviews are won or lost on fundamentals (cascade, box model, flexbox), and the ADVANCED tier is reserved for questions that genuinely separate seniors (preprocessor pitfalls, styling strategy, progressive enhancement). If the reviewer prefers the accessibility ratio, candidates to promote to ADVANCED are Q25 (`:has`), Q35 (Sass logic), and Q47 (container queries).

## Coverage matrix (nothing asked in interviews is homeless)

| Interview theme | Covered by |
|---|---|
| Cascade / specificity / inheritance / `!important` | Q01–Q03, Q26 |
| Box model, display, overflow | Q04, Q05, Q24 |
| Positioning, z-index, stacking | Q06, Q07 |
| Floats and legacy layout | Q08 |
| Units, colors, typography | Q09–Q11 |
| Selectors classic + modern | Q12, Q19, Q25 |
| Flexbox | Q13, Q14 (+ centering Q17) |
| Grid | Q15, Q16 |
| Math functions | Q18 (applied again at Q44) |
| Animations and transforms | Q20, Q21 |
| Custom properties | Q22 (applied at Q48) |
| Backgrounds | Q23 |
| Methodology and BEM | Q27–Q31, Q36 |
| Sass | Q32–Q36, Q38, Q39 |
| Less | Q37, Q38 |
| Styling strategy | Q40 |
| Responsive foundations | Q41–Q46 |
| Container queries | Q47 |
| Theming and user preferences | Q48–Q50 |
| CSS accessibility surface | Q51 (+ a11y-01 L14/L15/L17) |
| Cross-browser engineering | Q52–Q54 |

## What I did

Wrote the full draft bank: `../../questions-css/questions.md` (all 54 rows with hooks), `../../questions-css/topics.md` (the controlled vocabulary of 40 tags), `../../questions-css/README.md` (format and rationale, mirroring the accessibility README).

## What is still open (the joint review)

1. **Cuts and swaps.** Are any rows dead weight? My two weakest candidates: Q11 typography (could fold into Q09 units) and Q23 backgrounds (could fold into Q44 fluid layouts) — but both are genuinely asked in interviews, so I kept them.
2. **Order disputes.** Should grid (Q15–Q16) come before flex items (Q14)? I placed flex first because interviewers lead with it and grid's `fr` unit reuses the flex-grow mental model.
3. **The Less question count.** Exactly one dedicated Less lecture (Q37) plus shared pitfalls (Q38): is that the right weight given Less's decline, or does your interview target list justify more?
4. **The canvas blueprint.** After brief 03's template is proven, each CORE row gets a predetermined figure archetype (the equivalent of the a11y Core Tranche Canvas Blueprint). I deferred that mapping until the demo lesson validates the vocabulary.
5. **Numbering stability.** Once we approve the bank, numbers freeze; growth happens by appending a Part Four or a second tranche, never by renumbering.
