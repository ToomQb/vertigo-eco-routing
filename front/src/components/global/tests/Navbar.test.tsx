/// <reference types="vitest" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderOnlyLayout from '../navbar';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('HeaderOnlyLayout', () => {
  it('renders the company logo and about link', () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/');

    render(<HeaderOnlyLayout />);

    expect(screen.getByText('EcoRoute')).toBeInTheDocument();

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).not.toHaveClass('border-b-2');
  });

  it('highlights About link when on /about page', () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/about');

    render(<HeaderOnlyLayout />);
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('border-b-2');
  });
});
