import React from 'react';

// Exact color palette extracted from the reference image
const COLORS = {
  bgPage: '#fcfcfc',
  containerBg: '#f4ecfd',
  containerBorder: '#d2bbf6',
  primaryPurple: '#8a5af7', // Text, lines, and dots
  blockBg: '#f9b874',
  blockBorder: '#e39c4a',
  captionText: '#697a8d',
  bodyText: '#334155',
  headingText: '#0f172a',
};

// Reusable Orange Block mimicking the image's boxes
const DiagramBlock = ({ children, className = '' }) => (
  <div
    className={`relative z-10 flex items-center justify-center rounded-lg shadow-sm border-2 ${className}`}
    style={{
      backgroundColor: COLORS.blockBg,
      borderColor: COLORS.blockBorder,
      width: '120px',
      height: '80px',
    }}
  >
    <span
      className="font-mono text-sm font-semibold tracking-wider"
      style={{ color: '#a16315' }} // Darker orange/brown for text readability inside block
    >
      {children}
    </span>
  </div>
);

// Horizontal dashed line with a center dot
const HorizontalConnector = () => (
  <div className="flex-1 flex items-center relative min-w-[40px]">
    <div
      className="w-full h-[2px] border-t-2 border-dashed"
      style={{ borderColor: COLORS.primaryPurple }}
    />
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full"
      style={{ backgroundColor: COLORS.primaryPurple }}
    />
  </div>
);

// Vertical dashed line with a center dot
const VerticalConnector = ({ height = 'h-16' }) => (
  <div className={`${height} flex items-center justify-center relative w-[2px]`}>
    <div
      className="h-full w-[2px] border-l-2 border-dashed"
      style={{ borderColor: COLORS.primaryPurple }}
    />
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full"
      style={{ backgroundColor: COLORS.primaryPurple }}
    />
  </div>
);

// Wrapper for each diagram to match the exact spacing and labeling of the image
const DiagramFigure = ({ title, caption, children, figureNumber }) => (
  <div className="my-12 w-full flex flex-col">
    {/* Top-left monospace title */}
    <h3
      className="font-mono text-base font-bold mb-2 ml-1"
      style={{ color: COLORS.primaryPurple }}
    >
      {title}
    </h3>
    
    {/* The Purple Container */}
    <div
      className="relative w-full rounded-xl border-2 p-8 sm:p-12 flex justify-center items-center overflow-hidden"
      style={{
        backgroundColor: COLORS.containerBg,
        borderColor: COLORS.containerBorder,
      }}
    >
      {children}
    </div>
    
    {/* Bottom Caption */}
    <p
      className="font-mono text-sm mt-4 text-center px-4 leading-relaxed"
      style={{ color: COLORS.captionText }}
    >
      <span className="font-semibold">Fig {figureNumber}:</span> {caption}
    </p>
  </div>
);

