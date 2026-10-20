---
name: summary-edition
description: Turns a finished lecture (01-02-md-LECTURES/<version>/NN.md) and its approved principle map into the revision 3 summary edition (04-01-md-revised-3/<version>/NN.md): a short, visual lesson that a reader who never saw the full lecture can follow from start to finish. Governs the reader it is written for, how the map's fields become the lesson, the order of the lesson (theory first, then the principles, the closing parts, and the worked example at the end), examples chosen anew, radically simple, and built on each principle box's own code, the opening theory that is clear at first reading, the worked example, the components behind the page, the shape of each idea, the route of a principle section and its subtitles, example titles that name the cause, the What is going on box that builds an invisible cause from its most basic fact, the conditions every description carries, stakes, facts before use, consistent code, minimal examples, principle boxes in short sentences, the comments that name the cause, the closing recaps, and plain normative prose.
---

# Summary Edition (Revision 3)

This skill governs the revision 3 summary edition: one lesson per lecture, written in `04-01-md-revised-3/<version>/NN.md` and built into `04-02-md-revised-3-html/` and `04-03-md-revised-3-pdf/` by `node src/build-revised-3.mjs NN`, run from `projects/react-08`. It starts from the finished lecture and its approved principle map, not from revision 1 or 2. Load `summary-figures` beside it for the figures and their syntax, and `summary-audit` once the draft builds. #2026_10_17_01_group_1

Read `examples.md` beside this file before writing. It holds the drafts that failed, the ones that half worked, and the versions the owner accepted; each section below names its cases. The reference lessons are Lectures 3 and 10 in `04-01-md-revised-3/v1/`, rewritten in the order of Section 03 and on the route of Section 07: take their moves, not their topics, their names, or their length. The owner's rules behind them are recorded in full in `notes/03b-rules-and-standards.md`, and the decisions that applied them in `notes/03-to-03b-decisions.md` and `notes/10-to-10b-decisions.md`. #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1

## The Aim | 01 | The Shortest Lesson That Stands on Its Own #2026_10_17_01_group_1

The edition has two goals that pull against each other, and both matter. It is a summary: it keeps what teaches the principles, and it shows each idea in a figure the reader takes in at a glance. And it stands on its own: its reader follows every step without the full lecture. When the two goals conflict, the stand-alone reader wins, because a short lesson that loses its reader teaches nothing. #2026_10_17_01_group_1

Revision 2 showed what happens when only the first goal is served. Its Lecture 10 had about 1,050 words and read cleanly to the person who wrote it, yet a cold reader found 34 places where it stopped standing on its own. Revision 3 fixed them and grew to about 2,750 words; every added sentence answers a question that reader actually had. #2026_10_17_01_group_1

**The reader.** The reader has studied the lectures before this one and has not read this one. In the map's Terms table, the terms marked Recall are what the reader once learned; the terms marked New are what this lecture teaches. Recall is not the same as fluency: a reader who learned the ternary in Lecture 4 may need one line to bring it back when this lecture leans on it. For Lecture 10, the reader knows HTML, CSS, JavaScript, components, JSX, curly braces in JSX, and props, and has never seen conditional rendering. `summary-audit` gives its cold readers this same reader. #2026_10_17_01_group_1

- [ ] Could the reader above follow the lesson with only this file, without the full lecture, the map, or an earlier revision? #2026_10_17_01_group_1
- [ ] Does each sentence teach something the principles need, or carry a condition, a stake, a bridge, or a fact the reader would otherwise lack? Length follows that test, not a word target. #2026_10_17_01_group_1
- [ ] Is each idea shown in a figure where a figure is clearer than prose, with short, direct prose around it? #2026_10_17_01_group_1

## Sources | 02 | The Lecture, the Map, and What May Adapt #2026_10_17_01_group_1

The lecture holds the story, the code, and the verified results. The map holds the contract: what each principle must prove, in what order, and with which approved words. Read both before writing a line. #2026_10_17_01_group_1

| map field | becomes in the edition |
| --- | --- |
| Theme and Options | the first theory section (the ways to handle the problem), and the worked example at the end #2026_10_18_01_group_1 |
| Principle Thread: Anchor | the one-sentence definition of the topic |
| Principle Thread: Axis, Why This Axis | the second division (or sequence) that orders the sections, and the line that says why they come in this order |
| Principle Thread: Spoken Preview | not used; the division tree and the "you are here" maps do its work |
| Principle Thread: Closing Line | the closing line under the Summary tree; kept word for word when its words are the lesson's own, rewritten in them when it repeats the map's spoken labels (Lecture 11: "one name each" became "each row keyed by its email's id") #2026_10_18_02_group_3 |
| Terms | New terms bolded at their first explanation; New terms with refresher "yes" explained in a fact note or a sentence before first use; Recall terms explained only when the lesson leans on a detail the reader may have lost |
| Candidate Ledger (verified rows) | a pool of extra facts for fact notes, interview answers, and Where you will meet this |
| per principle: Thread Step | the idea of the section, rewritten as a plain phrase built from things the reader sees, worded by who acts (Sections 06 and 06B); the map's labels were written for the ear and are not copied into headings or charts |
| per principle: Reader Question | the key question under the heading, and the "We want" sentence of the setup #2026_10_18_01_group_2 |
| per principle: Reader Expects | the example's try, `### Example: let's ...` (Section 07B) #2026_10_18_01_group_2 |
| per principle: Real Mistake | the try's code and its visible result |
| per principle: React Does | the explanation under `### Why ...?`, as a What is going on box when the cause is invisible on the page (Section 07C) #2026_10_18_01_group_2 revised by #2026_10_18_02_group_1 |
| per principle: Placement | the sentence that says where the fix goes |
| per principle: Required Lesson Proof | the result figures, one per case the proof lists |
| per principle: Rule | the principle statement, rewritten in short plain sentences that keep every condition (Section 12) |
| per principle: Prediction, Importance | answers in For the interview, cases in Where you will meet this |
| Senior Answer | the substance of For the interview |

The map fixes what each proof must show; it does not fix the story that shows it. The lesson's examples are chosen anew (Section 03B), and each proof moves into them with its behaviour kept. Lecture 10's map proves the drift between two returns with an author's name added to one of them; the rewritten lesson keeps that proof on Principle 3's own `ArticleCard`, where a new author line reaches only the signed-in return, so the visitor's card shows no author. #2026_10_17_01_group_1 revised by #2026_10_17_06_group_1 and #2026_10_18_01_group_2

- [ ] Is every principle of the map present, in the map's order, with every condition of its Rule kept? #2026_10_17_02_group_2
- [ ] Is every case of each Required Lesson Proof shown in a figure, on the lesson's own example, with its behaviour kept? #2026_10_17_01_group_1 revised by #2026_10_17_06_group_1
- [ ] Is each behaviour the lesson shows one the lecture and the map verified, with error messages and console lines word for word as React or the browser prints them for the lesson's own code? #2026_10_17_01_group_1 revised by #2026_10_17_06_group_1
- [ ] Is every piece of code the lecture does not contain checked by running it before it is printed: a plain JavaScript expression with `node`, component behaviour in a Vite project with React 19, as the map's runtime check did? When it cannot be run, is it named as unchecked in the report to the owner? #2026_10_17_01_group_1
- [ ] Does the report to the owner name the examples the lesson chose, and every proof moved into them? #2026_10_17_01_group_1 revised by #2026_10_17_06_group_1

## The Skeleton | 03 | The Order of the Lesson #2026_10_17_01_group_1

The lesson keeps this order: the theory first, then the principles, then the closing parts, and the worked example last. Each part answers the question the part before it raises. The owner: "chapter starts directly with theory that is clear", and the example moves "in the end of the pdf", replaced by "a simple title Principles (with page break before)". (examples.md Case 22) #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1

Titles come in three kinds, and the kind says where a page starts. A main title, `#`, opens its own page, after `::: pagebreak`. A section title, `##`, opens a part of the lesson. A subtitle, `###`, marks a step of a principle section (Section 07). The owner: "We need different kind of titles, some titles need the page break before." #2026_10_18_01_group_1

