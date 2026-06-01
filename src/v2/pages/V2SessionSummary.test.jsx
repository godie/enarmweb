import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2SessionSummary from '../pages/V2SessionSummary';
import LeaderboardService from '../../services/LeaderboardService';

// Standard mock for useLocation
const mockLocation = {
  state: {
    totalQuestions: 10,
    correctAnswers: 8,
    xpEarned: 400,
    timeElapsed: 600
  }
};

const mockPush = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockPush
    }),
    useLocation: () => mockLocation
  };
});

// Mock services
vi.mock('../../services/LeaderboardService', () => ({
  default: {
    getTopUsers: vi.fn()
  }
}));

vi.mock('../../modules/Auth', () => ({
  default: {
    getUserInfo: vi.fn(() => ({ name: 'García', id: 1 }))
  }
}));

describe('V2SessionSummary Shortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset location state to default with errors
    mockLocation.state = {
      totalQuestions: 10,
      correctAnswers: 8,
      xpEarned: 400,
      timeElapsed: 600
    };
  });

  it('navigates to practice on Enter key', async () => {
    LeaderboardService.getTopUsers.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    // Wait for initial load to finish (loading=false)
    await waitFor(() => {
      expect(screen.queryByText('...')).toBeNull();
    });

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(mockPush).toHaveBeenCalledWith('/practica');
  });

  it('navigates to dashboard on "i" key', async () => {
    LeaderboardService.getTopUsers.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('...')).toBeNull();
    });

    fireEvent.keyDown(window, { key: 'i' });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to mistakes on "r" key when there are errors', async () => {
    LeaderboardService.getTopUsers.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('...')).toBeNull();
    });

    fireEvent.keyDown(window, { key: 'r' });

    expect(mockPush).toHaveBeenCalledWith('/errores');
  });

  it('does not navigate to mistakes on "r" key when there are NO errors', async () => {
    LeaderboardService.getTopUsers.mockResolvedValue({ data: [] });
    mockLocation.state = {
      totalQuestions: 10,
      correctAnswers: 10,
      xpEarned: 500,
      timeElapsed: 600
    };

    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('...')).toBeNull();
    });

    fireEvent.keyDown(window, { key: 'r' });

    expect(mockPush).not.toHaveBeenCalledWith('/errores');
  });

  it('displays shortcut hints in button labels', async () => {
    // Avoid state update after test by using a never-resolving promise
    LeaderboardService.getTopUsers.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    expect(screen.getByText(/\[I\]/)).toBeDefined();
    expect(screen.getByText(/\[R\]/)).toBeDefined();
    expect(screen.getByText(/\[Enter\]/)).toBeDefined();
  });
});
