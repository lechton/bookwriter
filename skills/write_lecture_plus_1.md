# Skill: How To Teach A Text As An Oral Lecture

This skill takes one source text — a documentation chapter, a Q&A digest, an outline, a set of working notes — and produces one audio lecture: a TTS-safe, code-free spoken script that teaches the source's material to a listener who may be holding the printed source in their hands, but cannot read code while listening.

Hold two ideas together, because the whole skill lives in their tension:

**The lecture is a new lesson, not a reading.** The source supplies the material and the standard of technical accuracy; you supply the teaching. A written text is ordered for lookup — a reader skims, jumps, re-reads. A lecture is ordered for learning — a listener gets one pass, forward only, and so the lecture must be an argument: one through-line, foundations laid before the things that stand on them, each section creating the question the next one answers. The best lecture on a text will often look structurally unlike the text, will dwell where the text is brisk, will lay groundwork the text silently assumes, and may walk the material in a different order entirely. That is not infidelity. That is what a lecturer is for.

**The listener can hold the printed source while listening.** This is the one hard tether. However freely the lecture re-teaches the material, it must never lose the person following along in the booklet. The mechanism for this is the source's own titles: the lecture keeps the original's section titles and entry labels alive — naming them aloud at the moments it enters their territory — so that at any point the listener can look down at the page and know exactly where they are. The lecture designs its own journey; the source's titles are the signposts it calls out along the way.

Everything below serves one or the other of these two ideas, or the voice that carries them.

---

## THE LISTENER, AND THE STANCE TOWARD THEM

Fix the picture of the listener before writing a word, because every tonal failure in lectures of this kind comes from picturing the listener wrongly.

The listener is an intelligent adult, probably an experienced programmer, who chose to put this lecture on. They may be walking, driving, cooking, or sitting with the printed source open on the desk. They do not need to be motivated, congratulated, supervised, or instructed in how to listen. They need the material explained well, in an order that builds, by someone who respects their time and their mind.

The speaker, accordingly, is a knowledgeable colleague thinking out loud — closer to a good university lecturer or a thoughtful podcast host than to a coach, a drill instructor, or a presenter of children's television. The speaker's authority comes entirely from the clarity of the explanation. It never comes from energy, exhortation, or commands.

---

## THE DESIGN PASS: BUILDING THE LESSON FROM THE TEXT

Before writing a sentence of script, design the lecture as its own object. Four steps, in order:

1. **Extract the concept inventory.** List every substantive idea the source teaches — mechanisms, distinctions, traps, mental models — stripped of the source's packaging, but with each idea tagged with the source title or entry label it lives under. This tagged inventory is the lecture's double ledger: the ideas are what the lecture is accountable for teaching; the tags are what the lecture is accountable for announcing.

2. **Find the through-line.** Ask: what is the one claim of which every item in the inventory is an instance or a consequence? ("State is just a variable, because the compiler does the wiring ahead of time" is such a claim; an entire fifteen-entry digest can be corollaries of it.) The through-line becomes the lecture's spine. If the inventory genuinely contains two unrelated through-lines, the honest answer may be two lectures, or one lecture with an explicit, named deferral.

3. **Identify the blind spot and the missing foundations.** Mark the single conceptual move in the inventory that is hardest to reconstruct from scratch — the invisible side channel, the compile-time-versus-runtime split, the identity-versus-copy distinction, the inversion of control. That move gets its own posed problem and the most space in the lecture, regardless of how briskly the source dispatches it. Then ask what the source assumes that a listener may not securely have. A reference text can presuppose; a lecture must build. You are expected to lay foundations the source never states — plain-JavaScript groundwork, a prior concept's recap, the everyday situation that makes a mechanism necessary — provided the foundations serve the inventory and not your own enthusiasm.

4. **Choose the order by dependency and tension, not by the source's sequence.** Arrange the concepts so that no idea arrives before its prerequisites, and so that each section ends by raising the question the next section answers. Merge source entries that are one idea wearing two outfits; split an entry that smuggles in two ideas; promote a buried aside to a full section if the dependency graph says it is load-bearing; demote or compress what is easy. The source's order is one candidate design among many, and often not the best, because reference texts are ordered for lookup, not for learning.

