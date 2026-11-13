# Intro points

## What the VS opening is for

1. **The intro sets the tone.** It opens the subject in a way the reader recognizes. The rest of the lecture brings the full clarity.
2. **Clarity through notions.** Make clear what the thing is, where the code lives, and when it runs.
3. **Each place has a benefit and a problem.** When the intro or the lecture names a place, such as the component body, say what it gives and what it costs. For example, the component body runs again on every render: the problem is that it re-renders constantly, and the benefit is that the value is calculated again every time.
4. **In different chapters, repeat from different angles.** Come back to the same idea more than once, each time from a new side, and remind the reader of the functional basics: for example, where the code runs automatically, where it runs after a click, and where a change of a state variable triggers the event.
5. **Grounded introduction.** Ground basic definitions and concepts in common-sense intuition, not in the idiosyncratic example of the chapter. For example, to define the combination of two variables, take the name "John" and the surname "Smith", combined together as "John Smith". Do not start basic definitions with the idiosyncrasies of the chapter example. For example, a bread as an item to delete in a shop cart is very idiosyncratic. It can be part of an example, but not part of the introductory definition of basic concepts and ideas. The introductory definitions set the paradigm of how to define things.
6. **No catch section yet.** The intro has no generic section on "what is the catch, what is bad practice, what is good practice". These are explored later in the chapter, when pertinent.

## The leading sentence

Start the VS opening with one leading sentence that holds the core message. Write it as a bold blockquote, then an empty line, then the rest of the opening:

> **A ref allows you to take control of the browser elements via code.**

In React, a page often needs to directly control an element on the screen...

Write a full sentence a person would say, not a label.

BAD: a label, not a sentence.

> **no Effect for a calculated value**

BAD: it leaves out "automatically", the word that tells the reader no click starts the task.

> **`useEffect` lets a component start a task by itself when it appears on the screen, and stop it when it leaves.**

BAD: it crams two rules together with a semicolon and uses cryptic shorthand ("let the browser hold it").

> **Keep a form field in state only when the page updates as the user types; otherwise let the browser hold it and read `FormData` at submit.**

GOOD: the leading sentence of every GOOD example below.

## The title after the intro of the intro #2026_11_13_07_group_1

The intro of the intro is the opening this file is about: the leading sentence and the paragraphs right under the `## VS |` heading. The rest of the intro comes after it. Put a simple title between the two, so the reader sees where the intro of the intro ends and the next part begins. Write it as a `###` title, by [titles/SKILL.md](../titles/SKILL.md): short, plain, and with no -ing word.

GOOD (Lecture 37): the intro of the intro ends with the fix on the travel page, and the next part shows the same problem in a chat.

> ### The Same Bug in a Chat

BAD: it tells the whole next part in the title.

> ### The Same Bug in a Chat: the User Types `hi`, and the Chat Reconnects After Each Letter

## How to give advice #2026_11_13_08_group_1

When the opening gives advice, announce it to the reader, like a writer who pays attention to the person reading. Do not drop it as one more flat statement after a row of facts. Mark the moment with words that call for attention, such as "Therefore, you need to pay attention and always...", and then give the advice.

BAD: the advice is one more flat statement.

> **In the cleanup, mark the old request as ignored, so its answer can no longer change the bio.**

GOOD: the advice is announced, and it speaks to the reader.

> **Therefore, every time you fetch data in an Effect, you need to pay attention and give it a cleanup that marks the old request as ignored.**

## Examples

### Lecture 40: `FormData`

=====
BAD

In React, a form field usually keeps its text in useState, and onChange updates it on every letter. You do not need that for every field. Put a field in state only when the screen changes as the user types, and read the rest at submit with FormData.

Say you build a signup form with First Name, Last Name, City, Email, and Password. While the user types a name, a city, or an email, nothing else on the page changes. Only the Password field shows a live red-or-green strength bar under it. All five fields sit in one form component, but only one of them changes the screen while the user types.

Why: If you create five useState variables for the five fields, React renders the whole form again on every letter typed into any of them. You only need useState for the Password field. The browser already keeps the text of the other four fields until you read it at submit with FormData.

