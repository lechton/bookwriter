---
name: rewrite
description: "How to rewrite an existing chapter radically, with maximum simplicity and directness, from the owner's examples. Read it before any rewrite of a lecture."
---


Your role is to study source chapter, the final chapter of an existing lesson, in a series of lessons, and to rewrite it radically into different way. 

## Before writing, study carefully the following examples 


First, you need to understand the level of clarity and consistency that you need to study and adapt for the text that you will write. 

For this reason you need to study the following texts, as examplar, and get inspiration from their structure, logic, way of writing: 



````


## What is a Component  

What is a component? The components are the building blocks of the web application. For example, when a blog has a header on top and articles in the middle, and footer in the bottom, these are three components, they represent 3 parts of the web application. What is cool with components is you can reuse them. For example if you want a button you can create one component <Button> and reuse it every time you want to create a new button. Something that can be tricky is that components are nested. This means one component is inside another. This nesting can be many levels in, for example a button <Component> can be placed inside a component named <Card> which can be inside a component named <Sidebar> which rests in the left side of the website. And then in turn the <Sidebar> can be nested inside a <Main> component which has all the elements of the website. If you noticed so far all components in React start with capital leter, you are allowed to write <Article> but not <article>, why? Because small letter components can be confused with normal html. There is an existing <article> tag in html and if React allowed small letter components it could create confusion. 


## What is a Setter 

Code snippet: 
> const [name, setName] = useState("John")

What is a setter? In any programming language we need to be able to create variables and change variables. In Javascript you  create a variable  "name" and define it as "John". Then you can change the variable. The change is also called mutation. At any point, you can change name into "Peter", "Steven", or "Mary". You get the picture. You can do this with any programming language relatively simple. You cannot do this in React, at least not for the variables that matter. The most important variables, those that become part of the State of the component, which is the persitent memory of the component,  you cannot just define a new variable and then change it. You need a variable "name"? You need to put it inside a special function named `useState`. To define name as "John" you write useState("John"). To define name as "Peter" you write useState("Peter"). To define name as "Mary" you write useState("Mary"). But every time you do this, React gives you back also another function, the setter, which you need to use when you want to change the variable. So to mutate the variable name you need to say setName("John"). If you want to change it into "Mary" you need to write setName("Mary") etc. So to summarize, when you define new variable you write useState("John"). But when you change the existing variable you write the new value with a setter, e.g. setName("John"). You can name the variable and the setter as you like, but the convention in the React community is to name it variable and setVariable. 





### 1. What is state, and what is its setter? (reminder)

```jsx
const [item, setItem] = useState({ quantity: 1, giftWrap: false });
```

Until now, state held simple things: a number like `0`, or a name like `"John"`. But state can hold anything, including an object.

What is an object? It is one value that groups several named values, its fields. Think of a coffee mug in a shopping cart. It has a quantity (1 mug) and a gift wrap (yes or no). Instead of two separate variables, you put both fields inside one object: `{ quantity: 1, giftWrap: false }`.

The rules stay the same. `item` is the variable. `setItem` is the setter. When you want a change, you call `setItem`.

Something that can be tricky: the change does not happen on that line. React first calls your component again, and only then does `item` hold the new value.

### 2. What happens when you give the setter the same value? (reminder)

```jsx
setScore(2); // score is already 2
```

Every time you call a setter, React asks itself one question: "Is this the same value I already have?"

Say the score is 2 and you call `setScore(2)`. It is the same value, so React does nothing. There is no new render, and the screen stays the same. Why? Because the screen already shows 2. There is no work to do.

React checks this with a JavaScript tool called `Object.is`. Remember this question, "is it the same value?", because in this lesson it decides everything.

### 3. What is a mutation?

```jsx
item.quantity = 2;
```

A number cannot change from the inside: 0 is always 0. When you call `setScore(5)`, you do not turn 0 into 5. You replace it with 5.

An object is different. You can change one of its fields: `item.quantity = 2`. This is called a mutation. The object stays the same object, and only the field changes. `item.quantity++` and `item.quantity += 1` are mutations too.

Something that can be tricky: JavaScript allows this, and React does not stop you. There is no error and no warning. But you never called the setter, so React has no idea anything changed. The screen stays the same.

So in React, treat every object in state as read-only. You read it. You never write into it. You replace it.

### 4. What is the difference between the same object and a new object?

```jsx
setItem(item);                             // the same object
setItem({ quantity: 2, giftWrap: false }); // a new object
```

Remember React's question: "Is this the same value?" For an object, React never looks at the fields. It only asks: "Is this the very same object?"

