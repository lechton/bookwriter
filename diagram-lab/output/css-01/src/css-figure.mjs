/* ============================================================
   css-figure.mjs — the CSS Figure panel generator (production)
   ------------------------------------------------------------
   The css-01 twin of a11y-canvas.mjs. Where the accessibility canvas
   annotates invisible assistive states over a mocked page, the CSS
   figure draws the geometry itself: box edges, margins, floats, free
   space. It follows various/demo UI/design_instructions.md: flat
   pastel fills, 1px same-hue borders, thin indigo measurement lines,
   dashed purple "invisible forces", a mono caption under every figure.
   (Prototyped in src/canvas-lab/; the lab copy is kept for reference.)

   Consumed by build-lectures.mjs from a ```figure fenced block:

   ```figure mode="box" layout="compare" caption="One declaration, two widths."
   verdict=wrong | tag=content-box
   width=120 height=56 padding=16 border=2 margin=20
   ---
   verdict=right | tag=border-box
   sizing=border-box
   width=120 height=56 padding=16 border=2 margin=20
   ```

   Scenes are separated by a `---` line. Each scene line is a list of
   `key=value` pairs separated by `|`. Every mode documents its keys
   next to its renderer below.

   Modes:  box · margin · float · float-text · center · cascade
   Layout: single (default) · compare (two scenes side by side)
   Width:  2/3 (default) · full

   Geometry law: the renderer computes every coordinate from the
   declared CSS values (the same arithmetic the browser performs), so a
   figure can never show a layout its code does not produce. Where the
   scene uses live CSS (floats, text wrap) the values are the real ones.
   ============================================================ */

const esc = (v) => String(v)
	.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* ---------------- palette (design_instructions.md) ---------------- */

const C = {
	stageBg: '#F8FAFC', stageEdge: '#E2E8F0',
	// item: flat pastel orange, same-hue darker edge
	item: '#FFD6A5', itemEdge: '#F0A35E', itemText: '#9A5B1E',
	// container whose extent matters: pale lavender
	parent: '#F3E8FF', parentEdge: '#D8B4FE', parentText: '#7E22CE',
	// neutral container: white with slate edge
	frame: '#FFFFFF', frameEdge: '#CBD5E1', frameText: '#64748B',
	// box model bands
	margin: '#FFE8D1', marginText: '#C2410C',
	border: '#F1E3B4', borderText: '#A16207',
	padding: '#D9F2E3', paddingText: '#15803D',
	content: '#D6E6FB', contentText: '#1D4ED8',
	// annotations
	dim: '#6366F1',        // measurement lines and labels
	force: '#A855F7',      // invisible forces: dashed + dot
	text: '#334155', muted: '#64748B', faint: '#94A3B8',
	wrong: '#BE123C', wrongBg: '#FFE4E6', wrongEdge: '#FECDD3',
	right: '#15803D', rightBg: '#DCFCE7', rightEdge: '#86EFAC',
};

const MONO = "'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace";
const SANS = "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/* ---------------- parsing ---------------- */

function parseScenes(source) {
	const scenes = [];
	let cur = {};
	const flush = () => { if (Object.keys(cur).length) scenes.push(cur); cur = {}; };
	for (const raw of source.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;
		if (line === '---') { flush(); continue; }
		for (const part of line.split('|')) {
			const m = part.trim().match(/^([\w-]+)\s*=\s*(.*)$/);
			if (m) cur[m[1]] = m[2].replace(/^"|"$/g, '').trim();
		}
	}
	flush();
	return scenes;
}

const num = (v, d) => (v === undefined || v === '' ? d : Number(v));

/* ---------------- SVG primitives ---------------- */

// A dimension line in the engineering-drawing sense: a thin line with
// perpendicular end ticks and a mono label. Horizontal when y1 === y2.
function dim(x1, y1, x2, y2, label, opts = {}) {
	const color = opts.color || C.dim;
	const horizontal = y1 === y2;
	const t = 4; // tick half-length
	const ticks = horizontal
		? `<line x1="${x1}" y1="${y1 - t}" x2="${x1}" y2="${y1 + t}"/><line x1="${x2}" y1="${y2 - t}" x2="${x2}" y2="${y2 + t}"/>`
		: `<line x1="${x1 - t}" y1="${y1}" x2="${x1 + t}" y2="${y1}"/><line x1="${x2 - t}" y1="${y2}" x2="${x2 + t}" y2="${y2}"/>`;
	let text = '';
	if (label) {
		if (horizontal) {
			const cx = (x1 + x2) / 2;
			const y = opts.below ? y1 + 14 : y1 - 6;
			text = `<text x="${cx}" y="${y}" text-anchor="middle">${esc(label)}</text>`;
		} else if (opts.rotate) {
			// Long labels on a vertical dimension read along the line, bottom to top,
			// the engineering-drawing convention; keeps the figure narrow.
			const cy = (y1 + y2) / 2, x = x1 + 12;
			text = `<text x="${x}" y="${cy}" text-anchor="middle" transform="rotate(-90 ${x} ${cy})">${esc(label)}</text>`;
		} else {
			const cy = (y1 + y2) / 2 + 4;
			const x = opts.left ? x1 - 8 : x1 + 8;
			text = `<text x="${x}" y="${cy}" text-anchor="${opts.left ? 'end' : 'start'}">${esc(label)}</text>`;
		}
	}
	return `<g class="cf-dim" stroke="${color}" fill="${color}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>${ticks}${text}</g>`;
}

// An invisible force: dashed line with a solid dot at its midpoint.
function force(x1, y1, x2, y2, label, opts = {}) {
	const color = opts.color || C.force;
	const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
	const horizontal = y1 === y2;
	const text = label
		? (horizontal
			? `<text x="${cx}" y="${cy - 8}" text-anchor="middle">${esc(label)}</text>`
			: `<text x="${cx + 9}" y="${cy + 4}" text-anchor="start">${esc(label)}</text>`)
		: '';
	return `<g class="cf-force" stroke="${color}" fill="${color}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-dasharray="5 4"/><circle cx="${cx}" cy="${cy}" r="4" stroke="none"/>${text}</g>`;
}

// A direction arrow: solid 2px line with a flat triangle head.
function arrow(x1, y1, x2, y2, label, opts = {}) {
	const color = opts.color || C.force;
	const id = `ah-${Math.abs(Math.round(x1 * 31 + y1 * 17 + x2 * 7 + y2)).toString(36)}-${color.slice(1)}`;
	const text = label ? `<text x="${(x1 + x2) / 2}" y="${y1 - 7}" text-anchor="middle">${esc(label)}</text>` : '';
	return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="${color}"/></marker></defs><g class="cf-arrow" stroke="${color}" fill="${color}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="2" marker-end="url(#${id})"/>${text}</g>`;
}

const svgOpen = (w, h) => `<svg class="cf-overlay" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;

// A flat pastel box (HTML), absolutely positioned inside the scene.
function box(x, y, w, h, fill, edge, extra = '') {
	return `<div class="cf-box" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${fill};border-color:${edge};${extra}"></div>`;
}

// A small mono label placed inside a band, top-left.
function bandLabel(x, y, text, color, bg) {
	const backing = bg ? `background:${bg};padding:1px 3px;margin:-1px -3px;border-radius:2px;` : '';
	return `<span class="cf-band-label" style="left:${x}px;top:${y}px;color:${color};${backing}">${esc(text)}</span>`;
}

// The mono selector tag that names a box (`.teaser`, `img.lede`).
function tag(x, y, text, color, bg) {
	return `<span class="cf-tag" style="left:${x}px;top:${y}px;color:${color};background:${bg || 'transparent'}">${esc(text)}</span>`;
}

const scene = (w, h, inner) => `<div class="cf-scene" style="width:${w}px;height:${h}px">${inner}</div>`;

/* ============================================================
   MODE: box — the concentric box model bands
   keys: width height padding border margin sizing(content-box|border-box) label
   The rendered width is computed exactly as the browser computes it.
   ============================================================ */
function renderBox(s) {
	const sizing = s.sizing === 'border-box' ? 'border-box' : 'content-box';
	const W = num(s.width, 120), H = num(s.height, 56);
	const p = num(s.padding, 16), b = num(s.border, 2), m = num(s.margin, 20);
	// content box dimensions after the sizing rule
	const cw = sizing === 'border-box' ? W - 2 * p - 2 * b : W;
	const ch = sizing === 'border-box' ? H - 2 * p - 2 * b : H;
	const borderW = cw + 2 * p + 2 * b, borderH = ch + 2 * p + 2 * b;
	const outerW = borderW + 2 * m, outerH = borderH + 2 * m;
	const pad = 14, dimGap = 30;
	const sw = outerW + 2 * pad, sh = outerH + 2 * pad + dimGap;
	const ox = pad, oy = pad;

	let html = '';
	// margin band: dashed edge because the margin has no visible edge in the browser
	html += box(ox, oy, outerW, outerH, C.margin, '#FDBA74', 'border-style:dashed');
	html += bandLabel(ox + 6, oy + 3, `margin ${m}`, C.marginText);
	const bx = ox + m, by = oy + m;
	html += box(bx, by, borderW, borderH, C.border, '#E3C56D');
	const px = bx + b, py = by + b;
	html += box(px, py, borderW - 2 * b, borderH - 2 * b, C.padding, '#86EFAC');
	// The border band is too thin to hold a label, so its label borrows the
	// padding band's bottom row, right-aligned, in the border color.
	html += bandLabel(px + 6, py + 3, `padding ${p}`, C.paddingText);
	html += `<span class="cf-band-label" style="right:${sw - (px + borderW - 2 * b) + 6}px;top:${py + borderH - 2 * b - 12}px;color:${C.borderText}">border ${b}</span>`;
	const cx = px + p, cy = py + p;
	html += box(cx, cy, cw, ch, C.content, '#93C5FD');
	html += `<span class="cf-band-label cf-center" style="left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px;color:${C.contentText}">${cw} × ${ch}</span>`;
	if (s.label) html += tag(ox, oy - 12, s.label, C.muted);

	// the width the browser reports for the border box
	const dy = oy + outerH + 16;
	let svg = svgOpen(sw, sh);
	svg += dim(bx, dy, bx + borderW, dy, `${sizing === 'border-box' ? 'width' : 'rendered'} ${borderW}px`, { below: true });
	svg += '</svg>';
	return scene(sw, sh, html + svg);
}

/* ============================================================
   MODE: margin — vertical margins meeting between two stacked blocks
   keys: a (margin-bottom of the first block) b (margin-top of the second)
         label-a label-b context(flow|flex)
   In normal flow the margins collapse to max(a, b); in a flex column
   they do not and the gap is a + b.
   ============================================================ */
function renderMargin(s) {
	const a = num(s.a, 24), b = num(s.b, 16);
	const flex = s.context === 'flex';
	const gap = flex ? a + b : Math.max(a, b);
	const scale = 1.5;
	const vA = Math.round(a * scale), vB = Math.round(b * scale);
	const vGap = flex ? vA + vB : Math.max(vA, vB);
	const W = 196, blockH = 40, padV = 14, padH = 44;
	const sw = W + padH * 2, sh = padV * 2 + blockH * 2 + vGap;
	const x = padH, y1 = padV, y2 = y1 + blockH + vGap;

	let html = '';
	// Box A (Top Element)
	html += box(x, y1, W, blockH, C.item, C.itemEdge);
	html += `<div style="position:absolute;left:${x}px;top:${y1}px;width:${W}px;height:${blockH}px;display:flex;align-items:center;justify-content:center;pointer-events:none;"><span style="font-family:${MONO};font-size:11px;font-weight:700;color:${C.itemText};">${esc(s['label-a'] || 'h2.headline')}</span></div>`;

	// Margin area between Box A and Box B
	if (flex) {
		// Flex column: margins stack additively into a combined gap
		// Top band: Box A's bottom margin (blends directly, no confusing inner box)
		html += `<div style="position:absolute;left:${x}px;top:${y1 + blockH}px;width:${W}px;height:${vA}px;background:#FFF7ED;border:1.5px dashed #F97316;border-radius:4px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">`
			+ `<span style="font-family:${MONO};font-size:9.5px;font-weight:700;color:#C2410C;">margin-bottom ${a}</span>`
			+ `</div>`;

		// Bottom band: Box B's top margin (blends directly, no confusing inner box)
		html += `<div style="position:absolute;left:${x}px;top:${y1 + blockH + vA}px;width:${W}px;height:${vB}px;background:#FEF3C7;border:1.5px dashed #D97706;border-radius:4px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">`
			+ `<span style="font-family:${MONO};font-size:9.5px;font-weight:700;color:#B45309;">margin-top ${b}</span>`
			+ `</div>`;
	} else {
		// Normal block flow: margins collapse into max(a, b)
		// Parallel tracks eliminate overlapping borders and provide crystal-clear visual comparison
		const laneGap = 8;
		const laneW = Math.floor((W - laneGap) / 2);
		const xLaneA = x;
		const xLaneB = x + W - laneW;

		// Lane A (Left): Headline's bottom margin (blends directly with peach band)
		html += `<div style="position:absolute;left:${xLaneA}px;top:${y1 + blockH}px;width:${laneW}px;height:${vA}px;background:#FFF7ED;border:1.5px dashed #F97316;border-radius:4px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">`
			+ `<span style="font-family:${MONO};font-size:9px;font-weight:700;color:#C2410C;">margin-bottom ${a}</span>`
			+ `</div>`;
		if (vA < vGap) {
			html += `<div style="position:absolute;left:${xLaneA}px;top:${y1 + blockH + vA}px;width:${laneW}px;height:${vGap - vA}px;border:1px dashed #CBD5E1;border-radius:3px;background:rgba(248,250,252,0.8);box-sizing:border-box;display:flex;align-items:center;justify-content:center;">`
				+ `<span style="font-family:${MONO};font-size:7.5px;font-weight:600;color:#94A3B8;">(absorbed)</span>`
				+ `</div>`;
		}

		// Lane B (Right): Paragraph's top margin (blends directly with amber band)
		html += `<div style="position:absolute;left:${xLaneB}px;top:${y2 - vB}px;width:${laneW}px;height:${vB}px;background:#FEF3C7;border:1.5px dashed #D97706;border-radius:4px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">`
			+ `<span style="font-family:${MONO};font-size:9px;font-weight:700;color:#B45309;">margin-top ${b}</span>`
			+ `</div>`;
		if (vB < vGap) {
			html += `<div style="position:absolute;left:${xLaneB}px;top:${y1 + blockH}px;width:${laneW}px;height:${vGap - vB}px;border:1px dashed #CBD5E1;border-radius:3px;background:rgba(248,250,252,0.8);box-sizing:border-box;display:flex;align-items:center;justify-content:center;">`
				+ `<span style="font-family:${MONO};font-size:7.5px;font-weight:600;color:#94A3B8;">(absorbed)</span>`
				+ `</div>`;
		}
	}

	// Box B (Bottom Element)
	html += box(x, y2, W, blockH, C.item, C.itemEdge);
	html += `<div style="position:absolute;left:${x}px;top:${y2}px;width:${W}px;height:${blockH}px;display:flex;align-items:center;justify-content:center;pointer-events:none;"><span style="font-family:${MONO};font-size:11px;font-weight:700;color:${C.itemText};">${esc(s['label-b'] || 'p.dek')}</span></div>`;

	// Dimension caliper line on the right
	let svg = svgOpen(sw, sh);
	const dx = x + W + 14;
	svg += dim(dx, y1 + blockH, dx, y2, `${gap}px`, { color: flex ? C.right : C.dim });
	svg += '</svg>';
	return scene(sw, sh, html + svg);
}

