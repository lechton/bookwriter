# Lecture 11: The Photo Without Words
> INTERVIEW QUESTION | ❱ CORE | What makes image alt text good or bad, and when is alt left empty?

1. Marcus opens the National Times breaking news report during a declared valley flood emergency.
2. Sighted subscribers instantly see a dramatic photograph of muddy river currents swallowing the central highway bridge.
3. Marcus's screen reader encounters the hero photograph and speaks: "DSC_9042_flood_edit_v2.jpg, graphic".
4. Did the river crest safely, or is the bridge completely underwater?
5. Marcus cannot tell whether the road is passable or washed away.
6. He spends five minutes parsing article paragraphs for life-safety facts that sighted readers absorbed in two seconds.
7. Today we replace noisy camera filenames and decorative clutter with concise, purposeful text alternatives.

### The Fallback of Last Resort

When an engineer leaves the `alt` attribute off an `<img>` tag, the browser does not quietly skip the element. The browser recognizes that an image exists in the DOM, but it finds no accessible name in the accessibility tree `(see Lecture 4)`.

Assistive technologies face an impossible dilemma: should they hide the image and risk withholding vital information, or should they speak something? Screen readers choose the fallback of last resort: they parse the image URL, extract the raw filename, and speak the entire alphanumeric string. Marcus hears: "slash assets slash photos slash DSC_9042_flood_edit_v2 dot jpg, graphic".

The raw filename conveys zero news value. Worse, it injects cognitive exhaustion into emergency reporting:

```canvas title="/investigations/flooded-bridge — Breaking Flood Dispatch"
url=https://nationaltimes.com/investigations/flooded-bridge
zoom=100%
masthead | The National Times | investigations | search
nav | Crisis Tracker; Road Closures; Evacuation Shelters | landmark=navigation
h1 | Floodwaters Submerge Central Valley Transit Span
image | /assets/photos/DSC_9042_flood_edit_v2.jpg | alt=missing | label="Raw Filename Exposed" | wrong
text | State highway officials shut down Route 9 at 6:15 AM after runoff overwhelmed riverbank levees.
sr | "DSC_9042_flood_edit_v2 dot jpg, graphic"
contrast | #0f172a on #ffffff | 16.2:1 pass
```

Here is the incomplete markup that broke Marcus's orientation:

```html title="missing-alt.html"
<img src="/assets/photos/DSC_9042_flood_edit_v2.jpg" /> <!-- **WRONG:** missing alt causes raw filename **ANNOUNCEMENT** -->
```

Under WCAG 2.2 Success Criterion 1.1.1 (Non-text Content, Level A), every non-text element must present a text alternative that serves an equivalent purpose. A missing `alt` attribute is an immediate, non-negotiable failure of both automated linters and human usability audits.

### The Three Personalities of Alt Text

Writing good alt text requires understanding what role the image plays in the narrative. The official W3C WAI Images Tutorial categorizes images into distinct functional types:

> Images must have text alternatives that describe the information or function represented by them. This ensures that images can be used by people with various disabilities. This tutorial demonstrates how to provide appropriate text alternatives based on the purpose of the image:
> - Informative images: Images that graphically represent concepts and information, typically pictures, photos, and illustrations. The text alternative should be at least a short description conveying the essential information presented by the image.
> - Decorative images: Provide a null text alternative (alt="") when the only purpose of an image is to add visual decoration to the page, rather than to convey information that is important to understanding the page.
> - Functional images: The text alternative of an image used as a link or as a button should describe the functionality of the link or button rather than the visual image.
*W3C, Images Tutorial, `resources/accessibility/wai/pages/design-develop/tutorials/images/index.md`*

Each personality demands a different authoring mindset:

```html title="image-types.html"
<img src="/assets/photos/flooded-bridge.jpg"
     alt="Muddy floodwaters reaching the steel trusses of Route 9 bridge, completely submerging the roadway" /> <!-- **RIGHT:** informative alt describes factual **MESSAGE** -->

<img src="/assets/icons/flourish-divider.svg"
     alt="" /> <!-- **RIGHT:** empty alt hides decorative flourish from **SCREEN READERS** -->

<a href="/alerts/rss">
  <img src="/assets/icons/rss-feed.svg"
       alt="Subscribe to breaking emergency RSS feed" /> <!-- **RIGHT:** functional alt communicates destination of **LINK** -->
</a>
```

