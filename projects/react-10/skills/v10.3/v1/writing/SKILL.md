---
name: writing-v1
description: "How to write a River lecture in React 10: the first draft and the final lecture. Read this file first and keep it in mind the whole time. It is short on purpose."
---

# Writing a River Lecture

## 1. The one instruction that matters most #2026_11_06_02_group_2

Write in B2 English for a reader who has a headache and little attention.

This reader is smart, but tired. They read each sentence once. They do not go back. If a sentence makes them stop and ask "what does that mean?", the sentence has failed.

So after every paragraph, ask yourself: would a tired reader understand this on the first read? If the answer is no, rewrite it. Do not move on.

Be complete. Cover every point the topic needs, and look for the angle a learner would miss. Being short is never a reason to leave out a step.

The rest of this file shows what this means in practice.

## 2. Explain every new piece of code the first time it appears #2026_11_06_02_group_3

New code brings new words, such as `value`, `defaultValue`, `onChange`, `e.target.value`, or `setName`. The first time a word appears, write one plain sentence that says what it is, what it does, and who provides it: the browser, React, JavaScript, or our own code. After that, the reader knows the word, and you can use it freely.

A code comment is not enough. A comment can say what happens on its line. It cannot teach a new idea.

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

*Why this fails*: No sentence says what `value` does, what `onChange` is, or what `e.target.value` holds. The comments only give results. The reader sees that box B refuses letters, but has no way to understand why.

## 3. Show what happens, step by step, in the order it happens #2026_11_06_02_group_4

When something happens on the screen, explain why. Walk through the steps in the order they happen, one step per sentence. When there are three or more steps, use a numbered list.

A result without its steps is not an explanation. "React puts John back after every key" tells the reader what happens. It does not tell them why. They cannot check it, so they cannot really believe it.

This matters most right after a browser preview. The preview shows the result first. The text below it must then show the steps that cause it.

**PROPER** (Lecture 05). The reader cannot find `StoryCard` in the card file, and the text walks through what JavaScript does:

> Look closely at those two files. The word `StoryCard` does not exist anywhere inside our card file! Inside the card file, the function is still named `ArticleCard`. Why doesn't JavaScript complain that `StoryCard` is missing?
>
> Because the import line has **no curly braces**, JavaScript does **not** search the card file for a function named `StoryCard`. Instead, leaving out the curly braces tells JavaScript to do two simple steps:
> 1. Go to the card file and grab whatever single function is marked `export default`, which is `ArticleCard`.
> 2. Give that function the brand-new local nickname `StoryCard` inside our main file so we can render it as `<StoryCard />`.

**COUNTER-EXAMPLE** (Lecture 20, rejected on 2026-11-06):

> - **Box B and box C both write `value`, but they are NOT the same thing!** Box B has a fixed value, and nothing tells React about the typing. So React puts John back after every key the user presses.
> - **Writing `value="John"` and writing `value={name}` while the name is John are the exact same thing for the box.** In both cases, React makes the box show John. The curly braces do not make box C editable. The change handler does.

*Why this fails*: The reader gets the results, but not the steps. The missing steps are these. When the page draws the box, React writes the `value` into it. Then the user presses a key, and the browser shows the new letter for a moment. In box C, React calls `onChange`, `setName` saves the new text in state, React draws the box again, and the box keeps the letter. In box B there is no `onChange`, so nothing changes in state. React draws the box again with `"John"`, and the letter disappears. With these steps in place, the reader can see the results for themselves.

## 4. Say "the same" or "not the same" only after the steps #2026_11_06_02_group_4

Learners often confuse two pieces of code. Some look different but do exactly the same thing, like `{...article}` and writing every prop by hand. Others look alike but act differently, like a component written inside another component and one written at the top of the file. Tell the reader clearly which case it is. But first show both pieces of code, and walk through what each one does. "They are NOT the same thing" ends the explanation. It does not replace it.

**PROPER** (Lecture 09). The verdict comes first here, but every claim is followed at once by what happens inside `props`:

> Those two tags **are NOT the same thing!** Look at what `props` holds inside `MyComponent` in each case:
> - **In the first tag**, the three dots open the `article` box and place its three items directly inside `props`. When the component unpacks `{ title }`, it reads `props.title` and gets the park heading.
> - **In the second tag**, there are no three dots to open the box. React puts the entire closed object inside `props.article`. The title is now tucked one level deeper inside `props.article.title`. There is **no `props.title`** at all! So if the component asks for `{ title }`, that property is `undefined`.

