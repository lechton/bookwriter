## DEFINITIONS


 It could take 1000s of rules only to explain the details of why these definitions are good. Pay attention to details. I would not say "a setter adds score + 1" as it creates visual challenge to reader, i would say a setter updates score useScore (score+1) to visually show the setter, the reader has very short attention span. I carefully repeat things in each sentence,  writing with proper logic and order like a surgeon. I do not say In javascript we do this, there we do that, there we do that.... it would be boring. i say In vanilla JavaScript, you just write score = 3, and the job is done. Clear. Crisp. Cutting through the message. 

Ground Rule: Never use abstract phrases like "passing score + 1" or "hands React a finished number". Always visually anchor the setter call setScore(score + 1) directly in the code, and walk through each call with surgical repetition:

Show the twin setter explicitly: Remind the reader that score is the state variable and setScore is its twin setter, born together in const [score, setScore] = useState(0). EVERY. SINGLE. TIME.
Show the verb REPLACE: The setter call setScore(score + 1) is not an addition. It is a command to REPLACE the state with the calculated value.
Trace the three calls visually, step by step:
First call: setScore(score + 1) reads snapshot score = 0, evaluates 0 + 1 = 1, and commands React: "Replace the score with 1."
Second call: setScore(score + 1) still reads snapshot score = 0, evaluates 0 + 1 = 1, and commands React: "Replace the score with 1."
Third call: setScore(score + 1) still reads snapshot score = 0, evaluates 0 + 1 = 1, and commands React: "Replace the score with 1."
State the visual outcome: React receives the instruction "replace with 1" three times. Each call overwrites the one before it. The final result on the screen is 1, not 3.

The Contrast: Flawed vs. Proper
FLAWED (what I wrote, casual flatness):

Passing score + 1 hands React a finished number. JavaScript calculates score + 1 from the current snapshot before React sees anything.

PROPER (your notes, surgeon-like visual clarity):

If you update the score with setScore(score + 1), then JavaScript will calculate score + 1 from the current snapshot, telling React: "REPLACE the score with this number". Notice that word: REPLACE. setScore(score + 1) replaces the previous value with the new one. Each value update replaces the one before it, so only the last one counts! When you write setScore(score + 1) three times in the same click, React is told "replace with 1" three times. That is why the score ends up at 1.



========


A snapshot. During a click, the score does not change. Even when setScore runs, which asks React to update the score, it does not change. Not during the click. These fixed values of variables is the snapshot. The change appears in the next render of the component (Lesson 15).

BAD
State and its setter. This is how a component keeps values that must survive between renders: you define a state variable (such as count, score, or height) and its setter (such as setCount, setScore, or setHeight). React holds these values for your component between renders. But you never change them directly: each time, you call the matching setter to update them. Here is the catch. When you write setCount(count + 1), count does not increase instantly. Believe it or not, React first calls your component again, and only in that new render does count hold the new value (Lesson 12).

GOOD
State and its setter. In vanilla JavaScript, you just write score = 3, and the job is done. Not in React. A value that must survive between renders, such as count, score, or height, lives in state, and state always comes as a pair: the state variable (count, score, height) and its twin setter (setCount, setScore, setHeight). You declare both of them together, in one line: const [score, setScore] = useState(0). EVERY. SINGLE. TIME. React holds these values for your component between renders, and you never change them directly: no score += 1 here. Each time, you call the matching setter, setScore(score + 1). Here is the catch: when you write setScore(score + 1), score does NOT increase instantly, not on that line, and not on any line after it in the same handler. Believe it or not, React first calls your component AGAIN, and only in that new render does score hold the new value (Lesson 12).




BAD
An event handler. When you click a button, something happens, and the code behind that something is the event handler. The click is the event, and onClick is where you attach the function that handles it. It looks like this: <button onClick={handleThree}>+3</button>. The event handler here is handleThree, and it runs once, when the user clicks that button. You click a button, and a handler function runs. Here is the catch: anything you ask React to do inside this function, such as setScore, waits until the handler has finished, and the result appears only when the component renders again (Lesson 11).


