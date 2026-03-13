import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2DirectMessaging = () => {
    const history = useHistory();
    const [messages, setMessages] = useState([
        { id: 1, text: "¡Hola! Bienvenido a la comunidad ENARM V2. ¿En qué podemos ayudarte hoy?", sender: "system", time: "10:00 AM" },
        { id: 2, text: "Tengo una duda sobre el simulacro de ayer, la pregunta 45 parece tener un error en la referencia bibliográfica.", sender: "user", time: "10:05 AM" },
        { id: 3, text: "Gracias por reportarlo. Estamos revisando el caso con nuestro equipo médico. Te notificaremos en cuanto se actualice.", sender: "support", time: "10:10 AM" }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const msg = {
            id: messages.length + 1,
            text: newMessage,
            sender: "user",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, msg]);
        setNewMessage('');

        // Simulate support response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "He recibido tu mensaje. Un asesor se pondrá en contacto contigo pronto.",
                sender: "support",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 2000);
    };

    return (
        <div className="v2-messaging-container" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                <button
                    className="v2-btn-tonal"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, minWidth: '40px' }}
                    onClick={() => history.goBack()}
                >
                    <i className="material-icons">arrow_back</i>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <i className="material-icons">support_agent</i>
                    </div>
                    <div>
                        <h1 className="v2-title-large" style={{ margin: 0 }}>Soporte ENARM</h1>
                        <div className="v2-label-small" style={{ color: 'var(--md-sys-color-primary)' }}>• En línea ahora</div>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div className="v2-card" style={{
                            padding: '12px 16px',
                            backgroundColor: msg.sender === 'user' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-variant)',
                            color: msg.sender === 'user' ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
                            borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            boxShadow: 'none'
                        }}>
                            <p className="v2-body-large" style={{ margin: 0 }}>{msg.text}</p>
                        </div>
                        <span className="v2-label-small" style={{ marginTop: '4px', opacity: 0.6 }}>{msg.time}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button type="button" className="v2-btn-tonal" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, minWidth: '48px' }}>
                    <i className="material-icons">add</i>
                </button>
                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 20px', borderRadius: '28px',
                            border: '1px solid var(--md-sys-color-outline)',
                            backgroundColor: 'var(--md-sys-color-surface-variant)',
                            color: 'var(--md-sys-color-on-surface-variant)'
                        }}
                    />
                </div>
                <button type="submit" className="v2-btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, minWidth: '48px' }}>
                    <i className="material-icons">send</i>
                </button>
            </form>
        </div>
    );
};

export default V2DirectMessaging;
