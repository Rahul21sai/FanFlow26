import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransportWidget } from '../../components/TransportWidget';
import { AppProvider } from '../../context/AppContext';

describe('TransportWidget', () => {
  it('renders transit options', () => {
    render(
      <AppProvider>
        <TransportWidget />
      </AppProvider>
    );
    expect(screen.getByText('Transit Status')).toBeInTheDocument();
    expect(screen.getByText('Xochimilco Light Rail')).toBeInTheDocument();
    expect(screen.getByText('Metrobus Line 1')).toBeInTheDocument();
    expect(screen.getByText('On Time')).toBeInTheDocument();
    expect(screen.getByText('Delayed')).toBeInTheDocument();
  });
});
