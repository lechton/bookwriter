#!/usr/bin/env python3
import os
import re
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_DIR = os.path.dirname(os.path.dirname(os.path.dirname(BASE_DIR)))
QUESTIONS_FILE = os.path.join(REPO_DIR, 'diagram-lab', 'questions-css', 'questions.md')
MD_LECTURES_DIR = os.path.join(BASE_DIR, 'md-lectures')
HTML_DIR = os.path.join(BASE_DIR, 'md-lectures-html')
PDF_DIR = os.path.join(BASE_DIR, 'md-lectures-pdf')

# 1. Parse questions.md
with open(QUESTIONS_FILE, 'r', encoding='utf-8') as fp:
    q_lines = fp.readlines()

questions = {}
for line in q_lines:
    line = line.strip()
    if not line.startswith('|'):
        continue
    parts = [p.strip() for p in line.split('|')[1:-1]]
    if len(parts) >= 5 and parts[0].isdigit():
        num = int(parts[0])
        tier = parts[1]
        topic = parts[2].replace('`', '')
        q_text = parts[3]
        hook = parts[4]
        questions[num] = {
            'num': num,
            'tier': tier,
            'topic': topic,
            'question': q_text,
            'hook': hook
        }

# Curated titles and polished takeaways for specific items and upcoming lectures
FALLBACKS = {
    7: {
        'title': 'The Escaped Tooltip',
        'key': 'Always apply `position: relative` to the parent container when anchoring absolute tooltips, establishing an active containing block without altering normal document flow.'
    },
    45: {
        'title': 'The Inception Rule: Over-Nesting, Specificity Creep, and Rendering Cost',
        'key': 'Over-nesting creates runtime debt by multiplying descendant combinator overhead and specificity; author flat, shallow selectors decoupled from DOM nesting.'
    },
    46: {
        'title': 'Architecture at Scale: Choosing Between BEM, CSS Modules, and Tailwind in 2026',
        'key': 'For modern component frameworks, Tailwind with token variables maximizes velocity; for clean separation of concerns, CSS Modules excels; across heterogeneous backend templates, BEM delivers zero-dependency resilience.'
    },
    47: {
        'title': 'The Viewport Contract: Layout Viewports, Visual Viewports, and the Mobile Meta Tag',
        'key': 'Never include `user-scalable=no` or `maximum-scale=1.0` in viewport meta tags; preserving user pinch-zoom is mandatory under WCAG 1.4.4.'
    },
    57: {
        'title': 'Pointer Interaction Media: Hover Traps and Touch Adaptation',
        'key': 'Wrap desktop hover styles and tooltips inside `@media (hover: hover) and (pointer: fine)` to prevent sticky ghost hover states and unintended navigation on touch screens.'
    },
    58: {
        'title': 'The Elastic Layout: Surviving 400% Zoom and Text-Spacing Overrides',
        'key': 'Ban fixed-height containers, express typography and spacing in `rem` and `em`, and audit with WCAG text-spacing overrides to prevent catastrophic content clipping.'
    },
    59: {
        'title': 'Logical Properties and Values: Decoupling Direction from Flow',
        'key': 'Replace physical coordinate properties with flow-relative logical properties like `margin-inline` and `inset-inline-start` to support RTL and vertical writing modes effortlessly.'
    },
    60: {
        'title': 'Print Stylesheets: Media Architecture, Page Breaks, and Clean Layouts',
        'key': 'Use `@media print` to suppress interactive navigation, unclamp scrollable containers, expand link URLs with `attr(href)`, and prevent awkward splits with `break-inside: avoid`.'
    },
    61: {
        'title': 'Resets Versus Normalization: Evolution of Cross-Browser Baselines',
        'key': 'CSS resets aggressively zero out all browser default styles, whereas Normalize.css preserves useful element defaults while correcting cross-browser bugs; modern architectures combine box-sizing resets with opinionated baseline styles.'
    },
    62: {
        'title': 'Progressive Enhancement with Feature Queries: The @supports Rule',
        'key': 'Feature queries allow developers to test browser engine support for CSS properties, layering modern layout mechanisms over stable fallback baselines without fragile user-agent sniffing.'
    },
    63: {
        'title': 'Systematic Cross-Browser Debugging: Isolation, Reduction, and Workarounds',
        'key': 'Isolate browser layout discrepancies by reducing code to a minimal reproducible test case, inspecting computed user-agent properties on real hardware, and deploying targeted standards-based workarounds.'
    }
}

