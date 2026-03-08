import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2Onboarding = () => {
    const [step, setStep] = useState(1);
    const history = useHistory();
    const specialties = [
        { name: 'Medicina Interna', icon: 'monitor_heart' },
        { name: 'Pediatría', icon: 'child_care' },
        { name: 'Cirugía General', icon: 'content_cut' },
        { name: 'Ginecología', icon: 'pregnant_woman' },
        { name: 'Urgencias', icon: 'medical_services' }
    ];

    const [selectedSpec, setSelectedSpec] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    return (
        <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '0 20px' }}>
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--md-sys-color-primary)' }}></div>
                    <div style={{ width: '40px', height: '8px', borderRadius: '4px', backgroundColor: step === 2 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-variant)' }}></div>
                </div>
            </div>

            {step === 1 && (
                <section className="v2-card v2-card-elevated" style={{ padding: '40px' }}>
                    <h2 className="v2-headline-medium" style={{ marginBottom: '16px' }}>Define tu Meta</h2>
                    <p className="v2-body-large" style={{ opacity: 0.7, marginBottom: '32px' }}>¿Qué especialidad es tu prioridad para el ENARM?</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                        {specialties.map(s => (
                            <button
                                key={s.name}
                                onClick={() => setSelectedSpec(s.name)}
                                className={selectedSpec === s.name ? 'v2-btn-filled' : 'v2-card-outlined'}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px', cursor: 'pointer' }}
                            >
                                <i className="material-icons">{s.icon}</i>
                                <span className="v2-label-large">{s.name}</span>
                            </button>
                        ))}
                    </div>
                    <button
                        className="v2-btn-filled"
                        style={{ marginTop: '48px', width: '100%', height: '56px', justifyContent: 'center' }}
                        disabled={!selectedSpec}
                        onClick={() => setStep(2)}
                    >
                        Continuar
                        <i className="material-icons">arrow_forward</i>
                    </button>
                </section>
            )}

            {step === 2 && (
                <section className="v2-card v2-card-elevated" style={{ padding: '40px' }}>
                    <h2 className="v2-headline-medium" style={{ marginBottom: '16px' }}>¿Cuándo es tu examen?</h2>
                    <p className="v2-body-large" style={{ opacity: 0.7, marginBottom: '32px' }}>Selecciona el año en que presentarás el examen.</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        {[2024, 2025, 2026].map(y => (
                            <button
                                key={y}
                                onClick={() => setSelectedYear(y)}
                                className={selectedYear === y ? 'v2-btn-filled' : 'v2-card-outlined'}
                                style={{ width: '100px', height: '100px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                    <button
                        className="v2-btn-filled"
                        style={{ marginTop: '48px', width: '100%', height: '56px', justifyContent: 'center' }}
                        disabled={!selectedYear}
                        onClick={() => history.push('/v2/dashboard')}
                    >
                        ¡Empezar ahora!
                        <i className="material-icons">rocket_launch</i>
                    </button>
                    <button
                        className="v2-btn-tonal"
                        style={{ marginTop: '16px', width: '100%', height: '56px', justifyContent: 'center' }}
                        onClick={() => setStep(1)}
                    >
                        Atrás
                    </button>
                </section>
            )}
        </div>
    );
};

export default V2Onboarding;
