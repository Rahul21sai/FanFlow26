/**
 * @fileoverview Application constants for FanFlow26.
 * Contains all magic numbers, strings, configuration values,
 * and the stadium zone adjacency graph used for pathfinding.
 */

import { type StadiumZone, type SupportedLanguage, FacilityType } from '../types';

// ─── Gemini AI Configuration ─────────────────────────────────────────────────

/** The Gemini model to use for chat completions. */
export const GEMINI_MODEL_NAME = 'gemini-1.5-flash' as const;

/** Timeout in milliseconds for Gemini API requests. */
export const GEMINI_TIMEOUT_MS = 15_000;

/** Maximum number of chat messages to retain in history. */
export const MAX_CHAT_HISTORY = 50;

/** Maximum allowed length for a single chat message. */
export const MAX_MESSAGE_LENGTH = 1_000;

/** System prompt injected into all Gemini conversations. */
export const GEMINI_SYSTEM_PROMPT = `You are FanFlow26 AI, a helpful multilingual stadium assistant for the FIFA World Cup 2026. 
You help fans navigate the stadium, find facilities (restrooms, exits, medical stations, food, merchandise), 
understand crowd conditions, and get accessibility information. 
You are friendly, concise, and safety-conscious. 
Always prioritize fan safety in your recommendations. 
If asked about crowd density, suggest less crowded alternatives.
If the user seems to need medical help, always recommend visiting the nearest medical station.
Respond in the same language the user writes in.` as const;

// ─── Crowd Density Thresholds ────────────────────────────────────────────────

/** Threshold values for classifying crowd density (as percentage 0–100). */
export const CROWD_DENSITY_THRESHOLDS = {
  /** Below this value = LOW density. */
  LOW_MAX: 40,
  /** Below this value = MEDIUM density. */
  MEDIUM_MAX: 70,
  /** Below this value = HIGH density. */
  HIGH_MAX: 90,
  /** At or above HIGH_MAX = CRITICAL density. */
} as const;

/** Time in milliseconds between crowd data refresh cycles. */
export const CROWD_REFRESH_INTERVAL_MS = 30_000;

// ─── Routing Constants ───────────────────────────────────────────────────────

/** Estimated minutes to traverse one zone on foot. */
export const MINUTES_PER_ZONE = 2;

/** Estimated minutes to traverse one zone in wheelchair. */
export const MINUTES_PER_ZONE_ACCESSIBLE = 3;

/** Penalty multiplier applied to HIGH density zones during routing. */
export const HIGH_DENSITY_PENALTY = 999;

// ─── UI Constants ────────────────────────────────────────────────────────────

/** Animation duration for page transitions in milliseconds. */
export const PAGE_TRANSITION_MS = 300;

/** Chat message fade-in animation delay increment in milliseconds. */
export const MESSAGE_ANIMATION_DELAY_MS = 100;

/** Minimum touch target size in pixels (WCAG 2.5.5). */
export const MIN_TOUCH_TARGET_PX = 44;

// ─── Supported Languages ─────────────────────────────────────────────────────

/** All languages supported by the application with display metadata. */
export const SUPPORTED_LANGUAGES: readonly {
  readonly code: SupportedLanguage;
  readonly name: string;
  readonly nativeName: string;
  readonly flag: string;
  readonly dir: 'ltr' | 'rtl';
}[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr' },
] as const;

// ─── Stadium Zone Graph ──────────────────────────────────────────────────────

/**
 * Complete definition of all stadium zones including adjacency graph,
 * facilities, capacities, and SVG rendering data.
 * This serves as the source of truth for the interactive map and pathfinding.
 */
