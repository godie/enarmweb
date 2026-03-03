import { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Auth from '../../modules/Auth';

const V2PlayerDashboard = () => {
    const history = useHistory();
    const [state] = useState({
        stats: { completedCases: 12, accuracy: 75, streak: 3 },
        categories: [
            { id: 1, name: 'Medicina Interna', progress: 74 },
            { id: 2, name: 'Pediatría', progress: 62 },
            { id: 3, name: 'Cirugía General', progress: 48 },
            { id: 4, name: 'Ginecología y Obstetricia', progress: 81 }
        ],
        loading: false
    });

    const user = useMemo(() => {
        try {
            return Auth.getUserInfo() || { name: 'García' };
        } catch {
            return { name: 'García' };
        }
    }, []);

    return (
        <div className="v2-dashboard-grid">
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-medium">¡Hola, <span className="v2-text-primary">Dr. {user.name}</span>!</h1>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Continúa tu preparación para el ENARM donde te quedaste.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Featured Challenge */}
                <section className="v2-card v2-bg-primary" style={{ gridColumn: 'span 2', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 className="v2-title-large">Reto del Día: Medicina Interna</h2>
                        <p className="v2-body-large" style={{ margin: '16px 0 24px' }}>
                            Pon a prueba tus conocimientos con casos clínicos curados sobre Endocrinología y Metabolismo.
                            15 preguntas, 20 minutos.
                        </p>
                        <button
                            className="v2-card-tonal"
                            style={{ backgroundColor: 'white', color: 'var(--md-sys-color-primary)', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={() => history.push('/v2/caso/random')}
                        >
                            Comenzar Ahora →
                        </button>
                    </div>
                    <i className="material-icons" style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '150px', opacity: 0.1, color: 'white' }}>medical_information</i>
                </section>

                {/* Stats Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div className="v2-card" style={{ padding: '16px', marginBottom: '0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span className="v2-body-large">Precisión</span>
                         <i className="material-icons v2-text-primary">track_changes</i>
                      </div>
                      <h3 className="v2-headline-medium">{state.stats.accuracy}%</h3>
                   </div>
                   <div className="v2-card" style={{ padding: '16px', marginBottom: '0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span className="v2-body-large">Racha Actual</span>
                         <i className="material-icons v2-text-primary">local_fire_department</i>
                      </div>
                      <h3 className="v2-headline-medium">{state.stats.streak} días</h3>
                   </div>
                </div>

                {/* Specialties Progress */}
                <section className="v2-card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Progreso de Especialidades</h3>
                    {state.categories.map(cat => (
                        <div key={cat.id} style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span className="v2-body-large">{cat.name}</span>
                                <span>{cat.progress}%</span>
                            </div>
                            <div className="v2-linear-progress">
                                <div className="v2-linear-progress-bar" style={{ width: `${cat.progress}%` }}></div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Right Sidebar Mock (Recent Achievements) */}
                <section className="v2-card">
                    <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Logros Recientes</h3>
                    <div className="v2-card-tonal" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <i className="material-icons">emoji_events</i>
                        <span>Anatomy Master</span>
                    </div>
                    <div className="v2-card-tonal" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <i className="material-icons">bolt</i>
                        <span>7 Day Consistency</span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default V2PlayerDashboard;
