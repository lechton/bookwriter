# The Observer/Subscriber Experiment: An Autopsy of a Prompting Success

**Date:** 2026-07-24
**Analyst:** Kimi K3
**Source material:** `better-writing/observer-subscriber-experiment/` (one full Sonnet 5 conversation export with thinking blocks, three lecture editions, one Part-C clarification file, one final clean rewrite, one curated Q&A digest)

---

## 1. What Actually Happened in This Folder

The folder contains a single extended conversation with claude-sonnet-5, plus its outputs. The arc, in order:

1. A dense, multi-constraint opening prompt asked for a "full lecture" on the Observer/Subscriber pattern via closures and signals, with about a dozen explicit stylistic and structural requirements. The model produced a 515-line lecture (file `00_02`), with web-verified framework facts and node-tested code.
2. The user asked for a second edition with TAKEAWAY blocks everywhere (file `00_03`, 678 lines, diff-verified so nothing was removed).
3. The user then said: "Until that point I could follow you, from that point I lost you." The point of failure was `activeEffect`. A focused clarification file was written (`00_04`).
4. The user escalated: "Makes NO sense to me. Stop writing mere technical responses and try to walk on newbie shoes... Do not repeat the code you wrote and tell a new story... First remind what a junior developer knows in context and then add new info step by step." This is the turning point of the whole experiment. The model abandoned the lecture register entirely and rebuilt the explanation from the junior developer's existing knowledge, using a screen-update scenario and renaming everything (`makeSignal`, `watchEffect`, `flagged_function`).
5. What followed was a Socratic loop of six or seven turns: the user restated the mechanism in their own words, the model confirmed what was right and flipped exactly one wrong bit per turn ("read subscribes, write notifies"; the missing unflag step; who raises the flag; where selective subscription lives in the code). The user invented their own examples (eatingFruit, the YouTube analogy), which the model validated and then corrected with surgical precision.
6. Only then did the user ask: "rewrite the original dissertation... taking as given the pedagogy we have just established." The result is `01_signals-effects-clean-rewrite.md` — the artifact the user is content with.
7. The conversation continued into incremental gap-filling (conditional dependencies, stale subscriptions, nested effects, fine-grained reactivity), each turn driven by the user saying "next", each answer ending with what is still left on the list.

The crucial observation: the final artifact that "clicks" was not produced by the impressive first prompt. It was produced by the failure of that first prompt, the repair sequence that followed, and only then the crystallization. The first lecture was comprehensive and technically excellent, and the user got lost in it anyway. Understanding why that happened, and why the repair worked, is the real lesson of this folder.

---

## 2. Finding One: A Perfect Specification Produces Competence, Not Clarity

The opening prompt is, by normal standards, an excellent prompt. It specifies audience (beginners), register (oral, easy to follow), structure (pain points first, constant "we said we need A and B" reminders), voice (streetwise advice from a developer who lived the history), banned moves (no cheesy metaphors), exemplar style ("closure is a function that returns a function"), and format (long markdown). The model honored every single constraint. The thinking blocks show it maintaining explicit constraint checklists: it scanned its own draft for em-dashes, hunted down and purged its own metaphors ("wearing different clothes" got rewritten three separate times), verified Svelte 5 and Vue facts with web searches, and ran every code sample through node before presenting it.

And the user still got lost. Why?

Because the lecture explained the mechanism from the mechanism's point of view. It presented Part C (`activeEffect`) as the next logical step in a well-organized architecture, which is exactly how someone who already understands it would organize it. The thinking blocks even contain the sentence: "source 16 is the official Vue.js documentation" and long passages about artifact-format decisions and memory-file etiquette, while almost nothing about what a beginner's mental model looks like at the moment they meet `activeEffect` for the first time. The model optimized for correctness, completeness, and constraint compliance. It never modeled the reader's confusion.

**Prompt-strategy lesson:** stylistic and structural constraints are necessary but not sufficient. A prompt can fully control *how* something is written while leaving *from whose confusion it is written* completely unspecified. The missing constraint type is epistemic: "write from the reader's current mental model, not from the finished architecture."

**How to encode in a skill:** add a directive of the form: "Before explaining any mechanism, state what the reader already knows and can verify, in plain words, and build the new concept as one step from that. Never introduce a mechanism as 'the next part of the architecture'; introduce it as the answer to a failure the reader can feel." This single directive would have prevented the Part-C failure at the source.

