# Lecture 7: The Document Outline and Heading Hierarchy
> INTERVIEW QUESTION | ❱ CORE | How do headings structure a page for screen reader users, and what makes a heading hierarchy correct?

1. Marcus, a daily subscriber who is blind, opens the National Times website to read the morning sports coverage.
2. He presses a keyboard shortcut to jump directly from one major section title to the next.
3. The speech synthesizer chirps an error chime and announces that no section titles exist on the page.
4. Why does the shortcut find nothing when large bold title text is clearly visible on the screen?
5. Without real titles in the markup, Marcus must listen to hundreds of unrelated links just to find sports.
6. Sighted designers see clear section divisions, while the audio software perceives an endless flat wall of text.
7. Today you learn how document structure creates an auditory table of contents and what makes the outline sound.

### The Auditory Desert and the Visual Mirage

Marcus navigated to the National Times front page with one specific goal: check the overnight scores on the sports desk. Sighted readers glancing at the layout see clear structural demarcations immediately. An imposing 32-pixel bold headline announces "National Sports Roundup", separated by generous white space and accompanied by full-color team photography. Sighted eyes scan and isolate that block in less than two seconds. But Marcus does not experience the page through pixels; he listens to speech synthesis software. Non-visual readers do not listen to web pages sequentially like audiobooks from the top masthead to the bottom footer. Instead, they skim. They press the single-letter `H` key to cycle forward through section headings, or they tap the `2` key to jump specifically across major secondary desks.

When Marcus pressed the `2` key, the speech synthesizer went dead silent, followed by a low-pitched warning tone: "No next heading at level two." Puzzled, he pressed the `H` key to jump to any heading at all, but the synthesizer skipped directly from the main site banner down to a footer copyright notice. The sports desk had vanished from his auditory landscape. When Marcus inspected the underlying code with an engineer, the cause became starkly apparent: the frontend team had marked up the sports headline using `<div class="sports-header">National Sports Roundup</div>`.

To visual design software and CSS layout engines, that division looked authoritative. It had heavy font weight, high contrast, and large margins. But to assistive technologies, a `<div>` element is an empty semantic vessel `(see Lecture 4)`. It carries no accessibility role, exposes no programmatic value to the browser accessibility tree, and cannot receive keyboard navigation shortcuts. Sighted developers had created a visual mirage: a heading that existed only in pixels, leaving non-visual readers stranded in an auditory desert.

Headings perform two vital architectural tasks for assistive software: they provide instantaneous single-key in-page navigation, and they construct an interactive, indented table of contents known as the heading outline. The W3C Web Accessibility Initiative defines this foundational relationship in its authoritative guidance:

> Headings communicate the organization of the content on the page. Web browsers, plug-ins, and assistive technologies can use them to provide in-page navigation.
> Nest headings by their rank (or level). The most important heading has the rank 1 (`<h1>`), the least important heading rank 6 (`<h6>`). Headings with an equal or higher rank start a new section, headings with a lower rank start new subsections that are part of the higher ranked section.
> Skipping heading ranks can be confusing and should be avoided where possible: Make sure that a `<h2>` is **not** followed directly by an `<h4>`, for example. It is ok to skip ranks when closing subsections, for instance, a `<h2>` beginning a new section, can follow an `<h4>` as it closes the previous section.
*W3C WAI, Page Structure Tutorials: Headings, `resources/accessibility/wai/pages/design-develop/tutorials/page-structure/headings.md`*

Before examining the code implementations, inspect the National Times election special through the lens of screen reader heading navigation.

```canvas title="national-times election special, heading hierarchy audit"
url=www.nationaltimes.com/politics/election-special
masthead | The National Times | landmark=banner
nav | Politics; Sports; Investigations | landmark=navigation
h1 | Election 2026: Senate Special Report
text | National Election Desk | wrong="styled div instead of h2" | sr="Paragraph text: National Election Desk"
h3 | Pennsylvania Early Precincts | wrong="skipped h2 level" | sr="Heading level 3, Pennsylvania Early Precincts"
h2 | Rust Belt Battlegrounds | right="semantic h2" | sr="Heading level 2, Rust Belt Battlegrounds"
h3 | Allegheny County Tally | right="nested h3" | sr="Heading level 3, Allegheny County Tally"
footer | The National Times, 2026 | landmark=contentinfo
sr | Rotor announces: Heading Level 1 Election 2026 ... Heading Level 3 Pennsylvania (Level 2 missing)
focus-order | Masthead → Navigation → Story Outline
```

