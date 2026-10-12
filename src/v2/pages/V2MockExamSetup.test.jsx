import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2MockExamSetup from './V2MockExamSetup';
import ExamService from '../../services/ExamService';

vi.mock('../../services/ExamService', () => ({
  default: {
    loadCategories: vi.fn(),
  },
}));

const mockPush = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockPush,
    }),
  };
});

describe('V2MockExamSetup', () => {
  const mockCategories = [
    { id: 1, nombre: 'Cardiología' },
    { id: 2, nombre: 'Pediatría' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    ExamService.loadCategories.mockResolvedValue({ data: mockCategories });
  });

  it('renders page header and sections correctly', async () => {
    render(
      <MemoryRouter>
        <V2MockExamSetup />
      </MemoryRouter>
    );

    expect(screen.getByText('Configurar Simulacro')).toBeInTheDocument();
    expect(screen.getByText('Personaliza tu sesión de estudio para el ENARM.')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Cardiología')).toBeInTheDocument();
      expect(screen.getByText('Pediatría')).toBeInTheDocument();
    });
  });

  it('allows toggling category selection with proper aria-pressed state', async () => {
    render(
      <MemoryRouter>
        <V2MockExamSetup />
      </MemoryRouter>
    );

    const categoryBtn = await screen.findByRole('button', { name: /Especialidad: Cardiología/i });
    expect(categoryBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(categoryBtn);
    expect(categoryBtn).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(categoryBtn);
    expect(categoryBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('allows selecting question count and updates aria-pressed and summary', async () => {
    render(
      <MemoryRouter>
        <V2MockExamSetup />
      </MemoryRouter>
    );

    await screen.findByRole('button', { name: /Especialidad: Cardiología/i });

    const btn50 = screen.getByRole('button', { name: '50 preguntas' });
    expect(btn50).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(btn50);
    expect(btn50).toHaveAttribute('aria-pressed', 'true');

    // Default 20 should no longer be pressed
    const btn20 = screen.getByRole('button', { name: '20 preguntas' });
    expect(btn20).toHaveAttribute('aria-pressed', 'false');
  });

  it('updates time limit slider and accessibility attributes', async () => {
    render(
      <MemoryRouter>
        <V2MockExamSetup />
      </MemoryRouter>
    );

    await screen.findByRole('button', { name: /Especialidad: Cardiología/i });

    const slider = screen.getByLabelText('Límite de tiempo en minutos');
    expect(slider).toHaveValue('30');
    expect(slider).toHaveAttribute('aria-valuenow', '30');
    expect(slider).toHaveAttribute('aria-valuetext', '30 minutos');

    fireEvent.change(slider, { target: { value: '60' } });
    expect(slider).toHaveValue('60');
    expect(slider).toHaveAttribute('aria-valuenow', '60');
    expect(slider).toHaveAttribute('aria-valuetext', '60 minutos');
  });

  it('navigates to /caso/random on clicking Comenzar Simulacro', async () => {
    render(
      <MemoryRouter>
        <V2MockExamSetup />
      </MemoryRouter>
    );

    await screen.findByRole('button', { name: /Especialidad: Cardiología/i });

    const startBtn = screen.getByRole('button', { name: /Comenzar Simulacro/i });
    fireEvent.click(startBtn);

    expect(mockPush).toHaveBeenCalledWith('/caso/random');
  });
});
