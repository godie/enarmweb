import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2AIFlashcardGenerator = () => {
    const history = useHistory();
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [generating, setGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const handleGenerate = (e) => {
        e.preventDefault();
        setGenerating(true);
        // Mocking API call to POST /v2/ai/generate-flashcards
        setTimeout(() => {
            setSuggestions([
                { id: 's1', front: 'Tratamiento inicial de la cetoacidosis diabética', back: 'Reposición hídrica con solución salina al 0.9%' },
                { id: 's2', front: 'Criterios diagnósticos de preeclampsia', back: 'TA > 140/90 mmHg y proteinuria > 300mg/24h después de la semana 20' },
                { id: 's3', front: 'Signo de Murphy positivo indica:', back: 'Colecistitis aguda' }
            ]);
            setGenerating(false);
        }, 1500);
    };

    return (
        <div className="v2-page-container">
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button className="v2-btn-tonal" onClick={() => history.goBack()} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-small">Generador de Flashcards con IA</h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: suggestions.length > 0 ? '1fr 1fr' : '1fr', gap: '32px' }}>
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
                                onChange={(e) => setCount(e.target.value)}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {suggestions.map((s, idx) => (
                                <div key={s.id} className="v2-card-tonal">
                                    <div className="v2-label-medium" style={{ opacity: 0.7, marginBottom: '8px' }}>Sugerencia {idx + 1}</div>
                                    <div className="v2-body-large" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Q: {s.front}</div>
                                    <div className="v2-body-medium">A: {s.back}</div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                        <button className="v2-btn-tonal" style={{ height: '32px', fontSize: '12px' }}>
                                            <i className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>add</i>
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="v2-btn-primary" style={{ width: '100%', marginTop: '24px' }}>
                            Guardar Todas
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
};

export default V2AIFlashcardGenerator;
