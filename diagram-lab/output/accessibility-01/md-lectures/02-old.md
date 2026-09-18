# Lecture 2: The Four Pillars of POUR
> INTERVIEW QUESTION | ❱ CORE | What are the four principles of WCAG (POUR), and how do they organize every success criterion?

1. Marcus, a front-end developer, audits the investigative transit report for the National Times.
2. He adjusts the banner colors until every automated contrast check glows green.
3. He unplugs his mouse and presses the tab key to reach the live update button.
4. Why does the blue selection ring skip the button entirely, leaving the update step unreachable?
5. Sighted readers with mice click through easily, but keyboard readers cannot activate the button at all.
6. Passing the visual check solved only one barrier, leaving three invisible barriers completely untouched.
7. Today you learn the four foundational principles that organize every rule in digital accessibility.

### The Illusion of the Visual Pass

Marcus fell into the most common trap in frontend engineering: equating visual polish with accessible design. He calibrated the text against its background on the National Times investigative report, confirmed that the photo had alt text, and celebrated when his automated audit returned zero errors. Yet the moment he disconnected his mouse and attempted to navigate the live transit update box using only his keyboard, the interface stalled. Sighted readers with a mouse clicked the button without issue. But keyboard users pressing the Tab key watched the blue focus ring jump right past the button into the footer. The button was not a real button. It was a generic division element styled with CSS and hooked to a mouse click listener. Because it lacked native interactive semantics, the browser never placed it in the tab sequence, keyboard presses never triggered it, and assistive software never announced it as an actionable control. Marcus had eliminated a visual obstacle while leaving a functional blockade across the reader's path.

Accessibility is not a single slider that moves from poor to good. It is a multi-dimensional contract governed by four distinct principles: Perceivable, Operable, Understandable, and Robust, known by the acronym POUR. The World Wide Web Consortium establishes these four pillars as the bedrock of the Web Content Accessibility Guidelines.

> The guidelines and success criteria are organized around the following four principles, which lay the foundation necessary for anyone to access and use web content.
*W3C, Understanding WCAG 2.2: Understanding the Four Principles of Accessibility, `resources/accessibility/wcag/understanding/intro.html`*

Before we inspect the underlying markup, look at the investigative story the way a keyboard reader and a screen reader encounter it. Sighted users see a rich news report with a crisp photo and clear typography, but the technical reality reveals that key controls are disconnected from keyboard input and silent to assistive tools.

```canvas title="national-times investigative report, the four barrier test"
url=www.nationaltimes.com/investigations/transit-crisis
masthead | The National Times | landmark=banner
nav | Investigations; Politics; Culture | landmark=navigation
h1 | Special Report: Transit Strike Enters Third Day
image | transit-strike.jpg | alt="Picket line outside central rail depot"
text | Commuters face extensive delays across metropolitan lines as negotiations stall.
button | Listen to Audio Dispatch (3:45) | focus=1 | right | sr="Listen to Audio Dispatch, button"
input |  | label="Subscriber email" | focus=2 | right | sr="Subscriber email, edit text"
button | Activate Live Updates | wrong="not keyboard operable" | sr="Activate Live Updates, text"
footer | The National Times, 2026 | landmark=contentinfo
contrast | #0f172a on #ffffff | 15.8:1 pass
sr | "Activate Live Updates" announces as unclickable plain text
focus-order | Audio Dispatch → Subscriber email → footer (skips Activate button)
```

The canvas highlights the multi-dimensional breakdown that Marcus discovered. The contrast strip reports a passing ratio of 15.8 to 1, and the investigative photograph provides alternative text, fulfilling Perceivable requirements for sight and assistive translation. Sighted mouse users can click both buttons with ease. But examine the focus order and screen reader strips: pressing the tab key navigates from the audio dispatch button to the email field, and then leaps directly to the footer, skipping the Activate Live Updates button entirely. Furthermore, the screen reader announces the control as plain text rather than an actionable button. The interface is visually complete, but mechanically broken.

### The Failing Markup and the Semantic Correction

Here is the fragile markup that produced this partial pass:

```html title="live-alerts-broken.html"
<div class="alert-box">
  <div class="headline">Get Real-Time Transit Alerts</div>
  <p>Dispatch updates delivered directly to your inbox.</p>
  <input type="email" placeholder="Subscriber email" /> <!-- **WRONG:** placeholder is not an accessible **NAME** -->
  <div class="btn" style="color: #fff; background: #111;" onclick="subscribe()">Activate Live Updates</div> <!-- **WRONG:** styled div is not **OPERABLE** by keyboard -->
</div>
```