/* ============================================================
   MODE: float — floated children and the parent that (does not) contain them
   keys: items(3) float(left|right) contain(none|flow-root) parent(.teaser)
   Live floats: the children really float; the parent really collapses.
   Prince 16 ignores display:flow-root, so containment is applied with a
   clearfix class that produces the identical geometry in every renderer.
   ============================================================ */
function renderFloat(s) {
	const n = num(s.items, 3), side = s.float === 'right' ? 'right' : 'left';
	const contain = s.contain && s.contain !== 'none';
	const itemW = 52, itemH = 40, gap = 6, ppad = 10, pborder = 2;
	const parentW = n * itemW + (n - 1) * gap + 2 * ppad + 24; // room so the floats read as floats
	const pad = 10, arrowRow = 36, dimCol = 56;
	// Parent height: when uncontained, content height is 0px, so height is only padding + border
	const parentH = contain ? itemH + 2 * ppad + 2 * pborder : 2 * ppad + 2 * pborder;
	const x = pad, y = pad + arrowRow;
	const sh = 176;
	const sw = parentW + pad * 2 + dimCol;

	let items = '';
	for (let i = 0; i < n; i++) {
		items += `<div class="cf-float-item" style="float:${side};width:${itemW}px;height:${itemH}px;margin-${side === 'left' ? 'right' : 'left'}:${i < n - 1 ? gap : 0}px">img</div>`;
	}
	const parent = `<div class="cf-parent${contain ? ' cf-contain' : ''}" style="left:${x}px;top:${y}px;width:${parentW}px;height:${parentH}px;padding:${ppad}px;border-width:${pborder}px">${items}</div>`;

	// Parent tag label
	const parentTitle = s.parent || '.teaser';
	const labelText = contain ? `${parentTitle} (display: flow-root)` : `${parentTitle} (height: 24px · collapsed)`;
	const label = tag(x, y - 13, labelText, contain ? C.parentText : C.wrong);

	// Following sibling element in normal document flow
	let sibling = '';
	if (contain) {
		sibling = `<div class="cf-sibling is-clean" style="position:absolute;left:${x}px;top:${y + parentH + 12}px;width:${parentW}px;box-sizing:border-box;background:#FFFFFF;border:1.5px solid #86EFAC;border-radius:4px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;">`
			+ `<span style="font-family:${MONO};font-size:10px;font-weight:700;color:#15803D;">p.article-lede</span>`
			+ `<span style="font-family:${MONO};font-size:9.5px;font-weight:700;background:#DCFCE7;color:#15803D;padding:2px 6px;border-radius:3px;">✓ flow resumes below</span>`
			+ `</div>`;
	} else {
		sibling = `<div class="cf-sibling is-collision" style="position:absolute;left:${x}px;top:${y + parentH + 6}px;width:${parentW}px;height:62px;box-sizing:border-box;background:rgba(254,226,226,0.55);border:1.5px dashed #FDA4AF;border-radius:4px;padding:4px 8px;display:flex;flex-direction:column;justify-content:flex-end;">`
			+ `<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:2px;">`
			+ `<span style="font-family:${MONO};font-size:9.5px;font-weight:700;color:#BE123C;">p.article-lede</span>`
			+ `<span style="font-family:${MONO};font-size:9px;font-weight:700;background:#FEE2E2;color:#BE123C;padding:1px 5px;border-radius:3px;">✕ collision: buried by floats</span>`
			+ `</div>`
			+ `</div>`;
	}

	let svg = svgOpen(sw, sh);
	// float direction arrow above the items
	const ax1 = x + ppad + pborder + n * itemW + (n - 1) * gap, ax2 = x + ppad + pborder;
	const ay = y - 24;
	svg += side === 'left' ? arrow(ax1 - 8, ay, ax2 + 6, ay, `float: ${side}`) : arrow(ax2, ay, ax1, ay, `float: ${side}`);

	// Parent height measurement
	const dx = x + parentW + 16;
	svg += dim(dx, y, dx, y + parentH, `${parentH}px`, { rotate: true, color: contain ? C.dim : C.wrong });

	if (!contain) {
		// Demarcation bracket for the overflow at dx + 18 so it never collides
		const floatBottom = y + ppad + pborder + itemH;
		svg += dim(dx + 18, y, dx + 18, floatBottom, '52px', { rotate: true, color: C.muted });
	}

	svg += '</svg>';
	return scene(sw, sh, label + sibling + parent + svg);
}

/* ============================================================
   MODE: float-text — an image floated inside running text
   keys: float(left|right) margin("0 16 8 0") clear(none|left|both) width(300) lines
   The text really wraps; the float's margin is drawn as the band that
   keeps the words off the image.
   ============================================================ */
function renderFloatText(s) {
	const side = s.float === 'right' ? 'right' : 'left';
	const mv = (s.margin || '0 16 8 0').split(/\s+/).map(Number);
	const [mt, mr, mb, ml] = mv.length === 4 ? mv : [mv[0], mv[1] ?? mv[0], mv[2] ?? mv[0], mv[3] ?? mv[1] ?? mv[0]];
	const clear = s.clear && s.clear !== 'none' ? s.clear : '';
	const W = num(s.width, 262);
	const imgW = 84, imgH = 62;
	const text = s.text || 'The council voted 7 to 2 to extend the tram line past the harbour after a four hour hearing.';
	const byline = s.byline || 'By Arthur Vane, City Desk';

	// The margin band is a floated wrapper whose padding equals the margin,
	// so the words wrap around the exact same edge the real margin produces.
	// Its dashed edge is a real border (Prince drops `outline`); the 1px is
	// taken from the padding so the outer edge stays on the true margin edge.
	const bw = 1;
	const padv = [mt, mr, mb, ml].map((v) => Math.max(0, v - bw));
	const band = `<div class="cf-margin-band" style="float:${side};border-width:${bw}px;padding:${padv[0]}px ${padv[1]}px ${padv[2]}px ${padv[3]}px"><div class="cf-img" style="width:${imgW}px;height:${imgH}px">img.lede</div></div>`;
	const para = `<p class="cf-text">${esc(text)}</p>`;
	const by = `<p class="cf-byline${clear ? ' is-cleared' : ''}" style="${clear ? `clear:${clear}` : ''}">${esc(byline)}</p>`;
	const article = `<div class="cf-article" style="width:${W}px">${band}${para}${by}</div>`;
	const legend = `<span class="cf-legend"><i style="background:${C.margin};border-color:#FDBA74"></i>margin ${mt} ${mr} ${mb} ${ml}${clear ? `<i class="cf-legend-line"></i>clear: ${clear}` : ''}</span>`;
	return `<div class="cf-scene cf-scene-flow" style="width:${W}px">${article}${legend}</div>`;
}

/* ============================================================
   MODE: center — a fixed-width block inside a wider parent
   keys: parent(260 = the parent's content-box width, the containing block)
         width(120) method(auto|text-align) label parent_label
   With margin auto the free space splits equally; with text-align the
   box stays at the left edge and only its inline content moves.
   ============================================================ */
function renderCenter(s) {
	const innerW = num(s.parent, 260), W = num(s.width, 120), H = 44;
	const auto = (s.method || 'auto') === 'auto';
	const pad = 10, ppad = 11, pborder = 1;
	const P = innerW + 2 * ppad + 2 * pborder;
	const sw = P + 2 * pad, sh = H + 2 * ppad + 2 * pborder + 2 * pad + 8;
	const x = pad, y = pad + 8;
	const innerX = x + pborder + ppad;
	const childX = auto ? innerX + (innerW - W) / 2 : innerX;
	const childY = y + pborder + ppad;

	let html = box(x, y, P, H + 2 * ppad + 2 * pborder, C.frame, C.frameEdge);
	html += tag(x, y - 13, s.parent_label || '.hero', C.frameText);
	html += box(childX, childY, W, H, C.item, C.itemEdge);
	html += `<span class="cf-band-label cf-center" style="left:${childX}px;top:${childY}px;width:${W}px;height:${H}px;color:${C.itemText}">${esc(s.label || 'div.cta')}</span>`;

	let svg = svgOpen(sw, sh);
	const cy = childY + H / 2;
	if (auto) {
		const a = (innerW - W) / 2;
		svg += force(innerX, cy, childX, cy, `auto ${a}px`);
		svg += force(childX + W, cy, innerX + innerW, cy, `auto ${a}px`);
	} else {
		svg += force(childX + W, cy, innerX + innerW, cy, `free ${innerW - W}px`);
	}
	svg += '</svg>';
	return scene(sw, sh, html + svg);
}

/* ============================================================
   MODE: cascade — resolution cards comparing competing rules
   keys: source order selector decl spec color label state
   Draws an academic rule card with specificity and preview element.
   ============================================================ */
function renderCascade(s) {
	const source = s.source || 'styles.css';
	const order = s.order || 'Order 1';
	const sel = s.selector || '.btn-subscribe';
	const decl = s.decl || 'background: #2563eb;';
	const spec = s.spec || '';
	const metaText = s.meta || (spec ? `specificity ${spec}` : '');
	const color = s.color || '#2563eb';
	const textColor = s.textColor || '#ffffff';
	const border = s.border ? `border: ${s.border};` : '';
	const label = s.label || 'Subscribe';
	const state = s.state || '';
	const isOverridden = s.status === 'overridden' || s.overridden === 'true';
	const isWinner = s.status === 'winner' || s.winner === 'true';
	const W = 220;

	// Code declaration styling (strikethrough if overridden, like browser DevTools)
	const declHtml = isOverridden
		? `<span class="cf-cascade-prop" style="text-decoration:line-through;color:#94A3B8;opacity:0.75;">${esc(decl)}</span>`
		: `<span class="cf-cascade-prop" style="${isWinner ? 'color:#15803D;font-weight:600;' : ''}">${esc(decl)}</span>`;

	// Preview button styling
	let previewHtml = '';
	if (isOverridden) {
		previewHtml = `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">`
			+ `<div class="cf-cascade-btn" style="background:rgba(37,99,235,0.12);border:1.5px dashed #93C5FD;color:#2563eb;text-decoration:line-through;opacity:0.7;">${esc(label)}</div>`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#BE123C;background:#FFE4E6;border:1px solid #FECDD3;padding:1px 5px;border-radius:3px;">✕ Does not render</span>`
			+ `</div>`;
	} else if (isWinner) {
		previewHtml = `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">`
			+ `<div class="cf-cascade-btn" style="background:${color};color:${textColor};${border}box-shadow:0 1px 3px rgba(0,0,0,0.15);">${esc(label)}</div>`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#15803D;background:#DCFCE7;border:1px solid #86EFAC;padding:1px 5px;border-radius:3px;">✓ Live on page</span>`
			+ `</div>`;
	} else {
		previewHtml = `<div class="cf-cascade-btn" style="background:${color};color:${textColor};${border}">${esc(label)}</div>`;
	}

	const html = `<div class="cf-cascade-card" style="width:${W}px"><div class="cf-cascade-head"><span class="cf-cascade-src">${esc(source)}</span><span class="cf-cascade-order">${esc(order)}</span></div><div class="cf-cascade-code"><span class="cf-cascade-sel">${esc(sel)}</span> {<br>&nbsp;&nbsp;${declHtml}<br>}</div>${metaText ? `<div class="cf-cascade-meta"><span class="cf-cascade-spec">${esc(metaText)}</span></div>` : ''}<div class="cf-cascade-preview">${previewHtml}</div>${state ? `<div class="cf-cascade-state">${esc(state)}</div>` : ''}</div>`;
	return `<div class="cf-scene cf-scene-flow" style="width:${W}px">${html}</div>`;
}

/* ============================================================
   MODE: display — comparing block, inline, and inline-block roles
   keys: display(inline|inline-block|block) label width height note
   ============================================================ */
function renderDisplay(s) {
	const disp = s.display || 'inline';
	const label = s.label || 'LIVE';
	const W = num(s.width, 0);
	const H = num(s.height, 0);
	const note = s.note || '';
	const cardW = 220;

	let badgeClass = 'is-inline';
	let styleAttr = '';
	if (disp === 'inline-block') {
		badgeClass = 'is-ib';
		if (W) styleAttr += `width:${W}px;`;
		if (H) styleAttr += `height:${H}px;line-height:${H - 4}px;`;
	} else if (disp === 'block') {
		badgeClass = 'is-block';
		if (H) styleAttr += `height:${H}px;line-height:${H - 4}px;`;
	}

	const html = `<div class="cf-display-card" style="width:${cardW}px"><div class="cf-cascade-head"><span class="cf-cascade-src">display: ${esc(disp)}</span></div><div class="cf-display-flow">${disp === 'block' ? `Headline Story<span class="cf-display-badge ${badgeClass}" style="${styleAttr}">${esc(label)}</span>Section Update` : `News Wire <span class="cf-display-badge ${badgeClass}" style="${styleAttr}">${esc(label)}</span> Special Report`}</div>${note ? `<div class="cf-display-note">${esc(note)}</div>` : ''}</div>`;
	return `<div class="cf-scene cf-scene-flow" style="width:${cardW}px">${html}</div>`;
}

/* ============================================================
   MODE: baseline — inline-block vertical-align baseline trap vs middle
   keys: align(baseline|middle)
   ============================================================ */
function renderBaseline(s) {
	const align = s.align || 'baseline';
	const isBaseline = align === 'baseline';
	const cardW = 280;
	const cardH = 146;

	const bw = 50;
	const bh = 30;
	const gap = 8;
	const padX = 14;

	const y1 = isBaseline ? 54 : 49;
	const y2 = isBaseline ? 44 : 49;
	const y3 = isBaseline ? 44 : 49;

	const x1 = padX;
	const x2 = padX + bw + gap;
	const x3 = padX + (bw + gap) * 2;

	let html = `<div class="cf-display-card" style="width:${cardW}px;height:${cardH}px;position:relative;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:8px;padding:10px;box-sizing:border-box;">`;

	html += `<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #E2E8F0;padding-bottom:6px;">`;
	html += `<span style="font-family:${MONO};font-size:9.5px;font-weight:700;color:#64748B;">.toolbar</span>`;
	html += `<span style="font-family:${MONO};font-size:8.5px;color:${isBaseline ? C.wrong : C.right};background:${isBaseline ? C.wrongBg : C.rightBg};padding:2px 7px;border-radius:3px;border:1px solid ${isBaseline ? C.wrongEdge : C.rightEdge};font-weight:700;">${isBaseline ? 'vertical-align: baseline' : 'vertical-align: middle'}</span>`;
	html += `</div>`;

	const guideY = isBaseline ? 74 : 64;
	const guideLabel = isBaseline ? 'baseline' : 'midpoint';

	// Guideline across the container
	html += `<div style="position:absolute;left:10px;right:78px;top:${guideY}px;height:0;border-top:1px dashed #A855F7;z-index:1;pointer-events:none;"></div>`;
	// Interrupted line with label at the right clearance zone
	html += `<div style="position:absolute;right:8px;top:${guideY - 8}px;display:flex;align-items:center;gap:3px;z-index:2;">`;
	html += `<span style="width:8px;height:0;border-top:1px dashed #A855F7;display:inline-block;"></span>`;
	html += `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#7E22CE;background:#FFFFFF;padding:0 3px;letter-spacing:0.02em;">${guideLabel}</span>`;
	html += `<span style="width:8px;height:0;border-top:1px dashed #A855F7;display:inline-block;"></span>`;
	html += `</div>`;

	html += `<div style="position:absolute;left:${x1}px;top:${y1}px;width:${bw}px;height:${bh}px;background:#DC2626;color:#FFFFFF;border-radius:4px;font-family:${MONO};font-size:9.5px;font-weight:700;display:flex;align-items:center;justify-content:center;box-sizing:border-box;z-index:3;box-shadow:0 1px 2px rgba(0,0,0,0.1);">LIVE</div>`;

	html += `<div style="position:absolute;left:${x2}px;top:${y2}px;width:${bw}px;height:${bh}px;background:#F1F5F9;border:1.5px dashed #94A3B8;border-radius:4px;font-family:${MONO};font-size:7.5px;color:#64748B;display:flex;align-items:center;justify-content:center;box-sizing:border-box;z-index:3;">(empty)</div>`;

	html += `<div style="position:absolute;left:${x3}px;top:${y3}px;width:${bw}px;height:${bh}px;background:#D97706;color:#FFFFFF;border-radius:4px;font-family:${MONO};font-size:7.5px;font-weight:700;display:flex;align-items:center;justify-content:center;box-sizing:border-box;z-index:3;box-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:-0.02em;">UPDATING</div>`;

	const noteText = isBaseline ? '✕ Empty &amp; overflow badges jump upward' : '✓ Middle aligns geometric centers uniformly';
	const noteColor = isBaseline ? C.wrong : C.right;
	html += `<div style="position:absolute;left:10px;right:10px;bottom:9px;text-align:center;font-family:${MONO};font-size:8.5px;font-weight:700;color:${noteColor};">${noteText}</div>`;

	html += `</div>`;
	return `<div class="cf-scene cf-scene-flow" style="width:${cardW}px">${html}</div>`;
}

