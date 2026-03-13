import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2CaseStudy from './V2CaseStudy';

const mockGoBack = vi.fn();
const mockPush = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      goBack: mockGoBack,
      push: mockPush
    }),
    useParams: () => ({ id: 'case1' })
  };
});

describe('V2CaseStudy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders case details after loading', async () => {
    render(
      <MemoryRouter>
        <V2CaseStudy />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Caso Clínico: Lactante con Dificultad Respiratoria')).toBeTruthy();
      expect(screen.getByText('Bronquiolitis aguda')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('navigates back and to practice', async () => {
    render(
      <MemoryRouter>
        <V2CaseStudy />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Siguiente Caso'));

    fireEvent.click(screen.getByText('arrow_back'));
    expect(mockGoBack).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Siguiente Caso'));
    expect(mockPush).toHaveBeenCalledWith('/v2/practica');
  });

  it('shows questions feedback', async () => {
    render(
        <MemoryRouter>
          <V2CaseStudy />
        </MemoryRouter>
      );

      await waitFor(() => screen.getByText('Revisión de Preguntas'));

      expect(screen.getByText(/¿Cuál es el agente etiológico más frecuente?/i)).toBeTruthy();
      // Use exact text from the component
      expect(screen.getByText(/Virus Sincitial Respiratorio \(VSR\)/i)).toBeTruthy();
  });
});