1. **Title page.** `# Lecture N: Title`, the interview question line, then `::: pagebreak`, so the first page holds only the title and the question. #2026_10_17_01_group_1
2. **The main title of the theory.** `# {{the topic}}` (Lecture 3: `# React JSX Syntax`; Lecture 10: `# React Conditional Rendering`). #2026_10_18_01_group_1
3. **The first division.** The ways to handle the problem, from the map's Theme and Options, with what is at stake between them (Lecture 10: `## Two different ways to keep a part off the page`). When the map lists no options, the division sets the starting point against the way this lecture teaches (Lecture 3: `## Two different ways to write markup`, normal HTML against JSX). Section 04. #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1
4. **The second division, or the sequence.** The lecture's axis, drawn as the shape it has (Section 06), with a sentence that names the dividing line and a line, from Why This Axis, on why the sections come in this order (Lecture 10: `## Conditional rendering: four kinds of choice`). #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1
5. **Principles.** `::: pagebreak`, then the main title `# Principles`, followed at once by the first numbered section. #2026_10_18_01_group_1
6. **One numbered section per principle**, `## N. {{the section label}}: {{the rule in a few words}}` (Lecture 10: `## 1. No card at all: return null at the top`; Lecture 3: `## 1. Each tag becomes a call that returns an object`), worded by who acts (Section 06B), each on the route of Section 07. #2026_10_17_01_group_1 revised by #2026_10_17_05_group_1 and #2026_10_18_01_group_2
7. **Putting the parts together.** The code as the sections built it, and its counterexample. Section 13. #2026_10_17_01_group_1
8. **For the interview** and **Where you will meet this.** Section 13. #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1
9. **Summary.** `::: pagebreak`, then `## Summary`: the lecture's tree, then the map's closing line. Section 13. #2026_10_18_01_group_1
10. **The worked example and its components.** `::: pagebreak`, then `## Example: {{the case study in plain words}}` (Lecture 10: `## Example: article cards on a news site`) and `## The components behind the page`. Sections 04B and 05. #2026_10_18_01_group_1

A rule the lesson relies on is made explicit, even when the map leaves it inside another principle. It gets its own sub-section, numbered with a capital letter (`## 1B. A component's name starts with a capital letter`), its own box in the lecture's tree, and its own principle box. The owner, on Lecture 3's casing rule, which the first draft explained in one paragraph: "This reveals a missing principle that should have been explicit." #2026_10_18_01_group_2

The full lecture's other parts move to where the reader needs them. #2026_10_17_01_group_1

| in the full lecture | in the edition |
| --- | --- |
| the numbered opening lines | the theory sections, which state the problem and its options at once (Section 04) #2026_10_18_01_group_1 |
| What we build on, and the runway | fact notes, each placed before its first use (Section 10) |
| the spoken preview | the division tree, and the "you are here" maps |
| the question cycles | the principle sections |
| the In the Wild card | an answer in For the interview |
| the practical example and its component summary | Putting the parts together, then the worked example and the components at the end #2026_10_18_01_group_1 |
| the HTML figures in `01-02-md-LECTURES/<version>/figures/` | not reused; the edition draws its figures with its own blocks |
| the glossary | each term in bold where it is first explained |
| Beyond the basics, the closing comparison table | left out; the Summary tree carries the comparison |

- [ ] Does the lesson open on the theory, go straight from it to `# Principles`, and keep the worked example and its components for the end? #2026_10_18_01_group_1
- [ ] Does each main title start a new page, and do the Summary and the worked example each start one too? #2026_10_18_01_group_1
- [ ] Does every rule the lesson relies on have its own principle box and its own box in the tree? #2026_10_18_01_group_2
- [ ] Has every part of the full lecture that the reader needs found its place, rather than being cut with the part that held it? #2026_10_17_01_group_1

## The Examples | 03B | Chosen Anew, Radically Simple #2026_10_17_06_group_1

When a lecture becomes a revision 3 lesson, every example is reconsidered from scratch: the running example, the code in the principle boxes, the tempting attempts, the cases in the closing parts, etc. The lecture and the map supply the concepts, the proofs, and the verified behaviour. The examples that carry them are chosen anew, and the lecture's own example is one candidate among others. The owner: "When we transform a normal lesson into a revision 3, we need to RADICALLY RECONSIDER ALL EXAMPLES, ALL OF THEM!" #2026_10_17_06_group_1

Each example is chosen for two things. It fits the story of the chapter: the concept is the reason the example exists, so the reader sees why this page needs this idea. And it is radically simple, so the reader sees the concept and nothing else. The page is made of things a reader recognises at once from everyday use of the web and needs no words to understand: a button, a title, a counter, a list of names, a colour, a text box, etc. The user's actions are the ones everyone does without thinking: click, type, add, remove, etc. The test is recognition, not the item: if the reader must be told what a part is or why it is there, it is not simple enough. The code shows the concept in the fewest, plainest lines, without string building, long expressions, or extra markup, unless they are the concept. The owner asked for examples that "better fit the story of the chapter" and are "radically simple and easy to comprehend, to avoid complex presentation of code in the code examples and clearly present the concepts." #2026_10_17_06_group_1

- [ ] Was every example chosen anew for this lesson, with the lecture's example kept only where nothing simpler teaches the same thing? #2026_10_17_06_group_1
- [ ] Does each example fit the chapter's story, so the concept is the reason the example exists? #2026_10_17_06_group_1
- [ ] Would the reader recognise every part of the page and every action at once, without being told what it is or why it is there? #2026_10_17_06_group_1
- [ ] Does each piece of code show the concept in the fewest, plainest lines, with whatever is not the concept moved out of it? #2026_10_17_06_group_1
- [ ] Does the example's markup avoid every HTML or CSS nuance the lesson does not teach, so the reader never asks why a tag was chosen (a plain `<div>` for a row, not a `<label>`)? #2026_10_18_04_group_1
- [ ] Does each part of the page arrive where the lesson first needs it, rather than ride through sections that never use it? #2026_10_17_06_group_1
- [ ] When a section teaches what breaks, is the broken thing big on the page and costly to the reader, and does it break on an action everyone knows? A typed text sitting under another title is true but invisible at a glance; a tick that lands on an email we never read, and the Delete button that then deletes it, is seen and felt at once. The owner, on the articles version of Lecture 11's keys: "It seems you want to teach something that is not evident, what exactly breaks." (examples.md Case 26) #2026_10_18_02_group_2

PROPER EXAMPLE (the three principles of Lecture 1, rechosen): a shopping cart shows its count in two places, "Items: 2" and a "Buy 2 items" button. The shopper clicks "Add to cart", and both places must show 3. The plain JavaScript attempt is two lines, `const items = document.getElementById('items');` and `items.textContent = 'Items: 3';`, and the button keeps "Buy 2 items". A note box joins the cart only in the section on typed text, where "Gift wrap, please" survives React's update and is lost to `innerHTML`. Note: every part is one a shopper knows, the click is one everyone makes, and each line of code carries the concept. (examples.md Case 21) #2026_10_17_06_group_1

COUNTER-EXAMPLE (Lecture 1, first revision 3): the signed-in user Mary adds her family name in her profile and becomes Mary Brooks while "elections" sits in a search box, and the change is made by editing the file. The principle boxes switch to `Greeting` and John, so the reader meets three sets of names. Note: the reader must work out why each part is there before the concept can start: why the name changes mid-search, why "elections", and who John is. The owner: "we see a weird example with elections, name becoming Mary Brooks, I do not get it." #2026_10_17_06_group_1

Inside a principle section, the example reuses the principle box's own code and is no more complex than it. The box teaches the rule on the smallest component; the section shows that same component on the page, placed by its parent, checked in the developer tools, and explained. A rule about a name may keep a larger component, as Lecture 3's casing rule keeps `ArticleCard`, because the name is its point. The text introduces the component by its name and by what it does, as if for the first time, never as "the principle's own component", which the reader is not asked to remember. The owner: "it makes me uncomfortable that the example is more complex and unnecessarily complex than the demo code provided inside the principle itself", and, on the phrase: "never say this thing". (examples.md Case 23) #2026_10_18_01_group_2

- [ ] Does each section's example use its principle box's component, with nothing in it more complex than the box? #2026_10_18_01_group_2
- [ ] Is the example's component introduced by its name and by what it does, never as "the principle's own component"? #2026_10_18_01_group_2

