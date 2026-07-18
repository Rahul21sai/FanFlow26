/**
 * @fileoverview Gemini AI service for the FanFlow26 chat assistant.
 * Uses @google/generative-ai SDK with AbortController support and
 * graceful fallback to rule-based responses when the API is unavailable.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiError, type Result, ok, err } from '../types';
import {
  GEMINI_MODEL_NAME,
  GEMINI_TIMEOUT_MS,
  GEMINI_SYSTEM_PROMPT,
  FALLBACK_RESPONSES,
} from '../constants';
import { sanitizeInput } from '../utils/sanitize';

/** Gemini API key from environment variables. */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

/**
 * Checks whether the Gemini API key is configured.
 * @returns Whether the API key is present and non-empty
 */
export function isGeminiConfigured(): boolean {
  return Boolean(API_KEY && API_KEY.trim().length > 0);
}

/**
 * Chat history entry for Gemini context.
 * @property role - Either 'user' or 'model'
 * @property parts - Message content parts
 */
interface GeminiHistoryEntry {
  readonly role: 'user' | 'model';
  readonly parts: readonly { readonly text: string }[];
}

/**
 * Sends a message to the Gemini AI model with timeout and abort support.
 * Falls back to rule-based responses if the API key is missing or the request fails.
 *
 * @param prompt - The user's message
 * @param history - Previous conversation history for context
 * @param signal - Optional AbortSignal for cancellation
 * @returns Result containing the AI response text or a GeminiError
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 * const result = await askGemini("Where's the nearest exit?", [], controller.signal);
 * if (result.ok) {
 *   console.log(result.value);
 * } else {
 *   console.error(result.error.message);
 * }
 * ```
 */
export async function askGemini(
  prompt: string,
  history: readonly GeminiHistoryEntry[] = [],
  signal?: AbortSignal
): Promise<Result<string, GeminiError>> {
  const sanitizedPrompt = sanitizeInput(prompt);

  // If API key is missing, use fallback immediately
  if (!isGeminiConfigured()) {
    const fallback = getGeminiFallback(sanitizedPrompt);
    return ok(fallback);
  }

  try {
    // Create a timeout abort controller
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      timeoutController.abort();
    }, GEMINI_TIMEOUT_MS);

    // Combine user signal with timeout
    const combinedSignal = signal
      ? AbortSignal.any([signal, timeoutController.signal])
      : timeoutController.signal;

    const genAI = new GoogleGenerativeAI(API_KEY!);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL_NAME,
      systemInstruction: GEMINI_SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history.map((entry) => ({
        role: entry.role,
        parts: entry.parts.map((p) => ({ text: p.text })),
      })),
    });

    const result = await chat.sendMessage(sanitizedPrompt, {
      signal: combinedSignal,
    } as never);

    clearTimeout(timeoutId);

    const response = result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      return ok(getGeminiFallback(sanitizedPrompt));
    }

    return ok(text);
  } catch (error: unknown) {
    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      const fallback = getGeminiFallback(sanitizedPrompt);
      return ok(fallback + '\n\n_(AI response timed out — showing quick answer)_');
    }

    // Handle rate limiting
    if (error instanceof Error && error.message.includes('429')) {
      return err(new GeminiError('Rate limited. Please try again shortly.', 'GEMINI_RATE_LIMITED'));
    }

    // General error — use fallback
    const fallback = getGeminiFallback(sanitizedPrompt);
    return ok(fallback);
  }
}

/**
 * Provides a rule-based fallback response when Gemini is unavailable.
 * Matches keywords in the user's query against the FALLBACK_RESPONSES map.
 *
 * @param query - The user's question (will be lowercased for matching)
 * @returns A helpful response string based on keyword matching
 */
export function getGeminiFallback(query: string): string {
  const lower = query.toLowerCase();

  for (const [keyword, response] of Object.entries(FALLBACK_RESPONSES)) {
    if (lower.includes(keyword)) {
      return response;
    }
  }

  return 'I can help you find exits, restrooms, medical stations, food, and merchandise. I can also help you navigate the stadium and check crowd conditions. What would you like to know?';
}

/**
 * Converts the app's ChatMessage format to Gemini history format.
 * @param messages - Application chat messages
 * @returns Gemini-compatible history entries
 */
export function toGeminiHistory(
  messages: readonly { role: 'USER' | 'ASSISTANT'; content: string }[]
): GeminiHistoryEntry[] {
  return messages.map((msg) => ({
    role: msg.role === 'USER' ? 'user' as const : 'model' as const,
    parts: [{ text: msg.content }],
  }));
}
