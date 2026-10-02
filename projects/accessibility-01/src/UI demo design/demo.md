import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Award, Bookmark, Library } from 'lucide-react';

// --- DATA ---
const bookData = {
  title: "Nicomachean Ethics",
  author: "ARISTOTLE",
  publisher: "classics.uk.com",
  edition: "The New GCS Verse Edition",
  workingTranslation: "comprehensive transliteration",
  bookNum: 1,
  chapterNum: 1,
  passages: [
    {
      verse: "1.1.1",
      bekker: "1094a1–1094a1",
      greek: "πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις, ἀγαθοῦ τινὸς ἐφίεσθαι δοκεῖ· διὸ καλῶς ἀπεφήναντο τἀγαθόν, οὗ πάντʼ ἐφίεται.",
      translation: "Every art (**technē**) and every method (**methodos**), and likewise both action (**praxis**) and proclivity of pre-choice (**proairesis**) — pro + hairesis: a pre-choice; a deliberate, settled proclivity of choice — seems to aim at some good (**agathon**); and so they have well declared the good to be that at which all things aim.",
      summary: "Every human activity that involves skill or thought aims at something good (**agathon**). Aristotle opens with a universal claim: crafts, inquiries, actions, and deliberate choices all point beyond themselves. The closing line — the good is that at which all things aim — becomes the launchpad of the entire work.",
      deepDive: "Human action is never random; it is inherently teleological. Every tool you pick up, every question you investigate, every career choice you make points toward an intended objective that you perceive as valuable. Aristotle begins the entire Ethics from this universal psychological fact: whatever human beings deliberately choose to do, they do because they believe it leads to something good (**agathon**)."
    },
    {
      verse: "1.1.2",
      bekker: "1094a1–1094a5",
      greek: "διαφορὰ δέ τις φαίνεται τῶν τελῶν· τὰ μὲν γάρ εἰσιν ἐνέργειαι, τὰ δὲ παρʼ αὐτὰς ἔργα τινά.",
      translation: "A certain difference appears among ends (**telē**); singular **telos** (end / goal): some are activities (**energeiai**) in themselves, while beyond them lie certain works (**erga**) — products or results.",
      summary: "Not all ends (**telē**) are the same kind of thing. Some are the doing itself (like seeing — an activity (**energeia**), a being-at-work); others leave a result beyond the doing (like building — the house is the product (**ergon**)). This difference will matter for ranking goods.",
      deepDive: "Goals are not all built the same way. Some goals are completely contained within the activity itself—like playing music, seeing, or going for a walk, where the doing is the entire point. Other goals leave behind an external physical product (**ergon**)—like carpentry producing a table or medicine restoring health. This distinction between an activity (**energeia**) and an external product is the first foundational wedge for ranking human pursuits."
    },
    {
      verse: "1.1.3",
      bekker: "1094a5–1094a5",
      greek: "ὧν δʼ εἰσὶ τέλη τινὰ παρὰ τὰς πράξεις, ἐν τούτοις βελτίω πέφυκε τῶν ἐνεργειῶν τὰ ἔργα.",
      translation: "Wherever there are ends (**telē**) beyond the actions themselves, in those cases the works (**erga**) are by nature better than the activities (**energeiai**).",
      summary: "Aristotle distinguishes activities whose end is the doing itself from activities that produce a separate result. Where such a separate product exists, that product is naturally treated as better than the productive activity because the activity is undertaken for its sake. This establishes an early rule for ranking ends: the subordinate process is intelligible through the result it serves, not the reverse.",
      deepDive: "Whenever an activity produces an external product, the product is naturally superior to the labor that made it. Nobody builds a house just to swing a hammer; the hammer-swinging exists purely for the sake of the house. The product justifies the process, which gives us an objective rule for ranking values: subordinate activities exist to serve their results."
    },
    {
      verse: "1.1.4",
      bekker: "1094a5–1094a5",
      greek: "πολλῶν δὲ πράξεων οὐσῶν καὶ τεχνῶν καὶ ἐπιστημῶν πολλὰ γίνεται καὶ τὰ τέλη· ἰατρικῆς μὲν γὰρ ὑγίεια, ναυπηγικῆς δὲ πλοῖον, στρατηγικῆς δὲ νίκη, οἰκονομικῆς δὲ πλοῦτος.",
      translation: "Since there are many actions, arts (**technai**), and bodies of knowledge (**epistēmai**), the ends (**telē**) turn out to be many as well: health (**hygieia**) for medicine, a ship for shipbuilding, victory (**nikē**) for generalship, and wealth for household management (**oikonomikē**).",
      summary: "Different crafts have different ends: medicine aims at health, shipbuilding at a ship, generalship at victory, household management at wealth. Since activities are many, their ends are many — so no single good has emerged yet, only the search's terms.",
      deepDive: "Because human activities are endlessly diverse, their immediate ends are equally diverse: a doctor aims at health, a shipwright aims at a seaworthy vessel, a general aims at victory, and an accountant aims at wealth. At this opening stage, there is no single monolithic good yet, only a bustling marketplace of competing human objectives."
    }
  ]
};

// --- UTILITIES ---
const parseText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="font-semibold text-slate-800 bg-slate-200/60 px-1 rounded border border-slate-300">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

// --- COMPONENTS ---

export default function App() {
  const [isReading, setIsReading] = useState(false);

  return (
    <div className="min-h-screen font-sans selection:bg-slate-300 selection:text-slate-900 transition-colors duration-500">
      {isReading ? (
        <ReaderView onBack={() => setIsReading(false)} />
      ) : (
        <CoverView onOpen={() => setIsReading(true)} />
      )}
    </div>
  );
}

