Someone wants to learn CSS & SASS , CSS: bem methodology, LESS and SASS

But one quick browse on Amazon finds most material is old like from 2015. 

I want you to document the official & authoritative resources for all these technologies with links and to make an analysis what has been updated and what official sources are authoritative ? 
Make comprehensive review.

Yes. The reason the Amazon search looks strange is that the official documentation has become much more important than books for this subject. CSS in particular has changed enormously since 2015, while BEM itself has changed comparatively little.

I reviewed the current primary sources as of September 11, 2026. The situation is quite different for CSS, BEM, Sass, and Less.

Executive summary
Technology	Best authority	How safe is a 2015 book?	Main issue
CSS	W3C/CSSWG + MDN	Poor as a primary source	CSS has gained major layout, responsive, cascade, selector, color and component features
BEM	bem.info	Quite safe for core concepts	Methodology is stable, but tooling and some naming conventions vary
Sass/SCSS	sass-lang.com	Poor as a primary source	Module system, compiler ecosystem, division, color APIs, nesting semantics and deprecations have changed substantially
Less	lesscss.org + less.js GitHub	Moderately useful, but incomplete	Core language is stable, but Less 3/4 changed math, plugins, CSS compatibility and tooling
Browser support	MDN compatibility/Baseline	Old books are unreliable	Browser support is no longer what it was in 2015

So I would not buy a 2015 “complete CSS/Sass” book as the principal curriculum. It can still be useful for conceptual explanations, but the learner should use current official material as the source of truth.

1. CSS: what is actually authoritative?

CSS has a slightly unusual authority structure.

There isn't an organization publishing a single modern document called "CSS 4". After CSS2, CSS development became modular: selectors, grid, color, cascade, fonts, containment, etc. evolve as separate specifications. The CSS Working Group explicitly describes this model in the current CSS Snapshot.

Level 1 — CSS Working Group / W3C specifications

This is the actual standards authority.

The current umbrella document is:

CSS Snapshot 2026 — W3C

It defines what the CSS Working Group considers the current stable body of CSS. The June 22, 2026 Snapshot states explicitly that CSS is now defined by a collection of specifications rather than one monolithic CSS specification.

For seeing all current and upcoming CSS modules, this page is even more useful:

CSS Current Work — W3C CSS Working Group

It is updated continuously. For example, in August 2026 the WG was still publishing updates to Fonts Level 4/5, Text Level 3/4 and Color Level 4.

Then there are the continuously updated Editor's Drafts:

CSS Working Group Editor's Drafts

Interestingly, the CSSWG itself says Editor's Drafts are usually the most up-to-date reference, although they may contain work that has not yet reached full WG consensus.

So the hierarchy is roughly:

W3C/CSSWG specification → normative truth

but not necessarily the easiest place to learn CSS.

2. MDN is the practical CSS authority for developers

For someone actually learning CSS, I would make MDN the primary daily source.

MDN — CSS Learning Module

MDN — CSS Layout Course

MDN — Complete CSS Reference

MDN — CSS Guides / Modules

MDN is not the standards body, so I wouldn't call it normative. But for authors it is arguably the most useful authoritative reference because it combines explanations, examples, links to the actual specification, browser compatibility information and Baseline status. The CSS reference explicitly indexes standard properties, selectors, pseudo-classes, pseudo-elements, data types, functions and at-rules.

That distinction is useful:

Question	Source
“What exactly does CSS define?”	CSSWG specification
“How do I actually use it?”	MDN
“Does it work in modern browsers?”	MDN browser compatibility / Baseline
“What is CSS currently working on?”	CSSWG Current Work
3. Google's current CSS course is also excellent

There is another resource I would include, although it isn't normative:

Google web.dev — Learn CSS

Google calls it an evergreen CSS course, and it now covers things such as Grid, Flexbox, logical properties, custom properties, native nesting, container queries, anchor positioning and modern UI features.

This resource is especially relevant to your observation about old books: Google substantially refreshed the course in September 2025, explicitly saying CSS had changed enough in only four years to require nine new modules and major updates.

So for learning rather than looking up formal semantics, I'd rank:

MDN + web.dev → learning

CSSWG → ultimate technical authority

4. How much has CSS changed since a 2015 book?

A lot.

A 2015 CSS book exists almost at the boundary between two generations of CSS.

