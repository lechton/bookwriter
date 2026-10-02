# Lecture 16: Vestibular Triggers and Motion
> INTERVIEW QUESTION | ❱ CORE | How do you handle vestibular triggers and respect user preferences for reduced motion?

1. Liam opens the National Times severe storm package to check the approaching squall line on the interactive weather radar.
2. As Liam scrolls downward, the page fires rapid parallax animations, spinning isobar spirals and sweeping radar beams across the screen.
3. Can Liam read the emergency flood alert when aggressive motion triggers acute vertigo and inner ear disorientation?
4. He experiences an immediate sensation of falling backward, grips his desk in nausea, and shuts the laptop lid.
5. The engineering team built high-intensity visual animations to excite readers, unaware that screen movement can induce physical illness.
6. Today we respect operating system motion preferences, neutralize vestibular triggers, and provide persistent user controls for continuous animation.

### The Biological Reality: Why On-Screen Motion Induces Physical Nausea

The human inner ear houses the vestibular system, a delicate network of fluid-filled canals and sensory receptors that detect head movement, acceleration, and balance. Under normal conditions, your eyes and your inner ear report harmonious data to your brain: when you sit stationary at a wooden desk, both your retina and your vestibular canals report zero physical motion.

When a webpage introduces aggressive movement across large portions of the screen, this equilibrium shatters. Rapid parallax scrolling, spinning loaders, zoom transitions, and autoplays create a severe neurological sensory conflict. Your eyes tell your brain that you are violently plunging forward, rotating, or accelerating through space, while your inner ear insists your body is perfectly stationary.

This sensory mismatch triggers profound biological distress known as a vestibular disorder reaction. Symptoms include immediate vertigo, cold sweats, optical migraines, acute nausea, and loss of physical balance. For millions of people with conditions such as labyrinthitis, Meniere disease, or traumatic brain injury, visiting a page with unconstrained motion is not an aesthetic irritation. It is an incapacitating physical event that frequently mandates bed rest to recover.

To protect readers from physical injury, web accessibility engineering provides two foundational layers of defense: querying operating system preferences via the reduced-motion media query, and providing explicit on-screen pause controls for continuous animation:

```canvas title="/interactive/weather-radar — Autoplaying Radar Animation"
url=https://nationaltimes.com/interactive/weather-radar
masthead | The National Times | interactive | search
nav | Storm Tracker; Live Doppler; Regional Warnings | landmark=navigation
h1 | Live Interactive Doppler: Severe Storm Watch
card | Doppler Radar Loop | type=card | title="Active Cloud Animation" | text="Autoplaying Doppler sequence cycling every 800ms across screen"
button | Pause Radar Animation | focus=1 | sr="Pause Radar Animation, button"
text | Motion preferences detected: prefers-reduced-motion: reduce.
sr | "Active Doppler storm tracker. Press Pause to halt movement." | label="Vestibular Safety Active"
contrast | #0f172a on #ffffff | 16.2:1 pass
kbd | Space to Pause Doppler Animation
```

Here is the unrestricted CSS that triggered Liam's vestibular trauma on the weather radar page:

```css title="unconstrained-radar.css"
.radar-sweep {
  animation: sweep 800ms linear infinite; /* **WRONG:** rapid continuous spinning causes acute vestibular **VERTIGO** */
}

.parallax-cloud-layer {
  transform: translateY(calc(var(--scroll-y) * 1.8)); /* **WRONG:** multi-speed scroll creates intense visual **MISMATCH** */
  transition: transform 120ms cubic-bezier(0.2, 0.9, 0.3, 1);
}

@keyframes sweep {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

When Liam opened this page, the radar swept at high velocity while cloud layers drifted at diverging speeds. His brain registered chaotic physical acceleration, producing sudden nausea.

### The Regulatory Framework: Criterion 2.2.2 Versus Criterion 2.3.3

Web Content Accessibility Guidelines govern motion through two distinct success criteria operating at different conformance tiers:

1. **WCAG 2.2.2 Pause, Stop, Hide (Level A).** This criterion applies to content that starts automatically, lasts longer than five seconds, and runs in parallel with other text or content. News tickers, background video banners, and looping weather radar animations fall squarely under this rule. The site must provide a visible mechanism for the user to pause, stop, or hide the motion.

The W3C Understanding documentation explains the rationale behind the five-second threshold:

> Moving content can also be a severe distraction for some people. Certain groups, particularly those with attention deficit disorders, find blinking content distracting, making it difficult for them to concentrate on other parts of the web page. Five seconds was chosen because it is long enough to get a user's attention, but not so long that a user cannot wait out the distraction if necessary to use the page.
*W3C, Understanding WCAG 2.2: Pause, Stop, Hide, `resources/accessibility/wcag/understanding/20/pause-stop-hide.html`*

2. **WCAG 2.3.3 Animation from Interactions (Level AAA).** This criterion addresses motion triggered directly by user actions, such as scrolling a page, dragging an interactive slider, or clicking a navigation link. Parallax scrolling and page-flip transitions belong to this tier. Content must allow interaction animations to be disabled unless the animation is strictly essential to conveying the information.

The W3C Understanding document details the physical hazard of interaction motion:

> The intent of this success criterion is to allow users to prevent animation from being displayed on web pages. Some users experience distraction or nausea from animated content. For example, if scrolling a page causes elements to move (other than the essential movement associated with scrolling) it can trigger vestibular disorders. Vestibular (inner ear) disorder reactions include dizziness, nausea and headaches. Another animation that is often non-essential is parallax scrolling. Parallax scrolling occurs when backgrounds move at a different rate to foregrounds. Animation that is essential to the functionality or information of a web page is allowed by this success criterion.
*W3C, Understanding WCAG 2.2: Animation from Interactions, `resources/accessibility/wcag/understanding/21/animation-from-interactions.html`*

Notice the critical distinction: Criterion 2.2.2 is Level A and targets automatic background loops. Criterion 2.3.3 is Level AAA and targets interaction-driven movement like parallax scrolling. Both standards aim to prevent physical disorientation.

### The Defensive CSS Standard: prefers-reduced-motion

Modern operating systems (macOS, iOS, Windows, Android, and Linux) include an accessibility setting labeled "Reduce Motion." When a user enables this setting, browsers expose that preference to web applications through the CSS media query `@media (prefers-reduced-motion: reduce)`.

Many developers naively attempt to satisfy this requirement with a brute-force universal reset:

```css title="naive-reset.css"
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important; /* **WRONG:** breaks JavaScript animation end listeners and collapses **LAYOUTS** */
    transition: none !important;
  }
}
```

This universal reset is dangerous in production. Setting `animation: none !important` breaks JavaScript components that listen for `animationend` or `transitionend` events to unmount modals or advance steps. The promise never resolves, and the interface freezes.

The battle-tested production approach zeroes animation durations while preserving lifecycle timing and substituting subtle opacity cross-fades for disorienting spatial movement:

```css title="safe-reduced-motion.css"
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important; /* **RIGHT:** completes instantly without breaking JavaScript **LIFECYCLE** */
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important; /* **RIGHT:** disables smooth scrolling and jumps cleanly to **TARGET** */
  }

  /* Replace disorienting spatial motion with calm opacity transitions */
  .radar-sweep {
    animation: none !important;
    opacity: 0.75; /* **RIGHT:** displays static data overlay without spinning **VERTIGO** */
  }

  .parallax-cloud-layer {
    transform: none !important; /* **RIGHT:** locks background layer to natural page **SCROLL** */
  }
}
```

By substituting static visual overlays for spinning vectors and locking parallax layers to standard scroll positions, the application remains fully informative without triggering vestibular reactions.

### Programmatic Control in JavaScript and Svelte 5

CSS media queries cover stylesheet transitions, but complex interactive visualizations (Canvas charts, WebGL maps, and SVG weather radars) execute in JavaScript. Frontend engineers must query operating system preferences programmatically using `window.matchMedia` while also providing a visible, in-page pause button that satisfies WCAG 2.2.2 Level A.

Here is an accessible Svelte 5 component implementing the National Times Doppler weather tracker:

```svelte title="WeatherRadar.svelte"
<script>
  let isPlaying = $state(false); // **RIGHT:** defaults to paused when reduced motion is **PREFERRED**
  let radarContainer = $state();

  $effect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isPlaying = !motionQuery.matches; // **RIGHT:** reads OS setting on component mount **CYCLE**

    const handleChange = (e) => {
      isPlaying = !e.matches; // **RIGHT:** responds dynamically if user toggles system **SETTINGS**
    };
    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  });

  function toggleAnimation() {
    isPlaying = !isPlaying; // **RIGHT:** satisfies WCAG 2.2.2 by providing manual pause **CONTROL**
  }
</script>

<div class="radar-card" bind:this={radarContainer}>
  <div class="radar-viewport">
    <div class="radar-map-base"></div>
    <div class="doppler-overlay" class:is-active={isPlaying}></div>
  </div>

  <div class="radar-controls">
    <button
      type="button"
      class="control-btn"
      onclick={toggleAnimation}
      aria-pressed={!isPlaying}
    >
      {isPlaying ? 'Pause Radar Loop' : 'Play Radar Loop'}
    </button>
  </div>
</div>

<style>
  .doppler-overlay.is-active {
    animation: pulse-echo 1.2s ease-in-out infinite;
  }

  @keyframes pulse-echo {
    0% { transform: scale(0.95); opacity: 0.3; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(0.95); opacity: 0.3; }
  }

  @media (prefers-reduced-motion: reduce) {
    .doppler-overlay.is-active {
      animation: none;
      opacity: 0.6; /* **RIGHT:** renders clear static heat map without pulsing **ACCELERATION** */
    }
  }
