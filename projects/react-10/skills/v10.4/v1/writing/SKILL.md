---
name: writing-v1
description: "How to write a River lecture in React 10: the first draft and the final lecture. Read this file first and keep it in mind the whole time. It is short on purpose."
---

# Writing a River Lecture

## 1. The one instruction that matters most #2026_11_06_02_group_2 #2026_11_07_03_group_1 #2026_11_07_04_group_1

Write for a reader who knows what the earlier lessons taught and what this lecture has said so far, and nothing else. Lead them from there, one step at a time, so that every sentence grows out of the one before it.

Before you write a sentence, ask what the reader holds in mind at this moment:
- **What they do not know yet** must grow out of something they already hold. Start from the state of the component, the button they just clicked, or the sentence they just read, and add one new piece to it. The next sentence then picks up what this sentence gave them. When a new idea works like one they already know, bring it in through the known one, the way `onChange` comes in through `onClick`. Save the conclusion for the end, when the reader can almost say it before you do.
- **What they already know stays learned.** Once the opening or an earlier principle has anchored `name`, `setName`, `onChange`, or `e.target.value`, the reader holds it for the rest of the lecture. Later sections build on that knowledge and spend words only on what is new in that step. Re-explaining `useState` in every principle, or asking quiz questions about facts the reader learned two pages ago, breaks the flow just as badly as dropping a new name from nowhere.

So after every paragraph, read it as this reader. Does each sentence follow from the one before? Does it build on what the reader already knows without teaching the same thing twice? If not, rewrite it before you move on.

Be complete. Cover every point the topic needs, and look for the angle a learner would miss. Being short is never a reason to leave out a step.

