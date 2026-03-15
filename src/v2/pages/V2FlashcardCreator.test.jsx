import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2FlashcardCreator from './V2FlashcardCreator';
import FlashcardService from '../../services/FlashcardService';
import ExamService from '../../services/ExamService';

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

vi.mock('../../services/FlashcardService');
vi.mock('../../services/ExamService');

describe('V2FlashcardCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ExamService.loadCategories.mockResolvedValue({
      data: [{ id: 1, name: 'Pediatría' }]
    });
  });

  it('renders correctly after loading specialties', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardCreator />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Crear Flashcard')).toBeTruthy();
      expect(screen.getByText('Pediatría')).toBeTruthy();
    });
  });

  it('handles form submission', async () => {
    FlashcardService.createFlashcard.mockResolvedValue({ data: { success: true } });

    render(
      <MemoryRouter>
        <V2FlashcardCreator />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Pediatría'));

    fireEvent.change(screen.getByLabelText(/Especialidad/i), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText(/Escribe la pregunta/i), { target: { value: 'Pregunta de prueba' } });
    fireEvent.change(screen.getByPlaceholderText(/Escribe la respuesta/i), { target: { value: 'Respuesta de prueba' } });

    fireEvent.click(screen.getByText('Guardar Flashcard'));

    await waitFor(() => {
      expect(FlashcardService.createFlashcard).toHaveBeenCalledWith({
        front: 'Pregunta de prueba',
        back: 'Respuesta de prueba',
        specialty_id: '1'
      });
      expect(mockPush).toHaveBeenCalledWith('/v2/flashcards/repaso');
    });
  });
});
