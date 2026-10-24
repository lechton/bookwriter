---
name: prompt-writing
description: Write or edit prompts, instructions, and skills for AI agents. Use whenever creating a new prompt or rule, editing an existing instruction, or reviewing prompt quality across agent workflows.
---

# Prompt Writing

This skill governs the authoring, refinement, and quality review of all agent instructions, prompts, and skills across the workspace. Whenever editing any skill in `skills/v9.3/`, always run the **Skill-Surveillance Super-Skill** ([../skill-surveillance/SKILL.md](../skill-surveillance/SKILL.md)) alongside [quality-checklist.md](quality-checklist.md). Vocabulary guidance lives in [prompt-glossary.md](prompt-glossary.md).

## The Five Principles of Principles #2026_10_04_03_group_1

When writing or editing any rule, prompt, or skill, authors must adhere to the five governing meta-rules:

1. **Prune Before Banning (The Golden Rule of De-Prescription)**: Models default to proposing bans ("never do this") and treating positive guidance as exclusionary. The first remedy for unwanted behavior is pruning conflicting prescriptions or artificial constraints from existing instructions, rather than stacking new bans. Keep the instruction system lean and grounded in clear standards.
2. **Teach by Living Example (Examples Carry the Doctrine)**: Rules and checkboxes are merely indices; the living PROPER and COUNTER-EXAMPLE pair carries the doctrine, the pedagogical rhythm, and the tactile texture. Instructions must never treat examples as decorative. Every new standard or rule must ship with concrete, contrasting exemplars.
3. **General Standards Over Micro-Regulations**: Insist on broad standards of clarity, rhythm, and physical reality rather than micromanaging word counts, sentence counts, or mechanical templates. Let the shape follow the content: plain sentences are the normal shape, and bullets appear only where the reader must tell two look-alike things apart.
4. **Name Things as the Reader Sees Them**: Use the name in the code first and say who provides it (the browser, React, or our code). Add a human label such as *The Listener* only when two code names look alike and confuse the reader, as `currentTarget` and `target` do.
5. **Name the Exact Platform Defect**: Eliminate hand-waving developer filler jargon ("preventing broken lookups", "ensuring robustness"). State the exact physical runtime consequence ("returns undefined", "clears client memory on reload", "causes duplicate renders in StrictMode").

## Why Decorative Examples Fail: Examples Carry the Doctrine #2026_10_04_03_group_1

An instruction or rule without a living example is an abstract legal clause. Language models interpret abstract clauses literally, often contorting them into aggressive negative prohibitions or bureaucratic run-on sentences.

- **The PROPER EXAMPLE** models the living standard: its cadence, its visual breathing room, its clear names for each thing, and its tactile vocabulary.
- **The COUNTER-EXAMPLE** models the specific failure mode to avoid: compressed run-ons, pompous academic word salad, or vague developer hand-waving.

Whenever a defect occurs in generated lectures or code, authors must analyze whether the instruction lacked a living exemplar pair, and provide one immediately to anchor the model's output.

## Rule Tags, Registry, and Briefs #2026_09_20_04_group_1

Every batch of instruction edits must follow the traceability protocol mandated in [quality-checklist.md](quality-checklist.md):
- Tag each new rule or section with `#YYYY_MM_DD_NN_group_M`.
- Log the working title and touched files in `skills/RULE-TAGS.md`.
- Publish an architectural decision brief in `brief/brief_YYYY_MM_DD_NN.md`.
