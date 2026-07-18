/**
 * @fileoverview Crowd density calculation and display utilities.
 * Converts raw crowd numbers into classified density levels with
 * associated colors and labels for the UI.
 */

import { CrowdDensity } from '../types';
import { CROWD_DENSITY_THRESHOLDS, DENSITY_COLORS, DENSITY_LABELS } from '../constants';

/**
 * Calculates the crowd density level based on occupancy percentage.
 * @param currentCount - Current number of people in the zone
 * @param capacity - Maximum capacity of the zone
 * @returns The classified CrowdDensity level
 *
 * @example
 * ```ts
 * const level = calculateDensityLevel(1500, 5000); // CrowdDensity.LOW
 * ```
 */
export function calculateDensityLevel(
  currentCount: number,
  capacity: number
): CrowdDensity {
  if (capacity <= 0) return CrowdDensity.LOW;
  const percentage = (currentCount / capacity) * 100;
  return getDensityFromPercentage(percentage);
}

/**
 * Converts a percentage value to a CrowdDensity enum value.
 * @param percentage - Occupancy percentage (0–100)
 * @returns The classified CrowdDensity level
 */
export function getDensityFromPercentage(percentage: number): CrowdDensity {
  if (percentage <= CROWD_DENSITY_THRESHOLDS.LOW_MAX) return CrowdDensity.LOW;
  if (percentage <= CROWD_DENSITY_THRESHOLDS.MEDIUM_MAX) return CrowdDensity.MEDIUM;
  if (percentage <= CROWD_DENSITY_THRESHOLDS.HIGH_MAX) return CrowdDensity.HIGH;
  return CrowdDensity.CRITICAL;
}

/**
 * Gets the Tailwind CSS color classes for a given density level.
 * Returns both text and background color classes.
 * @param level - The crowd density level
 * @returns Space-separated Tailwind color classes (e.g., "text-success bg-success")
 */
export function getDensityColor(level: CrowdDensity): string {
  return DENSITY_COLORS[level] ?? DENSITY_COLORS.LOW;
}

/**
 * Gets a human-readable label for a crowd density level.
 * @param level - The crowd density level
 * @returns Display label (e.g., "Low", "Moderate", "High", "Critical")
 */
export function getDensityLabel(level: CrowdDensity): string {
  return DENSITY_LABELS[level] ?? 'Unknown';
}

/**
 * Formats a decimal value as a display percentage string.
 * @param value - Value between 0 and 100
 * @returns Formatted string like "65%"
 */
export function formatPercentage(value: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return `${clamped}%`;
}

/**
 * Gets the background color class for a density bar fill.
 * @param level - The crowd density level
 * @returns Single Tailwind background color class
 */
export function getDensityBgColor(level: CrowdDensity): string {
  const colorMap: Readonly<Record<CrowdDensity, string>> = {
    [CrowdDensity.LOW]: 'bg-success',
    [CrowdDensity.MEDIUM]: 'bg-warning',
    [CrowdDensity.HIGH]: 'bg-danger',
    [CrowdDensity.CRITICAL]: 'bg-error',
  };
  return colorMap[level];
}

/**
 * Gets the text color class for a density percentage display.
 * @param level - The crowd density level
 * @returns Single Tailwind text color class
 */
export function getDensityTextColor(level: CrowdDensity): string {
  const colorMap: Readonly<Record<CrowdDensity, string>> = {
    [CrowdDensity.LOW]: 'text-success',
    [CrowdDensity.MEDIUM]: 'text-warning',
    [CrowdDensity.HIGH]: 'text-danger',
    [CrowdDensity.CRITICAL]: 'text-error',
  };
  return colorMap[level];
}
