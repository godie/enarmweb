import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2Checkout from './V2Checkout';

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

describe('V2Checkout', () => {
  it('renders plan summary and order summary correctly', () => {
    render(
      <MemoryRouter>
        <V2Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText('Suscripción Premium Mensual')).toBeTruthy();
    expect(screen.getAllByText('$499.00 MXN').length).toBeGreaterThan(0);
  });

  it('simulates payment process', async () => {
    window.alert = vi.fn();
    render(
      <MemoryRouter>
        <V2Checkout />
      </MemoryRouter>
    );

    const payButton = screen.getByText('Confirmar Pago');
    fireEvent.click(payButton);

    expect(screen.getByText('Procesando...')).toBeTruthy();

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('En una implementación real, serás redirigido a Stripe o se procesará el pago aquí.');
    }, { timeout: 2000 });
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