# 2. Enrich from md-lectures/*.md
lectures = []
for i in range(1, 64):
    fname = f"{i:02d}.md"
    fpath = os.path.join(MD_LECTURES_DIR, fname)
    if not os.path.exists(fpath):
        fpath = os.path.join(MD_LECTURES_DIR, f"{i}.md")
        fname = f"{i}.md"
    
    full_title = ""
    sub_title = ""
    key_takeaway = ""
    
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as fp:
            content = fp.read()
            
        m_title = re.search(r'^#\s+(.*?)$', content, re.M)
        full_title = m_title.group(1) if m_title else f"Lecture {i}"
        sub_title = re.sub(r'^Lecture\s+\d+:\s*', '', full_title)
        
        m_key = re.search(r'>\s*\[!KEY\]\s*\n+>\s*(.*?)(?:\n\n|\n>|\n#|$)', content, re.S)
        if m_key:
            key_takeaway = m_key.group(1).replace('\n> ', ' ').strip()
        else:
            always = re.search(r'➔\s*ALWAYS\s+(.*?)$', content, re.M)
            never = re.search(r'➔\s*NEVER\s+(.*?)$', content, re.M)
            if always:
                key_takeaway = f"Always {always.group(1).strip()}"
            elif never:
                key_takeaway = f"Never {never.group(1).strip()}"
            else:
                m_alt = re.search(r'\*\*Key Takeaway:\*\*\s*(.*?)$', content, re.M)
                key_takeaway = m_alt.group(1).strip() if m_alt else ""
        
        # Clean formatting artifacts
        key_takeaway = re.sub(r'<br\s*/?>', '', key_takeaway).strip()
        key_takeaway = re.sub(r'^\*\*Key Takeaway:\*\*\s*', '', key_takeaway).strip()
    
    # Apply curated fallback if missing or explicitly defined
    if i in FALLBACKS:
        if not sub_title:
            sub_title = FALLBACKS[i]['title']
            full_title = f"Lecture {i}: {sub_title}"
        if i in [7, 45, 46, 47, 57, 58, 59, 60, 61, 62, 63]:
            key_takeaway = FALLBACKS[i]['key']
    elif not sub_title:
        sub_title = questions.get(i, {}).get('topic', f'Topic {i}').replace('#', '').replace('_', ' ').title()
        full_title = f"Lecture {i}: {sub_title}"

    q_data = questions.get(i, {
        'num': i,
        'tier': '❱ CORE' if i <= 20 or (35 <= i <= 38) or (47 <= i <= 53) else ('❱❱ MORE' if i <= 33 or (39 <= i <= 44) or (54 <= i <= 60) else '❱❱❱ ADVANCED'),
        'topic': f'#topic_{i}',
        'question': full_title,
        'hook': ''
    })
    
    lectures.append({
        'id': i,
        'id_str': f"{i:02d}",
        'full_title': full_title,
        'title': sub_title,
        'tier': q_data['tier'],
        'topic': q_data['topic'],
        'question': q_data['question'],
        'hook': q_data['hook'],
        'key': key_takeaway,
        'md_file': f"md-lectures/{i:02d}.md",
        'html_file': f"md-lectures-html/{i:02d}.html",
        'pdf_file': f"md-lectures-pdf/{i:02d}.pdf"
    })

