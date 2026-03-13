import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2DirectMessaging from './V2DirectMessaging';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('V2DirectMessaging', () => {
  it('renders messages and handles sending new message', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );

    expect(screen.getByText('Soporte ENARM')).toBeTruthy();
    expect(screen.getByText(/¡Hola! Bienvenido/)).toBeTruthy();

    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    const form = screen.getByRole('button', { name: 'send' }).closest('form');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(form);

    expect(screen.getByText('Test message')).toBeTruthy();

    await waitFor(() => {
        expect(screen.getByText(/He recibido tu mensaje/i)).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('does not send empty messages', () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    const form = screen.getByRole('button', { name: 'send' }).closest('form');
    const initialMessageCount = screen.getAllByText(/AM|PM/).length;

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);

    const newMessageCount = screen.getAllByText(/AM|PM/).length;
    expect(newMessageCount).toBe(initialMessageCount);
  });
});
