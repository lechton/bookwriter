---
name: clarity
description: "The owner's checklist for maximum clarity, with the owner's before and after examples. Every writer writes with it, and every final read checks each paragraph against it."
---

# Maximum Clarity: The Owner's Checklist #2026_11_09_04_group_1

The owner's words, 2026-11-09:

> Keep in mind the reader has a short attention span, is tired, wants to get directly what is at stake all the time, wants the text to be easy to follow, and wants to look at any random part of the page and find the logic of the explanation clear.
>
> Make sure you read each and every paragraph you wrote, audit the text, and edit it based on this checklist. When writing the text, you need to seriously consider maximum clarity, with these examples taken very seriously from top to bottom.

## [ ] Did you number things clearly when pertinent?

**Instead of this** (COUNTER-EXAMPLE, Lecture 33):

> Developers commonly make four mistakes here. They assume the latest click always receives the latest response. They omit cleanup code. They expect fetch to reject on server errors. And when they cancel an obsolete request, they accidentally treat that cancellation as a fatal crash.

**You can write this** (PROPER, the owner's rewrite):

> Developers commonly make four mistakes here.
>
> 1. They assume the latest click always receives the latest response.
> 2. They omit cleanup code, so an old request can still change the screen after the user has moved on.
> 3. They expect fetch to reject on server errors.
> 4. Finally, when they cancel an obsolete request, they accidentally treat that cancellation as a fatal crash.

*Why this fails*: The reader must count four mistakes inside one paragraph, and "They omit cleanup code" does not say why that is a problem.

## [ ] Is the text enriched with maximum grounding for the quick reader?

**Instead of this** (COUNTER-EXAMPLE, Lecture 33):

> Picture our team directory. The user clicks Bob, whose server lookup is slow and takes two seconds. Realizing their mistake, the user immediately clicks Taylor, whose lookup takes 200 milliseconds. Taylor's bio arrives first and renders. But a moment later, Bob's late response arrives, executes its setter, and overwrites the screen.

**You can write this** (PROPER, the owner's rewrite):

> Users click something on the screen, then another, then another. Meanwhile React is expected to fetch one thing, then another, then another. When one response comes back, it may be too late: the user is somewhere else, expecting to see something else. So for example, picture our team directory. The user clicks Bob, whose server lookup is slow and takes two seconds. Realizing their mistake, the user immediately clicks Taylor, whose lookup takes 200 milliseconds. Taylor's bio arrives first and renders. But a moment later, Bob's late response arrives, executes its setter, and overwrites the screen.

*Why this fails*: The reader meets Bob, Taylor, two seconds, and 200 milliseconds before knowing why they matter.

## [ ] Is the reader's attention properly attached to "what is going on" in each and every paragraph? For example: "The page now displays the wrong information."

**Instead of this** (COUNTER-EXAMPLE, Lecture 33):

> The page now displays Taylor's name with Bob's bio underneath. The console stays quiet. On a high-speed office network, responses arrive in order, so the team never notices the defect. A customer on a mobile phone hits this bug every day.

**You can write this** (PROPER, the owner's rewrite):

> The page now displays the wrong information. The page now displays Taylor's name with Bob's bio underneath. The console stays quiet. And the problem is not always the low speed of the internet. In a high-speed office network, responses arrive in order, so if React is not set up properly, the team never notices the defect. A customer on a mobile phone hits these kinds of bugs every day.

*Why this fails*: Nothing says the page is wrong; the reader must work it out from the names.

## [ ] Did you consider the image that gives the most spectacularly clear and unambiguous pedagogical clarity in the text?

**Instead of this** (COUNTER-EXAMPLE, Lecture 33):

> ## Two fixes that give the same page
> Lesson 32 ended with a rule for cleanup functions: network requests need either cancellation or an ignore flag. Both strategies solve the late answer bug:
>
> - Ignore the late answer: the old request runs to completion, but the component discards its payload.
> - Cancel the old request: the browser aborts the network connection, so no payload ever arrives.
>
> Both techniques ensure the user sees the correct profile. With the first approach, the server finishes generating Bob's bio and transmits it across the wire for nothing. With the second approach, the browser cancels the request as soon as the user selects Taylor.

**You could write this** (PROPER, the owner's rewrite):

> ### Two cures for the late answer: discard in JavaScript or kill at the socket
>
> When the user moves from Bob to Taylor, Bob's in-flight request becomes a **zombie request**: work that is still running, but whose answer is no longer wanted. Cleanup logic must neutralize that old zombie (as seen in Lesson 32). You have two choices:
>
> - **Choice A: Let the zombie finish, then ignore it.** The request completes its full round-trip across the internet. When the promise finally resolves, an `if (!ignore)` check sees that the user moved on and quietly skips the state update.
>   - *Trade-off:* Simple to write and works with any third-party promise library, but wastes mobile data and server CPU.
> - **Choice B: Kill the zombie before it finishes.** The component hands `fetch` an abort signal. When cleanup runs, it calls `controller.abort()`. The browser immediately tears down the TCP socket, freeing up radio power and network bandwidth.
>   - *Trade-off:* Highly efficient for production mobile apps, but requires your `.catch` block to filter out the intentional `AbortError`.
>
> From the user's perspective, both approaches look identical: Taylor's profile appears without being overwritten by Bob. In the logic of the code, Choice A lets the ghost payload travel all the way into the browser, while Choice B stops it dead in its tracks.

The owner's notes:
- Previous lessons ALWAYS go in parentheses. Never add them to the text as part of the narration; it adds complexity.
- Notice the spectacular difference in pedagogical clarity.

*Why this fails*: Both fixes read as two dry facts, so the reader cannot see at a glance what each one does to the old request or what it costs.

## [ ] Did you avoid cryptic AI slop and write in common and clear words?

**Avoid AI slop like this** (COUNTER-EXAMPLE, Lecture 33: "user's glass", "clobbered", "on the wire"):

> On the user's glass, both approaches look identical: Taylor's profile appears without being clobbered by Bob. On the wire, Choice A lets the ghost payload travel all the way into the browser, while Choice B stops it dead in its tracks.

**Write instead with common and clear words** (PROPER, the owner's rewrite):

> From the user's perspective, both approaches look identical: Taylor's profile appears without being overwritten by Bob. In the logic of the code, Choice A lets the ghost payload travel all the way into the browser, while Choice B stops it dead in its tracks.

*Why this fails*: "User's glass", "clobbered", and "on the wire" are a writer's slang, and the reader stops at each one.

## [ ] When you present a complex path or complex logic, do you lead with a short, clear summary for the impatient reader who is a fast thinker and wants to get directly to the moral of the story?

When a complex path or logic is described, you need to ALWAYS summarize it in a sentence for the reader who is a fast thinker and impatient.

**Instead of this** (COUNTER-EXAMPLE, Lecture 33):

> Bob's late answer replaces Taylor's bio
>
> Consider what happens when our component lacks cleanup code and the user clicks twice in rapid succession:
>
> 1. The user clicks Bob. State updates to Bob, and the Effect launches a request that takes two seconds to finish. The screen shows `Loading...`.
> 2. Half a second later, the user clicks Taylor. A new Effect run launches a request for Taylor, which takes 200 milliseconds.
> 3. Taylor's response returns first. The setter updates state with Taylor's bio.
> 4. Over a second later, Bob's response finally arrives. Because no cleanup told it to stop, its success callback runs and overwrites the screen with Bob's bio.

**You can write this** (PROPER, the owner's rewrite):

> **Beware! Without cleanup, what the screen displays at the end is NOT what you clicked last; it is whatever arrived last.** Let's see an example where the information about one name, Bob, arrives slowly: the first click lands last and overwrites the final and actual choice.
>
> Consider what happens when our component lacks cleanup code and the user clicks twice in rapid succession:
>
> 1. The user clicks Bob. State updates to Bob, and the Effect launches a request that takes two seconds to finish. The screen shows `Loading...`.
> 2. Half a second later, the user clicks Taylor. A new Effect run launches a request for Taylor, which takes 200 milliseconds.
> 3. Taylor's response returns first. The setter updates state with Taylor's bio.
> 4. Over a second later, Bob's response finally arrives. Because no cleanup told it to stop, its success callback runs and overwrites the screen with Bob's bio.

The owner's note: ALWAYS give a sharp, clear "what is going on" image with maximum clarity before a complex scenario is presented. This summary withholds no key information; in fact, the reader may even skip the details, thanks to the maximum clarity of the scenario presented beforehand.

*Why this fails*: The reader walks through four steps before learning what they prove.

## [ ] Did you insist on clear and common vocabulary, not idiosyncratic English expressions and words?

**Instead of "clobbers"** (COUNTER-EXAMPLE):

> Let's see an example where the information about Bob arrives slowly, the initial click lands last and clobbers your actual choice.

**You should write "overwrites"** (PROPER, the owner's rewrite):

> Let's see an example where the information about Bob arrives slowly, the initial click lands last and overwrites your actual choice.

*Why this fails*: "Clobbers" is an idiosyncratic word, and a reader whose English is not native stops at it.

## [ ] Do all the principle examples show real DO and DO NOT DO cases, or are they toy examples that mislead? #2026_11_09_07_group_1

**Instead of this** (COUNTER-EXAMPLE, Lecture 13):

> **DO NOT DO THIS:**
> ```jsx
> function handleAdd() {
>   setCount(count + 1);
>   console.log(~document.querySelector('.count-text').textContent~); // **WRONG:** DOM has not updated yet and still logs "Tickets: 1"!
> }
> ```

**You can write this** (PROPER, agreed with the owner for Lecture 13):

> **DO NOT DO THIS:**
> ```jsx
> function handleAdd() {
>   setCount(count + 1);
>   ~saveTickets(count)~; // **WRONG:** the screen shows 2, but the server receives 1
> }
> ```
>
> **DO THIS:**
> ```jsx
> function handleAdd() {
>   const nextCount = count + 1;
>   setCount(nextCount);
>   ~saveTickets(nextCount)~; // the server receives 2, the number on the screen
> }
> ```

*Why this fails*: Nobody reads the page with `document.querySelector` right after `setCount`, so the reader learns to avoid a mistake no one makes, and misses the one everyone makes: using `count` right after `setCount` and getting the old number.
