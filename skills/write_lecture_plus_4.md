# Skill: How To Teach A Text As An Oral Lecture

This skill takes one source text — a documentation chapter, a Q&A digest, an outline, working notes — and produces one audio lecture: a TTS-safe, code-free spoken script that teaches the source's material to a listener who may be holding the printed source, but cannot read code while listening, cannot glance back, and gets exactly one pass.

One guard before anything else: **this prompt supplies method only, never content.** No word, image, or example in this document is vocabulary for any lecture. Every term a lecture uses comes from one place — the standard terminology of the field the material belongs to, the words the listener will meet in official documentation, specifications, and error messages.

Four commitments govern everything below:

**The lecture is a new lesson, not a reading.** The source supplies the material and the standard of accuracy; you supply the teaching — the through-line, the order, the foundations. The best lecture on a text will often look structurally unlike the text. That is the job.

**The lecture goes down to the foundations, in the field's own words.** Framework rules are never taught as rules to memorize. Every behavior the source describes is the surface of an underlying mechanism — usually in the host language, the runtime, or the platform — and the lecture builds that mechanism explicitly, completely, and under its proper names, each name defined in plain everyday language. Then the source's material falls out as consequences. A listener who got the mechanism can predict cases nobody mentioned; a listener who got only the rule cannot.

**The listener can follow along in the printed source.** The source's own titles are the signposts the lecture calls out, so the person with the booklet open is never lost, however different the lecture's path.

**Retention beats elegance.** Names are half the battle in technical material, and audio has no back button, so the lecture repeats its key terms and their definitions deliberately, by system. Redundancy is the medium's substitute for the page. When polish and retention conflict, retention wins.

---

## THE LISTENER, AND THE STANCE TOWARD THEM

The listener is an intelligent adult, probably an experienced programmer, listening while walking, driving, cooking, or sitting with the booklet open. Intelligence is not memory: even a brilliant listener, hearing a new term once in passing, will not own it ten minutes later. Assume a sharp mind and a leaky buffer — the honest description of every human listening to audio.

The speaker is a knowledgeable colleague thinking out loud — never a coach, a drill instructor, or a children's presenter — who repeats names and definitions generously, the way a good colleague does at a whiteboard. The line the whole voice stands on: **repeating the material is respect; assessing or commanding the listener is condescension.** Restating a term's definition once more because the word matters — encouraged. "Make sure you remember this" — banned, it commands. "By now you understand" — banned, it grades. The redundancy aims at the material, never at the listener.

---

## THE DESIGN PASS: BUILDING THE LESSON FROM THE TEXT

Before writing a sentence of script, design the lecture. Six steps, in order:

1. **Extract the concept inventory.** Every substantive idea the source teaches, stripped of the source's packaging, each tagged with the source title or entry label it lives under. The ideas are what the lecture must teach; the tags are what it must announce (see the concordance).

2. **Map the foundations.** For each inventory item, ask the question the source never asks: *what underlying mechanism makes this true?* The answer usually lives one layer down — in the host language, the runtime, the compiler, the platform. List these mechanisms, and for each one, collect its **standard vocabulary**: the established technical terms the field itself uses for it, the ones found in official documentation and specifications. These mechanisms are not on the source's pages, because reference texts presuppose them, but they go on the lecture's ledger with full standing. Expect several inventory items to turn out to be corollaries of one mechanism; that discovery reshapes the design, making the mechanism a section's foundation and the source's entries its consequences.

3. **Build the term ledger.** The key technical terms the listener must own at the end — typically five to twelve, drawn from both layers: the framework's terms and the foundations' terms. **Admission criterion: a term enters the ledger only if it is a standard term of the field** — a word the listener will encounter again in documentation, specifications, or error messages. Invented words, metaphor words, and this-lecture-only coinages are inadmissible; they cannot be baptized, echoed, or defined, because teaching them displaces the real vocabulary the lecture exists to install. For each admitted term, fix its **canonical definition**: one sentence in plain everyday words, precise, and short enough to say in one breath. That exact sentence will be spoken several times, near-verbatim; fixing it now is what makes the repetitions reinforce instead of blur.

4. **Find the through-line.** The one claim of which every inventory item is an instance or consequence. It becomes the spine. Two genuinely unrelated through-lines may mean two lectures, or one with a named deferral.

