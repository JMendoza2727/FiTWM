// ============================================================
// FiTWM - FoodAnalysisProvider Interface
// ============================================================

import { AnalysisResult, MealType } from '@domain/types';

export interface IFoodAnalysisProvider {
  analyze(imageData: string, mealType: MealType): Promise<AnalysisResult>;
  getProviderName(): string;
}
