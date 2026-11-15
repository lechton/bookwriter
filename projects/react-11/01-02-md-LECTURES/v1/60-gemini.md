# Lecture 60: When Built-In State Is Not Enough

*(Why does the tab still count two unread emails after the user marks one as read?)*

> INTERVIEW QUESTION | ❱❱ MORE | When does an app outgrow useState and context, and what do external stores and server-cache libraries add?

---

## VS | Data from the Server vs. State Only the Page Knows: the first is only a copy, so keep one copy of it

> A page often fetches a list from the server, such as your emails, and several components need it. One component counts the unread messages, while another shows the rows. **When each component fetches the same URL in its own Effect, each keeps a separate copy, and a user action updates only one**. Server data requires a single location on the page, like a common parent or a cache library, while client navigation stays in `useState`.

Consider a paper train schedule printed from a station website. The moment the railway changes a departure time, your printed paper becomes outdated. If you print two copies and mark a correction on only one, you hold two sheets that disagree.

Data from the server works exactly like that printed sheet. Remember fetching in an Effect from Lesson 33? Your component calls `fetch`, and the setter puts the response into local state. That state does not hold the actual emails. It holds a **local copy** of the emails. The real data stays on the server.

Keep one rule in mind for the whole lesson: **data from the server is only a copy, so the page must keep exactly one copy of it.**

An email application keeps two distinct kinds of data in `useState`: the fetched emails, and the active folder tab. Both use identical state setter syntax, so they might seem interchangeable. **While both are stored in state, their ownership is completely different:**
- **The emails belong to the server.** The page holds only a temporary copy. When an email updates on the server, every local copy becomes stale until client code fetches again.
- **The open tab belongs to the page.** The server never tracks client navigation. The value in local state is the authoritative truth, and no other copy exists.

Take an email inbox. At the top, a tab displays `Inbox (2)` because two emails are unread. Below it, the list displays both emails, each with a **Mark as read** button. The user clicks **Mark as read** on the first email. The button on that row disappears, but the tab still displays `Inbox (2)`. Where does the application store the emails, and how many times? Twice. The tab component fetched them into local state to count unread emails. The list component fetched them into separate state to render rows.

**Why this happens:** A state variable belongs to the component instance that calls `useState`. Two components fetching the same endpoint receive two separate arrays that only start out equal. Clicking the button updated the list's array. No code updated the tab's array, so the screen presents **two conflicting answers to one question**. The solution is not adding another state setter. The solution is keeping one copy.

### Where the One Copy Can Live

There are four places for the one copy of the server's data. Each one fits a bigger app than the one before it:

```tree caption="Four places for the one copy of the server's data, from one component to a whole app."
Where the page keeps its copy of the server's data
- +1. One Effect in the one component that shows it [`useEffect` `fetch`] | Fits **one component** on one screen | Taught in Lesson 33
- +2. One owner: the common parent or a context [`App` holds `emails`] | Fits **a few components** on a small page | Principle 3
- +3. A client-side cache library [`useSWR` `TanStack Query` `RTK Query`] | Fits **many components and screens** that share the same data | Principle 4
- +4. The data fetching built into a framework [`loader`] | Fits an app **built on a framework** | Taught in Lesson 46
```

React documentation recommends the last two options. For apps using a framework: "If you use a framework, use its built-in data fetching mechanism." Without a framework: "Otherwise, consider using or building a client-side cache." A **client-side cache** is a shared storage layer in browser memory, outside any component, where responses from the server are stored and reused. Principle 4 introduces one.

State that only the page knows requires none of these server caching tools. It stays within familiar React mechanisms:
1. **`useState` in the closest common parent**, when a few nearby components share it (Lesson 24).
2. **A context with `useReducer`**, when many distant components read and update it (Lesson 29).
3. **An external store**, when state already exists in code outside React (Lesson 53).

Principle 5 compares these client-side state options.

### Two Reminders

> [!DEFINITION]
> **What is fetching in an Effect?** [REVIEW] Fetching in an Effect requests data from an external endpoint after a component renders.
> 1. An Effect with an empty dependency list runs once after the initial render: `useEffect(() => { ... }, [])`.
> 2. Inside the Effect, `fetch` requests the data, parses the response, and calls a state setter.
> 3. A cleanup function sets an `ignore` flag so responses arriving after unmount are safely discarded.
>
> React does not cache the response. Each time the component mounts, the Effect executes again, and Strict Mode in development executes it twice (Lesson 33).

> [!DEFINITION]
> **What is lifting state up?** [REVIEW] Lifting state up moves shared data to the closest common parent of components that need it.
> 1. Remove the duplicated state declarations from child components.
> 2. Declare `useState` in their closest common parent to establish a single source of truth.
> 3. Pass the state value down to children as props, alongside an event handler to update it.
>
> The parent owns the data, both children read the exact same value, and any state update re-renders both children in sync (Lesson 24).

### What the User Pays for Two Copies

Two copies cost the user three distinct penalties:
1. **Two conflicting answers on one screen.** The tab displays `Inbox (2)` while the list shows one unread email. The user cannot tell which count is accurate.
2. **Waiting again for identical data.** The user leaves the inbox for the sent tab, comes back, and waits on `Loading...` for data loaded moments earlier.
3. **Duplicate network requests.** When the page loads, the server receives separate requests for each fetching component, and twice as many in development.

Developers frequently make four common mistakes, which this lesson resolves step by step:
1. They reach for global state libraries like Redux early and store server data there. The store creates another detached copy that can drift from the server.
2. They wrap the network call in a custom Hook such as `useData`, expecting components to share state. Each Hook invocation creates isolated state, preserving both copies (Lesson 39).
3. They treat server cache libraries as a home for arbitrary UI state. A server cache is designed specifically for endpoint responses keyed by URL.
4. They place form input text or checkbox selections into global application stores. React documentation advises against this practice, as Principle 5 demonstrates.

### The Rule of Thumb: who owns the real value?

**Ask one question about every shared value: who owns the authoritative data? If the server owns it, keep one copy, in a common parent or a cache. If only the page knows it, keep it in `useState`, `useReducer`, or context.**

## SECTION | An Inbox with Two Tabs

Our example is a small email inbox. Two tab buttons sit at the top, `Inbox (2)` and `Sent`. While the `Inbox` tab is active, the page lists two emails, and each unread email displays a **Mark as read** button. While the `Sent` tab is active, the page displays one message, `No sent emails`.

```page caption="The inbox when the page opens: two tabs, and two unread emails with a Mark as read button each."
line: [Inbox (2)] [Sent]
line: Get your next month for $0.99 [Mark as read]
line: Lunch at 12? [Mark as read]
console: quiet
```

The server answers two requests. Here they are as two `fetch` calls:

```js title="The two requests the server answers"
~fetch('/api/emails')~; // A GET request: the server answers with the list of emails as JSON
fetch('/api/emails/1/read', ~{ method: 'POST' }~); // A POST request: the server marks email 1 as read
```

The list arrives as JSON. Each email has an id, a title, and a `read` field:

```json title="The answer to the GET request"
[
  { "id": 1, "title": "Get your next month for $0.99", "read": false },
  { "id": 2, "title": "Lunch at 12?", "read": false }
]
```

Two details of this code are new:
- **The `method` option.** The `{ method: 'POST' }` object instructs `fetch` to dispatch a POST request instead of a GET. A POST request asks the server to modify data.
- **The `read` field.** It originates from the server inside the JSON response. Client code did not invent it. A value of `false` indicates an unread email.

