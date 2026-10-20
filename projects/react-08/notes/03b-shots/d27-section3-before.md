## 3. One root per return

*Why? Each component creates a JS function that returns one value*

```tree size=mini here="One root per return"
Five rules for pasted HTML in a component
- Each tag becomes a call
  - A small letter: an HTML tag
  - A capital letter: our component
- Every tag is closed
- One root per return
- A Fragment when no box is wanted
- Attributes use JavaScript names
```

> [!PRINCIPLE]
> **Principle 3: One root per return**
>
> A component returns one root: one element, or a Fragment as section 4 shows, that holds the rest.
>
> Each tag is one call, and so one value. Two values side by side, with nothing joining them, are not valid JavaScript, so two tags side by side stop the build. This holds wherever JSX stands: after `return`, or in a variable.
>
> *We should do this:*
>
> ```jsx
> function Author() {
>   return (
>     ~<section>~ {/* One root holds both tags */}
>       <h2>John Hall</h2>
>       <p>Author of 12 articles</p>
>     </section>
>   );
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function Author() {
>   return (
>     <h2>John Hall</h2>
>     ~<p>Author of 12 articles</p>~ {/* **WRONG:** a second root: the build stops */}
>   );
> }
> ```

Every tag is now closed. A card on the old site has no `<article>` around it, only a heading and a paragraph:

```hierarchy
App | holds: the page
  ArticleCard | holds: a heading and a paragraph | here: returns them
notes:
`ArticleCard` returns the two tags from the old card, as they were.
In the HTML file, the two tags sat side by side, with nothing around them.
We want: the heading and the paragraph on the page.
```

When the two tags stand side by side after `return`, the build stops; with one element around both, the card appears:

::: row caption="Two tags side by side after return, and the same tags inside one article. Compare the two pages."
::: col title="Two tags side by side" tone=bad
```jsx
return (
  <h2>Library Hours</h2>
  ~<p>Open until nine.</p>~ {/* **WRONG:** a second root: the build stops */}
);
```
```overlay size=mini
message: Adjacent JSX elements must be wrapped in an enclosing tag.
help: Did you want a JSX fragment <>...</>?
```
With two tags side by side, the build stops, and nothing in the file runs.
:::
::: col title="One `<article>` around both" tone=good
```jsx
return (
  ~<article>~ {/* One root around both: the build passes */}
    <h2>Library Hours</h2>
    <p>Open until nine.</p>
  </article>
);
```
```page size=mini
card: title=Library Hours | text=Open until nine.
```
With one element around both, the card appears.
:::
:::

```chain caption="Why two tags side by side stop the build."
!two tags after `return` -> two calls, so two values side by side -> nothing joins them, so it is not valid JavaScript: the build stops
+one `<article>` around both -> one call, whose content holds the other two -> one value: the card appears
```

The two inner calls become the content of the outer one: in the object of `<article>`, `children` holds the objects of the `<h2>` and the `<p>`, where in section 1 it held the greeting's text. The overlay's help line points at a second way to give one root, which section 4 takes up.

