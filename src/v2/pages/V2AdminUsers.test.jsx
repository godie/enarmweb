import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2AdminUsers from './V2AdminUsers';

describe('V2AdminUsers', () => {
  it('renders user list after loading', async () => {
    render(
      <MemoryRouter>
        <V2AdminUsers />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeTruthy();
      expect(screen.getByText('maria@example.com')).toBeTruthy();
      expect(screen.getByText('Admin')).toBeTruthy();
    }, { timeout: 2000 });
  });
});