PROPER EXAMPLE (Lecture 3 rewritten, section 1): Principle 1's card shows `Greeting` returning `<p>Hello, John Hall</p>`. The section keeps `Greeting`, adds `App` to place it, shows "Hello, John Hall" in a browser beside the two files, and logs the tag in the Console. #2026_10_18_01_group_2

COUNTER-EXAMPLE (Lecture 3, first revision 3, section 1): the same card, then the old site's `<article>` with two inner tags, a `className`, and an array of nested objects. Note: the reader leaves the rule's three lines for a card that needs its own explanation, and the transform hides behind the extra markup. #2026_10_18_01_group_2

## The Opening | 04 | Theory That Is Clear at First Reading #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1

The lesson opens on the theory: the ways to handle the problem, then the lecture's axis. The reader meets it before any example, so each part must be clear at first reading. Each comparison names both of its sides, and says in the label itself how they differ; repeating a word so that each side is clear is welcome. The owner: "the comparisons must be VERY clear upon first reading, repetition can be a good thing." (examples.md Case 22) #2026_10_18_01_group_1

- [ ] Does each branch of an opening tree name its side of the comparison, with the difference in the label ("The React markup (JSX): it is not simple HTML", "Hide it: the element stays in the DOM")? #2026_10_18_01_group_1
- [ ] Does each theory section state its point in its first sentences, then the stakes between the options (Section 09)? #2026_10_18_01_group_1
- [ ] Do the opening trees' labels come back word for word in the "you are here" maps and the Summary, so the reader recognises them? #2026_10_18_01_group_1

PROPER EXAMPLE (Lecture 3 rewritten): the tree "Two different ways to write markup" over "The normal HTML markup | the browser reads it as it is, and forgives open tags" and "The React markup (JSX): it is not simple HTML | the build turns it into JavaScript first, and stops at any open tag". #2026_10_18_01_group_1

COUNTER-EXAMPLE (Lecture 3, first revision 3): the tree "Put an old page's markup on the page" over "In an HTML file" and "In a component, as JSX". Note: the branches name two places, not two kinds of markup, and nothing says that JSX is not HTML. #2026_10_18_01_group_1

## The Worked Example | 04B | The Case Study at the End, Tied to Its Tools #2026_10_18_01_group_1

The worked example comes after the Summary, on its own page. It shows the lecture's case study, and by now the reader knows every tool, so each difference on the page is tied to the rule behind it and to the tool that makes it. (examples.md Case 1) #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1

- [ ] Does the section introduce the case study briefly, then show the page with the parts that matter marked, and a caption that says what the marks mean? #2026_10_17_01_group_1
- [ ] Does it name each difference to notice? #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1
- [ ] Does it state each rule in the reader's own words, next to the part of the page it explains and the tool that makes it, so the eye goes from the rule to the picture and back (Lecture 10: a table, "on the page", "the rule behind it", "the tool")? #2026_10_17_01_group_1 revised by #2026_10_17_02_group_3 and #2026_10_18_01_group_1
- [ ] Does every rule explain something the picture shows? A rule about a part the reader cannot see (a topic section, a list that changes) is left out, or the picture is drawn to show it. #2026_10_17_02_group_3 revised by #2026_10_18_01_group_1
- [ ] Does it apply the rules to each item on the page? #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1
- [ ] Does the page show the code of Putting the parts together, so the case study and the final code agree? #2026_10_18_01_group_1

PROPER EXAMPLE (Lecture 10 rewritten): "The two cards below do not show the same parts. The park card has a red New label, and the rain card has none. The park card says "3 comments", and the rain card says "No comments yet"." Then the page, and a table whose rows read "a red New label on the park card only | IF the article is new, THEN show the label | `&&` (Principle 2)". #2026_10_18_01_group_1

COUNTER-EXAMPLE (Lecture 11, revision 3, first draft): a page of three cards in one list, then the rules "IN a topic section, ONLY that topic's articles" and "WHEN a new article arrives at the top". Note: no topic section and no new article are on the page, so the eye finds nothing to match the rules. The owner: "the eyes see these two, they do not visually correlate. IN a topic section? But I do not see topic section above." #2026_10_17_02_group_3

## The Components | 05 | Who Holds the Data, Who Draws the Page #2026_10_17_01_group_1

Every choice in a React lesson is made by some component, from data some component holds. The reader cannot follow a choice without knowing which component makes it, what it receives, and where that came from. So each principle section shows the two or three components it involves, under its subtitle Component Hierarchy (Section 07), and the lesson ends with all of its components, after the worked example. (examples.md Case 2) #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1

Each component lives in its own file, named after it, from the first lesson on: `Greeting.jsx` exports `Greeting`, and `App.jsx` imports it and places it with `<Greeting />`. The owner, on a first draft whose `App.jsx` held both components: "NO! rule: start with small separate components from lesson 1." #2026_10_18_01_group_2

- [ ] Does the closing section draw the hierarchy of the lesson's components, one file each, only the functional part, with what each holds and receives (`hierarchy`, `summary-figures` Section 03)? #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1
- [ ] Do the sentences beside each tree say who owns the data, who passes it to whom, and where the choice is made? #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1
- [ ] In each section, does the parent's file show the data together with the line that passes it to the child, so every prop has a visible origin? #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1
- [ ] Do the props in each hierarchy match the code of the same section, including the parent that passes them? #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1
- [ ] Does every component sit in its own file, named after it? #2026_10_18_01_group_2

A lecture taught before props still has a hierarchy: the parent that places the component, and the component with `holds:` what it returns or keeps, and sentences on the files they live in (Lecture 3: `App` in `App.jsx` places `Greeting` from `Greeting.jsx`). The build asks every numbered section for a hierarchy panel, and the panel always has something true to say about where the code lives. #2026_10_17_01_group_1 revised by #2026_10_18_01_group_2

## The Shape of Each Idea | 06 | Draw the Structure the Idea Has #2026_10_17_01_group_1

A summary connects ideas, and ideas connect in different shapes. A lesson drawn with one shape everywhere, a row of numbered steps, hides the real structure. Before writing any part, decide which shape the idea has, then draw that shape and use its sentence (`summary-figures` Section 01 names the block for each). The owner's words: "We want to divide an idea in two parts? two concepts? we need to follow a division tree and then apply each branch." (examples.md Case 3) #2026_10_17_01_group_1

| shape | the idea is | sentence |
| --- | --- | --- |
| division | one concept split into kinds or cases | "There are two ways to ...: A and B." Then each branch in turn |
| hierarchy | components inside components | who holds, who passes, who decides |
| sequence | steps where each needs the one before | "First ..., then ..." |
| contrast | the same situation, two choices | what is at stake |
| cause and effect | why something happens | "because ..., so ..." |
| mapping | each input gives one output | "for this, that" |

- [ ] When an idea divides, does the lesson draw the division, then take the branches in order? #2026_10_17_01_group_1
- [ ] Is the lecture's axis drawn as the shape it really has? Lecture 10's axis divides by what a choice covers, then by how many outcomes it has: a two-level tree. Lecture 3's is the path of pasted HTML into JavaScript: a sequence. Lecture 11's has two stretches: a sequence in two groups. #2026_10_17_01_group_1
- [ ] When one level of a division mixes two dividing lines, is it split into two named levels? #2026_10_17_01_group_1
- [ ] Does each numbered section open with a small copy of the lecture's map, its own branch highlighted (`here=`), with exactly the labels of the full map? #2026_10_17_01_group_1
- [ ] Does every label of every tree pass the chart test of `summary-figures` Section 02B: a phrase built from what the reader sees, under a root that says in full what the chart is about? The map's thread labels ("One name each", "The name's place", "Only some items") were written to be heard after a spoken preview; on a page they read as riddles, so they are rewritten, not copied. #2026_10_17_02_group_1
- [ ] Is each principle's logic drawn as a decision tree where its statement has branches ("when ...; when ...")? #2026_10_17_01_group_1

When the axis is a sequence, the "you are here" map is still a `tree`: the root names the axis, and the stages are its branches, in order, one level deep, so `here=` can mark the current stage. Lecture 3's map would read: root "Pasted HTML on its way to JavaScript", branches "The tag", "Its end", "The return", "The group", "Its attributes". The full sequence can still be drawn with `stages` or `ladder` where the axis is first introduced. #2026_10_17_01_group_1

## Who Acts | 06B | Each Label Worded by the One Who Does It #2026_10_17_05_group_1

