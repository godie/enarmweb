import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2FlashcardStudy from './V2FlashcardStudy';
import FlashcardService from '../../services/FlashcardService';

// Mock data defined as factory function to avoid hoisting issues
vi.mock('../../services/FlashcardService', () => ({
  default: {
    getDueFlashcards: vi.fn(),
    reviewFlashcard: vi.fn().mockResolvedValue({ success: true })
  }
}));

// Default mock data for most tests
const getMockFlashcards = () => [
  {
    id: 1,
    front: '¿Cuál es la tríada de Virchow?',
    back: '1. Estasis venosa\n2. Daño endotelial\n3. Hipercoagulabilidad',
    category: 'Fisiopatología'
  },
  {
    id: 2,
    front: 'Agente causal más común de epiglotitis',
    back: 'Haemophilus influenzae tipo b (Hib)',
    category: 'Pediatría'
  },
  {
    id: 3,
    front: 'Signo de Murphy positivo indica...',
    back: 'Colecistitis aguda',
    category: 'Cirugía'
  }
];

describe('V2FlashcardStudy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default mock data
    FlashcardService.getDueFlashcards.mockResolvedValue({ data: getMockFlashcards() });
    FlashcardService.reviewFlashcard.mockResolvedValue({ success: true });
  });

  it('renders the first flashcard question', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('¿Cuál es la tríada de Virchow?')).toBeTruthy();
    });
    expect(screen.queryByText('1. Estasis venosa')).toBeNull();
  });

  it('shows the answer when clicking the card', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('¿Cuál es la tríada de Virchow?'));

    const card = screen.getByText('¿Cuál es la tríada de Virchow?').closest('.flashcard-container');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Estasis venosa/)).toBeTruthy();
    });
  });

  it('navigates to the next flashcard after answering', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('¿Cuál es la tríada de Virchow?'));

    const card = screen.getByText('¿Cuál es la tríada de Virchow?').closest('.flashcard-container');
    fireEvent.click(card);

    await waitFor(() => screen.getByText('Fácil'));

    const facilButton = screen.getByText('Fácil');
    fireEvent.click(facilButton);

    await waitFor(() => {
      expect(screen.getByText('Agente causal más común de epiglotitis')).toBeTruthy();
    });
  });

  it('shows finished screen after all cards are done', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('¿Cuál es la tríada de Virchow?'));

    // Total 3 cards
    for (let i = 0; i < 3; i++) {
      await waitFor(() => {
        const flashcard = document.querySelector('.flashcard-container');
        expect(flashcard).toBeTruthy();
      });

      const flashcard = document.querySelector('.flashcard-container');
      fireEvent.click(flashcard);

      await waitFor(() => {
        expect(screen.getByText('Fácil')).toBeTruthy();
      });

      const facilButton = screen.getByText('Fácil');
      fireEvent.click(facilButton);

      // Small delay between cards
      await new Promise(r => setTimeout(r, 50));
    }

    await waitFor(() => {
      expect(screen.getByText('¡Sesión Completada!')).toBeTruthy();
    });
  });

  it('shows empty state when no cards are due', async () => {
    // Set empty mock BEFORE render
    FlashcardService.getDueFlashcards.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('¡Todo al día!')).toBeTruthy();
    });
  });

  it('flips the card when pressing Space', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('¿Cuál es la tríada de Virchow?'));

    fireEvent.keyDown(window, { key: ' ' });

    await waitFor(() => {
      expect(screen.getByText(/Estasis venosa/)).toBeTruthy();
    });
  });

  it('rates the card when pressing numeric keys when flipped', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('¿Cuál es la tríada de Virchow?'));

    // Flip first
    fireEvent.keyDown(window, { key: 'Enter' });
    await waitFor(() => screen.getByText(/Estasis venosa/));

    // Rate with '4' (Fácil)
    fireEvent.keyDown(window, { key: '4' });

    await waitFor(() => {
      expect(screen.getByText('Agente causal más común de epiglotitis')).toBeTruthy();
    });

    expect(FlashcardService.reviewFlashcard).toHaveBeenCalledWith(1, 5); // 4 maps to quality 5
  });

  it('rates the card as "Bien" when pressing Space when flipped', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('¿Cuál es la tríada de Virchow?'));

    // Flip first
    fireEvent.keyDown(window, { key: ' ' });
    await waitFor(() => screen.getByText(/Estasis venosa/));

    // Rate with Space
    fireEvent.keyDown(window, { key: ' ' });

    await waitFor(() => {
      expect(screen.getByText('Agente causal más común de epiglotitis')).toBeTruthy();
    });

    expect(FlashcardService.reviewFlashcard).toHaveBeenCalledWith(1, 4); // Space maps to quality 4
  });
});
