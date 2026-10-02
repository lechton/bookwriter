# Hook Ladder Case Studies: Core Mandates for Opening Scenarios

This document is the **mandatory reference** for writing the opening 7-beat Hook Ladder in Svelte lectures. It documents real authoring breakdowns from **Lecture 36** and **Lecture 35**, explaining the fatal failure modes—**Cryptic Word-Count Traps**, **Synonym/Role Rotation**, **Phantom Background Routines**, and **Metaphorical Questions**—and establishes the universal mandates that every lecture must follow.

---

## MANDATE 1: Lecture 36 Case Study (Nested Reactivity in `$state`)

This case study demonstrates how an artificial "four-word question" rule, combined with role rotation and phantom background actors, produces a completely unreadable opening ladder.

### The Flawed Draft (REJECTED)

```markdown
1. A reporter opens the bureau directory to update a foreign correspondent's assignment record.
2. A background routine receives fresh coordinates and updates reporter.location.city = 'Geneva' in the profile data.
3. Why did nothing move?
4. Readers see the journalist stationed in London while their breaking dispatch publishes from Switzerland.
5. The nested city text changed inside computer memory, but the badge on screen stayed frozen on London.
6. Today you learn the exact boundary where deep updates stop, and how to keep nested values linked to the screen.
```

### Post-Mortem: Why the Draft Failed

1. **The Synonym / Role Rotation Trap:**
   - The draft rotates between *"reporter"*, *"foreign correspondent"*, and *"journalist"*.
   - To an international B2 reader, this sounds like three different people, or three different technical roles/components in a framework. Pick **one human word** ("a journalist") and lock it in.
2. **The "Phantom Routine" / Novel Jargon Trap:**
   - *"A background routine receives fresh coordinates..."* What is a "background routine"? A Web Worker? A cron daemon? A server microservice? This novel technical jargon confuses the reader before teaching Svelte. Ground mutations in direct, observable user actions: the journalist updates their profile and selects Geneva.
3. **The Cryptic Metaphor Trap:**
   - *"Why did nothing move?"* The word "move" is metaphorical developer jargon. On a screen, "move" means physical CSS motion or animation! A reader thinks: *"Was an element supposed to slide across the screen?"*
4. **The False 4-Word Restriction:**
   - Trying to force Beat 4 into four words created the cryptic riddle *"Why did nothing move?"*. The objective is **clarity, not cryptic riddles**. A natural, complete sentence that explicitly states the conflict is infinitely superior.

### The Corrected Standard (MANDATED)

```markdown
1. A journalist opens their profile page on the National Times website to update their current city.
2. The profile displays a location badge on screen, showing London from journalist.location.city.
3. The journalist selects Geneva, updating journalist.location.city = 'Geneva' in the profile data.
4. Why did London stay as the registered location, even after the update?
5. Readers still see London on the published website while the journalist reports breaking news from Geneva.
6. The city text changed inside the data object, but the badge on screen never received the update.
7. Today you learn how deep reactivity works in Svelte and how to keep nested data connected to the screen.
```

---

## MANDATE 2: Lecture 35 Case Study (Event Arguments and Parentheses)

This case study illustrates the progression from niche domain jargon and inside-out engine perspectives to the outside-in screen truth.

### Stage 1 — The Jargon & Abstraction Trap (FAILED)

```markdown
1. A news reporter reviews three breaking wire reports on the National Times dispatch desk.
2. The dispatch desk requires every published report to be manually verified by its unique bulletin number.
3. The developer adds a verify button that passes bulletin number 402 directly to the click handler.
4. Why did it run?
5. Every bulletin verifies itself the instant the page loads, publishing unread reports before the reporter touches the mouse.
6. Writing parentheses directly in the template attribute executes the action immediately during rendering instead of waiting for clicks.
7. Today your handlers learn to wait for user interaction, receive custom values, and read native browser events.
```
- **Why it failed:** *"Wire reports"* sounds like hardware or WebSockets; *"bulletin 402"* looks like `HTTP 402 Payment Required`; and *"template attribute"* is vague academic jargon that hides the real syntax culprit (`onclick={...}`).

### Stage 2 — The Inside-Out Engine & Broken Causality Trap (FAILED)

```markdown
1. A writer opens a dashboard showing three draft articles on a news website.
2. Each draft article has a simple identification number, such as article 5 or article 12.
3. Next to article 12, the developer writes onclick={deleteArticle(12)} on the delete button.
4. Why did it run?
5. All three articles delete themselves the second the page loads, wiping out the work before any click.
6. Writing parentheses directly inside the onclick attribute calls the function immediately during page rendering.
7. Today your buttons learn to wait for user clicks, pass custom values safely, and inspect browser events.
```
- **Why it failed:** *"Why did it run?"* is programmer jargon from inside the JavaScript engine. To someone watching the screen, no one clicked anything, and articles do not "run". Moreover, causality was inverted: the question asked why something happened *before* showing the reader that anything happened on screen.

