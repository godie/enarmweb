import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import MessageService from '../../services/MessageService';
import UserService from '../../services/UserService';
import Auth from '../../modules/Auth';
import '../styles/v2-theme.css';

// Polling interval for new messages (5 seconds)
const POLL_INTERVAL = 5000;

// Mock conversations for fallback
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    participant: { id: 10, name: 'Dra. García', role: 'support', avatar: 'support_agent' },
    last_message: 'Estamos revisando el caso que reportaste.',
    last_message_time: '2025-01-15T10:30:00Z',
    unread_count: 1
  },
  {
    id: 2,
    participant: { id: 11, name: 'Dr. López', role: 'student', avatar: 'person' },
    last_message: '¿Puedes compartir tus notas de Pediatría?',
    last_message_time: '2025-01-14T18:00:00Z',
    unread_count: 0
  },
  {
    id: 3,
    participant: { id: 12, name: 'Soporte ENARM', role: 'support', avatar: 'help' },
    last_message: 'Tu suscripción ha sido renovada exitosamente.',
    last_message_time: '2025-01-13T09:15:00Z',
    unread_count: 0
  }
];

// Mock messages for a conversation
const MOCK_MESSAGES = {
  1: [
    { id: 101, text: '¡Hola! Bienvenido a la comunidad ENARM V2. ¿En qué podemos ayudarte hoy?', sender_id: 10, time: '2025-01-15T10:00:00Z' },
    { id: 102, text: 'Tengo una duda sobre el simulacro de ayer, la pregunta 45 parece tener un error.', sender_id: 'me', time: '2025-01-15T10:05:00Z' },
    { id: 103, text: 'Gracias por reportarlo. Estamos revisando el caso con nuestro equipo médico. Te notificaremos en cuanto se actualice.', sender_id: 10, time: '2025-01-15T10:10:00Z' },
    { id: 104, text: 'Estamos revisando el caso que reportaste.', sender_id: 10, time: '2025-01-15T10:30:00Z' }
  ],
  2: [
    { id: 201, text: '¿Puedes compartir tus notas de Pediatría?', sender_id: 11, time: '2025-01-14T18:00:00Z' }
  ],
  3: [
    { id: 301, text: 'Tu suscripción ha sido renovada exitosamente.', sender_id: 12, time: '2025-01-13T09:15:00Z' }
  ]
};

// Format time for message display
const formatMessageTime = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

// Format relative time for conversation list
const formatRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return formatMessageTime(dateString);
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
};

// Loading skeleton for conversations
const ConversationsSkeleton = () => (
  <div className='v2-messaging-skeleton'>
    {[1, 2, 3, 4].map(i => (
      <div key={i} className='v2-messaging-skeleton-item'>
        <div className='skeleton-circle' style={{ width: '48px', height: '48px' }}></div>
        <div className='v2-flex-1'>
          <div className='skeleton-bar' style={{ width: '60%', height: '16px', marginBottom: '8px' }}></div>
          <div className='skeleton-bar' style={{ width: '80%', height: '12px' }}></div>
        </div>
      </div>
    ))}
  </div>
);

// Loading skeleton for messages
const MessagesSkeleton = () => (
  <div className='v2-messaging-skeleton'>
    {[1, 2, 3].map(i => (
      <div key={i} style={{ display: 'flex', flexDirection: i % 2 === 0 ? 'row-reverse' : 'row', gap: '8px', marginBottom: '16px' }}>
        <div className='skeleton-bar' style={{ width: '200px', height: '48px', borderRadius: '20px' }}></div>
      </div>
    ))}
  </div>
);

// Error state component
const ErrorState = ({ message, onRetry }) => (
  <div className='v2-error-state'>
    <i className='material-icons v2-error-icon v2-mb-12'>
      cloud_off
    </i>
    <p className='v2-body-large v2-text-error v2-m-0 v2-mb-8'>
      {message || 'Error al cargar los mensajes'}
    </p>
    <button className='v2-btn-tonal' onClick={onRetry}>
      <i className='material-icons'>refresh</i>
      Reintentar
    </button>
  </div>
);