export const STADIUM_ZONES: readonly StadiumZone[] = [
  {
    id: 'gate-a',
    name: 'Gate A (North)',
    adjacentZones: ['concourse-north', 'gate-b', 'plaza-north'],
    wheelchairAccessible: true,
    facilities: [FacilityType.EXIT, FacilityType.INFORMATION],
    capacity: 2000,
    svgPath: 'M 150 40 L 250 40 L 260 80 L 140 80 Z',
    labelPosition: { x: 200, y: 60 },
  },
  {
    id: 'gate-b',
    name: 'Gate B (East)',
    adjacentZones: ['concourse-east', 'gate-a', 'gate-c'],
    wheelchairAccessible: true,
    facilities: [FacilityType.EXIT, FacilityType.MERCHANDISE],
    capacity: 2000,
    svgPath: 'M 360 150 L 400 150 L 400 250 L 360 250 Z',
    labelPosition: { x: 380, y: 200 },
  },
  {
    id: 'gate-c',
    name: 'Gate C (South)',
    adjacentZones: ['concourse-south', 'gate-b', 'gate-d'],
    wheelchairAccessible: true,
    facilities: [FacilityType.EXIT, FacilityType.FOOD],
    capacity: 2000,
    svgPath: 'M 150 360 L 250 360 L 260 400 L 140 400 Z',
    labelPosition: { x: 200, y: 380 },
  },
  {
    id: 'gate-d',
    name: 'Gate D (West)',
    adjacentZones: ['concourse-west', 'gate-c', 'gate-a'],
    wheelchairAccessible: true,
    facilities: [FacilityType.EXIT],
    capacity: 2000,
    svgPath: 'M 0 150 L 40 150 L 40 250 L 0 250 Z',
    labelPosition: { x: 20, y: 200 },
  },
  {
    id: 'concourse-north',
    name: 'North Concourse',
    adjacentZones: ['gate-a', 'concourse-east', 'concourse-west', 'section-100', 'section-101'],
    wheelchairAccessible: true,
    facilities: [FacilityType.RESTROOM, FacilityType.FOOD, FacilityType.ELEVATOR],
    capacity: 5000,
    svgPath: 'M 100 80 L 300 80 L 320 140 L 80 140 Z',
    labelPosition: { x: 200, y: 110 },
  },
  {
    id: 'concourse-east',
    name: 'East Concourse',
    adjacentZones: ['gate-b', 'concourse-north', 'concourse-south', 'section-102', 'section-103'],
    wheelchairAccessible: true,
    facilities: [FacilityType.RESTROOM, FacilityType.MERCHANDISE],
    capacity: 4000,
    svgPath: 'M 300 100 L 360 100 L 360 300 L 300 300 Z',
    labelPosition: { x: 330, y: 200 },
  },
  {
    id: 'concourse-south',
    name: 'South Concourse',
    adjacentZones: ['gate-c', 'concourse-east', 'concourse-west', 'section-104', 'section-105'],
    wheelchairAccessible: true,
    facilities: [FacilityType.RESTROOM, FacilityType.FOOD, FacilityType.MEDICAL],
    capacity: 5000,
    svgPath: 'M 80 280 L 320 280 L 300 340 L 100 340 Z',
    labelPosition: { x: 200, y: 310 },
  },
  {
    id: 'concourse-west',
    name: 'West Concourse',
    adjacentZones: ['gate-d', 'concourse-north', 'concourse-south', 'section-106', 'section-107'],
    wheelchairAccessible: false,
    facilities: [FacilityType.RESTROOM, FacilityType.FOOD],
    capacity: 4000,
    svgPath: 'M 40 100 L 100 100 L 100 300 L 40 300 Z',
    labelPosition: { x: 70, y: 200 },
  },
  {
    id: 'section-100',
    name: 'Section 100',
    adjacentZones: ['concourse-north', 'section-101', 'field'],
    wheelchairAccessible: true,
    facilities: [FacilityType.ACCESSIBLE_RESTROOM],
    capacity: 3000,
    svgPath: 'M 120 140 L 200 140 L 190 200 L 130 200 Z',
    labelPosition: { x: 160, y: 170 },
  },
  {
    id: 'section-101',
    name: 'Section 101',
    adjacentZones: ['concourse-north', 'section-100', 'section-102', 'field'],
    wheelchairAccessible: true,
    facilities: [],
    capacity: 3000,
    svgPath: 'M 200 140 L 280 140 L 270 200 L 190 200 Z',
    labelPosition: { x: 240, y: 170 },
  },
  {
    id: 'section-102',
    name: 'Section 102',
    adjacentZones: ['concourse-east', 'section-101', 'section-103', 'field'],
    wheelchairAccessible: true,
    facilities: [],
    capacity: 3000,
    svgPath: 'M 270 160 L 300 160 L 300 220 L 260 220 Z',
    labelPosition: { x: 280, y: 190 },
  },
  {
    id: 'section-103',
    name: 'Section 103',
    adjacentZones: ['concourse-east', 'section-102', 'section-104', 'field'],
    wheelchairAccessible: false,
    facilities: [],
    capacity: 3000,
    svgPath: 'M 260 220 L 300 220 L 300 280 L 270 280 Z',
    labelPosition: { x: 280, y: 250 },
  },
  {
    id: 'section-104',
    name: 'Section 104',
    adjacentZones: ['concourse-south', 'section-103', 'section-105', 'field'],
    wheelchairAccessible: true,
    facilities: [],
    capacity: 3000,
    svgPath: 'M 200 260 L 280 260 L 270 300 L 190 300 Z',
    labelPosition: { x: 240, y: 280 },
  },
  {
    id: 'section-105',
    name: 'Section 105',
    adjacentZones: ['concourse-south', 'section-104', 'section-106', 'field'],
    wheelchairAccessible: true,
    facilities: [FacilityType.ACCESSIBLE_RESTROOM],
    capacity: 3000,
    svgPath: 'M 120 260 L 200 260 L 190 300 L 130 300 Z',
    labelPosition: { x: 160, y: 280 },
  },
  {
    id: 'section-106',
    name: 'Section 106',
    adjacentZones: ['concourse-west', 'section-105', 'section-107', 'field'],
    wheelchairAccessible: false,
    facilities: [],
    capacity: 3000,
    svgPath: 'M 100 220 L 140 220 L 130 280 L 100 280 Z',
    labelPosition: { x: 120, y: 250 },
  },
  {
    id: 'section-107',
    name: 'Section 107',
    adjacentZones: ['concourse-west', 'section-106', 'section-100', 'field'],
    wheelchairAccessible: false,
    facilities: [],
    capacity: 3000,
    svgPath: 'M 100 160 L 140 160 L 130 220 L 100 220 Z',
    labelPosition: { x: 120, y: 190 },
  },
  {
    id: 'field',
    name: 'Playing Field',
    adjacentZones: ['section-100', 'section-101', 'section-102', 'section-103', 'section-104', 'section-105', 'section-106', 'section-107'],
    wheelchairAccessible: false,
    facilities: [],
    capacity: 0,
    svgPath: 'M 150 180 L 250 180 L 250 260 L 150 260 Z',
    labelPosition: { x: 200, y: 220 },
  },
  {
    id: 'plaza-north',
    name: 'North Plaza (Outside)',
    adjacentZones: ['gate-a'],
    wheelchairAccessible: true,
    facilities: [FacilityType.FOOD, FacilityType.MERCHANDISE, FacilityType.INFORMATION],
    capacity: 10000,
    svgPath: 'M 120 0 L 280 0 L 270 40 L 130 40 Z',
    labelPosition: { x: 200, y: 20 },
  },
] as const;

