// ============================================================
// FiTWM - FoodAnalysisProvider Factory
// ============================================================

import { IFoodAnalysisProvider } from './IFoodAnalysisProvider';
import { MockFoodAnalysisProvider } from './MockFoodAnalysisProvider';
import { RemoteFoodAnalysisProvider } from './RemoteFoodAnalysisProvider';

export function createAnalysisProvider(): IFoodAnalysisProvider {
  // V1: Always use Mock for demo purposes
  // V2: Switch based on environment or user preference
  const useRemote = import.meta.env.VITE_USE_REMOTE === 'true';

  if (useRemote) {
    return new RemoteFoodAnalysisProvider();
  }

  return new MockFoodAnalysisProvider();
}