**PROPER** (the owner's own version of the Lecture 20 opening, 2026-11-07, with two dashes turned into commas). It starts from the state the reader knows, and each sentence picks up the last one:

> Take another look at the code for the Clear button. As always in React, the story starts with state. We declare a variable, `name`, alongside its inseparable twin, `setName`, the function built to update it. They always travel as a pair, with a strict division of labor: when we want to show the name on the screen, we read `name`; when we need to change it, we call `setName`.
>
> * **`name`**: Use it to read and display the current name.
> * **`setName`**: Use it to update the name.
>
> Right out of the gate, `name` holds an empty string. Everywhere the page references `name`, it renders nothing. The input box is wired directly into this system: because its `value` is bound to `name`, the box starts out completely blank too.
>
> Now, think about how the browser listens to you. Click a button, and `onClick` fires, straightforward enough. Type inside an input box, and `onChange` fires, because every keystroke alters what is inside the box. Press **J**, and `onChange` triggers. Press **o**, and it triggers again, firing on every single letter until you have spelled out *John*.
>
> Our job is to wire those two events directly to our state. Every time you type in the box, that new text needs to land inside `name`. Every time you click the Clear button, `name` needs to be wiped clean. Here is how `onChange` and `onClick` divide the work:
>
> * **Typing updates the state:** Whenever you type in the input box, `onChange` fires. Inside `onChange`, we pass the text you just typed straight into `setName`.
> * **Clicking resets the state:** Whenever you click the Clear button, `onClick` fires. Inside `onClick`, we call `setName` with an empty string.
> * **React syncs the screen:** Every time `setName` changes `name`, React re-renders the page. The input box pulls its `value` fresh from `name`, immediately showing whatever `name` holds now.
>
> That is the real secret behind the Clear button. Our code never reaches into the page to erase the input box directly. It simply empties `name`, and because the input box is locked to `name` through `value`, the box clears itself automatically.

*Why this works*: The passage begins with `name` and `setName`, which the reader met in Lesson 12, and says again what each one does on this page. Each sentence then takes one step from the last: `name` starts empty, so the page shows nothing, so the box bound to `name` is blank too. `onChange` arrives through `onClick`, which the reader already trusts. The bullets show who does what, and the final paragraph states a conclusion the reader has already half seen.

**COUNTER-EXAMPLE** (Lecture 20 opening, written under `v10.4`):

> Now read the code of the Clear button again. Its handler calls `setName` with an empty string, and that is all it does. No line of our code touches the Name box. Yet the Name box is empty. So who emptied it?
>
> The two props on the Name box did it together. React supplies both of them on every input:
> - **`onChange`** takes our function, and React calls it every time the user changes the text in the box. Here our function saves the new text in `name`.
> - **`value`** tells React what the box must show. Here it says: show whatever `name` holds right now.

*Why this fails*: Each sentence is true, and each one is short, but they do not lead into each other. "Its handler calls `setName`" assumes the reader still has the code in mind and remembers what `name` is for. The question comes before the reader has been reminded that the box is tied to `name`, so the reader cannot guess the answer and is simply told it. `onChange` and `value` then arrive as two definitions, not as steps in a story, and nothing links `onChange` to `onClick`, the event the reader already knows.

**PROPER** (Lecture 20, Principle 1, right after the opening above). Because the reader already holds `name`, `setName`, and `onChange` from the opening, Principle 1 does not teach them again. It starts from what just changed on screen and zooms in on the one piece the opening did not unpack yet, `e.target.value`: #2026_11_07_04_group_1

> Look closely at the function inside `onChange`. How does it grab the letters you type?
>
> Whenever `onChange` fires, React hands your function the event object, `e`. Inside that object, `e.target` is the box the user just typed into, and `e.target.value` holds the full text sitting inside that box right now, with the newest letter already in it:
>
> - **Press J:** The browser puts J into the box, `onChange` fires, and `e.target.value` is J.
> - **Press o:** The browser adds o to the box, `onChange` fires again, and `e.target.value` is Jo.
>
> Our function passes that text straight to `setName`, and the greeting updates on every letter.

**COUNTER-EXAMPLE** (Lecture 20, Principle 1, rejected on 2026-11-07). Two minutes after the reader finished the opening, the writer pretends the reader has forgotten `name`, `setName`, and `onChange`: #2026_11_07_04_group_1

> Let's follow the line of thought behind that one prop. The greeting shows `name`. So whatever the user writes in the box must end up in `name`. If the user writes John, `name` must hold John.
>
> That gives us two questions. First, where is the text the user wrote? It is inside the box. When the user types, React hands our function an event object, `e`, and `e.target` is the box itself, so `e.target.value` is the text inside the box right now. Second, what changes `name`? Only one thing: `setName`.
>
> So we put one inside the other. We give the text inside the box, `e.target.value`, to `setName`, and `setName` puts it into `name`.

*Why this fails*: It ignores what the reader already knows from the opening. Asking "what changes `name`? Only one thing: `setName`" quizzes the reader on a fact they read two minutes ago. The one new thing in this section, `e.target.value`, is buried inside a slow-motion recital of how `setName` works.

The rest of this file shows what this means in practice.

## 2. Explain the code words this lesson is about, when the reader needs them #2026_11_06_02_group_3 #2026_11_06_03_group_1 #2026_11_07_04_group_1

New code brings new words. They are not all the same kind, so sort them before you write:
- **The lesson's own words**, such as `value`, `defaultValue`, and `onChange` in the lesson on controlled inputs. They carry the lesson. Explain each one in plain words: what it does and who provides it, the browser, React, JavaScript, or our own code. Explain it once, when the reader first needs it: usually right after the reader sees what it does on the page, or when the page does something strange and the reader asks why.
- **Words from an earlier lesson**, such as `useState` or `e.target`. The reader already knows them. When the chapter opening first builds on one of them, ground it on the page as the first step of the story, the way the Section 1 opening does with `name` and `setName`. After that first grounding, use known words directly. Never pad later sentences with repeated definitions such as "here the state is `message`, and the function that changes it is `setMessage`". #2026_11_07_03_group_2 #2026_11_07_04_group_1
- **Helper words** that the example needs but the lesson is not about, such as `classList` or `try` and `catch` in a lesson about state. First choose an example that does not need them. When one is still needed, a short comment or half a sentence is enough.

A code comment cannot teach the lesson's own words. A paragraph cannot make a helper word interesting.

**PROPER** (Lecture 09). The reader meets `children` for the first time, and the sentence says where it comes from and what it holds:

> In the second tag, you wrote no attribute name at all. Instead, you placed the greeting text directly between the opening and closing tags. Whenever you place anything between a component's opening and closing tags, React automatically puts all of it inside `props` under one reserved name: **`children`**. Here, `props.children` holds that greeting text.

**COUNTER-EXAMPLE** (Lecture 20, rejected on 2026-11-06). Five new words appear at once, and only the comments speak about them:

````markdown
```jsx title="Three ways to put John inside a name box"
const [name, setName] = useState('John');

<input ~defaultValue="John"~ /> {/* A. Starts with John, then keeps whatever the user types */}
<input ~value="John"~ /> {/* B. Shows John and refuses every new letter */}
<input value={name} ~onChange={e => setName(e.target.value)}~ /> {/* C. Shows whatever name holds in state */}
```
````

*Why this fails*: No sentence says what `value` does, what `onChange` is, or what `e.target.value` holds. The comments only give results. The reader sees that the box with `value="John"` refuses letters, but has no way to understand why.

**PROPER** (Lecture 20, the message box). The reader has just watched letters disappear and asks why. Only then does the text explain `e.target.value`:

> No line of our code removes the letters. So who removes them? React does. Here is what happens on every key, in order:

**COUNTER-EXAMPLE** (Lecture 20 opening, written under `v10.3`). Before the reader has seen the box with `onChange` do anything, one paragraph defines five code words, and two of them come from Lessons 11 and 12:

> Box C also has `value`, but its value is the variable `name`. So box C must show whatever `name` holds right now. Box C also has `onChange`. This is a function that React calls every time the user changes the text in the box. React hands it one thing, an event object, which we call `e`. Inside that object, `e.target` is the box itself, and `e.target.value` is the text that sits in the box at that moment, with the newest letter included.

*Why this fails*: It reads like a dictionary. The reader has no question yet, so the definitions have nothing to attach to. `e.target` and the setter are already known, and nothing in the paragraph makes the reader care.

## 3. Show what happens, step by step, when the result surprises #2026_11_06_02_group_4 #2026_11_06_03_group_2 #2026_11_07_05_group_1

When a single piece of code does something on screen that the reader would not predict, explain why. State what the screen shows and what our code did, ask the reader's question, such as "So who removes the letters?", and walk through the steps in the order they happen, one step per sentence. When there are three or more steps, use a numbered list. #2026_11_07_01_group_1

The steps show what the reader cannot see in the code: what the browser does, what React does, and what changes between two renders. A line the reader can already read needs no steps. When the result is just what the code says, one sentence is enough.

A result without its steps is not an explanation. "React puts John back after every key" tells the reader what happens. It does not tell them why. They cannot check it, so they cannot really believe it.

**PROPER** (Lecture 05). The reader cannot find `StoryCard` in the card file, and the text walks through what JavaScript does:

> Look closely at those two files. The word `StoryCard` does not exist anywhere inside our card file! Inside the card file, the function is still named `ArticleCard`. Why doesn't JavaScript complain that `StoryCard` is missing?
>
> Because the import line has **no curly braces**, JavaScript does **not** search the card file for a function named `StoryCard`. Instead, leaving out the curly braces tells JavaScript to do two simple steps:
> 1. Go to the card file and grab whatever single function is marked `export default`, which is `ArticleCard`.
> 2. Give that function the brand-new local nickname `StoryCard` inside our main file so we can render it as `<StoryCard />`.

**COUNTER-EXAMPLE** (Lecture 20, rejected on 2026-11-06):

> - **Box B and box C both write `value`, but they are NOT the same thing!** Box B has a fixed value, and nothing tells React about the typing. So React puts John back after every key the user presses.
> - **Writing `value="John"` and writing `value={name}` while the name is John are the exact same thing for the box.** In both cases, React makes the box show John. The curly braces do not make box C editable. The change handler does.

*Why this fails*: The reader gets the results, but not the steps. The missing steps are these. When the page draws the box, React writes the `value` into it. Then the user presses a key, and the browser shows the new letter for a moment. In the box with `value={name}` and `onChange`, React calls `onChange`, `setName` saves the new text in state, React draws the box again, and the box keeps the letter. In the box with only `value="John"`, there is no `onChange`, so nothing changes in state. React draws the box again with `"John"`, and the letter disappears. With these steps in place, the reader can see the results for themselves. The bullets also call the boxes "box B" and "box C", so the reader must look back to find out which box is which. #2026_11_07_01_group_2

**COUNTER-EXAMPLE** (Lecture 21, written under `v10.3`):

> The highlighted line looks dense, so here it is in order:
> 1. JavaScript reads the text in the box and counts its letters.
> 2. It checks whether that count is exactly 0. The answer is `true` or `false`.
> 3. It stores that answer in `applyButton.disabled`.

*Why this fails*: The reader asked no question, and the steps only read the line aloud. The lesson is about state, not about this line. One sentence was enough: the button stays off while the box is empty.

## 4. Write for the fast thinker and the impatient reader: lead with the essence, never with suspense #2026_11_06_02_group_4 #2026_11_07_05_group_1

A fast thinker reads at high speed and wants the point immediately. They cannot hold three or four unresolved concepts in working memory across several paragraphs while the text builds up a mystery to solve some lines later.

If you write *"We have A, and then we have B. A is not the same as B! Why? Well, let's explain..."*, you have already lost the fast thinker. Holding back the answer forces the reader to carry `A`, `B`, the page setup, and an unanswered question in their head with no anchor.

Find the essence first, and lead with it in clear technical or practical precision:
1. **Start with what `A` and `B` mean and why each one exists.** Open directly with: *"We have `A` and we have `B`. `A` is used for this reason, or means this. And `B` is used for this reason, or means this."* Give the impatient reader the exact frame in the first sentences.
2. **Follow with the logical-philosophical essence of what happens on the page, not a mechanical code-line recitation.** Once the reader holds what `A` and `B` mean, do not bore them by reading the code lines aloud again (*"In version A, `setName('')` sets `name` to `''`, and then..."*). Explain the logical reality between the browser and React state so the fast thinker sees *why* the two designs behave differently as a matter of principle.
3. **Never write cryptic token-swapping or ping-pong `A` and `B` inside prose; show each way directly with its code on its own lines.** A leading sentence such as *"On a `<select>` menu, `value` sits on the menu tag itself, never `selected` on an option"* or *"On a tick box, `checked` replaces `value`, and `e.target.checked` replaces `e.target.value`"* freezes the reader's mind. It treats code words like algebra (`A sits on X, never B on Y`; `C replaces A, and D replaces E`) before the reader has seen what each thing is, and then over-explains by repeating `A` and `B` back and forth in prose. Instead, state how the first way works in plain human words and show its code on separate lines; then state why the second way exists and show its code on separate lines. Never inline a multi-word tag such as `<option value="orange" selected>Orange</option>` inside a sentence. #2026_11_07_07_group_1

Name each piece of code by its one difference, such as "With `defaultValue`" and "With `value`". Do this every time you come back to them, not only the first time. "Both versions", "the left column", or "box B" sends the reader back to look for them. #2026_11_07_01_group_2

**PROPER** (Lecture 20, Principle 2, leading straight with the essence of `defaultValue` and `value`, followed by the logical reality of what happens on Clear): #2026_11_07_05_group_1

> React gives an input box two different props for its text, and each one does a different job:
>
> - **`defaultValue`** sets **only the starting text** when the box first appears. It is called `defaultValue` because all it holds is an initial default. And that is the catch with a default value: after that first render, its job is over. The box keeps whatever the user types inside the browser, and later changes to state never touch the box again. There is an initial default at the start, and then the connection between state and the box vanishes.
>
> - **`value`** locks the input box to what state holds right now, on every render. Paired with `onChange`, it works in both directions:
>   - → It **displays** the input box initially with the starting `value` from state.
>   - → It **updates the display** of the box every time that state changes.
>   - → And through `onChange`, it does the opposite as well: it **updates the state** itself whenever the user writes something in the box. This creates a complete two-way loop between the screen and state.
>
>   It is a win-win situation: state always knows what is in the box, and the box always shows what is in state.
>
> Now look at what happens when the user types *John* and clicks the **Clear** button:
>
> - **With `defaultValue`, the box and state live two separate lives.** They meet only once, when the page opens, and then go their own ways. The browser keeps its own copy of *John* inside the box, while React keeps *John* inside `name`. When the Clear button wipes `name`, React clears the greeting, because the greeting belongs to React. But the box is no longer listening to React, so *John* stays right where the browser left it.
> - **With `value`, the box has no separate life of its own.** It is a live mirror of `name`. The box never stores its own truth; it only reflects whatever `name` holds at this moment. So the instant the Clear button wipes `name`, the mirror goes blank too, and the box and the greeting clear as one.

*Why this works*:
1. **Zero suspense:** Within the first sentences, the fast thinker knows the exact job of `defaultValue`, an initial default that vanishes after the first render, and the exact job of `value` with `onChange`, a live two-way loop between state and the box.
2. **Logical-philosophical resolution instead of boring code recitation:** When the Clear button is clicked, the text does not repeat `setName` mechanics line by line. It gives the fast thinker the underlying mental model: two separate lives with `defaultValue` versus a live mirror with `value`.

**COUNTER-EXAMPLE 1** (suspense buildup that forces the reader to hold unresolved pieces in mind, rejected on 2026-11-07): #2026_11_07_05_group_1

> We have two versions of the same page. They differ in one word on the box. The first version uses `defaultValue`. The second version uses `value`.
>
> In both versions, the user types John. Both boxes show John. So far, there is no difference.
>
> Then the user clicks Clear. Clear puts an empty string into `name`.
>
> Look at the first version. The greeting now says only Hello. But the box still shows John.
>
> That is strange. `name` is empty, and the greeting shows it. So why does the box still show John?

*Why this fails*: Five paragraphs go by and the reader still has not been told what `defaultValue` or `value` means. The fast thinker is forced to hold two versions, two typing outcomes, a button click, and a riddle in working memory while waiting for the actual point to begin.

**COUNTER-EXAMPLE 2** (mechanical code-trace recitation after the definition, rejected on 2026-11-07): #2026_11_07_05_group_1

> - **In the `defaultValue` version**, `setName('')` empties `name`, so the greeting drops back to `Hello,`. Because `defaultValue` only set the starting text on the first render, React never writes the new empty `name` into the box, and **John** stays in the box.
> - **In the `value={name}` version**, `value` ties the box to `name` on every render. When `setName('')` empties `name`, React re-renders and writes that empty string into the box, so the box and the greeting clear together.

*Why this fails*: It merely repeats the definition in mechanical code-execution words (`setName('') empties name`, `React re-renders and writes that empty string`), rather than lifting the reader to the logical picture of why the two boxes live different lives.

**PROPER** (Lecture 20, Principle 4, approved by the owner on 2026-11-07). Instead of cryptic token-swapping or repeating `A` and `B` back and forth in prose, it states the static HTML way and shows the code, then states why React needs a dynamic way and shows the code, and then explains the tick box in the same direct voice: #2026_11_07_07_group_1

````markdown
### How a drop-down menu works in React

In plain HTML, you mark the starting choice of a drop-down menu in a static way, by adding the word `selected` inside one `<option>`:

```jsx title="The plain HTML way"
<select>
  <option value="orange" ~selected~>Orange</option> {/* **WRONG:** static HTML attribute, not supported in React */}
  <option value="apple">Apple</option>
</select>
```

In React, `selected` does not work because we need a dynamic way. We control the selection through our state variable `fruit`. If `fruit` starts as `'orange'`, then Orange is selected:

```jsx title="The React way"
<select ~value={fruit}~ onChange={e => setFruit(e.target.value)}> {/* Matches the option whose value equals fruit */}
  <option value="orange">Orange</option>
  <option value="apple">Apple</option>
</select>
```

When the user picks a different option from the menu, `onChange` runs, and `e.target.value` holds the value of the newly picked option for the setter.

### How a tick box works in React

A tick box does not hold text. It is either ticked or unticked, `true` or `false`.

Because its state is a boolean, we control the box with `checked` instead of `value`. Inside the handler, we read `e.target.checked`:

```jsx title="Controlling a tick box with boolean state"
<input type="checkbox" ~checked={agree}~ onChange={e => setAgree(~e.target.checked~)} /> {/* Displays the tick from agree, and reads the new true or false value */}
```

If `agree` is `true`, the box shows a tick. If `agree` is `false`, the box is blank. Whenever the user clicks the box, `e.target.checked` gives us the new true or false value.
````

**COUNTER-EXAMPLE 3** (cryptic token-swapping in leading sentences, rejected on 2026-11-07): #2026_11_07_07_group_1

> - **On a `<select>` menu, `value` sits on the menu tag itself, never `selected` on an option.** Each `<option>` has a `value` string for your code, such as orange, and label text between its tags for the user, such as Orange. Passing `value={fruit}` to the parent `<select>` highlights whichever option matches state. The change handler then reads the newly picked option's string from `e.target.value`. In plain HTML, you mark a chosen option by putting `selected` on that `<option>` tag. React does not support `selected` on an option and prints a red Console error.
> - **On a tick box, `checked` replaces `value`, and `e.target.checked` replaces `e.target.value`.**

*Why this fails*: Both bold leads are cryptic riddles ("`A` sits on `X`, never `B` on `Y`"; "`C` replaces `A`, and `D` replaces `E`"). They assume the reader holds every code word in mind like math symbols, announce what is not what before showing anything, and then bury the plain HTML explanation five sentences later without a code block.

**COUNTER-EXAMPLE 4** (over-explaining `A` and `B` in prose with inline code tags, rejected on 2026-11-07): #2026_11_07_07_group_1

> - **On a `<select>` menu, React does NOT use `selected` on an `<option>` to pick the active choice; instead, you pass `value` and `onChange` to the `<select>` tag itself.**
>   - **In plain HTML**, you mark the starting choice by writing the word `selected` inside one `<option>` tag, such as `<option value="orange" selected>Orange</option>`. React does not support `selected` on an `<option>` and prints a red Console error if you use it.

*Why this fails*: It repeats `selected`, `<option>`, `value`, and `<select>` over and over inside prose (`A and B and A and B and A is not B`), and stuffs a whole tag `<option value="orange" selected>Orange</option>` inline inside a sentence instead of putting the code on its own lines.

**PROPER** (Lecture 09). The verdict comes right at the start, and every claim immediately explains the structural reality inside `props`:

> Those two tags **are NOT the same thing!** Look at what `props` holds inside `MyComponent` in each case:
> - **In the first tag**, the three dots open the `article` box and place its three items directly inside `props`. When the component unpacks `{ title }`, it reads `props.title` and gets the park heading.
> - **In the second tag**, there are no three dots to open the box. React puts the entire closed object inside `props.article`. The title is now tucked one level deeper inside `props.article.title`. There is **no `props.title`** at all! So if the component asks for `{ title }`, that property is `undefined`.

## 5. Give a new idea a way in #2026_11_06_02_group_2 #2026_11_07_02_group_1

When an idea has a name, such as *spread*, *declarative*, *controlled*, or *default*, connect it to something from everyday life. Then come straight back to the code. Never explain a word with the same word.

**PROPER** (Lecture 09):

> Think of the `article` object as a closed box holding the title, the subtitle, and the content packed together. Normally, you would have to reach into the box and lay out each item on the tag one by one. With the three dots `...`, JavaScript opens the box and **spreads** all of its items out across the tag for you automatically.

**COUNTER-EXAMPLE** (rejected draft): "`{...article}` spreads every property of `article` onto `props`." It uses *spreads* to explain the spread.

Some ideas need a picture. Others need the fact that changes how the reader sees them: the **Angle** the map records for the principle. Build the passage on that fact, and let it explain what the reader saw on the page. This is where a lecture gets its character. The interest comes from the fact, so the sentences stay plain. #2026_11_07_02_group_1

Two tests decide whether a remark earns its place:
- **The other-lesson test.** Could the remark stand in any other lesson? Then it is a platitude. "React's `value` is the text in the box right now, not HTML's `value` attribute" belongs to this lesson only. "State is the single source of truth" fits every lesson about state.
- **The cut test.** Remove the remark. Does the reader lose a fact? If not, it is decoration. Cut it.

**PROPER** (Lecture 20, Principle 2, approved by the owner on 2026-11-07):

> If you have written plain HTML, the name `defaultValue` may bother you, because HTML has no attribute called that. In HTML, you write `<input value="John">`, and John is only the starting text. The user can type over it, and the attribute in the Elements panel still says John. The browser keeps two things apart: the starting text, which is what the `value` attribute holds, and the text that is in the box right now. In JavaScript, the browser even calls the starting text `input.defaultValue`.
>
> React keeps the same two things apart, but it renames them. What HTML calls the `value` attribute, React calls `defaultValue`. React uses the name `value` for the other thing: the text in the box right now. So the same line, `<input value="John">`, means two different things. In an HTML file, it sets the starting text. In JSX, it tells React that the box must show John after every render.
>
> That explains the Clear button. In the version with `defaultValue`, our code only ever set the starting text. When the user clicks the Clear button and `setName('')` empties `name`, our code has said nothing about the text in the box right now, so the box keeps John. In the version with `value={name}`, our code describes the text in the box right now. So when `name` becomes empty, React empties the box too.

**COUNTER-EXAMPLE** (a rejected rewrite of the same passage, 2026-11-07):

> One page, two answers. That is not a glitch. The page now stores the name twice. One copy is in `name`, which the Clear button just emptied. The other copy is inside the box, where the browser keeps whatever the user typed. The greeting reads the first copy. The box shows the second. Nobody told the second copy.
>
> And nobody will. `defaultValue` hands the box its starting text on the first render, and then React walks away.

*Why this fails*: The energy comes from effects, not from a fact. Short dramatic fragments, a punchline, "That is not a glitch", and "React walks away" try to sound lively. Remove every one of them, and the reader loses nothing. The owner called it AI slop.

**COUNTER-EXAMPLE** (invented):

> This is the magic of React: state is the single source of truth, and the UI simply follows.

*Why this fails*: It passes neither test. It fits any lesson about state, and cutting it loses no fact. "Magic" hides the mechanism the lesson exists to show.

## 6. Start with the simplest version, then the real page #2026_11_06_02_group_2

Open the chapter, and each principle, with the smallest code that shows the idea. Use simple names such as `John`, `count`, or `MyComponent`. Do not show the lesson's project files yet.

When the idea is something you can see on a page, such as an input, a list, or a button, show it in this order:
1. The browser when the page opens.
2. The code.
3. The browser after each thing the user does, such as typing or clicking.
4. When the result surprises, the steps that explain it, as in Section 3.

Only then move to the lesson's real page. Each lesson has its own example page, chosen in its map. A part of that page appears only in the principle that needs it.

When a rule is about order or combination, such as `{...article}` and `title="New Title"` on the same tag, first say that the two can go together. Then show both orders. Then walk through each order. Only then say which one wins.

## 7. How the sentences sound #2026_11_06_02_group_2

- Let each sentence follow from the one before. A sentence may carry its own reason with "because", "so", or "when", or a colon, when that is how the thought goes. Split a sentence when it glues together things that do not belong together, such as a reason, a choice, and a comparison at once. Short sentences that do not connect are as hard to read as long ones. #2026_11_07_03_group_2
- Use plain words. Write "the box shows John", not "the field's displayed value reflects the state".
- Talk to the reader like a patient friend. Questions such as "Where did the parentheses go?" are welcome.
- Write one short sentence before every code block. It says what the step accomplishes on the page, not how each line of code is wired.
- Let the code block carry the names. A sentence next to a block says what the step is for, using the parts the reader can picture: the box, the button, the error line. Translating the code block into prose, such as "it puts `delivery` into `topic` with `setTopic`, and `false` into `wantsReply` with `setWantsReply`", is still reciting. Cut it, or say what the step accomplishes. #2026_11_06_03_group_3 #2026_11_07_04_group_2
- Say a problem as soon as it appears. Never hold it back for suspense.
- Make every reference clear enough that it can point to only one thing: name the version by its one difference, the box by its label, the action as the user does it, and a principle by its number, such as "Principle 3", never "the next principle". Write "When the user clicks the Clear button", not "After Clear". #2026_11_07_02_group_2 #2026_11_07_04_group_2
- No parentheses in prose, headings, tables, or figures. Use a comma or a new sentence.
- No em dashes. Never break a paragraph across lines.

**PROPER** (an approved earlier version of Lecture 04, Principle 4):

> Now we want to add a comment box under each article card. Only the card uses this comment box. In plain JavaScript, you sometimes put a small helper function inside the function that uses it. So you might try to write the comment box **inside** the card.

**COUNTER-EXAMPLE** (rejected draft of the same paragraph):

> Suppose we add a comment box under each article card. Because the comment box is used only inside the card, a developer might be tempted to write the comment box function inside the card function, the way plain JavaScript sometimes puts a small helper inside another function.

*Why this fails*: A reason, a choice, and a comparison are glued into one long sentence. Every word is simple, and the sentence is still hard to read.

**COUNTER-EXAMPLE** (a rejected rewrite of Lecture 20, Principle 2, 2026-11-07):

> After Clear, this page remembers the name in two places, and the two places disagree.

*Why this fails*: "After Clear" names nothing. After the user clicks the Clear button, or after the developer adds it? "This page" could be either version on the page above. The reader has to guess, and often guesses wrong. #2026_11_07_02_group_2

**PROPER** (Lecture 04, Principle 1):

> **Where did the parentheses go?** Look at the last line above. With parentheses, our code calls the function right now. Without parentheses, we hand the function itself to the browser.

**COUNTER-EXAMPLE** (Lecture 21, written under `v10.3`):

> On the last line, `addEventListener` hands `handleSubmit` to the browser. The word `'submit'` names the event.

*Why this fails*: It describes the line and stops. The reader learns nothing that the code did not already show.

**The voice to aim for** (the owner's own rewrite of a Lecture 11 principle card):

> This can be a trap. If you use conditional rendering `{ length && list }`, the left side cannot be 0 otherwise it will show zero in the screen - yes the number zero will appear in your screen. You see, JavaScript stops at 0, and instead of returning false, it gives 0 to React, and React happily renders it in the screen, because for React 0 is a valid number to show!

## 8. The shape of a lecture #2026_11_06_02_group_1

A River lecture teaches each idea once, on one example that grows from Principle 1 to the last principle.

**Part 1, the start**
1. The title and the interview question:
   ```markdown
   # Lecture {NN}: [Chapter Title]
   > INTERVIEW QUESTION | ❱ CORE | [Exact question text from questions/questions.md]
   ```
2. The simplest version of the idea, as in Section 6.
3. The real page problem: a page where this idea is needed, and why.
4. The example page for this lesson, and any older idea the reader needs, in one or two sentences each. When the lesson uses several files, show them in a `files` panel.
5. A preview of the principles: `**PRINCIPLES:**` with a numbered list in plain words, then a table with the columns `| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |`. Do not use code names here that the lecture has not taught yet.

**Part 2, the principles.** Each one is `## N. Principle N: [Title]`, and it goes like this:
1. The simplest version of the idea.
2. The plain JavaScript it rests on, when it rests on some.
3. The example page grows by one step, with one sentence before each code block.
4. A principle card at the end. Its format is in [figures/SKILL.md](../figures/SKILL.md) Section 6.

When one principle explains how something is made and another explains how it is used, the making comes first.

**Part 3, the end**
1. `## Putting All [N] Principles Together`: the complete code once, a figure of the order in which React calls the components, and a summary table.
2. `## For the Interview`: `### How to Answer Clearly in 30 Seconds`, a spoken answer that covers every principle, then `### Three Classic Follow-Up Questions Interviewers Ask`.

**Headings and principle titles** say the idea in a few plain words. For `## N. Principle N: [Title]` and `### Principle N: [Title]` in the map, name one concrete action or fact on the page using the things the reader sees, such as the box, the key, state, a menu, or an empty string, and one direct verb, such as `Sends`, `Freezes`, or `Starts`. Never stuff the full conditional rule, a second clause, or abstract developer words such as `Synchronize`, `Persist`, `Initialize`, or `Ephemeral` into the title; the principle card and the body carry the full rule. #2026_11_07_06_group_1

| PROPER, from approved lectures | COUNTER-EXAMPLE |
| --- | --- |
| `## 1. Principle 1: onChange Sends Every Key into State` | `## 1. Principle 1: Replace Ephemeral Local Variables with useState So Changes Persist and Trigger a Re-Render` |
| `## 2. Principle 2: value Sends State Back into the Box` | `## 2. Principle 2: Every Render Gets Its Own Fixed Value, and Every Handler Keeps the Value of the Render That Made It` |
| `## 3. Principle 3: value Without onChange Freezes the Box` | `## 3. Principle 3: Passing a value Prop Without an onChange Handler Renders a Read-Only Input That Rejects User Keystrokes` |
| `## 5. Principle 5: A Controlled Box Starts with an Empty String` | `## 5. Principle 5: Initialize Controlled State with an Empty String Instead of undefined So the Input Never Switches Modes` |
| `### Why component names must start with a capital letter` | `### In React, a capital first letter is a compiler rule, not a style habit` |
| `### Default export vs. named exports` | `### A file can have only one default export, so a file with multiple components exports them by name` |
| `### Mistake 1: Forgetting {children} inside the component` | `### Mistake 1: Nesting tags inside the card tag without rendering {children} in the card file` |

## 9. Lectures to read before you write #2026_11_06_02_group_1

Read these for their sound, not for their topic:
- [Lecture 04](../../../../01-02-md-LECTURES/v1/04.md), the whole lecture.
- [Lecture 05](../../../../01-02-md-LECTURES/v1/05.md), the section *How to rename a component when importing it*.

Do not read anything from `projects/react-09`. Its older style leaks into the text.

## 10. Corrections after a lecture is built #2026_11_06_02_group_1

Make every later correction in `01-02-md-LECTURES/v1/{NN}.md` only. Then rebuild with `node src/build-river.mjs {NN}` from `projects/react-10`. Leave the map, the first draft, the HTML, and the PDF alone. If the build cannot draw something, fix the build script in `src/` and rebuild. Before any correction, show it to the owner as [edit-preview/SKILL.md](../../edit-preview/SKILL.md) describes. #2026_11_07_08_group_1

## 11. Before you finish, read it as the reader of Section 1 #2026_11_06_02_group_4 #2026_11_06_03_group_4

Read the lecture from top to bottom and ask:
1. Is every word this lesson is about explained in plain words, at the moment the reader needs it?
2. Does every surprising result come with the steps that cause it, named as the reader sees them on the screen? #2026_11_07_01_group_1 #2026_11_07_05_group_1
3. When comparing two props, patterns, or versions, does the text lead straight with the essence of what each one does before walking through the scenario, with no suspense buildup and each version named by its one difference? #2026_11_07_01_group_2 #2026_11_07_05_group_1
4. Does every sentence follow from the one before, and does each section build on what the reader already holds without re-teaching what an earlier section already taught? #2026_11_07_03_group_1 #2026_11_07_04_group_2
5. Does every browser preview show exactly what its code renders, and nothing else?
6. Does any sentence say again what the code block next to it says, translate its lines into "puts X into Y with setY", or explain a word the reader already knows or does not need for this lesson? Cut it. #2026_11_07_04_group_2
7. Does each principle that has an Angle in the map build on it, and does every strong remark pass the other-lesson test and the cut test of Section 5? #2026_11_07_02_group_1
8. Can every reference point to only one thing: the version, the box, the action, and the principle? #2026_11_07_02_group_2

If any answer is no, fix it before you finish.
