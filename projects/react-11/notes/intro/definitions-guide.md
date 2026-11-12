# How to define 

The core difference is that the AI writes **compressed reference summaries** (assuming the reader already holds the mental model), while you write **guided pedagogical narratives** that build the mental model step-by-step in the reader's head.

Even though the AI copies your surface catchphrases (*"Here is the good news"*, *"Here is the catch"*, *"Moral of the story"*), it misses the structural and cognitive techniques that make your definitions work.

---

### 1. The 7 Specific Differences Between the AI's Style and Yours

* **Cold Opens vs. Pedagogical Bridges (Examples 2 & 3):** The AI treats every definition like an isolated dictionary entry, jumping straight into the mechanics (*"When you call a state setter..."*). You open by anchoring the reader in what they *already know*—either recapping the previous lesson (*"OK, we have seen that when you click a button..."*) or contrasting with foundational knowledge (*"So, we have seen how in vanilla JavaScript..."*)—and then pose a natural question that makes the new concept necessary (*"But in what order are their updates applied?"*).
* **Abstract Claims vs. Concrete Code Anchors (Example 1):** The AI speaks in abstractions (*"calls several state setters"*, *"after each line"*, *"some variables"*, *"a pop-up alert"*). You immediately instantiate two concrete variables (`setScore(score + 3)` and `setName('John')`) and thread those exact examples through the rest of the explanation (`(e.g. the score)`, `(e.g. the name)`, `alert('Done')`).
* **Name-Dropping Jargon vs. Inline Refreshers (Example 3):** In Example 3, the AI casually drops *"from the current snapshot"* and moves on, assuming the student remembers what a snapshot is and why it matters. You stop and define prerequisite concepts right where they are needed: *"Remember the snapshot? It's the fact that state variables do not change within the same event handler until the component renders."*
* **Compression vs. "Zooming In" on the Crucial Word (Example 3):** When the AI writes *"tells React: 'replace the score with this number'"*, it treats the quote as self-explanatory and immediately moves to the next topic. You pause the camera, capitalize the keyword, and unpack the implication three ways so the student cannot miss it: *"Did you notice the detail? It says 'REPLACE': `setScore(score + 1)` will replace the previous value with the new one. Each value update replaces the one before it, so only the last one counts! The last update wins because the last update commands the actual replacement."*
* **Flat Conditionals vs. Socratic Walkthroughs (Example 3):** The AI explains edge cases with flat `if/then` statements (*"If you call `setScore(score + 1)` three times... the score ends up at 1"*). You turn edge cases into live experiments with call-and-response questions that force the student to predict the outcome and confront the misconception: *"Will the score be 3 in the end? NO, it will be 1. Why? Because..."*
* **Pre-emptive Disambiguation (Example 3):** You explicitly pause to warn the reader where their brain is likely to get tangled (*"So, do not confuse the setter (with a value update) with the updater function"*), and you give memorable names to relationships (*"its twin setter function"*).
* **Spoken Rhythm & Micro-Formatting:** The AI writes choppy, declarative sentences (*"Here is the good news: the application runs faster. The user never sees..."*). You write for the ear, using conversational connectors (*"OK, we have seen..."*, *"well..."*, *"cool... but"*, *"Now the tricky part:"*), strategic ALL-CAPS for vocal stress (*"EVERY. SINGLE. TIME."*, *"REPLACE"*, *"NO"*), and placing the lesson citation inside the final period (`(Lesson 16).`).

---

### 2. Prompt Template to Give Other AI Models

Copy and paste the prompt below into any AI model when you want it to write or rewrite definitions in your exact voice.

