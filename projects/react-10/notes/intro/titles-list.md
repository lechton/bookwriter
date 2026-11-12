Hard rule: NEVER use -ing in the titles 
The best titles are grouped below by the job each title does. Each entry gives the title and why it works.

Here is the full text again, with no word that ends in -ing. Where a lecture title had such a word, I rewrote that title as well.

The best titles are grouped below by the job each title does. Each entry gives the title and why it works.

## Lecture title: name the topic as a plain claim the reader can test

"When You Do Not Need an Effect"
Reason: It promises a decision the reader will make in real code, in everyday words with no jargon. (Lecture 34)

"Why State Stays or Goes When the Page Changes"
Reason: It names a behavior the reader has already seen ("my input kept its text" or "it was wiped"). It does not name an internal concept. (Lecture 25)

"How a Child Tells Its Parent to Change State"
Reason: It states the problem as two roles and one action, so a beginner understands it before the API appears. (Lecture 23)

## Opening section: set the problem in the example's own world

"How a Chat Room Switches Rooms While the Page Stays Put"
Reason: It starts with a scene the reader can picture, not with the word "dependencies". The concept comes later, attached to this case. (Lecture 35)

"Why State Keeps Its Old Value Inside the Handler That Sets It"
Reason: It names the exact surprise the reader runs into, which turns the lesson into the answer to a puzzle. (Lecture 15)

"What Happens Between `setCount` and the New Number on the Screen"
Reason: It sets a start point the reader writes and an end point the reader sees. The lesson fills the gap between them. (Lecture 13)

"How to Remove an Effect Dependency and Still Tell React the Truth"
Reason: It names the goal and hints at the easy wrong way: a silenced linter, which hides the truth from React. (Lecture 37)

## Principle title: ask the question the user asks at the screen

"I Picked travel, So Why Am I Still in the general Chat?"
Reason: It speaks in the user's voice at the moment the screen goes wrong. The reader wants the answer before any code appears, and the forgotten `roomId` comes later as the answer. (Lecture 35)

"Same Box, Same Spot: So Why Is Ben's Note Suddenly Empty?"
Reason: It points at the puzzle that the box never moved on the page, yet its text was cleared. That makes the reader want to know what `key={friend}` changed. (Lecture 25)

"I Type and Type, So Why Won't the Box Take a Single Letter?"
Reason: It names a frustration everyone has felt at a keyboard. The forgotten `onChange` becomes the answer to a real annoyance, not just a rule to memorize. (Lecture 20)

"I Picked travel, So Why Does the Console Say Goodbye to general First?"
Reason: It turns the cleanup into a surprise in the Console that the reader can see for themselves. The lesson then explains why React disconnects the old room before it connects the new one. (Lecture 35)

## Principle title: name the bug the way the user sees it

"A Click on Send Crashes the Form with a Hook Inside else"
Reason: It gives the user action, the result, and the code cause, in that order. That is the order in which a developer meets them when the page breaks. (Lecture 38)

"A Shared intervalId Stops the Wrong Stopwatch"
Reason: "The wrong stopwatch" names the exact defect, not a vague phrase like "causes bugs". (Lecture 30)

"An `alert` Inside `cartReducer` Pops Up Twice"
Reason: It names a symptom the reader can count, which leads straight to the reason (StrictMode runs the reducer twice). (Lecture 27)

"`remove` on React's Node Crashes the Next Toggle"
Reason: It says who owns the node (React) and that the crash comes later, on the next toggle. That delay is what makes this bug hard to find. (Lecture 31)

## Principle title: ask the question the rule answers

"No Messages Yet, So Why Does My Page Actually Show number... 0?"
Reason: It shows the stray `0` that the reader has probably seen in a real app and never explained. The rule `count > 0 &&` arrives as the answer, not as a habit to memorize. (Lecture 10)

"I Clicked Start Over, So Why Does the Delivery Still Say Evening?"
Reason: The reset button is supposed to undo all the changes, so a delivery time that stays changed is a real surprise. It leads the reader to find that the shallow copy changed `initialOrder` too. (Lecture 17)

"I Gave Every Row a key, So Why Does the Child Get undefined?"
Reason: It turns a common wrong belief into a moment of disbelief. The reader took all the right steps, yet the value is gone, so the explanation that React strips `key` lands as the answer. (Lecture 18)

## Principle title: name the fix by what it brings back

