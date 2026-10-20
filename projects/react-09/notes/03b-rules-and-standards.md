# Rules and standards for the "b" rewrite

The owner's rules and standards, collected as given while rewriting lesson 03 into 03b. Each is kept in the owner's words first, then with the example that came with it. They are collected here to be weighed again later, before any of them joins a skill. The decisions that applied them are logged in `03-to-03b-decisions.md`.

## R01: The chapter starts directly with theory that is clear

- Owner's words: "chapter starts directly with theory that is clear"
- Example given: start the chapter directly with the two sections "Two ways to put markup on the page" and "JSX in five rules", moved to the top, before the example.
- Applied in: D01.

## R02: Comparisons must be very clear on first reading; repetition can be a good thing

- Owner's words: "the comparisons must be VERY clear upon first reading, repetition can be a good thing"
- Example given: the tree "Put an old page's markup on the page / In an HTML file / In a component, as JSX" becomes "Two different ways to write markup / The normal HTML markup / The React markup (JSX): it is not simple HTML". Each branch names its side of the comparison, and the JSX branch says outright what it is not.
- Applied in: D02, D03.

## R03: Titles come in kinds; some kinds start a new page

- Owner's words: "We need different kind of titles, some titles need the page break before."
- Example given: one main title, "React JSX Syntax", opens the chapter on its own page, right after the title page; the two theory sections follow it; the "Example" section starts on a new page.
- Applied in: D04.

## R04: The principles follow the theory directly; the running example waits at the end

- Owner's words: "move in the end of the pdf, all the content from: Example: moving an old site's article card into React up until the start of the principles. Replace it with a simple title Principles (with page break before) and start directly with the principles"
- Example given: the example and "The components behind the page" move after the summary; a main title, "Principles", opens a new page and is followed at once by "1. Each tag becomes a call that returns an object".
- Applied in: D05.

## R05: A section title stands on space, not on a rule line

- Owner's words: "The principles currently have one line above, border line on top. This is not good appearance. Remove the line border on top and give more breathing space in the bottom of the principle title"
- Example given: "1. Each tag becomes a call that returns an object", which had a grey rule above it and only a small gap below.
- Applied in: D06.

## R06: No more than five boxes directly under one box

- Owner's words: "we cannot have more than 5 boxes directly in diagram under one box (add this rule for consideration)"
- Example given: the rules tree, "Five rules for pasted HTML in a component", already had five boxes; the missing casing principle could not become a sixth. It became rule 1B, one level down, under "Each tag becomes a call".
- Applied in: D07.

## R07: A principle the lesson relies on is made explicit, with its own box and card

- Owner's words: "This reveals a missing principle that should have been explicit"
- Example given: `<ArticleCard />` against `<articleCard />`, which 03 explained in one paragraph and a chain at the end of section 1, with no box in the tree and no principle card.
- Applied in: D07.

## R08: The example after a principle reuses the principle's own demo code and is no more complex

- Owner's words: "After the first principle, it makes me uncomfortable that the example is more complex and unnecessarily complex than the demo code provided inside the principle itself. [...] Is it really necessary to have a different example? [...] you need to explain the JSX transform which requires its own title, like What is the JSX transform? But you could have two components, App and Greeting. A browser showing the Greeting."
- Example given: Principle 1's card shows `Greeting` returning `<p>Hello, John Hall</p>`; the section then switched to the old site's `<article>` card with two inner tags, a `className`, and an array of nested objects. In 03b the section keeps `Greeting`, adds `App` to place it, shows it in a browser, and gives the transform its own subtitle.
- Limit given: section 1B may keep "something like ArticleCard", since its point is a component's name.
- Applied in: D08.

## R09: Each kind of block has its own colour; blue belongs to components

- Owner's words: "change the bg colour of facts into gray-ish colour, not to be confused with the blue colour of components. Use same gray-ish colour for principles box bg."
- Example given: the facts were light blue, close to the blue of the component panels; the principle boxes were light green.
- Applied in: D09.
- Extended by the owner's next instruction: "the principle box has green border around, remove it. It has green colour of the title principle, adapt it". Read together: colour carries one meaning each, blue for components, green for right, red for wrong; a box's frame and label take the box's own neutral tone. Applied in: D10.

