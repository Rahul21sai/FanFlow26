/**
 * @fileoverview Tests for useRouting hook.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRouting } from '../../hooks/useRouting';
import type { CrowdData } from '../../types';

const emptyCrowdData = new Map<string, CrowdData>();

describe('useRouting', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame for testing
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  it('calculates a route and returns steps', async () => {
    const { result } = renderHook(() => useRouting(emptyCrowdData, false));

    act(() => {
      result.current.calculateRoute('gate-a', 'concourse-south');
    });

    await waitFor(() => {
      expect(result.current.activeRoute).not.toBeNull();
    });

    expect(result.current.activeRoute!.startZone).toBe('gate-a');
    expect(result.current.activeRoute!.endZone).toBe('concourse-south');
    expect(result.current.activeRoute!.steps.length).toBeGreaterThan(0);
  });

  it('clears the active route', async () => {
    const { result } = renderHook(() => useRouting(emptyCrowdData, false));

    act(() => {
      result.current.calculateRoute('gate-a', 'concourse-north');
    });

    await waitFor(() => {
      expect(result.current.activeRoute).not.toBeNull();
    });

    act(() => {
      result.current.clearRoute();
    });

    expect(result.current.activeRoute).toBeNull();
  });
});
