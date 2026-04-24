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
    <main className='v2-app-container v2-page-centered'>
      <div className='v2-card v2-page-centered-content'>
        <div className='v2-mb-24'>
          <div className='v2-icon-box-xl v2-icon-box-primary v2-mx-auto v2-mb-16'>
            <i className='material-icons' style={{ fontSize: '40px' }}>lock_reset</i>
          </div>
          <h1 className='v2-headline-medium v2-text-primary'>Recuperar Acceso</h1>
          <p className='v2-body-large v2-opacity-70'>
            {submitted
                ? 'Las instrucciones han sido enviadas a tu correo.'
                : 'Ingresa tu correo para restablecer tu contraseña.'}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleResetRequest} className='v2-flex-col v2-gap-20 v2-text-left'>
            <div className='v2-input-outlined'>
              <label htmlFor='email'>Correo Electrónico</label>
              <i className='material-icons v2-input-prefix-icon' aria-hidden='true'>mail</i>
              <input
                id='email'
                type='email'
                placeholder='doctor@medical.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='v2-input-with-prefix'
              />
            </div>

            <button type='submit' className='v2-btn-filled v2-btn-full v2-btn-h-56' disabled={loading}>
              {loading ? (
                <span className='v2-flex-align-center v2-gap-12'>
                  <CustomPreloader size='small' />
                  Procesando...
                </span>
              ) : (
                <>
                  Enviar Instrucciones
                  <i className='material-icons'>send</i>
                </>
              )}
            </button>
          </form>
        ) : (
            <button
                className='v2-btn-tonal v2-btn-full v2-btn-h-56'
                onClick={() => history.push('/login')}
            >
                Volver al Inicio de Sesión
            </button>
        )}

        <div className='v2-mt-32 v2-border-top v2-pt-24'>
          <Link to='/login' className='v2-text-primary v2-text-decoration-none v2-text-bold'>
            Regresar al Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default V2ForgotPassword;
