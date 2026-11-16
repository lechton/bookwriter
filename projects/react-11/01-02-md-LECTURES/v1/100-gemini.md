# Lecture 100: How Old Code Reached into Children: cloneElement, the Children Methods, and defaultProps

*(How did old React code give a child a prop that the page never wrote?)*

> INTERVIEW QUESTION | LEGACY | What were cloneElement, the Children utilities, and defaultProps for, and why were they abandoned?

---

## VS | Copying the Children with `cloneElement` vs. Passing the Value in Plain Sight: the same screen, but only one shows where the value comes from

> In standard React, parent components pass values to children by declaring explicit props on child tags. **Legacy code often bypassed explicit props by copying children using `cloneElement` and injecting extra props dynamically**. Both approaches render identical markup, but hidden prop injection obscures data flow and causes fragile runtime bugs during everyday refactorings.

In React, data flows unidirectionally through explicit props. When you inspect `<Song title="Yesterday" />`, every prop passed to that component appears directly on its JSX tag. When a wrapper component surrounds nested elements, it receives those element descriptors through its `children` prop (Lesson 09).

Older React applications frequently injected props into child elements without declaring them at the call site. The parent intercepted `children`, cloned each element with `cloneElement`, and attached extra props to the copies. React supplied `Children` helper methods to iterate across those opaque child descriptors. During the same era, components declared default prop fallbacks using `defaultProps`. Because modern teams still maintain established codebases, you will encounter all three legacy patterns in production.

Consider an audio player with an Up next queue. Three songs appear stacked in sequence with a Next button underneath. The currently active track displays a highlighted background. Which component manages the active song? Only the parent list component holds the active index in state. The child song tags declared in the consumer JSX have no built-in knowledge of that active index.

**Why:** Implicit prop cloning functions properly only until someone refactors the markup. When a developer groups two songs into a helper component, the highlight breaks silently while the underlying bug resides in an untouched file. Upgrading to React 19 introduces further surprises, as function components silently ignore legacy `defaultProps` and display empty text. Maintaining and modernizing older code requires understanding the physical mechanics and pitfalls of these deprecated APIs.

### The Same Prop, Written Two Ways

Here is the same song with `isPlaying`, written two ways:

```jsx title="Writing isPlaying on the tag, and adding it with cloneElement"
<Song title="Yesterday" ~isPlaying={true}~ /> {/* The page writes the prop itself */}
~cloneElement~(<Song title="Yesterday" />, { isPlaying: true }); // A function call adds the prop to a copy
```

At runtime, both approaches produce the identical result. Both lines evaluate to a `Song` element descriptor with the title property set to Yesterday and the `isPlaying` flag set to true.

For engineers maintaining the codebase, the two approaches differ completely. In the first line, `isPlaying` appears directly on the JSX tag where any reader can trace it. In the second line, a function call inside a parent component injects `isPlaying` behind the scenes. React official documentation emphasizes that this implicit cloning pattern obscures data flow and complicates debugging.

> [!DEFINITION]
> **What is a React element?** [REVIEW] A JSX tag compiles into a lightweight JavaScript object called an element descriptor. For example, `<Song title="Yesterday" />` compiles to `{ type: Song, props: { title: 'Yesterday' } }`. React elements are immutable descriptions of UI rather than live DOM instances. Once created, their properties cannot be altered directly. Adding a new prop requires constructing a fresh element object (Lesson 76).

> [!DEFINITION]
> **What is the children prop?** [REVIEW] Any JSX placed between the opening and closing tags of a component arrives inside that component as `children`. When a parent wraps three `<Song>` tags, the parent receives those three element descriptors inside its `children` prop. The parent can render them directly using `{children}` without modifying their internal props (Lesson 09).

```tree caption="Two ways a Song gets isPlaying: written on the tag by the page, or added to a copy inside Playlist."
Where `isPlaying` comes from
- +Written on the tag [`isPlaying={true}`] | The page **writes the prop itself** | Anyone who reads the page **sees where it comes from**
- !Added by `cloneElement` [`cloneElement`] | `Playlist` **adds the prop to a copy** | The reader of the page **cannot see it**
```

### The Rule of Thumb: can you see where the value comes from?

**Ask one core question about every prop: can you inspect the JSX call site and immediately see where the value comes from? Legacy code hid prop assignments inside cloned elements. Modern React architecture passes values in plain sight using render props or context.**

Four distinct patterns exist for coordinating active state between the playlist and its songs:
1. **`Children.map` with `cloneElement`.** The legacy approach. Both utilities are classified as Legacy React APIs today (Lesson 98). React exports them for backward compatibility, but discourages them in new applications.
2. **A render prop.** The playlist component calls a function prop for each song and supplies `isPlaying` as an explicit parameter (Lesson 89). React documentation recommends render props over cloning because data flow remains explicit.
3. **Context.** The parent provides `isPlaying` through a context provider, and each `Song` component reads that context directly (Lesson 28).
4. **A custom Hook.** The Hook isolates state management logic, leaving the consuming component to declare all markup directly (Lesson 39). Modern teams choose custom Hooks when UI requirements vary widely across screens.

```tree caption="Four ways to tell each Song whether it plays, from the old way to the ways React recommends today."
Four ways to pass "this song plays" from `Playlist` to each `Song`
- !1. Copy the children [`Children.map` `cloneElement`] | **Legacy**: met in old code | The page **never sees** `isPlaying`
- +2. A render prop [`renderSong`] | `Playlist` **hands the value to the page** | The page **writes** `isPlaying` itself
- +3. Context [`PlayingContext`] | `Playlist` **provides** the value | `Song` **reads it itself**
- +4. A custom Hook | Keeps **only the logic** | The page writes **all the markup**
```

Senior engineers also recognize four areas where developers frequently make mistakes:
1. **`Children` and `children` represent different concepts.** `Children` with a capital letter is a utility object exported by React. The lowercase `children` prop represents the standard property containing nested JSX elements.
2. **`cloneElement` never mutates the original element.** It returns a fresh element descriptor while the original element object remains unchanged.
3. **`Children.map` does not inspect nested component output.** It traverses only the immediate element descriptors declared between the parent component tags.
4. **`defaultProps` and default parameter values are not interchangeable.** In React 19, function components completely ignore `defaultProps`, making ES6 default destructuring mandatory.

This lesson teaches you to analyze older code patterns and refactor them safely. It does not recommend introducing legacy cloning utilities or `defaultProps` into new projects.

## SECTION | The Up Next List of a Music App

Our example features an Up next queue containing three songs and a Next button. When the screen loads, the first track displays an active highlight.

```page caption="The Up next list when the page opens: Yesterday is the highlighted song."
heading: Up next
line: Yesterday: The Beatles | good
line: Imagine: John Lennon
line: Hey Jude: The Beatles
line: [Next]
```

When the user clicks Next, the highlight transitions from Yesterday to Imagine.

