# Lecture 18: Form Grouping and Error Association
> INTERVIEW QUESTION | ❱❱ MORE | How do you group related form controls and associate validation errors?

1. Arthur reaches the checkout screen on the National Times website to renew his annual subscription.
2. Because Arthur is completely blind, he relies entirely on his screen reader while pressing Tab through the inputs.
3. The checkout rejects his submission, paints three inputs in red borders, and resets his cursor to the top.
4. Why does the speech synthesizer announce only bare text fields without mentioning any problem?
5. Arthur cannot tell which inputs failed, why the purchase stopped, or how to fix his submission.
6. Silent visual error states and orphaned inputs turn an ordinary payment into an impossible guessing game.
7. Today we structure grouped inputs with fieldset and legend, wire errors with aria-describedby, and guide assistive tools through recovery.

### The Breakdown at Checkout: When Red Borders Say Nothing

In visual design, indicating a form error is straightforward: designers tint the failing text field with a red border, render a small exclamation mark icon, and display an explanatory message beneath the box. For a sighted user, this visual combination instantly flags what went wrong.

For assistive technology, visual styling is completely invisible. When Arthur tabs into a credit card field marked in red, his screen reader queries the browser accessibility tree. If that input lacks programmatic error associations, the screen reader announces only the element name and its current value: "Card Number, edit text." The speech synthesizer conveys nothing about the red outline, nothing about the invalid format, and nothing about the error paragraph sitting right below it on the screen.

Even before errors occur, complex forms frequently confuse screen readers when inputs lack structural grouping. Consider a set of two radio buttons labeled "Yes" and "No." If Arthur tabs onto "Yes," hearing only "Yes, radio button" tells him nothing about what question he is answering. Without a programmatic parent group, the context evaporates.

To resolve these barriers, web standards provide two foundational mechanisms: semantic grouping through fieldset and legend elements, and programmatic error binding through the aria-invalid and aria-describedby attributes:

```canvas title="/checkout/digital-subscription — Grouped Controls and Inline Errors"
url=https://nationaltimes.com/checkout/digital-subscription
masthead | The National Times | landmark=banner
h1 | Complete Your Subscription
text | Select delivery cadence and enter billing information.
region | Payment Cadence Options | landmark=region
input |  | label="Monthly Digital ($12/mo)" | focus=1
input |  | label="Annual All-Access ($120/yr)"
text | Cardholder Details | landmark=region
input |  | label="Cardholder Name" | text="Arthur Pendelton"
input |  | label="Card Number" | wrong | sr="Card Number, edit text, invalid entry. Error: Enter a valid 16-digit card number." | focus=2
text | Enter a valid 16-digit card number. | wrong | sr-only
button | Authorize Payment ($120) | focus=3 | sr="Authorize Payment ($120), button"
footer | The National Times, 2026 | landmark=contentinfo
sr | "Card Number, required, invalid entry, edit text. Enter a valid 16-digit card number."
focus-order | Monthly Digital → Cardholder Name → Card Number → Authorize Payment
```

Here is the fragile form markup that left Arthur stranded at the checkout:

```html title="broken-checkout.html"
<div class="billing-group">
  <p class="group-title">Delivery Format</p> <!-- **WRONG:** paragraph provides zero programmatic grouping for **CONTROLS** -->
  <input type="radio" name="plan" id="p1" value="m">
  <label for="p1">Monthly Digital</label>
  <input type="radio" name="plan" id="p2" value="a">
  <label for="p2">Annual All-Access</label>
</div>

<div class="field-container error">
  <label for="cc-num">Card Number</label>
  <input type="text" id="cc-num" class="input-error"> <!-- **WRONG:** red class conveys no programmatic error **STATE** -->
  <span class="error-msg">Enter a valid 16-digit card number.</span> <!-- **WRONG:** orphaned error text is ignored by screen **READERS** -->
</div>
```

Because the error message was a disconnected span element, Arthur's screen reader had no programmatic path linking the text description to the focused card field.

### Semantic Grouping: Why Fieldset and Legend Are Mandatory

When individual form controls share an overarching question or category, placing them inside a generic container like a div fails WCAG 1.3.1 Info and Relationships. Screen readers do not announce div titles or preceding paragraph tags when tabbing through child controls.

The HTML standard solves this with the `<fieldset>` and `<legend>` elements. The `<fieldset>` element establishes a container for related controls, and the `<legend>` element supplies the accessible group name. When a user tabs into any control inside the fieldset, the screen reader automatically announces the legend text before the control's individual label.

The W3C Web Accessibility Initiative tutorial explains the cognitive and mechanical role of grouping:

> Grouping related form controls makes forms more understandable for all users, as related controls are easier to identify. It also makes it easier for people to focus on smaller and more manageable groups rather than try to grasp the entire form at once.
*W3C WAI, Grouping Controls, `resources/accessibility/wai/pages/design-develop/tutorials/forms/grouping.md`*

