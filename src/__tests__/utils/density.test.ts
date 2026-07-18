/**
 * @fileoverview Tests for crowd density utility functions.
 */
import { describe, it, expect } from 'vitest';
import {
  calculateDensityLevel,
  getDensityFromPercentage,
  getDensityLabel,
  getDensityBgColor,
  formatPercentage,
} from '../../utils/density';
import { CrowdDensity } from '../../types';

describe('calculateDensityLevel', () => {
  it('returns LOW for low occupancy', () => {
    expect(calculateDensityLevel(200, 1000)).toBe(CrowdDensity.LOW);
  });

  it('returns MEDIUM for moderate occupancy', () => {
    expect(calculateDensityLevel(600, 1000)).toBe(CrowdDensity.MEDIUM);
  });

  it('returns HIGH for high occupancy', () => {
    expect(calculateDensityLevel(800, 1000)).toBe(CrowdDensity.HIGH);
  });

  it('returns CRITICAL for near-full occupancy', () => {
    expect(calculateDensityLevel(950, 1000)).toBe(CrowdDensity.CRITICAL);
  });

  it('returns LOW for zero capacity', () => {
    expect(calculateDensityLevel(50, 0)).toBe(CrowdDensity.LOW);
  });
});

describe('getDensityFromPercentage', () => {
  it('classifies 30% as LOW', () => {
    expect(getDensityFromPercentage(30)).toBe(CrowdDensity.LOW);
  });

  it('classifies 50% as MEDIUM', () => {
    expect(getDensityFromPercentage(50)).toBe(CrowdDensity.MEDIUM);
  });

  it('classifies 80% as HIGH', () => {
    expect(getDensityFromPercentage(80)).toBe(CrowdDensity.HIGH);
  });

  it('classifies 95% as CRITICAL', () => {
    expect(getDensityFromPercentage(95)).toBe(CrowdDensity.CRITICAL);
  });
});

describe('getDensityLabel', () => {
  it('returns correct labels', () => {
    expect(getDensityLabel(CrowdDensity.LOW)).toBe('Low');
    expect(getDensityLabel(CrowdDensity.MEDIUM)).toBe('Moderate');
    expect(getDensityLabel(CrowdDensity.HIGH)).toBe('High');
    expect(getDensityLabel(CrowdDensity.CRITICAL)).toBe('Critical');
  });
});

describe('getDensityBgColor', () => {
  it('maps density levels to Tailwind bg classes', () => {
    expect(getDensityBgColor(CrowdDensity.LOW)).toBe('bg-success');
    expect(getDensityBgColor(CrowdDensity.MEDIUM)).toBe('bg-warning');
    expect(getDensityBgColor(CrowdDensity.HIGH)).toBe('bg-danger');
    expect(getDensityBgColor(CrowdDensity.CRITICAL)).toBe('bg-error');
  });
});

describe('formatPercentage', () => {
  it('formats normal percentage', () => {
    expect(formatPercentage(65.7)).toBe('66%');
  });

  it('clamps to 0%', () => {
    expect(formatPercentage(-5)).toBe('0%');
  });

  it('clamps to 100%', () => {
    expect(formatPercentage(150)).toBe('100%');
  });
});
