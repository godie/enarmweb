import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ExamService from '../../services/ExamService';

const V2Examen = () => {
    const { identificador } = useParams();
    const history = useHistory();
    const [state, setState] = useState({
        caso: null,
        loading: true,
        selectedAnswer: null,
        showFeedback: false,
        isCorrect: false
    });

    useEffect(() => {
        const loadCaso = async () => {
            try {
                const res = identificador === 'random'
                    ? await ExamService.loadRandomCaso()
                    : await ExamService.loadCaso(identificador);
                setState(prev => ({ ...prev, caso: res.data, loading: false }));
            } catch (error) {
                console.error("Error loading case, using mock", error);
                // Fallback mock case
                setState(prev => ({
                    ...prev,
                    caso: {
                        identificador: 'Caso Clínico #124',
                        texto: 'Paciente masculino de 45 años acude a urgencias por dolor torácico opresivo de 30 minutos de evolución, irradiado a mandíbula y brazo izquierdo. Antecedentes de hipertensión y diabetes tipo 2.',
                        preguntas: [{
                            texto: '¿Cuál es el primer paso diagnóstico más apropiado?',
                            respuestas: [
                                { texto: 'Electrocardiograma de 12 derivaciones', is_correct: true },
                                { texto: 'Enzimas cardiacas (Troponinas)', is_correct: false },
                                { texto: 'Radiografía de tórax', is_correct: false },
                                { texto: 'Ecocardiograma transtorácico', is_correct: false }
                            ]
                        }]
                    },
                    loading: false
                }));
            }
        };
        loadCaso();
    }, [identificador]);

    const handleSubmit = () => {
        if (state.selectedAnswer === null) return;
        const correct = state.selectedAnswer === 0;
        setState(prev => ({ ...prev, showFeedback: true, isCorrect: correct }));
    };

    if (state.loading) return <div className="center-align">Cargando caso clínico...</div>;

    const { caso, selectedAnswer, showFeedback, isCorrect } = state;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="v2-card-tonal" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                <span className="v2-body-large v2-text-primary">Reto de Sesión</span>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span className="v2-body-large">+50 XP</span>
                    <i className="material-icons" style={{ fontSize: '20px' }}>timer</i>
                    <span>14:22</span>
                </div>
            </div>

            <section className="v2-card v2-card-elevated">
                <h2 className="v2-headline-medium" style={{ marginBottom: '20px' }}>{caso.identificador}</h2>
                <p className="v2-body-large" style={{ lineHeight: '1.6', fontSize: '18px' }}>
                    {caso.texto}
                </p>
            </section>

            <section style={{ marginTop: '32px' }}>
                {caso.preguntas && caso.preguntas.map((pregunta, pIdx) => (
                    <div key={pIdx} className="v2-card" style={{ padding: '24px' }}>
                        <p className="v2-body-large" style={{ fontWeight: '500', marginBottom: '20px' }}>{pregunta.texto}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {pregunta.respuestas && pregunta.respuestas.map((resp, rIdx) => (
                                <button
                                    key={rIdx}
                                    onClick={() => !showFeedback && setState(prev => ({ ...prev, selectedAnswer: rIdx }))}
                                    className="v2-card-tonal"
                                    style={{
                                        display: 'flex', alignItems: 'center', textAlign: 'left',
                                        cursor: showFeedback ? 'default' : 'pointer',
                                        border: selectedAnswer === rIdx ? '2px solid var(--md-sys-color-primary)' : '2px solid transparent',
                                        backgroundColor: selectedAnswer === rIdx ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-variant)',
                                        opacity: showFeedback && selectedAnswer !== rIdx ? 0.6 : 1,
                                        width: '100%', padding: '16px'
                                    }}
                                >
                                    <span style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        backgroundColor: 'white', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', marginRight: '16px', fontWeight: 'bold', color: 'black'
                                    }}>
                                        {String.fromCharCode(65 + rIdx)}
                                    </span>
                                    {resp.texto}
                                </button>
                            ))}
                        </div>

                        {!showFeedback ? (
                            <div style={{ marginTop: '32px', textAlign: 'right' }}>
                                <button
                                    className="v2-fab v2-bg-primary"
                                    style={{ width: 'auto', padding: '0 32px', height: '56px', borderRadius: '16px' }}
                                    onClick={handleSubmit}
                                >
                                    Enviar Respuesta <i className="material-icons" style={{ marginLeft: '8px' }}>check</i>
                                </button>
                            </div>
                        ) : (
                            <div style={{ marginTop: '32px' }}>
                                <div className="v2-card-tonal" style={{
                                    backgroundColor: isCorrect ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-error-container)',
                                    color: isCorrect ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-error-container)',
                                    marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'
                                }}>
                                    <i className="material-icons">{isCorrect ? 'check_circle' : 'error'}</i>
                                    <span className="v2-title-large">{isCorrect ? '¡Correcto!' : 'Incorrecto'}</span>
                                </div>
                                <div className="v2-card" style={{ backgroundColor: '#fffbe6', border: '1px solid #ffe58f', marginBottom: '24px' }}>
                                    <h4 className="v2-title-large" style={{ color: '#856404', marginBottom: '12px' }}>
                                        <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>lightbulb</i>
                                        Perla Médica: Explicación
                                    </h4>
                                    <p className="v2-body-large">
                                        Ante la sospecha de un Síndrome Coronario Agudo, el electrocardiograma es la herramienta diagnóstica inicial más importante para determinar la conducta terapéutica inmediata.
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <button
                                        className="v2-fab v2-bg-primary"
                                        style={{ width: 'auto', padding: '0 32px', height: '56px', borderRadius: '16px' }}
                                        onClick={() => history.push('/v2/dashboard')}
                                    >
                                        Siguiente Caso <i className="material-icons" style={{ marginLeft: '8px' }}>arrow_forward</i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default V2Examen;