Grouping is essential in three common scenarios:
1. **Radio button groups:** where individual choices like "Monthly" and "Annual" only make sense under a shared prompt like "Billing Cadence."
2. **Related checkbox sets:** such as selecting multiple delivery days or newsletter preferences under a category heading.
3. **Multi-field composite inputs:** such as three separate inputs for date of birth (Day, Month, Year) or telephone components (Country Code, Area Code, Number).

### The Triad of Accessible Error Handling

When validation fails, satisfying WCAG 3.3.1 Error Identification and WCAG 4.1.2 Name, Role, Value requires coordinating three synchronized steps:

1. **State signaling with `aria-invalid="true"`:** This attribute informs the browser accessibility API that the element's current value fails validation rules. Screen readers immediately announce "invalid entry" or "alert" upon receiving focus.
2. **Description association with `aria-describedby`:** This attribute takes the ID of the error message element. The browser appends the error message text to the input's accessible description, speaking the error after the element label.
3. **An accessible error summary:** When the form submits with errors, a top-level error summary container with `role="alert"` announces the total error count and provides clickable in-page links directly to each failing control.

The W3C Understanding documentation defines the baseline mandate of Criterion 3.3.1:

> The intent of this success criterion is to ensure that users are aware that an error has occurred and can determine what is wrong. In the case of an unsuccessful form submission, it is not sufficient to only re-display the form without providing any hint that the submission failed. The error must be indicated in text.
*W3C, Understanding WCAG 2.0: Error Identification, `resources/accessibility/wcag/understanding/20/error-identification.html`*

### Production Markup: Grouping and Error Wiring

Here is the robust, accessible implementation for the National Times subscription checkout:

```html title="accessible-checkout.html"
<form novalidate>
  <fieldset class="plan-fieldset">
    <legend class="plan-legend">Select Subscription Cadence</legend> <!-- **RIGHT:** legend provides accessible group **NAME** -->
    <div class="radio-option">
      <input type="radio" name="cadence" id="cadence-m" value="monthly">
      <label for="cadence-m">Monthly Digital ($12/mo)</label>
    </div>
    <div class="radio-option">
      <input type="radio" name="cadence" id="cadence-a" value="annual" checked>
      <label for="cadence-a">Annual All-Access ($120/yr)</label>
    </div>
  </fieldset>

  <div class="field-row">
    <label for="card-num" class="field-label">Card Number</label>
    <input
      type="text"
      id="card-num"
      name="cardNumber"
      aria-required="true"
      aria-invalid="true"
      aria-describedby="card-num-error"
      class="input-invalid"
    > <!-- **RIGHT:** binds error directly into accessible **DESCRIPTION** -->
    <p id="card-num-error" class="error-text">
      Enter a valid 16-digit card number.
    </p> <!-- **RIGHT:** referenced ID ensures error is announced on **FOCUS** -->
  </div>
</form>
```

When Arthur tabs onto the card number input, his screen reader speaks in one continuous announcement: "Card Number, required, invalid entry, edit text. Enter a valid 16-digit card number." The entire barrier is eliminated.

### Modern Svelte 5 Implementation of Form Error Handling

In dynamic single-page applications, validation errors appear dynamically after user interaction or API responses. Here is a production Svelte 5 component managing form state and focus shifts on error submission:

```svelte title="SubscriptionCheckout.svelte"
<script>
  let errors = $state({});
  let cardNumber = $state('');
  let summaryHeading = $state(null);

  function validateForm(event) {
    event.preventDefault();
    const newErrors = {};

    if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number without spaces.';
    }

    errors = newErrors;

    if (Object.keys(newErrors).length > 0) {
      summaryHeading?.focus(); // **RIGHT:** programmatically shifts focus to error **SUMMARY**
    }
  }
</script>

<form onsubmit={validateForm} novalidate>
  {#if Object.keys(errors).length > 0}
    <div class="error-summary" role="alert" tabindex="-1" bind:this={summaryHeading}>
      <h2>There are problems with your submission</h2>
      <ul>
        {#each Object.entries(errors) as [field, msg]}
          <li><a href="#{field}-input">{msg}</a></li> <!-- **RIGHT:** in-page anchor jumps user to failing **CONTROL** -->
        {/each}
      </ul>
    </div>
  {/if}

  <div class="input-block">
    <label for="cardNumber-input">Credit Card Number</label>
    <input
      id="cardNumber-input"
      type="text"
      bind:value={cardNumber}
      aria-invalid={errors.cardNumber ? 'true' : 'false'}
      aria-describedby={errors.cardNumber ? 'cardNumber-err' : undefined}
    />
    {#if errors.cardNumber}
      <span id="cardNumber-err" class="inline-error">{errors.cardNumber}</span>
    {/if}
  </div>

  <button type="submit">Complete Subscription</button>
</form>
```