The accountability that survives all this freedom is narrow and absolute: every item in the concept inventory is either taught or deferred by name; nothing is taught that the source contradicts; no API, behavior, or claim is invented beyond what the source supports. The architecture is yours. The facts are not.

---

## THE CONCORDANCE: KEEPING THE BOOKLET READER FOUND

The listener may have the printed source open. The lecture must let them follow it, whatever path the lecture itself takes. Three rules accomplish this:

1. **Titles carry the correspondence.** Each lecture section's heading names both the lecture's own movement and the source material it covers, in this shape: the lecture's title first, then the source's title in parentheses. For example: `## 4.3 The Watchful Layer (booklet: "When state is an object or a list", Q2 and Q3)`. If a lecture section draws on several source entries, list them all. If it is pure foundation with no source counterpart, mark it so: `(no booklet section; groundwork)`. The mapping must be total in both directions: every lecture section declares its sources, and every source title appears in at least one lecture heading or in the closing section's deferrals.

2. **Entries are announced aloud at their threshold.** When the spoken text enters a source entry's territory, it says so, plainly and once: "In your booklet, this is question six, under the title Reactive built-ins and the variants." This is a single factual sentence at the threshold, not a recurring ritual; having placed the listener, the lecture moves on and teaches. When the listener should look at something only the page can show — code, a diagram, a table — the lecture points once: "the code for this sits right under that question."

3. **Departures from the source's order are flagged at the moment they happen.** If the lecture takes question eleven before question nine, it says so in one sentence and gives the reason in passing: "We are jumping ahead to the booklet's question eleven here, because sharing state across files makes no sense until this idea is in place. We will come back for nine." A booklet reader who is told about the jump stays oriented; one who isn't is lost for the rest of the hour. Merges get the same single sentence: "Questions four and five are one story told twice in the booklet, so we take them together."

The principle behind all three: the lecture owes the booklet reader *orientation*, never *obedience*. Announce where you are, announce when you jump, and otherwise teach the lesson the design pass produced.

---

## THE VOICE: CALM AUTHORITY

The register is measured, precise, and warm in the way that competence is warm.

- **Moderate sentence rhythm.** Mostly mid-length sentences, with short ones reserved for genuine emphasis. A script that is all short punchy sentences sounds like advertising.
- **Plain words, exact words.** Prefer the simple term, but never flatten a concept below its real shape. Where precision needs a technical term, use it — after the idea it names already exists in the listener's head, never before.
- **Honesty about the material.** It is good to say "this part is genuinely subtle" or "the answer is almost disappointingly simple." That is the speaker assessing the material, which is allowed. Assessing the listener is not — see the banned moves.
- **First person singular; "we" only for joint derivation.** "I want to show you why this breaks" is fine; "if we trace what happens to this variable" is fine. The royal-classroom "we" that means "you" ("now we're going to think hard, aren't we") is not.

### Banned moves — refuse each one by name

These seven moves are what make a lecture feel patronising. One instance of any of them fails the script.

