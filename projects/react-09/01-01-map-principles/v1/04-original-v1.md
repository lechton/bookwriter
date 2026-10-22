# Q02 Principle Map: Component Anatomy and the Capitalization Rule
- **Source Map**: `01-01-map/02.md`
- **Bank Row**: `questions/questions.md` row 02, Version 3
- **Topic Tag**: `#component_anatomy` | `❱ CORE`
- **Interview Question**: *What is a React component, and what rules govern how you write and name one?*
- **Map Revision**: #2026_10_15_03_group_1

## Authorized Scope
Lesson 02 teaches what a component is and the rules for writing one. A component is a plain JavaScript function that returns JSX. Our code never calls it. We write its name as a tag, `<ArticleCard />`, in another component's markup, and React calls the function for each tag. The lesson works on `ArticleCard`, a card with a title and a short text, and on `App`, which uses it. Both live in one file, `App.jsx`. The name must start with a capital letter, because a tag with a small first letter is read as an HTML tag. Markup that does not fit on the `return` line goes inside parentheses that open on that line. Every component is defined at the top level of the file, never inside another component. The lesson builds on Q01: a component describes the page, React builds the DOM from it, and the dev server shows each saved change.

## Theme and Options
- **Theme**: A page is made of pieces, such as a card and a footer. How does a function we write become a piece on the page?
- **Options**: none (starting point: one component, `SiteHeader`, which `main.jsx` shows, Q01 `#what_is_react`)
- **This lesson teaches**: the component used as a tag

## Principle Thread
- **Anchor**: a component is a function React calls: we write the function, and React calls it wherever a tag names it
- **Axis**: the path of one tag to the page: the tag, its name, its return, its next run
- **Why This Axis**: The four principles follow one tag, `<ArticleCard />`, on its way to the page. First the tag hands React the function, then the first letter of its name decides whether React calls our function at all, then the function's `return` decides what React gets back, and last the parent runs again and React must find the same function. Each step needs the one before it: a reader cannot see why a small letter stops the function before knowing that React calls it, and cannot see why a nested function is "new" before knowing that React calls the parent again. One axis was rejected. "The parts of the code from the top of the file to the return" puts where a component is defined first, but that rule only makes sense once the reader knows React calls the parent again, which is the last step.
- **Spoken Preview**: Everything in this lesson comes down to one idea: a component is a function that React calls, never our code. First, rendering, which means React calls the component wherever a tag names it: we write the component's name as a tag in another component's markup, and React runs the function and puts what it returns on the page. Second, PascalCase, which means React calls only the tags that start with a capital letter: a tag that starts with a small letter is read as an HTML tag, so our function never runs. Third, automatic semicolon insertion, which means React calls the function and gets back only what starts on the return line: markup that starts on the next line is never returned, so we open the parentheses on the return line. Fourth, top-level components, which means React calls the same function on every run: we define each component at the top level of the file, because a component defined inside another one is a new function every time, and React rebuilds everything it shows.
- **Closing Line**: One tag, one capital letter, one return line, and one function at the top.