/* ============================================================
   MODE: banner — visualising block, inline-block, and inline roles in an alert bar
   keys: label
   ============================================================ */
function renderBanner(s) {
	const cardW = 590;
	const cardH = 176;
	const label = s.label || 'LIVE';
	const chromeH = 32;
	const bannerH = 56;

	let html = `<div style="width:${cardW}px;height:${cardH}px;position:relative;font-family:${SANS};box-sizing:border-box;">`;

	// 1. Browser Window Chrome (Simulated Viewport)
	html += `<div style="width:${cardW}px;height:${chromeH}px;background:#F1F5F9;border:1px solid #CBD5E1;border-radius:8px 8px 0 0;box-sizing:border-box;display:flex;align-items:center;padding:0 12px;justify-content:space-between;">`;
	html += `<div style="display:flex;gap:5px;align-items:center;">`;
	html += `<span style="width:9px;height:9px;border-radius:50%;background:#EF4444;display:inline-block;"></span>`;
	html += `<span style="width:9px;height:9px;border-radius:50%;background:#F59E0B;display:inline-block;"></span>`;
	html += `<span style="width:9px;height:9px;border-radius:50%;background:#10B981;display:inline-block;"></span>`;
	html += `<span style="background:#FFFFFF;border:1px solid #CBD5E1;border-radius:4px;padding:2px 10px;font-family:${MONO};font-size:11.5px;color:#475569;margin-left:10px;font-weight:500;white-space:nowrap;">nationaltimes.com/live</span>`;
	html += `</div>`;
	// DevTools element inspector tag in the chrome
	html += `<div style="font-family:${MONO};font-size:11.5px;font-weight:700;color:#0369A1;background:#E0F2FE;border:1px solid #BAE6FD;padding:2px 8px;border-radius:4px;white-space:nowrap;">&lt;header.alert-banner&gt; display: block (100% width)</div>`;
	html += `</div>`;

	// 2. Rendered UI: header.alert-banner (stretching 100% of viewport width)
	html += `<div style="position:relative;width:${cardW}px;height:${bannerH}px;background:#0F172A;border:1px solid #CBD5E1;border-top:none;border-radius:0 0 6px 6px;display:flex;align-items:center;padding:0 16px;box-sizing:border-box;gap:14px;">`;
	// Red Badge: span.badge (DevTools inspected content box with cyan highlight)
	html += `<span style="width:80px;height:32px;background:#DC2626;color:#FFFFFF;border-radius:4px;font-family:${MONO};font-weight:700;font-size:12.5px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.3);letter-spacing:0.04em;outline:2px solid #38BDF8;box-shadow:0 0 0 2px rgba(56,189,248,0.3);">${esc(label)}</span>`;
	// Headline Text: p.alert-text (DevTools inspected phrasing box with green highlight)
	html += `<span style="display:inline-block;border:1.5px dashed #4ADE80;background:rgba(74,222,128,0.12);padding:3px 8px;border-radius:4px;color:#F8FAFC;font-family:${SANS};font-size:14px;font-weight:500;white-space:nowrap;">Major transit disruptions reported across downtown terminals.</span>`;
	html += `</div>`;

	// 3. DevTools Floating Inspector Tooltips (anchored directly to the inspected elements)
	// Tooltip 1: span.badge (anchored under badge at x=14)
	const tip1X = 14, tip1Y = 96, tip1W = 216;
	html += `<div style="position:absolute;left:${tip1X}px;top:${tip1Y}px;width:${tip1W}px;background:#1E293B;border:1px solid #475569;border-radius:6px;padding:6px 10px;box-shadow:0 4px 12px rgba(0,0,0,0.25);box-sizing:border-box;z-index:10;">`;
	// Pointer notch touching the badge
	html += `<div style="position:absolute;left:42px;top:-6px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid #475569;"></div>`;
	html += `<div style="position:absolute;left:43px;top:-5px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:5px solid #1E293B;"></div>`;
	html += `<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:3px;margin-bottom:3px;">`;
	html += `<span style="font-family:${MONO};font-size:12px;font-weight:700;color:#38BDF8;">span.badge</span>`;
	html += `<span style="font-family:${MONO};font-size:11.5px;font-weight:600;color:#94A3B8;">80 × 32 px</span>`;
	html += `</div>`;
	html += `<div style="font-family:${MONO};font-size:11.5px;color:#E2E8F0;"><span style="color:#94A3B8;">display:</span> <span style="color:#F43F5E;font-weight:700;">inline-block</span></div>`;
	html += `<div style="font-family:${SANS};font-size:11px;color:#94A3B8;margin-top:2px;line-height:1.35;">Rigid box geometry inside text stream</div>`;
	html += `</div>`;

	// Tooltip 2: p.alert-text (anchored under text at x=244)
	const tip2X = 244, tip2Y = 96, tip2W = 332;
	html += `<div style="position:absolute;left:${tip2X}px;top:${tip2Y}px;width:${tip2W}px;background:#1E293B;border:1px solid #475569;border-radius:6px;padding:6px 10px;box-shadow:0 4px 12px rgba(0,0,0,0.25);box-sizing:border-box;z-index:10;">`;
	// Pointer notch touching the text box
	html += `<div style="position:absolute;left:88px;top:-6px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid #475569;"></div>`;
	html += `<div style="position:absolute;left:89px;top:-5px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:5px solid #1E293B;"></div>`;
	html += `<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:3px;margin-bottom:3px;">`;
	html += `<span style="font-family:${MONO};font-size:12px;font-weight:700;color:#4ADE80;">p.alert-text</span>`;
	html += `<span style="font-family:${MONO};font-size:11.5px;font-weight:600;color:#94A3B8;">440 × 26 px</span>`;
	html += `</div>`;
	html += `<div style="font-family:${MONO};font-size:11.5px;color:#E2E8F0;"><span style="color:#94A3B8;">display:</span> <span style="color:#22C55E;font-weight:700;">inline</span></div>`;
	html += `<div style="font-family:${SANS};font-size:11px;color:#94A3B8;margin-top:2px;line-height:1.35;">Phrasing flow: wraps naturally alongside badge</div>`;
	html += `</div>`;

	html += `</div>`; // end scene
	return scene(cardW, cardH, html);
}

/* ============================================================
   MODE: two-value — visualising CSS Display 3 outer vs inner display types
   keys: variant(inline-flow|inline-flow-root)
   ============================================================ */
function renderTwoValue(s) {
	const isRoot = s.variant === 'inline-flow-root';
	const cardW = 280;
	const cardH = 200;

	let html = `<div class="cf-display-card" style="width:${cardW}px;height:${cardH}px;position:relative;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:8px;padding:12px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">`;

	html += `<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #E2E8F0;padding-bottom:6px;">`;
	html += `<span style="font-family:${MONO};font-size:11.5px;font-weight:700;color:#334155;white-space:nowrap;">${isRoot ? 'display: inline-block' : 'display: inline'}</span>`;
	html += `<span style="font-family:${MONO};font-size:11px;font-weight:700;color:${isRoot ? C.right : C.wrong};background:${isRoot ? C.rightBg : C.wrongBg};padding:2px 6px;border-radius:4px;border:1px solid ${isRoot ? C.rightEdge : C.wrongEdge};white-space:nowrap;">${isRoot ? 'inline flow-root' : 'inline flow'}</span>`;
	html += `</div>`;

	html += `<div style="background:#F8FAFC;border:1px dashed #CBD5E1;border-radius:6px;padding:10px 12px;font-family:Georgia,serif;font-size:12.5px;line-height:1.7;color:#334155;position:relative;">`;
	if (!isRoot) {
		html += `Breaking wire: <span style="background:#FFE4E6;border:1.5px dashed #BE123C;color:#BE123C;font-family:${MONO};font-size:11.5px;font-weight:700;padding:3px 7px;border-radius:3px;box-shadow:0 0 0 3px rgba(254,205,211,0.5);">LIVE</span> transit alert.`;
		html += `<div style="font-family:${MONO};font-size:11px;font-weight:600;color:#BE123C;margin-top:6px;line-height:1.35;">✕ Vertical padding bleeds over lines</div>`;
	} else {
		html += `Breaking wire: <span style="background:#DCFCE7;border:1.5px solid #15803D;color:#15803D;font-family:${MONO};font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:4px;display:inline-block;line-height:1.2;">LIVE</span> transit alert.`;
		html += `<div style="font-family:${MONO};font-size:11px;font-weight:600;color:#15803D;margin-top:6px;line-height:1.35;">✓ Line box expands; BFC contains box</div>`;
	}
	html += `</div>`;

	const innerNote = isRoot ? 'independent BFC' : 'uncontained flow';
	const noteColor = isRoot ? C.right : C.wrong;
	html += `<div style="text-align:center;font-family:${MONO};font-size:11px;font-weight:700;color:${noteColor};border-top:1px solid #F1F5F9;padding-top:6px;line-height:1.4;">Outer: inline in text<br>Inner: ${innerNote}</div>`;

	html += `</div>`;
	return `<div class="cf-scene cf-scene-flow" style="width:${cardW}px">${html}</div>`;
}

/* ============================================================
   MODE: position — absolute positioning with and without a positioned ancestor
   keys: context(static|relative) label parent_label

   The figure visualises the *containing block* rule by drawing three nested
   regions: a dashed viewport frame (the initial containing block, the
   fallback that static parents collapse to), the .card parent box, and
   the absolute .tooltip box anchored at (top:0; left:0).

   WRONG (.card is static): the tooltip MUST land at the viewport edge, far
   from the share button inside the card — the visual story is the distance.
   RIGHT (.card is relative): the tooltip lands at the card's top-left, on
   top of the button area.

   To keep every label readable, the .card name tag is placed BELOW the
   card so it never collides with the annotation chip beside the tooltip,
   and the tooltip itself carries a two-line label (selector + CSS offset)
   so the caption's claim ("the tooltip escapes to the viewport") is
   literally spelled out on the painted orange box.
   ============================================================ */
/* ============================================================
   MODE: position — absolute positioning with and without a positioned ancestor
   keys: context(static|relative) label parent_label
   ============================================================ */
function renderPosition(s) {
	const rel = s.context === 'relative';
	const sw = 330, sh = 208;

	// Viewport (browser window) dimensions
	const vx = 8, vy = 8, vw = sw - 16, vh = sh - 16;

	let html = '';

	// 1) Simulated browser viewport frame with soft drop shadow
	html += `<div class="cf-box" style="left:${vx}px;top:${vy}px;width:${vw}px;height:${vh}px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;box-sizing:border-box;box-shadow:0 10px 25px -4px rgba(15,23,42,0.09), 0 4px 10px -2px rgba(15,23,42,0.04);"></div>`;

	// 2) Browser top chrome bar
	html += `<div style="position:absolute;left:${vx}px;top:${vy}px;width:${vw}px;height:38px;background:#FAFBFC;border-bottom:1px solid #E2E8F0;border-radius:11px 11px 0 0;display:flex;align-items:center;padding:0 14px;gap:10px;box-sizing:border-box;z-index:2;">`;
	html += `<div style="display:flex;gap:6px;">`;
	html += `<span style="width:10px;height:10px;border-radius:50%;background:#FF5F56;display:inline-block;"></span>`;
	html += `<span style="width:10px;height:10px;border-radius:50%;background:#FFBD2E;display:inline-block;"></span>`;
	html += `<span style="width:10px;height:10px;border-radius:50%;background:#27C93F;display:inline-block;"></span>`;
	html += `</div>`;
	html += `<div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:2px 12px;font-family:${SANS};font-size:12.5px;font-weight:500;color:#334155;flex-grow:1;text-align:center;">nationaltimes.com/story</div>`;
	html += `</div>`;

	// Dimensions for the share card and inner elements
	// Card width 232px gives plenty of room for .share-card and position: relative on one line without wrapping!
	const cardW = 232, cardH = 100;
	const cardX = vx + Math.round((vw - cardW) / 2);
	const cardY = vy + 64;

	const btnW = 138, btnH = 28;
	const btnX = Math.round((cardW - btnW) / 2);
	const btnY = 62;

	const tipW = 124, tipH = 22;
	const tipX = Math.round((cardW - tipW) / 2);
	const tipY = 32;

	const shareBtnSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px;"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;

	if (rel) {
		// --- RIGHT PANEL (position: relative) ---
		// DevTools inspection indicator at top of content area
		html += `<div style="position:absolute;left:${vx}px;right:${vx}px;top:${vy + 46}px;display:flex;justify-content:center;z-index:3;">`;
		html += `<div style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:4px;padding:2px 8px;font-family:${MONO};font-size:10px;font-weight:700;color:#15803D;white-space:nowrap;">anchored to .share-card (0, 0)</div>`;
		html += `</div>`;

		// .share-card establishes an active containing block enclosing BOTH button and tooltip
		html += `<div style="position:absolute;left:${cardX}px;top:${cardY}px;width:${cardW}px;height:${cardH}px;background:rgba(56,189,248,0.06);border:1.5px solid #38BDF8;border-radius:7px;box-sizing:border-box;z-index:2;">`;

		// Header tag inside .share-card
		html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 10px 0 10px;white-space:nowrap;">`;
		html += `<span style="font-family:${MONO};font-size:11px;font-weight:700;color:#0284C7;white-space:nowrap;">.share-card</span>`;
		html += `<span style="font-family:${MONO};font-size:10px;font-weight:700;color:#0284C7;background:#E0F2FE;border:1px solid #BAE6FD;padding:1px 6px;border-radius:3px;white-space:nowrap;">position: relative</span>`;
		html += `</div>`;

		// Tooltip anchored inside .share-card right above the button
		html += `<div style="position:absolute;left:${tipX}px;top:${tipY}px;width:${tipW}px;height:${tipH}px;background:#0F172A;color:#F8FAFC;border-radius:4px;font-family:${SANS};font-size:11.5px;font-weight:500;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 5px rgba(0,0,0,0.25);box-sizing:border-box;outline:1.5px solid #38BDF8;">`;
		html += `<span>Share this article</span>`;
		// Downward beak touching button
		html += `<div style="position:absolute;bottom:-4px;left:50%;margin-left:-4px;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid #0F172A;"></div>`;
		html += `</div>`;

		// Share Story button inside .share-card
		html += `<div style="position:absolute;left:${btnX}px;top:${btnY}px;width:${btnW}px;height:${btnH}px;background:#2563EB;color:#FFFFFF;border-radius:5px;font-family:${SANS};font-size:11.5px;font-weight:600;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(37,99,235,0.3);box-sizing:border-box;">`;
		html += `${shareBtnSvg}<span>Share Story</span>`;
		html += `</div>`;

		html += `</div>`; // end .share-card
	} else {
		// --- LEFT PANEL (position: static) ---
		// 1) Escaped tooltip positioned at top-left of the viewport (Initial Containing Block)
		const escX = vx + 8;
		const escY = vy + 46;
		html += `<div style="position:absolute;left:${escX}px;top:${escY}px;width:${tipW}px;height:${tipH}px;background:#0F172A;color:#F8FAFC;border-radius:4px;font-family:${SANS};font-size:11.5px;font-weight:500;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3);outline:1.5px solid #38BDF8;box-sizing:border-box;z-index:4;">`;
		html += `<span>Share this article</span>`;
		html += `</div>`;

		// DevTools tag directly beside escaped tooltip
		html += `<div style="position:absolute;left:${escX + tipW + 6}px;top:${escY}px;height:${tipH}px;display:flex;align-items:center;padding:0 6px;background:#FFF1F2;border:1px solid #FECDD3;border-radius:3px;font-family:${MONO};font-size:9.5px;font-weight:700;color:#BE123C;box-sizing:border-box;white-space:nowrap;z-index:4;">`;
		html += `<span>top: 0 · left: 0 (ICB)</span>`;
		html += `</div>`;

		// 2) .share-card at the bottom with dashed pink outline (static — no anchor)
		html += `<div style="position:absolute;left:${cardX}px;top:${cardY}px;width:${cardW}px;height:${cardH}px;background:rgba(255,241,242,0.55);border:1.5px dashed #FDA4AF;border-radius:7px;box-sizing:border-box;z-index:2;">`;

		// Header tag inside .share-card
		html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 10px 0 10px;white-space:nowrap;">`;
		html += `<span style="font-family:${MONO};font-size:11px;font-weight:700;color:#BE123C;white-space:nowrap;">.share-card</span>`;
		html += `<span style="font-family:${MONO};font-size:10px;font-weight:700;color:#BE123C;background:#FFF1F2;border:1px solid #FECDD3;padding:1px 6px;border-radius:3px;white-space:nowrap;">position: static</span>`;
		html += `</div>`;

		// Ghost empty slot where tooltip should have been
		html += `<div style="position:absolute;left:${tipX}px;top:${tipY}px;width:${tipW}px;height:${tipH}px;border:1px dashed #FDA4AF;background:#FFF1F2;border-radius:4px;font-family:${MONO};font-size:10.5px;color:#BE123C;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">`;
		html += `<span>✕ tooltip escaped</span>`;
		html += `</div>`;

		// Share Story button inside .share-card
		html += `<div style="position:absolute;left:${btnX}px;top:${btnY}px;width:${btnW}px;height:${btnH}px;background:#2563EB;color:#FFFFFF;border-radius:5px;font-family:${SANS};font-size:11.5px;font-weight:600;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(37,99,235,0.3);box-sizing:border-box;">`;
		html += `${shareBtnSvg}<span>Share Story</span>`;
		html += `</div>`;

		html += `</div>`; // end .share-card
	}

	return scene(sw, sh, html);
}

