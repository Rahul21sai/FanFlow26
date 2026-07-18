/**
 * @fileoverview Gemini AI chat hook for the assistant interface.
 */

import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, SupportedLanguage } from '../types';
import { MessageRole } from '../types';
import { askGemini, toGeminiHistory } from '../services';
import { validateChatMessage } from '../utils';
import { generateId } from '../utils/format';
import { MAX_CHAT_HISTORY } from '../constants';

/** Return type for the useGemini hook. */
export interface UseGeminiReturn {
  /** All chat messages in the conversation. */
  readonly messages: readonly ChatMessage[];
  /** Whether a response is currently being generated. */
  readonly isLoading: boolean;
  /** Current error message, if any. */
  readonly error: string | null;
  /** Send a message to the assistant. */
  readonly sendMessage: (prompt: string) => Promise<void>;
  /** Clear all chat history. */
  readonly clearHistory: () => void;
}

/**
 * React hook for managing Gemini AI chat conversations.
 * Handles message sending, history management, loading states,
 * and graceful error handling with fallback responses.
 *
 * @param language - Current UI language for message metadata
 * @returns Chat state and action functions
 */
export function useGemini(language: SupportedLanguage = 'en'): UseGeminiReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (prompt: string) => {
    // Validate input
    const validation = validateChatMessage(prompt);
    if (!validation.isValid) {
      setError(validation.error?.message ?? 'Invalid input');
      return;
    }

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId('msg'),
      role: MessageRole.USER,
      content: validation.sanitizedValue,
      timestamp: new Date(),
      language,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Convert history for Gemini
      const history = toGeminiHistory(
        messages.map((m) => ({ role: m.role, content: m.content }))
      );

      const result = await askGemini(
        validation.sanitizedValue,
        history,
        controller.signal
      );

      if (result.ok) {
        const assistantMessage: ChatMessage = {
          id: generateId('msg'),
          role: MessageRole.ASSISTANT,
          content: result.value,
          timestamp: new Date(),
          language,
        };

        setMessages((prev) => {
          const updated = [...prev, assistantMessage];
          // Cap history length
          if (updated.length > MAX_CHAT_HISTORY) {
            return updated.slice(updated.length - MAX_CHAT_HISTORY);
          }
          return updated;
        });
      } else {
        setError(result.error.message);
      }
    } catch {
      setError('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, language]);

  const clearHistory = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearHistory };
}
