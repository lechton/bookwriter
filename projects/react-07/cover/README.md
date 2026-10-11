# React 19 Book Covers

This directory contains standalone front cover designs, layout experiments, and print-ready PDF assets for **The Architecture of React 19** (3 Volumes, 2026 Edition).

## Cover Variations

| Folder | Design Concept | Palette | Output Assets |
| :--- | :--- | :--- | :--- |
| [`cover-01/`](cover-01/) | **Deep Architectural Slate**<br>Geometric Fiber/Tree grid, high-contrast typography, metrics grid (180 questions, 3 volumes, Zero-Gap pedagogy). | Midnight Slate (`#070b14`), Cyan/Teal (`#06b6d4`, `#0e7490`), White & Slate text | `cover.html`<br>`cover.pdf` |
| [`cover-02/`](cover-02/) | **Editorial Light (Swiss Monograph)**<br>Clean drafting grid, crisp black & deep teal typography, architectural card structure. | Pure White (`#ffffff`), Deep Teal (`#0e7490`), Slate 900 (`#0f172a`) | `cover.html`<br>`cover.pdf` |
| [`cover-03/`](cover-03/) | **Prominent 2026 Edition**<br>High-visibility `2026 EDITION` glassmorphic stamp in top right, maximized competitive thumbnail impact, deep slate & glowing cyan. | Deep Obsidian (`#060a12`), Glowing Cyan (`#06b6d4`), Ice White | `cover.html`<br>`cover.pdf` |
| [`cover-04/`](cover-04/) | **Architectural Monograph (Non-AI Editorial)**<br>Precision drafting frame with registration marks, serif/sans typographic pairing, authentic Fiber/RSC schematic diagram (Fig 0.1), hairline typographic ledger. | Deep Matte Navy (`#0b111e`), Architectural Cyan (`#0ea5e9`), Crisp White | `cover.html`<br>`cover.pdf` |

## Specifications
- **Page Size**: Letter (`8.5in` × `11in`), full bleed (`@page { size: letter; margin: 0; }`).
- **Engine Compatibility**: Prince XML compatible (`-webkit-print-color-adjust: exact`, standard SVG geometries, no unsupported CSS features).
- **Typography**: Inter, Montserrat, and JetBrains Mono with robust system font fallbacks.
