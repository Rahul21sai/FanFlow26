/**
 * @fileoverview Gemini AI chat hook for the assistant interface.
 */

import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, SupportedLanguage, CrowdData } from '../types';
import { MessageRole } from '../types';
import { askGemini, toGeminiHistory } from '../services';
import { validateChatMessage } from '../utils';
import { generateId } from '../utils/format';
import { MAX_CHAT_HISTORY } from '../constants';
import { useAppContext } from '../context/AppContext';
import { STADIUMS } from '../data/stadiums';

/** Return type for the useGemini hook. */
export interface UseGeminiReturn {
  /** All chat messages in the conversation. */
  readonly messages: readonly ChatMessage[];
  /** Whether a response is currently being generated. */
  readonly isLoading: boolean;
  /** Current error message, if any. */
  readonly error: string | null;
  /** Send a message to the assistant. */
  readonly sendMessage: (prompt: string, crowdData?: ReadonlyMap<string, CrowdData>) => Promise<void>;
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
  const { selectedStadium, accessibilitySettings } = useAppContext();

  const sendMessage = useCallback(async (prompt: string, crowdData?: ReadonlyMap<string, CrowdData>) => {
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
      // Build grounding context from active stadium and live settings
      const activeStadium = STADIUMS[selectedStadium] || STADIUMS.azteca;
      const a11yList = Object.entries(accessibilitySettings)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => key)
        .join(', ');

      let crowdInfo = '';
      if (crowdData) {
        const list: string[] = [];
        crowdData.forEach((d, zoneId) => {
          list.push(`${zoneId}: ${d.density} (${d.percentage}% full)`);
        });
        crowdInfo = list.join(', ');
      }

      const groundingPrompt = `
[LIVE STADIUM GROUNDING CONTEXT]
Active Stadium: ${activeStadium.name} in ${activeStadium.city}, ${activeStadium.country}. Capacity: ${activeStadium.capacity}.
Match Today: ${activeStadium.match.teams.teamA.name} vs ${activeStadium.match.teams.teamB.name} (Kickoff at ${activeStadium.match.kickoff}).
Accessible Entrances: ${activeStadium.accessibility.stepFreeEntrances.join(', ')}.
Elevators Available: ${activeStadium.accessibility.elevators}.
Wheelchair Spaces: ${activeStadium.accessibility.wheelchairSpaces}.
Transit lines and status: Metro Line: ${activeStadium.transport.line} (arrives in ${activeStadium.transport.travelTimeMin} mins), Bus Route: ${activeStadium.transport.busRoute} (departs in ${activeStadium.transport.shuttleFreq} mins).
Sustainability KPIs: LEED certification level: ${activeStadium.sustainability.certification}, Renewable energy percentage: ${activeStadium.sustainability.renewableEnergyPercent}%, Solar panels: ${activeStadium.sustainability.solarPanels}, EV charging stations: ${activeStadium.sustainability.evStations}, Water recycled: ${activeStadium.sustainability.waterRecyclingPercent}%, Waste diverted: ${activeStadium.sustainability.wasteRecyclingPercent}%.
User accessibility needs activated: ${a11yList || 'None'}.
Live crowd density per zone: ${crowdInfo || 'No live data available'}.

User Query: ${validation.sanitizedValue}
`;

      // Convert history for Gemini
      const history = toGeminiHistory(
        messages.map((m) => ({ role: m.role, content: m.content }))
      );

      const result = await askGemini(
        groundingPrompt,
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
  }, [messages, language, selectedStadium, accessibilitySettings]);

  const clearHistory = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearHistory };
}
