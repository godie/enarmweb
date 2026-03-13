import { useReducer, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import UserExamService from '../../services/UserExamService';
import CustomPreloader from '../../components/custom/CustomPreloader';
import '../styles/v2-theme.css';

const initialState = {
    loading: true,
    error: null,
    caseData: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, caseData: action.payload, error: null };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const V2CaseStudy = () => {
    const { id } = useParams();
    const history = useHistory();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchCase = async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                // Simulate fetching clinical case study data
                // In real app: const response = await UserExamService.getUserExam(id);

                setTimeout(() => {
                    const data = {
                        id: id,
                        title: "Caso Clínico: Lactante con Dificultad Respiratoria",
                        specialty: "Pediatría",
                        difficulty: "Media",
                        content: "Lactante masculino de 8 meses de edad que acude a urgencias por presentar cuadro de 48 horas de evolución caracterizado por rinorrea hialina, estornudos y tos productiva. En las últimas 12 horas se agrega dificultad respiratoria y rechazo a las tomas.",
                        physicalExam: "A la exploración física: FR 60 rpm, FC 140 lpm, SatO2 88% aire ambiente. Se observa retracción xifoidea y aleteo nasal. A la auscultación campos pulmonares con presencia de sibilancias espiratorias y estertores crepitantes finos bilaterales.",
                        questions: [
                            {
                                id: "q1",
                                question: "¿Cuál es el diagnóstico más probable?",
                                userAnswer: "Bronquiolitis aguda",
                                correctAnswer: "Bronquiolitis aguda",
                                isCorrect: true,
                                explanation: "La bronquiolitis es la primera causa de sibilancias en menores de 2 años, precedida habitualmente por un cuadro catarral."
                            },
                            {
                                id: "q2",
                                question: "¿Cuál es el agente etiológico más frecuente?",
                                userAnswer: "Adenovirus",
                                correctAnswer: "Virus Sincitial Respiratorio (VSR)",
                                isCorrect: false,
                                explanation: "El VSR es responsable de hasta el 75-80% de los casos de bronquiolitis aguda."
                            }
                        ],
                        feedback: "Tu desempeño en este caso fue aceptable, pero debes repasar los agentes etiológicos en patología respiratoria pediátrica."
                    };
                    dispatch({ type: 'FETCH_SUCCESS', payload: data });
                }, 800);
            } catch (err) {
                console.error("Error fetching case study:", err);
                dispatch({ type: 'FETCH_ERROR', payload: "Ocurrió un error al cargar el estudio de caso." });
            }
        };

        fetchCase();
    }, [id]);

    const { loading, error, caseData } = state;

    if (loading) return <div className="center-align" style={{ padding: '40px' }}><CustomPreloader /></div>;
    if (error) return <div className="center-align red-text" style={{ padding: '40px' }}>{error}</div>;

    return (
        <div className="v2-case-study-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                    className="v2-btn-tonal"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, minWidth: '40px' }}
                    onClick={() => history.goBack()}
                >
                    <i className="material-icons">arrow_back</i>
                </button>
                <div>
                    <div className="v2-label-large" style={{ color: 'var(--md-sys-color-primary)' }}>{caseData.specialty} • {caseData.difficulty}</div>
                    <h1 className="v2-headline-small" style={{ margin: 0 }}>{caseData.title}</h1>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="v2-card">
                        <h2 className="v2-title-large" style={{ marginBottom: '16px' }}>Presentación del Caso</h2>
                        <p className="v2-body-large" style={{ lineHeight: '1.6' }}>{caseData.content}</p>
                        <h3 className="v2-title-medium" style={{ marginTop: '20px', marginBottom: '12px' }}>Exploración Física</h3>
                        <p className="v2-body-large" style={{ lineHeight: '1.6' }}>{caseData.physicalExam}</p>
                    </section>

                    <section>
                        <h2 className="v2-title-large" style={{ marginBottom: '16px' }}>Revisión de Preguntas</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {caseData.questions.map((q, index) => (
                                <div key={q.id} className="v2-card-tonal" style={{ borderLeft: `4px solid ${q.isCorrect ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)'}` }}>
                                    <div className="v2-label-medium" style={{ marginBottom: '8px', opacity: 0.7 }}>Pregunta {index + 1}</div>
                                    <div className="v2-title-medium" style={{ marginBottom: '12px' }}>{q.question}</div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', backgroundColor: q.isCorrect ? 'rgba(15, 163, 151, 0.1)' : 'rgba(186, 26, 26, 0.1)' }}>
                                            <span className="v2-body-medium">Tu respuesta: <b>{q.userAnswer}</b></span>
                                            <i className="material-icons" style={{ fontSize: '20px', color: q.isCorrect ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)' }}>
                                                {q.isCorrect ? 'check_circle' : 'cancel'}
                                            </i>
                                        </div>
                                        {!q.isCorrect && (
                                            <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 163, 151, 0.1)' }}>
                                                <span className="v2-body-medium">Respuesta correcta: <b>{q.correctAnswer}</b></span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="v2-card" style={{ backgroundColor: 'var(--md-sys-color-surface-variant)', padding: '12px' }}>
                                        <div className="v2-label-small" style={{ marginBottom: '4px', fontWeight: 'bold' }}>EXPLICACIÓN</div>
                                        <p className="v2-body-small" style={{ margin: 0 }}>{q.explanation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="v2-card-elevated" style={{ backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', textAlign: 'center' }}>
                        <i className="material-icons" style={{ fontSize: '48px', marginBottom: '12px' }}>analytics</i>
                        <h3 className="v2-title-large">Resultado</h3>
                        <div className="v2-headline-medium">50%</div>
                        <p className="v2-label-medium">1 de 2 correctas</p>
                    </section>

                    <section className="v2-card">
                        <h3 className="v2-title-medium" style={{ marginBottom: '12px' }}>Retroalimentación</h3>
                        <p className="v2-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{caseData.feedback}</p>
                        <button className="v2-btn-tonal" style={{ width: '100%', marginTop: '16px' }}>
                            <i className="material-icons" style={{ marginRight: '8px' }}>bookmark</i>
                            Guardar para repaso
                        </button>
                    </section>

                    <button className="v2-btn-primary" onClick={() => history.push('/v2/practica')} style={{ height: '56px' }}>
                        Siguiente Caso
                    </button>
                </div>
            </div>
        </div>
    );
};

export default V2CaseStudy;
