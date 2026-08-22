# Dialogue: The Derived Rune, v02 (compact, four-file turns)

A second attempt at the same material, with three changes from v01:

1. **Compact.** Each spoken turn is one paragraph of prose plus at most one slide. Slides carry one idea, not a reference table.
2. **Realistic student.** The student is no longer an omniscient critic. They are one specific, pinned person (below) with predictable gaps. They misunderstand, fixate on the wrong thing, miss terms, and get attached to partial guesses. The audit of "every term must be defined" is no longer the student's job.
3. **Professor thoughts.** Every turn now opens with the professor drafting the turn and auditing his own terms, so every new word gets a humane definition before the student ever sees it. This is where the "every term defined" guarantee lives.

## The pinned student

Not "a student." This student:

- Three years of front-end work, has shipped React apps with `useState`, `useEffect`, `useMemo`.
- Read the Svelte 5 docs once. Remembers "$state and $derived exist." Not the details.
- Gets closures at a single level. Loses them when nested three deep or when several closures share outer variables.
- Has never built a reactivity system. Has used them as a black box.
- Knows "cached" from HTTP. Has heard "dirty" only in "dirty checking," never knew what it meant.
- Reads code linearly, loses the big picture, re-reads.
- Forms hypotheses fast and gets attached to them, sometimes wrongly.

Predictable consequences: foreign words cause friction even when defined; multi-function structures blur; concrete proofs (a printed counter) land hard; abstract derivations do not. This is the asymmetry the dialogue is built around.

## The rhythm (four files per turn)

```
T0X_prof_thoughts.md     professor drafts the turn, audits every new term for a humane definition
T0X_prof.md              the spoken turn, one paragraph + one minimal slide
T0X_student_thoughts.md  the pinned student reads it, partial uptake, real friction
T0X_student.md           one-paragraph spoken reply
```

Read in that order. If a turn has only the first two files, the student has not replied yet.

## Status

- T01: the professor opens. Calibration turn. Read this one first and react to the voice before any more turns are written.
