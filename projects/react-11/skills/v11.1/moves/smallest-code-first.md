---
name: move-smallest-code-first
description: "The move for opening a lecture or a principle: the idea in its smallest code, before any project file."
---

# Smallest Code First #2026_11_07_11_group_2

## When to use it

Use it at the start of every principle, before the lesson's project files appear. #2026_11_08_03_group_2 #2026_11_12_04_group_2

## How to do it

1. Show the idea in the fewest lines that show it. Use simple names such as `MyComponent`, `John`, or `count`.
2. When the example has enough information on the screen for a browser preview to help, such as a list and a count line or a form control, show the browser directly before the code, and again after a user action when the screen changes. Skip the browser when the example has too little to show on a screen, such as one `<p>{text}</p>` line or an attribute on `<MyComponent />`. #2026_11_09_03_group_1
3. Only then move to the lesson's example page.

## A good and a bad example

**PROPER** (Lecture 09, the `children` prop):

````markdown
```jsx title="Two ways to pass information into MyComponent"
<MyComponent ~name="John"~ /> {/* On the opening tag: React puts "John" in props.name */}
<MyComponent>~My name is John~</MyComponent> {/* Between the tags: React puts it in props.children */}
```

Whenever you place anything between a component's opening and closing tags, React puts all of it inside `props` under one reserved name: `children`.
````

**COUNTER-EXAMPLE** (a rejected Lecture 09 draft): the first `children` example sat inside `ArticleCard.jsx`, `ArticleList.jsx`, and `Badges.jsx`, with five props and two badge components.

*Why this fails*: The reader had to keep three files and five props in mind before seeing one simple rule.
