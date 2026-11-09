---
name: figures
description: "How to write code blocks, highlights, figures, browser previews, file panels, and principle cards in a River lecture in React 10, in the exact syntax that src/build-river.mjs draws. Use it as a reference while writing."
---

# Code Blocks and Figures

Every block below is drawn by `src/build-river.mjs`. A figure helps only when it shows something the text has just said. Say it first, then draw it. #2026_11_06_02_group_1

## 1. Code blocks #2026_11_06_02_group_1

- Each code block shows one step or one mistake.
- Put the file name in the fence: ` ```jsx title="src/App.jsx" startLine="6" `. Use `good="4,5"` or `bad="2"` to color whole lines.
- When an idea connects two files, show both: the file that exports or passes something, and the file that imports it and uses its tag.
- Show the complete project once, at the end, in `## Putting All [N] Principles Together`.
- Keep examples small and believable. They should look like a real page to a junior and a senior developer, and fit in a small browser window.

## 2. Highlights with `~token~` #2026_11_06_02_group_1

Wrap the one or two words that matter in tildes, such as `~export default~`. Put a comment on the same line. The build turns that comment into a speech bubble that points at the word. Without a comment, the word gets only a dotted line, and the reader does not know why it is marked.

- Highlight the word that causes the rule, not just any word on the line.
- Start the comment of a broken line with `**WRONG:**`.
- Do not write lines that hold only a comment. The build attaches them to the next line and capitalizes them, so `// src/App.jsx` becomes a bubble that says `Src/App.jsx`.
- Do not put a `~token~` inside a comment.

A comment says what happens on its line, such as "the page stays on John". It does not replace the sentence that explains a new word of this lesson. See [lecture/SKILL.md](../lecture/SKILL.md). #2026_11_07_11_group_3

````markdown
```jsx title="App.jsx"
function Footer() {
  ~return~ // **WRONG:** bare return at the end of the line becomes return; and returns undefined!
    <footer>
      <p>Latest Articles, 2026</p>
    </footer>;
}
```
````

## 3. Box figures with ```` ```tree ```` #2026_11_06_02_group_1

A `tree` figure puts one idea in a top box and splits it into boxes below. Use it to compare two or three things, or to show steps in order.

- ` ```tree caption="..." ` draws the boxes side by side under the top box.
- ` ```tree dir=right caption="..." ` draws them from left to right, for steps or for cause and result.
- `- +Title` is a green box. `- !Title` is a red box.
- `[`code`]` after the title draws small code chips.
- `| text` adds a point. `| !text` adds an important point. `| +**DO** ...` adds a green message. `| ~Do **NOT** ...` adds a red message.
- No parentheses anywhere in a `tree` block or its caption.

````markdown
```tree dir=right caption="Declaring a component function in App.jsx vs. placing its tag inside App so React renders it."
The two separate steps to make a component appear
- !Step 1 alone: Only declare the function [`function ArticleCard`] | Saves the function in memory, **but nothing calls it** | **0 cards** on screen
- +Step 1 + Step 2: Also place the tag inside `App` [`<ArticleCard />`] | React **calls `ArticleCard` once per tag** | Puts the returned `<article>` **onto the page**
```
````

When an idea spans two files, a `tree` hides too much. Use two columns, Section 5, and a table instead.

## 4. Browser previews #2026_11_06_02_group_1

A browser preview shows what the reader would see in a real browser. It shows exactly what the code next to it renders, nothing more and nothing less. A value that lives only in state is not on the page, so it goes in the text, not in the preview. Fill it as [One real screen, one idea](../lecture/SKILL.md) says: short real names such as `John`, several items as a list, and a list before and a list after for a change of order. #2026_11_09_01_group_1

**` ```page `**, a general page:
- Text: `heading: Contact Us`, `section: Today`, `line: Thanks! Your message was sent. | good`, `empty: no card on the page`, or `blank`. In a line, `[Remove]` draws a real button: `line: 3. Night Train [Move up] [Remove]`.
- Cards: `card: badge=Live | badge=New | title=New Park Opens Today | author=By John Hall | text=The city opened a new park.` An input in a card: `input=Write a comment | bad=input` or `typed=See you there | good=typed`.
- Forms: `form:`, then indented lines: `field: Your name | Anna Lee | good`, `textarea: Message | Where is my order?`, `select: Topic | Delivery`, `check: Email me a reply | on`, `button: Clear`, `submit: Send`. An empty field is still drawn as an empty box.
- Console: `console: quiet` for an empty Console, `console: <exact message>` for an error or warning, and `log: Sending message | ContactForm.jsx:19` for a log line. Show every message React really prints, including a warning on the first render.
- `good` and `bad` put a green tick or a red cross on the exact control.

**Other browsers**:
- ` ```shop `: a small store with `product: 🧦 | Wool socks | $9`, and cart lines such as `text: Items: 3 | good`, `input: Note to the shop | bad | empty again`, `typed: Please ring the bell | good | still here`, `button: Buy 2 items | bad | old count`.
- ` ```mail `: an inbox with `toolbar:`, `section:`, and `email: From | Subject | time | flags | note`, where flags are `unread`, `checked`, `good`, or `bad`.
- ` ```dom `: the Elements panel. `+` marks a right node, `!` a wrong node, and `*` a note.
- ` ```devconsole `: the Console. `x Warning: ...` is red, `= No messages` is grey, and `v {type: 'p', ...}` is an opened object.
- ` ```overlay `: the Vite error screen, with `message:`, `file:`, `help:`, and `code:` lines.