A heading, a chart box, or a branch is read as an instruction when it starts with a bare verb: "Compare descriptions on every change" tells the reader to compare. But in a lesson about React, many things happen that the reader never does: React compares two descriptions, the browser draws the page, a place on the page shows a variable's value. A label that turns those into commands sends the reader looking for something to do. The owner's words: "IT confuses what the React (it compares) with what the learner needs to learn how to do (he does not compare anything)", and "the language should be prescriptive only when explicit prescription is implied." #2026_10_17_05_group_1

So each label is worded by who acts in it. What the developer writes or chooses can be a command, because the reader will do it: "return null at the top", "Key from the article's id". What React, the browser, or the code does is named as a thing ("Virtual DOM comparison") or said with its actor as the subject ("React compares the new description with the last one", "Each tag becomes a call"). The map's Kind is a first hint: a Decision is usually something the developer does, a Model something React does. A Model principle can still ask something of the developer, as Lecture 10's "return null at the top" does, so the words of each label decide, not the Kind. #2026_10_17_05_group_1

- [ ] Does every label that starts with a verb name something the reader will write or choose in the code? #2026_10_17_05_group_1
- [ ] Is what React, the browser, or the code does named as a thing or said with its actor as the subject? #2026_10_17_05_group_1
- [ ] Do sibling labels keep one grammar, so that one noun among them makes them all nouns, or all sentences with their subjects (`summary-figures` Section 02B)? #2026_10_17_05_group_1

PROPER EXAMPLE (Lecture 1, the three principles, after the fix): "1. Declarative programming | the component returns what each element shows", "2. A single source of truth | every place reads `{userName}`", "3. Virtual DOM comparison | React compares the new description with the last one and changes only the new text". Note: three named ideas, and in each note the one who acts is the subject: the component, the places on the page, React. (examples.md Case 20) #2026_10_17_05_group_1

COUNTER-EXAMPLE (Lecture 1, first draft): "1. Describe what each element shows", "2. Read one variable in every place", "3. Compare descriptions on every change". Note: three commands to the reader. The reader does not read a variable, the JSX does; the reader compares nothing, React does. #2026_10_17_05_group_1

## The Principle Section | 07 | One Route, Marked by the Same Subtitles #2026_10_17_01_group_1 revised by #2026_10_18_01_group_2

Every numbered section takes the same route, and the same subtitles mark it, so the reader learns where to look. The rule comes first and the rest of the section is its proof: the reader knows what to look for in every figure, and a reader who comes back to review finds the rule at once. The owner chose this order: "it makes little sense the principle to be in the end", and then the subtitles: "I need now specific subtitles to be repeatable like pattern." The route is a sequence of jobs, not a template of sentences; a step takes another form only when the content asks for it. A section that does not fit the route is rebuilt on it, and keeps every piece of its information. The owner, on such a rebuild: "I do not want us to loose information from what you wrote, I want us to edit and add exceptional clarity." (examples.md Cases 13 and 23) #2026_10_17_01_group_1 revised by #2026_10_17_02_group_2 and #2026_10_18_01_group_2

1. **The heading and its key question.** Under `## N. ...`, one italic line asks the question the section answers, and answers it in a few words: `*How? Due to a proper JSX transform*`, `*Why? Otherwise the JSX transform fails*`, `*When? The tags need one root, but the page needs no extra box*`. The question word fits the rule: Why, How, When, What if not. #2026_10_18_01_group_2
2. **You are here.** The small copy of the lecture's map, its branch highlighted. #2026_10_17_01_group_1
3. **The principle box** (Section 12): the rule in short sentences, and the do and don't code. Facts the box needs come in a fact note just before it. #2026_10_17_02_group_2
4. **`### Example: let's {{what we try}} ({{the outcome}}!)`** (Section 07B). The lead says what the example shows and why, and what changed from before; the setup says what we want and what we do, and the code follows under its file title, with no sentence pointing at it (Section 14B). The code is the principle box's own component (Section 03B), each component in its own file, the parent's file above the child's, each labelled PARENT or CHILD (`summary-figures` Section 03). When the page itself is the point, the page stands beside the files. #2026_10_18_01_group_2
5. **`### Component Hierarchy`.** The hierarchy of the components involved, the one where the choice is made marked `here:` with its choice, and numbered sentences ending in "We want: ...", the goal with its condition. #2026_10_17_01_group_1 revised by #2026_10_18_01_group_2
6. **`### Let's check {{the tool}}`.** The tool the reader opens to see the result: "Let's check our console log", "Let's check the error overlay", "Let's check the Elements panel", or "Let's compare the two versions" when both pages look the same. A comparison shows the browsers on top and the code under each (`summary-figures` Section 02), with a sentence that says what to compare. #2026_10_18_01_group_2
7. **`### Why ...?`** The explanation, under a subtitle that asks the question the check raised ("Why does an open tag stop the build?", "What is the JSX transform?"): React Does, as a cause-and-effect chain when several versions compete, or a table when each case maps to a result. When the cause cannot be seen on the page, it is a What is going on box built from the most basic fact (Section 07C). A fact the explanation needs comes just before it (Section 10). #2026_10_17_01_group_1 revised by #2026_10_18_01_group_2 and #2026_10_18_02_group_1
8. **The logic.** A decision tree for the principle's branches, when its statement has them, under a subtitle of its own ("How each kind of tag is closed", "What to group tags with"). #2026_10_17_01_group_1 revised by #2026_10_18_01_group_2

When the example is a story in pictures (`summary-figures` Section 02D), the story is the section's check, and its page opens with a banner of its own, a kind of title no other section uses: the kicker "Example" and the example's catchy title in large type ("How to delete the wrong email"), nothing more; the files follow under `### The code behind the {{app}}`, then `### Component Hierarchy`, then `### Why ...?`. A fact the story needs stands in the section's opening, beside the principle box, so it never sits alone before the tinted page. #2026_10_18_07_group_1 revised by #2026_10_18_08_group_1

When a principle has no Real Mistake, as Lecture 3's first principle, the example's try is the proof itself (`### Example: let's log a tag in the Console (it is an object!)`), and the check shows the logged object. #2026_10_17_01_group_1 revised by #2026_10_18_01_group_2

- [ ] Does every numbered section carry the hierarchy panel, a tree, and the principle box? The build checks these three. #2026_10_17_01_group_1
- [ ] Does every numbered section use the same subtitles in the same order, so a reader who has seen one section knows where to look in the next? #2026_10_18_01_group_2
- [ ] Does the subtitle of the check name the tool the section opens, and the subtitle of the explanation ask the question the check raised? #2026_10_18_01_group_2
- [ ] When a section was rebuilt on the route, is every piece of its earlier information still there, moved to the step where it belongs? #2026_10_18_01_group_2
- [ ] Does each code fragment say where it sits: which file, which component, inside the `return` or above it? #2026_10_17_01_group_1
- [ ] Does a fragment show its function signature when the props it uses are new to the reader? #2026_10_17_01_group_1
- [ ] Does each result figure come with a sentence or caption that says what to compare? #2026_10_17_01_group_1

PROPER EXAMPLE (Lecture 3 rewritten, section 2): "2. Every tag is closed: <img />", then "*What if not? The build stops, and nothing in the file runs*"; the map; the void-element fact and the principle box; "Example: let's use `<img>` instead of `<img />` (it fails!)", with `App.jsx`, PARENT, above `Author.jsx`, CHILD; "Component Hierarchy"; "Let's check the error overlay", where the overlay stands over the open tag and the photo over the closed one; "Why does an open tag stop the build?"; "How each kind of tag is closed". #2026_10_18_01_group_2

COUNTER-EXAMPLE (Lecture 10, revision 2, section 2): the heading, then straight away a two-line code fragment, `{article.isNew && ...}` and `{article.commentCount && ...}`, with no word on which component it belongs to, where in the JSX it sits, or what it is meant to do, then the page. Note: the reader meets the code before the goal, and cannot tell the defect from the intent. #2026_10_17_01_group_1

## The Example's Title | 07B | The Try, and the Cause It Shows #2026_10_18_01_group_2

