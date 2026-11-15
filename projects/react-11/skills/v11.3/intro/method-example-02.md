## Example of Pedagogical Essence

This is not an example for how to write properly, it is an example of how to think before you write, how to organize concerns as a writer in a serious way. 


Example: **The Core Essence of `useEffect**`

`useEffect` accepts two arguments: a **setup function** and an optional **dependency array**. The setup function can also return a **cleanup function**, which React runs before the setup runs again and when the component leaves the screen.

By default, the main body of a React component is "radioactive": every line of code inside it executes again and again, on every render and re-render. If you call `useEffect` **without** a dependency array, your setup function inherits this exact behavior: it runs when the component first mounts, and runs again after every single re-render.

*(By the way, keep in mind the term **mount**: it is the technical term for the moment a component first appears on the screen, a lifecycle phase we will explore in a later chapter.)*

To control when `useEffect` runs (which is the key to using it well), you pass a dependency array as the second argument:

* **An empty array (`[]`):** Tells React that your Effect depends on nothing in the component. The setup function is shielded from re-renders and runs **only once each time the component mounts**, right after it appears on the screen.
* **A populated array (`[name]`):** Tells React which values the Effect depends on. After every render, React compares each value with its value from the last render. The setup function runs once on mount, and after that, it re-runs **only** when `name` has changed since the last render. Before each re-run, React runs the cleanup with the old value.

This is the core reason to use `useEffect`: it is a place to "hide" code that should run only when another variable (a dependency) changes.

Therefore, we have two major ways to control an action in our web application:

1. **Direct control of an action:** A user clicks a button (an `onClick` event) → the handler function sets off → the code runs.
2. **Indirect control of an action:** A variable changes (a dependency) → `useEffect` sets off → the code runs.

So when you think, *"How can I control this or that part of a website?"*, ask yourself: *"Should I plug a handler function into a button, or should I plug this behavior into a variable waiting to change?"*

You can even combine both: you plug a handler function into a button → the handler function changes a variable → the variable activates `useEffect` → the setup function runs → the action activates.

Choose the indirect path when the work must follow the variable for as long as the component shows it, such as a chat connection that follows the selected room. The user clicks Travel, the handler sets `roomId`, and the Effect disconnects from the old room and connects to the travel room. When the work is a one-time action the user asked for, such as a purchase, keep it on the direct path, inside the handler. A purchase sent through a variable and an Effect goes out again every time the user comes back to the page, and twice in development.

---

## Pedagogical Critique: What a Serious Author Must Consider Next

While the introductory text above is clean and accessible, it remains pedagogically incomplete. Good instructional design requires **separating concerns**, you should not overload an introductory section with every caveat at once but a serious author must never lose sight of the oversimplifications introduced early on.

True technical understanding is built by testing mental models at the **edges**. To guide the reader from surface-level familiarity to deep initiation, subsequent sections must address four critical dimensions.

### 1. Teaching Through Edge Cases: The Ape and the Sloth

Readers only grasp the lifecycle of an application when they visualize extreme timing scenarios. When designing user experiences and explaining asynchronous effects, an author should invite the reader to picture two unlikely users at the keyboard:

* **The Hyperactive Ape:** Imagine an ape eating a banana with one hand and frantically mashing every button on the screen with the other. What happens when a single state variable changes twenty times in two seconds, triggering a torrent of overlapping `useEffect` calls? Without a **cleanup function** to cancel in-flight requests or tear down old subscriptions, earlier effects finish out of order and corrupt the UI. This scenario makes the cleanup function feel like a life raft rather than an abstract syntax rule.
* **The Sloth:** Conversely, what if a sloth is using the application, pausing for minutes between clicks while background connections time out or state goes stale?

Using vivid behavioral extremes forces the reader to think about **time**—the hardest dimension of UI programming to visualize.

### 2. Mapping the Four Execution Zones

A guiding principle for any React educator is keeping the reader constantly oriented around **where** and **when** code executes. Rather than treating a component file as a flat script, the author should help the reader visualize four distinct execution zones:

| Execution Zone | Nature of the Space | When It Runs & Subtle Traps |
| --- | --- | --- |
| **1. The Component Body** | **The "Radioactive" Zone** | Executes on every single render. Crucially, non-primitive values (objects, arrays, functions) defined here are recreated with **brand-new memory references** on every render—even if their contents never changed. |
| **2. Inside `useEffect**` | **The "Safe" Zone** | Runs after React paints the screen, guarded by the dependency array so it only executes at specific lifecycle checkpoints. |
| **3. Inside Event Handlers** | **The "On-Demand" Zone** | Triggered directly by discrete user actions (such as `onClick`). It is insulated from the render loop and only fires when invoked. |
| **4. The System Background** | **The "Ghost" Zone** | Timers, event listeners, or network sockets spawned by `useEffect` live outside React's awareness. Without a cleanup function, these processes continue running in the browser background even after the component unmounts. |

Is this list of spaces excaustive? it depends on the case, topic by topic, we need to examine and reconsider and guide the reader by the hand remind him the basics of how things work, where they work and where or when they fail. 

Holding the various spaces in mind prevents the most common beginner bugs, such as accidentally passing a newly created object from the "radioactive" component body into a `useEffect` dependency array in way that stops or starts an infinite re-render loop. Both problems can appear, in proper context. 

### 3. Sharpening the Distinction: Omitted vs. Empty Dependency Arrays

Summarizing `useEffect` as *"a place to hide code that runs only when a variable changes"* is a helpful stepping stone, but it becomes misleading if left unqualified. The author must explicitly contrast the three states of the second argument so the reader never conflates "nothing passed" with "an empty array":

