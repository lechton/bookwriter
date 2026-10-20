# Summary Edition Casebook: Lecture 10, Draft by Draft

Every case below is real, and each skill section names the cases that illustrate it. The counter-examples of Cases 1 to 21 come from revision 2 (`03-01-md-revised-2/v1/10.md`) or from early drafts of revision 3, and their proper examples from the lesson accepted on 2026-10-17, which moves to `04-01-md-revised-3/v1/archive/` when Lecture 10 is rewritten in the order of SKILL.md Section 03. Cases 22 to 25 come from the rewrite of Lecture 3, where the owner set that order; the full record is in `notes/03b-rules-and-standards.md` and `notes/03-to-03b-decisions.md`. Each case names the skill section it illustrates. Take the move, not the topic. #2026_10_17_01_group_1 revised by #2026_10_18_01_group_1

## Case 1: An opening that shows the puzzle before the answer (Section 04)

COUNTER-EXAMPLE (revision 2): the page figure, then: "Some parts of a card belong only to some articles: the "New" label to new articles, the comment count to articles with comments, a sign-in prompt to visitors. How does one component show a part in one case and leave it out in another?" and the next heading, "Two ways to leave a part off the page".

HALF WAY EXAMPLE (revision 3, first draft): a section "The site and its components" right after the page figure, opening with "Before any choice, we need to know who holds the data and who draws the card." The components came before the reader knew why they mattered.

PROPER EXAMPLE (accepted): the title page alone; then "## Example: article cards on a news site", the site in two sentences, the page, "Look closely: the two cards do not show the same parts. ... Yet one component drew both cards, so something inside that component decided, card by card, what to show.", the IF ... THEN rules as a chain, the rules applied to each card, and only then the name **conditional rendering** and the question; then "## The components behind the page".

Note: the owner's words: "We need organic introduction of what is going on in the demo example, what is at stake, and what are the examples of our components." The reader first sees, then is asked to notice, then hears the rule in plain words, then learns the name. #2026_10_17_01_group_1

Later note: the owner then moved the example to the end of the lesson and opened it on the theory (Case 22). What this case teaches stays true of the worked example in its new place (SKILL.md Section 04B): the page and its differences come before the rules that explain them, and the components come after the page. #2026_10_18_01_group_1

## Case 2: Props with no visible origin (Section 05)

COUNTER-EXAMPLE (revision 2): `<span className="new-label" hidden={!isNew}>New</span>`, the first code of the lesson, with nothing said about where `isNew` comes from. In a card that receives `article`, the bare name `isNew` does not even exist.

PROPER EXAMPLE: the hierarchy of `App`, `ArticleList`, and `ArticleCard` with what each holds and receives; the `park` object at the top of `ArticleList.jsx` with the two lines `<ArticleCard article={park} isSignedIn={isSignedIn} />`; then "So inside `ArticleCard`, each rule reads a field of the article it received: "the article is new" is `article.isNew` ..."; and `article.isNew` in every later line.

Note: a cold reader flagged `isNew` as undefined on page 2. Every prop the code reads needs a visible path from the data to the line. #2026_10_17_01_group_1

## Case 3: A division whose single level mixed two dividing lines (Section 06)

COUNTER-EXAMPLE (revision 2 and first revision 3 draft): a row "Nothing | One or nothing | One of two | One of many", introduced as "four sizes of choice" by how many pieces the choice has.

PROPER EXAMPLE: a two-level tree. "Leave it out: conditional rendering" divides into "The whole component" (decided at the top of the function), holding "Nothing", and "A piece inside the JSX" (the choice made in its braces, or above the `return`), holding "One or nothing", "One of two", and "One of many".

Note: a cold reader saw that "Nothing" is not a count of pieces: it removes the whole component before any JSX is built. Naming both dividing lines removed the confusion, and the "you are here" maps inherited the clearer tree. #2026_10_17_01_group_1

## Case 4: A comparison with nothing at stake (Section 09)

COUNTER-EXAMPLE (revision 2): "**Hiding with CSS** fits a part that must keep its place and what is inside it while hidden (Lecture 73). **Conditional rendering** fits every part that depends on data, and every part whose data may be missing."

PROPER EXAMPLE: "Why does the difference matter? In two cases. When the data is missing, hidden JSX still runs: `<h2 hidden={!article}>{article.title}</h2>` still reads `article.title`, and throws when `article` is `null`, as section 1 shows. JSX that is left out never runs. And when the part holds something the user typed into it, hiding keeps the typed text, while leaving the part out throws it away. So the test is one question: must the part keep what is inside it while it is gone? If yes, hide it. If no, leave it out ..."

