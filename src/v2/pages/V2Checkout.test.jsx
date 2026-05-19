import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2Checkout from './V2Checkout';
import PaymentService from '../../services/PaymentService';

// Mock useHistory
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

vi.mock('../../services/PaymentService');

describe('V2Checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders order summary correctly', () => {
    render(
      <MemoryRouter>
        <V2Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText('Suscripción Premium Mensual')).toBeTruthy();
    expect(screen.getByText('46.84')).toBeTruthy();
  });

  it('handles promo code input', () => {
    render(
      <MemoryRouter>
        <V2Checkout />
      </MemoryRouter>
    );

    const promoInput = screen.getByPlaceholderText('Código promo');
    fireEvent.change(promoInput, { target: { value: 'DESC50' } });
    expect(promoInput.value).toBe('DESC50');

    expect(screen.getByText('Descuento')).toBeTruthy();
  });

  it('handles payment redirection to Stripe', async () => {
    // Mock window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, href: '' };

    PaymentService.createCheckoutSession.mockResolvedValue({
      data: { url: 'https://checkout.stripe.com/test' }
    });

    render(
      <MemoryRouter>
        <V2Checkout />
      </MemoryRouter>
    );

    const payButton = screen.getByText('Continuar con Stripe');
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(window.location.href).toBe('https://checkout.stripe.com/test');
    });

    window.location = originalLocation;
  });

  it('shows error message on payment failure', async () => {
    PaymentService.createCheckoutSession.mockRejectedValue(new Error('Payment failed'));

    render(
      <MemoryRouter>
        <V2Checkout />
      </MemoryRouter>
    );

    const payButton = screen.getByText('Continuar con Stripe');
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(screen.getByText(/No se pudo iniciar el proceso de pago/i)).toBeTruthy();
    });
  });

  it('navigates back when back button is clicked', () => {
    render(
      <MemoryRouter>
        <V2Checkout />
      </MemoryRouter>
    );

    const backButton = screen.getByText('arrow_back');
    fireEvent.click(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
});
