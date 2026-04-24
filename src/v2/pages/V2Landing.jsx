
import { Link } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2Landing = () => {
  return (
    <main className='v2-app-container v2-min-h-screen'>
      {/* Hero Section */}
      <section className='v2-landing-hero' style={{ padding: '60px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '48px', alignItems: 'center' }}>
        <div className='v2-flex-col v2-gap-32'>
          <div className='v2-flex-align-center v2-gap-12 v2-bg-primary-container v2-fit-content' style={{ padding: '8px 24px', borderRadius: '40px' }}>
            <i className="material-icons">verified</i>
            <span className="v2-label-large">PREPARACIÓN ELITE ENARM 2024</span>
          </div>

          <h1 className='v2-display-large v2-text-bold' style={{ lineHeight: '1.1' }}>
            Domina el ENARM con <span className="v2-text-primary">Tecnología MD3</span>
          </h1>

          <p className='v2-headline-medium v2-opacity-80' style={{ fontWeight: '400' }}>
            La plataforma médica definitiva para tu preparación profesional con IA, simulacros inmersivos y analíticas de precisión.
          </p>

          <div className='v2-flex v2-flex-wrap v2-gap-16'>
            <Link to='/signup' className='v2-btn-filled v2-text-decoration-none' style={{ height: '64px', padding: '0 40px', fontSize: '18px' }}>
              <i className="material-icons">app_registration</i>
              Registrarme Ahora
            </Link>
            <Link to='/login' className='v2-btn-tonal v2-text-decoration-none' style={{ height: '64px', padding: '0 40px', fontSize: '18px' }}>
              Iniciar Sesión
            </Link>
          </div>
        </div>

        <div className='v2-position-relative'>
          <div style={{
            position: 'absolute', inset: '-20px',
            background: 'radial-gradient(circle, var(--md-sys-color-primary-container) 0%, transparent 70%)',
            opacity: 0.5, borderRadius: '50%', filter: 'blur(40px)'
          }}></div>
          <img
            alt="Medical Dashboard"
            style={{ width: '100%', height: 'auto', borderRadius: '40px', boxShadow: 'var(--v2-shadow-3)', position: 'relative' }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2ZqS-e18KwtrBn8FS1vFrxwReVjp2j78x6wDbv8S2VJSoLhhQ3QxLp0h9ztrdIUAeuvxHDZLFWtDqAq6lkllEtLPpbj-Kb3SU4ATYYmhWfvmozrr5PlHa1kl2Reu1wq54QAix59yum2Cb7P4eyFWOgeRKwHfpbZwPQLrP_cYlJAYNZuh2vftVLvYKKeSieEKpQH0c-Vy4RQcY6vsTlI8ypyYcS7-k1j828GIJi9YLTDSurqDgSJEfPptN8SADb_ofEwfC6e4tnio"
          />
        </div>
      </section>

      {/* Specialties Grid */}
      <section className='v2-bg-surface-variant v2-landing-section' style={{ padding: '80px 24px' }}>
        <div className='v2-page-hero'>
          <h2 className='v2-headline-medium v2-mb-40 v2-text-center'>Áreas Médicas de Especialización</h2>
          <div className='v2-landing-specialties-grid' style={{ gap: '24px' }}>
            {[
              { name: 'Medicina Interna', icon: 'monitor_heart', color: '#0fa397' },
              { name: 'Pediatría', icon: 'child_care', color: '#4a6360' },
              { name: 'Cirugía', icon: 'content_cut', color: '#456179' },
              { name: 'Gineco-Obstetricia', icon: 'pregnant_woman', color: '#ba1a1a' }
            ].map((spec) => (
              <div key={spec.name} className='v2-card v2-text-center' style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '20px',
                  backgroundColor: `${spec.color}15`, color: spec.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className="material-icons" style={{ fontSize: '32px' }}>{spec.icon}</i>
                </div>
                <h3 className='v2-title-large v2-text-bold'>{spec.name}</h3>
                <p className='v2-body-large v2-opacity-70'>Casos actualizados basados en guías de práctica clínica internacionales.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='v2-landing-section v2-text-center' style={{ padding: '80px 24px' }}>
        <div className='v2-card v2-bg-primary v2-position-relative v2-overflow-hidden' style={{ padding: '80px 40px', borderRadius: '60px' }}>
          <div className='v2-position-relative v2-z-1'>
            <h2 className='v2-display-large v2-text-bold v2-mb-20'>150,000+</h2>
            <p className='v2-headline-medium v2-opacity-80'>Casos clínicos resueltos por nuestra comunidad.</p>
            <div className='v2-mt-48'>
               <Link to='/signup' className='v2-btn-tonal' style={{ backgroundColor: 'var(--md-sys-color-on-primary)', color: 'var(--md-sys-color-primary)', padding: '20px 60px', fontSize: '20px' }}>
                 Únete al Grupo de Élite
               </Link>
            </div>
          </div>
          <i className="material-icons" style={{ position: 'absolute', right: '-40px', bottom: '-40px', fontSize: '300px', opacity: 0.1 }}>diversity_3</i>
        </div>
      </section>

      {/* Footer */}
      <footer className='v2-landing-footer' style={{ backgroundColor: 'var(--md-sys-color-on-background)', color: 'var(--md-sys-color-background)', padding: '80px 24px' }}>
        <div className='v2-page-hero v2-flex v2-flex-justify-between v2-flex-wrap v2-gap-32 v2-landing-footer-content' style={{ gap: '40px' }}>
          <div style={{ maxWidth: '400px' }}>
            <div className='v2-flex-align-center v2-gap-12 v2-mb-24'>
              <i className="material-icons" style={{ color: 'var(--md-sys-color-primary)', fontSize: '32px' }}>stethoscope</i>
              <span className="v2-headline-medium" style={{ color: 'var(--md-sys-color-background)', fontWeight: 'bold' }}>ENARM V2</span>
            </div>
            <p className='v2-body-large v2-opacity-60'>
              La evolución en educación médica continua. Desarrollada por y para médicos especialistas.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="v2-label-large" style={{ color: 'var(--md-sys-color-background)' }}>PLATAFORMA</span>
              <span style={{ opacity: 0.6 }}>Características</span>
              <span style={{ opacity: 0.6 }}>Simulacros</span>
              <span style={{ opacity: 0.6 }}>Ranking</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="v2-label-large" style={{ color: 'var(--md-sys-color-background)' }}>RECURSOS</span>
              <span style={{ opacity: 0.6 }}>Guías GPC</span>
              <span style={{ opacity: 0.6 }}>Blog Médico</span>
              <span style={{ opacity: 0.6 }}>Soporte</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default V2Landing;