function CoverView({ onOpen }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-12 relative bg-slate-900 text-slate-50">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 max-w-5xl w-full">
        
        {/* The Minimalist Dark Blue Book Cover */}
        <div className="w-full max-w-[380px] aspect-[2.2/3.2] bg-slate-800 rounded-r-lg rounded-l-sm shadow-2xl relative border-l-8 border-slate-950 flex flex-col items-center justify-center p-8 text-center transition-transform duration-700 hover:-translate-y-2">
          
          <div className="absolute inset-3 border border-slate-700/60 rounded-sm pointer-events-none"></div>
          
          <div className="flex flex-col items-center space-y-4 pt-4 mt-8">
            <span className="uppercase tracking-[0.2em] text-[10px] font-semibold text-slate-400">
              {bookData.edition}
            </span>
          </div>

          <div className="flex flex-col items-center space-y-8 my-auto w-full px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-widest text-slate-100 scale-y-110 w-full">
              {bookData.author}
            </h1>
            
            <div className="flex flex-col items-center space-y-3 mt-4 w-full">
              <h2 className="font-serif text-2xl md:text-3xl italic font-light tracking-wide text-slate-200">
                {bookData.title}
              </h2>
              <p className="text-slate-400 italic text-sm tracking-widest lowercase">
                {bookData.workingTranslation}
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col items-center space-y-3 pb-8">
            <div className="w-12 h-px bg-slate-700" />
            <div className="flex items-center gap-2 text-slate-400 font-serif tracking-widest text-xs uppercase">
              <Library size={14} />
              {bookData.publisher}
            </div>
          </div>

        </div>

        {/* Action Panel */}
        <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left max-w-md">
          <h3 className="text-3xl font-serif text-slate-100">
            A Masterpiece of Moral Philosophy, Redefined.
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Experience Aristotle's profound insights on human flourishing with unprecedented clarity. The innovative <strong className="text-slate-200 font-medium">GCS verse system</strong> and comprehensive transliterations bridge the gap between ancient thought and modern understanding.
          </p>
          <button 
            onClick={onOpen}
            className="mt-6 group flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-200 text-slate-900 font-semibold rounded-full shadow-lg transition-all duration-300"
          >
            <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
            Read Selected Passages
          </button>
        </div>

      </div>
    </div>
  );
}

function ReaderView({ onBack }) {
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fcfbf9]/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Back to Cover
          </button>
          
          <div className="flex flex-col items-end md:items-center text-right md:text-center">
            <h1 className="font-serif text-lg font-bold text-slate-800">
              Ἠθικὰ Νικομάχεια
            </h1>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Nicomachean Ethics
            </h2>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-serif italic">
            {bookData.publisher}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
        
        {/* Chapter Heading */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-4 text-slate-400 mb-6">
            <div className="h-px w-12 bg-slate-300" />
            <Bookmark size={24} />
            <div className="h-px w-12 bg-slate-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-wide">
            Book {bookData.bookNum} <span className="text-slate-400 mx-2">·</span> Chapter {bookData.chapterNum}
          </h2>
          <p className="text-slate-500 font-serif italic">
            Formatted with the New GCS Verse System
          </p>
        </div>

        {/* Verses Container */}
        <div className="space-y-16">
          {bookData.passages.map((passage, index) => (
            <article key={index} className="relative group scroll-m-24" id={`verse-${passage.verse}`}>

              <div className="flex flex-col space-y-6 md:pl-6 border-l-0 md:border-l-2 border-slate-200 group-hover:border-slate-400 transition-colors duration-300">
                
                {/* Verse Number, Bekker & Greek Original */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start">
                  <div className="shrink-0 pt-1">
                    <span className="font-sans text-sm font-bold bg-slate-800 text-white px-3 py-1.5 rounded-md shadow-sm tracking-wide flex items-center gap-1.5">
                      {passage.verse}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif text-xl md:text-2xl text-slate-900 leading-relaxed">
                      {passage.greek}
                    </p>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      Bekker: {passage.bekker}
                    </p>
                  </div>
                </div>

                {/* Translation */}
                <div>
                  <p className="font-serif text-lg text-slate-800 leading-relaxed">
                    {parseText(passage.translation)}
                  </p>
                </div>

                {/* Summary / Core Point (➤) */}
                <div className="flex gap-4 items-start pl-4 border-l-2 border-slate-300 bg-slate-50 py-4 pr-4 rounded-r-md">
                  <span className="text-slate-400 font-bold mt-1.5 select-none text-sm">➤</span>
                  <p className="font-serif text-lg text-slate-800 leading-relaxed">
                    {parseText(passage.summary)}
                  </p>
                </div>

                {/* Deep Dive / Commentary (The Takeaway) */}
                <div className="relative mt-8 bg-amber-50/50 border-2 border-amber-200/70 p-6 rounded-xl shadow-sm">
                  <div className="absolute -top-3.5 left-5 bg-white px-2">
                    <span className="bg-amber-600 text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-md shadow-sm flex items-center gap-2">
                      <Bookmark size={12} />
                      The Takeaway
                    </span>
                  </div>
                  <p className="font-sans text-lg text-slate-800 leading-relaxed pt-1">
                    {parseText(passage.deepDive)}
                  </p>
                </div>

              </div>
            </article>
          ))}
        </div>
        
        {/* End of chapter flourish */}
        <div className="mt-24 flex items-center justify-center gap-4 text-slate-300">
          <div className="h-px w-24 bg-slate-200" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-3 h-3 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="h-px w-24 bg-slate-200" />
        </div>

      </main>
    </div>
  );
}