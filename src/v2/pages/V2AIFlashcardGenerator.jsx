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
            history.push('/flashcards/repaso');
        } catch (err) {
            console.error("Error saving all flashcards:", err);
            alert("Ocurrió un error al guardar todas las flashcards.");
        } finally {
            setSavingAll(false);
        }
    };

    return (
        <div className="v2-page-container">
            <header className='v2-page-header-back v2-gap-16'>
                <button className='v2-btn-icon' onClick={() => history.goBack()} aria-label='Volver'>
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-small">Generador de Flashcards con IA</h1>
            </header>

            <div className='v2-grid v2-gap-32' style={{ gridTemplateColumns: suggestions.length > 0 ? '1fr 1.5fr' : '1fr' }}>
                <section>
                    <form className="v2-card" onSubmit={handleGenerate}>
                        <h2 className='v2-title-large v2-mb-16'>Configuración</h2>
                        <div className='v2-mb-24'>
                            <label htmlFor='topic-input' className='v2-label-large v2-mb-8' style={{ display: 'block' }}>Tema o Concepto Médico</label>
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
                        <div className='v2-mb-24'>
                            <label htmlFor='count-input' className='v2-label-large v2-mb-8' style={{ display: 'block' }}>Número de Cartas</label>
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
                        <button className='v2-btn-primary v2-btn-full' disabled={generating}>
                            {generating ? 'Generando...' : 'Generar Sugerencias'}
                        </button>
                    </form>
                </section>

                {suggestions.length > 0 && (
                    <section>
                        <h2 className='v2-title-large v2-mb-16'>Sugerencias Generadas</h2>
                        <div className='v2-flex-col v2-gap-16 v2-overflow-y-auto' style={{ maxHeight: '600px', paddingRight: '8px' }}>
                            {suggestions.map((s, idx) => (
                                <div key={idx} className="v2-card-tonal" style={{ position: 'relative' }}>
                                <div className='v2-label-medium v2-opacity-70 v2-mb-8'>Sugerencia {idx + 1}</div>
                                <div className='v2-body-large v2-text-bold v2-mb-8'>Q: {s.front}</div>
                                    <div className="v2-body-medium">A: {s.back}</div>
                                    <div className='v2-flex v2-flex-justify-end v2-mt-16'>
                                        <button
                                            className="v2-btn-tonal"
                                            style={{ height: '44px', fontSize: '12px', minWidth: '44px' }}
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
                            className='v2-btn-primary v2-btn-full v2-mt-24'
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
