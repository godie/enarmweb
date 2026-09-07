import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import V2MockExamSetup from './V2MockExamSetup';
import ExamService from '../../services/ExamService';

const mockPush = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockPush
    })
  };
});

vi.mock('../../services/ExamService', () => ({
  default: {
    loadCategories: vi.fn()
  }
}));

describe('V2MockExamSetup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ExamService.loadCategories.mockResolvedValue({
      data: [
        { id: 1, nombre: 'Medicina Interna' },
        { id: 2, nombre: 'Pediatría' }
      ]
    });
  });

  it('renders header and loads categories', async () => {
    render(<V2MockExamSetup />);

    expect(screen.getByText('Configurar Simulacro')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Medicina Interna')).toBeInTheDocument();
      expect(screen.getByText('Pediatría')).toBeInTheDocument();
    });
  });

  it('allows selecting category and updates aria-pressed state', async () => {
    render(<V2MockExamSetup />);

    const specButton = await screen.findByText('Medicina Interna');
    expect(specButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(specButton);
    expect(specButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('allows selecting number of questions and updates summary', async () => {
    render(<V2MockExamSetup />);

    const qButton100 = screen.getByRole('button', { name: '100' });
    expect(qButton100).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(qButton100);
    expect(qButton100).toHaveAttribute('aria-pressed', 'true');

    // Summary section updates
    const summaryCard = screen.getByText('Resumen').closest('section');
    expect(summaryCard).toHaveTextContent('100');

    await waitFor(() => {});
  });

  it('has accessible time limit range input and updates value', async () => {
    render(<V2MockExamSetup />);

    const rangeInput = screen.getByLabelText(/Límite de Tiempo/i);
    expect(rangeInput).toBeInTheDocument();
    expect(rangeInput).toHaveAttribute('aria-valuenow', '30');

    fireEvent.change(rangeInput, { target: { value: '60' } });
    expect(rangeInput).toHaveAttribute('aria-valuenow', '60');
    expect(screen.getByText('60 min')).toBeInTheDocument();

    await waitFor(() => {});
  });

  it('navigates to random case on start button click', async () => {
    render(<V2MockExamSetup />);

    const startBtn = screen.getByRole('button', { name: /Comenzar simulacro con la configuración seleccionada/i });
    fireEvent.click(startBtn);

    expect(mockPush).toHaveBeenCalledWith('/caso/random');

    await waitFor(() => {});
  });
});
