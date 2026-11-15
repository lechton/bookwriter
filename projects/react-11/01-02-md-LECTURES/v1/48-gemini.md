# Lecture 48: What React Escapes and Where Its Protection Ends

*(How does React keep a hostile comment from running, and where does that protection stop?)*

> INTERVIEW QUESTION | ❱❱ MORE | How does React protect you from cross-site scripting, and when does dangerouslySetInnerHTML remove that protection?

---

## VS | Curly Braces `{comment}` vs. `dangerouslySetInnerHTML`: the same string shows as text, or runs as code

> React protects your app by passing every string in curly braces to the browser as plain text, so a hostile tag never runs. **When you use `dangerouslySetInnerHTML` to show formatted text, that protection ends, and the browser will execute any code the HTML carries.** To display content safely, you should pass HTML written by other people through a sanitizer like DOMPurify first, which keeps the formatting but removes the hidden attacks.

Plain JavaScript provides two properties for inserting strings into a DOM element: `textContent` and `innerHTML`. While both place content inside a container, they behave completely differently:
- **`textContent`** inserts the string as a text node. The browser treats every character literally, rendering markup tags as plain text.
- **`innerHTML`** passes the string to the HTML parser. The browser constructs real DOM elements from the markup and executes any embedded code.

```js title="Plain JavaScript: one string, two properties"
const div = document.getElementById('comment');
const comment = `<img src="" onerror='alert("you were hacked")'>`;

div.~textContent~ = comment; // The page shows the characters of the tag, and nothing runs
div.~innerHTML~ = comment; // The browser builds an img element, and its onerror code runs
```

React developers rarely manipulate DOM properties directly, because React manages elements through JSX. However, React provides the exact same two capabilities under different names. **Curly braces work like `textContent`. The `dangerouslySetInnerHTML` prop works like `innerHTML`.**

```jsx title="React: the same two choices"
<div>~{comment}~</div> {/* Like textContent: the page shows the characters, and nothing runs */}
<div ~dangerouslySetInnerHTML={{ __html: comment }}~ /> {/* Like innerHTML: the browser builds an img, and its onerror runs */}
```

The browser exposes the global `alert` function on every web page. Calling it displays a modal dialog with a message and a confirmation button. Security testers and attackers use it as a standard proof of concept to demonstrate that arbitrary code can execute.

Consider a news website. The article page displays a headline, a short body with one bold word, and a list of reader comments below it. A reader named Mia submits a comment. Instead of writing regular words, she enters the malicious image tag shown in the snippet above. What does another visitor see when viewing Mia's comment?

Nothing harmful occurs. The comment list renders each entry using JSX curly braces, so the browser displays Mia's input as plain characters. No image element is created, and no alert dialog opens:

```page caption="The article page after Mia posts her comment: her characters are printed as a line of text."
heading: Park Opens Today
line: The park opens at noon.
section: Comments
line: • John: Great news!
line: • Mia: <img src="" onerror='alert("you were hacked")'> | good
```

Now imagine those exact same characters are placed inside the article body. Because the article body requires formatting for its bold text, the component renders it with `dangerouslySetInnerHTML`. As soon as the article loads, the browser parses the markup and triggers the alert dialog for every visitor:

```page caption="The same characters placed inside the article body: the browser opens the alert for every visitor."
line: localhost:5173 says: you were hacked [OK] | bad
heading: Park Opens Today
line: The park opens at noon.
section: Comments
line: • John: Great news!
line: • Mia: <img src="" onerror='alert("you were hacked")'> | good
```

**Why this happens:** The input string is identical in both cases, but the method of delivery is completely different. When using curly braces, React passes the string as a text node, and browsers never execute text nodes as code. When using `dangerouslySetInnerHTML`, React instructs the browser to parse the string as HTML, executing whatever scripts the markup contains. Developers often view `dangerouslySetInnerHTML` simply as a tool for rendering rich text formatting. While it achieves that visual formatting, it simultaneously removes React's protective barrier against arbitrary code execution.

> [!DEFINITION]
> **Cross-site scripting.** [NEW] Cross-site scripting, or XSS, is a vulnerability where an attacker injects malicious client-side script into a web page viewed by other users.
> 1. An attacker submits malicious markup containing executable JavaScript into a website.
> 2. The application renders that untrusted markup directly into the document without escaping or sanitizing it.
> 3. The victim's browser executes the script under the site's origin, allowing the attacker to steal cookies, session tokens, or private user data (Lesson 48).

Remember the core rule of this chapter. **Curly braces supply the browser with plain text, which never executes. The `dangerouslySetInnerHTML` prop supplies the browser with raw HTML, which executes any code it contains.**

### Where React's Protection Ends

React's automatic protection is built directly into JSX curly braces. Every string placed in curly braces, whether rendered between tags or assigned to an attribute, reaches the DOM as safe text. That protection ends in two specific places:
1. **At `dangerouslySetInnerHTML`.** Here your code commands the browser to parse raw HTML and run any embedded scripts.
2. **At link attributes like `href`.** React 19 blocks addresses beginning with `javascript:`, but it places all other URLs directly onto the anchor tag.

Failing to guard these boundaries puts every visitor at risk:
1. The official React documentation warns that any code embedded inside unescaped HTML will execute.
2. In a production exploit, an attacker can leverage this opening to steal authentication tokens or perform actions on behalf of the user.
3. When untrusted input is stored on a server, MDN notes that every user who visits the page receives the malicious payload on every page load.

### The Rule of Thumb: does it need to be HTML, and who can write it?

**Ask two questions about every string rendered on your page. Does it require HTML formatting? If not, use standard curly braces. If it must contain HTML, who can write it? If anyone outside your core team can influence that string, you must pass it through a sanitizer first.**

