import React, { useState } from 'react';
import { BaZiResult } from '../types';
import PillarCard from './PillarDisplay';

interface LifePaintingProps {
  result: BaZiResult;
  imageUrl: string;
  onReset: () => void;
}

const LifePainting: React.FC<LifePaintingProps> = ({ result, imageUrl, onReset }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 serif-font mb-4">
          The Canvas of Your Soul
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto italic">
          "{result.elementalAnalysis}"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: The Pillars (Desktop) / Top (Mobile) */}
        <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="grid grid-cols-4 lg:grid-cols-2 gap-4 justify-items-center">
                <PillarCard label="Year" pillar={result.year} delay={100} />
                <PillarCard label="Month" pillar={result.month} delay={200} />
                <PillarCard label="Day" pillar={result.day} delay={300} />
                <PillarCard label="Hour" pillar={result.hour} delay={400} />
            </div>
            
            <div className="mt-10 bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-amber-500 font-bold mb-2 serif-font border-b border-amber-500/20 pb-2">Interpretation</h3>
                <p className="text-slate-300 leading-relaxed font-light text-sm md:text-base">
                    {result.interpretation}
                </p>
            </div>
        </div>

        {/* Right Column: The Painting (Hero) */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="relative aspect-[3/4] w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800 group">
            {/* Loading Skeleton for Image */}
            {!imageLoaded && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
                    <span className="text-slate-500 serif-font">Manifesting Vision...</span>
                </div>
            )}
            <img 
                src={imageUrl} 
                alt="Soul Landscape" 
                className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                onLoad={() => setImageLoaded(true)}
            />
            
            {/* Overlay Detail */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white/90 text-sm font-light tracking-wide">
                    {result.imagePrompt.split('.')[0]}.
                </p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-12 text-center pb-12">
        <button 
            onClick={onReset}
            className="px-8 py-3 border border-amber-500 text-amber-500 rounded-full hover:bg-amber-500 hover:text-slate-900 transition-colors font-semibold tracking-wide uppercase text-sm"
        >
            Read Another Destiny
        </button>
      </div>

    </div>
  );
};

export default LifePainting;