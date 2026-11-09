import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import V2MockExamSetup from './V2MockExamSetup';
import ExamService from '../../services/ExamService';

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

vi.mock('../../services/ExamService', () => ({
  default: {
    loadCategories: vi.fn(),
  },
}));

describe('V2MockExamSetup', () => {
  const mockCategories = [
    { id: '1', nombre: 'Medicina Interna' },
    { id: '2', nombre: 'Pediatría' },
    { id: '3', nombre: 'Cirugía General' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    ExamService.loadCategories.mockResolvedValue({ data: mockCategories });
  });

  it('renders title, categories, question counts, and slider with ARIA attributes', async () => {
    render(<V2MockExamSetup />);

    expect(screen.getByRole('heading', { level: 1, name: /Configurar Simulacro/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Medicina Interna' })).toBeInTheDocument();
    });

    const categoryButton = screen.getByRole('button', { name: 'Medicina Interna' });
    expect(categoryButton).toHaveAttribute('type', 'button');
    expect(categoryButton).toHaveAttribute('aria-pressed', 'false');

    const defaultQuestionsBtn = screen.getByRole('button', { name: '20 preguntas' });
    expect(defaultQuestionsBtn).toHaveAttribute('type', 'button');
    expect(defaultQuestionsBtn).toHaveAttribute('aria-pressed', 'true');

    const rangeSlider = screen.getByRole('slider');
    expect(rangeSlider).toHaveAttribute('aria-labelledby', 'time-limit-heading');
    expect(rangeSlider).toHaveAttribute('aria-valuenow', '30');
    expect(rangeSlider).toHaveAttribute('aria-valuemin', '10');
    expect(rangeSlider).toHaveAttribute('aria-valuemax', '240');
    expect(rangeSlider).toHaveAttribute('aria-valuetext', '30 minutos');
  });

  it('updates selected category on click', async () => {
    render(<V2MockExamSetup />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pediatría' })).toBeInTheDocument();
    });

    const pedBtn = screen.getByRole('button', { name: 'Pediatría' });
    expect(pedBtn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(pedBtn);
    expect(pedBtn).toHaveAttribute('aria-pressed', 'true');
    expect(pedBtn.className).toContain('v2-selected');

    const medBtn = screen.getByRole('button', { name: 'Medicina Interna' });
    expect(medBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('updates question count and summary on question selection', async () => {
    render(<V2MockExamSetup />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '50 preguntas' })).toBeInTheDocument();
    });

    const btn50 = screen.getByRole('button', { name: '50 preguntas' });
    fireEvent.click(btn50);

    expect(btn50).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '20 preguntas' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('updates time limit slider and summary on change', async () => {
    render(<V2MockExamSetup />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Medicina Interna' })).toBeInTheDocument();
    });

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '60' } });

    expect(slider).toHaveAttribute('aria-valuenow', '60');
    expect(slider).toHaveAttribute('aria-valuetext', '60 minutos');
    expect(screen.getByText('60 minutos')).toBeInTheDocument();
  });

  it('navigates to /caso/random when starting exam', async () => {
    render(<V2MockExamSetup />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Medicina Interna' })).toBeInTheDocument();
    });

    const startBtn = screen.getByRole('button', { name: /Comenzar Simulacro/i });
    fireEvent.click(startBtn);

    expect(mockPush).toHaveBeenCalledWith('/caso/random');
  });
});