Experienced developers watch for four classic mistakes:
1. **Assuming React escapes everything.** React escapes values in curly braces, but it provides zero protection for strings passed to `dangerouslySetInnerHTML`.
2. **Trusting HTML because it comes from an internal database or admin panel.** Security depends on who authored the content, not where it is stored. Compromised editor credentials can inject malicious code into trusted APIs.
3. **Filtering only for `<script>` tags.** Browsers block script tags injected through `innerHTML`. However, an `onerror` attribute on an image executes immediately.
4. **Relying on React to validate external links.** React 19 blocks only `javascript:` URLs. It does not inspect external destinations or protect users against phishing domains.

### Three Ways to Show Text Written by Other People

Web applications frequently display content provided by outside users. Some content is plain text, such as a user comment, while other content is formatted markup, such as a blog post with bold emphasis. You have three ways to display this content:
1. **Curly braces, such as `{comment.body}`.** Use this for any content meant strictly as text: names, comments, chat messages, and headlines. It requires no configuration and is secure by default.
2. **`dangerouslySetInnerHTML` with trusted HTML.** Use this only for markup generated locally that never touches untrusted user input, such as an immediate client-side markdown preview where authors only view their own draft.
3. **`dangerouslySetInnerHTML` with sanitized HTML.** Use this whenever displaying rich text provided by outside users, such as articles from contributors or product descriptions from third parties.

> [!DEFINITION]
> **A sanitizer.** [NEW] A sanitizer is a security library that strips executable code from an HTML string while preserving safe formatting tags.
> 1. It inspects an incoming HTML string against an allowlist of safe tags and attributes.
> 2. It preserves visual markup like `<b>` and `<p>` while stripping dangerous elements like `<script>` and attributes like `onerror`.
> 3. This lesson uses DOMPurify, calling its main sanitization function: `DOMPurify.sanitize(dirtyHtml)` (Lesson 48).

```tree caption="Three ways to show text written by other people, and when each one fits."
Three ways to show text written by other people
- +1. Curly braces [`{comment.body}`] | Names, comments, messages, titles | **Safe** with no extra work
- +2. `dangerouslySetInnerHTML` with trusted HTML | HTML that only its own author sees | Safe only while **nobody else** can write the string
- +3. `dangerouslySetInnerHTML` after `DOMPurify.sanitize` | HTML written by **other people** | The sanitizer **removes the parts that run code** first
```

## SECTION | A News Article with Reader Comments

Our example application is a news article page. Both the article body and the reader comments arrive pre-loaded from a mock data file, exactly as they would from an API response. The application does not include an interactive submission form.

The project follows the standard file structure of a Vite application (Lesson 46). The user interface is composed across four files:

```files title="news-article: File Explorer" caption="The files of our news article page inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  data.js | data | Exports the saved `article` and the saved `comments`
  App.jsx | parent | Shows the title, `ArticleBody`, and `CommentList`
  ArticleBody.jsx | default export | Shows `article.html` in the article body
  CommentList.jsx | default export | Shows each comment with `.map` and `key`
```

The application is built across five distinct principles:
1. **Principle 1: Curly Braces Show a Tag as Plain Text.** A comment containing an image tag is rendered as literal text characters, preventing script execution.
2. **Principle 2: `dangerouslySetInnerHTML` Turns a String into Elements.** When an application must display formatted markup, this prop instructs the browser to construct real DOM nodes.
3. **Principle 3: `onerror` Runs in the Browser of Every Visitor.** Once the browser creates elements from untrusted markup, embedded event handlers execute automatically for all users.
4. **Principle 4: DOMPurify Removes `onerror` Before the Browser Sees It.** Passing untrusted HTML through a sanitizer preserves safe formatting while stripping dangerous event handlers.
5. **Principle 5: React 19 Blocks a `javascript:` Link.** React halts code execution from `javascript:` URL schemes, leaving general link destination validation to application code.

---

## PRINCIPLE | Curly braces `{comment.body}`: a tag inside the string reaches the page as text

> [!PRINCIPLE]
> **Principle 1: Escaping: A Tag Inside a String Reaches the Page as Text**
>
> *Show every name, comment, and title with curly braces; React gives the string to the browser as text, so any tag inside it is shown and never run.*
>
> A comment is a string, and a string can hold any characters, including a whole `<img>` tag. With curly braces, React DOM hands those characters to the browser as text. The browser makes elements only from the JSX tags in our code, so the payload stays a line of strange characters, and nothing runs. The same holds for the value of an attribute, such as `title={comment.body}`.
>
> **DO THIS:**
> ```jsx
> <li key={comment.id}>
>   <strong>{comment.author}</strong>: ~{comment.body}~ {/* Mia's tag shows as characters, nothing runs */}
> </li>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <li key={comment.id} ~dangerouslySetInnerHTML={{ __html: comment.body }}~ /> {/* **WRONG:** Mia's tag becomes an img, and its onerror runs for every visitor */}
> ```

Begin with the simplest example. A string contains the characters of Mia's malicious comment, and a component renders it within a paragraph using curly braces:

```jsx title="A string that holds a tag, placed in a paragraph with curly braces"
const text = `<img src="" onerror='alert("you were hacked")'>`;

<p>~{text}~</p> {/* The page shows the characters of the tag: no image, no alert */}
<p ~title={text}~>John</p> {/* When the user hovers over John, the tooltip shows the same characters */}
```

> [!DEFINITION]
> **A payload.** [NEW] A payload is the specific malicious code or data an attacker transmits to exploit a vulnerability.
> 1. In cross-site scripting, the payload is typically executable JavaScript disguised inside an HTML tag or attribute.
> 2. The attacker submits the payload through user inputs like comments, profile fields, or URL parameters.
> 3. Once rendered as raw markup, the browser executes the payload, allowing the attacker to hijack the session or exfiltrate private information (Lesson 48).

A friendly comment and Mia's hostile payload are handled identically by React. Both values are ordinary JavaScript strings. React DOM translates both into plain text nodes before handing them to the browser. The browser constructs DOM elements strictly from the JSX tags written in your source code, never from strings nested inside curly braces.

