import { GoogleGenAI, Type } from "@google/genai";
import { Solar } from "lunar-javascript";
import { BaZiResult, Pillar, UserInput } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Static Data for Mapping ---

const STEMS_INFO: Record<string, { element: string, polarity: string, natureImage: string }> = {
  '甲': { 
    element: 'Wood', polarity: 'Yang',
    natureImage: 'a single, massive Ancient Tree towering into the clouds, representing strength and growth'
  },
  '乙': { 
    element: 'Wood', polarity: 'Yin',
    natureImage: 'a lush garden of winding vines, flowers, and soft grass, representing flexibility and grace'
  },
  '丙': { 
    element: 'Fire', polarity: 'Yang',
    natureImage: 'the brilliant Sun shining high in the sky, illuminating a vast landscape'
  },
  '丁': { 
    element: 'Fire', polarity: 'Yin',
    natureImage: 'a mystical starlight night or a warm lantern glow in the darkness'
  },
  '戊': { 
    element: 'Earth', polarity: 'Yang',
    natureImage: 'a majestic, immovable Mountain peak touching the sky'
  },
  '己': { 
    element: 'Earth', polarity: 'Yin',
    natureImage: 'fertile soil, a flat plain or a nurtured garden bed'
  },
  '庚': { 
    element: 'Metal', polarity: 'Yang',
    natureImage: 'massive raw iron rocks, sharp cliffs, or a metallic weapon forged by nature'
  },
  '辛': { 
    element: 'Metal', polarity: 'Yin',
    natureImage: 'glittering gemstones embedded in rock, frost on leaves, or fine precious metal'
  },
  '壬': { 
    element: 'Water', polarity: 'Yang',
    natureImage: 'a wide, powerful rushing river or the deep ocean'
  },
  '癸': { 
    element: 'Water', polarity: 'Yin',
    natureImage: 'morning mist, dew drops on leaves, or a gentle rain shower'
  }
};

const BRANCHES_INFO: Record<string, { element: string, animal: string, description: string }> = {
  '子': { element: 'Water', animal: 'Rat', description: 'Midnight, cold water' },
  '丑': { element: 'Earth', animal: 'Ox', description: 'Frozen earth, icy tundra' },
  '寅': { element: 'Wood', animal: 'Tiger', description: 'Early spring forest' },
  '卯': { element: 'Wood', animal: 'Rabbit', description: 'Lush flowering grass' },
  '辰': { element: 'Earth', animal: 'Dragon', description: 'Wet swampy earth, reservoir' },
  '巳': { element: 'Fire', animal: 'Snake', description: 'Early summer heat' },
  '午': { element: 'Fire', animal: 'Horse', description: 'Peak noon fire' },
  '未': { element: 'Earth', animal: 'Goat', description: 'Hot dry earth, desert' },
  '申': { element: 'Metal', animal: 'Monkey', description: 'Hard metal ore' },
  '酉': { element: 'Metal', animal: 'Rooster', description: 'Refined jewelry metal' },
  '戌': { element: 'Earth', animal: 'Dog', description: 'Dry volcanic earth, sunset' },
  '亥': { element: 'Water', animal: 'Pig', description: 'Deep lake water' }
};

// --- Helper Functions ---

const createPillar = (ganZhi: string): Pillar => {
  const stem = ganZhi.substring(0, 1);
  const branch = ganZhi.substring(1, 2);
  
  const stemInfo = STEMS_INFO[stem] || { element: 'Unknown', polarity: '', natureImage: '' };
  const branchInfo = BRANCHES_INFO[branch] || { element: 'Unknown', animal: 'Unknown', description: '' };

  return {
    stem,
    branch,
    stemElement: stemInfo.element, // e.g. "Wood"
    branchElement: branchInfo.element,
    animal: branchInfo.animal
  };
};

const getElementCounts = (pillars: { year: Pillar, month: Pillar, day: Pillar, hour: Pillar }) => {
  const counts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  [pillars.year, pillars.month, pillars.day, pillars.hour].forEach(p => {
    if (counts[p.stemElement as keyof typeof counts] !== undefined) counts[p.stemElement as keyof typeof counts]++;
    if (counts[p.branchElement as keyof typeof counts] !== undefined) counts[p.branchElement as keyof typeof counts]++;
  });
  return counts;
};

/**
 * Calculates the BaZi locally using lunar-javascript for precision.
 */
const calculateBaZiLocal = (birthDateStr: string): { year: Pillar, month: Pillar, day: Pillar, hour: Pillar } => {
  const dateObj = new Date(birthDateStr);
  const solar = Solar.fromYmdHms(
    parseInt(birthDateStr.substring(0, 4)),
    parseInt(birthDateStr.substring(5, 7)),
    parseInt(birthDateStr.substring(8, 10)),
    parseInt(birthDateStr.substring(11, 13)),
    parseInt(birthDateStr.substring(14, 16)),
    0
  );

  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  eightChar.setSect(2);

  return {
    year: createPillar(eightChar.getYear()),
    month: createPillar(eightChar.getMonth()),
    day: createPillar(eightChar.getDay()),
    hour: createPillar(eightChar.getTime())
  };
};

