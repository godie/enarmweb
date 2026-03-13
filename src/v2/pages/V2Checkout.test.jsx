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