**Note for the AI:** This fails because it opens with a rule about one form field instead of the situation every developer knows: a form with many fields and one `useState` for each. The reader is told what to do before seeing why it matters. The scene lists facts but never asks the question the reader should ask, so it reads like a report.

===================
GOOD

> leading sentence 

> **We do not need a state variable for every field of a form: `FormData` reads the fields at submit.**

In React, forms have many fields, and each field is often plugged into a state variable through `useState`. A form with 10 fields may have 10 variables and 10 separate `useState` calls, one for each field. You do not need to do this for every input. **We should plug in `useState` for only a few fields**, for example the ones that change the screen as the user types. This is why the browser gives us `FormData`. **The remaining fields can be read at submit with `FormData`.**

Take a signup form with five fields: First Name, Last Name, City, Email, and Password. Ask yourself: do I need to constantly update each and every field? Only the Password field needs to update a live red-or-green strength bar below it. When the password is weak, the bar turns red. But for the rest of the fields, there is no need to track every letter the user types. All five inputs sit in the same form component, yet only one needs to change the screen while the user types.

**Why:** Giving all five fields their own `useState` forces React to re-render the entire form on every letter typed. Here, you only need `useState` for the Password field. The browser already holds the text of the other four fields until you read it at submit with `FormData`.

**Note for the AI:** This works because it starts from the habit the reader already has, one `useState` per field, and shows the cost with a number anyone can picture: 10 fields, 10 variables. Only then does it give the fix, in bold, where the reader is ready for it. The scene asks the reader's own question, "do I need to constantly update each and every field?", and the answer is visible on the page: only the strength bar changes. The Why names the exact cost, a render of the whole form on every letter.

### Lecture 34: We do not need an Effect for a calculated value

===================
BAD: it starts by connecting abstractions, "Right after learning `useEffect`, it is tempting to store a value", with no concrete grounding in something the reader can easily recognize.

Right after learning `useEffect`, it is tempting to store a value that depends on other state in a third state variable and update it inside an Effect. You do not need `useEffect` to calculate a value from state or to handle a button click. Calculate values right inside the component body, and put click code inside `onClick`.

Take a checkout page with two fields: First Name and Last Name. As the user types, the page prints their full name on a receipt right below. Both inputs and the receipt line sit in the same component, so the component already has both names on every render.

**Why:** Using a third state variable and an Effect forces React to draw the screen twice on every letter typed: first with the old full name, and then again with the new one. When you can calculate a value straight from existing state, calculate it right in the component body.

**Note for the AI:** The first sentence stacks abstract words, "a value that depends on other state", "a third state variable", "an Effect", before the reader has seen a single thing on a page. The reader must translate each phrase into a picture alone.

===================

GOOD: it starts with grounding that is concrete, short, direct, and easy to read and understand. You do NOT need to use the actual chapter example. Use the most typical, easy-to-understand examples BEFORE the chapter begins: basic grounding before any chapter example even starts. It explains why something is a bad practice, not merely that React forbids it.

How can we combine the content of two state variables? In React, components often display a result built from existing state, like combining a first name and a last name, or adding tax to a price. People often create a third `useState` variable for that result and plug in `useEffect` to update it whenever the first two change. You do not need `useEffect` to calculate a value from state or to handle a button click. We can calculate the result in a plain variable right inside the component body, and put click code directly inside `onClick`.

Take a checkout page with two fields: First Name and Last Name. As the user types, the page prints their full name on a receipt right below. Ask yourself: do I need a third state variable and an Effect just to join two names together? Both inputs and the receipt line sit in the same component, so the component already has both names in hand on every render.

**Why:** Using a third `useState` and a `useEffect` is a bad practice. It forces React to draw the screen twice on every letter typed: first with the old full name, and then again after the Effect updates it with the new one. When you can calculate a value straight from existing state, calculate it right in the component body.

**Note for the AI:** This works because the first sentence gives two everyday results anyone has seen, a full name and a price with tax, before any React word. The common mistake is then described as what people really do, and the fix comes in bold right after it. The Why calls the mistake a bad practice and names its exact cost, two renders on every letter, so the reader understands the reason and does not just obey a ban.