```page caption="After the user clicks Next once: the highlight moves to Imagine."
heading: Up next
line: Yesterday: The Beatles
line: Imagine: John Lennon | good
line: Hey Jude: The Beatles
line: [Next]
```

Now examine how the consuming component renders this list in JSX. The caller places three song elements between the playlist tags:

```jsx title="The page writes three songs between the Playlist tags"
~<Playlist>~ {/* None of the three tags below says which song plays */}
  <Song title="Yesterday" artist="The Beatles" />
  <Song title="Imagine" artist="John Lennon" />
  <Song title="Hey Jude" artist="The Beatles" />
</Playlist>
```

Only the playlist component tracks which track is currently playing. How does each song element discover whether it is the active one? Answering that design problem forms the core of this lesson.

A CSS class named `playing` provides a distinct background color. That background rule produces the visible highlight for the active song.

```files title="up-next: File Explorer" caption="The files of the Up next list at the end of the lesson, inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | parent | Exports `App` as default and renders `Playlist`
  Playlist.jsx | parent | Exports `Playlist` as default and holds `playingIndex` in state
  Song.jsx | child | Exports `Song` as default and renders one row of the list
  songs.js | data | Exports `songs`, the array of songs, from Principle 4 on
  PlayingContext.js | context | Exports `PlayingContext`, from Principle 5 on
  styles.css | styles | Gives the `playing` class its colored background
```

Our queue implementation evolves through six clear stages:
1. In Principle 1, `cloneElement` copies an individual song element in isolation.
2. In Principle 2, `Playlist` clones all three songs using `Children.map`.
3. In Principle 3, extracting two songs into a helper component breaks the active highlight.
4. In Principle 4, song items become structured data, and the playlist accepts a render prop.
5. In Principle 5, a dedicated context delivers `isPlaying` to each song row.
6. In Principle 6, an untagged track lacks artist metadata, requiring a fallback default.

**PRINCIPLES:** Legacy architectures hid props inside cloned copies. Modern React design passes data openly where developers can trace it. Six fundamental principles guide this transition:
1. **`cloneElement` shallowly merges props into a new element.** The original element remains untouched, while properties supplied in the clone call overwrite existing props.
2. **`Children.map` iterates safely across opaque child collections.** It handles a single child, multiple children, or empty slots without throwing array runtime errors.
3. **`Children.count` evaluates only immediate JSX descriptors.** It cannot inspect components like `<MoreSongs />`, meaning extracted child components disrupt index counting.
4. **A render prop makes prop binding visible at the call site.** `Playlist` invokes `renderSong` with the track object and its active boolean flag.
5. **Context delivers values through intermediate wrappers.** `Song` reads its active status directly from context without requiring prop drilling.
6. **React 19 ignores `defaultProps` on function components.** Default values must be declared directly in the destructuring parameter list.

---

## PRINCIPLE | `cloneElement`: a new element with extra props, and the original stays the same

> [!PRINCIPLE]
> **Principle 1: Cloning: `cloneElement` Returns a New Element and Leaves the Original Alone**
>
> *`cloneElement(element, props)` returns a new element with the same type; each prop in `props` replaces the prop of the same name, and the original element does not change.*
>
> Legacy code used `cloneElement` to inject props into elements without declaring them on the original JSX tag. Because React elements are immutable objects, the original element remains unmodified, and the component must render the returned copy. When the original tag and the clone call supply the same prop, the value provided to `cloneElement` overrides the original.
>
> **DO THIS:**
> ```jsx
> function PlayingSong({ song }) {
>   const playing = cloneElement(song, { isPlaying: true });
>   return ~playing~; // Renders the copy, which has isPlaying
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function PlayingSong({ song }) {
>   cloneElement(song, { isPlaying: true });
>   return ~song~; // **WRONG:** song never got isPlaying, and the copy was thrown away
> }
> ```

Recall how object spread syntax works in standard JavaScript (Lesson 17). Writing `{ ...item, giftWrap: true }` constructs a fresh object containing all existing fields plus the updated property. The `cloneElement` function performs the identical role for React element objects:

```jsx title="Copying one Song element with cloneElement"
import { cloneElement } from 'react';

const song = <Song title="Yesterday" />;
const playing = ~cloneElement(song, { isPlaying: true })~; // A new element: the props of song, plus isPlaying
```

Now compare the props objects stored on the original element and the copy:

```js title="The props of the original and of the copy"
~song.props~; // { title: 'Yesterday' }: the original has no isPlaying
~playing.props~; // { title: 'Yesterday', isPlaying: true }: only the copy has it
```

Why must React create a copy? React elements are immutable data structures frozen after creation (Lesson 76). Because React prohibits mutating an element in place, `cloneElement` constructs a brand new element object based on the original:
1. **Shallow property merging.** It copies all existing properties from `song.props` and overlays the new props on top. Any property passed to the clone call replaces an existing property of the same key, while unrelated properties remain untouched.
2. **Metadata preservation.** The cloned element retains the component type, the `key`, and any attached `ref` from the original element.
3. **Element immutability.** The original `song` element remains completely unchanged in memory. Only the returned copy receives `isPlaying`.

### When the tag already sets `isPlaying`, the call wins

What happens if the JSX tag already declares `isPlaying`? When the two values collide, the value passed to `cloneElement` takes precedence:

```jsx title="The tag says false, and cloneElement says true"
const song = <Song title="Yesterday" ~isPlaying={false}~ />; // The tag sets isPlaying to false
const playing = cloneElement(song, { ~isPlaying: true~ }); // The copy gets true, and true wins
```

React documentation describes this behavior as prop overriding. The newly constructed element prioritizes whatever properties you pass in the second argument of the clone call.

This precedence rule frequently misleads developers maintaining legacy codebases. On the playlist screen, the parent component clones each song element with `isPlaying`. Suppose an engineer wants to test how the Yesterday track looks in an unplayed state:
1. The developer inspects the App component to locate where `isPlaying` is configured. The JSX tag displays only title and artist attributes.
2. The developer adds `isPlaying={false}` directly onto that JSX tag.
3. The Yesterday row unexpectedly remains highlighted on screen. The parent component clones the element and overwrites `isPlaying` with its internal state.

The component ignores the prop explicitly written on the tag, and the underlying explanation resides in an entirely separate file.

### The second and the third argument

The `cloneElement` function accepts three parameters. The second argument accepts a props object or `null`, while the third argument supplies replacement children:

```jsx title="cloneElement with null as the props, and with new children"
cloneElement(song, ~null~); // No new props: the copy keeps every prop of song
cloneElement(song, null, ~'Goodbye'~); // New children: the children of the copy are 'Goodbye'
```

When you omit the third argument, the cloned element preserves the existing children of the original. The first parameter must always be a valid React element. Older codebases frequently verified this prerequisite using `isValidElement` before attempting a clone (Lesson 76).

