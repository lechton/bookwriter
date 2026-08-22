# Skill: How To Write The Q&A Lecture (The Audio Drill From A Q&A Digest)

This skill produces the FOURTH artifact for a topic, and it is the spoken twin of the Q&A digest (`write_qa.md`).

The four artifacts of one topic:

- The **lecture** (`write_lecture.md`) narrates the topic, code-free, an hour long. A river you float down once.
- The **booklet** (`write_outline_v02.md`) carries the lecture's code. Its eye-twin.
- The **Q&A digest** (`write_qa.md`) poses problems and solves them, on the page, with maps and code and quick-fire drills. A deck of cards.
- The **Q&A lecture** (THIS skill) speaks that deck aloud as a DRILL: it poses each problem, lets the listener answer in their head, then reveals and explains the answer, in the same high-voltage, TTS-safe voice as every other lecture.

So the Q&A lecture is to the Q&A digest exactly what the main lecture is to its booklet: the audio, made to be heard while the eyes rest on the page. Here the page is the digest itself.

THE ONE-LINE RULE FOR THIS SKILL: **copy the audio FORMAT of `write_lecture.md` and the existing lectures verbatim; take the CONTENT and spine from the Q&A digest; add the problem-drill rhythm.** You are not inventing a new lecture style and you are not inventing new material. You are voicing an existing deck in an existing voice.

---

ROLE AND GOAL

You are given a finished Q&A digest (`output/svelte/qa/NN_topic_qa.md`) and the audio conventions of the course (`write_lecture.md`, exemplified by lectures like `04_state.md`). You return the Q&A lecture: one TTS-safe, code-free, high-voltage audio script that walks the listener through the digest's problems as a spoken drill, pointing them to the digest on screen for the code, the component maps, and the quick-fire tables.

Two things make a good Q&A lecture: it SOUNDS like the rest of the course (same format, same voice, same TTS-safety), and it DRILLS rather than narrates (pose, pause, reveal, explain, move). Everything below serves those two.

---

COPY THE AUDIO FORMAT, VERBATIM

Do not re-derive the lecture format; reproduce it. Read `write_lecture.md` and the matching narrative lecture (`NN_topic.md`) and copy their conventions exactly:

- TTS-SAFETY IS ABSOLUTE. This script is read by a machine voice, so NO raw code is ever read aloud, and there are NO em-dashes (a machine voice mangles them; use commas and periods). Narrate every symbol in plain spoken English: the state rune is "the dollar sign followed by the word state"; `count++` is "count plus plus"; `tasks[0].done` is "tasks, square bracket zero, square bracket, dot done"; `.svelte.ts` is "dot svelte dot t s"; `SvelteSet` is "Svelte Set, written as one word"; `() => name` is "an arrow function that returns name, a getter." Spell out anything a voice would trip on. If you ever feel the urge to paste code, stop, and describe it instead.
- SECTION NUMBERING. The title is `# NN | Title`. Sections are `## N.M Title`, sharing the topic's number (the state drill is still lecture four, so `## 4.1`, `## 4.2`, and so on). The Q&A lecture's title must differ from the narrative lecture's so the two are never confused (for example, "The State Drill", not "State Is Just A Variable").
- HIGH-VOLTAGE, DIRECT VOICE. The house style, identical to the other lectures: short sentences, plain words, active voice, concept built on concept, no hedging. Read the VOICE guidance in the other skills; the bar is the same.
- POINT TO THE COMPANION. Where the narrative lecture says "look at the first code block in your booklet," this lecture says "look at the component map in your companion" or "the code is in your digest, under Q six." The companion is the Q&A file. Make the deal explicit early: eyes on the digest, ears on me.
- ANCHOR. Open by placing the listener on the map: this is the problem-drill companion to the topic's main lecture, it stands on the architecture lecture (lecture three) and on The National Times, and it drills what the main lecture taught. Use the running world (the clap count, the article, the logged-in reader) exactly as the digest does. Close with a recap.

---

THE CONTENT IS THE Q&A DIGEST (DO NOT INVENT)

The digest is the script's spine. Follow it, do not extend it.

- THE SPINE IS THE DIGEST'S PROBLEMS, IN ITS ORDER. The digest's sub-themes become the lecture's sections; the problems within each become the beats inside a section. Walk them in order.
- EACH ENTRY BECOMES A NARRATED BEAT. The entry's question, its short answer, and its theory are your material for that beat. Voice them; do not paraphrase away their meaning, and do not pad them with new claims the digest did not make.
- THE MAPS AND CODE STAY IN THE DIGEST. You narrate them. "Look at the component map for this one: the article card owns the clap count, and the clap button is a child it hands a function to." Never read the code; point to it and describe it.
- NOTHING DROPPED, NOTHING ADDED. Every problem in the digest gets its beat. No problem invented, no API introduced that the digest did not cover. If the digest is wrong, fix the digest first, not here.

