import { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import UserService from '../../services/UserService';
import Auth from '../../modules/Auth';
import { alertError } from '../../services/AlertService';
import '../styles/v2-theme.css';

const V2Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await UserService.loginPlayer({ email, password });
      Auth.authenticatePlayer(response.data.token);
      Auth.savePlayerInfo({
        name: response.data.name,
        email: response.data.email,
        id: response.data.id,
        role: response.data.role,
        preferences: response.data.preferences
      });
      history.push('/v2/dashboard');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Credenciales inválidas";
      alertError('Error!', errorMsg);
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
            <i className="material-icons" style={{ fontSize: '40px' }} aria-hidden="true">stethoscope</i>
          </div>
          <h1 className="v2-headline-medium" style={{ color: 'var(--md-sys-color-primary)' }}>ENARM V2</h1>
          <p className="v2-body-large" style={{ opacity: 0.7 }}>Bienvenido de nuevo, Doctor</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <div className="v2-input-outlined">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="doctor@medical.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="v2-input-outlined" style={{ position: 'relative' }}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '48px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--md-sys-color-outline)',
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                marginTop: '12px'
              }}
            >
              <i className="material-icons">{showPassword ? 'visibility_off' : 'visibility'}</i>
            </button>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link to="/v2/forgot-password" style={{ color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="v2-btn-filled" style={{ justifyContent: 'center', height: '56px' }} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Entrar'}
            {!loading && <i className="material-icons" aria-hidden="true">arrow_forward</i>}
          </button>
        </form>

        <div style={{ marginTop: '32px', borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '24px' }}>
          <p className="v2-body-large" style={{ fontSize: '14px' }}>
            ¿No tienes una cuenta? {' '}
            <Link to="/v2/signup" style={{ color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default V2Login;