If an image is informative, describe the scene's key facts, not its artistic composition. For our flood story, Marcus does not need to know that the photograph was shot on a 35mm lens with shallow depth of field. He needs to know that the water has reached the steel trusses and submerged the roadway.

If an image is functional, describe what clicking it accomplishes. An icon of an envelope inside a contact link should have `alt="Email the Newsroom"`, never `alt="White envelope with red wax seal"`.

### The Null Alt Law: Why `alt=""` Is Not Missing Alt

The second half of the interview question asks: when is alt left empty? Junior developers often believe that every single `<img>` tag must contain spoken text. They add descriptions to border patterns, hero background gradients, decorative arrows, and spacer graphics.

The result is auditory spam. A screen reader user navigating an article does not want to hear: "Blue geometric swoosh, graphic... Small gray horizontal line, graphic... Gold star ornament, graphic".

When an image is purely decorative, the correct implementation is null alt text: `alt=""`.

W3C Technique H67 details this exact mechanism:

> If no title attribute is used, and the alt text is set to null (i.e., alt="") it indicates to assistive technology that the image can be safely ignored.
> Having a "null" alt attribute is not the same as having no alt attribute.
*W3C, Techniques for WCAG 2.2: H67 Using null alt text and no title attribute on img elements for images that assistive technology should ignore, `resources/accessibility/wcag/techniques/html/H67.html`*

Notice the critical distinction: `alt=""` tells the browser accessibility tree that the image is presentational. The browser removes the node from the accessibility tree, allowing the screen reader to glide past the element as if it did not exist. In contrast, omitting the `alt` attribute entirely leaves an unlabelled node that forces the screen reader to speak the filename.

> [!KEY]
> An empty alt attribute (`alt=""`) actively instructs assistive software to ignore a decorative image; omitting the alt attribute forces the software to speak the raw file path.

### Three Antipatterns That Ruin Image Descriptions

Even when developers provide alt text, three pervasive mistakes routinely compromise the experience:

1. **The Redundant Role Antipattern.** Writing `alt="Photo of flooded bridge"` or `alt="Graphic showing stock chart"`. Screen readers automatically announce the element's role ("graphic" or "image") before reading the accessible name. Writing "Photo of" causes speech synthesizers to stutter: "Graphic, Photo of flooded bridge". Begin the description directly with the subject: `alt="Flooded bridge over the cresting river"`.

2. **The Redundant Caption Antipattern.** If an editorial article features a `<figcaption>` beneath the photograph stating "The Route 9 bridge was submerged at 6:15 AM on Tuesday," do not copy that exact sentence into the `alt` attribute. The screen reader will speak the sentence twice in succession. Instead, provide alt text that complements the caption by describing visual details the caption omits, or use `alt=""` if the visible caption already provides a complete equivalent.

3. **Keyword Stuffing for SEO.** Shoving dozens of search marketing terms into the alt attribute (`alt="best news valley news breaking news flood disaster weather emergency"`) corrupts the experience for visually impaired readers. Modern search engine algorithms penalize keyword-stuffed image tags, while accessibility linters flag them as spam.

> [!TIP]
> **To impress the interviewer:** define alt text through the three functional categories in the W3C WAI Images Tutorial: informative (describe facts not in text), functional (describe the action or destination of the control), and decorative (supply empty alt="" to hide visual fluff). Articulate Technique H67 verbatim: having a null alt attribute is not the same as having no alt attribute. Emphasize that omitting alt triggers raw filename speech fallbacks like "DSC_9042.jpg", while writing "Image of" introduces redundant role announcements because screen readers already announce the graphic role.

### Where you will meet this