---

THE PROBLEM-DRILL PEDAGOGY (WHAT MAKES THIS LECTURE DIFFERENT)

The narrative lecture washes a story over the listener. This one makes them WORK. The digest is already a flashcard deck; your job is to run the deck aloud so the listener answers before you do. For every problem, the same five beats:

1. POSE THE PROBLEM. State it aloud, concretely, as the digest's question, anchored in the running world. "Here is the problem. You put a plain Set of liked post IDs into your state, you add an id, and the heart on screen does not light up. Why, and what do you do about it?"
2. INVITE THE ANSWER. A real beat of silence, named: "Pause the recording if you like, and answer it in your own head before I do." This active-recall pause is the whole point of the format. Do it every time; it is not padding, it is the method.
3. REVEAL THE VERDICT. The digest's short answer, spoken first and plainly: a clear Yes or No where the question is yes-or-no, then the one-line resolution. "The answer is no. A plain Set will not react. You reach for the reactive twin."
4. EXPLAIN FROM THE GROUND UP. Now voice the digest's theory, building from the basics, naming and explaining every term, exactly as the digest's theory does on the page. Point to the companion's map and code as you go. This is where the teaching lives; let it breathe.
5. LAND THE MOVE. Close the beat on the digest's one-line move, the habit to carry. Then move to the next problem.

Pose, pause, reveal, explain, move. That rhythm, repeated, is the lecture. It is brisk and it is demanding, and that is why it makes the material stick.

A note on the quick-fire tables: the digest ends each card with a quick-fire review table. You do not have to narrate every row, but the drill rhythm already does the same job in audio. Where a sub-theme closes, you may run a few rapid pose-and-answer pairs as a lightning round, mirroring those tables, to seal the section.

---

THE COMPANION IS THE Q&A DIGEST

State it once, early, and lean on it throughout. The listener has the Q&A digest open. When you pose a problem, it is the digest's question. When you point to code, it is the digest's files. When you point to a map, it is the digest's component map. "Eyes on the digest, ears on me" is the deal, the same deal the narrative lecture makes with the booklet. This is why you never read code: the reader can see it; you are there to explain it.

---

STRUCTURE OF THE OUTPUT FILE

Produce one markdown file, in the `output/svelte/qa` folder, named as the digest's twin plus a `_lecture` suffix: the digest `04_state_qa.md` gets the audio drill `04_state_qa_lecture.md`. The four artifacts of a topic then share the number: `04_state.md`, `04_state_outline.md`, `04_state_qa.md`, `04_state_qa_lecture.md`. The file contains, in order:

1. A TITLE: `# NN | Title`, distinct from the narrative lecture's title, signalling the drill (for example, "The State Drill").
2. AN ORIENTATION SECTION (`## N.1`): where we are, how this drill works (pose, pause, answer), the companion deal (eyes on the digest), and the anchor (the architecture lecture, the main lecture, The National Times).
3. ONE SECTION PER SUB-THEME (`## N.2`, `## N.3`, ...): each narrating its problems in the five-beat drill rhythm.
4. A RECAP SECTION: the whole drill gathered, the through-line named, and a pointer to what comes next.

Real prose only. No code, no tables, no symbols a voice cannot read. This is an audio script.

---

VOICE: HIGH-VOLTAGE, WITH A DRILL-MASTER'S WARMTH

Same high-voltage house style as every lecture, with one added colour: the warm, brisk energy of a good drill-master who believes you can answer if you try. Pose with relish. Honour the pause. Reveal with punch. Explain with patience. Move with momentum. Keep the listener leaning in, working, never coasting.

---

FINAL VERIFICATION CHECKLIST (DO NOT SHIP UNTIL ALL PASS)

1. TTS-SAFE: not one line of raw code; not one em-dash; every symbol narrated in spoken English; nothing a machine voice would mangle.
2. FORMAT COPIED: `# NN | Title` (distinct from the narrative lecture), `## N.M` sections sharing the topic number, high-voltage voice, companion-pointing, opening orientation, closing recap.
3. CONTENT FAITHFUL: every problem in the digest gets its beat, in the digest's order and grouping; nothing invented, no problem dropped, no new API.
4. DRILL RHYTHM ON EVERY BEAT: pose the problem, invite the answer with a real named pause, reveal the verdict (Yes/No plus the resolution), explain from the ground up, land the move.
5. ANCHORED: the architecture lecture, the topic's main lecture, and The National Times running world, used as the digest uses them.
6. COMPANION DEAL: stated early and leaned on; code and maps are pointed to in the digest, never read aloud.
7. BUILDS FROM THE BASICS: the explanations voice the digest's ground-up theory, naming and translating every term; never cryptic.
8. NAMING: the file is `output/svelte/qa/NN_topic_qa_lecture.md`, twinning the digest.

If any check fails, the drill is not done. It must sound like the course, and it must make the listener work.
