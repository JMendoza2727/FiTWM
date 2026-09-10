// ============================================================
// FiTWM - Domain Types
// ============================================================

export interface UserProfile {
  id: string;
  name: string;
  weight: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionGoals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  id: string;
  name: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number; // 0-1
}

export type MealType = 'desayuno' | 'comida' | 'cena' | 'snack';

export interface Meal {
  id: string;
  type: MealType;
  foods: FoodItem[];
  timestamp: string;
}

export interface MealAnalysis {
  meal: Meal;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  analyzedAt: string;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD local
  meals: MealAnalysis[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  updatedAt: string;
}

export interface FavoriteMeal {
  id: string;
  meal: Meal;
  mealAnalysis: MealAnalysis;
  savedAt: string;
  name: string;
}

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CameraState {
  status: AnalysisStatus;
  imageData: string | null;
  error: string | null;
}

export interface AnalysisResult {
  foods: FoodItem[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  confidence: number;
  isDemo: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type AppScreen = 'hoy' | 'camara' | 'historial' | 'perfil';
