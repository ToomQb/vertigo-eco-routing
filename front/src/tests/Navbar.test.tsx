import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderOnlyLayout from '../components/global/navbar';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../components/global/authContext';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}));

describe('HeaderOnlyLayout', () => {
  it('renders the company logo and about link', () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/');
    render(
      <AuthProvider>
        <HeaderOnlyLayout />
      </AuthProvider>
    );

    expect(screen.getByAltText('VertiGo Logo')).toBeInTheDocument();

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).not.toHaveClass('border-b-2');
  });

  it('highlights About link when on /about page', () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/about');
    render(
      <AuthProvider>
        <HeaderOnlyLayout />
      </AuthProvider>
    );

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('border-b-2');
  });
});
