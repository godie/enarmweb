import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, useHistory } from 'react-router-dom';
import V2Examen from '../pages/V2Examen';
import ExamService from '../../services/ExamService';

// Mock services
vi.mock('../../services/ExamService', () => ({
  default: {
    getCaso: vi.fn(),
    loadRandomCaso: vi.fn(),
    sendAnswers: vi.fn()
  }
}));

vi.mock('../../modules/Auth', () => ({
  default: {
    getUserInfo: vi.fn(() => ({ name: 'García', id: 1 }))
  }
}));

const mockCaso = {
  id: 1,
  identificador: 'Caso Clínico #100',
  texto: 'Paciente masculino de 50 años con dolor torácico.',
  preguntas: [
    {
      id: 1,
      texto: '¿Cuál es el primer paso?',
      respuestas: [
        { texto: 'ECG', is_correct: true },
        { texto: 'Radiografía', is_correct: false }
      ]
    }
  ],
  pearl: 'El ECG es fundamental en el dolor torácico.'
};

describe('V2Examen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ExamService.getCaso.mockResolvedValue({ data: mockCaso });
    ExamService.sendAnswers.mockResolvedValue({ data: { success: true } });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    expect(screen.getByText('Cargando caso...')).toBeDefined();
  });

  it('renders case text after loading', async () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    // Use findBy for robust async handling
    const caseHeader = await screen.findByText('Caso Clínico #100');
    expect(caseHeader).toBeDefined();
  });

  it('displays question text', async () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    const questionText = await screen.findByText('¿Cuál es el primer paso?');
    expect(questionText).toBeDefined();
  });

  it('displays answer options', async () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    // Find both answer options
    const ecgOption = await screen.findByText('ECG');
    const xrayOption = await screen.findByText('Radiografía');
    expect(ecgOption).toBeDefined();
    expect(xrayOption).toBeDefined();
  });

  it('allows selecting an answer', async () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    // Wait for the case to load
    await screen.findByText('ECG');
    
    // Click on the ECG option (Option A) - aria-label uses lowercase
    const ecgButton = await screen.findByRole('button', { name: /Opción A: ECG/i });
    fireEvent.click(ecgButton);
    
    // Confirm button should be enabled after selection - aria-label is 'Confirmar respuesta'
    const confirmBtn = await screen.findByRole('button', { name: /Confirmar respuesta/i });
    expect(confirmBtn).not.toBeDisabled();
  });

  it('shows feedback after submitting answer', async () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    // Wait for the case to load
    await screen.findByText('ECG');
    
    // Select answer
    const ecgButton = await screen.findByRole('button', { name: /Opción A: ECG/i });
    fireEvent.click(ecgButton);
    
    // Submit - use lowercase in aria-label
    const confirmBtn = await screen.findByRole('button', { name: /Confirmar respuesta/i });
    fireEvent.click(confirmBtn);
    
    // Check feedback appears - XP indicator should show
    await waitFor(() => {
      expect(screen.getByText('+50 XP')).toBeDefined();
    });
    
    // Medical pearl should also appear
    const pearl = await screen.findByText('Perla Médica');
    expect(pearl).toBeDefined();
  });

  it('displays timer that starts at 00:00', async () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    // Wait for timer to appear - it starts at 00:00
    const timer = await screen.findByText('00:00');
    expect(timer).toBeDefined();
  });

  it('displays exit button', async () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    const exitBtn = await screen.findByRole('button', { name: /Salir/ });
    expect(exitBtn).toBeDefined();
  });

  it('shows error message on API failure with fallback', async () => {
    // Mock returns fallback data after error
    ExamService.getCaso.mockRejectedValueOnce(new Error('API Error'));
    
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    // Should render with fallback mock data
    const fallbackCase = await screen.findByText('Caso Clínico #124');
    expect(fallbackCase).toBeDefined();
  });

  it('shows session active indicator', async () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    const sessionIndicator = await screen.findByText('Sesión Activa');
    expect(sessionIndicator).toBeDefined();
  });

  it('displays progress indicator', async () => {
    render(
      <MemoryRouter initialEntries={['/caso/1']}>
        <V2Examen />
      </MemoryRouter>
    );
    
    // Progress indicator shows 1/1 for single question case
    await waitFor(() => {
      expect(screen.getByText('1/1')).toBeDefined();
    });
  });
});