Our project begins with five files. The `App` component holds `folder`, tracking the active tab. It renders the tabs at the top. Below them, it conditionally renders either the list or the empty sent message. `FolderTabs` reads the emails to count unread messages, and `InboxList` reads them to render email rows. Neither component nests inside the other: both are direct children of `App`.

```files title="inbox: File Explorer" caption="How the files of our inbox sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` and mounts it inside `<StrictMode>`
  App.jsx | parent | Holds `folder` and shows `FolderTabs`, then `InboxList` or `No sent emails`
  components/
    FolderTabs.jsx | child | Shows the two tabs and counts the unread emails
    InboxList.jsx | child | Shows one row for each email, with a `Mark as read` button
```

From Principle 4 onward, a sixth file joins them: the shared fetcher utility.

**PRINCIPLES:** Data from the server is only a copy, so the page must keep exactly one copy of it. Five principles follow:
1. **Principle 1: Two Effects Keep Two Copies.** The tab and the list each fetch emails independently. Marking an email as read updates only the list copy, leaving the tab count unchanged.
2. **Principle 2: A New Mount Fetches Again.** Switching tabs unmounts the list and discards its state. Returning triggers `Loading...` and dispatches duplicate network requests.
3. **Principle 3: One Owner in `App` Keeps One Copy.** The parent component fetches data once and passes it downward, ensuring both child components read matching state.
4. **Principle 4: A Cache Library Shares One Answer for Each URL.** SWR retains responses outside the component tree. Every component requesting the same URL shares one network response.
5. **Principle 5: State Only the Page Knows Stays in React First.** Checkbox selections stay in `useState`. External stores are reserved for specialized cross-tree performance needs.

---

## PRINCIPLE | `fetch` in two Effects: each component keeps its own copy of the emails

> [!PRINCIPLE]
> **Principle 1: Two Effects, Two Copies: Each Component That Fetches Keeps Its Own Copy**
>
> *When two components fetch the same data in their own Effects, each one keeps its own copy in its own state, and a change to one copy never reaches the other.*
>
> The emails belong to the server, and every state that holds them is a copy. When the tab and the list each fetch the emails, the page holds two copies that only started out equal. **Mark as read** changes the list's copy, and nothing changes the tab's copy, so the tab still reads `Inbox (2)`. The Console shows no error, because every line did its job.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   const [emails, setEmails] = useState(null);
>   return (
>     <>
>       <FolderTabs ~emails={emails}~ /> {/* App holds the one copy: the tab reads it */}
>       <InboxList ~emails={emails}~ /> {/* The list reads the same copy */}
>     </>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function FolderTabs() {
>   const [emails, setEmails] = useState([]);
>   useEffect(() => { ~fetch('/api/emails')~.then(r => r.json()).then(setEmails); }, []); // **WRONG:** a second copy that Mark as read in the list never changes
> }
> ```

### The Smallest Version: Two Components, One URL

Here is the problem in its simplest form. Two components fetch the same URL, and each stores the response in its own local state. This minimal example omits markup and cleanup logic:

```jsx title="Two components that fetch the same URL"
function FolderTabs() {
  const [~emails~, setEmails] = useState([]); // Copy 1 of the emails lives in FolderTabs
  useEffect(() => { fetch('/api/emails').then(r => r.json()).then(setEmails); }, []);
}

function InboxList() {
  const [~emails~, setEmails] = useState(null); // Copy 2 of the emails lives in InboxList
  useEffect(() => { fetch('/api/emails').then(r => r.json()).then(setEmails); }, []);
}
```

Both components execute identical network requests. Once responses arrive, both state variables hold matching email items. **While the contents match initially, the arrays are separate objects in memory.** Each promise callback writes to an isolated state holder. The page now contains two independent copies, with no communication between them.

React documentation warns against state duplication. When identical data is duplicated across multiple state variables, keeping them synchronized becomes error-prone.

```tree caption="The same fetch line in two components fills two separate states, so the page keeps two copies."
Two components fetch the emails URL
- !`FolderTabs` [`fetch` `useState`] | Puts the answer into **its own `emails`** | Copy 1: used to **count the unread emails**
- !`InboxList` [`fetch` `useState`] | Puts the answer into **its own `emails`** | Copy 2: used to **show the rows**
```

### The Inbox with Two Effects

Now examine the complete component files. The parent component manages the active folder tab and renders the children:

```jsx title="src/App.jsx" startLine="1"
import { useState } from 'react';
import FolderTabs from './components/FolderTabs.jsx';
import InboxList from './components/InboxList.jsx';

export default function App() {
  const [~folder~, setFolder] = useState('inbox'); // The open tab: state that only the page knows
  return (
    <>
      <FolderTabs onFolderChange={setFolder} />
      {folder === 'inbox' ? <InboxList /> : <p>No sent emails</p>}
    </>
  );
}
```

The parent passes its setter down through the `onFolderChange` callback prop (Lesson 23). When the user clicks a tab button, the child notifies the parent with the selected tab identifier.

The tab component fetches emails inside its own Effect. During render, it computes the unread count using the array `filter` method (Lesson 22):

```jsx title="src/components/FolderTabs.jsx" startLine="1"
import { useState, useEffect } from 'react';

export default function FolderTabs({ onFolderChange }) {
  const [~emails~, setEmails] = useState([]); // Copy 1: the tab's own emails

  useEffect(() => {
    let ignore = false;
    fetch('/api/emails')
      .then(response => response.json())
      .then(json => {
        if (!ignore) setEmails(json);
      });
    return () => { ignore = true; };
  }, []);

  const ~unread~ = emails.filter(email => !email.read).length; // Counts the emails whose read field is false
  return (
    <div>
      <button onClick={() => onFolderChange('inbox')}>Inbox ({unread})</button>
      <button onClick={() => onFolderChange('sent')}>Sent</button>
    </div>
  );
}
```

The list component requests the same endpoint in its own Effect, rendering a loading placeholder until the network response completes:

```jsx title="src/components/InboxList.jsx" startLine="1"
import { useState, useEffect } from 'react';

export default function InboxList() {
  const [~emails~, setEmails] = useState(null); // Copy 2: the list's own emails

  useEffect(() => {
    let ignore = false;
    fetch('/api/emails')
      .then(response => response.json())
      .then(json => {
        if (!ignore) setEmails(json);
      });
    return () => { ignore = true; };
  }, []);
```

Below the Effect, the click handler sends a mutation request to the server, then updates local component state. The object spread syntax creates an updated email object with `read` set to true (Lesson 19):

```jsx title="src/components/InboxList.jsx" startLine="16"
  function handleMarkAsRead(id) {
    ~fetch('/api/emails/' + id + '/read', { method: 'POST' })~; // Tells the server the email is read
    ~setEmails~(emails.map(email => // **WRONG:** changes only the list's copy; the tab's copy keeps two unread emails
      email.id === id ? { ...email, read: true } : email
    ));
  }

  if (emails === null) return <p>Loading...</p>;
  return (
    <ul>
      {emails.map(email => (
        <li key={email.id}>
          {email.title}
          {!email.read && (
            <button onClick={() => handleMarkAsRead(email.id)}>Mark as read</button>
          )}
        </li>
      ))}
    </ul>
  );
}
```

### Why the Tab Stays on `Inbox (2)`

When the application first loads, both components agree on two unread emails. Then the user marks the first email as read:

::: row caption="The inbox before and after the user clicks Mark as read on the first email."
::: col title="Before the click" tag="both copies agree" tone=good
```page size=mini
line: [Inbox (2)] [Sent] | good
line: Get your next month for $0.99 [Mark as read]
line: Lunch at 12? [Mark as read]
console: quiet
```
The tab counts two unread emails, and the list shows two buttons.
:::
::: col title="After the click" tag="two answers on one page" tone=bad
```page size=mini
line: [Inbox (2)] [Sent] | bad
line: Get your next month for $0.99 | good
line: Lunch at 12? [Mark as read]
console: quiet
```
The list shows one unread email, and the tab still counts two.
:::
:::

**The button click notified the server and updated the list, but never touched the tab.** The developer console remains clear because every line executed without runtime errors. Here is the exact runtime sequence:
1. The page mounts. React mounts `FolderTabs` and `InboxList`, and both Effects dispatch initial GET requests. The network tab shows two requests, or four in development due to Strict Mode remounting (Lesson 47).
2. Each network response arrives and populates its local component state. The tab displays `Inbox (2)`, and the list renders two email rows.
3. The user clicks **Mark as read** on the first email row.
4. The `handleMarkAsRead` handler dispatches the POST request for email 1. It then calls the local state setter of `InboxList` with the updated list.
5. React re-renders `InboxList`. The first email row no longer displays its button.
6. No code invoked the state setter in `FolderTabs`. Its state still contains two unread messages, leaving the tab displaying `Inbox (2)`.

The server recorded the update. The list component reflected the change. The tab component remained completely unaware. Reloading the page forces both components to fetch fresh data, realigning both views to `Inbox (1)`. Until a full reload occurs, the screen presents conflicting information.

```tree dir=right caption="One click on Mark as read changes the server and the list, while the tab keeps its old copy."
What one click on Mark as read reaches
- +The server [`POST`] | Marks the first email **as read**
- +The list's copy [`setEmails` in `InboxList`] | The first row **loses its button**
- !The tab's copy [`emails` in `FolderTabs`] | **Nothing changes it** | The tab **still counts two**
```

### How This Bug Usually Grows

Developers rarely introduce duplicate state deliberately. It typically unfolds in gradual increments:
1. A developer implements the email list first, complete with its own data-fetching Effect.
2. Later, another developer adds an unread badge to navigation tabs, copying the existing fetch Effect into the tab component.
3. Initially, both components display matching numbers on page load.
4. As soon as a user mutates data, the badge fails to update.
5. Developers often attempt quick fixes by passing callback props between sibling components, creating fragile chains that break when new screens are added.

The durable solution is not adding extra synchronization handlers. The solution is establishing a **single copy**. Principle 3 lifts state to a common owner, and Principle 4 moves it into a dedicated cache.

---

## PRINCIPLE | `useState` in `InboxList`: the copy is thrown away on unmount, and the next mount fetches again

> [!PRINCIPLE]
> **Principle 2: A New Mount Fetches Again: State Ends When Its Component Unmounts**
>
> *A component that fetches in an Effect fetches again every time it mounts, because its state starts fresh, so the user waits again for data the page showed a moment ago.*
>
> When the user clicks `Sent`, React unmounts `InboxList` and throws away its `emails` state, and the copy goes with it. When the user clicks `Inbox`, a brand-new `InboxList` starts with `emails` set to `null`, shows `Loading...`, and sends the same request again. React does not keep the answer for us. To show the list at once, keep the copy in a component that stays on the page, or in a cache.
>
> **DO THIS:**
> ```jsx
> {folder === 'inbox'
>   ? <InboxList ~emails={emails}~ /> // App holds the copy and stays on the page: the list appears at once
>   : <p>No sent emails</p>}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function InboxList() {
>   const [emails, setEmails] = ~useState(null)~; // **WRONG:** React throws this copy away on every tab change, so Loading... shows again
> }
> ```

### A Component Shown Again Starts Fresh

The parent component conditionally mounts the list only when viewing the inbox folder:

```jsx title="The line in App that shows or hides the list"
{folder === 'inbox' ? ~<InboxList />~ : <p>No sent emails</p>} {/* While Sent is open, InboxList is not on the page */}
```

Recall component lifecycle rules from Lesson 25. When a component unmounts from the DOM tree, React discards its entire state. When that component renders again later, React creates a fresh instance initialized with default state. For the list component, its local email array is wiped out on unmount.

To a user, switching back to the inbox feels like returning to content seen seconds earlier. To React, each visit represents a completely **new mount**. State resets to `null`, the screen flashes `Loading...`, and the Effect dispatches another network call. React does not automatically cache responses across unmounts.

### What Happens When the User Clicks `Sent`, Then `Inbox`

No code files change in this principle. We observe the state of the app following Principle 1, where the first email is marked read while the tab still displays `Inbox (2)`. The user navigates to `Sent`, then immediately returns to `Inbox`. The user is forced to wait for data loaded moments ago, while the tab retains its stale count.

::: row caption="The inbox while Sent is open, right after the user clicks Inbox, and when the answer arrives."
::: col title="Sent is open" tag="InboxList is gone" tone=good
```page size=mini
line: [Inbox (2)] [Sent]
line: No sent emails
console: quiet
```
:::
::: col title="Right after Inbox" tag="a fresh InboxList" tone=bad
```page size=mini
line: [Inbox (2)] [Sent]
line: Loading... | bad
console: quiet
```
:::
::: col title="The answer arrives" tag="the tab is still wrong" tone=bad
```page size=mini
line: [Inbox (2)] [Sent] | bad
line: Get your next month for $0.99 | good
line: Lunch at 12? [Mark as read]
console: quiet
```
:::
:::

Here is the step-by-step sequence of events:
1. The user clicks `Sent`. The state setter triggers a re-render of `App`, which replaces the list component with the empty folder message.
2. React unmounts `InboxList`. Its Effect cleanup runs, and React destroys its local state in memory.
3. The user clicks `Inbox`. React mounts a brand-new instance of `InboxList`, initializing its state to `null`.
4. The interface displays `Loading...`, and the new Effect dispatches another GET request. The network inspector reveals a redundant fetch, or two in development.
5. The server returns the updated list. Because the server processed the earlier mutation, the first email returns marked as read.
6. The tab continues displaying `Inbox (2)`. The tab component remained mounted throughout the navigation, so its Effect never ran again.

React documentation highlights this drawback: "Fetching directly in Effects usually means you don't preload or cache data. For example, if the component unmounts and then mounts again, it would have to fetch the data again."

### What a Cache Would Keep

The missing architectural component is a **cache**. In computing, a cache stores network responses in memory so future reads can be fulfilled instantly. Instead of discarding data when a view unmounts, a client cache keeps the response ready outside individual component lifecycles. React documentation notes the user benefit: the user navigating back does not wait for data to load again because the response is already cached.

```tree caption="Where the copy of the emails lives decides what the user sees when the Inbox tab opens again."
What the user sees after Sent, then Inbox
- !The copy lives in `InboxList` [`emails` in `InboxList`] | The copy is **thrown away** on unmount | The user waits on **Loading** and the server gets **a new request**
- +The copy lives somewhere that stays | The copy **survives** while `InboxList` is gone | The list appears **at once**
```

