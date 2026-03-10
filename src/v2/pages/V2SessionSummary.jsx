
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2SessionSummary = () => {
  const history = useHistory();
  const stats = {
    accuracy: 85,
    xp: 450,
    time: '24:15',
    rank: '+12'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <header style={{ marginBottom: '40px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          backgroundColor: 'var(--md-sys-color-primary-container)',
          color: 'var(--md-sys-color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <i className="material-icons" style={{ fontSize: '48px' }}>emoji_events</i>
        </div>
        <h1 className="v2-display-large" style={{ marginBottom: '8px' }}>¡Sesión Completada!</h1>
        <p className="v2-body-large" style={{ opacity: 0.7 }}>Buen trabajo, Doctor. Has mejorado tus métricas hoy.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        <div className="v2-card" style={{ padding: '20px' }}>
          <i className="material-icons v2-text-primary">track_changes</i>
          <h3 className="v2-headline-medium" style={{ margin: '8px 0' }}>{stats.accuracy}%</h3>
          <span className="v2-label-large">Precisión</span>
        </div>
        <div className="v2-card" style={{ padding: '20px' }}>
          <i className="material-icons v2-text-primary">bolt</i>
          <h3 className="v2-headline-medium" style={{ margin: '8px 0' }}>+{stats.xp}</h3>
          <span className="v2-label-large">XP Ganado</span>
        </div>
        <div className="v2-card" style={{ padding: '20px' }}>
          <i className="material-icons v2-text-primary">timer</i>
          <h3 className="v2-headline-medium" style={{ margin: '8px 0' }}>{stats.time}</h3>
          <span className="v2-label-large">Tiempo Total</span>
        </div>
        <div className="v2-card" style={{ padding: '20px' }}>
          <i className="material-icons v2-text-primary">leaderboard</i>
          <h3 className="v2-headline-medium" style={{ margin: '8px 0' }}>{stats.rank}</h3>
          <span className="v2-label-large">Posición Ranking</span>
        </div>
      </div>

      <section className="v2-card" style={{ textAlign: 'left', marginBottom: '32px' }}>
        <h3 className="v2-title-large" style={{ marginBottom: '16px' }}>Análisis por Tema</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Cardiología</span>
              <span>100%</span>
            </div>
            <div className="v2-linear-progress">
              <div className="v2-linear-progress-bar" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Endocrinología</span>
              <span>60%</span>
            </div>
            <div className="v2-linear-progress">
              <div className="v2-linear-progress-bar" style={{ width: '60%', backgroundColor: 'var(--md-sys-color-error)' }}></div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button className="v2-btn-tonal" onClick={() => history.push('/v2/dashboard')} style={{ height: '56px', padding: '0 32px' }}>
          Volver al Inicio
        </button>
        <button className="v2-btn-filled" onClick={() => history.push('/v2/practica')} style={{ height: '56px', padding: '0 32px' }}>
          Nueva Sesión
          <i className="material-icons">refresh</i>
        </button>
      </div>
    </div>
  );
};

export default V2SessionSummary;
