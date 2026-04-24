import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2ErrorReview from './V2ErrorReview';
import ExamService from '../../services/ExamService';

// Mock ExamService to prevent real API calls
vi.mock('../../services/ExamService', () => ({
  default: {
    getUserAnswers: vi.fn().mockResolvedValue({ data: [] }) // Empty triggers mock fallback
  }
}));

describe('V2ErrorReview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Trigger mock data fallback by returning empty array
    ExamService.getUserAnswers.mockResolvedValue({ data: [] });
  });

  it('renders correctly with error statistics', async () => {
    render(
      <MemoryRouter>
        <V2ErrorReview />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Revisión de Errores')).toBeTruthy();
    });
    
    // Check specialties are displayed (mock data has Cardiología, Ginecología, etc.)
    expect(screen.getAllByText(/Cardiología|Ginecología|Pediatría/).length).toBeGreaterThan(0);
  });

  it('displays the list of failed questions with answers and explanations', async () => {
    render(
      <MemoryRouter>
        <V2ErrorReview />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Preguntas Falladas/)).toBeTruthy();
      expect(screen.getByText(/Paciente masculino de 45 años/)).toBeTruthy();
      expect(screen.getByText(/Infarto Agudo al Miocardio/)).toBeTruthy();
    });
    
    expect(screen.getByText(/Angina Inestable/)).toBeTruthy();
  });

  it('shows the correct total error count', async () => {
    render(
      <MemoryRouter>
        <V2ErrorReview />
      </MemoryRouter>
    );

    // Mock data has 5 items
    await waitFor(() => {
      expect(screen.getByText('5')).toBeTruthy(); // Total errors from mock data
    });
  });
});
