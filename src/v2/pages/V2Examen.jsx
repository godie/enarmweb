import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ExamService from '../../services/ExamService';
import '../styles/v2-theme.css';

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
        const correct = state.selectedAnswer === 0; // In mock, first is correct
        setState(prev => ({ ...prev, showFeedback: true, isCorrect: correct }));
    };

    if (state.loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div className="v2-text-primary">Cargando caso clínico...</div>
            <div className="v2-linear-progress" style={{ width: '200px', marginTop: '16px' }}>
                <div className="v2-linear-progress-bar" style={{ width: '40%' }}></div>
            </div>
        </div>
    );

    const { caso, selectedAnswer, showFeedback, isCorrect } = state;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="v2-card-tonal" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center', padding: '12px 24px' }}>
                <span className="v2-label-large v2-text-primary">Sesión Activa</span>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="material-icons" style={{ fontSize: '18px' }}>bolt</i>
                        <span className="v2-label-large">+50 XP</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="material-icons" style={{ fontSize: '18px' }}>timer</i>
                        <span className="v2-label-large">14:22</span>
                    </div>
                </div>
            </div>

            <section className="v2-card v2-card-elevated" style={{ marginBottom: '32px' }}>
                <h2 className="v2-title-large" style={{ marginBottom: '16px', color: 'var(--md-sys-color-primary)' }}>{caso.identificador}</h2>
                <p className="v2-body-large" style={{ lineHeight: '1.7' }}>
                    {caso.texto}
                </p>
            </section>

            <section>
                {caso.preguntas && caso.preguntas.map((pregunta, pIdx) => (
                    <div key={pIdx} className="v2-card" style={{ padding: '32px' }}>
                        <p className="v2-title-large" style={{ fontWeight: '600', marginBottom: '24px' }}>{pregunta.texto}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {pregunta.respuestas && pregunta.respuestas.map((resp, rIdx) => (
                                <button
                                    key={rIdx}
                                    onClick={() => !showFeedback && setState(prev => ({ ...prev, selectedAnswer: rIdx }))}
                                    className="v2-card-outlined"
                                    style={{
                                        display: 'flex', alignItems: 'center', textAlign: 'left',
                                        cursor: showFeedback ? 'default' : 'pointer',
                                        borderColor: selectedAnswer === rIdx ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)',
                                        backgroundColor: selectedAnswer === rIdx ? 'var(--md-sys-color-primary-container)' : 'transparent',
                                        opacity: showFeedback && selectedAnswer !== rIdx ? 0.6 : 1,
                                        width: '100%', padding: '16px', transition: 'all 0.2s'
                                    }}
                                >
                                    <span style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        backgroundColor: selectedAnswer === rIdx ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-variant)',
                                        color: selectedAnswer === rIdx ? 'white' : 'inherit',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', marginRight: '16px', fontWeight: 'bold'
                                    }}>
                                        {String.fromCharCode(65 + rIdx)}
                                    </span>
                                    <span className="v2-body-large">{resp.texto}</span>
                                </button>
                            ))}
                        </div>

                        {!showFeedback ? (
                            <div style={{ marginTop: '32px', textAlign: 'right' }}>
                                <button
                                    className="v2-btn-filled"
                                    style={{ height: '56px', padding: '0 40px' }}
                                    onClick={handleSubmit}
                                    disabled={selectedAnswer === null}
                                >
                                    Confirmar Respuesta
                                    <i className="material-icons">check_circle</i>
                                </button>
                            </div>
                        ) : (
                            <div style={{ marginTop: '40px' }}>
                                <div className="v2-card-tonal" style={{
                                    backgroundColor: isCorrect ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-error-container)',
                                    color: isCorrect ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-error-container)',
                                    marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', padding: '20px'
                                }}>
                                    <i className="material-icons">{isCorrect ? 'check_circle' : 'cancel'}</i>
                                    <div>
                                        <h4 className="v2-title-large" style={{ margin: 0 }}>{isCorrect ? '¡Excelente elección!' : 'Respuesta incorrecta'}</h4>
                                        <p className="v2-body-large" style={{ margin: 0, opacity: 0.8 }}>
                                            {isCorrect ? 'Has ganado 50 XP.' : 'Sigue practicando para mejorar.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="v2-card-outlined" style={{ padding: '24px', backgroundColor: 'var(--md-sys-color-tertiary-container)', color: 'var(--md-sys-color-on-tertiary-container)', border: 'none' }}>
                                    <h4 className="v2-title-large" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="material-icons">lightbulb</i>
                                        Perla Médica
                                    </h4>
                                    <p className="v2-body-large" style={{ lineHeight: '1.6' }}>
                                        Ante la sospecha de un Síndrome Coronario Agudo, el electrocardiograma es la herramienta diagnóstica inicial más importante para determinar la conducta terapéutica inmediata. Debe realizarse e interpretarse en menos de 10 minutos.
                                    </p>
                                </div>

                                <div style={{ textAlign: 'right', marginTop: '32px' }}>
                                    <button
                                        className="v2-btn-filled"
                                        style={{ height: '56px', padding: '0 40px' }}
                                        onClick={() => history.push('/v2/simulacro/resumen')}
                                    >
                                        Siguiente Caso
                                        <i className="material-icons">arrow_forward</i>
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