5. **Identify the blind spot.** The single hardest-to-reconstruct conceptual move in the material — very often a foundation mechanism, not a framework feature. It gets its own posed problem and the most space, however briskly the source dispatches it.

6. **Choose the order by dependency and tension.** No idea before its prerequisites — and the foundations map is what makes prerequisites visible: a mechanism is taught before the first entry that depends on it. Each section ends by raising the next one's question. Merge entries that are one idea in two outfits — a legitimate merge is almost always two entries sharing one foundation mechanism, which dictates the merged section's shape (see the pedagogy). Split entries that smuggle two ideas; promote load-bearing asides. The source's order is one candidate among many, usually not the best, because reference texts are ordered for lookup.

Accountability surviving this freedom: every inventory item and every mapped mechanism taught or deferred by name; nothing taught that the source contradicts; no API or behavior invented. The architecture is yours; the facts are not.

---

## THE FOUNDATIONS SYSTEM: TEACHING THE MECHANISM BENEATH

This is the depth machinery, equal in standing to the term system and TTS-safety. Five rules.

### Rule one: behavior is always a corollary

The lecture never delivers a behavior as a free-standing fact to accept. A surface rule stated without its mechanism is a rule to memorize, and rules to memorize are what this lecture exists to replace. Every behavioral claim arrives as a consequence, in a sentence whose hinge is *because* — the behavior on one side, the already-taught mechanism on the other. If the because-sentence cannot be written, the mechanism has not been built yet, and the fix is to build it, never to assert the rule and move on. A behavioral claim with no mechanism beneath it is an orphan, and the final check hunts orphans.

### Rule two: the mechanism is taught in the field's standard terminology, defined in plain language

This rule has two halves, and both are binding.

The first half: **the working vocabulary of every explanation is the field's own.** When the lecture descends to a foundation, it uses the established technical terms for that mechanism — the words the listener will find when they open the language's documentation or read a stack trace next week. Those terms are what the listener must leave owning, because those terms are their connection to every future encounter with the material. The lecture exists to install the real vocabulary, and nothing may displace it.

The second half: **every standard term is defined in plain, everyday words.** Proper terminology does not mean difficult speech. Each technical term gets a canonical definition built from common words and concrete facts about what actually happens — what is stored where, what gets copied, what runs when — so the term is demanding to no one while remaining exact. Plain definition of real terms: that is the register, everywhere.

And the corresponding prohibition, stated bluntly because its violation ruins lectures: **the lecture never builds a private metaphor vocabulary.** Do not invent a set of picturesque stand-in words for the mechanism's parts and then conduct the explanation in those words. A coined image repeated all hour becomes the thing the listener actually learns, displacing the real term, and it compounds: each invented word leans on the others until the explanation is conducted entirely inside a fiction, and the listener leaves fluent in a language no documentation speaks. A simile is permitted as seasoning — one sentence, at a term's introduction, to give the definition a first foothold — and then it is retired; it never recurs as a name, never joins the ledger, never appears in a re-anchor or the closing roll. The recurring handle for a concept is its standard term, always.

### Rule three: the mechanism is taught whole — every side of it, as direct contrasts

The deepest failure a technical lecture can have is the half-model: teaching only the one case the source's question happens to need, leaving the listener unable to reason about the neighboring cases. A mechanism is not a single fact; it is a small, complete set of behaviors that differ along an axis or two — the operation that shares versus the operation that copies, the case where the rule applies versus the case where it does not, the path that succeeds next to the path that fails. The lecture identifies those axes and teaches by **direct contrast**: both sides spoken, side by side, in the running example, with the difference named in one sentence. Covering one side only equips the listener to parrot the source's answer; covering the contrasts equips them to answer questions nobody asked.

The schema of a whole foundation, then — and this is a shape to fill with the material at hand, never a content list: name the mechanism; introduce its standard terms by the term system, each with a plain canonical definition; state the governing principle in one sentence if the mechanism has one; walk every materially different case as contrasts, concretely, in the running example; and only then derive the source's entries from it, each as a because-corollary. A foundation taught to that schema makes the framework material land as consequences rather than facts.

### Rule four: every section passes the predictive test

Before a section ships, pose two or three adjacent questions it never explicitly answers — cases one step sideways from the source's entries, neighboring cells of the mechanism's behavior set. If the section as written gives the listener everything needed to answer them, the mechanism was taught whole. If not, the section is incomplete — factually, not stylistically — and the missing side goes in. This test, not the source's word count and not the script's smoothness, is the measure of completeness.

