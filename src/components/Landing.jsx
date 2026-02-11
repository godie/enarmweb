import { Link } from 'react-router-dom';
import './Landing.css';
import {
  CustomRow,
  CustomCol,
  CustomButton,
} from './custom';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="landing-hero green darken-1 white-text">
        <div className="container">
          <div className="landing-badge white-text green lighten-2 grey-text text-darken-3">
            <i className="material-icons landing-badge-icon" aria-hidden="true">bolt</i>
            <span>Plataforma de preparación ENARM</span>
          </div>
          <h1 className="landing-hero-title white-text">
            Tu camino hacia la Residencia Médica
          </h1>
          <p className="landing-hero-desc white-text flow-text" style={{ opacity: 0.95 }}>
            Prepárate para el Examen Nacional de Residencias Médicas con casos clínicos, simuladores y seguimiento personalizado de tu progreso.
          </p>
          <div className="landing-hero-actions">
            <CustomButton
              node="a"
              href="#/login"
              large
              className="green darken-1 white-text waves-light"
              icon="arrow_forward"
              iconPosition="right"
            >
              Comenzar Ahora
            </CustomButton>
            <CustomButton
              node="a"
              href="#/login"
              large
              flat
              className="white green-text text-darken-1 waves-light landing-btn-outline"
              icon="play_arrow"
              iconPosition="left"
            >
              Ver Demo
            </CustomButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section landing-features">
        <div className="container">
          <h2 className="landing-section-title grey-text text-darken-3 center-align">
            Todo lo que necesitas para aprobar
          </h2>
          <p className="landing-section-desc grey-text text-darken-2 center-align flow-text">
            Herramientas diseñadas por médicos para futuros residentes
          </p>
          <CustomRow>
            <CustomCol s={12} m={4}>
              <div className="card landing-feature-card z-depth-1">
                <div className="card-content center-align">
                  <div className="landing-feature-icon green-text text-lighten-2">
                    <i className="material-icons" aria-hidden="true">menu_book</i>
                  </div>
                  <h5 className="grey-text text-darken-3">Casos Clínicos Reales</h5>
                  <p className="grey-text text-darken-2">
                    Practica con escenarios basados en exámenes anteriores del ENARM
                  </p>
                </div>
              </div>
            </CustomCol>
            <CustomCol s={12} m={4}>
              <div className="card landing-feature-card z-depth-1">
                <div className="card-content center-align">
                  <div className="landing-feature-icon green-text text-lighten-2">
                    <i className="material-icons" aria-hidden="true">emoji_events</i>
                  </div>
                  <h5 className="grey-text text-darken-3">Seguimiento de Progreso</h5>
                  <p className="grey-text text-darken-2">
                    Monitorea tu avance por especialidad y compara tu desempeño
                  </p>
                </div>
              </div>
            </CustomCol>
            <CustomCol s={12} m={4}>
              <div className="card landing-feature-card z-depth-1">
                <div className="card-content center-align">
                  <div className="landing-feature-icon green-text text-lighten-2">
                    <i className="material-icons" aria-hidden="true">groups</i>
                  </div>
                  <h5 className="grey-text text-darken-3">Comunidad Médica</h5>
                  <p className="grey-text text-darken-2">
                    Aprende junto a miles de médicos preparándose para el examen
                  </p>
                </div>
              </div>
            </CustomCol>
          </CustomRow>
        </div>
      </section>

      {/* Statistics */}
      <section className="landing-stats green darken-1 white-text">
        <div className="container">
          <CustomRow className="landing-stats-row">
            <CustomCol s={6} m={3}>
              <div className="landing-stat center-align">
                <span className="landing-stat-number">10,000+</span>
                <span className="landing-stat-label">Casos Clínicos</span>
              </div>
            </CustomCol>
            <CustomCol s={6} m={3}>
              <div className="landing-stat center-align">
                <span className="landing-stat-number">50,000+</span>
                <span className="landing-stat-label">Estudiantes</span>
              </div>
            </CustomCol>
            <CustomCol s={6} m={3}>
              <div className="landing-stat center-align">
                <span className="landing-stat-number">85%</span>
                <span className="landing-stat-label">Tasa de Aprobación</span>
              </div>
            </CustomCol>
            <CustomCol s={6} m={3}>
              <div className="landing-stat center-align">
                <span className="landing-stat-number">35</span>
                <span className="landing-stat-label">Especialidades</span>
              </div>
            </CustomCol>
          </CustomRow>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-section landing-cta">
        <div className="container center-align">
          <h2 className="landing-section-title grey-text text-darken-3">
            ¿Listo para comenzar tu preparación?
          </h2>
          <p className="landing-section-desc grey-text text-darken-2 flow-text">
            Únete a miles de médicos que ya están un paso más cerca de su residencia
          </p>
          <CustomButton
            node="a"
            href="#/login"
            large
            className="green darken-1 white-text waves-light"
            icon="arrow_forward"
            iconPosition="right"
          >
            Crear Cuenta Gratis
          </CustomButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <CustomRow className="valign-wrapper" style={{ marginBottom: 0 }}>
            <CustomCol s={12} m={6}>
              <Link to="/" className="landing-footer-brand grey-text text-darken-3 valign-wrapper">
                <i className="material-icons green-text text-lighten-2 landing-footer-logo" aria-hidden="true">bolt</i>
                <span>ENARM Prep</span>
              </Link>
            </CustomCol>
            <CustomCol s={12} m={6} className="right-align">
              <span className="grey-text text-darken-2">
                © {new Date().getFullYear()} ENARM Prep. Todos los derechos reservados.
              </span>
            </CustomCol>
          </CustomRow>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