```tree caption="A friendly comment and a hostile comment go on the page the exact same way with curly braces."
Two comments placed with `{comment.body}`
- +A friendly comment [`Great news!`] | React gives the browser **text** | The page shows **Great news!**
- +The hostile comment of Mia [`<img onerror>`] | React gives the browser **text** too | The page shows **the characters of the tag**, and nothing runs
```

### Why No Image Appears and No Alert Opens

The browser displays Mia's input as plain characters because it never parses the string as HTML. Here is the exact runtime sequence:
1. Mia submits her malicious image tag in a comment form, and the server stores the raw string.
2. The component passes `{comment.body}` into a JSX element.
3. React DOM creates a native DOM text node rather than parsing the string into elements.
4. The browser paints each character on screen as literal text glyphs.
5. Because no image element exists in the DOM, no network request occurs and the `onerror` handler never executes.
6. Visitors see Mia's input as harmless text on the page, and no script runs.

> [!DEFINITION]
> **Escaping.** [NEW] Escaping, also called output encoding, is the security mechanism where React treats data as literal text rather than executable markup.
> 1. Special characters such as `<`, `>`, `&`, and `"` are converted to their corresponding HTML entities like `&lt;` and `&gt;`.
> 2. React creates DOM text nodes automatically for values embedded in JSX curly braces.
> 3. The browser paints these characters on screen without invoking the HTML parser, preventing tags from creating DOM elements (Lesson 48).

### Our First Step: the Comment List

The application begins with two stored comments in the data file. John submits a friendly message, while Mia submits the malicious payload:

```js title="src/data.js"
export const comments = [
  { id: 1, author: 'John', body: 'Great news!' },
  { id: 2, author: 'Mia', body: ~`<img src="" onerror='alert("you were hacked")'>`~ }, // Saved by the server exactly as Mia typed it
];
```

The comment list component receives the comments array as a prop and renders each item using curly braces:

```jsx title="src/CommentList.jsx"
export default function CommentList({ comments }) {
  return (
    <ul>
      {comments.map(comment => (
        <li key={comment.id}>
          <strong>{comment.author}</strong>: ~{comment.body}~ {/* Mia's tag reaches the page as characters */}
        </li>
      ))}
    </ul>
  );
}
```

The arrow function passed to `comments.map` receives `comment` as its parameter. JavaScript executes this callback once for each entry in the array, rendering an item for each comment (Lesson 18).

The top-level App component imports the comments data and passes them down to the comment list:

```jsx title="src/App.jsx"
import { comments } from './data.js';
import CommentList from './CommentList.jsx';

export default function App() {
  return (
    <main>
      <h1>Park Opens Today</h1>
      <h2>Comments</h2>
      ~<CommentList comments={comments} />~ {/* Both comments go through the same curly braces */}
    </main>
  );
}
```

```page caption="The comment list: the payload of Mia is printed as text, and no alert opens."
heading: Park Opens Today
section: Comments
line: • John: Great news!
line: • Mia: <img src="" onerror='alert("you were hacked")'> | good
```

To inspect how the browser represents Mia's comment in the DOM, right-click her comment in the browser Elements panel and select **Copy outerHTML**. The resulting markup contains escaped text entities instead of an image element:

```dom caption="The HTML of the list item of Mia: her tag became text with &lt; and &gt;, and no img element exists."
+ <li><strong>Mia</strong>: &lt;img src="" onerror='alert("you were hacked")'&gt;</li> | note: Text after the name, and no img element
```

### A Real Beginner Mistake: "Fixing" the Printed Tag

While the application is completely secure, seeing raw HTML tags printed on a screen can confuse developers:
1. A developer notices raw image tags printed inside a user comment on the page.
2. Believing the interface is broken, the developer assumes user comments should be formatted.
3. The developer replaces JSX curly braces with `dangerouslySetInnerHTML` to parse tags into markup.
4. The next user to view the comments triggers Mia's malicious script immediately.

Seeing raw markup printed on screen is not a bug. It is proof that React's escaping mechanism is actively protecting your users.

---

## PRINCIPLE | `dangerouslySetInnerHTML`: the browser turns the string into real elements

> [!PRINCIPLE]
> **Principle 2: `dangerouslySetInnerHTML`: The Browser Reads the String as HTML**
>
> *When a page must show HTML made elsewhere, pass `{ __html: string }` to `dangerouslySetInnerHTML`; React sets the `innerHTML` of the element, and the browser parses the string into elements.*
>
> Curly braces always give the browser text, so `{article.html}` prints every tag as characters. Showing formatted HTML needs a separate act: React sets `innerHTML` on the DOM node, and the browser builds elements from the string. React makes that act long, odd, and easy to find on purpose, because from that line on, the browser follows whatever the string says.
>
> **DO THIS:**
> ```jsx
> export default function ArticleBody({ article }) {
>   return <div ~dangerouslySetInnerHTML={{ __html: article.html }}~ />; // The visitor sees noon in bold
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function ArticleBody({ article }) {
>   return <div ~dangerouslySetInnerHTML={article.html}~ />; // **WRONG:** a plain string instead of { __html }, so React stops with an error
> }
> ```

User comments require only plain text. The article body is different. Editorial staff compose news stories in a private content management dashboard. Because the editor marked the word **noon** as bold, the article content is saved as rich HTML. A string that contains raw markup tags is known as a **raw HTML string**.

Rendering that string with curly braces would print the literal tags on screen. To display formatted markup, developers use React's raw HTML prop:

```jsx title="A raw HTML string handed to the browser as HTML"
const html = '<p>The park opens at <b>noon</b>.</p>';

<div ~dangerouslySetInnerHTML={{ __html: html }}~ /> {/* The page shows "The park opens at noon." with noon in bold */}
```

Three identifiers appear in that declaration:
- **`dangerouslySetInnerHTML`** is a built-in React prop supported on standard DOM elements. It accepts an object containing an `__html` key with a raw HTML string.
- **`__html`** is the mandatory object key that React inspects to retrieve the raw markup string.
- **`innerHTML`** is the underlying browser DOM property. React sets this property directly on the container node, prompting the browser to parse the string into live child elements.

