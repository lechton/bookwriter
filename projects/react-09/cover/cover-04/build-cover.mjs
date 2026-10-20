#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, statSync } from 'node:fs';

const DIR = dirname(fileURLToPath(import.meta.url));
const htmlFile = join(DIR, 'cover.html');
const pdfFile = join(DIR, 'cover.pdf');

console.log(`Compiling ${htmlFile} to ${pdfFile} via Prince...`);

try {
  execFileSync('prince', [htmlFile, '-o', pdfFile], { stdio: 'inherit' });
  if (existsSync(pdfFile)) {
    const size = statSync(pdfFile).size;
    console.log(`Successfully generated cover.pdf (${(size / 1024).toFixed(1)} KB)`);
  }
} catch (err) {
  console.error('Prince compilation failed:', err.message);
  process.exit(1);
}

// Generate high-resolution PNG preview if pdftoppm is available
try {
  console.log('Generating PNG preview with pdftoppm...');
  execFileSync('pdftoppm', ['-png', '-r', '150', '-f', '1', '-l', '1', pdfFile, join(DIR, 'preview')], { stdio: 'inherit' });
  console.log('Successfully generated preview-1.png');
} catch (err) {
  console.warn('pdftoppm preview generation skipped:', err.message);
}
