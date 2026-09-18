const fs = require("fs");

const content25 = `# Lecture 25: Accessible Name Computation
> INTERVIEW QUESTION | ❱❱ MORE | What is an accessible name, and what is the computation order?

1. Priya navigates the National Times subscriber paywall modal using the NVDA screen reader.
2. She tabs to an interactive circular button containing a magnifying glass icon to search archive records.
3. Her screen reader announces "Submit, button" instead of the expected search command.
4. Why does an element with multiple descriptive labels announce the least relevant attribute on the page?
5. The markup contains conflicting labels: an aria-label, visible text, a title tooltip, and an aria-labelledby reference.
6. The Accessible Name and Description Computation specification defines a strict hierarchy where higher-precedence sources overwrite lower ones.
7. Today we trace the accessible name computation algorithm, eliminate conflicting label sources, and audit what assistive devices hear.

### The Precedence Ladder: How Browsers Name Controls

Every interactive element must possess an accessible name so assistive technologies can announce its identity and purpose to users. When developers attach multiple labeling mechanisms to the same element, browsers resolve the conflict using the W3C Accessible Name Computation algorithm. Higher-priority attributes completely override lower-priority candidates, discarding visible inner text in favor of explicit ARIA declarations.

\`\`\`html title="conflicting-name-sources.html"
<!-- WRONG: aria-label completely obliterates visible button text -->
<button aria-label="Submit Form">Search Archives</button>

<!-- RIGHT: aria-label matches and clarifies visible button text -->
<button aria-label="Search National Times Archives">Search Archives</button>
\`\`\`

\`\`\`canvas title="Search Action: Conflicting Label vs Coherent Accessible Name" width="2/3" layout="compare"
button | Search Archives | wrong="mismatched label" | sr="Submit Form, button" | note="✕ Voice command fails mismatch"
button | Search Archives | right="aligned label" | focus=1 | sr="Search Archives, button" | note="✓ Voice command matches speech"
\`\`\`

The comparison demonstrates how conflicting label attributes override the visible DOM text. On the left, an inadvertent copy-pasted \`aria-label="Submit Form"\` completely supersedes the inner text, causing NVDA to speak "Submit Form" while the visual screen clearly reads "Search Archives". On the right, removing the conflict or aligning the ARIA attribute ensures that speech output and visible presentation remain perfectly harmonious.

This contradiction violates WCAG 2.5.3 Label in Name, a Level A criterion. Speech-input users who navigate by speaking visible interface labels (saying "Click Search Archives") fail completely when the underlying accessible name does not include the visible string.

### The Icon-Only Hazard: Empty Buttons and Hidden Names

Modern user interfaces frequently feature compact icon-only buttons for actions like bookmarking, sharing, and dismissing notifications. While visual readers infer meaning from graphical glyphs, an inline SVG without embedded text produces an empty accessible name, rendering the control completely anonymous to screen readers. Providing an accessible name via \`aria-label\` or visually hidden text restores full clarity for assistive device operators.

\`\`\`html title="icon-button-naming.html"
<!-- WRONG: empty icon button has no accessible name -->
<button class="btn-icon"><svg aria-hidden="true"><path d="..."/></svg></button>

<!-- RIGHT: aria-label gives the icon button an explicit name -->
<button class="btn-icon" aria-label="Bookmark Story"><svg aria-hidden="true"><path d="..."/></svg></button>
\`\`\`

\`\`\`canvas title="Article Action: Nameless Icon vs Named Bookmark Button" width="2/3" layout="compare"
button | 🔖 | wrong="empty name" | ghost | sr="button" | note="✕ Announced as bare 'button'"
button | 🔖 Bookmark | right="accessible name" | focus=1 | sr="Bookmark Story, button" | note="✓ Announced as 'Bookmark Story'"
\`\`\`

The layout comparison exposes the severe functional void created by icon-only buttons. On the left, the button contains solely an SVG vector graphic, leaving the accessibility tree with an empty string that screen readers announce simply as "button". On the right, attaching an explicit \`aria-label="Bookmark Story"\` endows the button with a robust identity, allowing Priya to instantly grasp what will happen upon activation.

This failure directly violates WCAG 4.1.2 Name, Role, Value. Every interactive element must supply an unambiguous name so users understand its role before committing a keystroke.

### The Four Steps of Name Resolution

The W3C Accessible Name and Description Computation specification outlines a strict resolution sequence:

1. **\`aria-labelledby\` (Highest Precedence):** The browser looks up the IDs specified in \`aria-labelledby\` and concatenates their text content. This overrides all other naming sources.
2. **\`aria-label\` (Second Precedence):** If no \`aria-labelledby\` is present, the browser checks for an explicit \`aria-label\` string attribute.
3. **Native Host Language Semantics (Third Precedence):** The browser evaluates native HTML labeling mechanisms, such as \`<label for="...">\`, \`alt\` text on \`<input type="image">\`, or the subtree inner text of a \`<button>\` or \`<a>\`.
4. **\`title\` Attribute (Lowest Precedence / Fallback):** If no other labeling source exists, the browser falls back to the \`title\` attribute tooltip.

The W3C specification defines this algorithm:

> The accessible name is the name of the user interface element that is displayed to the user by assistive technologies. Computation follows a deterministic algorithm where explicit ARIA references override native content and attribute fallbacks.
*W3C, Accessible Name and Description Computation 1.2, \`resources/accessibility/accname/accname-1.2.html\`*

### Production Svelte 5 Implementation of Search Archive Action

Here is the complete Svelte 5 component for the National Times archive search bar, demonstrating accessible name calculation, SVG iconography hiding, and label synchronization:

\`\`\`svelte title="ArchiveSearch.svelte"
<script>
  let { onsearch } = $props();
  let query = $state('');

  function handleSearch(event) {
    event.preventDefault();
    if (!query.trim()) return;
    onsearch?.(query);
  }
</script>

<form class="search-box" onsubmit={handleSearch} role="search" aria-label="Archive Search">
  <label for="archive-input" class="search-label">
    Search Archive Records
  </label>
  <div class="input-wrapper">
    <input
      id="archive-input"
      type="search"
      bind:value={query}
      placeholder="e.g. Metro Transit 2026"
      class="search-input"
    />
    <button
      type="submit"
      class="search-submit"
      aria-label="Search National Times Archive"
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </button>
  </div>
</form>

<style>
  .search-box {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
  }
  .search-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }
  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .search-input {
    flex: 1;
    height: 40px;
    padding: 0 12px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
  }
  .search-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #0284c7;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
\`\`\`

In this implementation, Priya experiences absolute clarity. The search input derives its accessible name directly from the visible label via \`id\` binding, and the submit button receives an explicit, descriptive accessible name via \`aria-label\` while the decorative SVG remains safely hidden with \`aria-hidden="true"\`.

> [!KEY]
> ARIA labels override visible inner text in the accessible name calculation. Always ensure your accessible name matches or includes the visible text on screen.

> [!TIP]
> **To impress the interviewer:** walk through WCAG 2.5.3 Label in Name. Explain that speech recognition users say "Click [visible text]" to trigger buttons. If the accessible name declared in \`aria-label\` does not include the visible label string, speech-to-text software will fail to activate the control. State the golden rule: if an element displays text, let the inner text be the accessible name; never override it with an incompatible \`aria-label\`.

### Where you will meet this

- Icon-only header buttons: providing accessible names for hamburger menus, search toggles, and notification bells.
- Social share trays: ensuring Twitter, Facebook, and email icon links announce their respective platforms.
- Data table row actions: distinguishing identical "Edit" or "Delete" buttons by appending row identifiers in \`aria-label\`.
- Dismissible toast notifications: labeling the close button as "Dismiss Notification" rather than an empty string or "X".
- Pagination navigation bars: naming numeric pagination buttons with their full context (such as "Page 3 of 12").

### Glossary

- **Accessible Name**: The primary identification string assigned to a DOM node in the browser accessibility tree.
- **AccName Algorithm**: The W3C specification defining the exact precedence sequence for computing element names.
- **aria-labelledby**: An attribute pointing to other element IDs whose combined text provides the accessible name.
- **aria-label**: An attribute directly defining a string to serve as the element accessible name.
- **Label in Name (WCAG 2.5.3)**: A mandate requiring an element accessible name to contain its visible text label.
- **aria-hidden="true"**: An attribute instructing the browser to exclude an element and its subtree from the accessibility tree.

### Summary

**Accessible Name Computation Architecture**

Every interactive control must communicate a clear, unambiguous accessible name to assistive technologies. Browsers resolve accessible names using a deterministic precedence hierarchy: \`aria-labelledby\` overrides \`aria-label\`, which overrides native markup and inner text, which finally falls back to the \`title\` attribute. Overriding visible text with mismatched ARIA labels shatters speech-recognition commands, while leaving icon buttons unlabeled blinds screen reader operators. Professional developers audit accessibility tree output and guarantee that visible labels always match accessible names. Here is your streetwise review.

❒ The Rules of Accessible Naming

1. Never allow an icon-only control to exist without an accessible name.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Empty buttons announce as bare roles with no identity or purpose.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Provide names using \`aria-label\` or visually hidden text classes.
2. Ensure accessible names contain the visible text on the control.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Satisfies WCAG 2.5.3 Label in Name for voice recognition navigators.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Avoid declaring contradictory \`aria-label\` strings that overwrite visible labels.

❒ The Developer's Levers

1. Never leave icon-only buttons without an accessible name.

**DO NOT DO THIS:** Create a button containing only an icon without a label.
\`\`\`html wrong
<button class="icon-btn"><svg></svg></button>
\`\`\`
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Attach an explicit aria-label describing the button action.
\`\`\`html right
<button class="icon-btn" aria-label="Close dialog"><svg></svg></button>
\`\`\`
2. Never override visible text with an unrelated ARIA label.

**DO NOT DO THIS:** Provide an aria-label that contradicts the visible text.
\`\`\`html wrong
<button aria-label="Download PDF">Read Article</button>
\`\`\`
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Allow the visible inner text to serve as the accessible name.
\`\`\`html right
<button>Read Article</button>
\`\`\`

➔ NEVER ship an interactive control that computes to an empty accessible name.

➔ ALWAYS ensure any \`aria-label\` includes the exact visible string shown to users.

➔ IF an icon is purely visual THEN hide it with \`aria-hidden="true"\` to prevent noisy announcements.

| | **CONTRADICTORY LABEL**<br>(mismatched name) | **HARMONIZED LABEL**<br>(computed accessible name) |
| ---: | :--- | :--- |
| **Voice command support** | Fails completely when<br>spoken label is rejected | Succeeds because spoken<br>label matches name |
| **Screen reader speech** | Speaks synthetic text<br>contradicting screen | Speaks identical name<br>seen by sighted users |
| **AccName precedence** | ARIA label obliterates<br>visible inner text | Text and ARIA attributes<br>align in lockstep |
| **WCAG conformance** | Violates 2.5.3 Label<br>in Name (Level A) | Satisfies 2.5.3 and 4.1.2<br>Name, Role, Value |
| **User trust** | High confusion across<br>speech and audio users | Flawless clarity across<br>all assistive channels |
`;