---

## PRINCIPLE | `Children.map`: calls your function for every child, even when there is only one

> [!PRINCIPLE]
> **Principle 2: Walking Through Children: `Children.map` Calls Your Function for Every Child**
>
> *`Children.map(children, fn)` calls `fn` with each child and its index and returns a flat array; old code combined it with `cloneElement` to give every child a prop, and with `Children.count` to know how many children there are.*
>
> The `children` prop is not always an array. With one child, it is that one element. So `children.map` works with three songs and crashes with one. The `Children` methods accept every shape of `children`, and that is why old code used them.
>
> **DO THIS:**
> ```jsx
> <ul>
>   {~Children.map~(children, (child, index) => // Works with one song, three songs, or none
>     cloneElement(child, { isPlaying: index === playingIndex })
>   )}
> </ul>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ul>
>   {~children.map~((child, index) => // **WRONG:** with one song, children is not an array, and the page crashes
>     cloneElement(child, { isPlaying: index === playingIndex })
>   )}
> </ul>
> ```

Legacy code did not clone single elements in isolation. It needed to iterate across all children nested within a parent tag. To perform that iteration, React provided the `Children` helper object.

### VS | `children` vs. `Children`: one capital letter, two different things

Examine two lines of rendering logic inside an unordered list:

```jsx title="Showing children as they are, and walking through them with Children.map"
<ul>{~children~}</ul> {/* The children prop: shows the JSX between the tags as it is */}
<ul>{~Children.map~(children, child => <li>{child}</li>)}</ul> {/* Calls our function once for each child */}
```

While their names appear almost identical, they refer to fundamentally different tools:
1. **The `children` prop, written with a lowercase c,** is a component property. It contains whatever JSX markup the consumer nested between the component tags (Lesson 09).
2. **The `Children` object, written with a capital C,** is a utility collection exported directly by React. You import it from react to inspect and iterate across child collections.

React documentation cautions engineers against confusing these two identifiers. The `Children` namespace provides five distinct helper methods. Our implementation uses two:
1. **`Children.map`** executes a callback function for each child and its corresponding index. It returns a flattened array containing the callback return values.
2. **`Children.count`** returns the total number of child nodes present in the collection.

You will encounter three additional methods when auditing older codebases:
1. **`Children.forEach`** iterates through each child element to execute side effects without returning an array.
2. **`Children.only`** asserts that `children` contains exactly one element and returns it, throwing an error if zero or multiple children exist.
3. **`Children.toArray`** normalizes the children collection into a flat JavaScript array with assigned key strings.

### Why not `children.map`? Because `children` is not always an array

Developers encountering `Children.map` often assume it is simply an outdated synonym for `children.map`. That assumption is incorrect. In JavaScript, `.map` exists exclusively on `Array.prototype`. When a parent receives three songs, React provides an array, allowing `children.map` to execute. When a caller passes a single child, however, that code crashes immediately:

```jsx title="One song between the Playlist tags"
<Playlist>
  ~<Song title="Yesterday" artist="The Beatles" />~ {/* One child: children is this element, not an array */}
</Playlist>
```

When a component receives only one child tag, React does not wrap that element inside an array. Instead, `children` holds the raw element object directly. Because an individual React element lacks a map method, calling `children.map` throws a `TypeError` and unmounts the component tree.

> [!DEFINITION]
> **What does it mean that children is opaque?** [NEW] React documentation describes the `children` prop as an opaque data structure: calling code cannot depend on its runtime shape. When three tags are passed, `children` is an array. When one tag is passed, it is a single element object. With plain text, it is a primitive string, and when omitted entirely, it is `undefined`. Because standard array methods fail on non-array shapes, legacy React supplied `Children` helper methods to safely normalize every possible structure (Lesson 100).

### The playlist written with `Children.map` and `cloneElement`

Now we construct the legacy playlist implementation. The App component renders three song elements between the playlist tags:

```jsx title="src/App.jsx"
import Playlist from './Playlist.jsx';
import Song from './Song.jsx';

export default function App() {
  return (
    <Playlist>
      <Song title="Yesterday" artist="The Beatles" />
      <Song title="Imagine" artist="John Lennon" />
      <Song title="Hey Jude" artist="The Beatles" />
    </Playlist>
  );
}
```

The song component inspects `isPlaying` and applies the `playing` class when active:

```jsx title="src/Song.jsx"
export default function Song({ title, artist, ~isPlaying~ }) { // isPlaying comes from the copy, not from App.jsx
  return <li className={isPlaying ? 'playing' : ''}>{title}: {artist}</li>;
}
```

The `Playlist` component maintains the active index in state. It clones each child to inject `isPlaying`, advancing the index on each button click:

```jsx title="src/Playlist.jsx"
import { Children, cloneElement, useState } from 'react';

export default function Playlist({ children }) {
  const [playingIndex, setPlayingIndex] = useState(0);
  return (
    <section>
      <h2>Up next</h2>
      <ul>
        {~Children.map~(children, (child, index) => // Calls the arrow once per song, with the song and its index
          ~cloneElement~(child, { isPlaying: index === playingIndex }) // A copy of each song, with isPlaying added
        )}
      </ul>
      <button onClick={() => setPlayingIndex(i => (i + 1) % ~Children.count~(children))}> {/* 3 songs: after the last, back to 0 */}
        Next
      </button>
    </section>
  );
}
```

When the component mounts, `playingIndex` initializes to 0. Consequently, only the cloned Yesterday element receives `isPlaying` set to true.

Each click on the Next button increments the active index. The remainder operator wraps the counter back to zero when reaching the total child count. After the third song, incrementing index 2 produces 3, and 3 modulo 3 resets the pointer to 0.

```page caption="After the user clicks Next twice: the highlight reaches Hey Jude, and the next click brings it back to Yesterday."
heading: Up next
line: Yesterday: The Beatles
line: Imagine: John Lennon
line: Hey Jude: The Beatles | good
line: [Next]
```

Notice an important detail regarding keys. The `Children.map` method returns an array, and array elements in React require stable keys (Lesson 18). Our code declares no explicit key on the song tags, yet React prints no key warning in the browser console. Why? The `Children.map` utility automatically assigns unique keys to cloned elements. React documentation explains that keys on returned elements are automatically merged with the keys of the original children.

```tree dir=right caption="How Playlist turns the three songs it received into three copies with isPlaying."
How `Playlist` gives each song `isPlaying`
- +1. Receives `children` [`children`] | The **three `<Song>` tags** written in `App.jsx`
- +2. Walks through them [`Children.map`] | Calls our arrow with **each song and its index**
- +3. Copies each song [`cloneElement`] | Adds **`isPlaying`**, `true` only at `playingIndex`
- +4. Renders the copies | Only the **playing song** gets the `playing` class
```

---

## PRINCIPLE | `Children.count`: sees only the JSX between the tags, so `<MoreSongs />` counts as one child