---

## 3. Finding Two: The Click Came From a Correction Loop, Not From a Better Explanation

The single most instructive sentence in the whole folder is the user's: "The moment we set something (what?) to a signal it intercepts by adding (what?) to a list. And when we read..." The user had the causal direction exactly backwards: they believed writing to a signal is what adds to the subscriber list. The truth is the opposite: reading subscribes, writing notifies.

No article, no matter how well written, can fix this, because the article does not know the reader holds the inverted model. The model's response to that turn did one thing before anything else: "You had one thing backwards, and it's the whole source of the confusion... Reading a signal is what adds to the list. Writing a signal is what calls everyone already on the list. Read subscribes. Write notifies. That's the whole fix."

This pattern repeats through the entire middle of the conversation, with remarkable discipline:

- Turn: user restates the model, gets 90% right. Response: "You've basically got it" plus exactly one correction ("always a function, whichever one is currently marked active").
- Turn: user describes flag and run. Response: "Yes, that's right, with one small addition" (the unflag step).
- Turn: user's YouTube analogy. Response: the analogy "gets the surprising result exactly right, but flips who does the flagging" — one flip, nothing else.
- Turn: user merges fine-grained reactivity with the stack. Response: "Close, but two separate things got merged into one. Let me split them."

The model never re-explained what the user already had right. It explicitly quarantined the correct parts ("Your closure explanation was already exactly right, word for word, no fix needed there") and then isolated the single broken bit. This is what made each turn short, warm, and landable. It is also what a static "great explanation" structurally cannot do.

**Prompt-strategy lesson:** for conceptual teaching, the highest-leverage move available to a user is to state their own mental model out loud, wrong bits included, and demand a confirm/correct response rather than a fresh explanation. The prompt that unlocks depth is not "explain better"; it is "here is my model, tell me which exact part is wrong." As a skill designer, you can manufacture this loop even without a live learner: instruct the model to first enumerate the two or three most likely wrong models a reader holds, then write the explanation as explicit corrections of those models ("You might think X. It is the opposite: Y").

**How to encode in a skill:** two directives. (1) "Misconception-first drafting: for every core mechanism, list the most common inverted or merged mental models, and write a passage that names and flips each one." (2) "Confirm-before-correct voice: when responding to a learner's restatement, always begin by quoting what is exactly right, then correct at most one thing, then stop."

---

## 4. Finding Three: The User's Vocabulary Became the System's Vocabulary

Trace the names. The model's first lecture used `activeEffect`, `get`, `set`, `subscribe`, `notify`. The user's breakthrough came only after everything was renamed: `makeSignal`, `watchEffect`, `read`, `write`, and, decisively, `flagged_function` — a name so plain it is almost comic, and precisely because of that, impossible to misunderstand. The user then invented the `eatingFruit` function and the Fruit signal, the YouTube auto-subscribe analogy, and a definitional format: "It (flagged_function): blabla."

The model adopted every piece of this. When the user asked whether `watchEffect` or `addEffect` was better naming, the model did not dodge: it recommended `watchEffect` and gave a reason that itself taught ("'Add' makes it sound like you are the one manually adding something to a list yourself. You are not"). When the user produced the YouTube analogy, the model kept the analogy and repaired its one wrong arrow. When the user asked for the final rewrite, the instruction "Make it simpler with a global variable flagged_function / It (flagged_function): blabla" was honored verbatim, and the final document is written in exactly that idiom.

The thinking blocks show this was deliberate: "using his own 'welcome to the club' phrase back at him is actually good reinforcement since he introduced it himself as his mental model." And later: "Reusing his example in the final writeup would be a nice way to show how his understanding became the canonical version." That last phrase is the key insight. The user's examples were not tolerated; they were canonized.

**Prompt-strategy lesson:** terminology is not decoration; it is the container the mental model lives in. When a learner coins a name or an analogy, that coinage is evidence of a working internal representation. Discarding it in favor of "proper" terminology forces the learner to rebuild the model from scratch. Adopting it lets the model grow in place.

**How to encode in a skill:** "Vocabulary adoption protocol: whatever names, examples, and analogies the requester (or the source material) has already established are the canonical vocabulary of the document. Introduce standard terminology only as a mapping onto that vocabulary ('Vue calls this track; we have been calling it read-subscribes'), never as a replacement. When a supplied analogy has a wrong arrow, keep the analogy and fix the arrow; never replace the analogy."

