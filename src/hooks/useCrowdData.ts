/**
 * @fileoverview Crowd data hook for real-time density monitoring.
 */

import { useState, useEffect, useCallback } from 'react';
import type { CrowdData } from '../types';
import { isFirebaseConfigured, subscribeToCrowdData, generateSimulatedCrowdData } from '../services';
import { createCrowdDataSubscription } from '../services';

/** Return type for the useCrowdData hook. */
export interface UseCrowdDataReturn {
  /** Current crowd data keyed by zone ID. */
  readonly crowdData: ReadonlyMap<string, CrowdData>;
  /** Whether data is from a live source (Firebase) vs simulated. */
  readonly isLive: boolean;
  /** Whether crowd data is still loading. */
  readonly loading: boolean;
  /** Manually refresh the crowd data. */
  readonly refresh: () => void;
}

/**
 * React hook for real-time crowd density data.
 * Uses Firebase Firestore when configured, falls back to simulated data.
 *
 * @returns Crowd data state and refresh function
 */
export function useCrowdData(): UseCrowdDataReturn {
  const [crowdData, setCrowdData] = useState<Map<string, CrowdData>>(new Map());
  const [loading, setLoading] = useState(true);
  const isLive = isFirebaseConfigured();

  useEffect(() => {
    let unsubscribe: () => void;

    if (isLive) {
      unsubscribe = subscribeToCrowdData((data) => {
        setCrowdData(data);
        setLoading(false);
      });
    } else {
      unsubscribe = createCrowdDataSubscription((data) => {
        setCrowdData(data);
        setLoading(false);
      });
    }

    return unsubscribe;
  }, [isLive]);

  const refresh = useCallback(() => {
    if (!isLive) {
      setCrowdData(generateSimulatedCrowdData());
    }
  }, [isLive]);

  return { crowdData, isLive, loading, refresh };
}