# 3. Build Markdown TOC
md_lines = [
    "# Table of Contents: Mastering Modern CSS Architecture",
    "",
    "> A unified, dependency-ordered curriculum of **63 technical lectures** covering CSS Foundations & Layout Mechanics (Q01–Q34), Architecture & Preprocessors (Q35–Q46), and Responsive, Accessible & Cross-Browser Engineering (Q47–Q63). Designed for engineering mastery and staff-level technical interview preparation.",
    "",
    "---",
    "",
    "## Curriculum Architecture & Pedagogy",
    "",
    "- **Organic Lexical Audit (OLA)**: Concepts are grounded in real-world, high-stakes editorial scenarios from the newsroom of *The National Times* (broken layouts, cascading style conflicts, unclickable overlays, clipping modals, janky animations, mobile zoom failures).",
    "- **Harmonious Code + UI Step Rhythm**: Every section opens with contextual framing, followed immediately by a minimal code snippet directly preceding authentic UI canvases (Isolated Component, Realistic Browser Window, or Compiler Geometry Substrates) before analytical derivations.",
    "- **Seven Proven UI Archetypes**: Visualizations employ strict graphical substrates: DOM traversal trees, realistic virtual device viewports, architectural zoom viewfinders, specificity escalation ladders, multi-paradigm design token comparisons, stylesheet growth curves, and compiler geometry AST transforms.",
    "- **Curriculum Typology Tiers**:",
    "  - `❱ CORE` (31 Lectures): The cascade, specificity scoring, the box model, margin collapsing, block formatting contexts, flexbox & grid track arithmetic, BEM methodology grammar, and mobile-first viewports.",
    "  - `❱❱ MORE` (26 Lectures): Pseudo-elements, hardware-accelerated motion, dynamic cascade custom properties, intrinsic sizing, subgrid, popover & anchor positioning, Sass/Less modularity, container queries, dark mode, and accessibility preference media.",
    "  - `❱❱❱ ADVANCED` (6 Lectures): Modern cascade layers (`@layer`) & `@scope`, preprocessor over-nesting pitfalls & compiler cost, 2026 enterprise styling migrations (BEM vs CSS Modules vs Tailwind), CSS reset vs normalization mechanics, feature queries (`@supports`), and systematic cross-browser debugging.",
    "",
    "## Recommended Reading Paths",
    "",
    "1. **Full Curriculum (Q01–Q63)**: Comprehensive front-to-back mastery of modern CSS architecture, layout engines, and cross-browser rendering.",
    "2. **CSS Mechanics & Modern Layout Specialist (Q01–Q34)**: Deep dive into the cascade tournament, box geometry, flexbox/grid coordinate algorithms, modern selectors (`:is`, `:where`, `:has`), and top layer primitives (popovers, anchor positioning).",
    "3. **Design Systems & Architecture Track (Q35–Q46)**: Scaling CSS in engineering teams, BEM namespace grammar, preprocessor modularity (`@use`/`@forward`), AST compilation mechanics, and enterprise styling migrations.",
    "4. **Responsive, Accessible & Compatibility Track (Q47–Q63)**: Layout viewports, fluid typography without media queries, container queries, dark mode orchestration, forced-colors & reduced-motion accessibility, and cross-browser debugging.",
    "",
    "---",
    "",
    "## Part One: CSS Review & Core Mechanics (Q01–Q34)",
    "",
    "### ❱ CORE — The Cascade and the Box (Q01–Q14)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
]

