import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2SubscriptionManagement from './V2SubscriptionManagement';

describe('V2SubscriptionManagement', () => {
  it('renders subscription information and handles cancel dialog', () => {
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

    const keepButton = screen.getByText('Mantener');
    fireEvent.click(keepButton);

    expect(screen.queryByText('¿Estás seguro?')).toBeNull();
  });
});
