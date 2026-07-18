/**
 * @fileoverview Crowd data simulation service.
 * Generates realistic crowd density data for stadium zones when
 * Firebase is not configured. Also provides helpers for real-time subscriptions.
 */

import { CrowdDensity, type CrowdData } from '../types';
import { STADIUM_ZONES, CROWD_REFRESH_INTERVAL_MS } from '../constants';
import { calculateDensityLevel } from '../utils/density';

/**
 * Generates simulated crowd data for all stadium zones.
 * Creates realistic, varying density values for demonstration.
 * @returns Map of zone ID to CrowdData
 */
export function generateSimulatedCrowdData(): Map<string, CrowdData> {
  const dataMap = new Map<string, CrowdData>();
  const now = new Date();

  for (const zone of STADIUM_ZONES) {
    if (zone.capacity === 0) {
      dataMap.set(zone.id, {
        zoneId: zone.id,
        currentCount: 0,
        density: CrowdDensity.LOW,
        percentage: 0,
        lastUpdated: now,
      });
      continue;
    }

    // Generate realistic crowd numbers with some variation
    const baseLoad = getBaseLoad(zone.id);
    const variation = (Math.random() - 0.5) * 0.2;
    const loadFactor = Math.max(0, Math.min(1, baseLoad + variation));
    const currentCount = Math.round(zone.capacity * loadFactor);
    const percentage = Math.round((currentCount / zone.capacity) * 100);
    const density = calculateDensityLevel(currentCount, zone.capacity);

    dataMap.set(zone.id, {
      zoneId: zone.id,
      currentCount,
      density,
      percentage,
      lastUpdated: now,
    });
  }

  return dataMap;
}

/**
 * Returns a base crowd load factor (0–1) for a given zone.
 * Provides predetermined patterns for realistic simulation.
 * @param zoneId - The zone identifier
 * @returns Load factor between 0 and 1
 */
function getBaseLoad(zoneId: string): number {
  const loadMap: Readonly<Record<string, number>> = {
    'gate-a': 0.55,
    'gate-b': 0.45,
    'gate-c': 0.60,
    'gate-d': 0.85,  // Bottleneck gate (matches ops dashboard design)
    'concourse-north': 0.72,
    'concourse-east': 0.38,
    'concourse-south': 0.62,
    'concourse-west': 0.50,
    'section-100': 0.65,
    'section-101': 0.70,
    'section-102': 0.55,
    'section-103': 0.48,
    'section-104': 0.60,
    'section-105': 0.42,
    'section-106': 0.35,
    'section-107': 0.40,
    'plaza-north': 0.30,
  };

  return loadMap[zoneId] ?? 0.50;
}

/**
 * Creates an auto-refreshing crowd data subscription.
 * Updates crowd data at regular intervals with slight random variations.
 *
 * @param callback - Function called with updated crowd data map
 * @param intervalMs - Refresh interval in milliseconds (defaults to CROWD_REFRESH_INTERVAL_MS)
 * @returns Cleanup function to stop the refresh cycle
 */
export function createCrowdDataSubscription(
  callback: (data: Map<string, CrowdData>) => void,
  intervalMs: number = CROWD_REFRESH_INTERVAL_MS
): () => void {
  // Send initial data immediately
  callback(generateSimulatedCrowdData());

  const intervalId = setInterval(() => {
    callback(generateSimulatedCrowdData());
  }, intervalMs);

  return () => {
    clearInterval(intervalId);
  };
}
