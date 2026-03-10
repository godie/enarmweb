import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import V2FlashcardStudy from './V2FlashcardStudy';

describe('V2FlashcardStudy', () => {
  it('renders the first flashcard question', () => {
    render(<V2FlashcardStudy />);

    expect(screen.getByText('¿Cuál es la triada de Virchow?')).toBeTruthy();
    expect(screen.queryByText('1. Estasis venosa')).toBeNull();
  });

  it('shows the answer when clicking the card', () => {
    render(<V2FlashcardStudy />);

    const card = screen.getByText('¿Cuál es la triada de Virchow?').closest('.v2-card');
    fireEvent.click(card);

    expect(screen.getByText(/Estasis venosa/)).toBeTruthy();
  });

  it('navigates to the next flashcard after answering', () => {
    render(<V2FlashcardStudy />);

    const card = screen.getByText('¿Cuál es la triada de Virchow?').closest('.v2-card');
    fireEvent.click(card);

    const facilButton = screen.getByText('Fácil').closest('button');
    fireEvent.click(facilButton);

    expect(screen.getByText('Agente causal más común de epiglotitis')).toBeTruthy();
  });

  it('shows finished screen after all cards are done', () => {
    render(<V2FlashcardStudy />);

    // Total 3 cards
    for (let i = 0; i < 3; i++) {
      const card = screen.queryByRole('heading', { level: 2 }).closest('.v2-card');
      fireEvent.click(card);
      const button = screen.getByText('Fácil').closest('button');
      fireEvent.click(button);
    }

    expect(screen.getByText('¡Sesión Completada!')).toBeTruthy();
  });
});
