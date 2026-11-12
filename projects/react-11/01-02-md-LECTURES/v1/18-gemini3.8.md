# Lecture 18: Why Every Row in a List Needs a key from the Data

*(When a new email arrives at the top of the list, how does React know which row is which?)*

> INTERVIEW QUESTION | ❱ CORE | How do you render a list from an array, and why does React demand a stable key on every item?

---

## VS | The Index vs. an ID from the Data as the key: the index follows the position, the ID follows the email

First, let's set the two building blocks this lesson stands on:

> [!DEFINITION]
> **State and its setter.** [REVIEW] In plain JavaScript, you just write `emails.unshift(newEmail)`, and the job is done. Not in React. A value that must survive between renders lives in state, and state always comes as a pair: the state variable and its twin setter, born together in one line. So far, the state variable held a number, such as `score` in `const [score, setScore] = useState(0)`, or an object, such as `item` (Lesson 17). In this lesson it holds an array, a whole list of emails: `const [emails, setEmails] = useState(initialEmails)`. Here `emails` is the state variable, and `setEmails` is its twin setter. React holds this array for your component between renders. When a new email arrives, you do not push it into `emails`. You call the matching setter with a NEW array, `setEmails([newEmail, ...emails])`. The three dots you used on objects in Lesson 17 do the same job inside square brackets: they copy every old email into the new array, right after `newEmail`. So the new email comes first, and every old email follows in its old order. Lesson 19 covers every recipe for arrays in state. Here is the catch: `emails` does NOT change on that line. React queues a render and calls your component again. Only in that next render does `emails` hold the new list, with the new email at the top (Lesson 12).

> [!DEFINITION]
> **A commit.** [REVIEW] OK, we have seen that after a setter call, React calls your component AGAIN and gets back the new JSX. Then comes the commit: React puts the result into the real page. Pay attention here: React does NOT throw the old page away and build a new one. It compares the new JSX with the JSX of the last render, position by position, and when the same tag sits in the same position, it keeps the very same DOM node and changes only what is different, such as one line of text. Why does that matter? Because some things live inside the DOM node itself, and React never wrote them there. When the user ticks a checkbox that has no `checked` prop, the browser stores the tick in that checkbox's DOM node, just as a text box stores what the user types. Here is the good news: since React keeps the node, the tick survives every render. Here is the catch: the tick stays with the node, and React decides which node goes where. Keep this in mind, because in a list that changes, that decision is exactly where things go wrong (Lesson 13).

Imagine a webmail inbox. It has a heading, a `Check mail` button, and three emails. Each row has a checkbox, the sender in bold, and the subject:

```page width=text caption="The inbox on the first load."
heading: Inbox
form:
  button: Check mail
  check: Dentist: Appointment on Friday
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```

The emails of a real inbox come from the server as data, so the page must build one row for each email, however many there are:

> [!DEFINITION]
> **Rows from an array with `map`.** [NEW] So far, every list on our pages was written by hand: `<li>Dentist</li>`, `<li>Mom</li>`, `<li>Bank</li>`, one tag per line. That works for three fixed rows, but a real inbox shows whatever the server sends: three emails today, two hundred tomorrow. Nobody writes those tags by hand. You keep the data in an array, and you let JavaScript build the rows. That is the job of `map`. Look: `const senders = ['Dentist', 'Mom', 'Bank']`, then `senders.map(sender => <li>{sender}</li>)`. `map` takes the array, calls your arrow function once for EVERY item, from the first to the last, and collects what the function returns into a NEW array: `[<li>Dentist</li>, <li>Mom</li>, <li>Bank</li>]`. Same length, same order. And `senders` itself? Untouched. Who fills `sender`? `map` does: `'Dentist'` on the first call, `'Mom'` on the second, `'Bank'` on the third. Now put that call inside the curly braces of the list: `<ul>{senders.map(sender => <li>{sender}</li>)}</ul>`. React receives an array of JSX and renders every element in it, in order. Yes, it is the exact same page as the three tags written by hand! Here is the catch: as soon as the list appears, React prints an error in the Console, `Each child in a list should have a unique "key" prop.` The rows are on the screen, and yet React is not satisfied. Why React asks for a key, and what to put in it, is what this whole lesson is about (Lesson 18).

In plain JavaScript, when a new email arrives, you insert one new row at the top with `list.prepend(row)`. Every old row, with its tick, stays where it is. The job is done.

React breaks this habit.

In React, you never insert a row. You hand React the whole new list, and React must work out by itself which old row is which.

```jsx title="Handing React the whole new list"
~setEmails([newEmail, ...emails]);~ // React gets four emails and must match them with the three rows on the page
```

> [!DEFINITION]
> **A key.** [NEW] OK, we have seen that `map` hands React a whole array of rows, and that during the commit React keeps a DOM node when the same tag sits in the same position. But a list changes: a new email arrives at the top, one is deleted, the list is sorted. After the change, React gets a whole new array, and it must answer one question for every row: "Which row of the last render is this one?" By default, React answers with the position: the first row of the new list is the first row of the old list, the second is the second, and so on. A key replaces the position with a name. You write it on the tag that `map` returns: `<li key={email.id}>`. Now the row is not "the first row" anymore. If the Dentist email carries the ID 101 in the data, its row is "email 101", wherever it sits. A key is a string or a number, and it must be unique among siblings: two rows of the same list never share a key, but two different lists may use the same keys. Pay attention here: the key is NOT on the screen. The user never sees 101, and the Elements panel shows no `key` attribute on the `<li>`. React's docs say that the key is "only used as a hint by React itself": React uses it to match each row of this render with a row of the last render. Here is the catch: when React finds a key it already knows, it keeps that row's DOM node, with everything inside it, such as a tick, and only updates what changed. So the key decides where the tick goes. Moral of the story: the key must name the email, not its place in the list (Lesson 18).

React's docs state the rule in one sentence: "Keys tell React which array item each component corresponds to, so that it can match them up later."

Why does React need this rule? There are two reasons:

1. **React keeps DOM nodes.** During the commit, React reuses the nodes it already has and changes only what differs. To keep the right node with the right email, it must first match the rows. In the docs' words, "A well-chosen `key` helps React infer what exactly has happened, and make the correct updates to the DOM tree."
2. **Whatever lives inside a row goes with the match.** A tick, typed text, or the state of a component stays with the row React matched. In the docs' words, "Even if the _position_ changes due to reordering, the `key` lets React identify the item throughout its lifetime."

React's docs give the rules of keys in two parts:

1. **Unique among siblings.** In the docs' words, "Keys must be unique among siblings. However, it's okay to use the same keys for JSX nodes in _different_ arrays." In plain actions: two rows of the same list never share a key.
2. **Never changing.** In the docs' words, "Keys must not change or that defeats their purpose! Don't generate them while rendering." In plain actions: the Dentist row has the same key on every render.

**Beware! A key taken from the position follows the position, not the email: when a new email arrives at the top, every tick stays on its row number.**

### VS | A File Name vs. "the First File"

React's docs explain keys with an image: files on your desktop. This is an image, and it maps onto the code piece by piece. Imagine that the files had no names, only places: "the first file", "the second file", and so on.

In a component, the desktop maps onto the code like this:

1. **The folder is the list**, the `<ul>`.
2. **Each file is one row**, one `<li>`.
3. **"The first file, the second file" is the index**, the position of the row.
4. **The file name is the key**, such as `email.id`.
5. **You ask a colleague to delete "the first file"**, meaning the letter from the dentist. Before the colleague acts, a new file lands at the top. Now "the first file" is the new file, and the colleague deletes it. What breaks: the instruction is tied to a place, not to the file. A tick tied to key `0` does the same: it stays on whatever row sits first.
6. **With names, "delete the dentist letter" stays right**, wherever the file moves. That is a key from the data.

Names by place are completely fine when files never move, arrive, or leave. React's docs give the example of a poem: "This is a rare case where index as a key is acceptable because a poem's lines will never reorder."

### The user ticks Dentist, and after Check mail the tick sits on Shop

**Beware! A key taken from the position silences the Console error and leaves the bug in place.**

People tick emails all the time, to delete them, archive them, or mark them as read. And new mail arrives at the top while they work.

Let's see what a key taken from the position does to a real inbox. The list `emails` starts as Dentist, Mom, and Bank. The `Check mail` button adds Shop at the top with `setEmails([newEmail, ...emails])`. React printed the missing key error, so the developer gave each row a key. The developer took the second argument that `map` passes to the arrow function: the position of the item, named `index`:

```jsx title="src/components/Inbox.jsx" startLine="17"
{emails.map((email, index) => (
  <li ~key={index}~> {/* **WRONG:** the key is the position, 0, 1, 2 */}
    <input type="checkbox" /> <b>{email.sender}</b>: {email.subject}
  </li>
))}
```

The Console goes quiet. The user ticks Dentist:

```page width=text caption="The user ticks Dentist."
heading: Inbox
form:
  button: Check mail
  check: Dentist: Appointment on Friday | on
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```

Then the user clicks `Check mail`:

```page width=text caption="After Check mail with key={index}: the tick sits on Shop, and Dentist is unticked."
heading: Inbox
form:
  button: Check mail
  check: Shop: Your parcel has shipped | on | bad
  check: Dentist: Appointment on Friday | off | bad
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```

**The page now displays the tick on the wrong email.** The user ticked Dentist, never touched Shop, and Shop is the one ticked.

So what should the row have used? Here is the line that works:

**DO THIS:**

```jsx title="The line that works in Inbox" good="1"
<li key={email.id}>
```

Before any explanation, what do you notice? It looks strange. The tag gets a number that no user ever sees: `email.id`, which is 101 for Dentist. On the first load, the page looks exactly the same as before, and the Console was already quiet. So what can one number change?

And yet it works. The user ticks Dentist and clicks `Check mail`:

```page width=text caption="After Check mail with key={email.id}: Shop arrives unticked, and Dentist keeps its tick."
heading: Inbox
form:
  button: Check mail
  check: Shop: Your parcel has shipped | off | good
  check: Dentist: Appointment on Friday | on | good
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```

One new idea explains why:

> [!DEFINITION]
> **The index vs. an ID from the data.** [NEW] So, we have seen that every row needs a key, and that React matches rows by their key. Now the tricky part: what do you put in the key? `map` hands your arrow function a second argument, the position of the item in the array, which we name `index`: 0 for the first email, 1 for the second, 2 for the third. So many developers write `emails.map((email, index) => <li key={index}>...</li>)`, and the Console error disappears. That silences the warning, but is the list fixed? NO. React's docs say that the index is exactly "what React will use if you don't specify a `key` at all". `key={index}` only silences the error: the rows are still matched by position. Now compare `key={email.id}`: the key is 101 for Dentist, 102 for Mom, 103 for Bank, numbers stored in the data, and each number travels with its email. On the first load, both lists look exactly the same, and both Consoles are quiet. They are NOT the same thing! Let's catch it in action. The user ticks Dentist, the first row, and the browser stores that tick in the checkbox node of the first row. Then the user clicks `Check mail`, and Shop arrives at the top: Shop, Dentist, Mom, Bank. With `key={index}`, Shop now has key 0. Will Dentist keep its tick? NO! Why? Because React looks at key 0, finds the row it already had under key 0, keeps that DOM node, tick included, and only changes its text from Dentist to Shop. Dentist, now key 1, gets Mom's old unticked node. Mom, now key 2, gets Bank's old node. Bank, now key 3, gets a brand-new node. The tick stayed on the first row, and the first row now says Shop. Here is the good news: with `key={email.id}`, Shop arrives with a key React has never seen, 104. So React builds one new, unticked row at the top. Dentist still has key 101, so React keeps Dentist's node, tick included, and moves it down to the second row. Did you notice the detail? The index names a position, and a position belongs to whoever sits there. The ID names the email, and the email takes its tick along. So, do not confuse a key that silences the error with a key that names the email. Moral of the story: take the key from the data, an ID that never changes (Lesson 18).

Here is what React matched after the click on `Check mail`, row by row:

| Row after the click | With `key={index}` | With `key={email.id}` |
| :--- | :--- | :--- |
| **Shop** | Key 0: Dentist's old node, **with the tick** | Key 104: a new node, unticked |
| **Dentist** | Key 1: Mom's old node, unticked | Key 101: Dentist's old node, **with the tick** |
| **Mom** | Key 2: Bank's old node | Key 102: Mom's old node |
| **Bank** | Key 3: a new node | Key 103: Bank's old node |

**This bug hides well.** The Console stays quiet, and the first load is perfect. The bug needs two events in a row, a tick and then a new email, and a quick test on your own computer rarely does both. For real users, the cost is real. If the inbox had a `Delete selected` button, the next click would delete the Shop email, which the user never chose. The Dentist email would stay, with no error anywhere.

