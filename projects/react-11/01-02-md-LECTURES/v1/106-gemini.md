# Lecture 106: What `'use client'` Does to a File and to Everything It Imports

*(Why does one line at the top of one file decide what every reader downloads?)*

> INTERVIEW QUESTION | ❱ CORE | What does the 'use client' directive do, and where does the client boundary sit?

---

## VS | `'use client'` on the Article File vs. `'use client'` on the Button File: the same screen, only the first sends `marked` to every reader

> In JavaScript, an import statement pulls another module into your file, and the bundler traces those imports to determine what the browser downloads. **The `'use client'` directive at the top of a file marks that module, along with every file it imports, as client code that the browser downloads and runs**. To protect page performance and keep bundle sizes small, place the directive on the smallest component that requires state or interactivity. Everything imported beneath that directive travels over the network to the device of every visitor.

Consider how module imports operate in standard JavaScript. When you write an import statement, the bundler inspects the target file and traces all of its subsequent imports. The bundler continues traversing this dependency graph down to the final module. Every file discovered along this journey is compiled into the client bundle, which is the JavaScript file the browser downloads (Lesson 46).

```js title="main.js: plain JavaScript, built for the browser"
import { showPost } from ~'./post.js'~; // You import one file of your own
```

```js title="post.js"
import { ~marked~ } from 'marked'; // post.js imports marked, so marked joins the bundle too

export function showPost(text) {
  document.querySelector('article').innerHTML = marked(text);
}
```

The main entry file never directly imports `marked`. Despite that, `marked` ends up in the client bundle because the chain of imports reaches it. A single import statement in an upstream file determines everything that follows downstream.

A React application built with Server Components relies on the exact same dependency chain. In this architecture, all files default to server code. They execute exclusively on the server to generate HTML, and the browser never downloads their source code (Lesson 101). The `'use client'` directive alters this default behavior for a single file. It tells the bundler that the file, along with every module down its import chain, must be treated as client code.

```jsx title="ReadMore.jsx: a button that opens the text of an article"
~'use client';~ // This file, and every file it imports, goes to the browser
import { useState } from 'react';
```

Keep this central rule in mind throughout this lesson:

**The `'use client'` directive marks its file and every module down its import chain as client code. Place the directive on the smallest file that requires state or user interaction.**

> [!DEFINITION]
> **Server Component and Client Component.** [REVIEW] A Server Component executes on the server before the page is sent, and the browser receives only its rendered HTML output, never its component code. In an application with Server Components, every component is a Server Component by default. A Client Component is a component whose code is sent to the browser and executed there, allowing it to use React state hooks like `useState` and event listeners like `onClick`. Its file begins with the `'use client'` directive (Lesson 101).

> [!DEFINITION]
> **Directive.** [REVIEW] A directive is a specialized string literal placed at the very top of a file, such as `'use client'`, that delivers build instructions to the bundler. The JavaScript runtime itself ignores the directive as an ordinary string (Lesson 101).

> [!DEFINITION]
> **Client code.** [NEW] Client code is the official React term for source code that is sent to and run by the client browser. A module marked with `'use client'` is client code, and every file it imports becomes client code as well. All other code remains server code, which the browser never downloads (Lesson 106).

### The Same Screen, Two Downloads

Imagine opening a news article on a smartphone. The page displays an article heading, Park Opens Today, with a Read more button positioned beneath it.

```page width=text caption="The article page when the user opens it: a title and a Read more button."
heading: Park Opens Today
line: [Read more]
```

The user taps the Read more button. The full article text expands under the button, and the button label changes to Show less.

```page width=text caption="The same page after one tap: the button reads Show less, and the text is open."
heading: Park Opens Today
line: [Show less]
line: The park opens at noon. | good
```

This compact interface contains two distinct sections with opposing technical requirements:
1. **The article text.** The article content originates in a Markdown file, and an external library named `marked` converts that text into HTML. Because this text is identical for every reader, a Server Component formats it once on the server, keeping `marked` completely off user devices (Lesson 101).
2. **The toggle button.** The button must store whether the text is currently expanded, and it must respond to user taps. These requirements demand `useState` and an `onClick` handler. Therefore, the button file requires `'use client'` (Lesson 101).

Our application could place the directive in one of two project files:
- The article file, `Article.jsx`, which renders the title, parses the text with `marked`, and renders the button.
- The button file, `ReadMore.jsx`, which manages the expanded state and renders the button element.