> [!PRINCIPLE]
> **Principle 3: Rendered Output: The Children Methods See Only the JSX Between the Tags**
>
> *`Children.map` and `Children.count` see only the elements written between the tags; a component such as `<MoreSongs />` or a Fragment there is one child, and the songs it renders are never seen.*
>
> The page can look the same while `Playlist` receives a different number of children. Move songs into a component of your own or into a Fragment, and `Playlist` counts fewer children and copies `isPlaying` onto the wrong element. The bug shows up in `Playlist`, a file nobody changed.
>
> **DO THIS:**
> ```jsx
> <Playlist>
>   <Song title="Yesterday" artist="The Beatles" />
>   ~<Song title="Imagine" artist="John Lennon" />~ {/* Each song written between the tags gets isPlaying */}
>   <Song title="Hey Jude" artist="The Beatles" />
> </Playlist>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Playlist>
>   <Song title="Yesterday" artist="The Beatles" />
>   ~<MoreSongs />~ {/* **WRONG:** one child for Playlist, so Imagine and Hey Jude never get isPlaying */}
> </Playlist>
> ```

Consider the simplest edge case. Suppose the playlist receives one standard song element alongside a custom helper component:

```jsx title="One song and one component of our own between the Playlist tags"
<Playlist>
  <Song title="Yesterday" artist="The Beatles" />
  ~<MoreSongs />~ {/* One child for the Children methods, however many songs it renders */}
</Playlist>
```

Inside `Playlist`, the `Children.count` method evaluates to 2. React documentation illustrates this identical behavior using a custom component named `MoreRows`. The child count remains 2 even if `MoreRows` renders ten different DOM items or returns `null`.

Why does this happen? Remember that a JSX tag represents an element descriptor object. Writing `<MoreSongs />` creates an object with `type: MoreSongs`, and nothing more. The `Children` methods inspect only those immediate descriptor objects. They never invoke the `MoreSongs` function itself. React executes components later during its render phase. While `Playlist` iterates over its children, the nested songs inside `MoreSongs` do not exist yet.

React documentation refers to this inspection as a shallow traversal. The traversal never penetrates deeper than top-level React elements: nested components are not rendered, and their outputs are not traversed. What a component outputs when executed is its rendered output. As official documentation states, React provides no mechanism to access the rendered output of an inner component during traversal.

### A teammate moves two songs into `MoreSongs`

**Beware! When legacy code clones child elements, extracting songs into a helper component breaks active highlights even while the screen displays every song.**

Suppose a teammate groups the final two tracks into a component named `MoreSongs` because both belong to a specific album. Neither the playlist component nor the song component changes:

```jsx title="src/App.jsx"
import Playlist from './Playlist.jsx';
import Song from './Song.jsx';

function ~MoreSongs~() { // Our own component: the Children methods never call it
  return (
    <>
      <Song title="Imagine" artist="John Lennon" />
      <Song title="Hey Jude" artist="The Beatles" />
    </>
  );
}

export default function App() {
  return (
    <Playlist>
      <Song title="Yesterday" artist="The Beatles" />
      ~<MoreSongs />~ {/* The second and last child of Playlist */}
    </Playlist>
  );
}
```

When the application opens, the initial render appears completely normal. Three song titles appear in order, and Yesterday displays the active highlight. When the user clicks the Next button, however, the queue breaks:
1. `Children.count` returns 2: one direct song element and one `<MoreSongs />` element descriptor.
2. The user clicks Next, incrementing `playingIndex` to 1.
3. `Children.map` reaches the child at index 1, which is `<MoreSongs />`. It clones that component descriptor and injects `isPlaying` as true.
4. Because `MoreSongs` accepts no props, it never forwards `isPlaying` down to its rendered children. Neither Imagine nor Hey Jude receives the `playing` class.
5. As a result, no track on screen displays an active highlight.
6. When the user clicks Next again, 2 modulo 2 wraps back to 0, returning the highlight to Yesterday.
7. The third song, Hey Jude, is never highlighted under any circumstances.

```page caption="With MoreSongs, after the user clicks Next once: no song is highlighted, and the cross marks Imagine, the song that should be."
heading: Up next
line: Yesterday: The Beatles
line: Imagine: John Lennon | bad
line: Hey Jude: The Beatles
line: [Next]
```

The developer naturally inspects `MoreSongs` to find the defect. Yet the underlying breakdown exists inside the parent playlist component, a file nobody touched during the refactoring. React documentation highlights this architectural flaw: relying on child traversal makes extracting helper components unusually fragile.

```tree caption="Three Song tags and one Song with MoreSongs show the same three songs, but Playlist receives three children in one and two in the other."
What `Playlist` receives between its tags
- +Three `<Song>` tags | `Children.count` returns **3** | Every song **gets `isPlaying`**
- !One `<Song>` and `<MoreSongs />` | `Children.count` returns **2** | `isPlaying` lands **on `MoreSongs`**, and no song inside it is highlighted
```

### VS | A Fragment vs. an array between the tags: the Fragment is one child, the array is not

A React Fragment counts as a single child as well. Suppose a developer wraps the final two tracks in a Fragment rather than a custom component:

```jsx title="A Fragment around two songs between the Playlist tags"
<Playlist>
  <Song title="Yesterday" artist="The Beatles" />
  ~<>~ {/* A Fragment: one child, exactly like <MoreSongs /> */}
    <Song title="Imagine" artist="John Lennon" />
    <Song title="Hey Jude" artist="The Beatles" />
  </>
</Playlist>
```

For the `Children` helper methods, a Fragment behaves exactly like a custom component wrapper. React documentation notes that Fragment elements are not traversed into. Consequently, the Fragment counts as one child node, the count remains 2, and the nested songs fail to receive the highlight.

This time React also issues an explicit warning. While the initial render stays silent, clicking the Next button triggers a console error when `cloneElement` passes `isPlaying` to the Fragment wrapper:

```devconsole width=full
x Invalid prop `isPlaying` supplied to `React.Fragment`. React.Fragment can only have `key`, `ref`, and `children` props.
```

Passing an array behaves very differently. When the caller generates elements by mapping over an array inside the component tags, the `Children` methods unwrap that array:

```jsx title="An array of songs between the Playlist tags"
<Playlist>
  {~songs.map~(song => <Song key={song.id} title={song.title} artist={song.artist} />)} {/* Three children: the array is walked through */}
</Playlist>
```

While an array expression looks similar to a Fragment in JSX, React treats them differently. React documentation clarifies that arrays do not count as individual nodes, but their child items do. In this case, `Children.count` evaluates to 3, and every mapped song receives its cloned prop correctly.

---

## PRINCIPLE | Render prop: the page writes `isPlaying` itself, where everyone can see it

