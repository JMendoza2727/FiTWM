// ============================================================
// FiTWM - Storage Repository
// ============================================================

import { dbService } from './indexeddb';
import {
  UserProfile,
  DailySummary,
  FavoriteMeal,
  Meal,
} from '@domain/types';

const STORES = {
  PROFILE: 'profiles',
  DAILY_SUMMARIES: 'dailySummaries',
  FAVORITE_MEALS: 'favoriteMeals',
  MEALS: 'meals',
} as const;

// Profile
export async function getProfile(): Promise<UserProfile | null> {
  try {
    const profile = await dbService.get<UserProfile>(STORES.PROFILE, 'default');
    return profile ?? null;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await dbService.put(STORES.PROFILE, profile);
}

// Daily Summary
export async function getDailySummary(date: string): Promise<DailySummary | null> {
  try {
    const summary = await dbService.get<DailySummary>(STORES.DAILY_SUMMARIES, date);
    return summary ?? null;
  } catch {
    return null;
  }
}

export async function saveDailySummary(summary: DailySummary): Promise<void> {
  await dbService.put(STORES.DAILY_SUMMARIES, summary);
}

export async function getAllDailySummaries(): Promise<DailySummary[]> {
  try {
    return await dbService.getAll<DailySummary>(STORES.DAILY_SUMMARIES);
  } catch {
    return [];
  }
}

export async function deleteDailySummary(date: string): Promise<void> {
  await dbService.delete(STORES.DAILY_SUMMARIES, date);
}

// Favorite Meal
export async function getFavoriteMeals(): Promise<FavoriteMeal[]> {
  try {
    return await dbService.getAll<FavoriteMeal>(STORES.FAVORITE_MEALS);
  } catch {
    return [];
  }
}

export async function saveFavoriteMeal(favorite: FavoriteMeal): Promise<void> {
  await dbService.put(STORES.FAVORITE_MEALS, favorite);
}

export async function deleteFavoriteMeal(id: string): Promise<void> {
  await dbService.delete(STORES.FAVORITE_MEALS, id);
}

// Meals
export async function getMeals(): Promise<Meal[]> {
  try {
    return await dbService.getAll<Meal>(STORES.MEALS);
  } catch {
    return [];
  }
}

export async function saveMeal(meal: Meal): Promise<void> {
  await dbService.put(STORES.MEALS, meal);
}

export async function deleteMeal(id: string): Promise<void> {
  await dbService.delete(STORES.MEALS, id);
}
