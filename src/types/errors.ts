/**
 * @fileoverview Custom typed error hierarchy for FanFlow26.
 * All application errors extend the base AppError class,
 * providing consistent error codes and structured error handling.
 */

/**
 * Base application error class.
 * All custom errors in the application extend this class.
 * @property code - Machine-readable error code for programmatic handling
 */
export abstract class AppError extends Error {
  /** Machine-readable error code. */
  public readonly code: string;

  /**
   * Creates a new AppError.
   * @param message - Human-readable error description
   * @param code - Machine-readable error code
   */
  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when Gemini AI operations fail.
 * Includes timeout, API key missing, rate limiting, and general API errors.
 */
export class GeminiError extends AppError {
  /**
   * Creates a new GeminiError.
   * @param message - Description of the Gemini failure
   * @param code - Specific Gemini error code
   */
  constructor(
    message: string,
    code:
      | 'GEMINI_TIMEOUT'
      | 'GEMINI_API_KEY_MISSING'
      | 'GEMINI_RATE_LIMITED'
      | 'GEMINI_API_ERROR'
      | 'GEMINI_ABORTED' = 'GEMINI_API_ERROR'
  ) {
    super(message, code);
  }
}

/**
 * Error thrown when routing/pathfinding operations fail.
 * Includes unreachable destinations, invalid zones, and no-path scenarios.
 */
export class RoutingError extends AppError {
  /**
   * Creates a new RoutingError.
   * @param message - Description of the routing failure
   * @param code - Specific routing error code
   */
  constructor(
    message: string,
    code:
      | 'ROUTE_NOT_FOUND'
      | 'INVALID_ZONE'
      | 'ALL_PATHS_BLOCKED'
      | 'SAME_ZONE' = 'ROUTE_NOT_FOUND'
  ) {
    super(message, code);
  }
}

/**
 * Error thrown when input validation fails.
 * Includes empty inputs, length violations, and malicious content.
 */
export class ValidationError extends AppError {
  /**
   * Creates a new ValidationError.
   * @param message - Description of the validation failure
   * @param code - Specific validation error code
   */
  constructor(
    message: string,
    code:
      | 'INPUT_EMPTY'
      | 'INPUT_TOO_LONG'
      | 'INPUT_MALICIOUS'
      | 'INVALID_LANGUAGE' = 'INPUT_EMPTY'
  ) {
    super(message, code);
  }
}

/**
 * Error thrown when Firebase operations fail.
 * Includes auth failures, Firestore errors, and configuration issues.
 */
export class FirebaseServiceError extends AppError {
  /**
   * Creates a new FirebaseServiceError.
   * @param message - Description of the Firebase failure
   * @param code - Specific Firebase error code
   */
  constructor(
    message: string,
    code:
      | 'FIREBASE_AUTH_ERROR'
      | 'FIREBASE_FIRESTORE_ERROR'
      | 'FIREBASE_CONFIG_MISSING'
      | 'FIREBASE_PERMISSION_DENIED' = 'FIREBASE_AUTH_ERROR'
  ) {
    super(message, code);
  }
}
