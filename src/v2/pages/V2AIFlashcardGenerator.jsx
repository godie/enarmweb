import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AIService from '../../services/AIService';
import FlashcardService from '../../services/FlashcardService';
import '../styles/v2-theme.css';

const V2AIFlashcardGenerator = () => {
    const history = useHistory();
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [generating, setGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [savingAll, setSavingAll] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const response = await AIService.generateFlashcards({ topic, count });
            setSuggestions(response.data || []);
        } catch (err) {
            console.error("Error generating flashcards:", err);
            alert("Error al generar sugerencias. Por favor, intenta de nuevo.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveOne = async (suggestion, index) => {
        try {
            await FlashcardService.createFlashcard({
                front: suggestion.front,
                back: suggestion.back,
                specialty_id: suggestion.specialty_id || 1 // Fallback or derived specialty
            });
            // Mark as saved in UI
            const newSuggestions = [...suggestions];
            newSuggestions[index].saved = true;
            setSuggestions(newSuggestions);
        } catch (err) {
            console.error("Error saving individual flashcard:", err);
        }
    };

    const handleSaveAll = async () => {
        setSavingAll(true);
        try {
            const unsaved = suggestions.filter(s => !s.saved);
            for (const s of unsaved) {
                await FlashcardService.createFlashcard({
                    front: s.front,
                    back: s.back,
                    specialty_id: s.specialty_id || 1
                });
            }
            history.push('/v2/flashcards/repaso');
        } catch (err) {
            console.error("Error saving all flashcards:", err);
            alert("Ocurrió un error al guardar todas las flashcards.");
        } finally {
            setSavingAll(false);
        }
    };

    return (
        <div className="v2-page-container">
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button className="v2-btn-tonal" onClick={() => history.goBack()} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-small">Generador de Flashcards con IA</h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: suggestions.length > 0 ? '1fr 1.5fr' : '1fr', gap: '32px' }}>
                <section>
                    <form className="v2-card" onSubmit={handleGenerate}>
                        <h2 className="v2-title-large" style={{ marginBottom: '16px' }}>Configuración</h2>
                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="topic-input" className="v2-label-large" style={{ display: 'block', marginBottom: '8px' }}>Tema o Concepto Médico</label>
                            <input
                                id="topic-input"
                                className="v2-input"
                                type="text"
                                placeholder="Ej: Diabetes Mellitus Tipo 2"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'transparent', color: 'inherit' }}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label htmlFor="count-input" className="v2-label-large" style={{ display: 'block', marginBottom: '8px' }}>Número de Cartas</label>
                            <input
                                id="count-input"
                                className="v2-input"
                                type="number"
                                min="1"
                                max="20"
                                value={count}
                                onChange={(e) => setCount(parseInt(e.target.value))}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'transparent', color: 'inherit' }}
                            />
                        </div>
                        <button className="v2-btn-primary" style={{ width: '100%' }} disabled={generating}>
                            {generating ? 'Generando...' : 'Generar Sugerencias'}
                        </button>
                    </form>
                </section>

                {suggestions.length > 0 && (
                    <section>
                        <h2 className="v2-title-large" style={{ marginBottom: '16px' }}>Sugerencias Generadas</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
                            {suggestions.map((s, idx) => (
                                <div key={idx} className="v2-card-tonal" style={{ position: 'relative' }}>
                                    <div className="v2-label-medium" style={{ opacity: 0.7, marginBottom: '8px' }}>Sugerencia {idx + 1}</div>
                                    <div className="v2-body-large" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Q: {s.front}</div>
                                    <div className="v2-body-medium">A: {s.back}</div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                        <button
                                            className="v2-btn-tonal"
                                            style={{ height: '32px', fontSize: '12px' }}
                                            onClick={() => handleSaveOne(s, idx)}
                                            disabled={s.saved}
                                        >
                                            <i className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>{s.saved ? 'check' : 'add'}</i>
                                            {s.saved ? 'Guardada' : 'Guardar'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="v2-btn-primary"
                            style={{ width: '100%', marginTop: '24px' }}
                            onClick={handleSaveAll}
                            disabled={savingAll || suggestions.every(s => s.saved)}
                        >
                            {savingAll ? 'Guardando...' : 'Guardar Todas'}
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
};

export default V2AIFlashcardGenerator;
