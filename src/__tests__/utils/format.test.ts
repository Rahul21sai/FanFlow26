/**
 * @fileoverview Tests for general formatting utility functions.
 */
import { describe, it, expect } from 'vitest';
import { formatTime, formatDistance, truncateText, generateId, capitalize } from '../../utils/format';

describe('formatTime', () => {
  it('formats minutes correctly', () => {
    expect(formatTime(4)).toBe('4 mins');
    expect(formatTime(1)).toBe('1 min');
  });

  it('formats hours and minutes', () => {
    expect(formatTime(90)).toBe('1 hr 30 mins');
    expect(formatTime(120)).toBe('2 hrs');
  });

  it('handles zero', () => {
    expect(formatTime(0)).toBe('0 mins');
  });

  it('handles negative values', () => {
    expect(formatTime(-5)).toBe('0 mins');
  });
});

describe('formatDistance', () => {
  it('formats meters correctly', () => {
    expect(formatDistance(20)).toBe('20m');
    expect(formatDistance(999)).toBe('999m');
  });

  it('formats kilometers', () => {
    expect(formatDistance(1500)).toBe('1.5 km');
    expect(formatDistance(2000)).toBe('2.0 km');
  });

  it('handles zero and negative', () => {
    expect(formatDistance(0)).toBe('0m');
    expect(formatDistance(-10)).toBe('0m');
  });
});

describe('truncateText', () => {
  it('returns full text when under limit', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('truncates with ellipsis when over limit', () => {
    const result = truncateText('This is a very long text', 15);
    expect(result).toBe('This is a ve...');
    expect(result.length).toBe(15);
  });

  it('handles zero maxLength', () => {
    expect(truncateText('Hello', 0)).toBe('');
  });

  it('handles exact length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });
});

describe('generateId', () => {
  it('creates unique IDs with prefix', () => {
    const id1 = generateId('msg');
    const id2 = generateId('msg');
    expect(id1).toMatch(/^msg-/);
    expect(id2).toMatch(/^msg-/);
    // IDs should be unique even when generated close together
    expect(id1).not.toBe(id2);
  });
});

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });
});