The example's subtitle is a try in the reader's voice, "let's ...", with its outcome in parentheses: "Example: let's try to return two roots (it fails!)". When the consequence itself is the hook, the title can name it as a mock how-to instead: "Example: how to delete the wrong email", which the owner called "amazing". #2026_10_18_02_group_2 The outcome names the cause the section teaches, in the same words as the lead and the explanation, so the title, the lead, the subtitle of the explanation, the column titles, and the tree's labels say one thing. A visible symptom fits the title only when the symptom is the cause, as an error overlay is for a build error; a page that renders while its CSS silently stops applying has a cause with several effects, and the title names the cause. The owner, on a title that named one effect: "Why you cannot see this little subtle detail when writing titles?" (examples.md Case 25) #2026_10_18_01_group_2

- [ ] Does the example's subtitle say what we try, in the reader's voice, with its outcome in parentheses, or name the consequence as a mock how-to? #2026_10_18_01_group_2 revised by #2026_10_18_02_group_2
- [ ] Does every heading, subtitle, column title, caption, and tree label of the section name the cause its text teaches, in the same words? #2026_10_18_01_group_2
- [ ] Does the example's catchy title stay on the example wherever it goes, so a story page opens with it in its own banner, never as a generic subtitle such as "Let's check the page", and never as one more `###` subtitle? The owner, on the story page of Lecture 11: "NO! why this title ? We need the same catchy title", then: "I need specially designed title for such a section, can't you see it? Make it clear on top, not copy what we have done so far, it is a special type of section". #2026_10_18_07_group_1 revised by #2026_10_18_08_group_1
- [ ] Whenever a lead or an explanation changes, are the section's headings and labels listed next to the key noun of the lead and of the explanation, and is a heading whose noun differs rewritten, or the lead, before the build? #2026_10_18_01_group_2

PROPER EXAMPLE (Lecture 3 rewritten, section 4): the title "Example: let's group the items with a `<div>` (the CSS rules break!)", the lead "Here, an extra `<div>` or `<section>` breaks the page's CSS rules.", the subtitle "Why does a `<div>` break the CSS rules?", and the tree label "the CSS rules for direct children break". #2026_10_18_01_group_2

COUNTER-EXAMPLE (the same section, before): the title "Example: let's group the items with a `<div>` (the row breaks!)" above a lead that teaches that CSS depends on the hierarchy of DOM elements. Note: the row is one effect, and the borders vanish too. The title was written from what the screen showed and kept while the lead was rewritten around the mechanism. #2026_10_18_01_group_2

## The Aha Box | 07C | What Is Going On: From the Most Basic Fact to the Surprise #2026_10_18_02_group_1

Some causes cannot be seen on the page. The reader sees the result, a tick beside the wrong email, but not the mechanism that put it there, and a paragraph of mechanism in React's terms leaves the reader with words and no picture. Such a cause is explained in a What is going on box (`> [!AHA]`, drawn with a lamp): numbered steps that start from the most basic, elementary fact the whole cause rests on, and build one step at a time until the surprise follows by itself. The owner: "a series of steps that start from the most simple, fundamental and elementary idea e.g. what is a reactive variable in a reactive framework e.g. React as opposed to a normal variable, what is the order of an array as opposed the order of DOM elements etc. very fundamental concept build slowly so that the reader will get an aha! moment", and the shape of the chain: "Because of A we have B. Then due to B we have C. and oops... this happens." (examples.md Case 26) #2026_10_18_02_group_1

The first step is the hardest to find, because it is a fact so basic that the author no longer sees it. The test is to ask, of the first step drafted: could another step come before it? The draft of Lecture 11's box began "The tick lives in the checkbox on the page", and a step came before it: there are two lists, the array in our code and the elements on the page, and their two orders are separate. The owner supplied it: "We have the order of html elements. We have the order of elements in an array. These two are not the same." #2026_10_18_02_group_1

The box names each thing by a term the reader can picture, and keeps that term in every step. In a React lesson the two sides are almost always a variable in our code and the DOM elements on the page, and the box says so in those words: "the `emails` array, a variable in our JavaScript code", "an object in the `emails` array", "a DOM element on the page". The full term comes back in every step and every sentence where the difference matters; a later step never shortens it and never relies on the reader remembering step 1. A shorthand the box never defined, "the email", "the row", "the text", means a different thing to every reader, and a closing line built from shorthand says nothing at all. The steps also say why the fix exists: the two lists must match one by one, so when one changes the other must change with it, and the id is how React knows which goes with which. The owner: "There is absolute confusion of the terms, you assume the person understands. What is the email? what is the row?", "we need to stick to clear unambigious lucid terms and repeat them so the reader can follow. A row? Means nothing. A row of DOM elements, means something", and "they should coincide one by one, when we change the one the other should change... that's why we need the ID in the first place!" (examples.md Case 28) #2026_10_18_03_group_1

The box compares two categories, so it speaks at the level of the categories and nothing below it: DOM elements on the page, and an array of objects in our code. Which tag a DOM element is, a sample object, a class name, are details of one member of a category; each one asks the reader to stop and wonder why it is there, and none of them serves the comparison. The values of the example come in only at the steps where the surprise happens ("Lunch on Friday?", the `value` `4`). The owner: "Imagine comparing earth people with aliens. And then saying, earth people like George from Washington that wears a costume... why on earth add any detail when in principle we need to compare two categories? [...] Just refer to DOM element as different from array variable of objects." (examples.md Case 29) #2026_10_18_04_group_1

- [ ] Does a principle whose cause is invisible on the page explain it in a What is going on box, under its `### Why ...?` subtitle, after the check that showed the surprise? #2026_10_18_02_group_1
- [ ] Does step 1 state the most elementary fact the cause rests on, a fact the reader already holds but has never tied to this case (two lists with two separate orders; a variable React watches against one it does not)? Could no step come before it? #2026_10_18_02_group_1
- [ ] Does each step follow from the one before it, so "because of the step above" could open every step? #2026_10_18_02_group_1
- [ ] Is each thing named by a term the reader can picture (the `emails` array, a variable in our code; an object in the `emails` array; a DOM element on the page), and is that same full term repeated in every step and in the closing line, with no shorthand the box never defined ("the email", "the row")? #2026_10_18_03_group_1 revised by #2026_10_18_04_group_1
- [ ] Does the box compare the two categories at their own level (DOM elements on the page; an array of objects in our code), with no detail of one member (which tag, a sample object, a class name), and the example's values only where the surprise happens? #2026_10_18_04_group_1
- [ ] Do the steps say that the two sides must match one by one, and that this is why the item's id, and the fix built from it, exists? #2026_10_18_03_group_1
- [ ] Does each step carry one fact, opening with a bold sentence that stands alone, followed by one or two plain sentences? #2026_10_18_02_group_1
- [ ] Do the late steps use the values the reader saw on the page (the subject "Lunch on Friday?", the `value` `4`), so the chain lands on the picture? #2026_10_18_02_group_1
- [ ] Does the surprise step open with "Oops:" and name the consequence from the example, in its values? #2026_10_18_02_group_1
- [ ] Does a bold closing line sum up the mechanism in two short sentences, in the box's own terms, that a reader who skipped the steps could still picture? #2026_10_18_02_group_1 revised by #2026_10_18_03_group_1
- [ ] Does the fix that follows name the one step it changes ("With `key={email.id}`, step 6 changes")? #2026_10_18_02_group_1

PROPER EXAMPLE (Lecture 11, section 3): "1. **The `emails` array and the DOM elements on the page are two different lists.** The `emails` array is a variable in our JavaScript code: an array of objects. The DOM elements are what the browser shows on the page. The `emails` array and the DOM elements should be linked one by one, but they are not the same thing." "3. **So the `emails` array and the DOM elements on the page must match one by one.** When the `emails` array changes, the DOM elements on the page must change with it." "4. **The `emails` array and the DOM elements on the page hold different things.** Each object in the `emails` array holds an email's sender, subject, and id. Each DOM element on the page holds what the reader did there: the tick in its checkbox." Then the new object at the top of the `emails` array, the DOM elements that do not move by themselves, the match by position, the first DOM element that now shows "Lunch on Friday?", and "9. **Oops: we press Delete selected.** The form sends `4`." Closing line: "**The `emails` array and the DOM elements on the page must match one by one. Without a key, React matches them by position, and the tick stays in the wrong DOM element.**" After the box: "That is why each object in the `emails` array has an id." #2026_10_18_02_group_1 revised by #2026_10_18_03_group_1 and #2026_10_18_04_group_1