Placing `'use client'` on either file produces the exact same visual screen. Both options display the title, show the button, and reveal the text after a tap. However, they produce radically different bundle downloads:
- **Placing the directive on `Article.jsx`** designates the article module as client code. Because the article file imports `marked`, `marked` becomes client code too. Because it also imports the button file, the button becomes client code as well. Every reader downloads all three files.
- **Placing the directive on `ReadMore.jsx`** designates only the button file as client code. The article file and the `marked` library remain on the server, completely excluded from the client download.

```tree caption="The same page with use client on the article file or on the button file: the screen is the same, and the download is not."
Where the `'use client'` line stands on the article page
- !On `Article.jsx` [`'use client'` above the title and the text] | `Article.jsx`, **`marked`**, and `ReadMore.jsx` are client code | Every reader **downloads `marked`** to format a text that is the same for all
- +On `ReadMore.jsx` only [`'use client'` above the button] | **Only `ReadMore.jsx`** is client code | `Article.jsx` and `marked` **stay on the server**
```

### The Boundary Is an Import, Not a Tag

The transition point where server code connects with client code is called the **boundary**. This boundary sits at a specific import statement: the exact line where a server file imports a module marked with `'use client'`. Therefore, the client boundary exists inside the import tree of your files, not inside the tree of rendered HTML tags on your screen.

> [!DEFINITION]
> **The render tree and the module dependency tree.** [REVIEW] The render tree illustrates which component renders another through the nesting of JSX tags. The module dependency tree illustrates which file imports another through your `import` statements. While both structures often look similar, they answer two completely different architectural questions (Lesson 06).

Keep this distinction clear throughout this lesson: **file imports determine where code executes, not the visual placement of components on the screen.**

### What the Wrong Place Costs

Placing the directive too high in the dependency tree imposes heavy costs that remain completely invisible on the screen:
1. **Unnecessary network payload.** Moving the directive just one file higher forces every reader to download `marked` and the article component simply to display shared text. The official React documentation notes that `marked` adds 35.9 kilobytes of raw code, or 11.2 kilobytes after network compression.
2. **Delayed rendering and interaction.** As the official React documentation warns, large bundle sizes are expensive for a client device to download and parse. Excess JavaScript delays the time required for your interface to appear and become responsive.
3. **Silent performance regressions.** The user interface looks and behaves identically in both cases. As a result, this mistake never produces an obvious visual bug, showing up only when someone inspects the client bundle.

### The Rule of Thumb: which is the smallest file that needs state or a tap?

**Before writing `'use client'`, ask one question: which is the smallest file that requires state or user interaction? Place the directive at the top of that specific file, and nowhere above it.**

In real-world applications, that guiding question leads to one of three architectural patterns:
1. **On a full page file, such as `Article.jsx`.** This placement makes sense only when the entire screen requires continuous client interactivity, as a real-time calculator does. Our article page does not need this, because only the toggle button handles user input.
2. **On an interactive leaf file, such as `ReadMore.jsx`.** The parent article component passes shared content into the button component as `children`. The official React documentation organizes its own expandable notes example this way, keeping the parent page on the server while marking only the small interactive wrapper.
3. **On a dedicated adapter file between a Server Component and a third-party library.** Some older component packages use React state without declaring `'use client'` in their published files. The official React documentation suggests adding your own Client Component file in between as an adapter.

This adapter pattern requires only three lines of code. Your wrapper file declares the directive, and the imported library becomes client code through your file:

```jsx title="src/Carousel.jsx: your own file around an older library"
~'use client';~ // Marks your file, so the library it imports is client code too
import { Carousel } from 'acme-carousel';

export default Carousel;
```

```tree caption="Three places to put the use client line, and the page each one fits."
Three places for `'use client'`
- !On the whole page file [`Article.jsx`] | Fits only when **all of the file** answers the user | On our page it sends **`marked` to every reader**
- +On the small interactive file [`ReadMore.jsx`] | Fits **one small interactive part** around shared content | The article and `marked` **stay on the server**
- +On a small file of your own around a library [`Carousel.jsx`] | Fits an **older library** with no line of its own | The library **becomes client code** through your file
```

Experienced engineers recognize four common misconceptions surrounding the directive:
1. **Assuming `'use client'` marks an individual component.** The directive marks an entire module file, along with every single file that module imports.
2. **Adding the directive to a parent file to silence a `useState` error.** Moving the directive up silences the compiler warning, but it pulls everything that file imports into the browser bundle.
3. **Assuming all content displayed inside a Client Component becomes client code.** Only files directly or transitively imported by the marked module become client code. JSX elements that an external server file passes in as `children` are not imported by the client file.
4. **Interpreting `'use client'` to mean code never runs on the server.** The official React documentation defines client code by what is sent to the browser. Whether a framework also renders Client Components into initial HTML on the server is a separate mechanism called server-side rendering (Lesson 102).