The author of that snippet solved only the visual presentation. The fix requires restoring the semantic structure that gives browsers, operating systems, and assistive technologies the necessary hooks to operate the element:

```html title="live-alerts.html"
<section class="alert-box" aria-labelledby="alert-title">
  <h2 id="alert-title">Get Real-Time Transit Alerts</h2>
  <p>Dispatch updates delivered directly to your inbox.</p>
  <form action="/alerts/subscribe" method="post">
    <label for="alert-email">Subscriber email</label>
    <input id="alert-email" name="email" type="email" autocomplete="email" required /> <!-- **RIGHT:** explicit label establishes accessible **NAME** -->
    <button type="submit">Activate Live Updates</button> <!-- **RIGHT:** native button is fully **OPERABLE** by keyboard -->
  </form>
</section>
```

Replacing the styled div with a native button element resolves the failure instantly. The browser automatically places the native button into the keyboard focus sequence, binds Space and Enter keypresses to form submission, and registers the element with the operating system accessibility tree as an actionable button.

### The Four Pillars of POUR

Understanding POUR means recognizing how each principle governs a distinct phase of human and machine interaction:

1. **Perceivable.** Information and user interface components must be presentable to users in ways they can perceive (it cannot be invisible to all senses). This requires sensory redundancy: text descriptions for photographs, synchronized captions for video, and high color contrast for low-vision readers.
2. **Operable.** User interface components and navigation must be operable (it cannot require interactions a user cannot perform). Every interactive control must respond to keyboard commands alone, without traps or impossible timing constraints.
3. **Understandable.** Information and operation must be understandable (the interface cannot be beyond user comprehension). The page language must be declared, form controls must have unambiguous labels, validation errors must provide recovery instructions, and components must behave predictably.
4. **Robust.** Content must be robust enough to be interpreted reliably by current and future user agents, including assistive technologies. In Lecture 1, Alma could not renew her subscription because the card input lacked an accessible name `(see Lecture 1)`. Under the POUR taxonomy, that was a failure of Robust markup: the input failed to expose its programmatic name and role to the platform accessibility API.

The official guidance underscores the non-negotiable nature of all four pillars:

> If any of these are not true, users with disabilities will not be able to use the web.
*W3C, Understanding WCAG 2.2: Understanding the Four Principles of Accessibility, `resources/accessibility/wcag/understanding/intro.html`*

> [!KEY]
> Accessibility is not a single visual checklist; an interface is accessible only when all four pillars of POUR stand simultaneously.

### How POUR Organizes Every Success Criterion

WCAG is structured as a four-tier pyramid. At the peak sit the **4 Principles**, providing the human foundation. Directly beneath sit **13 Guidelines**, which provide operational targets (such as Guideline 1.1 Text Alternatives and Guideline 2.1 Keyboard Accessible). Under each guideline sit the **Success Criteria**, the testable requirements rated Level A, Level AA, or Level AAA. Finally, at the base sit the **Techniques**, which document concrete code solutions in HTML, CSS, JavaScript, and ARIA.

Why not just run an automated scanner like Lighthouse or axe-core and call the job complete? Automated tools typically catch only 30% to 40% of accessibility barriers. A scanner can verify that text has a 4.5 to 1 contrast ratio under Perceivable, but it cannot know whether your keyboard tab sequence flows logically under Operable, or whether form validation guidance is understandable to a confused reader. Relying on automated audits alone creates dangerous false confidence: you fix the contrast, yet your checkout remains unusable for thousands of paying readers.

> [!TIP]
> **To impress the interviewer:** do not merely recite the acronym. Senior engineers frame POUR as an architectural dependency model: Perceivable gets information into human senses, Operable enables physical input, Understandable eliminates cognitive confusion, and Robust guarantees compatibility with assistive software. Then explain the WCAG structural pyramid: Principles define human requirements, Guidelines set operational targets, Success Criteria establish testable rules with A, AA, and AAA levels, and Techniques provide code-level execution.

### Where you will meet this

