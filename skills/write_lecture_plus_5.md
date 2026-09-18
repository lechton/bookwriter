# Skill: Teaching a Source Text as an Oral Lecture

This skill takes one source text — a documentation chapter, a Q&A companion, an outline, working notes — and produces one audio lecture: a TTS-safe, code-free spoken script that teaches the source's material to a listener who gets exactly one pass, cannot see code, cannot glance back, and may be holding the printed source as a companion.

The script is a new lesson, not a reading. The source supplies the material and the standard of accuracy; the lecture supplies the teaching — the order, the foundations, the through-line. The best lecture on a text will often look structurally unlike the text. That is the job.

One guard before anything else: **this document supplies method only, never content.** No word, image, or example in this skill is vocabulary for any lecture. Every term a lecture uses comes from one place — the standard terminology of the field the material belongs to.

---

## THE LISTENER

An intelligent adult, often an experienced programmer, listening while walking, driving, or cooking. Intelligence is not memory: assume **a sharp mind and a leaky buffer** — the honest description of every human listening to audio.

The leaky buffer holds everything equally poorly: it loses technical terms, and it loses, just as fast, the entities and data of the example world. A listener who half-remembers what a key term means is exactly as stranded as one who half-remembers what the example's objects are or what data they hold. Every system in this skill exists to compensate for the leaky buffer, and they compensate **symmetrically**: whatever care the lecture gives a term, it gives an entity.

The speaker is a knowledgeable colleague thinking out loud — never a coach, a drill instructor, or a presenter for children. The line the whole voice stands on: **repeating the material is respect; assessing or commanding the listener is condescension.**

---

## THE DOCTRINE — five commitments

**1. The vocabulary is the deliverable.** The lecture exists to make the listener fluent in the field's own precise terms — the idiosyncratic, exact words they will meet next week in documentation, in specifications, in error messages, in stack traces. Technical language is never escaped, never evaded, never softened into a private dialect of cute images. It is *explained* — in plain, everyday words — and then *used*, confidently and constantly, until the strange word has become a familiar tool in the listener's hands. A listener who leaves owning the real words owns a key to every future text on the subject. A listener who leaves fluent in the lecture's pet metaphors owns a key to nothing.

**2. Every rule rides on a mechanism.** No behavior is ever delivered as a free-standing fact to accept. Every behavior the source describes is the surface of an underlying mechanism — usually one layer down, in the host language, the runtime, the compiler, the platform — and the lecture builds that mechanism explicitly, under its proper names, so that the source's rules arrive as consequences. A listener who got the mechanism can predict cases nobody mentioned; a listener who got only the rule cannot.

**3. World, then problem, then mechanism, then rule.** This is the full ordering of every concept, and no step may be skipped. A problem can only be *felt* about data the listener can picture; a mechanism can only *resolve* a problem that was felt; a rule can only be *derived* from a mechanism that was built. Posing a problem about entities never established produces cipher, not tension. If the source leads with the rule, invert the whole chain.

**4. Retention beats elegance.** Audio has no back button; deliberate redundancy is the medium's substitute for the page. Key terms, their definitions, and the example world's entities are repeated by system, on schedule, near-verbatim. When polish and retention conflict, retention wins — every time.

**5. The listener following the code is owed orientation, never obedience.** The listener may have the code snippet open in front of them. The lecture's path may differ from the source's entirely, but the source's own titles are called out as signposts so the listener is never lost.

---

## THE THREE LAYERS

Every lecture is built of three layers, and each layer has its own system in this skill:

- **The world** — the running example: its entities, the data they hold, the actors who use them, the events that befall them. *(The World System.)*
- **The terms** — the field's standard vocabulary, installed for keeps. *(The Term System.)*
- **The mechanisms** — the foundations beneath the source's rules, taught whole. *(The Mechanism System.)*

A section fails if any layer is missing. A mechanism without its world is unfollowable; a world without its terms teaches nothing portable; terms without mechanisms are a glossary. The final check audits all three.

---

## THE DESIGN PASS — before writing a sentence

Seven artifacts, in order:

**1. Concept inventory.** Every substantive idea the source teaches, stripped of the source's packaging, each tagged with the source title or entry label it lives under.

**2. Foundations map.** For each inventory item, the question the source never asks: *what underlying mechanism makes this true?* The answer usually lives one layer down. List the mechanisms; for each, collect its standard vocabulary — the established terms found in official documentation and specifications. Expect several inventory items to turn out to be corollaries of one mechanism; that discovery reshapes the design, making the mechanism a section's foundation and the source's entries its consequences.

**3. Example bible.** The running example's world, written down before scripting. Inhabit the source's world if it has one; if not, choose one world at the start and build the bible anyway. The bible lists: every entity the lecture will use; each entity's properties — the three or four that matter; the relationships between entities; the actors who operate on them; and the planned **point of first introduction** for each entity. Two laws follow from the bible: no entity appears in the script that is not in the bible, and no entity carries a problem before its introduction point.

**4. Term ledger.** The five to twelve terms the listener must own at the end, drawn from both layers — the framework's terms and the foundations' terms. **Admission criterion: only a standard term of the field enters** — a word the listener will encounter again in documentation, specifications, or error messages. Invented words, metaphor words, and this-lecture-only coinages are inadmissible; teaching them displaces the real vocabulary the lecture exists to install. For each admitted term, fix its **canonical definition**: one sentence, plain everyday words, precise, speakable in one breath. That exact sentence will be spoken several times, near-verbatim; fixing it now is what makes the repetitions reinforce instead of blur.

**5. Through-line.** The one claim of which every inventory item is an instance or consequence. It becomes the spine. Two genuinely unrelated through-lines mean two lectures, or one with a named deferral.

**6. Blind spot.** The single hardest-to-reconstruct conceptual move in the material — very often a foundation mechanism, not a framework feature. It gets its own posed problem and the most space, however briskly the source dispatches it.

**7. Order.** By dependency and tension: every mechanism before its dependents, every entity introduced before its first problem, each section closing by raising the next one's question. Merge entries that share one mechanism; split entries that smuggle two ideas; promote load-bearing asides. Build strictly forward: forward references are named deferrals, never half-explanations. The source's order is one candidate among many, usually not the best, because reference texts are ordered for lookup.

Accountability surviving this freedom: every inventory item and every mapped mechanism taught or deferred by name; nothing taught that the source contradicts; no API or behavior invented. The architecture is yours; the facts are not.

---

## THE WORLD SYSTEM — the running example as a built place

The running example is not decoration. It is the floor every problem stands on, and it is built deliberately, by these five rules, before anything is asked to stand on it.

### Rule one: introduce before use

An entity — an object type, a data structure, a piece of the application, an actor — is introduced before it carries any problem or mechanism. An introduction is a few short sentences of plain narrative: name the entity; say what it is for in this world; list its few properties, each in its own sentence; place it among its neighbors if it has any. An introduction is content. It is never filler, and it is never skipped to save time.

### Rule two: data shapes are narrated one fact per sentence

When a structure matters to the point being made, it is described as a sequence of freestanding short sentences — the entity named first, then each property in its own sentence, then any nesting in its own sentence, innermost last. Never as a chain of appositives packed into one long sentence. The ear can stack five short sentences; it cannot unpack one nested clause. If the structure does not matter to the point, it is not described at all.

### Rule three: problems are stories, never instructions

A felt problem is told as a small narrative about the world's actors: someone does something, to some named and already-introduced data, expecting one outcome and observing another. The listener *watches* the problem happen. The lecture never issues imperatives asking the listener to mentally perform code operations — to construct a structure in their head, reach inside it, modify it. A command to manipulate invisible code is unfollowable by ear; it is raw code with the syntax removed, and it falls under the same ban.

### Rule four: entities re-anchor exactly like terms

When an entity returns after an absence of a section or more, its first mention in the new section carries a clause-sized reminder of what it is and what it holds — precisely the treatment the Term System gives a returning term. A connection drawn between two entities is made of their names plus their reminders; a connection asserted without them connects nothing.