Flexbox itself only reached broad cross-browser availability around September 2015.

CSS Grid became broadly available around 2017.

CSS custom properties — what people normally call CSS variables — became broadly available around 2017.

And then came another generation.

Feature	Why a 2015 book misses it
CSS Grid	Modern two-dimensional page/component layout
Subgrid	Child grid alignment with ancestors; broadly available from 2023
CSS custom properties	Native cascading variables
Logical properties	margin-inline, padding-block, writing-mode-aware layouts
Container queries	Components respond to their container rather than just viewport
Cascade Layers	Explicit cascade architecture with @layer; widely available since 2022
Native CSS nesting	Browser-parsed nested CSS; widely available since late 2023
Modern colors	oklch(), wide gamut, relative colors, Color 4
:is(), :where(), :has()	Major selector capabilities
aspect-ratio	Native aspect ratios
min(), max(), clamp()	Responsive calculation without preprocessors
@property	Typed custom properties; broadly available from 2024
@scope	Native CSS scoping; Baseline 2026
Anchor positioning	Declarative positioning relative to other elements
View transitions / scroll-driven animation	New UI and animation capabilities

This doesn't make old explanations of the box model, cascade, inheritance, selectors, positioning and typography wrong.

It does make an old book's picture of how you architect and lay out modern applications incomplete.

That is a critical distinction.

5. BEM is very different: its core is largely timeless

BEM isn't a CSS language feature. It is a software architecture / naming methodology.

The original authoritative source is:

BEM Methodology — bem.info

and especially:

BEM Quick Start

BEM Naming Convention

BEM CSS Guidelines

This is the historically authoritative source because BEM was created at Yandex, and bem.info explicitly identifies itself as Yandex's BEM documentation.

The fundamental model is still:

Block → Element → Modifier

For example conceptually:

.card {}
.card__title {}
.card--featured {}

The fundamental objective — independent reusable interface components with class names describing their role — hasn't become obsolete merely because CSS has evolved.

6. One surprisingly important BEM detail

Many developers think this:

.block__element--modifier

is the official BEM syntax.

It isn't quite that simple.

The original/classical BEM convention documented by bem.info is:

block-name__elem-name_mod-name_mod-val

So modifiers traditionally use _.

But bem.info explicitly documents the popular Two Dashes variant:

block-name__elem-name--mod-name_mod-val

as an accepted alternative BEM naming scheme.

This distinction matters because sites such as:

Get BEM

popularized the double-hyphen style.

Therefore I would classify them this way:

Resource	Authority
bem.info	Original methodology / primary authority
getbem.com	Popular simplified interpretation / teaching resource
MDN BEM discussion	Useful contextual explanation, not BEM authority

MDN itself includes BEM in its current CSS organization guidance and describes it as widely used for larger projects.

7. Is a 2015 BEM book obsolete?

Much less so.

A good old explanation of:

Block / Element / Modifier, independence, avoiding deeply coupled selectors, component responsibility and naming semantics

is still useful.

The parts I'd be cautious about are old Yandex-specific tooling: BEMHTML, BEMJSON, ENB, old build pipelines, old JS integration, IE-related advice, etc. The bem.info site still contains a large amount of historical "Classical BEM stack" material alongside the methodology.

The methodology has aged well.

The historical implementation ecosystem has not necessarily aged equally well.

8. Modern CSS has also changed BEM's context

BEM originally solved several problems that CSS itself had few mechanisms to solve.

Modern CSS now has things such as:

@layer components;

and:

@scope (.component) {
  ...
}

as well as much better selector control.

That doesn't make BEM obsolete. It means BEM is now one layer of architecture among several, rather than having to solve every CSS architecture problem by naming alone.

For example, cascade layers explicitly give developers a way to control precedence among architectural groups without fighting selector specificity.

So a modern learner should understand BEM + the modern cascade, not BEM as a substitute for understanding the cascade.

9. There is also a fascinating BEM/Sass/native-CSS difference

Sass allows this:

.component {
  &__title {
    ...
  }

  &--featured {
    ...
  }
}

which produces:

.component__title {}
.component--featured {}

Many BEM/Sass tutorials use this style.

But native CSS nesting deliberately does not support this selector concatenation.

MDN even uses BEM as its example when explaining the distinction:

.component {
  &__child-element {}
}

