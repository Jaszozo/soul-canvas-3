import React from 'react';
import { Pillar } from '../types';

interface PillarDisplayProps {
  label: string;
  pillar: Pillar;
  delay: number;
}

const getElementColor = (elementStr: string) => {
  const lower = elementStr.toLowerCase();
  if (lower.includes('wood')) return 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]';
  if (lower.includes('fire')) return 'text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]';
  if (lower.includes('earth')) return 'text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]';
  if (lower.includes('metal')) return 'text-slate-200 drop-shadow-[0_0_5px_rgba(226,232,240,0.5)]';
  if (lower.includes('water')) return 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]';
  return 'text-slate-200';
};

const PillarCard: React.FC<PillarDisplayProps> = ({ label, pillar, delay }) => {
  return (
    <div 
      className="flex flex-col items-center animate-fade-in-up group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="text-xs text-emerald-500/70 uppercase tracking-widest mb-2 serif-font">{label}</div>
      <div className="bg-black/30 border border-emerald-800/40 w-20 md:w-24 py-6 rounded-full flex flex-col items-center shadow-lg relative overflow-hidden transition-all duration-500 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        
        {/* Background Ring effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-emerald-900/30 rounded-full"></div>
        
        {/* Stem */}
        <div className={`text-3xl md:text-4xl font-bold mb-3 chinese-font ${getElementColor(pillar.stemElement)}`}>
          {pillar.stem}
        </div>
        
        {/* Divider */}
        <div className="w-6 h-px bg-emerald-800/50 mb-3"></div>
        
        {/* Branch */}
        <div className={`text-3xl md:text-4xl font-bold chinese-font ${getElementColor(pillar.branchElement)}`}>
          {pillar.branch}
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <div className="text-xs text-emerald-100/60 font-medium">{pillar.stemElement}</div>
        <div className="text-xs text-emerald-600/80">{pillar.animal}</div>
      </div>
    </div>
  );
};

export default PillarCard;