===================

BAD: it mixes the combination question with the `useEffect` question. The `useEffect` question, automatic versus click, is a different question. The "when" question is mixed with the "where" question: where does the combination itself live? Does the combination live inside the component code, or in a function, a combination function inside the component, that runs on click? And what if we want an automatic update without a click? It makes the whole section confusing.

How can we combine the content of two state variables? In React, components often display a result built from existing state, like combining a first name and a last name, or adding tax to a price. People often create a third `useState` variable for that result and plug in `useEffect` to update it whenever the first two change. You do not need `useEffect` to calculate a value from state or to handle a button click. We can calculate the result in a plain variable right inside the component body, and put click code directly inside `onClick`.

**Note for the AI:** One paragraph answers three different questions at once. Where does the combined value live? When does it update, automatically or on a click? And where does click code go? The first sentence asks only the first question, so the click answer at the end comes from nowhere. Worse, the reader's real doubt is never answered: if there is no `useEffect` and no click, what updates the result automatically? Ask one question, answer it fully, and leave the click question for its own section.

===================

GOOD: one question, the "where" question, answered fully, including the "automatic" doubt.

> **We do not need an Effect for a calculated value.**

How do we show a value combined from two state variables? Pages do this all the time: a full name built from a first name and a last name, or a price with tax added. Some developers create a third `useState` variable for the result and add a `useEffect` that updates it automatically whenever the first two change. You need neither of them. **Calculate the result in a plain variable, right inside the component body.**

But will it update automatically, without a click? Yes. The "problem" of the component code is that it runs on every render. But here, this is good news: it means the result is calculated again on every render. Every time the user types a letter, the setter makes React render the component again, and React runs the component body from the top. So the line that builds the full name runs again too, with the new letters. The component body is already the automatic update.

Take a checkout page with two fields: First Name and Last Name. As the user types, the page prints their full name on a receipt right below. Ask yourself: do I need a third state variable and an Effect just to join two names together? No. Both inputs and the receipt line sit in the same component, so that component already has both names in hand on every render.

**Why:** A third `useState` with a `useEffect` is a bad practice. It makes React draw the screen twice on every letter: first with the old full name, and then again after the Effect sets the new one. When you can calculate a value straight from existing state, calculate it right in the component body.

**Note for the AI:** This works because it asks one question, where does the combined value live, and answers only that question. The second paragraph answers the doubt every reader has, "without a click or an Effect, what updates it?", with the fact they already know: React runs the component body again on every render. The click question, code that must run because the user clicked Buy goes in `onClick` and not in an Effect, is a separate idea, so it is left out of this intro and gets its own section.

### Lecture 38: the rules of Hooks

=====
BAD

In plain JavaScript, you often create a variable only inside an if, when you need it. Hooks cannot work that way. Every Hook call must sit at the top level of your component, never inside an if or a loop, because React tracks Hooks by their call order.

Say a store page needs a shopping cart only after the user logs in. It feels natural to write an if first and create the cart state only inside it. Then the user clicks Log in, the if turns true, and the whole page crashes. The if sits inside the store page component, so one click changes which Hooks that component calls.

Why: React does not remember your useState variables by the names you give them. It keeps a numbered list in the order your component calls them: first Hook, second Hook, third Hook. If an if or an early return skips a Hook on the next render, the list no longer matches your calls, and React crashes.

**Note for the AI:** This fails because it jumps from a plain JavaScript habit straight to the rule, with no page the reader recognizes in between. Nothing tells the reader when a page really needs something only sometimes, so the rule feels arbitrary.

====

GOOD: notice the key sentence is highlighted not at the beginning, but in the exact place where it comes as the moral of the story, repeated for emphasis before the end. In other examples the key sentence is highlighted at the beginning. There is no hard recipe: you choose how the example at hand needs to present the information, and then highlight the key message.

> **Every Hook must be called at the top level of the component, never inside an `if` or a loop.**

