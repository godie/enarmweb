import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2SessionSummary from '../pages/V2SessionSummary';
import LeaderboardService from '../../services/LeaderboardService';

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

// Mock useHistory and useLocation
const mockPush = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockPush,
    }),
    useLocation: () => ({
      state: {
        totalQuestions: 5,
        correctAnswers: 4,
        xpEarned: 200,
        timeElapsed: 300
      }
    })
  };
});

describe('V2SessionSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    LeaderboardService.getTopUsers.mockResolvedValue({
      data: [
        { id: 1, name: 'Current User' },
        { id: 2, name: 'Other User' }
      ]
    });
  });

  it('renders session completed header', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const header = await screen.findByText('¡Sesión Completada!');
    expect(header).toBeDefined();
    await waitFor(() => {});
  });

  it('displays accuracy percentage', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const percentages = await screen.findAllByText('80%');
    expect(percentages.length).toBeGreaterThan(0);
    await waitFor(() => {});
  });

  it('displays XP earned', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const xpText = await screen.findByText('+200');
    expect(xpText).toBeDefined();
    await waitFor(() => {});
  });

  it('displays time elapsed', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const timeText = await screen.findByText('05:00');
    expect(timeText).toBeDefined();
    await waitFor(() => {});
  });

  it('displays correct/incorrect breakdown', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const section = await screen.findByText('Resumen de la Sesión');
    expect(section).toBeDefined();
    
    const correctLabel = await screen.findByText('Respuestas Correctas');
    expect(correctLabel).toBeDefined();
    
    const incorrectLabel = await screen.findByText('Respuestas Incorrectas');
    expect(incorrectLabel).toBeDefined();
    await waitFor(() => {});
  });

  it('shows go to dashboard button and navigates', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const dashboardBtn = await screen.findByRole('button', { name: /Inicio/i });
    expect(dashboardBtn).toBeDefined();
    fireEvent.click(dashboardBtn);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    await waitFor(() => {});
  });

  it('shows review mistakes button and navigates', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const reviewBtn = await screen.findByRole('button', { name: /Revisar Errores/i });
    expect(reviewBtn).toBeDefined();
    fireEvent.click(reviewBtn);
    expect(mockPush).toHaveBeenCalledWith('/errores');
    await waitFor(() => {});
  });

  it('shows new session button and navigates', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const newSessionBtn = await screen.findByRole('button', { name: /Nueva Sesión/i });
    expect(newSessionBtn).toBeDefined();
    fireEvent.click(newSessionBtn);
    expect(mockPush).toHaveBeenCalledWith('/practica');
    await waitFor(() => {});
  });

  it('displays performance bar', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const performanceBar = await screen.findByText('Rendimiento General');
    expect(performanceBar).toBeDefined();
    await waitFor(() => {});
  });

  it('handles API error gracefully', async () => {
    LeaderboardService.getTopUsers.mockRejectedValueOnce(new Error('API Error'));
    
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    // Should still show main stats even if leaderboard fails
    const xpText = await screen.findByText('+200');
    expect(xpText).toBeDefined();
    await waitFor(() => {});
  });

  it('shows quick links section', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const exploreText = await screen.findByText('Explora más contenido');
    expect(exploreText).toBeDefined();
    
    const flashcardsLink = await screen.findByText('Flashcards');
    expect(flashcardsLink).toBeDefined();
    await waitFor(() => {});
  });

  describe('Keyboard Shortcuts', () => {
    it('triggers Nueva Sesión on Enter key', async () => {
      render(
        <MemoryRouter>
          <V2SessionSummary />
        </MemoryRouter>
      );

      fireEvent.keyDown(window, { key: 'Enter' });
      expect(mockPush).toHaveBeenCalledWith('/practica');
      await waitFor(() => {});
    });

    it('triggers Inicio on "i" key', async () => {
      render(
        <MemoryRouter>
          <V2SessionSummary />
        </MemoryRouter>
      );

      fireEvent.keyDown(window, { key: 'i' });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      await waitFor(() => {});
    });

    it('triggers Revisar Errores on "r" key when there are errors', async () => {
      render(
        <MemoryRouter>
          <V2SessionSummary />
        </MemoryRouter>
      );

      fireEvent.keyDown(window, { key: 'r' });
      expect(mockPush).toHaveBeenCalledWith('/errores');
      await waitFor(() => {});
    });

    it('does not trigger shortcuts when focusing on input', async () => {
      render(
        <MemoryRouter>
          <V2SessionSummary />
          <input data-testid="test-input" />
        </MemoryRouter>
      );

      const input = screen.getByTestId('test-input');
      input.focus();

      fireEvent.keyDown(input, { key: 'Enter' });
      expect(mockPush).not.toHaveBeenCalled();
      await waitFor(() => {});
    });
  });
});
