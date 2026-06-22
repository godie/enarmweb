import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2SessionSummary from './V2SessionSummary';
import LeaderboardService from '../../services/LeaderboardService';
import Auth from '../../modules/Auth';

// Mock services
vi.mock('../../services/LeaderboardService', () => ({
  default: {
    getTopUsers: vi.fn()
  }
}));

vi.mock('../../modules/Auth', () => ({
  default: {
    getUserInfo: vi.fn()
  }
}));

const mockHistoryPush = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockHistoryPush
    })
  };
});

describe('V2SessionSummary', () => {
  const sessionState = {
    totalQuestions: 10,
    correctAnswers: 8,
    xpEarned: 400,
    timeElapsed: 120
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Auth.getUserInfo.mockReturnValue({ id: '123', name: 'García' });
    // Make service return a never-resolving promise to avoid act() warnings during initial render tests
    LeaderboardService.getTopUsers.mockReturnValue(new Promise(() => {}));
  });

  it('renders correctly with session data', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/simulacro/resumen', state: sessionState }]}>
        <V2SessionSummary />
      </MemoryRouter>
    );

    // Using getAllByText as 80% might appear in stats and performance bar
    expect(screen.getAllByText(/80%/).length).toBeGreaterThan(0);
    expect(screen.getByText(/\+400/)).toBeTruthy();
    expect(screen.getByText(/02:00/)).toBeTruthy();
    // Using regex as text might be split across nodes
    expect(screen.getByText(/Buen trabajo, Dr\. García\./)).toBeTruthy();
  });

  it('navigates to practice on "Nueva Sesión" click', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/simulacro/resumen', state: sessionState }]}>
        <V2SessionSummary />
      </MemoryRouter>
    );

    const newSessionBtn = screen.getByLabelText(/Nueva sesión de práctica/);
    fireEvent.click(newSessionBtn);

    expect(mockHistoryPush).toHaveBeenCalledWith('/practica');
    await waitFor(() => {}); // flush act()
  });

  it('navigates to dashboard on "Inicio" click', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/simulacro/resumen', state: sessionState }]}>
        <V2SessionSummary />
      </MemoryRouter>
    );

    const inicioBtn = screen.getByLabelText(/Volver al inicio/);
    fireEvent.click(inicioBtn);

    expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard');
    await waitFor(() => {}); // flush act()
  });

  it('triggers "Nueva Sesión" with Enter key', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/simulacro/resumen', state: sessionState }]}>
        <V2SessionSummary />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(mockHistoryPush).toHaveBeenCalledWith('/practica');
    await waitFor(() => {}); // flush act()
  });

  it('triggers "Inicio" with "i" key', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/simulacro/resumen', state: sessionState }]}>
        <V2SessionSummary />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'i' });
    expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard');
    await waitFor(() => {}); // flush act()
  });

  it('triggers "Revisar Errores" with "r" key when there are errors', async () => {
    const stateWithErrors = { ...sessionState, correctAnswers: 5 }; // 5 errors
    render(
      <MemoryRouter initialEntries={[{ pathname: '/simulacro/resumen', state: stateWithErrors }]}>
        <V2SessionSummary />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'r' });
    expect(mockHistoryPush).toHaveBeenCalledWith('/errores');
    await waitFor(() => {}); // flush act()
  });

  it('does not trigger "Revisar Errores" with "r" key when there are no errors', async () => {
    const stateNoErrors = { ...sessionState, correctAnswers: 10 }; // 0 errors
    render(
      <MemoryRouter initialEntries={[{ pathname: '/simulacro/resumen', state: stateNoErrors }]}>
        <V2SessionSummary />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'r' });
    expect(mockHistoryPush).not.toHaveBeenCalledWith('/errores');
    await waitFor(() => {}); // flush act()
  });
});