GOOD
An event handler. When you click a button on the screen, something happens, and the code behind that something is called the event handler. Why that name? Well, the click itself is the event, and the function you write to deal with it is the handler: it handles the event! In React, you connect the two with onClick, which is where you attach the function that handles the click. It looks like this: <button onClick={handleCount}>+1</button>. Pay attention here: the event handler is handleCount, and it does NOT run automatically when the page loads. It waits quietly until the user actually clicks that button, and then it runs once for that click. EVERY. SINGLE. TIME. You click a button, the event handler is activated, and the code inside that handler function runs from top to bottom. Here is the catch: anything you ask React to do inside this function, such as updating the score with setScore, does NOT happen on the spot! React waits until the whole event handler has finished running from start to finish. Only after the handler is completely done does React render the component AGAIN, and only in that new render does the result finally appear on the screen (Lesson 11).




BAD
A render. When React runs the code of the whole component to decide what to show on screen, that is called a render. In React, components render often. If you are not careful, functions inside them run again and again, without you realising it, because the component keeps rendering. You never call the render yourself: React does it on the first load of the page. Then React renders the component again after every state change, and whenever its parent renders. So when you change a state variable, such as count with setCount(count + 1), you are telling React: "the state has changed; render this component again so the screen shows the change." Here is the good news: React does not redraw the whole page. It compares the new result with the old one and changes only what is different. Here is the bad news: every line inside the component runs again on every render. A console.log there prints each time, and a counter you change there climbs each time, even when the user did nothing. 


GOOD DeepSeek V4
A render. In vanilla JavaScript, a function runs only when you call it. Not in React. You never call a component function yourself: React calls it for you, runs its whole body from top to bottom, and works out what should appear on the screen. That call is a render. And believe it or not, React calls your component OFTEN. Why? Because React has one question to ask: "Given these props and this state, what should the screen look like right now?" The component answers by returning the JSX for that screen. React renders the component on the first load of the page, again after every state change, and again whenever its parent renders. So when count is 0 and you click +1, the event handler runs setCount(count + 1). You are not changing the screen directly. You are telling React: "the count has changed; call this component again so the screen can show 1 instead of 0." Here is the good news: React does not redraw the whole page from scratch. It compares the new result with the previous result and updates only the parts that differ. Here is the bad news: every line in the component body runs again on every render, from the first line to the last. A console.log('render') in the body prints on every render: the first load, every state change, and every parent render. A counter you keep outside the component and add to in the body climbs on every render, even when the user clicks something unrelated, such as Dark mode (Lesson 13).



---

BAD
Batching. When an event handler calls several state setters, such as setScore(score + 3) and setLastPlay('Three-pointer'), React does not redraw the screen after the first line and then again after the second. It waits until the whole event handler has finished, groups all the updates together, and renders the component once. This grouping is called batching. Here is the good news: the app is faster, and the user never sees a half-updated screen where the score has changed but the play text has not. Here is the catch: if you pause the handler before its last line, for example with alert('Done'), the screen behind the pop-up stays on the old values until the handler finishes. And React never batches across two separate clicks: the first click always finishes its render before the second click runs (Lesson 16).



GOOD
Batching. When an event handler calls several state setters, such as setScore(score + 3) and setName('John'), React does not redraw the screen after the first line and then again after the second. It waits until the whole event handler has finished, groups all the updates together, and renders the component once. This grouping is called batching. Here is the good news: the app is faster, and the user never sees a half-updated screen where some variables are updated (e.g. the score), while other variables are not yet updated (e.g. the name). Batching allows React to group together all the updates from all the setter calls inside the same event handler. So when you click a button, the event handler is activated, and all the state variables it sets get updated together in a batch. Here is the catch: if your code pauses the handler before its last line, for example with an alert('Done'), well... the screen behind the alert will show misleading, old values, since the batching has not been done yet: the handler has not finished yet. Moral of the story: we do not interrupt the handler! Also, React never batches across two separate clicks: the first click always finishes its render before the second click runs (Lesson 16).



---

BAD
An update queue. When you call a state setter inside an event handler, React does not update the state on the spot. Instead, for each state variable, React keeps a waiting line of updates called the update queue. Every call such as setScore(score + 1) or setScore(s => s + 1) drops one more step at the back of that line. Here is the catch: React does not walk that queue while your handler is still running. Only after the handler finishes does React go through the queue from first to last, in the exact order you called the setters, to work out the final state for the next render (Lesson 16).


GOOD
An update queue. OK, we have seen that when you click a button, an event handler is activated, and all the setters inside this handler are grouped together in a batch. But in what order are their updates applied? Well, they are added to a queue, an update queue. Every call such as setScore(score + 1) or setScore(s => s + 1) drops one more step at the back of that queue. Here is the catch: React does not walk that queue while your handler is still running. Only after the handler finishes does React go through the queue from first to last, in the exact order you called the setters, to work out the final state for the next render (Lesson 16).


