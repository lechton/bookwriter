# fastapi-01 Adaptation TODO

This project was created on 2026-09-17 by copying the logic of `../react-lecture-03`: the folder skeleton, the `src/` build pipeline (`build-lectures.mjs`, `build-cards.mjs`, `component-explorer.mjs`, `lecture.css`), and the three authoring-law documents (`instructions.md`, `AUTHOR-BRIEF.md`, `PRE-LECTURE-INSTRUCTIONS.md`, each carrying a template banner). The React content (lectures, pre-lectures, questions) was deliberately NOT copied. What remains is the FastAPI re-grounding pass, tracked here.

## Pipeline adaptation (src/)

- [ ] **Component Explorer gate**: `build-lectures.mjs` warns on any lecture with zero ` ```components ` panels, and `component-explorer.mjs` only accepts `.jsx`/`.tsx`/`.js`/`.ts` files, assigning them to `components/` and `state/` folders with UI-oriented visual kinds (`profile`, `badge`, `counter`, ...). FastAPI lectures need the backend equivalent: a module/structure panel accepting `.py` files (`main.py`, `routers/items.py`, `models.py`, `schemas.py`, `deps.py`) with a FastAPI-appropriate folder grouping and a surface that shows a plausible rendered result (JSON response, status code, or request flow) instead of UI mock shapes. Decide: adapt the existing panel, or design a new ` ```modules ` panel block and relax the React gate.
- [ ] **React hooks identifier check** (`build-lectures.mjs`, comment "React hooks — every identifier of the form useXxx"): re-ground for FastAPI (decorators `@app.get`, `@router.post`, dependency functions, `Annotated` types).
- [ ] **Default fence filename** (`App.jsx` for `jsx`/`javascript` fences): switch to `main.py` for `python` fences.
- [ ] **Components-tree file audit** (warns when a fenced or imported `.jsx`/`.tsx`/`.js`/`.ts` file is missing from the panel tree): extend to `.py` once the panel accepts Python files.
- [ ] **Reader deck name**: `build-lectures.mjs` currently publishes `FastAPI Lectures.pdf` (+ `-teal`, `-black`, `-old` themes). Rename to the question-range convention (e.g. `FastAPI Q01-Q100`) once the question bank freezes.
- [ ] **Theme color decision**: `lecture.css` ships React teal `#0e7490`. FastAPI's brand green is `#009485`. Decide whether to keep the inherited teal (visually identical family) or swap the accent tokens to FastAPI green.

## Authoring-law re-grounding (instructions.md / AUTHOR-BRIEF.md / PRE-LECTURE-INSTRUCTIONS.md)

- [ ] Replace all React-specific mandates: `.jsx` code fences become `python` fences, the mandatory Component Explorer panel becomes the FastAPI structure panel decided above, ` ```jsx right ` / ` ```jsx wrong ` become ` ```python right ` / ` ```python wrong `.
- [ ] Replace the ElectroShop reference architecture with the FastAPI reference app (candidate: keep The National Times world, now as the newspaper's backend API; needs its own `docs/component_language.md` equivalent fixing the module tree and notation).
- [ ] Replace `docs/component_data_flow.md` (multi-scale A/B/C data-flow explanation structure) for the FastAPI module tree.
- [ ] Author a FastAPI `docs/figure-design-system.md` and the first proven figure archetypes (candidates: request lifecycle pipeline, dependency injection graph, middleware onion, validation error flow, ASGI worker model). The React RCE templates in `md-lectures/figures/templates/` were not copied.
- [ ] Re-ground the Opening Ladder banned-mechanism-words list ("state", "props", "hook", "render", "mount") to FastAPI's disguised mechanism words ("endpoint", "decorator", "dependency", "serialize", "validate").
- [x] Local documentation corpus (done 2026-09-17): seven shallow clones assembled at `documentation official/fastapi/official/` (fastapi, starlette, pydantic, sqlmodel, uvicorn, full-stack-fastapi-template, fastapi-best-practices) plus the handout `documentation official/fastapi/README.md` and the question-to-authority map `documentation official/fastapi/resources/INDEX.md`. During the re-grounding pass, replace the react.dev citation paths in the law docs with the corpus paths (primary: `documentation official/fastapi/official/fastapi/docs/en/docs/`).

## Content pipeline (to be scheduled)

- [x] Author the question bank (`questions/questions.md`, `topics.md`, `README.md` — 60 questions frozen 2026-09-18).
- [ ] Phase 1: pre-lecture blueprints in `md-pre-lectures/`.
- [ ] Phase 2: production lectures in `md-lectures/` (+ `figures/`).
- [ ] Phase 3: review cards and data-flow files.
