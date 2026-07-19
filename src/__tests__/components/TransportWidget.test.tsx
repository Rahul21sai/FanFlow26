import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransportWidget } from '../../components/TransportWidget';

describe('TransportWidget', () => {
  it('renders transit options', () => {
    render(<TransportWidget />);
    expect(screen.getByText('Transit Status')).toBeInTheDocument();
    expect(screen.getByText('Metro Line 1')).toBeInTheDocument();
    expect(screen.getByText('Shuttle Bus A')).toBeInTheDocument();
    expect(screen.getByText('On Time')).toBeInTheDocument();
    expect(screen.getByText('Delayed')).toBeInTheDocument();
  });
});