Note: the stake is shown with its example and turned into a single test; the pointer to Lecture 73 went away, because the stand-alone reader cannot follow it. #2026_10_17_01_group_1

## Case 5: A fact used two pages before it was taught (Section 10)

COUNTER-EXAMPLE (revision 3, second draft): a fact note on page 3 explaining `!` for `true` and `false` only, while page 3's stakes paragraph already wrote `!article`; the note that `!` works on any value came on page 5.

PROPER EXAMPLE: one fact note before the first panel: "`!` turns `true` into `false` and `false` into `true`, so in the left panel below, `hidden={!article.isNew}` hides the label exactly when the article is not new. `!` works on any value: in a condition, `null`, `undefined`, `0`, and `''` count as false, so `!article` is `true` when `article` is `null`."

Note: a fact note covers the case in which the lesson first uses the fact, counting every figure and panel as a use. #2026_10_17_01_group_1

## Case 6: A demonstrated defect the lesson's own history contradicted (Section 11)

COUNTER-EXAMPLE (revision 3, first draft): section 3's two returns, with "Later, the author's name is added to the first return only." Section 2's code already had the author line, and the hierarchy said the author was the same for both readers.

HALF WAY EXAMPLE (second draft): "Later, the New label from section 2 is added to the signed-in return only." Consistent, but the first version had silently dropped the label and the comment line that section 2 built.

PROPER EXAMPLE: "Both returns carry the New label and the comment line. When section 2's `> 0` fix arrived, it went into the signed-in return only. Here is the rain card, with 0 comments, for each kind of reader:" and the visitor's rain card shows the bare 0 again.

Note: the drift grows from the lesson's own history, needs no new data, and connects sections 2 and 3. A reader who notices a vanished line stops trusting the code. The map words this proof with the author's name added to one return; the edition adapted the story and kept the behaviour the proof requires, a change made in one return that never reaches the other, and the report to the owner says so (`SKILL.md` Section 02). #2026_10_17_01_group_1

## Case 7: A recap example the component cannot take (Section 11)

COUNTER-EXAMPLE: "**Why would `<ArticleCard isNew="false" />` show the label?**" The card reads `article.isNew`; it has no `isNew` prop.

HALF WAY EXAMPLE: "**Why would `<ArticleCard isSignedIn="false" />` show the summary to a visitor?**" A real prop, but the tag passes no `article`, so the card's own `if (!article) return null` shows nothing at all.

PROPER EXAMPLE: "**Why would `<ArticleCard article={park} isSignedIn="false" />` show the summary to a visitor?** A prop written in quotes is text, and any non-empty text is **truthy**, the opposite of falsy, so the ternary takes its first side."

Note: every example is checked against the lesson's own component before it is printed, and code the lecture does not contain is run (`SKILL.md` Section 02). The map's proof here is `isNew="false"`; the card takes no `isNew` prop, so the edition shows the same behaviour, a quoted "false" that is truthy, on a prop the card does take. #2026_10_17_01_group_1

## Case 8: The lesson's code breaking the lesson's principle (Section 11)

COUNTER-EXAMPLE: section 2 recommends a true or false value left of `&&`, then shows `App` writing `{featured && (...)}`, with an object or `null` on the left; a cold reader called it a contradiction.

PROPER EXAMPLE: `{featured !== null && (` and "When `featured` is `null`, the comparison gives `false`, so neither the heading nor the card appears, and the card never runs."

Note: the Principle box cannot change, so the example changes to obey it. #2026_10_17_01_group_1

## Case 9: Conditions lost in figures and recaps (Section 08)

COUNTER-EXAMPLES, each from the draft before the conditions audit:
- caption: "Three versions of ArticleCard." Proper: "Three versions of ArticleCard, with article set to null."
- panel note: "The whole page is blank." Proper: "With `article` set to `null`, reading `article.title` throws, and the whole page is blank."
- tree branch: "the number `0` → `0` itself appears on the page: `article.commentCount`". Proper: "a number, such as `article.commentCount` → when it is `0`, as on the rain card, `0` itself appears on the page."
- bridge: "The first choice decides whether the component shows at all: when its data is missing, the whole card, or nothing." Proper: "... the whole card when its data is there, nothing when it is missing."
- recap: "it puts a bare number left of `&&` (line 19)". Proper: "it puts a bare number left of `&&`, so a visitor sees a bare 0 on the rain card, which has 0 comments (line 19)."
- interview: "Is returning `null` the same as leaving the tag out in the parent? The page looks the same." Proper: "The page looks the same when the parent puts nothing around the tag; when the parent has its own markup there, such as a heading, only leaving the tag out removes that too."

