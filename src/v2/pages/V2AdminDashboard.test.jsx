import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2AdminDashboard from './V2AdminDashboard';
import UserService from '../../services/UserService';

vi.mock('../../services/UserService');

describe('V2AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders admin stats correctly', async () => {
    UserService.getAdminStats.mockResolvedValue({
      data: {
        totalUsers: 100,
        activeUsersToday: 10,
        newSubscriptions: 2,
        revenueToday: '$200.00'
      }
    });

    render(
      <MemoryRouter>
        <V2AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('100')).toBeTruthy();
      expect(screen.getByText('$200.00')).toBeTruthy();
    });
  });

  it('renders error state when API fails', async () => {
    UserService.getAdminStats.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <V2AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar estadísticas/i)).toBeTruthy();
    });
  });
});