### Rule five: scene-setting is never throat-clearing

Throat-clearing — banned throughout this skill — means *meta-narration*: recaps of the journey so far, announcements of the lecture's structure, windups about how important the coming topic is. It does **not** mean the introduction of new world material. A section whose problem needs four sentences of scene takes the four sentences, and they count as teaching, not as delay. The two must never be conflated: cutting scene to satisfy the throat-clearing ban is the single most damaging mistake a draft of this kind can make.

### The cold-open standard

Every section's opening passage, heard in isolation by someone who just tuned in, must let that listener answer five questions: **who** is acting; on **what data**; what **shape** that data has; what they **did**; and what **happened** against expectation. Any missing answer goes in — as scene, before the problem. This standard, not a sentence count, governs how a section opens.

---

## THE TERM SYSTEM — installing the real vocabulary

This is the retention machinery for the lecture's flagship commitment. Every ledger term — foundation terms fully included — lives through six stages, none optional.

### Stage one: the referent before the name

Build the thing concretely, in the running world, until the listener can picture what actually happens — what is stored where, what gets copied, what runs when. Only then baptize. Name-last, never name-first: a name given before its referent exists is noise.

### Stage two: baptism with full honors

Give the name. Say plainly that this word is worth keeping, and say **where the listener will meet it again** — in which documentation, in what kind of error message, in a stack trace — so the term has a hook into their future. Deliver the canonical definition whole: the plain one-breath sentence fixed in the ledger.

Then, where it pays, **mine the word itself.** Many technical terms are ordinary words put to precise work, and unpacking the term's own literal sense — what the word means in everyday language, why the field chose this word for this thing — welds the definition to the name. This is the opposite of inventing an image: it spends its effort making the *real* word transparent, and it is vocabulary teaching of the best kind. If full precision needs experience the listener does not yet have, give an honest informal cut and sharpen it to canonical the moment the experience exists — then the wording is fixed and repeats as itself.

### Stage three: the immediate echo

A name heard once does not survive ten minutes; worked three times in a minute, it begins to. In the sentences after baptism, use the term at least twice more, doing real work in real claims, and let the canonical definition sound once more in full. Baptism, echo, canonical definition: the introduction pattern, for every ledger term.

### Stage four: the term is the only handle

From baptism forward, one concept, one term, one wording, all hour. Two displacements are banned by name. **Synonym rotation** — cycling through near-equivalents for variety — is style in print and vandalism against memory in audio. **Metaphor capture** — an introductory image quietly becoming the working vocabulary — is the deeper failure: a coined image repeated all hour becomes the thing the listener actually learns, displacing the real term, and it compounds, each invented word leaning on the others until the explanation is conducted entirely inside a fiction no documentation speaks.

A simile is permitted as seasoning: at most one, one sentence long, at a term's introduction, to give the definition a first foothold — and then it is retired forever. It never recurs as a name, never joins a re-anchor, never appears in the closing roll. What rides along with the term thereafter is never the image but a fragment of the canonical definition. The lecture's conceptual load is carried by plain language and standard terms, beginning to end.

### Stage five: the re-anchor at every return

Whenever a section reaches back to an earlier term, re-supply it on first mention there: the term plus a clause-sized fragment of its canonical definition. One breath. Briefest where the term was used a minute ago, fullest after a long silence, never skipped across a section boundary. With extra force at merges and connections: a sentence joining two ideas is empty unless the terms themselves are re-sounded inside it, each with its reminder clause.

### Stage six: the closing roll

The synthesis re-runs the entire ledger: every term, by name, canonical definition at its tightest, woven into the through-line — recognizably the same sentences heard before, landing now as confirmations.

### The texture, and the courage to keep it

A script obeying these stages reads slightly more repetitive than polished prose, and that must survive revision. The voice saying "I defined this already, repeating is inelegant" is a writer's voice; this is teaching through a medium with no back button. Honest repetition markers — naming the term again, saying the precise sentence once more because the word is doing the work — are welcome. They aim at the material; they are the opposite of condescension.

---

## THE MECHANISM SYSTEM — foundations taught whole

