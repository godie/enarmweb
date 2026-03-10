import { useState } from 'react';
import '../styles/v2-theme.css';

const V2FlashcardStudy = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const [flashcards] = useState([
        { id: '1', front: '¿Cuál es la triada de Virchow?', back: '1. Estasis venosa\n2. Daño endotelial\n3. Hipercoagulabilidad', category: 'Fisiopatología' },
        { id: '2', front: 'Agente causal más común de epiglotitis', back: 'Haemophilus influenzae tipo b', category: 'Pediatría' },
        { id: '3', front: 'Signo de Murphy positivo indica...', back: 'Colecistitis aguda', category: 'Cirugía' },
    ]);

    const handleAnswer = (quality) => {
        // En una implementación real, aquí se llamaría al backend con la calidad del SRS
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        return (
            <div className="v2-card" style={{ textAlign: 'center', maxWidth: '600px', margin: '64px auto' }}>
                <i className="material-icons v2-text-primary" style={{ fontSize: '80px' }}>task_alt</i>
                <h2 className="v2-headline-medium">¡Sesión Completada!</h2>
                <p className="v2-body-large" style={{ margin: '16px 0 32px' }}>Has repasado todas tus flashcards pendientes por hoy.</p>
                <button className="v2-btn-filled" onClick={() => window.history.back()}>
                    Volver al Inicio
                </button>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div className="v2-flashcard-study-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="v2-headline-medium">Repaso Flashcards</h1>
                    <span className="v2-label-large" style={{ color: 'var(--md-sys-color-primary)' }}>{currentCard.category}</span>
                </div>
                <div className="v2-label-large" style={{ opacity: 0.7 }}>
                    {currentIndex + 1} / {flashcards.length}
                </div>
            </header>

            <div className="v2-linear-progress" style={{ marginBottom: '40px' }}>
                <div
                    className="v2-linear-progress-bar"
                    style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                ></div>
            </div>

            {/* Flashcard Content */}
            <div
                className="v2-card v2-card-elevated"
                style={{
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                }}
                onClick={() => !showAnswer && setShowAnswer(true)}
            >
                <h2 className="v2-title-large" style={{ fontSize: '24px', lineHeight: '1.4' }}>
                    {currentCard.front}
                </h2>

                {showAnswer && (
                    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--md-sys-color-outline-variant)', width: '100%' }}>
                        <p className="v2-body-large" style={{ whiteSpace: 'pre-line', fontWeight: '500' }}>
                            {currentCard.back}
                        </p>
                    </div>
                )}

                {!showAnswer && (
                    <p className="v2-label-large" style={{ marginTop: '40px', opacity: 0.5 }}>
                        Toca para ver la respuesta
                    </p>
                )}
            </div>

            {/* SRS Controls */}
            {showAnswer && (
                <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                        { val: 1, label: 'Mal', color: '#ba1a1a' },
                        { val: 3, label: 'Regular', color: '#456179' },
                        { val: 4, label: 'Bien', color: '#4a6360' },
                        { val: 5, label: 'Fácil', color: '#0fa397' }
                    ].map(btn => (
                        <button
                            key={btn.val}
                            className="v2-btn-tonal"
                            onClick={() => handleAnswer(btn.val)}
                            style={{ flexDirection: 'column', padding: '12px 4px', height: 'auto', gap: '4px' }}
                        >
                            <span className="v2-label-large" style={{ color: btn.color }}>{btn.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default V2FlashcardStudy;
