/**
 * @fileoverview Tests for BottomNav component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomNav } from '../../components/Layout';
import { AppView } from '../../types';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

describe('BottomNav', () => {
  it('renders all 5 navigation items', () => {
    const onNavigate = vi.fn();
    renderWithI18n(<BottomNav activeView={AppView.DASHBOARD} onNavigate={onNavigate} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('Assistant')).toBeInTheDocument();
    expect(screen.getByText('Ops')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('highlights the active tab with aria-current', () => {
    const onNavigate = vi.fn();
    renderWithI18n(<BottomNav activeView={AppView.MAP} onNavigate={onNavigate} />);

    const mapButton = screen.getByText('Map').closest('button');
    expect(mapButton).toHaveAttribute('aria-current', 'page');

    const homeButton = screen.getByText('Home').closest('button');
    expect(homeButton).not.toHaveAttribute('aria-current');
  });

  it('calls onNavigate when a tab is clicked', () => {
    const onNavigate = vi.fn();
    renderWithI18n(<BottomNav activeView={AppView.DASHBOARD} onNavigate={onNavigate} />);

    const assistantButton = screen.getByText('Assistant').closest('button');
    fireEvent.click(assistantButton!);
    expect(onNavigate).toHaveBeenCalledWith(AppView.ASSISTANT);
  });
});
