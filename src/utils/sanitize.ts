/**
 * @fileoverview Input sanitization and validation utilities.
 * Protects against XSS, injection attacks, and malformed input.
 */

import { ValidationError } from '../types';
import { MAX_MESSAGE_LENGTH } from '../constants';

/**
 * Strips HTML tags from user input to prevent XSS attacks.
 * @param input - Raw user input string
 * @returns Sanitized string with all HTML tags removed
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Escapes special HTML characters for safe display.
 * @param text - Text to escape
 * @returns Text with HTML entities escaped
 */
export function escapeForDisplay(text: string): string {
  const escapeMap: Readonly<Record<string, string>> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return text.replace(/[&<>"']/g, (char) => escapeMap[char] ?? char);
}

/**
 * Result of a chat message validation check.
 * @property isValid - Whether the message passed validation
 * @property sanitizedValue - The cleaned/sanitized message text
 * @property error - Validation error if isValid is false
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly sanitizedValue: string;
  readonly error?: ValidationError;
}

/**
 * Validates a chat message for length, content, and safety.
 * @param message - The raw message to validate
 * @returns Validation result with sanitized value or error
 *
 * @example
 * ```ts
 * const result = validateChatMessage(userInput);
 * if (result.isValid) {
 *   sendMessage(result.sanitizedValue);
 * } else {
 *   showError(result.error.message);
 * }
 * ```
 */
export function validateChatMessage(message: string): ValidationResult {
  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      sanitizedValue: '',
      error: new ValidationError('Message cannot be empty', 'INPUT_EMPTY'),
    };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      sanitizedValue: '',
      error: new ValidationError(
        `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
        'INPUT_TOO_LONG'
      ),
    };
  }

  const sanitized = sanitizeInput(trimmed);

  // Check if sanitization significantly changed the input (possible attack)
  if (sanitized.length < trimmed.length * 0.5 && trimmed.length > 10) {
    return {
      isValid: false,
      sanitizedValue: '',
      error: new ValidationError(
        'Message contains suspicious content',
        'INPUT_MALICIOUS'
      ),
    };
  }

  return {
    isValid: true,
    sanitizedValue: sanitized,
  };
}
