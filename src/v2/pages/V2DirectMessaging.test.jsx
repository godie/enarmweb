import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2DirectMessaging from './V2DirectMessaging';
import MessageService from '../../services/MessageService';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock data that matches component's MOCK_CONVERSATIONS
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    participant: { id: 10, name: 'Dra. García', role: 'support', avatar: 'support_agent' },
    last_message: 'Estamos revisando el caso que reportaste.',
    last_message_time: '2025-01-15T10:30:00Z',
    unread_count: 1
  }
];

const MOCK_MESSAGES = [
  { id: 101, text: '¡Hola! Bienvenido a la comunidad ENARM V2.', sender_id: 10, time: '2025-01-15T10:00:00Z' },
  { id: 102, text: 'Gracias por reportarlo.', sender_id: 10, time: '2025-01-15T10:10:00Z' }
];

vi.mock('../../services/MessageService', () => ({
  default: {
    getConversations: vi.fn().mockRejectedValue(new Error('Network Error')), // Error triggers mock fallback
    getConversation: vi.fn().mockRejectedValue(new Error('Network Error')),
    sendMessage: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe('V2DirectMessaging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Error triggers mock data fallback in component
    MessageService.getConversations.mockRejectedValue(new Error('Network Error'));
    MessageService.getConversation.mockResolvedValue({ data: MOCK_MESSAGES });
  });

  it('renders conversation list with demo mode banner', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Mensajes')).toBeTruthy();
    });
    
    // Wait for mock conversations to load from fallback
    await waitFor(() => {
      expect(screen.getByText('Dra. García')).toBeTruthy();
    });
  });

  it('selects a conversation and shows message input', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );

    // Wait for mock conversations
    await waitFor(() => screen.getByText('Dra. García'));

    // Click on conversation
    fireEvent.click(screen.getByText('Dra. García'));

    // Wait for chat area with input to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeTruthy();
    });
  });

  it('sends a message successfully in demo mode', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );

    // Wait for conversations
    await waitFor(() => screen.getByText('Dra. García'));

    // Select conversation
    fireEvent.click(screen.getByText('Dra. García'));

    // Wait for input
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeTruthy();
    });

    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(input, { target: { value: 'Test message' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeTruthy();
    });
  });
});
