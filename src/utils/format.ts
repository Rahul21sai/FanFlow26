/**
 * @fileoverview General formatting utilities for display values.
 * Handles time, distance, and text formatting across the application.
 */

/**
 * Formats a duration in minutes into a human-readable string.
 * @param minutes - Number of minutes
 * @returns Formatted string like "4 mins" or "1 hr 30 mins"
 */
export function formatTime(minutes: number): string {
  if (minutes < 0) return '0 mins';
  if (minutes === 0) return '0 mins';

  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hrs === 0) return `${mins} min${mins !== 1 ? 's' : ''}`;
  if (mins === 0) return `${hrs} hr${hrs !== 1 ? 's' : ''}`;
  return `${hrs} hr${hrs !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
}

/**
 * Formats a timestamp into a relative or absolute time string.
 * @param date - The date to format
 * @returns Relative time string like "2 mins ago" or "Today, 2:15 PM"
 */
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours !== 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Formats a distance in meters into a human-readable string.
 * @param meters - Distance in meters
 * @returns Formatted string like "20m" or "1.2 km"
 */
export function formatDistance(meters: number): string {
  if (meters < 0) return '0m';
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Truncates text to a maximum length with an ellipsis.
 * @param text - The text to truncate
 * @param maxLength - Maximum allowed character count
 * @returns Truncated text with "..." appended if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (maxLength <= 0) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

/**
 * Generates a unique ID string for elements.
 * @param prefix - Prefix for the ID (e.g., "msg", "zone")
 * @returns A unique string like "msg-1689012345678-abc12"
 */
export function generateId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Capitalizes the first letter of a string.
 * @param text - Input string
 * @returns String with first letter capitalized
 */
export function capitalize(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
