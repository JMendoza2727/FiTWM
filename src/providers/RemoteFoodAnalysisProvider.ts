// ============================================================
// FiTWM - RemoteFoodAnalysisProvider
// ============================================================

import { IFoodAnalysisProvider } from './IFoodAnalysisProvider';
import { AnalysisResult } from '@domain/types';

// Backend URL - configured via environment variable or default
const ANALYSIS_API_URL = import.meta.env.VITE_ANALYSIS_API_URL || '';

export class RemoteFoodAnalysisProvider implements IFoodAnalysisProvider {
  getProviderName(): string {
    return ANALYSIS_API_URL ? 'Remote API' : 'Remote (no configured)';
  }

  async analyze(imageData: string): Promise<AnalysisResult> {
    if (!ANALYSIS_API_URL) {
      throw new Error('Remote API URL not configured. Using mock analysis.');
    }

    // Convert base64 to blob for upload
    const base64Data = imageData.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    const formData = new FormData();
    formData.append('image', new Blob([byteArrays], { type: 'image/png' }), 'food.png');
    formData.append('mealType', 'comida');

    const response = await fetch(`${ANALYSIS_API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  }
}