An incomplete fix often tempts developers here. Observing the loading flash, someone might lift the list state into `App` while leaving the tab fetch untouched. This eliminates the loading spinner, but `App` and `FolderTabs` still maintain separate copies that drift apart after mutations. The proper solution unifies both copies under a single owner, which Principle 3 achieves.

---

## PRINCIPLE | `useState` in `App`: the tab and the list read one copy

> [!PRINCIPLE]
> **Principle 3: One Owner in the Common Parent: Fetch Once and Pass the Copy Down**
>
> *To give several components one copy of data from the server with React alone, fetch it once in their closest common parent, and pass the data and a function that changes it down through props or context.*
>
> Fetching the data and owning it are two separate jobs. When `App` fetches the emails and passes them to the tab and the list, the page holds one copy, its single source of truth. One `setEmails` call in `App` changes the tab and the list in the same render. The list also appears at once when the user comes back to `Inbox`, because `App` never unmounts. The cost grows with the app: the owner writes the loading, error, and `ignore` code again for every new piece of data from the server.
>
> **DO THIS:**
> ```jsx
> const [emails, setEmails] = useState(null);
> <FolderTabs ~emails={emails}~ /> {/* App holds the one copy: the tab reads it */}
> <InboxList emails={emails} onMarkAsRead={handleMarkAsRead} /> {/* The list reads it and asks App to change it */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [emails, setEmails] = useState(null);
> <FolderTabs emails={emails} />
> ~<InboxList />~ {/* **WRONG:** the list still fetches in its own Effect and keeps a second copy */}
> ```

### Fetching the Data vs. Owning It

Fetching network data and owning state are distinct responsibilities. A single component can own the state and manage fetching, while consumer components simply read that state via props. This technique is lifting state up (Lesson 24). React documentation advises lifting state to the closest shared parent whenever duplicate state causes synchronization difficulties.

Here is the core pattern. The parent component fetches data once and passes the identical state down to both child components:

```jsx title="One fetch in App, one copy for both children"
const [~emails~, setEmails] = useState(null); // The only copy of the emails, held by App

<FolderTabs emails={emails} /> {/* The tab reads App's copy */}
<InboxList emails={emails} /> {/* The list reads the same copy */}
```

This architecture establishes a **single source of truth**, where every piece of data has one authoritative owner. In this structure, the parent component owns the client copy of the emails.

Compare this structure with Principle 1. Both implementations fetch identical endpoints and display matching initial screens. **The underlying state architecture, however, is fundamentally different.** Two Effects produce two isolated state allocations. A single Effect in the parent creates one state allocation, allowing a single setter call to update both children simultaneously.

```tree caption="Two Effects in two children vs. one Effect in their common parent."
Who fetches the emails
- !Each child fetches them [`FolderTabs` and `InboxList`] | **Two copies** in two states | One click changes **one copy**, so the tab and the list **disagree**
- +`App` fetches them once [`App` passes `emails` down] | **One copy** in `App` | One click changes **the one copy**, so the tab and the list **agree**
```

### Moving the Effect and the Click Handler into `App`

The parent component takes ownership of the network Effect and the mutation handler:

```jsx title="src/App.jsx" startLine="1"
import { useState, useEffect } from 'react';
import FolderTabs from './components/FolderTabs.jsx';
import InboxList from './components/InboxList.jsx';

export default function App() {
  const [folder, setFolder] = useState('inbox');
  const [~emails~, setEmails] = useState(null); // The one copy of the emails

  useEffect(() => {
    let ignore = false;
    fetch('/api/emails')
      .then(response => response.json())
      .then(json => {
        if (!ignore) setEmails(json);
      });
    return () => { ignore = true; };
  }, []);

  function handleMarkAsRead(id) {
    fetch('/api/emails/' + id + '/read', { method: 'POST' });
    ~setEmails~(emails.map(email => // Changes the one copy: the tab and the list both re-render
      email.id === id ? { ...email, read: true } : email
    ));
  }
```

Below the handler, the parent passes `emails` down to both children. It supplies `handleMarkAsRead` to the list through the `onMarkAsRead` callback prop:

```jsx title="src/App.jsx" startLine="26"
  return (
    <>
      <FolderTabs ~emails={emails}~ onFolderChange={setFolder} /> {/* The tab reads App's copy */}
      {folder === 'inbox'
        ? <InboxList ~emails={emails}~ onMarkAsRead={handleMarkAsRead} /> // The list reads the same copy
        : <p>No sent emails</p>}
    </>
  );
}
```

The two child components no longer contain network Effects. The tab reads `emails` strictly through its props. Before the network response resolves, the prop value is `null`, so the tab displays zero unread items:

```jsx title="src/components/FolderTabs.jsx" startLine="1"
export default function FolderTabs({ ~emails~, onFolderChange }) { // emails now comes from App
  const unread = emails === null ? 0 : emails.filter(email => !email.read).length;
  return (
    <div>
      <button onClick={() => onFolderChange('inbox')}>Inbox ({unread})</button>
      <button onClick={() => onFolderChange('sent')}>Sent</button>
    </div>
  );
}
```

The list component also reads `emails` from props and invokes `onMarkAsRead` when the user clicks the row button:

```jsx title="src/components/InboxList.jsx" startLine="1"
export default function InboxList({ emails, onMarkAsRead }) {
  if (emails === null) return <p>Loading...</p>;
  return (
    <ul>
      {emails.map(email => (
        <li key={email.id}>
          {email.title}
          {!email.read && (
            <button onClick={() => ~onMarkAsRead(email.id)~}>Mark as read</button> // Asks App to change the one copy
          )}
        </li>
      ))}
    </ul>
  );
}
```

### The Tab and the List Now Give One Answer

A single button click now updates the single state copy, re-rendering both components in the same render cycle:
1. The user clicks **Mark as read** on the first row. The list invokes its `onMarkAsRead` prop with identifier 1, delegating to the handler in the parent.
2. The `handleMarkAsRead` function dispatches the POST request to the server and calls the state setter in the parent.
3. React re-renders the parent component and both child components. Both children receive the new array reference simultaneously.
4. The tab updates to `Inbox (1)`, and the first row hides its button.

This structure also resolves the re-fetching bug from Principle 2. When the user returns from `Sent`, React mounts a new list component that receives data immediately from the parent. Because the parent remained mounted, its state was preserved. No loading indicator appears, and no redundant network request is sent.

::: row caption="Mark as read and the return to the Inbox tab, with one copy of the emails in App."
::: col title="After Mark as read" tag="one answer" tone=good
```page size=mini
line: [Inbox (1)] [Sent] | good
line: Get your next month for $0.99 | good
line: Lunch at 12? [Mark as read]
console: quiet
```
The tab and the list read the same copy, so both changed together.
:::
::: col title="After Sent, then Inbox" tag="no Loading" tone=good
```page size=mini
line: [Inbox (1)] [Sent] | good
line: Get your next month for $0.99 | good
line: Lunch at 12? [Mark as read] | good
console: quiet
```
The copy lives in `App`, which stayed on the page, so the list appears at once.
:::
:::

### VS | Props vs. a Context for the One Copy: both carry the same one copy

The tab and list components are direct children of the parent component, so props reach them in a single step. In larger applications, consumer components often reside deep in the tree. In those architectures, the parent can provide state through React Context instead (Lesson 28).

Regarding state duplication, both approaches are functionally identical. Both maintain a single copy in parent state. Context simply removes the boilerplate of passing props through intermediate layers. Keep in mind that updating context re-renders all subscribing components (Lesson 59). For smaller apps, this overhead is negligible.