## R10: A component panel is one block

- Owner's words: "unite the bg of left and right into a single unifying bg block, with same round corners, using the bg colour of the component on the left, using the position of the text in the right as it is now. But in unifying bg that is common left and right, without gap vertical in the middle."
- Example given: the panel of section 1, `<App />` and `<Greeting />` on a light blue card, the three notes on a separate grey card beside it, with a gap between the two.
- Applied in: D09.

## R11: Small, separate components from the first lesson: one component per file

- Owner's words: "Why in unified component? NO! rule: start with small separate components from lesson 1. apply this"
- Example given: section 1's `App.jsx`, which held both `Greeting` and `App`. In 03b, `Greeting.jsx` exports `Greeting`, and `App.jsx` imports it and places it.
- Applied in: D11.

## R12: Show the page beside the components that make it

- Owner's words: "start as such, with two parallel columns. left: The page (as it is), show the browser but with the font increased to make it more visible, it is very small currently. right: React Components, inside there show one under the other the two components. edit and adapt the rest"
- Example given: section 1 of 03b, which opens with "The page" (the browser showing "Hello, John Hall") beside "React Components" (`Greeting.jsx` above `App.jsx`).
- Also: the text of a browser panel must be readable at a glance, not a miniature.
- Applied in: D12.

## R13: A frame line ends where its box ends

