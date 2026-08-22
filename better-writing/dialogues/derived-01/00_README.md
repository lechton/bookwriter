# Dialogue: The Derived Rune (and why it is not the watch rune)

A two-character dialogue that teaches the `$derived` rune from the inside, built on top of the observer/subscriber model from the previous lesson (a signal is a closure holding one value and its own private list; read subscribes, write notifies; a single shared `flagged_function` says who is currently running).

The dialogue is split into **turns**. Each turn is one exchange between the professor and the student, and is made of up to three files.

## The cast

- **Professor.** The teacher. Speaks out loud. May include slides (code, side-by-side tables, definitions).
- **Student.** The learner. Speaks out loud. Asks, pushes back, restates.
- **Student THOUGHTS.** The student's internal monologue while reading the professor's turn, word by word. This file flags every unexplained term, every unsupported claim, every internal contradiction the student can derive, and forms the hypothesis the student will then speak. It is the "debug-the-reader" method made visible, and it is the reason the format exists.

## The rhythm

Each turn is a triplet, read in this order:

```
T01_prof.md             <- professor speaks
T01_student_thoughts.md <- student reads it, internally, word by word
T01_student.md          <- student replies out loud

T02_prof.md             <- professor replies
T02_student_thoughts.md <- student reads it, internally, word by word
T02_student.md          <- student replies out loud
...
```

The rule that is not obvious from the filenames alone: **the THOUGHTS file always sits between the professor's turn and the student's spoken reply.** It is the audit of comprehension before the reply is given.

If a turn has only a `prof` file, the turn is unfinished. The student has not replied yet.

## Reading order

Read top to bottom, turn by turn. Within a turn, read `prof`, then `student_thoughts`, then `student`. Do not skip the THOUGHTS file. It is where the real comprehension work happens, and the student's spoken reply only makes full sense once you have seen the doubts that produced it.

If you already hold the observer/subscriber model cold and just want the punchline: a derived is a lazy, cached watcher. The watcher half subscribes to its inputs through the same read-while-flagged rule as any effect, on the first read. The lazy half is the dirty flag, which lets writes pass through without computing. The cached half is the stored answer, which lets later reads cost nothing.

## Status

- T01: the professor opens, the student pushes back with the doubler counterexample.
- T02: the professor concedes the doubler, reframes as two different jobs, introduces push vs pull, and hands the student a contradiction.
- T03: the student cracks the contradiction (the first read is the subscription moment), the professor confirms and shows the `makeDerived` code, the laziness proof, and the save/restore pin.
- T04: the professor resolves the save/restore pin with the derived-of-derived chain.

Unfinished: the Svelte 5 mapping to real runes, the rule of thumb for `$derived` vs `$effect`, and the honesty-about-scope close.
