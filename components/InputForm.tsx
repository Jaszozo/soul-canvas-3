import React, { useState } from 'react';
import { UserInput } from '../types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && location) {
      onSubmit({ birthDate: date, location, gender });
    }
  };

  return (
    <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border border-emerald-800/40 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-br-3xl"></div>

      <h2 className="text-3xl font-bold text-center mb-8 text-emerald-100 serif-font tracking-wider drop-shadow-sm">
        Enter the Cycle
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-medium text-emerald-200/70 mb-2 tracking-wide uppercase text-xs">
            Date & Time of Birth
          </label>
          <input
            type="datetime-local"
            required
            className="w-full bg-emerald-950/40 border border-emerald-800/60 rounded-xl px-4 py-3 text-emerald-100 focus:ring-1 focus:ring-amber-400 focus:border-amber-400/50 outline-none transition-all placeholder-emerald-700/50"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <p className="text-xs text-emerald-600 mt-2 pl-1">Precise hour needed for accurate pillars.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-200/70 mb-2 tracking-wide uppercase text-xs">
            Birth Location
          </label>
          <input
            type="text"
            required
            placeholder="City, Country (e.g., Kyoto, Japan)"
            className="w-full bg-emerald-950/40 border border-emerald-800/60 rounded-xl px-4 py-3 text-emerald-100 focus:ring-1 focus:ring-amber-400 focus:border-amber-400/50 outline-none transition-all placeholder-emerald-700/50"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-200/70 mb-2 tracking-wide uppercase text-xs">
            Energy Polarity
          </label>
          <div className="flex space-x-4">
             <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-xl border transition-all font-semibold ${gender === 'male' ? 'bg-emerald-900/60 border-amber-500/60 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'bg-emerald-950/30 border-emerald-900 text-emerald-600 hover:bg-emerald-900/30'}`}
             >
                Yang / Male
             </button>
             <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-xl border transition-all font-semibold ${gender === 'female' ? 'bg-emerald-900/60 border-amber-500/60 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'bg-emerald-950/30 border-emerald-900 text-emerald-600 hover:bg-emerald-900/30'}`}
             >
                Yin / Female
             </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-50 font-bold py-4 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center border border-amber-500/20"
        >
          {isLoading ? (
             <span className="flex items-center gap-2">
               <svg className="animate-spin h-5 w-5 text-amber-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Aligning Stars...
             </span>
          ) : (
            "Reveal Destiny"
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;