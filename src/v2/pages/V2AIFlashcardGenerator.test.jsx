import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2AIFlashcardGenerator from './V2AIFlashcardGenerator';
import AIService from '../../services/AIService';
import FlashcardService from '../../services/FlashcardService';

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

vi.mock('../../services/AIService');
vi.mock('../../services/FlashcardService');

describe('V2AIFlashcardGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates suggestions on form submit', async () => {
    AIService.generateFlashcards.mockResolvedValue({
      data: [
        { front: 'AI Question', back: 'AI Answer' }
      ]
    });

    render(
      <MemoryRouter>
        <V2AIFlashcardGenerator />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Diabetes Mellitus/i), { target: { value: 'Diabetes' } });
    fireEvent.click(screen.getByText('Generar Sugerencias'));

    await waitFor(() => {
      expect(screen.getByText('Q: AI Question')).toBeTruthy();
      expect(screen.getByText('A: AI Answer')).toBeTruthy();
    });
  });

  it('saves all suggestions', async () => {
    AIService.generateFlashcards.mockResolvedValue({
      data: [{ front: 'Q1', back: 'A1' }, { front: 'Q2', back: 'A2' }]
    });
    FlashcardService.createFlashcard.mockResolvedValue({});

    render(
      <MemoryRouter>
        <V2AIFlashcardGenerator />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Diabetes Mellitus/i), { target: { value: 'Diabetes' } });
    fireEvent.click(screen.getByText('Generar Sugerencias'));

    await waitFor(() => screen.getByText('Guardar Todas'));
    fireEvent.click(screen.getByText('Guardar Todas'));

    await waitFor(() => {
      expect(FlashcardService.createFlashcard).toHaveBeenCalledTimes(2);
      expect(mockPush).toHaveBeenCalledWith('/v2/flashcards/repaso');
    });
  });
});