const content26 = `# Lecture 26: Live Regions and Dynamic Announcements
> INTERVIEW QUESTION | ❱❱ MORE | How do you announce dynamic content changes to screen readers without stealing focus?

1. Marcus monitors election results on the National Times live scoreboard using keyboard commands and a screen reader.
2. Every thirty seconds, vote tallies update dynamically in the background as new precincts report their numbers.
3. While sighted users see numbers flashing on the visual dashboard, Marcus hears absolute silence from his audio feed.
4. Why do dynamic JavaScript DOM updates pass completely unnoticed by screen readers during active reading?
5. When Marcus attempts to force announcements by shifting focus to the scoreboard, his current reading position is violently hijacked.
6. Standard DOM insertions do not trigger speech synthesizer announcements unless wrapped in pre-existing ARIA live regions.
7. Today we deploy aria-live, distinguish polite from assertive, and broadcast asynchronous updates without disrupting operator focus.

### The Silent Update: Why Dynamic DOM Changes Go Unheard

Screen readers observe user focus and read DOM nodes sequentially as keyboard navigation progresses through a document. When JavaScript dynamically mutates text in a distant container, the browser does not redirect assistive technology attention unless that container is designated as an ARIA live region. Without an active live region, critical asynchronous updates like shopping cart totals or breaking news alerts remain completely invisible to blind operators.

\`\`\`html title="silent-vs-live-container.html"
<!-- WRONG: regular div remains silent during dynamic DOM updates -->
<div class="scoreboard-tally">Precinct 14: 842 votes</div>

<!-- RIGHT: aria-live container announces dynamic updates automatically -->
<div aria-live="polite" class="scoreboard-tally">Precinct 14: 842 votes</div>
\`\`\`

\`\`\`canvas title="Live Scoreboard: Silent Container vs Polite Live Region" width="2/3" layout="compare"
card | Precinct 14: 842 Votes | wrong="silent update" | note="✕ Screen reader remains silent"
card | Precinct 14: 842 Votes | right="polite live region" | focus=1 | sr="Precinct 14: 842 votes" | note="✓ Announced after current speech"
\`\`\`

The comparison illustrates the communication divide during dynamic background mutations. On the left, the vote count refreshes via background fetch, but because the container lacks an ARIA live role, Marcus hears nothing while reading an adjacent editorial summary. On the right, declaring \`aria-live="polite"\` instructs the browser accessibility engine to monitor the container subtree and speak newly inserted text as soon as the user pauses their current interaction.

This behavior addresses WCAG 4.1.3 Status Messages, a Level AA criterion. Applications must present dynamic status messages to assistive technologies without requiring direct focus movement that disrupts the user's ongoing reading task.

### Polite Versus Assertive: Respecting User Attention

The \`aria-live\` attribute supports two primary operating modes: \`polite\` and \`assertive\`. A polite live region queues announcements until the user pauses their current interaction, preserving cognitive flow during routine updates. An assertive live region immediately clears the speech synthesizer queue to blare urgent warnings, making it appropriate strictly for time-critical emergencies like session timeouts or evacuation orders.

\`\`\`html title="polite-vs-assertive.html"
<!-- WRONG: assertive announcement cuts off user reading flow for routine info -->
<div aria-live="assertive" role="alert">Cart updated: 2 items</div>

<!-- RIGHT: polite announcement waits for speech pause -->
<div aria-live="polite" role="status">Cart updated: 2 items</div>
\`\`\`

\`\`\`canvas title="Cart Notification: Assertive Interruption vs Polite Status Queue" width="2/3" layout="compare"
badge | Cart: 2 Items | wrong="assertive interruption" | note="✕ Halts active speech abruptly"
badge | Cart: 2 Items | right="polite status queue" | focus=1 | sr="Cart updated: 2 items" | note="✓ Waits for natural speech pause"
\`\`\`

The layout comparison demonstrates the critical distinction between announcement politeness levels. On the left, using an assertive alert violently cuts off the screen reader in the middle of reading a headline to blare an inconsequential shopping cart update. On the right, designating the container as a polite status region queues the message respectfully, waiting until the user finishes their sentence before speaking the updated cart tally.

This distinction is essential for cognitive stability. Abusive use of \`aria-live="assertive"\` induces disorientation and panic, transforming helpful notifications into aggressive audio interference.

### The Live Region Lifecycle Invariants

Live regions function under strict browser heuristics that developers must respect:

1. **Pre-existence Requirement:** A live region container must already exist in the DOM before dynamic content is injected into it. If you create a live region and populate its text in the same DOM mutation, many screen readers will treat it as a routine static element and remain completely silent.
2. **Atomic Announcements (\`aria-atomic\`):** By default, browsers announce only the specific text node that changed. Setting \`aria-atomic="true"\` forces the screen reader to speak the entire contents of the container, which is vital for compound phrases like "3 items in cart".
3. **Relevant Changes (\`aria-relevant\`):** Controls whether additions, removals, or text modifications trigger speech. The default value is \`additions text\`.

The W3C ARIA specification establishes the purpose of live regions:

> Live regions are designated areas of a web page that are typically updated via JavaScript as a result of external events or user interaction. Assistive technologies are alerted when content inside a live region changes, allowing users to be informed without losing their current focus position.
*W3C, WAI-ARIA 1.2: Live Region Attributes, \`resources/accessibility/aria/aria-1.2.html#live_regions\`*

### Production Svelte 5 Implementation of Live Scoreboard

Here is the complete Svelte 5 component for the National Times election scoreboard, demonstrating polite announcements, atomic updates, and pre-existing live container architecture:

\`\`\`svelte title="ElectionScoreboard.svelte"
<script>
  let { electionTitle = "Metro Mayoral Race" } = $props();
  let precinctsReported = $state(14);
  let totalPrecincts = 50;
  let candidateVotes = $state({
    harrison: 8420,
    vargas: 7915
  });

  function recordUpdate(harrisonDelta, vargasDelta) {
    precinctsReported += 1;
    candidateVotes.harrison += harrisonDelta;
    candidateVotes.vargas += vargasDelta;
  }
</script>

<section class="election-widget" aria-labelledby="race-title">
  <h2 id="race-title">{electionTitle}</h2>

  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    class="live-status-card"
  >
    <p class="precinct-counter">
      Precincts reporting: {precinctsReported} of {totalPrecincts}
    </p>
    <div class="tally-row">
      <span>Harrison: {candidateVotes.harrison.toLocaleString()} votes</span>
      <span>Vargas: {candidateVotes.vargas.toLocaleString()} votes</span>
    </div>
  </div>

  <button
    type="button"
    class="refresh-button"
    onclick={() => recordUpdate(145, 120)}
  >
    Simulate Incoming Precinct
  </button>
</section>

<style>
  .election-widget {
    padding: 16px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    margin: 1.5rem 0;
  }
  .live-status-card {
    padding: 12px;
    background: #f1f5f9;
    border-left: 4px solid #0284c7;
    margin: 12px 0;
  }
  .precinct-counter {
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 6px;
  }
  .tally-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    color: #334155;
  }
  .refresh-button {
    padding: 8px 16px;
    background: #0284c7;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
\`\`\`

In this architecture, Marcus receives seamless audio updates. Because the \`role="status"\` container exists in the markup from initial render, subsequent reactive state changes inside the Svelte 5 component trigger polite, atomic speech announcements without interrupting his review of the breaking news desk.

> [!KEY]
> Live regions must exist in the initial DOM before dynamic text is inserted. Use polite for routine status updates and reserve assertive strictly for emergencies.

> [!TIP]
> **To impress the interviewer:** explain the technical pitfall of dynamically creating a live region container via JavaScript and immediately injecting text into it. Browsers and screen readers require time to observe and attach mutation observers to live region nodes. If a container and its text appear simultaneously, assistive devices treat it as ordinary static content. Always ensure the live container is present in the DOM on initial page load, and only update its inner text when changes occur.

### Where you will meet this

- Election tally widgets: announcing incoming vote counts as precincts conclude tabulations.
- Sports score updates: broadcasting real-time point shifts without forcing users away from text commentary.
- Form validation status: notifying screen reader users that asynchronous address verification succeeded.
- Chat messaging windows: speaking incoming customer support messages as they arrive in the conversation log.
- System timers and upload meters: reporting percentage milestones during prolonged file uploads.

### Glossary

- **ARIA Live Region**: A designated DOM container whose mutations are announced by screen readers without moving focus.
- **aria-live="polite"**: A politeness setting that queues speech announcements until the user pauses their current interaction.
- **aria-live="assertive"**: A politeness setting that interrupts ongoing speech immediately to deliver urgent warnings.
- **aria-atomic**: A boolean property indicating whether the entire container or only the modified sub-node should be spoken.
- **role="status"**: An implicit polite live region role used for advisory, non-critical state announcements.
- **role="alert"**: An implicit assertive live region role used for critical, time-sensitive system warnings.

### Summary

**Live Regions and Dynamic Announcements Architecture**

Dynamic asynchronous DOM updates leave screen reader users completely unaware of critical changes unless those updates occur within ARIA live regions. Without a live region, background notifications like cart count increments or incoming news alerts pass in absolute silence. However, abusing assertive live regions interrupts user concentration and causes cognitive confusion. Professional frontend architects embed polite live containers in the initial DOM markup and configure atomic announcements to communicate dynamic updates smoothly without stealing focus. Here is your streetwise review.

❒ The Rules of Live Regions

1. Embed live region containers in the DOM before injecting dynamic content.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Dynamically creating both container and text simultaneously prevents speech announcements.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Set \`aria-atomic="true"\` when partial updates require full context to make sense.
2. Reserve assertive live regions strictly for genuine emergencies.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Use \`role="status"\` or \`aria-live="polite"\` for standard progress and confirmation updates.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Assertive alerts interrupt user speech mid-word and cause disorientation.

❒ The Developer's Levers

1. Never dynamically inject live containers and text in the same tick.

**DO NOT DO THIS:** Create a live region div on the fly and populate it immediately.
\`\`\`javascript wrong
const box = document.createElement(\x27div\x27);
box.setAttribute(\x27aria-live\x27, \x27polite\x27);
box.textContent = \x27Saved\x27;
document.body.appendChild(box);
\`\`\`
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Update the text of a pre-existing live region container.
\`\`\`javascript right
existingLiveBox.textContent = \x27Saved\x27;
\`\`\`
2. Never use assertive alerts for non-critical status notifications.

**DO NOT DO THIS:** Interrupt user speech for routine cart updates.
\`\`\`html wrong
<div role="alert">Item added to bag</div>
\`\`\`
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Queue the announcement politely using status semantics.
\`\`\`html right
<div role="status">Item added to bag</div>
\`\`\`

➔ NEVER use \`aria-live="assertive"\` unless the notification represents an immediate hazard or system timeout.

➔ ALWAYS establish live containers in markup prior to initiating asynchronous data fetching.

➔ IF an update consists of numbers or partial phrases THEN set \`aria-atomic="true"\` for full context.

| | **SILENT DOM MUTATION**<br>(unannounced update) | **POLITE LIVE REGION**<br>(accessible status) |
| ---: | :--- | :--- |
| **Audio feedback** | Zero feedback; user is<br>unaware of changes | Speaks updated text<br>upon natural pause |
| **Focus stability** | Requires stealing focus<br>to announce content | Leaves keyboard focus<br>completely undisturbed |
| **Cognitive impact** | High anxiety over whether<br>actions registered | Clear confirmation without<br>interrupting flow |
| **WCAG conformance** | Violates 4.1.3 Status<br>Messages (Level AA) | Conforms to Level AA<br>status message rules |
| **Architecture role** | Unmonitored container<br>in passive markup | Observable subtree in<br>accessibility tree |
`;

