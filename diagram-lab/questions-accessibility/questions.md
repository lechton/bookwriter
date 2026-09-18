# Web Accessibility and Web Performance Interview Questions

A unified, dependency-ordered curriculum of **54 questions**: Web Accessibility (1–34) and Web Performance (35–54). One continuous numbering scale, sections stacked one under the other, so any question can be cited by its number (e.g., "write the lecture for Q47").

## Format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|

- **#** — Stable unique ID. Continuous 1–54. Cite any question by number.
- **Tier** — `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth.
- **Topic** — One hashtag from `topics.md` (controlled vocabulary). One primary tag per question.
- **Question** — Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook** — Pain-point framing. Becomes the seed of the lecture's Hook Ladder opening.

## Reading paths

- **Pure newcomer:** Read ❱ CORE in order, both courses.
- **Working developer:** Finish ❱ CORE (both), then dip into ❱❱ MORE by topic as your work demands.
- **Interview prep:** Skim ❱ CORE, drill ❱❱❱ ADVANCED.

---

# PART ONE — WEB ACCESSIBILITY (Q1–Q34)

## ❱ CORE — Foundations and Content (Q1–Q17)
The minimum path to understanding what accessibility is, how the DOM provides it for free, and how to structure content correctly.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 1 | ❱ CORE | `#what_is_accessibility` | What is web accessibility, and who actually benefits when a site is accessible? | A subscriber who is blind phones the newsroom because the checkout rejects her: her screen reader never hears the card field, and the sale is lost. |
| 2 | ❱ CORE | `#pour` | What are the four principles of WCAG (POUR), and how do they organize every success criterion? | A developer fixes the contrast but the keyboard still cannot reach the button; fixing one kind of barrier leaves three more standing. |
| 3 | ❱ CORE | `#wcag_levels` | What do WCAG conformance levels A, AA, and AAA mean, and which level should a product target? | The team ships A only, calls the audit green, and a year later fails the procurement check that demanded AA. |
| 4 | ❱ CORE | `#semantics` | Why is semantic HTML the foundation of accessibility, and what does a native element give you for free? | A div styled as a button looks perfect and works for mice only: no keyboard, no name, no role, no announcement. |
| 5 | ❱ CORE | `#native_vs_aria` | What does the first rule of ARIA actually say, and when is ARIA the right tool? | A developer sprinkles ARIA roles over broken markup and the screen reader experience gets worse, not better. |
| 6 | ❱ CORE | `#page_structure` | What defines the structural soundness of a page for assistive technologies? | The article text is in English, but the screen reader attempts to pronounce it with a French accent because the `lang` attribute is missing. |
| 7 | ❱ CORE | `#headings` | How do headings structure a page for screen reader users, and what makes a heading hierarchy correct? | A screen reader user jumps by headings to find the sports section and lands nowhere, because the page has no h2s, only styled divs. |
| 8 | ❱ CORE | `#landmarks` | What are landmark regions, and how do they let screen reader users skip across a page? | On a 40-section front page, a keyboard user tabs through 60 links before reaching the first story. |
| 9 | ❱ CORE | `#skip_links` | How do skip links work and when are they necessary? | A keyboard-only user has to tab through a 40-item mega menu on every single page refresh just to read the news. |
| 10 | ❱ CORE | `#lists` | Why should you use native list semantics for grouped content? | The sidebar shows five related stories, but the screen reader just reads them as a continuous block of text, making it impossible to know how many there are. |
| 11 | ❱ CORE | `#alt_text` | What makes image alt text good or bad, and when is alt left empty? | The lead story is a photo of the flooded bridge; a screen reader user hears only the file name. |
| 12 | ❱ CORE | `#images` | How do you make complex images and SVG icons accessible? | The new interactive data visualization goes live, but screen reader users just hear "graphic" with no explanation of the data. |
| 13 | ❱ CORE | `#links` | What distinguishes a good link from a bad one, and when should you use a button instead? | A screen reader user pulls up a list of links on the page and hears "Click here", "Click here", "Read more", completely devoid of context. |
| 14 | ❱ CORE | `#color_contrast` | What contrast ratios does WCAG require, and how would you test and fix a failing palette? | A gray-on-gray redesign looks premium, but the refund link becomes invisible to a third of readers over 50. |
| 15 | ❱ CORE | `#zoom_reflow` | What is the difference between zooming text to 200% and reflowing at 320 CSS pixels? | The user zooms the page to read the article, and the text disappears off the side of the screen requiring horizontal scrolling for every line. |
| 16 | ❱ CORE | `#motion` | How do you handle vestibular triggers and respect user preferences for reduced motion? | The new parallax scrolling animation goes live, and users report feeling physically dizzy when browsing the front page. |
| 17 | ❱ CORE | `#touch_targets` | What are the WCAG 2.2 requirements for touch target sizes and spacing? | A user with a slight tremor repeatedly clicks the "Cancel" link instead of the "Save" button on their phone. |