So if you mutate `item` and then call `setItem(item)`, React sees the same object and does nothing. The quantity inside really is 2, but the card still says 1.

The curly braces `{ ... }` build a brand-new object. React sees a different object and renders. Now the card says 2.

And here is the strange part: the mutation does not disappear. It waits. The next time another click renders the card, such as `Add gift wrap`, the hidden quantity suddenly jumps onto the screen.

So to summarize: a changed object and a new object can hold the same numbers, but only the new object reaches the screen.

### 5. What is object spread?

```jsx
setItem({ ...item, giftWrap: true });
```

Writing every field by hand gets long. A mug with two fields is fine. A product with ten fields is not.

The three dots `...item` copy every field of `item` into the new object. You already saw them on JSX tags, like `<ArticleCard {...article} />` (Lesson 9). They do the same job here.

Why copy the old fields at all? Because a setter replaces the whole object. It does not merge. `setItem({ giftWrap: true })` throws away the whole old object and keeps only the gift wrap. The quantity is gone.

Something that can be tricky: order matters. JavaScript fills the new object from left to right, and the last value wins. `{ ...item, giftWrap: true }` turns the gift wrap on. `{ giftWrap: true, ...item }` copies the old `false` back over it. The rule is: spread first, change last.

### 6. What is local mutation? (reminder)

```jsx
const nextItem = { ...item };
nextItem.quantity = 2;
setItem(nextItem);
```

So is every `=` on an object forbidden? No.

If you just built a new object inside the same function, you can change it freely, because nobody else is looking at it yet. It is like packing a parcel before you hand it to the post office. Nobody has seen it, so nobody gets confused.

This code does exactly the same thing as `setItem({ ...item, quantity: 2 })`.

The catch is that the object must really be new. And what about everything inside it? Keep that question for the next definition.

### 7. What is a shallow copy?

```jsx
const item = {
  quantity: 1,
  delivery: { address: '12 Main Street', time: 'Morning' }
};
```

Sometimes an object holds another object. Here, `item` holds a `delivery` object.

Something that can be tricky: the outer object does not really contain the inner object. Its `delivery` field only holds a reference, the address of the inner object in memory. So there are two different objects, and one points at the other.

When you spread, `{ ...item }`, you get a new outer object, but only a copy of the reference. Both outer objects now point at the same `delivery` object. That is why it is called a shallow copy: it copies only the top level.

Reading is safe. Writing is not. `nextItem.delivery.time = 'Evening'` writes into the shared `delivery` object, so the starting object changes too. After that, `Start over` cannot bring back Morning.

The fix is to copy every object on the way down:

```jsx
setItem({ ...item, delivery: { ...item.delivery, time: 'Evening' } });
```

### 8. What is the event object? (reminder)

```jsx
function handleChange(e) {
  console.log(e.target.name, e.target.value);
}

<input name="message" onChange={handleChange} />
```

When the user clicks or types, React calls your handler and hands it the event object, usually named `e`. You never pass it yourself. React does.

`e.target` is the element where it happened. Until now, that was a button. Now it is an `<input>` field.

Every time the user types a letter, React calls `handleChange`. `e.target.value` is the text in the `<input>` field right now, like `Hi`. `e.target.name` is the `name` you wrote on the tag, like `message`.

The catch: `e.target.name` is just a string you wrote on the tag. It is not a field of `item`. It matches a field only if you make it match.

### 9. What is a computed property name?

```jsx
setItem({ ...item, [e.target.name]: e.target.value });
```

Usually you write the field name directly: `{ message: 'Hi' }`. But what if you only know the name when the code runs?

Square brackets solve this. Write `const field = 'message'`, and then `{ [field]: 'Hi' }` means: "read the variable first, and use its value as the name." The result is `{ message: 'Hi' }`.

Without the brackets, `{ field: 'Hi' }`, JavaScript reads no variable. It uses the word "field" itself, so you get a field literally named `field`.

What is cool: one handler can now serve every `<input>` field. Type in the field named `message`, and `item.message` changes. Type in the field named `recipient`, and `item.recipient` changes.

The catch: the `name` on the tag must match the field letter for letter. If you write `name="msg"`, the handler creates a new field that nothing reads. The `Message:` line on the card stays empty, and there is no error.

---




````

## Study good demo chapter

Please open and study with due care and diligence this example: 
[30-novel-v2.md](../../../01-02-md-LECTURES/v1/30-novel-v2.md)


It is a good working example 


## Study bad demo chapter 

Please open and study with due care and diligence this example: 
[17-gemini3.8.md](../../../01-02-md-LECTURES/v1/17-gemini3.8.md)