## Sources Read
- `01-01-map/02.md`: every field; the Code Experiment `<articleCard />` against `ArticleCard` used in `App.jsx`, and the Scope Boundary (no props, no multi-file trees).
- `questions/questions.md`: row 02, its hook, and the curriculum note "Primitive Before Syntax", which keeps the JSX rules for Q03.
- `learn/your-first-component.md`: every section, the three `<Pitfall>` blocks (capital letter, parentheses after `return`, nested definitions), the `<DeepDive>` "Components all the way down", the `<Recap>`, and the four `<Challenges>` with their solutions.
- `reference/rules/react-calls-components-and-hooks.md`: "Never call component functions directly" and its list of benefits.
- `learn/render-and-commit.md`: "Rendering is React calling your components", read to name the term.
- `learn/keeping-components-pure.md`: "Detecting impure calculations with StrictMode", read for the doubled console messages.
- `reference/react/createElement.md`: the Caveat that a tag must start with a capital letter to render a custom component, and that a lowercase tag is passed as a string.
- `learn/describing-the-ui.md`: the Intro.
- Corpus search for `capital letter`, `uppercase`, `PascalCase`, and `Rendering is`: `learn/your-first-component.md`, `reference/react/createElement.md`, and `learn/render-and-commit.md`.
- Runtime check: Vite 8.3.4 with `@vitejs/plugin-react` 6.1.2, React 19.3.1 and react-dom 19.3.1, headless Chrome driven by puppeteer-core 25.14.0, with every console message captured; `vite build` for the build output; ESLint 10.12.0 with `@eslint/js` recommended rules for the editor check; a `StrictMode` run of the same `main.jsx` for the doubled messages; every save made by writing `App.jsx` while the page was open, with the typed text, the focus, and the DOM node compared before and after.
- Syllabus cards used for ownership: Q01, Q03, Q04, Q05, Q06, Q08, Q09, Q12, Q14, Q15, Q24, Q37, Q76, Q102.
- General engineering knowledge: what reviewers flag (a lowercase component, a component defined inside another), what interviewers probe (why the capital letter, who calls the component, `<Card />` against `Card()`), and what juniors ship broken (a card that never appears, a blank card after a reformat of the `return`, a comment box that empties on every save).
- Archive check: `v_old_08/02.md` was read before Discovery, while the owner and the author compared the old lessons with the new thread design, so Discovery was not blind to its four principles. Compared again after Selection: 0 rows added. Its claim that esbuild warns about the bare `return` was rechecked and does not hold in Vite 8 (no warning in the dev server or in `vite build`), so the ledger records what Vite 8 and ESLint really show.
- Handout: no messages were waiting for Q02. Message `02-24-01` from the archived map was declined when the map was archived; this map sends `02-24-02` to Q24 in its place, `02-12-01` to Q12, and `02-37-01` to Q37.

