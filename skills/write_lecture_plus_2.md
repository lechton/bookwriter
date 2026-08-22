# Skill: How To Teach A Text As An Oral Lecture

This skill takes one source text — a documentation chapter, a Q&A digest, an outline, a set of working notes — and produces one audio lecture: a TTS-safe, code-free spoken script that teaches the source's material to a listener who may be holding the printed source, but cannot read code while listening, cannot glance back, and gets exactly one pass.

Three commitments govern everything below. Hold them together:

**The lecture is a new lesson, not a reading.** The source supplies the material and the standard of technical accuracy; you supply the teaching. A written text is ordered for lookup; a lecture is ordered for learning — one through-line, foundations before the things that stand on them, each section raising the question the next answers. The best lecture on a text will often look structurally unlike the text. That is the job, not a deviation from it.

**The listener can follow along in the printed source.** However freely the lecture re-teaches, it must never lose the person with the booklet open. The source's own titles are the signposts the lecture calls out.

**Retention beats elegance.** This is a spoken lecture about technical material, and in technical material the names themselves are half the battle: the listener must walk away owning the terms, because the terms are how they will meet this material again, in documentation, in error messages, in conversation. A lecture optimized for flowing, varied, never-repetitive prose is optimized for the wrong medium. On the page, the reader's eye can travel back to recover a forgotten name; in the ear, the lecture must travel back for them. Redundancy — the same term, the same definition, said again at the right moments — is not a flaw in an audio lecture. It is the medium's substitute for the page. When polish and retention conflict, retention wins, every time.

---

## THE LISTENER, AND THE STANCE TOWARD THEM

The listener is an intelligent adult, probably an experienced programmer, who chose to put this lecture on — while walking, driving, cooking, or sitting with the booklet open. Intelligence is not memory: even a brilliant listener, hearing a new technical term once, in passing, while merging onto a highway, will not own that term ten minutes later. The lecture therefore assumes a sharp mind and a leaky buffer, which is the honest description of every human being listening to audio.

This sets the stance exactly. The speaker is a knowledgeable colleague thinking out loud — never a coach, a drill instructor, or a children's presenter — who repeats names and definitions generously, the way a good colleague naturally does when explaining something at a whiteboard: "the proxy — the wrapper that sees every read and write — is also why this next thing happens." That repetition is humility about the medium, and it is a courtesy.

Draw the line precisely, because it is the line the whole voice stands on: **repeating the material is respect; assessing or commanding the listener is condescension.** "Once more, because the word matters: a proxy is a wrapper that intercepts every read and write" — allowed, encouraged. "Make sure you remember this" — banned, because it commands. "By now you understand proxies" — banned, because it grades. The redundancy aims at the material, never at the listener.

---

## THE DESIGN PASS: BUILDING THE LESSON FROM THE TEXT

Before writing a sentence of script, design the lecture as its own object. Five steps, in order:

1. **Extract the concept inventory.** List every substantive idea the source teaches — mechanisms, distinctions, traps, mental models — stripped of the source's packaging, each idea tagged with the source title or entry label it lives under. The ideas are what the lecture must teach; the tags are what the lecture must announce (see the concordance).

2. **Build the term ledger.** From the inventory, pick the key technical terms of this lecture — the words the listener must own at the end. Typically five to ten: the names that appear in documentation and error messages (proxy, destructuring, instance, constructor, module), not your analogies (the watchful layer is scaffolding, not a term). For each term, write its **canonical definition**: one sentence, plain, precise, and short enough to say in one breath — "a proxy is a wrapper that stands in front of an object and intercepts every read and write of its fields." This exact sentence will be spoken several times in the lecture, near-verbatim. Fixing it now, in the design pass, is what makes the repetitions reinforce each other instead of blurring; five paraphrases of a definition are five things to half-remember, while one definition heard five times is one thing learned.

