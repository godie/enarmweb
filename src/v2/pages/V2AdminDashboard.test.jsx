import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2AdminDashboard from './V2AdminDashboard';

describe('V2AdminDashboard', () => {
  it('renders stats after loading', async () => {
    render(
      <MemoryRouter>
        <V2AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('15420')).toBeTruthy();
      expect(screen.getByText(',250.00')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('renders quick actions', async () => {
    render(
      <MemoryRouter>
        <V2AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Gestionar Usuarios')).toBeTruthy();
      expect(screen.getByText('Logs de Actividad')).toBeTruthy();
    });
  });
});
