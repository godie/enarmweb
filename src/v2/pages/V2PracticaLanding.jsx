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
        <div className='v2-page-wide'>
            <header className='v2-mb-32'>
                <h1 className='v2-headline-medium'>Configura tu Sesión</h1>
                <p className='v2-body-large v2-opacity-70'>Personaliza tu práctica diaria para el ENARM.</p>
            </header>

            <div className='v2-grid-auto-fit v2-gap-24'>
                <section className='v2-card v2-specialties-grid'>
                    <h2 className='v2-title-large v2-mb-24'>Selecciona Especialidad</h2>
                    <div className='v2-grid-auto-fit-sm v2-gap-16'>
                        {specialties.map(spec => (
                            <button
                                key={spec.id}
                                className='v2-card-tonal v2-selectable-card v2-flex-align-center v2-gap-16'
                                style={{ padding: '16px', border: 'none', textAlign: 'left' }}
                                onClick={() => history.push(`/caso/random`)}
                            >
                                <i className="material-icons v2-text-primary">{spec.icon}</i>
                                <span className="v2-body-large">{spec.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className='v2-card'>
                    <h2 className='v2-title-large v2-mb-24'>Modo de Estudio</h2>
                    <div className='v2-flex-col v2-gap-12'>
                        <div className='v2-card-tonal v2-bg-primary v2-flex-align-center v2-gap-12' style={{ padding: '12px' }}>
                            <i className="material-icons">timer</i>
                            <span>Simulacro (Con tiempo)</span>
                        </div>
                        <div className='v2-card-tonal v2-flex-align-center v2-gap-12' style={{ padding: '12px' }}>
                            <i className="material-icons">menu_book</i>
                            <span>Aprendizaje (Con retroalimentación)</span>
                        </div>
                    </div>
                </section>
            </div>

            <div className='v2-mt-32 v2-text-right'>
                <button
                    className="v2-fab v2-bg-primary"
                    style={{ width: 'auto', padding: '0 48px', height: '56px', borderRadius: '16px' }}
                    onClick={() => history.push('/caso/random')}
                >
                    Comenzar <i className="material-icons" style={{ marginLeft: '8px' }}>play_arrow</i>
                </button>
            </div>
        </div>
    );
};

export default V2PracticaLanding;
