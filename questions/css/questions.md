# CSS Interview Questions (DRAFT — under review)

A unified, dependency-ordered curriculum of **63 questions**: CSS Review (1–34), BEM with LESS and SASS (35–46), and Responsive + Accessible + Cross-Browser CSS (47–63). One continuous numbering scale, sections stacked one under the other, so any question can be cited by its number (e.g., "write the lecture for Q13"). Status: DRAFT for joint review; numbers freeze on approval.

## Format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|

- **#** — Stable unique ID. Continuous 1–63. Cite any question by number.
- **Tier** — `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth.
- **Topic** — One hashtag from `topics.md` (controlled vocabulary). One primary tag per question.
- **Question** — Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook** — Pain-point framing. Becomes the seed of the lecture's Opening Ladder.

## Reading paths

- **Pure newcomer:** Read ❱ CORE in order, all three parts.
- **Working developer:** Finish ❱ CORE, then dip into ❱❱ MORE by topic as your work demands.
- **Interview prep:** Skim ❱ CORE, drill ❱❱❱ ADVANCED.

---

# PART ONE — CSS REVIEW (Q1–Q34)

## ❱ CORE — The Cascade and the Box (Q1–Q14)
The minimum path to understanding how the browser decides what a page looks like: who wins when rules fight, how every element is measured, and how spacing between boxes actually behaves.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 1 | ❱ CORE | `#cascade` | How does the CSS cascade resolve conflicts when multiple rules target the same element? | Two theme files both set the subscribe button color; the wrong one wins, nobody can say why, and the redesign ships with the old brand blue. |
| 2 | ❱ CORE | `#specificity` | How is specificity calculated, and why is `!important` considered an architectural anti-pattern? | A theme file styles the paywall with an ID selector, so every later fix adds another ID, until the team ships a selector with four IDs and an `!important` just to change a link color. |
| 3 | ❱ CORE | `#inheritance` | What is the difference between `inherit`, `initial`, `unset`, and `revert` when resetting properties? | The dark-mode override sets white text on the footer container, the white footer ships, and every footer link vanishes into the background. |
| 4 | ❱ CORE | `#box_model` | Why does `box-sizing: border-box` change the geometry of layout mathematics? | Two 50% story columns get 16px of padding, the row overflows by 64 pixels, and the second column falls onto the next line five minutes before the front page goes live. |
| 5 | ❱ CORE | `#margin_collapsing` | Why do adjoining vertical margins collapse into a single gap, and when does this behavior stop? | The editor adds `margin-top` to every headline and `margin-bottom` to every paragraph to be safe; the gaps between article blocks come out at one margin instead of the sum, and the designer swears the spacing is being ignored. |
| 6 | ❱ CORE | `#display` | How do block, inline, and inline-block roles change how an element interacts with flow layout? | A junior developer sets width, height, and vertical padding on a `<span>` badge and stares at the screen as the browser calmly ignores all three. |
| 7 | ❱ CORE | `#positioning` | What distinguishes relative, absolute, fixed, and sticky positioning from normal static flow? | A tooltip styled `position: absolute` appears glued to the top of the whole page instead of its button, because nobody positioned an ancestor. |
| 8 | ❱ CORE | `#stacking_context` | Why does a high `z-index` sometimes fail to bring an element to the front? | The modal gets `z-index: 9999` and still slides under the sticky masthead, because a `transform` on an ancestor silently created a new stacking context. |
| 9 | ❱ CORE | `#floats_clearing` | Why does a parent container collapse to zero height when its children are floated? | The editor floats three photo thumbnails in a teaser box and the box's background disappears completely: the parent now has zero height. |
| 10 | ❱ CORE | `#formatting_contexts` | What layout problems are solved by establishing a new block formatting context? | The teaser box's background vanishes behind its floated thumbnails and the card's headline margin escapes onto the page; one `display: flow-root` on the parent fixes both, and nobody on the team can explain why. |
| 11 | ❱ CORE | `#units` | How do you choose between `px`, `rem`, `em`, and viewport units for typography and spacing? | Nested `em` font sizes compound down the opinion section's nested lists, and the third-level quote renders at half the intended size. |
| 12 | ❱ CORE | `#colors` | How do modern color functions like `oklch` and `color-mix()` solve the limitations of hex and RGB? | The art director asks for "the same headline blue, twenty percent lighter": impossible to compute in hex, a one-digit change in hsl. |
| 13 | ❱ CORE | `#typography` | How does multi-line text truncation work in modern CSS? | The homepage teaser must clamp to exactly three lines with an ellipsis, and the intern discovers that `text-overflow: ellipsis` alone does nothing on multi-line text. |
| 14 | ❱ CORE | `#selectors` | Why does the browser evaluate CSS selectors from right to left, and how does this impact performance? | The stylesheet is full of `.sidebar ul li a` chains; the sidebar markup gains one wrapper `<div>` and every rule silently stops matching. |

