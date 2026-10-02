# Lecture 17: Touch Targets and Spacing
> INTERVIEW QUESTION | ❱ CORE | What are the WCAG 2.2 requirements for touch target sizes and spacing?

1. Arthur opens the National Times mobile app on his smartphone to adjust his reading preferences.
2. Because Arthur has an essential hand tremor, his thumb lands with slight physical imprecision on the screen.
3. He intends to tap the "Save Settings" button, but his thumb simultaneously touches the adjacent "Cancel" link.
4. Can Arthur configure the reading drawer when critical actions sit inside cramped twenty-pixel clickable areas?
5. The interface triggers "Cancel", closes the drawer, and wipes out his custom typography adjustments.
6. Mobile designers frequently shrink interactive hit zones to achieve minimalist aesthetics, ignoring human motor biology.
7. Today we implement WCAG 2.2 target size standards, expand touch bounds with CSS, and guarantee error-free activation.

### The Physics of Touch: Why Small Targets Fail Human Hands

On a desktop computer, a physical mouse provides single-pixel pointing precision. A user manipulates a sharp hardware cursor with visual feedback down to the exact sub-pixel boundary. On mobile devices, this precision vanishes.

A human finger is not an arrow cursor; it is a soft, deformable pad measuring approximately ten to twelve millimeters across. When Arthur taps a glass screen with his thumb, the contact patch covers roughly forty to forty-eight CSS pixels. Furthermore, the finger itself physically occludes the target at the exact moment of activation, depriving the user of sightlines during contact.

When you add physical motor impairments such as hand tremors, Parkinson disease, arthritis, or cerebral palsy, activating small targets becomes an exercise in extreme frustration. Even temporary situational impairments, such as holding a smartphone with one hand while walking down stairs or riding a vibrating subway car, introduce severe motor noise. If interactive elements are rendered smaller than human touch patches and placed adjacent to one another, mis-taps are inevitable.

In WCAG 2.2, the W3C elevated target sizing from an obscure AAA advisory into a mandatory Level AA conformance standard. To prevent destructive mis-activations, developers must design hit areas that accommodate the biological reality of human hands:

```canvas title="/mobile/reading-controls — Mobile Settings Drawer"
url=https://nationaltimes.com/mobile/reading-controls
masthead | The National Times | mobile | search
h2 | Reading Preferences Drawer | landmark=region
text | Adjust font scaling and line height for mobile reading comfort.
button | Font Size Decrease (A-) | text="14px"
button | Font Size Increase (A+) | text="18px"
button | Save Preferences | focus=1 | sr="Save Preferences, button"
link | Cancel | wrong | text="16px link touching adjacent Save button"
sr | "Save Preferences, button. Warning: adjacent target within 4px." | label="Target Size Audit"
contrast | #0f172a on #ffffff | 16.2:1 pass
kbd | Tap or Click Target
```

Here is the fragile CSS that ruined Arthur's experience in the reading controls drawer:

```css title="cramped-drawer.css"
.drawer-footer {
  display: flex;
  align-items: center;
  gap: 4px; /* **WRONG:** four-pixel spacing violates the minimum target separation **RADIUS** */
}

.cancel-link {
  font-size: 13px;
  line-height: 16px; /* **WRONG:** sixteen-pixel height creates an undersized clickable **TARGET** */
  padding: 0; /* **WRONG:** absence of padding leaves hit area constricted to **TEXT** */
}

.save-button {
  height: 32px;
  padding: 0 12px;
}
```

Because the "Cancel" link measured only 16 pixels high and sat 4 pixels from the "Save" button, Arthur's thumb pad covered both elements simultaneously. The browser hit detection resolved the link, discarding his reading settings.

### The WCAG 2.2 Target Size Hierarchy: 2.5.8 Versus 2.5.5

WCAG organizes target sizing across two progressive success criteria:

1. **WCAG 2.5.8 Target Size (Minimum, Level AA).** Added in WCAG 2.2, this criterion mandates that interactive targets measure at least **24 by 24 CSS pixels**, or provide sufficient spacing clearance.