**Size**:
- `width=text` puts a small browser in the text column, at the same width as the paragraphs. Use it for one form, a few controls, one card, a short list, or a short Console.
- Without it, the browser takes the full width. Use that for two columns, card grids, shop and mail pages, and long Console messages.
- Every state of the same page keeps the same width, so the reader sees only what changed.
- `size=mini` makes the inside of the frame more compact. It does not change the width.

**PROPER** (how to draw the previews only, from the Lecture 20 opening of 2026-11-06; Lecture 20 itself is not a model). The browser comes first, then the code, then the browser after typing:

````markdown
```page width=text caption="A small page with three name boxes, all showing John when the page opens."
heading: Three name boxes
form:
  field: Box A | John
  field: Box B | John
  field: Box C | John
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field.
```

```jsx title="Three ways to put John inside a name box"
const [name, setName] = useState('John');

<input ~defaultValue="John"~ /> {/* A. Starts with John, then keeps whatever the user types */}
<input ~value="John"~ /> {/* B. Shows John and refuses every new letter */}
<input value={name} ~onChange={e => setName(e.target.value)}~ /> {/* C. Shows whatever name holds in state */}
```

```page width=text caption="The same page after the user types ny into each of the three name boxes."
heading: Three name boxes
form:
  field: Box A | Johnny | good
  field: Box B | John | bad
  field: Box C | Johnny | good
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field.
```
````

This shows how to draw the previews. After the previews, the text explains each new word of this lesson. It walks through the steps only when the result would surprise the reader, as [Steps for a surprise](../moves/steps-for-a-surprise.md) says. #2026_11_07_11_group_3

The labels Box A, Box B, and Box C belong to the page. The text never relies on them alone. It names each box by its one difference, such as "the box with `defaultValue`", as [lecture/SKILL.md](../lecture/SKILL.md) asks. #2026_11_07_01_group_2

**COUNTER-EXAMPLE** (invented, modelled on the first Lecture 20 opening):

````markdown
```page caption="Three name boxes."
heading: Three name boxes
line: Box A
line: John
line: name in state: John
console: quiet
```
````

*Why this fails*: Nothing looks like an input, so the reader cannot tell these are boxes. It shows the value in state, which no real page shows. It shows a quiet Console, but React prints a warning for the box with `value="John"` and no `onChange`.

## 5. Two columns side by side #2026_11_06_02_group_1

Use `::: row` and `::: col` to put a broken version next to a working one, each with its browser and its code.

Give each column a `title` that names its one difference, such as `title="defaultValue on the box"` and `title="value on the box"`. The text below the row uses those same names. It never says "the left column" or "the right column", because the tired reader no longer remembers which side is which. #2026_11_07_01_group_2

````markdown
::: row caption="Plain JavaScript updates the line and forgets the button; React updates both from count."
::: col title="Plain JavaScript" tag="one place forgotten" tone=bad
```shop size=mini
text: Items: 3 | good
button: Buy 2 items | bad | old count
```
```js title="page.js" bad="2"
const count = 3;
items.textContent = 'Items: ' + count; // Updates the line; forgets the button
```
The line says `3`. The button still says `2`.
:::
::: col title="React" tag="both places match" tone=good
```shop size=mini
text: Items: 3 | good
button: Buy 3 items | good
```
```jsx title="Cart.jsx" good="4,5"
export default function Cart() {
  const count = 3;
  return (
    <section>
      <p>Items: {count}</p>
      <button>Buy {count} items</button>
    </section>
  );
}
```
Both places read `count`, so both show `3`.
:::
:::
````

## 6. File panels and principle cards #2026_11_06_02_group_1

**File panel.** When a lesson uses several files or folders, show them with ` ```files title="..." caption="..." `. Indent two spaces per folder level. Write folders with a slash, such as `src/`, and files as `name | role | what it exports and imports`.

````markdown
```files title="article-site: File Explorer" caption="How our project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | parent | Exports `App` as default and imports `ArticleCard`
  components/
    ArticleCard.jsx | default export | Exports `ArticleCard` as default
```
````

**Principle card.** Every principle ends with a card in this order. The sample below is the approved Lecture 04 card:
1. `> **Principle N: [Short Name]: [Core Rule]**`
2. `> *[The rule in one sentence, in italics]*`
3. A short explanation in human words that starts from the problem. The owner's rewrite in [lecture/SKILL.md](../lecture/SKILL.md) shows the voice. #2026_11_07_11_group_3
4. `> **DO THIS:**` and a short `jsx` block with a `~token~` and a comment.
5. `> **DO NOT DO THIS:**` and a short `jsx` block whose comment starts with `**WRONG:**`.

````markdown
> [!PRINCIPLE]
> **Principle 1: Rendering: React Calls the Component Wherever a Tag Names It**
>
> *Use a component by writing its name as a JSX tag, such as `<ArticleCard />`, inside another component's markup; React calls the function once for each tag.*
>
> Defining a component function does not put it on the page until a rendered component includes its `<Tag />`. During rendering, each `<ArticleCard />` tag hands the function to React so React calls it and puts the returned `<article>` HTML into the browser DOM. The component tag `<ArticleCard>` itself never appears in the DOM.
>
> **DO THIS:**
> ```jsx
> function ArticleCard() {
>   return <article>New Park Opens Today</article>;
> }
> export default function App() {
>   return <main>~<ArticleCard />~</main>; // React calls ArticleCard() and puts <article> in the DOM
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ~ArticleCard~() { // **WRONG:** declared, but no <ArticleCard /> tag in App, so ArticleCard() never runs!
>   return <article>New Park Opens Today</article>;
> }
> export default function App() {
>   return <main></main>;
> }
> ```
````