### What One Owner Still Leaves to Our Code

Manual state lifting works well for small applications. As an application expands, however, manual management introduces significant maintenance burdens:
1. New views require server data, such as sidebars, search results, and user settings.
2. Every endpoint requires dedicated loading flags, error handling, and cleanup logic in the parent component or root context.
3. Root components begin fetching data prematurely for views the user has not yet opened.
4. Every update to a consolidated context re-renders every subscribed component across the application.
5. Changes occurring on other devices remain invisible until the local application explicitly executes another fetch.

React documentation points out that writing all this custom orchestration amounts to building an in-house client cache. Doing so requires managing request deduplication, response caching, and avoiding waterfall network requests. That complexity marks the threshold where teams adopt dedicated data-fetching libraries.

---

## PRINCIPLE | `useSWR`: every component that asks for the same URL reads one cached answer

> [!PRINCIPLE]
> **Principle 4: A Client-Side Cache Library: Every Component Reads One Answer for Each URL**
>
> *A client-side cache library keeps one answer for each URL outside the components, sends one request for every component that asks for it, and fetches it again for all of them after a change.*
>
> A custom Hook such as `useData(url)` shares the code, so each call keeps its own copy. A data fetching library such as SWR shares the data. Every `useSWR` call with the emails URL reads the same cached answer, so the tab and the list cannot disagree. After the POST, `mutate` with the same URL fetches it again and updates every component that uses it. A component that mounts again shows the cached answer at once. React's docs recommend such a library, or a framework's own data fetching, over fetching in Effects.
>
> **DO THIS:**
> ```jsx
> const { data: emails } = ~useSWR('/api/emails', fetcher)~; // Reads the one cached answer for this URL
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const { data } = useSWR('/api/emails', fetcher);
> const [emails, setEmails] = ~useState(data)~; // **WRONG:** a second copy that never changes when the cache changes
> ```

### A Hook Called with a URL

React documentation illustrates how dedicated data-fetching libraries simplify component code. You call a Hook with an endpoint key, and the library provides the cached response:

```jsx title="React's docs sketch of a data fetching library"
const todos = ~useSomeDataLibrary~(`/api/user/${userId}/todos`); // A Hook from a library, called with the URL
```

For applications built without a meta-framework, React documentation recommends using a solution that deduplicates requests and caches responses across components.

> [!DEFINITION]
> **What is a client-side cache?** [NEW] A client-side cache is a shared storage layer in browser memory that retains and distributes server responses across components.
> 1. An external store outside the component tree maps request keys (such as endpoint URLs) to response payloads.
> 2. Components subscribe by calling a query Hook with an endpoint key, receiving cached data instantly.
> 3. Concurrent requests for the same key are deduplicated into a single network fetch.
>
> When data updates, mutating the key triggers a background refresh that updates all subscribing components in sync (Lesson 60).

Deduplication means coalescing multiple concurrent requests for the same endpoint into a single network call.

Dedicated libraries handle caching, deduplication, and invalidation automatically. React documentation highlights libraries like TanStack Query, SWR, and RTK Query for REST endpoints, alongside Apollo and Relay for GraphQL APIs.

This lesson demonstrates SWR because its API closely mirrors the declarative pattern: provide a URL key, receive cached data. The acronym SWR refers to stale-while-revalidate, a caching strategy that presents cached data immediately while revalidating freshness with the server in the background.

### VS | `useData(url)` vs. `useSWR(url, fetcher)`: the first shares the code, the second shares the data

Recall the custom Hook pattern from Lesson 39. Both approaches accept an endpoint URL and return data. Compare both implementations across our two components:

```jsx title="A custom Hook with an Effect inside, called in both components"
const emails = ~useData('/api/emails')~; // In FolderTabs: runs its own Effect into its own state
const emails = ~useData('/api/emails')~; // In InboxList: a second Effect, a second state, a second copy
```

```jsx title="The SWR Hook, called in both components"
const { data: emails } = ~useSWR('/api/emails', fetcher)~; // In FolderTabs: reads the cached answer for this URL
const { data: emails } = ~useSWR('/api/emails', fetcher)~; // In InboxList: reads the same cached answer
```

Because both Hooks expose identical signatures, developers often assume they provide equivalent behavior. **In reality, their data architectures are completely different:**
- **A custom Hook shares logic, not state.** Each invocation executes an isolated Effect with its own private state allocation, recreating the two-copy issue from Principle 1.
- **A client-side cache shares data across the entire client.** Every Hook invocation referencing the same endpoint key reads from a single shared cache entry.

```tree caption="A custom Hook shares the code of the fetch, while a client-side cache shares the answer itself."
Two Hooks called with the emails URL in two components
- !A custom Hook [`useData`] | Shares the **code**: each call has **its own state** | **Two copies** and **two requests**, as in Principle 1
- +A client-side cache [`useSWR`] | Shares the **data**: one answer **for each URL** | **One copy** and **one request** for both components
```

### Handing the Emails to SWR

First, install the library in your project directory:

```bash title="Terminal"
npm install swr
```

SWR relies on an external fetcher function that you provide. The fetcher receives the key and returns parsed response data. We define it in a dedicated file so multiple components can import it:

```js title="src/fetcher.js" startLine="1"
export const ~fetcher~ = url => fetch(url).then(response => response.json()); // SWR calls it with the URL and caches what it returns
```

The parent component drops its network Effect, local email state, and custom mutation handler. It retains only the active folder tab:

```jsx title="src/App.jsx" startLine="1"
import { useState } from 'react';
import FolderTabs from './components/FolderTabs.jsx';
import InboxList from './components/InboxList.jsx';

export default function App() {
  const [~folder~, setFolder] = useState('inbox'); // The only state left in App
  return (
    <>
      <FolderTabs onFolderChange={setFolder} />
      {folder === 'inbox' ? <InboxList /> : <p>No sent emails</p>}
    </>
  );
}
```

The tab component requests the emails endpoint from SWR. The SWR Hook returns an object whose `data` property holds the response payload, or `undefined` while loading:

```jsx title="src/components/FolderTabs.jsx" startLine="1"
import useSWR from 'swr';
import { fetcher } from '../fetcher.js';

export default function FolderTabs({ onFolderChange }) {
  const { ~data: emails = []~ } = useSWR('/api/emails', fetcher); // Renames data to emails, and uses [] while it is undefined
  const unread = emails.filter(email => !email.read).length;
  return (
    <div>
      <button onClick={() => onFolderChange('inbox')}>Inbox ({unread})</button>
      <button onClick={() => onFolderChange('sent')}>Sent</button>
    </div>
  );
}
```

The list component requests the identical endpoint URL. After dispatching the POST mutation, it calls the `mutate` helper provided by SWR. Calling `mutate` invalidates that URL in the cache, prompting SWR to re-fetch the resource and update all subscribed components:

```jsx title="src/components/InboxList.jsx" startLine="1"
import useSWR, { mutate } from 'swr';
import { fetcher } from '../fetcher.js';

export default function InboxList() {
  const { data: emails } = ~useSWR('/api/emails', fetcher)~; // The same URL as the tab: the same cached answer

  function handleMarkAsRead(id) {
    fetch('/api/emails/' + id + '/read', { method: 'POST' })
      .then(() => ~mutate('/api/emails')~); // After the server marks it read, fetch the URL again for every component
  }

  if (!emails) return <p>Loading...</p>;
  return (
    <ul>
      {emails.map(email => (
        <li key={email.id}>
          {email.title}
          {!email.read && (
            <button onClick={() => handleMarkAsRead(email.id)}>Mark as read</button>
          )}
        </li>
      ))}
    </ul>
  );
}
```