The remainder of this lesson demonstrates each principle on our news article page.

## SECTION | The News Article with a Read more Button

Our news page contains one Markdown file and three components:

```files title="news: the article page" caption="The article page: the text in Markdown, two Server Components, and one Client Component."
post.md | content | The text of the article, written in Markdown
src/
  ArticlePage.jsx | Server Component | Reads `post.md` with `readFile` and renders `Article`
  Article.jsx | Server Component | Renders the title, formats the text with `marked`, and wraps it in `ReadMore`
  ReadMore.jsx | Client Component | Starts with `'use client'` and shows its `children` only when open
```

```md title="post.md"
The park opens at **noon**.
```

The top-level component, `ArticlePage`, is an asynchronous Server Component (Lesson 101). It reads the Markdown file directly from disk and hands the text content to `Article` as a prop:

```jsx title="src/ArticlePage.jsx" startLine="1"
import { readFile } from 'node:fs/promises';
import Article from './Article';

export default async function ArticlePage() {
  const text = await readFile('post.md', 'utf8');
  return <Article ~text={text}~ />; // Hands the Markdown text to Article as a prop
}
```

This page component remains identical throughout the entire lesson. The following principles focus on the two child components beneath it and examine how directive placement changes the bundle.

Remember the central rule of this lesson: **The `'use client'` directive marks its file and every module down its import chain as client code. Place the directive on the smallest file that requires state or user interaction.**

**PRINCIPLES:** Examining where `'use client'` stands on our article page reveals three essential architectural rules:
1. **Principle 1: `'use client'` on line 1 makes the file client code.** The import statement reaching that file from a Server Component establishes the client boundary.
2. **Principle 2: `'use client'` on `Article.jsx` sends every file it imports to the browser.** The `marked` library travels to the client too, even without a directive of its own. Placing the directive higher in the tree increases what every visitor must download.
3. **Principle 3: JSX passed as `children` stays on the server.** The client boundary follows module imports, not component tags. A Server Component that passes JSX elements between the tags of a Client Component still renders those elements on the server.

---

## PRINCIPLE | `'use client'` on line 1: the file becomes client code, and the import that reaches it is the boundary

> [!PRINCIPLE]
> **Principle 1: `'use client'`: The Line on Line 1 Sends the File to the Browser**
>
> *Write `'use client'` at the very top of a file, above every import, in single or double quotes; it marks the file as client code, and the import of that file from a Server Component is the boundary.*
>
> An interactive button requires `useState`, which Server Components cannot use. Adding `'use client'` enables client hooks, but the directive is neither a Hook nor an internal component setting. It is a plain string that the bundler evaluates before processing anything else in the file. When a Server Component imports that marked file, the server omits the client component logic from its bundle, and the browser downloads the code to complete rendering.
>
> **DO THIS:**
> ```jsx
> ~'use client';~ // Line 1: ReadMore.jsx is client code
> import { useState } from 'react';
>
> export default function ReadMore({ children }) {
>   const [open, setOpen] = useState(false);
>   return <button onClick={() => setOpen(!open)}>Read more</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import { useState } from 'react';
> ~'use client';~ // **WRONG:** under an import, the line does not mark the file, so ReadMore cannot use useState
>
> export default function ReadMore({ children }) {
>   const [open, setOpen] = useState(false);
>   return <button onClick={() => setOpen(!open)}>Read more</button>;
> }
> ```

### One String on Line 1

Here is the complete implementation of the button module. Every line of this component will look familiar from earlier lessons, with the sole exception of line 1:

```jsx title="src/ReadMore.jsx" startLine="1"
~'use client';~ // Marks this file as client code: its code goes to the browser

import { useState } from 'react';

export default function ReadMore({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!open)}>
        {open ? 'Show less' : 'Read more'}
      </button>
      {open && children}
    </>
  );
}
```

Line 1 contains a string literal that performs no action during ordinary JavaScript runtime execution. Nothing assigns it to a variable, nothing stores it in memory, and nothing passes it to another function. Instead, the **bundler** reads this string before processing any other statement in the file. As the official React documentation explains, directives provide instructions to bundlers compatible with React Server Components. In modern production environments, that compatible bundler is packaged within an application framework, such as the Next.js App Router (Lesson 46).