Note: the owner's correction was "you need to repeat in summary form the various nuances and conditions"; a dedicated audit then found fourteen more places. Recaps lose conditions most easily, because they compress. #2026_10_17_01_group_1

## Case 10: Words that say almost the right thing (Section 11)

- "The smallest choice is to show nothing at all: the whole card, gone." Removing the whole card is the biggest effect. Accepted: "The first choice decides whether the component shows at all."
- "Hide it with CSS" over code that uses the `hidden` attribute. Accepted: "Hide it", with the note "the `hidden` attribute makes the browser apply `display: none`", and the tag "the browser".
- "React calls `ArticleCard` again whenever its props change." React also calls it when its parent renders again with the same props. Accepted: "whenever its parent renders it again, for example with new props".
- "Six values count as false in a condition." Accepted: "The common **falsy** values ... are ...".
- "`if (!x) return null`" in the Summary tree, a placeholder used nowhere else. Accepted: `if (!article) return null`.

Note: a stand-alone reader takes every word literally; the near miss becomes a false belief. #2026_10_17_01_group_1

## Case 11: A closing that did not match what the lesson built (Section 13)

COUNTER-EXAMPLE (revision 2): under the Summary, a DO THIS card with the null check, a ternary, and `> 0 &&`, without the New label or section 4's comment wording, and a DO NOT DO THIS card with no word on which mistakes it holds.

PROPER EXAMPLE: "## Putting the four together", after section 4 and before For the interview: "The four tools in one card, as the four sections built it: `return null` when there is no article; `&&` for the New label, shown when the article is new; the ternary for the summary when `isSignedIn` is true and the sign-in prompt when it is false; and `if` with a variable for the comment wording ...", the assembled card, then the counterexample with its four mistakes marked in red, each named with its line and when it bites.

Note: the payoff belongs where the four tools come together, not after the lesson has closed. #2026_10_17_01_group_1

## Case 12: A principle box that a cold reader wanted to edit (Section 12)

A cold reader suggested rewording Principle 2's Rule ("never a bare number") and replacing `name` and `<Summary />` in Principle 3's cards. At the time the boxes were copied word for word, so the example in section 2 changed to obey the Rule (Case 8), and a fact note before Principle 3 said what the stand-in names meant. Later the owner allowed the edition to rewrite each rule in short sentences (Case 15), while keeping every condition the map approved. The lasting point: a finding about a box is weighed against the map's Rule, and the conditions stay. #2026_10_17_01_group_1 revised by #2026_10_17_02_group_2

## Case 13: A principle section that started with code (Section 07)

COUNTER-EXAMPLE (revision 2, section 2): the heading "2. One or nothing: a true or false value left of &&", then at once:

```jsx
{article.isNew && <span className="new-label">New</span>}
{article.commentCount && <p>{article.commentCount} comments</p>}
```

then the page with the bare 0, then "**Logical AND** (`&&`) is not an inline `if`."

PROPER EXAMPLE (revision 3, section 2): the "you are here" map on "One or nothing"; the bridge "Section 1 removed the whole card when its data was missing. Now the card is there, and one piece inside it appears on some cards and not on others."; the hierarchy of `ArticleList` and its two cards, ending "We want: the park card (new, 3 comments) shows both pieces; the rain card (not new, 0 comments) shows neither."; "Inside the card's `return`, a first version uses `&&` for both pieces: the label above the title, meant to show when `article.isNew` is true, and the comment line below the summary, meant to show when `article.commentCount` is not zero:"; the full `return` with the defect line marked; "Rendered for both cards, this first version gives:"; the page; the falsy fact; the table; the comparison fact and the fix; the decision tree; the box.

Note: in revision 2 the reader meets the code before the goal, and cannot tell the defect from the intent; in revision 3 the goal, the place, and the intent come first, so the bare 0 reads as a surprise against a stated expectation. #2026_10_17_01_group_1

## Case 14: Chart labels that needed an oracle (summary-figures Section 02B)

COUNTER-EXAMPLE (Lecture 11, first draft): a tree "Rendering a list" with branches "Items become elements" and "Elements get names", and leaves "Every item", "Only some items", "One name each", "The name's place"; and a first division "One card per item" with branches "By hand" and "From the data".

