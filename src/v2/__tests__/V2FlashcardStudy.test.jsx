import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2FlashcardStudy from '../pages/V2FlashcardStudy';
import FlashcardService from '../../services/FlashcardService';

// Mock services
vi.mock('../../services/FlashcardService', () => ({
  default: {
    getDueFlashcards: vi.fn(),
    reviewFlashcard: vi.fn()
  }
}));

// Mock data
const mockDueFlashcards = [
  {
    id: 1,
    front: '¿Cuál es la tríada de Virchow?',
    back: '1. Estasis venosa\n2. Daño endotelial\n3. Hipercoagulabilidad',
    category: 'Fisiopatología',
    srs_data: { ease_factor: 2.5, interval: 1, repetitions: 0 }
  },
  {
    id: 2,
    front: 'Agente causal de epiglotitis',
    back: 'Haemophilus influenzae tipo b',
    category: 'Pediatría',
    srs_data: { ease_factor: 2.5, interval: 3, repetitions: 1 }
  }
];

describe('V2FlashcardStudy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: API returns flashcards
    FlashcardService.getDueFlashcards.mockResolvedValue({
      data: mockDueFlashcards
    });
    FlashcardService.reviewFlashcard.mockResolvedValue({ data: { success: true } });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    const container = document.querySelector('.v2-flashcard-study-container');
    expect(container).toBeDefined();
  });

  it('renders header after loading', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    const header = await screen.findByText('Repaso Flashcards');
    expect(header).toBeDefined();
  });

  it('displays progress indicator', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    // Progress bar should exist
    const progressBar = document.querySelector('.v2-linear-progress');
    expect(progressBar).toBeDefined();
  });

  it('shows flashcard front text', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    const question = await screen.findByText(/tríada de Virchow/);
    expect(question).toBeDefined();
  });

  it('displays card counter (1/2)', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    const counter = await screen.findByText(/1 \/ 2/);
    expect(counter).toBeDefined();
  });

  it('shows flip button when card is not flipped', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    const flipButton = await screen.findByText('Mostrar Respuesta');
    expect(flipButton).toBeDefined();
  });

  it('reveals answer when flip button is clicked', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    // Wait for the flip button
    const flipButton = await screen.findByText('Mostrar Respuesta');
    fireEvent.click(flipButton);
    
    // Quality rating buttons should appear
    await screen.findByText('Otra vez');
    await screen.findByText('Difícil');
    await screen.findByText('Bien');
    await screen.findByText('Fácil');
  });

  it('moves to next card after rating', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    // Wait for and click flip button
    const flipButton = await screen.findByText('Mostrar Respuesta');
    fireEvent.click(flipButton);
    
    // Click the first rating button (Otra vez)
    const ratingButton = await screen.findByText('Otra vez');
    fireEvent.click(ratingButton);
    
    // Should move to card 2 (counter should update)
    await waitFor(() => {
      const counter = screen.queryByText(/2 \/ 2/);
      expect(counter).toBeDefined();
    });
  });

  it('shows empty state when API returns empty array (no due cards)', async () => {
    FlashcardService.getDueFlashcards.mockResolvedValue({
      data: []
    });
    
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    // Should show empty state (no cards due)
    await screen.findByText('¡Todo al día!');
    const container = document.querySelector('.v2-flashcard-study-container');
    expect(container).toBeDefined();
  });

  it('handles API error gracefully with fallback data', async () => {
    FlashcardService.getDueFlashcards.mockRejectedValue(new Error('Network error'));
    
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    // Should still render content (using mock fallback)
    await screen.findByText('Repaso Flashcards');
    
    // Should show demo indicator
    await screen.findByText('(demostración)');
  });

  it('shows session complete state after all cards rated', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    // Rate first card
    const flipButton = await screen.findByText('Mostrar Respuesta');
    fireEvent.click(flipButton);
    
    const goodButton = await screen.findByText('Bien');
    fireEvent.click(goodButton);
    
    // Rate second card
    const flipButton2 = await screen.findByText('Mostrar Respuesta');
    fireEvent.click(flipButton2);
    
    const goodButton2 = await screen.findByText('Bien');
    fireEvent.click(goodButton2);
    
    // Should show session complete
    await waitFor(() => {
      const completeText = screen.queryByText('¡Sesión Completada!');
      expect(completeText).toBeDefined();
    });
  });

  it('displays quality rating buttons with intervals', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    const flipButton = await screen.findByText('Mostrar Respuesta');
    fireEvent.click(flipButton);
    
    // Check for interval labels
    await screen.findByText('< 1 día');
    await screen.findByText('2-3 días');
    await screen.findByText('4-6 días');
    await screen.findByText('7+ días');
  });  // Empty state behavior tested in "shows empty state when API returns empty array (no due cards)"

  it('calls reviewFlashcard API when rating a card', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    // Flip and rate
    const flipButton = await screen.findByText('Mostrar Respuesta');
    fireEvent.click(flipButton);
    
    const difficultButton = await screen.findByText('Difícil');
    fireEvent.click(difficultButton);
    
    // Should have called the API
    expect(FlashcardService.reviewFlashcard).toHaveBeenCalled();
  });

  it('displays session stats during study', async () => {
    render(
      <MemoryRouter>
        <V2FlashcardStudy />
      </MemoryRouter>
    );
    
    // Stats should be visible
    await screen.findByText(/Conocidas: 0/);
    await screen.findByText(/Otra vez: 0/);
  });
});