Compare this directive to a standard React Hook. Calling `useState` invokes a function inside your component body, which React executes during component rendering. By contrast, `'use client'` sits completely outside all components, positioned above every import statement. It speaks directly to the bundler, which analyzes files long before any component executes. Therefore, the directive is not a local configuration toggle inside a component. **It is an architectural mark that governs the entire file.**

### Where the Boundary Sits

Here is the import statement inside the article component that loads the button module:

```jsx title="src/Article.jsx" startLine="2"
import ~ReadMore~ from './ReadMore'; // A server file imports a marked file: this import is the boundary
```

**This import statement establishes the boundary: the exact junction where server code meets client code.** The parent file, `Article.jsx`, contains no directive, meaning it executes as server code. The imported button file explicitly declares `'use client'`. The official React documentation explains how compatible bundlers handle this. When a Server Component imports a client-marked module, the bundler treats that import as a boundary between server-run and client-run code.

Technical interviews often refer to this junction as the client boundary, while the official React documentation calls it the server-client boundary. Both terms describe the exact same import statement.

```tree dir=right caption="The import tree of the article page: the boundary sits at the import from Article.jsx into the marked ReadMore.jsx."
The imports of the article page
- +`ArticlePage.jsx` [Server Component] | Imports `Article.jsx` | **Server code**
- +`Article.jsx` [Server Component] | Imports `marked` and **`ReadMore.jsx`** | **Server code**
- The boundary [`import ReadMore`] | A server file imports a **marked file** | From here down, **client code**
- +`ReadMore.jsx` [`'use client'`] | Imports only `react` | **Client code**, sent to the browser
```

### What the Server Does with `ReadMore`

**The server renders the article content and leaves the execution of `ReadMore` to the browser.** When the browser runs the code of a module, the official React documentation says the file is **evaluated** on the client. Here is the exact execution order:
1. The framework executes `ArticlePage` on the server. This component reads the Markdown file from disk.
2. The framework executes `Article` on the server. The `marked` library converts the raw Markdown text into HTML.
3. The framework encounters the `<ReadMore>` element. Because the button file is marked as client code, the framework does not execute its component function on the server. The official React documentation describes this as opting out of evaluating any code imported from client-marked code.
4. The browser downloads the button module inside the client JavaScript bundle. As the official React documentation states, the client, with its client code downloaded, then completes rendering the rest of the tree. The interactive button renders on the page, and user taps toggle the visibility of the text.

Whether the framework also renders the button into the initial HTML document is handled by server-side rendering, which is an independent architectural step (Lesson 102).

### VS | `'use client'` on Line 1 vs. `'use client'` Under an Import: only line 1 marks the file

The directive functions only when written at the very beginning of the file:

```jsx title="'use client' on line 1"
~'use client';~ // The file is marked: ReadMore is a Client Component
import { useState } from 'react';
```

```jsx title="'use client' under an import"
import { useState } from 'react';
~'use client';~ // **WRONG:** below an import, the file is not marked
```

Both snippets contain the exact same characters, but only the first placement successfully configures the module. The official React documentation specifies that the directive must be at the very beginning of a file, above any imports or other code. When placed beneath an import statement, the directive is treated as an unused string expression and is ignored.

This positioning requirement catches many developers off guard. By habit, engineers often place import statements at the top of a file and paste the directive underneath. Because the directive is ignored, the file remains an un-marked Server Component. When the component attempts to call `useState`, the framework throws an error explaining that Server Components cannot use state hooks. Moving the directive above all import statements immediately fixes the problem.

The quotation marks used around the directive are equally strict:

```jsx title="Three ways to write the line"
~'use client';~ // Single quotes: marks the file
~"use client";~ // Double quotes: marks the file too
~`use client`;~ // **WRONG:** backticks: the file is not marked
```

Single quotes and double quotes are both fully supported. The official React documentation uses both styles across its code examples. By contrast, template literal backticks do not work. The official React documentation explicitly warns that the directive must be written with single or double quotes, but not backticks. Only source code comments are permitted to appear above the directive, as the documentation confirms that comments are acceptable.

### Our Article Page: `Article.jsx` Wraps the Text in `ReadMore`

Here is the complete implementation of the article component, with the formatted text placed between the `<ReadMore>` tags:

```jsx title="src/Article.jsx" startLine="1" good="2,8"
import { marked } from 'marked';
import ~ReadMore~ from './ReadMore'; // The boundary: ReadMore.jsx is client code

export default function Article({ text }) {
  return (
    <>
      <h1>Park Opens Today</h1>
      <ReadMore>
        <div dangerouslySetInnerHTML={{ __html: marked(text) }} />
      </ReadMore>
    </>
  );
}
```

