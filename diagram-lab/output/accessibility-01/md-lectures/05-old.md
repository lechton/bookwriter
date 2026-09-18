# Lecture 5: The First Rule of ARIA and When to Use It
> INTERVIEW QUESTION | ❱ CORE | What does the first rule of ARIA actually say, and when is ARIA the right tool?

1. Tariq, a web developer, updates the archive search category filters for the National Times.
2. Hoping to improve accessibility, he sprinkles tab roles and state labels across the existing buttons.
3. A blind reader tests the filter bar and attempts to switch categories using the arrow keys.
4. Why does the screen reader announce a tab that completely ignores standard keyboard navigation?
5. Sighted readers click normally, but assistive tech users are trapped by promises the code never keeps.
6. Adding accessibility labels by hand actually degraded the experience instead of improving it.
7. Today you learn the primary rule of ARIA, and when custom attributes are truly required.

### The Decoration That Broke the Page

Tariq set out to improve the National Times search archive page after reviewing an automated audit report. The audit had suggested improving interface structure, so Tariq decided to add Accessible Rich Internet Applications attributes to the category filter bar. He wrapped the category buttons in a container marked with `role="tablist"`, designated each button with `role="tab"`, and marked the active category with `aria-selected="true"`. To a sighted developer inspecting the Document Object Model in the browser elements inspector, the markup looked modern, intentional, and thoroughly accessible. But when a blind subscriber navigated the archive using a screen reader, the interface collapsed into chaos. The screen reader announced the active filter as: Politics, selected, tab, 1 of 4. Following standard screen reader navigation conventions for tabs, the reader pressed the Right Arrow key to move to the next category. Nothing happened. Tariq had added the ARIA role, but he had not implemented the complex JavaScript keyboard management required to make a tablist function. The subscriber was stranded, unable to discover or access the remaining news categories.

Tariq made the single most common mistake in digital accessibility: treating ARIA attributes like visual CSS classes that magically grant accessibility to an element. ARIA does not grant behavior. It does not create keyboard event listeners, it does not manage focus, and it does not make an element interactive. ARIA merely changes what assistive technologies announce to the user. When you assign an ARIA role without providing the corresponding keyboard and behavioral mechanics, you misrepresent the interface, creating severe confusion for users who depend on assistive tools.

The official MDN documentation summarizes the governing principle of all ARIA implementation in one clear directive.

> If you can use a native HTML element or attribute with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so.
*MDN Web Docs, ARIA: Accessible Rich Internet Applications, `resources/web-performance/mdn/files/en-us/web/accessibility/aria/index.md`*

Before analyzing the code, inspect the archive category filter bar through the dual perspective of visual design and assistive technology readout.

```canvas title="national-times category filter, the aria audit"
url=www.nationaltimes.com/search/filter-tabs
masthead | The National Times | landmark=banner
nav | Investigations; Politics; Culture | landmark=navigation
h1 | Search Archive: National News Desk
text | Filter published reports by editorial category and investigative beat.
button | All Stories | focus=1 | right | sr="All Stories, button"
button | Politics | wrong="spammed role=tab without arrow keys" | aria=selected=true | sr="Politics, tab, 2 of 4"
button | Metro Transit | sr="Metro Transit, button"
button | Investigations | sr="Investigations, button"
footer | The National Times, 2026 | landmark=contentinfo
sr | "Politics, tab, 2 of 4" ... Right Arrow key fails silently
focus-order | All Stories → Politics → Metro Transit → Investigations
```

The canvas demonstrates the friction caused by inappropriate ARIA usage. The buttons across the filter bar are already native HTML buttons. By forcing `role="tab"` onto the Politics button, the developer overrode the native button semantics in the accessibility tree. Screen reader users expect a tab control to support arrow key navigation within a single tab stop, but because this behavior was never scripted, the control breaks standard expectations. Clean, native buttons without decorative ARIA would have performed flawlessly.

### The Broken Markup and the Disciplined Correction

Here is the fragile markup that broke the filter bar:

```html title="filter-tabs-broken.html"
<div role="tablist" class="filter-bar"> <!-- **WRONG:** declaring tablist without arrow key **NAVIGATION** -->
  <button role="tab" aria-selected="true" class="tab-btn">Politics</button> <!-- **WRONG:** overrides native button role without tab **BEHAVIOR** -->
  <button role="tab" aria-selected="false" class="tab-btn">Transit</button> <!-- **WRONG:** promises composite widget without managing **TABINDEX** -->
</div>
```

By slapping tab roles onto native buttons, Tariq took an interface pattern that was already operable and corrupted its semantics. The fix removes the redundant and broken ARIA entirely, returning to clean semantic HTML:

```html title="filter-buttons.html"
<nav class="filter-bar" aria-label="Archive categories">
  <button type="button" class="filter-btn active" aria-current="page">Politics</button> <!-- **RIGHT:** communicates active category with **ARIA-CURRENT** -->
  <button type="button" class="filter-btn">Transit</button> <!-- **RIGHT:** clean native button needs no redundant **ROLE** -->
</nav>
```

