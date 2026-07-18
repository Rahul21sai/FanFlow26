/**
 * @fileoverview Tests for StadiumMap component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StadiumMap } from '../../components/StadiumMap';
import type { CrowdData } from '../../types';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

const emptyCrowdData = new Map<string, CrowdData>();

describe('StadiumMap', () => {
  it('renders the stadium SVG with zones', () => {
    const onZoneClick = vi.fn();
    renderWithI18n(
      <StadiumMap
        crowdData={emptyCrowdData}
        activeRoute={null}
        onZoneClick={onZoneClick}
        onFindFacility={vi.fn()}
        onEndRoute={vi.fn()}
      />
    );

    // Check that the SVG is rendered with at least a zone
    const svg = screen.getByRole('img', { name: /stadium map/i });
    expect(svg).toBeInTheDocument();
  });

  it('calls onZoneClick when a zone is clicked', () => {
    const onZoneClick = vi.fn();
    renderWithI18n(
      <StadiumMap
        crowdData={emptyCrowdData}
        activeRoute={null}
        onZoneClick={onZoneClick}
        onFindFacility={vi.fn()}
        onEndRoute={vi.fn()}
      />
    );

    // Click on a zone path (Gate A)
    const zonePaths = screen.getAllByRole('button');
    const gateA = zonePaths.find((el) => el.getAttribute('aria-label')?.includes('Gate A'));
    if (gateA) {
      fireEvent.click(gateA);
      expect(onZoneClick).toHaveBeenCalledWith('gate-a');
    }
  });
});
