# Lecture 13: The Chorus of Click Heres
> INTERVIEW QUESTION | ❱ CORE | What distinguishes a good link from a bad one, and when should you use a button instead?

1. Maya opens the National Times opinion package on metropolitan rail transit reform.
2. She opens her screen reader's Links List dialog to jump straight to the cited economic studies.
3. Maya's headphones fill with an incomprehensible list: "Click here, Click here, Read more, Download, Click here".
4. Which link opens the high-speed rail study and which link downloads the municipal tax audit?
5. Maya cannot distinguish a single destination without closing the dialog and reading through three thousand words of text.
6. She attempts to open the feedback drawer on a link tag, and the spacebar scrolls the page downward instead.
7. Today we banish ambiguous anchor text, master descriptive context, and enforce the platform divide between links and buttons.

### The Non-Visual Links List: Browsing Out of Context

Sighted readers absorb hyperlinks within the surrounding sentence structure. When an editorial paragraph says "To inspect the five-year engineering feasibility study, click here," eyes effortlessly bridge the gap between the sentence's premise and the underlined two words at the end.

Non-visual readers frequently browse the web by extracting elements into specialized navigation dialogs. In desktop screen readers like JAWS and NVDA, pressing `Insert + F7` extracts all hyperlinks on the page into an alphabetical Links List. In Apple VoiceOver, users open the Rotor and navigate to the Links pane.

Inside these lists, links are stripped of their surrounding sentences. Maya hears only the raw text enclosed between `<a>` and `</a>`. A page littered with lazy anchor text becomes an auditory nightmare:

```canvas title="/opinion/civic-reform — Opinion & Analysis"
url=https://nationaltimes.com/opinion/civic-reform
zoom=100%
masthead | The National Times | opinion | search
nav | Civic Forum; Editorial Board; Letters | landmark=navigation
h1 | Why Metropolitan Transit Reform Cannot Wait
text | Regional mobility hinges on modernizing urban rail corridors and establishing dedicated bus lanes across all five districts.
link | Click here | url="/studies/rail-corridor-2026.pdf" | wrong
text | Comprehensive cost estimates and federal matching grant requirements are detailed in our regional transit dispatch.
link | Read more | url="/reports/transit-cost-allocations" | wrong
sr | Links List: Click here (1 of 5) | Read more (2 of 5) | Click here (3 of 5) | Download (4 of 5)
contrast | #0f172a on #ffffff | 16.2:1 pass
kbd | Spacebar on link scrolls page instead of activating; Enter navigates
```

Here is the problematic markup that stranded Maya:

```html title="ambiguous-links.html"
<p>
  To inspect the regional rail feasibility report,
  <a href="/studies/rail-corridor-2026.pdf">click here</a>. <!-- **WRONG:** anchor text conveys zero destination context in **LINKS LIST** -->
</p>
<p>
  For municipal tax impact projections,
  <a href="/reports/transit-cost-allocations">read more</a>. <!-- **WRONG:** generic phrase is indistinguishable from dozens of other **PAGE LINKS** -->
</p>
```

When Maya opens her screen reader rotor, she hears five identical "Click here" entries. She cannot determine file types, destinations, or topics without abandoning her shortcut and hunting through the DOM line by line.

### What Makes Link Text Accessible?

Under WCAG 2.2 Success Criterion 2.4.4 (Link Purpose In Context, Level A), the purpose of each link must be determinable from the link text alone, or from the link text together with its programmatically determined context:

> The intent of this success criterion is to help users understand the purpose of each link so they can decide whether they want to follow the link. Whenever possible, provide link text that identifies the purpose of the link without needing additional context. Assistive technology has the ability to provide users with a list of links that are on the web page. Link text that is as meaningful as possible will aid users who want to choose from this list of links. Meaningful link text also helps those who wish to tab from link to link. Meaningful links help users choose which links to follow without requiring complicated strategies to understand the page.
*W3C, Understanding WCAG 2.2: Link Purpose (In Context), `resources/accessibility/wcag/understanding/20/link-purpose-in-context.html`*

To satisfy Criterion 2.4.4 and make out-of-context browsing seamless, follow three practical authoring rules:

```html title="accessible-links.html"
<p>
  Review the <a href="/studies/rail-corridor-2026.pdf">Regional Rail Feasibility Report (PDF, 4.2MB)</a>. <!-- **RIGHT:** announces destination and document **FORMAT** -->
</p>

<article class="opinion-card">
  <h2>Corridor Electrification Timelines</h2>
  <a href="/reports/electrification">
    Read more <span class="sr-only">about corridor electrification timelines</span> <!-- **RIGHT:** visually hidden suffix provides out of context **CLARITY** -->
  </a>
</article>

<a href="/reports/tax-impact" aria-label="Read full report on municipal transit tax impacts"> <!-- **RIGHT:** aria-label provides complete accessible **NAME** -->
  Read more
</a>
```

Notice the power of including the file format and file size when linking directly to non-HTML documents: `Regional Rail Feasibility Report (PDF, 4.2MB)`. A user on a metered mobile connection or using software that struggles with large PDFs knows exactly what will happen before following the link.

For compact news cards where visual designers demand a concise "Read more" link, use the `.sr-only` class. Sighted users see "Read more", while screen reader users hear: "Read more about corridor electrification timelines, link".

### Links Navigate, Buttons Act: The Fauxtton Anti-Pattern

The second half of the interview question addresses the architectural boundary between hyperlinks and buttons: when should you use a button instead of a link?

The rule of web architecture is absolute:
- **Links (`<a>`) Navigate:** A link takes the user somewhere. It changes the URL, loads a new document, or jumps to a specific anchor fragment on the current page.
- **Buttons (`<button>`) Act:** A button does something. It submits a form, opens a modal dialog, toggles a drawer, plays an audio stream, or modifies page data without changing locations.

When developers use an `<a>` tag to perform an action, they create a **fauxtton** (a fake button):

```html title="fauxtton-trap.html"
<a href="#" class="btn-share" onclick="openShareModal()"> <!-- **WRONG:** anchor used for action creates severe keyboard **DEFECTS** -->
  Share Article
</a>
```

This antipattern introduces three severe accessibility defects:

1. **Role Misrepresentation.** The browser registers the control as a `link`. Screen readers announce: "Share Article, link". Maya expects activating this element to navigate her to a new page. Instead, a modal window appears, creating disorientation.

2. **The Spacebar Defect.** Native `<button>` elements respond to both Enter and Space. Native `<a>` elements respond **only** to the Enter key. When Maya presses the Spacebar on an `<a>` tag, the browser executes the default behavior of the spacebar: it scrolls the entire page downward by one viewport height. The user loses their reading position while the modal remains closed.

3. **URL Fragmentation.** The `href="#"` dummy attribute adds a hash to the browser address bar, corrupting the user's history and scrolling the page to the top if `event.preventDefault()` fails.

If an element performs an on-page action, use `<button type="button">`. If an element navigates to a new destination or page fragment, use `<a href="...">`.

```html title="correct-separation.html"
<button type="button" class="btn-share" onclick="openShareModal()"> <!-- **RIGHT:** native button supports keyboard and announces **ACTION** -->
  Share Article
</button>

<a href="/opinion/archive" class="link-archive"> <!-- **RIGHT:** native link updates location cleanly **ON ENTER** -->
  Browse Opinion Archives
</a>
```

> [!KEY]
> Links navigate to a destination and activate with Enter; buttons execute an action and activate with both Enter and Space. Never use a dummy link to trigger an on-page interaction.

> [!TIP]
> **To impress the interviewer:** define the dual failure of bad link design: semantic ambiguity (using "Click here" or "Read more", which turns the screen reader Links List into an unnavigable chorus of duplicates) and functional confusion (building "fauxttons" by placing onclick actions on `<a href="#">`). Explain the keyboard mechanics: links activate only on Enter, so pressing Space on a fake link scrolls the viewport downward instead of triggering the handler. Conclude with the Golden Rule: links navigate to a URL; buttons execute a state change.

### Where you will meet this