/* ============================================================
   MODE: relative-shift — compares static (offsets ignored) vs relative (footprint reserved, visual shift)
   keys: mode(static|relative) label
   ============================================================ */
function renderRelativeShift(s) {
	const rel = s.mode === 'relative';
	const sw = 330, sh = 310;
	const vx = 8, vy = 8, vw = sw - 16, vh = sh - 16;
	const label = s.label || (rel ? '.badge-relative' : '.badge-static');

	let html = '';

	// 1) Simulated browser viewport frame with soft drop shadow
	html += `<div class="cf-box" style="left:${vx}px;top:${vy}px;width:${vw}px;height:${vh}px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;box-sizing:border-box;box-shadow:0 10px 25px -4px rgba(15,23,42,0.09), 0 4px 10px -2px rgba(15,23,42,0.04);"></div>`;

	// 2) Browser top chrome bar
	html += `<div style="position:absolute;left:${vx}px;top:${vy}px;width:${vw}px;height:38px;background:#FAFBFC;border-bottom:1px solid #E2E8F0;border-radius:11px 11px 0 0;display:flex;align-items:center;padding:0 14px;gap:10px;box-sizing:border-box;z-index:2;">`;
	html += `<div style="display:flex;gap:6px;">`;
	html += `<span style="width:10px;height:10px;border-radius:50%;background:#FF5F56;display:inline-block;"></span>`;
	html += `<span style="width:10px;height:10px;border-radius:50%;background:#FFBD2E;display:inline-block;"></span>`;
	html += `<span style="width:10px;height:10px;border-radius:50%;background:#27C93F;display:inline-block;"></span>`;
	html += `</div>`;
	html += `<div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:2px 12px;font-family:${SANS};font-size:12.5px;font-weight:500;color:#334155;flex-grow:1;text-align:center;">nationaltimes.com/news</div>`;
	html += `</div>`;

	// 3) Headline
	html += `<div style="position:absolute;left:24px;top:56px;font-family:${SANS};font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#0F172A;white-space:nowrap;">Market Update</div>`;

	if (!rel) {
		// --- STATIC PANEL ---
		html += `<div style="position:absolute;left:24px;top:96px;display:flex;gap:8px;align-items:center;z-index:3;">`;
		html += `<span style="display:inline-flex;align-items:center;padding:0 12px;height:32px;background:#2563EB;color:#FFFFFF;border-radius:8px;font-family:${SANS};font-size:14px;font-weight:700;box-shadow:0 1px 2px rgba(0,0,0,0.05);">${esc(label)}</span>`;
		html += `<span style="display:inline-flex;align-items:center;gap:6px;padding:0 12px;height:32px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;font-family:${SANS};font-size:14px;font-weight:600;color:#B91C1C;">`;
		html += `<span>left: 80px</span>`;
		html += `<span style="background:rgba(252,165,165,0.7);color:#7F1D1D;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:0.05em;">IGNORED</span>`;
		html += `</span>`;
		html += `</div>`;

		html += `<div style="position:absolute;left:24px;top:150px;width:${vw - 40}px;font-family:${SANS};font-size:15.5px;color:#1E293B;line-height:1.5;box-sizing:border-box;">Trading volume opened steadily across domestic exchanges with zero interruption.</div>`;

		html += `<div style="position:absolute;left:20px;top:240px;width:${vw - 40}px;height:38px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:0 14px;font-family:${SANS};font-size:14.5px;color:#991B1B;box-sizing:border-box;line-height:36px;white-space:nowrap;">`;
		html += `<strong style="font-weight:800;margin-right:6px;">✕ static:</strong> offsets ignored, stays in flow`;
		html += `</div>`;
	} else {
		// --- RELATIVE PANEL ---
		html += `<div style="position:absolute;left:24px;top:96px;width:88px;height:34px;border:1px dashed #0284C7;background:#F0F9FF;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#0284C7;font-family:${SANS};font-size:14px;font-weight:600;z-index:1;">footprint</div>`;
		
		html += `<div style="position:absolute;left:124px;top:96px;padding:0 12px;height:32px;background:#2563EB;color:#FFFFFF;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:${SANS};font-size:14px;font-weight:700;box-shadow:0 6px 14px -2px rgba(37,99,235,0.35);z-index:3;">${esc(label)}</div>`;

		html += `<div style="position:absolute;left:24px;top:132px;width:100px;height:24px;z-index:2;">`;
		html += `<svg viewBox="0 0 100 24" style="width:100%;height:100%;overflow:visible;" xmlns="http://www.w3.org/2000/svg">`;
		html += `<line x1="1" y1="2" x2="1" y2="22" stroke="#0284C7" stroke-width="1.75" stroke-linecap="round"/>`;
		html += `<line x1="99" y1="2" x2="99" y2="22" stroke="#0284C7" stroke-width="1.75" stroke-linecap="round"/>`;
		html += `<line x1="1" y1="15" x2="96" y2="15" stroke="#0284C7" stroke-width="1.5"/>`;
		html += `<path d="M 92 11.5 L 97 15 L 92 18.5" stroke="#0284C7" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
		html += `<text x="50" y="10" fill="#0284C7" font-size="12.5" font-family="${SANS}" font-weight="700" text-anchor="middle">+80px</text>`;
		html += `</svg>`;
		html += `</div>`;

		html += `<div style="position:absolute;left:24px;top:150px;width:${vw - 40}px;font-family:${SANS};font-size:15.5px;color:#1E293B;line-height:1.5;box-sizing:border-box;">Trading volume opened steadily across domestic exchanges with zero interruption.</div>`;

		html += `<div style="position:absolute;left:20px;top:240px;width:${vw - 40}px;height:38px;background:#DEF7EC;border:1px solid #84E1BC;border-radius:8px;padding:0 14px;font-family:${SANS};font-size:14.5px;color:#03543F;box-sizing:border-box;line-height:36px;white-space:nowrap;">`;
		html += `<strong style="font-weight:800;margin-right:6px;">✓ relative:</strong> footprint reserved, unmoved`;
		html += `</div>`;
	}

	return scene(sw, sh, html);
}


/* ============================================================
   MODE: stacking — stacking context and z-index trap
   keys: context(trapped|hoisted) label modal_z masthead_z parent_label
   ============================================================ */
function renderStacking(s) {
	const trapped = s.context === 'trapped';
	const sw = 300, sh = 200;

	// Viewport (browser window) dimensions
	const vx = 8, vy = 8, vw = sw - 16, vh = sh - 16;

	// Masthead dimensions: sticky navigation bar at top
	const mx = vx, my = vy + 20, mw = vw, mh = 36;

	// Article Card dimensions: ancestor on the page
	const cx = vx + 8, cy = my + mh + 4, cw = vw - 16, ch = 74;

	// Modal dimensions: breaking news subscription overlay
	const modalW = 184, modalH = 52;
	const modalX = vx + (vw - modalW) / 2;
	const modalY = my + 18; // 46..98 (overlaps masthead from 46 to 64, i.e. 18px)
	const buriedH = (my + mh) - modalY; // 18px

	let html = '';

	// 1) Browser window frame
	html += `<div class="cf-box" style="left:${vx}px;top:${vy}px;width:${vw}px;height:${vh}px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:8px;"></div>`;

	// 2) Browser top chrome bar
	html += `<div style="position:absolute;left:${vx}px;top:${vy}px;width:${vw}px;height:20px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;border-radius:7px 7px 0 0;display:flex;align-items:center;padding:0 8px;gap:5px;box-sizing:border-box;">`;
	html += `<span style="width:6px;height:6px;border-radius:50%;background:#FDA4AF;display:inline-block;"></span>`;
	html += `<span style="width:6px;height:6px;border-radius:50%;background:#FDE047;display:inline-block;"></span>`;
	html += `<span style="width:6px;height:6px;border-radius:50%;background:#86EFAC;display:inline-block;"></span>`;
	html += `<span style="margin-left:6px;font-family:${MONO};font-size:8.5px;color:#94A3B8;">Browser Viewport</span>`;
	html += `</div>`;

	// 3) Article Card (ancestor)
	if (trapped) {
		html += `<div style="position:absolute;left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px;background:#F8FAFC;border:1.5px dashed #FDA4AF;border-radius:6px;box-sizing:border-box;">`;
		html += `<div style="position:absolute;bottom:6px;left:8px;right:8px;display:flex;align-items:center;justify-content:space-between;">`;
		html += `<div>`;
		html += `<div style="font-family:${SANS};font-size:9px;font-weight:700;color:#334155;line-height:1.2;">Global Markets Rally</div>`;
		html += `<div style="font-family:${SANS};font-size:7.5px;color:#94A3B8;">By Priya Patel · 4 min read</div>`;
		html += `</div>`;
		html += `<div style="background:#FFF1F2;border:1px solid #FDA4AF;color:#BE123C;font-family:${MONO};font-size:7px;font-weight:600;padding:1px 5px;border-radius:3px;">${esc(s.parent_label || '.card-animated { transform }')}</div>`;
		html += `</div>`;
		html += `</div>`;
	} else {
		html += `<div style="position:absolute;left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px;background:#F8FAFC;border:1px solid #CBD5E1;border-radius:6px;box-sizing:border-box;">`;
		html += `<div style="position:absolute;bottom:6px;left:8px;right:8px;display:flex;align-items:center;justify-content:space-between;">`;
		html += `<div>`;
		html += `<div style="font-family:${SANS};font-size:9px;font-weight:700;color:#334155;line-height:1.2;">Global Markets Rally</div>`;
		html += `<div style="font-family:${SANS};font-size:7.5px;color:#94A3B8;">By Priya Patel · 4 min read</div>`;
		html += `</div>`;
		html += `<div style="background:#F1F5F9;border:1px solid #CBD5E1;color:#64748B;font-family:${MONO};font-size:7px;font-weight:600;padding:1px 5px;border-radius:3px;">${esc(s.parent_label || '.card (normal flow)')}</div>`;
		html += `</div>`;
		html += `</div>`;
	}

	// 4) Masthead component (brand and z-index badge safely in top 16px)
	const mastheadZ = s.masthead_z || '10';
	const mastheadHtml = `<div style="position:absolute;left:${mx}px;top:${my}px;width:${mw}px;height:${mh}px;background:#0F172A;border-bottom:1px solid #1E293B;padding:4px 10px 0;box-sizing:border-box;box-shadow:0 2px 4px rgba(0,0,0,0.12);">`
		+ `<div style="display:flex;align-items:center;justify-content:space-between;height:14px;">`
		+ `<div style="font-family:${SANS};font-size:8.5px;font-weight:800;letter-spacing:0.06em;color:#F8FAFC;display:flex;align-items:center;gap:5px;">`
		+ `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`
		+ `<span>THE NATIONAL TIMES</span>`
		+ `</div>`
		+ `<div style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);color:#CBD5E1;font-family:${MONO};font-size:7.5px;font-weight:600;padding:0 5px;border-radius:3px;line-height:14px;">z-index: ${mastheadZ}</div>`
		+ `</div>`
		+ `</div>`;

	// 5) Modal component contents
	const modalInner = `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 8px 3px;border-bottom:1px solid #F1F5F9;">`
		+ `<span style="font-family:${SANS};font-size:8.5px;font-weight:700;color:#0F172A;">Breaking News Overlay</span>`
		+ `<span style="background:#EEF2FF;border:1px solid #C7D2FE;color:#4338CA;font-family:${MONO};font-size:7px;font-weight:700;padding:1px 4px;border-radius:3px;">z-index: 9999</span>`
		+ `</div>`
		+ `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 8px;">`
		+ `<span style="font-family:${SANS};font-size:7.5px;color:#64748B;">Unlock full story coverage</span>`
		+ `<span style="background:#2563EB;color:#FFFFFF;font-family:${SANS};font-size:7.5px;font-weight:600;padding:2px 6px;border-radius:3px;">Subscribe</span>`
		+ `</div>`;

	if (trapped) {
		// --- WRONG: Modal rendered BEFORE Masthead (Buried) ---
		// 5a) Modal underneath
		html += `<div style="position:absolute;left:${modalX}px;top:${modalY}px;width:${modalW}px;height:${modalH}px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:6px;box-shadow:0 4px 6px rgba(0,0,0,0.05);box-sizing:border-box;">`;
		html += modalInner;
		html += `</div>`;

		// 5b) Masthead painted ON TOP of Modal (its dark bottom 18px covers the modal top)
		html += mastheadHtml;

		// 5c) Demarcation Law: Ghost box showing the buried portion hidden under masthead
		html += `<div style="position:absolute;left:${modalX}px;top:${modalY}px;width:${modalW}px;height:${buriedH}px;border:1.5px dashed #FDA4AF;background:rgba(253,164,175,0.22);border-radius:5px 5px 0 0;box-sizing:border-box;pointer-events:none;display:flex;align-items:center;justify-content:center;">`;
		html += `<span style="background:#BE123C;color:#FFFFFF;font-family:${MONO};font-size:7px;font-weight:700;padding:0 5px;border-radius:2px;box-shadow:0 1px 2px rgba(0,0,0,0.2);line-height:12px;">buried: .modal (z-index: 9999)</span>`;
		html += `</div>`;

		// 6) External Callout below pointing UP
		html += `<div style="position:absolute;left:${vx}px;top:148px;width:${vw}px;display:flex;flex-direction:column;align-items:center;">`;
		html += `<div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:5px solid #FDA4AF;margin-bottom:-1px;"></div>`;
		html += `<div style="background:#FFF1F2;border:1px solid #FDA4AF;color:#BE123C;font-family:${MONO};font-size:8px;font-weight:600;padding:3px 8px;border-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,0.05);white-space:nowrap;">`;
		html += `<span>✕ Trapped in card: z-index: 9999 is buried under masthead</span>`;
		html += `</div>`;
		html += `</div>`;
	} else {
		// --- RIGHT: Masthead rendered BEFORE Modal (Floats above) ---
		// 5a) Masthead underneath
		html += mastheadHtml;

		// 5b) Modal painted ON TOP of Masthead with prominent drop shadow
		html += `<div style="position:absolute;left:${modalX}px;top:${modalY}px;width:${modalW}px;height:${modalH}px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:6px;box-shadow:0 10px 18px -2px rgba(0,0,0,0.22), 0 4px 6px -2px rgba(0,0,0,0.08);box-sizing:border-box;">`;
		html += modalInner;
		html += `</div>`;

		// 6) External Callout below pointing UP
		html += `<div style="position:absolute;left:${vx}px;top:148px;width:${vw}px;display:flex;flex-direction:column;align-items:center;">`;
		html += `<div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:5px solid #86EFAC;margin-bottom:-1px;"></div>`;
		html += `<div style="background:#DCFCE7;border:1px solid #86EFAC;color:#15803D;font-family:${MONO};font-size:8px;font-weight:600;padding:3px 8px;border-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,0.05);white-space:nowrap;">`;
		html += `<span>✓ Hoisted to root: z-index: 9999 floats cleanly above masthead</span>`;
		html += `</div>`;
		html += `</div>`;
	}

	return scene(sw, sh, html);
}