3. **Find the through-line.** The one claim of which every inventory item is an instance or consequence. It becomes the spine. Two unrelated through-lines may honestly mean two lectures, or one with a named deferral.

4. **Identify the blind spot and the missing foundations.** Mark the single hardest-to-reconstruct conceptual move in the inventory; it gets its own posed problem and the most space, however briskly the source dispatches it. Then ask what the source assumes that a listener may not securely have: a reference can presuppose, a lecture must build, and you are expected to lay groundwork the source never states, provided it serves the inventory.

5. **Choose the order by dependency and tension, not by the source's sequence.** No idea before its prerequisites; each section ends by raising the next one's question. Merge entries that are one idea in two outfits; split entries that smuggle two ideas; promote load-bearing asides; compress what is easy. The source's order is one candidate among many, usually not the best, because reference texts are ordered for lookup.

The accountability that survives this freedom: every inventory item taught or deferred by name; nothing taught that the source contradicts; no API, behavior, or claim invented. The architecture is yours; the facts are not.

---

## THE TERM SYSTEM: NAMING, ECHOING, AND HOLDING ON

This is the retention machinery, and it is as binding as TTS-safety. Every term in the ledger lives through five stages in the script, none optional.

### Stage one: the referent before the name

Build the thing first, concretely, in the running example, until the listener can picture it — the wrapper that sits in front of the object and gets to run code on every read and every write. Only then baptize it: "that wrapper has a name, and the name is worth keeping, because you will meet it in the documentation and in error messages: it is called a *proxy*."

### Stage two: the immediate echo

A name heard once does not stick; a name used three times in the next minute begins to. So in the sentences immediately after baptism, use the new term, by name, at least twice more, doing real work each time — and deliver the canonical definition from the ledger, whole: "A proxy is a wrapper that stands in front of an object and intercepts every read and write of its fields. Reading goes through the proxy; writing goes through the proxy; that is how it knows the screen must change." Notice the shape: the term repeats as the subject of working sentences, not as an empty chant. This paragraph, baptism plus echo plus canonical definition, is the introduction pattern, and every ledger term gets it.

### Stage three: the term becomes the handle

From the moment of baptism forward, **the technical term is the primary name for the concept, for the rest of the lecture.** This rule exists because its violation is the single most common retention failure: the lecture builds a lovely analogy, drops the technical term once, and then reverts to the analogy's vocabulary for the remaining half hour — so the listener finishes owning "the watchful layer" and unable to recognize "proxy" in a stack trace. The analogy does not disappear; it is demoted to an appositive reminder riding along with the term: "the proxy, that watchful layer." The term leads; the analogy follows. Likewise, resist the writer's instinct to rotate synonyms for variety — the wrapper, the layer, the membrane, the shim. In print, synonym variation is style; in audio teaching, it is vandalism against memory. One concept, one term, one wording, all hour.

### Stage four: the re-anchor at every return

Whenever a section reaches back to a term introduced earlier, it re-supplies a compressed reminder on first mention in that section — the term plus a clause-sized fragment of its canonical definition: "and here the proxy, the wrapper intercepting every read and write, runs into something it cannot see through." This costs one breath and saves the listener who half-lost the term three sections ago — which, in audio, is every listener. The reminder is briefest where the term was used a minute ago and fullest where it has been silent for several sections; calibrate, but never skip it across a section boundary. The same applies with extra force when the design merges or connects two source entries: a sentence like "questions three and ten are one idea" is empty unless the terms themselves are re-sounded in it — "question three's *destructuring*, the shorthand that copies a field out into a loose variable, and question ten's *pass-by-value*, the rule that a function receives copies of its arguments, are the same fact about copies wearing two outfits." Connections are made out of names; a connection asserted without re-sounding its names connects nothing.

### Stage five: the closing roll

The synthesis section re-runs the entire term ledger: every key term, by name, with its canonical definition compressed to its tightest form, woven into the through-line. This is the listener's last pass, the one they leave with, and it is where the verbatim discipline of stage two pays off — the closing definitions are recognizably the same sentences heard before, now landing as confirmations instead of news.