Because the Markdown file is authored directly by the website team, the HTML produced by `marked` is fully trusted. That author trust makes `dangerouslySetInnerHTML` safe in this specific context (Lesson 48).

The article page now operates exactly as shown in the introduction. The visitor sees the title and the interactive button, and a single tap reveals the formatted article text.

---

## PRINCIPLE | `'use client'` on `Article.jsx`: every file it imports goes to the browser, `marked` included

> [!PRINCIPLE]
> **Principle 2: Transitive Dependencies: Everything a Marked File Imports Is Client Code**
>
> *Everything a `'use client'` file imports, and everything those files import in turn, is client code too, whether or not it has its own `'use client'`; so put the line on the smallest file that needs it.*
>
> The directive marks an entire module subtree, not an isolated component. Moving the directive up by a single file pulls every import of that file into the client bundle, including third-party libraries that know nothing about React. The user interface looks identical on screen, meaning only bundle inspection exposes the hidden cost.
>
> **DO THIS:**
> ```jsx
> import { marked } from 'marked';
> import ~ReadMore~ from './ReadMore'; // Only ReadMore.jsx carries 'use client'
>
> export default function Article({ text }) {
>   return <ReadMore><div dangerouslySetInnerHTML={{ __html: marked(text) }} /></ReadMore>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~'use client';~ // **WRONG:** Article.jsx and marked now go to every reader's browser
> import { marked } from 'marked';
> import ReadMore from './ReadMore';
>
> export default function Article({ text }) {
>   return <ReadMore><div dangerouslySetInnerHTML={{ __html: marked(text) }} /></ReadMore>;
> }
> ```

### The Same Page, with the Line One File Higher

Here is the top of the article component file, modified by adding the directive above its import statements:

```jsx title="src/Article.jsx" startLine="1" bad="1"
~'use client';~ // Marks Article.jsx, and everything it imports, as client code
import { marked } from 'marked';
import ReadMore from './ReadMore';
```

The button file retains its original `'use client'` directive, and no other code changes. In the browser, the screen displays Park Opens Today, and clicking the button expands the article text exactly as before.

**Moving the directive up by one file causes the browser to download three files instead of one.** The visual screen provides no warning of this penalty. Here is how the bundler resolves the dependency graph down the chain of imports:
1. `ArticlePage.jsx` imports `Article.jsx`. The page module is a Server Component, but the article module now carries the directive. Consequently, this import statement becomes the new client boundary.
2. `Article.jsx` becomes client code because of its top-level directive.
3. The article file imports `marked`. Although `marked` knows nothing about React and contains no directive, it becomes client code because a client module imports it.
4. The article file imports `ReadMore.jsx`, ensuring the button module is also packaged for the client. The directive inside `ReadMore.jsx` remains in place, but it no longer alters behavior. The official React documentation explains that when a client module is imported from another client module, the directive has no effect.
5. The resulting client bundle now contains the article module, the `marked` library, and the button module.

This behavior follows the exact same pattern seen in standard JavaScript. In plain JavaScript, `marked` entered the bundle because an import statement connected to it. Here, the client dependency chain begins at the marked article file and reaches `marked` immediately.

### Every File Below the Line

> [!DEFINITION]
> **Transitive dependencies.** [NEW] The transitive dependencies of a file include the modules it imports, the modules those files import in turn, and so on down to the end of the chain. The word transitive means passing across: the client designation passes from each file to every module it imports. The official React documentation explains: "Add `'use client'` at the top of a file to mark the module and its transitive dependencies as client code." Together, the marked file and its transitive dependencies form a distinct section of the module dependency tree, referred to by react.dev as a subtree of Client modules (Lesson 106).

Here is how that client subtree appears in our application when the directive sits on the article file:

```tree caption="The import tree with use client on Article.jsx: the boundary moves up, and the whole subtree under it is client code."
`ArticlePage.jsx` [Server Component] | Imports `Article.jsx`: **this import is now the boundary**
- !`Article.jsx` [`'use client'`] | **Client code** because of its own line
  - !`marked` [no directive] | **Client code** because `Article.jsx` imports it
  - !`ReadMore.jsx` [`'use client'`] | **Client code**; its own line now **has no effect**
```

### VS | `marked` with Its Own Line vs. `marked` Without One: it is client code either way

The fact that `marked` contains no `'use client'` directive does not prevent it from running in the browser. When a client module imports a file, that dependency is evaluated as client code regardless of whether it contains a directive. The official React documentation confirms that imported modules will also be evaluated on the client regardless of whether their modules contain a `'use client'` directive.

