---
name: move-both-orders-first
description: "The move for two things on one tag where the order matters: show both orders before the rule."
---

# Both Orders First #2026_11_07_11_group_2

## When to use it

Use it when two things can sit on the same tag and the order changes the result, such as `{...article}` and `title="New Title"`.

## How to do it

1. Say that the two can sit on the same tag.
2. Show both orders, each with a comment that gives the result.
3. Say which one wins, and why.

## A good and a bad example

**PROPER** (Lecture 09):

````markdown
Can you write `{...article}` together with another attribute on the same tag? Yes. Then there are two ways to order them:

```jsx title="The two ways to order {...article} and title on the same tag"
<MyComponent ~{...article} title="New Title"~ /> {/* title comes last: "New Title" wins */}
<MyComponent ~title="New Title" {...article}~ /> {/* {...article} comes last: "Old Title" wins */}
```

JavaScript reads the attributes from left to right, and the one that comes last wins.
````

**COUNTER-EXAMPLE** (a rejected draft):

> If you write `{...parkStory}` after an attribute you wanted to change, the spread overwrites your new value!

*Why this fails*: The rule arrives before the reader has seen that the two can share a tag, or what the two orders look like.
