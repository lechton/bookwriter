 run the instructions for image-creation for the first chapter



## Prompt 1

 /Users/techton/lechton/research-code/bookwriter/diagram-lab/output/react-lecture-02/lab/01-forensic-investigator

 run the instructions for lecture-creation for the next chapter with proper figures and pannels (NOT the image-creation instructinos)
Do not ask me to approve implementation plan, compose the final result by yourself. 


## Prompt 2 

Audit the text for cryptic or unclear phrases like this: 
Server-Side Rendering (SSR): Generating dynamic
HTML on a server or serverless edge function per
incoming request.

And make them more clear, easy to follow. 

Assume the reader is tired, with headache and short attention span.
IMPORTANT: Audit for B2 vocabulary and replace ALL forms of jargon or unecessary complex paradigms, e.g. ALL Paradigms need to be inspired by common vocabulary from common situations, no reason to mention vote tallies, booths, whatever weird or idiosyncratic vocabulary you have in mind. 

Create again the md + html + pdf

Do not do unecessary screenshots, only if an actual image or figure is in question, or if you have reasons to believe one page may be problematic in its render

## Prompt 3: Image Creation Workflow

Execute the 4-Stage Image Lifecycle for lecture {NN}:
1. **Stage (a) - Cognitive Friction Scan:** Audit `{NN}.md` for at least 4 mental bottlenecks; author pure spatial descriptions in `images-md/{NN}_{seq}_{slug}.md` with bounded coordinates, anti-zoom perspective framing, zero syntax clutter, and strict compliance with the **Anti-Acronym Ban & B2 Tired Reader Law** (zero unexplained networking acronyms like `RTT`/`TTL`/`TTFB`).
2. **Stage (b) - Lexical Verification & The "Diagram Serves the Lecture" Law:** Verify all terms against official React 19 docs. Enforce the **Guide-Note Backdoor Ban**: a diagram exists strictly to illustrate what the lecture body already taught in plain B2 English; never use `> [svg image]` notes to smuggle unbaptized acronyms or LaTeX pseudo-math (`$...$`).
3. **Stage (c) - Prompt Assembly:** Compile the ready-to-copy prompts into `images-md-prompt/{NN}_{seq}_{slug}.md` combining `## Description` and `## Design Theme` (including Section 5 Uniform Camera Perspective & Scale Law and the Anti-Acronym Text Law).
4. **Stage (d) - Manual Intake & Build:** Once assets are placed into `images/{NN:02d}/{seq:02d}.jpeg`, embed them via `![Caption](images/{NN:02d}/{seq:02d}.jpeg)` and compile the lab via `node lab/build-lab.mjs {path_num}`. 