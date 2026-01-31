import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import Auth from '../modules/Auth';
import UserService from '../services/UserService';

// Mock Auth module
vi.mock('../modules/Auth', () => ({
  default: {
    isFacebookUser: vi.fn(),
    getFacebookUser: vi.fn(),
    isUserAuthenticated: vi.fn(),
    getToken: vi.fn(),
    getUserInfo: vi.fn(),
  }
}));

// Mock UserService
vi.mock('../services/UserService', () => ({
  default: {
    getAchievements: vi.fn(),
  }
}));

describe('Profile Component', () => {
  const mockFbUser = { facebook_id: 'fb123', name: 'Facebook User', email: 'fb@example.com', id: 'fb123' };
  //const mockRegularUser = { facebook_id: 'user456', name: 'Regular User', email: 'user@example.com', id: 'user456' };
  const mockAchievements = [
    { id: 'ach1', name: 'First Step', description: 'Completed tutorial', achieved_at: '2023-01-01T12:00:00Z' },
    { id: 'ach2', name: 'Explorer', description: 'Visited 10 pages', achieved_at: null },
  ];

  let getItemSpy;

  beforeEach(() => {
    // Reset mocks for Auth and UserService
    vi.clearAllMocks();

    // Spy on localStorage.getItem
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
  });

  afterEach(() => {
    // Restore the original localStorage.getItem behavior
    getItemSpy.mockRestore();
  });

  test('renders loading state initially', () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockFbUser);
    vi.mocked(UserService.getAchievements).mockReturnValue(new Promise(() => { })); // Promise that never resolves

    const { container } = render(<Profile />);
    expect(container.querySelector('.preloader-wrapper')).toBeInTheDocument();
  });

  test('renders error message if user data is missing/null', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(null);

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/No se encontró información del usuario/i)).toBeInTheDocument();
    });
  });

  test('renders error message if fetching achievements fails', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockFbUser);
    vi.mocked(UserService.getAchievements).mockRejectedValue(new Error('Failed to fetch achievements'));

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching achievements.')).toBeInTheDocument();
    });
  });

  test('displays user information and achievements correctly', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockFbUser);
    vi.mocked(UserService.getAchievements).mockResolvedValue({ data: mockAchievements });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(mockFbUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockFbUser.email)).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(mockAchievements.length);

      expect(listItems[0].querySelector('.material-icons')).toHaveTextContent('check_circle');
      expect(listItems[1].querySelector('.material-icons')).not.toBeInTheDocument();
    });
  });

  test('displays "No achievements yet." when no achievements are found', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockFbUser);
    vi.mocked(UserService.getAchievements).mockResolvedValue({ data: [] });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/Aún no has desbloqueado logros/i)).toBeInTheDocument();
    });
  });

  test('handles case where user has no ID for fetching achievements', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue({ name: "Test User No ID", email: "test@example.com", id: null });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/No se encontró información del usuario/i)).toBeInTheDocument();
      expect(UserService.getAchievements).not.toHaveBeenCalled();
    });
  });
});