Notice the clean separation in `handleMarkAsRead`. The component contains no local state setters and passes no callback props to siblings. The tab component updates automatically because SWR maintains the cache outside React components. The endpoint URL functions as a global cache key. Both components subscribe to the same key, and when that cache record updates, SWR re-renders all subscribers.

### One Request, One Copy, and No Wait on the Way Back

The application now functions with consistent data synchronization across all views:
1. On initial load, both child components invoke `useSWR` with the same endpoint key.
2. SWR coalesces the calls into a single GET request. The network inspector logs one request across all mounting components.
3. When the user marks an email as read, the POST request completes and `mutate` invalidates the cache key.
4. SWR fetches fresh data into the cache, causing both components to re-render. The tab reflects `Inbox (1)`, and the button disappears from the row.
5. When the user toggles between folder tabs, the re-mounted list retrieves cached data instantly without displaying a loading spinner. SWR can quietly revalidate data in the background to ensure freshness.

Note one distinction from Principle 3. With standard cache invalidation, the UI waits for the server response before updating the view. Optimistic updates, where the UI updates before the network confirms, are covered in Lesson 44.

::: row caption="Mark as read and the return to the Inbox tab, with one cached answer in SWR."
::: col title="After Mark as read" tag="one answer" tone=good
```page size=mini
line: [Inbox (1)] [Sent] | good
line: Get your next month for $0.99 | good
line: Lunch at 12? [Mark as read]
console: quiet
```
Both components read the new answer from the cache.
:::
::: col title="After Sent, then Inbox" tag="no Loading" tone=good
```page size=mini
line: [Inbox (1)] [Sent] | good
line: Get your next month for $0.99 | good
line: Lunch at 12? [Mark as read] | good
console: quiet
```
The cache kept the answer while `InboxList` was gone.
:::
:::

### VS | One Owner in `App` vs. a Cache Library: both keep one copy, only the library writes the code around it

Once data arrives, both architectures present identical screens to the user. The crucial difference lies in where state lives and who manages network orchestration:
- **With a single owner in the parent component,** state resides in parent `useState`. Data flows downward via props, and developers must write bespoke loading, error, and cleanup code for each endpoint.
- **With a client-side cache library,** data resides in an external cache store. Components declare their data requirements directly, while the library manages deduplication, caching, and background re-fetching.

React documentation highlights these capabilities, noting that query libraries deduplicate requests, manage caching, and avoid waterfall request patterns. These libraries also integrate cleanly with route loaders for route-level prefetching (Lesson 46).

Whether a project selects TanStack Query, SWR, or RTK Query, the architectural boundary remains identical: **a cache library manages server responses, not local client UI state**. Client navigation state belongs in React state.

### How a Team Breaks the Cache

Even with a cache library, teams can accidentally reintroduce state duplication. This typically happens through one common anti-pattern:
1. A team integrates a data-fetching library for server endpoints.
2. A developer copies the query result into local component `useState` to enable local editing.
3. The local `useState` copy stops receiving updates when the cache revalidates.
4. Different views drift out of sync again, reproducing the bug from Principle 1.

The query result is already the authoritative client copy. Read it directly from the query Hook, and trigger updates through server mutations and cache invalidation.

---

## PRINCIPLE | `useState` for the ticked emails: state that only the page knows stays in React first

> [!PRINCIPLE]
> **Principle 5: State That Only the Page Knows: Keep It in React's Own State First**
>
> *Once the data from the server lives in a cache, keep the state that only the page knows in `useState`, `useReducer`, and context, and move it to an external store only when that pays off.*
>
> The open tab and the ticked emails belong to the page, not to the server. They stay in `useState` in the closest common parent, or in a context with a reducer when many distant components read and change them. An external store holds state outside React. Through `useSyncExternalStore`, each component re-renders only when its own snapshot changes by `Object.is`, while every context reader re-renders on a new value. That helps when many components read small parts of state that changes often, or when the state already lives in code outside React. React's docs recommend the built-in tools first.
>
> **DO THIS:**
> ```jsx
> const [~selectedIds~, setSelectedIds] = useState([]); // State that only the page knows stays in App
> const { data: emails } = useSWR('/api/emails', fetcher);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> let emails = [];
> let selectedIds = [];
> export const inboxStore = {
>   ~loadEmails~() { // **WRONG:** a hand-made copy of the server's data inside a global store
>     fetch('/api/emails').then(r => r.json()).then(json => { emails = json; });
>   },
> };
> ```

### What Is Left Once the Emails Live in a Cache

Our page now adds checkboxes to email rows, alongside a counter showing how many messages are selected, such as `1 selected`. Checkboxes allow users to perform batch actions on multiple items simultaneously.

After adopting SWR in Principle 4, the parent component tracks only the active folder tab. Selection state represents another piece of client-only state. Like folder navigation, selected checkboxes belong strictly to the browser session. The server does not store which rows are currently checked. Therefore, selection state belongs in `useState` within the parent component:

```jsx title="The ticked emails in App"
const [~selectedIds~, setSelectedIds] = useState([]); // The ids of the ticked emails: state that only the page knows
```

Introducing an external global store here adds boilerplate without tangible user benefit. React documentation recommends preferring local component state and avoiding unnecessary state lifting. They specifically advise against placing transient UI state, like form inputs or hover toggles, into global state libraries.

**Transient state** describes temporary UI data that exists only while a user interacts with a feature. Form drafts and highlighted rows are classic examples. Selected checkboxes serve this temporary role until batch actions execute.

### A Checkbox on Each Row

The parent component adds a toggle handler for email selections. It passes `selectedIds` and the toggle handler to the list via props:

```jsx title="src/App.jsx" startLine="5"
export default function App() {
  const [folder, setFolder] = useState('inbox');
  const [selectedIds, setSelectedIds] = useState([]);

  function handleToggle(id) {
    setSelectedIds(selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id]);
  }

  return (
    <>
      <FolderTabs onFolderChange={setFolder} />
      {folder === 'inbox'
        ? <InboxList ~selectedIds={selectedIds}~ onToggle={handleToggle} /> // The ticked ids go down as props
        : <p>No sent emails</p>}
    </>
  );
}
```

The list component receives both props. It displays the counter whenever at least one email is checked, rendering a controlled checkbox on each row (Lesson 20):

```jsx title="src/components/InboxList.jsx" startLine="4"
export default function InboxList({ ~selectedIds, onToggle~ }) { // The ticks come from App as props
  const { data: emails } = useSWR('/api/emails', fetcher);

  function handleMarkAsRead(id) {
    fetch('/api/emails/' + id + '/read', { method: 'POST' })
      .then(() => mutate('/api/emails'));
  }

  if (!emails) return <p>Loading...</p>;
  return (
    <>
      {selectedIds.length > 0 && <p>{selectedIds.length} selected</p>}
      <ul>
        {emails.map(email => (
          <li key={email.id}>
            <input
              type="checkbox"
              ~checked={selectedIds.includes(email.id)}~ // Ticked when App's selectedIds holds this id
              onChange={() => onToggle(email.id)}
            />
            {email.title}
            {!email.read && (
              <button onClick={() => handleMarkAsRead(email.id)}>Mark as read</button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
```

