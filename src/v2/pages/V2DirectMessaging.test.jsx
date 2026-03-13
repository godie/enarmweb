import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2DirectMessaging from './V2DirectMessaging';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('V2DirectMessaging', () => {
  it('renders messages and handles sending new message', () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );

    expect(screen.getByText('Soporte ENARM')).toBeTruthy();
    expect(screen.getByText(/¡Hola! Bienvenido/)).toBeTruthy();

    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    const sendButton = screen.getByText('send');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Test message')).toBeTruthy();
  });
});