### The texture this produces — and the courage to keep it

A script obeying these five stages will read, on the page, slightly more repetitive than polished prose. That is correct, and it must survive revision. The voice that says "I already defined proxy two sections ago, repeating it is inelegant" is the voice of a writer, and this is not writing; it is teaching through a medium with no back button. Definitions may also sharpen across the lecture — an informal first cut, then the precise canonical form once the listener has the experience to hold it — but once the canonical form is spoken, it repeats as itself. Markers of honest repetition are welcome and warm: "once more, because the word is doing the work here," "the name again is proxy," "to say it the precise way one more time." These aim at the material and respect the listener's situation; they are the opposite of condescension.

---

## THE CONCORDANCE: KEEPING THE BOOKLET READER FOUND

The listener may have the printed source open. Three rules keep them found, whatever path the lecture takes:

1. **Titles carry the correspondence.** Each lecture section's heading names the lecture's own movement first, then the source material it covers: `## 4.3 The Proxy (booklet: "When state is an object or a list", Q2 and Q3)`. A section drawing on several entries lists them all; a pure-foundation section is marked `(no booklet section; groundwork)`. The mapping is total in both directions: every lecture section declares its sources, and every source title appears in some heading or in the closing's account.
2. **Entries are announced aloud at their threshold.** One factual sentence when the lecture enters an entry's territory: "In your booklet this is question six, under Reactive built-ins and the variants." Having placed the listener, teach. When something only the page can show — code, a diagram — point once: "the code sits right under that question."
3. **Departures from the source's order are flagged as they happen.** A jump: "We are taking the booklet's question eleven before nine, because sharing state makes no sense until this idea is in place; we will come back for nine." A merge: "Questions four and five are one story told twice, so we take them together" — and per the term system, the merge sentence re-sounds the terms it is merging. A booklet reader told about the jump stays oriented; one who is not is lost for the hour.

The principle: the lecture owes the booklet reader *orientation*, never *obedience*.

---

## THE VOICE: CALM, WARM, AND UNAFRAID TO REPEAT

The register is measured and precise, with the warmth of competence — and with the term system's redundancy worn openly, not smuggled in apologetically.

- **Moderate sentence rhythm,** mostly mid-length, short sentences reserved for genuine emphasis. Within that rhythm, definition sentences are deliberately simple and freestanding, so they can be heard, held, and recognized when they return.
- **Plain words, exact words.** Prefer the simple term; never flatten a concept below its real shape. Technical terms arrive by the term system's stages — referent first, then the name, then the name forever after.
- **Honesty about the material.** "This part is genuinely subtle"; "the answer is almost disappointingly small." The speaker may assess the material, never the listener.
- **First person singular; "we" only for joint derivation.** "I want to show you why this breaks"; "if we trace what happens to this variable." Never the classroom "we" that means "you."

### Banned moves — refuse each by name

1. **No commands about how to listen.** Never "pause the recording," "stop and think," "do not skip this," "listen closely." To make a listener think before a reveal, pose a genuinely good question and give it a beat of air — a named plausible wrong answer — then answer. The question does the work.
2. **No meta-commentary on the teaching method.** Never explain why the lecture is structured as it is, never announce a move before making it ("now I'll use an analogy"). Two narrow exceptions, both navigation rather than method-talk: the concordance's one-sentence placements and flags, and the term system's honest repetition markers ("the name again is proxy"). Everything else: just teach.
3. **No verdicts on the listener's state.** Never "now you understand," "you're ready," "you've earned this," "make sure you remember." To close a loop, restate the idea in its canonical form and let it land — the term system's closing roll is exactly this, done without grading anyone.
4. **No ritual phrases or audible formulas.** No recurring tag lines, no contract language, no rhythm that names or counts itself. The introduction pattern and the re-anchors recur by design, but as texture, never announced as a system.
5. **No cheerleading, no hype inflation.** If the material is surprising, say why it is surprising — that is information; "here is the magic" is a demand for a feeling.
6. **No condescension words.** Never "simply," "just," "obviously," "of course," "as you can see." Demonstrate simplicity; never assert it.
7. **No false intimacy.** No "my friend," no "trust me," no conspiratorial asides. Respect is the quality of the explanation, not a declaration.