The canvas exposes the structural breakdown. On the left side of the feature, the team made two devastating errors: they rendered "National Election Desk" as a styled text element without a heading role, rendering it invisible to the screen reader rotor, and then followed it with an `<h3>` for "Pennsylvania Early Precincts", skipping level two entirely. Sighted readers perceive a normal article layout, but a screen reader user hopping by headings jumps directly from `<h1>` to `<h3>`. The listener is left disoriented, wondering whether primary sections failed to load or whether they inadvertently bypassed central reporting. In contrast, the right side demonstrates sound semantic hierarchy: an `<h2>` marks the major regional boundary, correctly parenting the nested `<h3>` county tally below it.

### The Div-Soup Illusion and the Semantic Solution

Examine the fragile markup that initially powered the National Times election reporting:

```html title="election-special-broken.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Senate Special Report | The National Times</title>
</head>
<body>
  <header>...</header>
  <main id="main-content">
    <div class="hero-title">Senate Special Report</div> <!-- **WRONG:** missing h1 leaves document without an outline **ROOT** -->
    <div class="desk-label">National Election Desk</div> <!-- **WRONG:** styled container fails to expose a heading **ROLE** -->
    <p>Fifty battleground contests determine the legislative majority.</p>
    <h4>Pennsylvania Early Precincts</h4> <!-- **WRONG:** skipping from root directly to h4 shatters document **HIERARCHY** -->
    <p>Suburban vote tallies reflect high voter turnout.</p>
    <div class="subhead">Ballot Verification Status</div> <!-- **WRONG:** styled div completely invisible to keyboard **ROTOR** -->
  </main>
</body>
</html>
```

In the broken example above, the browser accessibility tree registers zero top-level landmarks and zero valid headings. The `hero-title` and `desk-label` containers are exposed as generic text nodes. When assistive software attempts to build an outline dialog (such as the VoiceOver Rotor or NVDA Elements List), the dialog displays only an orphaned `<h4>` floating in empty space.

The repair requires replacing the visual illusions with native semantic heading elements that reflect true document architecture:

```html title="election-special.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Senate Special Report | The National Times</title>
</head>
<body>
  <header>...</header>
  <main id="main-content">
    <h1>Election 2026: Senate Special Report</h1> <!-- **RIGHT:** exactly one h1 anchors the document **TOPIC** -->
    <h2>National Overview</h2> <!-- **RIGHT:** native h2 establishes major structural **SECTION** -->
    <p>Fifty battleground contests determine the legislative majority.</p>
    <h2>Rust Belt Battlegrounds</h2> <!-- **RIGHT:** sibling h2 begins a new equal-rank **REGION** -->
    <h3>Pennsylvania Early Precincts</h3> <!-- **RIGHT:** nested h3 represents a logical sub-topic of **H2** -->
    <p>Suburban vote tallies reflect high voter turnout.</p>
    <h3>Allegheny County Tally</h3> <!-- **RIGHT:** sibling h3 remains grouped under active **PARENT** -->
  </main>
</body>
</html>
```

By substituting native `<h1>` through `<h3>` tags for meaningless containers, the browser accessibility tree automatically calculates both the `heading` role and the numerical `aria-level`. The reader gains both sequential document structure and instant single-key jumping capability.

> [!KEY]
> Headings form the programmatic table of contents for assistive technologies; users navigate by structural rank, never by visual font weight or CSS size.

### The Strongest Naive Alternative: Why Not Style Paragraphs With CSS?

Working developers frequently ask: why do we need strict HTML heading tags when CSS utility classes allow us to make any `<p>` or `<div>` look like a headline? If a designer specifies `font-size: 2rem; font-weight: 700;`, why can we not apply `.text-2xl .font-bold` to a paragraph and achieve the exact same user experience?

Relying on CSS classes to emulate headings fails for four concrete architectural reasons:

1. **Accessibility APIs Ignore CSSOM Typography.** Web browsers construct the accessibility tree from the DOM and its semantic HTML elements, not from CSS font-size rules. A `<p class="title">` or `<div class="h2">` is exposed to operating system accessibility frameworks as a generic text container or grouping node. The accessibility tree assigns it neither a `heading` role nor a hierarchy level. Sighted users see a headline; screen reader software perceives ordinary body prose.

2. **Single-Key Navigation Depends on Semantic Roles.** Assistive software provides specialized navigation modes. In desktop screen readers like JAWS, NVDA, and VoiceOver, users navigate via single-key shortcuts. Pressing `H` cycles through all headings, while pressing numbers `1` through `6` jumps exclusively to headings of that specific rank. In the 2021 WebAIM Screen Reader User Survey, 67.7% of respondents reported navigating via headings to find information on web pages, with 85.7% rating heading levels as very or somewhat useful. When you replace heading tags with styled divisions, you strip away the primary navigation mechanism used by two-thirds of your non-visual audience.

