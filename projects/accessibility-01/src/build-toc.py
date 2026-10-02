#!/usr/bin/env python3
import os
import re
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_DIR = os.path.dirname(os.path.dirname(os.path.dirname(BASE_DIR)))
QUESTIONS_FILE = os.path.join(REPO_DIR, 'diagram-lab', 'questions-accessibility', 'questions.md')
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

# 2. Enrich from md-lectures/*.md
lectures = []
for i in range(1, 55):
    fname = f"{i:02d}.md"
    fpath = os.path.join(MD_LECTURES_DIR, fname)
    if not os.path.exists(fpath):
        fpath = os.path.join(MD_LECTURES_DIR, f"{i}.md")
        fname = f"{i}.md"
    
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
            key_takeaway = questions.get(i, {}).get('question', '')

    q_data = questions.get(i, {
        'num': i,
        'tier': '❱ CORE' if i <= 17 or (35 <= i <= 43) else ('❱❱ MORE' if i <= 26 or (44 <= i <= 49) else '❱❱❱ ADVANCED'),
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
    "# Table of Contents: Accessibility & Web Performance Master Series",
    "",
    "> A unified, dependency-ordered curriculum of **54 technical lectures** covering Web Accessibility (Q01–Q34) and Web Performance (Q35–Q54). Designed for engineering mastery and staff-level technical interview preparation.",
    "",
    "---",
    "",
    "## Curriculum Architecture & Pedagogy",
    "",
    "- **Organic Lexical Audit (OLA)**: Concepts are grounded in real-world high-stakes scenarios from the newsroom of *The National Times* (broken checkouts, silent validation errors, frozen market feeds, memory leaks).",
    "- **Harmonious Code + UI Rhythm**: Sections open with contextual framing, followed immediately by minimal code snippets and two-element comparative canvases before analytical derivations.",
    "- **Curriculum Typology Tiers**:",
    "  - `❱ CORE` (26 Lectures): Foundational semantic HTML, WCAG principles, Core Web Vitals, and network delivery.",
    "  - `❱❱ MORE` (15 Lectures): Applied form handling, keyboard focus management, live regions, profiling, and resource hints.",
    "  - `❱❱❱ ADVANCED` (13 Lectures): Custom UI state machines, testing methodologies, single-thread yielding, V8 compilation pipeline, and memory leaks.",
    "",
    "## Recommended Reading Paths",
    "",
    "1. **Full Curriculum (Q01–Q54)**: Comprehensive front-to-back mastery of modern web standards and runtime performance.",
    "2. **Accessibility Specialist Track (Q01–Q34)**: Core semantics, keyboard traps, ARIA state contracts, screen reader testing, and audit strategy.",
    "3. **Web Performance & Architecture Track (Q35–Q54)**: Critical rendering path, bundle budgets, Core Web Vitals, event loop starvation, V8 shapes, and garbage collection.",
    "",
    "---",
    "",
    "## Part One: Web Accessibility (Q01–Q34)",
    "",
    "### ❱ CORE — Foundations and Content (Q01–Q17)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
]

for lec in lectures[0:17]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱ MORE — Forms, Focus, and Basic ARIA (Q18–Q26)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[17:26]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱❱ ADVANCED — Patterns and Testing (Q27–Q34)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[26:34]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "---",
    "",
    "## Part Two: Web Performance & Runtime Internals (Q35–Q54)",
    "",
    "### ❱ CORE — Loading and the Network (Q35–Q43)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[34:43]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱ MORE — Measurement and Optimization (Q44–Q49)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[43:49]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "### ❱❱❱ ADVANCED — Runtime and Engine Internals (Q50–Q54)",
    "",
    "| # | Lecture | Topic & Tier | Interview Question & Core Takeaway |",
    "|---|---|---|---|",
])

for lec in lectures[49:54]:
    md_lines.append(f"| **{lec['id_str']}** | [{lec['title']}]({lec['md_file']})<br>([PDF]({lec['pdf_file']})) | `{lec['topic']}`<br>`{lec['tier']}` | **Q:** {lec['question']}<br>**Key:** {lec['key']} |")