PROPER EXAMPLE (the owner's rewrite): "Render one card per item", dividing into "fixed: written by hand" and "dynamic: from an **array** of data"; and leaves built from what the reader sees: "Every article becomes a card: `map()`", "Give each card a key from its article's id: `key={article.id}`".

Note: the map's thread labels were written to be heard after a spoken preview; on a page, alone, they read as riddles. The owner praised the charts whose every box is code, a value, or what the page shows. #2026_10_17_02_group_1

## Case 15: A rule in one long sentence, and a flag that named only the effect (Section 12)

COUNTER-EXAMPLE: "To show one element per item, we call `map()` on the array inside the JSX, and its arrow function gives back the element: right after `=>`, or with `return` when the body starts with a curly brace." with `// **PROBLEMATIC:** missing return renders nothing`.

PROPER EXAMPLE (the owner's rewrite): "To show one element per item, we call `map()` on the array inside the JSX. The arrow function can give back the element directly, inside parentheses `( )`. Or it can use curly braces `{ }`, and then it needs an explicit `return`. Notice: this is easy to miss." with `// **PROBLEMATIC:** curly braces { } with no return give back nothing`.

Note: short sentences, one idea each, the trap named; the flag names the cause on that line, the curly braces, then the effect. The box now opens the section, so the reader meets the rule first and the section proves it. #2026_10_17_02_group_2

## Case 16: A comparison whose line was hidden behind ellipses (Section 11B)

COUNTER-EXAMPLE (Lecture 11, first draft): two columns headed `shown.length && ...` and `shown.length > 0 ? ... : <p>...</p>`, under a code block where the real choice ran over several lines, a ternary wrapped around `shown.map(article => <ArticleCard article={article} />)`. The owner: "now I realise how ridiculous long this correct example would look like and I'm not sure if it is professional."

PROPER EXAMPLE: the mapped cards are put in a variable above the `return`, `const cards = shown.map(article => <ArticleCard article={article} />);`, so the two columns can be headed by the whole lines `{shown.length && cards}` and `{shown.length > 0 ? cards : <p>No {topic} articles yet.</p>}`.

Note: the example is designed so the line in question is short and whole; what the comparison does not ask about moves out of the line. #2026_10_17_02_group_4

## Case 17: Box code with no place to stand (Section 12)

COUNTER-EXAMPLE (Lecture 11, Principle 2): `const shown = items.filter(...)`, `const cards = ...`, then `return <section>{shown.length > 0 ? cards : <p>None yet.</p>}</section>;`, three lines with no function around them, the flag wrapping onto a fourth line. The owner: "the return is supposed to be part of a function?"

PROPER EXAMPLE: the same lines inside `function OpenItems({ items }) { ... }`, the `return` spread over its JSX lines so the flag stays on the line it names. Lecture 10's `let label; if ... return <p>{label}</p>;` became `function CountLabel({ count }) { ... }`, and Lecture 3's bare `return ( ... )` cards became `function Author()` and `function Items()`.

Note: brevity that leaves a line without its function costs the reader more than the two lines it saves. #2026_10_17_03_group_2

## Case 18: Sibling titles that do not mirror, and marks without claims (summary-figures Section 02B)

COUNTER-EXAMPLE (Lecture 11): "Make the cards" and "Keep each card with its article" as one division; "Key each card by its article's id" and "Put the key on the tag `map()` returns" as siblings; decision branches "✗ inside the child", "✗ the index".

PROPER EXAMPLE: "Create the cards" and "Update the cards when the list changes"; "Key from the article's id" and "Key on the tag `map()` returns"; "✗ key inside the child", "✗ key from the index".

Note: the owner proposed the symmetry and the creation/update split; the words chosen are the most accurate ones that keep the symmetry and stay plain. #2026_10_17_03_group_1

## Case 19: Data described in a comment instead of written as code (Section 11B) #2026_10_17_04_group_1

COUNTER-EXAMPLE (Lecture 10, `ArticleList.jsx`): the `park` object written in full, then one comment line for the second article, "// rain: title 'Rain Expected This Weekend', author 'Oliver Brooks', its own summary, isNew: false, commentCount: 0", above a `return` that passes `rain` to a card. Lecture 11's second `articles.js` did the same: the new article and the park article as code, then "// the rain and soups articles follow, unchanged".

PROPER EXAMPLE: `const rain = { ... };` written out like `park`, four lines with every field, so the two objects stand side by side and the reader compares `isNew: true, commentCount: 3` with `isNew: false, commentCount: 0` directly; and in Lecture 11, all four article objects, the new one first.

Note: the comment line saved four lines but made the reader assemble an object from a sentence, and it named "its own summary" without showing it. The rain card's values are the ones the lesson's later sections turn on (a card that is not new, with 0 comments), so they belong in code where the eye can find them. #2026_10_17_04_group_1

## Case 20: Labels that command the reader to do React's work (Section 06B) #2026_10_17_05_group_1

COUNTER-EXAMPLE (Lecture 1, first draft, the division tree, the "you are here" maps, the headings, and the Summary): "1. Describe what each element shows", "2. Read one variable in every place", "3. Compare descriptions on every change"; and in the decision trees "+Read one variable in curly braces { }" and "+Compare descriptions with the virtual DOM" beside "!Rebuild container with innerHTML". The owner: "IT confuses what the React (it compares) with what the learner needs to learn how to do (he does not compare anything). The title should be Virtual DOM comparison or something like that", and of "Read one variable in every place": "the junior or senior developer reading this is supposed to read something?"

PROPER EXAMPLE: the three steps named as ideas, each note with its actor as the subject: "1. Declarative programming | the component returns what each element shows", "2. A single source of truth | every place reads `{userName}`", "3. Virtual DOM comparison | React compares the new description with the last one and changes only the new text". The decision trees say who does what: "!Our code rebuilds the header with `innerHTML`" against "+React compares the new description with the last one"; and, where the developer really chooses, a command: "!Type a copy of the name as fixed text" against "+Write `{userName}` in every place".

Note: the commands that stay are the ones the reader will type. Everything React does keeps React as its subject, so the reader never looks for a step they are not meant to take. #2026_10_17_05_group_1

## Case 21: Examples carried over from the lecture instead of chosen anew (Section 03B) #2026_10_17_06_group_1

COUNTER-EXAMPLE (Lecture 1, first revision 3, archived as `01-2026-10-17-1651.md`): the lecture's story kept whole. The signed-in user Mary adds her family name in her profile and becomes Mary Brooks while "elections" is typed in the header's search box; the name change is made by editing `userName` in the file and saving. The principle boxes use `Greeting` with "John", then "John Hall", beside `SiteHeader` with "Mary", so a fact note has to say which name stands for which. The owner: "we see a weird example with elections, name becoming Mary Brooks, I do not get it."

HALF WAY EXAMPLE (Lecture 1, second draft, archived as `01-2026-10-17-1707.md`): a shoe shop's header with a search box holding "running shoes", the line "Your cart: 2 items", and a "Check out 2 items" button; the shopper adds a third item. The event is one everyone knows, and the boxes use the lesson's own names. But the code still builds strings, `'Your cart: ' + count + ' items'`, the `innerHTML` attempt is four lines joined with `+`, and the search box rides through every picture although only section 3 uses it.

PROPER EXAMPLE: a cart with "Items: 2" and a "Buy 2 items" button, and a click on "Add to cart". The plain JavaScript attempt is two lines, `const items = document.getElementById('items');` and `items.textContent = 'Items: 3';`. The note box joins the cart only in section 3, and the `innerHTML` attempt reads like the HTML it writes: `<p>Items: 3</p>`, `<input placeholder="Note to the shop">`, `<button>Buy 3 items</button>` inside one template literal.

Note: the three versions prove the same three principles with the same verified behaviour. Only the examples changed, and with them the effort the reader spends before reaching the concept. The owner: "When we transform a normal lesson into a revision 3, we need to RADICALLY RECONSIDER ALL EXAMPLES, ALL OF THEM!" #2026_10_17_06_group_1

## Case 22: The lesson opened on the example instead of the theory (Sections 03 and 04) #2026_10_18_01_group_1

COUNTER-EXAMPLE (Lecture 3, first revision 3): the title page; "## Example: moving an old site's article card into React", with the old HTML card beside the pasted card and its error overlay; "## The components behind the page"; then the two theory sections; then the principles. Its first tree read "Put an old page's markup on the page" over "In an HTML file" and "In a component, as JSX".

PROPER EXAMPLE (Lecture 3 rewritten): the title page; then, on its own page, the main title "React JSX Syntax" over "Two different ways to write markup" and "The React markup (JSX) vs Normal HTML"; then, on a new page, "Principles", followed at once by "1. Each tag becomes a call that returns an object"; the closing parts; the Summary on a new page; and, on a new page, the example and the components. The first tree reads "Two different ways to write markup" over "The normal HTML markup" and "The React markup (JSX): it is not simple HTML".

Note: the owner's words, in order: "chapter starts directly with theory that is clear"; "the comparisons must be VERY clear upon first reading, repetition can be a good thing"; "We need different kind of titles, some titles need the page break before"; "move in the end of the pdf, all the content from: Example [...] up until the start of the principles. Replace it with a simple title Principles (with page break before) and start directly with the principles".

## Case 23: A section example more complex than its principle, and a section off the route (Sections 03B and 07) #2026_10_18_01_group_2

COUNTER-EXAMPLE (Lecture 3, first revision 3, section 1): Principle 1's card shows `Greeting` returning `<p>Hello, John Hall</p>`; the section then switched to the old site's `<article>` card with two inner tags, a `className`, and an array of nested objects, all in one `App.jsx`. Section 2 opened with a fact on comments, unrelated to closing tags; its principle showed `Author`, and its case switched to the old site's `ArticleCard` with a library photo and a `className`; its explanation came after the comparison with no subtitle. Four leads said "We take the principle's own component, ...".

PROPER EXAMPLE (Lecture 3 rewritten): section 1 keeps `Greeting`, in `Greeting.jsx`, placed by `App` in `App.jsx`, and shows the page beside the two files, PARENT above CHILD. Then "Component Hierarchy", "Let's check our console log", and "What is the JSX transform?". Section 2 was rebuilt on the same route with all of its information kept, on its principle's `Author`. Each lead names the component and says what it does.

Note: the owner's words: "it makes me uncomfortable that the example is more complex and unnecessarily complex than the demo code provided inside the principle itself. [...] Is it really necessary to have a different example?"; "start with small separate components from lesson 1"; "I need now specific subtitles to be repeatable like pattern"; and, on "the principle's own component": "you do not name the principle's own component as if it is something the reader should remember?! never say this thing".

## Case 24: Descriptive paragraphs rewritten as normative ones (Section 14) #2026_10_18_01_group_3

COUNTER-EXAMPLE (Lecture 3, before the rewrite of its paragraphs): "Section 1 showed that each tag becomes a call, and that a call returns one value." And a setup: "Our example is a list with two items, in two files. `App.jsx` is the parent: it draws a list, `<ul>`, and places `Items` inside it. `Items.jsx` is the child: it returns the two list items, `<li>First</li>` and `<li>Second</li>`. Two tags side by side stop the build, so the two items need one root. The quickest root is a `<div>`:"

PROPER EXAMPLE (after): "Each tag becomes a call, and a call returns one value." And: "We want a list with two items. The list is in the parent, `App.jsx`. The items come from the child, `Items.jsx`. A component returns one root, so we wrap the two items in a `<div>`:"

Note: the owner asked first for the setups, "rewrite this in a more simplistic normative way", then: "similarly edit all other paragraphs in the text (rule)". All 41 paragraphs of the lesson were rewritten the same way: the point first, "we" as the one who acts, one fact per sentence, no section numbers.

## Case 25: An example title that named one symptom, not the cause (Section 07B) #2026_10_18_01_group_2

COUNTER-EXAMPLE (Lecture 3, section 4): "Example: let's group the items with a `<div>` (the row breaks!)", above a lead that teaches that CSS rules depend on the hierarchy of DOM elements.

PROPER EXAMPLE: "Example: let's group the items with a `<div>` (the CSS rules break!)", with the subtitle "Why does a `<div>` break the CSS rules?", the lead "Here, an extra `<div>` or `<section>` breaks the page's CSS rules.", and the tree label "the CSS rules for direct children break".

Note: three causes of the miss. The title was written from what the screen showed (the items stack), not from the mechanism. The headings were kept as fixed labels while the paragraphs under them were rewritten. And the "(it fails!)" pattern of the other titles was copied, which names what the reader sees: right for a build error, too narrow for a page whose CSS silently stops applying. The owner: "Why you cannot see this little subtle detail when writing titles?"

## Case 26: A cause explained in React's words, with nothing on the page to show it (Sections 03B and 07C) #2026_10_18_02_group_1

COUNTER-EXAMPLE (Lecture 11, the articles version, section 3): a reader types "Great news!" under the rain article, a new article is saved at the top of `articles.js`, and the typed text now sits under the park article. The explanation: "When a list is shown again, React matches each new element with a card it already built, keeps that built card, and changes only what differs, such as the title. With no key, it matches by position." The title said "the comment moves to another card".

HALF WAY EXAMPLE (the first box, in chat): "The tick lives in the checkbox on the page. Our emails array knows nothing about it. So the tick stays with whichever row React keeps. Without a key, React keeps rows by position."

PROPER EXAMPLE (Lecture 11, the inbox): the three windows (we tick the invoice, a new email arrives, we press Delete selected), then the box: "There are two lists." "Each list holds its own things." "The two orders are separate." "A new email arrives at the top of the array." "The rows on the page do not move by themselves." "Without a key, React cannot tell which row belongs to which email." "So the first row, the one with our tick, now shows "Lunch on Friday?"." "Oops: we press Delete selected." Closing: "The text follows the email. The tick stays with the row."

Note: three failures in a row, each fixed by the owner. In the articles version the picture contradicted the title: the comment never moved on the page, the titles did, and the eye followed the box and saw nothing happen. The cost was invisible too: a text under another title is a glitch, not a loss. The owner: "I do not understand what changes visually when the id is not properly assigned and why. It seems you want to teach something that is not evident, what exactly breaks." The inbox makes the cost real (an email deleted unread) and the action everyday (tick, then Delete). The first box then started one link too late: it never said that the array and the rows are two lists with separate orders, so "whichever row React keeps" had nothing to stand on. The owner: "We have the order of html elements. We have the order of elements in an array. These two are not the same. When the order of html elements change, this does not affect the order of the array. see? start again." Rebuilt from that fact, the chain lands without a gap: "Because of A we have B. Then due to B we have C. and oops... this happens."

## Case 27: Generic cards where the reader expected an app (summary-figures Section 02C) #2026_10_18_02_group_2

COUNTER-EXAMPLE (Lecture 11, the articles version): every browser showed white cards on a plain page, a heading "Latest Articles", and an empty comment box under each card.

PROPER EXAMPLE (Lecture 11, the inbox): every browser is a mail app in the manner of Gmail, with its top bar and Search mail field, the folders with Compose on the full-size page, tick boxes, the selected row in Gmail's blue, and the Delete selected button the code draws.

Note: the reader recognises an inbox before reading a word, and knows without being told what a tick and a Delete button do, so the stake needs no explanation. The owner, after choosing the inbox: "make a design figure that looks seductively like a gmail server (the browser app must fits ideally the theme, another rule)". The owner's reaction to the example's title, "How to delete the wrong email - this is amazing title to be honest", also opened a second form for example titles (`SKILL.md` Section 07B).

## Case 28: A closing line of shorthand, the nothingburger (Sections 07C and 14) #2026_10_18_03_group_1

COUNTER-EXAMPLE (Lecture 11, the box's second draft): "1. **There are two lists.** One is the `emails` array, in our code. The other is the row elements, on the page." ... "7. **So the first row, the one with our tick, now shows "Lunch on Friday?".**" Closing line: "**The text follows the email. The tick stays with the row.**"

PROPER EXAMPLE (Lecture 11, the box as rewritten): "1. **There are two lists, and they are not the same thing.** The first is the `emails` array, a variable in our JavaScript code: one email object per item ... The second is the list of HTML elements on the page, in the DOM: one `<label>` element per email object, with a checkbox inside it." "3. **The two lists must match one by one.** ... When the array changes, the HTML elements must change with it." "8. **So the first `<label>` element, the one with our tick, now shows "Lunch on Friday?".**" Closing line: "**The array and the HTML elements must match one by one. Without a key, React matches them by position, and the tick stays in the wrong HTML element.**" Then: "That is why each email object has an id."

Note: the draft had the right steps and the wrong words. "The email" stood for the object in the array in one step and for what the page shows in the next; "the row" stood for a line of the picture and for an HTML element; the closing line chained three such words and said nothing. The owner asked for the two things the reader already knows, a variable in the code and the elements in the DOM, named in full and repeated: "I asked you explicitly to stick to things the reader can understand: DOM element vs reactive variable (an array)", "A row? Means nothing. A row of DOM elements, means something", "An array as variable is [not] the same thing as the rows of DOM elements", and the point the id serves: "they should coincide one by one, when we change the one the other should change... that's why we need the ID in the first place!" The owner said "reactive variable"; in Lecture 11 `emails` is a plain imported array, not state, so the lesson calls it "a variable in our JavaScript code", which is exact for this reader.

## Case 29: Details of one member where two categories are compared (Sections 03B and 07C) #2026_10_18_04_group_1

COUNTER-EXAMPLE (Lecture 11, the box's third draft): "1. **There are two lists, and they are not the same thing.** The first is the `emails` array, a variable in our JavaScript code: one email object per item, such as `{ id: 1, subject: 'Invoice for March' }`. The second is the list of HTML elements on the page, in the DOM: one `<label>` element per email object, with a checkbox inside it." Every later step then spoke of "the first `<label>` element". The row component returned a `<label>`.

PROPER EXAMPLE (Lecture 11, the box as rewritten): "1. **The `emails` array and the DOM elements on the page are two different lists.** The `emails` array is a variable in our JavaScript code: an array of objects. The DOM elements are what the browser shows on the page. The `emails` array and the DOM elements should be linked one by one, but they are not the same thing." Every later step repeats "the `emails` array" and "the DOM elements on the page" in full. The row component returns a plain `<div>`.

Note: the draft repeated its terms, as Case 28 asked, but its terms were details of one member, not the categories. The `<label>` was an HTML nuance (a click on the text ticks the box) that the lesson never needed and never explained; the sample object and "HTML element" beside "DOM" added two more things to hold. The owner: "Imagine comparing earth people with aliens. And then saying, earth people like George from Washington that wears a costume... why on earth add any detail when in principle we need to compare two categories? Why add label and talk about the label? In the end of the day I have no clue why you use label in this example and this is not an intro for css nuances and html nuances? You could just use a div, why label? why complicate things? Just refer to DOM element as different from array variable of objects." Then: "I see you use HTML element in the text, not DOM element". A `<div>` row gives the same results, checked in React 19.3.1 with jsdom.

## Case 30: Sentences that point at the next figure, and an example item that needs a reason (Sections 14B and 03B) #2026_10_18_05_group_1

COUNTER-EXAMPLE (Lecture 11b, before): "These are two different lists:" above the two lists; between the two lists and STEP 01, "So when the order of one list changes, the order of the other does not follow. We may click in one DOM element, and the code may think we mean a different object in the array. The four steps below show what this does to a real inbox with no key:"; the email we tick is "Invoice for March", and in step 3 the user thinks "I didn't notice a thing. Delete!"

PROPER EXAMPLE (Lecture 11b, after): the opening paragraph ends "These are two different lists. So when the order of one list changes, the order of the other does not follow, and we may click in one DOM element while the code thinks we mean a different object in the array."; the two lists and STEP 01 follow with nothing between them; the email we tick is "🔥 FLASH SALE: Extra 15% off", with the thought "OK, another spam mail. Let me tick “🔥 FLASH SALE: Extra 15% off”, so I can delete it."; in step 3 the thought is "Delete."

Note: the colons told the reader to look at what was already in front of them, and the bridge sentence split the opening's idea from the figures that prove it. The owner: "Do not have this type of writing ending with : (add rule)", "Allow images to exist without leading sentence explicitly pointing to them", "Move this idea on top, as it polutes the space between". The invoice was a mail nobody would delete without a reason; a spam mail is deleted by everyone, so the action needs no explanation (Section 03B: recognition, not explanation). And a thought is as short as the moment: "Delete." The script draws the 🔥 with Apple Color Emoji, which makes Prince print "not a TrueType or OpenType font" while it still draws the glyph.

## Case 31: A story told in end states, then in steps (summary-figures Section 02D) #2026_10_18_06_group_1

COUNTER-EXAMPLE (Lecture 11, before): three small inboxes joined by arrows, "1. We tick the invoice", "2. A new email arrives at the top", "3. We press Delete selected", with the pills "never read" and "still here", then a paragraph under the row.

PROPER EXAMPLE (Lecture 11, after): the light blue think-aloud page, with the two lists side by side, four bands, a pointer on what is ticked and on what is clicked, the Row and id of every row, the strip with what the form sends, the deleted row drawn in its place, the user's handwritten thoughts, and a "Behind the scenes" note per step.

Note: the owner's corrections, in order. "It is not clear what was clicked, what was deleted, what stayed behind. It is minimalist and cryptic." A demo first: "before you add the instructions, create a demo for me to approve if it works". The comic: "be creative in how you place the image and the comments so the user can see clearly", then "the neobruttal design is too loud". The pointer: "instead of we ticked this, add an actual pointer with a balloon". The page: "make this particular page have background colour a light colour [...] on the left show each step in the browser, on the right [...] the user explaining what is done [...] the way one person thinks out loud", with the owner's own card as a model, Row numbers and id chips included. The words: "the design is spectacular but the explanation is very poor [...] the emails as an array of object, and the DOM representation of the same emails as a list of DOM elements. When we do not properly assign ID to the DOM elements, the two lists are not connected." And the ring: "the whole purpose is to show what movement is made, the actual movement of delete is not underlined here, not pointed in any shape or form." The steps of that path are kept in `04-01-md-revised-3/v1/archive/11b-*.md`.
