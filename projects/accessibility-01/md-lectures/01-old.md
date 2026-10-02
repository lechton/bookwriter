# Lecture 1: The Field With No Name
> INTERVIEW QUESTION | ❱ CORE | What is web accessibility, and who actually benefits when a site is accessible?

1. Alma, a subscriber who is blind, renews her National Times subscription online.
2. A program reads the page aloud to her, and every button is spoken clearly.
3. The program reaches the card number box and says only the word edit.
4. Why can Alma not pay, when every sighted reader renews in under a minute?
5. The renewal fails, her subscription lapses, and the paper loses the sale.
6. The box looks perfect on screen, so something invisible to the eye is missing.
7. Today you learn what that invisible thing is, and who else depends on it.

### The Sale That Never Happened

Alma pays for her subscription the way thousands of readers do, through the subscribe page. She does not use her eyes for that page. A screen reader (a program that reads the screen aloud and answers with the keyboard) is her eyes. The page greets her well: the title is spoken, the buttons say what they do, and the price is read out. Then the reading arrives at the card number box, and the announcement is one word: edit. No field name. No hint of what to type. She tabs on, hoping the next field explains itself, but the pattern repeats. The form never tells her where to put sixteen digits, so she never does. The page rendered perfectly for eyes and said almost nothing for ears.

The standard that names this failure is the Web Content Accessibility Guidelines, and its parent organization defines the field we are entering with one sentence.

> Web accessibility means that websites, tools, and technologies are designed and developed so that people with disabilities can use them.
*W3C WAI, Introduction to Web Accessibility, `resources/accessibility/wai/pages/fundamentals/introduction/index.md`*

Hold that sentence and look at the page Alma fought. Before we touch a single line of markup, we look at the page the way her software saw it: a set of regions, a set of headings, and a set of controls that either announce themselves or stay silent.

```canvas title="national-times subscribe, the field with no name"
url=www.nationaltimes.com/subscribe
masthead | The National Times | landmark=banner
nav | World; Politics; Culture | landmark=navigation
h1 | Subscribe to The National Times
text | All-access digital subscription, $9 per month.
input |  | label="Email address" | right | sr="Email address, edit text"
input |  | unlabelled | wrong | placeholder=Card number
button | Subscribe | right | sr="Subscribe, button"
footer | The National Times, 2026 | landmark=contentinfo
sr | The card field announces only: edit text
```

The canvas shows the invisible difference that cost the sale. The email field carries a real label, so the reading program announces its name and its kind. The card field below it relies on placeholder text, the gray hint inside the box, and that hint vanishes the moment a reader starts typing. More importantly, the hint was never the field's name in the first place. The green and red edges are the page's own verdict: one field exists in the world of spoken pages, the other does not.

### The Broken Markup and the Fixed Markup

Here is the markup that produced the silent field, the kind that ships when a team optimizes only for eyes.

```html title="subscribe-broken.html"
<div class="big-text">Subscribe to The National Times</div>
<p>All-access digital subscription, $9 per month.</p>
<input type="text" placeholder="Card number" /> <!-- **WRONG:** placeholder is a **HINT**, not a name -->
<button class="btn">Subscribe</button> <!-- **WRONG:** works for mice only until it is **NAMED** -->
```

The fix is not a plugin, an overlay, or a compliance badge. The fix is markup that carries meaning, because meaning is what reading software speaks aloud.

```html title="subscribe.html"
<h1>Subscribe to The National Times</h1>
<p>All-access digital subscription, $9 per month.</p>
<form>
  <label for="card">Card number</label>
  <input id="card" type="text" inputmode="numeric" /> <!-- **RIGHT:** label is wired by **ID** -->
  <button type="submit">Subscribe</button> <!-- **RIGHT:** a real button names itself for **FREE** -->
</form>
```

Three invisible things changed. The styled div became a real heading, so the reading program can announce it as the page title and let Alma jump to it. The input gained a label element tied to it by `for` and `id`, so the field now answers to Card number, edit text. And the visual button became a true button element, which arrives with its name, its keyboard behavior, and its role already built in. No line of that fix was accessibility-specific code. It was correct HTML, and correct HTML is the accessibility layer.

> [!KEY]
> If a control has no name, it does not exist for a screen reader, no matter how beautiful it looks.

### More Than One Reader