- Breaking news hero images: describing disaster damage or political summits for non-visual readers rather than outputting CMS upload filenames.
- Social media sharing feeds: providing descriptive alt text inputs so journalists can describe embedded field photographs before publishing dispatches.
- E-commerce product galleries: describing clothing color, cut, and fabric details for shoppers who cannot inspect product photography visually.
- Navigation icon buttons: supplying action-oriented alt text like "Search archives" on magnifying glass icons rather than describing the magnifying glass artwork.
- User profile avatars: setting `alt=""` when the user's name is already displayed in plain text directly next to their circular profile picture.

### Glossary

- **Alternative Text (alt)**: An HTML attribute on image elements providing a textual equivalent of non-text content for assistive tools and search engines.
- **Null Alt (alt="")**: An empty alt attribute indicating to assistive technologies that an image is decorative and must be hidden from the accessibility tree.
- **Informative Image**: An image that graphically conveys factual concepts or editorial context, requiring concise descriptive alternative text.
- **Functional Image**: An image acting as an interactive control, such as a search icon button, where the alt text must describe the action rather than visual appearance.
- **File Name Fallback**: The screen reader fallback behavior where missing alt attributes trigger speech synthesis of raw image file paths.
- **Redundant Phrase Antipattern**: The authoring mistake of including phrases like "image of" or "picture of" in alt text, causing screen readers to duplicate the announced role.

### Summary

**Alternative Text as Contextual Communication**

In daily frontend engineering, image alt text is not an SEO metadata afterthought; it is the primary bridge that allows non-visual users to absorb graphic content. Sighted users digest photography, icons, and diagrams in parallel with typography, but assistive software requires explicit programmatic names to give graphics a voice. Omitting attributes introduces noisy file paths, while writing prose for decorative separators introduces verbal clutter. Here is your streetwise review.

❒ The Three Image Archetypes

1. Informative images require essential factual context.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Describe the editorial message conveyed by the image rather than trivial artistic composition.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Complement the surrounding text and caption rather than duplicating identical sentences.
2. Functional images require action descriptions.<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) When an image sits inside a link or button, describe what activating the control does.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Write `alt="Print article"` on a printer icon, not `alt="Gray desktop printer"`.
3. Decorative images demand null alt attributes (`alt=""`).<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) Set `alt=""` on background flourishes, spacer rules, and icons duplicated by adjacent text.<br>&nbsp;&nbsp;&nbsp;&nbsp;(b) Never omit the alt attribute entirely; missing alt forces user agents to speak raw filenames.

❒ The Developer's Levers

1. Never ship an image without an explicit `alt` attribute.

**DO NOT DO THIS:** Omit the alt attribute and force screen readers to speak raw file paths.
```html wrong
<img src="/photos/flood-bridge.jpg">
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Provide concise descriptive alt text that explains the scene.
```html right
<img src="/photos/flood-bridge.jpg" alt="Floodwaters submerging the Route 9 highway bridge">
```
2. Never announce decorative elements to assistive technology.

**DO NOT DO THIS:** Describe presentational divider icons that carry no informational value.
```html wrong
<img src="/icons/divider-leaf.svg" alt="Small decorative leaf divider">
```
&nbsp;&nbsp;&nbsp;&nbsp;**DO THIS:** Hide purely decorative elements using null alt.
```html right
<img src="/icons/divider-leaf.svg" alt="">
```

➔ NEVER include the phrases "image of" or "photo of" in your alt text.

➔ ALWAYS supply `alt=""` on decorative images to remove them cleanly from the accessibility tree.

➔ IF an image is an interactive control THEN write the action it performs rather than what it looks like.

| | **MISSING ALT**<br>(unlabelled) | **NULL ALT (`alt=""`)**<br>(decorative) |
| ---: | :--- | :--- |
| **Spoken output** | Raw filename string<br>(e.g. `DSC_9042.jpg`) | Completely silent;<br>skipped by screen reader |
| **Accessibility tree** | Unlabelled generic<br>graphic node | Node stripped from<br>accessibility tree |
| **Intended usage** | Never permitted in<br>production code | Dividers, flourishes,<br>and background icons |
| **Automated linters** | Immediate Level A<br>axe-core violation | Clean pass across all<br>compliance scanners |
| **User experience** | Distracting noise and<br>cognitive fatigue | Seamless reading flow<br>without interruption |
