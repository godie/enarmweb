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
        <div className='v2-page-narrow v2-text-center' style={{ padding: '0 20px' }}>
            <div className='v2-mb-40'>
                <div className='v2-flex v2-flex-justify-center v2-gap-8 v2-mb-24'>
                    <div style={{ width: '40px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--md-sys-color-primary)' }}></div>
                    <div style={{ width: '40px', height: '8px', borderRadius: '4px', backgroundColor: step === 2 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-variant)' }}></div>
                </div>
            </div>

            {step === 1 && (
                <section className='v2-card v2-card-elevated v2-p-40'>
                    <h2 className='v2-headline-medium v2-mb-16'>Define tu Meta</h2>
                    <p className='v2-body-large v2-opacity-70 v2-mb-32'>¿Qué especialidad es tu prioridad para el ENARM?</p>
                    <div className='v2-grid-auto-fit-sm v2-gap-12' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                        {specialties.map(s => (
                            <button
                                key={s.name}
                                onClick={() => setSelectedSpec(s.name)}
                                className={`v2-btn-selectable v2-flex-col v2-flex-align-center v2-gap-12 ${selectedSpec === s.name ? 'v2-selected' : ''}`}
                                style={{ padding: '20px' }}
                            >
                                <i className='material-icons'>{s.icon}</i>
                                <span className='v2-label-large'>{s.name}</span>
                            </button>
                        ))}
                    </div>
                    <button
                        className='v2-btn-filled v2-btn-full v2-btn-h-56 v2-mt-48'
                        disabled={!selectedSpec}
                        onClick={() => setStep(2)}
                    >
                        Continuar
                        <i className='material-icons'>arrow_forward</i>
                    </button>
                </section>
            )}

            {step === 2 && (
                <section className='v2-card v2-card-elevated v2-p-40'>
                    <h2 className='v2-headline-medium v2-mb-16'>¿Cuándo es tu examen?</h2>
                    <p className='v2-body-large v2-opacity-70 v2-mb-32'>Selecciona el año en que presentarás el examen.</p>
                    <div className='v2-flex v2-gap-20 v2-flex-justify-center'>
                        {[2024, 2025, 2026].map(y => (
                            <button
                                key={y}
                                onClick={() => setSelectedYear(y)}
                                className={`v2-btn-selectable v2-flex-center v2-text-bold ${selectedYear === y ? 'v2-selected' : ''}`}
                                style={{ width: '100px', height: '100px', borderRadius: '50%', fontSize: '20px' }}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                    <button
                        className='v2-btn-filled v2-btn-full v2-btn-h-56 v2-mt-48'
                        disabled={!selectedYear}
                        onClick={() => history.push('/dashboard')}
                    >
                        ¡Empezar ahora!
                        <i className='material-icons'>rocket_launch</i>
                    </button>
                    <button
                        className='v2-btn-tonal v2-btn-full v2-btn-h-56 v2-mt-16'
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