> [!PRINCIPLE]
> **Principle 4: Render Prop: `Playlist` Hands `isPlaying` to the Page Instead of Copying Songs**
>
> *Pass the songs as an array prop, and let `Playlist` call `renderSong(song, isPlaying)` for each one; the page writes `isPlaying={isPlaying}` on `<Song>` itself.*
>
> The page shows the same list as with `cloneElement`. The difference is where `isPlaying` is written. With a copy, it appears inside `Playlist`, and nobody who reads the page can find it. With a render prop, it appears on the `<Song>` tag in the App file, so a missing value is a bug in the file you are reading.
>
> **DO THIS:**
> ```jsx
> <Playlist
>   songs={songs}
>   renderSong={(song, ~isPlaying~) => ( // Takes both arguments that Playlist passes
>     <Song key={song.id} title={song.title} artist={song.artist} isPlaying={isPlaying} />
>   )}
> />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Playlist
>   songs={songs}
>   renderSong={~song~ => ( // **WRONG:** one parameter, so isPlaying never reaches Song
>     <Song key={song.id} title={song.title} artist={song.artist} />
>   )}
> />
> ```

> [!DEFINITION]
> **What is a render prop?** [REVIEW] A render prop is a component prop that accepts a function returning JSX. The parent component manages internal state and invokes the callback with that state data. The consuming component defines the function body and decides what markup to render. In this pattern, the parent controls the data while the consumer controls the markup (Lesson 89).

React documentation highlights render props as the primary architectural alternative to implicit element cloning.

### VS | `cloneElement` vs. `renderSong`: the same screen, but only one shows the prop

Notice the single line of rendering logic that changes inside the playlist component:

```jsx title="Inside Playlist: copying the child, and calling renderSong"
~cloneElement(child, { isPlaying: index === playingIndex })~ // Adds a prop the page never wrote
~renderSong(song, index === playingIndex)~ // Hands the value to the page, and the page writes the prop
```

From the user perspective, both techniques deliver identical behavior. Official React documentation notes that the visual outcome matches the result achieved with `cloneElement`. The queue renders identically, and the Next button shifts the highlight across tracks as expected.

For engineers maintaining the software, the two architectures differ fundamentally:
1. **With `cloneElement`,** the playlist component injects `isPlaying` onto an internal copy where callers cannot see it.
2. **With `renderSong`,** the playlist hands the active boolean to the callback function, allowing the consumer to declare `isPlaying={isPlaying}` directly on the tag.

React documentation explicitly prefers render props because explicit data flow makes component dependencies clear. Any developer reading the App component can immediately trace where each prop originates.

### The playlist with songs as data and `renderSong`

The playlist tracks now reside in a structured data array inside a separate module. Each track object includes a unique `id` property for React keys:

```js title="src/songs.js"
export const songs = [
  { id: 1, title: 'Yesterday', artist: 'The Beatles' },
  { id: 2, title: 'Imagine', artist: 'John Lennon' },
  { id: 3, title: 'Hey Jude', artist: 'The Beatles' },
];
```

The `Playlist` component no longer imports legacy cloning utilities. It accepts two standard props: `songs` and `renderSong`:

```jsx title="src/Playlist.jsx"
import { useState } from 'react';

export default function Playlist({ songs, renderSong }) {
  const [playingIndex, setPlayingIndex] = useState(0);
  return (
    <section>
      <h2>Up next</h2>
      <ul>
        {songs.map((song, index) => ~renderSong(song, index === playingIndex)~)} {/* true only for the playing song */}
      </ul>
      <button onClick={() => setPlayingIndex(i => (i + 1) % ~songs.length~)}> {/* Counts the data, not the JSX */}
        Next
      </button>
    </section>
  );
}
```

The App component supplies both props. The render callback receives the track object and its active boolean flag, declaring every prop explicitly on `<Song>`:

```jsx title="src/App.jsx"
import Playlist from './Playlist.jsx';
import Song from './Song.jsx';
import { songs } from './songs.js';

export default function App() {
  return (
    <Playlist
      songs={songs}
      renderSong={(song, ~isPlaying~) => ( // Playlist supplies isPlaying as the second argument
        <Song key={song.id} title={song.title} artist={song.artist} ~isPlaying={isPlaying}~ /> // The page writes the prop itself
      )}
    />
  );
}
```

The `Song` component remains completely unchanged. It continues reading `isPlaying` as a prop, but that value now originates from a visible JSX declaration.

The fragile helper component issue disappears. Because tracks are represented as structured data items, there are no raw child element descriptors to fragment. The `songs.length` property replaces child counting, operating on raw data rather than JSX markup.

```page caption="With the render prop, after the user clicks Next once: the highlight moves to Imagine, exactly as with cloneElement."
heading: Up next
line: Yesterday: The Beatles
line: Imagine: John Lennon | good
line: Hey Jude: The Beatles
line: [Next]
```

### A missing parameter now shows in the App file

A developer can still make a mistake when implementing a render prop callback. The critical difference is that the mistake now resides directly in the file being edited:

```jsx title="src/App.jsx"
renderSong={~song~ => <Song key={song.id} title={song.title} artist={song.artist} />} // **WRONG:** one parameter, so isPlaying is ignored
```

The playlist component passes two arguments to `renderSong`, but the callback signature accepts only the track object. JavaScript drops the unmapped second argument, preventing `Song` from receiving `isPlaying`. Because the omission occurs directly at the call site, the fix is immediately obvious without inspecting parent component internals.

---

## PRINCIPLE | Context: each `Song` reads `isPlaying` itself, through any component in between

> [!PRINCIPLE]
> **Principle 5: Context: Each Song Reads `isPlaying` from the Provider Around It**
>
> *Wrap each song in its own `<PlayingContext value={isPlaying}>`, and read the value in `Song` with `useContext(PlayingContext)`; the page passes no `isPlaying` at all.*
>
> The page looks the same as with the render prop. The difference is who carries the value. `Playlist` provides it around each song, and `Song` reads the closest provider above it. So a component of your own between them, which broke the copies of `cloneElement`, breaks nothing here.
>
> **DO THIS:**
> ```jsx
> {songs.map((song, index) => (
>   <PlayingContext key={song.id} ~value={index === playingIndex}~> {/* Each song gets its own true or false */}
>     {renderSong(song)}
>   </PlayingContext>
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <PlayingContext ~value={playingIndex}~> {/* **WRONG:** one number for every song, so no Song knows if it plays */}
>   <ul>{songs.map(song => renderSong(song))}</ul>
> </PlayingContext>
> ```

> [!DEFINITION]
> **What is context?** [REVIEW] Context allows a parent component to broadcast data down through the component tree without passing props manually through intermediate components.
> 1. You create a context outside components using `createContext`.
> 2. The parent component manages the underlying state and wraps target children in a provider with a `value`.
> 3. Any descendant component reads that value directly with `useContext`.
> Context holds no persistent state on its own. The parent component owns the state, context broadcasts it, and whenever that value updates, React automatically re-renders every component consuming that context (Lesson 28).

