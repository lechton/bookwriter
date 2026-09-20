import React from 'react';

// Defining the exact text and color palettes for each step based on the provided image.
const stepsData = [
  {
    id: 1,
    title: 'Let\'s Build the "Smart" Button',
    components: ['<SubmitButton>'],
    colors: {
      edge: 'bg-[#7495BE]',
      main: 'bg-[#D4E1F1]',
      divider: 'bg-[#B0C4DD]'
    }
  },
  {
    id: 2,
    title: 'Next, Define the Action Handler',
    components: ['<ArticleFeedbackForm>'],
    colors: {
      edge: 'bg-[#66A49B]',
      main: 'bg-[#D0E6E1]',
      divider: 'bg-[#AED1CB]'
    }
  },
  {
    id: 3,
    title: 'Then, Create the Form Component',
    components: ['<ArticleFeedbackForm>', '<form>'],
    colors: {
      edge: 'bg-[#E09F67]',
      main: 'bg-[#F9E0C5]',
      divider: 'bg-[#EAC4A1]'
    }
  },
  {
    id: 4,
    title: 'Finally, Mount the App',
    components: ['<App>'],
    colors: {
      edge: 'bg-[#74AD68]',
      main: 'bg-[#D2EBC9]',
      divider: 'bg-[#B2D5A5]'
    }
  }
];

// Reusable component for each progressive step card
const StepCard = ({ step }) => {
  return (
    <div className="flex w-full shadow-sm rounded-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Darker left edge accent - thinner now */}
      <div className={`w-2 sm:w-2.5 flex-shrink-0 ${step.colors.edge}`}></div>
      
      {/* Main card body */}
      <div className={`flex flex-row flex-1 ${step.colors.main}`}>
        
        {/* Step Indicator Section - reduced padding and sizing */}
        <div className="flex flex-col items-center justify-center py-4 px-4 sm:px-6 min-w-[70px] sm:min-w-[90px]">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-800 uppercase mb-0.5">
            Step
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none">
            {step.id}
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="py-3 flex items-center">
          <div className={`w-0.5 h-full rounded-full opacity-60 ${step.colors.divider}`}></div>
        </div>

        {/* Content Section - reduced padding and font sizes */}
        <div className="flex flex-col justify-center py-4 px-5 sm:px-8 flex-1">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1 tracking-tight">
            {step.title}
          </h2>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {step.components.map((comp, idx) => (
              <span 
                key={idx} 
                className="text-sm sm:text-[15px] text-gray-800 tracking-wide font-medium font-mono"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-gray-200">
      {/* 
        Central container for the diagram. 
        Reduced max-width (max-w-3xl) and gaps for a more normal size.
      */}
      <div className="w-full max-w-3xl flex flex-col gap-3 sm:gap-4">
        {stepsData.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
      </div>
    </div>
  );
}