The double curly braces represent standard JavaScript object syntax. The outer braces indicate a JSX expression, while the inner braces create a normal object literal, exactly like setting inline styles with `style={{ color: 'red' }}` (Lesson 03).

React deliberately chose this awkward prop name as an explicit warning. The official React documentation emphasizes that setting raw HTML must be handled with extreme care. The alarming name and nested object format ensure that any bypass of React's escaping stands out immediately during code reviews.

```tree dir=right caption="What happens to the string after our code passes it to dangerouslySetInnerHTML."
From `__html` to elements on the page
- +1. Our code [`{ __html: html }`] | Wraps the **raw HTML string** in an object
- +2. React DOM [`innerHTML`] | Sets the **`innerHTML`** of the `<div>` to the string
- +3. The browser | **Parses** the string and builds **a `<p>` that holds a `<b>`**
```

### Our Second Step: the Article Body

The data file exports the saved article above the comments:

```js title="src/data.js" startLine="1"
export const article = {
  title: 'Park Opens Today',
  html: ~'<p>The park opens at <b>noon</b>.</p>'~, // Saved by the editor on the admin page
};
```

The App component renders the article title and delegates rendering the body to `ArticleBody`:

```jsx title="src/App.jsx"
import { article, comments } from './data.js';
import ArticleBody from './ArticleBody.jsx';
import CommentList from './CommentList.jsx';

export default function App() {
  return (
    <main>
      <h1>{article.title}</h1>
      ~<ArticleBody article={article} />~ {/* ArticleBody shows the article body under the title */}
      <h2>Comments</h2>
      <CommentList comments={comments} />
    </main>
  );
}
```

If a developer implements the article body using standard curly braces, the browser displays raw markup tags. Compare that with the output produced by `dangerouslySetInnerHTML`:

::: row caption="The article body with curly braces prints the tags; with dangerouslySetInnerHTML it shows noon in bold."
::: col title="Curly braces around article.html" tag="tags printed" tone=bad
```page size=mini
heading: Park Opens Today
line: <p>The park opens at <b>noon</b>.</p> | bad
section: Comments
line: • John: Great news!
line: • Mia: <img src="" onerror='alert("you were hacked")'>
```
```jsx title="src/ArticleBody.jsx" bad="2"
export default function ArticleBody({ article }) {
  return <div>~{article.html}~</div>; // **WRONG:** the visitor sees <p> and <b> as characters
}
```
The visitor reads the tags instead of the bold word.
:::
::: col title="dangerouslySetInnerHTML with article.html" tag="noon in bold" tone=good
```page size=mini
heading: Park Opens Today
line: The park opens at noon. | good
section: Comments
line: • John: Great news!
line: • Mia: <img src="" onerror='alert("you were hacked")'>
```
```jsx title="src/ArticleBody.jsx" good="2"
export default function ArticleBody({ article }) {
  return <div ~dangerouslySetInnerHTML={{ __html: article.html }}~ />; // The browser builds a p and a b
}
```
The visitor reads "The park opens at **noon**."
:::
:::

When using `dangerouslySetInnerHTML`, the browser Elements panel confirms that real DOM elements were created inside the container:

```dom caption="With dangerouslySetInnerHTML, the div holds a real p element that holds a real b element."
<main>
  <h1>Park Opens Today</h1>
  <div>
+   <p>The park opens at <b>noon</b>.</p> | note: Built by the browser from the string
  </div>
  <h2>Comments</h2>
  <ul>...</ul>
</main>
```

Three strict rules govern `dangerouslySetInnerHTML`:
1. **The value must be an object with an `__html` property.** Passing a raw string directly to the prop causes React to throw an error.
2. **The inserted HTML replaces all container contents.** Just like setting `innerHTML` in vanilla JavaScript, existing child nodes are removed.
3. **No children are permitted.** React prevents passing both child elements and `dangerouslySetInnerHTML` to the same tag, throwing an error if both exist.

### A Real Beginner Mistake: the Search That Ends Too Early

1. A developer displays an article body using curly braces and notices raw HTML tags on screen.
2. Searching online leads to code snippets recommending `dangerouslySetInnerHTML`.
3. The formatting renders as expected, and the developer considers the task complete.
4. Nobody verifies whether untrusted users can influence that HTML string.

That unasked question determines whether your application remains secure. Principle 3 explains what happens when untrusted markup enters this pipeline.

---

## PRINCIPLE | `onerror` inside that HTML: the browser runs it for every visitor

> [!PRINCIPLE]
> **Principle 3: Stored XSS: The Browser Runs `onerror` for Every Visitor**
>
> *HTML passed to `dangerouslySetInnerHTML` is parsed and run by the browser exactly as written, so an event handler attribute such as `onerror` inside it runs code for every visitor who opens the page.*
>
> The payload needs no `<script>` tag. An `<img>` with an empty `src` fails to load, and the browser runs its `onerror` attribute. Because the article is saved on the server, the same code runs for every visitor, on every visit. Coming from our own admin page does not make the HTML safe: the question is who can write the string.
>
> **DO THIS:**
> ```jsx
> <li key={comment.id}>
>   <strong>{comment.author}</strong>: ~{comment.body}~ {/* A comment needs no HTML, so its onerror stays text */}
> </li>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div ~dangerouslySetInnerHTML={{ __html: article.html }}~ /> {/* **WRONG:** anyone who can edit article.html runs code in the browser of every visitor */}
> ```

Once the browser parses a string as HTML, it executes any code embedded within that markup. An attacker does not need to inject a `<script>` tag. A broken image tag with an event handler is completely sufficient.

Here is the minimal reproduction. The official React documentation highlights this exact scenario as an example of an XSS vulnerability:

```jsx title="The React docs example of a security hole"
const post = {
  content: ~`<img src="" onerror='alert("you were hacked")'>`~, // Imagine this content is stored in the database
};

<div ~dangerouslySetInnerHTML={{ __html: post.content }}~ /> {/* The browser opens the alert: you were hacked */}
```

