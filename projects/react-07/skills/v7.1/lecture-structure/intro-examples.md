# Introduction Examples #2026_10_11_04_group_1

Every section marked "Approved by the owner" was read and accepted by the owner of this series. A section enters this file only after the owner approves it. Failed versions are quoted as they were written, with the reason they failed.

The examples show moves, not content. Take the moves (one idea, name and code together, who does what, a second tiny example, a closing rule), never the topic, the names, or the code. Your lesson has its own reader and its own ideas. A writer who finds an example on its own lesson's topic copies it instead of applying the moves: Lecture 7 pasted an earlier `children` example word for word. So an example leaves this file before its own lesson is built (Example 1 before Lecture 1).

The standard these examples carry is `SKILL.md` Section 12 beside this file.

## Example 1: Imperative and declarative code

**Context.** Lecture 1. The reader knows HTML and plain JavaScript. State is not taught until Lecture 14, so the text says "a value" and never "state".

**Approved by the owner (2026-10-11)**

> ### Plain JavaScript gives commands, React describes the result
>
> In plain JavaScript, you change the page step by step. You find the element, then you set its text:
>
> ```js
> const counter = document.querySelector('#count');
> counter.textContent = 3;
> ```
>
> This is **imperative** code: you give the browser each command yourself. When the number changes from 3 to 4, the page keeps showing 3 until you set its text again yourself.
>
> In React, you describe what the page should show:
>
> ```jsx
> <p>{count}</p>
> ```
>
> This is **declarative** code: you say what the result is, and React makes the page match it. When the value of `count` changes from 3 to 4, you do not touch the `<p>`. React updates its text for you.
>
> The same holds for a page title:
>
> ```jsx
> <h1>{title}</h1>
> ```
>
> You never write the command that changes the heading. You write what the heading shows, and React keeps it true.
>
> Imperative code tells the browser how to change the page, one command at a time. Declarative code describes what the page should show, and React does the changing.

**Why it works.** Two proper terms, each named next to the code it describes. The reader starts from code they already know (`querySelector`, `textContent`). The change from 3 to 4 makes the difference visible: who has to act when the value changes. The title example confirms the idea with a different element. The closing sentences state both terms as one contrast. The section also shows the theme move when React offers no rival way: the question is how the page changes when a value changes, and the two options are the habit without React and what React does (`SKILL.md` Section 12). #2026_10_12_01_group_1

## Failed: the Lecture 1 runway section

> ### Components as Reusable Blueprints
>
> In plain HTML, you structure documents using native tags like the `<header>`, `<article>`, and `<button>` elements.
>
> However, native HTML tags know nothing about your application logic or subscriber data. Traditionally, developers had to copy and paste HTML markup across separate templates. Then, they attached external JavaScript scripts to add interactive behavior. This separation split structure from logic, creating fragmented and fragile codebases.
>
> To solve this fragmentation, React unifies markup, style, and logic into a single cohesive structure. This mechanism is called a **component**. A component is a self-contained, reusable JavaScript function. It accepts input data called **props** and returns markup describing a piece of the user interface.
>
> In React, every component function name must start with a capital letter. ...

**Why it failed.** Four new ideas (component, props, capitalization, nesting) arrive in one section, and none of them is shown in code next to its name. The history paragraph ("fragmented and fragile codebases", "single cohesive structure") talks about the idea instead of showing it. There is no second example and no closing rule.

## Failed: the Lecture 7 lead-in

> In technical interviews, engineering candidates are closely evaluated on container composition, the opaque structure of `children`, clean attribute forwarding with rest and spread, attribute evaluation order, and fallback defaults in destructuring. In each question cycle below, the scenario presents concrete code, the bold question names the developer's uncertainty, the answer traces what the runtime executes, and the principle box formalizes that answer into an engineering rule.

**Why it failed.** It teaches nothing. It lists five topics the reader has not learned yet and describes the lesson's format instead of starting it.

## Failed: the Lecture 7 cold drop #2026_10_11_06_group_3

> ### One card component cannot predict every story
>
> With what Lecture 6 taught, you would write the news card with one prop for each piece it shows:
>
> ```jsx
> function NewsCard({ title, badgeText, author }) { ... }
> ```

**Why it failed.** The first sentence drops the reader into code without saying what the chapter is about or what the code is for. The owner's fix: one warm paragraph on the page the reader knows (every story has the same design, only the content changes), one sentence on where the chapter goes, and then the example with its purpose ("let's see why the props from Lecture 6 are not enough"). The badge in the code was a second problem (`lecture-voice` Section 03).