- Owner's words: "the Greeting.jsx has borders left and right that penetrate inside the text, can we fix this bug?" Then, after a wrong first fix: "I don't get it, I still see the same problem, what did you change?"
- Example given: the file tab "Greeting.jsx", whose left and right sides ran down past the bar's bottom line and into the first line of code.
- Applied in: D13.
- Lesson for the agent: when the owner points at a visual bug, zoom on the exact place in the screenshot and name the element (here the tab's side borders) before changing anything; ask in the chat when two readings are possible.

## R14: A component's file says its place in the tree; the parent comes first

- Owner's words: "in the top right of the same window you just fixed, add the labels PARENT and CHILD accordingly (rule: labels PARENT, CHILD or GRANDCHILD or GRANDPARENT etc), use the font that you used in PRINCIPLE for the principle box, adapt it for the top right of the code box. And reverse the order of the two code blocks, first the PARENT then the CHILD"
- Example given: section 1's "React Components" column: `App.jsx` labelled PARENT, above `Greeting.jsx` labelled CHILD.
- Applied in: D14.

## R15: Every component box names its place in the tree, on a tab of its own colour

- Owner's words: "In the top left of each box, above the box, write with same font PARENT and CHILD in a label with the same bluish bg colour [...] With soft corners the label, as we have the file name in the code box on top left of the box, but this label will protrude from the internal box with solid bg colour"
- Example given: section 1's hierarchy panel, `<App />` with a PARENT tab, `<Greeting />` with a CHILD tab, each tab rising from the box's top left like a file tab.
- Read with R14: the same words, PARENT, CHILD, GRANDCHILD, label a component in its code file and in its hierarchy box.
- Applied in: D15.

## R16: A Console shows what Chrome shows, not code

- Owner's words: "we need radically new format for the console log, I think we do not need the numbers there, it is not an actual code. Please adapt it to look cool console log, but in bright theme not in dark theme"
- Example given: section 1's logged object, which 03b first drew as a code editor with line numbers and a file tab, "Console panel: console.log(note), opened and shortened".
- Applied in: D17.

## R17: A principle section follows a repeatable pattern of subtitles

- Owner's words: "I need now specific subtitles to be repeatable like pattern. This section starts with title: Component Code [...] Next section: Component Hierarchy [...] And next section: Let's check our console log"
- Example given: section 1 of 03b, after Principle 1's card: "Component Code" (the page beside the two files), "Component Hierarchy" (the panel), "Let's check our console log" (the Console), then "What is the JSX transform?" (the explanation).
- Also given: section 1B: "Component Hierarchy", then "The JSX transform that fails"; the explanation's subtitle names what the section's case shows.
- Renamed by the owner (D28), then replaced (R25, D29): the code's subtitle is the example's try and outcome, "Example: let's try to return two roots (it fails!)"; the tree's subtitle is "Component Hierarchy".
- Applied in: D18, D19, D28, D29.

## R18: A principle's heading carries its key question, answered in one italic line

- Owner's words: "add subtitles under the principles: A component's name starts with a capital letter, with subtitle, in italic, Why? Otherwise the JSX transform fails. 1 Each tag becomes a call that returns an object, subtitle: How? Due to proper JSX transform. The subtitle needs to have key questions on WHY? HOW? WHEN? WHAT? etc. you can creatively adapt."
- Example given: section 1, "How? Due to a proper JSX transform"; section 1B, "Why? Otherwise the JSX transform fails".
- Read with R17: the key question opens the section, and the subtitles below it (Component Code, Component Hierarchy, the check, the explanation) walk through its answer.
- Applied in: D20.

## R19: Every principle section takes the same route, and a restructure keeps every piece of information

- Owner's words: "this section causes me confusion. Now let's adapt with what we have done in the previous sections, the organized manner we presented things. I do not want us to loose information from what you wrote, I want us to edit and add exceptional clarity. Please edit this section to look like the structure we added and adapt accordingly to fit the needs of this section. Be creative but also adhere to the design princiiples we use so far"
- Example given: section 2 of 03b, rebuilt on section 1's route: key question, map, facts, principle, Component Code, Component Hierarchy, the check, then the explanation, with the case built on the principle's own `Author` (R08).
- Read with R08 and R17: the route is fixed, the check's subtitle names the tool the section opens (the Console, the error overlay), and the explanation's subtitle asks the question the check raised.
- Applied in: D22.

## R20: A page mock shows a real image where the code has an `<img>`

- Owner's words: "organize our folders to properly show an image please in the demo html browser, we need to be able to visually present the image as image in the browser, in a professional way, not it is not clear"
- Example given: section 2's fixed page, where `<img src="/john.jpg" alt="John Hall" />` was drawn as a green bar with the words "John Hall" on it.
- Read with R12 (the page beside the code): the page shows what the browser would show, a photo, not a label standing for one.
- Applied in: D23.

## R21: Every browser panel uses one type scale

- Owner's words: "can we standarize for the size of the browser font? You constantly show the browser very small or very large fonts, please increase the fonts in the browser"
- Example given: section 1's full-size page showed "Hello, John Hall" at 12pt, while the mini pages beside code showed card text at 5.8pt and titles at 7.5pt.
- Standard: the page's text is the book's own text size; a mini page is narrower, not smaller.
- Applied in: D24.

## R22: The error overlay is drawn in a light theme

- Owner's words: "the parse error needs to be adapted for light theme, not dark background"
- Example given: section 2's "The image left open" column, where the `[PARSE_ERROR]` overlay was white and red text on a near-black panel.
- Read with R16: the Console and the overlay, the two tools that report errors, share the book's light look.
- Applied in: D25.

## R23: A page in the browser shows its elements bare, without borders of our own

- Owner's words: "we have visual border overload, remove the borders from the elements in the page, do not place them within white box, just an image and under it the font of the text"
- Example given: section 2's fixed page: John Hall's photo with a thin frame, inside a white card with a border, inside the browser's frame, inside the column's frame.
- Read with R20: the page draws what the code writes; a border appears only where the code or its CSS puts one (section 4's list items, a form's input field).
- Applied in: D26.

## R24: In a comparison, the browser comes first and the code that made it sits under it

- Owner's words: "now read carefully this chapter and re-write the whole structure. I'd like the comparison of the two panels ✗ Two tags side by side ✓ One <article> around both to be like this: on top you have the browser, visual comparison, in the bottom of each browser show the code"
- Example given: section 3's comparison, which showed the code first and the overlay or the page under it.
- Read with R19: the section is rebuilt on the same route as sections 1 and 2; the reader compares the two results first, then reads the one line that differs.
- Applied in: D27.

## R25: The example's subtitle names what we try, and says whether it works

- Owner's words: "No, new rule: we start instead with Example Component Code, we start with: Example: let's try to return two roots (it fails!) and then Component Hierarchy. Similarly adapt the previous: Example Component Code becomes Example: let's use <img> instead of <img/> (it fails!) etc, edit the previous"
- Example given: section 3, "Example: let's try to return two roots (it fails!)"; section 2, "Example: let's use `<img>` instead of `<img />` (it fails!)".
- Replaces D28's "Example Component Code" and "Example Component Hierarchy": the example's subtitle is a try in the reader's voice ("let's ..."), with its outcome in parentheses; the tree's subtitle is again "Component Hierarchy".
- Read with R17 and R18: the key question under the heading asks why; the example's subtitle announces the experiment that answers it.
- Applied in: D29.

## R26: Plain B2 sentences, one fact each; no section numbers; an element is an element

- Owner's words: "Problem is we have no names sections here, use something generic as 'Previously we wrapped' blabla. 'a box the page wanted anyway', please use the term 'element' not 'box'. And avoid such secondary phrases. Make it more clear B2 vocabulary. The previous section wrapped the two tags into a single <section>. But what if we do not need an element named <section>? What if, when we add a <div> or a <section>, this breaks our code? etc"
- Example given: section 4's lead, "Section 3 gave `Author` one root, a `<section>`, which the page wants anyway. Sometimes the page wants no extra box at all. We take the principle's own `Items`: `App.jsx`, the parent, draws a list, [...] (`className` is JSX's name for `class`, which section 5 explains); `Items.jsx`, its child, returns the two list items. [...]"
- Standard: the skills' own (`lecture-voice` 05, 06, 07, 31; `summary-edition` 07, 10, 14): one fact per sentence, no semicolon chains, no new fact inside brackets, no side clauses such as "which the page wants anyway"; the bridge asks the question the section answers; another part of the lesson is named in words ("the previous section", "a later principle", "as we saw before"), not by its number; a thing on the page is an "element", not a "box".
- PROPER EXAMPLE: "The previous section wrapped the two tags in a single `<section>`. But what if the page does not need a `<section>` element? What if adding a `<div>` or a `<section>` breaks the page?"
- Applied in: D31.

## R27: Never send the reader back to "the principle's own component"

- Owner's words: "We take the principle's own component, Items. NO, you do not name the principle's own component as if it is something the reader should remember?! never say this thing (rule)"
- Example given: section 4's lead, "We take the principle's own component, `Items`, and use two files." The same phrase stood in the leads of sections 1, 2, 3, and 5.
- Read with R08: the example still reuses the principle's code; the text simply names the component and what it does, as if for the first time.
- PROPER EXAMPLE: "Our example is a list with two items, in two files. `App.jsx` is the parent: [...] `Items.jsx` is the child: [...]"
- Applied in: D32.

## R28: The introduction states the point at once; no suspense

- Owner's words: "The intro paragraph spills the beans directly!!!! (rule!!!) It's not an introduction to keep the reader on a hangling cliff, it's not theatrical play waiting for suspence (rule)"
- Example given: section 4's lead of D31, which opened on questions ("But what if the page does not need a `<section>` element? What if adding a `<div>` or a `<section>` breaks the page?") and only then turned to the list.
- Standard: the first sentences say what the example shows and why it matters; the reader reads the code knowing what to look for. With R25, the subtitle already says the outcome; the lead says it again, with its cause.
- PROPER EXAMPLE: "In the previous examples, an extra element around the tags did no harm [...]. Here an extra `<div>` or `<section>` breaks the page's style."
- Applied in: D32.

## R29: A crisp explanation names the real mechanism and who it concerns

- Owner's words: "You will explain that while in previous sections we needed something, we will see an example when introducing a section or a div, the css format will break. You see the css format can be very sensitive in the hierarchy of DOM elements, when we introduce new elements it can break. In CSS we have rules that govern the style e.g. the colour or blabla of the child based on the parent. By introducing new element in between (a new div or section etc) the css rules may break unexpectedly. The React developer may break the CSS rules that he did not make or consider (CSS concerns web designers and the react developer needs to be conscious of the design). This is how crisp and clear explanation looks like (rule)"
- Example given: the owner's own explanation above, for section 4.
- Standard: the lead gives, in order, what changed from before, the mechanism in the platform's terms (CSS styles a child by its place under its parent; a new element in between breaks the rule), the consequence on the page (the style is lost, with no warning), and who it concerns (the CSS often comes from a web designer; the React developer must be aware of it).
- Applied in: D32.

## R30: The setup says what we want and what we do, not what each file contains

- Owner's words: "rewrite this in a more simplistic normative way, not autistic descriptive (rule)", then, on the rewrite: "cool, now edit the pdf"
- Example given: section 4's setup, "Our example is a list with two items, in two files. `App.jsx` is the parent: it draws a list, `<ul>`, and places `Items` inside it. `Items.jsx` is the child: it returns the two list items, `<li>First</li>` and `<li>Second</li>`. Two tags side by side stop the build, so the two items need one root. The quickest root is a `<div>`:"
- Standard: the goal first ("We want ..."), one plain fact per file, the rule the reader already knows as the reason, and the action we take last, ending on a colon before the code. Details the code shows right below are not repeated in words.
- PROPER EXAMPLE: "We want a list with two items. The list is in the parent, `App.jsx`. The items come from the child, `Items.jsx`. A component returns one root, so we wrap the two items in a `<div>`:"
- Applied in: D33.

## R31: Every paragraph says what we want, what we do, and what happens, in short sentences

- Owner's words: "similarly edit all other paragraphs in the text (rule)", after R30 on the setups
- Standard: R30 holds for every prose paragraph, not only the setups. The point comes first (R28). The reader is "we": we want, we open, we compare, we close. Each sentence carries one fact; a sentence joined by several semicolons or colons is split. A back-reference names the rule ("each tag becomes a call") or the principle ("the next principle", "Principle 2"), never a section number. A paragraph does not repeat what the figure right below it shows.
- COUNTER-EXAMPLE: "With the `<div>`, the build passes, and the Console stays clean (React checks some nesting rules, such as a `<div>` inside a table row, but not a `<div>` inside a `<ul>`), yet the row breaks; with a Fragment instead, the row and the borders appear. Each column shows the page on top, then the Elements panel, then the code that made it:"
- PROPER EXAMPLE: "With the `<div>`, the build passes and the Console stays clean, yet the row breaks. With a Fragment, the row and the borders appear. React checks some nesting rules, such as a `<div>` inside a table row, but not a `<div>` inside a `<ul>`. Each column shows the page, then the Elements panel, then the code:"
- COUNTER-EXAMPLE: "Section 1 showed that each tag becomes a call, and that a call returns one value."
- PROPER EXAMPLE: "Each tag becomes a call, and a call returns one value."
- Applied in: D34.

## R32: A heading names the cause its text teaches, in the same words

- Owner's words: "Example: let's group the items with a `<div>` (the row breaks!) should be Example: let's group the items with a `<div>` (the CSS rules break!). Why you cannot see this little subtle detail when writing titles?", then "ok, update text and rule considerations"
- Standard: every heading, subtitle, column title, caption, and tree label names the same cause that the text under it teaches, in the same words. A title that names one visible symptom is too narrow when the cause has several effects. Whenever a lead or explanation changes, the headings and labels of that section are checked against it again, before the build.
- COUNTER-EXAMPLE: a lead that teaches "CSS is sensitive to the hierarchy of DOM elements" under the title "Example: let's group the items with a `<div>` (the row breaks!)". The row is one effect; the borders vanish too.
- PROPER EXAMPLE: "Example: let's group the items with a `<div>` (the CSS rules break!)", the subtitle "Why does a `<div>` break the CSS rules?", the lead "Here, an extra `<div>` or `<section>` breaks the page's CSS rules.", and the tree label "the CSS rules for direct children break".
- Considerations (why the miss happened, so the skill can prevent it):
  - The title was written from what the screen showed (the items stack), not from the mechanism (CSS rules that depend on the DOM hierarchy stop matching). A symptom title fits only when the symptom is the cause, as an error overlay is for a build error.
  - Headings were treated as fixed labels while the paragraphs under them were rewritten (D32, D34). When the lead moved from "the row" to "CSS depends on the DOM hierarchy", the title kept the old idea.
  - The "(it fails!)" pattern of the other example titles was copied. It names what the reader sees, which works for the build errors but not for a page that renders while its CSS silently stops applying.
- The check: after a rewrite, list each heading and label of the section next to the key noun of its lead and its explanation. A heading whose noun is not the lead's noun is rewritten, or the lead is.
- Applied in: D35.
