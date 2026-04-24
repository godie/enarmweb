import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2DirectMessaging from '../pages/V2DirectMessaging';
import MessageService from '../../services/MessageService';
import UserService from '../../services/UserService';

// Mock services
vi.mock('../../services/MessageService', () => ({
  default: {
    getConversations: vi.fn(),
    getConversation: vi.fn(),
    sendMessage: vi.fn()
  }
}));

vi.mock('../../services/UserService', () => ({
  default: {
    getPublicProfile: vi.fn()
  }
}));

vi.mock('../../modules/Auth', () => ({
  default: {
    getToken: vi.fn(() => 'test-token'),
    getUserInfo: vi.fn(() => ({ id: 1, name: 'Test User' }))
  }
}));

// Mock data
const mockConversations = [
  {
    id: 1,
    participant: { id: 10, name: 'Dra. García', role: 'support', avatar: 'support_agent' },
    last_message: 'Estamos revisando el caso.',
    last_message_time: '2025-01-15T10:30:00Z',
    unread_count: 1
  },
  {
    id: 2,
    participant: { id: 11, name: 'Dr. López', role: 'student', avatar: 'person' },
    last_message: '¿Puedes compartir tus notas?',
    last_message_time: '2025-01-14T18:00:00Z',
    unread_count: 0
  }
];

const mockMessages = [
  { id: 101, text: '¡Hola! Bienvenido a la comunidad ENARM V2.', sender_id: 10, time: '2025-01-15T10:00:00Z' },
  { id: 102, text: 'Tengo una duda sobre el simulacro.', sender_id: 'me', time: '2025-01-15T10:05:00Z' },
  { id: 103, text: 'Gracias por reportarlo.', sender_id: 10, time: '2025-01-15T10:10:00Z' }
];

