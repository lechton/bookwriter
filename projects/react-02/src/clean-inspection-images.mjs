import { readdirSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIRS_TO_CLEAN = [
  resolve(__dirname, '..'),
  resolve(__dirname, '../md-lectures-pdf'),
  resolve(__dirname, '../md-lectures/figures/templates'),
  resolve(__dirname, '../md-lectures/figures'),
  resolve(__dirname, '../lab'),
  resolve(__dirname, '../lab/01-forensic-investigator'),
  resolve(__dirname, '../lab/02-socratic-paradox'),
  resolve(__dirname, '../lab/03-flight-simulator-progressive'),
  resolve(__dirname, '../lab/04-mentor-senior-duel'),
];

let totalCleaned = 0;

for (const dir of DIRS_TO_CLEAN) {
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir);
  for (const file of files) {
    // Only clean temporary inspection PNG images, never delete HTML, CSS, MD, or PDF files
    if (file.endsWith('.png')) {
      try {
        unlinkSync(resolve(dir, file));
        console.log(`Cleaned inspection image: ${file}`);
        totalCleaned++;
      } catch (err) {
        console.warn(`Could not delete ${file}: ${err.message}`);
      }
    }
  }
}

console.log(`\nCleanup complete: ${totalCleaned} inspection image(s) removed.`);
