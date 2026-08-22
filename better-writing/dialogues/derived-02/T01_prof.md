# T01 — Professor

Before we start, one sentence from the last lesson, because everything today is built on it: reading a signal is the moment the signal learns about you, writing a signal is the moment everyone who learned about it gets called, and a single shared flag says who is currently running. Read subscribes, write notifies. With that on the table, the topic today is the derived rune, the value that computes itself from other values, like a spreadsheet cell with a formula. And the claim I want you to push back on is this: the derived rune and the watch rune are not the same thing, even though they look like they do the same job.

[slide]

## THE ONE RULE, RESTATED

```js
// reading a signal adds whoever is running to its private list
// writing a signal calls everyone already on that list
// one shared flag (we called it flagged_function) says who is running
```

[/slide]

That is the foundation. The derived rune is built on top of it. I am not going to tell you how yet. Tell me why a derived and a watch cannot possibly be the same.
