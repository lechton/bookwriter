# Lesson 03 to 03b: the rewrite decisions

This log records every decision made while rewriting `05-01-md-revised-4/v1/03.md` by hand into `05-01-md-revised-4/v1/03b.md`. Its purpose is to become the raw material for the skills that will take any revision 4 lesson from its first form to its "b" form without the owner steering each step. Each entry keeps the owner's words, what changed, and the general rule it suggests, with a PROPER and a COUNTER-EXAMPLE taken from the lesson itself, as the authoring doctrine in `AGENTS.md` asks.

Build each time from `projects/react-08`: `node src/build-revised-4.mjs 03b`. Output: `05-03-md-revised-4-pdf/v1/03b.pdf`. Lesson `03.md` stays untouched as the reference.

## Open questions for the skill

- Revision 4's skill (`skills/v8.1/summary-revision-4`) says content is written only in revision 3. The "b" rewrite changes content inside revision 4. When the skills are written, decide whether the "b" pass becomes its own stage (a revision 5, or a skill beside `summary-edition`), or whether its rules move back into `summary-edition` and revision 3.

## Decisions

Each entry follows this shape:

### D01: short name

- Owner's words: the instruction as given.
- Where: section and lines of 03b.
- Change: what 03 said, what 03b says.
- Why: the reader's problem it solves.
- Rule candidate: the general standard, worded for a skill.
- PROPER EXAMPLE: from 03b.
- COUNTER-EXAMPLE: from 03.
- Skill home: which skill and section it would join.

### D01: Theory first, example second

