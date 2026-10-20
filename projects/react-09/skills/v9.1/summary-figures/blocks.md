# Summary Edition Blocks: Syntax Reference

The Markdown of `04-01-md-revised-3/<version>/NN.md` is plain Markdown, one line per paragraph, plus the blocks below. `src/build-revised-3.mjs` draws them; `src/revised-3/base.css` and the theme in `src/revised-3/themes/` style them. Which block to use for which idea is in `SKILL.md` beside this file. #2026_10_17_01_group_2

## Build

```bash
node src/build-revised-3.mjs 10                         # lecture 10 in every theme
node src/build-revised-3.mjs                            # every lecture in the newest version folder (v1, v2, ...)
node src/build-revised-3.mjs 10 --theme paper           # one theme only
node src/build-revised-3.mjs 10 --no-pdf                # html only
node src/build-revised-3.mjs 10 --version v1            # a given version folder
```

Run it from `projects/react-09`.

The default theme (`DEFAULT_THEME`, now `original`) writes `NN.html` and `NN.pdf`; every other theme writes `NN-<theme>.html` and `NN-<theme>.pdf` (`NN-paper.pdf`, `NN-original-margins.pdf`). The script prints the prose word count and the figure count, and fails (`[GATE FAILED]`) on an em-dash, a first line that is not `# Lecture NN: Title`, a second line that is not the interview question, or a numbered section without a `hierarchy` block, a `tree` block, or a principle box. It still writes the HTML and PDF before it fails, so a fresh PDF is not proof that the checks passed; read the end of the output. It also prints a `warning:` line, which does not fail the build, for each comment check of `summary-edition` Section 12B that a script can see (a `~` mark, a titled block of three lines or more or a principle card with no comment, a third commented line in a row, a comment in DO THIS or DO NOT DO THIS, more than 80 characters of code before a comment, 68 in a principle box) and for column code wider than its column. #2026_10_18_01_group_6

## Text

- Line 1: `# Lecture 10: Conditional Rendering in React`. Line 2: `> INTERVIEW QUESTION | ❱ CORE | How do you show, hide, or switch JSX based on a condition?`
- `# Title` after line 2 is a main title (`# React JSX Syntax`, `# Principles`); put `::: pagebreak` before it. #2026_10_18_01_group_1
- `## Example: ...`, `## The components behind the page`, and other plain `##` headings; `## N. Title` for a principle section (numbered badge, and the section checks), and `## 1B. Title` for a sub-section with its own principle. #2026_10_18_01_group_1
- An italic line right under a numbered heading, `*Why? Otherwise the JSX transform fails*`, is the section's key question, set as its subtitle. #2026_10_18_01_group_2
- `### Title` for the subtitles of a principle section: `### Example: let's ... (it fails!)`, `### Component Hierarchy`, `### Let's check ...`, `### Why ...?`. #2026_10_18_01_group_2
- `**bold**` for a term at its first explanation; `` `code` `` inline. A paragraph that is bold from end to end becomes the centred closing line, as under the Summary; use it there only.
- `::: pagebreak` on its own line starts a new page.
- `> [!FACT] One fact the next lines need.` A one-line note in a soft box labelled Fact.
- A paragraph that ends with a colon stays on the page of the block after it. New text does not use this: a figure stands on its own with its caption (`summary-edition` Section 14B). #2026_10_18_05_group_1

## Code

````
```jsx title="ArticleCard.jsx" good="2-4" bad="7" startLine="5"
...code...
```
````

