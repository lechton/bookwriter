// build-lecture.mjs — combine all lecture parts of a chapter into one markdown file.
//
// Usage:
//   node book/build-lecture.mjs 04_extra_javascript_1
//   node book/build-lecture.mjs all
//
// Inputs:
//   build 05/<chapter>/md-lecture/*.md
//
// Output:
//   book/out/<chapter>_LECTURE.md

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PENCIL = join(__dirname, '..');
const BUILD = join(PENCIL, 'build 05');
const OUT_DIR = join(__dirname, 'out');

const arg = process.argv[2] || '04_extra_javascript_1';

function buildLecture(chapter) {
  const lectureDir = join(BUILD, chapter, 'md-lecture');
  if (!existsSync(lectureDir)) {
    console.error(`Error: Lecture directory not found at ${lectureDir}`);
    return;
  }

  // Find all markdown files (00-intro.md, 01-*.md, etc)
  const files = readdirSync(lectureDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_') && /^\d/.test(f)) // match 00-intro etc
    .sort();

  if (files.length === 0) {
    console.log(`No markdown files found in ${lectureDir}`);
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });

  let combinedContent = [];

  for (const file of files) {
    const filePath = join(lectureDir, file);
    const content = readFileSync(filePath, 'utf8').trim();
    
    // Add an HTML comment boundary
    combinedContent.push(`<!-- ========================================== -->`);
    combinedContent.push(`<!-- PART: ${file} -->`);
    combinedContent.push(`<!-- ========================================== -->\n`);
    combinedContent.push(content);
    combinedContent.push('\n');
  }

  const outFile = join(OUT_DIR, `${chapter}_LECTURE.md`);
  writeFileSync(outFile, combinedContent.join('\n'));
  console.log(`lecture -> book/out/${chapter}_LECTURE.md (${files.length} parts)`);
}

if (arg === 'all') {
  const chapters = readdirSync(BUILD).filter((d) => existsSync(join(BUILD, d, 'chapter.md'))).sort();
  chapters.forEach(buildLecture);
} else {
  buildLecture(arg);
}
