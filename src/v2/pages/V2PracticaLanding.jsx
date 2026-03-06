import { useHistory } from 'react-router-dom';

const V2PracticaLanding = () => {
    const history = useHistory();
    const specialties = [
        { id: 'mi', name: 'Medicina Interna', icon: 'medical_information' },
        { id: 'ped', name: 'Pediatría', icon: 'child_care' },
        { id: 'cg', name: 'Cirugía General', icon: 'precision_manufacturing' },
        { id: 'go', name: 'Ginecología y Obstetricia', icon: 'pregnant_woman' }
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-medium">Configura tu Sesión</h1>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Personaliza tu práctica diaria para el ENARM.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <section className="v2-card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Selecciona Especialidad</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {specialties.map(spec => (
                            <button
                                key={spec.id}
                                className="v2-card-tonal"
                                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', cursor: 'pointer', border: 'none', textAlign: 'left' }}
                                onClick={() => history.push(`/v2/caso/random`)}
                            >
                                <i className="material-icons v2-text-primary">{spec.icon}</i>
                                <span className="v2-body-large">{spec.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="v2-card">
                    <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Modo de Estudio</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="v2-card-tonal v2-bg-primary" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                            <i className="material-icons">timer</i>
                            <span>Simulacro (Con tiempo)</span>
                        </div>
                        <div className="v2-card-tonal" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                            <i className="material-icons">menu_book</i>
                            <span>Aprendizaje (Con retroalimentación)</span>
                        </div>
                    </div>
                </section>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'right' }}>
                <button
                    className="v2-fab v2-bg-primary"
                    style={{ width: 'auto', padding: '0 48px', height: '56px', borderRadius: '16px' }}
                    onClick={() => history.push('/v2/caso/random')}
                >
                    Comenzar <i className="material-icons" style={{ marginLeft: '8px' }}>play_arrow</i>
                </button>
            </div>
        </div>
    );
};

export default V2PracticaLanding;
