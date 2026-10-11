import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// First build the base lecture 04
console.log('Rebuilding base 04.html...');
execSync('node src/build-lectures.mjs 04', { cwd: ROOT, stdio: 'inherit' });

const baseHtmlPath = join(ROOT, '01-03-md-lectures-html', '04.html');
const baseHtml = readFileSync(baseHtmlPath, 'utf8');

const variants = [
	{
		id: 'variant-a',
		name: 'Variant A: Architectural Cobalt Ribbon & Two-Tone Case Cards',
		css: `
/* VARIANT A: Architectural Cobalt Ribbon & Two-Tone Case Cards */
.callout-principle {
	border: none !important;
	background: transparent !important;
	padding: 0 !important;
	margin: 2.2rem 0 1.8rem !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	break-inside: avoid;
	page-break-inside: avoid;
}

.callout-principle .principle-header {
	display: flex;
	align-items: center;
	margin-left: calc(-260px - 20mm);
	width: calc(100% + 260px + 20mm);
	box-sizing: border-box;
	margin-bottom: 0.85rem;
}

.callout-principle .principle-ribbon-tab {
	width: calc(262px + 20mm);
	min-width: calc(262px + 20mm);
	flex-shrink: 0;
	background: #0284c7;
	color: #ffffff;
	font-weight: 800;
	font-size: 0.78rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-left: 20mm;
	padding-right: 18px;
	border-radius: 0 9999px 9999px 0;
	box-shadow: 2px 2px 6px rgba(2, 132, 199, 0.22);
	white-space: nowrap;
	box-sizing: border-box;
}

.callout-principle .principle-title {
	flex: 1;
	min-width: 0;
	font-size: 1.18rem;
	font-weight: 800;
	color: #000000 !important;
	margin: 0 0 0 16px;
	letter-spacing: -0.02em;
	line-height: 1.25;
	white-space: normal;
	text-align: left;
}

.callout-principle .principle-body {
	margin-left: 0;
}

.callout-principle .principle-definition-card {
	background: #f8fafc;
	border: 1.5px solid #cbd5e1;
	border-radius: 4px;
	padding: 12px 18px;
	margin-bottom: 10px;
	box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.callout-principle .principle-definition-card .principle-statement {
	margin: 0;
	font-size: 1.02rem;
	line-height: 1.55;
	color: #0f172a;
	font-weight: 500;
	text-align: left;
}

.callout-principle .principle-definition-card .principle-statement strong {
	color: #0284c7;
	font-weight: 700;
}

.callout-principle .principle-cases-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 1.2rem;
}

.callout-principle .principle-case {
	display: flex;
	align-items: flex-start;
	padding: 9px 14px;
	border-radius: 5px;
	box-sizing: border-box;
	gap: 12px;
}

.callout-principle .principle-case-do {
	background: #f0fdf4;
	border: 1.5px solid #86efac;
}

.callout-principle .principle-case-dont {
	background: #fef2f2;
	border: 1.5px solid #fca5a5;
}

.callout-principle .principle-case-warn {
	background: #fffbeb;
	border: 1.5px solid #fde68a;
}

.callout-principle .case-icon-col {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 2px;
}

.callout-principle .case-icon {
	width: 20px;
	height: 20px;
}

.callout-principle .icon-check,
.callout-principle .icon-badge-check {
	color: #16a34a;
}

.callout-principle .icon-cross {
	color: #dc2626;
}

.callout-principle .icon-alert-triangle {
	color: #b45309;
}

.callout-principle .case-content-col {
	flex: 1;
}

.callout-principle .case-label {
	font-size: 0.80rem;
	font-weight: 700;
	margin-bottom: 3px;
}

.callout-principle .principle-case-do .case-label {
	color: #15803d;
}

.callout-principle .principle-case-dont .case-label {
	color: #b91c1c;
}

.callout-principle .principle-case-warn .case-label {
	color: #b45309;
}

.callout-principle .case-code {
	font-family: "JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;
	line-height: 1.45;
	color: #0f172a;
	font-variant-ligatures: none;
	width: 100%;
}

.callout-principle .case-code pre {
	margin: 0 !important;
	padding: 0 !important;
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	color: inherit;
	white-space: pre-wrap !important;
	tab-size: 2;
	-moz-tab-size: 2;
}

.callout-principle .case-code code {
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	padding: 0 !important;
	margin: 0 !important;
	border-radius: 0 !important;
	font-family: inherit !important;
	font-size: 0.80rem !important;
	line-height: 1.45 !important;
	color: #0f172a !important;
	display: block !important;
	font-weight: 500 !important;
	white-space: pre-wrap !important;
	tab-size: 2 !important;
	-moz-tab-size: 2 !important;
}
`
	},
	{
		id: 'variant-b',
		name: 'Variant B: Obsidian Spec Banner & High-Contrast Cases',
		css: `
/* VARIANT B: Obsidian Spec Banner & High-Contrast Cases */
.callout-principle {
	border: none !important;
	background: transparent !important;
	padding: 0 !important;
	margin: 2.4rem 0 2rem !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	break-inside: avoid;
	page-break-inside: avoid;
}

.callout-principle .principle-header {
	display: flex;
	align-items: center;
	margin-left: calc(-260px - 20mm);
	width: calc(100% + 260px + 20mm);
	box-sizing: border-box;
	margin-bottom: 0.85rem;
}

.callout-principle .principle-ribbon-tab {
	width: calc(262px + 20mm);
	min-width: calc(262px + 20mm);
	flex-shrink: 0;
	background: #020617;
	color: #f8fafc;
	font-weight: 800;
	font-size: 0.74rem;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-left: 20mm;
	padding-right: 18px;
	border-radius: 0 16px 16px 0;
	border-right: 4px solid #38bdf8;
	box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
	white-space: nowrap;
	box-sizing: border-box;
}

.callout-principle .principle-ribbon-tab .principle-num::before {
	content: "> ";
	color: #38bdf8;
	margin-right: 4px;
	font-weight: 900;
}

.callout-principle .principle-title {
	flex: 1;
	min-width: 0;
	font-size: 1.15rem;
	font-weight: 800;
	color: #000000 !important;
	margin: 0 0 0 16px;
	letter-spacing: 0.03em;
	text-transform: uppercase;
	line-height: 1.25;
	white-space: normal;
	text-align: left;
}

.callout-principle .principle-body {
	margin-left: 0;
}

.callout-principle .principle-definition-card {
	background: #ffffff;
	border: 2px solid #020617;
	border-radius: 4px;
	padding: 12px 18px;
	margin-bottom: 10px;
	box-shadow: 2px 2px 0px rgba(2, 6, 23, 0.1);
}

.callout-principle .principle-definition-card .principle-statement {
	margin: 0;
	font-size: 1.02rem;
	line-height: 1.55;
	color: #0f172a;
	font-weight: 600;
	text-align: left;
}

.callout-principle .principle-definition-card .principle-statement strong {
	color: #0284c7;
	font-weight: 800;
	background: #f0f9ff;
	padding: 1px 4px;
	border-radius: 2px;
}

.callout-principle .principle-cases-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 1.2rem;
}

.callout-principle .principle-case {
	display: flex;
	align-items: flex-start;
	padding: 9px 14px;
	border-radius: 4px;
	box-sizing: border-box;
	gap: 12px;
}

.callout-principle .principle-case-do {
	background: #f0fdf4;
	border: 1.5px solid #16a34a;
}

.callout-principle .principle-case-dont {
	background: #fef2f2;
	border: 1.5px solid #dc2626;
}

.callout-principle .case-icon-col {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 2px;
}

.callout-principle .case-icon {
	width: 20px;
	height: 20px;
}

.callout-principle .icon-check {
	color: #16a34a;
}

.callout-principle .icon-cross {
	color: #dc2626;
}

.callout-principle .case-content-col {
	flex: 1;
}

.callout-principle .case-label {
	font-size: 0.80rem;
	font-weight: 800;
	margin-bottom: 3px;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.callout-principle .principle-case-do .case-label {
	color: #166534;
}

.callout-principle .principle-case-dont .case-label {
	color: #991b1b;
}

.callout-principle .case-code {
	font-family: "JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;
	line-height: 1.45;
	color: #0f172a;
	font-variant-ligatures: none;
	width: 100%;
}

.callout-principle .case-code pre {
	margin: 0 !important;
	padding: 0 !important;
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	color: inherit;
	white-space: pre-wrap !important;
	tab-size: 2;
	-moz-tab-size: 2;
}

.callout-principle .case-code code {
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	padding: 0 !important;
	margin: 0 !important;
	border-radius: 0 !important;
	font-family: inherit !important;
	font-size: 0.80rem !important;
	line-height: 1.45 !important;
	color: #0f172a !important;
	display: block !important;
	font-weight: 500 !important;
	white-space: pre-wrap !important;
	tab-size: 2 !important;
	-moz-tab-size: 2 !important;
}
`
	},
	{
		id: 'variant-c',
		name: 'Variant C: Vibrant Cyan Gradient Capsule & Tinted Plate Cases',
		css: `
/* VARIANT C: Vibrant Cyan Gradient Capsule & Tinted Plate Cases */
.callout-principle {
	border: none !important;
	background: transparent !important;
	padding: 0 !important;
	margin: 2.2rem 0 1.9rem !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	break-inside: avoid;
	page-break-inside: avoid;
}

.callout-principle .principle-header {
	display: flex;
	align-items: center;
	margin-left: calc(-260px - 20mm);
	width: calc(100% + 260px + 20mm);
	box-sizing: border-box;
	margin-bottom: 0.85rem;
}

.callout-principle .principle-ribbon-tab {
	width: calc(262px + 20mm);
	min-width: calc(262px + 20mm);
	flex-shrink: 0;
	background: linear-gradient(90deg, #0284c7 0%, #06b6d4 100%);
	color: #ffffff;
	font-weight: 800;
	font-size: 0.78rem;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-left: 20mm;
	padding-right: 18px;
	border-radius: 0 9999px 9999px 0;
	box-shadow: 0 3px 10px rgba(6, 182, 212, 0.28);
	white-space: nowrap;
	text-shadow: 0 1px 2px rgba(0,0,0,0.15);
	box-sizing: border-box;
}

.callout-principle .principle-title {
	flex: 1;
	min-width: 0;
	font-size: 1.18rem;
	font-weight: 800;
	color: #000000 !important;
	margin: 0 0 0 16px;
	letter-spacing: -0.025em;
	line-height: 1.25;
	white-space: normal;
	text-align: left;
}

.callout-principle .principle-body {
	margin-left: 0;
}

.callout-principle .principle-definition-card {
	background: #f0f9ff;
	border: 1.5px solid #bae6fd;
	border-left: 4px solid #0284c7;
	border-radius: 4px;
	padding: 12px 18px;
	margin-bottom: 10px;
	box-shadow: 0 2px 4px rgba(2, 132, 199, 0.05);
}

.callout-principle .principle-definition-card .principle-statement {
	margin: 0;
	font-size: 1.02rem;
	line-height: 1.55;
	color: #0369a1;
	font-weight: 600;
	text-align: left;
}

.callout-principle .principle-definition-card .principle-statement strong {
	color: #0c4a6e;
	font-weight: 800;
	text-decoration: underline;
	text-decoration-color: #38bdf8;
	text-underline-offset: 3px;
}

.callout-principle .principle-cases-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 1.2rem;
}

.callout-principle .principle-case {
	display: flex;
	align-items: flex-start;
	padding: 9px 14px;
	border-radius: 6px;
	box-sizing: border-box;
	gap: 12px;
	box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
}

.callout-principle .principle-case-do {
	background: #ffffff;
	border: 1.5px solid #86efac;
	border-left: 4px solid #16a34a;
}

.callout-principle .principle-case-dont {
	background: #ffffff;
	border: 1.5px solid #fca5a5;
	border-left: 4px solid #dc2626;
}

.callout-principle .case-icon-col {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 2px;
}

.callout-principle .case-icon {
	width: 20px;
	height: 20px;
}

.callout-principle .icon-check {
	color: #16a34a;
}

.callout-principle .icon-cross {
	color: #dc2626;
}

.callout-principle .case-content-col {
	flex: 1;
}

.callout-principle .case-label {
	font-size: 0.80rem;
	font-weight: 700;
	margin-bottom: 3px;
}

.callout-principle .principle-case-do .case-label {
	color: #15803d;
}

.callout-principle .principle-case-dont .case-label {
	color: #b91c1c;
}

.callout-principle .case-code {
	font-family: "JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;
	line-height: 1.45;
	color: #0f172a;
	font-variant-ligatures: none;
	width: 100%;
}

.callout-principle .case-code pre {
	margin: 0 !important;
	padding: 0 !important;
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	color: inherit;
	white-space: pre-wrap !important;
	tab-size: 2;
	-moz-tab-size: 2;
}

.callout-principle .case-code code {
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	padding: 0 !important;
	margin: 0 !important;
	border-radius: 0 !important;
	font-family: inherit !important;
	font-size: 0.80rem !important;
	line-height: 1.45 !important;
	color: #0f172a !important;
	display: block !important;
	font-weight: 500 !important;
	white-space: pre-wrap !important;
	tab-size: 2 !important;
	-moz-tab-size: 2 !important;
}
`
	},
	{
		id: 'variant-d',
		name: 'Variant D: Swiss Minimalist & Clean Outlined Cases',
		css: `
/* VARIANT D: Swiss Minimalist & Clean Outlined Cases */
.callout-principle {
	border: none !important;
	background: transparent !important;
	padding: 0 !important;
	margin: 2.4rem 0 2rem !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	break-inside: avoid;
	page-break-inside: avoid;
}

.callout-principle .principle-header {
	display: flex;
	align-items: center;
	margin-left: calc(-260px - 20mm);
	width: calc(100% + 260px + 20mm);
	box-sizing: border-box;
	margin-bottom: 0.85rem;
}

.callout-principle .principle-ribbon-tab {
	width: calc(262px + 20mm);
	min-width: calc(262px + 20mm);
	flex-shrink: 0;
	background: #18181b;
	color: #ffffff;
	font-weight: 800;
	font-size: 0.74rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-left: 20mm;
	padding-right: 18px;
	border-radius: 0 12px 12px 0;
	white-space: nowrap;
	box-sizing: border-box;
}

.callout-principle .principle-title {
	flex: 1;
	min-width: 0;
	font-size: 1.18rem;
	font-weight: 800;
	color: #000000 !important;
	margin: 0 0 0 16px;
	letter-spacing: -0.015em;
	line-height: 1.25;
	white-space: normal;
	text-align: left;
}

.callout-principle .principle-body {
	margin-left: 0;
}

.callout-principle .principle-definition-card {
	background: #ffffff;
	border: 1.5px solid #18181b;
	border-radius: 4px;
	padding: 12px 18px;
	margin-bottom: 10px;
}

.callout-principle .principle-definition-card .principle-statement {
	margin: 0;
	font-size: 1.02rem;
	line-height: 1.6;
	color: #18181b;
	font-weight: 500;
	text-align: left;
}

.callout-principle .principle-definition-card .principle-statement strong {
	color: #000000;
	font-weight: 800;
}

.callout-principle .principle-cases-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 1.2rem;
}

.callout-principle .principle-case {
	display: flex;
	align-items: flex-start;
	padding: 8px 14px;
	border-radius: 4px;
	box-sizing: border-box;
	gap: 12px;
}

.callout-principle .principle-case-do {
	background: #f4f4f5;
	border: 1px solid #71717a;
	border-left: 4px solid #16a34a;
}

.callout-principle .principle-case-dont {
	background: #f4f4f5;
	border: 1px solid #71717a;
	border-left: 4px solid #dc2626;
}

.callout-principle .case-icon-col {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 2px;
}

.callout-principle .case-icon {
	width: 20px;
	height: 20px;
}

.callout-principle .icon-check {
	color: #16a34a;
}

.callout-principle .icon-cross {
	color: #dc2626;
}

.callout-principle .case-content-col {
	flex: 1;
}

.callout-principle .case-label {
	font-size: 0.80rem;
	font-weight: 700;
	margin-bottom: 3px;
	color: #18181b;
}

.callout-principle .case-code {
	font-family: "JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;
	line-height: 1.45;
	color: #0f172a;
	font-variant-ligatures: none;
	width: 100%;
}

.callout-principle .case-code pre {
	margin: 0 !important;
	padding: 0 !important;
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	color: inherit;
	white-space: pre-wrap !important;
	tab-size: 2;
	-moz-tab-size: 2;
}

.callout-principle .case-code code {
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	padding: 0 !important;
	margin: 0 !important;
	border-radius: 0 !important;
	font-family: inherit !important;
	font-size: 0.80rem !important;
	line-height: 1.45 !important;
	color: #0f172a !important;
	display: block !important;
	font-weight: 500 !important;
	white-space: pre-wrap !important;
	tab-size: 2 !important;
	-moz-tab-size: 2 !important;
}
`
	},
	{
		id: 'variant-e',
		name: 'Variant E: Old System Typography & Dual-Tone (Black Titles + Teal Accents + Cobalt Ribbon)',
		css: `
/* VARIANT E: Old System Typography & Dual-Tone (Black Titles + Teal Accents + Cobalt Ribbon) */
:root, html, body {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	--accent: #0e7490 !important;
	--title-color: #000000 !important;
	--marginalia-color: #000000 !important;
	--bold-color: #000000 !important;
	--bullet-color: #000000 !important;
	--code-pill-color: #0e7490 !important;
	--code-pill-bg: #eef7f9 !important;
	--code-pill-border: rgba(14, 116, 144, 0.25) !important;
}

body {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	-webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	letter-spacing: normal !important;
	color: #000000 !important;
}

h1 {
	font-size: 2.1rem !important;
	letter-spacing: -0.01em !important;
}

main h3, main h4 {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	color: #000000 !important;
}

p strong, p b {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	color: #000000 !important;
}

p {
	text-align: left !important;
	hyphens: manual !important;
}

ul > li::marker {
	content: '• ' !important;
	font-size: 1em !important;
	color: #000000 !important;
}

li > ul > li::marker {
	content: '◦ ' !important;
	font-size: 1em !important;
	color: #000000 !important;
}

.summary-lead-title,
.summary-section > p:first-of-type,
.summary-subtitle {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	letter-spacing: normal !important;
	color: #000000 !important;
}

.summary-section ol > li::marker {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	font-size: 1em !important;
}

.interview-question {
	border-left: 4px solid #0e7490 !important;
}

.interview-question .iq-header .iq-typology {
	color: #0e7490 !important;
	background: rgba(14, 116, 144, 0.1) !important;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
	font-weight: 700 !important;
}

.interview-question .iq-text {
	font-family: Georgia, "Times New Roman", serif !important;
	font-size: 1.18rem !important;
	font-style: italic !important;
	color: #2a2a2a !important;
}

.callout-wild,
.callout-grounding {
	border: 1px solid #cbd5e1 !important;
	border-left: 4px solid #0e7490 !important;
	background: #f8fafc !important;
}

.callout-wild .callout-eyebrow,
.callout-grounding .callout-eyebrow {
	color: #0e7490 !important;
}

/* Inline code pills with teal styling */
code:not(pre code):not(.case-code code):not(.code-line-callout code) {
	color: #0e7490 !important;
	background: #eef7f9 !important;
	border: 1px solid rgba(14, 116, 144, 0.25) !important;
}

.code-line-callout code,
.callout .code-line-callout code {
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	margin: 0 !important;
	padding: 0 !important;
	border-radius: 0 !important;
}

/* PRINCIPLE CALLOUT WITH COBALT RIBBON */
.callout-principle {
	border: none !important;
	background: transparent !important;
	padding: 0 !important;
	margin: 2.2rem 0 1.8rem !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	break-inside: avoid;
	page-break-inside: avoid;
}

.callout-principle .principle-header {
	display: flex;
	align-items: center;
	margin-left: calc(-260px - 20mm);
	width: calc(100% + 260px + 20mm);
	box-sizing: border-box;
	margin-bottom: 0.85rem;
}

.callout-principle .principle-ribbon-tab {
	width: calc(262px + 20mm);
	min-width: calc(262px + 20mm);
	flex-shrink: 0;
	background: #0284c7;
	color: #ffffff;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 800;
	font-size: 0.78rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-left: 20mm;
	padding-right: 18px;
	border-radius: 0 9999px 9999px 0;
	box-shadow: 2px 2px 6px rgba(2, 132, 199, 0.22);
	white-space: nowrap;
	box-sizing: border-box;
}

.callout-principle .principle-title {
	flex: 1;
	min-width: 0;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-size: 1.18rem;
	font-weight: 800;
	color: #000000 !important;
	margin: 0 0 0 16px;
	letter-spacing: -0.02em;
	line-height: 1.25;
	white-space: normal;
	text-align: left;
}

.callout-principle .principle-body {
	margin-left: 0;
}

.callout-principle .principle-definition-card {
	background: #f8fafc;
	border: 1.5px solid #cbd5e1;
	border-radius: 4px;
	padding: 12px 18px;
	margin-bottom: 10px;
	box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.callout-principle .principle-definition-card .principle-statement {
	margin: 0;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-size: 1.02rem;
	line-height: 1.55;
	color: #0f172a;
	font-weight: 500;
	text-align: left;
}

.callout-principle .principle-definition-card .principle-statement strong {
	color: #0284c7 !important;
	font-weight: 700;
}

.callout-principle .principle-cases-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 1.2rem;
}

.callout-principle .principle-case {
	display: flex;
	align-items: flex-start;
	padding: 9px 14px;
	border-radius: 5px;
	box-sizing: border-box;
	gap: 12px;
}

.callout-principle .principle-case-do {
	background: #f0fdf4;
	border: 1.5px solid #86efac;
}

.callout-principle .principle-case-dont {
	background: #fef2f2;
	border: 1.5px solid #fca5a5;
}

.callout-principle .principle-case-warn {
	background: #fffbeb;
	border: 1.5px solid #fde68a;
}

.callout-principle .case-icon-col {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 2px;
}

.callout-principle .case-icon {
	width: 20px;
	height: 20px;
}

.callout-principle .icon-check,
.callout-principle .icon-badge-check {
	color: #16a34a;
}

.callout-principle .icon-cross {
	color: #dc2626;
}

.callout-principle .icon-alert-triangle {
	color: #b45309;
}

.callout-principle .case-content-col {
	flex: 1;
}

.callout-principle .case-label {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-size: 0.80rem;
	font-weight: 700;
	margin-bottom: 3px;
}

.callout-principle .principle-case-do .case-label {
	color: #15803d;
}

.callout-principle .principle-case-dont .case-label {
	color: #b91c1c;
}

.callout-principle .principle-case-warn .case-label {
	color: #b45309;
}

.callout-principle .case-code {
	font-family: "JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace !important;
	line-height: 1.45;
	color: #0f172a;
	font-variant-ligatures: none;
	width: 100%;
}

.callout-principle .case-code pre {
	margin: 0 !important;
	padding: 0 !important;
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	color: inherit;
	white-space: pre-wrap !important;
	tab-size: 2;
	-moz-tab-size: 2;
}

.callout-principle .case-code code {
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	padding: 0 !important;
	margin: 0 !important;
	border-radius: 0 !important;
	font-family: inherit !important;
	font-size: 0.80rem !important;
	line-height: 1.45 !important;
	color: #0f172a !important;
	display: block !important;
	font-weight: 500 !important;
	white-space: pre-wrap !important;
	tab-size: 2 !important;
	-moz-tab-size: 2 !important;
}
`
	},
	{
		id: 'variant-f',
		name: 'Variant F: Old System Typography & Deep Teal Titles + Cobalt Ribbon',
		css: `
/* VARIANT F: Old System Typography & Deep Teal Titles + Cobalt Ribbon */
:root, html, body {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	--accent: #0e7490 !important;
	--title-color: #0e7490 !important;
	--marginalia-color: #0e7490 !important;
	--bold-color: #000000 !important;
	--bullet-color: #0e7490 !important;
	--code-pill-color: #0e7490 !important;
	--code-pill-bg: #eef7f9 !important;
	--code-pill-border: rgba(14, 116, 144, 0.25) !important;
}

body {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	-webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	letter-spacing: normal !important;
	color: #0e7490 !important;
}

h1 {
	font-size: 2.1rem !important;
	letter-spacing: -0.01em !important;
}

main h3, main h4 {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	color: #0e7490 !important;
}

p strong, p b {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	color: #000000 !important;
}

p {
	text-align: left !important;
	hyphens: manual !important;
}

ul > li::marker {
	content: '• ' !important;
	font-size: 1em !important;
	color: #0e7490 !important;
}

li > ul > li::marker {
	content: '◦ ' !important;
	font-size: 1em !important;
	color: #0e7490 !important;
}

.summary-lead-title,
.summary-subtitle {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	letter-spacing: normal !important;
	color: #0e7490 !important;
}

.summary-section > p:first-of-type {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	color: #000000 !important;
}

.summary-section ol > li::marker {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 700 !important;
	font-size: 1em !important;
}

.interview-question {
	border-left: 4px solid #0e7490 !important;
}

.interview-question .iq-header .iq-typology {
	color: #0e7490 !important;
	background: rgba(14, 116, 144, 0.1) !important;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
	font-weight: 700 !important;
}

.interview-question .iq-text {
	font-family: Georgia, "Times New Roman", serif !important;
	font-size: 1.18rem !important;
	font-style: italic !important;
	color: #2a2a2a !important;
}

.callout-wild,
.callout-grounding {
	border: 1px solid #cbd5e1 !important;
	border-left: 4px solid #0e7490 !important;
	background: #f8fafc !important;
}

.callout-wild .callout-eyebrow,
.callout-grounding .callout-eyebrow {
	color: #0e7490 !important;
}

/* Inline code pills with teal styling */
code:not(pre code):not(.case-code code):not(.code-line-callout code) {
	color: #0e7490 !important;
	background: #eef7f9 !important;
	border: 1px solid rgba(14, 116, 144, 0.25) !important;
}

.code-line-callout code,
.callout .code-line-callout code {
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	margin: 0 !important;
	padding: 0 !important;
	border-radius: 0 !important;
}

/* PRINCIPLE CALLOUT WITH COBALT RIBBON */
.callout-principle {
	border: none !important;
	background: transparent !important;
	padding: 0 !important;
	margin: 2.2rem 0 1.8rem !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	break-inside: avoid;
	page-break-inside: avoid;
}

.callout-principle .principle-header {
	display: flex;
	align-items: center;
	margin-left: calc(-260px - 20mm);
	width: calc(100% + 260px + 20mm);
	box-sizing: border-box;
	margin-bottom: 0.85rem;
}

.callout-principle .principle-ribbon-tab {
	width: calc(262px + 20mm);
	min-width: calc(262px + 20mm);
	flex-shrink: 0;
	background: #0284c7;
	color: #ffffff;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-weight: 800;
	font-size: 0.78rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-left: 20mm;
	padding-right: 18px;
	border-radius: 0 9999px 9999px 0;
	box-shadow: 2px 2px 6px rgba(2, 132, 199, 0.22);
	white-space: nowrap;
	box-sizing: border-box;
}

.callout-principle .principle-title {
	flex: 1;
	min-width: 0;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-size: 1.18rem;
	font-weight: 800;
	color: #000000 !important;
	margin: 0 0 0 16px;
	letter-spacing: -0.02em;
	line-height: 1.25;
	white-space: normal;
	text-align: left;
}

.callout-principle .principle-body {
	margin-left: 0;
}

.callout-principle .principle-definition-card {
	background: #f8fafc;
	border: 1.5px solid #cbd5e1;
	border-radius: 4px;
	padding: 12px 18px;
	margin-bottom: 10px;
	box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.callout-principle .principle-definition-card .principle-statement {
	margin: 0;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-size: 1.02rem;
	line-height: 1.55;
	color: #0f172a;
	font-weight: 500;
	text-align: left;
}

.callout-principle .principle-definition-card .principle-statement strong {
	color: #0284c7 !important;
	font-weight: 700;
}

.callout-principle .principle-cases-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 1.2rem;
}

.callout-principle .principle-case {
	display: flex;
	align-items: flex-start;
	padding: 9px 14px;
	border-radius: 5px;
	box-sizing: border-box;
	gap: 12px;
}

.callout-principle .principle-case-do {
	background: #f0fdf4;
	border: 1.5px solid #86efac;
}

.callout-principle .principle-case-dont {
	background: #fef2f2;
	border: 1.5px solid #fca5a5;
}

.callout-principle .principle-case-warn {
	background: #fffbeb;
	border: 1.5px solid #fde68a;
}

.callout-principle .case-icon-col {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 2px;
}

.callout-principle .case-icon {
	width: 20px;
	height: 20px;
}

.callout-principle .icon-check,
.callout-principle .icon-badge-check {
	color: #16a34a;
}

.callout-principle .icon-cross {
	color: #dc2626;
}

.callout-principle .icon-alert-triangle {
	color: #b45309;
}

.callout-principle .case-content-col {
	flex: 1;
}

.callout-principle .case-label {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
	font-size: 0.80rem;
	font-weight: 700;
	margin-bottom: 3px;
}

.callout-principle .principle-case-do .case-label {
	color: #15803d;
}

.callout-principle .principle-case-dont .case-label {
	color: #b91c1c;
}

.callout-principle .principle-case-warn .case-label {
	color: #b45309;
}

.callout-principle .case-code {
	font-family: "JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace !important;
	line-height: 1.45;
	color: #0f172a;
	font-variant-ligatures: none;
	width: 100%;
}

.callout-principle .case-code pre {
	margin: 0 !important;
	padding: 0 !important;
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	color: inherit;
	white-space: pre-wrap !important;
	tab-size: 2;
	-moz-tab-size: 2;
}

.callout-principle .case-code code {
	background: transparent !important;
	border: none !important;
	box-shadow: none !important;
	padding: 0 !important;
	margin: 0 !important;
	border-radius: 0 !important;
	font-family: inherit !important;
	font-size: 0.80rem !important;
	line-height: 1.45 !important;
	color: #0f172a !important;
	display: block !important;
	font-weight: 500 !important;
	white-space: pre-wrap !important;
	tab-size: 2 !important;
	-moz-tab-size: 2 !important;
}
`
	}
];