- `title` draws the file tab; leave it out for a snippet with no file.
- `good` and `bad` tint lines green or red, by their place in the block, counted from 1 at the block's first line (`2-4`, `1,6`, `14-21`). `startLine` changes only the printed numbers: with `startLine="5"`, the printed line 11 is `bad="7"`.
- `right` or `wrong` as a flag (```` ```jsx right ````) gives the DO THIS or DO NOT DO THIS frame; put `**DO THIS:**` or `**DO NOT DO THIS:**` on the line before, and the two stay on one page.
- `role=PARENT`, `role=CHILD`, `role=GRANDCHILD` prints the component's place in the tree at the file tab's top right. #2026_10_18_01_group_4
- A comment is drawn as a balloon under its line, with no tail; `// **WRONG:** ...` or `{/* **PROBLEMATIC:** ... */}` gives it a red or amber chip before its text. Revision 3 has no `~token~` marks. #2026_10_18_01_group_6

## Principle box

````
> [!PRINCIPLE]
> **Principle 1: Show nothing: return null at the top**
>
> When a component has nothing to show for its props, it returns `null`. (the map's Rule, in short sentences, one paragraph each)
>
> *We should do this:*
>
> ```jsx
> ...
> ```
>
> *We should not do this:*
>
> ```jsx
> ...
> ```
````

A fact note placed directly before the box stays on the same page as the box. Each paragraph of the rule becomes its own line in the box. The box goes right after the section's "you are here" map.

## Page mockup

````
```page caption="..." size=mini
url: localhost:5173
heading: Latest Articles
section: City
card: title=New Park Opens Today | author=Mary Jones | text=... | label=New | foot=3 comments | good=label,foot
card: ghost | bad=card
line: No Sport articles yet. | good
empty: no cards
row: Ten easy summer recipes ; New park opens today
stack: Ten easy summer recipes ; New park opens today
form: Your email
blank
console: TypeError: Cannot read properties of null (reading 'title')
warn: ...
quiet: Console: no messages
```
````

- Card fields: `title`, `author` (printed with "By " in front) (`[Sign in]` draws a link), `label`, `foot`, `raw` (a bare value such as `0`), `input` (an empty comment box; `input=placeholder` for other text), `typed=Great news!`, `missing=author` (draws "author missing"), `lines=John Hall; Boston` (one paragraph broken into lines, as `<br />` breaks it), `img=caption`, and `ghost` (an empty card box, noted `<article class="card"> with empty tags`; `ghost=<section class="profile"> with empty tags` names another element). #2026_10_18_01_group_4
- `img=/john.jpg | alt=John Hall` draws a real photo: the file lives in the lesson folder's `public/` (`04-01-md-revised-3/v1/public/john.jpg`), as Vite serves its `public/` folder at `/`, and the build stops when the file is missing. A value without a leading `/` draws the older labelled bar. #2026_10_18_01_group_4
- `good=` and `bad=` mark fields by name (`label`, `foot`, `raw`, `missing`, `typed`, `input`, `card`, and so on).
- Lines in order: `heading`, `section`, `card`, `line` (with `| good` or `| bad`), `empty`, `row` and `stack` (list items in a row with borders, or stacked plain), `form`, `blank` (a blank page), `overlay: message` (an error box inside the page). `console` or `error`, `warn`, `log`, `quiet` add console lines under the page. Two `line` rows in a mini page sit side by side; for text on several lines, use `card: lines=...`. #2026_10_18_01_group_4
- `size=mini` draws a small window for a column.

## The mail app #2026_10_18_02_group_2

A webmail page in the manner of Gmail, inside the browser frame, for a lesson whose example is an inbox (`SKILL.md` Section 02C):

````
```mail caption="..." folder=Inbox count=2
toolbar: Delete selected
section: Inbox
email: Bob Smith | Invoice for March | 9:40 | checked unread good | still here
email: Sara Kim | Lunch on Friday? | | unread bad
line: No emails here. | good
raw: 0 | bad
empty: no rows
```
````

- Full size draws the top bar (menu, logo, Mail, the Search mail field), the folders (Compose, Inbox, Starred, Sent, Spam, with `folder=` highlighted and `count=` beside it), and the list in a white panel; `size=mini` draws the top bar and the list, and shows only the subject of each row.
- `toolbar:` draws the select-all box and, when given a label, a button with a bin (`toolbar: Delete selected`).
- `email:` is `From | Subject | time | flags | note`. Flags: `checked` (a blue tick and the row in Gmail's selection blue), `unread` (bold, on white), `good` and `bad` (a green or red ring). A note draws a small pill after the subject, red, or green on a `good` row. Leave the time empty when the data has none.
- `section:` a heading inside the list, as the code's `<h2>` draws it; `line:` a centred message (`| good` or `| bad`); `raw:` a bare value such as `0`; `empty:` an empty list.
- The app's colours are its own, the same in every theme.

## The shop #2026_10_18_10_group_1

An online shop's page in the manner of a large web store, inside the browser frame, for a lesson whose example is a cart (`SKILL.md` Section 02C). The dark top bar (the Shop logo, the search field, the cart icon) and the products come from components the lesson leaves out; the white cart panel is what the lesson's code draws, so it holds only the lines the code writes:

````
```shop caption="..." size=mini url=localhost:5173/old-cart.html
product: 🧦 | Wool socks | $9 | clicked bad
text: Items: 3 | good
input: Note to the shop | bad | empty again
typed: Gift wrap, please | good pointer
button: Buy 3 items | bad | old count
```
````

- Each line is `kind: text | flags | note`. `text:` a line of text (`<p>`); `input:` an empty text box with its placeholder; `typed:` a box with typed text, the focus ring, and the cursor; `button:` the cart's orange button. Flags: `good` and `bad` ring the element green or red; `pointer` puts the mouse pointer on a typed box. A note draws a small pill after the element, red, or green on a `good` element.
- `product: tile | name | price | flags | note` draws a product card on the left, with its tile (an emoji), its price, and its yellow Add to cart button; `clicked` rings the button and puts the pointer on it.
- `size=mini` drops the search field and narrows the panel, with the same type size. `url=` changes the address bar. The shop's colours are its own, the same in every theme.

## The story in pictures #2026_10_18_06_group_1

````
::: page tint=blue kicker="Example" title="How to delete the wrong email"
A short paragraph with the idea the story proves.

```twolists
left: The `emails` array of objects, in our code
{ id: 1, subject: '🔥 FLASH SALE: Extra 15% off' }
right: The list of DOM elements, on the page
🔥 FLASH SALE: Extra 15% off
note: Without a key, the two lists are connected only by their order.
```

::: comic layout=think
::: panel step=1 title="We tick “🔥 FLASH SALE: Extra 15% off”."
```mail table
toolbar: Delete selected
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | checked good pointer id:1
email: Anna Lee | Team meeting moved | | id:2
```

> [!THINK] OK, another spam mail. Let me tick it, so I can delete it.

Behind the scenes: one plain note in the lesson's terms.
:::
::: panel step=3 title="We click Delete selected." tone=bad
```mail table
toolbar: Delete selected | clicked
sent: sent to the server: `delete=4`
...
```
:::
:::
:::
````

- `::: page tint=blue` puts everything inside it on its own light blue pages (a named page, `@page tintblue`); a new page starts before it and after it. With `title=`, it opens with the story banner, the section's own kind of title: the gradient of the STEP pills, `kicker=` in a white pill ("Example"), the title in large white type, and an envelope with a red mark, the text centred on the icon. A `tagline=` is possible but not used: the owner kept the banner to the kicker and the title. #2026_10_18_08_group_1
- `::: comic layout=think` draws one band per `::: panel`: on the left, a card with the gradient STEP pill (`step=N`, printed as STEP 01), the title, and the blocks of the panel; on the right, each `> [!THINK]` as a handwritten thought bubble (Noteworthy), and each plain paragraph as a "Behind the scenes" note. `tone=bad` turns the pill and the card's top line red. A band never splits across pages; the comic may turn the page between bands. Without `layout=think`, `::: comic` draws panels two to a row, with `> [!SAY]` speech bubbles.
- `twolists`: `left:` and `right:` start each list with its title, one item per line, `note:` a bold line under both; a red ≠ sits between them.
- `mail table`: the mail app without folders, each row with its place on the page (Row 1, Row 2), the checkbox, the sender, the subject, and `id:N` as a grey chip. A `deleted` row is struck through, hatched, marked DELETED, and not counted as a row.
- New in every `mail`: `pointer` draws a mouse pointer on the row's checkbox (a note on that row becomes a balloon); `toolbar: Delete selected | clicked` rings the button and puts the pointer on it; `sent:` draws a pale strip with what the form sends.
- Emoji are drawn with Apple Color Emoji; Prince prints "not a TrueType or OpenType font" when it loads that font, and still draws the glyph.
- A file named with a letter (`11b.md`) is an experiment: the build makes it only when it is named (`node src/build-revised-3.mjs 11b`), never in a full build.

## The What is going on box #2026_10_18_02_group_1

````
> [!AHA] What is going on
> 1. **The `emails` array and the DOM elements on the page are two different lists.** The `emails` array is a variable in our JavaScript code: an array of objects. The DOM elements are what the browser shows on the page.
> 2. **React builds the DOM elements on the page from the `emails` array.** ...
> 9. **Oops: we press Delete selected.** The form sends `4`.
>
> **The `emails` array and the DOM elements on the page must match one by one. Without a key, React matches them by position, and the tick stays in the wrong DOM element.**
````

A lamp and the title (`What is going on` when none is given), the steps as a numbered list with round numbers, the step that opens with `**Oops` drawn in red, and a paragraph that is bold from end to end drawn as the closing line. The box stays on one page. Its content follows `summary-edition` Section 07C.

## Developer tools

````
```dom title="Elements panel: the rain card"
<article class="card">
*  <span class="new-label" hidden="">New</span>
  <h2>Rain Expected This Weekend</h2>
```
````

A line starting with `!` is marked red, `+` green, `*` blue (look here), `-` struck through. The mark takes the line's first column, so a marked line keeps its indent by starting with the mark in place of one space.

Chrome's Console, with its tabs, its filter bar, and its prompt: #2026_10_18_01_group_4

````
```devconsole source="Greeting.jsx:3" caption="..."
v {type: 'p', props: {…}}
  type: "p" | The tag's name, kept as text
  v props: {children: 'Hello, John Hall'}
    children: "Hello, John Hall" | The tag's content
```
````

Each line is one row, two spaces of indent per level. `v ` opens a triangle, `> ` draws it closed, and ` | note` adds a note on the right. A row that starts with `x ` is an error row, such as Chrome's "Invalid DOM property" messages, and a row that starts with `= ` is a dim line, such as "No messages". `source=` prints the file and line on the first row. The older `console` block (`warn:`, `error:`, `log:`, `quiet:` lines) draws a plain panel; new lessons use `devconsole`. #2026_10_18_01_group_4

Vite's error overlay, in the theme's colours (dark in `original`, light in `paper`): #2026_10_18_01_group_5

````
```overlay size=mini
message: [PARSE_ERROR] Expected corresponding JSX closing tag for 'img'.
help: Did you want a JSX fragment <>...</>?
file: src/App.jsx:4:8
 4 │ <img src="/library.jpg" alt="The city library">
   │  ─┬─
   │   ╰─── Opened here
```
````

## Rows of columns

```
::: row caption="Three versions of ArticleCard, with article set to null. Compare the three pages."
::: col title="`article.title`" tone=bad
...any blocks...
A note that opens with the condition.
:::
::: col title="`if (!article) return null`" tag="React" tone=good
...
:::
:::
```

`tone=good` adds a check mark and a green top, `tone=bad` a cross and a red top, `tone=plain` a grey top; no tone draws a bare column. `tag` adds a small label on the right of the title. `::: row arrows` draws arrows between the columns, for before and after. `::: row flow=down` (an experiment in `11-gemini.md`) reads each column from the code down: the code first, on frames of one height across the columns, then a thick arrow in the grey of the browser's top bar that stems from the code's bottom edge, then the browser and the Console, each lined up across the columns, and the note last. The order of the blocks inside a column does not matter; the build sorts them. Say so in the caption: "The code on top, and under each, the page it gives."

## Trees

````
```tree caption="The second division: what the choice covers, then how many outcomes it has."
Leave it out: conditional rendering
- The whole component | decided at the top of the function
  - Nothing | the card, or nothing: `return null`
- A piece inside the JSX | the piece sits in the JSX; the choice is made in its braces, or above the `return`
  - One or nothing | `&&`
```
````

The first line is the root; each `- label | note` line is a node, two spaces of indent per level. `here="One or nothing"` fills that node and outlines the path to it; `size=mini` draws it small, for a "you are here" map. `dir=right` grows the tree to the right for a decision: the root on the left, one line per branch, the note after `|` shown after an arrow as the result; a leading `+` or `!` on a branch marks it right or wrong. A decision tree draws one level of branches (deeper lines are dropped); its branch labels and the code in its results never wrap, so keep both short.

````
```tree dir=right
What stands left of &&?
- +a `true` or `false` value | the piece when true, nothing when false
- !a number, such as `article.commentCount` | when it is `0`, as on the rain card, `0` itself appears on the page
```
````

## Component hierarchy

````
```hierarchy layout=stack caption="..."
App | holds: `featured` (`null` today) and `isSignedIn`
  ArticleCard | gets: `article` (the featured one), `isSignedIn`
  ArticleList | gets: `isSignedIn` | holds: two articles
    ArticleCard | gets: `article`, `isSignedIn` | here
notes:
`App` is the whole page. ...
We want: no featured card, and the rest of the page still there.
```
````

Each line is `Name | holds: ... | gets: ... | here: what it chooses`, two spaces of indent per level; `here: chooses which cards to draw` marks the component where the choice is made and names the choice (plain `here` prints "the choice is made here", which a chart alone cannot decode, so name the choice). After the line `notes:`, one sentence per line; a sentence that starts with "We want" is set in bold. `layout=stack` puts the sentences under the tree.

Each box gets a tab with its place in the tree: PARENT for the root, then CHILD and GRANDCHILD; `| role: GRANDPARENT` names another place. #2026_10_18_01_group_4

An experiment in `11-gemini.md` puts the page we build on top of the tree, in the same box:

````
```hierarchy
page: folders=none
box: EmailList | form
rows: EmailRow | div.row
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
end
tree:
EmailList | holds: `emails`, three objects, imported | here: draws one row per email
  EmailRow | gets: one `email`
notes:
The PARENT (`EmailList`) imports the `emails` array and maps each item to an `<EmailRow />` component.
The CHILD (`EmailRow`) receives one `email` object and renders a row with its checkbox, sender, and subject.

Point of failure: the arrow in `emails.map(email => {` opens curly braces with no `return`, so every call gives back `undefined` and the page shows no rows.
```
````

The lines between `page:` and `tree:` are `mail` lines (`folders=none` drops the folders). `box: Name | element` frames the lines up to its `end`, and `rows: Name | element` frames every email row of the box it sits in. Each frame carries the component's name and its root element at its top right, as Chrome's inspector labels a selected element (`EmailRow div.row`), in the colour of that component's tab in the tree below: blue for the PARENT, purple for the CHILD, orange for the GRANDCHILD. `page: title="..."` renames the small heading over the page, The page we build. The last line, after an empty line, starts with `Point of failure:` and says what the example breaks; it stands under the numbered notes with its label in red. The same experiment announces each worked example with the heading `### Example for Principle N: ...`, set larger, with the hierarchy right under it.

## Chains, stages, the ladder, tables

````
```chain caption="..."
IF the article is new -> THEN show the New label
!`article.title` -> throws a `TypeError` -> nothing catches the error, so React blanks the whole page
+`if (!article) return null` -> no line reads `article` -> `null` builds nothing, the page stays
```
````

One row per line, boxes joined by `->`; a leading `!` or `+` marks the row wrong or right.

````
```stages caption="One tag on its way to the page."
We write | App.jsx | <h2 className="title">City Library Extends Its Hours</h2>
The build writes a call | Sources panel | _jsxDEV("h2", { className: "title", children: "City Library..." })
```
````

````
```ladder anchor="JSX looks like HTML, but it is JavaScript: each tag becomes a call that builds an object."
group: Items become elements
Every item | map() | One card per article | a b c > A B C
```
````

A ladder line is `size | tool | example | glyphs`; `group:` starts a group. Glyph tokens: `_` an empty box, `#` a filled box, `A` to `Z` a filled box with that letter, `a` to `z` a data item, `A:1` a box with key 1, `or` and `>` connectors. Prefer a `tree` for a division; the ladder suits an axis that is a sequence.

In a table, a first cell starting with `!` marks the row red, and one starting with `+` draws it as a dark pill.

## Page flow, done by the build

- A numbered section's opening (heading, key question, "you are here" map, fact notes, principle box) stays on one page. #2026_10_18_01_group_2
- A fact note and the principle box after it stay on one page; so do `**DO THIS:**` and its code.
- A paragraph ending with a colon stays with the next block (kept for older lessons; new text ends every paragraph with a full stop); list items are not split. #2026_10_18_05_group_1
- Figures with a caption are numbered per lecture ("Figure 10.3"); `base.css` hides the numbers in every theme, and a theme that wants them shows them with `.fig-num { display: inline; }`.
