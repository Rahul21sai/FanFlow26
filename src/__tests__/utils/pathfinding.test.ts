/**
 * @fileoverview Tests for BFS pathfinding utility.
 * Covers shortest path, density avoidance, accessibility, and edge cases.
 */
import { describe, it, expect } from 'vitest';
import { findShortestPath, buildZoneMap, shouldAvoidZone, isZoneAccessible } from '../../utils/pathfinding';
import type { CrowdData, StadiumZone } from '../../types';
import { CrowdDensity, FacilityType } from '../../types';

/**
 * Minimal test zone graph:
 *   A -- B -- C
 *   |         |
 *   D ------- E
 */
const TEST_ZONES: StadiumZone[] = [
  { id: 'a', name: 'Zone A', adjacentZones: ['b', 'd'], wheelchairAccessible: true, facilities: [FacilityType.EXIT], capacity: 100, svgPath: '', labelPosition: { x: 0, y: 0 } },
  { id: 'b', name: 'Zone B', adjacentZones: ['a', 'c'], wheelchairAccessible: true, facilities: [], capacity: 100, svgPath: '', labelPosition: { x: 0, y: 0 } },
  { id: 'c', name: 'Zone C', adjacentZones: ['b', 'e'], wheelchairAccessible: true, facilities: [], capacity: 100, svgPath: '', labelPosition: { x: 0, y: 0 } },
  { id: 'd', name: 'Zone D', adjacentZones: ['a', 'e'], wheelchairAccessible: false, facilities: [], capacity: 100, svgPath: '', labelPosition: { x: 0, y: 0 } },
  { id: 'e', name: 'Zone E', adjacentZones: ['c', 'd'], wheelchairAccessible: true, facilities: [], capacity: 100, svgPath: '', labelPosition: { x: 0, y: 0 } },
];

const emptyCrowdData = new Map<string, CrowdData>();

function makeCrowdData(zoneId: string, density: CrowdDensity): CrowdData {
  return { zoneId, currentCount: 50, density, percentage: 50, lastUpdated: new Date() };
}

describe('findShortestPath', () => {
  it('finds shortest path between adjacent zones', () => {
    const route = findShortestPath('a', 'b', emptyCrowdData, false, TEST_ZONES);
    expect(route).not.toBeNull();
    expect(route!.steps).toHaveLength(1);
    expect(route!.steps[0].zoneId).toBe('b');
    expect(route!.startZone).toBe('a');
    expect(route!.endZone).toBe('b');
  });

  it('finds multi-hop shortest path correctly', () => {
    const route = findShortestPath('a', 'c', emptyCrowdData, false, TEST_ZONES);
    expect(route).not.toBeNull();
    expect(route!.steps).toHaveLength(2);
    expect(route!.steps[0].zoneId).toBe('b');
    expect(route!.steps[1].zoneId).toBe('c');
  });

  it('avoids HIGH density zones in path', () => {
    const crowdData = new Map<string, CrowdData>();
    crowdData.set('b', makeCrowdData('b', CrowdDensity.HIGH));

    const route = findShortestPath('a', 'c', crowdData, false, TEST_ZONES);
    expect(route).not.toBeNull();
    // Should route A -> D -> E -> C instead of A -> B -> C
    const zoneIds = route!.steps.map((s) => s.zoneId);
    expect(zoneIds).not.toContain('b');
    expect(route!.avoidedZones).toContain('b');
  });

  it('uses wheelchair-friendly edges when accessibility enabled', () => {
    // Zone D is NOT wheelchair accessible
    const route = findShortestPath('a', 'e', emptyCrowdData, true, TEST_ZONES);
    expect(route).not.toBeNull();
    // Should go A -> B -> C -> E instead of A -> D -> E (D is inaccessible)
    const zoneIds = route!.steps.map((s) => s.zoneId);
    expect(zoneIds).not.toContain('d');
    expect(route!.isAccessible).toBe(true);
  });

  it('returns empty route for same-zone routing', () => {
    const route = findShortestPath('a', 'a', emptyCrowdData, false, TEST_ZONES);
    expect(route).not.toBeNull();
    expect(route!.steps).toHaveLength(0);
    expect(route!.totalMinutes).toBe(0);
  });

  it('returns null for unreachable destination (invalid zone ID)', () => {
    const route = findShortestPath('a', 'nonexistent', emptyCrowdData, false, TEST_ZONES);
    expect(route).toBeNull();
  });

  it('correctly estimates route time', () => {
    const route = findShortestPath('a', 'c', emptyCrowdData, false, TEST_ZONES);
    expect(route).not.toBeNull();
    // 2 steps * 2 minutes per zone = 4 minutes
    expect(route!.totalMinutes).toBe(4);
  });

  it('returns null when all paths are blocked by high density', () => {
    const crowdData = new Map<string, CrowdData>();
    // Block all neighbors of 'a' except destination
    crowdData.set('b', makeCrowdData('b', CrowdDensity.CRITICAL));
    crowdData.set('d', makeCrowdData('d', CrowdDensity.CRITICAL));
    // 'e' is only reachable through 'b' or 'd', both blocked
    // But 'c' connects to 'e', so we check 'a' -> 'e' with all intermediate zones blocked
    const route = findShortestPath('a', 'e', crowdData, false, TEST_ZONES);
    // Both 'b' and 'd' are blocked, so 'e' is unreachable
    expect(route).toBeNull();
  });
});

describe('buildZoneMap', () => {
  it('creates correct map from zone array', () => {
    const map = buildZoneMap(TEST_ZONES);
    expect(map.size).toBe(5);
    expect(map.get('a')?.name).toBe('Zone A');
  });
});

describe('shouldAvoidZone', () => {
  it('returns true for HIGH density zones', () => {
    const crowdData = new Map<string, CrowdData>();
    crowdData.set('b', makeCrowdData('b', CrowdDensity.HIGH));
    expect(shouldAvoidZone('b', crowdData)).toBe(true);
  });

  it('returns false for LOW density zones', () => {
    const crowdData = new Map<string, CrowdData>();
    crowdData.set('b', makeCrowdData('b', CrowdDensity.LOW));
    expect(shouldAvoidZone('b', crowdData)).toBe(false);
  });
});

describe('isZoneAccessible', () => {
  it('returns true for wheelchair-accessible zones', () => {
    const map = buildZoneMap(TEST_ZONES);
    expect(isZoneAccessible('a', map)).toBe(true);
  });

  it('returns false for non-accessible zones', () => {
    const map = buildZoneMap(TEST_ZONES);
    expect(isZoneAccessible('d', map)).toBe(false);
  });
});
