import { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import UserService from '../../services/UserService';
import Auth from '../../modules/Auth';
import { alertError } from '../../services/AlertService';
import CustomPreloader from '../../components/custom/CustomPreloader';
import '../styles/v2-theme.css';

// Google Login Button Component
function GoogleSocialButton({ onClick }) {
  return (
    <button
      type='button'
      className='v2-btn-social'
      onClick={onClick}
      aria-label='Iniciar sesión con Google'
    >
      <svg width='20' height='20' viewBox='0 0 24 24' aria-hidden='true'>
        <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
        <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
        <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
        <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
      </svg>
      <span className='v2-text-semibold'>Continuar con Google</span>
    </button>
  );
}

// Facebook Login Button Component
function FacebookSocialButton({ onClick }) {
  return (
    <button
      type='button'
      className='v2-btn-social'
      onClick={onClick}
      aria-label='Iniciar sesión con Facebook'
    >
      <svg width='20' height='20' viewBox='0 0 24 24' aria-hidden='true' fill='#1877F2'>
        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
      </svg>
      <span className='v2-text-semibold'>Continuar con Facebook</span>
    </button>
  );
}

const V2Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  
  // Ref to store Google callback to avoid circular deps
  const googleCallbackRef = useRef(null);

  // Google Login Handler
  const handleGoogleLogin = useCallback(() => {
    if (typeof window.google === 'undefined' || !window.google.accounts) {
      alertError('Error', 'Google Sign-In no está disponible. Por favor, intenta más tarde.');
      return;
    }
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        alertError('Info', 'Por favor permite las ventanas emergentes para Google Sign-In.');
      }
    });
  }, []);

  // Google Response Handler
  const handleGoogleResponse = useCallback(async (response) => {
    setLoading(true);
    try {
      const idToken = response.credential;
      // Decode and process Google token
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      const googleUser = JSON.parse(jsonPayload);

      const res = await UserService.googleLogin({
        google_id: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        id_token: idToken
      });

      Auth.authenticateUser(res.data.token);
      Auth.saveUserInfo({
        name: googleUser.name,
        email: googleUser.email,
        id: res.data.id,
        role: res.data.role
      });

      const destination = res.data.role === 'admin' ? '/admin' : '/dashboard';
      history.replace(destination);
    } catch (err) {
      console.error('Google Login error:', err);
      alertError('Error', 'No se pudo iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  }, [history]);

  // Facebook Login Handler (no useCallback to avoid stale closure)
  const handleFacebookLogin = () => {
    if (typeof window.FB === 'undefined') {
      alertError('Error', 'Facebook SDK no está disponible. Por favor, intenta más tarde.');
      return;
    }
    window.FB.login((response) => {
      if (response.status === 'connected') {
        handleFacebookResponse(response);
      }
    }, { scope: 'public_profile,email' });
  };

  const handleFacebookResponse = useCallback(async (response) => {
    setLoading(true);
    try {
      const fbResponse = await new Promise((resolve, reject) => {
        window.FB.api('/me', { fields: 'id,name,email' }, (res) => {
          if (res && !res.error) resolve(res);
          else reject(res.error);
        });
      });

      const params = {
        name: fbResponse.name,
        facebook_id: fbResponse.id,
        email: fbResponse.email || `${fbResponse.id}@facebook.local`
      };

      const res = await UserService.createUser(params);
      Auth.authenticateUser(res.data.token);
      Auth.saveUserInfo({
        name: params.name,
        email: params.email,
        id: res.data.id,
        role: res.data.role
      });

      const destination = res.data.role === 'admin' ? '/admin' : '/dashboard';
      history.replace(destination);
    } catch (err) {
      console.error('Facebook Login error:', err);
      alertError('Error', 'No se pudo iniciar sesión con Facebook');
    } finally {
      setLoading(false);
    }
  }, [history]);

  // Email Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await UserService.login({ email, password });
      Auth.authenticateUser(response.data.token);
      Auth.saveUserInfo({
        name: response.data.name,
        email: response.data.email,
        id: response.data.id,
        role: response.data.role,
        preferences: response.data.preferences
      });

      const destination = response.data.role === 'admin' ? '/admin' : '/dashboard';
      history.push(destination);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Credenciales inválidas';
      alertError('Error!', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google One Tap on mount - combined to avoid race condition
  useEffect(() => {
    googleCallbackRef.current = handleGoogleResponse;
    
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '32979180819-lob8rj66qsjukuq9dnjgqckv04nv5tof.apps.googleusercontent.com';
    
    const initGoogle = () => {
      if (typeof window.google === 'undefined' || typeof window.google.accounts === 'undefined') return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (googleCallbackRef.current) {
            googleCallbackRef.current(response);
          }
        },
        context: 'signin'
      });
    };
    
    if (!document.querySelector('script[src*="gsi/client"]')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    } else {
      initGoogle();
    }
  }, [handleGoogleResponse]);

  return (
    <main className='v2-app-container v2-page-centered'>
      <div className='v2-card v2-page-centered-content'>
        <div className='v2-mb-24'>
          <div className='v2-icon-box-xl v2-icon-box-primary v2-mx-auto v2-mb-16'>
            <i className='material-icons' style={{ fontSize: '40px' }} aria-hidden='true'>stethoscope</i>
          </div>
          <h1 className='v2-headline-medium v2-text-primary'>ENARM V2</h1>
          <p className='v2-body-large v2-opacity-70'>Bienvenido de nuevo, Doctor</p>
        </div>

        {/* Social Login Buttons */}
        <div className='v2-flex-col v2-gap-12 v2-mb-24'>
          <GoogleSocialButton onClick={handleGoogleLogin} />
          <FacebookSocialButton onClick={handleFacebookLogin} />
        </div>

        <div className='v2-divider v2-mb-24'>
          <span className='v2-label-medium v2-text-outline v2-text-uppercase'>o</span>
        </div>

        <form onSubmit={handleLogin} className='v2-flex-col v2-gap-20 v2-text-left'>
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

          <div className='v2-input-outlined v2-position-relative'>
            <label htmlFor='password'>Contraseña</label>
            <i className='material-icons v2-input-prefix-icon' aria-hidden='true'>lock</i>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='v2-input-with-prefix v2-input-with-suffix'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className='v2-password-toggle'
            >
              <i className='material-icons'>{showPassword ? 'visibility_off' : 'visibility'}</i>
            </button>
          </div>

          <div className='v2-text-right'>
            <Link to='/forgot-password' className='v2-text-primary v2-text-decoration-none v2-label-large'>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type='submit' className='v2-btn-filled v2-btn-full v2-btn-h-56' disabled={loading}>
            {loading ? (
              <span className='v2-flex-align-center v2-gap-12'>
                <CustomPreloader size='small' />
                Iniciando sesión...
              </span>
            ) : (
              <>
                Entrar
                <i className='material-icons' aria-hidden='true'>arrow_forward</i>
              </>
            )}
          </button>
        </form>

        <div className='v2-mt-32 v2-border-top v2-pt-24'>
          <p className='v2-body-medium'>
            ¿No tienes una cuenta?{' '}
            <Link to='/signup' className='v2-text-primary v2-text-decoration-none v2-text-bold'>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default V2Login;