# React Player

A Svelte reader for the React 10 lectures. It shows every chapter of `../react-10/01-03-md-lectures-HTML/v1/NN.html` (the main design only, not the `-old` or `-earth01` variants) as a book with a table of contents, opens Lecture 21 by default, and plays a chapter's audio from a fixed bar at the bottom of the page. While the audio plays, the block being spoken is focused and scrolled to the middle of the page; clicking a voiced block jumps the audio to it.

The chapters are never copied or edited: the Vite dev server serves them at `/chapters/`, and `npm run build` copies them into `dist/`.

## Run

```bash
npm install
npm run dev
```

## How the text and the audio stay in sync

1. **Block ids.** Every element child of a chapter's `.container` is one block, numbered per kind in reading order: `title-001`, `question-001`, `h2-001`, `h3-001`, `p-001`, `fig-001`, `code-001`, `list-001`, `table-001`, `box-001`. The same function ([src/lib/blocks.js](src/lib/blocks.js)) numbers them in the app and in the scripts.
2. **The audio text.** `audio/NN-audio.md` holds one entry per voiced block: a marker with the block id and the first words of its original text, then the spoken version with the Gemini TTS tags (`<breath>`, `<pause>`, `<long-pause>`, `<sigh>`, `<chuckles>`, `<exhales>`). One entry may cover several blocks (`<!-- block p-002 code-001 | src: "..." -->`); a block with no entry is not read.
3. **The check.** `npm run blocks -- check 21` compares the audio text with the HTML and fails when an id is missing, out of order, or its first words changed (the chapter was rebuilt). `npm run blocks -- list 21` prints every block id; `npm run blocks -- skeleton 21 10` prints a starting audio text for the first ten blocks.
4. **The audio.** `npm run audio -- 21` speaks the whole audio text in one Gemini TTS request and aligns it with ElevenLabs, using the VideoMax tools (`gemini-tts-demo/generate_tts.py` and `align_audio.py`, found through the `external.videomax` key of `bookwriter-project.local.json`). Run it inside `workon main-env`, with `PYTHON=python` so the scripts use that environment. The aligned words are matched back to each entry, and the start of every entry is written to `src/audio/NN.timing.json`; the audio goes to `public/audio/NN.mp3`. An existing take is reused unless `--force` is passed, because every request is paid. `npm run timing -- 21` rebuilds only the timing from the saved alignment.

Files under `audio/build/NN/` keep what was sent to the voice (`NN.tts.txt`), what was aligned (`NN.align.txt`), and the alignment (`NN.align.json`); the raw WAV take is gitignored.

## Writing the audio text

The spoken version keeps the chapter's own sentences and adds breaths and pauses where a person would take them. Anything a voice cannot read is turned into speech: code is talked through informally, a figure is described as the listener would see it, symbols become words (`display: none` becomes "display, none"). Each code block, figure, and table is introduced in its own way, never with a fixed opening. The tag guide and the approved examples are in VideoMax: `audio/scripts/README.md`, `notes/prompt_tts_breath_01.md`, and `skills/v1.2/lecture-scripting/spoken-demos.md`.

## Status

Lecture 21 is fully voiced: 349 blocks in 16 parts, 2 hours 3 minutes, voice Enzo, style `breath` (part 1 is the approved ten-block pilot). The other chapters have no audio yet.
