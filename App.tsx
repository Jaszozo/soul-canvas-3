import React, { useState } from 'react';
import { UserInput, BaZiResult, LoadingState } from './types';
import { analyzeDestiny, generateDestinyImage } from './services/geminiService';
import InputForm from './components/InputForm';
import LifePainting from './components/LifePainting';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [baziResult, setBaziResult] = useState<BaZiResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    setLoadingState('analyzing');
    setErrorMsg(null);

    try {
      // Step 1: Analyze text and calculate BaZi
      const result = await analyzeDestiny(data.birthDate, data.location, data.gender);
      setBaziResult(result);
      
      // Step 2: Generate Image based on the analysis
      setLoadingState('painting');
      const imageUrl = await generateDestinyImage(result.imagePrompt);
      
      setGeneratedImage(imageUrl);
      setLoadingState('complete');

    } catch (error) {
      console.error(error);
      setLoadingState('error');
      setErrorMsg("The cosmic energies are turbulent. Please try again later.");
    }
  };

  const handleReset = () => {
    setLoadingState('idle');
    setBaziResult(null);
    setGeneratedImage(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full relative bg-green-950 overflow-x-hidden font-sans text-emerald-50">
        {/* Background Ambient Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
            {/* Dark Forest Gradient / Image Layer */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2532&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(2,44,34,0.4)_0%,_rgba(2,44,34,0.8)_50%,_rgba(0,0,0,1)_100%)]"></div>
            
            {/* Floating Particles (Fireflies) */}
            <div className="firefly absolute top-[20%] left-[20%] w-1 h-1 bg-amber-400 rounded-full blur-[1px] animate-float-slow"></div>
            <div className="firefly absolute top-[50%] right-[30%] w-1 h-1 bg-emerald-400 rounded-full blur-[1px] animate-float-medium"></div>
            <div className="firefly absolute bottom-[30%] left-[40%] w-2 h-2 bg-yellow-200 rounded-full blur-[2px] animate-float-fast opacity-50"></div>
            
            {/* Texture Overlay */}
            <div className="absolute inset-0 ink-texture opacity-30 mix-blend-multiply"></div>
        </div>

        <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 md:mb-16 border-b border-emerald-800/50 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-900 flex items-center justify-center border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <span className="text-emerald-100 font-bold serif-font text-lg">命</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-emerald-100 tracking-widest uppercase serif-font drop-shadow-md">
                        SoulCanvas <span className="text-amber-400 text-sm align-top opacity-90 font-light">BaZi</span>
                    </h1>
                </div>
                <div className="text-xs md:text-sm text-emerald-400/60 tracking-widest">
                    NATURE · DESTINY · ART
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-grow flex items-center justify-center">
                {loadingState === 'idle' && (
                    <div className="animate-fade-in w-full flex justify-center">
                        <InputForm onSubmit={handleFormSubmit} isLoading={false} />
                    </div>
                )}

                {(loadingState === 'analyzing' || loadingState === 'painting') && (
                   <div className="text-center animate-pulse space-y-6 backdrop-blur-sm bg-black/20 p-8 rounded-3xl border border-emerald-900/30">
                       <div className="relative w-24 h-24 mx-auto">
                           {/* Rotating Rings */}
                           <div className="absolute inset-0 border-2 border-emerald-900 rounded-full"></div>
                           <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
                           <div className="absolute inset-2 border-t-2 border-amber-500/50 rounded-full animate-spin-reverse"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                               <span className="text-3xl text-emerald-200 opacity-80">❂</span>
                           </div>
                       </div>
                       <div>
                           <h2 className="text-3xl font-light text-emerald-100 serif-font mb-2">
                               {loadingState === 'analyzing' ? "Reading the Roots..." : "Manifesting Vision..."}
                           </h2>
                           <p className="text-emerald-400/70 text-sm max-w-xs mx-auto tracking-wide">
                               Translating birth energies into the canvas of nature.
                           </p>
                       </div>
                   </div>
                )}

                {loadingState === 'complete' && baziResult && generatedImage && (
                    <LifePainting 
                        result={baziResult} 
                        imageUrl={generatedImage} 
                        onReset={handleReset} 
                    />
                )}

                {loadingState === 'error' && (
                    <div className="text-center bg-red-950/40 p-8 rounded-xl border border-red-900/50 max-w-md backdrop-blur-md">
                        <div className="text-4xl mb-4 text-red-400 opacity-80">⚠️</div>
                        <h3 className="text-xl font-bold text-red-300 mb-2 serif-font">Flow Interrupted</h3>
                        <p className="text-red-200/70 mb-6">{errorMsg}</p>
                        <button 
                            onClick={handleReset}
                            className="px-6 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-100 rounded-lg border border-red-800 transition-colors"
                        >
                            Reconnect
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center text-emerald-700/50 text-xs py-4">
                <p>&copy; {new Date().getFullYear()} SoulCanvas. Traditional Chinese Metaphysics.</p>
            </footer>
        </main>

        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                50% { transform: translateY(-20px) translateX(10px); }
            }
            @keyframes spin-reverse {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
            }
            .animate-fade-in {
                animation: fadeIn 0.8s ease-out forwards;
            }
            .animate-fade-in-up {
                opacity: 0;
                animation: fadeInUp 0.8s ease-out forwards;
            }
            .animate-float-slow {
                animation: float 8s ease-in-out infinite;
            }
            .animate-float-medium {
                animation: float 6s ease-in-out infinite;
            }
            .animate-float-fast {
                animation: float 4s ease-in-out infinite;
            }
            .animate-spin-reverse {
                animation: spin-reverse 3s linear infinite;
            }
        `}</style>
    </div>
  );
};

export default App;