Furthermore, a client subtree is not limited to React components. The `marked` package exports ordinary parsing functions, yet it travels to the browser all the same. As the official React documentation clarifies, code marked for client evaluation is not limited to components. All code that is part of the client module subtree is sent to and run by the client.

| Where `'use client'` stands | Client code in the bundle | What the reader sees |
| :--- | :--- | :--- |
| **On `ReadMore.jsx` only** | `ReadMore.jsx` | `Park Opens Today` and a working `Read more` button |
| **On `Article.jsx`** | `Article.jsx`, `marked`, and `ReadMore.jsx` | The same title and the same working button |

### The Quick Fix That Moves the Line Up

**Using `'use client'` as a quick fix for a single `useState` error drags the entire article module and all of its imported libraries into the client bundle** (Lesson 101). In practice, this mistake unfolds through five common steps:
1. A developer adds expanded state using `useState` directly inside the article component file.
2. The framework reports a build error explaining that `useState` cannot run inside a Server Component.
3. The developer adds `'use client'` to the top of the article file. The compiler error disappears, and the toggle button works.
4. Because the article file imports `marked`, the bundler pulls `marked` into the client bundle, forcing every visitor to download a parsing library for static content.
5. In a production codebase, article components often import additional utilities, such as code syntax highlighters. That single directive pulls every one of those libraries into the client bundle as well.

The solution is the pattern demonstrated in Principle 1. Keep interactive state inside its own compact leaf component, add the directive only to that file, and leave the parent article component as a pure Server Component.

---

## PRINCIPLE | `children` from a Server Component: the JSX stays on the server, even between the tags of a Client Component

> [!PRINCIPLE]
> **Principle 3: The Module Dependency Tree: JSX Passed as `children` Stays on the Server**
>
> *The boundary is drawn on the module dependency tree, not on the render tree; JSX that a Server Component places between the tags of a Client Component is rendered on the server, because the client file never imports it.*
>
> On the screen, the article text appears as a child of `ReadMore`. In the module imports, `ReadMore.jsx` never imports `marked` or the Markdown file. Therefore, `Article` formats the text on the server, and `ReadMore` receives only the completed HTML to display or hide.
>
> **DO THIS:**
> ```jsx
> <ReadMore>
>   <div dangerouslySetInnerHTML={{ __html: ~marked(text)~ }} /> {/* Article.jsx runs marked on the server */}
> </ReadMore>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> 'use client';
> import { ~marked~ } from 'marked'; // **WRONG:** imported by a client file, marked goes to every reader
>
> export default function ReadMore({ text }) {
>   return <div dangerouslySetInnerHTML={{ __html: marked(text) }} />;
> }
> ```

### The Text Sits Inside a Client Component

We remove the directive from the article module once again. The button module keeps its own directive, exactly as demonstrated in Principle 1. Here is the article component code, highlighting the server-side invocation of `marked`:

```jsx title="src/Article.jsx" startLine="1"
import { marked } from 'marked';
import ReadMore from './ReadMore';

export default function Article({ text }) {
  return (
    <>
      <h1>Park Opens Today</h1>
      <ReadMore>
        <div dangerouslySetInnerHTML={{ __html: ~marked(text)~ }} /> {/* Runs on the server, inside Article */}
      </ReadMore>
    </>
  );
}
```

The article markup sits between the `<ReadMore>` tags, meaning that on screen it appears inside a Client Component. **Despite that visual nesting, `Article` parses the text on the server, and `ReadMore` receives only the completed HTML elements**. This separation holds because the button module never imports `marked` and never imports the raw text. Only modules imported by a marked file become client code.

This pattern operates just like argument passing in standard JavaScript. When you pass a computed value into a function, that function receives the result rather than the code that created it:

```js title="Plain JavaScript: a function receives a value, not the code that made it"
const html = ~marked(text)~; // marked runs here, in this file
show(html); // show receives a finished string, and never sees marked
```

The `children` prop functions in the exact same manner. The parent `Article` component computes the final HTML structure on the server, and `ReadMore` receives that structure ready to display.

### Two Trees of the Same Page

Every React application can be understood through two distinct structural trees (Lesson 06). While both trees look similar, they answer two completely different architectural questions:

