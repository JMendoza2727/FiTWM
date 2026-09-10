// ============================================================
// FiTWM - App Context
// ============================================================

import { createContext, useContext } from 'react';
import {
  UserProfile,
  NutritionGoals,
  DailySummary,
  FavoriteMeal,
  Meal,
  FoodItem,
  MealType,
  AnalysisResult,
  ThemeMode,
  AppScreen,
} from '@domain/types';

export interface AppState {
  // Navigation
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;

  // Profile
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;

  // Goals
  goals: NutritionGoals;
  setGoals: (goals: NutritionGoals) => void;

  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';

  // Metric system
  metric: boolean;
  setMetric: (metric: boolean) => void;

  // Daily summary
  dailySummary: DailySummary | null;
  setDailySummary: (summary: DailySummary) => void;

  // Favorite meals
  favoriteMeals: FavoriteMeal[];
  setFavoriteMeals: (meals: FavoriteMeal[]) => void;

  // Meals
  meals: Meal[];
  setMeals: (meals: Meal[]) => void;

  // Camera state
  cameraImage: string | null;
  setCameraImage: (image: string | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  analysisError: string | null;
  setAnalysisError: (error: string | null) => void;

  // History
  historyDate: string;
  setHistoryDate: (date: string) => void;
}

const defaultGoals: NutritionGoals = {
  kcal: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
};

const defaultProfile: UserProfile = {
  id: 'default',
  name: '',
  weight: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const AppContext = createContext<AppState | null>(null);

export function useAppContext(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