Notice the elegance of the correction. Wrapping the buttons in a semantic `<nav>` landmark gives screen reader users a designated category region. The native buttons maintain standard Tab key navigation. To communicate which category is currently displayed, we use the single targeted attribute `aria-current="page"`. The interface is now completely accessible, predictable, and robust.

> [!KEY]
> ARIA adjusts the accessibility tree for assistive software, but it never modifies DOM behavior, styling, or keyboard operation; a role is a promise that your JavaScript must manually fulfill.

### The Strongest Naive Alternative: Why Not Sprinkle ARIA Everywhere?

A pervasive misconception among developers is that adding explicit ARIA roles to every HTML tag makes a website "more accessible." Authors often add `role="button"` to native `<button>` elements, `role="navigation"` to `<nav>` elements, and custom landmark roles to every section. They assume that more ARIA equates to better compliance scores.

The empirical data reveals the opposite reality. In WebAIM\'s annual analysis of the top one million website homepages, pages containing ARIA attributes consistently averaged 41% more detected accessibility errors than pages without any ARIA. Why? Because developers routinely introduce conflicting semantics, create broken keyboard promises, or accidentally hide content from assistive software.

The W3C Authoring Practices Guide explains the hazard directly:

> Functionally, ARIA roles, states, and properties are analogous to a CSS for assistive technologies. For screen reader users, ARIA controls the rendering of their non-visual experience. Incorrect ARIA misrepresents visual experiences, with potentially devastating effects on their corresponding non-visual experiences.
*W3C, ARIA Authoring Practices Guide (APG), `resources/accessibility/aria-practices/content/practices/read-me-first/read-me-first-practice.html`*

The APG codifies this with a fundamental law: **A role is a promise.** When you write `role="tab"`, you promise the user that your component implements the full ARIA Tab Pattern: arrow keys move focus between tabs, Home and End jump to the first and last tabs, and unselected tabs have `tabindex="-1"`. When you write `role="button"` on a division, you promise that you have implemented Space and Enter activation and focus management `(see Lecture 4)`. If you fail to fulfill that promise with code, your ARIA is an active barrier rather than a benefit.

### The Five Rules of ARIA

The W3C outlines five essential rules that govern all ARIA authoring:

1. **Rule 1: Use native HTML elements first.** If a native HTML element or attribute already possesses the semantics and behavior you require, use it instead of repurposing an element and patching it with ARIA. In Lecture 1, Alma needed a real `<label>` element tied to the payment field `(see Lecture 1)`. Reaching for native elements first prevents synthetic failures.

2. **Rule 2: Do not change native semantics unless you really have to.** Never override the innate meaning of an element by assigning a conflicting role. Do not place `role="button"` on a heading or `role="navigation"` on a table cell. If you must change semantics, restructure the container or wrap the element properly.

3. **Rule 3: All interactive ARIA controls must be usable with a keyboard.** ARIA provides zero keyboard functionality. If you build a custom widget with ARIA roles, you must manually script keyboard navigation, focus movement, and keypress activation. Under the POUR taxonomy, a role without keyboard support violates the Operable pillar `(see Lecture 2)`.

4. **Rule 4: Do not use `role="presentation"` or `aria-hidden="true"` on focusable elements.** These attributes instruct assistive technologies to ignore the element. If the element remains in the keyboard tab sequence, keyboard users will land on an interactive control that is completely silent to their screen reader, creating an invisible ghost focus stop.

5. **Rule 5: All interactive elements must have an accessible name.** Every control, whether native or custom, must expose an accessible name calculated from its text content, an associated `<label>`, or an explicit `aria-label` or `aria-labelledby` attribute.

### When ARIA Is the Right Tool

If the first rule of ARIA says to avoid ARIA whenever native HTML suffices, when is ARIA actually appropriate? ARIA is the right tool when native HTML lacks the semantic vocabulary to describe complex, dynamic user interface patterns.

Here are the primary scenarios where ARIA is indispensable:

1. **Dynamic State Management.** Native HTML has no built-in way to indicate whether a custom panel is expanded or collapsed. Use `aria-expanded="true|false"` on disclosure buttons:

```html title="disclosure-toggle.html"
<button type="button" aria-expanded="false" aria-controls="filter-panel" onclick="toggleFilterPanel()">
  Filter Settings <!-- **RIGHT:** communicates expansion state dynamically to assistive **TECH** -->
</button>
<div id="filter-panel" hidden>
  <p>Select date ranges and reporting bureaus.</p>
</div>
```

2. **Toggle Button States.** When a button acts as an on/off toggle (such as a Mute Audio button or Dark Mode switch), standard HTML has no toggle state. Use `aria-pressed="true|false"` to expose this binary state to screen readers.

3. **Live Asynchronous Updates.** When news dispatches update in real time or search result counts change without a full page refresh, sighted users see the text change on screen. Blind users have no way of knowing new content arrived unless you designate the container with `aria-live="polite"`, which prompts screen readers to speak the update during the next pause.

4. **Contextual Descriptions and Labels.** When an icon button has no visible text (such as a search magnifying glass), use `aria-label="Search articles"`. When an input requires formatting instructions or error notifications, link the message using `aria-describedby`.

