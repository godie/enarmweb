import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2CaseStudy from './V2CaseStudy';

// Mock useHistory
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      goBack: vi.fn(),
      push: vi.fn()
    }),
    useParams: () => ({
      id: 'test-case-id'
    })
  };
});

describe('V2CaseStudy', () => {
  it('renders case information correctly after loading', async () => {
    render(
      <MemoryRouter>
        <V2CaseStudy />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Caso Clínico: Lactante con Dificultad Respiratoria')).toBeTruthy();
    }, { timeout: 2000 });

    expect(screen.getByText('Pediatría • Media')).toBeTruthy();
    expect(screen.getByText('Bronquiolitis aguda')).toBeTruthy();
    expect(screen.getByText('Virus Sincitial Respiratorio (VSR)')).toBeTruthy();
  });
});
