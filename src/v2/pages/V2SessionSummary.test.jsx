import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import V2SessionSummary from './V2SessionSummary';
import LeaderboardService from '../../services/LeaderboardService';
import Auth from '../../modules/Auth';

vi.mock('../../services/LeaderboardService');
vi.mock('../../modules/Auth');

describe('V2SessionSummary', () => {
  const mockLocation = {
    state: {
      totalQuestions: 10,
      correctAnswers: 8,
      xpEarned: 450,
      timeElapsed: 120
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Auth.getUserInfo.mockReturnValue({ id: '1', name: 'García' });
    // Return a never-resolving promise for leaderboard to avoid async state updates after render
    LeaderboardService.getTopUsers.mockReturnValue(new Promise(() => {}));
  });

  const renderWithRouter = (state = mockLocation.state) => {
    const history = createMemoryHistory();
    history.push({
      pathname: '/simulacro/resumen',
      state
    });
    const pushSpy = vi.spyOn(history, 'push');

    render(
      <Router history={history}>
        <V2SessionSummary />
      </Router>
    );
    return { history, pushSpy };
  };

  it('renders session statistics correctly', async () => {
    renderWithRouter();

    expect(screen.getAllByText('80%')).toBeDefined();
    expect(screen.getByText('+450')).toBeDefined();
    expect(screen.getByText('02:00')).toBeDefined();
    expect(screen.getByText('8/10')).toBeDefined();
    expect(screen.getByText('2/10')).toBeDefined();
    await waitFor(() => {});
  });

  it('navigates to dashboard on "Inicio" click', async () => {
    const { pushSpy } = renderWithRouter();

    const dashboardBtn = screen.getByLabelText('Volver al inicio (atajo: i)');
    fireEvent.click(dashboardBtn);

    expect(pushSpy).toHaveBeenCalledWith('/dashboard');
    await waitFor(() => {});
  });

  it('navigates to dashboard on "i" key press', async () => {
    const { pushSpy } = renderWithRouter();

    fireEvent.keyDown(window, { key: 'i' });

    expect(pushSpy).toHaveBeenCalledWith('/dashboard');
    await waitFor(() => {});
  });

  it('navigates to practice on "Nueva Sesión" click', async () => {
    const { pushSpy } = renderWithRouter();

    const newSessionBtn = screen.getByLabelText('Nueva sesión de práctica (atajo: Enter)');
    fireEvent.click(newSessionBtn);

    expect(pushSpy).toHaveBeenCalledWith('/practica');
    await waitFor(() => {});
  });

  it('navigates to practice on "Enter" key press', async () => {
    const { pushSpy } = renderWithRouter();

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(pushSpy).toHaveBeenCalledWith('/practica');
    await waitFor(() => {});
  });

  it('navigates to error review on "r" key press when there are mistakes', async () => {
    const { pushSpy } = renderWithRouter({
      totalQuestions: 10,
      correctAnswers: 8
    });

    fireEvent.keyDown(window, { key: 'r' });

    expect(pushSpy).toHaveBeenCalledWith('/errores');
    await waitFor(() => {});
  });

  it('does not navigate to error review on "r" key press when there are no mistakes', async () => {
    const { pushSpy } = renderWithRouter({
      totalQuestions: 10,
      correctAnswers: 10
    });

    fireEvent.keyDown(window, { key: 'r' });

    expect(pushSpy).not.toHaveBeenCalledWith('/errores');
    await waitFor(() => {});
  });
});