This example makes a serious effort to organize information in a desirable way, but it fails in so many ways, it reflects everything we need to avoid, it includes countless bad practices you need to avoid. It has serious problems in the end, practically unreadable. Large blocks of text that is straining the eyes and the intellect.

What to look for in it:
1. Definitions written as one paragraph of 1,000 to 2,100 characters, such as "The same object vs. a new object" and "A shallow copy". The reader cannot see where one step ends and the next begins.
2. The principle titles are puzzles in the user's voice, such as "I Clicked Start Over, So Why Does the Delivery Still Say Evening?". The reader cannot tell what each section teaches.
3. Images in place of the code's names: "A Parcel Label vs. What Is Inside the Parcel", "a To box".




## Study good demo titles 

When it comes to the titles of the sections of prinicples, in particular, you need to study these examples: 


Notice the detail:

BAD
You need a ref so each copy of a component keeps its own value

BAD
You need a ref so each copy of a component keeps its own value

BAD
You need a ref so each copy of a component keeps its own separate value

GOOD
useRef: each copy of the same component keeps its own separate value

Other good examples: 

useRef: the value survives every render
let inside a component: the value resets on every render
useState: every change renders again, so keep only what the screen shows
useRef: each copy of the same component keeps its own separate value
useRef: changing the value does not update the screen
`useRef(null)`: create an expensive object only once



## These are your intructions, how to write 

### WHAT TO DO
Rewrite the given chapter in a new way that is radical in its simplisity and directness.

### WHERE THE SOURCE COMES FROM AND WHERE THE RESULT GOES
- The source chapter is the lecture with the same number in React project 10: `projects/react-10/01-02-md-LECTURES/v1/{NN}.md`. It stays as it is.
- Write the rewrite in React project 11 under the normal name, the lesson number only: `projects/react-11/01-02-md-LECTURES/v1/{NN}.md`, such as `30.md`. The name `30-novel-v2.md` was only for the demo.
- If `{NN}.md` already exists in React project 11, archive it first from `projects/react-11` with `python3 archive_lecture.py {NN}`. Never write over it.
- Build it from `projects/react-11` with `node src/build-river.mjs {NN}`. This writes `01-03-md-lectures-HTML/v1/theme1/{NN}.html` and the PDF. Fix every violation the build lists.

### ROLE
- Remember: You are now in the wheels, fully responsible for ALL the content. You do not copy anything, you radically rewrite following the radical simplicity and direcness, but without missing information when pertinent. 
- Remember you run an experiment on maximum directness and clarity.
- When you rewrite, this skill and the good demo chapter come first. Where another skill in skills/v11.2/ says something complementary (that helps regulate various technical issues), you need discernment to follow the patterns established already. Three known cases: #2026_11_13_01_group_1
  1. **One real screen for every example**, from lecture/SKILL.md: a rewrite does not have to build every example on the same app from work, such as a shopping cart or a chat. Each idea may get its own simplest example. Browser previews still show what the code renders.
  2. **The principle card** comes right after the `## PRINCIPLE |` title, not at the end of the principle.
  3. **The principles table** is left out: `**PRINCIPLES:**` is a numbered list only.

### DESIGNS & DIAGRAMS
- You are free to redesign images and diagrams. 
- YOu do not need to build over a complex app that is chapter specific, you can just explain the concepts using radically simple examples, the ones any person could understand intuitively. You can play with examples in the chapter. 
- If you think UI browser is necessary, do not hesitate to render one. But keep in mind we need to keep directness and clarity in maximum way.



### ON TERMINOLOGY - AVOID SLOPPY TERMS
Bad Example: 
> What is a ref? NEW A ref is a small box that React keeps for your component. You create it with useRef: const countRef = useRef(0). You get back a plain object with one field, current, which starts at 0.
> 
You read it with countRef.current. You change it by simply writing into it: countRef.current = 5. There is no setter. It is a normal JavaScript object, so it works like one.
> 
> What is cool: React gives you back the very same box on every render. Whatever you wrote in it is still there next time.


Why it is bad: I have never, ever, used the term box because it means nothing. I it an object? is it a place on the screen? Box is what? It's a sloppy AI term that fills imaginary gaps of bad kind of simplicity. Be simple, not vague and sloppy! retain proper terms that a junior Javascript developer would recognise, in a language he would recognise as familiar and easy to understand. 



### Final instructions: 
rewrite the whole thing by