In React, a page often has features that only appear under certain conditions, like a discount banner on sale days, or a profile menu after signing in. In plain JavaScript, when you only need a variable sometimes, you create it inside an `if` block. It is tempting to do the same in React and wrap `useState` inside an `if` statement. Never do this! Hooks cannot work that way. **Never use `useState` or any other Hook inside an `if` statement**. Every Hook call must sit at the very top level of your component, never tucked inside an `if` or a loop.

Take a store page that needs a shopping cart only after the user logs in. Ask yourself: should I write `if (isLoggedIn)` first, and plug in the cart's `useState` only inside that block? If you do, the page loads fine for a guest, until the user clicks **Log in**. The `if` turns true, the cart's `useState` runs for the first time, and the whole page crashes. Because that `if` sits inside the store component, a single click changes how many Hooks the component calls from one render to the next.

**Why:** React does not remember your `useState` variables by the names you give them. Instead, it keeps an internal numbered list in the exact order your component calls them: first Hook, second Hook, third Hook. If an `if` statement or an early `return` skips or adds a Hook on the next render, the numbered list falls out of sync with your calls, and React crashes.

**Note for the AI:** This works because it first shows features every user has seen appear only sometimes, a discount banner and a profile menu. That makes the `if` feel natural, so the reader feels the temptation before hearing the rule. The bold sentence lands as the moral, right where the temptation is refused. The scene shows the exact moment of the crash, the click on Log in, and the Why explains the numbered list, so the rule has a reason the reader can see.

### Lecture 30: `useRef`

=========
BAD

A component remembers a value between renders with useState, and every change to that value renders the component again. useRef also keeps a value between renders, but without rendering again. Our code can save something now and still use it in a later click.

Say you have a product card where the user can switch shirt colors and then click Buy. You want to count how many times the user clicked around before buying, and send that number when they click Buy. The user never sees this number on the screen. It lives inside the product card component, and only the click handler of the Buy button reads it.

Why: A normal variable such as let clicks = 0 does not work. The moment the user switches the shirt color, React runs your component function again from the top, and clicks is back to 0. And useState is wasted work here, because every click would render the whole card again for a number nobody sees.

**Note for the AI:** This fails because it opens with a mechanism, remembering between renders, instead of the everyday fact behind it: some information never appears on the screen. The reader learns how `useRef` differs from `useState` before knowing why anyone would need it.

======

GOOD: notice the "why". It is an excellent example of reasoning that is crisp and clear, and it resolves the issue with simplicity and directness. Any junior developer can understand it.

> **A ref lets a component remember a value between renders, without drawing the screen again.**

In React, **not all information needs to appear on screen**. A component often needs to track information behind the scenes that never appears on the screen, like a background timer, a previous input value, or an analytics counter. Normally, we plug values into `useState` so the component remembers them between renders, but every call to its setter renders the component again. You do not need that for hidden data. This is why we have `useRef`. It keeps a value between renders without re-rendering the component, so your code can save something now and read it in a later click.

Take a product card where the user can switch shirt colors and then click **Buy**. Suppose you want to count how many times the user clicked around before buying, and send that number when they finally click **Buy**. Ask yourself: does the user ever see this counter on the screen? No, only the shirt color changes visually. The counter lives quietly inside the product card component, and only the **Buy** button's click handler reads it at the end.

**Why:** A plain JavaScript variable like `let clicks = 0` does not work here. Its memory is lost, and it restarts with every new render. In other words, it goes back to zero all the time. We need the value to survive between renders, but we do not want `useState` to trigger a new render either. See the problem? Using `useState` here is wasted work, because every click would force React to re-render the entire product card for a number nobody sees. `useRef` remembers the count across renders without triggering a single redraw.

**Note for the AI:** This works because the bold opening states a plain fact anyone accepts, not all information appears on screen, and three familiar cases make it concrete. The question "does the user ever see this counter?" lets the reader find the answer alone. The Why rules out the two tools the reader already knows, one at a time, then asks "See the problem?" so the reader feels the gap, and `useRef` arrives as the obvious answer.

