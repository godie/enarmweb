import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2Signup from '../pages/V2Signup';

describe('V2Signup', () => {
  it('renders signup form correctly', () => {
    render(
      <MemoryRouter>
        <V2Signup />
      </MemoryRouter>
    );
    expect(screen.getByText('Crear Cuenta')).toBeDefined();
    expect(screen.getByPlaceholderText('Dr. García')).toBeDefined();
    expect(screen.getByRole('button', { name: /Registrarse/i })).toBeDefined();
  });
});
