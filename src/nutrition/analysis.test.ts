// ============================================================
// FiTWM - Analysis Mock Tests
// ============================================================

import { describe, it, expect } from 'vitest';
import { analyzeImageMock } from '@nutrition/analysis';

describe('analyzeImageMock', () => {
  it('should return an AnalysisResult with foods', () => {
    const result = analyzeImageMock('test-image-data');
    expect(result).toBeDefined();
    expect(result.foods).toBeDefined();
    expect(Array.isArray(result.foods)).toBe(true);
    expect(result.foods.length).toBeGreaterThan(0);
  });

  it('should return deterministic results for the same input', () => {
    const result1 = analyzeImageMock('same-seed');
    const result2 = analyzeImageMock('same-seed');
    expect(result1.foods.length).toBe(result2.foods.length);
    expect(result1.totalKcal).toBe(result2.totalKcal);
  });

  it('should return different results for different input', () => {
    const result1 = analyzeImageMock('seed-a');
    const result2 = analyzeImageMock('seed-b');
    expect(result1.totalKcal).not.toBe(result2.totalKcal);
  });

  it('should have isDemo set to true', () => {
    const result = analyzeImageMock('test');
    expect(result.isDemo).toBe(true);
  });

  it('should have confidence between 0 and 1', () => {
    const result = analyzeImageMock('test');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});
