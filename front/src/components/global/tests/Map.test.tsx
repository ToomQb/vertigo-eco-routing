import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Dynamic next/dynamic mock BEFORE importing the Map component
vi.mock('next/dynamic', async () => {
  const React = await import('react');

  return {
    default: (_importFn: any, _options: any) => {
      const MockedComponent = () => <div data-testid="mocked-map">Mocked Map</div>;
      return MockedComponent;
    },
  };
});

import Map from '../map';

describe('Map', () => {
  it('renders the dynamically imported map component', () => {
    render(<Map />);
    expect(screen.getByTestId('mocked-map')).toBeInTheDocument();
  });
});
