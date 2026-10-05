import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import V2ForgotPassword from '../pages/V2ForgotPassword';

const mockPush = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockPush,
    }),
  };
});

vi.mock('../../services/AlertService', () => ({
  alertSuccess: vi.fn(),
  alertError: vi.fn(),
}));

describe('V2ForgotPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial recovery form with email input and back link', () => {
    render(
      <MemoryRouter>
        <V2ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Recuperar Acceso/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar Instrucciones/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Regresar al Login/i })).toHaveAttribute('href', '/v2/login');
  });

  it('handles reset request submission and shows success state', async () => {
    render(
      <MemoryRouter>
        <V2ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

    const submitBtn = screen.getByRole('button', { name: /Enviar Instrucciones/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Procesando.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Las instrucciones han sido enviadas a tu correo./i)).toBeInTheDocument();
    }, { timeout: 2000 });

    const backBtn = screen.getByRole('button', { name: /Volver al Inicio de Sesión/i });
    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith('/v2/login');
  });
});
