/**
 * @fileoverview BFS-based pathfinding for stadium navigation.
 * Supports crowd-density-aware and wheelchair-accessible routing
 * over a zone adjacency graph.
 */

import type { StadiumZone, CrowdData, Route, RouteStep } from '../types';
import { CrowdDensity } from '../types';
import {
  STADIUM_ZONES,
  MINUTES_PER_ZONE,
  MINUTES_PER_ZONE_ACCESSIBLE,
} from '../constants';

/**
 * Builds an adjacency map from the flat zone list for O(1) lookups.
 * @param zones - The stadium zone definitions
 * @returns Map of zone ID to StadiumZone
 */
export function buildZoneMap(
  zones: readonly StadiumZone[] = STADIUM_ZONES
): Map<string, StadiumZone> {
  const map = new Map<string, StadiumZone>();
  for (const zone of zones) {
    map.set(zone.id, zone);
  }
  return map;
}

/**
 * Determines if a zone should be avoided during routing based on crowd density.
 * HIGH and CRITICAL density zones are avoided unless they are the start or end.
 * @param zoneId - The zone to check
 * @param crowdData - Current crowd density data
 * @returns Whether the zone should be avoided
 */
export function shouldAvoidZone(
  zoneId: string,
  crowdData: ReadonlyMap<string, CrowdData>
): boolean {
  const data = crowdData.get(zoneId);
  if (!data) return false;
  return (
    data.density === CrowdDensity.HIGH ||
    data.density === CrowdDensity.CRITICAL
  );
}

/**
 * Checks if a zone is wheelchair-accessible.
 * @param zoneId - The zone to check
 * @param zoneMap - Map of zone definitions
 * @returns Whether the zone supports wheelchair access
 */
export function isZoneAccessible(
  zoneId: string,
  zoneMap: ReadonlyMap<string, StadiumZone>
): boolean {
  const zone = zoneMap.get(zoneId);
  return zone?.wheelchairAccessible ?? false;
}

/**
 * Generates a human-readable instruction for a route step.
 * @param fromZone - The zone being departed
 * @param toZone - The zone being entered
 * @returns A navigation instruction string
 */
export function generateInstruction(
  fromZone: StadiumZone,
  toZone: StadiumZone
): string {
  return `Head from ${fromZone.name} to ${toZone.name}`;
}

/**
 * Finds the shortest path between two zones using Breadth-First Search.
 * The algorithm considers crowd density (avoids HIGH/CRITICAL zones)
 * and accessibility (filters to wheelchair-accessible zones when enabled).
 *
 * @param startId - Starting zone ID
 * @param endId - Destination zone ID
 * @param crowdData - Current crowd density data per zone
 * @param accessibilityMode - If true, only use wheelchair-accessible zones
 * @param zones - Stadium zone definitions (defaults to STADIUM_ZONES)
 * @returns A Route object with steps and timing, or null if no path exists
 *
 * @example
 * ```ts
 * const route = findShortestPath('gate-a', 'concourse-south', crowdData, false);
 * if (route) {
 *   console.log(`Route found: ${route.totalMinutes} minutes`);
 * }
 * ```
 */
export function findShortestPath(
  startId: string,
  endId: string,
  crowdData: ReadonlyMap<string, CrowdData>,
  accessibilityMode: boolean,
  zones: readonly StadiumZone[] = STADIUM_ZONES
): Route | null {
  const zoneMap = buildZoneMap(zones);

  // Validate start and end zones
  if (!zoneMap.has(startId) || !zoneMap.has(endId)) {
    return null;
  }

  // Same zone — no routing needed
  if (startId === endId) {
    return {
      steps: [],
      totalMinutes: 0,
      startZone: startId,
      endZone: endId,
      avoidedZones: [],
      isAccessible: accessibilityMode,
    };
  }

  // BFS
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue: string[] = [startId];
  visited.add(startId);
  const avoidedZones: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === endId) {
      // Reconstruct path
      const path: string[] = [];
      let node: string | undefined = endId;
      while (node !== undefined) {
        path.unshift(node);
        node = parent.get(node);
      }

      // Build route steps
      const minutesPerZone = accessibilityMode
        ? MINUTES_PER_ZONE_ACCESSIBLE
        : MINUTES_PER_ZONE;

      const steps: RouteStep[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        const fromZone = zoneMap.get(path[i])!;
        const toZone = zoneMap.get(path[i + 1])!;
        steps.push({
          zoneId: path[i + 1],
          instruction: generateInstruction(fromZone, toZone),
          estimatedMinutes: minutesPerZone,
        });
      }

      return {
        steps,
        totalMinutes: steps.length * minutesPerZone,
        startZone: startId,
        endZone: endId,
        avoidedZones,
        isAccessible: accessibilityMode,
      };
    }

    const currentZone = zoneMap.get(current);
    if (!currentZone) continue;

    for (const neighborId of currentZone.adjacentZones) {
      if (visited.has(neighborId)) continue;

      // Skip inaccessible zones in accessibility mode
      if (accessibilityMode && !isZoneAccessible(neighborId, zoneMap)) {
        continue;
      }

      // Skip high-density zones (unless it's the destination)
      if (
        neighborId !== endId &&
        shouldAvoidZone(neighborId, crowdData)
      ) {
        avoidedZones.push(neighborId);
        continue;
      }

      visited.add(neighborId);
      parent.set(neighborId, current);
      queue.push(neighborId);
    }
  }

  // No path found
  return null;
}

/**
 * Finds the nearest facility of a given type from a starting zone.
 * Uses BFS to search outward from the start zone.
 *
 * @param startId - Starting zone ID
 * @param facilityType - Type of facility to search for
 * @param crowdData - Current crowd density data
 * @param accessibilityMode - Whether to restrict to accessible zones
 * @param zones - Stadium zone definitions
 * @returns The route to the nearest facility, or null if none found
 */
export function findNearestFacility(
  startId: string,
  facilityType: string,
  crowdData: ReadonlyMap<string, CrowdData>,
  accessibilityMode: boolean,
  zones: readonly StadiumZone[] = STADIUM_ZONES
): Route | null {
  const zoneMap = buildZoneMap(zones);
  const startZone = zoneMap.get(startId);
  if (!startZone) return null;

  // Check if current zone has the facility
  if (startZone.facilities.includes(facilityType as never)) {
    return {
      steps: [],
      totalMinutes: 0,
      startZone: startId,
      endZone: startId,
      avoidedZones: [],
      isAccessible: accessibilityMode,
    };
  }

  // BFS to find nearest zone with the facility
  const visited = new Set<string>([startId]);
  const queue: string[] = [startId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const zone = zoneMap.get(current);
    if (!zone) continue;

    for (const neighborId of zone.adjacentZones) {
      if (visited.has(neighborId)) continue;
      visited.add(neighborId);

      const neighbor = zoneMap.get(neighborId);
      if (!neighbor) continue;

      if (accessibilityMode && !neighbor.wheelchairAccessible) continue;

      if (neighbor.facilities.includes(facilityType as never)) {
        return findShortestPath(startId, neighborId, crowdData, accessibilityMode, zones);
      }

      queue.push(neighborId);
    }
  }

  return null;
}
