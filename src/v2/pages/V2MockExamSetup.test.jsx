import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

vi.mock('../../services/ExamService');

describe('V2MockExamSetup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title, options, and accessibility attributes correctly', async () => {
    ExamService.loadCategories.mockResolvedValue({
      data: [
        { id: '1', nombre: 'Pediatría' },
        { id: '2', nombre: 'Cirugía' }
      ]
    });

    render(
      <MemoryRouter>
        <V2MockExamSetup />
      </MemoryRouter>
    );

    expect(screen.getByText('Configurar Simulacro')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Pediatría')).toBeTruthy();
      expect(screen.getByText('Cirugía')).toBeTruthy();
    });

    const pedBtn = screen.getByText('Pediatría');
    expect(pedBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(pedBtn);
    expect(pedBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('handles question count selection and updates aria-pressed', async () => {
    ExamService.loadCategories.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <V2MockExamSetup />
      </MemoryRouter>
    );

    await waitFor(() => {});

    const btn10 = screen.getByRole('button', { name: '10 preguntas' });
    const btn20 = screen.getByRole('button', { name: '20 preguntas' });

    expect(btn20.getAttribute('aria-pressed')).toBe('true');
    expect(btn10.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(btn10);

    expect(btn10.getAttribute('aria-pressed')).toBe('true');
    expect(btn20.getAttribute('aria-pressed')).toBe('false');
  });

  it('handles range input changes and reflects ARIA attributes', async () => {
    ExamService.loadCategories.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <V2MockExamSetup />
      </MemoryRouter>
    );

    await waitFor(() => {});

    const rangeInput = screen.getByLabelText('Límite de tiempo en minutos');
    expect(rangeInput).toBeTruthy();
    expect(rangeInput.getAttribute('aria-valuenow')).toBe('30');
    expect(rangeInput.getAttribute('aria-valuetext')).toBe('30 minutos');

    fireEvent.change(rangeInput, { target: { value: '60' } });

    expect(rangeInput.getAttribute('aria-valuenow')).toBe('60');
    expect(rangeInput.getAttribute('aria-valuetext')).toBe('60 minutos');
  });

  it('navigates when starting mock exam', async () => {
    ExamService.loadCategories.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <V2MockExamSetup />
      </MemoryRouter>
    );

    await waitFor(() => {});

    const startBtn = screen.getByText('Comenzar Simulacro');
    fireEvent.click(startBtn);

    expect(mockPush).toHaveBeenCalledWith('/caso/random');
  });
});