## ❱ CORE — Layout (Q15–Q20)
The two layout engines every interview leads with, taught as coordinate systems and track arithmetic, not property lists.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 15 | ❱ CORE | `#flexbox` | How do `justify-content` and `align-items` operate differently across the flexbox main and cross axes? | A developer centers the login card with `justify-content: center`, resizes the window, and watches the card stay glued to the top: he aligned the wrong axis. |
| 16 | ❱ CORE | `#flex_items` | How does the `flex` shorthand distribute available free space among siblings? | Three breaking-news cards get `flex: 1`, `flex: auto`, and `flex: 0 200px`; they render at three different widths and nobody on the team can explain the arithmetic. |
| 17 | ❱ CORE | `#grid` | When is CSS Grid structurally superior to Flexbox for two-dimensional layouts? | A flexbox card grid looks perfect until the last row holds a single card, which stretches to the full width of the page like a banner ad nobody ordered. |
| 18 | ❱ CORE | `#grid_placement` | How does explicit grid placement differ from the browser's auto-placement algorithm? | The election-night dashboard must pin the live map across two columns and push the results ticker below it, and the developer discovers items placed by line number do not move when the grid changes. |
| 19 | ❱ CORE | `#center_element` | What are the two most robust ways to center an element in modern CSS? | The interview classic: the candidate names margin auto, text-align, absolute positioning, transforms, flexbox, and grid, and the interviewer asks which two are actually safe in 2026 and why. |
| 20 | ❱ CORE | `#math_functions` | How do `min()`, `max()`, and `clamp()` reduce the need for media queries in responsive design? | The opinion column must be 60ch wide but never wider than the screen and never narrower than 320px, and one line of CSS replaces three media queries. |