### Lecture 31: a ref on a JSX tag

=====

BAD:


In plain JavaScript, you grab an element with document.getElementById and call its methods, such as focus(). In React, you never create the elements yourself, so there is nothing to grab. A ref on a JSX tag asks React to give you the real browser element it created, so our code can focus it, scroll it, or measure it.

Say you build a comment form with a text field and a Reply button. When the user clicks Reply, the blinking cursor should jump straight into the text field, so the user can start typing right away. The button and the text field sit in the same comment form component, and the click handler of the button needs the real <input> element.

Why: In React, you only return JSX tags like <input />, and React builds the real browser elements behind the scenes. JSX has no prop that says "put the cursor here now". To move the cursor, you must call the browser's own focus() method on the real <input> element.

**Note for the AI:** This fails because it opens with an API, `document.getElementById`, instead of the everyday need behind it: a page sometimes has to control an element directly. The scene never asks how the button reaches the text field, so the reader is not pulled into the problem.

====
POOR quality (suboptimal):

In React, a page often needs to directly control an element on the screen, like placing the blinking cursor inside a search box, scrolling down to a new chat message, or playing a video. In plain JavaScript, you grab the element from the page with `document.getElementById` and call its built-in browser methods, such as `focus()`. In React, you do not hunt through the document to grab elements manually. This is why we plug `useRef` into a JSX tag. A `ref` asks React to hand you the real browser element it created, so your code can focus it, scroll it, or measure it on command.

Take a comment form with a text box and a **Reply** button. When the user clicks **Reply**, the blinking cursor should jump straight into the text box so they can start typing right away. Ask yourself: how does the **Reply** button reach over and put the cursor inside that text box? Both the button and the text box sit in the same comment form component, and the button's click handler needs a direct connection to the real `<input>` element on the screen.

**Why:** In React, writing `<input />` in your code does not give you a real browser element in your hands. It is only a blueprint, and React builds the actual HTML element behind the scenes. At the same time, JSX has no prop that says "put the blinking cursor here right now." See the problem? Only the real browser element has the built-in `focus()` method, and only React controls that element. Attaching `useRef` to `<input ref={inputRef} />` tells React to put the real browser element right inside your ref once it is on the screen, so your click handler can call `inputRef.current.focus()` directly.

**Note for the AI:** This is close to the optimal version, but it ends the opening without tying the new tool back to what the reader already knows. The reader is left with a new idea and no bridge to `getElementById`, the tool they used before.

====

OPTIMAL QUALITY: notice the subtle differences, such as "It is the React equivalent of the classic getElementById" at the end. It works like a professor or adviser passing on the key concepts, connections, and reminders as pearls of wisdom. It is not always necessary at the end. Add another short conclusion or reminder where and when it suits best.

> **A ref allows you to take control of the browser elements via code.**

In React, a page often needs to **directly control an element on the screen**, like placing the blinking cursor inside a search field, scrolling down to a new chat message, or playing a video. In plain JavaScript, you grab the element from the page with `document.getElementById` and call its built-in browser methods, such as `focus()`. In React, you normally do not hunt through the document to grab elements manually. This is when we create a ref with `useRef` and attach it to a JSX tag with the `ref` attribute. A ref asks React to hand you the real browser element it created, so your code can focus it, scroll it, or measure it on command. It is the React equivalent of the classic `getElementById`.

Take a comment form with a text field and a **Reply** button. When the user clicks **Reply**, the blinking cursor should jump straight into the text field so they can start typing right away. Ask yourself: how does the **Reply** button reach over and put the cursor inside that text field? Both the button and the text field sit in the same comment form component, and the button's click handler needs a direct connection to the real `<input>` element on the screen.

**Why:** In React, writing `<input />` in your code does not give you a real browser element in your hands. It is only a blueprint, and React builds the actual HTML element behind the scenes. At the same time, JSX has no prop that says "put the blinking cursor here right now." See the problem? Only the real browser element has the built-in `focus()` method, and only React controls that element. Passing the ref to the tag, as in `<input ref={inputRef} />`, tells React to put the real browser element inside `inputRef.current` once it is on the screen, so your click handler can call `inputRef.current.focus()` directly.

