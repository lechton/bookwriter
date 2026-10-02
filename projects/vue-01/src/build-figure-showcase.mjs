import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = resolve(__dirname, '../md-lectures/figures/templates');
const SHOWCASE_SRC = resolve(TEMPLATES_DIR, 'figures_showcase.html');
const SHOWCASE_OUT_HTML = resolve(TEMPLATES_DIR, 'figures_showcase_assembled.html');
const SHOWCASE_OUT_PDF = resolve(__dirname, '../Vue Figure Templates.pdf');

let html = readFileSync(SHOWCASE_SRC, 'utf8');

// Replace <!--#include "..."--> with actual file contents
html = html.replace(/<!--#include\s+"([^"]+)"-->/g, (match, filename) => {
  const filePath = resolve(TEMPLATES_DIR, filename);
  try {
    return readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error inlining ${filename}:`, err.message);
    return `<!-- Missing ${filename} -->`;
  }
});

writeFileSync(SHOWCASE_OUT_HTML, html, 'utf8');
console.log(`Assembled showcase HTML written to: ${SHOWCASE_OUT_HTML}`);

// Run automatic cleanup of temporary inspection images
import './clean-inspection-images.mjs';

try {
  console.log(`Rendering PDF via Prince...`);
  execFileSync('prince', [SHOWCASE_OUT_HTML, '-o', SHOWCASE_OUT_PDF], { stdio: 'inherit' });
  console.log(`Successfully generated: ${SHOWCASE_OUT_PDF}`);

  const info = execFileSync('pdfinfo', [SHOWCASE_OUT_PDF], { encoding: 'utf8' });
  const pageMatch = info.match(/Pages:\s+(\d+)/);
  const pages = pageMatch ? parseInt(pageMatch[1], 10) : 0;
  console.log(`Total PDF Pages: ${pages}`);

  if (process.argv.includes('--render-png')) {
    try {
      execFileSync('pdftoppm', ['-png', '-r', '150', '-f', '1', '-l', String(pages), SHOWCASE_OUT_PDF, resolve(TEMPLATES_DIR, 'page_render')]);
      console.log(`Rendered page PNGs to ${TEMPLATES_DIR}/page_render-*.png`);
    } catch (errPpm) {
      console.warn(`pdftoppm notice:`, errPpm.message);
    }
  }
} catch (err) {
  console.error('Failed to compile PDF with Prince:', err.message);
}