This is the exact same payload string Mia typed in Principle 1. The difference lies entirely in how the application renders it. Curly braces force the browser to treat the characters as text. Passing the string to `dangerouslySetInnerHTML` prompts the browser to construct a live image element, triggering its event handler immediately.

> [!DEFINITION]
> **An inline event handler.** [NEW] An inline event handler is an HTML attribute containing JavaScript code that executes when a specific DOM event triggers.
> 1. Standard attributes like `onerror`, `onload`, and `onmouseover` evaluate their assigned strings as executable JavaScript.
> 2. An `<img>` tag with an empty `src` attribute fails to load immediately, reliably triggering its `onerror` handler without user interaction.
> 3. Modern browsers block `<script>` tags injected via `innerHTML`, making inline event handlers a primary vector for cross-site scripting (Lesson 48).

### Our Third Step: an Attacker Edits the Article

Content stored in an internal database or administrative dashboard is not automatically safe. A single compromised staff account can poison the data store. Here is the complete attack sequence:
1. An attacker gains access to the administrative dashboard using compromised staff credentials.
2. The attacker appends a malicious image tag containing an `onerror` handler to an article body and saves the update.
3. A regular site visitor navigates to the article page.
4. The article component passes the compromised string to `dangerouslySetInnerHTML`.
5. The browser parser instantiates a live `<img>` element with an empty source attribute.
6. The browser attempts to load the empty image URL, fails, and dispatches an `error` event.
7. The browser evaluates the `onerror` attribute, displaying an alert dialog stating that the session was hacked.
8. This execution happens automatically for every user who views the article until the database entry is sanitized.

The change occurs exclusively within the saved data:

```js title="src/data.js" startLine="1"
export const article = {
  title: 'Park Opens Today',
  html: `<p>The park opens at <b>noon</b>.</p>~<img src="" onerror='alert("you were hacked")'>~`, // Added by the attacker on the admin page
};
```

The article body component remains unchanged. It continues passing the string to `dangerouslySetInnerHTML`, and the browser triggers an alert dialog immediately upon page load:

```page caption="The article page after the attacker edits the body: the alert opens for every visitor."
line: localhost:5173 says: you were hacked [OK] | bad
heading: Park Opens Today
line: The park opens at noon.
section: Comments
line: • John: Great news!
line: • Mia: <img src="" onerror='alert("you were hacked")'> | good
```

The page now holds two malicious image tags authored by attackers. The tag inside the comment list remains harmless text because it is rendered with curly braces. The tag inside the article body executes because it is parsed through `dangerouslySetInnerHTML`.

```dom caption="The HTML of the article body after the attack: a real img element with an onerror attribute."
<div>
  <p>The park opens at <b>noon</b>.</p>
! <img src="" onerror="alert(&quot;you were hacked&quot;)"> | note: A real element, built from the string of the attacker
</div>
```

> [!DEFINITION]
> **Stored XSS.** [NEW] Stored XSS, also called persistent XSS, occurs when a malicious payload is saved in a database and subsequently served to multiple users.
> 1. An attacker injects malicious code into a persistent backend datastore through forms, APIs, or compromised accounts.
> 2. The server delivers the stored payload to legitimate users who request the affected resource.
> 3. The payload executes in every visitor's browser with the full permissions of the web application, allowing attackers to hijack sessions or exfiltrate sensitive data (Lesson 48).

### Why the Attacker Uses `onerror` and Not `<script>`

Injecting a `<script>` tag in this position does not trigger code execution. MDN documentation notes that browsers deliberately prevent `<script>` elements from executing when inserted via `innerHTML`. However, the HTML specification still evaluates inline event handler attributes on other elements. An `onerror` attribute on an image provides a reliable execution vector. Other inline handlers like `onmouseover` work the exact same way.

### A Real Beginner Mistake: Trusting the Admin Page

1. A development team renders rich text articles using `dangerouslySetInnerHTML`, assuming content from internal editors is trustworthy.
2. Months later, an editor's account credentials are leaked or compromised.
3. An attacker edits an existing high-traffic article to include an image tag with an `onerror` handler.
4. The injected script executes in the browser of every visitor reading that article.
5. The team searches database records for `<script>` tags, finds zero matches, and fails to identify the active attack.

Safety depends on who has the ability to author or alter the string. Administrative accounts can be breached, and editors often copy and paste third-party HTML.

---

## PRINCIPLE | `DOMPurify.sanitize`: the bold word stays, and the `onerror` is removed

> [!PRINCIPLE]
> **Principle 4: Sanitizing: DOMPurify Removes the Code and Keeps the Formatting**
>
> *Pass HTML that anyone outside the team can influence through `DOMPurify.sanitize` before it reaches `__html`, and create the `{ __html }` object in one function next to the sanitizer.*
>
> The article body needs HTML for its bold word, so curly braces cannot show it. DOMPurify keeps the tags that format, such as `<p>` and `<b>`, and removes the parts that run code, such as `onerror` and `<script>`. A filter we write ourselves misses cases, so a library that experts maintain does the cleaning. One function such as `toSafeHTML` keeps every raw HTML string in one place that a reader can find.
>
> **DO THIS:**
> ```jsx
> function toSafeHTML(html) {
>   return { __html: ~DOMPurify.sanitize(html)~ }; // onerror is removed, noon stays bold
> }
> <div dangerouslySetInnerHTML={toSafeHTML(article.html)} />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const cleaned = ~article.html.replace('<script>', '')~; // **WRONG:** removes <script> but lets the img with onerror through
> <div dangerouslySetInnerHTML={{ __html: cleaned }} />
> ```

Because the article body requires formatting for its bold text, reverting to plain curly braces is not an option. Instead, the application must sanitize the markup before passing it to the browser parser.

Sanitizing is the security process of inspecting an HTML string and stripping out dangerous capabilities like inline event handlers and script tags. MDN recommends DOMPurify as an industry-standard library for this task. Calling its primary method, `DOMPurify.sanitize`, processes the untrusted string and returns a safe HTML string stripped of executable code:

```jsx title="Sanitizing a string with DOMPurify before it reaches __html"
import DOMPurify from 'dompurify';

const clean = ~DOMPurify.sanitize~(`<b>noon</b><img src="" onerror='alert("you were hacked")'>`); // Returns <b>noon</b><img src="">

<div dangerouslySetInnerHTML={{ __html: ~clean~ }} /> {/* noon in bold, and no alert */}
```

The fundamental takeaway is straightforward: **sanitizing preserves safe formatting tags like `<b>` while removing executable attributes like `onerror`**. The user views the intended bold formatting without triggering malicious code.

### VS | The Raw String vs. the Sanitized String: the same page at first, only one stops the attack

Passing raw HTML versus passing sanitized HTML differs by a single function call. When rendering benign content, both approaches produce identical visual output. However, their security profiles differ completely. If an attacker injects malicious markup, the raw string delivers executable event handlers straight to the browser. The sanitized string strips the dangerous attributes before the browser builds the DOM.

```tree caption="The raw article HTML carries onerror to the browser; the sanitized HTML keeps the bold word and drops the code."
What reaches `__html`
- !The raw string [`article.html`] | Still holds **`onerror`** | The browser **opens the alert**
- +The sanitized string [`DOMPurify.sanitize`] | Keeps **`<p>` and `<b>`**, removes **`onerror`** | The visitor sees **noon in bold**, and **nothing runs**
```

Never attempt to sanitize HTML using custom regular expressions or string replacement functions. Accurately parsing nested HTML tags and character encodings is notoriously difficult. A simple filter that strips `<script>` leaves image event handlers untouched, as demonstrated in Principle 3. Production applications should rely exclusively on specialized security libraries maintained by domain experts.

### VS | The Object Built Inline vs. the Object Built in One Function: the same page, one place to look

You have two options for constructing the `{ __html }` object. You can create it inline directly on the JSX element, or you can encapsulate both sanitization and object creation inside a dedicated helper function:

```jsx title="Creating the { __html } object inline on the tag, and in one function"
<div dangerouslySetInnerHTML={~{ __html: DOMPurify.sanitize(article.html) }~} /> {/* 1. Built inline on the tag */}

function ~toSafeHTML~(html) { // 2. Built in one function, right next to the sanitizer
  return { __html: DOMPurify.sanitize(html) };
}
<div dangerouslySetInnerHTML={toSafeHTML(article.html)} />
```

Both patterns produce the exact same rendered HTML and prevent the attack. However, centralizing the operation in a dedicated helper function improves code maintainability. The official React documentation advises creating this object as close to the data source as possible. Routing all raw HTML strings through a helper like `toSafeHTML` creates a single, auditable choke point for HTML rendering across your codebase.

The `toSafeHTML` helper mirrors the pattern shown in the official React documentation. In those docs, helper functions sanitize input before returning the `{ __html }` wrapper.

### Our Fourth Step: Sanitizing the Article Body

Begin by installing the library in your project dependencies (Lesson 07):

```bash title="Terminal"
npm install dompurify
```

The article component imports DOMPurify, wraps the sanitization logic in `toSafeHTML`, and passes the resulting object to the container element:

```jsx title="src/ArticleBody.jsx"
import DOMPurify from 'dompurify';

function toSafeHTML(html) {
  const clean = ~DOMPurify.sanitize(html)~; // Keeps <p> and <b>, removes onerror
  return { __html: clean };
}

export default function ArticleBody({ article }) {
  return <div ~dangerouslySetInnerHTML={toSafeHTML(article.html)}~ />; // Only sanitized HTML reaches the browser
}
```

The mock data file retains the malicious image payload, demonstrating that it no longer poses a security threat. DOMPurify does not discard the image tag entirely; it strips the dangerous `onerror` attribute. The image still encounters a load error, but no script executes because the event handler was removed.

```page caption="The article page with the sanitized body: noon is in bold, and no alert opens."
heading: Park Opens Today
line: The park opens at noon. | good
section: Comments
line: • John: Great news!
line: • Mia: <img src="" onerror='alert("you were hacked")'> | good
```

```dom caption="The Elements panel with the sanitized body: the img element is still there, but its onerror attribute is gone."
<div>
  <p>The park opens at <b>noon</b>.</p>
+ <img src=""> | note: DOMPurify removed onerror
</div>
```

The official React documentation establishes this clear guideline: only use `dangerouslySetInnerHTML` with **trusted and sanitized data**. Our application now implements the three-tier strategy outlined earlier. Reader comments use safe curly braces, while article bodies originating from external sources are thoroughly sanitized before rendering.

### A Real Beginner Mistake: One Filter by Hand, One Component Without It

1. A developer attempts to sanitize HTML by manually stripping `<script>` tags using string replacement.
2. Image tags containing `onerror` handlers pass through undetected.
3. Later, another engineer properly sanitizes content in the main article view, but a colleague passes raw HTML to a home page preview component.
4. The malicious payload executes on the home page where preview snippets are rendered.

Standardizing on a shared `toSafeHTML` helper function across all components eliminates both vulnerabilities.

---

## PRINCIPLE | `href` with a `javascript:` URL: React 19 blocks it, and every other address is yours to check

> [!PRINCIPLE]
> **Principle 5: `javascript:` URLs: React 19 Blocks One Scheme Only**
>
> *React 19 blocks a `javascript:` URL in `href` or `src`, but places every other address on the element as given, so check a link a user typed before it goes in `href`.*
>
> Escaping keeps a value inside its attribute, but it does not judge what the value means. The browser runs a `javascript:` URL when the user clicks the link. React 19 replaces such an address with one that only throws an error. Any other address, including a fake sign-in page, reaches the link unchanged, so our code allows only addresses that start with `https://`.
>
> **DO THIS:**
> ```jsx
> {~comment.website.startsWith('https://')~ ? <a href={comment.website}>{comment.author}</a> : <span>{comment.author}</span>} {/* Mia's name shows as text */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <a ~href={comment.website}~>{comment.author}</a> {/* **WRONG:** every address a user types becomes a link, unchecked */}
> ```