"`useState` Above the First `return` Brings Back the Thank-You Screen"
Reason: It shows how small the fix is (one line moved up) and how large the result is (the whole screen comes back). The reader sees the fix and its reward in one line. (Lecture 38)

"With an Updater Function, New Messages No Longer Reconnect the Chat"
Reason: It names the tool and the exact unwanted behavior it stops. (Lecture 37)

"`onMessage` Reads `muted`, and the Chat Stays Connected"
Reason: It states the whole benefit of `useEffectEvent` through the example's names, with no theory. (Lecture 36)

## Contrast section: set two look-alike ideas side by side

"`[roomId]` vs. `[]` when the Effect body reads `roomId`"
Reason: It sets two short pieces of code against each other and gives the condition that decides between them. (Lecture 35)

"Two objects with the same contents are NOT the same value"
Reason: It names the trap directly, and the capital "NOT" marks the exact point where the reader's belief breaks. (Lecture 37)

"A clock in every room vs. one clock in the hall"
Reason: An everyday picture carries the whole idea of state moved up to the parent before any code appears. (Lecture 24)

"You change the file yourself vs. you call the owner back"
Reason: It turns callback props into a human situation the reader already knows. (Lecture 23)

## Symptom section: the user's action, then what goes wrong

"The user types `tea`, and the list still shows all five drinks"
Reason: It reads like a bug report, with a concrete input and a concrete wrong output. (Lecture 26)

"The title says travel, and the chat is still in general"
Reason: It shows two parts of the same screen that disagree, which is exactly how a stale value shows up. (Lecture 36)

"The user clicks Stop, and the number still climbs"
Reason: It is short, physical, and impossible to misread. (Lecture 30)

"Inside the handler, `message` is still one letter behind"
Reason: "One letter behind" measures the defect exactly. (Lecture 20)

## Confirmation section: show that the fix worked

"The user types `tea`, and the list follows every letter"
Reason: It repeats the shape of the symptom title with the correct result, so the before and after match. (Lecture 26)

"A tick in the box now changes only the notifications"
Reason: "Only" names the precise scope of the fix. (Lecture 36)

"The red line goes away, and no line of code hides it"
Reason: It makes the key point that the result comes from state, not from an extra command. (Lecture 21)

## Smallest example: introduce a tool in its smallest form

"`useEffectEvent` in its smallest form"
Reason: It tells the reader they are about to see the tool alone, before it gets mixed into the project. (Lecture 36)

"The smallest version: why `value` alone locks the box"
Reason: It pairs the smallest example with the one question it answers. (Lecture 20)

## Decision section: give the one question that settles the choice

"One question decides it: why does this code need to run?"
Reason: It gives the reader a test they can use again in their own code, written as an actual question. (Lecture 34)

## Name rules: tell the reader how to name their own code

"Name the action after what the user did"
Reason: It is a direct instruction that sounds like the user, not like the code. (Lecture 27)

"Name the Effect Event after what the user thinks happened"
Reason: It ties the name to what the user believes happened, not to how the code works. (Lecture 36)

## Walkthrough section: trace one real run from start to end

"How React calls the components, and what one key does"
Reason: It limits the trace to a single keystroke, so the walkthrough has a clear start and end. (Lecture 20)

"How React runs the chat across one visit"
Reason: "One visit" gives a natural, human-sized time frame for the trace. (Lecture 36)


## Central contrast title: put the two look-alike tools side by side, then say what each one does

"State Setter `setScore` with `score + 1` vs. Updater Function with `s => s + 1`: the plain value replaces, the updater continues"
Reason: The left half shows the two lines that look almost the same, in exact code, and names what each one is (a state setter with a plain value, an updater function). The right half gives each side one verb, "replaces" and "continues", in the same order as the "vs.". The reader gets the whole lecture in one line, and two verbs are easy to remember. (Lecture 16, Gemini 3.8 v1 and v2)

"A Plain Value vs. an Updater Function: the plain value replaces the state, while the updater builds on the pending state"
Reason: It has the same shape in plain words, with no code. It suits a reader who has not seen the code yet, and the verdict still gives each side its own verb. (Lecture 16, DeepSeek version)

**How it differs from the "Contrast section":** a contrast section sets two ideas side by side inside one principle and gives no verdict. The central contrast title adds the verdict after the colon and speaks for the whole lecture.



