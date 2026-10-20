## 2. Every tag is closed: <img />

*What if not? The build stops, and nothing in the file runs*

```tree size=mini here="Every tag is closed"
Five rules for pasted HTML in a component
- Each tag becomes a call
  - A small letter: an HTML tag
  - A capital letter: our component
- Every tag is closed
- One root per return
- A Fragment when no box is wanted
- Attributes use JavaScript names
```

> [!FACT] Inside JSX markup, a comment is written in curly braces, `{/* like this */}`; in plain JavaScript lines, `//` works as usual. The boxes use both. An HTML comment, `<!-- ... -->`, pasted into JSX stops the build with "HTML comments are not allowed in modules".

> [!FACT] Some HTML tags can never hold anything inside them, such as `<img>`, `<br>`, and `<input>`. They are called **void elements**, and HTML lets them stay open, with no closing tag.

> [!PRINCIPLE]
> **Principle 2: Every tag is closed, `<img />` and `<br />` too**
>
> We close every tag, with a closing tag or with a slash. That includes tags that hold nothing, such as `<img />` and `<br />`.
>
> The build must know where each tag ends. A tag left open stops the build, and nothing in the file runs.
>
> *We should do this:*
>
> ```jsx
> function Author() {
>   return (
>     <section>
>       <img src="/john.jpg" ~alt="John Hall" />~ {/* Closed with a slash: the tag ends here */}
>       <p>John Hall<br />Boston</p>
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
>     <section>
>       <img src="/john.jpg" ~alt="John Hall">~ {/* **WRONG:** no slash: the build waits for </img> */}
>       <p>John Hall~<br>~Boston</p> {/* **WRONG:** the br is left open too */}
>     </section>
>   );
> }
> ```

Section 1 showed that each tag becomes a call. To write a call, the build must know where each tag's content ends. Here is an article card from the old site, with its photo, as the old site wrote it; only its `class` is already `className`, which section 5 explains:

```hierarchy
App | holds: the page
  ArticleCard | holds: the pasted card, with its photo | here: returns the card
notes:
`ArticleCard` returns the card from the old site, image included.
The `<img>` is written as HTML allows: open, with no closing tag.
We want: the photo and the title on the page.
```

```jsx title="ArticleCard.jsx" bad="4"
export default function ArticleCard() {
  return (
    <article>
      <img src="/library.jpg" ~alt="Library">~ {/* **WRONG:** no end: the build waits for </img> */}
      <h2 className="title">Library Hours</h2>
    </article>
  );
}
```

When `<img>` has no slash, the build stops; with the slash, the card appears. The two versions differ in one line:

::: row caption="The image left open, and the image closed with a slash. Compare the two pages."
::: col title="The image left open" tone=bad
```jsx
<img src="/library.jpg" alt="Library">
```
```overlay size=mini
message: [PARSE_ERROR] Expected corresponding JSX closing tag for 'img'.
 4 │ <img src="/library.jpg" alt="Library">
   │  ─┬─
   │   ╰─── Opened here
 6 │ </article>
   │   ───┬───
   │      ╰───── Expected `</img>`
```
With the image open, the build reads on to line 6, finds `</article>` where it expected `</img>`, and stops; the overlay points back to line 4, where the image opened. Nothing in the file runs.
:::
::: col title="The image closed with a slash" tone=good
```jsx
<img src="/library.jpg" alt="Library" />
```
```page size=mini
card: img=Library | title=Library Hours
```
With the slash, the photo and the title appear.
:::
:::

After an open tag, the build reads everything as that tag's content, until it finds the matching closing tag. HTML makes an exception for void elements; JSX makes none:

```chain caption="What the build reads after the image, in each version."
!`<img ...>` opens -> the `<h2>` becomes the image's content -> at `</article>`, it still waits for `</img>`: the build stops
+`<img ... />` closes at once -> the `<h2>` sits next to the image -> `</article>` closes the card
```

```tree dir=right caption="How each kind of tag is closed in JSX."
How is a tag closed in JSX?
- +a tag with content | a closing tag: <p>...</p>, <li>...</li>
- +a void element, which never holds anything | a slash: <img />, <br />
- +any other tag, when empty | a slash or a closing tag: <div />
- !a tag left open, as HTML allows | the build stops
```