The Lecture 20 bullets in Section 3 are the counter-example here too. They say "NOT the same" twice and "the exact same thing" once, but they never show the steps.

## 5. Give a new idea an everyday picture #2026_11_06_02_group_2

When an idea has a name, such as *spread*, *declarative*, *controlled*, or *default*, connect it to something from everyday life. Then come straight back to the code. Never explain a word with the same word.

**PROPER** (Lecture 09):

> Think of the `article` object as a closed box holding the title, the subtitle, and the content packed together. Normally, you would have to reach into the box and lay out each item on the tag one by one. With the three dots `...`, JavaScript opens the box and **spreads** all of its items out across the tag for you automatically.

**COUNTER-EXAMPLE** (rejected draft): "`{...article}` spreads every property of `article` onto `props`." It uses *spreads* to explain the spread.

## 6. Start with the simplest version, then the real page #2026_11_06_02_group_2

Open the chapter, and each principle, with the smallest code that shows the idea. Use simple names such as `John`, `count`, or `MyComponent`. Do not show the lesson's project files yet.

When the idea is something you can see on a page, such as an input, a list, or a button, show it in this order:
1. The browser when the page opens.
2. The code.
3. The browser after each thing the user does, such as typing or clicking.
4. The steps that explain what happened, as in Section 3.

Only then move to the lesson's real page. Each lesson has its own example page, chosen in its map. A part of that page appears only in the principle that needs it.

When a rule is about order or combination, such as `{...article}` and `title="New Title"` on the same tag, first say that the two can go together. Then show both orders. Then walk through each order. Only then say which one wins.

## 7. How the sentences sound #2026_11_06_02_group_2

- One idea per sentence. When a sentence adds a reason or a second event with "because", "which", or "while", make it two sentences.
- Use plain words. Write "the box shows John", not "the field's displayed value reflects the state".
- Talk to the reader like a patient friend. Questions such as "Where did the parentheses go?" are welcome.
- Write one short sentence before every code block. It says what the block is about to show.
- Do not repeat the names of a code block in the sentence above it, unless a name is new. New names follow Section 2.
- Say a problem as soon as it appears. Never hold it back for suspense.
- No parentheses in prose, headings, tables, or figures. Use a comma or a new sentence.
- No em dashes. Never break a paragraph across lines.

**PROPER** (an approved earlier version of Lecture 04, Principle 4):

> Now we want to add a comment box under each article card. Only the card uses this comment box. In plain JavaScript, you sometimes put a small helper function inside the function that uses it. So you might try to write the comment box **inside** the card.

**COUNTER-EXAMPLE** (rejected draft of the same paragraph):

> Suppose we add a comment box under each article card. Because the comment box is used only inside the card, a developer might be tempted to write the comment box function inside the card function, the way plain JavaScript sometimes puts a small helper inside another function.

*Why this fails*: A reason, a choice, and a comparison are glued into one long sentence. Every word is simple, and the sentence is still hard to read.

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

**Headings** say the idea in a few plain words.

| PROPER, from approved lectures | COUNTER-EXAMPLE |
| --- | --- |
| `### Why component names must start with a capital letter` | `### In React, a capital first letter is a compiler rule, not a style habit` |
| `### Default export vs. named exports` | `### A file can have only one default export, so a file with multiple components exports them by name` |
| `### Mistake 1: Forgetting {children} inside the component` | `### Mistake 1: Nesting tags inside the card tag without rendering {children} in the card file` |

## 9. Lectures to read before you write #2026_11_06_02_group_1

Read these for their sound, not for their topic:
- [Lecture 04](../../../../01-02-md-LECTURES/v1/04.md), the whole lecture.
- [Lecture 05](../../../../01-02-md-LECTURES/v1/05.md), the section *How to rename a component when importing it*.

Do not read anything from `projects/react-09`. Its older style leaks into the text.

## 10. Corrections after a lecture is built #2026_11_06_02_group_1

Make every later correction in `01-02-md-LECTURES/v1/{NN}.md` only. Then rebuild with `node src/build-river.mjs {NN}` from `projects/react-10`. Leave the map, the first draft, the HTML, and the PDF alone. If the build cannot draw something, fix the build script in `src/` and rebuild.

## 11. Before you finish, read it as the tired reader #2026_11_06_02_group_4

Read the lecture from top to bottom and ask:
1. Is every new code word explained in a sentence the first time it appears?
2. Does every result on the screen come after the steps that cause it?
3. Does every "the same" or "not the same" come after the steps?
4. Can every sentence be understood on the first read?
5. Does every browser preview show exactly what its code renders, and nothing else?

If any answer is no, fix it before you finish.
