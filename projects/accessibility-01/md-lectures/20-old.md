# Lecture 20: Full Keyboard Operability
> INTERVIEW QUESTION | ❱❱ MORE | What does full keyboard operability require?

1. David opens a National Times investigative report featuring an audio testimony player.
2. Because David has motor neuropathy in both hands, he navigates the web without touching a mouse.
3. He tabs to the audio playback scrubber and presses the Right Arrow key to advance the recording.
4. Why does the custom timeline slider ignore every keystroke despite sliding smoothly under a mouse drag?
5. The playback head stays completely motionless, locking David out of five minutes of crucial municipal testimony.
6. Writing custom interactive widgets with mouse events alone strips away keyboard handlers and locks out motor-impaired readers.
7. Today we wire complete keyboard event contracts, implement ARIA slider semantics, and guarantee full keyboard operability.

### The Pointer Trap: Why Mouse Dragging Breaks the Web

When web engineers build custom widgets like media scrubbers, volume dials, date pickers, or carousels, they usually begin with pointing devices. They attach `pointerdown`, `pointermove`, and `pointerup` event listeners to a canvas or div element, compute mouse coordinates, and update visual state. Under mouse testing, the component feels buttery smooth.

For keyboard operators, this code is a complete dead end. When David navigates the page using the Tab key, his focus skips right past the slider because generic `<div>` elements are not natively focusable. If a well-meaning developer adds `tabindex="0"` to make the slider focusable, David can land on it, but pressing the Arrow keys does nothing. The browser does not synthesize pointer drag coordinates from keystrokes.

This failure directly violates WCAG 2.1.1 Keyboard, a foundational Level A criterion. Millions of people interact with the web exclusively through keyboards, mouth sticks, head wands, single-switch access devices, and eye-tracking software that emulate keystrokes. When a feature demands a mouse cursor to operate, it locks out an entire population of readers.

Full keyboard operability requires two simultaneous engineering commitments: programmatic focusability with semantic role exposure, and a complete, standardized keyboard interaction contract:

```canvas title="/media/investigative-audio-scrubber — Interactive Media Scrubber"
url=https://nationaltimes.com/media/investigative-audio-scrubber
masthead | The National Times | landmark=banner
h2 | Investigation: City Council Water Rights Hearing
button | Play Audio | focus=1 | sr="Play Audio, button"
text | Scrub audio playback position (03:45 / 15:00) | landmark=region
button | Audio Scrubber Thumb | focus=2 | sr="Audio seek slider, 225 seconds, 3 minutes 45 seconds" | kbd=ArrowRight
text | Current Time: 03:45 | Total Time: 15:00
button | Mute Audio | focus=3 | sr="Mute Audio, button"
footer | The National Times, 2026 | landmark=contentinfo
sr | "Audio seek slider, 225 seconds, 3 minutes 45 seconds, slider. Press Left or Right Arrow to adjust."
kbd | Tab → ArrowRight / ArrowLeft → Home / End
focus-order | Play Audio → Audio Scrubber Thumb → Mute Audio
```

Here is the mouse-only code that trapped David on the investigative report:

```html title="broken-scrubber.html"
<div class="audio-player">
  <button type="button" class="play-btn">Play</button>
  <div class="scrubber-track" onpointerdown="startDrag(event)"> <!-- **WRONG:** pointer handlers only with zero keyboard **SUPPORT** -->
    <div class="scrubber-thumb" style="left: 25%;"></div>
  </div>
</div>
```

Because the slider was built with pointer tracking alone, David could neither focus the thumb with the Tab key nor scrub through the audio with his keyboard.

### The WCAG Mandate: Success Criterion 2.1.1

WCAG Principle 2 demands that user interfaces be Operable. Criterion 2.1.1 Keyboard establishes the primary rule:

> The intent of this success criterion is to ensure that, wherever possible, content can be operated through a keyboard or keyboard interface (so an alternate keyboard can be used). When content can be operated through a keyboard or alternate keyboard, it is operable by people with no vision (who cannot use devices such as mice that require eye-hand coordination) as well as by people who must use alternate keyboards or input devices that act as keyboard emulators.
*W3C, Understanding WCAG 2.0: Keyboard, `resources/accessibility/wcag/understanding/20/keyboard.html`*

The only normative exception to 2.1.1 is when the underlying function requires path-dependent input (such as freehand watercolor painting or signature drawing) where the physical trajectory itself constitutes the information. Moving a slider thumb from 10 to 20 is not path-dependent; it is an endpoint adjustment that can and must be operated via keystrokes.

Furthermore, Criterion 2.1.2 No Keyboard Trap guarantees that keyboard focus never becomes locked inside a component, ensuring that users can always tab away using standard keystrokes.

### Native Elements First: `<input type="range">`

Before building custom slider elements from raw divs, remember the first rule of ARIA: if a native HTML element provides the required behavior, use it.

