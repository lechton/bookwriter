#!/usr/bin/env node
/* ============================================================
   build-deck.mjs -- Deck Creator for Lecture PDFs
   ------------------------------------------------------------
   Combines individual lecture PDFs in any specified folder into a
   single unified deck PDF following the canonical pattern:
     {Prefix} Q{first}-Q{last}.pdf (e.g. "React 2026 Q01-Q19.pdf")

   Usage:
     node src/build-deck.mjs <folder> [options]

   Examples:
     node src/build-deck.mjs lab/01-forensic-investigator
     node src/build-deck.mjs md-lectures-pdf
     node src/build-deck.mjs lab/01-forensic-investigator --prefix "React 2026"
     node src/build-deck.mjs lab/01-forensic-investigator --prince
   ============================================================ */

import { readdirSync, unlinkSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, isAbsolute, basename } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);

function getArg(flag) {
	const idx = args.indexOf(flag);
	if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
	return null;
}

const targetDirRaw = args.find((a) => !a.startsWith('--')) || getArg('--dir') || 'md-lectures-pdf';
const targetDir = isAbsolute(targetDirRaw) ? targetDirRaw : join(ROOT, targetDirRaw);
const prefix = getArg('--prefix') || 'React 2026';
const usePrince = args.includes('--prince');

if (!existsSync(targetDir)) {
	console.error(`✕ Error: Directory not found: ${targetDir}`);
	process.exit(1);
}

// Locate all individual lecture PDFs (e.g., 01.pdf, 02.pdf, ..., 19.pdf)
const pdfEntries = readdirSync(targetDir)
	.filter((f) => /^(?:Q)?(\d+)\.pdf$/i.test(f))
	.map((f) => {
		const m = f.match(/^(?:Q)?(\d+)\.pdf$/i);
		return { filename: f, num: parseInt(m[1], 10), pad: m[1].padStart(2, '0') };
	})
	.sort((a, b) => a.num - b.num);

if (!pdfEntries.length) {
	console.error(`✕ No numbered lecture PDFs found in ${targetDir}`);
	process.exit(1);
}

const first = pdfEntries[0].pad;
const last = pdfEntries[pdfEntries.length - 1].pad;
const deckName = `${prefix} Q${first}-Q${last}.pdf`;
const deckPath = join(targetDir, deckName);

console.log(`\n📚 Creating Deck in: ${targetDir}`);
console.log(`   Lectures found: Q${first} through Q${last} (${pdfEntries.length} files)`);
console.log(`   Target Deck:    ${deckName}\n`);

// Clean older deck variants to ensure folder hygiene
for (const f of readdirSync(targetDir)) {
	if (f === deckName) continue;
	if (f === 'deck.pdf' || /^React(?:\s+2026)?\s+Q\d+-Q\d+\.pdf$/i.test(f)) {
		try {
			unlinkSync(join(targetDir, f));
			console.log(`  purged old deck: ${f}`);
		} catch (err) {
			// ignore cleanup error
		}
	}
}

if (usePrince) {
	const deckHtmlPath = join(targetDir, 'deck.html');
	if (!existsSync(deckHtmlPath)) {
		console.error(`✕ Error: deck.html not found in ${targetDir} for --prince mode.`);
		console.log(`  Falling back to pdfunite...`);
		runPdfUnite();
	} else {
		console.log(`  Compiling via Prince (${deckHtmlPath} -> ${deckName})...`);
		execFileSync('prince', [deckHtmlPath, '-o', deckPath], { stdio: ['ignore', 'inherit', 'inherit'] });
		console.log(`  ✅ Deck created successfully via Prince: ${deckName}`);
	}
} else {
	runPdfUnite();
}

function runPdfUnite() {
	const inputPaths = pdfEntries.map((e) => join(targetDir, e.filename));
	console.log(`  Uniting ${inputPaths.length} PDFs via pdfunite...`);
	try {
		execFileSync('pdfunite', [...inputPaths, deckPath], { stdio: 'inherit' });
		console.log(`  ✅ Deck created successfully: ${deckName}`);
	} catch (err) {
		console.error(`✕ Error executing pdfunite:`, err.message);
		process.exit(1);
	}
}
