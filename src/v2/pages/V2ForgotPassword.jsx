import { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { alertSuccess, alertError } from '../../services/AlertService';
import CustomPreloader from '../../components/custom/CustomPreloader';
import '../styles/v2-theme.css';

const V2ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking the reset request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      alertSuccess('¡Enviado!', 'Revisa tu correo para las instrucciones de recuperación.');
    } catch (err) {
      alertError('Error', 'No pudimos procesar tu solicitud. Intenta más tarde.'); console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="v2-app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="v2-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            backgroundColor: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <i className="material-icons" style={{ fontSize: '40px' }}>lock_reset</i>
          </div>
          <h1 className="v2-headline-medium" style={{ color: 'var(--md-sys-color-primary)' }}>Recuperar Acceso</h1>
          <p className="v2-body-large" style={{ opacity: 0.7 }}>
            {submitted
                ? 'Las instrucciones han sido enviadas a tu correo.'
                : 'Ingresa tu correo para restablecer tu contraseña.'}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div className="v2-input-outlined">
              <label htmlFor="email">Correo Electrónico</label>
              <i className="material-icons" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--md-sys-color-outline)', marginTop: '12px' }} aria-hidden="true">mail</i>
              <input
                id="email"
                type="email"
                placeholder="doctor@medical.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
                style={{ paddingLeft: '48px' }}
              />
            </div>

            <button type="submit" className="v2-btn-filled" style={{ justifyContent: 'center', height: '56px' }} disabled={loading}>
              {loading ? (
                <span className="valign-wrapper">
                  <CustomPreloader size="small" color="white" />
                  <span style={{ marginLeft: '12px' }}>Procesando...</span>
                </span>
              ) : (
                <>
                  Enviar Instrucciones
                  <i className="material-icons" aria-hidden="true">send</i>
                </>
              )}
            </button>
          </form>
        ) : (
            <button
                className="v2-btn-tonal"
                style={{ width: '100%', justifyContent: 'center', height: '56px' }}
                onClick={() => history.push('/v2/login')}
            >
                Volver al Inicio de Sesión
            </button>
        )}

        <div style={{ marginTop: '32px', borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '24px' }}>
          <Link to="/v2/login" style={{ color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
            Regresar al Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default V2ForgotPassword;
