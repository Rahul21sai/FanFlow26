/**
 * @fileoverview Tests for ChatBubble component.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatBubble } from '../../components/ChatAssistant';
import { MessageRole, type ChatMessage } from '../../types';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

const userMessage: ChatMessage = {
  id: 'test-user-1',
  role: MessageRole.USER,
  content: 'Where is the nearest exit?',
  timestamp: new Date(),
  language: 'en',
};

const aiMessage: ChatMessage = {
  id: 'test-ai-1',
  role: MessageRole.ASSISTANT,
  content: 'The nearest exit is at Gate A.',
  timestamp: new Date(),
  language: 'en',
};

describe('ChatBubble', () => {
  it('renders user message content', () => {
    renderWithI18n(<ChatBubble message={userMessage} />);
    expect(screen.getByText('Where is the nearest exit?')).toBeInTheDocument();
  });

  it('renders AI message with robot icon', () => {
    renderWithI18n(<ChatBubble message={aiMessage} />);
    expect(screen.getByText('The nearest exit is at Gate A.')).toBeInTheDocument();
    expect(screen.getByText('smart_toy')).toBeInTheDocument();
  });

  it('shows role labels', () => {
    renderWithI18n(<ChatBubble message={aiMessage} />);
    expect(screen.getByText('FanFlow AI')).toBeInTheDocument();
  });
});
