import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import V2KnowledgeBase from './V2KnowledgeBase';

describe('V2KnowledgeBase', () => {
  it('renders correctly with categories', () => {
    render(<V2KnowledgeBase />);

    expect(screen.getByText('Base de Conocimientos')).toBeTruthy();
    expect(screen.getByText('Guías de Práctica Clínica')).toBeTruthy();
    expect(screen.getByText('Esquemas de Vacunación')).toBeTruthy();
  });

  it('expands categories when clicked', () => {
    render(<V2KnowledgeBase />);

    const categoryTitle = screen.getByText('Guías de Práctica Clínica');
    fireEvent.click(categoryTitle);

    expect(screen.getByText('GPC Hipertensión Arterial Sistémica')).toBeTruthy();
    expect(screen.getByText('GPC Diabetes Mellitus Tipo 2')).toBeTruthy();
  });

  it('searches for topics correctly', () => {
    render(<V2KnowledgeBase />);

    const searchInput = screen.getByPlaceholderText('Ej. Diabetes, GPC, Vacunas...');
    fireEvent.change(searchInput, { target: { value: 'Diabetes' } });

    // We need to expand it to see the topic
    fireEvent.click(screen.getByText('Guías de Práctica Clínica'));

    expect(screen.getByText('GPC Diabetes Mellitus Tipo 2')).toBeTruthy();
    expect(screen.queryByText('Esquemas de Vacunación')).toBeNull();
  });

  it('shows no results message for non-existent searches', () => {
    render(<V2KnowledgeBase />);

    const searchInput = screen.getByPlaceholderText('Ej. Diabetes, GPC, Vacunas...');
    fireEvent.change(searchInput, { target: { value: 'Inexistente' } });

    expect(screen.getByText('No se encontraron temas que coincidan con tu búsqueda')).toBeTruthy();
  });
});