1. **No commands about how to listen.** Never "pause the recording," "stop and think," "do not skip this," "listen closely," "stay with me." The listener manages their own attention. If you want them to think before a reveal, ask a genuinely good question and give it a beat of air — a sentence of context, a named plausible wrong answer — before answering. The question does the work; the imperative is noise.
2. **No meta-commentary on the teaching.** Never explain the lecture's own method ("this act of recall is what makes learning stick"). Never announce a move before making it ("now I'll use an analogy," "here comes the important part"). Just teach; the structure should be felt, not narrated. The one exception is the concordance: a single factual sentence placing the listener in the booklet, or flagging a jump, is navigation, not meta-commentary.
3. **No verdicts on the listener's state.** Never "now you understand," "you're ready," "you've earned this," "you worked for that." The speaker cannot know the listener's state, and claiming to is what makes a script feel performed *at* someone. To close a loop, restate the idea in its final compact form and let it land.
4. **No ritual phrases or audible formulas.** No recurring tag lines, no contract language ("that is the deal"), no rhythm that is announced, counted, or pointed at. A recurring structure may exist; it must never be heard naming itself.
5. **No cheerleading, no hype inflation.** Strike "here is the magic," "this is where it gets exciting" — unless the material genuinely is surprising, in which case say *why* it is surprising, which is information, rather than *that* it is exciting, which is a demand for a feeling.
6. **No condescension words.** Never "simply," "just," "obviously," "of course," "as you can see." If something is simple, demonstrate the simplicity; the words only tell a struggling listener that the struggle is their fault.
7. **No false intimacy.** No "my friend," no "trust me," no conspiratorial asides. Respect is shown through the quality of the explanation, not declared.

### The open question — the engine of engagement

The lecture's way of making a listener think is the honestly posed question, never the commanded pause:

> "So here is the question the whole design turns on: when you reach into that list and flip one flag, three layers deep, does the screen move? A reasonable first guess is that it cannot — a watcher on the outside of a box should not see inside it. That guess is wrong, and the reason it is wrong is the most interesting thing in this section."

That shape — the question, a beat of air, a plausible wrong answer named, then the reveal — invites thinking without ordering it, and raises the stakes of the answer. Use it at every felt problem. Never follow it with an instruction.

---

## TTS-SAFETY AND THE NARRATION OF CODE

This script is read by a synthetic voice. Two absolute rules, then the craft.

**Rule one: no raw code, ever.** Not a line, not a token, not a filename rendered as a filename. Code read by a machine voice is noise — and worse, it teaches nothing, because syntax only teaches through the eye. The eye's work belongs to the booklet; pointing there is what the concordance is for.

**Rule two: no em-dashes anywhere in the script.** A synthetic voice mangles them. Use commas, periods, or restructure the sentence.

Now the craft, because narrating code badly produces the opposite failure: a script that spells out every token is as unlistenable as one that reads code raw. Narrate code at the highest level that still teaches, descending only when forced:

1. **Intent first.** What the code is for, in the world of the running example: "the button's click handler adds one to the count." Most code in a lecture is described at this level and no lower; intent plus a pointer to the booklet is usually the whole job.
2. **Shape second.** The structure, when the structure is the lesson: "the class has two fields and one method; both fields are marked reactive, the method is not, and that asymmetry is the point." Describe shape when the listener must *recognize* the pattern, not retype it.
3. **Spelled symbols last, and only when load-bearing.** Spell a token in words only when the listener must recognize or produce that exact symbol later: an API name, a file suffix, a rune. Then spell it unambiguously — "the dollar sign followed by the word state"; "a file ending in dot svelte dot t s"; "Svelte Set, written as one word" — in full the first time, and shortened thereafter ("the state rune") once the spelling is established.

What you must never do is narrate code token by token as a substitute for explaining it. "Let, space, claps, equals, state of zero" is raw code with extra steps. If you feel the pull to do this, you have not yet understood what the line is for; return to level one.

---

## THE PEDAGOGY: HOW EACH CONCEPT LANDS

The design pass fixed the spine and the order; these rules govern the teaching of each concept in its place. They are stricter than a written text's rules, because the listener cannot glance back.