for lec in lectures[0:14]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱ CORE — Layout Systems & Track Geometry (Q15–Q20)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[14:20]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱ MORE — Mechanics and Modern CSS (Q21–Q33)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[20:33]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱❱ ADVANCED — The Modern Cascade & Architecture (Q34)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[33:34]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "---",
    "",
    "## Part Two: Architecture and Preprocessors (Q35–Q46)",
    "",
    "### ❱ CORE — Naming and Methodology (Q35–Q38)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[34:38]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱ MORE — Architecture in Practice (Q39–Q44)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[38:44]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱❱ ADVANCED — Preprocessor Mastery & System Design (Q45–Q46)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[44:46]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "---",
    "",
    "## Part Three: Responsive, Accessible, and Cross-Browser CSS (Q47–Q63)",
    "",
    "### ❱ CORE — Responsive Foundations & Fluid Layout (Q47–Q53)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[46:53]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱ MORE — Adaptation, Container Queries & User Preferences (Q54–Q60)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[53:60]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱❱ ADVANCED — Cross-Browser Engineering & Progressive Enhancement (Q61–Q63)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[60:63]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "---",
    "",
    "## Master Reader Deck",
    "- **Lecture Deck (Q01–Q56)**: [CSS Q01-Q56.pdf](md-lectures-pdf/CSS%20Q01-Q56.pdf) — Production lectures compiled in sequential order.",
    ""
])

toc_md_path = os.path.join(BASE_DIR, '00_TOC.md')
with open(toc_md_path, 'w', encoding='utf-8') as fp:
    fp.write('\n'.join(md_lines))
print(f"Generated {toc_md_path}")


# 4. Build Customized HTML TOC (Print-ready & Web-ready)
import html

SVG_CHEVRON_BADGE = '<svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -0.5px; margin-right: 1.5px;"><polyline points="9 18 15 12 9 6"></polyline></svg>'
SVG_CHEVRON_HEADING = '<svg xmlns="http://www.w3.org/2000/svg" width="9.5" height="9.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -0.5px; margin-right: 2px;"><polyline points="9 18 15 12 9 6"></polyline></svg>'

def html_badge_tier(tier_str):
    return tier_str.replace('❱', SVG_CHEVRON_BADGE)

def html_heading_tier(tier_str):
    return tier_str.replace('❱', SVG_CHEVRON_HEADING)

def tier_class(tier):
    if 'CORE' in tier:
        return 'badge-core'
    elif 'MORE' in tier:
        return 'badge-more'
    else:
        return 'badge-adv'

def format_text(text):
    if not text:
        return ""
    safe = html.escape(text)
    # Convert `code` to <code>code</code>
    safe = re.sub(r'`([^`]+)`', r'<code>\1</code>', safe)
    return safe