### The Rule of Thumb: name each row by its ID, and put the key where map returns

**Give every row a key that names the item, not its position: an ID from the data that never changes.** React's docs say it directly: "Instead, use a stable ID based on the data."

At the end of the day, a senior developer follows three rules:

1. **Need a key? Take the ID from the data.** `key={index}` and `key={email.id}` seem to do the same job: both make the Console error go away. They are NOT the same! The index follows the position, so a new email at the top takes the first row's tick. Skip this rule, and the tick lands on the wrong email with no error.
2. **No ID in the data? Make one once, when the item is created.** Write `id: nextId++` or `crypto.randomUUID()` in the handler that builds the email. Never write `key={Math.random()}`: it makes a new key on every render, so React rebuilds every row and every tick is lost.
3. **Moved the row into its own component? Put the key on the component tag inside `map`.** And if the child needs the ID, pass it again as a normal prop. Skip this rule, and the Console keeps asking for a key, or the child reads `undefined`.

## SECTION | The Inbox with a Check mail Button

Our project is a webmail inbox. It uses five files. The entry file mounts the root component inside StrictMode, `App` renders the inbox component, and `Inbox` holds the list of emails. From Principle 3 on, each row comes from its own component, `EmailRow`:

```files title="inbox: File Explorer" caption="How the files of our inbox sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and imports `Inbox` from `./components/Inbox.jsx`
  components/
    Inbox.jsx | state | Exports `Inbox` as default and holds `emails`, `handleCheckMail`, and the list
    EmailRow.jsx | child | Exports `EmailRow` as default and returns one `<li>`, from Principle 3 on
```

Principle 1 starts with the heading and the list. Principle 2 adds the `Check mail` button, and each principle after it changes one part of this same inbox:

```page width=text caption="The finished inbox on the first load."
heading: Inbox
form:
  button: Check mail
  check: Dentist: Appointment on Friday
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```

**PRINCIPLES:** React matches the rows of a list by their key, and it keeps the DOM node of every row it matches. Four practical principles follow from that:

1. **Principle 1: Always Return the Row from `map`.** Curly braces right after `=>` open a block body that returns nothing, so the list renders empty. Write the row in parentheses, or write `return`.
2. **Principle 2: Always Take the key from the Data, Never from the Index.** The index follows the position, so a new email at the top takes the first row's tick. Use `key={email.id}`, and never make a key during the render.
3. **Principle 3: Put the key Where `map` Returns.** Once the row is its own component, the key belongs on the `<EmailRow />` tag inside `map`, rather than on the list item tag inside the child.
4. **Principle 4: Never Read `key` Inside the Child.** React keeps the key for itself, so the child reads `undefined`. Pass the same value again as `id`.

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Always Return the Row from `map`** | The inbox shows its heading and an empty list, with a quiet Console. | After `=>`, a parenthesis returns the row, and a curly brace needs `return`. |
| **Principle 2** | **Always Take the key from the Data, Never from the Index** | The user ticks the first email, and after `Check mail` the tick sits on the new email, with a quiet Console. | Write `key={email.id}`, and make new IDs once, in the handler that creates the item. |
| **Principle 3** | **Put the key Where `map` Returns** | The Console still asks for a key after the developer wrote one on the `<li>`. | Write `<EmailRow key={email.id} />` inside `map`. |
| **Principle 4** | **Never Read `key` Inside the Child** | Every row gets the id `mail-undefined`, and clicking any email activates the first one. | Pass `id={email.id}` next to `key={email.id}`, and read `id` in the child. |

---

## PRINCIPLE | I Mapped Three Emails, So Why Is My Inbox Empty?

> [!PRINCIPLE]
> **Principle 1: Always Return the Row from `map`: a Curly Brace After `=>` Needs `return`**
>
> *When rendering a list with `map`, do not just open curly braces after `=>` to format a multiline element. You cannot simply write `item => { <li>...</li> }`: this returns nothing. You must either wrap the element in parentheses, `item => ( <li>...</li> )`, or write an explicit `return` inside the curly braces. What if you open curly braces and forget `return`? The arrow function returns `undefined` for every item in the array, rendering an empty list while the Console stays completely quiet.*
>
> When you transform an array of data with `map`, you expect each item to render one element on the screen. However, when an element grows multiline and you open curly braces right after `=>` for formatting, the list on screen suddenly renders completely blank. Why? Because in JavaScript, curly braces right after an arrow do not group JSX; they open a standard function block body. Unlike concise arrow functions that return an expression automatically, a block body returns nothing unless you write an explicit `return` statement. Without `return`, the function creates the JSX element, drops it, and returns `undefined`. Because `map` gathers each return value into a new array, it hands React an array full of `undefined`. React silently renders nothing for `undefined`, producing no errors and no warnings in the Console—just an unexpectedly empty list. The solution is straightforward: ensure the arrow function actually returns the element. Wrap your multiline JSX in parentheses to group it as an implicit return expression, or keep the curly braces and add `return` before the element. Both approaches produce identical, correct results.
>
> **DO THIS:**
> ```jsx
> {items.map(item ~=> (~ // Parentheses after =>: the arrow implicitly returns the element, so rows render properly
>   <li><b>{item.sender}</b>: {item.subject}</li>
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {items.map(item ~=> {~ // **WRONG:** Curly braces open a block body with no return, so map gathers undefined for each item
>   <li><b>{item.sender}</b>: {item.subject}</li>;
> })}
> ```

Before we open the inbox file, here is the smallest `map` that works. It uses the short arrow function you know (as seen in Lesson 16):

```jsx title="One row per email, with a short arrow function"
emails.map(email => ~<li>{email.sender}</li>~) // Returns one <li> per email
```

Now here is the inbox in its files. `App` only renders the inbox:

```jsx title="src/App.jsx"
import ~Inbox~ from './components/Inbox.jsx'; // The inbox component from the components folder

export default function App() {
  return <Inbox />;
}
```

`Inbox` holds the emails in a constant above the component. A real row needs a checkbox, a sender, and a subject. That does not fit on one line, so the developer wants more room and opens curly braces right after the arrow. The marked line is the mistake:

```jsx title="src/components/Inbox.jsx"
const emails = [
  { id: 101, sender: 'Dentist', subject: 'Appointment on Friday' },
  { id: 102, sender: 'Mom', subject: 'Dinner on Sunday?' },
  { id: 103, sender: 'Bank', subject: 'Your statement is ready' },
];

export default function Inbox() {
  return (
    <section>
      <h1>Inbox</h1>
      <ul>
        {emails.map(~email => {~ // **WRONG:** a curly brace after => opens a block body, and there is no return
          <li>
            <input type="checkbox" /> <b>{email.sender}</b>: {email.subject}
          </li>;
        })}
      </ul>
    </section>
  );
}
```

