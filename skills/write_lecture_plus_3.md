# Skill: How To Teach A Text As An Oral Lecture

This skill takes one source text — a documentation chapter, a Q&A digest, an outline, working notes — and produces one audio lecture: a TTS-safe, code-free spoken script that teaches the source's material to a listener who may be holding the printed source, but cannot read code while listening, cannot glance back, and gets exactly one pass.

Four commitments govern everything below:

**The lecture is a new lesson, not a reading.** The source supplies the material and the standard of accuracy; you supply the teaching — the through-line, the order, the foundations. The best lecture on a text will often look structurally unlike the text. That is the job.

**The lecture goes down to the machine.** Framework rules are never taught as rules. Every behavior the source describes is the surface of some underlying mechanism — usually in the host language or the runtime — and the lecture's obligation is to build that mechanism, completely and with its proper names, and then derive the source's material from it as consequences. A listener who got the mechanism can predict cases nobody mentioned; a listener who got only the rule cannot. The full discipline is the substrate system, below, and it is the heart of this skill.

**The listener can follow along in the printed source.** The source's own titles are the signposts the lecture calls out, so the person with the booklet open is never lost, however different the lecture's path.

**Retention beats elegance.** The names of things are half the battle in technical material, and audio has no back button, so the lecture repeats its key terms and definitions deliberately, by system. Redundancy is the medium's substitute for the page. When polish and retention conflict, retention wins.

---

## THE LISTENER, AND THE STANCE TOWARD THEM

The listener is an intelligent adult, probably an experienced programmer, listening while walking, driving, cooking, or sitting with the booklet open. Intelligence is not memory: even a brilliant listener, hearing a new term once while merging onto a highway, will not own it ten minutes later. Assume a sharp mind and a leaky buffer — the honest description of every human listening to audio.

The speaker is a knowledgeable colleague thinking out loud — never a coach, a drill instructor, or a children's presenter — who repeats names and definitions generously, the way a good colleague does at a whiteboard. Draw the line precisely, because the whole voice stands on it: **repeating the material is respect; assessing or commanding the listener is condescension.** "Once more, because the word matters: a proxy is a wrapper that intercepts every read and write" — encouraged. "Make sure you remember this" — banned, it commands. "By now you understand" — banned, it grades. The redundancy aims at the material, never at the listener.

---

## THE DESIGN PASS: BUILDING THE LESSON FROM THE TEXT

Before writing a sentence of script, design the lecture. Six steps, in order:

1. **Extract the concept inventory.** Every substantive idea the source teaches, stripped of the source's packaging, each tagged with the source title or entry label it lives under. The ideas are what the lecture must teach; the tags are what it must announce (see the concordance).

2. **Map the substrate.** For each inventory item, ask the question the source never asks: *what underlying mechanism makes this true?* The answer usually lives one layer down — in the host language (how variables hold values, how `this` binds, how scope closes), in the runtime (the event loop, the network), in the compiler, in the browser. List these mechanisms. They are not on the source's pages, because reference texts presuppose them, but they go on the lecture's ledger with full standing: several inventory items will typically turn out to be corollaries of one substrate mechanism, and that discovery reshapes the design — the mechanism becomes a section's foundation and the source's entries become its consequences. The substrate system below governs how each mechanism is taught.

3. **Build the term ledger.** The key technical terms the listener must own — typically five to twelve — drawn from *both* layers: the framework's words (proxy, rune) and the substrate's words (primitive value, reference, pass-by-value, instance, constructor). The names that appear in documentation and error messages, not your analogies. For each term, fix its **canonical definition**: one plain, precise sentence, sayable in one breath — "a proxy is a wrapper that stands in front of an object and intercepts every read and write of its fields." That exact sentence will be spoken several times, near-verbatim; fixing it now is what makes the repetitions reinforce instead of blur.

4. **Find the through-line.** The one claim of which every inventory item is an instance or consequence. It becomes the spine. Two genuinely unrelated through-lines may mean two lectures, or one with a named deferral.

5. **Identify the blind spot.** The single hardest-to-reconstruct conceptual move in the material — very often it is a substrate mechanism, not a framework feature. It gets its own posed problem and the most space, however briskly the source dispatches it.

6. **Choose the order by dependency and tension.** No idea before its prerequisites — and the substrate map is what makes prerequisites visible: a mechanism is taught before the first entry that depends on it. Each section ends by raising the next one's question. Merge entries that are one idea in two outfits — and note now that a legitimate merge is almost always two entries sharing one substrate mechanism, which dictates the merged section's shape (see the pedagogy). Split entries that smuggle two ideas; promote load-bearing asides; the source's order is one candidate among many, usually not the best.