---

BAD
A value update vs. an updater function. You can pass two different things to a state setter. If you write setScore(score + 1), you pass a calculated value; JavaScript works out score + 1 right now from the current snapshot, and tells React: "replace the score with this number." If you write setScore(s => s + 1), you pass a function (s => s + 1), and that function is called an updater function. It tells React: "take whatever the score is by now (s), and add 1 to it." Here is the catch: if you call setScore(score + 1) three times in one click when score is 0, all three lines read the same snapshot 0 and tell React "replace with 1" three times, so the score ends up at 1. If you call setScore(s => s + 1) three times, each function builds on the one before it, and the score steps from 0 to 1, then 2, then 3. And if you mix both in one click, order matters: a value update placed after an updater function wipes out the updater's work and replaces the score with its own number (Lesson 16).



MY GOOD
A value update vs. an updater function. So, we have seen how in vanilla JavaScript you can just define things: you can just say name = "John" and score = 3. But for state in React, you need to declare the name of the variable (e.g. name, score), and always at the same time you need to declare its twin setter function (e.g. setName, setScore). You need to declare both of them. EVERY. SINGLE. TIME. But pay attention here: if you write setScore(score + 1), you do a simple value update, which can be tricky. Remember the snapshot? It's the fact that state variables do not change within the same event handler until the component renders. You can update any state variable, cool... but the value updates do not add up. If you update score with setScore(score + 1), then JavaScript will work out score + 1 from the current snapshot, telling React: "REPLACE the score with this number". Did you notice the detail? It says "REPLACE": setScore(score + 1) will replace the previous value with the new one. Each value update replaces the one before it, so only the last one counts! The last update wins because the last update commands the actual replacement. But if you write setScore(s => s + 1), you pass a function (s => s + 1), and that function is called an updater function. Updater functions will be queued as functions, so you can stack many of them. So, do not confuse the setter (with a value update) with the updater function. The updater function tells React: "take whatever the score is by now (s), and add 1 to it". It does not replace; it actually calculates on top of the result of the update before it. Here is the catch, caught in action: let's say score is 0, and you call a setter with a value update, setScore(score + 1), but you call it three times in the same event handler, during the same click. You click the button, and the handler runs setScore(score + 1) three times. Will the score be 3 in the end? NO, it will be 1. Why? Because React was told "replace with 1" three times, so the score ends up at 1. This is the logic of the snapshot in practice. But here is the good news: if you use an updater function instead, and call setScore(s => s + 1) three times, you will get 3! Why? Each updater function builds on the one before it, and the score steps from 0 to 1, then 2, then 3. Now the tricky part: what if you mix both? What if you have a simple value update of the same variable, setScore(score + 1), and also an updater function, setScore(s => s + 1)? Well, if you mix both in one click, order matters: a value update placed after an updater function wipes out the updater's work and replaces the score with its own number (Lesson 16).





GOOD
A shallow copy. OK, we have seen how object spread { ...order, quantity: 2 } builds a brand-new object so React can render. But what happens when your state object holds another object nested inside it, such as delivery: { address: 'Main St', time: 'Morning' }? That brings us to a shallow copy. Pay attention here: object spread looks like it copies everything, but it only copies the top level! Think of the outer order box holding an address card that points to a second, inner delivery box in memory. When you write const next = { ...order }, JavaScript builds a new outer box, but for delivery, it only copies the pointer: both order.delivery and next.delivery point to the exact same inner box in memory. That is why it is called a shallow copy: it is not a deep copy! As long as you only read delivery, that is cool... but the moment you write next.delivery.time = 'Evening', you have walked right into the shallow-copy trap. You mutated the shared inner box that order still points to! Here is the catch, caught in action: suppose the shopper selects evening delivery, so the handler runs const next = { ...order }; next.delivery.time = 'Evening'; setOrder(next). React renders, and the screen shows Evening. It looks like it worked, right? Now the tricky part: what happens when the shopper clicks Start over? The reset handler runs setOrder(initialOrder), expecting the delivery time to go back to Morning. Does it go back to Morning? NO, it stays on Evening! Why? Because next.delivery.time = 'Evening' mutated the original delivery box that initialOrder was pointing to in memory. No line in the reset handler wrote Evening, but the starting state was corrupted through that shared reference! Moral of the story: spread is shallow. When updating a nested object, you must copy every single level on the path from the changed field up to the root (Lesson 17).


