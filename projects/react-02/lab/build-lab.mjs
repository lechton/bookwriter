#!/usr/bin/env node
/* ============================================================
   build-lab.mjs — Pedagogical Laboratory build runner
   ------------------------------------------------------------
   Compiles markdown lectures across all lab path subfolders
   into HTML and Prince PDFs for side-by-side inspection.

   Usage:
     node lab/build-lab.mjs            # compile all lab paths
     node lab/build-lab.mjs --no-pdf   # compile HTML only
     node lab/build-lab.mjs 01         # compile only path 01 (forensic)
   ============================================================ */

import { readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const LAB_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(LAB_DIR);
const args = process.argv.slice(2);
const withPdf = !args.includes('--no-pdf');
const targetFilter = args.find((a) => !a.startsWith('--'));

const entries = readdirSync(LAB_DIR).filter((f) => {
	if (!statSync(join(LAB_DIR, f)).isDirectory()) return false;
	if (f === 'figures' || f === 'templates' || f === 'node_modules') return false;
	if (targetFilter && !f.startsWith(targetFilter)) return false;
	return /^\d\d-/.test(f);
});

if (!entries.length) {
	console.log(`No lab path matching "${targetFilter || '*'}" found in ${LAB_DIR}`);
	process.exit(0);
}

console.log(`\n🧪 Running Pedagogical Laboratory Builds across ${entries.length} path(s)...\n`);

for (const pathName of entries) {
	const pathDir = join(LAB_DIR, pathName);
	console.log(`\n────────────────────────────────────────────────────────────`);
	console.log(`📦 LAB PATH: ${pathName}`);
	console.log(`────────────────────────────────────────────────────────────`);

	const mdFiles = readdirSync(pathDir).filter((f) => f.endsWith('.md') && !f.startsWith('PATH-') && f !== 'README.md');
	if (!mdFiles.length) {
		console.log(`  (No lecture markdown files yet in ${pathName})`);
		continue;
	}

	const buildArgs = ['src/build-lectures.mjs', '--input-dir', pathDir, '--html-dir', pathDir, '--pdf-dir', pathDir];
	if (!withPdf) buildArgs.push('--no-pdf');

	try {
		execFileSync('node', buildArgs, { cwd: ROOT, stdio: 'inherit' });
	} catch (err) {
		console.error(`  ✕ Build failed for ${pathName}:`, err.message);
	}
}

console.log(`\n✅ Lab builds complete!\n`);