Accountability surviving this freedom: every inventory item and every mapped substrate mechanism taught or deferred by name; nothing taught that the source contradicts; no API or behavior invented. The architecture is yours; the facts are not.

---

## THE SUBSTRATE SYSTEM: TEACHING THE MACHINE BENEATH

This is the depth machinery, equal in standing to the term system and TTS-safety. Four rules.

### Rule one: behavior is always a corollary

The lecture never delivers a behavior as a free-standing fact to accept. "Destructuring breaks reactivity" is not teaching; it is a rule to memorize, and rules to memorize are what this lecture exists to replace. Every behavioral claim must arrive as a consequence of a mechanism the lecture has already built, in a sentence whose shape is *because*: "destructuring copies the field's value into a new variable, the copy was made outside the proxy, so the proxy never sees it again." If you cannot write the because-sentence, you have not yet built the mechanism, and the fix is to build it — never to assert the rule and move on. A claim of behavior with no mechanism beneath it is an orphan, and the final check hunts for orphans.

### Rule two: the mechanism gets a concrete machine picture

Abstract statements about mechanisms do not survive audio. Each substrate mechanism is taught through a concrete physical picture of the machine — small, literal, and reusable: memory as a row of slots; a variable as a labeled box; a primitive value as the thing sitting *in* the box; an object as something too big for a box, living at a slot in memory, with the box holding only a numbered tag — a reference, tag number seven-eight-nine-eight — that says where to find it. The picture is built once, with the term system's full treatment for its names, and then every operation is narrated *against the picture*: "assignment copies whatever is in the box — for a primitive, the value itself; for an object, the tag." The picture is not an optional analogy; it is the model the listener will compute predictions with, so its parts map one-to-one onto the real semantics and its vocabulary stays fixed for the hour.

### Rule three: the mechanism is taught whole — both halves, as minimal pairs

This is the rule that prevents half-models, the deepest failure a technical lecture can have. A mechanism is not the single case the source's question needs; it is a small, complete table of behaviors, and the lecture covers the table. Concretely: identify the two or three axes the mechanism turns on, and teach by **minimal pairs** — the smallest possible contrast, both sides spoken, the difference named. The case that works next to the case that breaks. The operation that shares next to the operation that copies. A mechanism taught on one side only equips the listener to parrot the source's answer; a mechanism taught as its pairs equips them to answer questions nobody asked.

**The worked example of the standard** — this example is the bar, not a topic list; apply the same standard to whatever substrate your material rests on. Suppose the material involves reactive state breaking when destructured or passed to a function. The substrate is the JavaScript value model, and taught whole it is this. JavaScript values come in two kinds: primitive values — numbers, strings, booleans — which sit directly in the variable's box, and objects, which live in memory while the box holds only the reference, the numbered tag. One law governs everything: every assignment, every destructuring, every function call copies *what is in the box* — never the object itself. Now the pairs that make the model whole. Assign one object variable to another, and you copied the tag: two boxes, one object, so changing a property through either variable is visible through both — that is sharing, and it is half the model. Destructure a field out of that object, and you copied the field's value into a fresh box with no tag back: an independent primitive, deaf to everything — that is copying, the other half. Pass an object into a function, and the parameter received the tag: the function can reach the one shared object and mutate its properties, and you will see it — sharing again. Pass a primitive in, or reassign the parameter itself, and the function is working on its own copy in its own box — copying again. Four cases, two pairs, one law. Only now does the framework material land as corollaries: the proxy is reached through the tag, so everything that copies the tag stays live, and everything that copies a bare value out has left the proxy behind. A listener with this model can predict the behavior of cases the booklet never poses; a listener with only "destructuring breaks reactivity" cannot — and that difference is the test of every section, which is rule four.

### Rule four: every section passes the predictive test

Before shipping a section, pose to yourself two or three adjacent questions the section never explicitly answers — neighboring cells of the mechanism's table, cases one step sideways from the source's entries. If the section as written gives the listener everything needed to answer them, the mechanism was taught whole. If not, the section is incomplete — not stylistically, but factually — and the missing half goes in. This test, not the source's word count and not the script's smoothness, is the measure of a section's completeness.

### Depth has a floor, not a ceiling

Descend as far as the because-chain requires and no further: the lecture explains framework behavior down to the language and runtime mechanisms that produce it, but it does not tour the substrate for its own sake — every mechanism taught must carry at least one inventory item on its back. Within that limit, do not fear length. A lecture that runs long because its mechanisms are whole is doing its job; a lecture that runs short because it asserted rules instead of building machines has failed at the only thing it is for.

