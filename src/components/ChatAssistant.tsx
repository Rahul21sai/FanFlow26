/**
 * @fileoverview GenAI Chat Assistant with messages, typing indicator,
 * suggestion chips, and input bar. Matches Stitch "GenAI Assistant" screen.
 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChatMessage } from '../types';
import { MessageRole } from '../types';

/** Props for the ChatAssistant component. */
export interface ChatAssistantProps {
  /** All chat messages in the conversation. */
  readonly messages: readonly ChatMessage[];
  /** Whether the AI is currently generating a response. */
  readonly isLoading: boolean;
  /** Current error message, if any. */
  readonly error: string | null;
  /** Callback to send a new message. */
  readonly onSendMessage: (message: string) => void;
}

/** Props for the ChatBubble sub-component. */
export interface ChatBubbleProps {
  /** The chat message to display. */
  readonly message: ChatMessage;
}

/**
 * Single chat message bubble with role-based styling.
 * User messages are right-aligned with primary background.
 * AI messages are left-aligned with avatar and surface background.
 * @param props - Message data
 * @returns The rendered chat bubble
 */
export function ChatBubble({ message }: ChatBubbleProps) {
  const { t } = useTranslation();
  const isUser = message.role === MessageRole.USER;

  return (
    <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'} w-full animate-[fadeIn_0.3s_ease-out_forwards]`}>
      <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-[#0b6e4f] flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
            <span className="material-symbols-outlined text-[#98edc6] text-sm" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
        )}
        <div className={`p-4 shadow-sm ${
          isUser
            ? 'bg-[#00543b] text-white rounded-2xl rounded-br-sm'
            : 'bg-[#F8F9FA] text-[#1c1b1b] rounded-2xl rounded-bl-sm border border-[#bec9c1]/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
        }`}>
          <p className="text-base leading-6 whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
      <span className={`text-xs text-[#6f7a73] ${isUser ? 'mr-2' : 'ml-11'}`}>
        {isUser ? `${t('assistant.you')} • ${t('assistant.read')}` : t('assistant.aiLabel')}
      </span>
    </div>
  );
}

/** Props for the TypingIndicator sub-component. */
export interface TypingIndicatorProps {
  /** Whether to show the typing indicator. */
  readonly visible: boolean;
}

/**
 * Animated typing indicator showing three bouncing dots.
 * Matches the Stitch typing animation design.
 * @param props - Visibility state
 * @returns The rendered typing indicator or null
 */
export function TypingIndicator({ visible }: TypingIndicatorProps) {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <div className="flex flex-col gap-1 items-start w-full animate-[fadeIn_0.3s_ease-out_forwards]">
      <div className="flex items-end gap-2 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-[#0b6e4f] flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
          <span className="material-symbols-outlined text-[#98edc6] text-sm" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        </div>
        <div className="bg-[#F8F9FA] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-4 rounded-2xl rounded-bl-sm border border-[#bec9c1]/20 flex items-center justify-center h-14 min-w-[80px]">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#00543b]/60"
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: `${-0.32 + i * 0.16}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <span className="text-xs text-[#6f7a73] italic ml-11">{t('assistant.typing')}</span>
    </div>
  );
}

/**
 * Full chat assistant interface with message history, suggestion chips,
 * typing indicator, and input bar.
 * @param props - Chat state and callbacks
 * @returns The rendered chat assistant
 */
export function ChatAssistant({
  messages,
  isLoading,
  error,
  onSendMessage,
}: ChatAssistantProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const suggestions = [
    { icon: 'directions_run', text: t('assistant.nearestExit'), color: 'text-[#00543b]' },
    { icon: 'cleaning_services', text: t('assistant.reportSpill'), color: 'text-[#FFC107]' },
    { icon: 'restaurant', text: t('assistant.vegetarianFood'), color: 'text-[#28A745]' },
  ];

  return (
    <div className="flex flex-col h-full pt-16 pb-20" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Chat Messages */}
      <main className="flex-1 pt-4 pb-36 px-4 md:px-12 overflow-y-auto w-full max-w-3xl mx-auto flex flex-col gap-y-6">
        {/* Date/Time Context */}
        <div className="text-center w-full mt-4">
          <span className="text-xs font-medium text-[#3f4943] bg-[#f0eded] px-3 py-1 rounded-full">
            {t('assistant.today')}, 2:15 PM • {t('assistant.preMatch')}
          </span>
        </div>

        {/* Welcome Message */}
        {messages.length === 0 && (
          <>
            <ChatBubble
              message={{
                id: 'welcome',
                role: MessageRole.ASSISTANT,
                content: t('assistant.welcomeMessage'),
                timestamp: new Date(),
                language: 'en',
              }}
            />
            {/* Suggestion Chips */}
            <div className="w-full overflow-x-auto -mx-4 px-4 pt-2 pb-1">
              <div className="flex gap-3 w-max" role="group" aria-label="Quick suggestions">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    id={`suggestion-${i}`}
                    onClick={() => onSendMessage(s.text)}
                    className="flex items-center gap-2 bg-[#F8F9FA] border border-[#bec9c1] hover:border-[#00543b] text-[#1c1b1b] px-4 py-2 rounded-full text-sm font-semibold transition-colors active:scale-95 shadow-sm min-h-[44px]"
                  >
                    <span className={`material-symbols-outlined text-lg ${s.color}`}>{s.icon}</span>
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Message History */}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Typing Indicator */}
        <TypingIndicator visible={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="text-center">
            <span className="text-xs text-[#ba1a1a] bg-[#ffdad6] px-3 py-1 rounded-full">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="fixed bottom-[80px] left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-t border-[#bec9c1]/30 shadow-[0_-8px_16px_rgba(0,0,0,0.02)] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <input
              id="chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Chat input"
              className="w-full bg-[#f0eded] rounded-full pl-4 pr-12 py-3 text-base text-[#1c1b1b] border-none focus:ring-2 focus:ring-[#00543b] focus:bg-white transition-all min-h-[48px] placeholder:text-[#3f4943]/70 shadow-inner outline-none"
              placeholder={t('assistant.placeholder')}
              disabled={isLoading}
            />
            <button
              id="btn-send"
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              aria-label={t('assistant.send')}
              className="absolute right-1 w-10 h-10 rounded-full flex items-center justify-center bg-[#00543b] text-white hover:bg-[#005139] transition-colors shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {inputValue.trim() ? 'send' : 'mic'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