## Candidate Ledger
| candidate | source | disposition | owner | reason |
|---|---|---|---|---|
| "I wrote the function `ArticleCard`. Who calls it, and when?": React calls it for each tag that names it, while it renders the component whose markup holds the tag | reader; card Mechanism and Scope Boundary; render-and-commit "Rendering is React calling your components"; rules "Never call component functions directly"; verified | Principle | `react-calls-it` | Interviewers ask who calls a component; Q14 and Q15 rest on it. |
| "Does it matter whether I name it `articleCard` or `ArticleCard`?": a tag with a small first letter is read as an HTML tag, and the function never runs | reader; card Core Truth, Friction, and Under the Hood; your-first-component `<Pitfall>` 1; createElement Caveat; Challenge "Spot the mistake"; verified | Principle | `capital-name` | The card's Friction; reviewers flag it on sight. |
| "My markup is long. Can I start it on the line after `return`?": a `return` alone on its line returns nothing, and the card never shows | reader; your-first-component Step 3 and `<Pitfall>` 2; Challenge "Fix the return statement"; verified | Principle | `return-parentheses` | An official Pitfall; the card disappears with no error anywhere. |
| "`ArticleCard` is used only inside `App`. Can I define it there?": define every component at the top level of the file | reader; your-first-component `<Pitfall>` 3; verified | Principle | `top-level-components` | An official Pitfall ("very slow and causes bugs"); reviewers flag it; this lesson defines components. |
| A component is a JavaScript function whose name starts with a capital letter and which returns JSX | your-first-component Recap bullet 3 | Merged | `react-calls-it` | The definition the model starts from. |
| `<ArticleCard />` hands React the function itself, not the result of calling it | card Mechanism; createElement Caveat; verified | Merged | `react-calls-it` | The tag against the call. |
| A component used twice runs twice and shows two cards; a component no tag names never runs, so its `console.log` stays silent | your-first-component "Using a component"; verified (two tags, two "ArticleCard runs" messages, two `<article>` elements; no tag, no message) | Merged | `react-calls-it` | The Prediction of the model. |
| The Elements panel shows only the HTML tags a component returns; `<ArticleCard>` never appears in the DOM | your-first-component "What the browser sees"; verified | Merged | `react-calls-it` | What the reader sees in the browser. |
| React calls a parent first and the components its markup names after it, in the order of their tags: "App runs", "ArticleCard runs", "CommentBox runs", "Footer runs" | general; verified in Chrome | Merged | `react-calls-it` | The prediction the practical example asks for. |
| The common name for React calling a component is rendering | render-and-commit "Rendering is React calling your components" | Merged | `react-calls-it` | Interviewers use the word; the lesson gives it its react.dev meaning. |
| React prints two errors for `<articleCard />`: "<articleCard /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements." and "The tag <articleCard> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter." | card Friction; verified in Chrome | Merged | `capital-name` | The only signal of the bug. |
| The browser makes an empty element and shows its name in small letters, `<articlecard></articlecard>` | card Under the Hood; verified in Chrome | Merged | `capital-name` | What the Elements panel shows. |
| Renaming the tag to `<ArticleCard />` but not the function throws "ArticleCard is not defined", and the whole page is empty, not only the card | general; verified in Chrome | Merged | `capital-name` | The half-done fix; the answer carries it to the full fix. |
| A component may share its name with an HTML tag only through the capital letter: `function Footer()` returns `<footer>`, and `<Footer />` calls ours | general; createElement Caveat; verified in Chrome (one `<footer>` in the DOM, "Footer runs" in the console) | Merged | `capital-name` | The decision the practical example makes with the rule. |
| JavaScript names functions in camelCase (`formatDate`); a component name in PascalCase starts every word with a capital (`ArticleCard`) | general; card Mechanism | Merged | `capital-name` | Where the reader's habit comes from. |
| A `return` alone on its line returns `undefined`; React shows nothing for that component and prints no error; Vite 8 prints no warning in the dev server or in `vite build` | your-first-component `<Pitfall>` 2; verified in Chrome and `vite build` | Merged | `return-parentheses` | The failure is silent, which is why it costs time. |
| An editor that runs ESLint with its recommended rules marks the markup line "Unreachable code" (rule `no-unreachable`) | general; verified with ESLint 10.12.0 | Merged | `return-parentheses` | The one place the mistake shows. |
| The name of this JavaScript behavior is automatic semicolon insertion | your-first-component `<Pitfall>` 2 link; general | Merged | `return-parentheses` | Interviewers and linters use the term. |
| Markup that fits on the `return` line needs no parentheses: `return <footer>Copyright 2026</footer>;` | your-first-component Step 3; verified | Merged | `return-parentheses` | The boundary of the rule; the practical example shows a footer that grows past one line. |
| Each run of the parent makes a new nested function; React sees a different component in the same place, removes the old nodes, and builds new ones, so a typed comment is gone and the focus is lost | your-first-component `<Pitfall>` 3; verified in Chrome (a save of `App.jsx`: new `<input>`, empty value, focus lost) | Merged | `top-level-components` | The cause and the visible failure. |
| With the component at the top level, the same save keeps the `<input>`, its typed text, and the focus | verified in Chrome | Merged | `top-level-components` | The fix, proved on the same save. |
| On a save, the dev server matches each top-level component of the file to its old version by name, so React keeps its nodes; a nested component has no such match | verified in Chrome; general (fast refresh) | Supporting | Q02 `#component_anatomy` | Keeps the save proof honest: a save loads the file again. |
| Writing `{ArticleCard()}` in the markup gives the same article in this lesson; react.dev's rule is to use components only as tags | rules "Never call component functions directly"; verified | Supporting | Q02 `#component_anatomy` | The card names `<Card />` against `Card()`; the visible cost comes with Hooks (Q37). |
| With `<StrictMode>` around `App` in `main.jsx`, as Vite's starter writes it, every console message of a component appears twice in development | keeping-components-pure "Detecting impure calculations with StrictMode"; verified in Chrome (two tags, four messages) | Supporting | Q02 `#component_anatomy` | Readers add a `console.log` in this lesson and meet it at once. |
| In a React app, every piece of UI is a component, from a button to a whole page | your-first-component Recap bullet 2; `<DeepDive>` | Supporting | Q02 `#component_anatomy` | Orients the reader. |
| `export default` marks the main function of a file so another file can use it | your-first-component Step 1; Challenge "Export the component" | Prerequisite | Q01 `#what_is_react` | `App.jsx` uses it; Lecture 1 named it; the full rules are Q08's. |
| A component describes the page, and React builds the DOM from it | 01-01-map-principles/01.md `describe-from-data` | Prerequisite | Q01 `#what_is_react` | `react-calls-it` rests on it. |
| When a file is saved, the dev server makes React call the component again, and React compares the new description with the last one | 01-01-map-principles/01.md `smallest-change` | Prerequisite | Q01 `#what_is_react` | `top-level-components` rests on it. |
| JSX compiles to function calls; the call for `<ArticleCard />` takes the function, and the call for `<articleCard />` takes the text `'articleCard'` | card Under the Hood; createElement Caveat | Preview | Q03 `#jsx` | The lesson says what each tag hands React; the compiled code is Q03's. |
| A component returns one root element, and a tag with nothing inside closes itself with a slash | your-first-component Step 3 | Preview | Q03 `#jsx` | `ArticleCard` returns one `<article>`; the rules are Q03's. |
| `App` names `ArticleCard`, which names `CommentBox`: a parent and its children | your-first-component "Nesting and organizing components" | Preview | Q05 `#ui_tree` | The tree is Q05's. |
| A child that needs data from its parent gets it through props, not a nested definition | your-first-component `<Pitfall>` 3 | Preview | Q06 `#props` | The remedy the Pitfall names; props are Q06's. |
| `main.jsx` hands the empty root to React and shows `App` in it | card 09 Mechanism | Preview | Q09 `#create_root` | The prepared project holds it; Q09 explains it. |
| Strict Mode runs each component twice in development to find components that change things outside themselves | keeping-components-pure "Detecting impure calculations with StrictMode" | Preview | Q12 `#purity` | The lesson names it in one card; message `02-12-01`. |
| A component runs again while the page is open when its data changes | card 14 Core Truth | Preview | Q14 `#use_state` | The lesson runs `App` again with a save; message `02-24-02` names the case. |
| Rendering is the first of the steps of an update; trigger and commit are the others | render-and-commit Recap | Preview | Q15 `#render_and_commit` | The lesson names rendering; Q15 names the steps. |
| React matches components by type and position, and a different function in the same place resets everything below it | your-first-component `<Pitfall>` 3 link (preserving-and-resetting-state) | Preview | Q24 `#component_identity` | `top-level-components` shows the failure; Q24 explains the matching; message `02-24-02`. |
| A component called as a function breaks the order of its Hooks | rules "Never call component functions directly" | Preview | Q37 `#rules_of_hooks` | The reason behind the rule; message `02-37-01`. |
| Default and named exports, and moving `ArticleCard` to its own file | your-first-component Step 1 and "Nesting and organizing components" | Deferred | Q08 `#imports` | The card's Scope Boundary keeps one file. |
| JSX element objects that a tag produces | card 76 Mechanism | Deferred | Q76 `#create_element_deep` | Element objects are Q76's. |
| Frameworks generate HTML from components on the server | your-first-component `<DeepDive>` | Deferred | Q102 `#ssr` | Server rendering is Part Two. |
| Component libraries such as Chakra UI and Material UI | your-first-component "Components: UI building blocks" | Dropped | none | Not a decision in this lesson. |
| The "Your own component" Challenge | your-first-component Challenges | Dropped | none | Practice with no new idea. |

