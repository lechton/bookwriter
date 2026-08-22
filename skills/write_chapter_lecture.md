# Skill: Write the `## Lecture` Field (pedagogically independent, audio-safe section narration)

A Concept MD carries a `## Lecture` field: a self-contained spoken lecture for that section. It is the source for TWO outputs at once — the chapter's TTS audio (read aloud, in order) and the book's body prose (the text that replaces the figure's diagram on the page). One text, written once, in the audio-lecture voice. It is the LAST field in the md; `## Explanation` stays untouched (it still builds the figure).

The `## Lecture` is NOT a summary of the figure and NOT a line-by-line code walk. It is a PEDAGOGICALLY INDEPENDENT lecture: a listener who never sees the figure must still learn the concept in full. That means starting from the foundations the concept rests on, defining jargon the moment it appears, working the example with its concrete values and outcomes, and stating plainly what is at stake. On top of that teaching, it carries the CONNECTIVE TISSUE — a bridge from the previous concept and a hook into the next — which is what threads the modular sections back into one chapter. Watering this down into a précis of the Summary is THE failure mode; do not do it.

---

## THE VOICE — a charismatic teacher, not an essayist
Write as if a teacher who loves the subject is explaining it out loud to one person. The test for every sentence: would a smart teacher actually SAY this, or is it written-to-be-read-back prose? If it's the latter, cut it.

DO:
- **Vary the rhythm.** Short punches among longer explaining sentences. "Found it. It returns published." next to a full line that explains why. Monotone is the enemy — both monotone-long and monotone-short.
- **Ask, then answer.** Open a loop with a real question and close it: "Does it give up? No." "Why start somewhere this basic?" Questions are what make a listener lean in.
- **Name the pain, don't just describe.** Say why it matters and what's surprising or frustrating. "The object had no idea it was being read" beats "no code ran during the lookup."
- **Cut to the essence.** Say the one idea in the plainest words, then stop: "Check the object, then climb the chain."
- **Concrete over abstract.** Real names, values, outcomes: "hands back Markets rally", not "yields the stored value."

DON'T — these are the artificial tells; ban them on sight:
- **Announcing or appraising what you're about to say:** "the rule is worth holding onto", "here is why we begin", "it's worth slowing down to watch", "notice something interesting". Just say the thing.
- **Precious decoration:** "born from", "on the way out", "in between", "the moment X, Y", "deliberately dull", "reassuringly dull". Plain words instead.
- **Grand abstract closers:** never end on "that noticing is where reactivity begins". Land on something concrete, or a question.
- **Breathless run-ons:** don't chain three clauses with dashes and "and… and…". Break them into sentences.
- **Filler intensifiers:** cut "merely", "simply", "finally", "exactly that", "straight back", "right down".

**BEFORE** (artificial — never write like this):
> So the rule is short and worth holding onto: a read checks the object first, and climbs the chain only when it must. And here is why we begin at this deliberately dull place. In all three reads JavaScript did the same passive thing, handing a value straight back with no code of ours in between. That noticing is where reactivity begins.

**AFTER** (natural — write like this):
> So the whole rule fits in one breath: check the object, then climb the chain. Own, then inherited, then undefined. Now — why open a chapter on reactivity with something this dull? Because of what JavaScript did not do. It found a value that was already there and handed it over. None of your code ran. The object had no idea it was being read. That's the wall we're about to break.

---

## THE FRAME FILES (carry the global arc)
A chapter opens with `00-intro.md` and closes with `99-outro.md`: title and `## Lecture` ONLY (no code, no figure). The intro states the promise and the driving question; the outro traces the whole machine in one breath. Audio = `00-intro` → each section's `## Lecture` in order → `99-outro`.

---

## EVERY `## Lecture` DOES FOUR THINGS, IN ORDER
1. **Bridge in + recall the foundation.** One beat connecting from the previous concept, then recall or define the basics THIS concept rests on — assume the listener forgot (e.g. "an object is simply a bag of named values"). Never drop a load-bearing term as an unexplained bomb.
2. **Work the example, concretely.** Walk the actual scenario with real values and real outcomes, named the way a person says them aloud ("reading piece's headline returns Markets rally"; "author is found nowhere, so it comes back as undefined"). This is the independent core — the concept is genuinely TAUGHT here, not gestured at. Someone with no figure understands it from these sentences alone.
3. **The rule + what's at stake.** Distill the mechanism into one line worth memorizing ("own first, then inherited, then undefined"), then say sharply WHY it earns its place in the chain — the stake, in the terms of the chapter's throughline.
4. **Hook out.** End on the precise question the NEXT section answers.

Bridge and hook are mandatory — they are the thread. (The first concept section bridges from the intro; the last hooks into the outro.)

---

## AUDIO-SAFE RULES (the listener has no screen)
- NO visual deixis: never "as you can see", "the diagram shows", "look at line 3", "above/below", "this image", "on screen". Refer to code by what it DOES and to values by what they ARE.
- Speak code as behaviour and say values aloud: "the get keyword makes a property run a function on every read", "it returns published", "it comes back as undefined" — never a character-by-character read-out of syntax.
- Name a symbol only when it carries meaning, said the human way ("the `$state` rune", "an arrow function", "piece's headline").
- Self-contained sentences: short, active, one idea each. A listener cannot re-read.
- Standalone voice: impersonal lecture register; a generic teaching "you" and first-person "I/we" are fine; never address the prompt ("you asked", "your instinct").
- Never hard-wrap: one continuous line per paragraph.

---

## WHEN TO COMPARE FRAMEWORKS
Raise a React/Vue point only where it genuinely sharpens the JavaScript idea (e.g. a signal versus React's re-render model), and never drop the comparison without explaining it for a reader whose memory of those frameworks has faded. Pure-JS foundations like the prototype chain usually need no comparison — do not force one.

---

## LENGTH AND DEPTH
Pedagogically complete beats short. Build from the foundations and work the example with concrete values, even though the figure also shows them — the lecture must stand alone. In practice that is a few paragraphs, roughly 300–450 words for a concept section; the frame files may be shorter. If it genuinely overflows, the section is probably two concepts. Err toward clarity and independence over brevity.

---

## CHECKLIST
- Bridges from the previous concept; recalls or defines the foundations it rests on.
- Walks the example with concrete values and outcomes — a listener with no figure learns the concept in full.
- Distills the rule into a memorable line; states what's at stake sharply.
- Hooks into the next section.
- Passes the audio test: read it aloud with eyes shut — nothing refers to something only the eye could find.
- One continuous line per paragraph; impersonal, standalone voice; not a précis of the Summary.