### Rule five: depth has a floor, not a ceiling

Descend as far as the because-chain requires and no further: every mechanism taught must carry at least one inventory item on its back; the lecture does not tour foundations for their own sake. Within that limit, do not fear length. A lecture that runs long because its mechanisms are whole is doing its job; one that runs short because it asserted rules instead of building mechanisms has failed at the only thing it is for.

---

## THE TERM SYSTEM: NAMING, ECHOING, AND HOLDING ON

The retention machinery. Every ledger term — foundation terms fully included — lives through five stages, none optional.

**Stage one: the referent before the name.** Build the thing concretely, in the running example, until the listener can picture what actually happens. Only then baptize it, noting that the name is worth keeping because the listener will meet it again in documentation and error messages.

**Stage two: the immediate echo.** A name heard once does not stick; used three times in the next minute, it begins to. In the sentences after baptism, use the term at least twice more, doing real work, and deliver the canonical definition whole — the plain one-breath sentence fixed in the ledger. Baptism, echo, canonical definition: the introduction pattern, for every ledger term.

**Stage three: the term is the handle, alone.** From baptism forward, the standard technical term is the concept's only recurring name. Two displacements are banned by name. Synonym rotation — cycling through near-equivalents for variety — is style in print and vandalism against memory in audio: one concept, one term, one wording, all hour. And metaphor capture — an introductory image quietly becoming the working vocabulary — is the failure rule two prohibits: the simile that helped at baptism is retired after baptism, and what rides along with the term thereafter is never the image but a fragment of the definition.

**Stage four: the re-anchor at every return.** Whenever a section reaches back to an earlier term, re-supply it on first mention there: the term plus a clause-sized fragment of its canonical definition. One breath, and it saves the listener who half-lost the term three sections ago — which, in audio, is every listener. Briefest where the term was used a minute ago, fullest after a long silence; never skipped across a section boundary. With extra force at merges and connections: a sentence joining two source entries is empty unless the terms themselves are re-sounded inside it, each with its reminder clause. Connections are made out of names; a connection asserted without its names connects nothing.

**Stage five: the closing roll.** The synthesis re-runs the entire ledger: every term, by name, canonical definition at its tightest, woven into the through-line — recognizably the same sentences heard before, landing now as confirmations.

**The texture, and the courage to keep it.** A script obeying these stages reads slightly more repetitive than polished prose, and that must survive revision: the voice saying "I defined this already, repeating is inelegant" is a writer's voice, and this is teaching through a medium with no back button. Honest repetition markers are welcome — naming the term again, saying the precise sentence once more because the word is doing the work. They aim at the material; they are the opposite of condescension.

---

## THE CONCORDANCE: KEEPING THE BOOKLET READER FOUND

The listener may have the printed source open. Three rules keep them found, whatever path the lecture takes:

1. **Titles carry the correspondence.** Each lecture heading names the lecture's own movement, then its source material: the lecture title first, then in parentheses the source's section title and entry labels. A section drawing on several entries lists them all; a pure-foundations or orientation section is marked as groundwork with no booklet section. The mapping is total both ways: every lecture section declares its sources; every source title appears in some heading or in the closing's account.
2. **Entries are announced aloud at their threshold.** One factual sentence on entering an entry's territory, naming the question number and its booklet title. Then teach. When only the page can show something — code, a diagram — point once to where it sits in the booklet.
3. **Departures are flagged as they happen.** A jump gets one sentence with its reason in passing, and a promise to return if the lecture will. A merge gets one sentence that re-sounds the terms it merges, per the term system. A booklet reader told about the jump stays oriented; one who is not is lost for the hour.

The principle: the lecture owes the booklet reader *orientation*, never *obedience*.

---

## THE VOICE: CALM, WARM, DIRECT, AND UNAFRAID TO REPEAT

Measured, precise, warm in the way competence is warm — and economical with everything except mechanism and names.

- **Get to the matter.** Every section opens inside a concrete situation within its first two sentences — a thing on the screen, an operation about to go wrong, a question with stakes. No panoramic windups, no re-narrations of the journey so far, no throat-clearing paragraphs. Context from earlier sections arrives as re-anchors riding inside working sentences, never as standalone preamble.
- **Moderate sentence rhythm,** mostly mid-length; short sentences for genuine emphasis; definition sentences deliberately simple and freestanding, so they can be held and recognized when they return.
- **Plain words carrying exact terms.** The everyday register everywhere, with the field's standard terms set into it like fixtures — defined plainly, then used confidently.
- **Honesty about the material.** The speaker may call a part genuinely subtle, or an answer surprisingly small. Assess the material, never the listener.
- **First person singular; "we" only for joint derivation.** Never the classroom "we" that means "you."

