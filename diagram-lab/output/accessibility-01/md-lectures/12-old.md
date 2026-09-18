# Lecture 12: The Chart Behind the Glass
> INTERVIEW QUESTION | ❱ CORE | How do you make complex images and SVG icons accessible?

1. David opens the National Times investigative special on the city's four-billion-dollar annual municipal budget.
2. Sighted subscribers instantly examine a colorful interactive vector chart comparing housing, transit, and emergency allocations.
3. David's screen reader moves to the visualization container and announces a single word: "Graphic".
4. Which city agency gained funding and which community program was cut?
5. David cannot inspect a single dollar figure, percentage shift, or historical trend.
6. The graphics desk spent three weeks designing the chart, yet it locks non-visual readers behind opaque digital glass.
7. Today we wire vector diagrams and SVG icons with explicit roles, internal titles, and companion data tables.

### The Silent Vector Trap

Inline Scalable Vector Graphics (`<svg>`) have become the industry standard for web charts, dashboard telemetry, and interface icons. Unlike raster images like JPEG or PNG, vector elements live directly inside the Document Object Model as a tree of XML nodes: `<path>`, `<circle>`, `<rect>`, and `<g>`.

This DOM presence creates a severe accessibility trap. Browsers do not automatically know whether an inline SVG is a clickable icon, a decorative background flourish, or an elaborate data visualization. Without explicit authoring:

1. Some screen readers treat the entire SVG as completely invisible, announcing nothing at all.
2. Other screen readers announce the bare word "Graphic" without an accessible name.
3. Some engines attempt to traverse every raw vector shape, speaking dozens of geometric coordinates to the user.

David encounters that exact silence on the city budget page:

```canvas title="/graphics/budget-breakdown — Municipal Expenditure"
url=https://nationaltimes.com/graphics/budget-breakdown
zoom=100%
masthead | The National Times | investigations | search
nav | Municipal Budget; Capital Projects; Debt Service | landmark=navigation
h1 | Visualizing the 2026 Municipal Budget Reallocation
card | FY 2026 Allocation Chart | type=card | title="City Expenditure by Sector" | text="Interactive vector graphic comparing proposed municipal allocations against prior-year baselines"
text | Affordable housing investments rise 42% while administrative operations contract 18%.
sr | "Graphic" | label="Unlabelled SVG Container" | wrong
contrast | #0f172a on #ffffff | 16.2:1 pass
kbd | Tab skips past chart shapes without focus stops or accessible data summary
```

Here is the unlabelled SVG markup that failed David:

```html title="silent-chart.svg"
<svg viewBox="0 0 800 500" class="budget-chart"> <!-- **WRONG:** unlabelled SVG exposes no name or role in **ACCESSIBILITY TREE** -->
  <g class="housing-bar">
    <rect x="50" y="100" width="80" height="300" fill="#0284c7" />
  </g>
  <g class="transit-bar">
    <rect x="180" y="160" width="80" height="240" fill="#059669" />
  </g>
</svg>
```

Under WCAG 2.2 Success Criterion 1.1.1 (Non-text Content, Level A), non-text content must convey its information through a text alternative. To fix vector graphics, frontend engineers must distinguish between two fundamental use cases: lightweight icons and complex information graphics.

### Case 1: Taming SVG Icons

Modern design systems use hundreds of inline SVG icons for actions like searching, bookmarking, and closing dialogs. These fall into two strict rules:

When an icon is **purely decorative** (accompanied by visible text):
Hide the SVG from the accessibility tree using `aria-hidden="true"` and prevent Internet Explorer focus bugs with `focusable="false"`:

```html title="decorative-icon.html"
<button type="button" class="btn-bookmark">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"> <!-- **RIGHT:** hides presentational icon from **ASSISTIVE TECH** -->
    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
  </svg>
  Save Article
</button>
```

When an icon is **standalone and functional** (an icon-only button without visible text):
Provide an explicit programmatic name on the interactive button itself using `aria-label`, and keep the SVG hidden:

```html title="functional-icon-button.html"
<button type="button" class="icon-btn" aria-label="Search archive articles"> <!-- **RIGHT:** button holds the accessible **NAME** -->
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
</button>
```

Placing `aria-label` directly on the `<button>` ensures that all screen readers announce: "Search archive articles, button", without stuttering or exposing the internal vector shapes.

### Case 2: Complex Visualizations Demand a Two-Part Alternative

