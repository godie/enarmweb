import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2AdminUsers from './V2AdminUsers';
import UserService from '../../services/UserService';

vi.mock('../../services/UserService');

describe('V2AdminUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user list correctly', async () => {
    UserService.getUsers.mockResolvedValue({
      data: [
        { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'Admin', status: 'active' },
        { id: 2, name: 'Premium User', email: 'premium@test.com', role: 'Premium', status: 'active' }
      ]
    });

    render(
      <MemoryRouter>
        <V2AdminUsers />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeTruthy();
      expect(screen.getByText('premium@test.com')).toBeTruthy();
    });
  });

  it('handles empty user list', async () => {
    UserService.getUsers.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <V2AdminUsers />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No hay usuarios registrados/i)).toBeTruthy();
    });
  });
});