## Terms
| term | kind | status | first lesson | refresher | first needed in |
|---|---|---|---|---|---|
| component | React | Recall | Q01 `#what_is_react` | no | `react-calls-it` |
| JSX | React | Recall | Q01 `#what_is_react` | no | `react-calls-it` |
| DOM | browser | Recall | Q01 `#what_is_react` | no | `react-calls-it` |
| Elements panel | browser | Recall | Q01 `#what_is_react` | no | `react-calls-it` |
| dev server (`npm run dev`) | general | Recall | Q01 `#what_is_react` | no | `top-level-components` |
| focus | browser | Recall | Q01 `#what_is_react` | no | `top-level-components` |
| virtual DOM | general | Recall | Q01 `#what_is_react` | no | `top-level-components` |
| `export default` | JavaScript | Recall | Q01 `#what_is_react` | no | Supporting |
| component tag (`<ArticleCard />`) | React | New | Q02 `#component_anatomy` | no | `react-calls-it` |
| rendering | React | New | Q02 `#component_anatomy` | no | `react-calls-it` |
| function call against function reference | JavaScript | New | Q02 `#component_anatomy` | yes | `react-calls-it` |
| `console.log` and the Console panel | browser | New | Q02 `#component_anatomy` | yes | `react-calls-it` |
| camelCase and PascalCase | general | New | Q02 `#component_anatomy` | no | `capital-name` |
| `undefined` | JavaScript | New | Q02 `#component_anatomy` | yes | `return-parentheses` |
| automatic semicolon insertion | JavaScript | New | Q02 `#component_anatomy` | yes | `return-parentheses` |
| ESLint | general | New | Q02 `#component_anatomy` | no | `return-parentheses` |
| nested function | JavaScript | New | Q02 `#component_anatomy` | yes | `top-level-components` |
| top level of a file | JavaScript | New | Q02 `#component_anatomy` | yes | `top-level-components` |
| Strict Mode | React | New | Q02 `#component_anatomy` | no | Supporting |

## Principles