// ─── Fallback Responses (used when Gemini is unavailable) ────────────────────

/**
 * Keyword-to-response map for the rule-based fallback assistant.
 * Keys are lowercase keywords; values are helpful responses.
 */
export const FALLBACK_RESPONSES: Readonly<Record<string, string>> = {
  exit: 'The nearest exits are at Gate A (North), Gate B (East), Gate C (South), and Gate D (West). Check the stadium map for the closest one to your current location.',
  restroom: 'Restrooms are located at each concourse level. Accessible restrooms are available at Section 100 and Section 105. Check the map for the nearest one.',
  bathroom: 'Restrooms are located at each concourse level. Accessible restrooms are available at Section 100 and Section 105. Check the map for the nearest one.',
  medical: 'The medical station is located at the South Concourse near Gate C. If this is an emergency, please alert the nearest staff member immediately.',
  emergency: 'For emergencies, please alert the nearest staff member or security personnel immediately. The medical station is at the South Concourse near Gate C.',
  food: 'Food concessions are available at the North Concourse, South Concourse, West Concourse, and the North Plaza outside Gate A.',
  drink: 'Beverages are available at all food concession areas on every concourse level.',
  merch: 'The merchandise store is at Gate B (East Concourse) and the North Plaza outside. Beat the queues by visiting before the match starts!',
  merchandise: 'The merchandise store is at Gate B (East Concourse) and the North Plaza outside. Beat the queues by visiting before the match starts!',
  wheelchair: 'Wheelchair-accessible routes are available through Gates A, B, and C. Elevators are located at the North Concourse. Enable wheelchair routing in Accessibility Settings for step-free paths.',
  accessible: 'Accessible facilities include elevators at the North Concourse, accessible restrooms at Sections 100 and 105, and wheelchair-friendly routes through Gates A, B, and C.',
  seat: 'Your seat information is on your ticket. Use the interactive map to locate your section and find the best route from your nearest gate.',
  parking: 'Parking areas are located outside the North and South gates. Follow the marked pedestrian paths to the stadium entrance.',
  wifi: 'Free Wi-Fi is available throughout the stadium. Connect to "FIFA2026-FanZone" network.',
  lost: 'If you have lost an item, please visit the Information desk at Gate A or the North Plaza. Staff will help you locate your belongings.',
  help: 'I can help you find exits, restrooms, medical stations, food, merchandise, and navigate the stadium. Just ask me anything!',
} as const;

// ─── Firebase Collection Names ───────────────────────────────────────────────

/** Firestore collection name for incidents. */
export const COLLECTION_INCIDENTS = 'incidents' as const;

/** Firestore collection name for crowd data. */
export const COLLECTION_CROWD_DATA = 'crowdData' as const;

// ─── Design System Constants ─────────────────────────────────────────────────

/** Map crowd density to Tailwind color classes. */
export const DENSITY_COLORS: Readonly<Record<string, string>> = {
  LOW: 'text-success bg-success',
  MEDIUM: 'text-warning bg-warning',
  HIGH: 'text-danger bg-danger',
  CRITICAL: 'text-error bg-error',
} as const;

/** Map crowd density to human-readable labels. */
export const DENSITY_LABELS: Readonly<Record<string, string>> = {
  LOW: 'Low',
  MEDIUM: 'Moderate',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;
