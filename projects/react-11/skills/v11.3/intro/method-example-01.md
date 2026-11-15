# Pedagogical Note: Who Chooses the Dependencies of an Effect

**Topic:** the dependency array of `useEffect` (Lecture 32, Principle 2)
**Date:** 2026-11-14

## The goal of the lecture

The lecture does not exist to make the React docs easier to read. It exists to teach how to think: the logic behind the code, in the order a developer makes the decisions.

## The problem

The lecture copied the docs' rule as it stands: "You do not manually choose which values to list. The code inside the Effect decides them."

The rule is correct, but the framing is wrong. It treats two separate steps as one:

1. **The design.** The developer decides what the Effect must stay in sync with. This is a real choice.
2. **The list.** Every value from the component that the code reads must be in the list. There is no choice here.

The sentence talks only about step 2. So the student hears "you do not choose" and thinks the dependencies just happen to them. The student does not see that they made the decision earlier, when they wrote the logic.

## The right order of thinking

1. **Decide** what the Effect must stay in sync with.
2. **Write the code** so that it reads exactly those values.
3. **Let the list follow** from the code. Every value the code reads goes in the list, with no exceptions.
4. **To change the list, change the code**, never the list alone.

## A caution on the design step

Frame the decision as "what must this Effect stay in sync with?", not "what event triggers this action?". The thought "when X changes, do Y" leads students to put event logic in Effects. A chat connection stays in sync with the room. A purchase is an event, so it belongs in a click handler.

## The lecture's example, read in this order

1. **The design.** The counter must tick for as long as it is on the screen, whatever `count` is. So `count` must not restart the Effect.
2. **The code.** The updater `c => c + 1` adds one without reading `count`.
3. **The list.** The code reads nothing from the component, so the list is `[]`. The choice was made in the code, not in the list.

## COUNTER-EXAMPLE

> 2. You do not manually choose which values to list. The docs emphasize: "you can't "choose" your dependencies." The code inside the Effect decides them.

*Why it fails:* it hides the developer's real decision. The student learns a ban, "do not choose", instead of a way of thinking. The word "manually" also suggests that React fills in the list.

## PROPER

> 2. The developer decides what the Effect must stay in sync with, and writes the code to read exactly those values. The list then follows from the code: every value the code reads must be in it. In the docs' words, "you can't "choose" your dependencies." To change the list, change the code.

*Why it works:* it shows where the choice happens (in the code) and where it does not (in the list). It keeps the docs' rule, and puts it after the decision that leads to it.

## The General Rule: Guide the Thinking, Do Not Just Simplify the Docs

**The rule:** a lecture should teach the reasoning a developer goes through to reach the code. The docs say what React does and which rules to follow. The lecture shows the decisions the developer makes, in the order they make them, and then shows each rule as the result of a decision.

**Why simplifying is not enough:** a simplified rule tells the student what to do, but not why. When the student meets a case the rule does not cover, they have nothing to reason with. A student who knows the reasoning can work out the answer to a new case.

### How to apply it

For each rule taken from the docs, the author asks four questions:

1. **What problem is the developer trying to solve?** Start from the need, not from the API.
2. **What does the developer decide, and where?** Find the real choice, even when the docs say "you cannot choose."
3. **How does the code express that decision?** Show the code as the decision written down.
4. **What follows from the code with no further choice?** Present the rule here, as a result, not as a command.

### A second example from the same lecture: the cleanup function

**COUNTER-EXAMPLE**

> The cleanup function must stop or undo whatever the setup started. React calls it before the Effect runs again and when the component unmounts.

*Why it fails:* it is correct, but it reads as a rule to memorize. The student learns that a cleanup exists, but not how to know what to write in it.

**PROPER**

> **Hiding a component does not stop everything it started.** That is the surprise that the cleanup function exists to fix. When we want to simulate an action that repeats in the background, we experiment with a counter and a timer. Picture our counter. A timer adds one to the number every second. The user clicks Hide, and the number disappears. It looks as if the counter is gone. But in the background, the timer is still ticking, trying to update a counter that no longer exists. The question is who started what. React put the number on the page, so React knows to take it away. The timer is different. Our own code started it, by calling `setInterval`, and React has no idea it is still running in the background. React cannot stop something it never knew about. So the job falls to us. The cleanup function is where we stop what our code started, quite literally to clean up what our own code left running. React calls it the moment the counter leaves the page, and for our counter, it calls `clearInterval`. This gives you one question to ask of every Effect you write: **when this component leaves the page, what is still running?** Whatever the answer is, your cleanup must stop it.

*Why it works:* it gives the student a question they can ask about any Effect: a timer, a listener, a connection, or something they have never seen. The rule ("the cleanup stops what the setup started") is still there, but it now comes as the answer to a question.

### The test for the author

After writing a paragraph, ask: **if the student met a new case tomorrow, could they reason their way to the right code using only this paragraph?** If they could only repeat the rule, the paragraph simplified the docs but did not teach the thinking.