
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, beforeEach, test, expect } from 'vitest';

import Navi from './Navi';
import Auth from '../modules/Auth';

// Mock the Auth module explicitly with Vitest
vi.mock('../modules/Auth', () => {
  return {
    default: {
      isUserAuthenticated: vi.fn(),
      isPlayerAuthenticated: vi.fn(),
      isAdmin: vi.fn(),
      getUserInfo: vi.fn(),
      getPlayerInfo: vi.fn(),
      getToken: vi.fn(),
      deauthenticateUser: vi.fn(),
      deauthenticatePlayer: vi.fn(),
    }
  };
});

const renderNavi = () => {
  return render(
    <MemoryRouter>
      <Navi />
    </MemoryRouter>
  );
};

describe('Navi Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Auth.isUserAuthenticated.mockReturnValue(false);
    Auth.isPlayerAuthenticated.mockReturnValue(false);
    Auth.isAdmin.mockReturnValue(false);
  });

  test('renders Navbar brand and static links correctly', () => {
    renderNavi();

    expect(screen.getByText('Enarm')).toBeInTheDocument();

    // In actual Navi.jsx, links might be inside different structures due to CustomNavbar
    // Let's look for link text instead of strict selector if possible
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Caso Clinico').length).toBeGreaterThan(0);
  });

  test('shows Admin link only for authenticated admins', () => {
    Auth.isUserAuthenticated.mockReturnValue(true);
    Auth.isAdmin.mockReturnValue(true);
    renderNavi();
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
  });

  test('hides Admin link for non-admins', () => {
    Auth.isUserAuthenticated.mockReturnValue(true);
    Auth.isAdmin.mockReturnValue(false);
    renderNavi();
    expect(screen.queryAllByText('Admin').length).toBe(0);
  });

  describe('Conditional "Salir" (Logout) Link', () => {
    test('renders "Salir" link when user is authenticated', async () => {
      Auth.isUserAuthenticated.mockReturnValue(true);
      renderNavi();
      // Need to use findBy because it might be rendered after an effect or within the Navbar
      const salirLinks = await screen.findAllByRole('link', { name: /Salir/i });
      expect(salirLinks.length).toBeGreaterThan(0);
      expect(salirLinks[0]).toBeInTheDocument();
    });

    test('does not render "Salir" link when user is not authenticated', () => {
      Auth.isUserAuthenticated.mockReturnValue(false);
      Auth.isPlayerAuthenticated.mockReturnValue(false);
      renderNavi();
      expect(screen.queryByRole('link', { name: /salir/i })).not.toBeInTheDocument();
    });
  });
});
