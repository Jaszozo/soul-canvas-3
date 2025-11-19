export enum ElementType {
  Wood = 'Wood',
  Fire = 'Fire',
  Earth = 'Earth',
  Metal = 'Metal',
  Water = 'Water'
}

export enum Polarity {
  Yin = 'Yin',
  Yang = 'Yang'
}

export interface Pillar {
  stem: string; // Chinese character
  branch: string; // Chinese character
  stemElement: string;
  branchElement: string;
  animal: string; // Zodiac animal
}

export interface BaZiResult {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  imagePrompt: string; // The prompt used for image generation
  interpretation: string; // Poetic description
  elementalAnalysis: string; // Summary of dominant elements
}

export interface UserInput {
  birthDate: string; // ISO date string YYYY-MM-DDTHH:mm
  location: string;
  gender: 'male' | 'female';
}

export type LoadingState = 'idle' | 'analyzing' | 'painting' | 'complete' | 'error';
