# T03 — Professor THOUGHTS (drafting the resolution of the pull contradiction)

## What this turn has to do

Confirm the student's first-read hypothesis is correct, because it is, and confirming-what-is-right-before-correcting is the discipline. Then resolve the contradiction: pull is real, but it is half the story. The other half is that the first read is the moment the derived subscribes, and every later change just marks a flag. Introduce the two words that carry the mechanism, dirty and cached, each with a humane definition. Prove the laziness with the counter printout, because the proof is the pedagogy and this student believes printed numbers. Stop before showing the full makeDerived code. The code is T04. This student loses the thread in multi-function structures, so dumping all of makeDerived here would bury the one idea (first read subscribes, later writes just mark dirty, later reads recompute if dirty).

## Draft

Lead with "your hypothesis is right." Then: the first read is where the derived raises its own flag, runs the function, subscribes to its inputs, caches the answer. After that, writes to its inputs do exactly one thing, they set a flag called dirty. Reads do exactly one thing, they check that flag and recompute only if it is set. Two new words, defined below. Then the counter proof. One paragraph, one slide.

## Term-definition audit

This is the term-heavy turn. Every one of these gets a humane one-liner inside the spoken turn, because "dirty" especially is a word this student has baggage around.

- **dirty**: a one-bit flag that means "the stored answer might be stale, recompute before returning it." Humane version, and this matters for this student: dirty here does NOT mean the Angular "dirty checking" thing. It is not a cycle of comparing every value. It is a single boolean. Picture it as a sticky note on the fridge that says "milk might be off, check before you use it." The note does not check the milk. The note just says: check. That is the dirty flag. It is a reminder to recompute, nothing more.
- **cached** (and **cache**): the stored answer, the last value the function produced, kept around so later reads do not redo the work. Humane version: the cache is yesterday's answer written on the fridge. If nobody touched the inputs, yesterday's answer is still right, so you read it off the fridge instead of cooking again. Cache is just "the last result, kept for reuse."
- **recompute**: run the function again, to produce a fresh answer. Humane version: recompute is the act of cooking. The dirty note told you to check, the cache was yesterday's meal, recompute is making a fresh one.

Three words, one mental picture (the fridge: sticky note = dirty, yesterday's meal = cache, cooking = recompute). I will use that picture in the spoken turn so the three definitions land as one image, not three pieces of vocabulary to memorize.

## What I am deliberately not doing

Not showing makeDerived's code. Three functions (recompute, run, read) in one closure will blur for this student. The code comes in T04, after the mechanism is intuitively held. Here I only want: first read subscribes, writes mark dirty, reads recompute-if-dirty, and the proof that this is what actually happens.

Also not introducing "subscribers on a derived" yet. That is the producer/consumer duality, and it is T05's job (it falls out of the code naturally). Front-loading it here would be exactly the term-pile that glazes a student.

## Length check

One paragraph (confirm, first-read story, dirty/cached/recompute via the fridge picture). One slide (the laziness proof with the counter). The fridge picture is in the prose, not a separate slide. Good.