(a) studying the previous instructions here in this file 
(b) trying to avoid long introductions and always going straight to the point as the previous examples do
(c) be simple, clear but also precise, e.g. it is better to explain "it is an object" or "it is an <input> field, than "it is a box" that means nothing and is confusing. NEVER use tokens empty of meaning for simplicity, it creates confusion. 
(d) Try to be practical in a maximum way, to people who know how the basics in javascript works. e.g. this is an object, we mutate an object, but here is a problem, we need to create a new object, here is a function, we need to name this type of thing and then invoke this name when we need this to do this blabla.  
(e) Try to be hardcore pragmatic and realist, go stragiht to the point, then give the details needed to understand what is the underlying philosophy, but without endless specifications. No polution of technical terms.
(f) Imagine a senior developer, having a junior developer and explaining him on screen. How would a senior developer talk? How would he explain it? How would the senior developer start with the essence, something the other person can keep in his mind, and how he would repeat this in various places for memory retention.



## Ultimate Test

Before you approve each and every paragraph, each and every section, each and every sentence, ask yourself: 




[ ] Is this is how a senior developer would explain to a junior developer for him to understand what is REALLY going on? 

Bad Example: Put ref={inputRef} on a tag, and React puts the real element into inputRef.current. Then your event handler calls the browser's own methods on it, such as focus.

Comment: this is NOT how a senior developer would explain to a junior, in order to make sense 

Good example: "Remember getElementById? We use it in Javascript to grap elements, we can do something similar with React. In plain JavaScript, you grab the element yourself: document.getElementById('name'). In React, you never create the elements by hand. React creates them for you, from your JSX, so you have nothing to grab. A ref is how you ask React: 'When you create this <input>, give it to me!'. Eventually React puts it into inputRef.current. From then on, it is the same <input> element you know from plain JavaScript, for example you can call focus() on it. "

Plain javascript: document.getElementById('name').focus()
React: blabla (add code)

## How to start with the simple principle

Start the `VS` section with three short paragraphs in plain text, right under the `## VS |` heading. Never wrap this opening in a callout box.

1. **The principle in bold.** Say in one or two plain sentences what the tool lets our code do and why we need it. Write in normal spoken English: never cram clauses together with a semicolon, and never use cryptic shorthand like "otherwise let the browser hold it" or textbook jargon like "calculate derived values".
2. **One vivid everyday scene.** Give one concrete case on the screen that the reader can picture right away. Name the actual things on the page (such as First Name, Last Name, City, Email, and Password, or a shirt card with color buttons and a Buy button). Never glue two different scenes together with "Or say...", and never describe code variable names (`isSent`, `message`) or line positions ("before the second `useState` call runs").
3. **`**Why:**` the tools the reader already knows do not work here.** Stay inside that exact same scene. In two or three plain sentences, show why a normal `let` variable, `useState`, the component body, or `onClick` fails or does wasted work on that page.

Stop after **Why:**. Do not put **How** or **The catch** in the intro. The rest of the section teaches how it works and what to watch out for.

### Bad vs. Good Example 1: No semicolon shorthand, and name the real fields on the page (Lecture 40)

**Bad Example (rejected draft of Lecture 40):**
```markdown
**Keep a form field in state only when the page updates as the user types; otherwise let the browser hold it and read `FormData` at submit.**

Say you build a signup form with five fields, including a password field with a live strength meter underneath. Only the password meter changes on the screen while the user is typing.

**Why:** Creating five `useState` variables and five `onChange` handlers forces the form to re-render on every keystroke in any box. By keeping only `password` in state and reading the other four fields at submit with `FormData`, you skip four state variables and those extra renders.
```

*Why this fails:* The bold sentence crams two rules together with a semicolon and uses cryptic shorthand ("let the browser hold it"), and the scene says "five fields" without ever naming the other four boxes on the page.

**Good Example (approved Lecture 40):**
```markdown
**You do not need `useState` for every input box in a form. Put a field in state only when the screen changes as the user types, and read the rest at submit with `FormData`.**

Say you build a signup form with First Name, Last Name, City, Email, and Password. While the user types their name, city, or email, nothing else on the page changes. Only the Password box shows a live red-or-green strength bar under it as they type.

**Why:** If you create five `useState` variables for all five boxes, React redraws the whole form on every letter typed into Name, City, or Email. Instead, you only need `useState` for the password box. The browser already keeps the text inside the other four boxes until you read them at submit with `FormData`.
```

### Bad vs. Good Example 2: No textbook jargon, and stick to one scene instead of two (Lecture 34)