---

## 5. Finding Four: Tested Code Is Trust Infrastructure

Every single code block in the entire conversation was executed before it was shown. The thinking blocks contain full execution traces: "All the tests are passing as expected", "Let me verify that new variant works correctly before including it", subscriber counts printed live to prove a bug. The responses then say, over and over, the same two-word ritual: "Tested, prints:" followed by verbatim output.

This mattered twice over. First, obviously, the code was correct, which in a teaching context is non-negotiable: a single broken example would have destroyed the fragile trust of a learner who was already saying "this makes NO sense." Second, and more subtly, the verbatim outputs became the explanation. Several turns explain nothing at all in prose; they just walk the printed output line by line and point: "Notice `quantity.write(5)` produces no output at all. Not because of a check anywhere." The output is the proof, and the proof is the pedagogy.

The same discipline protected factual claims: Svelte's Knockout lineage, the Vue Reactivity Transform deprecation timeline, and the "universal, fine-grained reactivity" phrase were all web-verified in the thinking before being asserted, and the response about fine-grained reactivity cites the Svelte team's own wording.

**Prompt-strategy lesson:** "show your work" is not a nicety. For technical teaching, executed-output-as-evidence is a rhetorical device stronger than any sentence. And when the user has been burned by confusion, verifiable claims are how trust gets rebuilt.

**How to encode in a skill:** "Evidence rule: no code block appears in a teaching document unless it has been executed in the current session; present the real output verbatim and prefer walking the output over paraphrasing the mechanism. No framework-specific factual claim appears unless verified against an official source in the current session; prefer the framework's own vocabulary, quoted or cited."

---

## 6. Finding Five: Pain-Point Sequencing Makes the Next Step Forced, Not Arbitrary

The late part of the conversation (captured in `02.md`) shows a curriculum being built by bug-dependency rather than by topic list. The user says "Let's do the next one, what?" and the model answers: "There's a fifth one that comes before all of them, because it's an actual bug in the code you now understand, not just a missing optimization." Each fix is then shown to create the next problem: the re-tracking fix creates duplicate subscriptions; the Set fixes duplicates but not stale dependencies; the forget-before-rerun fix yields cleanup-on-unmount "for free, because you already built the machinery for a different reason"; and each response closes with "Left on the list: batching, nested effects, diamond handling."

The model's own phrase for this is exact: "which is what makes the next step forced rather than arbitrary." The learner never asks "why are we learning this now", because the answer is always "because the code you just understood is broken in a way you can watch."

This is the deep structure that the failed first lecture was missing. The first lecture also had a sequence (Part A, Part B, Part C), but the sequence was architectural, not motivational. Part C appeared because architectures have a Part C. In the successful version, every mechanism appears because the previous mechanism visibly fails without it.

**Prompt-strategy lesson:** the ordering of a teaching document should be a chain of felt failures, not a table of contents. If a section cannot be introduced with the sentence "watch what breaks without this", its position in the document is wrong.

**How to encode in a skill:** "Forced-next-step sequencing: order sections so each one fixes a concrete, demonstrable failure of the code built in the previous section. Open each section with the failure, shown running. Close each section by naming what is still broken or missing, so the reader knows the shape of what remains."

---

## 7. Finding Six: The Two-Phase Protocol — Co-Construct, Then Crystallize

Stepping back, the experiment's macro-structure is a two-phase protocol, and the user's final request names it explicitly: "rewrite the original dissertation... taking as given the pedagogy we have just established."

Phase one (turns 3 through 9) produced no deliverable at all. It was pure co-construction: the learner externalized a mental model, the model debugged it, vocabulary was negotiated, examples were canonized. Phase two froze the result of phase one into a document. The clean rewrite is short — 180 lines against the first lecture's 515 — because all the exploratory mass had already been burned off in conversation. It contains no history tour, no jQuery anecdotes, no framework saga, because none of that survived contact with the actual confusion. What survived: the problem stated in one sentence ("Without running a function, nothing happens"), the two rules that never swap, the flag's three-step lifecycle, selectivity as a structural side effect, one tested scenario, one paragraph that recaps everything.

The quality the user praises — "extreme depth with simplicity in presentation" — is not a writing trick. It is the visible residue of a debugging process. The document is simple because the confusion was resolved elsewhere, first.