**Note for the AI:** This works because it moves from three everyday needs, to the plain JavaScript tool the reader knows, to the React tool, and then closes the circle: a ref is the React equivalent of `getElementById`. That last sentence is the pearl of wisdom the reader keeps. The Why calls JSX "only a blueprint", which explains in one image why there is nothing to grab, and the final sentence shows the exact code that solves it.

### Lecture 32: `useEffect`

====

BAD


Until now, your code ran in two places: in the component body while React renders, and in an event handler when the user clicks. useEffect adds a third place. It runs code because a component appeared on the screen, and cleans that work up when the component leaves.

Say a page has a live chat window. The moment the chat window appears on the screen, it should connect to the chat server by itself, without any click. When the user closes it, it must disconnect, so it stops receiving messages in the background. The connection belongs to the chat window component: it starts when React puts that component on the screen and ends when React removes it.

Why: You cannot open the connection in the component body, because React runs the body on every render and would connect again each time. And you cannot put it in an onClick handler, because the user did not click anything. Showing the component on the screen is what starts the work.

**Note for the AI:** This fails because it opens with where code runs, an abstract map of the component, instead of the everyday tasks that must start by themselves. The reader gets the answer, a third place, before feeling the problem.

====

POOR QUALITY: notice it says "The connection belongs to the chat window component itself", which in the end confuses the `useEffect` with the window itself.

In React, a component often needs to start a background task automatically the moment it appears on the screen, like connecting to a live chat server, starting a ticking timer, or listening for window scroll events. Until now, our code only had two places to run: inside an event handler like `onClick` when the user clicks something, or right inside the component body while React renders. Neither place works when a task must start simply because a component showed up on the page. **This is why we have `useEffect`**. It gives your code **a third place to run: right after React puts the component on the screen**, with a built-in way to clean that work up when the component leaves.

Take a live chat window on a customer support page. The moment the chat window appears on the screen, it needs to connect to the chat server all by itself, without waiting for the user to click a Connect button. Later, when the user closes the chat window, it must disconnect so it stops receiving messages in the background. Ask yourself: where do we put the code that opens and closes this server connection? The connection belongs to the chat window component itself: it must start the moment React puts that component on the screen, and end the moment React removes it.

**Why:** Putting the server connection right inside the component body does not work here, because React runs the component function from the top on every single render. Which means every time the user types a single letter into the chat box, the component re-renders and opens a brand-new connection to the server all over again. On the other hand, we cannot put the connection inside an `onClick` handler either, because the user never clicked a button to connect. See the problem? We need the code to run automatically without a click, but we cannot let it run on every render either. `useEffect` solves this by running your connection code once when the component appears on the screen, and disconnecting cleanly when the component disappears.

**Note for the AI:** The question "where do we put the code?" is answered with "the chat window component itself", which is not an answer: the code is already in that component. The reader can confuse the component with the `useEffect` inside it.

===

GOOD


> **`useEffect` lets a component start a task by itself, automatically, when it appears on the screen, and stop it when it leaves.**

In React, a component often needs to **start a background task automatically** the moment it appears on the screen, like connecting to a live chat server, starting a ticking timer, or listening for window scroll events. Until now, our code only had two places to run:

- inside an event handler like `onClick` when the user clicks something,
- or right inside the component body while React renders.

Neither place works when a task must start simply because a component showed up on the page. This is why we have `useEffect`. It gives your code a third place to run: right after React puts the component on the screen, with a built-in way to clean that work up when the component leaves.

Take a live chat window on a customer support page. The moment the chat window appears on the screen, it needs to connect to the chat server all by itself, without waiting for the user to click a Connect button. Later, when the user closes the chat window, it must disconnect so it stops receiving messages in the background. Ask yourself: where do we put the code that opens and closes this server connection? The connection belongs to the chat window component itself, inside a `useEffect`: it must start automatically the moment React puts that component on the screen, and end the moment React removes it.