A complex graphic like our municipal budget chart cannot be summarized in a simple five-word sentence. Sighted users do not merely look at the shape; they compare values, inspect trends, and calculate deltas between bars.

The W3C WAI Images Tutorial establishes the foundational architecture for complex imagery:

> Complex images contain substantial information – more than can be conveyed in a short phrase or sentence. These are typically:
> - graphs and charts, including flow charts and organizational charts;
> - diagrams and illustrations where the page text relies on the user being able to understand the image;
> - maps showing locations or other information such as weather systems.
> In these cases, a two-part text alternative is required. The first part is the short description to identify the image and, where appropriate, indicate the location of the long description. The second part is the long description – a textual representation of the essential information conveyed by the image.
*W3C, Complex Images Tutorial, `resources/accessibility/wai/pages/design-develop/tutorials/images/complex.md`*

This two-part alternative is engineered through two synchronized layers:

**Part 1: The Vector Container Contract.**
On the `<svg>` element itself, declare `role="img"`. This collapses the internal shapes into a single image entity. Next, supply child `<title>` and `<desc>` elements with unique IDs, and link them to the outer container using `aria-labelledby`:

```html title="accessible-vector.svg"
<svg role="img"
     aria-labelledby="chart-title chart-desc"
     viewBox="0 0 800 500"
     class="budget-chart"> <!-- **RIGHT:** role and aria-labelledby expose title and **DESCRIPTION** -->
  <title id="chart-title">2026 Municipal Budget Allocation</title>
  <desc id="chart-desc">Bar chart comparing four billion dollars in city expenditures. Affordable housing increases by 42 percent while administrative overhead decreases by 18 percent.</desc>
  <g class="bars">
    <rect x="50" y="100" width="80" height="300" fill="#0284c7" />
    <rect x="180" y="160" width="80" height="240" fill="#059669" />
  </g>
</svg>
```

When David lands on the chart, his screen reader announces: "2026 Municipal Budget Allocation, image. Bar chart comparing four billion dollars in city expenditures..."

**Part 2: The Structured Data Table Companion.**
A summary paragraph explains the high-level trend, but it does not allow a blind analyst to query specific line items. Provide a companion HTML table, either visible on page or nested inside a disclosure `<details>` element:

```html title="companion-table.html"
<figure role="group" class="chart-wrapper">
  <figcaption>
    <details class="data-disclosure">
      <summary>View 2026 Budget Data Table</summary> <!-- **RIGHT:** accessible disclosure exposes underlying **DATA** -->
      <table class="data-table">
        <caption>Municipal Budget Allocations 2025 vs 2026 (in Millions)</caption>
        <thead>
          <tr>
            <th scope="col">Department</th>
            <th scope="col">FY 2025</th>
            <th scope="col">FY 2026</th>
            <th scope="col">Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Affordable Housing</th>
            <td>$420M</td>
            <td>$596M</td>
            <td>+42%</td>
          </tr>
          <tr>
            <th scope="row">Public Transit</th>
            <td>$810M</td>
            <td>$890M</td>
            <td>+10%</td>
          </tr>
        </tbody>
      </table>
    </details>
  </figcaption>
</figure>
```

With an HTML table companion, David can navigate row by row, compare column headers using table shortcut keys, and verify every single metric with the same fidelity as any sighted reader.

> [!KEY]
> Complex data visualizations require a two-part alternative: a concise executive summary inside the SVG title and description, paired with a structured HTML table companion for granular data access.

> [!TIP]
> **To impress the interviewer:** never claim that an aria-label on an SVG chart solves accessibility. Senior engineers cite the W3C Two-Part Text Alternative framework: Part 1 provides an executive summary of the visual trend using `<title>`, `<desc>`, and `aria-labelledby` on an SVG with `role="img"`; Part 2 provides the underlying raw data in a semantic companion `<table>` (often enclosed in a `<details>` disclosure). For icons, articulate the clean boundary: decorative icons use `aria-hidden="true" focusable="false"`, while icon buttons put `aria-label` on the parent `<button>`, keeping the child SVG hidden.

### Where you will meet this

