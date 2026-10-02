# Topic Vocabulary (controlled)

Every question carries exactly **one** primary Topic hashtag, drawn from this list. If a topic you need is not here, add it here first (with a one-line definition), then use it. No off-registry tags.

**Naming convention:** API or attribute name verbatim when one exists (`alt_attribute` for the `alt` attribute, `aria_label` for `aria-label`), snake_case concept otherwise (`focus_order`, `critical_rendering_path`). WCAG criteria keep their `wcag_` prefix so "all WCAG questions" is a single-column scan.

# Web Accessibility tags

## Foundations and standards

- `#what_is_accessibility` — the big-picture idea: who benefits, disability types, the curb-cut effect, accessibility versus compatibility.
- `#pour` — the four POUR principles: Perceivable, Operable, Understandable, Robust, and how criteria organize under them.
- `#wcag_levels` — conformance levels A, AA, AAA; what legal frameworks target; how to answer "which level should we meet".
- `#semantics` — semantic HTML as the accessibility layer: native elements carry meaning for free.
- `#native_vs_aria` — the first rule of ARIA: prefer native controls; when ARIA is justified; what ARIA cannot fix.

## Structure and navigation

- `#headings` — heading hierarchy as the page outline screen readers navigate; skipped levels; one h1.
- `#landmarks` — banner, navigation, main, contentinfo, form, complementary, search; HTML elements that expose them.
- `#skip_links` — bypassing repeated navigation; visually hidden until focused.
- `#page_structure` — language, title, reading order, structural soundness of a page.
- `#lists` — native list semantics for grouped content.

## Content

- `#alt_text` — the `alt` attribute: when images need it, what good alt text contains, decorative images.
- `#images` — figures, complex images, SVG accessibility, icons.
- `#links` — link purpose, descriptive text, "click here" failures, link versus button.
- `#color_contrast` — WCAG contrast ratios: 4.5:1 text, 3:1 large text and UI parts; non-text contrast.
- `#motion` — animation, vestibular triggers, `prefers-reduced-motion`.
- `#zoom_reflow` — 200% zoom, reflow at 320 CSS pixels, responsive versus accessible.

## Forms and interaction

- `#forms` — native form semantics, grouping, instructions, validation messages.
- `#labels` — the `label` element, programmatic association, placeholder is not a label.
- `#keyboard` — full keyboard operability: every control reachable and usable without a mouse.
- `#focus_order` — DOM order as tab order, `tabindex` discipline, positive tabindex failures.
- `#focus_visible` — the visible focus indicator, `:focus-visible`, never `outline: none` without replacement.
- `#focus_management` — moving and restoring focus programmatically: dialogs, route changes, deletions.
- `#touch_targets` — target size: the 24 by 24 CSS pixel minimum of WCAG 2.2.

## ARIA and custom controls

- `#aria_basics` — roles, states, properties; what ARIA does and does not do.
- `#accessible_name` — how elements get their name: computation order, label precedence.
- `#live_regions` — announcing dynamic changes: `aria-live`, roles of status and alert, SPA updates.
- `#dialog_pattern` — accessible modal dialogs: focus trap, Esc, focus return, `aria-modal`.
- `#tabs_pattern` — tab interfaces: roles, arrow keys, selection movement.
- `#menu_pattern` — menus and menubars versus simple navigation.
- `#custom_controls` — the general discipline of building widgets from APG patterns.

## Testing and process

- `#screen_readers` — how screen readers work, which to test with, basics of NVDA, JAWS, VoiceOver.
- `#manual_testing` — Easy Checks, keyboard passes, screen reader passes; a repeatable manual protocol.
- `#automated_testing` — axe and Lighthouse: what they catch, what they cannot, CI integration.
- `#testing_strategy` — combining automated, manual, and user testing; when in the lifecycle.
- `#a11y_process` — accessibility in the organization: audits, policies, shift left.

# Web Performance tags

## Loading and rendering

- `#perf_basics` — what web performance is, why it matters, the cost model.
- `#critical_rendering_path` — DOM to CSSOM to render tree to layout to paint; render-blocking resources.
- `#script_loading` — `async`, `defer`, module scripts, inline versus external, execution order.
- `#resource_hints` — preload, preconnect, prefetch, dns-prefetch, fetchpriority.
- `#lazy_loading` — the `loading` attribute, lazy components, below-the-fold strategy.
- `#images_perf` — image formats, responsive images, `srcset` and `sizes`, dimensions to prevent shifts.
- `#fonts_perf` — font loading: `font-display`, preload, subsetting, FOUT and FOIT.
- `#caching` — HTTP caching headers, cache strategies, cache busting.
- `#compression` — compression formats: Brotli, gzip, what to compress.
- `#cdn` — CDNs, edge delivery, why distance matters.
- `#bundles` — bundle size, code splitting, tree shaking, dynamic imports.

## Measurement

- `#core_web_vitals` — LCP, INP, CLS: definitions, thresholds, the 75th percentile.
- `#lab_vs_field` — Lighthouse synthetic data versus CrUX real-user data; why numbers differ.
- `#lighthouse` — what Lighthouse audits, scoring, weights, limits.
- `#devtools_perf` — the Performance panel workflow: traces, throttling, main thread, diagnosing slow loads and interactions.
- `#performance_apis` — the Performance API, observers, measuring in the field, attribution.

## Runtime and program performance

- `#main_thread` — the single-threaded model, long tasks, yielding, schedulers.
- `#event_loop` — tasks and microtasks, ordering, starvation, browser versus Node.
- `#rendering_perf` — layout thrash, reflow versus repaint, compositing, `requestAnimationFrame`.
- `#js_engine` — how V8 executes JavaScript: interpreter, optimizing compiler, hidden classes, inline caches.
- `#memory` — allocations, garbage collection, leaks, DevTools memory profiling.
- `#network_perf` — TCP, TLS, HTTP versions, latency and bandwidth, multiplexing.
- `#node_perf` — the Node event loop, streams, worker threads, server-side costs.