### The open question — the engine of engagement

The lecture's way of making a listener think is the honestly posed question, never a commanded pause:

> "So here is the question the whole design turns on: when you reach into that list and flip one flag, three layers deep, does the screen move? A reasonable first guess is that it cannot — a watcher outside a box should not see a page turn inside it. That guess is wrong, and the reason it is wrong is the idea this lecture is built on."

Question, a beat of air, a plausible wrong answer named, then the reveal. Use it at every felt problem; never follow it with an instruction.

---

## TTS-SAFETY AND THE NARRATION OF CODE

The script is read by a synthetic voice. Two absolute rules, then the craft.

**Rule one: no raw code, ever.** Not a line, not a token, not a filename rendered as a filename. Code read by a machine voice is noise, and syntax only teaches through the eye — the eye's work belongs to the booklet, which is what the concordance pointers are for.

**Rule two: no em-dashes anywhere in the script.** A synthetic voice mangles them. Commas, periods, or restructure.

The craft: narrate code at the highest level that still teaches, descending only when forced.

1. **Intent first.** What the code is for, in the running example: "the button's click handler adds one to the count." Most code is described here and no lower; intent plus a booklet pointer is usually the whole job.
2. **Shape second.** The structure, when structure is the lesson: "the class has two fields and one method; the fields are marked reactive, the method is not, and that asymmetry is the point."
3. **Spelled symbols last, and only when load-bearing.** Spell a token in words only when the listener must recognize or produce that exact symbol later — an API name, a file suffix, a rune. Spell unambiguously: "the dollar sign followed by the word state"; "a file ending in dot svelte dot t s"; "Svelte Set, written as one word." Full spelling the first time; the established short handle after ("the state rune"). Spelled symbols that are ledger terms follow the term system like any other term: echoed at introduction, re-anchored at every return.

Never narrate code token by token as a substitute for explaining it; "let, space, claps, equals, state of zero" is raw code with extra steps. The pull to do it means you have not yet found the line's intent; return to level one.

---

## THE PEDAGOGY: HOW EACH CONCEPT LANDS

The design pass fixed the spine; the term system fixed the vocabulary; these rules govern each concept in its place.

1. **Problem before mechanism.** Never introduce a tool, API, or rule before the listener has felt the tension it resolves. If the source leads with the answer, invert: reconstruct the situation, let the difficulty register through an open question, then answer. A mechanism without its problem is trivia, gone by the next traffic light.
2. **One running example, carried through.** If the source has a running world, inhabit it without switching surface contexts; if not, choose one concrete example at the start and thread it through everything. Context switches tax a listener far more than a reader.
3. **One anchor analogy, fully mapped, then demoted.** If a physical analogy carries the core mechanism, choose exactly one, map every actor in it to its technical counterpart explicitly — and once the technical terms are baptized, the analogy rides behind them as the appositive reminder, never in front. An unmapped analogy is decoration; an analogy that outlives its term is a retention failure.
4. **Build strictly forward, re-anchoring as you go.** Every concept rests only on concepts already established here or named as prior knowledge in the orientation; every reach backward re-sounds the term it reaches for (stage four). An unavoidable forward reference is a named deferral — "that is the derived rune, and it has its own hour" — never a half-explanation.
5. **Definitions arrive when they can land, then never change.** Describe the thing, name it, echo it, give the canonical definition (stages one and two). If full precision needs experience the listener does not yet have, give an honest informal cut first and sharpen to the canonical form when the experience exists — but once canonical, the wording is fixed and repeats as itself.
6. **Derive the gotchas; never list them.** Every rule, trap, or best practice arrives as a consequence the listener could re-derive from the model built so far: "and now you can see why destructuring breaks this: the copy was made by plain JavaScript, outside the proxy, so the proxy never sees it." A gotcha that cannot be derived from your explanation means the explanation is incomplete; fix the explanation.
7. **Close every section with a breath of consolidation.** Two or three sentences at most: the section's terms, by name, each with the tightest fragment of its definition, and the question this section's answer has now raised for the next. This is the term system's heartbeat at the structural level — small, regular, and unannounced.
8. **Proportion follows difficulty, not the source's word count.** The blind-spot move gets the most space even if the source spends two lines on it; the easy is compressed without apology. Equal time per entry is a table of contents read aloud.

