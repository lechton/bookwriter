# Skills

The instruction system of the react-lecture-04 project. Each skill is one folder with one SKILL.md, written as numbered principles in the fixed formulation: `## Section | number | Principle`, checkbox statements, and PROPER EXAMPLE / HALF WAY EXAMPLE / COUNTER-EXAMPLE items with Notes, where a HALF WAY EXAMPLE shows a partial fix that looks improved and is still not allowed. Load only the skill a task triggers.

## The skills

| skill | governs | load when |
|---|---|---|
| pre-lecture | the Phase 1 blueprint at md-pre-lectures/{nn}.md, with ★/◇ technical grading of every paragraph element and planning of the practical example stages | a pre-lecture is about to be written or revised |
| lecture-voice | stance, plain upper-intermediate English, concept definitions (the default and the law), technical descriptions that end in a consequence, the numbered opening beats, callouts | lecture prose is written or revised |
| lecture-structure | skeleton, practical example staging, naming, tables | a lecture is assembled or restructured, or a pre-lecture plans one |
| code-blocks | code windows, 10-line ceiling, continuation attributes, comments | any code block is written or reviewed |
| ui-panels | component explorer, files, component-code panels | any UI panel is added or reviewed |
| figures | standalone HTML figures and the design system | a figure is designed, cloned, or revised |
| verification | quality gates and the screenshot protocol | a lecture is claimed complete, or an audit is requested |
| build | pipeline, theme publishing, orchestrator | lectures are compiled, or a production session is launched |

## Load order

writing a pre-lecture → load pre-lecture, lecture-voice, lecture-structure, and ui-panels
writing a lecture → load lecture-structure, lecture-voice, code-blocks, ui-panels, and figures
calling a lecture done → load verification and build

The pre-lecture row carries lecture-structure and ui-panels because the blueprint must plan the practical example stages and the panel elements before Phase 2 begins; a blueprint written without the structure laws in the room produces clean prose with no planned guided build, and the production lecture inherits that omission. #2026_09_20_01_group_1

## The meta-skill

prompt-writing sets the standard for how every skill here is written. Read it before writing or editing any skill.

## The registry and the briefs

Every rule carries a batch tag (`#YYYY_MM_DD_NN_group_M`) naming its origin; the registry of working titles lives in [RULE-TAGS.md](RULE-TAGS.md); the brief explaining each batch's rules and philosophy lives in `brief/brief_YYYY_MM_DD_NN.md`. Grep a tag to find every rule of that group across all files.

## The archive

old-instructions holds the legacy instruction files these skills digest. It stays frozen as the source of record for the rewrite; each SKILL.md names its legacy source in its Digests line.
