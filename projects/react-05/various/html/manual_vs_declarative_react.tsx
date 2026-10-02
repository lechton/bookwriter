import React from 'react';
import { Check, X } from 'lucide-react';

const Box = ({ children, className = '' }) => (
  <div className={`rounded-xl p-4 flex items-center justify-between border-2 ${className}`}>
    {children}
  </div>
);

const CodeText = ({ children, className = '' }) => (
  <span className={`font-mono text-sm tracking-wide ${className}`}>
    {children}
  </span>
);

export default function ManualVsDeclarative() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 font-sans">
      
      {/* Title */}
      <div className="w-full max-w-5xl mb-2 pl-4">
        <h2 className="text-purple-600 font-bold text-lg tracking-wide font-mono">
          manual-vs-declarative
        </h2>
      </div>

      {/* Main Panel */}
      <div className="w-full max-w-5xl bg-[#f5effd] rounded-2xl p-8 border border-purple-200 shadow-sm relative">
        
        {/* Header Info */}
        <div className="flex justify-between items-center mb-6 px-2 opacity-60">
          <CodeText className="text-gray-600">01-01 · manual-vs-declarative</CodeText>
          <CodeText className="text-gray-600">UI = f(state)</CodeText>
        </div>

        {/* Function Call Box */}
        <div className="bg-white rounded-xl p-4 mb-10 shadow-sm border border-purple-100 flex items-center">
          <CodeText className="font-bold text-gray-800 text-lg">
            switchUser('Elena Vance')
          </CodeText>
        </div>

        {/* Columns Container */}
        <div className="flex flex-col md:flex-row gap-8 relative items-start">
          
          {/* VS Badge */}
          <div className="hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 -translate-y-4 w-12 h-12 bg-purple-600 rounded-full items-center justify-center text-white font-bold text-lg z-10 shadow-md">
            VS
          </div>

          {/* Left Column: Manual DOM */}
          <div className="flex-1 w-full bg-[#f0eaf7] rounded-2xl border border-purple-200 overflow-hidden">
            <div className="bg-[#e9e1f5] p-4 border-b border-purple-200">
              <h3 className="text-purple-900 font-bold text-lg">Manual DOM</h3>
            </div>
            
            <div className="p-6 space-y-4 bg-white/50">
              {/* Box 1 */}
              <Box className="bg-white border-purple-100 shadow-sm text-gray-700">
                <CodeText>#user-banner</CodeText>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono text-sm">Elena</span>
                  <Check size={18} className="text-purple-500" strokeWidth={3} />
                </div>
              </Box>

              {/* Box 2 */}
              <Box className="bg-white border-purple-100 shadow-sm text-gray-700">
                <CodeText>#user-avatar</CodeText>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono text-sm">avatar.png</span>
                  <Check size={18} className="text-purple-500" strokeWidth={3} />
                </div>
              </Box>

              {/* Box 3 */}
              <Box className="bg-white border-purple-100 shadow-sm text-gray-700">
                <CodeText>.welcome-msg</CodeText>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono text-sm">Elena</span>
                  <Check size={18} className="text-purple-500" strokeWidth={3} />
                </div>
              </Box>

              {/* Box 4 (Error) */}
              <Box className="bg-[#fff1e5] border-[#f6c39a] text-[#c05b18]">
                <CodeText className="font-bold">#sticky-checkout</CodeText>
                <div className="flex items-center gap-3">
                  <span className="font-bold font-mono text-sm">Marcus</span>
                  <X size={18} strokeWidth={3} />
                </div>
              </Box>
            </div>
          </div>

          {}
          {/* Right Column: Declarative React */}
          <div className="flex-1 w-full bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-purple-100">
              <h3 className="text-purple-600 font-bold text-lg">Declarative React</h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Box 1 */}
              <Box className="bg-white border-purple-100 shadow-sm text-gray-700">
                <CodeText>#user-banner</CodeText>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono text-sm">Elena</span>
                  <Check size={18} className="text-purple-500" strokeWidth={3} />
                </div>
              </Box>

              {/* Box 2 */}
              <Box className="bg-white border-purple-100 shadow-sm text-gray-700">
                <CodeText>#user-avatar</CodeText>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono text-sm">Elena</span>
                  <Check size={18} className="text-purple-500" strokeWidth={3} />
                </div>
              </Box>

              {/* Box 3 */}
              <Box className="bg-white border-purple-100 shadow-sm text-gray-700">
                <CodeText>.welcome-msg</CodeText>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono text-sm">Elena</span>
                  <Check size={18} className="text-purple-500" strokeWidth={3} />
                </div>
              </Box>

              {/* Box 4 */}
              <Box className="bg-white border-purple-100 shadow-sm text-gray-700">
                <CodeText>#sticky-checkout</CodeText>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono text-sm">Elena</span>
                  <Check size={18} className="text-purple-500" strokeWidth={3} />
                </div>
              </Box>
            </div>
          </div>

        </div>
      </div>

      {}
      {/* Caption */}
      <div className="w-full max-w-4xl mt-8 text-center px-4">
        <p className="text-gray-600 font-mono text-[15px] leading-relaxed">
          <span className="font-bold text-gray-800">Fig 01.1:</span> Imperative DOM queries fail as the interface grows. Forgetting even one query
          creates catastrophic synchronization drift between memory and the screen.
        </p>
      </div>

    </div>
  );
}