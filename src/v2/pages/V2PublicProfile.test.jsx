import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import V2PublicProfile from './V2PublicProfile';

// Mock useHistory
const mockGoBack = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      goBack: mockGoBack
    }),
    useParams: () => ({
      userId: 'test-user-id'
    })
  };
});

describe('V2PublicProfile', () => {
  it('renders user information correctly', () => {
    render(
      <MemoryRouter initialEntries={['/v2/perfil/publico/test-user-id']}>
        <V2PublicProfile />
      </MemoryRouter>
    );

    expect(screen.getByText('Dra. Elena Martínez')).toBeTruthy();
    expect(screen.getByText('Aspirante a Pediatría')).toBeTruthy();
    expect(screen.getByText('12,450')).toBeTruthy();
    expect(screen.getByText('342')).toBeTruthy();
    expect(screen.getByText('88%')).toBeTruthy();
  });

  it('toggles follow button state', () => {
    render(
      <MemoryRouter>
        <V2PublicProfile />
      </MemoryRouter>
    );

    const followButton = screen.getByText('Seguir');
    fireEvent.click(followButton);
    expect(screen.getByText('Siguiendo')).toBeTruthy();

    fireEvent.click(screen.getByText('Siguiendo'));
    expect(screen.getByText('Seguir')).toBeTruthy();
  });

  it('navigates back when back button is clicked', () => {
    render(
      <MemoryRouter>
        <V2PublicProfile />
      </MemoryRouter>
    );

    const backButton = screen.getByText('arrow_back');
    fireEvent.click(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
});