works in Sass, but the corresponding concatenation is invalid in native CSS nesting.

This is precisely the kind of thing a learner needs a 2026 source to understand.

A book written before native nesting existed obviously cannot explain the difference.

10. Sass: use the official Sass site as the source of truth

For Sass, there is a very clear primary authority:

Official Sass Documentation

The official docs currently document Dart Sass 1.104.0 and explicitly mark LibSass and Ruby Sass as dead implementations.

Sass has two syntaxes:

.scss   → SCSS
.sass   → indented Sass syntax

SCSS is a near-superset of CSS and is described by the Sass project itself as the easier and more popular syntax.

For someone learning today, I would teach SCSS first.

11. The enormous Sass change a 2015 book gets wrong: modules

Old Sass teaching revolves heavily around:

@import "variables";
@import "mixins";
@import "buttons";

That is now legacy Sass architecture.

Modern Sass uses:

@use "variables";
@use "mixins";

and library authors use:

@forward "...";

Official sources:

Sass @use documentation

Sass @forward documentation

@use was introduced as part of the module system and gives proper namespacing and single loading of modules.

Sass @import was officially deprecated in Dart Sass 1.80.0 in October 2024.

So a Sass course teaching @import as the normal architecture in 2026 is outdated.

12. The Sass implementation itself changed

A 2015 book may discuss:

Ruby Sass, LibSass, Node Sass.

Those should no longer be taught as the normal ecosystem.

Node Sass reached end-of-life in 2024.

LibSass reached full end-of-life in October 2025. The Sass project says there will be no future updates.

Modern Sass means:

Dart Sass

and, in JavaScript environments, primarily the sass or sass-embedded packages. The official JS API says both use the Dart Sass implementation; sass-embedded generally offers better performance through a native Dart executable.

That alone makes many old installation chapters obsolete.

13. Sass arithmetic changed too

Old Sass frequently contains:

$half: $width / 2;

Modern Sass is moving / toward its CSS meaning as a separator.

You should write:

@use "sass:math";

$half: math.div($width, 2);

The Sass project made this change because modern CSS increasingly uses / syntactically, including Grid and newer color syntax.

Again, this is exactly the sort of thing a 2015 Sass book cannot prepare someone for.

14. Sass has been adapting to modern CSS

Other substantial changes include:

Modern Sass area	Change
Modules	@use, @forward, namespaces
Built-in functions	Organized under sass:math, sass:color, sass:list, sass:map, etc.
Global functions	Being deprecated in favor of module functions
Division	math.div() replacing Sass / division
Color	Updated for CSS Color 4 / wide-gamut color
CSS nesting compatibility	Sass changed mixed-declaration behavior to follow native CSS
Import architecture	Sass @import deprecated
JS API	Modern API replaces legacy APIs
Compiler	Dart Sass is the canonical active implementation

The mixed-declaration change is particularly interesting: by Dart Sass 1.92, Sass changed its output behavior to follow the ordering semantics chosen for native CSS nesting.

The official page to periodically check is:

Sass Breaking Changes / Deprecations

and:

Official Sass Blog

Those two resources are probably more valuable than buying a new Sass book every few years.

15. Less: official documentation is straightforward

For Less, the official source is:

Official Less documentation

The homepage explicitly says it is the official documentation for both the Less language and Less.js compiler.

Then:

Less Features — full language reference

Using Less.js / compiler documentation

And for version changes:

Official Less.js changelog

Official Less.js releases

The current release line I found is Less 4.8.1, released in July 2026.

So Less is definitely not an abandoned 2015 technology.

16. Less has changed less radically than Sass

Most classic Less concepts are still recognizable:

@primary: #336699;

.button {
  color: @primary;

  &:hover {
    color: lighten(@primary, 10%);
  }
}

Variables, mixins, nesting, parent selectors, imports, functions and lazy evaluation remain core Less concepts.

But there have been meaningful changes.

The biggest compatibility change is arithmetic.

Before Less 4, / was commonly evaluated aggressively. In Less 4, the default became parentheses-required for division:

width: (100% / 3);

The change was made specifically to avoid collisions with modern CSS syntax that also uses /.

Other old options have changed or disappeared. strictMath was replaced by the newer math option, inline JavaScript was deprecated/disabled because of security concerns and superseded by plugins, and various older compiler options have been deprecated.

