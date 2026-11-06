import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHAPTERS_DIR = fileURLToPath(new URL('../react-10/01-03-md-lectures-HTML/v1/', import.meta.url));
const THEME = 'river-book-theme.css';
const isChapter = (name) => /^\d\d\.html$/.test(name);
const served = (name) => isChapter(name) || name === THEME;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' };
const decodeEntities = (s) => s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e) => ENTITIES[e]);

function chapterList() {
  return readdirSync(CHAPTERS_DIR)
    .filter(isChapter)
    .sort()
    .map((file) => {
      const html = readFileSync(join(CHAPTERS_DIR, file), 'utf8');
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      const title = h1 ? decodeEntities(h1[1].replace(/<[^>]+>/g, '')).trim() : file;
      return { num: file.slice(0, 2), file, title };
    });
}

// The chapters stay in react-10; the player serves them at /chapters/ so the iframe is same-origin and the app can reach into it.
function react10Chapters() {
  const VIRTUAL = 'virtual:chapters';
  return {
    name: 'react10-chapters',
    resolveId: (id) => (id === VIRTUAL ? '\0' + VIRTUAL : null),
    load: (id) => (id === '\0' + VIRTUAL ? `export default ${JSON.stringify(chapterList())};` : null),
    configureServer(server) {
      server.middlewares.use('/chapters', (req, res, next) => {
        const name = decodeURIComponent((req.url || '').split('?')[0].replace(/^\//, ''));
        if (!served(name)) return next();
        res.setHeader('Content-Type', name.endsWith('.css') ? 'text/css' : 'text/html; charset=utf-8');
        res.end(readFileSync(join(CHAPTERS_DIR, name)));
      });
    },
    generateBundle() {
      for (const name of readdirSync(CHAPTERS_DIR).filter(served)) {
        this.emitFile({ type: 'asset', fileName: `chapters/${name}`, source: readFileSync(join(CHAPTERS_DIR, name)) });
      }
    },
  };
}

export default defineConfig({
  plugins: [svelte(), react10Chapters()],
});
