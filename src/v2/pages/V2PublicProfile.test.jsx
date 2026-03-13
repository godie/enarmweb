import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2PublicProfile from './V2PublicProfile';
import UserService from '../../services/UserService';

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

vi.mock('../../services/UserService');

describe('V2PublicProfile', () => {
  const mockUser = {
    nickname: "Dr. Test",
    specialty: "Aspirante a Todo",
    avatar: "http://example.com/avatar.png",
    verified: true,
    stats: { totalPoints: 1000, casesSolved: 50, accuracy: 90 },
    achievements: [
      { id: "ach1", title: "Test Achievement", icon: "star", date: "Today", color: "gold" }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    UserService.getPublicProfile.mockResolvedValue({ data: { user: mockUser } });
  });

  it('renders user information correctly from service', async () => {
    render(
      <MemoryRouter>
        <V2PublicProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dr. Test')).toBeTruthy();
    });

    expect(screen.getByText('Aspirante a Todo')).toBeTruthy();
    expect(screen.getByText('1,000')).toBeTruthy();
    expect(screen.getByText('50')).toBeTruthy();
    expect(screen.getByText('90%')).toBeTruthy();
    expect(screen.getByText('Test Achievement')).toBeTruthy();
  });

  it('toggles follow button state', async () => {
    render(
      <MemoryRouter>
        <V2PublicProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Seguir')).toBeTruthy();
    });

    const followButton = screen.getByText('Seguir');
    fireEvent.click(followButton);
    expect(screen.getByText('Siguiendo')).toBeTruthy();

    fireEvent.click(screen.getByText('Siguiendo'));
    expect(screen.getByText('Seguir')).toBeTruthy();
  });

  it('navigates back when back button is clicked', async () => {
    render(
      <MemoryRouter>
        <V2PublicProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('arrow_back')).toBeTruthy();
    });

    const backButton = screen.getByText('arrow_back');
    fireEvent.click(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
});
