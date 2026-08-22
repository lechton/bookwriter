# 04 · A Getter Is A Property That Is A Function — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/04-getter.png`.

- **Concept (shot #4):** A getter runs a function on a plain property read.
- **Source:** digest §3, *Getters And Setters: When A Property Is Secretly A Function*; underlies the signal's `get`.
- **Why it earns a card:** one property read fans out into a four-step runtime sequence (plain read → accessor → function runs → value returned) — a genuine flow.

---

## Block 1 — Code · "A GETTER: A PROPERTY THAT IS A FUNCTION"

```js
const article = {
  body: "Markets rallied across Asia today",

  get readingTime() {          // secretly a function
    const n = this.body.split(" ").length;
    return Math.ceil(n / 200) + " min read";
  },
};

article.readingTime;   // "1 min read"  — no parens
```

- **Highlighted line:** `get readingTime() {` — a property declared as an accessor, secretly a function.
- **Boxed tokens:** `get` (on the declaration) and `readingTime` (on the read line).

## Block 2 — Execution Flow · "PROPERTY READ FLOW"

- **Stage 1 — A plain-looking read.** `caller writes` `article.readingTime`. Note: "No parentheses — it looks like fetching a stored slot."
- **Stage 2 — The slot is an accessor.** `readingTime` → `marked get` `call a function`. Note: "Marked get, so JS runs code instead of returning a value."
- **Stage 3 — The function runs.** `body.split(" ").length` → `Math.ceil(5 / 200)`. Note: "Counts the words in body, fresh, on every read."
- **Stage 4 — A value comes back.** → `returned` `"1 min read"`. Note: "Caller gets a string, never knowing code ran — and it can't go stale."

## Block 3 — Summary

A getter is **a property that is secretly a function**: reading it **runs code instead of fetching a stored value**, with no parentheses at the call site, so it can never go stale. And it is **the first rung of interception** — a read can run code, so a read can be made to quietly do `bookkeeping`.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