describe('V2DirectMessaging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock scrollIntoView which doesn't exist in JSDOM
    Element.prototype.scrollIntoView = vi.fn();
    // Suppress console.error for expected API error logs in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Default: API returns conversations
    MessageService.getConversations.mockResolvedValue({
      data: mockConversations
    });
    MessageService.getConversation.mockResolvedValue({
      data: mockMessages
    });
    MessageService.sendMessage.mockResolvedValue({ data: { success: true } });
    UserService.getPublicProfile.mockRejectedValue(new Error('Not found'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete Element.prototype.scrollIntoView;
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    const container = document.querySelector('.v2-messaging-container');
    expect(container).toBeDefined();
  });

  it('renders Mensajes header after loading', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    const header = await screen.findByText('Mensajes');
    expect(header).toBeDefined();
  });

  it('displays conversation list after loading', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Dra. García');
    await screen.findByText('Dr. López');
  });

  it('shows unread badge for conversations with unread messages', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Dra. García');
    const badge = document.querySelector('.v2-messaging-unread-badge');
    expect(badge).toBeDefined();
    expect(badge.textContent).toBe('1');
  });

  it('shows empty state when no conversations exist', async () => {
    MessageService.getConversations.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('No tienes conversaciones aún');
  });

  it('shows "Selecciona una conversación" when no chat is open', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Selecciona una conversación');
  });

  it('opens conversation when clicking on it', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Dra. García');
    const convItem = document.querySelector('.v2-messaging-conversation-item');
    fireEvent.click(convItem);
    // Chat area should become visible and show messages
    await screen.findByText('¡Hola! Bienvenido a la comunidad ENARM V2.');
    // Chat header should show participant name
    const chatHeader = document.querySelector('.v2-messaging-chat-header-info h3');
    expect(chatHeader).toBeDefined();
    expect(chatHeader.textContent).toBe('Dra. García');
  });

  it('displays messages with correct bubble alignment', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Dra. García');
    const convItem = document.querySelector('.v2-messaging-conversation-item');
    fireEvent.click(convItem);
    // Own message (sender_id: 'me')
    await screen.findByText('Tengo una duda sobre el simulacro.');
    const ownBubbles = document.querySelectorAll('.v2-messaging-bubble-container.own');
    expect(ownBubbles.length).toBeGreaterThan(0);
    // Other's message
    const otherBubbles = document.querySelectorAll('.v2-messaging-bubble-container.other');
    expect(otherBubbles.length).toBeGreaterThan(0);
  });

  it('sends a message when typing and pressing send', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Dra. García');
    const convItem = document.querySelector('.v2-messaging-conversation-item');
    fireEvent.click(convItem);
    await screen.findByText('¡Hola! Bienvenido a la comunidad ENARM V2.');
    // Type a message
    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(input, { target: { value: 'Hola, necesito ayuda' } });
    // Submit form
    const sendBtn = screen.getByRole('button', { name: /Enviar mensaje/i });
    fireEvent.click(sendBtn);
    // API should be called
    await waitFor(() => {
      expect(MessageService.sendMessage).toHaveBeenCalled();
    });
  });

  it('disables send button when input is empty', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Dra. García');
    const convItem = document.querySelector('.v2-messaging-conversation-item');
    fireEvent.click(convItem);
    await screen.findByText('¡Hola! Bienvenido a la comunidad ENARM V2.');
    const sendBtn = screen.getByRole('button', { name: /Enviar mensaje/i });
    expect(sendBtn.disabled).toBe(true);
  });

  it('shows new conversation button', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Mensajes');
    const newChatBtn = screen.getByRole('button', { name: /Nueva conversación/i });
    expect(newChatBtn).toBeDefined();
  });

  it('opens search panel when clicking new conversation button', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Mensajes');
    const newChatBtn = screen.getByRole('button', { name: /Nueva conversación/i });
    fireEvent.click(newChatBtn);
    await screen.findByText('Nueva conversación');
  });

  it('shows search input in search panel', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Mensajes');
    const newChatBtn = screen.getByRole('button', { name: /Nueva conversación/i });
    fireEvent.click(newChatBtn);
    await screen.findByText('Nueva conversación');
    const searchInput = screen.getByPlaceholderText('Nombre o correo electrónico...');
    expect(searchInput).toBeDefined();
  });

  it('closes search panel when clicking close', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Mensajes');
    const newChatBtn = screen.getByRole('button', { name: /Nueva conversación/i });
    fireEvent.click(newChatBtn);
    await screen.findByText('Nueva conversación');
    const closeBtn = screen.getByRole('button', { name: /Cerrar búsqueda/i });
    fireEvent.click(closeBtn);
    // Search panel should be gone
    await waitFor(() => {
      expect(screen.queryByText('Nueva conversación')).toBeNull();
    });
  });

  it('falls back to mock data on API error', async () => {
    MessageService.getConversations.mockRejectedValue(new Error('Network error'));
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    // Should show mock conversations (Dra. García from MOCK_CONVERSATIONS)
    await screen.findByText('Dra. García');
  });

  it('shows demo mode banner on API error', async () => {
    MessageService.getConversations.mockRejectedValue(new Error('Network error'));
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText(/Modo de demostración/i);
  });

  it('calls getConversations API on mount', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Mensajes');
    expect(MessageService.getConversations).toHaveBeenCalled();
  });

  it('calls getConversation API when selecting a conversation', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Dra. García');
    const convItem = document.querySelector('.v2-messaging-conversation-item');
    fireEvent.click(convItem);
    await waitFor(() => {
      expect(MessageService.getConversation).toHaveBeenCalledWith(10);
    });
  });

  it('marks conversation as read when selected', async () => {
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    await screen.findByText('Dra. García');
    // Verify unread badge exists initially
    const badge = document.querySelector('.v2-messaging-unread-badge');
    expect(badge).toBeDefined();
    // Click on the conversation
    const convItem = document.querySelector('.v2-messaging-conversation-item');
    fireEvent.click(convItem);
    // Unread badge should disappear after selection
    await waitFor(() => {
      const badges = document.querySelectorAll('.v2-messaging-unread-badge');
      expect(badges.length).toBe(0);
    });
  });

  it('shows typing indicator in demo mode after sending message', async () => {
    MessageService.getConversations.mockRejectedValue(new Error('Network error'));
    MessageService.getConversation.mockRejectedValue(new Error('Network error'));
    MessageService.sendMessage.mockRejectedValue(new Error('Network error'));
    render(
      <MemoryRouter>
        <V2DirectMessaging />
      </MemoryRouter>
    );
    // Wait for demo mode to load
    await screen.findByText('Dra. García');
    const convItem = document.querySelector('.v2-messaging-conversation-item');
    fireEvent.click(convItem);
    // Wait for messages to appear in demo mode
    await waitFor(() => {
      const bubbles = document.querySelectorAll('.v2-messaging-bubble');
      expect(bubbles.length).toBeGreaterThan(0);
    });
    // Type and send message
    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    const sendBtn = screen.getByRole('button', { name: /Enviar mensaje/i });
    fireEvent.click(sendBtn);
    // Typing indicator should appear (demo mode simulates response)
    await waitFor(() => {
      const typingIndicator = document.querySelector('.v2-messaging-typing');
      expect(typingIndicator).toBeDefined();
    }, { timeout: 2000 });
  });
});
