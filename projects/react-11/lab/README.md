# lab: the react-11 test project

This folder is one small React website that stays installed. It runs the code examples of a lecture in a hidden Chrome browser and prints what a reader would see: the page text, the Console messages, and the Vite errors. Every check reuses it, so nobody builds a new React project for a lesson.

The versions are fixed in `package.json`: React 19.3.1, React DOM 19.3.1, Vite 8.3.6, and `@vitejs/plugin-react` 6.2.1. Puppeteer brings its own Chrome, so no browser path is needed.

## Install once

From `projects/react-11/lab`, run `npm install`. The installed packages stay in `lab/node_modules/`, which git ignores.

## A case

A case is a folder that holds the files of the reader's `src/` folder, for example `lab/cases/15/p2-wrong/`. It needs an `App.jsx` with a default export. The lab's own `main.jsx` mounts `App` inside `StrictMode`, the way `npm create vite` does. A case that teaches mounting brings its own `main.jsx`, and a case that changes the page brings its own `index.html`. A case can also hold a `steps.mjs` for actions that the options below cannot express; it exports one async function that receives `{ page, sleep, snap }`, where `page` is the Puppeteer page and `snap(label)` prints the screen.

Keep the cases of a lesson in `lab/cases/{NN}/`, one folder per example, named after the principle and the version, such as `p3-right`. They stay in git as the proof behind the lecture.

## Run a case

From `projects/react-11`:

```
node lab/check.mjs lab/cases/15/p2-wrong
```

Options:

- `--no-strict`: mount without `StrictMode`.
- `--prod`: make a production build and serve it, instead of the dev server. A failed build prints the Vite build error.
- `--click <selector>`: click an element, then print the screen again. Repeat it for several clicks. `--click "::-p-text(Add to cart)"` clicks by the visible text.
- `--eval <js>`: run JavaScript in the page after the clicks and print the result as JSON.
- `--elements`: also print the HTML inside `#root`, as the Elements panel shows it.
- `--wait <ms>`: how long to wait after loading and after each click, 300 by default.
- `--shot <file.png>`: save a full-page picture.

The report has these parts: `Screen` after load and after each click, `Vite error overlay` when Vite shows one, `Console` with every message in the order Chrome received it, and `Vite messages` from the dev server or the build. File paths read as `src/App.jsx`, the way they appear in the reader's project.

Each run copies the case into `lab/.run/`, which is emptied first, so one run never changes the next.

## Reports

`lab/reports/{NN}.md` records the check of lecture `{NN}`: what was run, what matched, and what was fixed in the lecture. The bookflow checker writes it as the last thing it does, so its presence means the lecture passed.