- Owner's words: "start the chapter directly with these two sections, Two ways to put markup on the page, JSX in five rules, move them on top."
- Where: 03b lines 6 to 33.
- Change: 03 opened with the example (the old site's article card, then the components behind the page), and only then gave the two theory sections. 03b opens with the two theory sections, then the example, then the components.
- Why: the reader meets the comparison and the five rules before any case, so the example reads as a proof of what was just stated, not as a puzzle.
- Rule candidate: R01. A chapter opens with its theory, stated clearly enough to stand alone; the running example follows it.
- PROPER EXAMPLE: 03b, page 2: "React JSX Syntax", then "Two different ways to write markup", then "The React markup (JSX) vs Normal HTML".
- COUNTER-EXAMPLE: 03, page 2: "Example: moving an old site's article card into React", with the theory two sections later.
- Skill home: `summary-edition`, the lesson's order (to be decided).
- Left open: the moved sections still speak of the example they now precede ("Pasted markup must follow five rules", "Five rules for pasted HTML in a component", "Of this lecture's mistakes"), and they use "the build" before the example defines it. Waiting for the owner's call.

### D02: The comparison tree names both sides plainly

- Owner's words: "Rewrite this: Put an old page's markup on the page / In an HTML file / In a component, as JSX. Into this: Two different ways to write markup / The normal HTML markup / The React markup (JSX): it is not simple HTML."
- Where: 03b lines 13 to 15. Also, as a repetition, the section heading (line 8) and the summary tree's root and first two branches.
- Change: the tree's root and branches as the owner wrote them. The section heading "Two ways to put markup on the page" became "Two different ways to write markup", the same words as the tree's root. The summary tree at the end uses the same three labels, so the lesson closes on the words it opened with.
- Why: each branch names its kind of markup, and the JSX branch warns at once that it is not HTML. Repeating the same words in the heading, the tree, and the summary lets the reader recognize the comparison every time it returns.
- Rule candidate: R02. A comparison names its two sides in the reader's words, says the key difference in the label itself, and keeps the same labels wherever it returns.
- PROPER EXAMPLE: "The React markup (JSX): it is not simple HTML".
- COUNTER-EXAMPLE: "In a component, as JSX", which names where the markup lives, not what it is.
- Skill home: `summary-figures` (tree labels) and `summary-edition` (headings).
- Note: renaming the heading and the summary tree was my call, applied for consistency with R02; the owner asked only for the tree.

### D03: The rules section is titled as a comparison

- Owner's words: "Also rewrite the title, JSX in five rules: The React markup (JSX) vs Normal HTML."
- Where: 03b line 20.
- Change: "JSX in five rules" became "The React markup (JSX) vs Normal HTML".
- Why: the title tells the reader what is being contrasted, and repeats the two names the previous section introduced.
- Rule candidate: R02.
- PROPER EXAMPLE: "The React markup (JSX) vs Normal HTML".
- COUNTER-EXAMPLE: "JSX in five rules", which counts the rules but does not say against what they stand.
- Skill home: `summary-edition` (headings).

### D04: A main title on its own page, and an example that starts a page

- Owner's words: "We need to start with one main title directly: React JSX Syntax (page break with the initial title). Then add the two sections above we just discussed. Then add ## Example (with page break up before)."
- Where: 03b line 6 (`# React JSX Syntax`) and line 35 (`::: pagebreak` before the example).
- Change: after the title page (the lecture's title and interview question, then a page break), a main title, `# React JSX Syntax`, opens page 2. A page break now stands before "Example: moving an old site's article card into React".
- How it is written: a main title is a level-one heading that is not the "Lecture NN:" line; the build already draws it at 24pt. A title that starts a new page is preceded by `::: pagebreak`. No build change was needed.
- Rule candidate: R03. Three kinds of titles so far: the lesson title (its own page, with the interview question), the main title (a level-one heading, starts a page), and section titles (level-two headings); the example section starts a page.
- Skill home: `summary-figures/blocks.md` (title kinds) and `summary-edition` (the lesson's order).

### D05: Principles right after the theory, the example moved to the end

- Owner's words: "move in the end of the pdf, all the content from: Example: moving an old site's article card into React up until the start of the principles. Replace it with a simple title Principles (with page break before) and start directly with the principles"
- Where: 03b line 37 (`# Principles`, after a `::: pagebreak`); the moved sections now follow the summary's closing line, after their own `::: pagebreak`.
- Change: 03b now reads title page, "React JSX Syntax" with its two theory sections, "Principles" with sections 1 to 5, the closing sections ("Putting the five together", "For the interview", "Where you will meet this", "Summary"), and last "Example: moving an old site's article card into React" and "The components behind the page", unchanged.
- How it is written: "Principles" is a main title, a level-one heading like "React JSX Syntax", so R03's kinds now hold two main titles that each open a page.
- Why: the reader goes from the comparison straight to the principles that explain it, with no case study in between.
- Rule candidate: R04, with R01. Theory, then principles; the long running example is optional reading at the end.
- PROPER EXAMPLE: 03b page 3: "Principles", then "1. Each tag becomes a call that returns an object".
- COUNTER-EXAMPLE: 03b before this step, where the old site's card and the component hierarchy stood between the rules and Principle 1.
- Skill home: `summary-edition`, the lesson's order (to be decided).
- Left open: the moved example's table still points forward ("the overlay above (section 2)", "(section 5)"), now backward. The principles still lean on the example's words: "pasted" (the rules tree's top label, in all five small trees, and sections 2, 3, 5), "the old site" (sections 2, 3, 5), and "the build" and "error overlay", which are defined in bold only in the moved example. Waiting for the owner's call.

### D06: Numbered section titles lose their top rule and gain space below

- Owner's words: "Remove the line border on top and give more breathing space in the bottom of the principle title"
- Where: every numbered section title of 03b ("1. Each tag becomes a call that returns an object" to "5. Attributes use JavaScript names").
- Change: in 03, a numbered title had a 1.5pt grey rule on top, 8pt of padding above, and an 8pt gap below. In 03b it has no rule and no padding above, and a 16pt gap below, before the small rules tree.
- How it is written: the build now gives a lesson named with a letter, such as 03b, the class `edition-b` on its page; `src/revised-4/base.css` styles `body.edition-b h2.numbered` at its end. Lessons 03, 10, and 11 keep the rule when they are rebuilt.
- Why: the rule cut the title off from the page above and made it look like a divider; the extra space below lets the title breathe before the tree.
- Rule candidate: R05. A section title is set apart by space below it, not by a line above it.
- Skill home: `summary-revision-4` Section 03 (the look), or the stage the "b" pass becomes.

### D07: The casing principle becomes 1B, under "Each tag becomes a call"

- Owner's words: "This reveals a missing principle that should have been explicit. But we cannot have more than 5 boxes directly in diagram under one box. [...] we need one for articleCard vs ArticleCard." Chosen among three proposals (A: a sub-rule 1B; B: merge "One root" and "A Fragment" to free a slot; C: group the rules under "the build stops" and "the Console complains"): A.
- Where: the rules tree (page 2), the six small trees, the summary tree, and a new section "1B. A component's name starts with a capital letter" between sections 1 and 2.
- Change: in 03, the casing rule was the last paragraph of section 1 and a two-line chain (`<ArticleCard />` -> `_jsxDEV(ArticleCard)` -> React calls it; `<articleCard />` -> `_jsxDEV("articleCard")` -> an empty `<articlecard>` and two Console errors). In 03b, "Each tag becomes a call" has two boxes under it, "A small letter: an HTML tag" and "A capital letter: our component", in every tree of the lesson. Section 1B has the shape of every principle section: its small tree with "A capital letter: our component" marked, Principle 1B with a do card (`<ArticleCard />`) and a do-not card (`<articleCard />`), a hierarchy panel, then the old paragraph and the chain.
- How it is written: the build now reads a section number or a principle number with a capital letter after it, `## 1B.` and `**Principle 1B: ...**`, and draws "1B" in the numbered circle.
- Why: the rule decides whether a component appears at all, so it deserves the same box, card, and comparison as the others; placing it under rule 1 shows that it follows from the call.
- Rule candidates: R06 (at most five boxes under one box; a sixth idea goes one level down, under the rule it follows from), R07 (a rule the lesson relies on gets its own box and card).
- PROPER EXAMPLE: Principle 1B, do `return <ArticleCard />;`, do not `return <articleCard />;`.
- COUNTER-EXAMPLE: 03's "The transform also explains why a component's name starts with a capital letter", a rule hidden in the last paragraph of another section.
- Skill home: `summary-figures` (tree limits) and `summary-edition` (which rules become principles).
- Left open: the page count went from 19 to 23; page 7 holds only the end of 1B (a paragraph and the chain) and is mostly empty, because section 2's opening cannot be split. In the summary tree, "The normal HTML markup" now gets one seventh of the width and its label breaks into one word per line.

### D08: Section 1 keeps the principle's Greeting; the transform gets its own subtitle

- Owner's words: see R08. Then: "in section 1B you can have something like ArticleCard. Yes make all proper editions in the rest of the file to match the changes."
- Where: section 1 (from the line after Principle 1's card to the end of the section), the object fact above Principle 1, and four sentences elsewhere: the start of 1B, the start of section 2, the end of section 3, and the paragraph after the comparison in section 5.
- Change in section 1: in 03, the text after the card moved to `ArticleCard` with an `<article>`, an `<h2 className="title">`, and a `<p>`; its logged object held an array of two nested objects; the stages followed the `<h2>`. In 03b: a hierarchy panel with `App` placing `<Greeting />`; `App.jsx` with both components and one balloon on `console.log(note)`; a two-column row, the page showing "Hello, John Hall" beside the Console's object `{ type: 'p', props: { children: 'Hello, John Hall' } }`; then a subtitle, "What is the JSX transform?", with the Network panel fact, the four stages for the same `<p>`, and the definition paragraph, without its sentence on `class` and `className`.
- Change in the object fact: its example became `{ name: 'John Hall', city: 'Boston' }`, and its sentence on arrays went, since nothing in section 1 holds an array now.
- Changes elsewhere, to match: 1B now says "The same rewrite that turns `<p>` into a call". Section 2 introduces the old site's card as new ("Here is an article card from the old site, with its photo, as the old site wrote it; only its `class` is already `className`, which section 5 explains"), since section 1 no longer shows it. Section 3 now says that in the object of `<article>`, `children` holds the objects of the `<h2>` and the `<p>`, where in section 1 it held the greeting's text. Section 5 now says attributes become properties "next to `children`, which section 1 showed holding the tag's content", where it said "as `className` did in section 1".
- How it is written: the subtitle is a level-three heading, `### What is the JSX transform?`, a fourth kind of title (R03).
- Why: the reader sees one small example travel from the principle's card to the page, the Console, and the transform, so nothing new competes with the rule; the bigger card waits for section 2, where its photo is the point.
- Rule candidate: R08.
- PROPER EXAMPLE: 03b section 1, `Greeting` in the card, then the same `Greeting` placed by `App`, logged, and followed through the four stages.
- COUNTER-EXAMPLE: 03 section 1, the card's `Greeting`, then at once an `<article>` card with a `className` that only section 5 explains.
- Skill home: `summary-edition` (examples) and the principle-section shape.
- Left open: page 5 holds only the stages and the definition paragraph and is half empty, because 1B's opening (title, tree, principle card) stays together.

## Working method

- Questions to the owner are asked in the chat, never through a live options form. Owner's words: "NEVER ask me for options in a live manner, ask me in the chat always."

### D09: Grey facts and principle boxes; one blue block for each component panel

- Owner's words: see R09 and R10.
- Where: every fact, every principle box, and every component panel of 03b (the side-by-side ones and the stacked one in "The components behind the page").
- Change: facts went from light blue (`#e7f5fa`) to a neutral grey, `#eef0f2`. Principle boxes went from light green (`#eaf7ee`, the kicker strip too) to the same grey; their thin green frame and green "Principle N" label stay. A component panel was two cards, the tree on light blue (`#eaf3fb`) and the notes on grey, 8pt apart; it is now one light blue block with 9px corners, the tree and the notes in the same places as before, and no gap between them. The stacked panel is one block the same way, top and bottom.
- How it is written: `src/revised-4/base.css`, at its end, under `body.edition-b`, so lessons 03, 10, and 11 keep their colours when rebuilt.
- Why: blue now means a component, and only a component; a fact or a principle cannot be mistaken for one. The notes read as part of the panel they explain.
- Rule candidates: R09, R10.
- Skill home: `summary-revision-4` Section 03 (the look), or the stage the "b" pass becomes.
- Left open: the "Fact" label is still blue text on the grey.

### D10: The principle box loses its green frame; its label turns dark grey

- Owner's words: "the principle box has green border around, remove it. It has green colour of the title principle, adapt it"
- Where: every principle box of 03b.
- Change: the 1.25pt light green frame is gone, so the box stands on its grey alone, like a fact. The "Principle N" label went from green (`#2b9348`) to the dark grey of secondary text (`--ink-2`, `#5d6773`). The green "We should do this" and red "We should not do this" labels, and the green and red code cards, stay: they mark right and wrong, not the box.
- How it is written: `src/revised-4/base.css`, at its end, under `body.edition-b`.
- Why: once the box is grey, green on its edge and its label belongs to nothing; green now means only "right", as red means only "wrong".
- Rule candidate: R09, extended: colour carries one meaning each (blue for components, green for right, red for wrong); a box's frame and label take the box's own neutral tone.
- Skill home: `summary-revision-4` Section 03 (the look), or the stage the "b" pass becomes.

### D11: One component per file, across the whole lesson

- Owner's words: see R11.
- Where: section 1 (its code, its hierarchy panel, the Network panel fact, the stages), sections 2 and 5 (their file tabs), "Putting the five together" (both cards), the opening example's error overlay, and "The components behind the page".
- Change: in 03, every component lived in `App.jsx`, and "The components behind the page" said "a later lecture gives each its own file". In 03b: section 1 shows two files, `Greeting.jsx` (`export default function Greeting()`, the balloon on `console.log(note)`) and `App.jsx` (`import Greeting from './Greeting.jsx';`, with a balloon on `Greeting`: "Our component, from its own file"). The hierarchy note says `App` imports `Greeting` from `Greeting.jsx`. The Network fact and the stages follow `Greeting.jsx`. Sections 2 and 5 are titled `ArticleCard.jsx` and `SignUp.jsx`, and their functions are `export default function`; so are both cards of "Putting the five together". The overlay reads `src/ArticleCard.jsx:4:8`. "The components behind the page" lists the five files, says `App.jsx` imports the other four, adds `Greeting` to the panel, and its caption reads "The components of this lecture, one file each".
- Why: a reader who sees two components in one file learns that habit first; one file per component is how a real project is laid out, and it costs only one `import` line.
- Rule candidate: R11.
- PROPER EXAMPLE: 03b section 1, `Greeting.jsx` and `App.jsx` as two file tabs.
- COUNTER-EXAMPLE: 03 section 1, `App.jsx` holding `function Greeting()` and `export default function App()`.
- Skill home: `summary-edition` (examples), and the project's code conventions for every lesson.
- Left unchanged: the code inside principle cards and the small two-column snippets, which show a function or a few lines, not a file.

### D12: Section 1 opens with the page beside its two components

- Owner's words: see R12.
- Where: section 1, from the line after Principle 1's card to the subtitle "What is the JSX transform?".
- Change: before, the section went: a hierarchy panel, `Greeting.jsx`, `App.jsx`, then a row with the page (a miniature browser) beside the Console's object. Now: one lead sentence ("We take the principle's own `Greeting` and place it on a page. Each component lives in its own file [...]"), then a two-column row, "The page" (a full-size browser, its text at 12pt) beside "React Components" (`Greeting.jsx` above `App.jsx`); then "How the two components connect:" and the hierarchy panel; then the Console's object on its own, as a titled block, "Console panel: console.log(note), opened and shortened". The balloon in `Greeting.jsx` became "Logs the object the tag became", to fit the column.
- How it is written: the row uses the existing `::: row` and `::: col` blocks; the left column's browser is a `page` block without `size=mini`. The larger browser text is in `src/revised-4/base.css`, under `body.edition-b .browser:not(.mini)`: 12pt page text, 8pt address bar, more padding.
- Why: the reader sees the result and the code that produces it in one glance, before any explanation; the Console then answers the question the page raises.
- Rule candidate: R12.
- PROPER EXAMPLE: 03b page 4, "The page" beside "React Components".
- COUNTER-EXAMPLE: 03b in D08, where the page appeared after both files and the hierarchy, as a miniature beside the Console.
- Skill home: `summary-edition` (the principle-section shape) and `summary-figures` (browser panels).

### D13: The file tab ends on the bar's bottom line

- Owner's words: see R13.
- Where: every code editor of 03b with a file tab (`Greeting.jsx`, `App.jsx`, `ArticleCard.jsx`, `SignUp.jsx`, `index.css`, the Console blocks).
- Change: the tab was taller than the bar that holds it, so its two sides ran about 3pt past the bar's bottom line into the first line of code. The bar now lays out its dots and its tab in a row aligned at the bottom, and grows to fit the tab; the tab ends exactly on the bar's bottom line and covers that line beneath it, so the tab opens into the code as an editor's active tab does.
- How it is written: `src/revised-4/base.css`, at its end, under `body.edition-b .ed .bar`, `.ed .dots`, and `.ed .tab`.
- First attempt, reverted: I misread the bug as the tinted code lines touching the editor's frame, and made each line stop 2.5pt short of the frame. The owner saw no change in the tab; that rule was removed from the CSS.
- Why: a frame line that runs past its box reads as a line drawn through the code.
- Rule candidate: R13.
- Skill home: `summary-revision-4` Section 03 (the look).

### D14: PARENT and CHILD labels on the file bars, the parent first

- Owner's words: see R14.
- Where: section 1, the "React Components" column, and the lead sentence above the row.
- Change: `App.jsx` now comes first and `Greeting.jsx` second. Each file's bar carries its place in the tree at the top right, "PARENT" and "CHILD", in the type of the principle box's label (Avenir Next, bold, capitals, wide letter spacing, the dark grey of secondary text), set at 6.2pt to sit in the bar. The lead sentence now names them in the same order: "`App.jsx`, the parent, imports `Greeting` and places it with its tag, and `Greeting.jsx`, its child, returns the greeting".
- How it is written: a new code block attribute, `role`, as in ```` ```jsx title="App.jsx" role=PARENT ````; `src/revised-4/editor.mjs` draws it at the right of the bar, and `src/revised-4/base.css` styles it as `.ed .bar .role` (with a `body.edition-b` line for the bar's row layout). Any word works: PARENT, CHILD, GRANDCHILD, GRANDPARENT.
- Why: the reader sees which file holds which before reading a line of code, and reads them in the order React uses them, the parent placing the child.
- Rule candidate: R14.
- Skill home: `summary-figures/blocks.md` (the `role` attribute) and `summary-edition` (the order of component files).
- Left open: the other file blocks of the lesson (`ArticleCard.jsx`, `SignUp.jsx`) appear alone, with their parent only in the hierarchy panel, so they carry no label yet.

### D15: PARENT and CHILD tabs on every component box

- Owner's words: see R15.
- Where: every hierarchy panel of 03b (seven panels, seventeen boxes).
- Change: each component box now has a small tab above its top left, with soft top corners, in the boxes' blue (`--hier-a`, `#9cc3e6`), carrying its place in the tree in the principle label's type (bold capitals, wide letter spacing) in the panels' dark blue (`--hier-key`). The root box says PARENT, its children CHILD, theirs GRANDCHILD. On the white box that marks where the choice is made (its blue ring), the tab sits on the ring. Each box moved down by the tab's height, and the connector line from the parent runs on through that space to the box.
- How it is written: `src/build-revised-4.mjs` adds the tab to every box; the word comes from the box's depth, or from a `role: ...` part of the line when a panel needs another word. `src/revised-4/base.css` shows and draws the tab only under `body.edition-b`, so lessons 03, 10, and 11 are unchanged.
- First build, corrected: the children's tabs read GRANDCHILD, because the depth count started one level off; fixed before review.
- Why: the reader sees the relationship in the box itself, in the same words as the code files above it.
- Rule candidates: R15, with R14.
- Skill home: `summary-figures` (hierarchy panels) and `summary-figures/blocks.md` (the `role:` part).

### D16: Taller role tabs with white text, and more room above the panel

- Owner's words: "needs padding OR margin on top, maybe make the font white colour"
- Where: every role tab in 03b's hierarchy panels.
- Change: each tab grew from 10pt to 13pt tall, its word set at 6pt (from 5.6pt) and centred in that height, with a little more side padding; the word is now white. The boxes and the connector line moved down with the taller tab. The panel's tree has more room above its first tab (20pt, 22pt in a stacked panel).
- How it is written: `src/revised-4/base.css`, at its end, under `body.edition-b`.
- Note for the owner: white on the tab's light blue (`#9cc3e6`) is low in contrast; if the word reads faintly in print, the tab can take a deeper blue.
- Rule candidate: R15 (refined: the tab gives its word room, and the panel gives the tab room).

### D17: The logged object in a light Chrome Console

- Owner's words: see R16.
- Where: section 1, the logged object after the hierarchy panel; the sentence above it.
- Change: the code editor (line numbers, zebra lines, a file tab, `{ type: 'p', props: { children: ... } }` as source code) became a light Chrome Console: tabs (Elements, Console, Sources, Network) with Console active; the filter bar (top, Filter, Default levels); the logged value as Chrome draws it once opened, `▼ {type: 'p', props: {…}}`, then `type: "p"`, `▼ props: {children: 'Hello, John Hall'}`, then `children: "Hello, John Hall"`, indented under their triangles, property names in Chrome's purple and strings in its red; `Greeting.jsx:3` at the right of the first line, underlined, as Chrome links the line that logged it; and the empty prompt with its blue caret below. The two notes, "The tag's name, kept as text" and "The tag's content", sit at the right of their lines in the balloons' type, pointing left. The caption says React adds more properties, left out here. The sentence above now says the object opens "by clicking its triangle".
- How it is written: a new block, ```` ```devconsole source="Greeting.jsx:3" ````, one line per row, two spaces per level, `v ` for an opened object, `> ` for a closed one, ` | note` for a note. `src/build-revised-4.mjs` draws it (`devConsole`); `src/revised-4/base.css` styles it under `.dc`.
- First build, corrected: it showed `> console.log(note)` above the value, which in Chrome means a line typed into the Console; our code logs it from `Greeting.jsx`, so the line was removed.
- Why: the Console is a tool the reader will open, so it should look like that tool, and a logged value is data, not lines of code to count.
- Rule candidate: R16.
- Skill home: `summary-figures/blocks.md` (the `devconsole` block) and `ui-panels`.
- Left open: the older Console panels of the lesson (the error lines under section 5's form, the `page` blocks with `error:` lines) keep their current look.

### D18: Section 1 gets its subtitles: Component Code, Component Hierarchy, Let's check our console log

- Owner's words: see R17.
- Where: section 1.
- Change: three level-three subtitles, in the owner's words: "Component Code" before the lead sentence and the row with the page and the two files; "Component Hierarchy" before "How the two components connect:" and the panel; "Let's check our console log" before the Console paragraph and the Console. "What is the JSX transform?" follows as before. The text under each is unchanged.
- How it is written: `### Component Code`, `### Component Hierarchy`, `### Let's check our console log`.
- Why: the reader learns one route through every principle, and can find the code, the tree, or the check at a glance.
- Rule candidate: R17.
- Skill home: `summary-edition` (the principle-section shape).
- Left open: sections 1B to 5 do not follow the pattern yet; most of them put the hierarchy before the code, and their check is an error overlay, the Elements panel, or a page, not the Console.

### D19: Section 1B gets its subtitles: Component Hierarchy, The JSX transform that fails

- Owner's words: "Now the next principle, the 1B [...] We need to add the title Component Hierarchy and then add a title The JSX transform that fails"
- Where: section 1B, after Principle 1B's card.
- Change: two level-three subtitles, in the owner's words: "Component Hierarchy" before the sentence "The same rewrite that turns `<p>` into a call also turns the tags of our own components into calls:" and the panel; "The JSX transform that fails" before the paragraph on the capital and the small letter and the chain of the two tags and their calls. The text under each is unchanged.
- How it is written: `### Component Hierarchy`, `### The JSX transform that fails`.
- Why: R17's route, applied to a principle whose check is the transform itself: the tree shows where the tag sits, and the chain shows the call the build writes when the tag's first letter is wrong.
- Rule candidate: R17 (the explanation subtitle names what the section's case shows, here a transform that fails, as section 1's names the transform).
- Skill home: `summary-edition` (the principle-section shape).
- Left open: 1B has no "Component Code" row of its own; App.jsx and ArticleCard.jsx appear only inside the principle's card and the moved example.

### D20: Every numbered section gets a key-question subtitle under its heading

- Owner's words: see R18.
- Where: under the headings of sections 1, 1B, 2, 3, 4, and 5 (the section's h2, not the title inside the principle box).
- Change: one italic line each, a question word and its short answer. 1 and 1B in the owner's words (his "Othewrise" spelled "Otherwise", "proper JSX transform" given an article); 2 to 5 adapted from each principle's own reason:
  - 1: "How? Due to a proper JSX transform"
  - 1B: "Why? Otherwise the JSX transform fails"
  - 2: "What if not? The build stops, and nothing in the file runs"
  - 3: "Why? Each tag is one value, and a return gives back one value"
  - 4: "When? The tags need one root, but the page needs no extra box"
  - 5: "Why? `class` and `for` are reserved words in JavaScript"
- How it is written: an italic-only paragraph right under a numbered heading, `*How? Due to a proper JSX transform*`. `src/build-revised-4.mjs` turns it into `<p class="sec-dek">` (`render`, case `dek`); `src/revised-4/base.css` styles it under `body.edition-b .sec-dek`: italic, 11.5pt, `--ink-2`, indented 24pt to line up with the heading's words after the number badge, the heading's bottom margin cut to 3pt so the two read as one unit.
- Why: the heading states the rule; the question line tells the reader what the section will prove, so each section opens with a reason, not only a claim.
- Rule candidate: R18.
- Skill home: `summary-edition` (the principle-section shape).
- Left open: the question words of 2 to 5 are the assistant's adaptation, waiting for the owner's review; "What if not?" in 2 states a consequence rather than a reason, chosen so the six sections do not all open with "Why?".

### D21: Section 3's key question in the owner's words

- Owner's words: "3 One root per return. Why? Each tag is one value, and a return gives back one value. write instead: Why? Each component creates a JS function that returns one value"
- Where: section 3, the subtitle under its heading.
- Change: "Why? Each tag is one value, and a return gives back one value" became "Why? Each component creates a JS function that returns one value".
- How it is written: `*Why? Each component creates a JS function that returns one value*`.
- Why: the owner points the reason at the component, the thing the reader writes, rather than at the tag.
- Rule candidate: R18 (the key question names the thing the reader writes).
- Skill home: `summary-edition` (the principle-section shape).
- Left open: a component is itself a function, it does not create one; "Each component is a JS function that returns one value" was offered to the owner as a closer wording.

### D22: Section 2 rebuilt on the principle-section route, around the principle's own `Author`

- Owner's words: see R19.
- Where: section 2, from its heading to section 3; one word in section 3.
- What confused: the section opened with a fact on comments, unrelated to closing tags; the principle showed `Author`, and the case then switched to the old site's `ArticleCard` with a library photo and a `className` (pointing ahead to section 5); the explanation ("After an open tag, the build reads...") came after the comparison, with no subtitle, and the closing-rules tree had no heading of its own.
- Change, in order:
  - Facts: the void-elements fact first, since it is the section's subject; the comments fact moved to the top of Component Code, right before the first file that uses `{/* */}` outside the principle box. This also lets heading, map, fact, and principle fit on one page (page 8 was half empty).
  - `### Component Code`: R08 applied, the principle's own `Author` replaces `ArticleCard`. `App.jsx` (PARENT) imports and places `Author`; `Author.jsx` (CHILD) returns the photo and `<p>John Hall<br />Boston</p>`, with only the image left open and line 4 marked bad, "so the build has one problem to report".
  - `### Component Hierarchy`: App and Author, with the same three notes as before, adapted: placed with `<Author />`, the `<img>` written as HTML allows, "We want: the photo, then the name and the city on two lines."
  - `### Let's check the error overlay`: the same left-open / closed-with-a-slash comparison, the overlay now pointing at `Author.jsx` (opened at line 4, `</section>` at line 6 where `</img>` was expected), the fixed side showing the photo with the name and the city on two lines. One new sentence covers the principle's second wrong line: a `<br>` left open stops the build in the same way, with `'br'` in the message.
  - `### Why does an open tag stop the build?`: the old explanation, now led by "Section 1 showed that each tag becomes a call. To write a call, the build must know where each tag's content ends", then the chain, retold for `Author` (`<p>` becomes the image's content, `</section>` still waits for `</img>`).
  - `### How each kind of tag is closed`: the closing-rules tree, unchanged, with a lead sentence: "One question decides how we close a tag, whether it can ever hold anything:".
  - Section 3: "Another card on the old site" became "A card on the old site", since section 2 no longer shows one.
- Kept: every fact, the principle box, the overlay, the comparison, the chain, and the tree. Dropped only what belonged to the old case: the library card, the photo "Library", and the note that its `class` was already `className` (section 5 still teaches it).
- How it is written: a new page-block card key, `lines=John Hall; Boston`, draws one paragraph broken into lines as `<br />` does (`cardHTML` in `src/build-revised-4.mjs`). The old section is kept as `notes/03b-shots/d22-section2-before.md`.
- Why: one route through every section; the case is no harder than the principle's own code; each subtitle answers one question.
- Rule candidate: R19 (with R08, R17).
- Skill home: `summary-edition` (the principle-section shape).
- Left open: page 11 holds only the closing-rules tree, with its heading and lead, and is two thirds empty; the `Author` case reuses the principle's photo `/john.jpg`, while section 3's case still uses the old site's card.

### D23: Real photos in the browser mocks, from a `public/` folder beside the lessons

- Owner's words: see R20.
- Where: section 2's fixed page (`/john.jpg`), and the Example's old-site page (`/library.jpg`).
- Folders: `05-01-md-revised-4/v1/public/` holds the photos the lessons' code names, `john.jpg` and `library.jpg`, as a Vite project keeps them in `public/` and serves them at `/john.jpg`. The build copies the folder to `05-02-md-revised-4-html/v1/public/` beside the HTML, so the HTML and the PDF both find it.
- The photos: generated for the book (an author's head-and-shoulders portrait; a library reading room with shelves, tables, and arched windows), saved as 900 by 600 JPEGs.
- How it is written: a page-block card whose `img=` starts with a slash is a file in `public/`, with its `alt`: `card: img=/john.jpg | alt=John Hall | lines=John Hall; Boston`. `photoHTML` in `src/build-revised-4.mjs` draws a real `<img>` and stops the build when the file is missing; `img=` without a slash keeps the old coloured bar, so 03 is unchanged. `src/revised-4/base.css`: the photo keeps its own shape, as an `<img>` with no CSS does, with its height capped (96pt, 72pt in a mini page), soft corners, and a thin frame.
- Why: the reader compares the code and the page; a photo reads as a photo at a glance, while a coloured bar named "John Hall" reads as a heading.
- Rule candidate: R20.
- Skill home: `summary-figures/blocks.md` (the `page` block's card) and `ui-panels`.
- Left open: the components panel lists the files in `src/` but not `public/`, where the photos live.

### D24: One type scale for every browser panel, full size or mini

- Owner's words: see R21.
- Where: every `page` block and every error overlay in 03b (one full-size page in section 1, ten mini pages).
- Change: the full-size page's 12pt line and the mini pages' 5.8pt to 7.5pt text became one scale, the same in both: page text (lines, card text, list items, form labels, inputs) 10pt, the book's body size; card titles 11pt; page headings 13pt; small text (author line, footers, section labels, "missing" notes) 8pt; the address bar 7.5pt; console lines and the error overlay 7pt monospace (the overlay was 5.9pt in a mini page); photos 80pt tall in every page.
- How it is written: CSS variables on `body.edition-b` (`--pg-text`, `--pg-title`, `--pg-head`, `--pg-small`, `--pg-chrome`, `--pg-mono`) and rules under `body.edition-b .browser` that outrank the `.mini` sizes; the old full-size-only rules (`.browser:not(.mini)`) were replaced. Monospace stays at 7pt so the overlay's code frames, which do not wrap, fit a half-width column.
- Why: the reader learns one look for "the page in the browser", and reads it at the same size as the book's text, wherever it appears.
- Rule candidate: R21.
- Skill home: `summary-figures/blocks.md` (the `page` and `overlay` blocks) and `ui-panels`.
- Left open: the larger pages pushed the lesson from 23 to 24 pages: section 3's last paragraph ("The two inner calls become the content of the outer one...") now sits alone on page 14, since section 4's opening keeps together on page 15.

### D25: The error overlay in a light theme

- Owner's words: see R22.
- Where: every error overlay in 03b (sections 2, 3, and the Example).
- Change: the near-black panel became white, under the same red top bar (`#e5484d`); the message is bold dark red (`#c0262d`); a help line is dark amber; the file link (`src/ArticleCard.jsx:4:8`) is link blue; the code frame with its line numbers and pointers ("Opened here", "Expected `</img>`") sits on a pale grey card with a thin border and soft corners, in dark text. The cream strip under the overlay (the column's 6pt bottom margin showing the browser's background) is gone.
- How it is written: rules under `body.edition-b .overlay`, `.ov-msg`, `.ov-help`, `.ov-file`, `.ov-frame` at the end of `src/revised-4/base.css`; the overlay's markup is unchanged. A missing line break that had joined the browser-scale rules (D24) to the next comment was fixed.
- Why: the reader meets one light look for every tool panel; a dark block in a light page draws the eye before the code it explains.
- Rule candidate: R22.
- Skill home: `summary-figures/blocks.md` (the `overlay` block) and `ui-panels`.
- Left open: Vite itself draws its overlay dark; the caption or text does not say the book redraws it in light colours.

### D26: The page's cards lose their white box and the photo its frame

- Owner's words: see R23.
- Where: every `card:` line in a browser in 03b: section 2's photo with the name and the city, section 3's "Library Hours" pages, the Example's old-site page.
- Change: the card's white background, border, soft corners, and padding are gone; the photo has no frame or rounded corners; the text sits right under the photo (5pt), on the browser's own page colour. Kept on purpose: section 4's list items keep their borders (the demo's CSS draws them, and the text says "each with its border"), the form's input keeps its field outline, and an empty-tags "ghost" card keeps its dashed outline, which carries its meaning.
- How it is written: rules under `body.edition-b .browser .pcard` and `.pimg.photo` at the end of `src/revised-4/base.css`; the markup is unchanged.
- Why: four nested frames (column, browser, card, photo) left the reader looking at frames instead of the page; a real page with no CSS shows an image and its text, nothing around them.
- Rule candidate: R23.
- Skill home: `summary-figures/blocks.md` (the `page` block's card) and `ui-panels`.
- Side effect: the lesson is back to 23 pages; section 3's last paragraph no longer sits alone on a page.

### D27: Section 3 rebuilt on the section route, and its comparison shows the browsers first

- Owner's words: see R24.
- Where: section 3, from its heading to section 4; one sentence in section 4.
- Change, in order:
  - Heading, key question, map, and Principle 3: unchanged.
  - `### Component Code`: R08 applied, the principle's own `Author` (`<h2>John Hall</h2>` and `<p>Author of 12 articles</p>`) replaces the old site's "Library Hours" card. `App.jsx` (PARENT) imports and places `Author`; `Author.jsx` (CHILD) returns the two tags side by side, line 4 marked bad. "Every tag is now closed" stays as the opening.
  - `### Component Hierarchy`: App and Author; notes: `Author` returns two tags side by side, "as an HTML file allows"; "We want: the name, and the line under it, on the page."
  - `### Let's check the error overlay`: each column now shows its browser on top and its code under it (R24): on the left, the overlay ("Adjacent JSX elements must be wrapped in an enclosing tag.", with its help line), then the two tags; on the right, the page with "John Hall" and "Author of 12 articles", then the same tags inside one `<section>`. The caption says "The browsers on top, the code under each."
  - `### Why do two tags side by side stop the build?`: a new lead links to section 1 ("each tag becomes a call, and a call returns one value. `return` gives back one value too, so it has room for one call, not two"), then the chain, retold for `<section>`, then the old paragraph on `children`, adapted to `<section>`, with its pointer to section 4.
  - Section 4: "Section 3 gave the card one root, an `<article>`" became "Section 3 gave `Author` one root, a `<section>`".
- Kept: the principle, the overlay's message and help line, the chain, the `children` paragraph, and the pointer to section 4. Dropped only the old case's card and its text ("Library Hours", "Open until nine."), which the Example and "Putting the five together" still show. The old section is kept as `notes/03b-shots/d27-section3-before.md`.
- Why: the reader sees what happened on the page first, then finds the cause in the code right under it; and the case is the principle's own code, as in sections 1 and 2.
- Rule candidate: R24 (with R08, R19).
- Skill home: `summary-edition` (the principle-section shape) and `summary-figures/blocks.md` (the comparison row).
- Left open: section 2's comparison still shows the code first; in section 3 the overlay is shorter than the page, so the two code boxes start at different heights; the lesson is 24 pages.

### D28: The case's subtitles say they show an example

- Owner's words: "Edit all previous titles Component Hierarchy as such: Example Component Hierarchy, to show we are examining an example, similarly the Component Code → Example Component Code"
- Where: every "Component Code" and "Component Hierarchy" subtitle in sections 1, 1B, 2, and 3.
- Change: `### Component Code` became `### Example Component Code`; `### Component Hierarchy` became `### Example Component Hierarchy`.
- Why: the principle box states the rule; the subtitles below it mark the shift to one worked case, so the reader knows the code and the tree are an example of the rule, not the rule itself.
- Rule candidate: R17 (the subtitle pattern), now "Example Component Code", "Example Component Hierarchy", the check, the explanation.
- Skill home: `summary-edition` (the principle-section shape).

### D29: Each example opens with the try and its outcome; the tree is "Component Hierarchy" again

- Owner's words: see R25.
- Where: sections 1, 1B, 2, and 3.
- Change:
  - 1: "Example: let's log a tag in the Console (it is an object!)" (the example works, so its outcome names what the reader finds).
  - 1B: "Example: let's name our component with a small letter (it fails!)". 1B had no example code of its own, so the subtitle now heads one: the lead sentence that opened the hierarchy ("The same rewrite that turns `<p>` into a call...") and two files, `App.jsx` (PARENT), which imports `ArticleCard` but places it as `<articleCard />`, line 4 marked, and `ArticleCard.jsx` (CHILD), which returns `<h2>Library Hours</h2>`, "Never drawn: React never calls this function". The hierarchy's first note now names the tag as written, `<articleCard />`, "its name written with a small letter"; "holds: the card markup" became "holds: the card's heading".
  - 2: "Example: let's use `<img>` instead of `<img />` (it fails!)" (the owner's `<img/>` written `<img />`, as the rest of the lesson writes it).
  - 3: "Example: let's try to return two roots (it fails!)", the owner's words.
  - Every "Example Component Hierarchy" became "Component Hierarchy".
- How it is written: `### Example: let's try to return two roots (it fails!)`, code in backticks.
- Why: the reader knows before reading the code what is being tried and what will happen, and reads the code looking for the cause.
- Rule candidate: R25 (replaces D28).
- Skill home: `summary-edition` (the principle-section shape).
- Side effect: page 7 (1B) is no longer two thirds empty.

### D30: Sections 4 and 5 and the closing parts follow the rules so far

- Owner's words: "Follow the rules we have applied so far and edit all the rest of the lesson please, until the end"
- Where: sections 4 and 5, "Putting the rules together", the Summary, the Example at the end, "The components behind the page", every map, and section 2's comparison. The old text from section 4 to the end is kept as `notes/03b-shots/d30-sections4-to-end-before.md`.
- Section 4 (R08, R17, R19, R24, R25):
  - The case is the principle's own `Items` ("First", "Second") instead of `FeaturedArticles` ("Ten easy summer recipes", "New park opens today"); the list is `<ul className="items">`, and the fact's child selector is `.items > li`.
  - `### Example: let's group the items with a `<div>` (the row breaks!)`: `App.jsx` (PARENT) and `Items.jsx` (CHILD, line 3 marked) side by side, so the code and the tree fit one page; then `index.css` with its sentence.
  - `### Component Hierarchy`: App and Items, the three notes adapted.
  - `### Let's check the Elements panel`: each column shows the page on top, then the Elements panel, then the code; the Console sentence (React checks some nesting rules) leads it.
  - `### Why does a `<div>` break the row?` and `### What to group tags with` (the tree, its element example now `<section>`, as section 3 used).
- Section 5 (R08, R16, R17, R19, R24, R25):
  - The case is the principle's own `SignUp` label, `for="name"` and "Name", now with its field, `<input id="name" tabindex="0" />`; the old newsletter form ("Your email", `type="email"`) is gone.
  - `### Example: let's keep HTML's attribute names (the Console fills with errors!)`: `App.jsx` (PARENT), `SignUp.jsx` (CHILD, lines 4 and 5 marked).
  - `### Component Hierarchy`; `### Let's check our console log`: each column shows the page on top, then a light Chrome Console (R16), then the code. The three React errors are drawn as Chrome draws errors, pink rows with a red round icon; the clean side shows "No messages".
  - `### Why does React want JavaScript names?` (the paragraph and the table) and `### Why does the page still look right?` (the last paragraph, `for="name"`).
- Closing parts:
  - "Putting the five together" became "Putting the rules together", self-contained (it no longer says "the old card"), and lists the capital letter among the rules.
  - The Summary starts a new page (R03), so its tree and its bold line stay together; the bold line adds "a capital letter for our components".
  - The Example at the end: both columns show the browser on top and the code under it (R24); "a dark panel" became "a panel" (R22 draws it light); "The example for this whole lecture is" became "The rules of this lecture meet in one real task"; "That is the topic of this lecture: ...?" became "That was the topic of this lecture: ...".
  - "The components behind the page": `Greeting`, `ArticleCard`, `Author`, `Items`, `SignUp` under `App`, five boxes (R06).
  - Every map's root: "Five rules for pasted HTML in a component" became "Five rules for JSX in a component", since the principles no longer paste the old site's markup.
  - Section 2's comparison now shows the browsers on top and the code under each (R24), as section 3's does.
- How it is written: the `devconsole` block gains two row kinds, `x message` for an error and `= text` for a dim line (`devConsole` in `src/build-revised-4.mjs`, `.dc-err`, `.dc-x`, `.dc-empty` in `src/revised-4/base.css`).
- Kept: every fact, principle, overlay, Elements panel, chain, tree, table, and the interview and "Where you will meet this" lists, unchanged in substance.
- Left open: the lesson is 26 pages; pages 11 (section 2's closing tree), 18 (section 4's tree), and 23 (the end of the interview list) are partly empty; the Summary tree still squeezes "The normal HTML markup" into a narrow column.

### D31: Section 4's lead in plain sentences

- Owner's words: see R26.
- Where: section 4, the lead of "Example: let's group the items with a `<div>` (the row breaks!)", the sentence before `index.css`, and the section's fact note.
- Change: one 85-word paragraph of chained clauses became three short paragraphs, one job each:
  - The bridge, as questions, after the owner's model: "The previous section wrapped the two tags in a single `<section>`. But what if the page does not need a `<section>` element? What if adding a `<div>` or a `<section>` breaks the page?" (The owner's "breaks our code" became "breaks the page": the build passes, and the layout is what breaks.)
  - The setup: "Let's look at a list. We take the principle's own component, `Items`, and use two files. `App.jsx` is the parent: it draws a list, `<ul>`, and places `Items` inside it. `Items.jsx` is the child: it returns the two list items, `<li>First</li>` and `<li>Second</li>`."
  - The attempt: "Two `<li>` side by side stop the build, as we saw before. So the two items need one root. The quickest root is a `<div>`:"
  - The `className` aside left its brackets for the fact note: "In JSX, the `class` attribute is written `className`, as a later principle explains: `<ul className="items">`."
  - "`index.css`, which `main.jsx` imports, shows the list ..." became "A stylesheet, `index.css`, shows the list as a row, with a border on each item that sits directly inside the list:", since `main.jsx` is met only at the end of the lesson.
- Why: a tired reader follows each sentence on the first read; the question in the bridge tells the reader what to look for.
- Rule candidate: R26.
- Skill home: `lecture-voice` (Sections 05, 06, 31) and `summary-edition` (Sections 07, 10, 14).
- Left open: the rest of the lesson still names sections by number (about a dozen places, such as "as section 1 showed", "section 5 explains", the Example table's "(section 2)") and uses "box" for an element (the section 4 heading "A Fragment when no box is wanted", its question line, Principle 4, the map label, the closing tree, the Summary); the Example leads of sections 2, 3, and 5 keep their long shape.

### D32: Section 4's lead says the point first; no lead sends the reader back to "the principle's own" component

- Owner's words: see R27, R28, R29.
- Where: the leads of the five examples (sections 1, 2, 3, 4, 5).
- Change, section 4 (R28, R29), four short paragraphs in place of D31's three:
  - What changed: "In the previous examples, an extra element around the tags did no harm: a `<section>` around a name and a line changed nothing on the page. Here an extra `<div>` or `<section>` breaks the page's style."
  - The mechanism: "CSS is sensitive to the hierarchy of DOM elements. Many CSS rules style an element by its place under its parent: a rule can style only the `<li>` items that sit directly inside a list, for example. When we add a new element in between, such as a `<div>`, the items are no longer directly inside the list, and the rule stops applying. The page loses that style, and neither the build nor the Console warns us."
  - Who it concerns: "These CSS rules often come from a web designer, not from the React developer. So a React developer can break a style without knowing that it exists. A React developer needs to know how the page's CSS depends on its elements."
  - The setup: "Our example is a list with two items, in two files. [...] Two tags side by side stop the build, so the two items need one root. The quickest root is a `<div>`:"
- Change, the other leads (R27, R28, R26): each now opens with what the example does and what happens, then one sentence per file:
  - 1: "Our example places `Greeting` on a page, in two files. `App.jsx` is the parent: [...] `Greeting.jsx` is the child: [...]"
  - 2: "Our example leaves one `<img>` open, as HTML allows, and the build stops. The example has two files. [...]"
  - 3: "Our example returns two tags side by side, as an HTML file allows, and the build stops. Every tag is closed, so this is the only problem. [...]"
  - 5: "Our example keeps HTML's attribute names in a form, and the Console fills with errors. The build accepts these names, so the page still appears. [...]"
- Why: the reader learns the point before the code, and the mechanism in the platform's own terms; the phrase "the principle's own" asked the reader to remember a demo instead of reading the example.
- Rule candidates: R27, R28, R29.
- Skill home: `summary-edition` (Section 07, the bridge and the setup; Section 14, language) and `lecture-voice` (Sections 06, 12).
- Side effect: the lesson is 27 pages.
- Left open: the section numbers and the word "box" elsewhere in the lesson (D31).

### D33: Every example's setup in the normative shape

- Owner's words: see R30.
- Where: the setup sentences of the six examples (sections 1, 1B, 2, 3, 4, 5).
- Change:
  - 4 (the owner's approved text): "We want a list with two items. The list is in the parent, `App.jsx`. The items come from the child, `Items.jsx`. A component returns one root, so we wrap the two items in a `<div>`:"
  - 1: "We want a greeting on the page. The greeting comes from the child, `Greeting.jsx`. The parent, `App.jsx`, imports it and places it with its tag. Each component lives in its own file, named after it:"
  - 1B: after its first sentence on the rewrite, "We want the card's heading on the page. The heading comes from the child, `ArticleCard.jsx`. The parent, `App.jsx`, imports it but places it with a small letter, `<articleCard />`, and the card does not appear:"
  - 2: "We want a photo, with a name and a city under it. The parent, `App.jsx`, places the child, `Author.jsx`. We leave the `<img>` open, as HTML allows, and the build stops. Only the image is left open, so the build has one problem to report:"
  - 3: "We want the author's name, with a line under it. The parent, `App.jsx`, places the child, `Author.jsx`. We return the two tags side by side, as an HTML file allows, and the build stops. Every tag is closed, so this is the only problem:"
  - 5: "We want a form with a label and a field. The parent, `App.jsx`, places the child, `SignUp.jsx`. We keep HTML's attribute names, `class`, `for`, and `tabindex`, and the Console fills with errors. The build accepts these names, so the page still appears:"
- Why: the reader knows the goal and the action before reading the code, and reads the code for its details instead of reading them twice.
- Rule candidate: R30 (with R26, R27, R28).
- Skill home: `summary-edition` (Section 07, the setup) and `lecture-voice` (Section 06).

### D34: Every prose paragraph in the normative shape

- Owner's words: see R31.
- Where: 41 paragraphs across the whole lesson: the opening (two ways to write markup, the five rules, their order), the leads and closing explanations in every principle, the facts on the Network panel and on comments, the "Putting the rules together" leads, the interview and "Where you will meet this" bullets, and the old-site example at the end. The principle boxes, the section 4 explanation the owner approved in D32, and the setups from D33 stay as they are.
- Change, by kind:
  - Section numbers removed: "Section 1 showed that each tag becomes a call" became "Each tag becomes a call"; "as section 4 shows" became "(the next principle)"; "(section 2)" and "(section 5)" in the old-site table became "(Principle 2)" and "(Principle 5)".
  - Long sentences split: the JSX transform paragraph, the `<div>` comparison lead, the attribute names explanation, and the old-site overlay paragraph now carry one fact per sentence.
  - Point first: section 4's lead now opens with "Here, an extra `<div>` or `<section>` breaks the page's style."; "Why does the page still look right?" opens with "React still writes `class` and `for` into the page as attributes."
  - "We" as the actor: "We open the Console and see an object, not the markup."; "We compare two versions that differ in one line."; "We close a tag according to one question: can it ever hold anything?"; "We choose by one question: does the page need the box?"; the "Where you will meet this" bullets say what we do ("we group the cells with a Fragment").
  - Descriptive leads made normative: "One article card, ... written so that it follows every rule" became "We want an article card with a photo, a heading, and a line of text. We write it by every rule of this lecture: ..."; the old-site opening became "A news site is moving to React. ... we want their markup in components."
- Before: `notes/03b-shots/d34-all-paragraphs-before.md`. Proof: `notes/03b-shots/d34-contact.png`, `d34-opening.png`. 26 pages (was 27).
- Rule candidate: R31 (with R26, R28, R30).
- Skill home: `lecture-voice` (Section 06) and `summary-edition` (Section 07).

### D35: Section 4 names the CSS rules everywhere

- Owner's words: see R32.
- Where: section 4, the example title, its lead, the Elements panel comparison, the closing explanation, and the "What to group tags with" tree.
- Change:
  - Example title: "(the row breaks!)" became "(the CSS rules break!)" (the owner's text).
  - Lead: "breaks the page's style" became "breaks the page's CSS rules".
  - Comparison lead: "yet the row breaks. With a Fragment, the row and the borders appear." became "yet the CSS rules break: the items lose the row and their borders. With a Fragment, the rules apply again."; the nesting sentence now ends "but not this one", and "then the Elements panel, then the code" became "the Elements panel, and the code".
  - Subtitle: "Why does a `<div>` break the row?" became "Why does a `<div>` break the CSS rules?"; its paragraph now ends the mechanism with "So both CSS rules miss the items." and joins the flex layout and the child selector in one sentence.
  - Tree label: "a <div> between a list or a flex row and its items | when a style targets direct children, it misses the items" became "a <div> between a list and its items | the CSS rules for direct children break".
- The R32 check on the other sections: the example titles of 1 ("it is an object!") and 5 ("the Console fills with errors!") name what their leads teach. 1B, 2, and 3 keep the owner's "(it fails!)" from D29; their subtitles name the cause ("The JSX transform that fails", "Why does an open tag stop the build?", "Why do two tags side by side stop the build?"). Section 4's heading still says "box"; that waits for the owner's answer on "box" or "element".
- Layout: the longer explanation pushed the tree onto its own page (27 pages); the trims above bring the explanation and the tree together on page 18, 26 pages.
- Proof: `notes/03b-shots/d35-section4-title.png`.
- Rule candidate: R32.
- Skill home: `summary-edition` (headings and figure labels) and `lecture-voice`.