**Where did `email` come from?** No line declares it. `map` passes the first email on the first call, the second on the second, and the third on the third.

The developer saves the file and reloads the page:

```page width=text caption="With curly braces and no return: the heading, and an empty list."
heading: Inbox
empty: no rows on the page
console: quiet
```

The Elements panel shows the list, and nothing inside it:

```dom caption="The Elements panel with curly braces and no return: an empty ul."
<section>
  <h1>Inbox</h1>
  ! <ul></ul> | note: no li at all
</section>
```

**The page now displays an empty inbox**, and the Console says nothing. So the developer suspects the data. But the three emails are right there in the array. The problem is the curly brace after `=>`:

> [!DEFINITION]
> **A block body.** [NEW] Remember the short arrow function `s => s + 1` (Lesson 16)? It returns what comes right after `=>`, with no `return` written. React's docs call this an implicit return. `map` works perfectly with it: `email => <li>{email.sender}</li>` returns one `<li>` for every email. But a row with a checkbox, a sender, and a subject does not fit on one line, so developers want more room, and they open curly braces right after the arrow: `email => { ... }`. Pay attention here: curly braces right after `=>` do NOT group the JSX. They open a block body, a function body like any other, and a function body returns nothing unless you write `return`. So `email => { <li>{email.sender}</li> }` builds the `<li>`, throws it away, and returns `undefined`. Let's catch it in action: three emails, three calls, and `map` hands React `[undefined, undefined, undefined]`. Will React complain? NO. React draws nothing at all for `undefined` (Lesson 3), so the inbox shows its heading and an empty list, with zero errors and zero warnings in the Console. Here is the good news: two fixes work, and they are the exact same thing. Keep the curly braces and write `return`: `email => { return <li>...</li>; }`. Or replace the curly braces with parentheses: `email => ( <li>...</li> )`. Parentheses only group the JSX, so the arrow still returns it. Moral of the story: after `=>`, a parenthesis returns the row, and a curly brace needs `return` (Lesson 18).

Compare the three ways to open the row after `=>`:

```jsx title="Parentheses vs. curly braces after =>"
emails.map(email ~=> (~ <li>...</li> )) // Parentheses group the JSX: three rows
emails.map(email ~=> {~ return <li>...</li>; }) // Curly braces with return: three rows
emails.map(email ~=> {~ <li>...</li>; }) // **WRONG:** curly braces with no return: three times undefined
```

It looks almost the same, but it is NOT the same thing! The second line differs from the third by one word, `return`. The first line differs from the third by two characters: parentheses instead of curly braces. The first two lines do the exact same thing, and the third renders an empty list.

Using `forEach` creates the same empty list. Although `forEach` runs its function for every item, it always returns `undefined`, leaving no array of rows for React to render. Only `map` collects what the arrow function returns.

The fix replaces the curly braces with parentheses:

```jsx title="src/components/Inbox.jsx" startLine="11"
<ul>
  {emails.map(~email => (~ // Parentheses: the arrow returns the <li>
    <li>
      <input type="checkbox" /> <b>{email.sender}</b>: {email.subject}
    </li>
  ))}
</ul>
```

Save the file, reload the page, and the three rows appear. So does the error from the start of the lesson:

```page width=full caption="With parentheses: three rows, and the missing key error in the Console."
heading: Inbox
form:
  check: Dentist: Appointment on Friday | off | good
  check: Mom: Dinner on Sunday? | off | good
  check: Bank: Your statement is ready | off | good
console: Each child in a list should have a unique "key" prop. Check the render method of `Inbox`.
```

The rows are right. The missing key is the job of Principle 2.

---

## PRINCIPLE | I Ticked Dentist, So Why Is Shop Ticked Now?

> [!PRINCIPLE]
> **Principle 2: Always Take the key from the Data, Never from the Index: A Stable ID Follows the Item**
>
> *Do not silence React's missing key warning by passing the array index. Writing `key={index}` removes the warning in the Console, but leaves a severe state-corruption bug in place. You must use a stable ID from your data, such as `key={item.id}`. What happens if you use the array index and insert a new item at the top of the list? Any local DOM state belonging to an existing item, such as a checked box or typed text, will jump to the new item.*
>
> When a user interacts with a list item by checking a checkbox or typing into an input, the browser stores that state inside the underlying DOM node. During a re-render, React reuses existing DOM nodes by matching elements across renders using their keys. If you assign the array index as the key (`key={index}`), you tie each DOM node to an array slot (0, 1, 2) rather than to the actual data item. When a new item is prepended to the top of the list, that new item takes index 0. React looks for key 0, finds the existing DOM node from the previous render, reuses that node along with its checked state, and merely updates the text to show the new item. The original item, now pushed to index 1, receives the second row's node. To the user, the checkmark appears to have jumped to the newly added item. Even worse is generating keys dynamically during render, such as `key={Math.random()}`. Because every render produces entirely new keys, React cannot match any existing nodes; it discards and rebuilds every single DOM node on every render, wiping out all user input. The solution is straightforward: always use a stable, unique ID directly from the data (`key={item.id}`). Because that ID stays with the specific item regardless of its position in the array, React moves the existing DOM node along with its input state to its new position, while creating a clean, unticked node for the newly inserted item.
>
> **DO THIS:**
> ```jsx
> {items.map(item => (
>   <li ~key={item.id}~>{item.title}</li> // A stable ID from data: the item keeps its key and its DOM state wherever it moves
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {items.map((item, index) => (
>   <li ~key={index}~>{item.title}</li> // **WRONG:** Key is the array position: a new item inserted at index 0 steals the first item's DOM state
> ))}
>
> {items.map(item => (
>   <li ~key={Math.random()}~>{item.title}</li> // **WRONG:** A new key on every render destroys and recreates all nodes, wiping out user input
> ))}
> ```

Now the inbox gets its `Check mail` button. A click must add a new email to the screen, so the list moves into state. The starting array stays above the component as `initialEmails`, and a counter, `nextId`, gives each new email its ID. The developer silenced the missing key error with the index. The marked line is the mistake:

```jsx title="src/components/Inbox.jsx"
import { useState } from 'react';

const initialEmails = [
  { id: 101, sender: 'Dentist', subject: 'Appointment on Friday' },
  { id: 102, sender: 'Mom', subject: 'Dinner on Sunday?' },
  { id: 103, sender: 'Bank', subject: 'Your statement is ready' },
];

let ~nextId = 104~; // The ID of the next new email

export default function Inbox() {
  const [emails, setEmails] = useState(initialEmails);

  function handleCheckMail() {
    const newEmail = { id: nextId++, sender: 'Shop', subject: 'Your parcel has shipped' };
    setEmails([newEmail, ...emails]);
  }

  return (
    <section>
      <h1>Inbox</h1>
      <button onClick={handleCheckMail}>Check mail</button>
      <ul>
        {emails.map((email, index) => (
          <li ~key={index}~> {/* **WRONG:** the key is the position, so it moves to whoever sits there */}
            <input type="checkbox" /> <b>{email.sender}</b>: {email.subject}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

**Where did these values come from?**

1. **`index`:** no line declares it. `map` passes the position of the item as the second argument of the arrow function.
2. **`104` for Shop:** no line writes 104 into the email. The expression `nextId++` reads the current value starting at 104, assigns it to the new email, and increments the counter so the following email receives 105.
3. **The old emails in the new array:** `...emails` copies them in after `newEmail` (as seen in Lesson 17).
4. **The tick:** no line of our code writes it. The browser stores it in the checkbox's DOM node.

The user ticks Dentist and clicks `Check mail`. The result is the bug from the start of the lesson. The table there shows the matching row by row: key 0 keeps Dentist's old node, tick included, and gets Shop's text.

The fix is one attribute. The key comes from the data:

```jsx title="src/components/Inbox.jsx" startLine="23"
{emails.map(email => (
  <li ~key={email.id}~> {/* The key names the email: 101, 102, 103, and 104 for Shop */}
    <input type="checkbox" /> <b>{email.sender}</b>: {email.subject}
  </li>
))}
```

Save the file, reload the page, tick Dentist, and click `Check mail` again:

::: row caption="Tick Dentist, then Check mail, when the key is the index vs. when the key is the ID from the data."
::: col title="key={index}" tag="the tick follows the position" tone=bad
```page size=mini
heading: Inbox
form:
  button: Check mail
  check: Shop: Your parcel has shipped | on | bad
  check: Dentist: Appointment on Friday | off | bad
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```
Key 0 kept Dentist's old node with its tick, and that node now shows Shop.
:::
::: col title="key={email.id}" tag="the tick follows the email" tone=good
```page size=mini
heading: Inbox
form:
  button: Check mail
  check: Shop: Your parcel has shipped | off | good
  check: Dentist: Appointment on Friday | on | good
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```
Key 104 is new, so React builds one unticked row. Key 101 keeps Dentist's node and its tick.
:::
:::

Compare one more pair. The page with no key at all and the page with `key={index}` match the rows the exact same way, by position. Only the Console differs: with no key, React prints the missing key error, and with `key={index}`, it prints nothing.

**Beware! A key made during the render is new on every render, so React matches no row at all.**

A teammate sees that the index moves to another email, and wants a key that is always unique:

```jsx title="src/components/Inbox.jsx" startLine="24"
<li ~key={Math.random()}~> {/* **WRONG:** a new random number on every render */}
```

The user ticks Dentist and clicks `Check mail`:

```page width=text caption="After Check mail with a random key: every checkbox is unticked."
heading: Inbox
form:
  button: Check mail
  check: Shop: Your parcel has shipped
  check: Dentist: Appointment on Friday | off | bad
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```

**The page now displays no tick at all.** The user's tick is gone, and the Console is quiet. Here is what happens after the click:

1. The first render gave each row a random key.
2. Clicking Check mail causes React to call `Inbox` again, and `Math.random()` produces four brand-new numbers.
3. React finds none of the old keys, so it removes the three old rows with their DOM nodes, tick included.
4. React builds four new rows, all unticked.

React's docs describe exactly this: "This will cause keys to never match up between renders, leading to all your components and DOM being recreated every time. Not only is this slow, but it will also lose any user input inside the list items."

So where does the new email get a key that is unique and stays the same? From the handler:

```jsx title="An ID made once vs. a key made on every render"
const newEmail = { ~id: nextId++~, sender: 'Shop', subject: 'Your parcel has shipped' }; // Runs once, when the email is created
<li ~key={Math.random()}~> {/* **WRONG:** runs on every render, and gives a new number every time */}
```

They are NOT the same thing! `nextId++` runs once, inside the click handler that creates the email, and the number stays in the email. `Math.random()` runs inside the JSX, so every render makes a new key.

---

## Where to Get Your key

Principle 2 leaves one practical question: where does the key come from? React's docs list the sources in a section called "Where to get your `key`". Developers really choose between three:

1. **An ID from the database.** In the docs' words, "If your data is coming from a database, you can use the database keys/IDs, which are unique by nature." Emails from a server already carry an ID, so `key={email.id}` is the everyday case.
2. **An ID made once, when the item is created.** In the docs' words, "use an incrementing counter, `crypto.randomUUID()` or a package like `uuid` when creating items." It fits data made in the browser, such as a note the user writes. In our inbox, it is `nextId++` inside `handleCheckMail`.
3. **The index, only for a list that never changes.** It works when the list never changes order, never gets an item inserted or removed, and holds nothing the user marks or types. The docs' poem is that case: "This is a rare case where index as a key is acceptable because a poem's lines will never reorder."

---

## PRINCIPLE | I Gave the li a key, So Why Does the Console Still Ask for One?

> [!PRINCIPLE]
> **Principle 3: Put the key Where `map` Returns: on the Outermost Element in the Loop, Never Inside the Child Component**
>
> *When extracting a list item into its own component, do not place the key on the root element inside that component. Writing `<li key={id}>` inside the child component does not work. You must place the key on the component tag itself, directly where `map` returns it: `<ListItem key={item.id} />`. What happens if you leave the key inside the child? React warns that each child in the list needs a key, ignores the key inside the child, and falls back to matching list items by array index.*
>
> When refactoring code, developers frequently extract repeated row markup into a dedicated child component. It is tempting to move the entire snippet—including the key attribute—into the child component's JSX. However, React only looks for keys on the immediate elements returned by `map`. Those elements are the siblings in the array that React must distinguish and match across renders. When `map` returns `<ListItem />`, the sibling elements in the loop are the `<ListItem />` tags. If they lack a key, React sees a list of un-keyed siblings and issues a warning in the Console. Placing a key on the `<li>` inside the child component does nothing, because that child component renders only a single `<li>`, not an array of siblings. React simply ignores that inner key and defaults to matching the list items by position. The solution is straightforward: always keep the key on the outermost JSX tag returned directly inside the `map` callback. If each data item renders multiple adjacent elements instead of a single wrapper, wrap them in a React Fragment and place the key on the fragment: `<Fragment key={item.id}>`.
>
> **DO THIS:**
> ```jsx
> {items.map(item => (
>   <ListItem ~key={item.id}~ item={item} /> // The key sits on the outermost element returned by map
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ListItem({ id, item }) {
>   return <li ~key={id}~>{item.title}</li>; // **WRONG:** Inside the child there is no list of siblings, so the key is ignored
> }
> ```

The row grows, so the team moves it into its own file, `EmailRow.jsx`. Before the move, one reminder:

> [!DEFINITION]
> **Props.** [REVIEW] OK, we have seen how a component returns the JSX of its own part of the page. When a parent renders a child, it passes information down as attributes on the child's tag: `<EmailRow sender="Dentist" subject="Appointment on Friday" />`. These attributes are the props. React packs them into one object and hands that object to the child as its first argument, and the child unpacks the names it needs with curly braces: `function EmailRow({ sender, subject })`. Here is the catch: the child sees ONLY what the parent wrote on its tag. Inside `EmailRow`, there is no `email` and no `emails`. So when a row moves out of `map` and into its own file, every value it reads must arrive on its tag (Lesson 8).

Because `EmailRow` cannot see the original email object, the developer passes its properties as props and attaches the key to the inner list item:

```jsx title="src/components/EmailRow.jsx"
export default function EmailRow({ id, sender, subject }) {
  return (
    <li ~key={id}~> {/* **WRONG:** this li is not in a list here, EmailRow returns only one */}
      <input type="checkbox" /> <b>{sender}</b>: {subject}
    </li>
  );
}
```

In `Inbox`, `map` now returns the component tag, with no key:

```jsx title="src/components/Inbox.jsx" startLine="25"
{emails.map(email => (
  ~<EmailRow~ id={email.id} sender={email.sender} subject={email.subject} /> // **WRONG:** the element map returns has no key
))}
```

**Where did `EmailRow` come from?** From the import line at the top of the inbox file, which brings `EmailRow` in from its own file.

The developer reloads the page:

```page width=full caption="With the key on the li inside EmailRow: the rows look right, and the Console still asks for a key."
heading: Inbox
form:
  button: Check mail
  check: Dentist: Appointment on Friday
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: Each child in a list should have a unique "key" prop. Check the render method of `Inbox`.
```

**The Console still asks for a key**, and it names `Inbox`, not `EmailRow`. React looks for keys on the elements that `map` returns, because those are the siblings of the list. Here they are three `<EmailRow />` elements, with no key. The `key` attribute on the inner list item sits inside a component that returns only a single tag, so React completely ignores it. And with no key on `<EmailRow />`, React matches the rows by position again, as with `key={index}`.

Compare the two places the key can sit:

```jsx title="The key inside EmailRow vs. the key on EmailRow"
<li ~key={id}~> {/* **WRONG:** inside EmailRow, where there is no list */}
<EmailRow ~key={email.id}~ sender={email.sender} subject={email.subject} /> {/* Inside map, on the element map returns */}
```

They are NOT the same thing! Only the element that `map` returns is a sibling in the list. Before the move, that element was `<li key={email.id}>`. After the move, it is `<EmailRow key={email.id} />`. It is the exact same rule: the key goes on whatever `map` returns. React's docs give the same advice: "when you extract a component, don't forget to leave the `key` outside the JSX you copy and paste."

The fix moves the key back to `map`. `EmailRow` loses both the key and the `id` prop, because it does not use the ID yet:

```jsx title="src/components/EmailRow.jsx"
export default function EmailRow({ sender, subject }) {
  return (
    ~<li>~ {/* No key here: EmailRow returns one li, not a list */}
      <input type="checkbox" /> <b>{sender}</b>: {subject}
    </li>
  );
}
```

```jsx title="src/components/Inbox.jsx" startLine="25"
{emails.map(email => (
  <EmailRow ~key={email.id}~ sender={email.sender} subject={email.subject} /> // The key on the element map returns
))}
```

Save the file and reload the page. Nothing changes on the screen, and the Console is quiet:

```page width=text caption="With the key on EmailRow inside map: the same rows, and a quiet Console."
heading: Inbox
form:
  button: Check mail
  check: Dentist: Appointment on Friday
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```

The Elements panel shows the `<li>` that `EmailRow` returns. The key is nowhere in it:

```dom caption="The Elements panel with the key on EmailRow: each li, and no key attribute."
<ul>
  + <li><input type="checkbox"> <b>Dentist</b>: Appointment on Friday</li> | note: no key attribute
  <li><input type="checkbox"> <b>Mom</b>: Dinner on Sunday?</li>
  <li><input type="checkbox"> <b>Bank</b>: Your statement is ready</li>
</ul>
```

The same rule holds when one email must give two siblings instead of one row, such as a heading and a paragraph. Then `map` returns a Fragment, and the Fragment takes the key. Only the long form, `<Fragment>`, imported from `'react'`, can take it. The short form `<>...</>` takes no attributes (as seen in Lesson 2):

```jsx title="Two siblings per email: the key goes on Fragment"
{emails.map(email => (
  <~Fragment key={email.id}~> {/* The element map returns, so the key goes here */}
    <h2>{email.sender}</h2>
    <p>{email.subject}</p>
  </Fragment>
))}
```

---

## PRINCIPLE | I Gave Every Row a key, So Why Does the Child Get undefined?

> [!PRINCIPLE]
> **Principle 4: Never Read `key` Inside the Child Component: Pass the Identifier Explicitly as a Prop**
>
> *Do not try to read `key` from props inside a child component just because you wrote `key={item.id}` on its tag. You cannot write `function ListItem({ key })`: React reserves `key` for its own internal matching and strips it before passing props to the child. If the child component needs the identifier, pass it explicitly under another prop name, such as `id={item.id}`. What happens if you try to access `key` inside the child? The value resolves to `undefined`, React logs an error in the Console, and any logic relying on that identifier fails.*
>
> When a child component needs an item's unique identifier—for instance, to generate an HTML `id` attribute that pairs an `<input>` with a `<label>`—it is natural to assume that `key` is accessible like any standard prop. However, `key` is not a prop; it is a private instruction for React itself. React consumes the key to track elements across renders and deliberately excludes it from the component's `props` object to keep framework tracking separate from application logic. If a child component attempts to read `key`, it receives `undefined`, and React issues a clear warning in the Console. If that identifier is used to build DOM IDs, such as `'item-' + key`, every rendered item receives the identical ID `'item-undefined'`. Multiple form controls and labels end up sharing the same ID, causing clicks on later items to activate the very first item on the page. The solution is straightforward: pass the value under two separate attributes for two separate jobs. Use `key={item.id}` to inform React how to reconcile the list item, and use `id={item.id}` to deliver the identifier to your component logic as a standard prop.
>
> **DO THIS:**
> ```jsx
> <ListItem key={item.id} ~id={item.id}~ title={item.title} /> // key is for React; id is passed to the component as a regular prop
>
> function ListItem({ ~id~, title }) { // The child reads id, receiving the actual unique identifier
>   const inputId = 'item-' + id;
>   return <input id={inputId} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ListItem({ ~key~, title }) { // **WRONG:** key is reserved by React and will evaluate to undefined
>   const inputId = 'item-' + key; // Every rendered item receives the broken ID 'item-undefined'
> }
> ```

The team wants a click on the sender or the subject to tick the box. So the text goes inside a `<label>`, linked to the checkbox with `htmlFor`. `htmlFor` points at its checkbox by the checkbox's id, so every row needs its own id, such as `mail-101`. The row already has `key={email.id}`, so the developer reads the key inside `EmailRow`:

```jsx title="src/components/EmailRow.jsx"
export default function EmailRow({ ~key~, sender, subject }) { // **WRONG:** EmailRow never receives key
  const inputId = 'mail-' + key;
  return (
    <li>
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}><b>{sender}</b>: {subject}</label>
    </li>
  );
}
```

The developer reloads the page, and the Console shows an error at once. Then the user clicks the text `Mom: Dinner on Sunday?`:

```page width=full caption="With key read inside EmailRow: a click on Mom's text ticks Dentist, and the Console shows an error about key."
heading: Inbox
form:
  button: Check mail
  check: Dentist: Appointment on Friday | on | bad
  check: Mom: Dinner on Sunday? | off | bad
  check: Bank: Your statement is ready
console: EmailRow: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)
```

**The page now ticks the wrong email.** The user clicked Mom, and Dentist is ticked. The error names the reason:

> [!DEFINITION]
> **`key` is not a prop.** [REVIEW] OK, we have seen that every attribute on a component tag becomes a prop. Well... almost every attribute. `key` is the famous exception. React reads `key` for itself, to match the rows, and removes it before it builds the props object. So `<EmailRow key={email.id} sender="Dentist" />` gives `EmailRow` one prop only: `sender`. Will `EmailRow` find 101 if it unpacks `{ key }`? NO, it gets `undefined`, and React prints an error in the Console that starts with `EmailRow:` and says that `key` is not a prop. Why does React keep it? Because a key is a hint for React, not data for your component. React's docs say it is important "to separate app logic from hints to React". Here is the good news: if the child needs the same value, you pass it again, under a normal name: `<EmailRow key={email.id} id={email.id} />`. It looks redundant, but the two do different jobs: `key` tells React which row this is, and `id` hands the number to `EmailRow` (Lesson 8).

Inside the child row component, the `key` prop evaluates to `undefined`. But why does a click on Mom tick Dentist? Here is what happens, from the render to the click:

1. JavaScript concatenates the string prefix with `undefined`, creating the broken ID `'mail-undefined'`.
2. All three rows get that same string, so all three checkboxes have the id `mail-undefined`, and all three labels point at it.
3. The user clicks Mom's label. The browser looks for the element with the id `mail-undefined`, and takes the first one in the page: Dentist's checkbox.
4. The browser ticks Dentist's checkbox, and Mom's stays empty.

The Elements panel shows the same id on every row:

```dom caption="The Elements panel with key read inside EmailRow: every checkbox has the id mail-undefined."
<ul>
  ! <li><input id="mail-undefined" type="checkbox"><label for="mail-undefined"><b>Dentist</b>: Appointment on Friday</label></li>
  ! <li><input id="mail-undefined" type="checkbox"><label for="mail-undefined"><b>Mom</b>: Dinner on Sunday?</label></li>
  ! <li><input id="mail-undefined" type="checkbox"><label for="mail-undefined"><b>Bank</b>: Your statement is ready</label></li>
</ul>
```

The fix passes the ID a second time, under a normal name. `Inbox` writes `id={email.id}` next to the key:

```jsx title="src/components/Inbox.jsx" startLine="25"
{emails.map(email => (
  <EmailRow key={email.id} ~id={email.id}~ sender={email.sender} subject={email.subject} /> // id reaches EmailRow as a prop
))}
```

`EmailRow` reads `id`:

```jsx title="src/components/EmailRow.jsx"
export default function EmailRow({ ~id~, sender, subject }) { // id comes from id={email.id} on the tag in Inbox
  const inputId = 'mail-' + id;
  return (
    <li>
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}><b>{sender}</b>: {subject}</label>
    </li>
  );
}
```

Save the files, reload the page, and click Mom's text again:

```page width=text caption="With id passed as a prop: a click on Mom's text ticks Mom, and the Console is quiet."
heading: Inbox
form:
  button: Check mail
  check: Dentist: Appointment on Friday
  check: Mom: Dinner on Sunday? | on | good
  check: Bank: Your statement is ready
console: quiet
```

```dom caption="The Elements panel with id passed as a prop: each checkbox has its own id."
<ul>
  + <li><input id="mail-101" type="checkbox"><label for="mail-101"><b>Dentist</b>: Appointment on Friday</label></li>
  + <li><input id="mail-102" type="checkbox"><label for="mail-102"><b>Mom</b>: Dinner on Sunday?</label></li>
  + <li><input id="mail-103" type="checkbox"><label for="mail-103"><b>Bank</b>: Your statement is ready</label></li>
</ul>
```

Because our email object contains these exact fields, the props can also be passed with an object spread (as seen in Lesson 9):

```jsx title="Every prop by hand vs. one spread on the tag"
<EmailRow key={email.id} ~id={email.id} sender={email.sender} subject={email.subject}~ /> {/* Three props, written by hand */}
<EmailRow key={email.id} ~{...email}~ /> {/* The same three props, copied from the email object */}
```

Yes, it is the exact same thing for this email object. The key is still written by hand in both lines, because the spread passes props, and the key is not a prop.

---

## All 4 Principles Together

### The complete files

The entry file mounts `App` inside `<StrictMode>`:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    ~<App />~ {/* React calls App first */}
  </StrictMode>
);
```

`App` renders the inbox:

```jsx title="src/App.jsx"
import Inbox from './components/Inbox.jsx';

export default function App() {
  return ~<Inbox />~; // React calls Inbox second
}
```

`Inbox` manages `emails` in state and returns one row component per email:

```jsx title="src/components/Inbox.jsx"
import { useState } from 'react';
import EmailRow from './EmailRow.jsx';

const initialEmails = [
  { id: 101, sender: 'Dentist', subject: 'Appointment on Friday' },
  { id: 102, sender: 'Mom', subject: 'Dinner on Sunday?' },
  { id: 103, sender: 'Bank', subject: 'Your statement is ready' },
];

let nextId = 104;

export default function Inbox() {
  const [emails, setEmails] = useState(initialEmails);

  function handleCheckMail() {
    const newEmail = { ~id: nextId++~, sender: 'Shop', subject: 'Your parcel has shipped' }; // Principle 2: the ID is made once
    setEmails([newEmail, ...emails]);
  }

  return (
    <section>
      <h1>Inbox</h1>
      <button onClick={handleCheckMail}>Check mail</button>
      <ul>
        {emails.map(~email => (~ // Principle 1: parentheses return the row
          <EmailRow
            ~key={email.id}~ // Principles 2 and 3: an ID from the data, on the element map returns
            ~id={email.id}~ // Principle 4: the same ID again, as a prop
            sender={email.sender}
            subject={email.subject}
          />
        ))}
      </ul>
    </section>
  );
}
```

`EmailRow` returns one row, and reads the ID from its `id` prop:

```jsx title="src/components/EmailRow.jsx"
export default function EmailRow({ ~id~, sender, subject }) { // Principle 4: id, never key
  const inputId = 'mail-' + id;
  return (
    <li>
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}><b>{sender}</b>: {subject}</label>
    </li>
  );
}
```

### How React calls the components, and what one click on Check mail does

On the first load, React starts at `App` and follows the tags down. When the user clicks Check mail, React calls `Inbox` again to re-render, matching every row by its key:

```tree caption="The order in which React calls App, Inbox, and EmailRow on the first load, and what a click on Check mail does."
`main.jsx` mounts `App` inside `<StrictMode>`
- +1. `App` | React calls it **first** | Returns `<Inbox />`
  - +2. `Inbox` | React calls it **second** | `useState` gives `emails`, and `map` returns three `<EmailRow />`
    - +3. `EmailRow` three times | Keys **101, 102, 103** | Each call returns one `<li>`
- +A click on Check mail | `setEmails` gets a new array | React calls `Inbox` again, then `EmailRow` for four rows
  - +Keys 101, 102, 103 again | React **keeps their DOM nodes**, ticks included
  - +Key 104 is new | React **builds one new row** for Shop | unticked, at the top
```

The user ticks Dentist, clicks `Check mail`, and then clicks Shop's text:

```page width=text caption="The finished inbox after a tick on Dentist, a click on Check mail, and a click on Shop's text."
heading: Inbox
form:
  button: Check mail
  check: Shop: Your parcel has shipped | on | good
  check: Dentist: Appointment on Friday | on | good
  check: Mom: Dinner on Sunday?
  check: Bank: Your statement is ready
console: quiet
```

Each tick sits on the email the user clicked. Dentist kept its tick while it moved down, and Shop's text ticked Shop's own checkbox, `mail-104`.

| Principle | The Plain JavaScript Habit | The React Rule |
| :--- | :--- | :--- |
| **Always Return the Row from `map`** | Open curly braces after `=>` for room, and forget `return`, which leaves the list empty | Write the row in parentheses after `=>`, or write `return` inside the curly braces |
| **Always Take the key from the Data, Never from the Index** | Insert one new row at the top and trust every old row to stay put, or silence React with `key={index}` | Write `key={email.id}`, and make new IDs once, in the handler that creates the item |
| **Put the key Where `map` Returns** | Cut the row with its key out of `map` and paste it into the new component | Write `<EmailRow key={email.id} />` inside `map`, and no key inside `EmailRow` |
| **Never Read `key` Inside the Child** | Read every attribute of the tag inside the child, `key` included | Pass `id={email.id}` next to the key, and read `id` in the child |

---

## For the Interview

> **The Interview Question:** How do you render a list from an array, and why does React demand a stable key on every item?

### How to Answer Clearly in 30 Seconds

"I turn the array into an array of JSX using `map` inside the curly braces of the list. React demands a key on every element `map` returns. After each render, it uses the key to match incoming elements with existing rows, preserving the exact DOM nodes and local state of matched items. Three practical rules follow:
1. **A key from the data:** I use a stable ID such as `email.id`. The index follows the position, so when a new item arrives at the top, the first row's tick or typed text lands on the new item. A key made during render, such as `Math.random()`, matches nothing, causing React to rebuild every row and destroy user input.
2. **On the element `map` returns:** once the row is extracted into its own component, the key goes on `<EmailRow key={email.id} />`, not inside the component. For several siblings per item, it goes on `<Fragment key={email.id}>`.
3. **Not a prop:** React reserves `key` for internal matching, so the child receives `undefined`. If the child needs the ID, I pass it again as a standard prop, such as `id`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"When is the index fine as a key?"**
   When the list never changes order, never has items added or removed, and contains nothing the user marks or types, such as a static poem. React's docs: "This is a rare case where index as a key is acceptable because a poem's lines will never reorder." Without a key, React uses the index anyway, so `key={index}` only silences the warning. It does not change the underlying matching behavior.
2. **"Is `crypto.randomUUID()` a good key?"**
   Yes, when it runs once inside the handler that creates the item and the resulting ID is stored in the item data. No, when it runs inside JSX: then it produces a new key on every render, exactly like `Math.random()`, causing React to recreate every DOM node. Keys must be unique only among siblings, so two different lists on one page may safely use the same IDs.
3. **"What happens with `<EmailRow {...email} />`?"**
   The spread passes `id`, `sender`, and `subject` as props, but no key, because `key` is never treated as a prop. The Console keeps the missing key error, so the key must still be written explicitly: `<EmailRow key={email.id} {...email} />`. If the object you spread contains a field named `key`, React logs `A props object containing a "key" prop is being spread into JSX`. As the docs summarize: "it's important to separate app logic from hints to React."
