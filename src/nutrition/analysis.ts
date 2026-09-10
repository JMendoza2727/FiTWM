// ============================================================
// FiTWM - Nutrition Analysis Module
// ============================================================

import { FoodItem, AnalysisResult } from '@domain/types';

// Deterministic pseudo-random from seed for reproducibility
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// Mock food database for demo
const MOCK_FOODS = [
  { name: 'Pechuga de pollo a la plancha', kcal: 165, protein: 31, carbs: 0, fat: 3.6, per100g: true },
  { name: 'Arroz blanco cocido', kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, per100g: true },
  { name: 'Ensalada mixta', kcal: 25, protein: 1.5, carbs: 4, fat: 0.3, per100g: true },
  { name: 'Pasta con tomate', kcal: 150, protein: 5, carbs: 30, fat: 2, per100g: true },
  { name: 'Salmón al horno', kcal: 208, protein: 20, carbs: 0, fat: 13, per100g: true },
  { name: 'Pan integral', kcal: 247, protein: 13, carbs: 41, fat: 3.4, per100g: true },
  { name: 'Yogur natural', kcal: 61, protein: 3.5, carbs: 4.7, fat: 3.3, per100g: true },
  { name: 'Huevo cocido', kcal: 155, protein: 13, carbs: 1.1, fat: 11, per100g: true },
  { name: 'Aguacate', kcal: 160, protein: 2, carbs: 9, fat: 15, per100g: true },
  { name: 'Frutos secos mixtos', kcal: 607, protein: 20, carbs: 20, fat: 54, per100g: true },
  { name: 'Batata asada', kcal: 86, protein: 1.6, carbs: 20, fat: 0.1, per100g: true },
  { name: 'Sopa de verduras', kcal: 45, protein: 2, carbs: 7, fat: 1, per100g: true },
];

function generateMockFoods(imageSeed: number): FoodItem[] {
  const rand = seededRandom(imageSeed);
  const numFoods = 2 + Math.floor(rand() * 4); // 2-5 foods
  const foods: FoodItem[] = [];

  const shuffled = [...MOCK_FOODS].sort(() => rand() - 0.5);

  for (let i = 0; i < numFoods; i++) {
    const base = shuffled[i % shuffled.length];
    const grams = Math.round(50 + rand() * 250);
    const factor = grams / 100;
    const confidence = 0.55 + rand() * 0.4;

    foods.push({
      id: `food-${Date.now()}-${i}`,
      name: base.name,
      grams,
      kcal: Math.round(base.kcal * factor),
      protein: Math.round(base.protein * factor * 10) / 10,
      carbs: Math.round(base.carbs * factor * 10) / 10,
      fat: Math.round(base.fat * factor * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
    });
  }

  return foods;
}

export function analyzeImageMock(imageData: string): AnalysisResult {
  // Use hash of image data as seed for deterministic results
  let hash = 0;
  const str = imageData || '';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const foods = generateMockFoods(Math.abs(hash));

  const totalKcal = foods.reduce((sum, f) => sum + f.kcal, 0);
  const totalProtein = Math.round(foods.reduce((sum, f) => sum + f.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(foods.reduce((sum, f) => sum + f.carbs, 0) * 10) / 10;
  const totalFat = Math.round(foods.reduce((sum, f) => sum + f.fat, 0) * 10) / 10;
  const avgConfidence = Math.round((foods.reduce((sum, f) => sum + f.confidence, 0) / foods.length) * 100) / 100;

  return {
    foods,
    totalKcal,
    totalProtein,
    totalCarbs,
    totalFat,
    confidence: avgConfidence,
    isDemo: true,
  };
}