- Municipal election maps: summarizing county-by-county victory margins in SVG descriptions while offering searchable voting tally tables below.
- Financial portfolio analytics: rendering asset allocation donut charts with companion tables listing exact equity values and yields.
- Weather forecasting radar: announcing regional precipitation bands in an SVG title while providing hourly temperature and wind speed tables.
- Design system icon sets: enforcing `aria-hidden="true"` across all utility icons while pairing standalone buttons with explicit accessible labels.
- Healthcare patient dashboards: presenting blood glucose trendline SVGs alongside historical laboratory data grids.

### Glossary

- **Scalable Vector Graphics (SVG)**: An XML-based markup format for rendering interactive two-dimensional vector diagrams, charts, and icons directly in the DOM.
- **Two-Part Text Alternative**: The accessibility architecture for complex graphics requiring a concise high-level summary paired with structured tabular data.
- **role="img" on SVG**: An explicit ARIA role that unifies an SVG container into a single accessible image node, preventing screen readers from traversing internal paths.
- **SVG `<title>` and `<desc>`**: Native XML child elements inside an SVG providing accessible names and longform descriptive text to assistive software.
- **aria-labelledby on SVG**: An attribute linking the outer SVG element to its internal title and desc IDs to guarantee reliable speech announcement across browsers.
- **Data Table Fallback**: A semantic HTML table paired with a complex graphic, providing a structured, queryable equivalent of the visualized metrics.

### Summary

**Accessible Vectors and Complex Visualizations**

In modern frontend architecture, vector graphics and data visualizations are first-class editorial assets that require deliberate non-visual scaffolding. Treating an inline SVG as an unlabelled blob of shapes creates an impassable barrier for assistive technologies. Simple icons must be cleanly separated into decorative and functional patterns, while data-heavy charts demand a dual-layer strategy combining high-level narrative summaries with granular tabular fallbacks. Here is your streetwise review.

❒ The Two Vector Strategies

1. Icons require binary accessibility classification.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) If an icon is accompanied by visible text, hide it completely with `aria-hidden="true"` and `focusable="false"`.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) If an icon acts alone as a button, place the accessible label on the parent `<button>` element.
2. Complex charts demand the two-part alternative framework.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Set `role="img"` on the outer `<svg>` and bind internal `<title>` and `<desc>` elements via `aria-labelledby`.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Provide a companion HTML table so non-visual readers can query granular numbers and calculations.

❒ The Developer's Levers

1. Never leave an inline SVG chart without an explicit image role and title binding.

**DO NOT DO THIS:** Output bare vector paths that screen readers announce as silent or disconnected shapes.
```html wrong
<svg viewBox="0 0 500 300">
  <path d="M10 80 Q 95 10 180 80" stroke="black" />
</svg>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Declare `role="img"` and link accessible `<title>` and `<desc>` child elements.
```html right
<svg role="img" aria-labelledby="t d" viewBox="0 0 500 300">
  <title id="t">Revenue Growth</title>
  <desc id="d">Quarterly revenue increased 14 percent.</desc>
  <path d="M10 80 Q 95 10 180 80" stroke="black" />
</svg>
```
2. Never substitute a brief sentence for an entire data visualization.

**DO NOT DO THIS:** Force non-visual users to rely on a single sentence for a sixty-point data chart.
```html wrong
<p>Here is our complete multi-year budget breakdown across all agencies.</p>
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Pair the graphic with an accessible companion data table.
```html right
<details>
  <summary>View Budget Table</summary>
  <table><caption>Annual Allocations</caption></table>
</details>
```

➔ NEVER rely on `aria-label` alone as the sole accessibility solution for a complex multi-metric chart.

➔ ALWAYS apply `aria-hidden="true"` on decorative icons adjacent to visible text.

➔ IF an image conveys tabular data THEN provide a real semantic HTML `<table>` alongside the visual representation.

| | **RAW SVG CHART**<br>(unlabelled) | **ACCESSIBLE VISUALIZATION**<br>(two-part model) |
| ---: | :--- | :--- |
| **Container role** | Generic XML node<br>or silent graphic | `role="img"`<br>unified image entity |
| **Title and summary** | None; speaks coordinates<br>or empty string | `<title>` and `<desc>`<br>bound by `aria-labelledby` |
| **Granular data** | Inaccessible behind<br>vector coordinates | Semantic companion<br>`<table>` with headers |
| **Decorative icons** | Leaks path data<br>into accessibility tree | Suppressed cleanly via<br>`aria-hidden="true"` |
| **Analyst capability** | Zero inspection or<br>verification power | Full row-by-row and<br>column query access |