// Empty state for no conversations
const EmptyConversations = () => (
  <div className='v2-empty-state'>
    <i className='material-icons v2-outline-icon-lg v2-mb-12'>
      forum
    </i>
    <p className='v2-body-large v2-text-secondary v2-m-0'>
      No tienes conversaciones aún
    </p>
    <p className='v2-label-large v2-text-outline v2-mt-4 v2-mb-0'>
      Busca un usuario para iniciar un chat
    </p>
  </div>
);

// Conversation list item
const ConversationItem = ({ conversation, isSelected, onSelect }) => {
  const participant = conversation.participant;
  const isUnread = conversation.unread_count > 0;

  return (
    <button
      className={`v2-messaging-conversation-item ${isSelected ? 'selected' : ''} ${isUnread ? 'unread' : ''}`}
      onClick={() => onSelect(conversation)}
      aria-label={`Conversación con ${participant.name}`}
    >
      <div className='v2-messaging-avatar'>
        <i className='material-icons'>{participant.avatar || 'person'}</i>
      </div>
      <div className='v2-messaging-conversation-content'>
        <div className='v2-messaging-conversation-header'>
          <span className='v2-messaging-conversation-name'>{participant.name}</span>
          <span className='v2-messaging-conversation-time'>
            {formatRelativeTime(conversation.last_message_time)}
          </span>
        </div>
        <div className='v2-messaging-conversation-preview'>
          <p className='v2-messaging-conversation-last-message'>
            {conversation.last_message}
          </p>
          {isUnread && (
            <span className='v2-messaging-unread-badge'>{conversation.unread_count}</span>
          )}
        </div>
      </div>
    </button>
  );
};

// Single message bubble
const MessageBubble = ({ message, isOwnMessage }) => (
  <div className={`v2-messaging-bubble-container ${isOwnMessage ? 'own' : 'other'}`}>
    <div className={`v2-messaging-bubble ${isOwnMessage ? 'own' : 'other'}`}>
      <p className='v2-body-large v2-m-0'>{message.text}</p>
    </div>
    <span className='v2-messaging-bubble-time'>
      {formatMessageTime(message.time)}
    </span>
  </div>
);

