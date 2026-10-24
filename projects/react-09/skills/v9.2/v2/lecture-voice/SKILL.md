---
name: lecture-voice-v2
description: "River Version (v2) lecture voice for `01-02-md-LECTURES/v2/{NN}.md`, written by Argon from the pre-lecture. Governs water-like CEFR B2 sentences that carry one idea each, the division of labor between plain words in prose and exact syntax in code, strictly chronological explanations, and zero parentheses in prose, headings, and figures."
---

# River Version (`v2`) Lecture Voice (`01-02-md-LECTURES/v2/{NN}.md`)

## 0. Writing the lecture from the pre-lecture #2026_10_24_01_group_1

The lecture starts from `01-01-md-PRE-lectures/v2/{NN}.md`, which already meets every content benchmark in [pre-lecture/SKILL.md](../pre-lecture/SKILL.md) Section 4: the root of each principle, real bugs, the on-stage walk, plain lead-in sentences, both sides of each handshake, every bridge said out loud, cause before effect, a believable example, and figures that follow the text.

1. Before writing, read [Lecture 04](../../../../01-02-md-LECTURES/v2/04.md) again, together with the pre-lecture.
2. Write one principle at a time. For each, lift its beats, render its `Shows:` lines into finished code blocks and figures, and read the whole principle as a learner before moving on.
3. Change whatever reads better another way. When a change touches the staging, such as a new block, a moved step, or a merged sentence, check that part against the pre-lecture benchmarks again and note the change for the verification report.

## 1. Water-like flow: one idea per sentence #2026_10_24_01_group_4

Every paragraph is simple, direct, and easy to follow on the first read. Each sentence carries one idea or one event in plain B2 words. When a sentence reaches a comma that adds a second mechanism, a reason, or an analogy, it becomes two sentences, told in the order things happen.

### PROPER 1A (Lecture 04, Principle 4)
> Now we want to add a comment box under each article card. Only the card uses this comment box. In plain JavaScript, you sometimes put a small helper function inside the function that uses it. So you might try to write the comment box **inside** the card.

### COUNTER-EXAMPLE 1A (the rejected draft of the same paragraph)
> Suppose we add a comment box under each article card. Because the comment box is used only inside the card, a developer might be tempted to write the comment box function inside the card function, the way plain JavaScript sometimes puts a small helper inside another function.
> *Notes*: A reason, a hedged action, and an analogy are glued into one long sentence. Every word is simple, and the sentence is still hard to read.

### PROPER 1B (Lecture 02, explaining a build step simply)
> Look at how simple that rewrite is:
> - The tag's name became the first argument, such as `"article"` or `"h2"`.
> - The tag's attributes and inner content became the properties of an object in the second argument.
>
> This rewrite by the build is called the **JSX transform**. Each call returns the plain object we saw in the Console, and React calls that object a **React element**.

### COUNTER-EXAMPLE 1B (line-by-line compiler autopsy)
> Look at what the build did from top to bottom:
> 1. **Line 1, the `_jsxDEV` import**: The build automatically added an import line at the top of the file to load a helper function named `_jsxDEV` from `"react/jsx-dev-runtime"`.
> 2. **Line 3, the `_jsxDEV` call for `"article"`**: The build rewrote `<article>` into a function call. The tag's name, `"article"`, became the first argument. Its content became the `children` property inside the second argument.

### PROPER 1C (Lecture 02, the idea before the Console figure)
> Save the file. The card appears on the page with its heading and its text. Now look at Chrome's **Console panel**. It does not show HTML text. It shows a plain JavaScript object!
>
> When we click the small triangle in the Console to open that object, we see two main properties:
> - **`type`** holds the tag's name, `'article'`.
> - **`props`** holds an object with the tag's attributes and its inner content under **`children`**.

### COUNTER-EXAMPLE 1C (the Console log dumped into prose)
> In Chrome's `Console` panel: Line 8 of `App.jsx`, shown as `App.jsx:8`, does not print HTML text like `"<article>..."`. Instead, it prints a plain JavaScript object: `{ type: 'article', props: { ... } }`. At index `0`, the first inner tag is `{ type: 'h2', props: { ... } }`.

## 2. Division of labor: plain words in prose, syntax in code, result in comments #2026_10_24_01_group_4

Prose, code blocks, and comments each have one job:
1. **Prose** says what we want, what we do, and why, about parts the reader can picture: the card, the card file, the heading, the variable, the tag.
2. **The code block** shows the exact syntax.
3. **The comment** on a highlighted line points at the token and names its cause and its visible effect.

