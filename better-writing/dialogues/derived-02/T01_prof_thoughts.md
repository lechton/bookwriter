# T01 — Professor THOUGHTS (drafting the opening turn)

## What this turn has to do

Open the lesson. Restate the one rule from the previous lesson that everything today is built on, so the student is re-seated. Then name the topic (the derived rune) and make the provocation that the derived rune and the watch rune are not the same thing. Stop there. Do not explain the difference. Invite pushback.

## Draft

I will restate the rule in one sentence, not a paragraph: read subscribes, write notifies, and a shared flag says who is currently running. Then I name the derived rune and claim it is different from the watch rune, and leave it hanging. One paragraph, one slide.

## Term-definition audit

Every new term or named thing in this turn, with a humane one-liner the student can hold. If I cannot give the one-liner, I cut the term.

- **derived rune** (Svelte's `$derived`): a value that is computed from other values, instead of being stored directly. Like a spreadsheet cell with a formula in it. You do not type the number, the formula produces it from other cells.
- **watch rune** (Svelte's `$effect`): code that runs, and re-runs, when the values it depends on change. Like `useEffect` in React, if the student needs the mapping.
- **rune**: a Svelte-specific keyword that starts with a dollar sign, like `$state`, `$derived`, `$effect`. It is not a function, it is a compiler instruction. The student has seen them in the docs.
- **read subscribes, write notifies**: the rule from the last lesson. Reading a signal is the moment the signal learns about you. Writing a signal is the moment everyone who learned about it gets called. (Already established vocabulary, just restating.)

No other new terms in this turn. "Dirty," "cached," "push," "pull" are all reserved for later turns, where they will each get their own humane definition at the moment they appear. I am deliberately not front-loading them, because front-loading a pile of terms is exactly what makes a student glaze over.

## What I am deliberately not doing

Not explaining the difference between derived and watch. That is the student's job to push back on, and the pushback is the entry point for the whole lesson. If I explain it here, I rob the lesson of its first beat.

## Length check

One paragraph of prose in the spoken turn. One slide, minimal, just restating the rule visually so it is not pure prose. Good.