/**
 * Analyzes the birth data to calculate BaZi and generate an image prompt.
 */
export const analyzeDestiny = async (birthDate: string, location: string, gender: 'male' | 'female'): Promise<BaZiResult> => {
  const model = 'gemini-2.5-flash';

  // 1. Calculate exact Pillars locally
  const pillars = calculateBaZiLocal(birthDate);
  
  // 2. Get Day Master info for the Spirit Image
  const dayStem = pillars.day.stem;
  const dayMasterInfo = STEMS_INFO[dayStem];
  const mainPhenomenon = dayMasterInfo.natureImage;

  // 3. Analyze Element Counts for Negative Prompting
  const counts = getElementCounts(pillars);
  
  let negativeConstraints = "NO HUMANS. NO CHARACTERS. NO FACES. NO FIGURES. NO ANIMALS. NO TEXT. LANDSCAPE ONLY.";
  if (counts.Wood === 0) negativeConstraints += " NO TREES, NO PLANTS, NO FLOWERS, NO GREEN COLORS. The landscape must be barren or rocky. ";
  if (counts.Water === 0) negativeConstraints += " NO OCEANS, NO LAKES, NO RIVERS, NO RAIN, NO BLUE LIQUIDS. Dry environment. ";
  if (counts.Fire === 0) negativeConstraints += " NO FIRE, NO FLAMES, NO SUN, NO RED/ORANGE GLOW. Cold lighting. ";
  if (counts.Metal === 0) negativeConstraints += " NO WEAPONS, NO GOLD, NO SILVER, NO METALLIC TEXTURES. ";
  if (counts.Earth === 0) negativeConstraints += " NO MOUNTAINS, NO ROCKS, NO GROUND. Floating or ethereal setting. ";

  // 4. Prepare Prompt
  const prompt = `
    You are a master of Chinese Metaphysics and Art History.
    
    I have calculated the BaZi chart for a ${gender} user born in ${location}.
    
    Chart:
    Year: ${pillars.year.stem}${pillars.year.branch} (${pillars.year.stemElement})
    Month: ${pillars.month.stem}${pillars.month.branch} (${pillars.month.stemElement})
    Day: ${pillars.day.stem}${pillars.day.branch} (Day Master: ${pillars.day.stemElement})
    Hour: ${pillars.hour.stem}${pillars.hour.branch} (${pillars.hour.stemElement})

    Element Counts: ${JSON.stringify(counts)}
    
    Task 1: Imagery Description (Prompt Engineering)
    Create a prompt for an AI image generator (Imagen).
    - **Subject**: A conceptual landscape representing the Day Master: ${mainPhenomenon}.
    - **Style**: "Mystical Oriental Landscape" with "Dunhuang" color palette. Keywords: Mineral pigments (malachite green, cinnabar red, ochre), gold leaf details, atmospheric depth, ethereal, dreamlike.
    - **Surroundings**: Depict the environment terrain based on the Month Branch (${BRANCHES_INFO[pillars.month.branch]?.description}) and the specific Earth branches present (Chen=Wet/Swamp, Xu=Dry/Fire, Chou=Frozen, Wei=Hot/Desert).
    - **Composition**: Panoramic view, no central character. The "Self" is the landscape itself.
    - **CRITICAL CONSTRAINTS**: ${negativeConstraints}

    Task 2: Interpretation
    Provide a poetic interpretation of this "Soul Landscape" and the energy it holds.

    Return JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      year: { type: Type.OBJECT, properties: { stem: {type: Type.STRING}, branch: {type: Type.STRING}, stemElement: {type: Type.STRING}, branchElement: {type: Type.STRING}, animal: {type: Type.STRING} } },
      month: { type: Type.OBJECT, properties: { stem: {type: Type.STRING}, branch: {type: Type.STRING}, stemElement: {type: Type.STRING}, branchElement: {type: Type.STRING}, animal: {type: Type.STRING} } },
      day: { type: Type.OBJECT, properties: { stem: {type: Type.STRING}, branch: {type: Type.STRING}, stemElement: {type: Type.STRING}, branchElement: {type: Type.STRING}, animal: {type: Type.STRING} } },
      hour: { type: Type.OBJECT, properties: { stem: {type: Type.STRING}, branch: {type: Type.STRING}, stemElement: {type: Type.STRING}, branchElement: {type: Type.STRING}, animal: {type: Type.STRING} } },
      imagePrompt: { type: Type.STRING },
      interpretation: { type: Type.STRING },
      elementalAnalysis: { type: Type.STRING }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const jsonResult = JSON.parse(text) as BaZiResult;

    return {
        ...jsonResult,
        year: pillars.year,
        month: pillars.month,
        day: pillars.day,
        hour: pillars.hour
    };

  } catch (error) {
    console.error("Error analyzing destiny:", error);
    throw error;
  }
};

/**
 * Generates the "Life Picture" using Imagen 3.
 */
export const generateDestinyImage = async (prompt: string): Promise<string> => {
  const model = 'imagen-4.0-generate-001'; 

  try {
    const response = await ai.models.generateImages({
      model: model,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4',
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
        throw new Error("Failed to generate image bytes");
    }
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};