### Principle 1: Rendering: React calls the component wherever a tag names it
- **Handle**: `react-calls-it`
- **Thread Step**: the tag: it hands React the function
- **Rule**: We use a component by writing its name as a tag in another component's markup, and React calls the function once for each tag; our code never calls it.
- **Kind**: Model
- **Reader Question**: "I wrote the function `ArticleCard`. Who calls it, and when?"
- **Reader Expects**: we call it ourselves, `ArticleCard()`, as with any JavaScript function; a habit from plain JavaScript
- **React Does**: `main.jsx` names `<App />`, so React calls `App`; `App` returns markup that holds `<ArticleCard />` twice; each tag hands React the function itself; React calls `ArticleCard` once per tag and builds the DOM from the `<article>` each call returns; the console shows "ArticleCard runs" twice; the Elements panel shows `<main>` and two `<article>` elements and never an `<ArticleCard>` tag
- **Placement**: the function defined once; `<ArticleCard />` written in another component's markup wherever a card should appear; no `ArticleCard()` in our code
- **Real Mistake**: none; `{ArticleCard()}` written by hand gives the same article in this lesson, and the cost comes with Hooks in Q37
- **Importance**: interviewers ask who calls a component and what rendering means; Q14 and Q15 explain state and updates on top of it
- **Prediction**: with `console.log('ArticleCard runs')` in its body, `ArticleCard` logs nothing while no tag names it, and logs twice when `App` writes `<ArticleCard />` twice; the DOM then holds two `<article>` elements and no `<ArticleCard>` tag.
- **Required Lesson Proof**: `ArticleCard` with a body log in `App.jsx`; `App` returns an empty `<main>`: the console is silent; `App` returns `<ArticleCard />` twice: two messages, two cards, and the Elements panel shows only `<main>` and `<article>` tags.

### Principle 2: PascalCase: React calls only the tags that start with a capital letter
- **Handle**: `capital-name`
- **Thread Step**: the name: its first letter decides whether React calls our function
- **Rule**: We start a component's name with a capital letter, in the function and in the tag, because a tag with a small first letter is read as an HTML tag and our function never runs.
- **Kind**: Decision
- **Reader Question**: "Does it matter whether I name it `articleCard` or `ArticleCard`?"
- **Reader Expects**: no; JavaScript accepts any function name, and plain JavaScript names functions in camelCase, `articleCard`
- **React Does**: a tag that starts with a small letter is read as an HTML tag; React hands the browser the text `'articleCard'`, and the browser makes an empty element, shown as `<articlecard>`; the function never runs; React prints two errors in the console; a tag with a capital letter hands React the function, and React calls it
- **Placement**: `function ArticleCard()` and `<ArticleCard />`, both with a capital first letter; small letters only for HTML tags such as `<article>`
- **Real Mistake**: `function articleCard()` used as `<articleCard />`; the page shows no card, the Elements panel shows `<articlecard></articlecard>`, the body log never prints, and the console shows "<articleCard /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements." and "The tag <articleCard> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter."; renaming only the tag throws "ArticleCard is not defined" and empties the whole page; verified in React 19.3.1 and Chrome
- **Importance**: the card's Friction; reviewers flag it on sight; interviewers ask why the capital letter matters
- **Review Point**: Do not
- **Required Lesson Proof**: `App` names `<articleCard />`: the Elements panel shows the empty `<articlecard>`, the console shows both errors, and the body log never prints; the tag renamed alone: "ArticleCard is not defined" and an empty page; the function and the tag renamed: the card appears.

### Principle 3: Automatic semicolon insertion: React calls the function and gets back only what starts on the return line
- **Handle**: `return-parentheses`
- **Thread Step**: the return: what React gets back
- **Rule**: When the markup does not fit on the return line, we open the parentheses on the return line, because a return alone on its line gives back nothing.
- **Kind**: Decision
- **Reader Question**: "My markup is long. Can I start it on the line after `return`?"
- **Reader Expects**: yes; line breaks do not matter in HTML, and JavaScript lets us leave out semicolons
- **React Does**: JavaScript ends a `return` that stands alone on its line, as if a semicolon followed it; the function returns `undefined`; the markup below never runs; React gets `undefined` for `ArticleCard` and shows nothing in its place; no error appears on the page, in the console, or in the dev server; an editor that runs ESLint marks the markup line "Unreachable code"
- **Placement**: `return (` on one line, the markup inside, `);` after it; or the whole markup on the `return` line when it fits
- **Real Mistake**: `return` alone on a line with `<article>` on the next; the card is gone, the page and the console show no error, Vite prints no warning, and ESLint reports "Unreachable code" (`no-unreachable`); verified in React 19.3.1, Vite 8.3.4, Chrome, and ESLint 10.12.0
- **Importance**: an official Pitfall and Challenge; a card that disappears with no error is hard to trace
- **Review Point**: Do
- **Required Lesson Proof**: `ArticleCard` with `return` alone on its line: the page shows an empty `<main>`, and the console is empty; with `return (` on the same line: the card appears.