## ❱❱ MORE — Forms, Focus, and Basic ARIA (Q18–Q26)
Interaction and state changes. Assumes CORE as prerequisite.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 18 | ❱❱ MORE | `#forms` | How do you group related form controls and associate validation errors? | The checkout form highlights three fields in red, but the screen reader just says "edit text" without explaining the error. |
| 19 | ❱❱ MORE | `#labels` | Why is a placeholder never a label, and how do you properly associate labels with inputs? | A subscriber with memory loss clicks into the card field, the placeholder vanishes, and she no longer knows what to type. |
| 20 | ❱❱ MORE | `#keyboard` | What does full keyboard operability require? | A developer builds a custom slider that works perfectly with a mouse drag, but completely ignores the arrow keys. |
| 21 | ❱❱ MORE | `#focus_order` | What determines the tab order of a page, and how do you keep it sane? | The tab key jumps from the masthead to the footer and back into an ad, and the subscriber gives up before the email field. |
| 22 | ❱❱ MORE | `#focus_visible` | Why is the visible focus indicator critical, and why should you never use `outline: none`? | The keyboard focus lands on the submit button, but there is no visual change, leaving the user guessing where their keystrokes will go. |
| 23 | ❱❱ MORE | `#focus_management` | How and when do you programmatically move focus in a single-page application? | A user deletes a row in their inbox, the DOM node vanishes, and the browser resets their focus to the very top of the page. |
| 24 | ❱❱ MORE | `#aria_basics` | What are ARIA roles, states, and properties, and what do they actually do? | A developer adds `aria-checked="true"` to a div and expects it to magically become toggleable with the spacebar. |
| 25 | ❱❱ MORE | `#accessible_name` | What is an accessible name, and what is the computation order? | A button has text, an aria-label, and a title attribute. Which one does the screen reader actually announce? |
| 26 | ❱❱ MORE | `#live_regions` | How do you announce dynamic content changes to screen readers without stealing focus? | The user clicks 'Add to cart', the cart icon updates visually, but the screen reader remains completely silent. |

## ❱❱❱ ADVANCED — Patterns and Testing (Q27–Q34)
Custom widgets, rigorous testing, and accessibility at scale.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 27 | ❱❱❱ ADVANCED | `#dialog_pattern` | What are the required keyboard behaviors and ARIA roles for an accessible modal dialog? | The newsletter modal pops up, but the screen reader user is still tabbing through the obscured page behind it. |
| 28 | ❱❱❱ ADVANCED | `#tabs_pattern` | How do you implement an accessible tab interface with correct focus management? | A user tabs into the tablist and has to press tab 15 times to reach the panel content. |
| 29 | ❱❱❱ ADVANCED | `#menu_pattern` | When should you use a menu pattern instead of simple navigation links? | The developer implements a custom dropdown as a `menu`, but screen reader users get stuck because the arrows keys do nothing. |
| 30 | ❱❱❱ ADVANCED | `#custom_controls` | How do you build a custom control when native HTML doesn't suffice? | The design calls for a complex combobox, but the naive implementation leaves screen reader users trapped. |
| 31 | ❱❱❱ ADVANCED | `#screen_readers` | How do screen readers parse the DOM and build the accessibility tree? | The developer hides an element with `opacity: 0`, but the screen reader still reads it out loud. |
| 32 | ❱❱❱ ADVANCED | `#automated_testing` | What can automated accessibility tools catch, and why does a passing audit never prove a site is accessible? | The dashboard shows a 100 accessibility score the same week a blind reader cancels because she cannot check out. |
| 33 | ❱❱❱ ADVANCED | `#manual_testing` | How do you manually test a page for accessibility using only a keyboard and a screen reader? | The automated scan is clean, but you need to prove the checkout flow is actually usable by a blind customer. |
| 34 | ❱❱❱ ADVANCED | `#testing_strategy` | How do you combine automated, manual, and user testing in a development lifecycle? | The team performs a massive accessibility audit right before launch and discovers architectural flaws that require a full rewrite. |

---

# PART TWO — WEB PERFORMANCE (Q35–Q54)