## ❱❱ MORE — Mechanics and Modern CSS (Q21–Q33)
The mechanisms that separate developers who write CSS from developers who debug it.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 21 | ❱❱ MORE | `#pseudo` | What is the architectural difference between pseudo-classes and pseudo-elements? | The checkout form needs a red asterisk on every required label, and the developer pastes `<span class="req">*</span>` into forty templates instead of writing one `::after` rule. |
| 22 | ❱❱ MORE | `#transitions_animations` | Why is animating `transform` drastically cheaper for the browser than animating `margin` or `width`? | The new expandable search bar animates its `width`, the front page janks at twelve frames per second, and switching the same effect to `transform` makes it run at sixty. |
| 23 | ❱❱ MORE | `#transforms` | How do transform functions alter the coordinate space without triggering layout recalculations? | A hover lift effect on story cards moves them with `top: -4px`, triggering a layout recalculation on every card of a 200-card archive page. |
| 24 | ❱❱ MORE | `#custom_properties` | How do CSS custom properties enable runtime theming that preprocessor variables cannot? | Dark mode ships as a second compiled stylesheet with 400 duplicated rules, until someone deletes it all and toggles one class that flips twelve `var()` values at runtime. |
| 25 | ❱❱ MORE | `#backgrounds` | When should you use `background-size: cover` versus `contain` for art direction? | The marketing hero uses `background-size: cover`, and on every phone the photo crops exactly through the mayor's face. |
| 26 | ❱❱ MORE | `#overflow` | Why does setting `width: 100vw` often introduce unwanted horizontal scrollbars? | A full-bleed breaking banner set to `100vw` makes the whole front page wobble sideways by exactly the width of the vertical scrollbar. |
| 27 | ❱❱ MORE | `#scroll_snapping` | How do CSS scroll snapping and `overscroll-behavior` create native app-like scroll interactions? | The horizontal photo gallery stops halfway between two images, and the user has to manually nudge it to see the full picture. |
| 28 | ❱❱ MORE | `#modern_selectors` | How do the `:is()`, `:where()`, and `:has()` pseudo-classes manipulate specificity and state? | The card needs a border only when it contains an image; the team is about to add a `.card--with-image` modifier in the CMS when someone writes one `:has()` rule instead. |
| 29 | ❱❱ MORE | `#hiding_content` | How do you hide an element visually while keeping it fully accessible to screen readers? | The redesign hides the ad disclosure with `display: none` and the accessibility review flags it as gone for everyone; the visually-hidden pattern keeps the layout pixel-identical while the screen reader still reads it. |
| 30 | ❱❱ MORE | `#intrinsic_sizing` | What is the practical difference between `width: auto` and `width: 100%` in a fluid layout? | The byline badge must hug its longest word without wrapping; `width: 100%` stretches it across the column and `width: auto` does the same inside the grid track, until `width: fit-content` achieves in one declaration what three hacks could not. |
| 31 | ❱❱ MORE | `#subgrid` | What layout problem does `subgrid` solve for complex, nested grid items? | Three story cards must align their headline, image, and byline rows across the home page grid; nested grids drift apart with every font change until `grid-template-rows: subgrid` lets the cards borrow the parent's tracks. |
| 32 | ❱❱ MORE | `#popover_api` | What problem does the native Popover API solve that `z-index` and absolute positioning could not? | A custom dropdown menu gets trapped inside an `overflow: hidden` card, and no amount of `z-index` can bring it to the top layer. |
| 33 | ❱❱ MORE | `#anchor_positioning` | How does anchor positioning eliminate the need for JavaScript when building tooltips? | The tooltip needs to sit exactly 10px below its button, but absolute positioning forces you to relative-position the parent, breaking the layout flow. |

## ❱❱❱ ADVANCED — The New Cascade (Q34)

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 34 | ❱❱❱ ADVANCED | `#nesting_layers` | How do native CSS nesting, `@layer`, and `@scope` change the way we manage specificity? | The design system, the theme, and the newspaper's page styles fight in one stylesheet; declaring `@layer base, components, pages` up front ends the specificity war without a single `!important`. |

---

# PART TWO — ARCHITECTURE AND PREPROCESSORS (Q35–Q46)

## ❱ CORE — Naming and Methodology (Q35–Q38)
Why large teams cannot survive on "just write CSS", and the naming grammar that fixes it.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 35 | ❱ CORE | `#methodology_why` | Why do large engineering teams mandate CSS naming architectures instead of trusting the cascade? | The rebrand asks for every red element to become blue; the class `.red` is on 400 elements, so the team either edits 400 templates or ships `.red { color: blue }` and lives with the lie. |
| 36 | ❱ CORE | `#bem` | How do Block, Element, and Modifier map to class names to prevent selector collisions? | Two developers both name their class `.title`; one owns the story card, one owns the comments panel, and the merged stylesheet silently restyles both. |
| 37 | ❱ CORE | `#bem_grammar` | How do you avoid deep grandparent nesting when designing a BEM component structure? | A new hire writes `.card__header__title__link`, the grandchild chain BEM forbids, and the component becomes impossible to restructure without rewriting the stylesheet. |
| 38 | ❱ CORE | `#bem_tradeoffs` | What are the architectural costs of using a strict naming convention like BEM? | A class like `.story-card__byline--compact` is ugly and long, yet it lets a developer delete the story card's CSS with total confidence that nothing else on the site breaks. |