### Behavior is always a corollary

Every behavioral claim arrives in a sentence whose hinge is *because* — the behavior on one side, an already-built mechanism on the other. If the because-sentence cannot be written, the mechanism has not been built yet, and the fix is to build it, never to assert the rule and move on. A behavioral claim with no mechanism beneath it is an orphan, and the final check hunts orphans.

### Mechanisms are taught whole, as direct contrasts

The deepest failure a technical lecture can have is the half-model: teaching only the one case the source's question happens to need. A mechanism is not a single fact; it is a small, complete set of behaviors that differ along an axis or two — the operation that shares versus the operation that copies, the case where the rule applies versus the case where it does not, the path that succeeds beside the path that fails. The lecture identifies those axes and teaches by **direct contrast**: both sides spoken, side by side, on the running world's own data, with the difference named in one sentence. One side equips the listener to parrot the source's answer; the contrast equips them to answer questions nobody asked.

### The schema of a foundation section

Name the mechanism. Introduce its standard terms by the Term System, each with its plain canonical definition. State the governing principle in one sentence if the mechanism has one. Walk every materially different case as contrasts, concretely, in the running world. Only then derive the source's entries from it, each as a because-corollary. A foundation taught to this schema makes the framework material land as consequences rather than facts.

### Merges have one lawful shape

When the design merges source entries, the merged section runs: the shared mechanism first, taught whole with its contrasts; then each entry derived from it as a case, in turn, by name; then the unifying sentence, re-sounding all the terms. Interleaving two entries before their common mechanism exists does not combine them; it confuses them.

### The predictive test

Before a section ships, pose two or three adjacent questions it never explicitly answers — cases one step sideways from the source's entries, neighboring cells of the mechanism's behavior set. If the section as written gives the listener everything needed to answer them, the mechanism was taught whole. If not, the section is incomplete — factually, not stylistically — and the missing side goes in. This test, not the source's word count and not the script's smoothness, is the measure of completeness.

### Depth has a floor, not a ceiling

Descend as far as the because-chain requires and no further: every mechanism taught must carry at least one inventory item on its back; the lecture does not tour foundations for their own sake. Within that limit, do not fear length. A lecture that runs long because its mechanisms are whole and its world is built is doing its job; one that runs short because it asserted rules over an unbuilt world has failed at the only thing it is for. Proportion follows mechanism and blind spot, never the source's word count: what may be compressed is decoration; what may never be compressed is mechanism or scene.

### Gotchas are derived, never listed

Every trap and best practice arrives as a consequence the listener could re-derive from the mechanism. An underivable gotcha means the mechanism beneath it is missing; build the mechanism.

---

## THE VOICE

Measured, precise, warm in the way competence is warm — and economical with everything **except mechanism, names, and scene.** Those three are never economized.

### Sentence mechanics

In three kinds of passage — entity introductions, scenario openings, and definitions — the rules are mechanical: one new fact per sentence; subject and verb early; at most one subordinate clause. Long, flowing sentences are earned, not default: they are permitted only where every element in them is already established ground. Definition sentences are deliberately simple and freestanding, so they can be held, and recognized when they return.

### The Demystifying Guide Standard

1. **The Demystifying Recap:** At the start of a new chapter or major conceptual leap, open with a plain-English recap of the previous achievement. Do not rely on short-term memory across major boundaries. Re-define the core term immediately.
2. **Ban Abstract Jargon:** Ban sweeping architectural nouns like "engine", "pipeline", or "system". Describe mechanics strictly by what the code physically does.
3. **Keystroke Stakes:** When explaining the limitation of a previous step, frame it through the physical experience of typing the code. Anchor the stakes in keystrokes, readability, and unnaturalness, never in abstract API theory.

### The open question — the engine of engagement

The lecture's way of making a listener think is the honestly posed question, never a commanded pause. State the question concretely in the running world; give it a beat of air; name the plausible wrong answer — ideally the prediction of the incomplete model the listener probably holds, so the reveal completes a model rather than just correcting a guess — and then answer. Use it at every felt problem; never follow it with an instruction.