The W3C Understanding documentation explains the intent and scope of this Level AA baseline:

> The intent of this success criterion is to help ensure targets can be easily activated without accidentally activating an adjacent target. Users with dexterity limitations and those who have difficulty with fine motor movement find it difficult to accurately activate small targets when there are other targets that are too close. Providing sufficient size, or sufficient spacing between targets, will reduce the likelihood of accidentally activating the wrong control.
*W3C, Understanding WCAG 2.2: Target Size (Minimum), `resources/accessibility/wcag/understanding/22/target-size-minimum.html`*

2. **WCAG 2.5.5 Target Size (Enhanced, Level AAA).** Introduced in WCAG 2.1, this criterion establishes the gold standard for touchscreen usability: interactive targets must measure at least **44 by 44 CSS pixels**.

The W3C Understanding documentation underscores the fundamental mechanical challenge of touchscreens:

> Touch is particularly problematic as it is an input mechanism with coarse precision. Users lack the same level of fine control as on inputs such as a mouse or stylus. A finger is larger than a mouse pointer, and generally obstructs the user's view of the precise location on the screen that is being touched/activated.
*W3C, Understanding WCAG 2.2: Target Size (Enhanced), `resources/accessibility/wcag/understanding/21/target-size-enhanced.html`*

Major platform vendors align with this 44-pixel standard: Apple iOS Human Interface Guidelines require a minimum 44 by 44 point hit area, while Google Android Material Design recommends 48 by 48 density-independent pixels.

### The Five Normative Exceptions in Criterion 2.5.8

Understanding Criterion 2.5.8 requires mastering its five explicit exceptions:

1. **The Spacing Exception.** If a target is smaller than 24 by 24 CSS pixels, it still passes if an imaginary **24-pixel diameter circle** centered on its bounding box does not intersect another target or the 24-pixel circle of an adjacent undersized target. If a button is 20 by 20 pixels, it passes provided it maintains at least 4 pixels of clear margin from adjacent interactive controls.

2. **The Inline Exception.** Targets embedded within sentences or blocks of text (such as footnote superscripts or hypertext links in an article paragraph) are exempt. Imposing 24px vertical height on inline links would force unnatural line-spacing breaks that destroy reading flow.

3. **The Equivalent Exception.** If an undersized control has an equivalent control on the same screen that meets the 24px target size, the undersized control is exempt.

4. **The User Agent Exception.** Unstyled, native browser controls (such as the drop-down arrows of native `<select>` elements or default date picker steppers) are exempt if the author has not overridden their dimensions.

5. **The Essential Exception.** Targets where a specific size or dense spatial clustering is fundamental to the information conveyed (such as pins on an interactive geographic map or dense points on a data chart) are exempt.

### Production CSS Techniques: Invisible Hit Area Expansion

Designers often push back against touch target sizing, claiming that 44px buttons ruin compact desktop interfaces. Skilled frontend engineers resolve this tension by separating the **visual size** of an element from its **interactive hit area**.

You do not need to make icons visually enormous to make them accessible. You expand their clickable bounding box using CSS padding or pseudo-elements:

```css title="accessible-targets.css"
/* APPROACH 1: Visual compactness with expanded touch area via padding */
.icon-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px; /* **RIGHT:** guarantees WCAG 2.5.5 Level AAA touch target **SIZE** */
  min-height: 44px;
  padding: 10px; /* **RIGHT:** hit area is 44px while interior icon remains 24px **GRAPHIC** */
  background: transparent;
  border: none;
}

/* APPROACH 2: The absolute pseudo-element hit expander for tight text links */
.drawer-cancel-link {
  position: relative;
  display: inline-block;
  font-size: 0.875rem;
  color: #475569;
  text-decoration: underline;
}

.drawer-cancel-link::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 44px; /* **RIGHT:** invisible pseudo-element captures touch **EVENTS** */
  min-height: 44px;
  width: 100%;
  height: 100%;
}
```