---

## STRUCTURE OF THE OUTPUT

One markdown file of pure prose — no code blocks, no tables, no symbols a voice cannot read.

1. **Title:** `# NN | Title`, NN matching the source's number if it belongs to a series; the title names the topic and is distinct from the source's own title.
2. **Orientation (first section):** brief and factual, three jobs: place the lecture in its series and name what it stands on; name the running example and the companion ("you may have the booklet open; I will say where we are in it as we go"); state in one sentence the capability the listener will have at the end. A few short paragraphs; no method-talk, no contracts.
3. **Body sections:** `## N.M Lecture Title (booklet: "Source Title", entries)` — one per movement of the design, in the design's order, headings carrying the full concordance. Substantive titles, never structural ones. Each section ends on its breath of consolidation.
4. **Closing section:** the synthesis. Four jobs: gather the material into the through-line; run the closing roll — every ledger term, by name, canonical definition at its tightest, woven into that through-line; account for the booklet, naming every entry that was merged, moved, or deferred and where it went; hand off to what comes next. No congratulations, no verdicts; the material's coherence and the now-familiar names are the send-off.

Section length breathes with the material; no uniform rhythm.

---

## FINAL CHECK BEFORE SHIPPING

1. **TTS-safe:** zero raw code, zero em-dashes, every load-bearing symbol spelled in speakable words.
2. **Code at the right altitude:** intent first, shape when structural, spelled symbols only where load-bearing; no token-by-token narration.
3. **Term system intact — check it term by term against the ledger:** every ledger term introduced referent-first, then baptized, then echoed at least twice with its canonical definition; the technical term is the primary handle from baptism onward, with no synonym rotation and no analogy outliving its term; every cross-section return carries a re-anchor reminder; every merge or connection of source entries re-sounds the terms it connects; the closing roll covers the whole ledger. **Then run the single sharpest test: pick each key term and count its appearances after baptism. A term that appears once and vanishes is the failure this entire system exists to prevent.**
4. **Voice clean:** hunt for the seven banned moves; one instance fails. Confirm the redundancy markers present aim at the material, never at the listener.
5. **Concordance total:** every heading carries its booklet titles; every booklet title surfaces in a heading or the closing's account; every entry announced once at its threshold; every reorder and merge flagged in one sentence as it happens.
6. **Design honest:** one through-line; dependency-and-tension order; the blind spot has its own posed problem and the most space; foundations laid where the source presupposed.
7. **Accountability intact:** every tagged inventory item taught or deferred by name; no source fact contradicted; nothing invented.
8. **Pedagogy:** every mechanism preceded by its felt problem; one running example; one mapped-then-demoted analogy; strictly forward with re-anchors; gotchas derived; every section closed with its consolidation breath.
9. **The listen-back test:** imagine hearing only the second half of the lecture, having forgotten every name from the first half. The re-anchors should carry you anyway. Then the read-aloud test: three paragraphs out loud, flat voice — any sentence you would not say, in that tone, to a respected colleague across the desk gets rewritten. Equal parts respect and repetition; that is the whole skill.