// Generate 04-old.pdf baseline as well
console.log('Generating baseline 04-old.pdf...');
const oldHtml = baseHtml
	.replace('<html lang="en" data-theme="teal">', '<html lang="en" data-theme="old">')
	.replace('<body class="theme-teal">', '<body class="theme-old">');
const oldHtmlFile = join(ROOT, '01-03-md-lectures-html', '04-old.html');
const oldPdfFile = join(ROOT, '01-04-md-lectures-PDF', '04-old.pdf');
writeFileSync(oldHtmlFile, oldHtml, 'utf8');
execSync(`prince "${oldHtmlFile}" -o "${oldPdfFile}"`, { cwd: ROOT, stdio: 'inherit' });
console.log(`Saved baseline: ${oldPdfFile}`);

for (const v of variants) {
	console.log(`Generating ${v.name}...`);
	const styleTag = `<style>\n${v.css}\n</style>\n</head>`;
	const modifiedHtml = baseHtml.replace('</head>', styleTag);
	
	const htmlFile = join(ROOT, '01-03-md-lectures-html', `04-${v.id}.html`);
	const pdfFile = join(ROOT, '01-04-md-lectures-PDF', `04-${v.id}.pdf`);
	
	writeFileSync(htmlFile, modifiedHtml, 'utf8');
	console.log(`Saved HTML: ${htmlFile}`);
	
	console.log(`Running Prince on 04-${v.id}.html...`);
	execSync(`prince "${htmlFile}" -o "${pdfFile}"`, { cwd: ROOT, stdio: 'inherit' });
	console.log(`Saved PDF: ${pdfFile}`);
}

console.log('All variants and baseline 04-old.pdf built successfully with 0 errors!');

