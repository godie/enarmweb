import { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Auth from '../../modules/Auth';
import '../styles/v2-theme.css';

const V2PlayerDashboard = () => {
    const history = useHistory();
    const [stats] = useState({
        completedCases: 12,
        accuracy: 75,
        streak: 3,
        xp: 1250
    });

    const user = useMemo(() => {
        try {
            return Auth.getUserInfo() || { name: 'García' };
        } catch {
            return { name: 'García' };
        }
    }, []);

    return (
        <div className="v2-dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="v2-headline-medium">¡Hola, <span className="v2-text-primary">Dr. {user.name}</span>!</h1>
                    <p className="v2-body-large" style={{ opacity: 0.7 }}>Tu preparación va por excelente camino.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="v2-card-tonal" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '16px' }}>
                        <i className="material-icons v2-text-primary">local_fire_department</i>
                        <span style={{ fontWeight: 'bold' }}>{stats.streak} días</span>
                    </div>
                    <div className="v2-card-tonal" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '16px' }}>
                        <i className="material-icons v2-text-primary">bolt</i>
                        <span style={{ fontWeight: 'bold' }}>{stats.xp} XP</span>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Hero: Challenge of the Day */}
                <section className="v2-card v2-bg-primary" style={{ gridColumn: 'span 2', position: 'relative', overflow: 'hidden', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 className="v2-title-large">Reto del Día: Medicina Interna</h2>
                        <p className="v2-body-large" style={{ margin: '16px 0 24px', maxWidth: '80%' }}>
                            Analiza un caso complejo de Nefrología y pon a prueba tus conocimientos sobre desequilibrio hidroelectrolítico.
                        </p>
                        <button
                            className="v2-btn-tonal"
                            style={{ backgroundColor: 'white', color: 'var(--md-sys-color-primary)' }}
                            onClick={() => history.push('/v2/caso/random')}
                        >
                            Comenzar Ahora
                            <i className="material-icons">play_arrow</i>
                        </button>
                    </div>
                    <i className="material-icons" style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '180px', opacity: 0.1 }}>medical_information</i>
                </section>

                {/* Quick Actions / Stats Card */}
                <section className="v2-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 className="v2-title-large">Tu Progreso</h3>
                    <div className="v2-card-outlined" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="material-icons">track_changes</i>
                        </div>
                        <div>
                            <span className="v2-label-large">Precisión Global</span>
                            <h4 className="v2-title-large" style={{ margin: 0 }}>{stats.accuracy}%</h4>
                        </div>
                    </div>
                    <button className="v2-btn-filled" style={{ width: '100%', justifyContent: 'center' }} onClick={() => history.push('/v2/simulacro/setup')}>
                        Nuevo Simulacro
                        <i className="material-icons">quiz</i>
                    </button>
                </section>

                {/* Categories Progress */}
                <section className="v2-card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Dominios Médicos</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {[
                            { name: 'Medicina Interna', progress: 74, color: '#0fa397' },
                            { name: 'Pediatría', progress: 62, color: '#4a6360' },
                            { name: 'Cirugía General', progress: 48, color: '#456179' },
                            { name: 'Ginecología', progress: 81, color: '#ba1a1a' }
                        ].map(cat => (
                            <div key={cat.name}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span className="v2-label-large">{cat.name}</span>
                                    <span className="v2-label-large">{cat.progress}%</span>
                                </div>
                                <div className="v2-linear-progress" style={{ height: '6px' }}>
                                    <div className="v2-linear-progress-bar" style={{ width: `${cat.progress}%`, backgroundColor: cat.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Achievements */}
                <section className="v2-card">
                    <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Logros Recientes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="v2-card-tonal" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="material-icons" style={{ color: '#ffd700' }}>emoji_events</i>
                            <span className="v2-label-large">Racha de 7 Días</span>
                        </div>
                        <div className="v2-card-tonal" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="material-icons" style={{ color: '#00bfff' }}>military_tech</i>
                            <span className="v2-label-large">Experto en EKG</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default V2PlayerDashboard;