Official React documentation presents Context as the second primary alternative to legacy element cloning.

### VS | A prop vs. `useContext`: the page writes the value, or `Song` reads it itself

Examine the `Song` component written under both architectural patterns:

```jsx title="Song with isPlaying as a prop"
function Song({ title, artist, ~isPlaying~ }) { // The page must write isPlaying on every Song
  return <li className={isPlaying ? 'playing' : ''}>{title}: {artist}</li>;
}
```

```jsx title="Song with isPlaying read from PlayingContext"
function Song({ title, artist }) {
  const isPlaying = ~useContext(PlayingContext)~; // Playlist provides the value, and the page writes nothing
  return <li className={isPlaying ? 'playing' : ''}>{title}: {artist}</li>;
}
```

From the user perspective, both implementations produce identical markup. The song row receives the `playing` class whenever that track is active.

The difference lies in how data travels between components. When using props, the caller must bind `isPlaying` on every individual tag. With context, the playlist provides the value scoped to each item, and the consumer passes no state props at all.

Developers often assume Context is suited only for global application settings like themes. A provider can wrap an individual item within a list. Each `Song` reads the nearest ancestor provider above it, allowing each item to receive an independent active flag.

### The playlist with one provider per song

A separate module creates the context with an initial fallback value of `false`:

```js title="src/PlayingContext.js"
import { createContext } from 'react';

export const PlayingContext = ~createContext(false)~; // false: a Song outside any Playlist is not playing
```

The `Playlist` component wraps each track in its own provider instance. The `value` prop is true for the active track and false for all others. Notice that the React `key` moves to the provider element because the provider is now the top-level node returned by the array mapping:

```jsx title="src/Playlist.jsx"
import { useState } from 'react';
import { PlayingContext } from './PlayingContext.js';

export default function Playlist({ songs, renderSong }) {
  const [playingIndex, setPlayingIndex] = useState(0);
  return (
    <section>
      <h2>Up next</h2>
      <ul>
        {songs.map((song, index) => (
          <PlayingContext key={song.id} ~value={index === playingIndex}~> {/* One provider per song, with its own value */}
            {renderSong(song)}
          </PlayingContext>
        ))}
      </ul>
      <button onClick={() => setPlayingIndex(i => (i + 1) % songs.length)}>
        Next
      </button>
    </section>
  );
}
```

The `Song` component removes `isPlaying` from its props and reads the context directly:

```jsx title="src/Song.jsx"
import { useContext } from 'react';
import { PlayingContext } from './PlayingContext.js';

export default function Song({ title, artist }) {
  const isPlaying = ~useContext(PlayingContext)~; // true only inside the provider of the playing song
  return <li className={isPlaying ? 'playing' : ''}>{title}: {artist}</li>;
}
```

The App component no longer references active state. The render callback receives only the track data and forwards standard track properties:

```jsx title="src/App.jsx"
import Playlist from './Playlist.jsx';
import Song from './Song.jsx';
import { songs } from './songs.js';

export default function App() {
  return (
    <Playlist
      songs={songs}
      renderSong={song => <Song title={song.title} artist={song.artist} />} // No isPlaying, and no key: both live in Playlist
    />
  );
}
```

React documentation describes how this separation frees calling components from worrying about passing active state down manually. In older codebases, you will encounter the syntax `<PlayingContext.Provider value={...}>`. That was the required provider syntax prior to React 19, and it functions identically.

### A component of our own between `Playlist` and `Song`

**This time, inserting an intermediate component between the playlist and its songs breaks nothing.** The exact structural refactoring that broke legacy element cloning works seamlessly with context because context broadcasts values through any component depth.

Suppose a teammate introduces a `SongRow` helper component to encapsulate song layout:

```jsx title="src/App.jsx"
import Playlist from './Playlist.jsx';
import Song from './Song.jsx';
import { songs } from './songs.js';

function ~SongRow~({ song }) { // Our own component: it passes no isPlaying on
  return <Song title={song.title} artist={song.artist} />;
}

export default function App() {
  return <Playlist songs={songs} renderSong={song => <SongRow song={song} />} />;
}
```

Here is what occurs when the user clicks the Next button once:
1. The playlist component wraps the second track in a provider with its `value` set to true.
2. The `SongRow` component renders without inspecting or forwarding active state.
3. The nested `Song` component invokes `useContext` to read the context.
4. React locates the nearest provider above that component and retrieves its value of true.
5. The Imagine track receives the highlight as expected.

```page caption="With context and SongRow, after the user clicks Next once: Imagine is highlighted."
heading: Up next
line: Yesterday: The Beatles
line: Imagine: John Lennon | good
line: Hey Jude: The Beatles
line: [Next]
```

```tree caption="A component of our own between Playlist and Song: the copy stops at the outer component, and context reaches the Song below."
A component of our own sits between `Playlist` and `Song`
- !With `cloneElement` [`<MoreSongs />`] | The copy gets `isPlaying` **on the outer component** | The songs inside **are never highlighted**
- +With context [`<SongRow />`] | `Song` reads **the closest provider above it** | The playing song **stays highlighted**
```

### One provider around the whole list does not work

Developers adopting Context sometimes attempt wrapping the entire list inside a single shared provider. Because there is no single boolean representing all songs, the developer mistakenly supplies `playingIndex`:

```jsx title="src/Playlist.jsx"
<PlayingContext ~value={playingIndex}~> {/* **WRONG:** every Song reads the same number, such as 1 */}
  <ul>{songs.map(song => renderSong(song))}</ul>
</PlayingContext>
```

Every song component now receives the identical index number. Without knowing its own position in the list, no individual song can determine whether it is active:
1. **When the screen mounts,** every song receives 0. In a boolean expression, 0 evaluates to false, so no song displays a highlight.
2. **After clicking Next,** every song receives 1. Because 1 evaluates to true, all three songs display the highlight simultaneously.
3. **In the browser console,** React reports missing key warnings because the mapping function returns elements without unique key props.

To compare that shared index against its own position, each song would need its own index passed as a prop, reintroducing prop drilling. Scoping one provider per item, as shown in our revised playlist, solves this cleanly.

---

## PRINCIPLE | `defaultProps`: React 19 ignores it on a function, so the default goes in the parameter list

> [!PRINCIPLE]
> **Principle 6: Default Values: React 19 Ignores `defaultProps` on a Function Component**
>
> *Write the default of a prop in the parameter list, such as `artist = 'Unknown artist'`; React 19 removes `defaultProps` from function components and keeps `static defaultProps` only for classes.*
>
> Old function components attached `defaultProps`, and React filled in missing props before it called them. React 19 stops doing that for functions, because JavaScript already has default parameters. The page keeps working. Only the rows with a missing prop change, and they show nothing where the default used to be.
>
> **DO THIS:**
> ```jsx
> export default function Song({ title, ~artist = 'Unknown artist'~ }) { // Track 3: Unknown artist
>   return <li>{title}: {artist}</li>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function Song({ title, artist }) {
>   return <li>{title}: {artist}</li>;
> }
> ~Song.defaultProps~ = { artist: 'Unknown artist' }; // **WRONG:** React 19 ignores it, and Track 3 shows a blank artist
> ```

