import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2AIFlashcardGenerator from './V2AIFlashcardGenerator';

describe('V2AIFlashcardGenerator', () => {
  it('renders generator form', () => {
    render(
      <MemoryRouter>
        <V2AIFlashcardGenerator />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Ej: Diabetes Mellitus Tipo 2/i)).toBeTruthy();
    expect(screen.getByText('Generar Sugerencias')).toBeTruthy();
  });

  it('generates suggestions on form submission', async () => {
    render(
      <MemoryRouter>
        <V2AIFlashcardGenerator />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Ej: Diabetes Mellitus Tipo 2/i), { target: { value: 'HTA' } });
    fireEvent.click(screen.getByText('Generar Sugerencias'));

    expect(screen.getByText('Generando...')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Sugerencias Generadas')).toBeTruthy();
      expect(screen.getByText(/Q: Signo de Murphy positivo indica:/i)).toBeTruthy();
    }, { timeout: 2000 });
  });
});
