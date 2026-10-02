import { writeFileSync } from 'fs';
import { renderCssFigure } from './css-figure.mjs';

const source = `verdict=wrong | tag=static offsets ignored | mode=static | label=.badge-static
---
verdict=right | tag=relative footprint reserved | mode=relative | label=.badge-relative`;

const attrs = { mode: 'relative-shift', layout: 'compare', caption: 'Static boxes ignore coordinate offsets completely. Relative boxes reserve their physical footprint in document flow while shifting visual pixels.' };

const html = renderCssFigure(source, attrs, '07.2');
writeFileSync('../md-lectures/figures/07-relative-shift.html', html);
console.log('Done!');