Recall default parameters in standard JavaScript. Writing `function greet(name = 'friend')` uses `'friend'` whenever the caller omits the argument. Because React components are standard JavaScript functions that receive props as an object argument, destructuring defaults work natively on props (Lesson 09).

Older React applications did not use language-level default parameters. Instead, developers assigned a `defaultProps` object to the function, and React injected those default values before executing the component.

### VS | `Song.defaultProps` vs. a default parameter: the same rule, but React 19 reads only one

Examine both approaches for declaring a fallback artist:

```jsx title="A default for artist with Song.defaultProps"
function Song({ title, artist }) {
  return <li>{title}: {artist}</li>;
}
~Song.defaultProps~ = { artist: 'Unknown artist' }; // The old way: an object attached to the function
```

```jsx title="A default for artist in the parameter list"
function Song({ title, ~artist = 'Unknown artist'~ }) { // The way of today: a default parameter
  return <li>{title}: {artist}</li>;
}
```

Conceptually, both techniques enforce the identical fallback rule. Both apply the default when a prop is missing or explicitly passed as `undefined`, and both preserve `null` without modification.

In React 19, however, the runtime behavior changes completely. React 19 removes support for `defaultProps` on function components. The official upgrade guide explains that `defaultProps` on function components has been removed in favor of standard ES6 default parameters.

### The untagged song after the upgrade

**Beware! When upgrading an application to React 19, legacy defaultProps stops applying silently, causing missing prop values to render blank.**

Consider a third track added to the playlist without artist metadata:

```js title="src/songs.js"
export const songs = [
  { id: 1, title: 'Yesterday', artist: 'The Beatles' },
  { id: 2, title: 'Imagine', artist: 'John Lennon' },
  ~{ id: 3, title: 'Track 3' }~, // An untagged file: no artist
];
```

The `Song` component retains the legacy default configuration from earlier versions:

```jsx title="src/Song.jsx"
import { useContext } from 'react';
import { PlayingContext } from './PlayingContext.js';

export default function Song({ title, artist }) {
  const isPlaying = useContext(PlayingContext);
  return <li className={isPlaying ? 'playing' : ''}>{title}: {artist}</li>;
}

~Song.defaultProps~ = { artist: 'Unknown artist' }; // React 19 ignores this on a function component
```

Here is what users experience across versions:
1. In React 18, React detects that `artist` is missing and injects the default before invoking `Song`. The third row displays Track 3: Unknown artist.
2. The engineering team upgrades the application to React 19.
3. Because React 19 ignores `defaultProps` on function components, the artist property resolves to `undefined`.
4. The third row renders the title followed by an empty space where the artist belonged.

::: row caption="The same Song.defaultProps in React 18 and in React 19: the third row loses its artist."
::: col title="Song.defaultProps in React 18" tag="the default is applied" tone=good
```page size=mini
heading: Up next
line: Yesterday: The Beatles
line: Imagine: John Lennon
line: Track 3: Unknown artist | good
line: [Next]
```
:::
::: col title="Song.defaultProps in React 19" tag="the default is ignored" tone=bad
```page size=mini
heading: Up next
line: Yesterday: The Beatles
line: Imagine: John Lennon
line: Track 3: | bad
line: [Next]
```
:::
:::

The upgrade appears successful initially because the application compiles and runs without throwing errors. The missing text becomes apparent only when displaying records with omitted fields, often discovered days later by users.

The modern solution replaces `Song.defaultProps` with a standard destructuring default inside the component signature:

```jsx title="src/Song.jsx"
import { useContext } from 'react';
import { PlayingContext } from './PlayingContext.js';

export default function Song({ title, ~artist = 'Unknown artist'~ }) { // JavaScript fills in the default
  const isPlaying = useContext(PlayingContext);
  return <li className={isPlaying ? 'playing' : ''}>{title}: {artist}</li>;
}
```

During props destructuring, JavaScript detects `undefined` and assigns the fallback value. The third row immediately displays Track 3: Unknown artist once again.

Notice how the App component passes `artist={song.artist}` for every item. For the third song, the prop is not missing from the JSX tag. It evaluates to `undefined`, which activates the default parameter identically.

### Missing, `undefined`, and `null`

Both default mechanisms follow the identical evaluation rules across these three call sites:

```jsx title="A missing artist, an undefined artist, and a null artist"
<Song title="Track 3" /> {/* Missing: the row reads Track 3: Unknown artist */}
<Song title="Track 3" ~artist={undefined}~ /> {/* undefined: the row reads Track 3: Unknown artist */}
<Song title="Track 3" ~artist={null}~ /> {/* null: the default is not used, and the artist is blank */}
```

The fallback value applies when a prop is omitted or passed as `undefined`. It never applies when a caller explicitly passes `null`, because `null` represents an intentional, deliberate absence of value (Lesson 09).

### Class components keep `static defaultProps`

Class components continue to support `defaultProps` in React 19. The official migration guide notes that classes retain this mechanism because ES6 provides no equivalent destructuring parameter syntax for class instances.

In a class component, you declare defaults using the `static` keyword inside the class body. This syntax attaches the default object directly to the constructor (Lesson 96):

```jsx title="A class Song with static defaultProps"
class Song extends Component {
  ~static defaultProps~ = { artist: 'Unknown artist' }; // Still supported on classes in React 19

  render() {
    return <li>{this.props.title}: {this.props.artist}</li>;
  }
}
```

Official documentation confirms that class defaults apply to missing or `undefined` props, while leaving `null` untouched.

The React 19 upgrade also deprecates runtime `propTypes` validations. React 19 ignores `propTypes` definitions, and the React team recommends TypeScript for static prop validation (Lesson 90).

```tree caption="Where a default for artist still works in React 19: in the parameter list and on a class, not in defaultProps on a function."
A default for `artist` in React 19
- !`defaultProps` on a function [`Song.defaultProps`] | **Ignored** in React 19 | The artist **is blank**
- +A default parameter [`artist = 'Unknown artist'`] | **JavaScript** fills it in | Used for **missing and `undefined`**, not for `null`
- +`static defaultProps` on a class [`static defaultProps`] | **Still supported** | Used for **missing and `undefined`**, not for `null`
```

---

## All 6 Principles Together

### The complete code

Here is the complete modern playlist implementation. Song records are represented as structured data, and `Playlist` wraps each item in a dedicated provider. The `Song` component reads active state from context, and default values are declared directly in the parameter list. No file relies on `cloneElement` or legacy helper methods:

