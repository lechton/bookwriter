---
name: summary-figures
description: The figures of the revision 3 summary edition: which block draws which shape of idea, the chart test every chart passes, the standards every figure meets (its condition, its reading instruction, its real values, the browser first in a comparison, real photos, bare page elements, the Console as Chrome draws it), the browser drawn as the app the example is about (the mail app), the What is going on box, the component hierarchy panel with its PARENT and CHILD labels, division and decision trees, the two themes (original and paper) and the process for any new design, and the page-flow rules. The block syntax lives in blocks.md beside this file.
---

# Summary Figures

This skill governs the figures of the summary edition (`summary-edition`). A figure is chosen for the shape of the idea it shows, carries the condition its result depends on, and tells the reader what to look at. The syntax of every block is in `blocks.md`; the build that draws them is `src/build-revised-3.mjs`, with its styles in `src/revised-3/`. #2026_10_17_01_group_2

## Choosing the Block | 01 | The Shape of the Idea Picks the Figure #2026_10_17_01_group_2

| the idea | block | Lecture 10 uses it for |
| --- | --- | --- |
| a division into kinds or cases | `tree` (downward) | the two divisions; the "you are here" maps; the Summary |
| a decision with branches | `tree dir=right` | "Nothing to show: who decides?"; "What stands left of &&?" |
| components and their data | `hierarchy` | the Component Hierarchy of every section; the components at the end #2026_10_18_01_group_4 |
| the page beside the code that makes it | `::: row` of two `::: col`: the page, and the files, the parent's above the child's | Lecture 3's greeting beside `App.jsx` and `Greeting.jsx` #2026_10_18_01_group_4 |
| a sequence of stages | `stages`, or `ladder` for an axis that is a path | Lecture 3's tag on its way to the page |
| the same situation, two or more choices | `::: row` of `::: col` | hide it or leave it out; the three null versions |
| before and after an action | `::: row arrows` | Lecture 11's typed comment before and after the save |
| a story of several actions, where what breaks is the point | `::: comic layout=think`, one band per step, on its own tinted page (Section 02D) | Lecture 11: how to delete the wrong email #2026_10_18_06_group_1 |
| the same items in two places, in our code and on the page | `twolists`, the two lists with a ≠ between them | Lecture 11: the `emails` array of objects and the list of DOM elements #2026_10_18_06_group_1 |
| cause and effect, rules, a mapping | `chain` | the IF ... THEN rules; why each version gives its page; one wording per count |
| each case of a value traced to the page | a table, with `!` on the row that fails | what `&&` gives back, card by card |
| what the user sees | `page` | the home page; the bare 0 on the rain card |
| what the user sees, when the example is an app the reader uses every day | the app's own block: `mail` for an inbox (Section 02C) | Lecture 11's inbox, its ticks, and its Delete selected button #2026_10_18_02_group_2 |
| an invisible cause, built from its most basic fact | `> [!AHA]`, the What is going on box (`summary-edition` Section 07C) | Lecture 11: two lists, two orders, and the tick that stays behind #2026_10_18_02_group_1 |
| what the developer sees | `dom`, `devconsole`, `overlay` | the span still in the DOM; the logged object, opened with its triangles; the parse error #2026_10_18_01_group_4 |
| what the next lines need to know | `> [!FACT]` | `!` on any value; the falsy values; the comparison operators |

- [ ] Is each figure the block for its idea's shape (`summary-edition` Section 06)? #2026_10_17_01_group_2
- [ ] Does each figure make one point, so the reader knows what it proves? #2026_10_17_01_group_2

PROPER EXAMPLE: Lecture 10's second division as a two-level `tree`: "Leave it out: conditional rendering" over "The whole component" and "A piece inside the JSX", with the four tools under them. #2026_10_17_01_group_2

COUNTER-EXAMPLE: the same four tools as a `ladder`, a row of numbered steps joined by arrows. Note: arrows say "first this, then that", but the four tools are not steps of one process; they are kinds of one choice. The row hid the division (`summary-edition` examples.md Case 3). #2026_10_17_01_group_2

## Figure Standards | 02 | What Every Figure Carries #2026_10_17_01_group_2