3. **The Inverse Trap: Picking Headings for Font Sizes.** When developers do not decouple markup from styling, they routinely commit the inverse blunder: choosing heading elements based on default browser styling. If an engineer wants small bold text for an editorial byline or a sidebar card, they frequently drop in an `<h5>` or `<h6>` simply because its default browser font size is small. This injects an isolated fifth-level or sixth-level heading into the accessibility tree without any parent `<h2>`, `<h3>`, or `<h4>` to contain it. The golden law of frontend architecture is absolute: HTML heading elements represent semantic hierarchy; CSS classes control visual presentation.

4. **Standards Demand Structural Handles.** Under the Web Content Accessibility Guidelines, visual appearance alone cannot substitute for programmatic structure. The W3C explicitly mandates section headings as structural waypoints:

> The intent of this success criterion is to provide headings for sections of a web page, when the page is organized into sections. For instance, long documents are often divided into a variety of chapters, chapters have subtopics, etc. When such sections exist, they need to have headings that introduce them. This clearly indicates the organization of the content, facilitates navigation within the content, and provides mental "handles" that aid in comprehension of the content. Other page elements may complement headings to improve presentation (e.g., horizontal rules and boxes), but visual presentation is not sufficient to identify document sections.
*W3C, Understanding WCAG 2.2: Understanding Section Headings, `resources/accessibility/wcag/understanding/20/section-headings.html`*

### What Makes a Heading Hierarchy Correct?

Building an accessible document requires adhering to six strict structural rules:

1. **Exactly One `<h1>` Per Page.** Every HTML document must feature a single `<h1>` element that represents the overarching title or topic of the page, mirroring the primary message of the document `<title>` tag `(see Lecture 6)`. Having zero `<h1>` elements leaves the document without an anchor in automated audits. While the obsolete HTML5 document outline algorithm once proposed resetting heading levels inside nested `<section>` and `<article>` elements, browser engines and assistive technologies never implemented the algorithm. The modern WHATWG standard and accessibility consensus mandate one unique `<h1>` per page.

2. **Strictly Contiguous Downward Progression.** Heading levels must increase by only one rank at a time. An `<h1>` must be followed by an `<h2>`, and an `<h2>` can only be subdivided by an `<h3>`. Jumping directly from `<h1>` to `<h3>` or from `<h2>` to `<h4>` violates best practices and triggers warnings in accessibility linters like axe-core. As MDN Web Docs explains:

> A common navigation technique for users of screen reading software is to quickly jump from heading to heading in order to determine the content of the page. Because of this, it is important to not skip one or more heading levels. Doing so may create confusion, as the person navigating this way may be left wondering where the missing heading is.
*MDN Web Docs, HTML heading elements: Accessibility, `resources/web-performance/mdn/files/en-us/web/html/reference/elements/heading_elements/index.md`*

3. **Permissible Upward Skips When Closing Subsections.** While jumping downwards over intermediate ranks is forbidden, skipping upwards is entirely valid. For example, after nesting content from `<h2>` down into `<h3>` and `<h4>`, the next major section of the article can immediately introduce a new `<h2>`. This upward transition signals to assistive technology that all preceding sub-branches are closed and a new primary topic has commenced.

4. **Descriptive, Context-Independent Text (WCAG 2.4.6).** Under WCAG Criterion 2.4.6 (Headings and Labels, Level AA), heading text must clearly describe the section or topic that follows. Because screen reader users frequently review headings out of context in an alphabetical or linear list within the rotor, generic labels like "Read More", "Details", or "Section" fail to provide informative orientation.

5. **No Empty Heading Tags.** Empty heading elements (such as `<h2></h2>` or `<h3><span class="icon"></span></h3>`) typically created by CMS templating glitches are announced by screen readers as "Heading level two, blank", causing unnecessary cognitive friction.

6. **The ARIA Fallback Rule (WCAG 1.3.1).** If an inflexible third-party design system strictly prohibits replacing a custom element with a native heading tag, the element must explicitly declare `role="heading"` and an explicit level attribute such as `aria-level="2"` `(see Lecture 5)`. However, under the First Rule of ARIA, native HTML5 tags (`<h1>` through `<h6>`) must always be preferred because they convey built-in semantics across all user agents without external scripting.

> [!TIP]
> **To impress the interviewer:** define headings as the two-dimensional navigation grid of the web: they provide rapid in-page keyboard jumps (via the H key and numbers 1 through 6) and construct the hierarchical table of contents in the screen reader rotor. Cite the WebAIM survey showing that over 67% of screen reader users navigate by headings first. Articulate why skipping downward levels from h1 directly to h3 or h4 breaks mental models and fails axe-core's heading-order check, and explain how the failed HTML5 outline algorithm reinforced the iron rule of modern frontend engineering: exactly one semantic h1 per page, with presentation completely decoupled into CSS utility classes.