```tree caption="The render tree and the module dependency tree of the same article page: the text is a child of ReadMore in one, and nowhere under ReadMore.jsx in the other."
The same article page, drawn as two trees
- +Render tree: who renders whom [`ArticlePage` `Article` `ReadMore`] | `Article` places the text **between the `<ReadMore>` tags** | On the screen, the text is a **child of `ReadMore`**
- +Module dependency tree: who imports whom [`ArticlePage.jsx` `Article.jsx` `ReadMore.jsx`] | `Article.jsx` imports **`marked` and `ReadMore.jsx`** | `ReadMore.jsx` imports **only `react`**
```

Visual placement within the rendered UI does not determine where component code runs. File imports govern execution boundaries. The official React documentation highlights this rule: "Recall that `'use client'` defines the boundary between server and client code on the _module dependency tree_, not the render tree." Furthermore, the documentation points out that a parent-child render relationship between components does not guarantee the same render environment.

### How the Finished Text Reaches the Button

**The server completes the text markup before the browser ever executes client JavaScript.** Here is the complete execution sequence, from the server build to the user tap:
1. `Article` executes on the server. It calls `marked` on the Markdown string and creates the `<div>` container with the finished HTML.
2. `Article` passes that rendered element between the tags of the button component. Consequently, `ReadMore` receives the element through its `children` prop (Lesson 09).
3. `ReadMore` executes inside the client browser. It receives the pre-rendered `<div>` and never interacts with `marked` or the Markdown source.
4. When the user taps the button, `ReadMore` toggles visibility for markup that the server already generated. The browser never parses Markdown into HTML.

The official React documentation constructs its expandable notes tutorial using this exact composition architecture. In that example, a Server Component wraps each note item in an `Expandable` client component. As react.dev notes, in the browser, the Client Components will see output of the Server Components passed as props.

After the user taps the button, the browser developer tools reveal the finished HTML resting beneath the button:

```dom title="Elements panel" caption="The article page in the Elements panel after one tap: the div that Article finished on the server sits under the button."
<h1>Park Opens Today</h1>
<button>Show less</button>
+ <div> | note: Finished on the server by Article
+   <p>The park opens at <strong>noon</strong>.</p>
+ </div>
```

### VS | The Text Placed Between the Tags vs. `marked` Imported in `ReadMore.jsx`: only the first keeps `marked` on the server

A developer might feel tempted to consolidate all article text logic inside the button module. In that alternative design, the article module passes raw text as a prop. The button module imports `marked` to parse the text directly on the client. Compare that approach with our architecture:

```jsx title="Article.jsx places the finished text between the tags"
<ReadMore>
  <div dangerouslySetInnerHTML={{ __html: ~marked(text)~ }} /> {/* Runs in Article.jsx, on the server */}
</ReadMore>
```

```jsx title="ReadMore.jsx imports marked and formats the text"
'use client';
import { useState } from 'react';
import { ~marked~ } from 'marked'; // **WRONG:** a client file imports marked, so marked goes to the browser

export default function ReadMore({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!open)}>{open ? 'Show less' : 'Read more'}</button>
      {open && <div dangerouslySetInnerHTML={{ __html: marked(text) }} />}
    </>
  );
}
```

Both implementations produce the exact same visual text after a tap. However, their impact on the client bundle is completely different. When the article module places the formatted text between the tags, `marked` runs on the server, and `ReadMore` receives only rendered output. When the button module imports `marked`, that import statement pulls `marked` into the client bundle, forcing every visitor to download it. Passing the rendered markup as `children` keeps data processing on the server and preserves minimal client bundle sizes.

---

## All 3 Principles Together

### The complete code

Here is the finished article application: four files coordinated around a single `'use client'` directive.

```files title="news: the finished article page" caption="The finished article page: the text, two Server Components, and the one Client module."
post.md | content | The text of the article, written in Markdown
src/
  ArticlePage.jsx | Server Component | Reads `post.md` and renders `Article`
  Article.jsx | Server Component | No directive; formats the text with `marked` and passes it to `ReadMore`
  ReadMore.jsx | Client Component | The only file with `'use client'`; opens and closes the text
```

```md title="post.md"
The park opens at **noon**.
```

```jsx title="src/ArticlePage.jsx" startLine="1"
import { readFile } from 'node:fs/promises';
import Article from './Article';

export default async function ArticlePage() {
  const text = await readFile('post.md', 'utf8');
  return <Article text={text} />;
}
```

```jsx title="src/Article.jsx" startLine="1"
import { ~marked~ } from 'marked'; // Principle 2: no line here, so marked stays on the server
import ~ReadMore~ from './ReadMore'; // Principle 1: the boundary

export default function Article({ text }) {
  return (
    <>
      <h1>Park Opens Today</h1>
      <ReadMore>
        <div dangerouslySetInnerHTML={{ __html: ~marked(text)~ }} /> {/* Principle 3: finished on the server */}
      </ReadMore>
    </>
  );
}
```

