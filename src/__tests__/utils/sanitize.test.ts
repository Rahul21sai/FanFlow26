/**
 * @fileoverview Tests for input sanitization and validation utilities.
 */
import { describe, it, expect } from 'vitest';
import { sanitizeInput, escapeForDisplay, validateChatMessage } from '../../utils/sanitize';

describe('sanitizeInput', () => {
  it('strips script tags completely', () => {
    const input = 'Hello <script>alert("xss")</script> world';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello  world');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('strips all HTML tags', () => {
    const input = '<b>Bold</b> and <em>italic</em> and <div>div</div>';
    const result = sanitizeInput(input);
    expect(result).toBe('Bold and italic and div');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('preserves safe text content', () => {
    const input = 'Where is the nearest exit?';
    const result = sanitizeInput(input);
    expect(result).toBe('Where is the nearest exit?');
  });

  it('trims whitespace', () => {
    const input = '  Hello world  ';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello world');
  });
});

describe('validateChatMessage', () => {
  it('validates a normal message successfully', () => {
    const result = validateChatMessage('Where is the nearest restroom?');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedValue).toBe('Where is the nearest restroom?');
    expect(result.error).toBeUndefined();
  });

  it('rejects empty messages', () => {
    const result = validateChatMessage('   ');
    expect(result.isValid).toBe(false);
    expect(result.error?.code).toBe('INPUT_EMPTY');
  });

  it('rejects messages exceeding maximum length', () => {
    const longMessage = 'a'.repeat(1001);
    const result = validateChatMessage(longMessage);
    expect(result.isValid).toBe(false);
    expect(result.error?.code).toBe('INPUT_TOO_LONG');
  });

  it('detects suspicious content with excessive HTML', () => {
    const malicious = '<div><div><div><div><div>x</div></div></div></div></div>';
    const result = validateChatMessage(malicious);
    expect(result.isValid).toBe(false);
    expect(result.error?.code).toBe('INPUT_MALICIOUS');
  });

  it('accepts messages at exactly the length limit', () => {
    const exactMessage = 'a'.repeat(1000);
    const result = validateChatMessage(exactMessage);
    expect(result.isValid).toBe(true);
  });
});

describe('escapeForDisplay', () => {
  it('escapes HTML special characters', () => {
    const result = escapeForDisplay('<script>alert("xss")</script>');
    expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('escapes ampersands', () => {
    expect(escapeForDisplay('A & B')).toBe('A &amp; B');
  });
});
