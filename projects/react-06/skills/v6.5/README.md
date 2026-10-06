# Skills

The instruction system of the react-lecture-06 project. Each skill is one folder with one SKILL.md, organized around numbered principles (`## Section | number | Principle`), with every standard formulated as an evaluative question (`- [ ] Does ...?`, `- [ ] Is ...?`) setting a clear quality bar on the resulting artifact. Skills include PROPER EXAMPLE, HALF WAY EXAMPLE (showing a partial attempt that looks improved but still falls short of the quality standard), and COUNTER-EXAMPLE items with explanatory Notes. Prefer loading only the skill a specific task triggers.

## The skills

| skill | governs | load when |
|---|---|---|
| map-principles | the principle map at 01-01-map-principles/{nn}.md: a candidate ledger discovered from the syllabus card, the react.dev pages for its topic, and senior engineering knowledge, then routed to owner lessons through the whole syllabus and selected by importance and atomicity into numbered principles with handles, a Terms table of first appearances, and lists of conflicts and open issues | a principle map is authored or audited, or a principle's coverage, ownership, importance, terms, proofs, or wording is questioned #2026_09_26_19_group_1 revised by #2026_09_26_20_group_1, #2026_09_26_21_group_1, and #2026_10_06_01_group_7 |
| pre-lecture | the Phase 1 blueprint at 01-01-md-PRE-lectures/<version>/{nn}.md (default latest version, e.g. v1), with ★/◇ technical grading of every paragraph element and planning of the practical example stages | a pre-lecture is about to be authored or revised |
| lecture-voice | stance, plain upper-intermediate English, concept definitions (default and core mechanics), technical descriptions that end in a consequence, the numbered opening beats, callouts | lecture prose is authored or revised |
| pedagogical-crossroads | teaching foundational mechanics at technical crossroads using separate integrated code snippets | a technical fork, alternative syntax, or foundational mechanism is introduced |
| lecture-structure | skeleton, practical example staging, naming, tables | a lecture is assembled or restructured, or a pre-lecture plans one |
| code-blocks | code windows, 10-line ceiling, continuation attributes, clean comments (zero tildes during drafting) | any code block is authored or reviewed #2026_10_04_04_group_1 |
| code-comment-audit | on-demand post-draft auditing of code comments, speech bubbles, indentation offsets, targeted token pointer alignments, and deterministic invariants | a lecture's code comments are audited on demand or before print certification #2026_10_03_02_group_1 revised by #2026_10_04_04_group_1 |
| ui-panels | component explorer, files, component-code panels | any UI panel is added or reviewed |
| figures | standalone HTML figures and the design system | a figure is designed, cloned, or revised |
| lecture-revision | rewriting completed lectures into effortless junior-friendly reading with density breakdown, bold terminology, conversational bridging, is-vs-is-not definitions, and compiling to the 02-01-md-revised pipeline | an existing lecture is being revised for readability or pedagogical accessibility |
| principle-definition | the text inside every `> [!PRINCIPLE]` box: title, definition, and glosses; the eight thinking steps with living examples (answered in the blueprint's `[principle-steps]` element) and the Golden Exemplar Bank | any principle is drafted or reviewed, in the blueprint or the lecture #2026_10_04_09_group_1 revised by #2026_10_04_10_group_1 |
| principled-theory | one-to-one expansion of an approved principle map into complete theory, zero-new-concept case studies, canonical principle formatting, and senior technical interview framing | a principle-based theory section or lecture is authored or reviewed #2026_09_26_19_group_1 |
| verification | quality gates and the screenshot protocol | a lecture is claimed complete, or an audit is requested |
| build | pipeline, theme publishing, version resolution, orchestrator | lectures are compiled, or a production session is launched |

## Load order

writing or auditing a principle map → load map-principles, confirm that bank row {nn} in questions/questions.md and 01-01-map/{nn}.md carry the same topic tag and question, run Discovery from them, the react.dev pages for its topic, and senior engineering knowledge without opening any principle map, read the inbox with `node src/handout.mjs {nn}`, then run Selection against the key lines of every 01-01-map/ card, run the Archive Check against the older maps of the same tag, close the inbox's `map` messages and send any new ones, and finish with `node src/diagnose-map.mjs {nn}` #2026_09_26_19_group_1 revised by #2026_09_26_20_group_1, #2026_09_26_21_group_1, #2026_10_05_07_group_1, #2026_10_06_01_group_5, #2026_10_06_01_group_8, and #2026_10_06_02_group_4
writing a pre-lecture → consult 01-01-map/{nn}.md for syllabus and scope boundaries (#2026_09_25_06_group_1) and its approved 01-01-map-principles/{nn}.md for the numbered principles and the candidate ledger (#2026_09_26_19_group_1 revised by #2026_09_26_21_group_2), read the inbox with `node src/handout.mjs {nn}` (#2026_10_06_02_group_5), then load pre-lecture, principle-definition, lecture-voice, lecture-structure, principled-theory, pedagogical-crossroads, code-blocks, and ui-panels (answer the eight steps in a `[principle-steps]` element, then write each finished principle box; plain trailing comments; zero tildes during drafting) #2026_10_03_04_group_1 revised by #2026_10_04_01_group_1, #2026_10_04_09_group_1, and #2026_10_04_10_group_1
writing a lecture (Phase 1 Authoring) → consult the approved 01-01-map-principles/{nn}.md, then load lecture-structure, principle-definition, principled-theory, lecture-voice, pedagogical-crossroads, code-blocks, ui-panels, and figures; dedicate 100% of cognitive energy to pedagogy, clarity, and clean code with plain trailing comments; strictly omit code-comment-audit from authoring #2026_10_04_01_group_1 revised by #2026_10_04_09_group_1
auditing code comments (On-Demand Phase 2 Audit) → load code-comment-audit, work on the copy in 02-01-md-revised/<version>/{nn}.md (copy the working lecture there first if none exists), isolate focal tokens from the Token Targeting Anatomy table, wrap targets in ~token~ anchors, calibrate line budgets, and verify zero failures with `diagnose-lecture.mjs {nn} --audit --revised` before PDF compilation; the working lecture stays token-free #2026_10_03_02_group_1 revised by #2026_10_04_01_group_1, #2026_10_04_04_group_1, and #2026_10_04_10_group_1
revising a lecture → load lecture-revision, principle-definition, principled-theory, lecture-voice, pedagogical-crossroads, code-blocks, figures, and verification; run secondary code audit afterwards #2026_10_04_01_group_1
calling a lecture done → load verification and build

The pre-lecture row carries lecture-structure and ui-panels because the blueprint plans the practical example stages and the panel elements before Phase 2 begins; a blueprint written without the structure standards in the room produces clean prose with no planned guided build, and the production lecture inherits that omission. #2026_09_20_01_group_1

## The meta-skill

prompt-writing sets the standard for how every skill here is written. Prefer reading it before writing or editing any skill.

## The registry and the briefs

Every rule carries a batch tag (`#YYYY_MM_DD_NN_group_M`) naming its origin; the registry of working titles lives in [RULE-TAGS.md](RULE-TAGS.md); the brief explaining each batch's rules and philosophy lives in `brief/brief_YYYY_MM_DD_NN.md`. Grep a tag to find every rule of that group across all files.

## The archive

old-instructions holds the legacy instruction files these skills digest. It stays frozen as the source of record for the rewrite; each SKILL.md names its legacy source in its Digests line.