The first email is already read. The user ticks `Lunch at 12?`:

```page caption="The inbox after the user ticks Lunch at 12?. The first email is already read, so only the second row keeps its Mark as read button."
line: [Inbox (1)] [Sent]
line: 1 selected | good
form:
  check: Get your next month for $0.99
  check: Lunch at 12? | on | good
  button: Mark as read
console: quiet
```

Because the parent component holds selection state, selected items persist when toggling between folder tabs, just as cached emails survive in SWR.

### VS | `useState` vs. an External Store for the Ticked Emails: the same screen, different re-renders

Developers frequently assume expanding applications inevitably demand global state management libraries like Redux. React documentation categorizes these as third-party state management libraries that store state outside React. Recall from Lesson 53 that external stores maintain state outside the React render tree, allowing components to subscribe using the `useSyncExternalStore` Hook.

> [!DEFINITION]
> **What is an external store?** [REVIEW] An external store is state held outside the React component tree in plain JavaScript.
> 1. A standalone module holds a state variable and maintains a list of listener callbacks.
> 2. The store exposes a `subscribe` function to register callbacks and a `getSnapshot` function to return the current value.
> 3. Components subscribe through `useSyncExternalStore(store.subscribe, store.getSnapshot)`.
>
> React compares each returned snapshot using `Object.is`. A component re-renders only when its specific snapshot produces a different value, skipping renders when other parts of the store change (Lesson 53).

Here is our selection state implemented as an external store, matching the store pattern from React documentation:

```js title="src/selectionStore.js" startLine="1"
let selectedIds = [];
let listeners = [];

export const selectionStore = {
  toggle(id) {
    selectedIds = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    ~listeners.forEach(listener => listener())~; // Tells React that the store changed
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return selectedIds;
  },
};
```

On screen, built-in React state and this external store produce identical visual results. For a page rendering a few rows, built-in React state is the recommended choice. This store example exists solely to demonstrate render optimization differences.

What external stores change is component re-render granularity. To observe this distinction, imagine each row extracted into an isolated `EmailRow` component that logs every render. Compare two approaches for determining whether a row is selected:
1. **Using React Context.** The parent stores selection state and provides it via a context provider (Lesson 28).
2. **Using an external store.** Each row subscribes directly to the external store via a snapshot selector.

```jsx title="With selectedIds in a context: each row reads the whole array"
const selectedIds = ~useContext(SelectionContext)~; // After every tick, a new array: every row re-renders
const isSelected = selectedIds.includes(email.id);
```

```jsx title="With selectedIds in selectionStore: each row reads only its own answer"
const isSelected = ~useSyncExternalStore~( // React compares each row's true or false with Object.is
  selectionStore.subscribe,
  () => selectionStore.getSnapshot().includes(email.id)
);
```

Both patterns supply each row with an identical boolean value. **Their rendering characteristics, however, differ significantly:**
- **With React Context,** every subscribing component re-renders whenever the context value reference updates (Lesson 59). Toggling one item updates the array, causing every row to re-render.
- **With an external store,** each component subscribes to a specific snapshot. React evaluates each component snapshot and checks for equality using `Object.is`. Only rows whose boolean status actually changed execute a re-render.

Here is the component implementation utilizing the external store:

```jsx title="src/components/EmailRow.jsx" startLine="1"
import { useSyncExternalStore } from 'react';
import { selectionStore } from '../selectionStore.js';

export default function EmailRow({ email }) {
  const isSelected = useSyncExternalStore(
    selectionStore.subscribe,
    () => ~selectionStore.getSnapshot().includes(email.id)~ // Only this row's answer: true or false
  );
  console.log('EmailRow rendered:', email.title);
  return (
    <li>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => selectionStore.toggle(email.id)}
      />
      {email.title}
    </li>
  );
}
```

The snapshot function provided in the second argument is instantiated on every render. That is expected behavior. React evaluates this function and checks whether the returned primitive boolean changed (Lesson 53).

When the user selects the second email, here is what happens within the external store architecture:
1. Calling `selectionStore.toggle` with identifier 2 creates a new selection array and notifies all registered listeners.
2. React invokes the snapshot selector for each subscribed row. The first row receives `false`, identical to its previous value. The second row receives `true`, which differs from its previous snapshot.
3. React re-renders only the second row. The console logs render output for the second email, while skipping the first row entirely.

In development mode, Strict Mode executes component render functions twice per update, printing each log line twice (Lesson 47):

::: row caption="The two rows and the Console after the user ticks Lunch at 12?, with the ticked ids in a context and in an external store."
::: col title="selectedIds in a context" tag="both rows re-render" tone=bad
```page size=mini
form:
  check: Get your next month for $0.99
  check: Lunch at 12? | on
log: EmailRow rendered: Get your next month for $0.99 | EmailRow.jsx:9
log: EmailRow rendered: Get your next month for $0.99 | EmailRow.jsx:9
log: EmailRow rendered: Lunch at 12? | EmailRow.jsx:9
log: EmailRow rendered: Lunch at 12? | EmailRow.jsx:9
```
A new array in the context re-renders every row that reads it.
:::
::: col title="selectedIds in selectionStore" tag="only the ticked row" tone=good
```page size=mini
form:
  check: Get your next month for $0.99
  check: Lunch at 12? | on
log: EmailRow rendered: Lunch at 12? | EmailRow.jsx:9
log: EmailRow rendered: Lunch at 12? | EmailRow.jsx:9
```
Only the second row's answer changed, so only it re-renders.
:::
:::

### When an External Store Pays Off

In small lists, an extra component render produces negligible computational overhead and updates no DOM nodes if markup remains unchanged (Lesson 54). Adopting an external store is justified in only two specific scenarios:
1. **Numerous distant components subscribe to granular slices of frequently updating state,** and context updates cause noticeable render lag across large component trees. Profiling must demonstrate this bottleneck first.
2. **State already exists outside React,** such as third-party state managers or non-React browser APIs. React documentation recommends built-in state tools like `useState` and `useReducer` by default. They reserve `useSyncExternalStore` primarily for integrating non-React sources.

```tree caption="Where each kind of state in the inbox belongs."
Where the inbox keeps each kind of state
- +A copy of data from the server [`emails`] | A **client-side cache** or the framework's data fetching | One answer for each URL, **shared by every component**
- +State that only the page knows [`folder` `selectedIds`] | **`useState`**, **`useReducer`**, and **context** | Lifted only as far as the components that need it
- +The same state, read in small parts by many components [`useSyncExternalStore`] | An **external store** | Only when context re-renders too much, or the state lives **outside React**
```

Adopting a global store prematurely often resurrects the synchronization issues seen in Principle 1:
1. A team introduces a global store early in development.
2. Developers place server responses into the store alongside local navigation and form state.
3. The global store now contains an uncontrolled client snapshot. The team writes redundant boilerplate for loading states, error handling, and manual revalidation.
4. Data mutations from other users never reach the store, leading to stale data drift.

A global store is not an automatic replacement for server caching. A purpose-built server cache manages remote state synchronization, while React state handles local UI behavior. Always keep the core doctrine in mind: **data from the server is only a copy, so the client must keep exactly one copy of it.**

---

## All 5 Principles Together

### The Complete Project

Here is the finalized email application architecture:
1. Server emails live in the SWR cache, mapped to the single endpoint URL.
2. Both the folder tab and the email list consume that single cached record.
3. The parent component manages only client-owned state: the active folder tab and selected email IDs.