## ❱❱ MORE — Architecture in Practice (Q39–Q44)

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 39 | ❱❱ MORE | `#methodology_landscape` | How does the utility-first approach fundamentally differ from a component-first architecture like BEM? | The interviewer asks "BEM or Tailwind?", and the candidate who only knows one of them cannot explain what problem either one actually solves. |
| 40 | ❱❱ MORE | `#sass_basics` | What architectural problems do CSS preprocessors solve that native CSS still cannot? | The brand color lives in 47 rules across 12 files; marketing changes the blue, and the find-and-replace misses three shades that were typed by hand. |
| 41 | ❱❱ MORE | `#sass_mixins` | When designing a component system, how do you choose between a mixin, a placeholder, and a utility class? | The team puts `@extend .btn` on every component, and the compiled output grows a single rule with sixty selectors that no one dares to touch. |
| 42 | ❱❱ MORE | `#sass_modules` | Why is `@import` deprecated in Sass, and what architectural problem does `@use` solve? | Every file imports a global `_variables.scss`, two partials define `$gutter`, and whichever file loads last silently wins across the entire site. |
| 43 | ❱❱ MORE | `#bem_with_sass` | What is the danger of abusing the `&` parent selector when writing BEM inside a preprocessor? | The stylesheet builds `.card__title` as `&__title` inside `.card`; a developer searches the source for `card__title`, finds nothing, and cannot tell where the selector comes from. |
| 44 | ❱❱ MORE | `#less` | What are the core structural differences in how Less and Sass handle logic and evaluation? | The inherited marketing site is Bootstrap 3 in Less: the new developer writes `$color` out of Sass habit, and the build fails before lunch. |

## ❱❱❱ ADVANCED — Preprocessor Mastery (Q45–Q46)

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 45 | ❱❱❱ ADVANCED | `#preprocessor_pitfalls` | How does over-nesting in a preprocessor negatively impact rendering performance and specificity? | Four levels of nesting compile to `.page .sidebar .card .title`, and every later override needs an even longer selector, until the team is fighting a specificity war the preprocessor started. |
| 46 | ❱❱❱ ADVANCED | `#styling_strategy` | When migrating a legacy codebase in 2026, how do you choose between BEM, CSS Modules, or Tailwind? | The system-design round: the interviewer sketches a 30-developer product with three brands and asks you to pick the styling architecture and defend it for ten minutes. |

---

# PART THREE — RESPONSIVE, ACCESSIBLE, AND CROSS-BROWSER CSS (Q47–Q63)

## ❱ CORE — Responsive Foundations (Q47–Q53)
The viewport contract and the fluid layout toolkit.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 47 | ❱ CORE | `#viewport_meta` | What is the layout viewport, and why does a missing viewport meta tag break mobile rendering? | The staging link opens on a phone as a tiny 980px desktop page that readers must pinch-zoom, because one line is missing from the `<head>`. |
| 48 | ❱ CORE | `#media_queries` | Why is a mobile-first approach with `min-width` queries generally preferred over desktop-first? | The desktop-first stylesheet needs four `max-width` overrides and an `!important` to undo its own desktop rules on phones; the mobile-first rewrite deletes half the file. |
| 49 | ❱ CORE | `#breakpoints` | Why should media query breakpoints be defined by content limits rather than specific device widths? | The team designs at exactly 375px and 768px to match two phones; the layout collapses on a 660px foldable that nobody owns. |
| 50 | ❱ CORE | `#fluid_layouts` | How do you build a typography scale that fluidly adapts to the viewport without using media query breakpoints? | The headline must grow smoothly from 24px on a small phone to 56px on a desktop with no visible breakpoint jump, and one `clamp()` line replaces five media queries (see Q20). |
| 51 | ❱ CORE | `#responsive_images` | When do you use the `srcset` attribute versus the `<picture>` element for responsive images? | A 3MB desktop hero ships to every reader on 3G; the data plan burns, the LCP score craters, and the fix is one `srcset` attribute. |
| 52 | ❱ CORE | `#responsive_patterns` | What are the primary CSS patterns for forcing data-heavy tables to work on mobile screens? | The election results table has nine columns of numbers; on a phone it either shrinks to unreadable dust or tears the layout open sideways. |
| 53 | ❱ CORE | `#view_transitions` | How do View Transitions simplify cross-page animation layouts? | The product manager wants the hero image to smoothly morph into the header thumbnail across page loads, and the React team says it will take three weeks of animation math. |