/* ============================================================
   MODE: inherit — resetting properties: initial vs inherit
   keys: context(initial|inherit) label parent_label
   ============================================================ */
function renderInherit(s) {
	const inherit = s.context === 'inherit';
	const sw = 300, sh = 200;

	// Viewport (browser window) dimensions
	const vx = 8, vy = 8, vw = sw - 16, vh = sh - 16;

	// Footer dimensions
	const fw = 256, fh = 76;
	const fx = vx + (vw - fw) / 2;
	const fy = vy + 88;

	let html = '';

	// 1) Browser window frame
	html += `<div class="cf-box" style="left:${vx}px;top:${vy}px;width:${vw}px;height:${vh}px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:8px;"></div>`;

	// 2) Browser top chrome bar
	html += `<div style="position:absolute;left:${vx}px;top:${vy}px;width:${vw}px;height:22px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;border-radius:7px 7px 0 0;display:flex;align-items:center;padding:0 8px;gap:5px;box-sizing:border-box;">`;
	html += `<span style="width:6px;height:6px;border-radius:50%;background:#FDA4AF;display:inline-block;"></span>`;
	html += `<span style="width:6px;height:6px;border-radius:50%;background:#FDE047;display:inline-block;"></span>`;
	html += `<span style="width:6px;height:6px;border-radius:50%;background:#86EFAC;display:inline-block;"></span>`;
	html += `<span style="margin-left:6px;font-family:${MONO};font-size:9px;color:#94A3B8;">Browser Viewport</span>`;
	html += `</div>`;

	// 3) Callout directly above the target link pointing down to it
	if (inherit) {
		html += `<div style="position:absolute;left:${vx}px;top:44px;width:${vw}px;display:flex;flex-direction:column;align-items:flex-start;padding-left:22px;box-sizing:border-box;">`;
		html += `<div style="background:#DCFCE7;border:1px solid #86EFAC;color:#15803D;font-family:${MONO};font-size:9px;font-weight:600;padding:4px 8px;border-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,0.05);white-space:nowrap;">`;
		html += `<span>✓ Legible text: inherits #ffffff from footer</span>`;
		html += `</div>`;
		html += `<div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid #86EFAC;margin-left:36px;margin-top:-1px;"></div>`;
		html += `</div>`;
	} else {
		html += `<div style="position:absolute;left:${vx}px;top:44px;width:${vw}px;display:flex;flex-direction:column;align-items:flex-start;padding-left:22px;box-sizing:border-box;">`;
		html += `<div style="background:#FFF1F2;border:1px solid #FDA4AF;color:#BE123C;font-family:${MONO};font-size:9px;font-weight:600;padding:4px 8px;border-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,0.05);white-space:nowrap;">`;
		html += `<span>✕ Invisible text: resets to #000000 (spec initial)</span>`;
		html += `</div>`;
		html += `<div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid #FDA4AF;margin-left:36px;margin-top:-1px;"></div>`;
		html += `</div>`;
	}

	// 4) Authentic Dark Footer component
	let targetLinkHtml = '';
	if (inherit) {
		targetLinkHtml = `<span style="color:#FFFFFF;text-decoration:underline;text-underline-offset:2px;font-weight:700;">Privacy Policy</span>`;
	} else {
		// Demarcation box clearly highlighting the place of the invisible link with inline spec badge
		targetLinkHtml = `<div style="position:relative;display:inline-flex;align-items:center;gap:4px;border:1.5px dashed #FDA4AF;background:rgba(255,255,255,0.22);padding:2px 5px;border-radius:4px;box-sizing:border-box;">`
			+ `<span style="color:#000000;text-decoration:underline;text-underline-offset:2px;font-weight:700;">Privacy Policy</span>`
			+ `<span style="background:#BE123C;color:#FFFFFF;font-family:${MONO};font-size:7px;font-weight:700;padding:1px 3px;border-radius:2px;line-height:1;">#000000</span>`
			+ `</div>`;
	}

	html += `<div style="position:absolute;left:${fx}px;top:${fy}px;width:${fw}px;height:${fh}px;background:#0F172A;border:1px solid #1E293B;border-radius:6px;padding:12px 14px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 2px 4px rgba(0,0,0,0.12);">`;
	html += `<div style="font-family:${SANS};font-size:9.5px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#64748B;">The National Times · Footer</div>`;
	html += `<div style="display:flex;align-items:center;gap:12px;font-family:${SANS};font-size:10.5px;">`;
	html += targetLinkHtml;
	html += `<span style="color:#64748B;font-weight:500;">Terms</span>`;
	html += `<span style="color:#64748B;font-weight:500;">Contact</span>`;
	html += `</div>`;
	html += `</div>`;

	return scene(sw, sh, html);
}

/* ============================================================
   MODE: bfc — margin escaping vs BFC containment
   keys: context(none|flow-root) parent(.teaser-card) child(h3.headline) margin(28)
   Without BFC, child's vertical margin collapses through the parent,
   escaping outside. With display: flow-root, the margin is contained inside.
   ============================================================ */
function renderBFC(s) {
	const bfc = s.context === 'flow-root' || s.bfc === 'true';
	const m = num(s.margin, 26);
	const W = 196;
	const padH = 36, padV = 10;
	const x = padH;
	const sw = W + padH * 2;
	const sh = 176;

	const parentSelector = s.parent || (bfc ? '.opinion-card.contained' : '.opinion-card.uncontained');
	const childSelector = s.child || 'h3.headline';

	let html = '';

	// Top Title Bar: Class Rule from Code Snippet (centered over box)
	html += `<div style="position:absolute;left:${x}px;top:5px;width:${W}px;text-align:center;font-family:${MONO};font-size:8.5px;font-weight:700;color:${bfc ? '#15803D' : '#BE123C'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">`
		+ `${esc(parentSelector)} { ${bfc ? 'display: flow-root' : 'display: block'} }`
		+ `</div>`;

	// Preceding block element (.masthead)
	const precY = 22, precH = 20;
	html += `<div style="position:absolute;left:${x}px;top:${precY}px;width:${W}px;height:${precH}px;background:#F1F5F9;border:1px solid #CBD5E1;border-radius:4px;display:flex;align-items:center;padding:0 8px;box-sizing:border-box;">`
		+ `<span style="font-family:${MONO};font-size:8.5px;color:${C.muted};font-weight:600;">header.masthead</span>`
		+ `</div>`;

	const baseBottom = precY + precH; // y = 42

	if (!bfc) {
		// UNCONTAINED: child margin-top escapes outside parent.
		// Parent card is shoved down by m pixels below the preceding element.
		const parentY = baseBottom + m; // y = 42 + 26 = 68
		const cardH = 46;
		const childH = 28;

		// Escaped margin band between masthead and parent card
		html += `<div style="position:absolute;left:${x}px;top:${baseBottom}px;width:${W}px;height:${m}px;background:rgba(255,237,213,0.7);border:1.5px dashed #FB923C;border-radius:3px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">`
			+ `<span style="font-family:${MONO};font-size:8px;color:#C2410C;font-weight:700;">margin-top ${m}px (escaped!)</span>`
			+ `</div>`;

		// Parent card (shoved down by escaped margin)
		html += `<div style="position:absolute;left:${x}px;top:${parentY}px;width:${W}px;height:${cardH}px;background:#FFFFFF;border:2px solid #FDA4AF;border-radius:4px;padding:3px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">`
			+ `<div style="width:100%;height:${childH}px;background:#FFF1F2;border:1px solid #BE123C;border-radius:2px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:8.5px;color:#BE123C;font-weight:700;">${esc(childSelector)}</span>`
			+ `</div>`
			+ `<span style="font-family:${MONO};font-size:7px;color:#BE123C;text-align:center;">✕ 0px top margin inside card</span>`
			+ `</div>`;

		// Bottom conclusion badge (centered across scene)
		html += `<div style="position:absolute;left:0;bottom:6px;width:${sw}px;display:flex;justify-content:center;"><span style="font-family:${MONO};font-size:8.5px;font-weight:700;color:#BE123C;background:#FEE2E2;padding:2px 8px;border-radius:3px;">✕ margin escaped; pushed parent down</span></div>`;

		let svg = svgOpen(sw, sh);
		const dx = x + W + 14;
		svg += dim(dx, baseBottom, dx, parentY, `${m}px`, { rotate: true, color: C.wrong });
		svg += '</svg>';
		return scene(sw, sh, html + svg);
	} else {
		// CONTAINED: BFC isolates child margin inside parent.
		// Parent card sits neatly 6px below masthead.
		const parentY = baseBottom + 6; // y = 48
		const cardH = 82;
		const childH = 28;

		// Parent card (contains margin inside)
		html += `<div style="position:absolute;left:${x}px;top:${parentY}px;width:${W}px;height:${cardH}px;background:#FFFFFF;border:2px solid #86EFAC;border-radius:4px;padding:4px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">`
			// Internal contained margin band
			+ `<div style="width:100%;height:${m - 4}px;background:rgba(220,252,231,0.7);border:1.5px dashed #22C55E;border-radius:2px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">`
			+ `<span style="font-family:${MONO};font-size:8px;color:#15803D;font-weight:700;">margin-top ${m}px (inside BFC)</span>`
			+ `</div>`
			// Child element
			+ `<div style="width:100%;height:${childH}px;background:#F0FDF4;border:1px solid #15803D;border-radius:2px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:8.5px;color:#15803D;font-weight:700;">${esc(childSelector)}</span>`
			+ `</div>`
			+ `<span style="font-family:${MONO};font-size:7px;color:#15803D;text-align:center;">✓ margin isolated inside card</span>`
			+ `</div>`;

		// Bottom conclusion badge (centered across scene)
		html += `<div style="position:absolute;left:0;bottom:6px;width:${sw}px;display:flex;justify-content:center;"><span style="font-family:${MONO};font-size:8.5px;font-weight:700;color:#15803D;background:#DCFCE7;padding:2px 8px;border-radius:3px;">✓ BFC isolates child margin inside</span></div>`;

		let svg = svgOpen(sw, sh);
		const dx = x + W + 14;
		svg += dim(dx, parentY, dx, parentY + cardH, `${cardH}px`, { rotate: true, color: C.right });
		svg += '</svg>';
		return scene(sw, sh, html + svg);
	}
}

/* ============================================================
   MODE: units — nested em compounding vs rem root predictability
   keys: unit(em|rem) val(0.85em|0.875rem)
   em compounds against parent's computed font-size;
   rem resolves against the root html font-size (16px).
   ============================================================ */
