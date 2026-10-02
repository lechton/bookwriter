# Controlled Topic Vocabulary (DRAFT)

One primary tag per question. Add a tag here before using it in `questions.md`.

## Part One — CSS Review

- `#cascade` — origins, importance, source order, and how the winner is decided
- `#specificity` — the a-b-c score, selector weights, and `!important` escalation
- `#inheritance` — inherited vs non-inherited properties; `inherit`, `initial`, `unset`, `revert`
- `#box_model` — content, padding, border, margin; `box-sizing`
- `#margin_collapsing` — adjoining vertical margins, parent-child margin escape, when collapse does not happen
- `#display` — block, inline, inline-block, none, and outer vs inner display roles
- `#positioning` — static, relative, absolute, fixed, sticky
- `#stacking_context` — what creates one, painting order, z-index surprises
- `#floats_clearing` — float behavior, container collapse, clearfix, modern remnants
- `#formatting_contexts` — block formatting contexts: establishing one (`flow-root`, overflow), float containment, margin containment
- `#units` — px, %, em, rem, vw, vh, ch; absolute vs relative
- `#colors` — hex, rgb/rgba, hsl/hsla, oklch; named colors; currentColor; relative colors and color-mix()
- `#typography` — @font-face loading, line-height, font shorthand, truncation, text wrapping
- `#selectors` — combinators, attribute selectors, right-to-left matching, over-qualification cost
- `#flexbox` — flex container properties, main vs cross axis
- `#flex_items` — flex-grow, flex-shrink, flex-basis, the flex shorthand
- `#grid` — grid containers, tracks, the fr unit
- `#grid_placement` — line-based placement, grid-area, auto-flow
- `#center_element` — the centering catalog and its decision rules
- `#math_functions` — calc, min, max, clamp
- `#pseudo` — pseudo-classes vs pseudo-elements
- `#transitions_animations` — transition, animation, cheap vs expensive properties, will-change and containment
- `#transforms` — transform functions, transform-origin, composited motion
- `#custom_properties` — var(), fallbacks, runtime theming, scoping
- `#backgrounds` — background shorthand, cover vs contain, gradients
- `#overflow` — overflow values, clipping, scroll containers, 100vw pitfalls
- `#scroll_snapping` — scroll-snap-type, scroll-snap-align, overscroll-behavior
- `#modern_selectors` — :is, :where, :not, :has and their specificity rules
- `#hiding_content` — display:none vs visibility:hidden vs opacity:0; the visually-hidden pattern
- `#intrinsic_sizing` — min-content, max-content, fit-content, stretch; width:auto vs 100%
- `#subgrid` — subgrid tracks and when nested grids need ancestor alignment
- `#popover_api` — popover attribute, :popover-open, top layer promotion
- `#anchor_positioning` — anchor(), anchor-name, position-fallback
- `#nesting_layers` — native nesting, @layer cascade control, @scope

## Part Two — Architecture and Preprocessors

- `#methodology_why` — why naming architectures exist
- `#bem` — block, element, modifier fundamentals
- `#bem_grammar` — element vs nested block, boolean vs key-value modifiers
- `#bem_tradeoffs` — costs and benefits of BEM
- `#methodology_landscape` — OOCSS, SMACSS, ITCSS, CUBE, utility-first
- `#sass_basics` — variables, nesting, the & parent selector
- `#sass_mixins` — mixins, functions, @extend, placeholders
- `#sass_modules` — @use, @forward, the @import deprecation
- `#bem_with_sass` — BEM plus Sass workflows and grep-ability
- `#less` — Less variables, lazy evaluation, guarded mixins, escaping
- `#preprocessor_pitfalls` — over-nesting, extend bloat, mixin duplication
- `#styling_strategy` — architecture choice: BEM+Sass, CSS Modules, CSS-in-JS, utility-first

## Part Three — Responsive, Accessible, Cross-Browser

- `#viewport_meta` — the viewport contract and layout viewport
- `#media_queries` — syntax, min vs max width, mobile-first discipline
- `#breakpoints` — content-driven breakpoint strategy
- `#fluid_layouts` — percentage grids, fluid typography, aspect-ratio
- `#responsive_images` — srcset, sizes, picture, art direction
- `#responsive_patterns` — navigation and table patterns for small screens
- `#view_transitions` — cross-document and same-document view transitions
- `#container_queries` — container-type, container queries vs media queries
- `#dark_mode` — prefers-color-scheme and token theming
- `#preference_media` — prefers-reduced-motion, prefers-contrast, forced-colors
- `#pointer_media` — hover, pointer, any-hover, any-pointer
- `#css_accessibility` — zoom, reflow, text spacing, the CSS surface of WCAG
- `#logical_properties` — margin-inline, padding-block, writing-mode, RTL/LTR adaptation
- `#print_css` — @media print, page breaks, orphans and widows
- `#normalization` — reset vs normalize vs modern baselines
- `#progressive_enhancement` — @supports, prefixes, graceful degradation
- `#cross_browser_testing` — systematic reproduction and debugging workflow