---

## THE TERM SYSTEM: NAMING, ECHOING, AND HOLDING ON

The retention machinery. Every ledger term — substrate terms fully included — lives through five stages, none optional.

**Stage one: the referent before the name.** Build the thing concretely, in the running example or the machine picture, until the listener can picture it. Only then baptize it: "that wrapper has a name worth keeping, because you will meet it in documentation and error messages: it is called a proxy."

**Stage two: the immediate echo.** A name heard once does not stick; used three times in the next minute, it begins to. In the sentences after baptism, use the term at least twice more, doing real work, and deliver the canonical definition whole: "A proxy is a wrapper that stands in front of an object and intercepts every read and write of its fields. Reading goes through the proxy; writing goes through the proxy; that is how it knows the screen must change." Baptism, echo, canonical definition: the introduction pattern, for every ledger term.

**Stage three: the term becomes the handle.** From baptism forward, the technical term is the concept's primary name for the rest of the lecture. Its violation is the most common retention failure: a lovely analogy is built, the term is dropped once, and the analogy's vocabulary takes over — so the listener finishes owning "the watchful layer" and unable to recognize "proxy" in a stack trace. The analogy is demoted to an appositive rider — "the proxy, that watchful layer" — and never leads again. Likewise no synonym rotation: in print, variation is style; in audio teaching, it is vandalism against memory. One concept, one term, one wording, all hour.

**Stage four: the re-anchor at every return.** Whenever a section reaches back to an earlier term, re-supply it on first mention there — the term plus a clause of its canonical definition: "and here the proxy, the wrapper intercepting every read and write, runs into something it cannot see through." One breath, and it saves the listener who half-lost the term, which is every listener. Briefest where the term was used a minute ago, fullest after a long silence; never skipped across a section boundary. With extra force at merges and connections: "questions three and ten are one idea" is empty unless the terms are re-sounded inside it — "question three's destructuring, the shorthand that copies a field out into a loose variable, and question ten's pass-by-value, the rule that a function receives a copy of what each argument's box holds, are the same law about copies, worn as two outfits." Connections are made out of names; a connection asserted without its names connects nothing.

**Stage five: the closing roll.** The synthesis re-runs the entire ledger: every term, by name, canonical definition at its tightest, woven into the through-line — recognizably the same sentences heard before, landing now as confirmations.

**The texture, and the courage to keep it.** A script obeying these stages reads slightly more repetitive than polished prose, and that must survive revision: the voice saying "I defined this already, repeating is inelegant" is a writer's voice, and this is teaching through a medium with no back button. Honest repetition markers are welcome — "once more, because the word is doing the work," "the name again is proxy." They aim at the material; they are the opposite of condescension.

---

## THE CONCORDANCE: KEEPING THE BOOKLET READER FOUND

The listener may have the printed source open. Three rules keep them found, whatever path the lecture takes:

1. **Titles carry the correspondence.** Each lecture heading names the lecture's own movement, then its source material: `## 4.4 The Live Thing And Its Dead Copy (booklet: "When state is an object or a list", Q3; "Passing state around", Q10)`. A pure-substrate or orientation section is marked `(no booklet section; groundwork)`. The mapping is total both ways: every lecture section declares its sources; every source title appears in some heading or in the closing's account.
2. **Entries are announced aloud at their threshold.** One factual sentence on entering an entry's territory: "In your booklet this is question six, under Reactive built-ins and the variants." Then teach. When only the page can show something — code, a diagram — point once: "the code sits right under that question."
3. **Departures are flagged as they happen.** A jump: "We are taking question eleven before nine, because this idea has to exist first; we will come back for nine." A merge: one sentence, re-sounding the terms it merges, per the term system. A booklet reader told about the jump stays oriented; one who is not is lost for the hour.

The principle: the lecture owes the booklet reader *orientation*, never *obedience*.

---

## THE VOICE: CALM, WARM, DIRECT, AND UNAFRAID TO REPEAT

Measured, precise, warm in the way competence is warm — and economical with everything except mechanism and names.