def render_table_rows(subset):
    rows = []
    for l in subset:
        t_cls = tier_class(l['tier'])
        title_fmt = format_text(l['title'])
        q_fmt = format_text(l['question'])
        hook_fmt = format_text(l['hook'])
        key_fmt = format_text(l['key'])
        rows.append(f"""
        <tr>
          <td class="col-num"><strong>{l['id_str']}</strong></td>
          <td class="col-title">
            <div class="lec-title">{title_fmt}</div>
            <div class="lec-q">{q_fmt}</div>
            <div class="lec-hook"><em>Scenario:</em> {hook_fmt}</div>
          </td>
          <td class="col-meta">
            <span class="badge {t_cls}">{html_badge_tier(l['tier'])}</span>
            <span class="topic-tag">{l['topic']}</span>
          </td>
          <td class="col-key">{key_fmt}</td>
        </tr>""")
    return '\n'.join(rows)

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Curriculum Table of Contents — Mastering Modern CSS Architecture</title>
  <style>
    @page {{
      size: letter;
      margin: 14mm 16mm 14mm 16mm;
      @bottom-left {{
        content: "Table of Contents — Mastering Modern CSS Architecture";
        border-top: 0.5pt solid #e2e8f0;
        padding-top: 3mm;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        color: #94a3b8;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }}
      @bottom-right {{
        content: "Page " counter(page) " of " counter(pages);
        border-top: 0.5pt solid #e2e8f0;
        padding-top: 3mm;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 8pt;
        font-weight: 700;
        color: #0e7490;
      }}
    }}
    
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.45;
      font-size: 9.5pt;
    }}

    code {{
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 7.5pt;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 0.5px 3.5px;
      border-radius: 3px;
      color: #0f172a;
    }}
    
    .toc-header {{
      padding-bottom: 12px;
      margin-bottom: 14px;
      border-bottom: 2px solid #0e7490;
    }}
    
    .kicker {{
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #0e7490;
      margin: 0 0 4px;
    }}
    
    h1 {{
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }}
    
    .subtitle {{
      font-size: 10.5pt;
      color: #475569;
      margin: 0 0 10px;
    }}
    
    .metrics-ribbon {{
      display: flex;
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 8pt;
      font-weight: 600;
      color: #334155;
    }}
    .metrics-ribbon span {{
      display: inline-block;
    }}
    .metrics-ribbon span strong {{
      color: #0e7490;
    }}
    
    .section-banner {{
      margin-top: 18px;
      margin-bottom: 8px;
      padding: 6px 10px;
      background: #0f172a;
      color: #ffffff;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      page-break-after: avoid;
      break-after: avoid;
    }}
    .section-banner h2 {{
      margin: 0;
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: #ffffff;
    }}
    .section-banner .track-meta {{
      font-size: 8pt;
      color: #94a3b8;
      font-weight: 600;
    }}
    
    .tier-heading {{
      font-size: 9.5pt;
      font-weight: 700;
      color: #334155;
      margin: 12px 0 6px;
      padding-left: 4px;
      border-left: 3px solid #0e7490;
      page-break-after: avoid;
      break-after: avoid;
    }}
    
    table {{
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      page-break-inside: auto;
    }}
    
    thead {{
      display: table-header-group;
    }}
    
    tr {{
      page-break-inside: avoid;
      break-inside: avoid;
      border-bottom: 1px solid #e2e8f0;
    }}
    
    tr:nth-child(even) {{
      background: #f8fafc;
    }}
    
    th {{
      text-align: left;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748b;
      padding: 5px 6px;
      border-bottom: 1.5pt solid #cbd5e1;
      background: #ffffff;
    }}
    
    td {{
      padding: 6px 6px;
      vertical-align: top;
      font-size: 8.5pt;
    }}
    
    .col-num {{
      width: 32px;
      text-align: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9pt;
      color: #0e7490;
    }}
    
    .col-title {{
      width: 36%;
    }}
    
    .lec-title {{
      font-weight: 700;
      color: #0f172a;
      font-size: 9pt;
      margin-bottom: 2px;
    }}
    
    .lec-q {{
      color: #1e293b;
      font-size: 8pt;
      line-height: 1.3;
      margin-bottom: 2px;
    }}
    
    .lec-hook {{
      color: #64748b;
      font-size: 7.5pt;
      line-height: 1.25;
    }}
    
    .col-meta {{
      width: 20%;
    }}
    
    .badge {{
      display: inline-block;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 6.5pt;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin-bottom: 3px;
    }}
    .badge-core {{
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }}
    .badge-more {{
      background: #e0e7ff;
      color: #3730a3;
      border: 1px solid #c7d2fe;
    }}
    .badge-adv {{
      background: #fae8ff;
      color: #86198f;
      border: 1px solid #f5d0fe;
    }}
    
    .topic-tag {{
      display: block;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 7.5pt;
      color: #0e7490;
      font-weight: 600;
    }}
    
    .col-key {{
      width: 40%;
      color: #334155;
      font-size: 8pt;
      line-height: 1.35;
    }}
    
    .page-break-before {{
      page-break-before: always;
      break-before: page;
    }}
  </style>
