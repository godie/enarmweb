import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const V2Onboarding = () => {
    const [step, setStep] = useState(1);
    const history = useHistory();
    const specialties = ['Medicina Interna', 'Pediatría', 'Cirugía General', 'Ginecología', 'Urgencias'];

    return (
        <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
            {step === 1 && (
                <section className="v2-card">
                    <h2 className="v2-headline-medium">Paso 1: Define tu Meta</h2>
                    <p className="v2-body-large" style={{ margin: '24px 0' }}>¿Qué especialidad es tu prioridad?</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                        {specialties.map(s => (
                            <button key={s} className="v2-card-tonal" style={{ padding: '12px 24px', borderRadius: '24px', border: '1px solid #ccc', cursor: 'pointer' }}>{s}</button>
                        ))}
                    </div>
                    <button className="v2-fab v2-bg-primary" style={{ marginTop: '40px', width: '100%' }} onClick={() => setStep(2)}>Continuar</button>
                </section>
            )}

            {step === 2 && (
                <section className="v2-card">
                    <h2 className="v2-headline-medium">Paso 2: ¿Cuándo es tu examen?</h2>
                    <p className="v2-body-large" style={{ margin: '24px 0' }}>Selecciona el año en que presentarás el ENARM.</p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        {[2024, 2025, 2026].map(y => (
                            <button key={y} className="v2-card-tonal" style={{ width: '100px', height: '100px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>{y}</button>
                        ))}
                    </div>
                    <button className="v2-fab v2-bg-primary" style={{ marginTop: '40px', width: '100%' }} onClick={() => history.push('/v2/dashboard')}>¡Empezar ahora!</button>
                </section>
            )}
        </div>
    );
};

export default V2Onboarding;
