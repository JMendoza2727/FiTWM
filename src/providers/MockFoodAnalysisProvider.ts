// ============================================================
// FiTWM - MockFoodAnalysisProvider
// ============================================================

import { IFoodAnalysisProvider } from './IFoodAnalysisProvider';
import { AnalysisResult, MealType } from '@domain/types';
import { analyzeImageMock } from '@nutrition/analysis';

export class MockFoodAnalysisProvider implements IFoodAnalysisProvider {
  getProviderName(): string {
    return 'Mock (Demo)';
  }

  async analyze(imageData: string, mealType: MealType): Promise<AnalysisResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return analyzeImageMock(imageData, mealType);
  }
}