## ❱ CORE — Loading and the Network (Q35–Q43)
The fundamentals of how the browser gets resources over the network and puts them on screen.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 35 | ❱ CORE | `#perf_basics` | What is web performance, and what is the cost model of the web? | The new marketing page takes 8 seconds to load on a 3G connection, and 40% of visitors bounce before seeing the hero image. |
| 36 | ❱ CORE | `#critical_rendering_path` | What is the critical rendering path from HTML to paint, and what blocks it? | The browser receives the HTML immediately, but the screen stays white for three seconds while a massive stylesheet downloads. |
| 37 | ❱ CORE | `#script_loading` | What is the difference between `async` and `defer`, and where should scripts go? | A third-party analytics script is added to the `<head>`, and suddenly the entire page stops rendering until it finishes loading. |
| 38 | ❱ CORE | `#images_perf` | How do you optimize images and prevent them from causing layout shifts? | The article text jumps down exactly when the hero image finally loads, causing the user to click the wrong link. |
| 39 | ❱ CORE | `#fonts_perf` | How do you load web fonts without causing a Flash of Invisible Text (FOIT)? | The custom brand font takes two seconds to load, leaving the headlines completely blank in the meantime. |
| 40 | ❱ CORE | `#caching` | How do HTTP caching headers work, and what is cache busting? | You deploy a critical bug fix, but users complain the site is still broken because their browsers are clinging to yesterday's JavaScript. |
| 41 | ❱ CORE | `#compression` | What is the difference between gzip and Brotli, and what should you compress? | The server is sending a 2MB uncompressed JSON payload on every request, choking the mobile connection. |
| 42 | ❱ CORE | `#cdn` | Why do CDNs matter, and how does distance affect latency? | Users in Australia wait four seconds for the initial HTML response because the origin server is in Virginia. |
| 43 | ❱ CORE | `#bundles` | How do you manage bundle size with code splitting and tree shaking? | A user on a slow phone downloads the entire charting library just to read a text article that has no charts. |

## ❱❱ MORE — Measurement and Optimization (Q44–Q49)
Core Web Vitals, profiling tools, and loading strategies.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 44 | ❱❱ MORE | `#core_web_vitals` | What are the Core Web Vitals, their thresholds, and why are they measured at the 75th percentile? | The product manager asks why the dashboard shows an LCP of 4 seconds when it loads instantly on her MacBook. |
| 45 | ❱❱ MORE | `#lab_vs_field` | Why can your Lighthouse score be 100 while real users experience a failing INP? | The build pipeline enforces a perfect Lighthouse score, but the real-user monitoring data shows massive latency in the field. |
| 46 | ❱❱ MORE | `#lighthouse` | What exactly does a Lighthouse performance audit measure, and how is the score weighted? | The team spends a week optimizing JavaScript execution, but the Lighthouse score barely moves because LCP dominates the weighting. |
| 47 | ❱❱ MORE | `#devtools_perf` | How do you use the Chrome DevTools Performance panel to diagnose a slow interaction? | A button click takes 800ms to respond, and you need to prove exactly which JavaScript function is blocking the main thread. |
| 48 | ❱❱ MORE | `#resource_hints` | How do resource hints like `preload` and `preconnect` optimize the critical path? | The browser discovers the hero image only after parsing the CSS, delaying the LCP by a full second. |
| 49 | ❱❱ MORE | `#lazy_loading` | How does the `loading="lazy"` attribute work, and when is it a mistake to use it? | A developer adds `loading="lazy"` to every image on the page, and the hero image suddenly loads much slower than before. |

## ❱❱❱ ADVANCED — Runtime and Engine Internals (Q50–Q54)
JavaScript execution, event loops, V8 optimization, and networking.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 50 | ❱❱❱ ADVANCED | `#main_thread` | What is the single-threaded model, what is a long task, and how do you yield? | The main thread is blocked by a massive data parsing loop, and the entire UI freezes so the user can't even scroll. |
| 51 | ❱❱❱ ADVANCED | `#event_loop` | How does the browser event loop prioritize microtasks over macrotasks? | A developer queues a thousand promises, starving the event loop and preventing the browser from rendering the next frame. |
| 52 | ❱❱❱ ADVANCED | `#rendering_perf` | What causes layout thrashing, and how does it differ from a repaint or a composite? | An animation runs at 15 frames per second because every frame triggers a full document layout recalculation. |
| 53 | ❱❱❱ ADVANCED | `#js_engine` | How does V8 execute JavaScript, and what makes code optimized or deoptimized? | Two implementations of the same sorting algorithm have a 10x performance difference purely because of how the objects are shaped. |
| 54 | ❱❱❱ ADVANCED | `#memory` | What causes memory leaks in JavaScript, and how does garbage collection pressure affect performance? | The single-page application gets progressively slower over an hour until the browser tab crashes with an out-of-memory error. |
