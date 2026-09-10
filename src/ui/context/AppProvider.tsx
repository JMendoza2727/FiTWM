// ============================================================
// FiTWM - App Provider
// ============================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppContext, AppState } from './AppContext';
import {
  UserProfile,
  NutritionGoals,
  DailySummary,
  FavoriteMeal,
  Meal,
  ThemeMode,
  AnalysisResult,
  AppScreen,
} from '@domain/types';
import { getProfile, saveProfile, getDailySummary, saveDailySummary, getFavoriteMeals, saveFavoriteMeal, getMeals, saveMeal } from '@storage/repository';

const defaultGoals: NutritionGoals = {
  kcal: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('hoy');

  // Profile
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [goals, setGoalsState] = useState<NutritionGoals>(defaultGoals);
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [metric, setMetricState] = useState(true);

  // Daily summary
  const [dailySummary, setDailySummaryState] = useState<DailySummary | null>(null);

  // Favorites
  const [favoriteMeals, setFavoriteMealsState] = useState<FavoriteMeal[]>([]);

  // Meals
  const [meals, setMealsState] = useState<Meal[]>([]);

  // Camera
  const [cameraImage, setCameraImageState] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResultState] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisErrorState] = useState<string | null>(null);

  // History
  const [historyDate, setHistoryDateState] = useState(formatDateLocal(new Date()));

  // Load initial data
  useEffect(() => {
    let mounted = true;

    async function load() {
      const p = await getProfile();
      const f = await getFavoriteMeals();
      const m = await getMeals();
      const today = formatDateLocal(new Date());
      const ds = await getDailySummary(today);

      if (mounted) {
        setProfileState(p);
        setFavoriteMealsState(f);
        setMealsState(m);
        setDailySummaryState(ds);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  // Theme resolution
  const resolvedTheme = useMemo<'light' | 'dark'>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  // Profile setters
  const setProfile = useCallback(async (p: UserProfile) => {
    setProfileState(p);
    await saveProfile(p);
  }, []);

  // Goals setter
  const setGoals = useCallback(async (g: NutritionGoals) => {
    setGoalsState(g);
  }, []);

  // Theme setter
  const setTheme = useCallback(async (t: ThemeMode) => {
    setThemeState(t);
    await saveProfile({
      ...(profile || { id: 'default', name: '', weight: null, createdAt: new Date().toISOString() }),
      updatedAt: new Date().toISOString(),
    });
  }, [profile]);

  // Metric setter
  const setMetric = useCallback(async (m: boolean) => {
    setMetricState(m);
  }, []);

  // Daily summary setter
  const setDailySummary = useCallback(async (s: DailySummary) => {
    setDailySummaryState(s);
    await saveDailySummary(s);
  }, []);

  // Favorite meals setter
  const setFavoriteMeals = useCallback(async (f: FavoriteMeal[]) => {
    setFavoriteMealsState(f);
    for (const fav of f) {
      await saveFavoriteMeal(fav);
    }
  }, []);

  // Meals setter
  const setMeals = useCallback(async (m: Meal[]) => {
    setMealsState(m);
    for (const meal of m) {
      await saveMeal(meal);
    }
  }, []);

  // Camera image setter
  const setCameraImage = useCallback((img: string | null) => {
    setCameraImageState(img);
  }, []);

  // Analysis result setter
  const setAnalysisResult = useCallback((r: AnalysisResult | null) => {
    setAnalysisResultState(r);
    setAnalysisErrorState(null);
  }, []);

  // Analysis error setter
  const setAnalysisError = useCallback((e: string | null) => {
    setAnalysisErrorState(e);
    setAnalysisResultState(null);
  }, []);

  // History date setter
  const setHistoryDate = useCallback((d: string) => {
    setHistoryDateState(d);
  }, []);

  const value: AppState = useMemo<AppState>(() => ({
    currentScreen,
    setCurrentScreen,
    profile,
    setProfile,
    goals,
    setGoals,
    theme,
    setTheme,
    resolvedTheme,
    metric,
    setMetric,
    dailySummary,
    setDailySummary,
    favoriteMeals,
    setFavoriteMeals,
    meals,
    setMeals,
    cameraImage,
    setCameraImage,
    isAnalyzing,
    setIsAnalyzing,
    analysisResult,
    setAnalysisResult,
    analysisError,
    setAnalysisError,
    historyDate,
    setHistoryDate,
  }), [
    currentScreen, profile, goals, theme, resolvedTheme, metric,
    dailySummary, favoriteMeals, meals, cameraImage, isAnalyzing,
    analysisResult, analysisError, historyDate,
    setProfile, setGoals, setTheme, setMetric, setDailySummary,
    setFavoriteMeals, setMeals, setCameraImage, setIsAnalyzing,
    setAnalysisResult, setAnalysisError, setHistoryDate,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function formatDateLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