```jsx title="src/main.jsx"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<App />);
```

```css title="src/styles.css"
.playing {
  background: #fde68a;
}
```

```js title="src/songs.js"
export const songs = [
  { id: 1, title: 'Yesterday', artist: 'The Beatles' },
  { id: 2, title: 'Imagine', artist: 'John Lennon' },
  { id: 3, title: 'Track 3' },
];
```

```js title="src/PlayingContext.js"
import { createContext } from 'react';

export const PlayingContext = createContext(false);
```

```jsx title="src/Playlist.jsx"
import { useState } from 'react';
import { PlayingContext } from './PlayingContext.js';

export default function Playlist({ songs, renderSong }) {
  const [playingIndex, setPlayingIndex] = useState(0);
  return (
    <section>
      <h2>Up next</h2>
      <ul>
        {songs.map((song, index) => (
          <PlayingContext key={song.id} ~value={index === playingIndex}~> {/* Principle 5: one provider per song */}
            {~renderSong(song)~} {/* Principle 4: the page decides what each song looks like */}
          </PlayingContext>
        ))}
      </ul>
      <button onClick={() => setPlayingIndex(i => (i + 1) % ~songs.length~)}> {/* Principle 3: counts the data, not the JSX */}
        Next
      </button>
    </section>
  );
}
```

```jsx title="src/Song.jsx"
import { useContext } from 'react';
import { PlayingContext } from './PlayingContext.js';

export default function Song({ title, ~artist = 'Unknown artist'~ }) { // Principle 6: the default in the parameter list
  const isPlaying = ~useContext(PlayingContext)~; // Principle 5: read from the closest provider
  return <li className={isPlaying ? 'playing' : ''}>{title}: {artist}</li>;
}
```

```jsx title="src/App.jsx"
import Playlist from './Playlist.jsx';
import Song from './Song.jsx';
import { songs } from './songs.js';

export default function App() {
  return (
    <Playlist
      songs={songs}
      renderSong={song => <Song title={song.title} artist={song.artist} />}
    />
  );
}
```

```page caption="The finished Up next list in React 19 when the page opens: Yesterday is highlighted, and Track 3 shows Unknown artist."
heading: Up next
line: Yesterday: The Beatles | good
line: Imagine: John Lennon
line: Track 3: Unknown artist
line: [Next]
```

### How React calls the components in order

When the page mounts, React executes the App component, renders Playlist, and invokes each song row in sequence. Each row component reads the provider immediately above it:

```tree caption="The order in which React calls the components of the finished list, and what each Song reads from its provider."
`App` [1. Called first] | Renders `Playlist` with **`songs`** and **`renderSong`**
- +`Playlist` [2. Called second] | Holds **`playingIndex`** in state | Wraps each song in **its own provider** and calls `renderSong`
  - +`Song` for Yesterday [3. Called third] | Reads **`true`** from its provider | Renders the **highlighted** row
  - +`Song` for Imagine [4. Called fourth] | Reads **`false`** from its provider | Renders a plain row
  - +`Song` for Track 3 [5. Called fifth] | Reads **`false`** from its provider | Shows **`Unknown artist`** from the default parameter
```

| Aspect | The Old Way | The Way of Today |
| :--- | :--- | :--- |
| **Giving a child one more prop** | `cloneElement` adds `isPlaying` to a copy, where the page cannot see it | The page writes `isPlaying` itself in a render prop, or `Song` reads it from context |
| **Walking through the children** | `Children.map` and `Children.count` walk through the JSX between the tags | The songs arrive as an array prop, and `Playlist` uses `songs.map` and `songs.length` |
| **A component of our own in between** | `<MoreSongs />` counts as one child, and its songs lose the highlight | Context reaches every `Song` below the provider, through `SongRow` or any other component |
| **A default value for a prop** | `Song.defaultProps`, ignored on functions in React 19 | `artist = 'Unknown artist'` in the parameter list; `static defaultProps` only on classes |
| **`null` as a value** | `defaultProps` is not used for `null` | A default parameter is not used for `null` either |

Remember the central lesson of this chapter. **Legacy code hid props inside cloned element copies, while modern React architectures pass values in plain sight and declare defaults in parameter lists.**

---

## For the Interview

> **The Interview Question:** What were cloneElement, the Children utilities, and defaultProps for, and why were they abandoned?

### How to Answer Clearly in 30 Seconds

"All three features allowed older React codebases to configure props away from the original JSX call site.
1. **`cloneElement`** returns a shallow copy of a React element with merged props. Legacy code used it with `Children.map` to inject props like `isPlaying` into child elements without declaring them on the tag.
2. **The `Children` methods**, including `map`, `count`, and `only`, traversed opaque child collections. Because they inspect only immediate JSX descriptors rather than rendered component outputs, extracting helper components broke parent assumptions. React documentation classifies them as Legacy React APIs because implicit cloning obscures data flow. Modern code replaces them with render props or context.
3. **`defaultProps`** declared fallback values for omitted props. React 19 removed support for `defaultProps` on function components because ES6 destructuring default parameters provide a standard language-level replacement. Class components retain `static defaultProps`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Is `Children` the same thing as the `children` prop?"**
   No. The `children` prop is the standard property containing whatever JSX markup the caller nested between component tags. React documentation encourages its standard use. The `Children` object is a legacy utility library exported by React to traverse those child elements safely. Legacy code relied on it because `children` is opaque: passing a single child assigns a raw element object rather than an array, causing `children.map` to throw a `TypeError`.
2. **"Why does a component that uses `Children.map` and `cloneElement` break when you extract part of its children into another component?"**
   Because `Children` methods inspect only the immediate element descriptors declared between parent tags. They never execute nested component functions. When you extract a helper component like `<MoreSongs />`, the parent counts that component as a single child. It clones props onto the wrapper rather than the songs inside. The page renders the tracks, but none receive the injected props. Context avoids this fragility because descendant components read values directly from ancestor providers regardless of hierarchy depth.
3. **"Does `defaultProps` still work in React 19?"**
   Only on class components via `static defaultProps`. React 19 completely removes support for `defaultProps` on function components, silently ignoring the declaration at runtime. Missing props evaluate to `undefined` unless replaced with ES6 default parameter syntax in destructuring. Both mechanisms apply defaults when a prop is omitted or `undefined`, and neither applies to `null`. React 19 also removed runtime `propTypes` in favor of TypeScript.

```tree dir=right caption="Interview summary: the three old pieces, why each fell out of use, and what replaces it today."
Three old pieces and what replaces them
- !`cloneElement` [`cloneElement`] | Adds a prop **the page cannot see** | Replaced by a **render prop** or **context**
- !The `Children` methods [`Children.map` `Children.count`] | See **only the JSX between the tags** | Replaced by an **array prop**
- !`defaultProps` on a function [`Song.defaultProps`] | **Removed** in React 19 | Replaced by a **default parameter**
```
