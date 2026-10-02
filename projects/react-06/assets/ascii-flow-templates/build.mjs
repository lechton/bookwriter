import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const mdPath = join(__dirname, 'demo.md');
const cssPath = join(__dirname, 'ascii-flow.css');
const htmlPath = join(__dirname, 'demo.html');
const pdfPath = join(__dirname, 'demo.pdf');
const screenshotsDir = join(__dirname, 'screenshots');

if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true });
}

console.log('[ascii-catalog] Reading demo.md...');
let md = readFileSync(mdPath, 'utf8');

// Replace template comments <!-- template: path --> with inlined HTML
md = md.replace(/<!--\s*template:\s*([^\s]+)\s*-->/g, (match, relPath) => {
  const fullPath = join(__dirname, relPath);
  if (existsSync(fullPath)) {
    return readFileSync(fullPath, 'utf8');
  }
  return `<div style="color:red;">Missing template: ${relPath}</div>`;
});

// Parser for titles, code blocks, and markdown sections
const lines = md.split('\n');
let htmlBody = '';
let inCode = false;
let codeBuf = [];
let inRawHtml = false;
let inSection = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Raw HTML block pass-through
  if (line.includes('<div class="ascii-card-figure">')) {
    inRawHtml = true;
    htmlBody += line + '\n';
    continue;
  }
  if (inRawHtml) {
    htmlBody += line + '\n';
    if (line.trim() === '</div>') {
      inRawHtml = false;
    }
    continue;
  }

  if (line.startsWith('```')) {
    if (inCode) {
      htmlBody += `<div class="archetype-code"><pre><code>${codeBuf.join('\n')}</code></pre></div>\n`;
      codeBuf = [];
      inCode = false;
    } else {
      inCode = true;
    }
    continue;
  }

  if (line.startsWith('//') || inCode) {
    if (inCode) {
      codeBuf.push(line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      continue;
    }
  }

  if (line.startsWith('# ')) {
    htmlBody += `<h1>${line.slice(2)}</h1>\n`;
  } else if (line.startsWith('> ')) {
    htmlBody += `<div class="catalog-subtitle">${line.slice(2)}</div>\n`;
  } else if (line.startsWith('## Archetype ')) {
    if (inSection) {
      htmlBody += `</div><!-- end archetype-section -->\n`;
    }
    const title = line.slice(3);
    htmlBody += `<div class="archetype-section">\n<div class="archetype-header"><div class="archetype-tag">Canonical Flow Archetype</div><div class="archetype-title">${title}</div></div>\n`;
    inSection = true;
  } else if (line.startsWith('## ')) {
    if (inSection) {
      htmlBody += `</div><!-- end archetype-section -->\n`;
    }
    const title = line.slice(3);
    htmlBody += `<div class="archetype-section">\n<div class="archetype-header"><div class="archetype-tag">Architectural Laboratory &amp; Experiments</div><div class="archetype-title">${title}</div></div>\n`;
    inSection = true;
  } else if (line.startsWith('---')) {
    if (inSection) {
      htmlBody += `</div><!-- end archetype-section -->\n`;
      inSection = false;
    }
  } else if (line.startsWith('* **')) {
    htmlBody += `<p class="archetype-desc">${line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')}</p>\n`;
  } else if (line.trim().length > 0) {
    htmlBody += `<p class="archetype-desc">${line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')}</p>\n`;
  }
}

if (inSection) {
  htmlBody += `</div><!-- end archetype-section -->\n`;
  inSection = false;
}

const fullHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>React Architectural Informational Flow Catalog</title>
<link rel="stylesheet" href="ascii-flow.css">
</head>
<body>
<main>
${htmlBody}
</main>
</body>
</html>`;

writeFileSync(htmlPath, fullHtml, 'utf8');
console.log(`[ascii-catalog] Generated ${htmlPath}`);

console.log('[ascii-catalog] Compiling PDF via Prince...');
try {
  execSync(`prince "${htmlPath}" -o "${pdfPath}"`, { stdio: 'inherit' });
  console.log(`[ascii-catalog] Successfully compiled ${pdfPath}`);
} catch (e) {
  console.error('[ascii-catalog] Prince compilation failed:', e.message);
}

console.log('[ascii-catalog] Clearing old screenshots and generating new page screenshots...');
try {
  execSync(`rm -f "${join(screenshotsDir, 'page*.png')}"`, { stdio: 'inherit' });
  execSync(`pdftoppm -png -r 150 "${pdfPath}" "${join(screenshotsDir, 'page')}"`, { stdio: 'inherit' });
  console.log(`[ascii-catalog] Screenshots saved to ${screenshotsDir}`);
} catch (e) {
  console.error('[ascii-catalog] Screenshot generation failed:', e.message);
}

console.log('[ascii-catalog] Done!');