</head>
<body>

  <header class="toc-header">
    <p class="kicker">Official Syllabus &amp; Course Architecture</p>
    <h1>Mastering Modern CSS Architecture</h1>
    <p class="subtitle">Complete 63-Lecture Interview Curriculum — From the Cascade, Box Model &amp; Modern Layouts to Preprocessors, Container Queries &amp; Cross-Browser Engineering</p>
    <div class="metrics-ribbon">
      <span><strong>63</strong> Master Lectures</span>
      <span>•</span>
      <span><strong>3</strong> Core Tracks (Foundations Q01–Q34, Preprocessors Q35–Q46, Responsive Q47–Q63)</span>
      <span>•</span>
      <span><strong>3</strong> Depth Tiers (31 CORE / 26 MORE / 6 ADVANCED)</span>
      <span>•</span>
      <span><strong>126+</strong> Visual UI &amp; Engine Canvases</span>
    </div>
  </header>

  <!-- PART ONE -->
  <section class="track-section">
    <div class="section-banner">
      <h2>Part One: CSS Review &amp; Core Mechanics (Q01–Q34)</h2>
      <span class="track-meta">Cascade, Specificity, Box Geometry, Flexbox/Grid &amp; Modern Primitives</span>
    </div>

    <div class="tier-heading">{html_heading_tier("❱ CORE")} — The Cascade and the Box (Q01–Q14)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[0:14])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱ CORE")} — Layout Systems &amp; Track Geometry (Q15–Q20)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[14:20])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱ MORE")} — Mechanics and Modern CSS (Q21–Q33)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[20:33])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱❱ ADVANCED")} — The Modern Cascade &amp; Architecture (Q34)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[33:34])}
      </tbody>
    </table>
  </section>

  <!-- PART TWO -->
  <section class="track-section page-break-before">
    <div class="section-banner">
      <h2>Part Two: Architecture and Preprocessors (Q35–Q46)</h2>
      <span class="track-meta">Methodologies, BEM Grammars, Sass/Less Modularity &amp; Enterprise Scale</span>
    </div>

    <div class="tier-heading">{html_heading_tier("❱ CORE")} — Naming and Methodology (Q35–Q38)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[34:38])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱ MORE")} — Architecture in Practice (Q39–Q44)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[38:44])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱❱ ADVANCED")} — Preprocessor Mastery &amp; System Design (Q45–Q46)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[44:46])}
      </tbody>
    </table>
  </section>

  <!-- PART THREE -->
  <section class="track-section page-break-before">
    <div class="section-banner">
      <h2>Part Three: Responsive, Accessible, and Cross-Browser CSS (Q47–Q63)</h2>
      <span class="track-meta">Viewports, Fluid Math, Container Queries, Dark Mode &amp; Compatibility</span>
    </div>

    <div class="tier-heading">{html_heading_tier("❱ CORE")} — Responsive Foundations &amp; Fluid Layout (Q47–Q53)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[46:53])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱ MORE")} — Adaptation, Container Queries &amp; User Preferences (Q54–Q60)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[53:60])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱❱ ADVANCED")} — Cross-Browser Engineering &amp; Progressive Enhancement (Q61–Q63)</div>
    <table>
      <thead>
        <tr>
          <th style="width:32px;">#</th>
          <th style="width:36%;">Lecture &amp; Interview Question</th>
          <th style="width:20%;">Topic &amp; Tier</th>
          <th style="width:40%;">Core Architectural Takeaway</th>
        </tr>
      </thead>
      <tbody>
        {render_table_rows(lectures[60:63])}
      </tbody>
    </table>
  </section>

</body>
</html>
"""

toc_html_path = os.path.join(BASE_DIR, '00_TOC.html')
with open(toc_html_path, 'w', encoding='utf-8') as fp:
    fp.write(html_content)
print(f"Generated {toc_html_path}")

# 5. Compile to PDF with Prince
toc_pdf_path = os.path.join(BASE_DIR, '00_TOC.pdf')
cmd = ['prince', toc_html_path, '-o', toc_pdf_path]
print(f"Running: {' '.join(cmd)}")
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(f"Successfully generated {toc_pdf_path}")
else:
    print(f"Prince error ({res.returncode}): {res.stderr}")

# 6. Copy to md-lectures-html and md-lectures-pdf
with open(os.path.join(HTML_DIR, '00_TOC.html'), 'w', encoding='utf-8') as fp:
    fp.write(html_content)
subprocess.run(['cp', toc_pdf_path, os.path.join(PDF_DIR, '00_TOC.pdf')])
print(f"Synchronized 00_TOC.html and 00_TOC.pdf into md-lectures-html/ and md-lectures-pdf/")
