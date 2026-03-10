import { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import UserService from '../../services/UserService';
import Auth from '../../modules/Auth';
import { alertError } from '../../services/AlertService';
import '../styles/v2-theme.css';

const V2Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await UserService.createUser(formData);
      Auth.authenticatePlayer(response.data.token);
      Auth.savePlayerInfo({
        name: response.data.name || formData.name,
        email: response.data.email || formData.email,
        id: response.data.id,
        role: response.data.role,
        preferences: response.data.preferences
      });
      history.push('/v2/onboarding');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Error al registrarse";
      alertError('Error!', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="v2-app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="v2-card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            backgroundColor: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <i className="material-icons" style={{ fontSize: '40px' }}>app_registration</i>
          </div>
          <h1 className="v2-headline-medium" style={{ color: 'var(--md-sys-color-primary)' }}>Crear Cuenta</h1>
          <p className="v2-body-large" style={{ opacity: 0.7 }}>Únete a la comunidad de médicos de élite</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div className="v2-input-outlined">
            <label>Nombre Completo</label>
            <input
              type="text"
              name="name"
              placeholder="Dr. García"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="v2-input-outlined">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="doctor@medical.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="v2-input-outlined">
            <label>Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              placeholder="drgarcia"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="v2-input-outlined">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="v2-btn-filled" style={{ justifyContent: 'center', height: '56px', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
            {!loading && <i className="material-icons">person_add</i>}
          </button>
        </form>

        <div style={{ marginTop: '32px', borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '24px' }}>
          <p className="v2-body-large" style={{ fontSize: '14px' }}>
            ¿Ya tienes una cuenta? {' '}
            <Link to="/v2/login" style={{ color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default V2Signup;