// Search panel for finding users
const UserSearchPanel = ({ onClose, onSelectUser }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Debounced search - query is already set by input onChange
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await UserService.getPublicProfile(query);
        setResults(res.data ? [res.data] : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className='v2-messaging-search-panel'>
      <div className='v2-messaging-search-header'>
        <h3 className='v2-title-large v2-m-0'>Nueva conversación</h3>
        <button className='v2-btn-icon' onClick={onClose} aria-label='Cerrar búsqueda'>
          <i className='material-icons'>close</i>
        </button>
      </div>
      <div className='v2-input-outlined v2-mt-16'>
        <label htmlFor='msg-search'>Buscar usuario</label>
        <input
          id='msg-search'
          type='text'
          placeholder='Nombre o correo electrónico...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>
      {searching && (
        <div className='v2-flex-justify-center v2-p-16'>
          <i className='material-icons v2-rotate-animation'>refresh</i>
        </div>
      )}
      {!searching && query.trim().length >= 2 && results.length === 0 && (
        <p className='v2-label-large v2-text-center v2-text-outline v2-p-16'>
          No se encontraron usuarios
        </p>
      )}
      <div className='v2-messaging-search-results'>
        {results.map(user => (
          <button
            key={user.id}
            className='v2-messaging-search-result-item'
            onClick={() => onSelectUser(user)}
          >
            <div className='v2-messaging-avatar v2-messaging-avatar-sm'>
              <i className='material-icons'>person</i>
            </div>
            <span className='v2-body-large'>{user.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Typing indicator
const TypingIndicator = () => (
  <div className='v2-messaging-bubble-container other'>
    <div className='v2-messaging-bubble other v2-messaging-typing'>
      <span className='v2-messaging-typing-dot'></span>
      <span className='v2-messaging-typing-dot'></span>
      <span className='v2-messaging-typing-dot'></span>
    </div>
  </div>
);

// Main component
const V2DirectMessaging = () => {
  const history = useHistory();
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const inputRef = useRef(null);

  // State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [messagesError, setMessagesError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  // Get current user info
  const currentUser = useMemo(() => {
    try {
      return Auth.getUserInfo() || { id: 'me', name: 'Tú' };
    } catch {
      return { id: 'me', name: 'Tú' };
    }
  }, []);

  // Scroll to bottom of messages (safe for test environments without scrollIntoView)
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      try {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      } catch {
        // Ignore scroll errors in test environments
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Track whether mock fallback has been applied to avoid re-fetch loop
  const hasLoadedFallback = useRef(false);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await MessageService.getConversations();
      const data = res.data || [];
      setConversations(data);
      setError(null);
      setIsDemoMode(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      // Fallback to mock data on error (only once)
      if (!hasLoadedFallback.current) {
        hasLoadedFallback.current = true;
        setConversations(MOCK_CONVERSATIONS);
        setIsDemoMode(true);
        setError('Modo de demostración. Los datos reales no están disponibles.');
      }
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversation) => {
    if (!conversation) return;
    setLoadingMessages(true);
    setMessagesError(null);

    try {
      const res = await MessageService.getConversation(conversation.participant.id);
      const data = res.data || [];
      setMessages(data);
      setMessagesError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      // Fallback to mock messages
      const mockMsgs = MOCK_MESSAGES[conversation.id] || [];
      if (mockMsgs.length > 0) {
        setMessages(mockMsgs);
      }
      setIsDemoMode(true);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Poll for new messages in the selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const poll = async () => {
      try {
        const res = await MessageService.getConversation(selectedConversation.participant.id);
        const data = res.data || [];
        // Only update if new messages arrived
        if (data.length > messages.length) {
          setMessages(data);
        }
      } catch {
        // Silently fail on polling errors
      }
    };

    pollRef.current = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [selectedConversation, messages.length]);

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle conversation selection
  const handleSelectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
    fetchMessages(conversation);
    // Mark as read locally
    setConversations(prev =>
      prev.map(c => c.id === conversation.id ? { ...c, unread_count: 0 } : c)
    );
  }, [fetchMessages]);

  // Handle sending a message
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    // Optimistic update
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender_id: 'me',
      time: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      await MessageService.sendMessage({
        recipient_id: selectedConversation.participant.id,
        text: messageText
      });

      // Update conversation list with new last message
      setConversations(prev =>
        prev.map(c => c.id === selectedConversation.id ? {
          ...c,
          last_message: messageText,
          last_message_time: new Date().toISOString()
        } : c)
      );
    } catch (err) {
      console.error('Error sending message:', err);
      // In demo mode, simulate a response
      if (isDemoMode) {
        setOtherTyping(true);
        setTimeout(() => {
          setOtherTyping(false);
          setMessages(prev => [...prev, {
            id: `reply-${Date.now()}`,
            text: 'He recibido tu mensaje. Un asesor se pondrá en contacto contigo pronto.',
            sender_id: selectedConversation.participant.id,
            time: new Date().toISOString()
          }]);
        }, 1500);
      } else {
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
        setNewMessage(messageText); // Restore message text
      }
    } finally {
      setSendingMessage(false);
    }
  }, [newMessage, selectedConversation, isDemoMode]);

  // Handle starting a new conversation from search
  const handleStartConversation = useCallback((user) => {
    const existingConv = conversations.find(c => c.participant.id === user.id);
    if (existingConv) {
      handleSelectConversation(existingConv);
    } else {
      const newConv = {
        id: `new-${Date.now()}`,
        participant: { id: user.id, name: user.name, role: 'student', avatar: 'person' },
        last_message: '',
        last_message_time: new Date().toISOString(),
        unread_count: 0
      };
      setConversations(prev => [newConv, ...prev]);
      setSelectedConversation(newConv);
      setMessages([]);
      setShowMobileChat(true);
    }
    setShowSearch(false);
  }, [conversations, handleSelectConversation]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setError(null);
    hasLoadedFallback.current = false;
    setLoadingConversations(true);
    fetchConversations();
  }, [fetchConversations]);

  // Handle messages retry
  const handleMessagesRetry = useCallback(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation, fetchMessages]);

  // Back to conversation list (mobile)
  const handleBackToList = useCallback(() => {
    setShowMobileChat(false);
    setSelectedConversation(null);
    setMessages([]);
  }, []);

  // Focus input when conversation selected
  useEffect(() => {
    if (selectedConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedConversation]);

  return (
    <div className='v2-messaging-container'>
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className='v2-messaging-demo-banner'>
          <i className='material-icons' style={{ fontSize: '16px' }}>info</i>
          {error || 'Modo de demostración — datos de ejemplo'}
        </div>
      )}

      {/* Sidebar - Conversation List */}
      <div className={`v2-messaging-sidebar ${showMobileChat ? 'mobile-hidden' : ''}`}>
        <div className='v2-messaging-sidebar-header'>
          <div className='v2-messaging-sidebar-title'>
            <i className='material-icons v2-text-primary' style={{ fontSize: '28px' }}>forum</i>
            <h2>Mensajes</h2>
          </div>
          <button
            className='v2-btn-tonal v2-messaging-new-chat-btn'
            onClick={() => setShowSearch(true)}
            aria-label='Nueva conversación'
          >
            <i className='material-icons'>edit</i>
          </button>
        </div>

        <div className='v2-messaging-conversations-list'>
          {loadingConversations ? (
            <ConversationsSkeleton />
          ) : error && conversations.length === 0 ? (
            <ErrorState message={error} onRetry={handleRetry} />
          ) : conversations.length === 0 ? (
            <EmptyConversations />
          ) : (
            conversations.map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversation?.id === conv.id}
                onSelect={handleSelectConversation}
              />
            ))
          )}
        </div>

        {/* Search Panel Overlay */}
        {showSearch && (
          <UserSearchPanel
            onClose={() => setShowSearch(false)}
            onSelectUser={handleStartConversation}
          />
        )}
      </div>

      {/* Chat Area */}
      <div className={`v2-messaging-chat ${!showMobileChat ? 'mobile-hidden' : ''}`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className='v2-messaging-chat-header'>
              <button
                className='v2-btn-tonal v2-messaging-back-btn'
                onClick={handleBackToList}
                aria-label='Volver a conversaciones'
              >
                <i className='material-icons'>arrow_back</i>
              </button>
              <div className='v2-messaging-avatar'>
                <i className='material-icons'>{selectedConversation.participant.avatar || 'person'}</i>
              </div>
              <div className='v2-messaging-chat-header-info'>
                <h3>{selectedConversation.participant.name}</h3>
                <span>• En línea</span>
              </div>
              <button
                className='v2-btn-icon'
                onClick={() => history.push(`/perfil/publico/${selectedConversation.participant.id}`)}
                aria-label='Ver perfil'
              >
                <i className='material-icons'>person</i>
              </button>
            </div>

            {/* Messages Area */}
            <div className='v2-messaging-messages-area'>
              {loadingMessages ? (
                <MessagesSkeleton />
              ) : messagesError ? (
                <ErrorState message={messagesError} onRetry={handleMessagesRetry} />
              ) : (
                <>
                  {/* Date separator */}
                  <div className='v2-messaging-date-separator'>
                    Hoy
                  </div>
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isOwnMessage={msg.sender_id === 'me' || msg.sender_id === currentUser.id}
                    />
                  ))}
                  {otherTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <form className='v2-messaging-input-area' onSubmit={handleSendMessage}>
              <div className='v2-messaging-input-wrapper'>
                <input
                  ref={inputRef}
                  type='text'
                  className='v2-messaging-input'
                  placeholder='Escribe un mensaje...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sendingMessage}
                  aria-label='Escribe un mensaje'
                />
              </div>
              <button
                type='submit'
                className='v2-btn-filled v2-messaging-send-btn'
                disabled={!newMessage.trim() || sendingMessage}
                aria-label='Enviar mensaje'
              >
                <i className='material-icons'>send</i>
              </button>
            </form>
          </>
        ) : (
          /* No conversation selected */
          <div className='v2-messaging-empty-chat'>
            <i className='material-icons'>forum</i>
            <p className='v2-title-large v2-m-0'>
              Selecciona una conversación
            </p>
            <p className='v2-label-large v2-m-0'>
              Elige un chat de la lista o inicia uno nuevo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default V2DirectMessaging;