- Investigative journalism dossiers: writing descriptive anchor text for PDF downloads including file types and sizes.
- News card feeds: using `.sr-only` suffixes on "Read more" links so card destinations remain distinct in screen reader rotors.
- Social sharing widgets: replacing fake link anchors with true `<button>` elements for modal triggers and clipboard copying.
- Pagination controls: using links for URL-driven page numbers, but using buttons for dynamic asynchronous "Load more" triggers.
- Navigation breadcrumbs: ensuring each trail step explicitly names the parent category rather than relying on ambiguous icons.

### Glossary

- **Link Purpose in Context (WCAG 2.4.4)**: The Level A accessibility requirement that the purpose of each link can be determined from the link text alone or from its immediate programmatic context.
- **Links List Dialog**: A specialized screen reader navigation window that extracts all hyperlinks from a page into an alphabetical or linear list for rapid out-of-context browsing.
- **Ambiguous Anchor Text**: Generic link labels like "Click here" or "Read more" that convey no information about destination or resource type when read independently.
- **Fauxtton**: An anti-pattern where a hyperlink tag is used to trigger JavaScript actions, misrepresenting the control's role and breaking spacebar activation.
- **Visually Hidden Suffix (.sr-only)**: An accessible styling pattern that appends explanatory text for screen readers without altering visual editorial design.
- **Modal Action Boundary**: The architectural rule dictating that opening dialogs, submitting data, and toggling states belong exclusively to native button elements.

### Summary

**Anchor Text Architecture and the Link Versus Button Divide**

In production frontend engineering, hyperlinks are not stylistic flourishes; they form the primary navigable graph of the web. Screen reader users extract links into out-of-context index menus, while keyboard users rely on predictable activation semantics. Ambiguous link labels like "Click here" render navigation indexes useless, while conflating links with buttons corrupts native keyboard interaction. Keep your anchors descriptive and respect the platform boundary between navigation and actions. Here is your streetwise review.

❒ The Rules of Descriptive Links

1. Anchor text must state the destination or resource.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Never use generic placeholders like "click here", "read more", "link", or "details".<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Note file types and sizes directly in the text when linking to non-HTML documents like PDFs.
2. Use `.sr-only` to reconcile visual minimalism with accessibility.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Sighted readers see compact teaser text while screen readers speak the full contextual sentence.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Guarantee that every link in the rotor list provides a distinct, intelligible label.

❒ The Developer's Levers

1. Never use generic anchor text without descriptive context.

**DO NOT DO THIS:** Provide ambiguous links that convey zero meaning in out-of-context lists.
```html wrong
<p>To view our transit study, <a href="/study.pdf">click here</a>.</p>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Place the destination topic directly inside the clickable anchor text.
```html right
<p>Download our <a href="/study.pdf">Transit Study (PDF, 2MB)</a>.</p>
```
2. Never use anchor tags for on-page JavaScript actions.

**DO NOT DO THIS:** Build a fauxtton using an anchor tag and a dummy hash href.
```html wrong
<a href="#" onclick="toggleSettings()">Open Settings</a>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Use a native button element that responds cleanly to Space and Enter.
```html right
<button type="button" onclick="toggleSettings()">Open Settings</button>
```

➔ NEVER attach action handlers to `<a href="#">` or `<a href="javascript:void(0)">`.

➔ ALWAYS include file format and file size when linking directly to downloadable documents.

➔ IF an element alters page state without changing the URL THEN use a `<button>` rather than a link.

| | **HYPERLINK (`<a>`)**<br>(navigation) | **BUTTON (`<button>`)**<br>(action) |
| ---: | :--- | :--- |
| **Primary purpose** | Navigates to a new URL<br>or page fragment | Executes an action or<br>modifies application state |
| **Keyboard activation** | Activated exclusively<br>by Enter key | Activated by both<br>Enter and Space keys |
| **Spacebar behavior** | Space scrolls viewport<br>downward by default | Space triggers click<br>without scrolling page |
| **Role announcement** | Spoken as "Link"<br>to assistive tools | Spoken as "Button"<br>to assistive tools |
| **Navigation list** | Extracted into screen<br>reader Links List | Ignored by Links List;<br>kept in form controls |
