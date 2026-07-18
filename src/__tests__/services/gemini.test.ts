/**
 * @fileoverview Tests for Gemini AI service (fallback mode).
 */
import { describe, it, expect } from 'vitest';
import { getGeminiFallback } from '../../services/gemini';

describe('getGeminiFallback', () => {
  it('returns relevant response for exit queries', () => {
    const response = getGeminiFallback("Where's the nearest exit?");
    expect(response).toContain('exit');
    expect(response).toContain('Gate');
    expect(response.length).toBeGreaterThan(20);
  });

  it('returns relevant response for restroom queries', () => {
    const response = getGeminiFallback('I need to find a restroom');
    expect(response).toContain('Restroom');
    expect(response).toContain('concourse');
  });

  it('returns relevant response for medical queries', () => {
    const response = getGeminiFallback('Where is the medical station?');
    expect(response).toContain('medical');
    expect(response).toContain('South Concourse');
  });

  it('returns generic help response for unknown queries', () => {
    const response = getGeminiFallback('Tell me about quantum physics');
    expect(response).toContain('help you find');
    expect(response.length).toBeGreaterThan(20);
  });

  it('is case-insensitive in keyword matching', () => {
    const lower = getGeminiFallback('exit');
    const upper = getGeminiFallback('EXIT');
    const mixed = getGeminiFallback('Exit');
    expect(lower).toBe(upper);
    expect(lower).toBe(mixed);
  });

  it('returns wheelchair info for accessibility queries', () => {
    const response = getGeminiFallback('Is there wheelchair access?');
    expect(response).toContain('heelchair');
  });
});