- [ ] Does the caption or the sentence before the figure name the case the figure shows? #2026_10_17_01_group_2
- [ ] Does it say what to look at ("Compare the three pages", "Look at the rain card")? #2026_10_17_01_group_2
- [ ] Are the panels of a row headed by the one thing that differs between them, usually the whole line of code, with no `...` standing in for it (`summary-edition` Section 11B)? #2026_10_17_01_group_2 revised by #2026_10_17_02_group_4
- [ ] Does each panel's note open with the condition the row shares? #2026_10_17_01_group_2
- [ ] Is a page mockup reduced to what the point needs, and does the caption say so when it shows part of a list ("the first three cards after the save")? #2026_10_17_01_group_2
- [ ] Are the values and DOM lines the ones verified for the lesson's own example (`summary-edition` Section 03B), the error texts word for word as React or the browser prints them, and the titles, names, and counts the same everywhere? #2026_10_17_01_group_2 revised by #2026_10_17_06_group_1
- [ ] Do marks point at what matters, with a caption that says what they mean: green for a part that rightly appears, red for the defect, blue for "look here" in the Elements panel? A mark goes only on the parts the reader must compare or find, usually one or two, and in a row of pictures on the part that differs between them; a mark on every part marks nothing. In a story of steps (Section 02D), each step marks its own action. #2026_10_17_01_group_2 revised by #2026_10_17_05_group_2 and #2026_10_18_06_group_1
- [ ] Do Vite's error overlay and the developer tools show what the reader will meet: the overlay's message, file, and code frame, and the Console's rows as Chrome draws them, with triangles and no line numbers, never as code? Their colours follow the theme (Section 05). #2026_10_17_01_group_2 revised by #2026_10_18_01_group_4
- [ ] In a comparison, does each column show the browser on top and the code that made it under it, so the reader compares the results first and then reads the one line that differs? #2026_10_18_01_group_4
- [ ] When a section shows the page its code draws, does the page stand beside the components that make it, its text readable at a glance? #2026_10_18_01_group_4
- [ ] Where the code has an `<img>`, does the page show a real photo, kept in the lesson folder's `public/` as Vite keeps it, rather than a bar with a label? #2026_10_18_01_group_4
- [ ] Does the page show its elements bare, as the code and its CSS draw them, with a border only where the code or its CSS puts one (a list item's border, a form's input field)? An app drawn in its own look (Section 02C) is that app's CSS, not a frame of ours. #2026_10_18_01_group_4 revised by #2026_10_18_02_group_2

The owner's words for these four: "on top you have the browser, visual comparison, in the bottom of each browser show the code"; "left: The page (as it is), show the browser but with the font increased to make it more visible"; "we need to be able to visually present the image as image in the browser, in a professional way"; and "we have visual border overload, remove the borders from the elements in the page". On the Console: "it is not an actual code. Please adapt it to look cool console log, but in bright theme". #2026_10_18_01_group_4

PROPER EXAMPLE (Lecture 3 rewritten, section 3): the column "Two tags side by side" shows the error overlay, then the code under it; the column "One `<section>` around both" shows the page, then the code. COUNTER-EXAMPLE (the same section, before): each column showed the code first and the overlay or the page under it. Note: the reader read code before knowing which result to look for. #2026_10_18_01_group_4

PROPER EXAMPLE (Lecture 3 rewritten, section 1): the logged object as Chrome's Console shows it, `v {type: 'p', props: {…}}` with its triangles opened, a note beside `type: "p"`, "The tag's name, kept as text", and `Greeting.jsx:3` on the right. COUNTER-EXAMPLE (the first draft): the same object in a code editor with line numbers and a file tab, "Console panel: console.log(note)". #2026_10_18_01_group_4

PROPER EXAMPLE: caption "Three versions of ArticleCard, with article set to null. The featured card would sit right under the site heading."; panels titled `article.title`, `article?.title`, `if (!article) return null`; the first note "With `article` set to `null`, reading `article.title` throws, and the whole page is blank." #2026_10_17_01_group_2

COUNTER-EXAMPLE: caption "Three versions of ArticleCard."; first note "The whole page is blank." Note: each panel read alone is false; the reader has to supply the `null` from memory. #2026_10_17_01_group_2