- **Get to the matter.** Every section opens *inside* a concrete situation within its first two sentences — a thing on the screen, an operation about to go wrong, a question with stakes. No panoramic windups, no re-narrations of the journey so far, no paragraphs that exist to clear the throat. Context from earlier sections arrives as appositive re-anchors riding inside working sentences, never as standalone preamble.
- **Moderate sentence rhythm,** mostly mid-length; short sentences for genuine emphasis; definition sentences deliberately simple and freestanding, so they can be held and recognized when they return.
- **Plain words, exact words.** Prefer the simple term; never flatten a concept below its real shape. Technical terms arrive by the term system; mechanisms by the substrate system.
- **Honesty about the material.** "This part is genuinely subtle"; "the answer is almost disappointingly small." Assess the material, never the listener.
- **First person singular; "we" only for joint derivation** ("if we trace what happens to the tag in that box"). Never the classroom "we" that means "you."

### Banned moves — refuse each by name

1. **No commands about how to listen.** Never "pause the recording," "stop and think," "listen closely." To make a listener think, pose a genuinely good question, give it a beat of air with a named plausible wrong answer, then answer.
2. **No meta-commentary on the teaching method.** Never explain the lecture's structure or announce a move ("now I'll use an analogy"). Two navigation exceptions only: the concordance's one-sentence placements and flags, and the term system's honest repetition markers.
3. **No verdicts on the listener's state.** Never "now you understand," "you're ready," "make sure you remember." Close loops by restating the canonical form and letting it land.
4. **No ritual phrases or audible formulas.** Recurring patterns exist by design but never name or count themselves.
5. **No cheerleading.** If something is surprising, say why — that is information; "here is the magic" is a demand for a feeling.
6. **No condescension words.** Never "simply," "just," "obviously," "of course," "as you can see." Demonstrate simplicity; never assert it.
7. **No false intimacy.** No "my friend," no "trust me," no conspiratorial asides.

### The open question — the engine of engagement

> "So here is the question the whole design turns on: when you reach into that list and flip one flag, three layers deep, does the screen move? A reasonable first guess is that it cannot — a watcher outside a box should not see a page turn inside it. That guess is wrong, and the reason it is wrong is the idea this lecture is built on."

Question, a beat of air, a plausible wrong answer named, then the reveal. Use it at every felt problem; never follow it with an instruction. The wrong answer is most powerful when it is the prediction of an incomplete substrate model — the model the listener probably holds — because then the reveal completes the model rather than just correcting a guess.

---

## TTS-SAFETY AND THE NARRATION OF CODE

The script is read by a synthetic voice. Two absolute rules, then the craft.

**Rule one: no raw code, ever.** Not a line, not a token, not a filename rendered as a filename. Syntax teaches only through the eye, and the eye's work belongs to the booklet — which is what the concordance pointers are for.

**Rule two: no em-dashes anywhere in the script.** A synthetic voice mangles them. Commas, periods, or restructure.

The craft: narrate code at the highest level that still teaches.

1. **Intent first.** What the code is for, in the running example: "the button's click handler adds one to the count." Most code lives here; intent plus a booklet pointer is usually the whole job.
2. **Shape second.** Structure, when structure is the lesson: "the class has two fields and one method; the fields are marked reactive, the method is not, and that asymmetry is the point."
3. **Spelled symbols last, only when load-bearing.** Spell a token in words only when the listener must recognize or produce it later: "the dollar sign followed by the word state"; "a file ending in dot svelte dot t s"; "Svelte Set, written as one word." Full spelling first time, established short handle after. Spelled symbols that are ledger terms follow the term system like any other term.

Never narrate token by token; "let, space, claps, equals, state of zero" is raw code with extra steps. The pull to do it means the line's intent has not been found; return to level one.

---

## THE PEDAGOGY: HOW EACH CONCEPT LANDS

1. **Problem before mechanism, mechanism before rule.** The full ordering of every concept: first the felt problem, concrete in the running example; then the substrate or framework mechanism that explains it, built whole; then the source's rule, arriving as the because-corollary it always was. If the source leads with the rule, invert all three.
2. **One running example, carried through.** Inhabit the source's world without switching surface contexts; if the source has none, choose one example at the start and thread it through. The machine picture (substrate rule two) is the one standing exception — it is a second, stable stage, built once and revisited, never replaced.
3. **One anchor analogy, fully mapped, then demoted.** One physical analogy at most for the core mechanism, every actor mapped to its counterpart, then demoted behind the baptized terms as an appositive rider. An analogy that outlives its term is a retention failure.
4. **Build strictly forward, re-anchoring as you go.** Every concept rests only on what is already established here or named as prior knowledge in the orientation; every reach backward re-sounds its term. Forward references are named deferrals, never half-explanations.
5. **Definitions arrive when they can land, then never change.** Referent, name, echo, canonical definition. If full precision needs experience the listener lacks, give an honest informal cut and sharpen to canonical when the experience exists — then the wording is fixed and repeats as itself.
6. **Merges are built on the shared mechanism, never interleaved.** When the design merges source entries, the merged section has one lawful shape: the shared substrate mechanism first, built whole with its pairs; then each entry derived from it as a case, in turn, by name; then the unifying sentence, re-sounding all the terms. Interleaving two entries before their common mechanism exists does not combine them; it confuses them.
7. **Derive the gotchas; never list them.** Every trap and best practice arrives as a consequence the listener could re-derive: "and now you can see why: the copy was made outside the proxy, so the proxy never sees it." An undrivable gotcha means the mechanism beneath it is missing; build the mechanism.
8. **Close every section with a breath of consolidation.** Two or three sentences: the section's terms by name with their tightest definition fragments, and the question this section's answer has raised for the next.
9. **Proportion follows mechanism, not the source's word count.** The blind spot gets the most space. What may be compressed is *framing* — windups, restatements, decoration. What may never be compressed is mechanism: no half built for brevity, no pair with one side cut, no because-chain truncated. When in doubt between a shorter script and a whole mechanism, the mechanism wins; the predictive test, not the running time, is the judge.