The HTML `<input type="range">` element provides built-in keyboard operability without writing a single line of JavaScript event handling. Browsers automatically handle:
- Focusability via Tab in DOM order
- Arrow Right and Arrow Up to increment by `step`
- Arrow Left and Arrow Down to decrement by `step`
- Home to jump directly to `min`
- End to jump directly to `max`
- Page Up and Page Down for large increment steps

```html title="native-range.html"
<label for="audio-seek">Scrub Audio Timeline</label>
<input
  type="range"
  id="audio-seek"
  min="0"
  max="900"
  value="225"
  step="5"
  aria-valuetext="3 minutes 45 seconds"
> <!-- **RIGHT:** native range provides keyboard navigation out of the **BOX** -->
```

Native range inputs can be extensively styled across browsers using CSS pseudo-elements (`::-webkit-slider-thumb`, `::-moz-range-thumb`), preserving native keyboard accessibility while matching custom design specifications.

### The ARIA Slider Pattern: Keyboard Contract for Custom Widgets

When technical requirements demand a custom slider component (such as multi-thumb range selectors or complex SVG audio visualizers), developers must implement the W3C ARIA Authoring Practices Guide (APG) Slider Pattern:

> A slider is an input where the user selects a value from within a given range. Sliders typically have a slider thumb that can be moved along a bar, rail, or track to change the value of the slider.
*W3C WAI, Slider Pattern, `resources/accessibility/aria-practices/content/patterns/slider/slider-pattern.html`*

To make a custom slider fully accessible, you must fulfill three core requirements:

1. **Accessibility Semantics:**
   - `role="slider"`: Declares the element role to assistive technologies.
   - `tabindex="0"`: Inserts the slider into the natural sequential keyboard tab order.
   - `aria-valuenow`: Exposes the current numeric value.
   - `aria-valuemin` and `aria-valuemax`: Define the lower and upper bounds.
   - `aria-valuetext`: Provides human-readable units (for example, "3 minutes 45 seconds" rather than raw seconds like "225").
   - `aria-label` or `aria-labelledby`: Provides the accessible name.

2. **The Keyboard Interaction Contract:**
   - `ArrowRight` and `ArrowUp`: Increment the value by one unit step.
   - `ArrowLeft` and `ArrowDown`: Decrement the value by one unit step.
   - `Home`: Jump directly to minimum allowed value.
   - `End`: Jump directly to maximum allowed value.
   - `PageUp` and `PageDown`: Jump by an optional large step (such as 10% of total range).

3. **Preventing Default Page Scroll:**
   When the user presses Arrow Down, the browser by default scrolls the viewport downward. Your keyboard handler must call `event.preventDefault()` specifically on handled slider keys so the user can adjust the value without displacing the viewport.

### Production Svelte 5 Implementation of an Accessible Audio Scrubber

Here is the complete Svelte 5 implementation for the National Times investigative audio scrubber, supporting both pointer drag and full keyboard operability:

```svelte title="AudioScrubber.svelte"
<script>
  let { min = 0, max = 900, step = 5, value = $bindable(225) } = $props();

  let percent = $derived(((value - min) / (max - min)) * 100);
  let timeText = $derived(`${Math.floor(value / 60)} minutes ${value % 60} seconds`);

  function handleKeydown(event) {
    let handled = true;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        value = Math.min(max, value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        value = Math.max(min, value - step);
        break;
      case 'PageUp':
        value = Math.min(max, value + step * 10);
        break;
      case 'PageDown':
        value = Math.max(min, value - step * 10);
        break;
      case 'Home':
        value = min;
        break;
      case 'End':
        value = max;
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault(); // **RIGHT:** stops arrow keys from scrolling the host **VIEWPORT**
    }
  }
</script>

<div class="scrubber-wrapper">
  <span id="scrubber-label" class="scrubber-label">Timeline Position</span>

  <div class="scrubber-rail">
    <div
      role="slider"
      tabindex="0"
      aria-labelledby="scrubber-label"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={timeText}
      onkeydown={handleKeydown}
      class="scrubber-thumb"
      style="left: {percent}%;"
    ></div> <!-- **RIGHT:** exposes ARIA slider contract with keyboard **HANDLERS** -->
  </div>

  <span class="time-display">{timeText}</span>
</div>

<style>
  .scrubber-rail {
    position: relative;
    width: 100%;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    margin: 12px 0;
  }
  .scrubber-thumb {
    position: absolute;
    top: 50%;
    width: 24px;
    height: 24px;
    transform: translate(-50%, -50%);
    background: #0284c7;
    border-radius: 50%;
    cursor: pointer;
    outline: none;
  }
  .scrubber-thumb:focus-visible {
    outline: 3px solid #0284c7;
    outline-offset: 3px;
  }
</style>
```

When David tabs onto this slider, his screen reader announces: "Timeline Position, slider, 225, 3 minutes 45 seconds." Pressing Arrow Right increments the time cleanly by five seconds without scrolling the window.