1. **Problem before mechanism.** Never introduce a tool, API, or rule before the listener has felt the tension it resolves. If the source opens an entry with the answer, invert it: reconstruct the situation in which the answer is needed, let the difficulty register through an open question, then give the answer. A mechanism without its problem is trivia, and trivia is gone by the next traffic light.
2. **One running example, carried through.** If the source has a running world — a newsroom, a feed, a shop — inhabit it fully and do not switch surface contexts between sections. If the source lacks one, choose a single concrete example at the start and thread it through everything. Each context switch taxes a listener far more than a reader.
3. **One anchor analogy, fully mapped.** If an everyday, physical analogy carries the core mechanism, choose exactly one, map every actor in it to its technical counterpart explicitly, and reuse its vocabulary for the rest of the lecture. An unmapped analogy is decoration; three competing analogies are a tax.
4. **Build strictly forward.** Every concept rests only on concepts already established in this lecture or named as prior knowledge in the orientation. An unavoidable forward reference is named as a deferral — "that is the derived rune, and it has its own hour" — and left alone; never half-explain a future topic.
5. **Name terms after their referent exists.** Describe the thing, let it sit, then attach the word: "Svelte wraps the object in a watchful layer that notices every read and write. That layer is called a proxy." Name-first ordering forces the listener to carry an empty label in working memory, which audio cannot afford.
6. **Derive the gotchas; never list them.** Every rule, trap, or best practice is presented as a consequence the listener could re-derive from the model the lecture built: "and now you can see why destructuring breaks this: the copy was made by plain JavaScript, outside the proxy, so the proxy has nothing to do with it." A gotcha that cannot be derived from your explanation means the explanation is incomplete; fix the explanation, do not append the rule.
7. **Proportion follows difficulty, not the source's word count.** The blind-spot move gets the most space even if the source dispatches it in two lines; easy material is compressed without apology. A lecture that gives every source entry equal time is a table of contents read aloud.

---

## STRUCTURE OF THE OUTPUT

One markdown file of pure prose — no code blocks, no tables, no symbols a voice cannot read.

1. **Title:** `# NN | Title`, where NN matches the source's number if the source belongs to a numbered series. The title names the topic and is distinct from the source's own title, so the two artifacts are never confused.
2. **Orientation (first section):** brief and factual, three jobs only: place the lecture in its series and name what it stands on; name the running example and the companion ("you may have the booklet open; I will tell you where we are in it as we go"); state in one sentence what the listener will be able to do by the end, phrased as a capability. Then begin. The orientation does not explain the lecture's method, establishes no contracts, and runs a few short paragraphs at most.
3. **Body sections:** `## N.M Lecture Title (booklet: "Source Title", entries)` — one section per movement of the design, in the design's order, each heading carrying its concordance as specified above. Substantive titles ("The Watchful Layer"), never structural ones ("Part Three").
4. **Closing section:** a synthesis, not a pep talk. Three jobs: gather the material into its through-line, the single claim every section was an instance of; account for the booklet — any source entries that were folded into other sections or deferred are named here, with where they went; hand off to what comes next. No congratulations, no verdicts on the listener. The material's coherence is the send-off.

Section length breathes with the material; no uniform rhythm is imposed.

---

## FINAL CHECK BEFORE SHIPPING

1. **TTS-safe:** zero raw code, zero em-dashes, every load-bearing symbol spelled in speakable words, nothing a synthetic voice would mangle.
2. **Code at the right altitude:** intent first, shape when structural, spelled symbols only where load-bearing; no token-by-token narration anywhere.
3. **Voice clean:** hunt the script for the seven banned moves — listening commands, method meta-commentary, listener verdicts, ritual phrases, hype, condescension words, false intimacy. One instance fails the check.
4. **Concordance total:** every lecture heading carries its booklet titles; every booklet title appears in some heading or in the closing's account; every entry is announced once aloud at its threshold; every reorder and merge is flagged in one sentence at the moment it happens.
5. **Design honest:** one through-line; order chosen by dependency and tension; the blind-spot move has its own posed problem and the most space; foundations laid where the source presupposed.
6. **Accountability intact:** every item of the tagged concept inventory taught or deferred by name; no source fact contradicted; no API or behavior invented.
7. **Pedagogy:** every mechanism preceded by its felt problem; one running example and one mapped analogy, unswitched; strictly forward-building; terms named after their referents; every gotcha derived in-line.
8. **The read-aloud test:** read three paragraphs out loud in a flat voice. If any sentence would embarrass you to say to a respected colleague across the desk, rewrite it. That test — would I say this, in this tone, to an equal — is the whole skill in one line.