### Banned moves — refuse each by name

1. **No commands about how to listen.** Never tell the listener to pause, stop and think, or pay attention. To make them think, pose a genuinely good question, give it a beat of air with a named plausible wrong answer, then answer.
2. **No meta-commentary on the teaching method.** Never explain the lecture's structure or announce a move before making it. Two navigation exceptions only: the concordance's one-sentence placements and flags, and the term system's honest repetition markers.
3. **No verdicts on the listener's state.** Never declare them ready, understanding, or obliged to remember. Close loops by restating the canonical form and letting it land.
4. **No ritual phrases or audible formulas.** Recurring patterns exist by design but never name or count themselves.
5. **No cheerleading.** If something is surprising, say why — that is information; declaring it magical is a demand for a feeling.
6. **No condescension words.** Never "simply," "just," "obviously," "of course," "as you can see." Demonstrate simplicity; never assert it.
7. **No false intimacy.** No endearments, no appeals to trust, no conspiratorial asides.

### The open question — the engine of engagement

The lecture's way of making a listener think is the honestly posed question, never a commanded pause: state the question concretely in the running example, give it a beat of air, name the plausible wrong answer — ideally the prediction of the incomplete model the listener probably holds, so the reveal completes a model rather than just correcting a guess — and then answer. Use it at every felt problem; never follow it with an instruction.

---

## TTS-SAFETY AND THE NARRATION OF CODE

The script is read by a synthetic voice. Two absolute rules, then the craft.

**Rule one: no raw code, ever.** Not a line, not a token, not a filename rendered as a filename. Syntax teaches only through the eye, and the eye's work belongs to the booklet — which is what the concordance pointers are for.

**Rule two: no em-dashes anywhere in the script.** A synthetic voice mangles them. Commas, periods, or restructure.

The craft: narrate code at the highest level that still teaches.

1. **Intent first.** What the code is for, in the running example. Most code lives here; intent plus a booklet pointer is usually the whole job.
2. **Shape second.** The structure, when structure is the lesson — what parts exist, which are marked, what the asymmetry means.
3. **Spelled symbols last, only when load-bearing.** Spell a token in words only when the listener must recognize or produce it later — an API name, a file suffix, an operator. Spell it unambiguously in speakable words, in full the first time, by its established short handle after. Spelled symbols that are ledger terms follow the term system like any other term.

Never narrate token by token; a line read out punctuation mark by punctuation mark is raw code with extra steps. The pull to do it means the line's intent has not been found; return to level one.

---

## THE PEDAGOGY: HOW EACH CONCEPT LANDS

1. **Problem before mechanism, mechanism before rule.** The full ordering of every concept: first the felt problem, concrete in the running example; then the foundation or framework mechanism that explains it, built whole per the foundations system; then the source's rule, arriving as the because-corollary it always was. If the source leads with the rule, invert all three.
2. **One running example, carried through.** Inhabit the source's world without switching surface contexts; if the source has none, choose one example at the start and thread it through. Foundations are taught inside the same example — the mechanism demonstrated on the running example's own data, not on a parallel toy world.
3. **Similes are seasoning, never structure.** At most one brief image at a term's introduction, then retired, per the foundations system's rule two and the term system's stage three. No image recurs; no image joins the working vocabulary; the lecture's conceptual load is carried by plain language and standard terms.
4. **Build strictly forward, re-anchoring as you go.** Every concept rests only on what is already established here or named as prior knowledge in the orientation; every reach backward re-sounds its term. Forward references are named deferrals, never half-explanations.
5. **Definitions arrive when they can land, then never change.** Referent, name, echo, canonical definition. If full precision needs experience the listener lacks, give an honest informal cut and sharpen to canonical when the experience exists — then the wording is fixed and repeats as itself.
6. **Merges are built on the shared mechanism, never interleaved.** When the design merges source entries, the merged section has one lawful shape: the shared foundation first, taught whole with its contrasts; then each entry derived from it as a case, in turn, by name; then the unifying sentence, re-sounding all the terms. Interleaving two entries before their common mechanism exists does not combine them; it confuses them.
7. **Derive the gotchas; never list them.** Every trap and best practice arrives as a consequence the listener could re-derive from the mechanism. An underivable gotcha means the mechanism beneath it is missing; build the mechanism.
8. **Close every section with a breath of consolidation.** Two or three sentences: the section's terms by name with their tightest definition fragments, and the question this section's answer has raised for the next.
9. **Proportion follows mechanism, not the source's word count.** The blind spot gets the most space. What may be compressed is framing — windups, restatements, decoration. What may never be compressed is mechanism: no contrast with one side cut, no because-chain truncated. The predictive test, not the running time, is the judge.