## ❱❱ MORE — Adaptation and User Preferences (Q54–Q60)
The component-level and user-level adaptation layer.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 54 | ❱❱ MORE | `#container_queries` | What architectural problem do container queries solve that media queries cannot? | The same story card sits in the wide main column and in the narrow rail; the viewport is identical in both places, so no media query can tell the two cards apart. |
| 55 | ❱❱ MORE | `#dark_mode` | How do you orchestrate a scalable dark mode system using `prefers-color-scheme` and custom properties? | The dark mode toggle works, but every page load flashes the light theme for a second before the script runs, and night readers see a white strobe (see Q24). |
| 56 | ❱❱ MORE | `#preference_media` | How does CSS accommodate users with reduced motion, high contrast, and forced colors needs? | A reader on Windows High Contrast mode reports that every card boundary vanished: the design communicated structure only through box-shadow, which the forced-colors mode stripped. |
| 57 | ❱❱ MORE | `#pointer_media` | Why is relying strictly on `:hover` states dangerous for touch devices, and how do pointer media queries help? | The sections dropdown works in desktop QA, but on the editor's iPad the first tap opens the menu and instantly follows the link underneath it. |
| 58 | ❱❱ MORE | `#css_accessibility` | How do you ensure a CSS layout gracefully handles 400% user zoom and custom text-spacing overrides? | A low-vision reader bumps text spacing in the browser, and the fixed-height subscribe card clips the button clean in half. |
| 59 | ❱❱ MORE | `#logical_properties` | How do logical properties simplify shipping a Right-to-Left (RTL) language variation? | The paper launches an Arabic edition overnight; every `margin-left` and absolute `left:` offset mirrors the wrong way, and the fix is a vocabulary change, not a rewrite. |
| 60 | ❱❱ MORE | `#print_css` | How do you optimize a complex web application layout for physical printing? | The subscriber prints the recipe page, and they get 12 pages of sidebar menus, banner ads, and half-cut paragraphs because nobody wrote a `@media print` sheet. |

## ❱❱❱ ADVANCED — Cross-Browser Engineering (Q61–Q63)

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 61 | ❱❱❱ ADVANCED | `#normalization` | What is the historical and practical difference between a CSS Reset and Normalize.css? | The same unstyled button renders three different ways in Chrome, Firefox, and Safari, and the team debates for a week whether to keep a ten-year-old reset file. |
| 62 | ❱❱❱ ADVANCED | `#progressive_enhancement` | How do you use `@supports` to ship modern layout features without breaking legacy browsers? | `gap` in flexbox silently fails on the CEO's older Safari, the navigation items touch each other, and the fix is a twelve-line `@supports` fallback instead of a full redesign. |
| 63 | ❱❱❱ ADVANCED | `#cross_browser_testing` | What is the systematic process for isolating and fixing a browser-specific layout bug? | A flexbox overflow bug appears on a real iPhone but never in the simulator; the reporter is furious, the bug is unassigned for a week, and nobody has a reproduction workflow. |
