import { Link } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2Landing = () => {
  return (
    <div className="v2-landing-page" style={{ backgroundColor: 'var(--md-sys-color-background)', color: 'var(--md-sys-color-on-background)' }}>
      {/* Hero Section */}
      <section style={{ padding: '40px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ width: '100%', borderRadius: '28px', overflow: 'hidden', position: 'relative' }}>
          <img
            alt="Medical professional"
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2ZqS-e18KwtrBn8FS1vFrxwReVjp2j78x6wDbv8S2VJSoLhhQ3QxLp0h9ztrdIUAeuvxHDZLFWtDqAq6lkllEtLPpbj-Kb3SU4ATYYmhWfvmozrr5PlHa1kl2Reu1wq54QAix59yum2Cb7P4eyFWOgeRKwHfpbZwPQLrP_cYlJAYNZuh2vftVLvYKKeSieEKpQH0c-Vy4RQcY6vsTlI8ypyYcS7-k1j828GIJi9YLTDSurqDgSJEfPptN8SADb_ofEwfC6e4tnio"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(21, 158, 147, 0.4), transparent)' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1 className="v2-display-large" style={{ margin: 0, fontWeight: 900, lineHeight: 1.1 }}>
            Domina el ENARM con la mejor tecnología
          </h1>
          <p className="v2-headline-medium" style={{ margin: 0, opacity: 0.8 }}>
            La plataforma médica definitiva para tu preparación profesional con IA y simulacros reales.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
            <Link to="/login" className="v2-fab v2-bg-primary" style={{ width: 'auto', padding: '0 24px', textDecoration: 'none', fontWeight: 'bold' }}>
              <i className="material-icons" style={{ marginRight: '8px' }}>app_registration</i>
              Registrarse
            </Link>
            <Link to="/login" className="v2-card-tonal" style={{ display: 'flex', alignItems: 'center', padding: '0 24px', textDecoration: 'none', fontWeight: 'bold', height: '56px' }}>
              <i className="material-icons" style={{ marginRight: '8px', color: 'var(--md-sys-color-primary)' }}>play_circle</i>
              Ver Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section style={{ padding: '32px 16px', backgroundColor: 'rgba(21, 158, 147, 0.05)' }}>
        <h3 className="v2-title-large" style={{ marginBottom: '24px', fontWeight: 'bold' }}>Especialidades</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {[
            { name: 'Medicina Interna', icon: 'monitor_heart' },
            { name: 'Pediatría', icon: 'child_care' },
            { name: 'Cirugía', icon: 'content_cut' },
            { name: 'Gineco-Obstetricia', icon: 'pregnant_woman' }
          ].map((spec) => (
            <div key={spec.name} className="v2-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(21, 158, 147, 0.1)', color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="material-icons">{spec.icon}</i>
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{spec.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '48px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 className="v2-title-large" style={{ fontWeight: 'bold' }}>¿Por qué elegir ENARM V2?</h3>
        {[
          { title: 'Simulacros Reales', desc: 'Exámenes diseñados con la misma dificultad y formato del ENARM oficial.', icon: 'fact_check' },
          { title: 'IA de Retroalimentación', desc: 'Nuestra IA analiza tus errores y te sugiere temas específicos para reforzar.', icon: 'psychology' },
          { title: 'Ranking Nacional', desc: 'Compara tu rendimiento con miles de médicos aspirantes en todo el país.', icon: 'leaderboard' }
        ].map((feature) => (
          <div key={feature.title} className="v2-card" style={{ display: 'flex', gap: '16px', margin: 0 }}>
            <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(21, 158, 147, 0.1)', color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="material-icons">{feature.icon}</i>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '18px' }}>{feature.title}</h4>
              <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', lineHeight: 1.5 }}>{feature.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section style={{ margin: '32px 16px', padding: '40px', borderRadius: '40px', backgroundColor: 'var(--md-sys-color-primary)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', marginRight: '-64px', marginTop: '-64px' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>10,000+</h3>
          <p className="v2-title-large" style={{ margin: 0, opacity: 0.9 }}>Médicos ya confían en nosotros para su futuro profesional.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '48px 24px', backgroundColor: '#191c1b', color: '#dae5e1', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'white', marginBottom: '24px' }}>
          <i className="material-icons" style={{ color: 'var(--md-sys-color-primary)' }}>medical_services</i>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>ENARM V2</span>
        </div>
        <p style={{ fontSize: '14px', marginBottom: '24px' }}>
          La herramienta líder en educación médica continua. <br/>
          Prepárate hoy para el éxito de mañana.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
          <i className="material-icons" style={{ opacity: 0.6 }}>share</i>
          <i className="material-icons" style={{ opacity: 0.6 }}>contact_support</i>
          <i className="material-icons" style={{ opacity: 0.6 }}>mail</i>
        </div>
        <p style={{ fontSize: '10px', opacity: 0.5 }}>© {new Date().getFullYear()} ENARM V2 Tech. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default V2Landing;