PROPER EXAMPLE (Lecture 10's opening): two cards, and green rings only on the park card's "New" label and "3 comments", the two parts the rain card lacks; the caption "Outlined in green: the two parts that only the park card shows." #2026_10_17_05_group_2

COUNTER-EXAMPLE (Lecture 1, first draft): `good=title,text,input` on the header's only card, ringing the greeting, the account line, and the search box, under the caption "the two places that display the signed-in reader's name, and the search box". Note: every part of the card is ringed, so the picture reads as a form with heavy borders and the two names do not stand out; the search box matters only in section 3. The fix rings the two names. In section 3's row, both pictures show the new name, so only the search box, the part that differs, carries a ring. #2026_10_17_05_group_2

## The App Fits the Story | 02C | The Browser Shows the App the Example Is About #2026_10_18_02_group_2

When the example is a kind of app the reader uses every day, an inbox, a shop, a chat, the browser draws that app as the reader knows it. Recognition is then instant: the reader sees an inbox before reading a word, knows what a tick and a Delete button do, and feels the stake when the wrong email is ticked. A page of generic white cards asks the reader to imagine the app; the app's own look shows it. The owner: "make a design figure that looks seductively like a gmail server (the browser app must fits ideally the theme, another rule)". (`summary-edition` examples.md Case 27) #2026_10_18_02_group_2

The part the lesson's code draws matches the code exactly: in Lecture 11, the tick box, the sender, the subject, and the Delete selected button. The app's frame, its top bar with the search field and its folders with Compose, can stand around that part on a full-size page, and the caption says it comes from components left out. Inside a row, nothing appears that the code does not draw: no star and no time when the data has neither. A kind of app the build cannot draw yet gets its own block, designed as a theme experiment is (Section 05): shown to the owner on one page before it carries a lesson. #2026_10_18_02_group_2

- [ ] When the example is an app the reader knows, does the browser draw that app in its own recognisable look, rather than generic cards (`mail` for an inbox, `blocks.md`)? #2026_10_18_02_group_2
- [ ] Does the part the code draws match the code, row by row, with nothing inside it that the code does not draw? #2026_10_18_02_group_2
- [ ] When the app's frame (top bar, folders) stands around that part, does the caption say it comes from components left out? #2026_10_18_02_group_2
- [ ] Is the stake drawn where the eye lands: the wrong tick ringed in red with a short note ("never read"), the result of the next action shown in its own picture ("still here")? #2026_10_18_02_group_2

PROPER EXAMPLE (Lecture 11, section 3): three small mail windows joined by arrows, "1. We tick the invoice", "2. A new email arrives at the top", "3. We press Delete selected": the tick in blue on "Invoice for March"; then the tick on "Lunch on Friday?", ringed in red with the note "never read"; then the invoice ringed in red with the note "still here". The reader sees the wrong email deleted before reading the explanation. #2026_10_18_02_group_2

COUNTER-EXAMPLE (Lecture 11, the articles version): white cards on a plain page under "Latest Articles", each with a title, an author, and an empty comment box; before and after the save, "Great news!" sat in the second box, and only the title above it changed. Note: nothing told the eye what site this was or why a card had a comment box, and the defect, a text under another title, cost the reader nothing they could see. #2026_10_18_02_group_2

## A Story in Pictures | 02D | Each Step Shows What Was Done, What Changed, and What Is Gone #2026_10_18_06_group_1

A story page stands in for a video. It shows how the browser's UI behaves over time while a user acts on it, ticking, clicking, typing, when that behaviour is what the lesson must demonstrate and a still picture cannot show it. The developer's work, editing code, saving a file, reading a build error or a Console message, is not a story: one picture, or a comparison, shows it. The owner, on a proposed story of a developer wrapping list items in a `<div>`: "NO! Stories should be browser-oriented, on how the browser behaves when such behaviour is pertinent to be demonstrated in a text (instead of a video). This story is replacement for video presentation of a browser UI behaviour." #2026_10_18_09_group_1

When such a behaviour goes wrong over several actions, a row of small end states leaves the reader to rebuild the story between them. The owner, on the first version of Lecture 11's three inboxes: "it is not clear what was clicked, what was deleted, what stayed behind. It is minimalist and cryptic." So the story is told in numbered steps, and each step carries everything the reader needs to see it happen. (`summary-edition` examples.md Case 31) #2026_10_18_06_group_1

The form is the think-aloud page (`::: page tint=blue` around `::: comic layout=think`): the story sits on its own light blue page, so it reads as one scene apart from the lesson. It opens with the idea it proves, as a short paragraph and, when the idea is two things the reader confuses, the two drawn side by side (`twolists`). Then one band per step: on the left, a card with its STEP label, what we do in plain words, and the browser; on the right, the user thinking out loud in a handwritten hand (`> [!THINK]`), in the first person and as briefly as the moment ("Delete."), with a plain note under it, "Behind the scenes: ...", that says what really happened in the lesson's terms. The owner shaped it: "on the left show each step in the browser, on the right utilize the space to show the user explaining what is done, in clear words, in italics, maybe in handwritten form, the way one person thinks out loud." #2026_10_18_06_group_1

- [ ] Is the story a browser UI behaviour over time, the user's actions on the page and the page's answers, that a video would otherwise show? A sequence of the developer's edits is not a story. #2026_10_18_09_group_1
- [ ] Does each step ring its own action, never the result of the step before (step 1: the ticked row; step 3: the clicked button, not the row that changed in step 2)? The owner: "the whole purpose is to show what movement is made, the actual movement of delete is not underlined here." #2026_10_18_06_group_1
- [ ] Is the action drawn on the picture: a pointer on the checkbox that is ticked (`pointer`), on the button that is clicked (`toolbar: ... | clicked`)? #2026_10_18_06_group_1
- [ ] Is a step that the eye cannot see drawn as a strip, such as what the form sends to the server (`sent:`)? #2026_10_18_06_group_1
- [ ] Is what disappeared drawn, not left as an absence: the deleted row struck through and hatched in its old place, marked DELETED (`deleted`)? #2026_10_18_06_group_1
- [ ] When the mechanism is a match between two lists, does the picture show both sides: each row's place on the page (Row 1, Row 2) and the id of the object it shows (`mail table`, `id:N`)? #2026_10_18_06_group_1
- [ ] Does each thought sound like a person at that moment, and each "Behind the scenes" note state the cause in the lesson's own repeated terms (`summary-edition` Section 07C)? #2026_10_18_06_group_1
- [ ] Does the story pass the story test: with every sentence covered, can someone say what was clicked, what was deleted, and what stayed behind? #2026_10_18_06_group_1

PROPER EXAMPLE (Lecture 11, section 3): the blue page opens with its banner, the kicker "Example" and the title "How to delete the wrong email" in large white type on the gradient of the STEP pills, centred on the envelope icon, then "Our inbox shows the same emails in two places. [...] These are two different lists." and the `emails` array of objects ≠ the list of DOM elements. STEP 01: the pointer ticks "🔥 FLASH SALE: Extra 15% off" in Row 1, `id: 1`, ringed in green; the thought "OK, another spam mail. Let me tick “🔥 FLASH SALE: Extra 15% off”, so I can delete it." STEP 02: "Lunch on Friday?" in Row 1, `id: 4`, ticked and ringed in red. STEP 03: the pointer on Delete selected, ringed in red, and the strip "sent to the server: `delete=4`"; the thought "Delete." STEP 04: the lunch email struck through and marked DELETED, the spam mail back in Row 1, ringed in red; the thought "And the spam mail I wanted to delete is still here!" #2026_10_18_06_group_1

COUNTER-EXAMPLE (scope, Lecture 3, proposed and refused): "How to break the design without a single error", four steps of a developer moving two list items into a component, wrapping them in a `<div>`, saving, and finding the row collapsed. Note: every action is an edit of code, and the result is one still state of the page; the comparison of the two Elements panels, already in Lecture 3, shows it whole. #2026_10_18_09_group_1

COUNTER-EXAMPLE (Lecture 11, before): three small inboxes joined by arrows, titled "1. We tick the invoice", "2. A new email arrives at the top", "3. We press Delete selected", with notes "never read" and "still here" and no sentence under any of them. Note: the click was not shown, the deleted email was an absence the reader had to find by comparing two pictures, "still here" read as good news inside a red ring, and the form's message happened between the pictures. #2026_10_18_06_group_1

The design went through three looks before this one held, and each taught something: the neobrutalist comic (thick black frames, hard shadows, tilted badges) was "too loud"; the quiet comic kept its structure; the think-aloud page, with the owner's card design (a gradient STEP pill, the table with Row and id), was called "spectacular". A new kind of story picture is shown on one page first, as any change of look is (Section 05). The story page carries the example's catchy title in a banner of its own, never a generic subtitle and never one more `###` heading (`summary-edition` Section 07B). #2026_10_18_06_group_1 revised by #2026_10_18_07_group_1 and #2026_10_18_08_group_1

## The Chart Test | 02B | Understood From the Chart Alone #2026_10_17_02_group_1

The eye takes in a chart before it reads the text around it. A chart passes when someone who reads only the chart can say what each box means and why it is joined to its neighbour. The owner's words for the failure: "If a chart says this is up, this is left, this is right: up to what? left to what? right to what? The eye browses on things around and cannot see keywords, needs to read the text, feels confusion." #2026_10_17_02_group_1

- [ ] Is each box a complete short phrase built from things the reader can see or check: code, a value, what the page shows ("Give each card a key from its article's id", "`key={article.id}`", "React compares the new description with the last one"), never a coined noun ("One name each")? #2026_10_17_02_group_1 revised by #2026_10_17_05_group_1
- [ ] Is each box worded by who acts in it (`summary-edition` Section 06B): a command only for what the developer writes or chooses, and what React, the browser, or the code does named as a thing or said with its actor as the subject? #2026_10_17_05_group_1
- [ ] Does the root say in full what the chart is about: a question ("What gives back one element per item?"), a task the developer carries out ("Render one card per article"), or a topic ("The path of one value on the page")? #2026_10_17_02_group_1 revised by #2026_10_17_05_group_1
- [ ] Does every connection have one meaning the chart makes clear: an arrow reads "gives" or "leads to"; a branch reads "divides into"? #2026_10_17_02_group_1
- [ ] Does every word in the chart point to something on the page or in the code next to it, so a chart that says "topic section" stands beside a picture that shows one? #2026_10_17_02_group_1
- [ ] Do the keywords stand out, code in code font and the key term in bold, so the eye finds them without reading every word? #2026_10_17_02_group_1
- [ ] Does the chart still make sense with the text around it covered? Try it before the build. #2026_10_17_02_group_1
- [ ] Do sibling boxes mirror each other, the same grammar and the same kind of words, so the eye reads the difference at once ("Create the cards" and "Update the cards when the list changes"; "Key from the article's id" and "Key on the tag `map()` returns")? #2026_10_17_03_group_1
- [ ] Does a division name what truly differs between its branches, in the most accurate words that stay easy to read? Lecture 11's two pairs of steps differ as creating the cards and updating them when the list changes, not as "making" and "keeping". #2026_10_17_03_group_1
- [ ] When a tree marks branches right and wrong, does each branch state its whole claim, so the mark and the words agree on their own ("✓ key on the tag `map()` returns", "✗ key inside the child"), rather than a bare noun ("✗ inside the child")? #2026_10_17_03_group_1

COUNTER-EXAMPLE (Lecture 11, second draft): leaves "Key each card by its article's id" and "Put the key on the tag `map()` returns" under "Keep each card with its article", beside "Make the cards". Note: the two key leaves have different grammar and the division hides what differs. The owner: "These titles are so confusing ... Maybe some maximum symmetry could help ... the division is not between make the cards and keep each card with its article, but creation of cards and update of cards." #2026_10_17_03_group_1

PROPER EXAMPLE (Lecture 11, accepted): "Create the cards" over "Cards for every article: `map()`" and "Cards for only some articles: `filter()`, then `map()`"; "Update the cards when the list changes" over "Key from the article's id: not from its position" and "Key on the tag `map()` returns: not inside the card". #2026_10_17_03_group_1


PROPER EXAMPLES (Lecture 11, both praised by the owner as "excellent examples"): the chain "`articles.forEach(...)` → `undefined` → nothing to place: no cards" / "`articles.map(article => { <ArticleCard />; })` → `[undefined, undefined, undefined]` → no cards" / "`articles.map(article => <ArticleCard />)` → `[<ArticleCard>, <ArticleCard>, <ArticleCard>]` → three cards", where each row is code, what it gives back, and what the page shows; and the decision tree "What gives back one element per item?", whose branches are code forms and whose results say what the page shows. #2026_10_17_02_group_1

PROPER EXAMPLE (the owner's rewrite of a division): "Render one card per item" dividing into "fixed: written by hand" and "dynamic: from an **array** of data". #2026_10_17_02_group_1

COUNTER-EXAMPLE (Lecture 11, first draft): "Rendering a list" dividing into "Items become elements" and "Elements get names", with leaves "Every item", "Only some items", "One name each", "The name's place". Note: the leaves are the map's spoken thread labels; read alone, "One name each" and "The name's place" mean nothing. The owner: "this means what? ... We need an oracle to decode this one." #2026_10_17_02_group_1

## The Hierarchy Panel | 03 | Components, Their Data, and What We Want #2026_10_17_01_group_2

The panel has two parts: on the left, the tree of the components involved; on the right, or below for a large tree, numbered sentences on their relationship. The owner asked for exactly this: "on the left it will have component hierarchy, presenting only few components each time, not the whole app, only the functional part, and the right part to explain the logic of the connection of these components for the reader to understand what is at stake." #2026_10_17_01_group_2

- [ ] Does the tree show only the components the point involves, each with what it holds and what it receives? #2026_10_17_01_group_2
- [ ] Is the component where the choice is made marked `here`, so it is drawn in white and labelled "the choice is made here"? #2026_10_17_01_group_2
- [ ] Do the sentences say who owns the data, who passes what to whom, and what each component does with it? #2026_10_17_01_group_2
- [ ] Do they end on the goal, "We want: ...", with its condition? #2026_10_17_01_group_2
- [ ] Does a tree of four or more components use `layout=stack`, so the tree takes the full width and the sentences sit below it? #2026_10_17_01_group_2
- [ ] Does each component box carry its place in the tree on a tab above its top left, PARENT, CHILD, GRANDCHILD, counted from the panel's root? #2026_10_18_01_group_4
- [ ] Does each code file of the section carry the same word at its top right (`role=PARENT`, `role=CHILD`), with the parent's file above the child's, so the files and the boxes name each component's place in the same words? #2026_10_18_01_group_4

The owner, on the files: "add the labels PARENT and CHILD accordingly (rule: labels PARENT, CHILD or GRANDCHILD or GRANDPARENT etc) [...] And reverse the order of the two code blocks, first the PARENT then the CHILD"; and on the boxes: "In the top left of each box, above the box, write with same font PARENT and CHILD in a label [...] this label will protrude from the internal box". PROPER EXAMPLE (Lecture 3 rewritten, section 1): `App.jsx`, labelled PARENT, above `Greeting.jsx`, labelled CHILD; below them, `<App />` with a PARENT tab and `<Greeting />` with a CHILD tab. #2026_10_18_01_group_4

The approved design of the `original` theme, in `src/revised-3/base.css` (`--hier-a`, `--hier-b`, `--hier-key`), is the result of two rounds with the owner; the `paper` theme draws the panel as one block (Section 05): #2026_10_17_01_group_2 revised by #2026_10_18_01_group_5

- one light blue box (`#eaf3fb`) holds all the components;
- each component is a box in a mid blue (`#9cc3e6`), light enough that its near-black text (`#111111`) reads at about 10:1;
- the labels "receives" and "holds" are dark navy (`#0d3559`); code names sit on near-white chips;
- the connecting lines are the component blue, 3pt thick;
- the component where the choice is made is white, ringed in the component blue;
- the relationship sentences sit on the page's soft grey, beside or below the blue box.

COUNTER-EXAMPLE: the first version reversed the shades: a dark teal box (`#24566a`) with light boxes inside. The owner: "please reverse the darkness of colours of background and front ... a light blue for background and darker blue for the box, but make sure the blue in the component box is not too dark so that we can read the black letters." #2026_10_17_01_group_2

## Trees | 04 | Divisions, Maps, and Decisions #2026_10_17_01_group_2

- [ ] Does the downward tree name each node with a short phrase that passes the chart test (Section 02B) and, where it helps, a note with its condition or its tool ("One piece, or nothing | `&&`")? #2026_10_17_01_group_2 revised by #2026_10_17_02_group_1
- [ ] Do the "you are here" maps reuse the labels of the lecture's full map exactly, root included, drawn `size=mini` with `here=`? #2026_10_17_01_group_2
- [ ] Does a decision tree (`dir=right`) put the question at the root, one branch per answer with its condition, and the result after the arrow, marked `+` or `!` when one branch is right and one wrong? #2026_10_17_01_group_2
- [ ] Is every label and note short enough to fit its box at print size? #2026_10_17_01_group_2
- [ ] Does each box have at most five boxes directly under it? A sixth idea goes one level down, under the box it belongs to: Lecture 3's tree of five rules took its casing rule as "A capital letter: our component", under "Each tag becomes a call". The owner: "we cannot have more than 5 boxes directly in diagram under one box". #2026_10_18_01_group_4

The two kinds of tree wrap differently. In a downward tree, a note wraps, and code inside it wraps at its spaces, so a long note grows taller. In a decision tree, the branch labels and the code in a result never wrap, the root box is capped in width, and only one level of branches is drawn (deeper lines are dropped). So a decision tree needs short branch labels, and a condition too long for its branch belongs in the text, with the tree keeping the short form. #2026_10_17_01_group_2

PROPER EXAMPLE: every mini map of Lecture 10 starts at "Leave it out: conditional rendering", the root of the full tree, so the highlighted path is the path the reader saw whole. #2026_10_17_01_group_2

COUNTER-EXAMPLE: mini maps rooted at "Conditional rendering" under a full tree rooted at "Leave it out: conditional rendering". Note: a small mismatch, but the reader compares the two trees and wonders whether they are the same. #2026_10_17_01_group_2

## Visual Design | 05 | Two Themes, and How to Change the Look #2026_10_17_01_group_3 revised by #2026_10_18_01_group_5

The look of revision 3 is the owner's decision. It comes in two themes, which differ only in their look: the lesson is the same Markdown in both, and the build writes both. #2026_10_17_01_group_3 revised by #2026_10_18_01_group_5

**`original`**, the house style, written as `NN.pdf`: Avenir Next text, dark code windows with a file tab, green principle boxes, the light blue hierarchy panels, and generous padding inside every box; its variant `original-margins` has side margins of 22 mm instead of 17 mm. The house style keeps a few marks that the standards below would not choose for a new palette, and they stay because the owner chose them: the 4pt green and red bars on DO THIS and DO NOT DO THIS code, the bar on the interview question, the coloured tops of figure columns, and captions in a dark grey (`#5d6773`, about 5.7:1). The blocks added later (the Console as Chrome draws it, the PARENT and CHILD labels, the key question under a heading, the photos) take the original's own colours. #2026_10_17_01_group_3 revised by #2026_10_18_01_group_5

**`paper`**, written as `NN-paper.pdf`: the light look the owner shaped on the rewrite of Lecture 3, page by page. #2026_10_18_01_group_5

- A section title stands on space, with no rule line above it and room below it. The owner: "Remove the line border on top and give more breathing space in the bottom of the principle title". #2026_10_18_01_group_5
- Each colour carries one meaning: blue for components, green for right, red for wrong. Fact notes and principle boxes share a neutral grey, and a box's frame and label take the box's own grey. The owner: "change the bg colour of facts into gray-ish colour, not to be confused with the blue colour of components. Use same gray-ish colour for principles box bg", and "the principle box has green border around, remove it". #2026_10_18_01_group_5
- The hierarchy panel is one block: the tree and its sentences on one background, the component blue, with the same round corners and no gap between them. #2026_10_18_01_group_5
- Code is drawn in the full lecture's light editor, and the Console and Vite's error overlay are light too. The owner: "the parse error needs to be adapted for light theme, not dark background". #2026_10_18_01_group_5
- Every browser panel uses one type scale: the page's text is the book's own text size, and a mini page is narrower, not smaller. The owner: "You constantly show the browser very small or very large fonts". #2026_10_18_01_group_5
- The page's elements are bare: a photo and the text under it, with no frame or card of our own. #2026_10_18_01_group_5
- The italic key question under a numbered heading, and the PARENT and CHILD labels, set in the font of the principle box's label. #2026_10_18_01_group_5

In both themes, a comment in code is a yellowish balloon in the Monokai manner, under its line, starting at the line's indent, with no tail and no underline, because revision 3 marks no token; `**WRONG:**` and `**PROBLEMATIC:**` are red and amber chips inside it. Revision 4 gives the same balloon its tail and its token (`summary-revision-4`). #2026_10_18_01_group_6

A change to the look is an experiment, shown to the owner before it is applied to every lecture, and written as a new theme file, so the theme in use is never edited to try an idea. #2026_10_17_01_group_3

- [ ] Is a design experiment a new file in `src/revised-3/themes/`, so the build writes it beside `NN.pdf` as `NN-<theme>.pdf` for the owner to compare? #2026_10_17_01_group_3
- [ ] Does a new palette start from what the owner likes (the full lectures' design, an image the owner sends, a named publisher's style) and from a tested colour system, rather than from hand-picked hex codes? #2026_10_17_01_group_3
- [ ] Is it built on one neutral and one accent, with green and red kept for right and wrong as small signals (a tick, a cross, a thin bar, a tinted line), because large areas of green and red compete with the content? #2026_10_17_01_group_3
- [ ] Is every text colour measured against its background at 4.5:1 or more before it is used, and is body text black or near black, because the owner prizes clarity over a fashionable light grey? #2026_10_17_01_group_3
- [ ] Are surfaces in a new palette told apart by fills and spacing rather than by thick side bars, which the owner reads as template-made? #2026_10_17_01_group_3
- [ ] Is the result shown on one or two pages at full size before it is applied to every lecture? #2026_10_17_01_group_3
- [ ] When a block is added to one theme, is it given the other theme's colours too, so both PDFs of every lesson build? #2026_10_18_01_group_5

PROPER EXAMPLE: `paper` grew from the owner's corrections on Lecture 3, each shown on one or two pages before the next (`notes/03-to-03b-decisions.md`, D06, D09, D10, D17, and D24 to D26), and became a theme of its own rather than an edit of `original`. #2026_10_18_01_group_5

COUNTER-EXAMPLES, from the revision 2 theme trials (now in `src/revised-2/archive/`), each rejected by the owner with the reason: #2026_10_17_01_group_3

- `sections-2`, first version: sage, terracotta, sand, moss, clay, and sky blue, about twenty colours on one page, muddy mid-tones, warm and cool fighting. "Why you pick such ugly colours? It's not random."
- `sections-2`, second version: the Flat UI web palette in print, a Midnight Blue band with a yellow number circle, and thick coloured bars on the left of every block. "This left-side border thickness is typical for modern AI slop." "I have never seen this anywhere."
- `classic`, `ink`, `sections`, `sections-3`: each coherent on its own terms, all retired at once: "everything is just awful." The lesson is less about any one palette than about the process: a palette shown on one page first costs one page; a palette applied everywhere first costs every PDF.

## Page Flow | 06 | Breaks, Keeping Together, Space #2026_10_17_01_group_3

The build keeps related blocks together (`blocks.md`, Page flow). The author's part is to write so the rules can work. #2026_10_17_01_group_3

- [ ] Does the title page hold only the title and the interview question, ended by `::: pagebreak`? #2026_10_17_01_group_3
- [ ] Does `::: pagebreak` come before each main title, before the Summary, and before the worked example (`summary-edition` Section 03)? #2026_10_18_01_group_1
- [ ] Does each figure carry its own title or caption, so it stands on its page without a sentence pointing at it (`summary-edition` Section 14B)? #2026_10_17_01_group_3 revised by #2026_10_18_05_group_1
- [ ] Is a fact note that explains a principle box placed directly before the box, so the two stay together? #2026_10_17_01_group_3
- [ ] Is each long code line, each tree, and each mini page checked at print size for overflow, a clipped word, or a label broken onto three lines (`summary-audit` Section 03)? #2026_10_17_01_group_3
- [ ] Is a half-empty page accepted when it keeps a figure whole, rather than cutting the figure across two pages? #2026_10_17_01_group_3

PROPER EXAMPLE: the page that shows the bare 0 under its own caption, "With a count of 0: the bare 0 under the inbox heading", so it says what it shows wherever the page breaks. #2026_10_17_01_group_3 revised by #2026_10_18_05_group_1

COUNTER-EXAMPLE: the same page with no lead-in and no caption after a code block that ended its page; the reader turned the page to a screenshot with nothing saying what it showed (a cold reader's LAYOUT finding). The cure is the figure's own caption, not a colon lead-in. #2026_10_17_01_group_3 revised by #2026_10_18_05_group_1