function renderUnits(s) {
	const isEm = s.unit === 'em' || s.verdict === 'wrong';
	const sw = 270, sh = 176;
	const pad = 10;
	let html = '';

	if (isEm) {
		// Compounding EM: 16px -> 13.6px -> 11.5px -> 9.8px
		html += `<div style="position:absolute;left:${pad}px;top:10px;width:250px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:6px;padding:8px 10px;box-sizing:border-box;box-shadow:0 1px 2px rgba(0,0,0,0.05);">`
			+ `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">`
			+ `<span style="font-family:${SANS};font-size:11px;font-weight:700;color:${C.text};">@sarah · Editor</span>`
			+ `<span style="font-family:${MONO};font-size:9px;font-weight:600;color:#64748B;background:#F1F5F9;padding:1px 5px;border-radius:3px;">13.6px (0.85em)</span>`
			+ `</div>`
			+ `<div style="font-family:${SANS};font-size:12px;color:#334155;line-height:1.3;margin-bottom:6px;">Top-level comment on breaking news.</div>`
			// Nested Reply 1
			+ `<div style="margin-left:12px;background:#F8FAFC;border-left:2px solid #CBD5E1;border-radius:0 4px 4px 0;padding:6px 8px;margin-bottom:5px;">`
			+ `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">`
			+ `<span style="font-family:${SANS};font-size:10px;font-weight:700;color:${C.text};">↳ @alex · Reply</span>`
			+ `<span style="font-family:${MONO};font-size:8.5px;font-weight:600;color:#EA580C;background:#FFEDD5;padding:1px 4px;border-radius:3px;">11.5px (0.85em²)</span>`
			+ `</div>`
			+ `<div style="font-family:${SANS};font-size:10.5px;color:#475569;line-height:1.25;margin-bottom:4px;">Second-level reply shrinks further.</div>`
			// Nested Reply 2
			+ `<div style="margin-left:10px;background:#FFF1F2;border-left:2px solid #FDA4AF;border-radius:0 4px 4px 0;padding:4px 6px;">`
			+ `<div style="display:flex;justify-content:space-between;align-items:center;">`
			+ `<span style="font-family:${SANS};font-size:9px;font-weight:700;color:#BE123C;">↳ @elena</span>`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#BE123C;background:#FFE4E6;padding:1px 4px;border-radius:3px;">9.8px (unreadable!)</span>`
			+ `</div>`
			+ `<div style="font-family:${SANS};font-size:9px;color:#9F1239;line-height:1.2;">Third-level text collapses down.</div>`
			+ `</div>`
			+ `</div>`
			+ `</div>`;

		html += `<span style="position:absolute;left:${pad}px;bottom:8px;font-family:${MONO};font-size:9px;font-weight:700;color:#BE123C;background:#FEE2E2;padding:2px 6px;border-radius:3px;">✕ compounding font-size shrink</span>`;
		return scene(sw, sh, html);
	} else {
		// Root-locked REM: 14px -> 14px -> 14px
		html += `<div style="position:absolute;left:${pad}px;top:10px;width:250px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:6px;padding:8px 10px;box-sizing:border-box;box-shadow:0 1px 2px rgba(0,0,0,0.05);">`
			+ `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">`
			+ `<span style="font-family:${SANS};font-size:11px;font-weight:700;color:${C.text};">@sarah · Editor</span>`
			+ `<span style="font-family:${MONO};font-size:9px;font-weight:600;color:#15803D;background:#DCFCE7;padding:1px 5px;border-radius:3px;">14px (0.875rem)</span>`
			+ `</div>`
			+ `<div style="font-family:${SANS};font-size:11.5px;color:#334155;line-height:1.3;margin-bottom:6px;">Top-level comment on breaking news.</div>`
			// Nested Reply 1
			+ `<div style="margin-left:12px;background:#F8FAFC;border-left:2px solid #86EFAC;border-radius:0 4px 4px 0;padding:6px 8px;margin-bottom:5px;">`
			+ `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">`
			+ `<span style="font-family:${SANS};font-size:10.5px;font-weight:700;color:${C.text};">↳ @alex · Reply</span>`
			+ `<span style="font-family:${MONO};font-size:8.5px;font-weight:600;color:#15803D;background:#DCFCE7;padding:1px 4px;border-radius:3px;">14px (root locked)</span>`
			+ `</div>`
			+ `<div style="font-family:${SANS};font-size:11.5px;color:#475569;line-height:1.25;margin-bottom:4px;">Second-level reply stays identical size.</div>`
			// Nested Reply 2
			+ `<div style="margin-left:10px;background:#F0FDF4;border-left:2px solid #4ADE80;border-radius:0 4px 4px 0;padding:4px 6px;">`
			+ `<div style="display:flex;justify-content:space-between;align-items:center;">`
			+ `<span style="font-family:${SANS};font-size:10px;font-weight:700;color:#15803D;">↳ @elena</span>`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#15803D;background:#DCFCE7;padding:1px 4px;border-radius:3px;">14px (root locked)</span>`
			+ `</div>`
			+ `<div style="font-family:${SANS};font-size:11.5px;color:#166534;line-height:1.2;">Third-level text remains readable.</div>`
			+ `</div>`
			+ `</div>`
			+ `</div>`;

		html += `<span style="position:absolute;left:${pad}px;bottom:8px;font-family:${MONO};font-size:9px;font-weight:700;color:#15803D;background:#DCFCE7;padding:2px 6px;border-radius:3px;">✓ predictable 14px root scale</span>`;
		return scene(sw, sh, html);
	}
}

/* ============================================================
   MODE: color — sRGB muddy interpolation vs OKLCH perceptual uniformity
   keys: space(srgb|oklch)
   sRGB creates muddy desaturated midpoints when mixing hues.
   OKLCH preserves vibrant chroma and linear perceived lightness.
   ============================================================ */
function renderColor(s) {
	const isSrgb = s.space === 'srgb' || s.verdict === 'wrong';
	const sw = 270, sh = 176;
	const pad = 10;
	let html = '';

	const swatches = isSrgb
		? [
			{ color: '#0284C7', label: '100% blue' },
			{ color: '#4368A8', label: '75%' },
			{ color: '#6A567D', label: '50% (muddy)', warn: true },
			{ color: '#A13C5E', label: '25%' },
			{ color: '#DC2626', label: '100% red' }
		]
		: [
			{ color: '#0284C7', label: '100% blue' },
			{ color: '#5B66DB', label: '75%' },
			{ color: '#9333EA', label: '50% (vibrant)', ok: true },
			{ color: '#D9207E', label: '25%' },
			{ color: '#DC2626', label: '100% red' }
		];

	const cardBg = isSrgb ? '#6A567D' : '#9333EA';
	const badgeBg = isSrgb ? '#FEE2E2' : '#DCFCE7';
	const badgeColor = isSrgb ? '#BE123C' : '#15803D';
	const badgeText = isSrgb ? '✕ muddy desaturated dead-zone' : '✓ uniform chroma & lightness';

	// Header Tag
	html += `<div style="position:absolute;left:${pad}px;top:8px;font-family:${MONO};font-size:10px;font-weight:700;color:${isSrgb ? '#BE123C' : '#15803D'};">`
		+ (isSrgb ? 'color-mix(in srgb, blue, red)' : 'color-mix(in oklch, blue, red)')
		+ `</div>`;

	// Tinted Editorial Card
	html += `<div style="position:absolute;left:${pad}px;top:28px;width:250px;height:52px;background:${cardBg};border-radius:6px;padding:8px 12px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.12);">`
		+ `<div style="font-family:${SANS};font-size:11px;font-weight:700;color:#FFFFFF;letter-spacing:0.02em;">Breaking News · 50% Midpoint</div>`
		+ `<div style="font-family:${MONO};font-size:9.5px;color:rgba(255,255,255,0.85);">${isSrgb ? 'sRGB lightness dip: -22% perceived chroma' : 'OKLCH: constant perceptual lightness'}</div>`
		+ `</div>`;

	// Swatch strip
	html += `<div style="position:absolute;left:${pad}px;top:92px;width:250px;display:flex;gap:4px;">`;
	for (const swt of swatches) {
		html += `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;">`
			+ `<div style="width:100%;height:28px;background:${swt.color};border-radius:3px;border:1px solid rgba(0,0,0,0.15);${swt.warn ? 'outline:2px solid #BE123C;outline-offset:1px;' : swt.ok ? 'outline:2px solid #15803D;outline-offset:1px;' : ''}"></div>`
			+ `<span style="font-family:${MONO};font-size:7.5px;color:${swt.warn ? '#BE123C' : swt.ok ? '#15803D' : C.muted};font-weight:${swt.warn || swt.ok ? '700' : '500'};text-align:center;line-height:1;">${swt.label}</span>`
			+ `</div>`;
	}
	html += `</div>`;

	// Bottom conclusion badge
	html += `<span style="position:absolute;left:${pad}px;bottom:8px;font-family:${MONO};font-size:9px;font-weight:700;color:${badgeColor};background:${badgeBg};padding:2px 6px;border-radius:3px;">${badgeText}</span>`;

	return scene(sw, sh, html);
}

/* ============================================================
   MODE: clamp — multi-line truncation failure vs -webkit-line-clamp
   keys: method(text-overflow|line-clamp) lines(3)
   text-overflow only operates on single-line box overflows (nowrap).
   Multi-line truncation requires -webkit-line-clamp in a box container.
   ============================================================ */
function renderClamp(s) {
	const isFail = s.method === 'text-overflow' || s.verdict === 'wrong';
	const sw = 270, sh = 176;
	const pad = 10;
	let html = '';

	const badgeBg = isFail ? '#FEE2E2' : '#DCFCE7';
	const badgeColor = isFail ? '#BE123C' : '#15803D';
	const badgeText = isFail ? '✕ sliced mid-line; no ellipsis' : '✓ 3-line clamp with native ellipsis';

	// Header Tag
	html += `<div style="position:absolute;left:${pad}px;top:8px;font-family:${MONO};font-size:9.5px;font-weight:700;color:${isFail ? '#BE123C' : '#15803D'};">`
		+ (isFail ? 'text-overflow: ellipsis (multi-line)' : '-webkit-line-clamp: 3')
		+ `</div>`;

	// Article Teaser Card
	html += `<div style="position:absolute;left:${pad}px;top:28px;width:250px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:6px;padding:10px 12px;box-sizing:border-box;box-shadow:0 1px 3px rgba(0,0,0,0.05);">`
		+ `<div style="font-family:${SANS};font-size:9.5px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#EA580C;margin-bottom:4px;">Breaking News</div>`
		+ `<div style="font-family:${SANS};font-size:12px;font-weight:700;color:${C.text};line-height:1.25;margin-bottom:6px;">Council Approves Landmark Zoning</div>`;

	if (isFail) {
		// Multi-line failure: text-overflow: ellipsis does nothing on wrapping text.
		// Container height clips the 4th line in half vertically.
		html += `<div style="height:48px;overflow:hidden;font-family:Georgia,serif;font-size:11.5px;line-height:1.4;color:#475569;position:relative;">`
			+ `The municipal board concluded twelve hours of intense public debate over residential zoning reform tonight. Opponents had voiced deep concerns regarding...`
			+ `</div>`
			+ `<div style="position:absolute;left:10px;top:104px;width:228px;height:14px;border-top:1.5px dashed #BE123C;background:rgba(254,226,226,0.35);pointer-events:none;"></div>`
			+ `<span style="position:absolute;right:14px;top:106px;font-family:${MONO};font-size:7.5px;font-weight:700;color:#BE123C;background:#FEE2E2;padding:1px 4px;border-radius:2px;">clipping boundary</span>`;
	} else {
		// Modern line-clamp: clean 3 lines ending in ellipsis
		html += `<div style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;font-family:Georgia,serif;font-size:11.5px;line-height:1.4;color:#475569;">`
			+ `The municipal board concluded twelve hours of intense public debate over residential zoning reform tonight. Opponents had voiced concerns...`
			+ `</div>`;
	}

	html += `</div>`;

	// Bottom conclusion badge
	html += `<span style="position:absolute;left:${pad}px;bottom:8px;font-family:${MONO};font-size:9px;font-weight:700;color:${badgeColor};background:${badgeBg};padding:2px 6px;border-radius:3px;">${badgeText}</span>`;

	return scene(sw, sh, html);
}

/* ============================================================
   MODE: selector — right-to-left evaluation and DOM tree walking
   keys: sel(.sidebar ul li a|.sidebar-link) type(deep|flat)
   Deep descendant chains force engine to match key selector on every
   matching tag then climb ancestors. Direct class is O(1) hash lookup.
   ============================================================ */
function renderSelector(s) {
	const isDeep = s.type === 'deep' || s.verdict === 'wrong';
	const sw = 270, sh = 176;
	const pad = 10;
	let html = '';

	const badgeBg = isDeep ? '#FEE2E2' : '#DCFCE7';
	const badgeColor = isDeep ? '#BE123C' : '#15803D';
	const badgeText = isDeep ? '✕ 4 DOM tree checks per <a> element' : '✓ O(1) direct class match; 0 traversal';

	// Header Selector Title
	html += `<div style="position:absolute;left:${pad}px;top:8px;font-family:${MONO};font-size:9.5px;font-weight:700;color:${isDeep ? '#BE123C' : '#15803D'};">`
		+ (isDeep ? '.sidebar ul li a' : '.sidebar-link')
		+ `</div>`;

	if (isDeep) {
		// Deep ancestor climb
		html += `<div style="position:absolute;left:${pad}px;top:24px;width:250px;display:flex;flex-direction:column;gap:1.5px;font-family:${MONO};font-size:8.5px;">`
			+ `<div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:3px;padding:2px 6px;color:#64748B;">4. div.sidebar <span style="color:#BE123C;font-weight:700;">[root ancestor]</span></div>`
			+ `<div style="color:#BE123C;padding-left:10px;font-size:7.5px;line-height:1;">▲ climbs to ancestor</div>`
			+ `<div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:3px;padding:2px 6px;color:#64748B;">3. ul <span style="color:#EA580C;font-weight:600;">[parent list]</span></div>`
			+ `<div style="color:#BE123C;padding-left:10px;font-size:7.5px;line-height:1;">▲ climbs to ancestor</div>`
			+ `<div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:3px;padding:2px 6px;color:#64748B;">2. li <span style="color:#EA580C;font-weight:600;">[item container]</span></div>`
			+ `<div style="color:#BE123C;padding-left:10px;font-size:7.5px;line-height:1;">▲ climbs to parent</div>`
			+ `<div style="background:#FFE4E6;border:1.5px solid #BE123C;border-radius:3px;padding:2px 6px;color:#BE123C;font-weight:700;">1. a (key selector: 1,420 links)</div>`
			+ `</div>`;
	} else {
		// Flat class lookup
		html += `<div style="position:absolute;left:${pad}px;top:26px;width:250px;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:6px;padding:10px;box-sizing:border-box;box-shadow:0 1px 3px rgba(0,0,0,0.05);">`
			+ `<div style="font-family:${MONO};font-size:10px;font-weight:700;color:#15803D;margin-bottom:6px;">Fast-Path Class Map</div>`
			+ `<div style="font-family:${SANS};font-size:11px;color:#334155;line-height:1.35;margin-bottom:8px;">Browser queries element's classList hash bucket directly without traversing parent nodes.</div>`
			+ `<div style="background:#F0FDF4;border:1.5px solid #4ADE80;border-radius:4px;padding:5px 8px;font-family:${MONO};font-size:9.5px;color:#15803D;font-weight:600;">`
			+ `✓ classList.has("sidebar-link")`
			+ `</div>`
			+ `</div>`;
	}

	// Bottom conclusion badge
	html += `<span style="position:absolute;left:${pad}px;bottom:8px;font-family:${MONO};font-size:9px;font-weight:700;color:${badgeColor};background:${badgeBg};padding:2px 6px;border-radius:3px;">${badgeText}</span>`;

	return scene(sw, sh, html);
}

/* ============================================================
   MODE: flex-axes — main vs cross axis alignment mechanics
   keys: layout(single-axis|dual-axis)
   justify-content centers along the horizontal main axis (row default).
   Without align-items: center, cross axis stays at top (0px).
   ============================================================ */