An interviewer will push next: who else benefits? The honest answer is nearly everyone, at different moments. The definition says people with disabilities, and that population is vast: visual, hearing, motor, cognitive, and age-related conditions, many of them invisible and many of them temporary. A reader with a broken wrist, a subscriber using one hand on a crowded train, a journalist squinting at a phone in bright sun: all of them are using the same ramps. This is the curb-cut effect, named for sidewalk ramps built for wheelchairs that now serve strollers, luggage, and deliveries. Captions serve deaf viewers and also everyone watching news muted in an office. Clear labels serve screen readers and also every reader in a hurry. When you build for the edges, the middle gets faster and clearer too.

> [!TIP]
> **To impress the interviewer:** define accessibility in one sentence, then widen it deliberately. Name the permanent, temporary, and situational cases, give one concrete curb-cut example from your own product, and close with the business stake: the reader Alma is not an edge case, she is a paying subscriber the page silently turned away. Candidates who only recite disability categories sound like a checklist; candidates who tell the story of a lost sale sound like engineers.

### Where you will meet this

- E-commerce checkouts: one unnamed card field is the difference between a completed purchase and an abandoned cart.
- Government service forms: legal accessibility requirements begin with the exact failures shown today.
- Video platforms: captions and audio descriptions open the same content to deaf and blind audiences.
- Hospital and banking portals: temporary and age-related impairments make accessible forms a mainstream need, not a niche one.
- Your own product: any input that only has a placeholder is already failing someone today.

### Glossary

- **Web Accessibility**: The engineering and design practice of building digital products so people with visual, auditory, motor, cognitive, and age-related disabilities can understand, navigate, and interact with them.
- **Screen Reader**: Assistive software that translates graphical user interfaces and document object models into synthesized audio speech or refreshable braille displays.
- **Accessible Name**: The programmatic text string that assistive technologies use to identify and announce a user interface control to the user.
- **Programmatic Association**: An explicit relationship established in code, such as linking a label to an input using for and id attributes, that binds descriptive text directly to a form control.
- **Placeholder Text**: Ephemeral hint text displayed inside an input before user entry, which vanishes upon typing and cannot substitute for an accessible label.
- **Curb-Cut Effect**: The universal design phenomenon where accessibility features engineered for people with disabilities produce widespread practical benefits for all users.

### Summary

**Accessibility as a Mainstream Product Requirement**

In daily production, accessibility is not a compliance chore bolted on after launch; it is the discipline of shipping pages that name themselves to every input device. Screens are one output channel; reading software, keyboards, and assistive tech are others, and semantic HTML is what speaks on all of them. Here is your streetwise review.

❒ Who Benefits and When

1. Design for the permanent case first, because the temporary and situational cases ride the same ramps.<br>&nbsp;&nbsp;&nbsp;&nbsp;Blind readers, broken wrists, bright sunlight, and crowded trains all consume the same label, heading, and button semantics.
2. Treat the definition as the contract: designed and developed so people with disabilities can use them.<br>&nbsp;&nbsp;&nbsp;&nbsp;That is a build-time responsibility in markup and code, not a cosmetic pass at the end.

❒ The Developer's Levers

1. Never ship an input whose only label is placeholder text.

**DO NOT DO THIS:** Rely on placeholder text as the field's name.
```html wrong
<input type="text" placeholder="Card number" />
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Give every input a real label, wired with `for` and `id`.
```html right
<label for="card">Card number</label>
<input id="card" type="text" />
```
2. Prefer native elements over styled divs, because they arrive named, keyboard-ready, and announced.

**DO NOT DO THIS:** Build controls from bare containers and click handlers.
```html wrong
<div class="btn" onclick="pay()">Subscribe</div>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Use the element the platform already gives you.
```html right
<button type="submit">Subscribe</button>
```

➔ NEVER ship a form field that has no programmatic name.

➔ ALWAYS choose the native element before reaching for styles, scripts, or ARIA.

➔ IF a page works for eyes but says nothing to reading software THEN the page is broken for paying customers.

| | **SILENT PAGE**<br>(unnamed) | **NAMED PAGE**<br>(accessible) |
| ---: | :--- | :--- |
| **Card field** | Placeholder only; announced as edit text | `<label>`<br>wired by `id` |
| **Heading** | Styled `<div>`<br>announced as nothing | `<h1>` announces level |
| **Button** | Click handler on a container | Native `<button>`<br>names itself |
| **Who can pay** | Readers with eyes and a mouse | Readers, keyboards, and reading software |
| **Business cost** | Silent abandoned sales | The Alma renewal completes |