```jsx title="src/ReadMore.jsx" startLine="1"
~'use client';~ // Principle 1: line 1, above every import

import { useState } from 'react';

export default function ReadMore({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(!open)}>
        {open ? 'Show less' : 'Read more'}
      </button>
      {open && children}
    </>
  );
}
```

```page width=text caption="The finished article page when the user opens it."
heading: Park Opens Today
line: [Read more]
```

```page width=text caption="The finished article page after one tap on Read more."
heading: Park Opens Today
line: [Show less]
line: The park opens at noon. | good
```

### The order in which React calls the components

`ArticlePage` and `Article` execute on the server. `ReadMore` executes inside the client browser:

```tree dir=right caption="The order in which the components of the article page run: ArticlePage and Article on the server, ReadMore in the browser."
How the article page reaches the reader
- +1. On the server [`ArticlePage`] | **Reads `post.md`** with `readFile` | Renders `Article` with the text
- +2. On the server [`Article`] | **Runs `marked`** on the text | Places the finished `<div>` **between the `<ReadMore>` tags**
- +3. In the browser [`ReadMore`] | Of our files, the bundle holds **only `ReadMore.jsx`** | React **completes the render**, and every tap opens or closes the text
```

### Summary

| Aspect | The Common Habit | The React Rule |
| :--- | :--- | :--- |
| **What the line marks** | Treating `'use client'` as a component-level setting | Marks the whole file and every file that module imports |
| **Where the line goes** | Pasting it under imports or writing it in backticks | Line 1, above every import, in single or double quotes |
| **Where the boundary sits** | Looking for boundaries in rendered JSX tags | At the import of a marked file from a Server Component |
| **Which file gets the line** | Marking a large file that reported a `useState` error | Marking the smallest component that requires state or a tap |
| **Content inside a Client Component** | Assuming nested children must execute on the client | Passing JSX as `children` keeps its execution on the server |

Remember the central rule of this lesson: **The `'use client'` directive marks its file and every module down its import chain as client code. Place the directive on the smallest file that requires state or user interaction.**

---

## For the Interview

> **The Interview Question:** What does the 'use client' directive do, and where does the client boundary sit?

### How to Answer Clearly in 30 Seconds

"`'use client'` is a build directive placed at the very top of a file, above all imports, that instructs compatible bundlers how to partition code. It marks that module and all of its transitive dependencies as client code that the browser must download and execute. The client boundary sits at each import statement where a Server Component imports a client-marked module. Crucially, this boundary lives on the module dependency tree rather than the component render tree. Because boundaries follow imports rather than JSX nesting, rendered elements passed as `children` execute on the server. The client module receives only pre-rendered elements. In production, place the directive on the smallest possible leaf component that requires state or event listeners to keep client bundles lean."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does a file need `'use client'` to run in the browser?"**
   - No. Any module imported directly or transitively by a client file becomes client code, even without a directive of its own. As the official React documentation confirms, a component can still be evaluated on the client even if it does not have a `'use client'` directive. Furthermore, writing `'use client'` inside a module already imported by client code has no effect because the file is already bundled for the client.

2. **"Where exactly does the client boundary sit, and what about a Server Component rendered inside a Client Component?"**
   - The boundary sits at the import statement where a server module imports a client-marked module on the dependency tree. A Server Component can still appear nested inside a Client Component on the screen if an upstream Server Component passes it in as `children`. This pattern works because the client module never imports the server component file. As the official React documentation emphasizes, a parent-child render relationship between components does not guarantee the same render environment.

3. **"When must a file be client code, and where should the line go?"**
   - A module must be client code when it uses state hooks, event handlers, or browser APIs like canvas. It also applies to third-party components requiring the browser. Place the directive on the smallest leaf component that uses those capabilities. For older third-party libraries that lack the directive, build a small wrapper component with `'use client'` between that library and your Server Component.

```tree dir=right caption="Interview comparison: what use client marks, and where the boundary sits."
`'use client'` in an interview
- +What it marks [`'use client'` on line 1] | The **file** and **every file it imports**, all the way down | Sent to **the browser** and run there
- +Where the boundary sits [`import ReadMore`] | At the **import** of a marked file from a **Server Component** | On the **module dependency tree**, not the render tree
- !What it does not mark [`children` from a Server Component] | JSX a Server Component **places between the tags** | Rendered **on the server**; the client file never imports it
```