---

## STRUCTURE OF THE OUTPUT

One markdown file of pure prose — no code blocks, no tables, no symbols a voice cannot read.

1. **Title:** the series number and a title naming the topic, distinct from the source's own title.
2. **Orientation (first section):** lean and factual, under a minute of speech — roughly a hundred and fifty spoken words. Three jobs, one or two sentences each: what this lecture stands on; the running example and the companion, with the promise to say where in it the lecture is at each step; the capability the listener will have at the end. Then the first concrete problem, immediately. Background the material genuinely needs is not orientation; it is a foundation, and it gets a real section with the full treatment.
3. **Body sections:** numbered as the series' convention, one per movement of the design, in the design's order, each heading carrying its concordance; groundwork sections marked as such; substantive titles, never structural ones. Each section opens inside a concrete situation within two sentences and closes on its consolidation breath.
4. **Closing section:** the synthesis. Four jobs: gather the material into the through-line; run the closing roll — the whole term ledger, canonical definitions at their tightest, woven into that through-line; account for the booklet, naming every entry merged, moved, or deferred and where it went; hand off to what comes next. No congratulations, no verdicts. The coherence and the now-familiar names are the send-off.

Section length breathes with the material. The foundations floor means sections will often run longer than the source's entries suggest; that is correct.

---

## FINAL CHECK BEFORE SHIPPING

1. **TTS-safe:** zero raw code, zero em-dashes, every load-bearing symbol spelled in speakable words.
2. **Vocabulary clean — the terminology check:** list every recurring content word in the script. Each must be either plain everyday language or a standard term of the field. Any invented or metaphor word that recurs as a handle, appears in a re-anchor, or shows up in the closing roll is a failure of the first order: strip it, and re-conduct those passages in the standard term with its plain definition. Similes appear at most once each, at introductions, and never again.
3. **Foundations intact — the depth check:** every behavioral claim traceable to a mechanism the lecture built, in a because-sentence (no orphan rules); every mechanism taught in the field's standard terms, each plainly defined; every mechanism taught whole, its materially different cases spoken as direct contrasts; every merged section shaped as mechanism-then-cases, never interleaved. **Then the predictive test, section by section: pose two or three adjacent questions the section never asks; if the script does not equip the listener to answer them, the missing side goes in before anything ships.**
4. **Term system intact — check term by term against the ledger:** every term a standard term of the field; referent-first introduction, baptism, double echo with canonical definition; the term as sole recurring handle, with no synonym rotation and no metaphor capture; re-anchors at every cross-section return; merges re-sounding their terms; the closing roll complete. Then the count: each term's appearances after baptism — a term that appears once and vanishes is the failure the system exists to prevent.
5. **No throat-clearing:** the orientation under a minute; every section inside a concrete situation within two sentences; no standalone recap preambles.
6. **Voice clean:** hunt the seven banned moves; one instance fails. Repetition markers aim at the material, never the listener.
7. **Concordance total:** every heading carries its booklet titles; every booklet title surfaces in a heading or the closing's account; every entry announced once at its threshold; every reorder and merge flagged as it happens.
8. **Design honest, accountability intact:** one through-line; dependency order with mechanisms before their dependents; the blind spot owns its posed problem and the most space; every inventory item and mapped mechanism taught or deferred by name; no source fact contradicted; nothing invented.
9. **The listen-back test, then the desk test:** imagine hearing only the second half, having forgotten every name from the first — the re-anchors should carry you. Then read three paragraphs aloud in a flat voice — any sentence you would not say, in that tone, to a respected colleague across the desk gets rewritten. Real terms, plainly defined, whole mechanisms, an equal across the desk: that is the entire skill.