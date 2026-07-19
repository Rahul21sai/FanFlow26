import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SustainabilityKPI } from '../../components/SustainabilityKPI';
import { AppProvider } from '../../context/AppContext';

describe('SustainabilityKPI', () => {
  it('renders the sustainability metrics', () => {
    render(
      <AppProvider>
        <SustainabilityKPI />
      </AppProvider>
    );
    expect(screen.getByText('Event Sustainability')).toBeInTheDocument();
    expect(screen.getByText('Energy source')).toBeInTheDocument();
    expect(screen.getByText('Waste Diverted')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });
});