Recent releases have also added or refined compatibility with newer CSS constructs such as @layer, layered imports and modern container-query syntax.

So a 2015 Less book is less dangerous than a 2015 Sass book, but it still shouldn't define your toolchain or syntax assumptions.

17. One more Less practice worth correcting

Older tutorials sometimes demonstrate compiling Less directly inside the browser:

<link rel="stylesheet/less" href="styles.less">
<script src="less.js"></script>

That still works.

But the current Less documentation explicitly recommends precompiling for production when performance and reliability matter.

So browser compilation belongs mostly to learning/development or special dynamic-theming situations, not a normal production architecture.

18. What I would consider the canonical 2026 learning set

I would use this order:

Modern CSS fundamentals: MDN CSS Styling Basics → MDN CSS Layout → current MDN CSS guides. Then use web.dev Learn CSS to fill in modern topics such as Grid, Flexbox, custom properties, logical properties, nesting and container queries. Keep the CSSWG Snapshot available as the formal authority. Start: MDN CSS Styling Basics
CSS architecture/BEM: read bem.info Quick Start, Key Concepts, Naming Convention and CSS sections. Learn the idea rather than obsessing over one particular separator convention. BEM Methodology
SCSS/Sass: use only modern Dart Sass teaching. Learn variables, interpolation, nesting, mixins/functions, control structures and collections, but then importantly learn @use, @forward, built-in modules and the current deprecation model. Sass Documentation
Less: after CSS and Sass, Less is fairly easy. Work through the official overview and feature reference, paying special attention to Less-specific variables, mixins, guards, maps, namespaces, parent selectors and Less 4 math semantics. Less Official Documentation
Stay current: use CSSWG Current Work for CSS, Sass Breaking Changes for Sass, and the Less changelog for Less. These three pages solve most of the “my book is ten years old” problem. CSS Current Work Sass Breaking Changes Less Changelog
19. What knowledge from 2015 should actually be discarded?

This is perhaps the most useful way to think about old material.

If an old source teaches…	2026 judgement
Box model	Keep
Cascade / inheritance	Keep, but add layers and modern specificity tools
Basic selectors	Keep, then add modern selectors
Floats for text wrapping	Keep
Floats as primary page layout	Obsolete approach
Flexbox	Keep concepts; verify syntax/practices
Grid	Usually missing entirely
Sass variables	Keep
Sass mixins	Keep
Sass nesting	Keep, but compare with native CSS nesting
Sass @import architecture	Do not teach as modern Sass
Node Sass / LibSass	Retire
Sass / arithmetic	Replace with module-based modern form
Less variables/mixins	Keep
Less old division semantics	Update
Browser-side Less as normal deployment	Do not use as default production approach
BEM Block/Element/Modifier	Keep
BEM independence principles	Keep
Old BEM Yandex build stack	Historical/specialized
block__element--modifier as the only “correct” BEM	Too simplistic
20. The broader change is actually bigger than “new CSS properties”

The biggest conceptual difference between 2015 CSS and 2026 CSS is that CSS has absorbed capabilities that once pushed people toward preprocessors.

In the old mental model:

CSS
+
Sass/Less for variables
+
Sass/Less for nesting
+
Sass/Less for calculations
+
BEM for keeping the cascade under control

In modern CSS you have:

CSS custom properties
native nesting
calc/min/max/clamp
Grid
container queries
cascade layers
@scope
advanced selectors
modern color functions
logical properties

So Sass and Less haven't become useless, but their role is different.

Sass is now especially valuable for compile-time abstraction: modules, reusable functions/mixins, maps, loops, generation and library architecture.

Less provides similar preprocessing conveniences with a somewhat different language model.

BEM remains useful for semantic component naming and architectural boundaries.

And CSS itself has become vastly more capable.

That is why an old “CSS + Sass” book often feels like it's describing a different ecosystem even when individual examples still compile.

Bottom line

For this subject I would actually prefer a curriculum based on maintained official documentation over a new book.

The strongest combination today is:

MDN + CSSWG + web.dev for CSS → bem.info for BEM → sass-lang.com for Sass → lesscss.org for Less.

The 2015 material can then be used as supplementary explanation, especially for CSS fundamentals and BEM, but not as the arbiter of modern syntax, browser capabilities or architecture.