### Principle 4: Top-level components: React calls the same function on every run
- **Handle**: `top-level-components`
- **Thread Step**: the next run: React must find the same function
- **Rule**: We define every component at the top level of the file, beside the others, and never inside another component.
- **Kind**: Decision
- **Reader Question**: "`ArticleCard` is used only inside `App`. Can I define it inside `App`?"
- **Reader Expects**: yes; plain JavaScript often keeps a helper function inside the only function that uses it
- **React Does**: the save makes React call `App` again; that call runs the line `function ArticleCard()` again and makes a new function; React compares the new description with the last one and finds a different function in the card's place; it removes the old `<article>` with its `<input>` and builds new nodes; the typed comment is gone and the focus is lost; at the top level, the same save keeps the `<input>`, its text, and the focus
- **Placement**: `function ArticleCard()` beside `function App()`, at the top level of `App.jsx`; never inside another component's body
- **Real Mistake**: `function ArticleCard()` written inside `App`, with a comment box in the card; the first run looks right; with "Great news" typed into the box, a saved change of the title empties the box and moves the focus away; verified in React 19.3.1, Vite 8.3.4, and Chrome
- **Importance**: an official Pitfall ("very slow and causes bugs"); reviewers flag it in every code review
- **Review Point**: Do
- **Required Lesson Proof**: `ArticleCard` defined inside `App`, with an `<input>` in the card: "Great news" typed, the title changed and saved: the box is empty and the focus is gone; `ArticleCard` moved to the top level: the same save keeps "Great news" and the focus.

## Senior Answer
A React component is a JavaScript function that returns JSX. It describes one piece of the page, such as an article card. I never call it myself. I write its name as a tag, like `<ArticleCard />`, in another component's markup. React calls the function for each tag and builds the page from what it returns. That is what rendering means. A few rules follow from it. The name must start with a capital letter, because a tag with a small letter is read as an HTML tag, and my function never runs. If the markup starts on the line after `return`, JavaScript returns nothing, so I open the parentheses on the `return` line. And I define every component at the top level of the file. A component defined inside another one is a new function on every run, so React throws away its DOM and builds it again, and the user loses what they typed.

## Reported Conflicts
- Card 02's Core Truth calls capitalization "a strict compiler requirement". The compiler accepts a small-letter tag and builds it as an HTML tag; the failure shows at run time, as the card's own Friction says. The map follows the runtime; the card is unchanged.
- Card 02's Code Experiment does not name a second file, while the archived lecture moved `ArticleCard` to `components/ArticleCard.jsx` with an import. The card's Scope Boundary forbids multi-file trees, so every component of this lesson lives in `App.jsx`.
- The archived map 02 says esbuild warns about a bare `return`. Vite 8 compiles without esbuild's warning: neither the dev server nor `vite build` prints one. The map records ESLint's "Unreachable code" as the only signal.

## Open Issues
- None

## Completion Gate
- [x] Every principle passed the Sense Test (Section 13) before the scripts ran.
- [x] The Spoken Preview, read aloud once, gives the anchor, every label, and every rule in axis order.
- [x] The header's tag, tier, and question equal bank row 02 and card 02.
- [x] `node src/diagnose-map.mjs 02` reports no failure.
- [x] Every Recap, Pitfall, Caveat, and Troubleshooting item on the pages in Sources Read has a ledger row.
- [x] Every principle is owned through the cards and records the importance question it passed.
- [x] Every behavior the map states was reproduced in React 19 or found in the corpus.
- [x] Every Required Lesson Proof runs on the card's example inside the scope, or says why it cannot.
- [x] Every Terms row was marked after a search of the earlier cards and maps.
- [x] The Archive Check is done, and every idea it found has a ledger row.
- [x] Every `map` message in the inbox is closed, and every message another lesson needs from this map was sent.
- [x] Reported Conflicts and Open Issues are complete.
- [x] A candidate could say the Senior Answer aloud, and it would satisfy a senior interviewer.