### Where you will meet this

- Investigative journalism packages: jumping directly past sprawling photo hero banners and interactive charts to reach the primary reporting text via the single-letter H shortcut.
- Financial earnings portals: navigating quarterly corporate filings by hopping between `<h2>` balance sheets and `<h3>` segment operational metric subdivisions.
- Cloud API reference documentation: pressing `3` in screen readers to leap directly across endpoint subheadings without wading through setup instructions.
- E-commerce product showcases: scanning customer sentiment by opening the heading rotor to bypass delivery terms and jump straight to verified buyer reviews.
- Breaking election dashboards: skimming vote counts across fifty state tallies by listening only to level-two headings spoken in rapid succession.

### Glossary

- **Heading Hierarchy**: The unbroken sequential nesting of HTML headings from h1 to h6 that constructs the structural table of contents for an HTML document.
- **Screen Reader Rotor**: A modal navigation menu in screen reading software that extracts and displays lists of headings, links, and landmarks for rapid in-page jumping.
- **Single-Key Navigation**: A screen reader mode allowing users to press shortcut keys like H or numbers 1 through 6 to jump directly between headings of specific ranks.
- **Contiguous Downward Progression**: The rule stating that heading ranks must only increase by a single step at a time, such as h1 to h2 or h2 to h3, to avoid creating missing branch confusion.
- **aria-level**: An ARIA attribute that explicitly defines the hierarchical numerical depth of an element assigned role="heading".
- **Decoupled Typography**: The engineering practice of separating semantic HTML heading tags from visual font styling using CSS classes.

### Summary

**The Document Outline as an Auditory Table of Contents**

In production web development, headings are not decorative typography; they are the architectural spine that makes non-visual navigation possible. Sighted users scan layouts, font sizes, and whitespace in fractions of a second, but screen reader users rely on programmatic heading ranks to skim, locate, and digest content. Conflating visual appearance with semantic structure creates invisible barriers that render major website sections undetectable. Here is your streetwise review.

❒ The Structural Foundations of Heading Architecture

1. Establish an unambiguous root on every route.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Reserve the `<h1>` element strictly for the primary title or topic of the document.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Coordinate the `<h1>` wording with the document `<title>` tag for consistent user orientation.
2. Advance heading ranks in strictly contiguous single steps.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Never increase heading depth by more than one level (`<h2>` must be followed by `<h3>`, never `<h4>`).<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Skipping ranks upwards is fully permissible when closing nested subsections to start a new section.
3. Completely decouple visual styling from structural markup.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Never choose an HTML heading tag based on default browser font size or line height.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Apply CSS typography classes to style text visually without distorting the DOM outline.

❒ The Developer's Levers

1. Never replace semantic heading elements with styled generic containers.

**DO NOT DO THIS:** Use a styled division that fails to expose a heading role to accessibility APIs.
```html wrong
<div class="sports-headline">National Sports Roundup</div>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Use semantic heading elements to register the section in the document outline.
```html right
<h2>National Sports Roundup</h2>
```
2. Never skip heading levels to achieve smaller visual font sizes.

**DO NOT DO THIS:** Skip from a top-level heading directly to a level-four heading for styling convenience.
```html wrong
<h1>Election 2026</h1>
<h4>County Returns</h4>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Maintain a contiguous heading order and resize the heading with CSS.
```html right
<h1>Election 2026</h1>
<h2 class="text-sm">County Returns</h2>
```

➔ NEVER use heading tags as typographical shortcuts to resize text.

➔ ALWAYS structure heading levels hierarchically like the index of a book.

➔ IF a section lacks a semantic heading THEN screen reader users cannot locate it via keyboard shortcuts.

| | **STYLED CONTAINERS**<br>(div-soup) | **SEMANTIC HEADINGS**<br>(structured) |
| ---: | :--- | :--- |
| **Accessibility role** | Generic container; ignored by outline tree | Registered `role="heading"`<br>with computed level |
| **Keyboard navigation** | Unreachable by `H`<br>or number-key jumps | Instant jump via `H`<br>and `1` through `6` keys |
| **Screen reader rotor** | Omitted from table of contents list | Populates ordered tree<br>in rotor dialog |
| **Hierarchy progression** | Flat visual styling; no parent-child logic | Strict rank progression<br>`<h1>` through `<h6>` |
| **Styling dependency** | Tightly coupled to CSS class names | Fully decoupled via<br>CSS font properties |
| **WCAG 2.2 alignment** | Fails Criterion 1.3.1<br>Info and Relationships | Satisfies 1.3.1 (A),<br>2.4.6 (AA), 2.4.10 (AAA) |
| **National Times case** | Sports desk hidden in endless text wall | Scannable election and<br>sports news outline |