md_lines.extend([
    "",
    "---",
    "",
    "## Master Reader Deck",
    "- **Complete Master Book (Cover + TOC + 54 Lectures)**: [Web Accessibility & Web Performance.pdf](Web%20Accessibility%20&%20Web%20Performance.pdf) — Complete 657-page volume bound in single sequential order.",
    "- **Lecture Deck**: [Accessibility Q01-Q54.pdf](md-lectures-pdf/Accessibility%20Q01-Q54.pdf)",
    ""
])

toc_md_path = os.path.join(BASE_DIR, '00_TOC.md')
with open(toc_md_path, 'w', encoding='utf-8') as fp:
    fp.write('\n'.join(md_lines))
print(f"Generated {toc_md_path}")


# 4. Build Customized HTML TOC (Print-ready & Web-ready)
# Exact vector chevron from src/build-lectures.mjs
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

def render_table_rows(subset):
    rows = []
    for l in subset:
        t_cls = tier_class(l['tier'])
        rows.append(f"""
        <tr>
          <td class="col-num"><strong>{l['id_str']}</strong></td>
          <td class="col-title">
            <div class="lec-title">{l['title']}</div>
            <div class="lec-q">{l['question']}</div>
            <div class="lec-hook"><em>Scenario:</em> {l['hook']}</div>
          </td>
          <td class="col-meta">
            <span class="badge {t_cls}">{html_badge_tier(l['tier'])}</span>
            <span class="topic-tag">{l['topic']}</span>
          </td>
          <td class="col-key">{l['key']}</td>
        </tr>""")
    return '\n'.join(rows)

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Curriculum Table of Contents — Accessibility &amp; Web Performance</title>
  <style>
    @page {{
      size: letter;
      margin: 14mm 16mm 14mm 16mm;
      @bottom-left {{
        content: "Table of Contents — Accessibility & Web Performance";
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
      width: 22%;
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
      width: 38%;
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
    <h1>Web Accessibility &amp; Web Performance</h1>
    <p class="subtitle">Complete 54-Lecture Interview Curriculum — From Semantic DOM &amp; WCAG AA to Browser Runtime Engines</p>
    <div class="metrics-ribbon">
      <span><strong>54</strong> Master Lectures</span>
      <span>•</span>
      <span><strong>2</strong> Core Tracks (A11y Q01–Q34 &amp; Perf Q35–Q54)</span>
      <span>•</span>
      <span><strong>3</strong> Depth Tiers (CORE / MORE / ADVANCED)</span>
      <span>•</span>
      <span><strong>108</strong> Visual UI &amp; Engine Canvases</span>
    </div>
  </header>

  <!-- PART ONE -->
  <section class="track-section">
    <div class="section-banner">
      <h2>Part One: Web Accessibility (Q01–Q34)</h2>
      <span class="track-meta">Standards, Semantic Trees, Assistive Technologies &amp; Patterns</span>
    </div>

    <div class="tier-heading">{html_heading_tier("❱ CORE")} — Foundations and Content (Q01–Q17)</div>
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
        {render_table_rows(lectures[0:17])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱ MORE")} — Forms, Focus, and Basic ARIA (Q18–Q26)</div>
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
        {render_table_rows(lectures[17:26])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱❱ ADVANCED")} — Patterns and Testing (Q27–Q34)</div>
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
        {render_table_rows(lectures[26:34])}
      </tbody>
    </table>
  </section>

  <!-- PART TWO -->
  <section class="track-section page-break-before">
    <div class="section-banner">
      <h2>Part Two: Web Performance &amp; Runtime Internals (Q35–Q54)</h2>
      <span class="track-meta">Critical Path, Core Web Vitals, JIT Optimization &amp; Memory</span>
    </div>

    <div class="tier-heading">{html_heading_tier("❱ CORE")} — Loading and the Network (Q35–Q43)</div>
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
        {render_table_rows(lectures[34:43])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱ MORE")} — Measurement and Optimization (Q44–Q49)</div>
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
        {render_table_rows(lectures[43:49])}
      </tbody>
    </table>

    <div class="tier-heading">{html_heading_tier("❱❱❱ ADVANCED")} — Runtime and Engine Internals (Q50–Q54)</div>
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
        {render_table_rows(lectures[49:54])}
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