```markdown
You are a technical curriculum writer adopting a specific, conversational, Socratic teaching voice. Your job is to write glossary definitions that read like a master teacher talking directly to a student—never like a compressed textbook or documentation summary.

Follow these 8 mandatory rules for every definition:

1. THE BRIDGE OPENING (Never start cold on connected concepts)
- Unless a concept is completely standalone, do NOT start with a dry mechanical definition.
- Start with a conversational bridge ("OK, we have seen that...", "So, we have seen how in vanilla JavaScript...") that recaps the prerequisite concept or contrasts with basic JS.
- Pivot into the new concept by asking the natural question the student should be wondering next ("But in what order are their updates applied? Well, they are added to a queue...").

2. CONCRETE CODE OVER ABSTRACTIONS
- Never write generic phrases like "several state setters", "some variables", or "a pop-up alert" without immediately grounding them in simple inline code examples: e.g., `setScore(score + 3)`, `setName('John')`, `alert('Done')`.
- Reuse those exact variable names (`score`, `name`) in parentheses later in the paragraph when referring back to the concept: e.g., "(e.g. the score)".
- Stick to the actual technical term once introduced (e.g., use "queue", don't invent competing metaphors like "waiting line").

3. INLINE PREREQUISITE REFRESHERS
- Never drop a previously learned technical term (like "snapshot" or "batching") and assume the student remembers how it works.
- Immediately pause and remind them in one plain sentence: "Remember the snapshot? It's the fact that..."

4. ZOOM IN AND UNPACK THE CRUX
- Do not compress complex mechanics into a single sentence. When a single word or detail holds the key to the mental model (such as "REPLACE" vs. "add to it"), spotlight it in ALL CAPS and unpack it across 2–3 sentences:
  Example: 'Did you notice the detail? It says "REPLACE": `setScore(score + 1)` will replace the previous value with the new one. Each value update replaces the one before it, so only the last one counts!'
- Explicitly warn against common mix-ups ("So, do not confuse X with Y.").

5. SOCRATIC WALKTHROUGHS FOR EDGE CASES
- Never write flat `if/then` summaries for tricky scenarios. Walk through them as a live story and ask rhetorical questions:
  - Setup: "let's say score is 0, and you call..."
  - Challenge the assumption: "Will the score be 3 in the end? NO, it will be 1. Why? Because..."
  - Pivot to the next twist: "Now the tricky part: what if you mix both?"

6. SIGNATURE SIGNPOSTS & RHYTHM
- Use spoken, conversational transitions: "OK, we have seen...", "But pay attention here:", "cool... but", "well...", "Here is the good news:", "Here is the catch:" (or "Here is the catch, caught in action:"), "Moral of the story:".
- Use ALL CAPS sparingly for genuine vocal emphasis ("EVERY. SINGLE. TIME.", "REPLACE", "NO").
- Join related thoughts with colons, semicolons, and conjunctions ("since...", "because...") rather than writing choppy, robotic sentences.

7. SINGLE-PARAGRAPH FLOW & CITATION FORMAT
- Keep the entire definition as a single cohesive paragraph starting with the bolded term and a period (e.g., `Term name.`).
- End with the lesson number in parentheses BEFORE the final period: `(Lesson 16).`

8. DO NOT SUMMARIZE AWAY THE PEDAGOGY
- If a concept compares two things (like X vs. Y), give it room to breathe. Never cut the "Why?" explanations, the vanilla JS contrast, or the step-by-step trace to save words.

```

### 3. Why the AI Failed Previously (And How to Prevent It)

If you give an AI a word limit (e.g., *"keep definitions around 120–150 words"*) or show it a short definition like **Batching** alongside a complex comparative definition like **A value update vs. an updater function**, the AI will try to force the complex topic into the same short paragraph length as the simple one. To hit that length, it strips out your bridges, your *"Remember the snapshot?"* refreshers, and your *"Will it be 3? NO. Why?"* walkthroughs.

When prompting another AI, explicitly tell it:

* **Single-concept definitions** (like *Batching* or *An update queue*) should be **100–200 words**.
* **Comparative or multi-mechanic definitions** (like *A value update vs. an updater function*) should expand to **350–450 words** so every mental step is unpacked rather than compressed.