function renderFlexAxes(s) {
	const isRight = s.verdict === 'right' || s.layout === 'dual-axis';
	const sw = 270, sh = 176;
	const pad = 10;
	let html = '';

	const parentSelector = s.parent || (isRight ? '.login-portal.locked' : '.login-portal.single');
	const childSelector = s.child || '.login-card';

	const badgeBg = isRight ? '#DCFCE7' : '#FEE2E2';
	const badgeColor = isRight ? '#15803D' : '#BE123C';
	const badgeText = isRight ? '✓ dual-axis coordinate lock (center)' : '✕ card glued to top (cross axis ignored)';

	// Header Mode Title with exact parent selector from code snippet
	html += `<div style="position:absolute;left:${pad}px;top:5px;width:${sw - pad * 2}px;font-family:${MONO};font-size:8px;font-weight:700;color:${isRight ? '#15803D' : '#BE123C'};white-space:nowrap;overflow:hidden;">`
		+ `${esc(parentSelector)} { ${isRight ? 'align + justify: center' : 'justify-content: center'} }`
		+ `</div>`;

	// Outer Viewport / Screen Frame
	const fw = 250, fh = 126;
	const cardW = 168, cardH = 34;
	const cardX = (fw - cardW) / 2; // 41px
	const centerY = (fh - cardH) / 2; // 46px

	html += `<div style="position:absolute;left:${pad}px;top:22px;width:${fw}px;height:${fh}px;background:#FFFFFF;border:1.5px solid #CBD5E1;border-radius:6px;box-sizing:border-box;position:relative;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">`;

	if (!isRight) {
		// WRONG: Card is glued to top (y=8px).
		const stuckY = 8;
		const ghostY = 48;

		// Stuck Card at top
		html += `<div style="position:absolute;left:${cardX}px;top:${stuckY}px;width:${cardW}px;height:${cardH}px;background:#FFF1F2;border:1.5px solid #BE123C;border-radius:4px;padding:4px 8px;box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;box-shadow:0 1px 2px rgba(190,18,60,0.15);">`
			+ `<span style="font-family:${MONO};font-size:9.5px;font-weight:700;color:#BE123C;white-space:nowrap;">${esc(childSelector)}</span>`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#BE123C;background:#FFE4E6;padding:1px 4px;border-radius:2px;white-space:nowrap;">y = 0px (stuck top)</span>`
			+ `</div>`;

		// Ghost box showing intended center (y=48px, cleanly separated from stuck card)
		html += `<div style="position:absolute;left:${cardX}px;top:${ghostY}px;width:${cardW}px;height:${cardH}px;background:rgba(254,226,226,0.25);border:1.5px dashed #FDA4AF;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;">`
			+ `<span style="font-family:${MONO};font-size:8px;color:#BE123C;font-weight:700;">[intended center]</span>`
			+ `<span style="font-family:${MONO};font-size:7px;color:#EA580C;">requires align-items: center</span>`
			+ `</div>`;

		// Indicator of cross-axis neglect
		html += `<div style="position:absolute;left:10px;bottom:8px;font-family:${MONO};font-size:8px;color:#BE123C;font-weight:600;">`
			+ `▲ vertical cross-axis gap unmanaged`
			+ `</div>`;
	} else {
		// RIGHT: Card is dead centered (x=41px, y=46px)
		// Coordinate crosshairs
		html += `<div style="position:absolute;left:0;top:${fh / 2}px;width:${fw}px;height:0;border-top:1px dashed #86EFAC;pointer-events:none;"></div>`
			+ `<div style="position:absolute;left:${fw / 2}px;top:0;width:0;height:${fh}px;border-left:1px dashed #86EFAC;pointer-events:none;"></div>`;

		// Centered Card
		html += `<div style="position:absolute;left:${cardX}px;top:${centerY}px;width:${cardW}px;height:${cardH}px;background:#F0FDF4;border:1.5px solid #15803D;border-radius:4px;padding:4px 8px;box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;box-shadow:0 1px 3px rgba(21,128,61,0.15);">`
			+ `<span style="font-family:${MONO};font-size:9.5px;font-weight:700;color:#15803D;white-space:nowrap;">${esc(childSelector)}</span>`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#15803D;background:#DCFCE7;padding:1px 4px;border-radius:2px;white-space:nowrap;">locked (x & y)</span>`
			+ `</div>`;

		// Coordinate badge inside container
		html += `<div style="position:absolute;right:8px;bottom:8px;font-family:${MONO};font-size:8px;color:#15803D;font-weight:600;">`
			+ `✓ dead center (x:50%, y:50%)`
			+ `</div>`;
	}

	html += `</div>`; // end container

	// Bottom conclusion badge
	html += `<span style="position:absolute;left:${pad}px;bottom:6px;font-family:${MONO};font-size:9px;font-weight:700;color:${badgeColor};background:${badgeBg};padding:2px 6px;border-radius:3px;">${badgeText}</span>`;

	return scene(sw, sh, html);
}

/* ============================================================
   MODE: flex-dist — flex: auto vs flex: 1 free space distribution
   keys: shorthand(auto|1)
   flex: auto uses flex-basis: auto (sizes by content first, then splits remaining).
   flex: 1 uses flex-basis: 0% (allocates all container space equally 1:1:1).
   ============================================================ */
function renderFlexDist(s) {
	const isAuto = s.shorthand === 'auto' || s.verdict === 'wrong';
	const sw = 270, sh = 176;
	const pad = 10;
	let html = '';

	const badgeBg = isAuto ? '#FEE2E2' : '#DCFCE7';
	const badgeColor = isAuto ? '#BE123C' : '#15803D';
	const badgeText = isAuto ? '✕ unequal widths; biased by content' : '✓ true 1:1:1 equal proportional allocation';

	// Header Mode Title
	html += `<div style="position:absolute;left:${pad}px;top:8px;font-family:${MONO};font-size:9.5px;font-weight:700;color:${isAuto ? '#BE123C' : '#15803D'};">`
		+ (isAuto ? 'flex: auto (basis: auto)' : 'flex: 1 (basis: 0%)')
		+ `</div>`;

	// Row Container
	const fw = 250, fh = 76;
	const items = isAuto
		? [
			{ title: 'Update', w: 54, bg: '#F8FAFC', border: '#CBD5E1' },
			{ title: 'Markets', w: 80, bg: '#F8FAFC', border: '#CBD5E1' },
			{ title: 'City Overhaul', w: 106, bg: '#F8FAFC', border: '#CBD5E1' }
		]
		: [
			{ title: 'Update', w: 80, bg: '#F0FDF4', border: '#86EFAC' },
			{ title: 'Markets', w: 80, bg: '#F0FDF4', border: '#86EFAC' },
			{ title: 'City Overhaul', w: 80, bg: '#F0FDF4', border: '#86EFAC' }
		];

	html += `<div style="position:absolute;left:${pad}px;top:28px;width:${fw}px;height:${fh}px;background:#FFFFFF;border:1.5px solid #CBD5E1;border-radius:6px;padding:8px;box-sizing:border-box;display:flex;gap:5px;align-items:stretch;">`;
	for (const it of items) {
		html += `<div style="width:${it.w}px;background:${it.bg};border:1.5px solid ${it.border};border-radius:4px;padding:6px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">`
			+ `<span style="font-family:${SANS};font-size:9.5px;font-weight:700;color:${C.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${it.title}</span>`
			+ `<span style="font-family:${MONO};font-size:8.5px;font-weight:700;color:${isAuto ? '#EA580C' : '#15803D'};text-align:center;background:${isAuto ? '#FFEDD5' : '#DCFCE7'};padding:1px 3px;border-radius:2px;">${it.w}px</span>`
			+ `</div>`;
	}
	html += `</div>`; // end container

	// Dimension callout below
	html += `<div style="position:absolute;left:${pad}px;top:110px;width:${fw}px;display:flex;justify-content:space-between;font-family:${MONO};font-size:8.5px;color:${C.muted};">`
		+ (isAuto ? '<span>basis = max-content</span><span>leftover divided</span>' : '<span>basis = 0px</span><span>total width divided 1:1:1</span>')
		+ `</div>`;

	// Bottom conclusion badge
	html += `<span style="position:absolute;left:${pad}px;bottom:8px;font-family:${MONO};font-size:9px;font-weight:700;color:${badgeColor};background:${badgeBg};padding:2px 6px;border-radius:3px;">${badgeText}</span>`;

	return scene(sw, sh, html);
}

/* ============================================================
   MODE: grid-vs-flex — 1D line space distribution vs 2D rigid tracks
   keys: context(flex|grid) parent child
   Flexbox: line 2 space is isolated; 4th card stretches across 100%.
   Grid: tracks exist prior to items; 4th card stays locked to col 1.
   ============================================================ */
function renderGridVsFlex(s) {
	const isGrid = s.context === 'grid' || s.verdict === 'right';
	const sw = 270, sh = 176;
	const pad = 10;
	let html = '';

	const parentSelector = s.parent || (isGrid ? '.card-deck.grid' : '.card-deck.flex');
	const childSelector = s.child || '.story-card';

	const badgeBg = isGrid ? '#DCFCE7' : '#FEE2E2';
	const badgeColor = isGrid ? '#15803D' : '#BE123C';
	const badgeText = isGrid ? '✓ 2D grid locks columns across rows' : '✕ 1D flex line stretches orphan card';

	// Header Mode Title
	html += `<div style="position:absolute;left:${pad}px;top:5px;width:${sw - pad * 2}px;font-family:${MONO};font-size:8px;font-weight:700;color:${isGrid ? '#15803D' : '#BE123C'};white-space:nowrap;overflow:hidden;">`
		+ `${esc(parentSelector)} { ${isGrid ? 'display: grid; repeat(3, 1fr)' : 'display: flex; flex-wrap: wrap'} }`
		+ `</div>`;

	// Outer Container Frame
	const fw = 250, fh = 124;
	const cardW = 74, cardH = 46, gap = 6;
	const c1X = 6, c2X = c1X + cardW + gap, c3X = c2X + cardW + gap; // 6, 86, 166
	const r1Y = 6, r2Y = r1Y + cardH + gap; // 6, 58

	html += `<div style="position:absolute;left:${pad}px;top:22px;width:${fw}px;height:${fh}px;background:#FFFFFF;border:1.5px solid #CBD5E1;border-radius:6px;box-sizing:border-box;position:relative;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">`;

	if (!isGrid) {
		// FLEXBOX (WRONG): Row 1 has 3 cards (74px each); Row 2 has 1 card stretching 100% (234px)
		html += `<div style="position:absolute;left:${c1X}px;top:${r1Y}px;width:${cardW}px;height:${cardH}px;background:#EFF6FF;border:1px solid #93C5FD;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#1D4ED8;">${esc(childSelector)}</span>`
			+ `<span style="font-family:${MONO};font-size:7px;color:#3B82F6;">item 1 (row 1)</span>`
			+ `</div>`;
		html += `<div style="position:absolute;left:${c2X}px;top:${r1Y}px;width:${cardW}px;height:${cardH}px;background:#EFF6FF;border:1px solid #93C5FD;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#1D4ED8;">${esc(childSelector)}</span>`
			+ `<span style="font-family:${MONO};font-size:7px;color:#3B82F6;">item 2 (row 1)</span>`
			+ `</div>`;
		html += `<div style="position:absolute;left:${c3X}px;top:${r1Y}px;width:${cardW}px;height:${cardH}px;background:#EFF6FF;border:1px solid #93C5FD;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#1D4ED8;">${esc(childSelector)}</span>`
			+ `<span style="font-family:${MONO};font-size:7px;color:#3B82F6;">item 3 (row 1)</span>`
			+ `</div>`;

		// Row 2 orphan card stretching across all available space
		const fullW = fw - 16; // 234px
		html += `<div style="position:absolute;left:${c1X}px;top:${r2Y}px;width:${fullW}px;height:${cardH}px;background:#FFF1F2;border:1.5px solid #BE123C;border-radius:4px;padding:4px 8px;display:flex;justify-content:space-between;align-items:center;box-sizing:border-box;box-shadow:0 1px 2px rgba(190,18,60,0.1);">`
			+ `<div>`
			+ `<span style="font-family:${MONO};font-size:8.5px;font-weight:700;color:#BE123C;">${esc(childSelector)} 4</span>`
			+ `<div style="font-family:${MONO};font-size:7px;color:#991B1B;">flex line 2 free space expands to 100%</div>`
			+ `</div>`
			+ `<span style="font-family:${MONO};font-size:7px;font-weight:700;color:#BE123C;background:#FFE4E6;padding:2px 4px;border-radius:2px;">width: 100%</span>`
			+ `</div>`;
	} else {
		// GRID (RIGHT): 3 rigid column tracks. Row 1 has 3 items; Row 2 has item 4 locked in col 1, slots 2 & 3 empty
		html += `<div style="position:absolute;left:${c1X}px;top:${r1Y}px;width:${cardW}px;height:${cardH}px;background:#F0FDF4;border:1px solid #86EFAC;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#15803D;">${esc(childSelector)}</span>`
			+ `<span style="font-family:${MONO};font-size:7px;color:#166534;">col 1 · row 1</span>`
			+ `</div>`;
		html += `<div style="position:absolute;left:${c2X}px;top:${r1Y}px;width:${cardW}px;height:${cardH}px;background:#F0FDF4;border:1px solid #86EFAC;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#15803D;">${esc(childSelector)}</span>`
			+ `<span style="font-family:${MONO};font-size:7px;color:#166534;">col 2 · row 1</span>`
			+ `</div>`;
		html += `<div style="position:absolute;left:${c3X}px;top:${r1Y}px;width:${cardW}px;height:${cardH}px;background:#F0FDF4;border:1px solid #86EFAC;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#15803D;">${esc(childSelector)}</span>`
			+ `<span style="font-family:${MONO};font-size:7px;color:#166534;">col 3 · row 1</span>`
			+ `</div>`;

		// Row 2: Card 4 locked in Col 1 track
		html += `<div style="position:absolute;left:${c1X}px;top:${r2Y}px;width:${cardW}px;height:${cardH}px;background:#F0FDF4;border:1.5px solid #15803D;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;box-shadow:0 1px 2px rgba(21,128,61,0.15);">`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#15803D;">${esc(childSelector)} 4</span>`
			+ `<span style="font-family:${MONO};font-size:7px;font-weight:700;color:#15803D;background:#DCFCE7;padding:1px 3px;border-radius:2px;margin-top:2px;">locked col 1</span>`
			+ `</div>`;

		// Empty track 2
		html += `<div style="position:absolute;left:${c2X}px;top:${r2Y}px;width:${cardW}px;height:${cardH}px;border:1.5px dashed #CBD5E1;background:rgba(248,250,252,0.6);border-radius:4px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:7px;color:#94A3B8;">empty track</span>`
			+ `</div>`;

		// Empty track 3
		html += `<div style="position:absolute;left:${c3X}px;top:${r2Y}px;width:${cardW}px;height:${cardH}px;border:1.5px dashed #CBD5E1;background:rgba(248,250,252,0.6);border-radius:4px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">`
			+ `<span style="font-family:${MONO};font-size:7px;color:#94A3B8;">empty track</span>`
			+ `</div>`;
	}

	html += `</div>`; // end container

	// Bottom conclusion badge
	html += `<span style="position:absolute;left:${pad}px;bottom:6px;font-family:${MONO};font-size:8.5px;font-weight:700;color:${badgeColor};background:${badgeBg};padding:2px 6px;border-radius:3px;">${badgeText}</span>`;

	return scene(sw, sh, html);
}


/* ============================================================
   MODE: margin-empty — empty block margin collapse and the void
   keys: a(20) empty(24) b(16) barrier(none|border) label-a label-b
   In flow without barrier: empty div (height 0) has top & bottom margins
   that collapse together, and then collapse into siblings: max(a, empty, b).
   With barrier (border): top and bottom cannot touch; gap = max(a, empty) + border + max(empty, b).
   ============================================================ */