### Banned moves — refuse each by name

1. **No commands about how to listen.** Never tell the listener to pause, stop and think, or pay attention — and never command them to mentally execute code, per the World System.
2. **No meta-commentary on the teaching method.** Never explain the lecture's structure or announce a move before making it. Two navigation exceptions only: the Concordance's one-sentence placements and flags, and the Term System's honest repetition markers.
3. **No verdicts on the listener's state.** Never declare them ready, understanding, or obliged to remember. Close loops by restating the canonical form and letting it land.
4. **No ritual phrases or audible formulas.** Recurring patterns exist by design but never name or count themselves.
5. **No cheerleading.** If something is surprising, say why — that is information; declaring it magical is a demand for a feeling.
6. **No condescension words.** Never "simply," "just," "obviously," "of course," "as you can see." Demonstrate simplicity; never assert it.
7. **No false intimacy.** No endearments, no appeals to trust, no conspiratorial asides.
8. **No reply to the commissioner.** The script is a standalone lesson addressed to the listener, never an answer to whoever requested it. A prompt, a list of questions, working notes may set the agenda, but they are scaffolding, not a party the script talks back to — never "you asked," "the question you raised," "your instinct was right," "as you wanted," "the comparison you reached for," never thanks to the requester or narration of the lecture's own commissioning. The requester's questions are folded into the material as its own questions, posed in the third person or as a section's open question. The instructional "you" of the listener and the "I" of the speaker remain; what is banned is the second person that points back at the person who ordered the lecture.

First person singular; "we" only for joint derivation, never the classroom "we" that means "you." Honesty about the material is welcome — the speaker may call a part genuinely subtle, or an answer surprisingly small. Assess the material, never the listener.

---

## TTS-SAFETY AND THE NARRATION OF CODE

The script is read by a synthetic voice. Two absolute rules, then the craft.

**Rule one: no raw code, ever.** Not a line, not a token, not a filename rendered as a filename. Syntax teaches only through the eye, and the eye's work belongs to the code the student has in front of them — which is what the Concordance pointers are for.

**Rule two: no em-dashes anywhere in the script.** A synthetic voice mangles them. Commas, periods, or restructure.

The craft — narrate code at the highest level that still teaches:

1. **Intent first.** What the code is for, in the running world. Most code lives here; intent plus a pointer to the code snippet is usually the whole job.
2. **Shape second.** When the structure is the lesson, narrate it by the World System's one-fact-per-sentence rule — what parts exist, which are marked, what the asymmetry means.
3. **Spelled symbols last, only when load-bearing.** Spell a token in words only when the listener must recognize or produce it later — an API name, a file suffix, an operator. Spell it unambiguously in speakable words, in full the first time, by its established short handle after. Spelled symbols that are ledger terms follow the Term System like any other term.

Never narrate token by token; a line read out punctuation mark by punctuation mark is raw code with extra steps. The pull to do it means the line's intent has not been found; return to level one.

---

## THE CONCORDANCE — keeping the listener found

1. **Titles carry the correspondence.** Each lecture heading names the lecture's own movement, then in parentheses the source's section title and entry labels. A section drawing on several entries lists them all; a pure-foundations or world-building section is marked as groundwork with no corresponding code snippet. The mapping is total both ways: every lecture section declares its sources; every source title appears in some heading or in the closing's account.
2. **Entries are announced aloud at their threshold.** One factual sentence on entering an entry's territory, naming the entry and its code snippet title. Then teach. When only the page can show something — code, a diagram — point once to where it sits in the code they have in front of them.
3. **Departures are flagged as they happen.** A jump gets one sentence with its reason in passing, and a promise to return if the lecture will. A merge gets the one sentence that re-sounds the terms it merges, per the Term System.

---

## STRUCTURE OF THE OUTPUT

One markdown file of pure prose — no code blocks

2. **Orientation:** lean and factual, under a minute of speech. Three jobs, one or two sentences each: what this lecture stands on; the companion code snippets and the promise to say which snippet the lecture is referencing at each step; the capability the listener will have at the end. Orientation is *not* where the world is built: if the example world needs founding — the application, its core entities, its actors — that founding is a real opening section, marked as groundwork, given the full World System treatment. Then the first concrete problem.

