/**
 * @fileoverview Routing hook for stadium navigation.
 */

import { useState, useCallback } from 'react';
import type { Route, CrowdData } from '../types';
import { findShortestPath, findNearestFacility } from '../utils';

/** Return type for the useRouting hook. */
export interface UseRoutingReturn {
  /** Currently active navigation route, or null. */
  readonly activeRoute: Route | null;
  /** Whether a route is currently being calculated. */
  readonly isCalculating: boolean;
  /** Calculate a route between two zones. */
  readonly calculateRoute: (from: string, to: string) => void;
  /** Find the nearest facility of a given type. */
  readonly findNearest: (from: string, facilityType: string) => void;
  /** Clear the current active route. */
  readonly clearRoute: () => void;
}

/**
 * React hook for stadium navigation and pathfinding.
 * Integrates with crowd data for density-aware routing
 * and supports accessibility mode for wheelchair-friendly paths.
 *
 * @param crowdData - Current crowd density data
 * @param accessibilityMode - Whether to force wheelchair-accessible routes
 * @returns Routing state and action functions
 */
export function useRouting(
  crowdData: ReadonlyMap<string, CrowdData>,
  accessibilityMode: boolean
): UseRoutingReturn {
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateRoute = useCallback((from: string, to: string) => {
    setIsCalculating(true);
    // Use requestAnimationFrame to avoid blocking UI
    requestAnimationFrame(() => {
      const route = findShortestPath(from, to, crowdData, accessibilityMode);
      setActiveRoute(route);
      setIsCalculating(false);
    });
  }, [crowdData, accessibilityMode]);

  const findNearest = useCallback((from: string, facilityType: string) => {
    setIsCalculating(true);
    requestAnimationFrame(() => {
      const route = findNearestFacility(from, facilityType, crowdData, accessibilityMode);
      setActiveRoute(route);
      setIsCalculating(false);
    });
  }, [crowdData, accessibilityMode]);

  const clearRoute = useCallback(() => {
    setActiveRoute(null);
  }, []);

  return { activeRoute, isCalculating, calculateRoute, findNearest, clearRoute };
}