**Why:** Putting the server connection right inside the component body does not work here, because React runs the component function from the top on every single render. The component body is not a safe place for background tasks, because its code runs again on every render. This means that every time the user types a single letter into the message field of the chat window, the component re-renders and opens a brand-new connection to the server all over again. On the other hand, we cannot put the connection inside an `onClick` handler either, because the user never clicked a button to connect. The process needs to be automatic. See the problem? We need the code to run automatically without a click, but we cannot let it run on every render either. `useEffect` solves this by running your connection code after the component appears on the screen, and disconnecting cleanly when the component disappears.

**Note for the AI:** This works because three everyday background tasks come first, and the two places the reader already knows are listed one per line, so the reader sees at a glance why neither fits. The scene answers its own question precisely, "inside a `useEffect`", so nobody confuses the component with the Effect. The Why rules out the body and the click handler one at a time, with the exact cost of each: a new connection on every letter, or no click at all.

### Lecture 29: `useReducer` with context

====


BAD: poor explanation, idiosyncratic examples, an introduction without grounding in a familiar example. It tries to use the example of the chapter instead of introducing a general, easy-to-grasp example, etc.

useReducer together with context lets any component deep in the page read the state and change it, without the components in between passing props down.

Say a shop page has a header at the top that says Cart: 3 items. Far below, under Your cart, every row has a Delete button. The user clicks Delete on the Bread row, and at that same moment the header must change to Cart: 2 items.

Why: The cart lives in the component at the very top of the page. With props, that component must pass the cart and every click handler down through each component on the way, even the ones that never use them. If one component in the middle forgets to pass the Delete handler on, the click crashes and the Bread row stays on the page.

**Note for the AI:** This fails because it never says how components normally share data, props passed from parent to child, so the reader has nothing to compare the new tool with. Labels from the chapter's own example, such as "the Bread row", arrive before the reader knows the page, and the scene never says where the click sits among the components.

=====

GOOD

> **`useReducer` with context lets any component, however deep in the page, read and change the shared state without passing props.**

In React, different parts of a page often need to read and update the exact same data, like a shopping cart, a logged-in user profile, or a list of notifications. Normally, we store that shared state at the very top of the page and pass both the data and its update functions down through props, step by step, from parent to child. Passing props down this way, through layer after layer, is called prop drilling. You do not want to pass props by hand through layers of components that never even use them. **This is why we combine `useReducer` with Context**. Together, **they let any component deep in the page read the state and change it directly**, without the components in between passing props down.

Take an online shop where the header at the top says **Cart: 3 items**. Far below, inside the **Your Cart** section, every product row has a **Delete** button. When the user clicks **Delete** on an item, that row must disappear and, at that exact same moment, the top header must change to **Cart: 2 items**. Ask yourself: how does a **Delete** button buried deep inside a product row reach all the way back up to change the cart state at the top of the page? We call `useReducer` in the component at the top of the hierarchy, and Context carries the cart and its `dispatch` function down. So the top header and the deep **Delete** button work with the same cart, even with several layout components in between.

**Why:** Because both the header at the top and the list at the bottom need the cart, the cart state must live in the main component at the very top of the page. With ordinary props, that top component must hand the cart data and every click handler, such as `onAdd`, `onDelete`, and `onUpdate`, down through every single component along the way, even layout wrappers and sections that have nothing to do with the cart. Worse, if just one component in the middle forgets to pass the **Delete** handler down to the next child, clicking **Delete** crashes and the item is never deleted. It stays stuck on the page. See the problem? Forcing middleman components to carry props they do not use makes your code fragile and messy. Combining `useReducer` with Context solves this by letting the top component broadcast both the state and its `dispatch` function straight to the header and the **Delete** button, skipping every component in between.

**Note for the AI:** This works because it starts from data every app shares, a cart, a user profile, notifications, and from the normal way to share it, props from parent to child, named with React's own term, prop drilling. The fix comes in bold only after the reader feels the pain. The scene asks how a deep button reaches the top, and answers with where each piece lives: `useReducer` at the top, Context carrying the values down. The Why names the exact defect, a forgotten handler that makes the Delete click crash.
