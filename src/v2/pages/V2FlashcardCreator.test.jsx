import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2FlashcardCreator from './V2FlashcardCreator';

const mockPush = vi.fn();
const mockGoBack = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockPush,
      goBack: mockGoBack
    })
  };
});

describe('V2FlashcardCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    render(
      <MemoryRouter>
        <V2FlashcardCreator />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Especialidad/i)).toBeTruthy();
    expect(screen.getByLabelText(/Anverso/i)).toBeTruthy();
    expect(screen.getByLabelText(/Reverso/i)).toBeTruthy();
  });

  it('handles form submission', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardCreator />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Especialidad/i), { target: { value: 'pediatria' } });
    fireEvent.change(screen.getByLabelText(/Anverso/i), { target: { value: 'Pregunta' } });
    fireEvent.change(screen.getByLabelText(/Reverso/i), { target: { value: 'Respuesta' } });

    fireEvent.click(screen.getByText('Guardar Flashcard'));

    expect(screen.getByText('Guardando...')).toBeTruthy();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/v2/repaso');
    }, { timeout: 2000 });
  });
});