**Prompt-strategy lesson:** when the goal is a definitive teaching artifact, do not prompt for the artifact. Prompt for the conversation that makes the artifact inevitable. Concretely: first prompt the model to interrogate and repair the learner's model (or to simulate that interrogation against anticipated wrong models); only then prompt for the document, with the instruction to use "the pedagogy we have just established" as binding source material.

**How to encode in a skill:** make the skill two-stage by construction. Stage 1 output is a "pedagogy ledger": the confirmed mental model, the corrected misconceptions, the adopted vocabulary, the canonical example, the proven code. Stage 2 output is the document, with a hard rule that it may only use what the ledger contains, plus the stylistic constraints.

---

## 8. What the Thinking Blocks Reveal (the Hidden Half of the Strategy)

Because the export includes the model's reasoning, we can see which internal habits produced the visible quality. Four stand out, and all four are encodable:

1. **Constraint checklists with self-audit.** The model repeatedly scanned its own drafts: for em-dashes (a standing user preference), for banned metaphors (it caught "wearing different clothes", "costume", "leaves a note" and rewrote each), for hard-wrapping. The audit happened after drafting, as a separate pass. Lesson: put the banned-moves list in the skill, and instruct a final explicit sweep, not just upfront avoidance.
2. **Audience inventory before writing.** The successful turn began with: "What does a junior dev actually already know? They know a function runs code when you call it. A variable holds a value. Changing a variable doesn't run any code." The explanation was then built entirely from those three bricks. This mirrors the user's own demand ("first remind what a junior developer knows in context") and is the single most transferable habit in the whole experiment.
3. **Misconception diagnosis before composition.** Before writing the Part-C clarification, the model itemized the user's three distinct errors (causality inverted; "closures added to a list" conflating effects with subscribers; tedium mislocated) and designed the response around exactly those. The composition step came last.
4. **Deliberate register calibration.** The model consciously chose short confirmations when the user was close ("keep this tight and affirm"), and long rebuilds only when the user was lost ("Makes NO sense"). Response length was treated as a function of diagnosed confusion, not of topic size. Lesson: a skill should say this out loud — match response mass to the size of the confusion, not to the size of the topic.

---

## 9. The Prompt-Strategy Playbook (Condensed, Reusable)

Everything above compresses into ten directives that can be lifted into any teaching-authoring skill:

1. **Epistemic anchoring.** State what the reader already knows, in plain words, before any new concept. Build each new concept as one step from that base. Never introduce a mechanism as the next part of an architecture; introduce it as the fix for a failure the reader can feel.
2. **Misconception-first drafting.** Enumerate the likely wrong models (inverted causality, merged concepts, misplaced tedium). Write passages that name each wrong model and flip exactly that bit.
3. **Confirm-before-correct.** When responding to a restatement, quote what is exactly right first, correct at most one thing, then stop. Length of response proportional to size of confusion.
4. **Vocabulary adoption.** The requester's names, examples, and analogies are canonical. Standard terminology enters only as a mapping onto them. Repair analogies by fixing their arrows, never by replacing them.
5. **Evidence rule.** All code executed before shown; real output quoted verbatim; output-walking preferred over mechanism-paraphrasing. Framework claims verified against official sources; framework's own words preferred.
6. **Forced-next-step sequencing.** Every section opens with a running demonstration of what breaks without it, and closes by naming what is still missing.
7. **Two-phase protocol.** Co-construct the pedagogy (or simulate the co-construction against anticipated wrong models) before authoring the artifact. The artifact may only contain what survived.
8. **One rule per sentence pair.** The winning micro-format of the whole experiment: "Reading is the only moment a dependency can be discovered... Writing is the only moment that dependency gets acted on." Two parallel sentences, one mechanism each, "never swap" stated explicitly.
9. **Banned-moves sweep.** Keep the negative constraints (no cheesy metaphors, no em-dashes, no unexplained jargon) as a checklist applied in a separate final pass, not as a hope.
10. **Honesty about scope.** Say what the simplified model omits ("our version is clean partly because it's incomplete"). It builds the trust that makes the simplification acceptable.

---

## 10. The One-Sentence Version

The experiment succeeded because the prompting strategy shifted, mid-conversation, from "specify the perfect document" to "debug the reader's mental model in the open, adopt whatever vocabulary survives, prove every claim by running it, and only then freeze the result into a document" — and any skill that wants this quality of output must encode the debugging loop, not just the document's final style.
