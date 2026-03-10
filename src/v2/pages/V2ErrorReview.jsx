import { useState } from 'react';
import '../styles/v2-theme.css';

const V2ErrorReview = () => {
    const [data] = useState({
        mostFailedSpecialties: [
            { id: 'esp1', name: 'Ginecología', count: 15, color: '#ba1a1a' },
            { id: 'esp2', name: 'Pediatría', count: 10, color: '#456179' },
            { id: 'esp3', name: 'Medicina Interna', count: 8, color: '#4a6360' }
        ],
        recentFailedQuestions: [
            {
                id: 'q1',
                question: 'Paciente masculino de 45 años con dolor precordial opresivo...',
                correctAnswer: 'Infarto Agudo al Miocardio con elevación del ST',
                userAnswer: 'Angina Inestable',
                explanation: 'La elevación del segmento ST en el EKG es patognomónica de oclusión total...',
                specialty: 'Cardiología'
            },
            {
                id: 'q2',
                question: 'Tratamiento de primera línea para la preeclampsia con datos de severidad...',
                correctAnswer: 'Sulfato de Magnesio',
                userAnswer: 'Hidralazina únicamente',
                explanation: 'El sulfato de magnesio es el fármaco de elección para la prevención de eclampsia...',
                specialty: 'Ginecología'
            }
        ]
    });

    return (
        <div className="v2-error-review-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-medium">Revisión de Errores</h1>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Analiza tus debilidades para convertirlas en fortalezas</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* Most Failed Specialties */}
                <section className="v2-card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Debilidades por Especialidad</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.mostFailedSpecialties.map(esp => (
                            <div key={esp.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span className="v2-label-large">{esp.name}</span>
                                    <span className="v2-label-large" style={{ color: esp.color }}>{esp.count} errores</span>
                                </div>
                                <div className="v2-linear-progress" style={{ height: '8px' }}>
                                    <div
                                        className="v2-linear-progress-bar"
                                        style={{
                                            width: `${(esp.count / data.mostFailedSpecialties[0].count) * 100}%`,
                                            backgroundColor: esp.color
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Summary Stats */}
                <section className="v2-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <i className="material-icons" aria-hidden="true" style={{ fontSize: '40px' }}>warning</i>
                    </div>
                    <h4 className="v2-headline-medium" style={{ margin: '0 0 4px 0', color: 'var(--md-sys-color-error)' }}>{data.mostFailedSpecialties.reduce((acc, curr) => acc + curr.count, 0)}</h4>
                    <span className="v2-label-large">Errores totales registrados</span>
                </section>
            </div>

            {/* Recent Failed Questions */}
            <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Preguntas Falladas Recientemente</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {data.recentFailedQuestions.map(q => (
                    <article key={q.id} className="v2-card v2-card-elevated">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <span className="v2-label-large" style={{ color: 'var(--md-sys-color-primary)', backgroundColor: 'var(--md-sys-color-primary-container)', padding: '4px 12px', borderRadius: '8px' }}>
                                {q.specialty}
                            </span>
                        </div>
                        <p className="v2-body-large" style={{ fontWeight: '500', marginBottom: '20px' }}>{q.question}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            <div className="v2-card-tonal" style={{ backgroundColor: '#ffdad6', color: '#410002', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <i className="material-icons" aria-hidden="true" style={{ fontSize: '20px' }}>close</i>
                                <span className="v2-body-large">Tu respuesta: <strong>{q.userAnswer}</strong></span>
                            </div>
                            <div className="v2-card-tonal" style={{ backgroundColor: '#d2e8e5', color: '#00201e', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <i className="material-icons" aria-hidden="true" style={{ fontSize: '20px' }}>check</i>
                                <span className="v2-body-large">Respuesta correcta: <strong>{q.correctAnswer}</strong></span>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '16px' }}>
                            <h4 className="v2-label-large" style={{ marginBottom: '8px', color: 'var(--md-sys-color-primary)' }}>EXPLICACIÓN</h4>
                            <p className="v2-body-large" style={{ fontSize: '14px', opacity: 0.8 }}>{q.explanation}</p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default V2ErrorReview;
