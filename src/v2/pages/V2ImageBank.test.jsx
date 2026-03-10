import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import V2ImageBank from './V2ImageBank';

describe('V2ImageBank', () => {
  it('renders correctly with initial images', () => {
    render(<V2ImageBank />);

    expect(screen.getByText('Banco de Imágenes')).toBeTruthy();
    expect(screen.getByText('Radiografía Tórax - Neumonía')).toBeTruthy();
    expect(screen.getByText('TC de Cráneo - Hemorragia')).toBeTruthy();
  });

  it('filters images based on category selection', () => {
    render(<V2ImageBank />);

    const cardioButton = screen.getAllByRole('button', { name: 'Cardiología' })[0];
    fireEvent.click(cardioButton);

    expect(screen.getByText('EKG - Infarto Miocardio')).toBeTruthy();
    expect(screen.queryByText('Radiografía Tórax - Neumonía')).toBeNull();
  });

  it('searches for images correctly', () => {
    render(<V2ImageBank />);

    const searchInput = screen.getByPlaceholderText('Ej. Neumonía, EKG...');
    fireEvent.change(searchInput, { target: { value: 'Fractura' } });

    expect(screen.getByText('RX Ósea - Fractura de Colles')).toBeTruthy();
    expect(screen.queryByText('Radiografía Tórax - Neumonía')).toBeNull();
  });

  it('shows no results message when search fails', () => {
    render(<V2ImageBank />);

    const searchInput = screen.getByPlaceholderText('Ej. Neumonía, EKG...');
    fireEvent.change(searchInput, { target: { value: 'Inexistente' } });

    expect(screen.getByText('No se encontraron imágenes que coincidan con tu búsqueda')).toBeTruthy();
  });
});