The entry file mounts `App` inside `<StrictMode>`:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

The fetcher gives SWR the answer for a URL:

```js title="src/fetcher.js"
export const fetcher = url => fetch(url).then(response => response.json());
```

`App` holds the open tab and the ticked emails:

```jsx title="src/App.jsx"
import { useState } from 'react';
import FolderTabs from './components/FolderTabs.jsx';
import InboxList from './components/InboxList.jsx';

export default function App() {
  const [folder, setFolder] = useState('inbox');
  const [~selectedIds~, setSelectedIds] = useState([]); // Principle 5: state that only the page knows stays in useState

  function handleToggle(id) {
    setSelectedIds(selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id]);
  }

  return (
    <>
      <FolderTabs onFolderChange={setFolder} />
      {folder === 'inbox'
        ? <InboxList selectedIds={selectedIds} onToggle={handleToggle} />
        : <p>No sent emails</p>}
    </>
  );
}
```

The tab counts the unread emails from the cached answer:

```jsx title="src/components/FolderTabs.jsx"
import useSWR from 'swr';
import { fetcher } from '../fetcher.js';

export default function FolderTabs({ onFolderChange }) {
  const { data: emails = [] } = ~useSWR('/api/emails', fetcher)~; // Principles 1 and 4: the same cached answer as the list
  const unread = emails.filter(email => !email.read).length;
  return (
    <div>
      <button onClick={() => onFolderChange('inbox')}>Inbox ({unread})</button>
      <button onClick={() => onFolderChange('sent')}>Sent</button>
    </div>
  );
}
```

The list shows the rows from the same cached answer, and asks SWR to fetch it again after **Mark as read**:

```jsx title="src/components/InboxList.jsx"
import useSWR, { mutate } from 'swr';
import { fetcher } from '../fetcher.js';

export default function InboxList({ selectedIds, onToggle }) {
  const { data: emails } = ~useSWR('/api/emails', fetcher)~; // Principle 2: a new mount shows the cached answer at once

  function handleMarkAsRead(id) {
    fetch('/api/emails/' + id + '/read', { method: 'POST' })
      .then(() => ~mutate('/api/emails')~); // Principle 4: every component that reads this URL gets the new answer
  }

  if (!emails) return <p>Loading...</p>;
  return (
    <>
      {selectedIds.length > 0 && <p>{selectedIds.length} selected</p>}
      <ul>
        {emails.map(email => (
          <li key={email.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(email.id)}
              onChange={() => onToggle(email.id)}
            />
            {email.title}
            {!email.read && (
              <button onClick={() => handleMarkAsRead(email.id)}>Mark as read</button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
```

### How React Renders the Inbox

React executes `App` first. `App` renders the navigation tabs, followed conditionally by either the list or the empty folder notice. Both child components consume the single cached response from SWR, which resides outside the component tree:

```tree caption="The order in which React calls the components of the inbox, and where each one reads its data."
`App` [Holds `folder` and `selectedIds`] | Renders `FolderTabs` first, then `InboxList` or the Sent line
- +`FolderTabs` [`useSWR` with the emails URL] | Reads the **one cached answer** | Counts the **unread emails** for the tab
- +`InboxList` [`useSWR` with the emails URL] | Reads the **same cached answer** | Shows **one row** for each email, with the ticks from `App`
```

After the user marks the first email as read and ticks `Lunch at 12?`, the entire page reflects synchronized state:

```page caption="The finished inbox after the user marks the first email as read and ticks Lunch at 12?. Only the second row keeps its Mark as read button."
line: [Inbox (1)] [Sent] | good
line: 1 selected | good
form:
  check: Get your next month for $0.99
  check: Lunch at 12? | on | good
  button: Mark as read
console: quiet
```

### Where Each Kind of State Lives

| Kind of state | Where it lives on our page | What goes wrong elsewhere |
| :--- | :--- | :--- |
| **The emails, a copy of data from the server** | The SWR cache, one answer for the emails URL | In an Effect in each component, the tab and the list keep two copies and disagree after one click |
| **The emails, shown again after a tab change** | The same cached answer, shown at once | In the state of `InboxList`, the copy is thrown away and the user waits on `Loading...` again |
| **The open tab, `folder`** | `useState` in `App` | In a global store, it adds code and changes nothing the user sees |
| **The ticked emails, `selectedIds`** | `useState` in `App`, passed down as props | In an external store, it pays off only when many distant components read it, or when it lives outside React |

---

## For the Interview

> **The Interview Question:** When does an app outgrow useState and context, and what do external stores and server-cache libraries add?

### How to Answer Clearly in 30 Seconds

"I distinguish between server cache copies and state owned strictly by the client. Most shared data in an application represents a cached copy of server data. When components fetch that data in separate Effects, each component holds a detached copy that easily drifts out of sync. Furthermore, unmounting and remounting those components causes redundant network round trips.

To maintain data integrity, I follow three clear rules:
1. **In small applications,** I lift the data to the closest common parent or context. This establishes a single source of truth, though developers still manage loading, error, and cleanup logic manually.
2. **Across growing applications sharing server data,** I use a dedicated data-fetching library like TanStack Query, SWR, or framework route loaders. These tools deduplicate requests, manage memory caching across component lifecycles, and handle automated cache invalidation after mutations.
3. **For client-owned UI state,** such as active navigation tabs or form drafts, I keep state in `useState`, `useReducer`, or React Context. An external store read via `useSyncExternalStore` is reserved for performance-sensitive state where many components subscribe to granular slices, or when integrating state that already lives outside React."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"I moved the fetch into a custom Hook, `useData(url)`, and called it in both components. Why do they still disagree?"**
   A custom Hook shares logic, not state. Each invocation of `useData` runs an isolated Effect with its own private state allocation, creating separate copies and duplicate network requests. To share data, state requires a shared storage location: a common parent, a context provider, or an external client cache. With SWR, every Hook call referencing the same URL key reads from the same cache record, preventing state drift.
2. **"What does a client-side cache library add that lifting the data into context does not?"**
   Both patterns provide a single source of truth, but a cache library handles the entire network lifecycle around that data. It deduplicates concurrent requests, preserves responses across component unmounts, and automatically refreshes subscribers after mutations. This removes repetitive boilerplate for loading states, error handling, and manual revalidation. React documentation explicitly recommends dedicated client-side caches for non-framework applications.
3. **"When would you reach for an external store, or a library such as Redux, instead of context?"**
   Only for client-owned state that benefits from fine-grained subscription tracking. Server data belongs in a server cache, not a global client store. React Context re-renders every subscribing component whenever the context value reference updates. An external store consumed via `useSyncExternalStore` re-renders a component only when that component's specific selector snapshot changes according to `Object.is`. This optimization helps when numerous components read tiny slices of high-frequency state, or when syncing with state external to React.

```tree dir=right caption="Interview summary: where each kind of state belongs as an app grows."
Choosing where state lives as an app grows
- !Two Effects for the same data [`fetch` in `FolderTabs` and `InboxList`] | **Two copies** and two requests | One click leaves **two answers** on the page
- +One owner or a client-side cache [`App` holds `emails` or `useSWR`] | **One copy** of the server's data | The cache also shares **one request** and keeps the answer **after an unmount**
- +React state first, a store when it pays off [`useState` `useReducer` `useSyncExternalStore`] | State that **only the page knows** | A store re-renders **only the components whose snapshot changed**
```
