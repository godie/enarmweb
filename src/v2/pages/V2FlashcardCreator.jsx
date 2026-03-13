import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2FlashcardCreator = () => {
    const history = useHistory();
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        // Mocking API call to POST /v2/flashcards
        setTimeout(() => {
            setSaving(false);
            history.push('/v2/repaso');
        }, 1000);
    };

    return (
        <div className="v2-page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button className="v2-btn-tonal" onClick={() => history.goBack()} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-small">Crear Flashcard</h1>
            </header>

            <form className="v2-card" onSubmit={handleSave}>
                <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="specialty-select" className="v2-label-large" style={{ display: 'block', marginBottom: '8px' }}>Especialidad</label>
                    <select
                        id="specialty-select"
                        className="v2-input"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                        style={{ display: 'block' }}
                    >
                        <option value="" disabled>Seleccionar Especialidad</option>
                        <option value="pediatria">Pediatría</option>
                        <option value="ginecologia">Ginecología</option>
                        <option value="cirugia">Cirugía</option>
                        <option value="medicina-interna">Medicina Interna</option>
                    </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="front-input" className="v2-label-large" style={{ display: 'block', marginBottom: '8px' }}>Anverso (Pregunta)</label>
                    <textarea
                        id="front-input"
                        className="v2-input"
                        rows="4"
                        placeholder="Escribe la pregunta o concepto..."
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="back-input" className="v2-label-large" style={{ display: 'block', marginBottom: '8px' }}>Reverso (Respuesta)</label>
                    <textarea
                        id="back-input"
                        className="v2-input"
                        rows="4"
                        placeholder="Escribe la respuesta detallada..."
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                    <button type="button" className="v2-btn-tonal" style={{ flex: 1 }} onClick={() => history.goBack()}>
                        Cancelar
                    </button>
                    <button type="submit" className="v2-btn-primary" style={{ flex: 1 }} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Flashcard'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default V2FlashcardCreator;