> [!TIP]
> **To impress the interviewer:** recite the First Rule of ARIA verbatim, then cite the WebAIM Million empirical finding: home pages with ARIA contain 41% more detected accessibility errors than those without it. Explain that ARIA is analogous to CSS for the accessibility tree: it changes how assistive technology perceives an element, but it does not change how the element behaves. Finally, provide the exact checklist for when ARIA is genuinely needed: dynamic states like aria-expanded or aria-pressed, asynchronous announcements via aria-live, descriptions using aria-describedby, and custom widgets with no native HTML equivalent.

### Where you will meet this

- Accordion sections and mobile drawers: adding `aria-expanded` and `aria-controls` to native buttons so screen readers announce whether content is open or closed.
- Real-time sports tickers and breaking news alerts: using `aria-live="polite"` to announce live score updates without forcing a full page reload.
- Audio and video player mute toggles: binding `aria-pressed="true"` to toggle buttons so assistive software reports whether sound is active.
- Password input fields: linking hint text and password complexity rules to the input using `aria-describedby` so the screen reader speaks requirements upon focus.
- Icon-only navigation actions: supplying an `aria-label="Close dialog"` on an SVG button that lacks visible text.

### Glossary

- **ARIA (Accessible Rich Internet Applications)**: A W3C specification providing attributes that define ways to make web content and applications more accessible to people with disabilities.
- **First Rule of ARIA**: The foundational guideline stating that if an existing native HTML element or attribute can fulfill the semantic and behavioral need, you should use it instead of ARIA.
- **Ghost Focus Stop**: An accessibility defect where an interactive element remains in the keyboard tab sequence but is silenced from assistive technologies using aria-hidden or role="presentation".
- **Live Region**: A DOM element designated with aria-live that notifies screen readers to announce dynamic asynchronous content changes without shifting page focus.
- **aria-expanded**: A state attribute applied to disclosure triggers indicating whether the associated controlled widget or panel is currently open or collapsed.
- **aria-describedby**: An attribute that references one or more element IDs to associate supplementary descriptive text or error instructions with a form control.

### Summary

**The First Rule of ARIA and Strategic Accessibility Layering**

In production engineering, ARIA is not a substitute for semantic HTML; it is a specialized bridge designed to describe dynamic state changes and complex custom components that the native web platform cannot express. Misapplying ARIA creates deceptive interfaces that misinform assistive technologies while failing to deliver necessary keyboard behaviors. Follow the principle that no ARIA is far better than bad ARIA. Here is your streetwise review.

❒ The Five Rules of ARIA

1. Use native HTML elements first.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Always verify whether a standard element like a button, link, or input can achieve your goal.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Native elements arrive with built-in accessibility roles, states, and keyboard event pipelines.
2. Never override native semantics without cause.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Do not assign conflicting roles to elements that already have defined structural meanings.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Keep landmark and interactive roles pure to preserve document hierarchy.
3. Fulfill the behavioral promise of every role.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) A role is a promise that you have implemented all expected keyboard shortcuts and focus rules.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) ARIA does not supply keyboard listeners; you must write the JavaScript handlers manually.

❒ The Developer\'s Levers

1. Never apply custom widget roles to native elements without implementing their keyboard contract.

**DO NOT DO THIS:** Add tab roles to buttons without scripting arrow key navigation.
```html wrong
<button role="tab" aria-selected="true">Politics</button>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Use semantic buttons with current state attributes.
```html right
<button type="button" aria-current="page">Politics</button>
```
2. Never use ARIA to hide elements that receive keyboard focus.

**DO NOT DO THIS:** Hide interactive controls from assistive tools using aria-hidden.
```html wrong
<button aria-hidden="true">Close Modal</button>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Use the native hidden attribute or CSS display none to remove elements from both trees.
```html right
<button hidden>Close Modal</button>
```

➔ NEVER use ARIA as a cosmetic badge or visual styling shortcut.

➔ ALWAYS ensure every interactive control fulfills the keyboard navigation contract expected for its role.

➔ IF a native HTML element can represent the interaction THEN ARIA is the wrong architectural choice.

| | **MISAPPLIED ARIA**<br>(anti-pattern) | **SEMANTIC / DISCIPLINED ARIA**<br>(correct practice) |
| ---: | :--- | :--- |
| **Category filter** | Redundant `role="tab"`<br>without arrow key script | Clean `<button>` tags<br>or `aria-current` link |
| **Keyboard contract** | Role declared but keys unhandled; broken promise | Full APG keyboard model<br>or native HTML |
| **Dynamic state** | Class names like `.open`<br>invisible to screen readers | `aria-expanded=`<br>`"false"` on button |
| **Live news dispatch** | Polling DOM silently without notifying user | `aria-live=`<br>`"polite"` for alerts |
| **Auditing reality** | Pages with ARIA have 41% more detected errors | Semantic HTML first;<br>ARIA only as a bridge |
| **National Times case** | Broken filter tabs that stranded keyboard readers | Accessible button row<br>with zero excess markup |
