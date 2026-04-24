import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2FlashcardCreator from './V2FlashcardCreator';
import FlashcardService from '../../services/FlashcardService';
import ExamService from '../../services/ExamService';

vi.mock('../../services/FlashcardService');
vi.mock('../../services/ExamService');

const mockPush = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockPush,
      goBack: vi.fn()
    })
  };
});

describe('V2FlashcardCreator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock specialty categories - use IDs that match MOCK_SPECIALTIES fallback
    ExamService.loadCategories.mockResolvedValue({
      data: [] // Empty triggers fallback to MOCK_SPECIALTIES in component
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
      expect(screen.getByText('Cardiología')).toBeTruthy(); // From MOCK_SPECIALTIES fallback
    });
  });

  it('handles form submission', async () => {
    FlashcardService.createFlashcard.mockResolvedValue({ data: { success: true } });

    render(
      <MemoryRouter>
        <V2FlashcardCreator />
      </MemoryRouter>
    );

    // Wait for specialties to load (from MOCK_SPECIALTIES fallback)
    await waitFor(() => screen.getByText('Cardiología'));

    // Select first specialty (id: 1)
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });
    
    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText(/pregunta o concepto/i), { target: { value: 'Pregunta de prueba' } });
    fireEvent.change(screen.getByPlaceholderText(/respuesta detallada/i), { target: { value: 'Respuesta de prueba' } });

    // Submit the form
    const saveButton = screen.getByRole('button', { name: /guardar flashcard/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      // The component uses parseInt for specialty_id, so it will be a number
      expect(FlashcardService.createFlashcard).toHaveBeenCalledWith(
        expect.objectContaining({
          front: 'Pregunta de prueba',
          back: 'Respuesta de prueba',
          specialty_id: 1
        })
      );
    });
  });
});
