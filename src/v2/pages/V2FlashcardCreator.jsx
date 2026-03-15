import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import FlashcardService from '../../services/FlashcardService';
import ExamService from '../../services/ExamService';
import '../styles/v2-theme.css';

const V2FlashcardCreator = () => {
    const history = useHistory();
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [specialtyId, setSpecialtyId] = useState('');
    const [specialties, setSpecialties] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await ExamService.loadCategories();
                setSpecialties(response.data || []);
            } catch (err) {
                console.error("Error fetching specialties:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialties();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!specialtyId || !front || !back) return;

        setSaving(true);
        try {
            await FlashcardService.createFlashcard({
                front,
                back,
                specialty_id: specialtyId
            });
            history.push('/v2/flashcards/repaso');
        } catch (err) {
            console.error("Error saving flashcard:", err);
            alert("Ocurrió un error al guardar la flashcard. Por favor, intenta de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="v2-page-container center-align" style={{ padding: '80px' }}>
                <div className="preloader-wrapper big active">
                    <div className="spinner-layer spinner-green-only">
                        <div className="circle-clipper left"><div className="circle"></div></div>
                        <div className="gap-patch"><div className="circle"></div></div>
                        <div className="circle-clipper right"><div className="circle"></div></div>
                    </div>
                </div>
            </div>
        );
    }

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
                        value={specialtyId}
                        onChange={(e) => setSpecialtyId(e.target.value)}
                        required
                        style={{ display: 'block', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--md-sys-color-outline-variant)' }}
                    >
                        <option value="" disabled>Seleccionar Especialidad</option>
                        {specialties.map(spec => (
                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                        ))}
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
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'transparent', color: 'inherit' }}
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
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'transparent', color: 'inherit' }}
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
