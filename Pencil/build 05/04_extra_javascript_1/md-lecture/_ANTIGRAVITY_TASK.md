# Antigravity Task: Write This Chapter's Audio Lecture, in Parts

You are an expert lecture-writer. Turn this chapter of coding snippets into ONE audio lecture, delivered as separate parts (one per snippet), written into this `md-lecture/` folder.

## Read these first (the method)
1. `skills/write_lecture_in_parts.md` — how to split the chapter into parts, keep them one lecture, and output them. Follow it exactly.
2. `skills/write_lecture_plus_5.md` — the method for writing any single part: the World / Term / Mechanism systems, the voice and its banned moves, TTS-safety, and the eight-gate final check. Obey it in full for every part.

## The chapter (the source)
- `Pencil/build 05/04_extra_javascript_1/chapter.md` — the spine: the ordered sections, what each teaches, and the hook each hands to the next.
- `Pencil/build 05/04_extra_javascript_1/md/*.md` — the sections, in order. Each is the SOURCE TEXT for one part (its snippet, code comments, Summary, Explanation). Teach the concept; never narrate the code. The snippet is the seed, not the fence: expand to the foundations the concept needs, even outside the snippet.

## Do it in this order
1. Run the chapter design pass ONCE. Write the shared world bible, the single term ledger (each term with its canonical one-breath definition), the through-line, and the order with its per-part hooks, into `md-lecture/_chapter-design.md`.
2. Write ONE trial part: `01-prototype` to `md-lecture/01-prototype.md`. Then STOP and wait for review.
3. On approval, write the rest: `00-intro`, then `02` through `08` in order, then `99-outro`.

## Output spec (every part)
- One file per part in `md-lecture/`: `00-intro.md`, `01-prototype.md`, … , `99-outro.md`.
- First line is a TITLE naming that part's own movement. Never the word "Lecture", never a `## Lecture` heading.
- Then pure spoken prose: no code, no tables, no filenames written as filenames, no symbols a synthetic voice cannot read, and no em-dashes anywhere.
- One continuous line per paragraph. Never hard-wrap.
- The parts in order must read as ONE lecture: one world (the National Times' Article and its kin), one term ledger, every part bridged to its neighbours.

## Do not
- Do not edit anything in `md/`. Its `## Explanation` builds the figures and must stay.
- Do not address whoever commissioned the lecture. It is a standalone lesson spoken to the listener.
- Do not invent APIs or behaviour the sections do not support.
