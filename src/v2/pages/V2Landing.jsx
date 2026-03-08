
import { Link } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2Landing = () => {
  return (
    <div className="v2-app-container" style={{ backgroundColor: 'var(--md-sys-color-background)', color: 'var(--md-sys-color-on-background)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            backgroundColor: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-primary)',
            padding: '8px 24px', borderRadius: '40px', width: 'fit-content'
          }}>
            <i className="material-icons">verified</i>
            <span className="v2-label-large">PREPARACIÓN ELITE ENARM 2024</span>
          </div>

          <h1 className="v2-display-large" style={{ fontWeight: '800', lineHeight: '1.1', color: 'var(--md-sys-color-on-surface)' }}>
            Domina el ENARM con <span className="v2-text-primary">Tecnología MD3</span>
          </h1>

          <p className="v2-headline-medium" style={{ opacity: 0.8, fontWeight: '400' }}>
            La plataforma médica definitiva para tu preparación profesional con IA, simulacros inmersivos y analíticas de precisión.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Link to="/v2/signup" className="v2-btn-filled" style={{ height: '64px', padding: '0 40px', textDecoration: 'none', fontSize: '18px' }}>
              <i className="material-icons">app_registration</i>
              Registrarme Ahora
            </Link>
            <Link to="/v2/login" className="v2-btn-tonal" style={{ height: '64px', padding: '0 40px', textDecoration: 'none', fontSize: '18px' }}>
              Iniciar Sesión
            </Link>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
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
      <section style={{ backgroundColor: 'var(--md-sys-color-surface-variant)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="v2-headline-medium" style={{ marginBottom: '40px', textAlign: 'center' }}>Áreas Médicas de Especialización</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Medicina Interna', icon: 'monitor_heart', color: '#0fa397' },
              { name: 'Pediatría', icon: 'child_care', color: '#4a6360' },
              { name: 'Cirugía', icon: 'content_cut', color: '#456179' },
              { name: 'Gineco-Obstetricia', icon: 'pregnant_woman', color: '#ba1a1a' }
            ].map((spec) => (
              <div key={spec.name} className="v2-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '20px',
                  backgroundColor: `${spec.color}15`, color: spec.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i className="material-icons" style={{ fontSize: '32px' }}>{spec.icon}</i>
                </div>
                <h3 className="v2-title-large" style={{ fontWeight: '700' }}>{spec.name}</h3>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Casos actualizados basados en guías de práctica clínica internacionales.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div className="v2-card v2-bg-primary" style={{ padding: '80px 40px', borderRadius: '60px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '64px', fontWeight: '900', marginBottom: '20px' }}>150,000+</h2>
            <p className="v2-headline-medium" style={{ opacity: 0.9 }}>Casos clínicos resueltos por nuestra comunidad.</p>
            <div style={{ marginTop: '48px' }}>
               <Link to="/v2/signup" className="v2-btn-tonal" style={{ backgroundColor: 'white', color: 'var(--md-sys-color-primary)', padding: '20px 60px', fontSize: '20px' }}>
                 Únete al Grupo de Élite
               </Link>
            </div>
          </div>
          <i className="material-icons" style={{ position: 'absolute', right: '-40px', bottom: '-40px', fontSize: '300px', opacity: 0.1 }}>diversity_3</i>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--md-sys-color-on-background)', color: 'var(--md-sys-color-background)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <i className="material-icons" style={{ color: 'var(--md-sys-color-primary)', fontSize: '32px' }}>stethoscope</i>
              <span className="v2-headline-medium" style={{ color: 'white', fontWeight: 'bold' }}>ENARM V2</span>
            </div>
            <p className="v2-body-large" style={{ opacity: 0.6 }}>
              La evolución en educación médica continua. Desarrollada por y para médicos especialistas.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="v2-label-large" style={{ color: 'white' }}>PLATAFORMA</span>
              <span style={{ opacity: 0.6 }}>Características</span>
              <span style={{ opacity: 0.6 }}>Simulacros</span>
              <span style={{ opacity: 0.6 }}>Ranking</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="v2-label-large" style={{ color: 'white' }}>RECURSOS</span>
              <span style={{ opacity: 0.6 }}>Guías GPC</span>
              <span style={{ opacity: 0.6 }}>Blog Médico</span>
              <span style={{ opacity: 0.6 }}>Soporte</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default V2Landing;