- Subscription checkout funnels: ensuring that high-contrast pricing tables are accompanied by keyboard-operable payment buttons and unambiguous field validation messages.
- Live breaking news video players: providing real-time captions for hearing-impaired audiences and keyboard-driven play, pause, and volume controls.
- Interactive navigation menus: guaranteeing that dropdown sections can be expanded with the Space or Enter key and expose correct expanded state to screen readers.
- User registration and password resets: offering clear password requirements upfront and avoiding tight time limits that lock users out while typing.
- Global language navigation: setting the page language attribute so international screen readers pronounce translations with the correct accent.

### Glossary

- **POUR Principles**: The four foundational accessibility pillars of WCAG stating that digital content must be Perceivable, Operable, Understandable, and Robust.
- **Perceivable**: The principle requiring information and user interface components to be presented in ways users can perceive through sight, hearing, or touch.
- **Operable**: The principle requiring user interface controls, input methods, and navigation to be fully functional via keyboard or alternate input devices without physical traps.
- **Understandable**: The principle requiring user interfaces, written language, and interaction flows to operate predictably and provide clear instructions for error prevention and recovery.
- **Robust**: The principle requiring content to be authored with standard markup so current and future user agents, including assistive software, can reliably interpret its state and roles.
- **Success Criteria**: Testable, technology-independent normative rules in WCAG categorized under levels A, AA, and AAA to verify accessibility conformance.

### Summary

**The POUR Taxonomy as an Architectural Discipline**

In production engineering, the POUR principles are not an academic checklist to review before launch; they are a diagnostic framework for triaging bugs, structuring markup, and designing resilient digital experiences. Automated test suites verify only a fraction of the Perceivable and Robust criteria, while comprehensive human testing is necessary to confirm Operable and Understandable requirements. Here is your streetwise review.

❒ The Four Pillars at a Glance

1. Perceivable demands sensory redundancy.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Never lock critical information behind a single sensory channel like sight or sound.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Provide text alternatives for imagery, audio descriptions for video, and clear color contrast for reading.
2. Operable demands device independence.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Every interactive element must be reachable and operable using a keyboard alone.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Prevent keyboard focus traps, maintain logical tab order, and provide distinct visible focus indicators.
3. Understandable demands interaction predictability.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Never shift page context or submit forms spontaneously upon focus or input.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Provide explicit labels, helpful error notifications, and clear recovery instructions.
4. Robust demands platform standards.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Build interfaces using native semantic elements rather than generic unstyled containers.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Ensure all custom controls expose a valid programmatic name, role, and value to assistive technologies.

❒ The Developer's Levers

1. Never substitute visual styling for interactive operability.

**DO NOT DO THIS:** Build an interactive control out of a div that keyboard users cannot reach.
```html wrong
<div class="pay-btn" onclick="submitOrder()">Submit Payment</div>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Use a native button element that receives focus and responds to keyboard activation.
```html right
<button type="submit">Submit Payment</button>
```
2. Never rely on automated audits as proof of conformance.

**DO NOT DO THIS:** Declare a page accessible based solely on a passing automated contrast score.
```html wrong
<p style="color: #000; background: #fff;">Dark text on light background passes contrast, but hidden focus traps still break navigation.</p>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Validate keyboard tab navigation and screen reader announcements alongside visual styling.
```html right
<a href="#content" class="skip-link">Skip to main content</a>
```

➔ NEVER declare a component accessible after checking only its visual contrast.

➔ ALWAYS ensure every interactive element can be operated by keyboard alone without a mouse.

➔ IF any single principle of POUR fails THEN the interface is completely broken for people with disabilities.

| | **PRIMARY BARRIER**<br>(symptom) | **ENGINEERING FIX**<br>(mechanism) |
| ---: | :--- | :--- |
| **Perceivable**<br>(senses) | Low contrast, missing alt text, or silent video | High-contrast palette and `<br>``<img alt="...">` tags |
| **Operable**<br>(controls) | Keyboard-unreachable buttons or focus traps | Native `<button>`<br>elements and logical Tab stops |
| **Understandable**<br>(comprehension) | Cryptic validation errors or unexpected context shifts | Explicit `<label>`<br>text and predictable form behaviors |
| **Robust**<br>(technology) | Styled containers lacking standard accessibility roles | Semantic HTML tags and `<br>`valid ARIA attributes |
| **National Times case** | Unlabelled photos and low-contrast news dispatches | Native button markup restoring `<br>`full keyboard tab navigation |
