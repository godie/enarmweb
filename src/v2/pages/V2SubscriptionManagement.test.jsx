import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2SubscriptionManagement from './V2SubscriptionManagement';

describe('V2SubscriptionManagement', () => {
  it('renders subscription information and handles cancel dialog', () => {
    window.alert = vi.fn();
    render(
      <MemoryRouter>
        <V2SubscriptionManagement />
      </MemoryRouter>
    );

    expect(screen.getByText('Premium Mensual')).toBeTruthy();
    expect(screen.getByText('Activa')).toBeTruthy();
    expect(screen.getByText('**** 4242 (Visa)')).toBeTruthy();

    const cancelButton = screen.getByText('Cancelar Suscripción');
    fireEvent.click(cancelButton);

    expect(screen.getByText('¿Estás seguro?')).toBeTruthy();

    const confirmCancel = screen.getByText('Sí, cancelar');
    fireEvent.click(confirmCancel);
    expect(window.alert).toHaveBeenCalledWith("Suscripción cancelada correctamente.");
    expect(screen.queryByText('¿Estás seguro?')).toBeNull();
  });
});
