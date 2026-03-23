import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2CouponCenter from './V2CouponCenter';
import CouponService from '../../services/CouponService';

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

vi.mock('../../services/CouponService');

describe('V2CouponCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (globalThis.M && globalThis.M.toast) {
      globalThis.M.toast.mockClear();
    }
  });

  it('renders loading state initially', () => {
    CouponService.getCoupons.mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <V2CouponCenter />
      </MemoryRouter>
    );
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('renders coupons after loading', async () => {
    CouponService.getCoupons.mockResolvedValue({
      data: [
        { id: 'c1', code: 'PROMO2025', discount: '20%', description: 'Test Coupon', expires: '2025-12-31', status: 'active' }
      ]
    });

    render(
      <MemoryRouter>
        <V2CouponCenter />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('PROMO2025')).toBeTruthy();
      expect(screen.getByText('20% OFF')).toBeTruthy();
    });
  });

  it('handles copy to clipboard and shows toast', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    CouponService.getCoupons.mockResolvedValue({
      data: [{ id: 'c1', code: 'PROMO2025', discount: '20%', description: 'Test Coupon', expires: '2025-12-31', status: 'active' }]
    });

    render(
      <MemoryRouter>
        <V2CouponCenter />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('PROMO2025'));

    const copyButton = screen.getByText('Copiar Código');
    fireEvent.click(copyButton);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('PROMO2025');
    expect(globalThis.M.toast).toHaveBeenCalledWith({ html: 'Código copiado al portapapeles' });
  });

  it('handles go back button', async () => {
    CouponService.getCoupons.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <V2CouponCenter />
      </MemoryRouter>
    );
    const backButton = screen.getByLabelText('Volver');
    fireEvent.click(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
});