</style>
```

This implementation adheres to both layers of accessibility architecture:
1. It listens to the operating system preference on load and responds dynamically if the user updates system settings.
2. It provides an explicit toggle button equipped with an `aria-pressed` state attribute, allowing any user to halt background looping regardless of system-level settings.

> [!KEY]
> Respecting `prefers-reduced-motion` protects users from vestibular illness, while providing an in-page pause button ensures Level A compliance under WCAG 2.2.2.

> [!TIP]
> **To impress the interviewer:** distinguish between vestibular triggers (motion sickness and vertigo caused by sensory conflicts between the eye and inner ear) and seizure triggers (flashing content faster than 3 times per second under WCAG 2.3.1). Explain why parallax scrolling is dangerous: the diverging speed of background and foreground planes tricks the brain into perceiving physical motion while seated. Then outline the dual engineering response: use CSS `@media (prefers-reduced-motion: reduce)` to cancel non-essential movement and smooth scrolling, but never use `* { animation: none !important; }` because it breaks JavaScript animation lifecycle events. Finish by pointing out that WCAG 2.2.2 requires an on-page pause mechanism for loops over five seconds even if the user has not set an OS-level preference.

### Where you will meet this

- Interactive weather radars: providing a prominent pause button so meteorology loops do not trigger dizziness.
- Long-form investigative packages: turning off multi-layer parallax scrolling when readers enable reduced motion.
- Single-page application navigation: replacing disorienting screen slide transitions with simple opacity cross-fades.
- Promotional marketing landing pages: disabling continuous autoplaying background video reels for readers with cognitive fatigue.
- Modal dialog animations: eliminating zoom-in spring physics and opening overlays directly in place.

### Glossary

- **Vestibular Disorder**: A medical impairment of the inner ear balance mechanism that causes acute dizziness, vertigo, and nausea when exposed to visual screen motion.
- **prefers-reduced-motion**: A CSS media feature and browser API that detects whether the user has requested the operating system to minimize non-essential animation.
- **Parallax Scrolling**: A web design technique where background images move at a different speed than foreground content during scrolling, frequently triggering vestibular reactions.
- **Pause, Stop, Hide (WCAG 2.2.2)**: A Level A requirement mandating that any moving, blinking, or scrolling content lasting longer than five seconds can be paused by the user.
- **Animation from Interactions (WCAG 2.3.3)**: A Level AAA requirement stating that motion animation triggered by user interaction must be suppressible unless essential.
- **Sensory Conflict**: The neurological mismatch occurring when visual inputs report acceleration while the vestibular inner ear receptors report a stationary physical state.

### Summary

**Vestibular Safety and Motion Control Engineering**

In production frontend engineering, animation is not purely decorative styling; when mismanaged, movement acts as a physical health hazard. Visual acceleration on screen conflicting with a stationary body triggers severe vestibular illness, vertigo, and nausea. Professional web engineering requires neutralizing non-essential motion through operating system media queries and providing explicit pause controls for continuous loops. Here is your streetwise review.

❒ The Architectural Division Between Interaction and Continuous Motion

1. Interaction-triggered animations fall under WCAG 2.3.3 (Level AAA).<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Governs motion initiated by user action, including parallax scrolling, zoom transforms, and page transitions.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Must respect `@media (prefers-reduced-motion: reduce)` by disabling movement or substituting opacity fades.
2. Continuous automatic animations fall under WCAG 2.2.2 (Level A).<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Governs animations that start automatically, run longer than five seconds, and coexist with text.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Requires an explicit, keyboard-accessible on-screen control to pause, stop, or hide the animation.

❒ The Developer's Levers

1. Never use aggressive spatial translations when reduced motion is active.

**DO NOT DO THIS:** Force multi-plane parallax movement on users who requested reduced motion.
```css wrong
.hero-parallax { transform: translateY(calc(var(--scroll) * 2)); }
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Lock layers to standard scrolling coordinates inside the media query.
```css right
@media (prefers-reduced-motion: reduce) { .hero-parallax { transform: none; } }
```
2. Never employ universal brute-force animation resets that break JavaScript promises.

**DO NOT DO THIS:** Kill all animations with `animation: none !important` and freeze lifecycle listeners.
```css wrong
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Reduce durations to near zero so events fire normally without visual motion.
```css right
@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }
```

➔ NEVER allow auto-playing animations to loop indefinitely without an explicit pause button.

➔ ALWAYS test web applications with the operating system "Reduce Motion" setting enabled.

➔ IF an animation is strictly decorative THEN eliminate spatial movement entirely for motion-sensitive users.

| | **PREFERS-REDUCED-MOTION**<br>(system preference) | **IN-PAGE PAUSE CONTROL**<br>(manual override) |
| ---: | :--- | :--- |
| **Trigger mechanism** | Operating system setting<br>passed through browser | Interactive button element<br>in user interface |
| **WCAG standard** | Criterion 2.3.3<br>(Level AAA interaction) | Criterion 2.2.2<br>(Level A loop control) |
| **Primary purpose** | Eliminates vestibular<br>nausea and vertigo | Stops reading distraction<br>and cognitive overload |
| **Technical layer** | CSS media query and<br>`matchMedia` listener | Svelte or JS state toggling<br>a pause class or loop |
| **Target content** | Parallax scroll, zoom,<br>and page transitions | Continuous radars, tickers,<br>and looping video reels |