// Diagram 1: The Virtual DOM Tree
const VirtualDOMDiagram = () => (
  <div className="relative w-full max-w-md h-64 flex flex-col items-center justify-between">
    {/* SVG for Tree Branches */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
      {/* Root to Left Child */}
      <line x1="50%" y1="20%" x2="25%" y2="80%" stroke={COLORS.primaryPurple} strokeWidth="2" strokeDasharray="6 6" />
      {/* Root to Right Child */}
      <line x1="50%" y1="20%" x2="75%" y2="80%" stroke={COLORS.primaryPurple} strokeWidth="2" strokeDasharray="6 6" />
      {/* Center Dots on lines */}
      <circle cx="37.5%" cy="50%" r="5" fill={COLORS.primaryPurple} />
      <circle cx="62.5%" cy="50%" r="5" fill={COLORS.primaryPurple} />
    </svg>

    <div className="w-full flex justify-center mt-4">
      <DiagramBlock>App</DiagramBlock>
    </div>
    <div className="w-full flex justify-around mb-4">
      <DiagramBlock>Header</DiagramBlock>
      <DiagramBlock>Feed</DiagramBlock>
    </div>
  </div>
);

// Diagram 2: Unidirectional Data Flow
const DataFlowDiagram = () => (
  <div className="relative w-full flex flex-col items-center">
    <DiagramBlock>Parent</DiagramBlock>
    <VerticalConnector height="h-20" />
    <DiagramBlock>Child</DiagramBlock>
  </div>
);

// Diagram 3: The Render Phase (Matches image horizontally)
const RenderPhaseDiagram = () => (
  <div className="relative w-full flex flex-col sm:flex-row items-center justify-between">
    <DiagramBlock>Trigger</DiagramBlock>
    <div className="hidden sm:block w-full flex-1">
      <HorizontalConnector />
    </div>
    <div className="block sm:hidden my-4">
      <VerticalConnector height="h-10" />
    </div>
    <DiagramBlock>Render</DiagramBlock>
    <div className="hidden sm:block w-full flex-1">
      <HorizontalConnector />
    </div>
    <div className="block sm:hidden my-4">
      <VerticalConnector height="h-10" />
    </div>
    <DiagramBlock>Commit</DiagramBlock>
  </div>
);

// Diagram 4: The Conceptual Equation (State Loop)
const StateLoopDiagram = () => (
  <div className="w-full max-w-2xl mx-auto relative mt-8 mb-12">
    {/* Forward Flow Layer */}
    <div className="flex w-full justify-between items-center relative z-10">
      <div className="w-[120px] flex justify-center">
        <DiagramBlock>State</DiagramBlock>
      </div>
      <div className="flex-1"><HorizontalConnector /></div>
      <div className="w-[120px] flex justify-center">
        <DiagramBlock>f (state)</DiagramBlock>
      </div>
      <div className="flex-1"><HorizontalConnector /></div>
      <div className="w-[120px] flex justify-center">
        <DiagramBlock>UI Element</DiagramBlock>
      </div>
    </div>

    {/* U-Shaped Feedback Loop Layer */}
    <div
      className="absolute top-[40px] left-[60px] right-[60px] h-[80px] border-b-2 border-l-2 border-r-2 border-dashed rounded-b-2xl z-0"
      style={{ borderColor: COLORS.primaryPurple }}
    >
      <div
        className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-full"
        style={{ backgroundColor: COLORS.primaryPurple }}
      />
      <div
        className="absolute left-1/2 bottom-0 translate-y-4 -translate-x-1/2 font-mono text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
        style={{ color: COLORS.primaryPurple, backgroundColor: COLORS.containerBg }}
      >
        Event Triggers Mutation
      </div>
    </div>
  </div>
);

// Sub-component for Fiber Architecture Tree
const FiberTree = ({ title, isActive }) => (
  <div className="flex flex-col items-center relative z-10 w-1/2">
    <h4 
      className="font-mono text-sm mb-6 font-bold tracking-wide" 
      style={{ color: isActive ? COLORS.primaryPurple : COLORS.captionText }}
    >
      {title}
    </h4>
    <div className={`flex flex-col items-center transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
      <DiagramBlock>Root</DiagramBlock>
      
      {/* Precision Branching Connector */}
      <div className="relative w-full h-12 flex justify-center">
        <div className="absolute top-0 w-[2px] h-1/2 border-l-2 border-dashed" style={{ borderColor: COLORS.primaryPurple }} />
        <div className="absolute top-1/2 w-[116px] border-t-2 border-dashed" style={{ borderColor: COLORS.primaryPurple }} />
        <div className="absolute top-1/2 left-[calc(50%-58px)] w-[2px] h-1/2 border-l-2 border-dashed" style={{ borderColor: COLORS.primaryPurple }} />
        <div className="absolute top-1/2 right-[calc(50%-58px)] w-[2px] h-1/2 border-l-2 border-dashed" style={{ borderColor: COLORS.primaryPurple }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full" style={{ backgroundColor: COLORS.primaryPurple }} />
      </div>

      <div className="flex gap-4">
        <DiagramBlock className="!w-[100px]">Node</DiagramBlock>
        <DiagramBlock className="!w-[100px]">Node</DiagramBlock>
      </div>
    </div>
  </div>
);

// Diagram 5: Fiber Double Buffering
const FiberBufferingDiagram = () => (
  <div className="relative w-full max-w-2xl mx-auto flex justify-around items-end pt-12 pb-4">
    {/* Arching Root Pointer (Committing phase swap) */}
    <svg className="absolute top-0 left-0 w-full h-[80px] pointer-events-none z-0" preserveAspectRatio="none">
      <path d="M 25% 60 Q 50% -10, 75% 60" fill="none" stroke={COLORS.primaryPurple} strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="50%" cy="25" r="5" fill={COLORS.primaryPurple} />
    </svg>

    {/* Pointer Label */}
    <div 
      className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md shadow-sm z-20 font-mono text-xs font-bold border-2" 
      style={{ borderColor: COLORS.primaryPurple, color: COLORS.primaryPurple, backgroundColor: COLORS.containerBg }}
    >
      Host Root Ptr
    </div>

    <FiberTree title="Current Tree" isActive={false} />
    <FiberTree title="Work-In-Progress" isActive={true} />
  </div>
);

// Diagram 6: Architecture Duel (Imperative vs Declarative)
const ArchitectureDuelDiagram = () => (
  <div className="w-full flex flex-col gap-10">
    {/* Imperative / Manual Wires */}
    <div className="w-full relative flex flex-col opacity-90">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-red-400"></div>
        <h4 className="font-mono text-xs font-bold text-red-500/80 uppercase tracking-widest">
          Manual Wires
        </h4>
      </div>
      
      <div className="flex justify-between items-stretch h-32 relative">
        <div className="flex flex-col justify-center w-24">
           <DiagramBlock className="!w-full !h-12 !text-xs !bg-white">Action</DiagramBlock>
        </div>
        
        <div className="flex-1 flex flex-col justify-between py-4 px-2">
          <div className="w-full h-0 border-t-2 border-dashed border-[#a16315] relative">
            <div className="absolute -top-3 right-2 text-[#a16315] text-xs">→</div>
          </div>
          <div className="w-full h-0 border-t-2 border-dashed border-[#a16315] relative">
            <div className="absolute -top-3 right-2 text-[#a16315] text-xs">→</div>
          </div>
          <div className="w-full h-0 border-t-2 border-dashed border-red-400 relative">
            <span className="absolute left-1/2 -top-3 -translate-x-1/2 text-[9px] font-mono font-bold text-red-500 bg-[#f4ecfd] px-1">Snap!</span>
            <div className="absolute -top-3 right-2 text-red-400 text-xs">→</div>
          </div>
        </div>

        <div className="flex flex-col justify-between w-28">
          <div className="h-8 flex items-center justify-center border border-[#d2bbf6] bg-white rounded font-mono text-[10px] text-gray-500">Avatar UI</div>
          <div className="h-8 flex items-center justify-center border border-[#d2bbf6] bg-white rounded font-mono text-[10px] text-gray-500">Header UI</div>
          <div className="h-8 flex items-center justify-center border border-red-300 bg-red-50 rounded font-mono text-[10px] text-red-500 shadow-sm relative">
             Cart UI <span className="absolute -top-2 -right-2 text-[8px] bg-red-500 text-white px-1 rounded-sm">STALE</span>
          </div>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="w-full border-t-2 border-dotted" style={{ borderColor: COLORS.containerBorder }}></div>

    {/* Declarative / Single Pipeline */}
    <div className="w-full relative flex flex-col">
      <div className="flex items-center gap-2 mb-4">
         <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
        <h4 className="font-mono text-xs font-bold text-emerald-600/80 uppercase tracking-widest">
          Reactive Pipeline
        </h4>
      </div>

      <div className="flex justify-between items-stretch h-32 relative">
         <div className="flex flex-col justify-center w-24">
           <DiagramBlock className="!w-full !h-12 !text-xs !bg-emerald-50 !border-emerald-300 !text-[#0f172a]">State</DiagramBlock>
        </div>

        <div className="flex-1 flex items-center px-4 relative z-0">
           {/* Thick Pipeline Arrow */}
           <div className="w-full h-[6px] bg-emerald-400/60 rounded-l relative">
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-l-[10px] border-l-emerald-400/60 border-b-[8px] border-b-transparent"></div>
           </div>
           <div className="absolute left-1/2 -top-3 -translate-x-1/2 font-mono text-[10px] font-bold text-emerald-700 bg-[#f4ecfd] px-3 py-1 rounded-full whitespace-nowrap border border-emerald-200">
              Blueprint f(state)
           </div>
        </div>

        <div className="flex flex-col justify-between w-28 p-2 border-2 border-emerald-300 bg-emerald-50/30 rounded-lg relative">
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-600 bg-emerald-100 px-2 rounded-full whitespace-nowrap border border-emerald-200">Atomic Sync</div>
          <div className="h-7 flex items-center justify-center border border-emerald-200 bg-white rounded font-mono text-[10px] text-emerald-700">Avatar UI</div>
          <div className="h-7 flex items-center justify-center border border-emerald-200 bg-white rounded font-mono text-[10px] text-emerald-700">Header UI</div>
          <div className="h-7 flex items-center justify-center border border-emerald-200 bg-white rounded font-mono text-[10px] text-emerald-700">Cart UI</div>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <div 
      className="min-h-screen w-full flex justify-center py-12 px-4 sm:px-8 selection:bg-purple-200"
      style={{ backgroundColor: COLORS.bgPage }}
    >
      <article className="max-w-3xl w-full mx-auto">
        
        {/* Book Header */}
        <header className="mb-16 border-b pb-8" style={{ borderColor: COLORS.containerBorder }}>
          <p className="font-mono text-sm tracking-widest uppercase mb-4" style={{ color: COLORS.captionText }}>
            Chapter 4
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: COLORS.headingText }}>
            The React Mental Model
          </h1>
        </header>

        {/* Introduction */}
        <div className="prose prose-lg prose-slate max-w-none font-serif leading-relaxed space-y-6" style={{ color: COLORS.bodyText }}>
          <p>
            At its core, React is an engine that translates application state into a visual user interface. 
            This foundational mental model can be expressed as a deterministic equation: <code className="font-mono text-sm px-2 py-0.5 rounded" style={{color: COLORS.primaryPurple, backgroundColor: COLORS.containerBg}}>UI = f(state)</code>. 
            The rendered interface is simply a strict projection of the application's state at any specific moment in time.
          </p>

          <DiagramFigure 
            title="the-conceptual-equation" 
            caption="User interactions trigger state mutations, which continuously flow through the render function to project a new UI snapshot."
            figureNumber="4.1"
          >
            <StateLoopDiagram />
          </DiagramFigure>

          {}
          <p>
            Historically, web applications relied on an imperative approach: manually wiring event listeners to direct DOM mutations. As interfaces grew complex, this became a fragile web of dependencies. Forgetting even a single query in legacy modules would lead to silent state corruption, leaving parts of the UI permanently out of sync with the application's memory.
          </p>

          <DiagramFigure 
            title="architectural-projection-duel" 
            caption="Manual DOM wiring inevitably leads to missed updates and stale UI. React solves this by strictly forcing all state changes through a single, declarative projection pipeline, guaranteeing 100% synchronization."
            figureNumber="4.2"
          >
            <ArchitectureDuelDiagram />
          </DiagramFigure>

          <p>
            As applications grow, this continuous render loop requires immense optimization. Under the hood, 
            React achieves non-blocking, asynchronous updates via its Fiber architecture and a graphics-inspired technique called <strong>Double Buffering</strong>. 
            Rather than mutating the visible component tree directly, React drafts all layout calculations on a hidden "Work-In-Progress" tree in memory. 
            Once the background rendering is complete, it instantly flips a root pointer to display the new tree seamlessly.
          </p>

          <DiagramFigure 
            title="fiber-double-buffering" 
            caption="The Commit Phase in modern React is essentially an atomic swap of the root pointer from the stale Current Tree to the new Work-In-Progress tree."
            figureNumber="4.3"
          >
            <FiberBufferingDiagram />
          </DiagramFigure>

          <p>
            To master this paradigm, one must first unlearn the traditional habits of direct imperative DOM manipulation. 
            React requires a fundamental shift: instead of telling the browser exactly <em>how</em> to change the UI step-by-step, 
            we simply declare <em>what</em> the UI should look like.
          </p>
          
          <DiagramFigure 
            title="component-tree" 
            caption="React models the UI as a tree of independent, composable components."
            figureNumber="4.4"
          >
            <VirtualDOMDiagram />
          </DiagramFigure>

          <p>
            At the core of this model is predictability. If components were allowed to mutate each other's data 
            at will, tracing the source of a bug would become a nightmare of tangled dependencies. To solve this, 
            React enforces a strict rule: data can only move in one direction.
          </p>

          <DiagramFigure 
            title="unidirectional-flow" 
            caption="Data strictly flows downwards from a parent component to its children via props."
            figureNumber="4.5"
          >
            <DataFlowDiagram />
          </DiagramFigure>

          <p>
            When data changes, React does not immediately touch the real DOM. Instead, it enters a highly 
            optimized lifecycle. First, a state update triggers a new render. React then calls your components 
            to figure out what the screen should look like, and finally, it commits only the necessary changes to the DOM.
          </p>

          <DiagramFigure 
            title="the-render-phase" 
            caption="The UI lifecycle is divided into three distinct steps: Triggering, Rendering, and Committing."
            figureNumber="4.6"
          >
            <RenderPhaseDiagram />
          </DiagramFigure>

          <p>
            By strictly dividing the calculation of the UI (Rendering) from the side effects applied to the screen (Committing), 
            React unlocks powerful features like concurrent rendering. Understanding this separation is the key to writing fast, 
            resilient applications.
          </p>
        </div>
        
        {/* Footer/Page Number */}
        <footer className="mt-24 border-t pt-8 flex justify-between items-center font-mono text-sm" style={{ borderColor: COLORS.containerBorder, color: COLORS.captionText }}>
          <span>42</span>
          <span>Core Concepts</span>
        </footer>

      </article>
    </div>
  );
}