**Bad Example (rejected draft of Lecture 34):**
```markdown
**Use `useEffect` only to sync with something outside React; calculate derived values in the body, and handle user actions inside event handlers.**

Say a checkout page has two text boxes for the user's first name and last name, and shows their full name on the receipt below. Or say the user clicks a Buy button to send their order to the server.

**Why:** Saving the full name with `useEffect` forces React to render twice on every keystroke: once with the old full name, and again after the Effect runs. And putting the Buy request inside an Effect instead of `onClick` risks sending the order again whenever another piece of state changes.
```

*Why this fails:* The bold line reads like a compressed glossary ("calculate derived values in the body, and handle user actions inside event handlers"), and the scene splits the reader's attention across two unrelated stories ("Say a checkout page... Or say the user clicks a Buy button...").

**Good Example (approved Lecture 34):**
```markdown
**You do not need `useEffect` to calculate a value from state or to handle a button click. Calculate values right inside the component body, and put click code inside `onClick`.**

Say a checkout page has two text boxes for First Name and Last Name, and prints the full name on the receipt right below as the user types.

**Why:** Right after learning `useEffect`, it is tempting to create a third state variable for the full name and update it inside an Effect. That forces React to draw the screen twice on every letter: first with the old full name, and then again with the new one. When you can calculate a value straight from existing state, calculate it right in the component body.
```

### Bad vs. Good Example 3: Describe the page, not variable names or line numbers (Lecture 38)

**Bad Example (rejected draft of Lecture 38):**
```markdown
**Every Hook call must sit at the top level of your component, never inside an `if` or a loop, because React tracks Hooks by their call order.**

Say you build a feedback form with two state variables: `isSent` first, and `message` second. Once the user clicks Send, you try to return a Thank You screen early, before the second `useState` call even runs.

**Why:** React does not know your state variables by name; it only knows them by the order in which they run (first Hook, second Hook). When the early `return` skips the second `useState` on the next render, React's internal list falls out of order and React crashes with an error.
```

*Why this fails:* It asks the reader to trace two variable names (`isSent` and `message`) and the order of lines in a file before they even have a picture of the page in their head.

**Good Example (approved Lecture 38):**
```markdown
**Every Hook call must sit at the top level of your component, never inside an `if` or a loop, because React tracks Hooks by their call order.**

Say a store page needs a shopping cart only after the user logs in. In normal JavaScript, it feels natural to write an `if` check first and create the cart variable only inside that `if`. In React, the moment the user logs in and that `if` turns true, the whole page crashes.

**Why:** React does not remember your `useState` variables by the names you give them. It only keeps a numbered list in the exact order your component calls them: first Hook, second Hook, third Hook. If an `if` statement or early `return` skips a Hook on the next render, the list no longer matches your calls, and React crashes.
```

### More Approved Demos (Lectures 30, 31, and 32)

#### Demo 1 (Lecture 30: `useRef`)

```markdown
**`useRef` lets us keep a value between renders without redrawing the screen, so our code can save something now and still use it in another click later.**

Say you have a product card where the user can switch shirt colors and then click Buy. You want to count how many times the user clicked around before buying, and send that number when they hit Buy. The user never sees this counter on the screen.

**Why:** A normal variable like `let clicks = 0` inside the component will not work. The moment the user switches the shirt color, React runs your component function again from the top, and `clicks` resets to `0`. And `useState` is wasteful here, because every click would redraw the whole card for a number nobody sees on the screen.
```

#### Demo 2 (Lecture 31: Reaching a DOM node with a `ref`)

```markdown
**A ref on a JSX tag lets us reach the real browser element React created, so our code can focus it, scroll it, or measure it.**

Say you build a comment form with a text field and a Reply button. When the user clicks Reply, you want the blinking cursor to jump straight inside the `<input>` box so they can start typing right away.

**Why:** In React, you only return JSX tags like `<input />`, and React builds the real browser elements behind the scenes. JSX has no prop that says "put the cursor here right now." To move the cursor, you must call the browser's own `.focus()` method on the real `<input>` element. A ref is how you ask React to hand that element to you.
```

#### Demo 3 (Lecture 32: `useEffect`)

```markdown
**`useEffect` lets us run code simply because a component appeared on the screen, and clean that work up when the component leaves.**

Say you open a live chat box on a page. The moment the chat box appears on the screen, it should connect to the chat server by itself, without waiting for a button click. And when the user closes the chat box, it must disconnect so it does not keep receiving messages in the background.

**Why:** Until now, your code lived in two places: the component body or an `onClick` handler. You cannot open a server connection inside the component body, because React runs the body on every render and would reconnect on every keystroke. And you cannot put it inside an `onClick` handler, because the user did not click anything: showing the component on the screen is what starts the work.
```