* **No dependency array (`useEffect(fn)`):** Unshielded. Runs on mount **and** after every re-render, mirroring the radioactive component body.
* **An empty dependency array (`useEffect(fn, [])`):** Fully shielded. Runs **only on mount** (and cleanup on unmount).
* **A populated array (`useEffect(fn, [a, b])`):** Selectively shielded. Runs on mount and whenever `a` or `b` changes between renders.

### 4. The Dependency Paradox: Reading vs. Triggering

Finally, a rigorous text must confront a fundamental tension in React's design. The introductory example frames the dependency array as a list of triggers you *choose* in order to control when an Effect runs. In practice, React's rules flips this around: **any reactive variable you read inside `useEffect` must be declared in the dependency array**, otherwise the Effect captures a stale value from an older render.

This creates a classic pedagogical dilemma that every student eventually hits:

> *"What if I need to read both `name` and `surname` inside my `useEffect`, but I only want the Effect to re-run when `name` changes—not when `surname` changes?"*

If you include `surname` in the array, the Effect fires too often. If you omit it, you violate React's linting rules and risk reading stale data.

Here, a candid author should acknowledge the philosophical trade-offs of the tool itself: **React's rendering architecture often creates unique problems and then introduces new APIs to solve the very problems it created.** Because the entire component function re-runs on every state change, `useEffect` struggles to separate *reading a value* from *reacting to a value*. To fix this self-inflicted constraint, React had to introduce another specialized concept—`useEffectEvent`—specifically to let developers read the latest value inside an Effect without subscribing to it. Pointing out that fine-grained reactive frameworks (like Vue or Svelte) track dependencies automatically without this mental overhead gives the student true architectural perspective, transforming them from someone who merely memorizes React rules into a critical thinker who understands *why* those rules exist.

---

## Further Considerations: A Technical Review of the Text Above (2026-11-14)

The text above is left as written. These are considerations for the author who uses it, each tied to the line it concerns. They point to where a mental model is right in broad terms but can mislead a reader at the edges.

### 1. When does an Effect run: before or after the paint?

The table says that the code inside `useEffect` "runs after React paints the screen". This is usually true, but not always. The React docs, in the caveats of `useEffect`, describe two cases. When the Effect was not caused by an interaction, React generally lets the browser paint the updated screen first. When the Effect was caused by an interaction such as a click, React may run the Effect before the browser paints. The safe statement for a reader is: the Effect runs after the commit, usually after the paint. When the work must happen before the paint, such as measuring a tooltip, the tool is `useLayoutEffect`.

### 2. Who creates a ghost?

The "Ghost" zone says that timers, listeners, and sockets are "spawned by `useEffect`". A click handler can create a ghost too. The stopwatch of Lesson 30 starts its timer in `handleStart`, and only `clearInterval` in the Stop handler ends it. If the stopwatch leaves the screen while it runs, that timer keeps running, and no cleanup function will stop it unless an Effect is written for that purpose. The useful question for the reader is not "where was it started?" but "what stops it?". Whatever starts a ghost, something must stop it.

### 3. A new object in the dependency array

The text says that a new object passed into the dependency array can "stop or start an infinite re-render loop". The word "stops" is wrong, and the sentence hides the two steps. First, a new object has a new reference on every render, so React sees a changed dependency every time, and the Effect runs after every render, as if there were no array at all. Second, if that Effect also sets state, each run causes a new render, which creates a new object, which runs the Effect again, and the renders never stop. Without the second step there is no loop, only an Effect that runs too often, which is a silent bug: a chat that reconnects after every letter the user types.

### 4. The Sloth: what really goes wrong with time

The Sloth scenario says that while the user waits, "state goes stale". Waiting does not make state stale. A stale value in React comes from a closure that kept the values of an old render, as when an Effect leaves a value out of its dependency array. That happens just as fast for the Ape as for the Sloth. The real risks of a slow user are of another kind: the server drops an idle connection, a session expires, or the data on the screen is old because nothing fetched it again. An Effect runs again only when a dependency changes, so a reader should learn that time alone never makes an Effect run again. If the page must refresh on its own, the code must say so, with a timer or with a listener such as the one for the window regaining focus.

### 5. Vue and Svelte: automatic tracking is not the end of the problem

The text says that Vue and Svelte track dependencies automatically "without this mental overhead". The first half is right: in those frameworks the developer does not write the list of dependencies by hand. The second half is overstated. The tension between reading a value and reacting to it exists there too, and each framework gives its own tool for it. In Svelte 5, `untrack()` reads a value inside an effect without subscribing to it. In Vue, `watch` with an explicit source reacts only to that source, while `watchEffect` reacts to everything it reads. The fair lesson for the reader is that every reactive framework must answer the same question, "which values should make this code run again?", and React answers it with an explicit list and `useEffectEvent`.

### 6. An opinion inside a model text

The last paragraph states that React "often creates unique problems and then introduces new APIs to solve the very problems it created". It is a defensible view, and it gives the reader perspective. But this file opens with "Follow this Example", so a writer may copy the opinion into a lecture as a fact. If the lectures should carry this critical view, it helps to present it as a view, with its reason. If not, it belongs in a note for the author only.

### 7. Small slips in the text above

- The bold title on line 3 and the table row "2. Inside `useEffect`" have a broken mix of backtick and bold marks, so the title does not render as bold.
- The text has five em-dashes, which the workspace rules do not allow.
- "Good instructional design requires separating concerns, you should not overload..." joins two sentences with a comma.
- "excaustive" should be "exhaustive", "remind him the basics" should be "remind the reader of the basics", and "React's rules flips" should be "React's rules flip".