> [!KEY]
> Visual error outlines convey nothing to screen readers. You must expose error state through `aria-invalid="true"` and connect error text through `aria-describedby`.

> [!TIP]
> **To impress the interviewer:** detail the complete lifecycle of accessible form submission failure. First, explain why you should never rely solely on HTML5 browser validation tooltips, which screen readers often fail to announce predictably. Second, describe the two-tier notification pattern: an error summary banner marked with `role="alert"` and `tabindex="-1"` that receives programmatic focus upon submit, paired with field-level inline errors wired to inputs using `aria-invalid="true"` and `aria-describedby`. Third, explain that `aria-describedby` supports space-separated lists of IDs, allowing an input to link simultaneously to static formatting hints and dynamic error messages.

### Where you will meet this

- Subscription and checkout billing: grouping payment method radio buttons and associating credit card validation errors.
- Account registration forms: validating password strength criteria and linking checklist hints to the password input.
- User profile settings: grouping multi-checkbox notification preferences under a unified communication category.
- Survey questionnaires: grouping Likert-scale radio buttons so screen readers read the survey question on every option.
- Multi-page application wizards: focusing top-level error summaries when users attempt to advance without completing required steps.

### Glossary

- **Fieldset**: An HTML container element that groups related form controls and establishes a common context for assistive technologies.
- **Legend**: The first child element of a fieldset that supplies the accessible name and group title for all enclosed controls.
- **aria-invalid**: An ARIA state attribute that programmatically flags whether the current value of a form control passes validation rules.
- **aria-describedby**: An ARIA property taking a list of element IDs whose combined text acts as the accessible description for the target element.
- **Error Summary**: A prominent list placed at the top of a form after failed submission that outlines all errors and links to failing fields.
- **Accessible Description**: Supplementary text provided to assistive technologies after the element's accessible name and role are announced.

### Summary

**Form Grouping and Validation Error Architecture**

Handling forms cleanly requires separating visual decoration from programmatic accessibility semantics. Red border styles and floating error paragraphs convey zero information to non-sighted users unless they are anchored to inputs in the accessibility tree. Grouping controls with fieldset and legend preserves context for radio buttons and multi-part inputs, while aria-invalid and aria-describedby ensure error feedback is vocalized immediately upon focus. Here is your streetwise review.

❒ Semantic Grouping with Fieldset and Legend

1. Never group related controls with bare div and paragraph tags.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Radio buttons and multi-input dates lose their overarching question without semantic grouping.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) The legend element automatically prefixes every child control during screen reader tabbing.
2. Group controls when choices cannot stand alone.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Always wrap radio button groups inside a fieldset.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Always place the legend as the very first element inside the fieldset.

❒ Wiring Inline Validation Errors

1. Never rely on CSS classes alone to communicate errors.

**DO NOT DO THIS:** Add a red border class without updating ARIA state attributes.
```html wrong
<input type="text" id="email" class="input-error">
<p class="error-msg">Email format is invalid.</p>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Signal the error state and bind the error description ID to the input.
```html right
<input type="text" id="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error" class="error-msg">Email format is invalid.</p>
```
2. Never hide error descriptions behind unassociated floating icons.

**DO NOT DO THIS:** Display an error tooltip that is not connected to the input element.
```html wrong
<input type="text" id="postal" class="border-red">
<span class="tooltip">Invalid zip code</span>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Use aria-describedby so screen readers speak the error on focus.
```html right
<input type="text" id="postal" aria-invalid="true" aria-describedby="postal-desc">
<span id="postal-desc" class="tooltip">Invalid zip code</span>
```

➔ NEVER rely solely on color or CSS border styling to signal input error states.

➔ ALWAYS wrap radio button clusters inside a fieldset with a clear legend title.

➔ IF form submission fails THEN move focus to a top-level error summary and wire fields with aria-invalid.

| | **GROUPING SEMANTICS**<br>(fieldset and legend) | **ERROR WIRING**<br>(aria-describedby and invalid) |
| ---: | :--- | :--- |
| **Primary purpose** | Preserves context across<br>clusters of controls | Binds validation failures<br>to specific inputs |
| **Assistive announcement** | Speaks group legend before<br>individual control label | Speaks error text after<br>control accessible name |
| **Core attributes** | `<fieldset>` container with<br>`<legend>` first child | `aria-invalid="true"` and<br>`aria-describedby`<br>`="id"` |
| **Primary targets** | Radio sets, checkboxes,<br>multi-part date fields | Text inputs, select boxes,<br>formatted textareas |
| **WCAG criteria** | 1.3.1 Info and Relationships<br>(Level A standard) | 3.3.1 Error Identification<br>(Level A standard) |
