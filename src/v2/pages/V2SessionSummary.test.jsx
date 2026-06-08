import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2SessionSummary from './V2SessionSummary';
import LeaderboardService from '../../services/LeaderboardService';
import Auth from '../../modules/Auth';

// Use vi.hoisted for variables used in vi.mock
const { mockHistoryPush } = vi.hoisted(() => ({
  mockHistoryPush: vi.fn()
}));

// Mock services
vi.mock('../../services/LeaderboardService', () => ({
  default: {
    getTopUsers: vi.fn().mockResolvedValue({ data: [] })
  }
}));

vi.mock('../../modules/Auth', () => ({
  default: {
    getUserInfo: vi.fn().mockReturnValue({ id: '123', name: 'Test User' })
  }
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockHistoryPush
    }),
    useLocation: vi.fn().mockReturnValue({
      state: {
        totalQuestions: 10,
        correctAnswers: 8,
        xpEarned: 400,
        timeElapsed: 120,
        userId: '123'
      }
    })
  };
});

describe('V2SessionSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders session statistics correctly', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    // Wait for leaderboard loading to finish to avoid act() warnings
    await waitFor(() => {
      expect(screen.queryByText('...')).toBeNull();
    });

    expect(screen.getAllByText('80%')).toHaveLength(2);
    expect(screen.getByText('+400')).toBeTruthy();
    expect(screen.getByText('02:00')).toBeTruthy();
    expect(screen.getByText('8/10')).toBeTruthy();
    expect(screen.getByText('2/10')).toBeTruthy();
  });

  it('shows visual hints for keyboard shortcuts', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.queryByText('...')).toBeNull());

    expect(screen.getByText('[i]')).toBeTruthy();
    expect(screen.getByText('[r]')).toBeTruthy();
    expect(screen.getByText('[Enter]')).toBeTruthy();

    expect(screen.getByLabelText(/Volver al inicio \(atajo: i\)/)).toBeTruthy();
    expect(screen.getByLabelText(/Revisar errores \(atajo: r\)/)).toBeTruthy();
    expect(screen.getByLabelText(/Nueva sesión de práctica \(atajo: Enter\)/)).toBeTruthy();
  });

  it('navigates to dashboard when "i" key is pressed', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.queryByText('...')).toBeNull());

    fireEvent.keyDown(window, { key: 'i' });
    expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to practice when "Enter" key is pressed', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.queryByText('...')).toBeNull());

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockHistoryPush).toHaveBeenCalledWith('/practica');
  });

  it('navigates to errors when "r" key is pressed', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.queryByText('...')).toBeNull());

    fireEvent.keyDown(window, { key: 'r' });
    expect(mockHistoryPush).toHaveBeenCalledWith('/errores');
  });

  it('does not navigate to errors when "r" key is pressed and there are no errors', async () => {
    const { useLocation } = await import('react-router-dom');
    useLocation.mockReturnValue({
      state: {
        totalQuestions: 10,
        correctAnswers: 10,
        xpEarned: 500,
        timeElapsed: 100,
        userId: '123'
      }
    });

    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.queryByText('...')).toBeNull());

    fireEvent.keyDown(window, { key: 'r' });
    expect(mockHistoryPush).not.toHaveBeenCalledWith('/errores');
  });
});
