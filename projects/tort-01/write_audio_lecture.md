# Prompt: Chapter 01 as an Audio Lecture

You are turning Chapter 1 of a UK Tort Law course into an audio lecture: a warm tutor talking to one student.

Work from the project folder `projects/tort-01`.

Read first:
- `skills/audio-lecture/SKILL.md` (the rules, with examples)
- `skills/audio-lecture/spoken-demos.md` (one short before and after)

Source: `md-lectures/archive/01-chapter-01-2026-11-04-1419.md` (read only, do not change it).
Output: `md-lectures/01-chapter-01.md` (new file).

Work one section at a time:
1. Copy the `#` title line into the output file.
2. For each of Sections 1 to 7: read that section of the source, rewrite it following the skill, and append it to the output file before moving on. Save after every section.
3. Copy Sections 8 and 9 into the output file unchanged.
4. Run `node src/build-lectures.mjs` and fix any build error.

Keep all the content of the source: every case, story, and explanation. Change how it is said, not what is said. If you lose the connection, continue from the first section that is missing from the output file.

When finished, reply with one short paragraph: which sections you rewrote, where each Revision block sits, and whether the build passed.
