import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SustainabilityKPI } from '../../components/SustainabilityKPI';

describe('SustainabilityKPI', () => {
  it('renders the sustainability metrics', () => {
    render(<SustainabilityKPI />);
    expect(screen.getByText('Event Sustainability')).toBeInTheDocument();
    expect(screen.getByText('Carbon Offset')).toBeInTheDocument();
    expect(screen.getByText('Waste Diverted')).toBeInTheDocument();
    expect(screen.getByText('450t')).toBeInTheDocument();
    expect(screen.getByText('82%')).toBeInTheDocument();
  });
});