A code name belongs in a sentence when the reader must learn that very name: a new term, a property they will see in the Console, an error they will meet. When a sentence only tells what the developer does next, it uses plain words and lets the block below carry the names. Judge each sentence by reading it next to its block: if it says the block's names again, it is reciting.

### PROPER 2A (Lecture 04, Principle 2)
> First, the developer writes the footer component with a small first letter:
> ```jsx title="App.jsx" startLine="1"
> function ~footer~() { // **WRONG:** small 'f' matches the real HTML <footer> word
>   console.log('footer runs');
>   return <footer>Latest Articles, 2026</footer>;
> }
> ```
> Then the tag is also written with a small first letter:
> ```jsx title="App.jsx" startLine="6"
> export default function App() {
>   return (
>     <main>
>       <h1>Latest Articles</h1>
>       <ArticleCard />
>       ~<footer />~ {/* **WRONG:** creates an empty HTML <footer></footer> with 0 Console warnings! */}
>     </main>
>   );
> }
> ```
> When you **use a small first letter on a component name that matches a real HTML tag**, the Console stays completely silent! A footer with a small letter is a valid HTML tag. So React thinks you simply want an empty footer on the page, and it ignores your function with zero warnings.

### COUNTER-EXAMPLE 2A (rejected Lecture 03 draft, reciting the block before and after it)
> Suppose a developer stores `title` and `author` in two constants at the top of `ArticleCard`. Then the developer writes `title` inside `<h2>` and `src="{avatarUrl}"` on the `<img>` tag:
> ...
> The heading on the screen literally says the word `title` instead of `New Park Opens Today`! Even worse, the `<img>` tag shows a broken image icon because the browser tried to fetch a file literally named `"{avatarUrl}"`.

### PROPER 2B (Lecture 05, Principle 3, a module mismatch told in order)
> When you save the file, the page goes blank and the Console shows an error:
>
> ```devconsole
> x Uncaught SyntaxError: The requested module '/src/components/Badges.jsx' does not provide an export named 'default'
> ```
>
> Look at what happened across the two files in order:
> 1. In the badge file, we exported both badges **by name**, without the word `default`. So the badge file has **no default export**.
> 2. In the card file, we wrote the `import` line **without curly braces**, which asks the badge file for its single `default` export.
> 3. Because the badge file has no `default` export, the browser stops before React runs.
>
> The opposite mix-up fails the same way. If a file exports a component with `export default` and another file imports it **with** curly braces, the browser also stops with an error.

### COUNTER-EXAMPLE 2B (error strings, code statements, and a second hypothetical in prose)
> Why did the page stop before React even ran? Before running a single line of component code, the browser links every `import` to its matching export slot. Because `import LiveBadge from './Badges.jsx'` has no curly braces, the browser asked `Badges.jsx` for its `default` slot. But `Badges.jsx` used `export function LiveBadge`, so its `default` slot is empty!
>
> The opposite mistake fails in the exact same way. Suppose `ArticleCard.jsx` uses `export default function ArticleCard`, and `App.jsx` imports `{ ArticleCard }` with curly braces. The browser stops and reports `does not provide an export named 'ArticleCard'`.

## 3. Zero parentheses in prose, headings, and figures #2026_10_24_01_group_4

Parentheses make the reader step sideways into an aside and then step back. Body paragraphs, bullets, headings, table cells, principle card explanations, and `tree` figures carry no `(` or `)`. An example that would sit in parentheses becomes `, such as ... ,`, a colon, or its own short sentence.

### PROPER (Lecture 04)
> **The browser only knows built-in HTML tags**, such as a main wrapper, a heading, an article, or a footer. It has no idea what our custom card tag is.

### COUNTER-EXAMPLE
> **The browser only knows built-in HTML tags** (such as `<main>`, `<h1>`, `<article>`, or `<footer>`) and has no idea what our custom card tag (`<ArticleCard />`) is.

## 4. Strictly chronological, and every result with its condition #2026_10_24_01_group_4

A code explanation walks through the file top to bottom, a statement left to right, and a change before and after in time. Every result names the case it describes, such as *when the curly braces are left out* or *when quotes wrap the curly braces*, so a reader who lands on any paragraph or caption knows which case it is. PROPER 2B above walks the two files in order and closes with the condition of the opposite mix-up.