3. **Body sections:** `## Lecture Title (source: "Source Title", entries)` — one per movement, in the design's order; substantive titles, never structural ones. Groundwork sections marked as such.

4. **Closing:** the synthesis. Four jobs: gather the material into the through-line; run the closing roll — the whole term ledger, canonical definitions at their tightest, woven into that through-line; account for the code snippets, naming every entry merged, moved, or deferred and where it went; hand off to what comes next. No congratulations, no verdicts. The coherence and the now-familiar names are the send-off.

Section length breathes with the material. Whole mechanisms and a built world run long, and that is correct.

---

## FINAL CHECK — eight gates before shipping

**1. TTS gate.** Zero raw code, zero em-dashes, every load-bearing symbol spelled in speakable words.

**2. World gate.** Run the cold-open test on every section opening: heard in isolation, does it answer who is acting, on what data, what shape, what action, what outcome? Every entity in the example bible, introduced before first use, re-anchored on every return after absence. No imperatives commanding the listener to execute code mentally. Every data shape that matters narrated one fact per sentence.

**3. Vocabulary gate.** List every recurring content word in the script. Each must be either plain everyday language or a standard term of the field. Any invented or metaphor word that recurs as a handle, appears in a re-anchor, or shows up in the closing roll is a failure of the first order: strip it, and re-conduct those passages in the standard term with its plain definition. Similes appear at most once each, at introductions, and never again.

**4. Mechanism gate.** Hunt orphans: every behavioral claim traceable to a built mechanism through a because-sentence. Every mechanism taught whole, its materially different cases spoken as direct contrasts, no contrast with one side cut. Every merged section shaped as mechanism-then-cases, never interleaved. Then the predictive test, section by section: pose two or three adjacent questions the section never asks; if the script does not equip the listener to answer them, the missing side goes in before anything ships.

**5. Term gate.** Audit term by term against the ledger: every term a standard term of the field; referent-first introduction, baptism with the canonical definition and the where-you-will-meet-it hook, double echo; the term as sole recurring handle, no synonym rotation, no metaphor capture; re-anchors at every cross-section return; merges re-sounding their terms; the closing roll complete. Then the count: each term's appearances after baptism — a term that appears once and vanishes is the failure the system exists to prevent.

**6. Voice gate.** Hunt the eight banned moves; one instance fails. Check sentence mechanics in every entity introduction, scenario opening, and definition: one fact per sentence, subject early, at most one subordinate clause. Repetition markers aim at the material, never the listener. Throat-clearing — meta-narration only — absent; scene-setting untouched by its removal.

**7. Concordance gate.** Every heading carries its code snippet titles; every snippet title surfaces in a heading or the closing's account; every entry announced once at its threshold; every reorder and merge flagged as it happens.

**8. The three ear tests.** First, the *listen-back test*: imagine hearing only the second half, having forgotten every name and every entity from the first — the re-anchors, term and entity alike, should carry you. Second, the *cold-tune-in test*: drop into any section's opening as a stranger — the scene must stand on its own. Third, the *desk test*: read three paragraphs aloud in a flat voice — any sentence you would not say, in that tone, to a respected colleague across the desk gets rewritten.

Real words, plainly explained, used until they are familiar tools. Whole mechanisms beneath every rule. A world built before anything is asked of it. An equal across the desk. That is the entire skill.
---

## RESEARCH AND AUTHORITATIVE QUOTES

Before drafting, consult official documentation and provided books (e.g., EPUBs in `documentation official/`). You may include verbatim quotes from these sources, but exercise strict reserve. A quote must make a genuine, standalone contribution to the lesson:
- It must be highly pertinent, insightful, or counter-intuitive.
- It must be properly cited as a formal publication to the reader (e.g., "In *Practical Web Accessibility*, Ashley Firth notes...").
- Never cite a GitHub repository or internal workspace path as the source to the reader. Treat all provided books as canonical industry literature.
