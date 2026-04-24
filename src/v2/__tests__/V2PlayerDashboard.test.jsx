import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2PlayerDashboard from '../pages/V2PlayerDashboard';
import UserService from '../../services/UserService';
import ExamService from '../../services/ExamService';
import AchievementService from '../../services/AchievementService';

// Mock services
vi.mock('../../services/UserService', () => ({
  default: {
    getUserStats: vi.fn()
  }
}));

vi.mock('../../services/ExamService', () => ({
  default: {
    loadCategories: vi.fn()
  }
}));

vi.mock('../../services/AchievementService', () => ({
  default: {
    getAchievements: vi.fn()
  }
}));

vi.mock('../../modules/Auth', () => ({
  default: {
    getUserInfo: vi.fn(() => ({ name: 'García', id: 1 }))
  }
}));

describe('V2PlayerDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful responses
    UserService.getUserStats.mockResolvedValue({
      data: {
        completed_cases: 15,
        accuracy: 78,
        streak: 5,
        xp: 1500,
        rank: 42
      }
    });
    ExamService.loadCategories.mockResolvedValue({
      data: [
        { id: 1, name: 'Medicina Interna', progress: 74, color: '#0fa397' },
        { id: 2, name: 'Pediatría', progress: 62, color: '#4a6360' }
      ]
    });
    AchievementService.getAchievements.mockResolvedValue({
      data: [
        { id: 1, name: 'Racha de 7 Días', icon: 'emoji_events', color: '#ffd700' }
      ]
    });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <V2PlayerDashboard />
      </MemoryRouter>
    );
    expect(screen.getByText('Cargando...')).toBeDefined();
  });

  it('renders dashboard with user name after loading', async () => {
    render(
      <MemoryRouter>
        <V2PlayerDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Dr. García/)).toBeDefined();
    });
  });

  it('displays stats from API', async () => {
    render(
      <MemoryRouter>
        <V2PlayerDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('78%')).toBeDefined(); // Accuracy
      expect(screen.getByText('15')).toBeDefined(); // Completed cases
    });
  });

  it('displays categories with progress', async () => {
    render(
      <MemoryRouter>
        <V2PlayerDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Medicina Interna')).toBeDefined();
      expect(screen.getByText('74%')).toBeDefined();
    });
  });

  it('displays achievements', async () => {
    render(
      <MemoryRouter>
        <V2PlayerDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Racha de 7 Días')).toBeDefined();
    });
  });

  it('shows quick action buttons', async () => {
    render(
      <MemoryRouter>
        <V2PlayerDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Caso Aleatorio')).toBeDefined();
      expect(screen.getByText('Simulacro Completo')).toBeDefined();
    });
  });

  it('displays XP and streak stats', async () => {
    render(
      <MemoryRouter>
        <V2PlayerDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('5 días')).toBeDefined();
      expect(screen.getByText('1,500 XP')).toBeDefined();
    });
  });

  it('handles API error gracefully with fallback data', async () => {
    UserService.getUserStats.mockRejectedValueOnce(new Error('API Error'));
    
    render(
      <MemoryRouter>
        <V2PlayerDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Dr. García/)).toBeDefined();
      expect(screen.getByText('Usando datos de demostración')).toBeDefined();
    });
  });

  it('renders dominio médico section', async () => {
    render(
      <MemoryRouter>
        <V2PlayerDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Dominios Médicos')).toBeDefined();
    });
  });
});