> [!KEY]
> If a widget can be operated with a mouse, it must be operable with a keyboard. Arrow keys, Home, End, and Enter/Space form the core of custom widget navigation.

> [!TIP]
> **To impress the interviewer:** contrast the activation models of buttons versus sliders. While native buttons activate on both Enter and Space, sliders consume directional Arrow keys, Home, End, and Page keys. Always highlight the necessity of `event.preventDefault()`: explain that neglecting to prevent default on Arrow keys causes the outer document to scroll while the slider increments, disorienting keyboard users. Finally, mention `aria-valuetext`: without it, a slider holding 3,600 seconds announces only "3600", forcing cognitive translation; `aria-valuetext="1 hour"` renders the control immediately intelligible.

### Where you will meet this

- Audio and podcast scrubbers: seeking forward and backward through investigative interviews and daily news audio dispatches.
- Video playback controls: adjusting playback speed, scrub position, and volume levels without a mouse.
- Price range filters: selecting minimum and maximum subscription or commerce price bounds with dual thumbs.
- Image comparison carousels: sliding an interactive divider to compare historical before-and-after satellite photography.
- Font scaling sliders: allowing readers with low vision to increment typography size directly using arrow keys.

### Glossary

- **Keyboard Operability**: The principle ensuring that all interactive functionality can be accessed and controlled using only a keyboard.
- **role="slider"**: An ARIA widget role defining an input where the user selects a value from within a defined numerical range.
- **aria-valuenow**: An ARIA attribute exposing the current numerical value of a range widget to assistive technologies.
- **aria-valuetext**: A human-friendly string alternative for `aria-valuenow` when the raw numeric value lacks clear meaning.
- **Keyboard Trap**: An accessibility defect where keyboard focus enters an element but cannot leave using standard navigation keys.
- **Path-Dependent Input**: Input where the physical journey of the pointer determines the result, such as drawing or handwriting.

### Summary

**Keyboard Operability and Custom Control Architecture**

Building custom interactive components with pointer event listeners alone locks out millions of keyboard-reliant users. Operating systems, alternate switches, screen readers, and motor accessibility devices all route through the keyboard interface. Whether you style a native `<input type="range">` or engineer a custom component with `role="slider"`, you must guarantee focusability, expose boundary values, and implement standardized arrow key navigation contracts. Here is your streetwise review.

❒ Native Elements Versus Custom ARIA Sliders

1. Prefer native range inputs whenever possible.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) The native range input supplies focus and full keyboard arrow behavior out of the box.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Style range tracks and thumbs with standard CSS pseudo-elements to preserve native functionality.
2. Custom sliders must implement the full ARIA specification.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Assign `role="slider"`, `tabindex="0"`, and set minimum, maximum, and current value attributes.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Provide `aria-valuetext` whenever raw numbers require units of measurement like minutes or dollars.

❒ Wiring the Keyboard Interaction Contract

1. Never ship a custom slider that only listens for pointer events.

**DO NOT DO THIS:** Attach mouse drag handlers to an un-focusable div.
```html wrong
<div class="slider-track" onmousedown="dragThumb(event)">
  <div class="thumb"></div>
</div>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Make the thumb focusable and wire keydown listeners for arrow keys.
```html right
<div class="slider-track">
  <div role="slider" tabindex="0" onkeydown="handleArrowKeys(event)" class="thumb"></div>
</div>
```
2. Never allow arrow keys to scroll the page while operating widgets.

**DO NOT DO THIS:** Update component state without preventing default browser scroll actions.
```javascript wrong
function onKeyDown(e) {
  if (e.key === 'ArrowRight') value += 5;
}
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Call preventDefault on handled keys to preserve viewport stability.
```javascript right
function onKeyDown(e) {
  if (e.key === 'ArrowRight') { e.preventDefault(); value += 5; }
}
```

➔ NEVER build interactive controls that rely exclusively on pointer or touch drag gestures.

➔ ALWAYS supply `aria-valuetext` when numeric values represent time, temperature, or currency.

➔ IF handling arrow navigation on custom widgets THEN call `event.preventDefault()` to stop unwanted page scrolling.

| | **NATIVE `<input type="range">`**<br>(browser built-in) | **CUSTOM `role="slider"`**<br>(aria pattern) |
| ---: | :--- | :--- |
| **Keyboard support** | Automatic arrow keys,<br>Home, and End | Manual JavaScript keydown<br>event listeners required |
| **Focusability** | Native tab stop in<br>document DOM order | Requires explicit<br>`tabindex="0"` on thumb |
| **Value exposure** | Native value, min, and<br>max attributes | Requires `aria-valuenow`,<br>min, and max attributes |
| **Human formatting** | Requires `aria-valuetext`<br>for time or currency | Requires `aria-valuetext`<br>for time or currency |
| **Styling complexity** | Cross-browser pseudo<br>elements required | Completely customizable<br>with modern standard CSS |
