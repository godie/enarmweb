import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2CouponCenter from './V2CouponCenter';

const mockGoBack = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      goBack: mockGoBack
    })
  };
});

describe('V2CouponCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <V2CouponCenter />
      </MemoryRouter>
    );
    // Find by class instead of role since materialize preloader might not have role progressbar by default
    expect(document.querySelector('.preloader-wrapper')).toBeTruthy();
  });

  it('renders coupons after loading', async () => {
    render(
      <MemoryRouter>
        <V2CouponCenter />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('BIENVENIDO25')).toBeTruthy();
      expect(screen.getByText('STUDENTLIFE')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('handles copy to clipboard', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(
      <MemoryRouter>
        <V2CouponCenter />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('BIENVENIDO25'));

    const copyButtons = screen.getAllByText('Copiar Código');
    fireEvent.click(copyButtons[0]);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('BIENVENIDO25');
  });

  it('disables copy button for expired coupons', async () => {
    render(
      <MemoryRouter>
        <V2CouponCenter />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('EXPIRED10'));

    const expiredButton = screen.getAllByRole('button', { name: /Copiar Código/i }).find(btn => btn.disabled);
    expect(expiredButton).toBeTruthy();
  });
});