HALF WAY EXAMPLE (the box's first draft): "1. The tick lives in the checkbox on the page. Our emails array knows nothing about it. 2. So the tick stays with whichever row React keeps. 3. Without a key, React keeps rows by position." Note: every sentence is true, but the chain starts at its second link. The reader was never told that the array and the rows are two lists with two orders, so "whichever row React keeps" asks for a picture the box never drew, and "keeps" names nothing the reader can see. #2026_10_18_02_group_1

COUNTER-EXAMPLE (Lecture 11, the articles version): "When a list is shown again, React matches each new element with a card it already built, keeps that built card, and changes only what differs, such as the title. With no key, it matches by position: the first element with the first built card, the second with the second." Note: a paragraph of mechanism in React's words, beside a picture where the typed text sat in the same place before and after. The reader could not say what had broken. The owner: "I do not understand what changes visually when the id is not properly assigned and why." #2026_10_18_02_group_1

COUNTER-EXAMPLE (the closing line of the box's second draft): "**The text follows the email. The tick stays with the row.**" Note: a nothingburger. It reads like a summary, yet each noun is a shorthand the box never defined: which text, the email object in the array or the subject on the page? which row, a line of the picture or an HTML element? A reader who has not already understood the steps can picture none of it, and a reader who has needs no closing line. The owner: "The text follows the email... means what? WHATTTTT???" #2026_10_18_03_group_1

COUNTER-EXAMPLE (the box's third draft): "The first is the `emails` array, a variable in our JavaScript code: one email object per item, such as `{ id: 1, subject: 'Invoice for March' }`. The second is the list of HTML elements on the page, in the DOM: one `<label>` element per email object, with a checkbox inside it." Note: the terms were repeated, but the comparison sank under the details of one member: a sample object, a `<label>` tag the reader had no reason for, "HTML element" beside "DOM". The comparison needs only the two categories. #2026_10_18_04_group_1

## Conditions | 08 | Every Description Carries Its Conditions #2026_10_17_01_group_1

A result is only true in some case. A reader who has to carry the case over from an earlier paragraph loses it, and then the result reads as false. So every caption, column note, figure lead-in, table, tree branch, and recap repeats its case in a few words: which value, which item, which reader. This was the owner's most persistent correction: "you need to repeat in summary form the various nuances and conditions." (examples.md Case 9) #2026_10_17_01_group_1

- [ ] Does every statement of a result name the case it holds for: the value ("when `article` is `null`"), the item ("for the rain card, which has 0 comments"), the reader ("when `isSignedIn` is false"), the count ("for a count of 0")? #2026_10_17_01_group_1
- [ ] Is the condition put on the variable that really has the value (`article` is `null`, not `article.title`)? #2026_10_17_01_group_1
- [ ] Is each condition attached to the outcome it really goes with ("the whole card when its data is there, nothing when it is missing")? #2026_10_17_01_group_1
- [ ] Does each panel in a row of results open its note with the condition the row shares ("With `article` set to `null`, ..."), so a panel read alone is still true? #2026_10_17_01_group_1
- [ ] Do recaps keep every condition and nuance their sections stated, so two reasons stay two reasons, and the parent's branch stays beside the component's? #2026_10_17_01_group_1
- [ ] Is a value kept apart from the variable that holds it ("a number, such as `article.commentCount`: when it is `0`, as on the rain card, `0` appears")? #2026_10_17_01_group_1

PROPER EXAMPLE: "When `article` is `null`, the three versions below give three different pages. They differ in one line, `<h2>{article.title}</h2>`, `<h2>{article?.title}</h2>`, or an `if` placed at the top of the card:" #2026_10_17_01_group_1

HALF WAY EXAMPLE: "When `article.title` is `null`, the three versions below differ in one line ..." Note: the condition is there, on the wrong variable; the title is never reached, because reading it is what throws. #2026_10_17_01_group_1

COUNTER-EXAMPLE: "The three versions below differ in one line ..." Note: the reader must remember from an earlier paragraph that the card received `null`; read alone, the three panels make no sense. #2026_10_17_01_group_1

## Stakes | 09 | Say What Is at Stake Between Two Options #2026_10_17_01_group_1

Two options side by side invite the question "so what?". A comparison without its stakes leaves the reader holding two facts and no reason to prefer one. (examples.md Case 4) #2026_10_17_01_group_1

- [ ] Does every comparison say briefly what the difference changes for the page, the code, or the developer, in the exact terms of the defect ("every later change must be made twice; miss one copy, and the two cards drift apart")? #2026_10_17_01_group_1
- [ ] When the stakes come in several cases, are they named as cases and turned into one test the reader can apply ("must the part keep what is inside it while it is gone?")? #2026_10_17_01_group_1
- [ ] Is each claimed stake shown, or pointed to where it is shown, by the principle's number or its rule ("as Principle 1 shows")? #2026_10_17_01_group_1 revised by #2026_10_18_01_group_3

PROPER EXAMPLE: "Why does the difference matter? In two cases. When the data is missing, hidden JSX still runs: `<h2 hidden={!article}>{article.title}</h2>` still reads `article.title`, and throws when `article` is `null`, as Principle 1 shows. JSX that is left out never runs. And when the part holds something the user typed into it, hiding keeps the typed text, while leaving the part out throws it away." #2026_10_17_01_group_1 revised by #2026_10_18_01_group_3

COUNTER-EXAMPLE: "**Hiding with CSS** fits a part that must keep its place and what is inside it while hidden (Lecture 73). **Conditional rendering** fits every part that depends on data." Note: it says which option fits where, but never what goes wrong with the other. #2026_10_17_01_group_1

## Facts Before Use | 10 | Each Fact Arrives Just Before It Is Needed #2026_10_17_01_group_1

The full lecture teaches its JavaScript facts in a runway before the first question. The edition has no runway: each fact arrives in a fact note (`> [!FACT]`) right before the first line that needs it, so it is fresh when the reader uses it. A fact note is one paragraph on one Markdown line, holding the facts the next lines need, short enough to read at a glance; Lecture 10's falsy note, three facts in three sentences, is the upper end. (examples.md Case 5) #2026_10_17_01_group_1

- [ ] Is every term, operator, identifier, or prop explained or shown before its first use, counting figures, panel titles, and tree labels as uses? #2026_10_17_01_group_1
- [ ] Does a fact note cover the case where the lesson first uses the fact (`!` on `article`, an object or `null`), not only the simplest case (`!` on `true`)? #2026_10_17_01_group_1
- [ ] When a later section must be named early, does the sentence give what the reader needs now and point ahead for the rest ("Principle 2 shows how `&&` does this")? A forward pointer is welcome; a forward use without one is a gap. #2026_10_17_01_group_1 revised by #2026_10_18_01_group_3
- [ ] Is a fact stated as accurately as the reader needs, and no further ("the common falsy values are ...", rather than "six values count as false", which misses `-0` and `0n`)? #2026_10_17_01_group_1

## Consistent Code | 11 | The Code Holds Together Within and Across Sections #2026_10_17_01_group_1 revised by #2026_10_18_01_group_2

Each section builds its example on its own principle's component (Section 03B), so the code holds together in two ways. Within a section, the principle box, the files, the hierarchy, and the pages show the same component with the same names and values. At the end, Putting the parts together and the worked example gather the tools on one piece of code. A reader who notices a line that changed between two figures stops trusting every line after it. (examples.md Cases 6, 7, 8, and 10) #2026_10_17_01_group_1 revised by #2026_10_17_06_group_1 and #2026_10_18_01_group_2

- [ ] Within a section, do the principle box, the files, the hierarchy, and the pages show the same component, props, and values? #2026_10_18_01_group_2
- [ ] When the story changes a requirement, does the lesson say so ("Now the design changes"), rather than silently reversing an earlier figure? #2026_10_17_01_group_1 revised by #2026_10_18_01_group_2
- [ ] Does every example in a recap match the component it names (`<ArticleCard article={park} isSignedIn="false" />`, a prop the card really takes)? #2026_10_17_01_group_1
- [ ] Does the lesson's own code obey the lesson's principles (`featured !== null && ...`, a true or false value, as Principle 2 asks)? #2026_10_17_01_group_1
- [ ] Is each word chosen for its exact sense ("the first choice", not "the smallest choice", for removing the whole card)? #2026_10_17_01_group_1

## Minimal Examples | 11B | The Line in Question, Short and Whole #2026_10_17_02_group_4

A comparison teaches only if the reader can see the one line that differs, whole. So the example is designed around that line: everything the comparison does not ask about moves out of it, often into a variable named above the `return`, and the line that remains is short enough to sit in a column title or above a picture without an ellipsis. (examples.md Case 16) #2026_10_17_02_group_4

- [ ] Does each side of a comparison show the full line that differs, with no `...` standing in for code? #2026_10_17_02_group_4
- [ ] Is that line short, because the example was built so that it could be (a `cards` variable holding the mapped elements, so the choice reads `{shown.length > 0 ? cards : <p>No {topic} articles yet.</p>}`)? #2026_10_17_02_group_4
- [ ] Does the example hold only what the question needs: one component, one prop, one condition, with the rest left to earlier or later sections? #2026_10_17_02_group_4
- [ ] When the line cannot be made short, is it shown as a small code block at the top of its column, with a short title naming the difference, rather than squeezed into a title? #2026_10_17_02_group_4
- [ ] Is the example's data written out in full, each item as code, so the reader sees every value the page shows? A comment standing in for an item ("the rain and soups articles follow, unchanged") is an ellipsis too: it asks the reader to picture what the code could simply show. When the full data is too long for the block, fewer items make a better example than items described in words. (examples.md Case 19) #2026_10_17_04_group_1

PROPER EXAMPLE (Lecture 11, section 2): `const cards = shown.map(article => <ArticleCard article={article} />);` above the `return`, then two columns headed `{shown.length && cards}` and `{shown.length > 0 ? cards : <p>No {topic} articles yet.</p>}`, each over the page it gives. #2026_10_17_02_group_4

COUNTER-EXAMPLE (Lecture 11, first draft): columns headed `shown.length && ...` and `shown.length > 0 ? ... : <p>...</p>`, above a code block where the real line runs over three lines with `shown.map(article => <ArticleCard article={article} />)` inside a ternary. Note: the titles hide the code behind ellipses, and the code that would replace them is too long to read at a glance. The owner: "we need above the title to have the line of code at question ... it has to be simple and elegant example." #2026_10_17_02_group_4

## The Principle Box | 12 | The Approved Rule, in Short Sentences #2026_10_17_02_group_2

The principle boxes carry the rules the owner approved in the map, and the edition keeps every condition of each one. Their wording, though, was written as one long sentence for the spoken lecture, and on the page a long sentence loads the reader. So the edition rewrites each rule into short, plain sentences, with a longer one only where a condition needs it, and keeps the maps and the full lectures as they are. (examples.md Cases 12 and 15) #2026_10_17_02_group_2

- [ ] Does each box hold the title line `**Principle N: {{the idea in plain words}}**`, the rule in short sentences, and two cards as fenced code under `*We should do this:*` and `*We should not do this:*`? #2026_10_17_02_group_2
- [ ] Does the rewritten rule keep every condition and boundary of the map's Rule, so nothing the owner approved is widened or dropped? #2026_10_17_02_group_2
- [ ] Does it say what to write, and name the trap the reader is likely to miss ("Notice: this is easy to miss.")? #2026_10_17_02_group_2
- [ ] Is each card the shortest code that shows the rule, in general names (`items`, `item`, `Item`), and does its comment say what the reader should notice? #2026_10_17_02_group_2
- [ ] Is each card complete in itself: a whole small component, or a whole element, so every line has a visible place? A `return` never stands outside its function, and a `{ ... }` expression never stands outside the element it belongs to. The owner, on a card that began with `const shown = ...` and ended with a bare `return`: "the return is supposed to be part of a function? I understand the brevity but it is still confusing." #2026_10_17_03_group_2
- [ ] Does the flag on a wrong line name the cause visible on that line, then the effect (`// **PROBLEMATIC:** curly braces with no return give back nothing`), rather than the effect alone ("renders nothing")? #2026_10_17_02_group_2
- [ ] When a card uses stand-in names the section did not use, does a fact note right before the box say what they stand for? #2026_10_17_01_group_1
- [ ] When the map gives a principle no Real Mistake, does its box keep only the do card? #2026_10_17_01_group_1

PROPER EXAMPLE (the owner's rewrite of Lecture 11, Principle 1): "To show one element per item, we call `map()` on the array inside the JSX. The arrow function can give back the element directly, inside parentheses `( )`. Or it can use curly braces `{ }`, and then it needs an explicit `return`. Notice: this is easy to miss." With the wrong card flagged `// **PROBLEMATIC:** curly braces { } with no return give back nothing`. #2026_10_17_02_group_2

COUNTER-EXAMPLE (the map's wording, copied in the first drafts): "To show one element per item, we call `map()` on the array inside the JSX, and its arrow function gives back the element: right after `=>`, or with `return` when the body starts with a curly brace." with the wrong card flagged `// **PROBLEMATIC:** missing return renders nothing`. Note: one sentence carries three ideas, and the flag names the effect but not the curly braces that cause it. The owner: "It's a huge sentence, we still need to avoid loading large sentences." #2026_10_17_02_group_2

## Comments | 12B | Each Comment Names What to Notice #2026_10_18_01_group_6

The comments in the lesson's code are written in revision 3, with the rest of the text: they are part of what the lesson says. Revision 3 draws each comment as a balloon under its line, with no tail and no underline, so it carries no `~token~` mark; revision 4 adds the tokens and nothing else (`summary-revision-4`). The owner kept tokens out of revision 3, because placing them pulls the effort away from the words. #2026_10_18_01_group_6

- [ ] Does every titled block of three lines or more carry a comment, and every card of every principle box, both the do and the do-not card? #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
- [ ] In a two-column comparison, do both columns comment on the lines that differ, worded to mirror each other, so the eye reads the difference across the row? #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
- [ ] Do a one-line snippet with no title above an Elements, Console, or page panel, and the DO THIS and DO NOT DO THIS pair, stay free of comments? The pair is the lesson's clean summary, as the workspace asks of summary snippets. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
- [ ] Does each comment name the cause it shows, then the effect, with `**WRONG:**` when the build stops or the code throws and `**PROBLEMATIC:**` when the page silently shows the wrong thing? #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
- [ ] Is a comment in a column short enough to sit on one line there, about 40 characters? #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
- [ ] Is each comment written in the form its place allows, so the code would still run: `{/* */}` among JSX children, `/* */` right after a `(` inside a JSX expression, `//` in plain JavaScript (and after a tag that sits inside the parentheses of `map()`), `<!-- -->` in HTML? #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6
- [ ] Is the lesson free of `~` marks? #2026_10_18_01_group_6

PROPER EXAMPLE (Lecture 3, the worked example's two columns): the HTML file reads `<img src="/library.jpg" alt="Library"> <!-- No end: the browser closes it by itself -->` and the component reads `<img src="/library.jpg" alt="Library"> {/* **WRONG:** no end: the build waits for </img> */}`. Note: the same line in both columns, and two comments built the same way, so the row shows one line meeting two readers. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6

COUNTER-EXAMPLE (Lecture 11's card, in revision 3): `{items.map(item => { // **PROBLEMATIC:** { } with no return`. Note: `{ }` names the symbols rather than the cause. The revision 4 copy reads `// **PROBLEMATIC:** curly braces open a body with no return`, a wording that belongs in revision 3. #2026_10_17_04_group_2 revised by #2026_10_18_01_group_6

## The Closing Parts | 13 | Recaps That Keep Every Nuance #2026_10_17_01_group_1

The closing parts compress, and compression is where conditions and nuances get lost. (examples.md Cases 9 and 11) #2026_10_17_01_group_1

- [ ] Does Putting the parts together show the code as the sections built it, introduced with each tool and its condition? #2026_10_17_01_group_1
- [ ] Does its counterexample mark each mistake (`bad=` lines), name it with its line, and say when it bites ("so a visitor sees a bare 0 on the rain card, which has 0 comments (line 19)")? #2026_10_17_01_group_1
- [ ] Does the counterexample hold only the mistakes the lesson taught, with one deliberate drift and no accidental one? #2026_10_17_01_group_1
- [ ] Does For the interview answer what an interviewer asks (from the Senior Answer, the Prediction, the Importance, and the lecture's interview and In the Wild sections), each answer keeping the nuances its section stated? #2026_10_17_01_group_1
- [ ] Does each case in Where you will meet this name its condition and its tool ("An unread badge, shown only when there are unread messages"), with the trap when there is one? #2026_10_17_01_group_1
- [ ] Is the Summary the lecture's tree, every branch with its condition, followed by the closing line in bold, in the lesson's own words? #2026_10_17_01_group_1 revised by #2026_10_17_02_group_1

## Language | 14 | Plain, Exact, and Kind to the Reader #2026_10_17_01_group_1

The voice follows `lecture-voice` where it governs words: plain upper-intermediate English, short sentences, active verbs, the code name first with who provides it, plain everyday names in examples, and the exact defect instead of a vague one. Its rules for the spoken lecture do not apply here: the edition is read, not heard, so it shows code, and it opens on the theory sections rather than on numbered opening lines. #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1

Every paragraph says what we want, what we do, and what happens, in short sentences. The point comes first: the first sentences say what the example shows and why it matters, so the reader reads the code knowing what to look for. A lead is not a story that keeps its point for later. The reader is "we": we want, we open, we compare, we close. Each sentence carries one fact in plain B2 words. A sentence joined by several semicolons or colons is split, a new fact never hides in brackets, and a side clause such as "which the page wants anyway" becomes its own sentence or goes. Another part of the lesson is named by its rule or its principle ("each tag becomes a call", "the next principle", "Principle 2"), never by a section number. A thing on the page is an element, not a box. Each thing keeps one full name the reader can picture, repeated every time it comes back: on the code side, a variable and its items (the `emails` array, an email object); on the page side, the DOM elements (a DOM element on the page). A shorthand the text never defined ("the email", "the row") is a different thing to every reader (Section 07C). #2026_10_18_03_group_1 A paragraph does not repeat what the figure right below it shows. The owner: "Make it more clear B2 vocabulary", and "The intro paragraph spills the beans directly!!!! [...] it's not theatrical play waiting for suspence". (examples.md Case 24) #2026_10_18_01_group_3

A lead that explains a mechanism gives four things, in order: what changed from before, the mechanism in the platform's terms, the consequence on the page, and who it concerns. A setup gives what we want first, then one plain fact per file, the rule the reader already knows as the reason, and the action we take last; details the code shows right below are not repeated in words. #2026_10_18_01_group_3 revised by #2026_10_18_05_group_1

- [ ] Does each section open with a sentence a reader understands without the heading? #2026_10_17_01_group_1
- [ ] Does each lead state its point, with its cause, in its first sentences? #2026_10_18_01_group_3
- [ ] Does each sentence carry one fact, with "we" as the one who acts wherever the reader acts? #2026_10_18_01_group_3
- [ ] Does a lead that explains a mechanism give what changed, the mechanism, the consequence on the page, and who it concerns? #2026_10_18_01_group_3
- [ ] Does each setup go from what we want to what we do, without describing what the code below shows? #2026_10_18_01_group_3 revised by #2026_10_18_05_group_1
- [ ] Does every back-reference name the rule or the principle, never a section number? #2026_10_18_01_group_3
- [ ] Is each thing named by one full term the reader can picture, kept the same every time, with the code side (a variable, an object) and the page side (a DOM element) never blurred into one word such as "the email" or "the row"? #2026_10_18_03_group_1 revised by #2026_10_18_04_group_1
- [ ] Is each new term bolded once, where it is first explained, so the reader can find its definition by scanning for bold? #2026_10_17_01_group_1
- [ ] Do comments in the lesson's own code say what the reader should notice (Section 12B)? #2026_10_17_01_group_1 revised by #2026_10_18_01_group_6
- [ ] Is each paragraph one line? The build reads every line as its own paragraph, so a wrapped paragraph falls apart. The build also fails on an em-dash. #2026_10_17_01_group_1

PROPER EXAMPLE (Lecture 3 rewritten, section 4's lead): "Here, an extra `<div>` or `<section>` breaks the page's CSS rules. In the previous example, an extra element did no harm: a `<section>` around a name and a line changed nothing on the page." Then the mechanism: "Many CSS rules style an element by its place under its parent [...] When we add a new element in between, such as a `<div>`, the items are no longer directly inside the list, and the rule stops applying. The page loses that style, and neither the build nor the Console warns us." Then who it concerns: "These CSS rules often come from a web designer, not from the React developer." Then the setup: "We want a list with two items. The list is in the parent, `App.jsx`. The items come from the child, `Items.jsx`. A component returns one root, so we wrap the two items in a `<div>`:" #2026_10_18_01_group_3

COUNTER-EXAMPLE (the same lead, in three earlier drafts): "Section 3 gave `Author` one root, a `<section>`, which the page wants anyway. Sometimes the page wants no extra box at all." Then: "But what if the page does not need a `<section>` element? What if adding a `<div>` or a `<section>` breaks the page?" Then: "Our example is a list with two items, in two files. `App.jsx` is the parent: it draws a list, `<ul>`, and places `Items` inside it. `Items.jsx` is the child: it returns the two list items, `<li>First</li>` and `<li>Second</li>`." Note: the first names a section by its number, hides a fact in a side clause, and calls an element a box; the second keeps its point behind two questions; the third describes each file instead of saying what we want and what we do. #2026_10_18_01_group_3

PROPER EXAMPLE (a check's lead): "With the `<div>`, the build passes and the Console stays clean, yet the row breaks. With a Fragment, the row and the borders appear. React checks some nesting rules, such as a `<div>` inside a table row, but not a `<div>` inside a `<ul>`. Each column shows the page, then the Elements panel, then the code:" #2026_10_18_01_group_3

COUNTER-EXAMPLE (the same lead, before): "With the `<div>`, the build passes, and the Console stays clean (React checks some nesting rules, such as a `<div>` inside a table row, but not a `<div>` inside a `<ul>`), yet the row breaks; with a Fragment instead, the row and the borders appear. Each column shows the page on top, then the Elements panel, then the code that made it:" Note: one sentence carries four facts, one of them inside brackets. #2026_10_18_01_group_3

## Figures Stand on Their Own | 14B | No Sentence That Only Points at the Next Figure #2026_10_18_05_group_1

A figure, a code block, or a row of panels stands on its own: its title or caption says what it shows, and the reader looks at it without being told to. So the text never ends a paragraph on a colon that announces what comes next ("These are two different lists:", "The four steps below show what this does to a real inbox with no key:"). Such a sentence repeats what the figure's caption already says. Placed between two figures, it also pushes them apart, and the reader loses the thread. When a pointing sentence carries an idea, the idea moves up into the paragraph where the point is made, and the pointer itself goes. Every sentence ends with a full stop. The owner: "Do not have this type of writing ending with :", "Allow images to exist without leading sentence explicitly pointing to them", and, on the sentence between the two figures, "Move this idea on top, as it polutes the space between". (examples.md Case 30) #2026_10_18_05_group_1

- [ ] Does every paragraph end with a full stop, never with a colon that announces the next figure or code block? #2026_10_18_05_group_1
- [ ] Does each figure say what it shows in its own title or caption, so it needs no sentence pointing at it? #2026_10_18_05_group_1
- [ ] Is the space between two figures free of sentences that only bridge them, with any idea such a sentence carried moved up to where the point is made? #2026_10_18_05_group_1

PROPER EXAMPLE (Lecture 11b, the opening): "Our inbox shows the same emails in two places. In our code, the emails are an array of objects, `emails`. On the page, the same emails are a list of DOM elements, one per email. These are two different lists. So when the order of one list changes, the order of the other does not follow, and we may click in one DOM element while the code thinks we mean a different object in the array." Then the two lists side by side, then STEP 01, with nothing in between. #2026_10_18_05_group_1

COUNTER-EXAMPLE (the same opening, before): "... one per email. These are two different lists:" above the two lists, then, between the two lists and STEP 01: "So when the order of one list changes, the order of the other does not follow. We may click in one DOM element, and the code may think we mean a different object in the array. The four steps below show what this does to a real inbox with no key:" Note: two pointers that tell the reader to look at what is already in front of them, and an idea, the two orders that do not follow each other, stranded between two figures instead of standing with the point it belongs to. #2026_10_18_05_group_1