### An Address Can Be Code

React's automatic escaping ensures that attribute values cannot break out of their enclosing attribute quotes. However, escaping does not evaluate whether the attribute value itself is dangerous to the browser. Certain attributes, such as `href`, are inherently sensitive because the browser takes action based on their contents:

```jsx title="An address that is really code, placed in href with curly braces"
const url = 'javascript:alert("you were hacked")';

<a ~href={url}~>Mia</a> {/* Without the block in React 19, a click by the user would run alert */}
```

> [!DEFINITION]
> **A `javascript:` URL.** [NEW] A `javascript:` URL is an address scheme where the text following the colon is evaluated as executable JavaScript code.
> 1. Standard URLs use schemes like `https:` to locate resources, whereas the `javascript:` pseudo-scheme instructs the browser to run code.
> 2. When a user clicks an anchor link containing a `javascript:` URL, the browser executes the script in the context of the active tab.
> 3. An attacker does not need HTML tags or special characters to launch this attack, because the entire URL value is interpreted as code (Lesson 48).

React 19 automatically blocks this execution in `href` and `src` attributes. Rather than placing the attacker's script on the element, React DOM substitutes a custom URL that intentionally throws an error when clicked.

Both John's link and Mia's link use the identical JSX syntax: `href={comment.website}`. While they look the same in code, their runtime behavior differs drastically. John's link navigates to a legitimate website, whereas Mia's link contains executable code that React 19 neutralizes.

### Our Fifth Step: a Website Link for Each Comment

Blog commenting engines frequently offer an optional website field. Each comment record in our data file now includes a `website` property:

```js title="src/data.js" startLine="6"
export const comments = [
  { id: 1, author: 'John', website: 'https://john.example.com', body: 'Great news!' },
  { id: 2, author: 'Mia', website: ~'javascript:alert("you were hacked")'~, body: `<img src="" onerror='alert("you were hacked")'>` }, // Mia typed code into the website field
];
```

The comment list component turns each commenter's name into a clickable link to their personal site:

```jsx title="src/CommentList.jsx" startLine="5"
<li key={comment.id}>
  <a ~href={comment.website}~>{comment.author}</a>: {comment.body} {/* John's link opens his site; Mia's link is blocked */}
</li>
```

John's link functions normally, while Mia's malicious link is safely neutralized:
1. For John's comment, clicking the link opens his external website.
2. For Mia's comment, React 19 identifies the `javascript:` protocol in the `href` attribute and overrides it.
3. The rendered anchor element remains visible on the page displaying Mia's name.
4. When a user clicks her name, no alert appears. The browser console logs a React security error instead:

```page caption="The link of Mia after a click by the user: no alert opens, and the Console shows the error of React."
heading: Park Opens Today
line: The park opens at noon.
section: Comments
line: • John: Great news!
line: • Mia: <img src="" onerror='alert("you were hacked")'> | good
console: Uncaught Error: React has blocked a javascript: URL as a security precaution.
```

```dom caption="The href that React 19 writes on the link of Mia in place of her javascript: URL."
<li>
  <a href="https://john.example.com">John</a>: Great news!
</li>
<li>
+ <a href="javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')">Mia</a>: ... | note: Written by React, not by Mia
</li>
```

### What React 19 Leaves to Our Code

React 19 guards against a single dangerous protocol: the `javascript:` pseudo-scheme. Any other destination an attacker enters will be placed directly onto the link attribute without inspection. An attacker could supply the URL of a convincing phishing replica of your application's login screen, tricking users who click the author's profile.

Application code must validate untrusted links before assigning them to interactive elements. The most secure approach is an allowlist check that permits only secure `https://` addresses, rather than attempting to enumerate every possible malicious scheme:

```jsx title="src/CommentList.jsx"
export default function CommentList({ comments }) {
  return (
    <ul>
      {comments.map(comment => {
        const isLink = ~comment.website.startsWith('https://')~; // true for John, false for Mia
        return (
          <li key={comment.id}>
            {isLink ? <a href={comment.website}>{comment.author}</a> : <span>{comment.author}</span>}: {comment.body}
          </li>
        );
      })}
    </ul>
  );
}
```

The `startsWith` method evaluates whether a string begins with a specified prefix, returning a boolean. With this guard in place, Mia's name renders as plain text, ensuring no clickable link is created for an unverified protocol.

Escaping and protocol blocking represent two separate layers of security:
- **Output escaping protects against syntax injection.** It ensures special characters cannot break out of attributes or create unintended HTML tags.
- **Protocol filtering protects against executable URLs.** It prevents schemes like `javascript:` from executing code during user navigation.

Neither mechanism evaluates whether an external destination is safe or trustworthy. That verification remains the responsibility of your application logic.

### A Real Beginner Mistake: Trusting React with Every Link

1. A developer adds a website URL field to a comment form and renders commenter names as links.
2. The developer assumes React's automatic attribute escaping prevents all security risks.
3. An attacker enters a malicious URL.
4. While React 19 prevents execution of `javascript:` protocols, unvalidated external links can still direct users to credential phishing pages.

---

## All 5 Principles Together

### The Complete Project

Here is the complete implementation of the news article page. The data store contains both hostile payloads, and both are completely neutralized:

```js title="src/data.js"
export const article = {
  title: 'Park Opens Today',
  html: `<p>The park opens at <b>noon</b>.</p><img src="" onerror='alert("you were hacked")'>`,
};

export const comments = [
  { id: 1, author: 'John', website: 'https://john.example.com', body: 'Great news!' },
  { id: 2, author: 'Mia', website: 'javascript:alert("you were hacked")', body: `<img src="" onerror='alert("you were hacked")'>` },
];
```

```jsx title="src/ArticleBody.jsx"
import DOMPurify from 'dompurify';

function toSafeHTML(html) {
  const clean = ~DOMPurify.sanitize(html)~; // Principle 4: keeps <b>, removes onerror
  return { __html: clean };
}

export default function ArticleBody({ article }) {
  return <div ~dangerouslySetInnerHTML={toSafeHTML(article.html)}~ />; // Principles 2 and 3: the browser parses only sanitized HTML
}
```

