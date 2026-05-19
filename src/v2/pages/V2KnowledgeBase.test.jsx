import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import V2KnowledgeBase from './V2KnowledgeBase';
import KnowledgeBaseService from '../../services/KnowledgeBaseService';

vi.mock('../../services/KnowledgeBaseService', () => ({
  default: {
    getTopics: vi.fn()
  }
}));

describe('V2KnowledgeBase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    KnowledgeBaseService.getTopics.mockResolvedValue({
      data: {
        topics: [
          {
            id: 1,
            title: 'Guías de Práctica Clínica',
            articles: [
              { id: 101, title: 'GPC Hipertensión Arterial Sistémica' },
              { id: 102, title: 'GPC Diabetes Mellitus Tipo 2' }
            ]
          },
          {
            id: 2,
            title: 'Esquemas de Vacunación',
            articles: [
              { id: 201, title: 'Vacunación Infantil' }
            ]
          }
        ]
      }
    });
  });

  it('renders correctly with categories', async () => {
    render(<V2KnowledgeBase />);

    await waitFor(() => {
      expect(screen.getByText('Base de Conocimientos')).toBeTruthy();
    });
    expect(screen.getByText('Guías de Práctica Clínica')).toBeTruthy();
    expect(screen.getByText('Esquemas de Vacunación')).toBeTruthy();
  });

  it('expands categories when clicked', async () => {
    render(<V2KnowledgeBase />);

    await waitFor(() => {
      expect(screen.getByText('Guías de Práctica Clínica')).toBeTruthy();
    });

    const categoryTitle = screen.getByText('Guías de Práctica Clínica');
    fireEvent.click(categoryTitle);

    await waitFor(() => {
      expect(screen.getByText('GPC Hipertensión Arterial Sistémica')).toBeTruthy();
    });
    expect(screen.getByText('GPC Diabetes Mellitus Tipo 2')).toBeTruthy();
  });

  it('searches for topics correctly', async () => {
    render(<V2KnowledgeBase />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ej. Diabetes, GPC, Vacunas...')).toBeTruthy();
    });

    const searchInput = screen.getByPlaceholderText('Ej. Diabetes, GPC, Vacunas...');
    fireEvent.change(searchInput, { target: { value: 'Diabetes' } });

    // The search filters topics; only matching topics should remain
    expect(screen.queryByText('Esquemas de Vacunación')).toBeNull();
    expect(screen.getByText('Guías de Práctica Clínica')).toBeTruthy();
  });

  it('shows no results message for non-existent searches', async () => {
    render(<V2KnowledgeBase />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ej. Diabetes, GPC, Vacunas...')).toBeTruthy();
    });

    const searchInput = screen.getByPlaceholderText('Ej. Diabetes, GPC, Vacunas...');
    fireEvent.change(searchInput, { target: { value: 'Inexistente' } });

    expect(screen.getByText('No se encontraron temas que coincidan con tu búsqueda')).toBeTruthy();
  });
});