function renderMarginEmpty(s) {
	const a = num(s.a, 20), empty = num(s.empty, 24), b = num(s.b, 16);
	const hasBarrier = s.barrier === 'border' || s.verdict === 'right';
	const W = 196, blockH = 34, padV = 14, padH = 44;
	const scale = 1.5;

	let gapTop, gapBottom, totalGap, vGapTop, vGapBottom, vTotalGap;
	if (hasBarrier) {
		gapTop = Math.max(a, empty);
		gapBottom = Math.max(empty, b);
		totalGap = gapTop + 2 + gapBottom; // 2px border
		vGapTop = Math.round(gapTop * scale);
		vGapBottom = Math.round(gapBottom * scale);
		vTotalGap = vGapTop + 14 + vGapBottom; // 14px for interrupted barrier line row
	} else {
		totalGap = Math.max(a, empty, b);
		vTotalGap = 68; // comfortable height for 3 rows of labels and void line
	}

	const sw = W + padH * 2;
	// Uniform scene height across panels so conclusion chips align
	const sh = padV * 2 + blockH * 2 + 86 + 14;
	const x = padH;
	const y1 = padV;
	const y2 = y1 + blockH + vTotalGap;

	let html = '';

	// Top element: label-a
	html += box(x, y1, W, blockH, C.item, C.itemEdge);
	html += `<div style="position:absolute;left:${x}px;top:${y1}px;width:${W}px;height:${blockH}px;display:flex;align-items:center;justify-content:center;pointer-events:none;"><span style="font-family:${MONO};font-size:10.5px;font-weight:700;color:${C.itemText};">${esc(s['label-a'] || 'h2.column-title')}</span></div>`;

	if (!hasBarrier) {
		// Empty block collapsed into void: single collapsed gap with interrupted line in the middle
		html += box(x, y1 + blockH, W, vTotalGap, C.margin, '#FDBA74', 'border-style:dashed');
		const midY = y1 + blockH + Math.round(vTotalGap / 2);

		// Top margin label (blends directly, no confusing box)
		html += `<div style="position:absolute;left:${x}px;top:${y1 + blockH + 6}px;width:${W}px;text-align:center;">`
			+ `<span style="font-family:${MONO};font-size:8.5px;font-weight:700;color:#C2410C;">h2 margin-bottom: ${a}px</span>`
			+ `</div>`;

		// Interrupted dashed void line: ---------  div.empty-spacer (0px void)  ---------
		html += `<div style="position:absolute;left:${x + 8}px;top:${midY - 6}px;width:${W - 16}px;display:flex;align-items:center;gap:6px;">`
			+ `<div style="flex:1;height:0;border-top:1.5px dashed #BE123C;"></div>`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#BE123C;white-space:nowrap;">div.empty-spacer (0px void)</span>`
			+ `<div style="flex:1;height:0;border-top:1.5px dashed #BE123C;"></div>`
			+ `</div>`;

		// Bottom margin label (blends directly, no confusing box)
		html += `<div style="position:absolute;left:${x}px;top:${y1 + blockH + 49}px;width:${W}px;text-align:center;">`
			+ `<span style="font-family:${MONO};font-size:8.5px;font-weight:700;color:#C2410C;">p margin-top: ${b}px</span>`
			+ `</div>`;
	} else {
		// Border barrier prevents collapse: two distinct bands with interrupted solid green barrier line between them
		const spacerY = y1 + blockH + vGapTop;

		// Top gap band (blends directly, no confusing box)
		html += box(x, y1 + blockH, W, vGapTop, C.margin, '#FDBA74', 'border-style:dashed');
		html += `<div style="position:absolute;left:${x}px;top:${y1 + blockH}px;width:${W}px;height:${vGapTop}px;display:flex;align-items:center;justify-content:center;">`
			+ `<span style="font-family:${MONO};font-size:9px;font-weight:700;color:#C2410C;">top gap ${gapTop}px</span>`
			+ `</div>`;

		// Interrupted solid barrier line: ---------  border-top: 1px solid (barrier)  ---------
		html += `<div style="position:absolute;left:${x + 4}px;top:${spacerY + 1}px;width:${W - 8}px;display:flex;align-items:center;gap:6px;">`
			+ `<div style="flex:1;height:0;border-top:2px solid #15803D;"></div>`
			+ `<span style="font-family:${MONO};font-size:8px;font-weight:700;color:#15803D;white-space:nowrap;">border-top: 1px solid (barrier)</span>`
			+ `<div style="flex:1;height:0;border-top:2px solid #15803D;"></div>`
			+ `</div>`;

		// Bottom gap band (blends directly, no confusing box)
		html += box(x, spacerY + 14, W, vGapBottom, '#FEF3C7', '#D97706', 'border-style:dashed');
		html += `<div style="position:absolute;left:${x}px;top:${spacerY + 14}px;width:${W}px;height:${vGapBottom}px;display:flex;align-items:center;justify-content:center;">`
			+ `<span style="font-family:${MONO};font-size:9px;font-weight:700;color:#B45309;">bottom gap ${gapBottom}px</span>`
			+ `</div>`;
	}

	// Bottom element: label-b
	html += box(x, y2, W, blockH, C.item, C.itemEdge);
	html += `<div style="position:absolute;left:${x}px;top:${y2}px;width:${W}px;height:${blockH}px;display:flex;align-items:center;justify-content:center;pointer-events:none;"><span style="font-family:${MONO};font-size:10.5px;font-weight:700;color:${C.itemText};">${esc(s['label-b'] || 'p.column-body')}</span></div>`;

	// Caliper SVG
	let svg = svgOpen(sw, sh);
	const dx = x + W + 14;
	svg += dim(dx, y1 + blockH, dx, y2, `${totalGap}px`, { color: hasBarrier ? C.right : C.wrong });
	svg += '</svg>';

	// Bottom conclusion chip (centered across scene)
	const badgeText = hasBarrier ? `✓ border barrier: ${totalGap}px gap` : `✕ collapsed into ${totalGap}px void`;
	const badgeBg = hasBarrier ? '#DCFCE7' : '#FEE2E2';
	const badgeColor = hasBarrier ? '#15803D' : '#BE123C';
	html += `<div style="position:absolute;left:0;bottom:4px;width:${sw}px;display:flex;justify-content:center;"><span style="font-family:${MONO};font-size:8px;font-weight:700;color:${badgeColor};background:${badgeBg};padding:1px 6px;border-radius:3px;">${badgeText}</span></div>`;

	return scene(sw, sh, html + svg);
}

const MODES = { box: renderBox, margin: renderMargin, float: renderFloat, 'float-text': renderFloatText, center: renderCenter, cascade: renderCascade, display: renderDisplay, baseline: renderBaseline, banner: renderBanner, 'two-value': renderTwoValue, position: renderPosition, 'relative-shift': renderRelativeShift, stacking: renderStacking, inherit: renderInherit, bfc: renderBFC, units: renderUnits, color: renderColor, clamp: renderClamp, selector: renderSelector, 'flex-axes': renderFlexAxes, 'flex-dist': renderFlexDist, 'grid-vs-flex': renderGridVsFlex, 'grid': renderGridVsFlex, 'margin-empty': renderMarginEmpty };

/* ---------------- panel ---------------- */

function verdictPill(s) {
	if (s.verdict === 'wrong') return `<span class="cf-pill is-wrong">WRONG${s.tag ? ` - ${esc(s.tag)}` : ''}</span>`;
	if (s.verdict === 'right') return `<span class="cf-pill is-right">RIGHT${s.tag ? ` - ${esc(s.tag)}` : ''}</span>`;
	if (s.verdict === 'overridden') return `<span class="cf-pill is-wrong">✕ OVERRIDDEN${s.tag ? ` - ${esc(s.tag)}` : ''}</span>`;
	if (s.verdict === 'winner') return `<span class="cf-pill is-right">✓ LIVE WINNER${s.tag ? ` - ${esc(s.tag)}` : ''}</span>`;
	if (s.tag) return `<span class="cf-pill">${esc(s.tag)}</span>`;
	return '';
}

export function renderCssFigure(source, attrs = {}, figNumber = '') {
	const mode = attrs.mode || 'box';
	const render = MODES[mode];
	if (!render) {
		console.warn(`  note figure: unknown mode "${mode}"`);
		return `<p><em>[figure: unknown mode ${esc(mode)}]</em></p>`;
	}
	const scenes = parseScenes(source);
	const compare = attrs.layout === 'compare' || scenes.length === 2;
	const widthClass = attrs.width === 'full' ? 'w-full' : 'w-2-3';

	const panels = scenes.map((s) => {
		const cls = ['cf-panel'];
		if (s.verdict === 'wrong') cls.push('is-wrong');
		if (s.verdict === 'right') cls.push('is-right');
		return `<div class="${cls.join(' ')}">${verdictPill(s)}${render({ ...s, __mode: mode })}</div>`;
	}).join('\n');

	const caption = attrs.caption
		? `<figcaption>${figNumber ? `Fig ${esc(figNumber)}: ` : ''}${esc(attrs.caption)}</figcaption>`
		: '';

	return `<style>${figureCss()}</style>\n<figure class="css-figure ${widthClass} mode-${mode}${compare ? ' is-compare' : ''}">\n<div class="cf-stage${compare ? ' cf-compare' : ''}">\n${panels}\n</div>\n${caption}\n</figure>`;
}

/* ---------------- stylesheet (inlined once per figure, like the a11y canvas) ---------------- */

function figureCss() {
	return `
.css-figure { margin: 1.4rem 0 1.6rem; font-family: ${SANS}; color: ${C.text}; break-inside: avoid; page-break-inside: avoid; }
.css-figure.w-2-3 .cf-stage { max-width: 660px; margin: 0 auto; }
.css-figure.w-full .cf-stage { max-width: 100%; }

/* the master canvas: flat, rounded, 1px same-hue edge, generous padding */
.cf-stage { background: ${C.stageBg}; border: 1px solid ${C.stageEdge}; border-radius: 10px; padding: 32px 22px 24px; display: flex; justify-content: center; align-items: flex-start; gap: 24px; }
.cf-stage.cf-compare { padding: 32px 24px 24px; }
.cf-panel { position: relative; display: flex; flex-direction: column; align-items: center; gap: 24px; flex: 0 1 auto; }
.cf-compare .cf-panel { flex: 1 1 0; min-width: 0; }

/* verdict pills: modern rounded rectangle, soft background, solid border, colored text */
.cf-pill { font-family: ${SANS}; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 6px; border: 1.5px solid ${C.frameEdge}; background: #fff; color: ${C.text}; white-space: nowrap; }
.cf-pill.is-wrong { color: #B91C1C; background: #FDE8E8; border-color: #F9B4B4; }
.cf-pill.is-right { color: #03543F; background: #DEF7EC; border-color: #84E1BC; }

/* the scene: a fixed pixel canvas with absolutely placed boxes and one SVG overlay */
.cf-scene { position: relative; flex: none; }
.cf-scene-flow { display: flex; flex-direction: column; gap: 10px; }
.cf-box { position: absolute; box-sizing: border-box; border: 1.5px solid; border-radius: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
.cf-overlay { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.cf-overlay text { font-family: ${SANS}; font-size: 11px; font-weight: 500; stroke: none; }
.cf-overlay .cf-dim line { stroke-width: 1; }
.cf-overlay .cf-force line { stroke-width: 1.5; }

.cf-band-label { position: absolute; font-family: ${MONO}; font-size: 10px; font-weight: 500; letter-spacing: 0.01em; white-space: nowrap; line-height: 1; }
.cf-band-label.cf-center { display: flex; align-items: center; justify-content: center; font-size: 11px; }
.cf-tag { position: absolute; font-family: ${MONO}; font-size: 10.5px; font-weight: 700; white-space: nowrap; line-height: 1; }


/* float mode: a live lavender parent with live floated children */
.cf-parent { position: absolute; box-sizing: border-box; background: ${C.parent}; border: 2px solid ${C.parentEdge}; border-radius: 6px; }
.cf-parent.cf-contain::after { content: ""; display: block; clear: both; }
.cf-float-item { box-sizing: border-box; background: ${C.item}; border: 1.5px solid ${C.itemEdge}; border-radius: 4px; font-family: ${MONO}; font-size: 10px; color: ${C.itemText}; display: flex; align-items: center; justify-content: center; }

/* float-text mode: real text wrapping a real float */
.cf-article { background: #fff; border: 1px solid ${C.frameEdge}; border-radius: 6px; padding: 12px 14px; box-sizing: border-box; }
.cf-article::after { content: ""; display: block; clear: both; }
.cf-margin-band { background: ${C.margin}; border: 1px dashed #FDBA74; border-radius: 3px; box-sizing: border-box; }
.cf-img { box-sizing: border-box; background: ${C.item}; border: 1.5px solid ${C.itemEdge}; border-radius: 3px; font-family: ${MONO}; font-size: 10px; color: ${C.itemText}; display: flex; align-items: center; justify-content: center; }
.cf-text { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 11.5px; line-height: 1.45; color: ${C.text}; text-align: left; }
.cf-byline { margin: 8px 0 0; font-family: ${SANS}; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: ${C.muted}; }
.cf-byline.is-cleared { border-top: 1.5px dashed ${C.force}; padding-top: 6px; }
.cf-legend { font-family: ${MONO}; font-size: 10px; color: ${C.muted}; display: flex; align-items: center; gap: 6px; }
.cf-legend i { display: inline-block; width: 12px; height: 9px; border: 1px dashed; border-radius: 2px; }
.cf-legend .cf-legend-line { width: 14px; height: 0; border: none; border-top: 1.5px dashed ${C.force}; margin-left: 8px; }

/* cascade mode: resolution cards */
.cf-cascade-card { background: #fff; border: 1px solid ${C.frameEdge}; border-radius: 8px; padding: 14px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px; font-family: ${SANS}; text-align: left; }
.cf-cascade-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 6px; font-family: ${MONO}; font-size: 10px; color: ${C.muted}; }
.cf-cascade-src { font-weight: 700; color: ${C.text}; }
.cf-cascade-order { background: #F1F5F9; padding: 2px 6px; border-radius: 4px; font-size: 9.5px; }
.cf-cascade-code { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px; padding: 8px 10px; font-family: ${MONO}; font-size: 11px; line-height: 1.45; color: ${C.text}; }
.cf-cascade-sel { color: #7C3AED; font-weight: 600; }
.cf-cascade-prop { color: #0284C7; }
.cf-cascade-meta { display: flex; justify-content: flex-end; font-family: ${MONO}; font-size: 10px; color: ${C.muted}; }
.cf-cascade-preview { display: flex; justify-content: center; align-items: center; padding: 8px 0; }
.cf-cascade-btn { padding: 6px 18px; border-radius: 4px; color: #fff; font-family: ${SANS}; font-size: 12px; font-weight: 600; text-align: center; }
.cf-cascade-state { font-family: ${MONO}; font-size: 10px; text-align: center; color: ${C.muted}; border-top: 1px dashed #E2E8F0; padding-top: 6px; }

/* display mode: comparing inline vs inline-block vs block */
.cf-display-card { background: #fff; border: 1px solid ${C.frameEdge}; border-radius: 8px; padding: 14px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px; font-family: ${SANS}; text-align: left; }
.cf-display-flow { font-family: Georgia, 'Times New Roman', serif; font-size: 12px; line-height: 1.6; color: ${C.text}; border: 1px dashed #E2E8F0; padding: 10px; border-radius: 4px; background: #F8FAFC; }
.cf-display-badge { display: inline-block; font-family: ${MONO}; font-size: 10px; font-weight: 700; border-radius: 4px; text-align: center; }
.cf-display-badge.is-inline { background: #FFE4E6; border: 1.5px dashed #BE123C; color: #BE123C; padding: 1px 5px; }
.cf-display-badge.is-ib { background: #DCFCE7; border: 1.5px solid #15803D; color: #15803D; padding: 4px 10px; }
.cf-display-badge.is-block { display: block; background: #E0E7FF; border: 1.5px solid #4338CA; color: #4338CA; padding: 4px 10px; margin: 6px 0; text-align: center; }
.cf-display-note { font-family: ${MONO}; font-size: 10px; color: ${C.muted}; border-top: 1px dashed #E2E8F0; padding-top: 6px; text-align: center; }

/* caption: centered, mono, muted, numbered */
.css-figure figcaption { margin-top: 14px; margin-bottom: 1.5rem; text-align: center; font-family: ${MONO}; font-size: 12px; line-height: 1.5; color: ${C.muted}; }

@media print {
  .css-figure { break-inside: avoid; page-break-inside: avoid; }
}
`.trim();
}