const content27 = `# Lecture 27: Modal Dialog Pattern and Focus Trapping
> INTERVIEW QUESTION | ❱❱❱ ADVANCED | What are the required keyboard behaviors and ARIA roles for an accessible modal dialog?

1. Clara navigates an investigative special report on the National Times website using only the Tab key.
2. An urgent subscription renewal dialog opens over the article, dimming the background behind a dark backdrop.
3. Clara presses Tab to locate the confirmation button, but her focus ring drifts straight through the dialog into the buried article behind it.
4. Why does keyboard focus freely escape a modal overlay and wander through deactivated background content?
5. Clara presses Escape, but the dialog refuses to close, leaving her trapped in an unreadable visual layer.
6. A compliant modal dialog requires an explicit ARIA role, an accessible label, a trapped focus loop, and Escape key dismissal.
7. Today we engineer the complete WAI-ARIA dialog pattern, trap keyboard navigation cleanly, and restore previous focus upon exit.

### The Leaky Overlay: Escaping the Modal Trap

When a modal dialog opens, it demands the user's immediate, exclusive attention while rendering underlying background content inert. If a developer implements a dialog using a naive styled division, keyboard focus easily leaks through the boundary into obscured links, disorienting keyboard operators. An accessible modal dialog must constrain Tab navigation in a closed loop between its first and last focusable elements.

\`\`\`html title="leaky-vs-trapped-dialog.html"
<!-- WRONG: uncontained div allows keyboard focus to escape into background -->
<div class="modal-box"><h3>Renew Subscription</h3><button>Close</button></div>

<!-- RIGHT: native dialog element traps focus and provides modal semantics -->
<dialog class="modal-box" aria-labelledby="dlg-title"><h3 id="dlg-title">Renew</h3><button>Close</button></dialog>
\`\`\`

\`\`\`canvas title="Paywall Modal: Leaky Div Overlay vs Contained Native Dialog" width="2/3" layout="compare"
dialog | Leaky Div Dialog | wrong="focus leaks" | ghost | note="✕ Tab escapes to background"
dialog | Native Dialog Trap | right="focus trapped" | focus=1 | note="✓ Tab cycles within dialog"
\`\`\`

The comparison highlights the severe structural flaw of custom division overlays. On the left, an unmanaged division dialog allows the Tab key to bleed straight through the semi-transparent backdrop, focusing invisible headline links behind the modal. On the right, deploying the HTML5 \`<dialog>\` element with its native \`showModal()\` method automatically creates a modal boundary that locks keyboard focus exclusively within the dialog.

This failure violates WCAG 2.4.3 Focus Order and WCAG 1.3.2 Meaningful Sequence. Sighted keyboard navigators and screen reader operators must never be allowed to interact with content that has been visually obscured or disabled.

### The Return Trip: Restoring Focus Upon Dismissal

Dismissing a modal dialog requires more than just removing its DOM node or applying a hidden class. When the dialog closes, the browser resets focus to the top of the page unless the application actively restores focus to the triggering element. Stashing the element that initiated the modal and returning focus to it upon closure preserves the user's spatial memory and ongoing reading workflow.

\`\`\`javascript title="dialog-focus-restore.js"
// WRONG: closing modal forgets origin, resetting focus to body root
dialog.close();

// RIGHT: caches trigger element and restores focus upon dismissal
const trigger = document.activeElement;
dialog.showModal();
// on dismiss:
dialog.close();
trigger.focus();
\`\`\`

\`\`\`canvas title="Modal Dismissal: Lost Focus Reset vs Trigger Restoration" width="2/3" layout="compare"
button | Close Dialog | wrong="lost focus" | ghost | note="✕ Focus resets to body root"
button | Renew Subscription | right="focus restored" | focus=1 | note="✓ Focus returns to trigger"
\`\`\`

The layout comparison illustrates the necessity of focus restoration symmetry. On the left, closing the dialog leaves keyboard focus orphaned, causing the browser to reset focus to the top of the page and forcing Clara to re-tab forty links to regain her place. On the right, the application caches a reference to the initiating trigger button prior to opening the modal and restores focus to that exact element the moment the dialog closes.

This symmetry satisfies WCAG 2.4.3 Focus Order. Users expect closing a temporary conversation window to return them seamlessly to the exact spot where they were interrupted.

### The Four Invariants of the WAI-ARIA Modal Pattern

To achieve complete accessibility, every modal dialog must honor four non-negotiable invariants:

1. **Role and Labeling:** The container must declare \`role="dialog"\` (or use the native \`<dialog>\` tag), \`aria-modal="true"\`, and an accessible label referencing its primary heading via \`aria-labelledby\`.
2. **Initial Focus Placement:** Upon opening, focus must move immediately to the first interactive element inside the modal, such as the confirmation input or primary action button.
3. **Focus Trapping Loop:** Pressing Tab on the last focusable element wraps focus back to the first focusable control, and pressing Shift-Tab on the first control cycles backward to the last.
4. **Escape Key Dismissal:** Pressing the Escape key must dismiss the modal immediately and restore focus to the originating trigger.

The W3C WAI-ARIA Authoring Practices Guide details this behavioral contract:

> A dialog is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Keyboard focus must be constrained within the dialog until it is closed.
*W3C, WAI-ARIA Authoring Practices Guide: Dialog (Modal) Pattern, \`resources/accessibility/practices/dialog-modal.html\`*

### Production Svelte 5 Implementation of Subscription Renewal Dialog

Here is the complete Svelte 5 component for the National Times paywall renewal modal, demonstrating native dialog usage, focus containment, and origin restoration:

\`\`\`svelte title="RenewalDialog.svelte"
<script>
  let { isOpen = $bindable(false), onrenew } = $props();
  let dialogRef = $state(null);
  let triggerElement = $state(null);

  $effect(() => {
    if (isOpen && dialogRef) {
      triggerElement = document.activeElement;
      dialogRef.showModal();
    } else if (!isOpen && dialogRef && dialogRef.open) {
      dialogRef.close();
      triggerElement?.focus();
    }
  });

  function handleClose() {
    isOpen = false;
  }

  function handleCancel(event) {
    event.preventDefault();
    handleClose();
  }
</script>

<dialog
  bind:this={dialogRef}
  aria-labelledby="dialog-heading"
  aria-describedby="dialog-desc"
  oncancel={handleCancel}
  class="subscription-dialog"
>
  <div class="dialog-content">
    <h2 id="dialog-heading">Renew Your All-Access Subscription</h2>
    <p id="dialog-desc">Your investigative news pass expires in 3 days. Renew now to retain uninterrupted access.</p>

    <div class="dialog-actions">
      <button type="button" class="btn-primary" onclick={onrenew}>
        Confirm Renewal ($12/mo)
      </button>
      <button type="button" class="btn-secondary" onclick={handleClose}>
        Remind Me Later
      </button>
    </div>
  </div>
</dialog>

<style>
  .subscription-dialog {
    padding: 24px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    max-width: 480px;
  }
  .subscription-dialog::backdrop {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(2px);
  }
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }
  .btn-primary {
    padding: 10px 18px;
    background: #0284c7;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn-secondary {
    padding: 10px 18px;
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
\`\`\`

In this architecture, Clara experiences effortless keyboard containment. Leveraging the native HTML5 \`<dialog>\` element with \`showModal()\` automatically isolates background DOM nodes as inert, traps keyboard tabbing cleanly within the modal, dismisses on Escape, and returns focus to the initiating trigger via Svelte 5 reactive effects.

> [!KEY]
> An accessible modal dialog must trap keyboard focus within its bounds, dismiss on the Escape key, and restore focus to the originating trigger upon closing.

> [!TIP]
> **To impress the interviewer:** explain why modern web development strongly favors the native HTML5 \`<dialog>\` element and its \`showModal()\` API over custom JavaScript focus traps. Point out that \`showModal()\` automatically manages the top-layer stack, handles the Escape key natively, isolates background content without needing manual \`inert\` or \`aria-hidden\` hacks on sibling nodes, and manages initial focus according to the HTML specification.

### Where you will meet this

- Subscription and paywall prompts: intercepting readers on restricted investigative articles.
- Delete confirmation alerts: confirming destructive editorial actions like deleting articles or comments.
- Cookie preference dialogs: offering explicit tracking choices before users enter the site.
- Media galleries: enlarging photojournalism captures into full-screen modal lightboxes.
- Authentication modals: logging in or registering without leaving the current article view.

### Glossary

- **Modal Dialog**: An overlay window that restricts keyboard and mouse interaction exclusively to its contents while active.
- **showModal()**: The native HTML5 JavaScript method that opens a dialog as an isolated modal in the top layer.
- **Inert**: A state or attribute rendering background DOM content unclickable, unfocusable, and invisible to assistive devices.
- **Focus Trapping**: A mechanism preventing the Tab key from leaving an active container by cycling between its endpoints.
- **Top Layer**: A dedicated browser rendering layer that sits above all other document z-indexes.
- **Focus Restoration**: Returning the active keyboard focus ring to the initial trigger button upon dialog dismissal.

### Summary

**Modal Dialog Pattern and Focus Trapping Architecture**

Custom modal overlays built from generic divisions represent one of the most hazardous anti-patterns on the modern web. Without active focus trapping, keyboard navigators leak straight through semi-transparent backdrops, triggering unseen controls buried beneath the modal. When the dialog closes, orphaned focus collapses to the top of the document. Professional frontend engineers implement the four invariants of the WAI-ARIA modal pattern or deploy the native HTML5 dialog element, locking focus within the modal, dismissing on Escape, and restoring focus cleanly to the originating trigger. Here is your streetwise review.

❒ The Rules of Modal Dialog Architecture

1. Constrain keyboard navigation strictly within the active dialog.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Prevent the Tab key from escaping into background elements.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Provide native Escape key support to dismiss the dialog at any time.
2. Cache the originating trigger and restore focus upon dismissal.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Prevent the browser from resetting focus to the document root upon close.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Return focus to the exact button that initiated the conversation.

❒ The Developer's Levers

1. Never implement modals using uncontained division elements.

**DO NOT DO THIS:** Create a fake dialog using a generic div without focus trapping.
\`\`\`html wrong
<div class="modal"><h3>Notice</h3><button>OK</button></div>
\`\`\`
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Use the native HTML5 dialog element with modal mechanics.
\`\`\`html right
<dialog class="modal"><h3>Notice</h3><button>OK</button></dialog>
\`\`\`
2. Never close a modal dialog without restoring focus to the trigger.

**DO NOT DO THIS:** Close the dialog and leave keyboard focus orphaned.
\`\`\`javascript wrong
modal.close();
\`\`\`
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Return focus to the cached trigger element that opened the modal.
\`\`\`javascript right
modal.close();
originTrigger.focus();
\`\`\`

➔ NEVER allow keyboard focus to escape the boundary of an active modal dialog.

➔ ALWAYS support immediate dismissal when the user presses the Escape key.

➔ IF using modern browsers THEN prefer native \`<dialog>\` with \`showModal()\` over custom div traps.

| | **LEAKY DIVISION OVERLAY**<br>(custom uncontained div) | **NATIVE MODAL DIALOG**<br>(accessible WAI-ARIA pattern) |
| ---: | :--- | :--- |
| **Focus containment** | Focus leaks through into<br>underlying background | Focus is strictly trapped<br>within dialog loop |
| **Background interaction** | Users can inadvertently<br>click obscured links | Background is marked inert<br>by browser top layer |
| **Escape dismissal** | Requires custom listener<br>which is often forgotten | Handled natively by the<br>browser on Escape |
| **Focus restoration** | Focus drops to body root<br>disorienting operator | Restores focus to original<br>trigger button cleanly |
| **WCAG conformance** | Violates 2.4.3 Focus Order<br>and 2.1.2 Trap rules | Meets Level A and Level AA<br>keyboard standards |
`;

fs.writeFileSync("md-lectures/25.md", content25);
console.log("Successfully wrote md-lectures/25.md");

fs.writeFileSync("md-lectures/26.md", content26);
console.log("Successfully wrote md-lectures/26.md");

fs.writeFileSync("md-lectures/27.md", content27);
console.log("Successfully wrote md-lectures/27.md");
