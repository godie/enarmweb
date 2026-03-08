import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2Login from '../pages/V2Login';

describe('V2Login', () => {
  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <V2Login />
      </MemoryRouter>
    );
    expect(screen.getByText('ENARM V2')).toBeDefined();
    expect(screen.getByPlaceholderText('doctor@medical.com')).toBeDefined();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeDefined();
  });
});