By leveraging `::after` with absolute centering, the visible text link remains visually delicate and aligned with typography, but the touch sensor captures thumb taps across a full 44 by 44 CSS pixel square.

### Modern Svelte 5 Implementation of the Reading Drawer

Here is the complete, accessible Svelte 5 component for the National Times reading drawer, engineered with fluid spacing, minimum target sizes, and focus traps:

```svelte title="ReadingSettingsDrawer.svelte"
<script>
  let { isOpen = $bindable(false), onsave } = $props();
  let fontSize = $state(16);

  function saveAndClose() {
    onsave?.({ fontSize });
    isOpen = false; // **RIGHT:** commits user choices and dismisses **DRAWER**
  }
</script>

{#if isOpen}
  <div class="drawer-scrim" onclick={() => (isOpen = false)}></div>
  <aside class="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <h2 id="drawer-title">Reading Preferences</h2>

    <div class="control-row">
      <span class="label">Font Size ({fontSize}px)</span>
      <div class="stepper-group">
        <button
          type="button"
          class="target-btn"
          onclick={() => fontSize = Math.max(12, fontSize - 2)}
          aria-label="Decrease font size"
        >
          A-
        </button>
        <button
          type="button"
          class="target-btn"
          onclick={() => fontSize = Math.min(24, fontSize + 2)}
          aria-label="Increase font size"
        >
          A+
        </button>
      </div>
    </div>

    <div class="drawer-actions">
      <button type="button" class="cancel-link-btn" onclick={() => (isOpen = false)}>
        Cancel
      </button>
      <button type="button" class="primary-save-btn" onclick={saveAndClose}>
        Save Preferences
      </button>
    </div>
  </aside>
{/if}

<style>
  .settings-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    padding: 1.5rem;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  }

  .stepper-group, .drawer-actions {
    display: flex;
    align-items: center;
    gap: 12px; /* **RIGHT:** twelve-pixel spacing exceeds 2.5.8 circle overlap **THRESHOLD** */
  }

  .target-btn {
    min-width: 44px; /* **RIGHT:** satisfies WCAG 2.5.5 44px touch target **RECOMMENDATION** */
    min-height: 44px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #f8fafc;
  }

  .cancel-link-btn {
    position: relative;
    min-height: 44px;
    padding: 0 12px;
    background: transparent;
    border: none;
    color: #64748b;
    text-decoration: underline;
  }

  .primary-save-btn {
    min-height: 44px;
    padding: 0 20px;
    background: #0284c7;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-weight: 600;
  }
</style>
```

In this implementation, both the "Cancel" and "Save" controls meet the 44px minimum height requirement, separated by a 12px CSS flexbox gap. Arthur can tap the screen with his thumb without risking accidental cancellation.

> [!KEY]
> WCAG 2.2 Criterion 2.5.8 mandates a 24x24px minimum target or non-overlapping spacing circle at Level AA, while Criterion 2.5.5 recommends 44x44px at Level AAA.

> [!TIP]
> **To impress the interviewer:** explain that target size is a dual-variable equation: dimensions AND spacing. Walk through the mathematics of the WCAG 2.2 Criterion 2.5.8 Spacing Exception: an undersized 18px target can still conform to Level AA if a 24px diameter circle centered on its bounding box does not intersect any adjacent target or neighboring circle. Contrast this with WCAG 2.5.5 (Level AAA), which strictly demands a 44x44px target size without spacing offsets. Conclude by demonstrating how CSS pseudo-elements (`::after`) allow developers to satisfy mobile ergonomics without disrupting visual design hierarchy.

### Where you will meet this

- Mobile navigation drawers: ensuring close buttons and navigation links maintain 44px hit areas.
- Audio and video media players: expanding play, pause, and scrubber buttons so thumbs do not miss controls.
- E-commerce cart tables: providing generous touch padding on item quantity increments and delete trash-can icons.
- Pagination controls: separating numerical page buttons with sufficient gap to prevent jumping to the wrong page.
- Floating action buttons: anchoring bottom-screen mobile shortcuts with generous 48px target footprints.

### Glossary