```jsx title="src/CommentList.jsx"
export default function CommentList({ comments }) {
  return (
    <ul>
      {comments.map(comment => {
        const isLink = ~comment.website.startsWith('https://')~; // Principle 5: only https addresses become links
        return (
          <li key={comment.id}>
            {isLink ? <a href={comment.website}>{comment.author}</a> : <span>{comment.author}</span>}: ~{comment.body}~ {/* Principle 1: the comment reaches the page as text */}
          </li>
        );
      })}
    </ul>
  );
}
```

```jsx title="src/App.jsx"
import { article, comments } from './data.js';
import ArticleBody from './ArticleBody.jsx';
import CommentList from './CommentList.jsx';

export default function App() {
  return (
    <main>
      <h1>{article.title}</h1>
      <ArticleBody article={article} />
      <h2>Comments</h2>
      <CommentList comments={comments} />
    </main>
  );
}
```

```page caption="The finished article page: noon is in bold, the comment of Mia is text, her name is not a link, and no alert opens."
heading: Park Opens Today
line: The park opens at noon. | good
section: Comments
line: • John: Great news!
line: • Mia: <img src="" onerror='alert("you were hacked")'> | good
```

### How React Calls the Components in Order

When the application mounts, React executes `App` first. `App` returns the JSX elements for its child components. React then executes `ArticleBody`, which sanitizes and renders the rich text content, followed by `CommentList`, which renders comments as escaped text nodes:

```tree dir=right caption="The order in which React calls the components of the article page, and what each one protects."
What React calls when the article page loads
- +1. `App` is called first [`App`] | Shows the **title** | Passes `article` and `comments` down
- +2. `ArticleBody` is called second [`toSafeHTML`] | Passes `article.html` through **DOMPurify** | The browser parses **sanitized HTML** only
- +3. `CommentList` is called third [`{comment.body}`] | Places each comment with **curly braces** | Links only addresses that start with **`https://`**
```

| Where the string goes | What the browser does with it | What our code must do |
| :--- | :--- | :--- |
| **Text in curly braces, such as `{comment.body}`** | Shows the characters; tags never run | Nothing: React escapes it |
| **An attribute in curly braces, such as `title={text}`** | Keeps the characters inside the attribute | Nothing for most attributes |
| **`dangerouslySetInnerHTML`** | Parses the string and runs what it carries, such as `onerror` | Pass only trusted HTML, or HTML from `DOMPurify.sanitize` |
| **`href` or `src` with a `javascript:` URL** | Would run the code; React 19 blocks it | Still check the address: allow only `https://` |
| **`href` with any other address** | Follows it when the user clicks | Check it before it goes on the link |

Remember the core rule of this chapter. **Curly braces supply the browser with plain text, which never executes. The `dangerouslySetInnerHTML` prop supplies the browser with raw HTML, which executes any code it contains.**

---

## For the Interview

> **The Interview Question:** How does React protect you from cross-site scripting, and when does dangerouslySetInnerHTML remove that protection?

### How to Answer Clearly in 30 Seconds

"React protects us through curly braces. Every string we place in JSX text or in an attribute reaches the browser as text. So a comment that holds an `<img>` tag shows as characters and never runs. That protection ends at `dangerouslySetInnerHTML`. It sets the `innerHTML` of the element, and the browser parses the string as HTML. Then it runs whatever the HTML carries, such as an `onerror` attribute on a broken image. Because the HTML is usually saved, that is stored XSS: it runs for every visitor. So I follow three rules:
1. **Text stays in curly braces**: names, comments, and titles never need HTML.
2. **HTML from other people goes through a sanitizer**: I pass it through `DOMPurify.sanitize` and build the `{ __html }` object in one function.
3. **Links from users get checked**: React 19 blocks only `javascript:` URLs, so I allow only addresses that start with `https://`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"If the HTML has no `<script>` tag, is it safe to pass to `dangerouslySetInnerHTML`?"**
   **No.** Browsers deliberately refuse to execute `<script>` tags injected via `innerHTML`, but they consistently evaluate inline event handlers. An `<img>` tag with an empty `src` attribute fails immediately and triggers its `onerror` handler, executing arbitrary JavaScript. Handlers like `onmouseover` and `onload` work the exact same way. This is why sanitizers like DOMPurify remove both `<script>` tags and inline event handlers. Directly assigning to `ref.current.innerHTML` carries the exact same risk (Lesson 31).
2. **"The HTML comes from our own admin page. Do we still need to sanitize it?"**
   **Yes, whenever anyone outside the core engineering team can edit it.** Security depends on who authors the string, not where the data resides. Administrative credentials can be compromised, and internal editors can paste unverified third-party markup. React guidelines mandate using `dangerouslySetInnerHTML` only with trusted and sanitized data. Browsers also provide defense-in-depth mechanisms: a **Content Security Policy** restricts which scripts can execute, while **Trusted Types** enforces sanitization before `innerHTML` assignments. These tools provide valuable safeguards, but they complement sanitization rather than replacing it.
3. **"Does React check every link a user gives us?"**
   **No.** React automatically escapes attribute values, preventing strings from breaking out of attribute quotes. However, escaping does not evaluate URL destinations. React 19 specifically blocks the `javascript:` scheme in `href` and `src` attributes, substituting a safe error handler. All other addresses are assigned directly to the DOM node, making destination validation, such as checking for an `https://` prefix, the responsibility of application code.

```tree caption="What React does for us against cross-site scripting, and what stays our job."
Cross-site scripting in a React app
- +What React does [`{comment.body}` `title={text}`] | **Escapes** every string in curly braces | Blocks **`javascript:` URLs** in `href` and `src`
- !What stays our job [`dangerouslySetInnerHTML` `href`] | **Sanitize** HTML from other people with DOMPurify | **Check** every address a user types
```
