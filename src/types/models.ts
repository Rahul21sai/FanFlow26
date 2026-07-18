/**
 * @fileoverview Domain model types for FanFlow26 stadium assistant.
 * Contains all interfaces, enums, and type aliases used across the application.
 */

/** Crowd density classification levels. */
export enum CrowdDensity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/** Types of facilities available in the stadium. */
export enum FacilityType {
  EXIT = 'EXIT',
  RESTROOM = 'RESTROOM',
  MEDICAL = 'MEDICAL',
  FOOD = 'FOOD',
  MERCHANDISE = 'MERCHANDISE',
  ELEVATOR = 'ELEVATOR',
  ACCESSIBLE_RESTROOM = 'ACCESSIBLE_RESTROOM',
  INFORMATION = 'INFORMATION',
}

/** Chat message sender role. */
export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
}

/** Severity levels for incidents. */
export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/** Status of a reported incident. */
export enum IncidentStatus {
  REPORTED = 'REPORTED',
  DISPATCHED = 'DISPATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  MONITORING = 'MONITORING',
}

/** Application view/page identifiers. */
export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  MAP = 'MAP',
  ASSISTANT = 'ASSISTANT',
  OPS = 'OPS',
  ACCESSIBILITY = 'ACCESSIBILITY',
  PROFILE = 'PROFILE',
}

/** Supported languages in the application. */
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'ar' | 'hi' | 'pt';

/**
 * Represents a zone within the stadium.
 * @property id - Unique zone identifier
 * @property name - Display name of the zone
 * @property adjacentZones - IDs of zones directly connected
 * @property wheelchairAccessible - Whether this zone has wheelchair access
 * @property facilities - Types of facilities available in this zone
 * @property capacity - Maximum number of people
 * @property svgPath - SVG path data for rendering on the map
 */
export interface StadiumZone {
  readonly id: string;
  readonly name: string;
  readonly adjacentZones: readonly string[];
  readonly wheelchairAccessible: boolean;
  readonly facilities: readonly FacilityType[];
  readonly capacity: number;
  readonly svgPath: string;
  readonly labelPosition: { readonly x: number; readonly y: number };
}

/**
 * Real-time crowd data for a stadium zone.
 * @property zoneId - ID of the stadium zone
 * @property currentCount - Current number of people
 * @property density - Calculated density level
 * @property percentage - Occupancy as a percentage (0-100)
 * @property lastUpdated - Timestamp of last data update
 */
export interface CrowdData {
  readonly zoneId: string;
  readonly currentCount: number;
  readonly density: CrowdDensity;
  readonly percentage: number;
  readonly lastUpdated: Date;
}

/**
 * A routing step in a navigation path.
 * @property zoneId - Zone this step passes through
 * @property instruction - Human-readable direction
 * @property estimatedMinutes - Estimated time for this step
 */
export interface RouteStep {
  readonly zoneId: string;
  readonly instruction: string;
  readonly estimatedMinutes: number;
}

/**
 * A complete route between two points in the stadium.
 * @property steps - Ordered list of routing steps
 * @property totalMinutes - Total estimated travel time
 * @property startZone - Starting zone ID
 * @property endZone - Destination zone ID
 * @property avoidedZones - Zones skipped due to high density
 * @property isAccessible - Whether this route is wheelchair-friendly
 */
export interface Route {
  readonly steps: readonly RouteStep[];
  readonly totalMinutes: number;
  readonly startZone: string;
  readonly endZone: string;
  readonly avoidedZones: readonly string[];
  readonly isAccessible: boolean;
}

/**
 * A facility located within the stadium.
 * @property id - Unique facility identifier
 * @property type - Category of the facility
 * @property name - Display name
 * @property zoneId - Zone where the facility is located
 * @property distance - Distance from reference point in meters
 * @property level - Floor/level number
 * @property accessible - Whether the facility is wheelchair-accessible
 */
export interface Facility {
  readonly id: string;
  readonly type: FacilityType;
  readonly name: string;
  readonly zoneId: string;
  readonly distance: number;
  readonly level: number;
  readonly accessible: boolean;
}

/**
 * A single chat message in the assistant conversation.
 * @property id - Unique message identifier
 * @property role - Who sent the message (user or assistant)
 * @property content - Message text content
 * @property timestamp - When the message was sent
 * @property language - Language code of the message
 */
export interface ChatMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly timestamp: Date;
  readonly language: SupportedLanguage;
}

/**
 * An incident reported within the stadium.
 * @property id - Unique incident identifier
 * @property title - Short description
 * @property description - Detailed description
 * @property severity - Severity classification
 * @property status - Current status
 * @property zoneId - Zone where incident occurred
 * @property reportedAt - Timestamp of report
 * @property icon - Material icon name for display
 */
export interface Incident {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly severity: IncidentSeverity;
  readonly status: IncidentStatus;
  readonly zoneId: string;
  readonly reportedAt: Date;
  readonly icon: string;
}

/**
 * User accessibility preferences.
 * @property highContrast - Enable high contrast mode
 * @property largeText - Enable large text mode
 * @property wheelchairRouting - Force wheelchair-accessible routes
 * @property screenReaderOptimized - Optimize for screen readers
 */
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  wheelchairRouting: boolean;
  screenReaderOptimized: boolean;
}

/**
 * User preferences stored in the application.
 * @property language - Selected UI language
 * @property accessibility - Accessibility settings
 * @property selectedStadium - Currently selected stadium ID
 */
export interface UserPreferences {
  language: SupportedLanguage;
  accessibility: AccessibilitySettings;
  selectedStadium: string;
}

/**
 * AI-generated suggestion for operations staff.
 * @property id - Unique suggestion identifier
 * @property title - Short action title
 * @property description - Detailed explanation
 * @property priority - Priority level (high triggers action required badge)
 * @property actionLabel - Label for the action button
 * @property createdAt - When the suggestion was generated
 */
export interface AiSuggestion {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly priority: 'low' | 'medium' | 'high';
  readonly actionLabel: string;
  readonly createdAt: Date;
}

/**
 * Result type for operations that can fail.
 * Enforces consistent error handling across the application.
 * @template T - The success value type
 * @template E - The error type (defaults to Error)
 */
export type Result<T, E extends Error = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

/**
 * Creates a successful Result.
 * @param value - The success value
 * @returns A successful Result wrapping the value
 */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/**
 * Creates a failed Result.
 * @param error - The error value
 * @returns A failed Result wrapping the error
 */
export function err<E extends Error>(error: E): Result<never, E> {
  return { ok: false, error };
}
