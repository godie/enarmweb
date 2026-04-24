import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

// Mock useLocation - must be done at module level
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
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
    // Mock resolves immediately to avoid async timeout
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
    
    // Use findBy which is more robust
    const header = await screen.findByText('¡Sesión Completada!');
    expect(header).toBeDefined();
  });

  it('displays accuracy percentage', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    // 80% appears in multiple places - use findAllByText and check content
    const percentages = await screen.findAllByText('80%');
    expect(percentages.length).toBeGreaterThan(0);
  });

  it('displays XP earned', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const xpText = await screen.findByText('+200');
    expect(xpText).toBeDefined();
  });

  it('displays time elapsed', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const timeText = await screen.findByText('05:00');
    expect(timeText).toBeDefined();
  });

  it('displays correct/incorrect breakdown', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    // Find the section and check for correct/incorrect texts
    const section = await screen.findByText('Resumen de la Sesión');
    expect(section).toBeDefined();
    
    // Check for the labels
    const correctLabel = await screen.findByText('Respuestas Correctas');
    expect(correctLabel).toBeDefined();
    
    const incorrectLabel = await screen.findByText('Respuestas Incorrectas');
    expect(incorrectLabel).toBeDefined();
  });

  it('shows go to dashboard button', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    // Look for the button with 'Inicio' text and home icon
    const dashboardBtn = await screen.findByRole('button', { name: /Inicio/i });
    expect(dashboardBtn).toBeDefined();
  });

  it('shows review mistakes button when there are incorrect answers', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const reviewBtn = await screen.findByRole('button', { name: /Revisar Errores/i });
    expect(reviewBtn).toBeDefined();
  });

  it('shows new session button', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const newSessionBtn = await screen.findByRole('button', { name: /Nueva Sesión/i });
    expect(newSessionBtn).toBeDefined();
  });

  it('displays performance bar', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const performanceBar = await screen.findByText('Rendimiento General');
    expect(performanceBar).toBeDefined();
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
  });

  it('shows quick links section', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const exploreText = await screen.findByText('Explora más contenido');
    expect(exploreText).toBeDefined();
    
    // Quick links are Links, not buttons
    const flashcardsLink = await screen.findByText('Flashcards');
    expect(flashcardsLink).toBeDefined();
  });

  it('displays session summary section', async () => {
    render(
      <MemoryRouter>
        <V2SessionSummary />
      </MemoryRouter>
    );
    
    const summarySection = await screen.findByText('Resumen de la Sesión');
    expect(summarySection).toBeDefined();
  });
});