---

## STRUCTURE OF THE OUTPUT

One markdown file of pure prose — no code blocks, no tables, no symbols a voice cannot read.

1. **Title:** `# NN | Title`, NN matching the source's series number; the title names the topic, distinct from the source's own title.
2. **Orientation (first section):** lean and factual, under a minute of speech — roughly a hundred and fifty spoken words. Three jobs, one or two sentences each: what this lecture stands on; the running example and the companion ("you may have the booklet open; I will say where we are in it as we go"); the capability the listener will have at the end. Then the first concrete problem, immediately. Any background the material genuinely needs is not orientation; it is substrate, and it gets a real section with the full treatment.
3. **Body sections:** `## N.M Lecture Title (booklet: "Source Title", entries)` — one per movement of the design, in the design's order; substrate-groundwork sections marked as such; substantive titles, never structural ones. Each section opens inside a concrete situation within two sentences and closes on its consolidation breath.
4. **Closing section:** the synthesis. Four jobs: gather the material into the through-line; run the closing roll — the whole term ledger, canonical definitions at their tightest, woven into that through-line; account for the booklet, naming every entry merged, moved, or deferred and where it went; hand off to what comes next. No congratulations, no verdicts. The coherence and the now-familiar names are the send-off.

Section length breathes with the material. The substrate floor means sections will often be longer than the source's entries suggest; that is correct.

---

## FINAL CHECK BEFORE SHIPPING

1. **TTS-safe:** zero raw code, zero em-dashes, every load-bearing symbol spelled in speakable words.
2. **Substrate intact — the depth check:** every behavioral claim in the script traceable to a mechanism the lecture built (no orphan rules); every mechanism rendered as a concrete machine picture with fixed vocabulary; every mechanism taught whole, both halves, as spoken minimal pairs; every merged section shaped as mechanism-then-cases, never interleaved. **Then the predictive test, section by section: pose two or three adjacent questions the section never asks. If the script as written does not equip the listener to answer them, the mechanism is half-taught; ship nothing until the missing half is in.**
3. **Term system intact — check term by term against the ledger:** referent-first introduction, baptism, double echo with canonical definition; the technical term as primary handle with no synonym rotation and no analogy outliving its term; re-anchors at every cross-section return; merges re-sounding their terms; the closing roll complete. Then the count: each key term's appearances after baptism — a term that appears once and vanishes is the failure this system exists to prevent.
4. **No throat-clearing:** the orientation under a minute; every section inside a concrete situation within two sentences; no standalone recap preambles — earlier context arrives only as re-anchors inside working sentences.
5. **Voice clean:** hunt the seven banned moves; one instance fails. Redundancy markers aim at the material, never the listener.
6. **Concordance total:** every heading carries its booklet titles; every booklet title surfaces in a heading or the closing's account; every entry announced once at its threshold; every reorder and merge flagged as it happens.
7. **Design honest:** one through-line; dependency order with mechanisms before their dependents; the blind spot owns its posed problem and the most space.
8. **Accountability intact:** every inventory item and every mapped substrate mechanism taught or deferred by name; no source fact contradicted; nothing invented.
9. **The listen-back test, then the desk test:** imagine hearing only the second half, having forgotten every name from the first — the re-anchors should carry you. Then read three paragraphs aloud in a flat voice — any sentence you would not say, in that tone, to a respected colleague across the desk gets rewritten. Whole mechanisms, repeated names, an equal across the desk: that is the entire skill.