### Stage 3 — The Outside-In Screen Truth (MANDATED)

```markdown
1. A writer opens a dashboard to edit three draft articles on a website.
2. Each article has a delete button written as onclick={deleteArticle(id)} to remove that draft.
3. The writer loads the page without touching the mouse or clicking any button.
4. Where did they go?
5. The list is completely empty because the delete function executed during page load, erasing all drafts.
6. Writing parentheses (id) after the function name executes the code during render instead of waiting for clicks.
7. Today you learn how to pass arguments safely and inspect browser events when users click buttons.
```

---

## MANDATE 3: Lecture 37 Case Study (`$state.raw` and The Mismatch Law)

This case study illustrates how two fatal errors can destroy a performance lecture: first, inventing bizarre domain jargon ("global news bureaus on the editorial portal") instead of the single obvious entity (published articles); and second, missing the fundamental architectural contradiction in Beat 2.

### The Flawed Draft (REJECTED)

```markdown
1. A journalist loads a directory of ten thousand global news bureaus on the National Times editorial portal.
2. The page stores the article list in state so the display updates as the journalist searches.
3. The journalist types a word into the search box to find an old article.
4. Why does the search box lag on every keystroke, even though no article ever changes?
5. Letters appear seconds late on screen, locking up the page while the journalist types.
6. Svelte creates thousands of reactive wrappers around data that never needs fine-grained property tracking.
7. Today you learn how to opt out of deep tracking for massive datasets without losing reactive updates.
```

### Post-Mortem: Why the Draft Failed

1. **The Niche Domain Jargon Trap ("Global News Bureaus" & "Editorial Portal"):**
   - In French, *un bureau* is a physical desk or study. In India, a *bureau* is a government agency. In journalism, it means an overseas branch office. To an international B2 developer, "ten thousand global news bureaus on the editorial portal" is alien, pretentious jargon.
   - The National Times is a newspaper. What does a newspaper publish? **Articles!** A search archive of 10,000 published articles is the only sane, universal entity. Every human on earth knows what an article is.
2. **The Missed Contradiction (The Mismatch Law):**
   - Look at the rejected Beat 2: *"The page stores the article list in state so the display updates as the journalist searches."*
   - This sentence completely kills the tension. It sounds harmonious and correct, as if putting 10,000 articles into `$state` was the proper choice. It hides the architectural conflict.
   - **The real contradiction:** The 10,000 articles are **static and read-only**. Nobody edits an article title or author on this search page. The *only* reason the screen updates is because the journalist is typing a search filter. Yet `$state(articles)` wraps all 10,000 articles in deep reactive proxies, watching every property for changes that will *never* occur. Beat 2 must expose this exact clash between tool and reality.

### The Corrected Standard (MANDATED)

```markdown
1. A journalist opens the search archive on the National Times website to browse 10,000 published articles.
2. The code stores the articles in $state(articles), but the display only updates when the journalist searches.
3. The journalist types a single letter into the search box to find a story.
4. Why does typing in the search box freeze the screen, even though no article ever changes?
5. Letters appear seconds late on screen, locking up the interface while the journalist types.
6. Svelte creates ten thousand deep reactive proxies to track properties that are never edited.
7. Today you learn how shallow state ignores nested properties to keep large datasets fast.
```

---

## The Seven Universal Laws of the Hook Ladder

Every Hook Ladder must obey these seven laws without exception:

1. **The Clarity-Over-Cryptic-Brevity Law:**
   Never compress Beat 4 into an unnatural 4-word riddle if it obscures meaning. The question must be a complete, natural sentence that explicitly states the visible conflict (*"Why did London stay as the registered location, even after the update?"*).
2. **The Single-Actor Law:**
   Pick exactly one human noun (e.g. "a journalist") and never rotate synonyms ("reporter", "foreign correspondent", "contributor"). Multiple terms sound like multiple distinct people or framework roles.
3. **The No-Phantom-Actors Law:**
   Never invent "background routines", "schedulers", or "sync agents" to explain state changes. Ground mutations in observable user actions (e.g. selecting a city from a dropdown).
4. **The Literal-Observation Law:**
   Never use metaphorical verbs like "move", "run", "die", or "freeze" in the question unless referring to the literal UI freeze. Ask directly about the literal text or state on screen.
5. **The No-Niche-Jargon Law:**
   Never use specialized industry jargon (newsroom terms like "bureau", "portal", "wire", "bulletin", "slug", "dispatch"). Use universal nouns: articles, profiles, products, messages, tasks.
6. **The Causality-Before-Question Law:**
   The question must react to an observable event that the reader just watched in Beat 3. Never ask a question about an internal engine event before showing what happened on screen.
7. **The Mismatch Law:**
   Whenever introducing an opt-out or performance tool (like `$state.raw`), Beat 2 must directly expose the contradiction between what the code told the framework to do (e.g. `$state` watching every property) versus what the screen actually needs (e.g. only filtering results; the underlying data is read-only). Without this explicit contrast, the reader cannot understand why the tool caused the problem.
