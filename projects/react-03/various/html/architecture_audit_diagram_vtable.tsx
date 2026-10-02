import React from 'react';

const tableData = [
  {
    id: 'layer-1',
    layer: '1. The Origin',
    role: '(Parent Form)',
    expectationTitle: 'Explicit State Management',
    expectationDesc: 'Developers must manually declare boolean state flags and initiate a downward prop-drilling chain. This requires adding a `useState` hook at the top level and passing its value to the first child.',
    realityTitle: 'Ambient Context Provider',
    realityDesc: 'React automatically turns standard native HTML forms into invisible state broadcasters. Zero manual state required. This boundary is activated implicitly by the `<form action={...}>` element.',
  },
  {
    id: 'layer-2',
    layer: '2. The Intermediaries',
    role: '(Layout Wrappers)',
    expectationTitle: 'Signature Pollution',
    expectationDesc: 'Every intermediate layout container is forced to accept and forward submission props they do not actually use. The `isPending` boolean must be destructured and passed along in every intermediate component signature.',
    realityTitle: '100% Agnostic Layouts',
    realityDesc: 'Intermediate wrappers are completely bypassed. They remain pure, ignorant components that never see form state. They simply render `{children}` without any awareness of the active submission.',
  },
  {
    id: 'layer-3',
    layer: '3. The Leaf Target',
    role: '(Submit Button)',
    expectationTitle: 'Passive Prop Consumer',
    expectationDesc: 'The button blindly waits for a disabled prop to be successfully passed down through the entire component tree. This manifests as a `disabled={isPending}` attribute explicitly passed to the native button.',
    realityTitle: 'Active Sensor Subscription',
    realityDesc: 'The button uses a hook to directly "teleport" the transmission state from the nearest ancestor, bypassing the tree. This is achieved by calling `useFormStatus()` directly inside the button component body.',
  }
];

export default function ArchitectureAudit() {
  return (
    // Simulating a crisp, white A4 page environment
    <div className="min-h-screen bg-white flex justify-center py-16 px-6 sm:px-12 md:px-20 font-sans text-slate-900 selection:bg-slate-200">
      
      {/* Constraining width for optimal reading measure (book layout) */}
      <div className="w-full max-w-[960px]">
        
        {/* Editorial Header */}
        <header className="mb-12">
          <p className="text-[11px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-4">
            Lessons from the Code
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            The Nested Button Challenge
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed font-light">
            An architectural comparison evaluating how asynchronous form state travels through deeply nested component hierarchies.
          </p>
        </header>

        {/* The Concrete Table */}
        <div className="overflow-x-auto pb-8">
          <table className="w-full text-left border-collapse min-w-[700px]">
            
            {/* Table Header with Newsworthy Titles */}
            <thead>
              <tr>
                {/* Thick top border for traditional book/academic table styling */}
                <th className="border-t-4 border-b border-slate-900 pt-6 pb-4 pr-6 w-1/5 align-bottom">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                    Component Layer
                  </span>
                </th>
                <th className="border-t-4 border-b border-slate-900 pt-6 pb-4 px-6 w-2/5 align-bottom">
                  <span className="block text-[22px] font-bold text-slate-900 leading-tight">
                    Naive Expectation
                  </span>
                  <span className="block text-sm font-medium text-slate-500 mt-1">
                    (Manual Prop Drilling)
                  </span>
                </th>
                <th className="border-t-4 border-b border-slate-900 pt-6 pb-4 px-6 w-2/5 align-bottom bg-slate-50">
                  <span className="block text-[22px] font-bold text-slate-900 leading-tight">
                    What Happened
                  </span>
                  <span className="block text-sm font-medium text-slate-500 mt-1">
                    (React 19 Reality)
                  </span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-base border-b-4 border-slate-900">
              {tableData.map((row, index) => (
                <tr key={row.id} className="group">
                  {/* Layer Column */}
                  <td className="py-8 pr-6 border-b border-slate-200 align-top">
                    <span className="block font-bold text-slate-900 text-[15px] tracking-tight">
                      {row.layer}
                    </span>
                    <span className="block font-medium text-slate-400 text-sm mt-0.5">
                      {row.role}
                    </span>
                  </td>
                  
                  {/* Expectation Column */}
                  <td className="py-8 px-6 border-b border-slate-200 align-top">
                    <span className="block font-bold text-slate-800 mb-2">
                      {row.expectationTitle}
                    </span>
                    <span className="block text-slate-600 leading-relaxed text-[15px]">
                      {row.expectationDesc}
                    </span>
                  </td>

                  {/* Reality Column (Subtle highlight) */}
                  <td className="py-8 px-6 border-b border-slate-200 align-top bg-slate-50">
                    <span className="block font-bold text-slate-900 mb-2">
                      {row.realityTitle}
                    </span>
                    <span className="block text-slate-700 leading-relaxed text-[15px]">
                      {row.realityDesc}
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Verdict/Conclusion Row */}
              <tr>
                <td className="py-6 pr-6 align-top">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                    Final Verdict
                  </span>
                </td>
                <td className="py-6 px-6 align-top">
                  <span className="block text-sm font-semibold text-red-600 uppercase tracking-wide mb-1">
                    Fragile Coupling
                  </span>
                  <span className="block text-slate-600 text-sm leading-snug">
                    Restructuring the layout breaks multiple component signatures across the application.
                  </span>
                </td>
                <td className="py-6 px-6 align-top bg-slate-50">
                  <span className="block text-sm font-semibold text-teal-700 uppercase tracking-wide mb-1">
                    Bulletproof Modularity
                  </span>
                  <span className="block text-slate-700 text-sm leading-snug">
                    Designers can freely reorganize layout wrappers without breaking a single line of form logic.
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Figure Caption */}
        <figcaption className="mt-4 text-left text-sm text-slate-500 font-medium">
          <strong>Table 40.1:</strong> Summary of the mental model collision regarding asynchronous form state distribution.
        </figcaption>
        
      </div>
    </div>
  );
}