- **Target Size (Minimum, WCAG 2.5.8)**: A WCAG 2.2 Level AA requirement that interactive targets measure at least 24 by 24 CSS pixels or maintain non-overlapping clearance circles.
- **Target Size (Enhanced, WCAG 2.5.5)**: A WCAG Level AAA requirement recommending interactive controls measure at least 44 by 44 CSS pixels for touchscreen usability.
- **Bounding Box**: The smallest rectangle completely enclosing an interactive element used to calculate target dimensions and centers.
- **Spacing Exception**: A WCAG 2.5.8 provision allowing undersized controls if an imaginary 24px diameter circle centered on the target does not collide with neighboring elements.
- **Coarse Pointer**: An input device characterized by low spatial precision and contact occlusion, such as a finger on a mobile touchscreen.
- **Hit Area Expansion**: A CSS technique using padding or absolute pseudo-elements to expand an element's clickable surface without altering visible dimensions.

### Summary

**Touch Target Sizing and Spacing Architecture**

In modern web development, coarse touchscreen inputs dominate user interactions. Designing tiny clickable targets placed tightly together creates catastrophic accessibility barriers for users with motor tremors, elderly readers, and anyone using a smartphone on the go. WCAG 2.2 addresses this by enforcing minimum 24px targets and spacing rules at Level AA, while platform guidelines and Level AAA demand 44px. Expand your touch boundaries with CSS, space adjacent controls generously, and eliminate destructive mis-taps. Here is your streetwise review.

❒ The Architectural Division Between Level AA and Level AAA Targets

1. WCAG 2.5.8 Target Size (Minimum) operates at Level AA.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Introduces a mandatory 24 by 24 CSS pixel baseline in WCAG 2.2.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Features a spacing exception allowing smaller targets if 24px centered clearance circles do not intersect.
2. WCAG 2.5.5 Target Size (Enhanced) operates at Level AAA.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Mandates a generous 44 by 44 CSS pixel target area matching Apple and Google mobile benchmarks.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Contains no spacing loophole; targets must meet the full 44px dimensional footprint.

❒ The Developer's Levers

1. Never place compact interactive controls tightly side by side.

**DO NOT DO THIS:** Jam small icon links together with minimal 2px margins.
```css wrong
.icon-bar a { width: 18px; height: 18px; margin: 2px; }
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Guarantee at least 24px bounding dimensions with comfortable separation.
```css right
.icon-bar a { min-width: 24px; min-height: 24px; margin: 6px; }
```
2. Never shrink button hit areas down to raw font bounding boxes.

**DO NOT DO THIS:** Remove padding on text buttons, collapsing the hit area to 14px.
```css wrong
.text-btn { padding: 0; font-size: 14px; line-height: 14px; }
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Expand the clickable bounding box with padding or invisible pseudo-elements.
```css right
.text-btn { min-height: 44px; padding: 12px 16px; display: inline-flex; align-items: center; }
```

➔ NEVER design primary mobile touch targets smaller than 24 by 24 CSS pixels.

➔ ALWAYS separate adjacent touch controls with at least 8 to 12 pixels of CSS gap.

➔ IF an icon must visually render small THEN expand its interactive touch area using pseudo-elements.

| | **MINIMUM (WCAG 2.5.8)**<br>(level aa standard) | **ENHANCED (WCAG 2.5.5)**<br>(level aaa standard) |
| ---: | :--- | :--- |
| **Minimum size** | 24 by 24 CSS pixels<br>baseline dimension | 44 by 44 CSS pixels<br>enhanced dimension |
| **Spacing exception** | Allowed if 24px diameter<br>circles do not collide | Not permitted; element<br>must measure 44px |
| **Normative tier** | WCAG 2.2 Level AA<br>legal baseline | WCAG 2.1 Level AAA<br>advisory target |
| **Inline text links** | Exempt inside body<br>prose paragraphs | Exempt inside body<br>prose paragraphs |
| **Recommended use** | Compact desktop toolbars<br>and secondary actions | Mobile primary buttons<br>and touch dialogs |
