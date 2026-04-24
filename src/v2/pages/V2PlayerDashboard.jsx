import { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';
import UserService from '../../services/UserService';
import ExamService from '../../services/ExamService';
import AchievementService from '../../services/AchievementService';
import Auth from '../../modules/Auth';
import '../styles/v2-theme.css';

const V2PlayerDashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedCases: 0,
    accuracy: 0,
    streak: 0,
    xp: 0,
    rank: null
  });
  const [categories, setCategories] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [error, setError] = useState(null);

  // Get user from Auth
  const user = useMemo(() => {
    try {
      return Auth.getUserInfo() || { name: 'Doctor' };
    } catch {
      return { name: 'Doctor' };
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, categoriesRes, achievementsRes] = await Promise.all([
          UserService.getUserStats(),
          ExamService.loadCategories(),
          AchievementService.getAchievements()
        ]);

        // Process stats
        const statsData = statsRes.data || {};
        setStats({
          completedCases: statsData.completed_cases || statsData.completedCases || 0,
          accuracy: statsData.accuracy || 0,
          streak: statsData.streak || 0,
          xp: statsData.xp || 0,
          rank: statsData.rank || null
        });

        // Process categories
        const categoriesData = categoriesRes.data || [];
        setCategories(categoriesData.slice(0, 8)); // Limit to 8 categories for display

        // Process achievements (recent 3)
        const achievementsData = achievementsRes.data || [];
        setAchievements(achievementsData.slice(0, 3));

        setError(null);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        // Use mock data as fallback
        setStats({
          completedCases: 12,
          accuracy: 75,
          streak: 3,
          xp: 1250,
          rank: null
        });
        setCategories([
          { id: 1, name: 'Medicina Interna', progress: 74, color: '#0fa397' },
          { id: 2, name: 'Pediatría', progress: 62, color: '#4a6360' },
          { id: 3, name: 'Cirugía General', progress: 48, color: '#456179' },
          { id: 4, name: 'Ginecología', progress: 81, color: '#ba1a1a' }
        ]);
        setAchievements([
          { id: 1, name: 'Racha de 7 Días', icon: 'emoji_events', color: '#ffd700' },
          { id: 2, name: 'Experto en EKG', icon: 'military_tech', color: '#00bfff' }
        ]);
        setError('Usando datos de demostración');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate accuracy color
  const getAccuracyColor = useCallback((accuracy) => {
    if (accuracy >= 80) return 'var(--md-sys-color-primary)';
    if (accuracy >= 60) return 'var(--md-sys-color-tertiary)';
    return 'var(--md-sys-color-error)';
  }, []);

  if (loading) {
    return (
      <div className='v2-center-state v2-min-h-60vh'>
        <div className='v2-card-tonal v2-flex-align-center v2-gap-16 v2-p-24 v2-px-24'>
          <i className='material-icons v2-text-primary' style={{ fontSize: '32px' }}>stethoscope</i>
          <span className='v2-headline-medium'>Cargando...</span>
        </div>
        <div className='v2-linear-progress' role='progressbar' aria-label='Cargando dashboard' style={{ width: '200px' }}>
          <div className='v2-linear-progress-bar' style={{ width: '60%', animation: 'v2-loading 1.5s ease-in-out infinite' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className='v2-page-hero'>
      {/* Header */}
      <header className='v2-page-header-row v2-mb-32'>
        <div>
          <h1 className='v2-headline-medium'>
            ¡Hola, <span className='v2-text-primary'>Dr. {user.name}</span>!
          </h1>
          <p className='v2-body-large v2-opacity-70'>
            Tu preparación va por {stats.accuracy >= 70 ? 'excelente' : 'buen'} camino.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className='v2-flex v2-gap-12 v2-flex-wrap'>
          {stats.streak > 0 && (
            <div className='v2-card-tonal v2-flex-align-center v2-gap-8 v2-p-16'>
              <i className='material-icons v2-text-primary' aria-hidden='true'>local_fire_department</i>
              <span className='v2-text-bold'>{stats.streak} días</span>
            </div>
          )}
          {stats.xp > 0 && (
            <div className='v2-card-tonal v2-flex-align-center v2-gap-8 v2-p-16'>
              <i className='material-icons v2-text-primary' aria-hidden='true'>bolt</i>
              <span className='v2-text-bold'>{stats.xp.toLocaleString()} XP</span>
            </div>
          )}
          {stats.rank && (
            <div className='v2-card-tonal v2-flex-align-center v2-gap-8 v2-p-16'>
              <i className='material-icons v2-text-primary' aria-hidden='true'>leaderboard</i>
              <span className='v2-text-bold'>#{stats.rank}</span>
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className='v2-card-tonal v2-flex-align-center v2-gap-12 v2-mb-24 v2-p-16'>
          <i className='material-icons' aria-hidden='true'>info</i>
          <span className='v2-label-large'>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className='v2-grid-auto-fit v2-gap-24'>
        
        {/* Hero: Quick Practice Card */}
        <section className='v2-card v2-bg-primary v2-grid-span-2 v2-position-relative v2-overflow-hidden v2-flex-col v2-flex-justify-center' style={{ minHeight: '200px' }}>
          <div className='v2-position-relative v2-z-1'>
            <h2 className='v2-title-large'>Reto del Día</h2>
            <p className='v2-body-large v2-mt-16 v2-mb-24' style={{ maxWidth: '80%' }}>
              Pon a prueba tus conocimientos con un caso clínico aleatorio de cualquier especialidad.
            </p>
            <div className='v2-flex v2-gap-12 v2-flex-wrap'>
              <button
                className='v2-btn-filled'
                style={{ backgroundColor: 'var(--md-sys-color-on-primary)', color: 'var(--md-sys-color-primary)' }}
                onClick={() => history.push('/caso/random')}
                aria-label='Comenzar caso aleatorio'
              >
                Caso Aleatorio
                <i className='material-icons' aria-hidden='true'>play_arrow</i>
              </button>
              <button
                className='v2-btn-tonal'
                style={{ 
                  backgroundColor: 'var(--v2-on-primary-overlay)', 
                  color: 'var(--md-sys-color-on-primary)',
                  border: '1px solid var(--v2-on-primary-outline)'
                }}
                onClick={() => history.push('/simulacro/setup')}
                aria-label='Iniciar simulacro completo'
              >
                <i className='material-icons' aria-hidden='true'>quiz</i>
                Simulacro Completo
              </button>
            </div>
          </div>
          <i className='material-icons v2-position-absolute v2-hero-icon' aria-hidden='true'>medical_information</i>
        </section>

        {/* Stats Overview Card */}
        <section className='v2-card v2-flex-col v2-gap-16'>
          <h2 className='v2-title-large'>Tu Progreso</h2>
          
          <div className='v2-card-outlined v2-flex-align-center v2-gap-16 v2-p-20'>
            <div className='v2-icon-box-lg v2-icon-box-primary' style={{ color: getAccuracyColor(stats.accuracy) }}>
              <i className='material-icons' style={{ fontSize: '28px' }} aria-hidden='true'>track_changes</i>
            </div>
            <div className='v2-flex-1'>
              <span className='v2-label-large v2-opacity-70'>Precisión Global</span>
              <h3 className='v2-title-large' style={{ margin: '4px 0 0', color: getAccuracyColor(stats.accuracy) }}>
                {stats.accuracy}%
              </h3>
            </div>
          </div>

          <div className='v2-grid-2 v2-gap-12'>
            <div className='v2-card-outlined v2-p-16 v2-text-center'>
              <i className='material-icons v2-text-primary' aria-hidden='true'>assignment_turned_in</i>
              <h3 className='v2-title-large' style={{ margin: '8px 0 4px' }}>{stats.completedCases}</h3>
              <span className='v2-label-large v2-opacity-70'>Casos</span>
            </div>
            <div className='v2-card-outlined v2-p-16 v2-text-center'>
              <i className='material-icons v2-text-primary' aria-hidden='true'>military_tech</i>
              <h3 className='v2-title-large' style={{ margin: '8px 0 4px' }}>{achievements.length}</h3>
              <span className='v2-label-large v2-opacity-70'>Logros</span>
            </div>
          </div>

          <Link 
            to='/leaderboard'
            className='v2-btn-filled v2-btn-full v2-text-decoration-none'
            aria-label='Ver ranking completo'
          >
            Ver Ranking
            <i className='material-icons' aria-hidden='true'>leaderboard</i>
          </Link>
        </section>

        {/* Categories / Specialties Progress */}
        <section className='v2-card v2-grid-span-2'>
          <div className='v2-flex-justify-between v2-flex-align-center v2-mb-20'>
          <h2 className='v2-title-large'>Dominios Médicos</h2>
            <Link 
              to='/practica' 
              className='v2-label-large v2-text-primary v2-text-decoration-none'
              aria-label='Ver todas las especialidades'
            >
              Ver todas
            </Link>
          </div>
          
          {categories.length > 0 ? (
            <div className='v2-grid-auto-fit-sm v2-gap-20'>
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  role='button'
                  tabIndex={0}
                  className='v2-cursor-pointer'
                  onClick={() => history.push(`/especialidad/${cat.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      history.push(`/especialidad/${cat.id}`);
                    }
                  }}
                >
                  <div className='v2-flex-justify-between v2-mb-8'>
                    <span className='v2-label-large'>{cat.name}</span>
                    <span className='v2-label-large v2-text-primary'>
                      {cat.progress !== undefined ? `${cat.progress}%` : ''}
                    </span>
                  </div>
                  <div className='v2-linear-progress'>
                    <div 
                      className='v2-linear-progress-bar' 
                      style={{ 
                        width: cat.progress ? `${cat.progress}%` : '0%',
                        backgroundColor: cat.color || 'var(--md-sys-color-primary)'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='v2-text-center v2-p-32 v2-opacity-60'>
              <i className='material-icons' style={{ fontSize: '48px' }} aria-hidden='true'>medical_services</i>
              <p className='v2-body-large v2-mt-16'>Completa el onboarding para ver tus especialidades.</p>
            </div>
          )}
        </section>

        {/* Recent Achievements */}
        <section className='v2-card'>
          <div className='v2-flex-justify-between v2-flex-align-center v2-mb-20'>
          <h2 className='v2-title-large'>Logros Recientes</h2>
            <Link 
              to='/perfil' 
              className='v2-label-large v2-text-primary v2-text-decoration-none'
              aria-label='Ver todos los logros'
            >
              Ver perfil
            </Link>
          </div>
          
          {achievements.length > 0 ? (
            <div className='v2-flex-col v2-gap-12'>
              {achievements.map(ach => (
                <div 
                  key={ach.id} 
                  className='v2-card-tonal v2-flex-align-center v2-gap-12'
                >
                  <i 
                    className='material-icons' 
                    style={{ color: ach.color || '#ffd700' }}
                    aria-hidden='true'
                  >
                    {ach.icon || 'emoji_events'}
                  </i>
                  <span className='v2-label-large'>{ach.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className='v2-empty-state v2-opacity-60' style={{ border: '2px dashed var(--md-sys-color-outline-variant)' }}>
              <i className='material-icons' style={{ fontSize: '40px' }} aria-hidden='true'>lock</i>
              <p className='v2-body-large'>Sigue practicando para desbloquear logros.</p>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className='v2-card'>
          <h2 className='v2-title-large v2-mb-20'>Acciones Rápidas</h2>
          
          <div className='v2-flex-col v2-gap-12'>
            <button 
              className='v2-btn-tonal v2-btn-full v2-btn-justify-start v2-p-16'
              onClick={() => history.push('/flashcards/repaso')}
              aria-label='Estudiar flashcards'
            >
              <i className='material-icons' aria-hidden='true'>style</i>
              Flashcards de Repaso
            </button>
            
            <button 
              className='v2-btn-tonal v2-btn-full v2-btn-justify-start v2-p-16'
              onClick={() => history.push('/imagenes')}
              aria-label='Ver banco de imágenes'
            >
              <i className='material-icons' aria-hidden='true'>image</i>
              Banco de Imágenes
            </button>
            
            <button 
              className='v2-btn-tonal v2-btn-full v2-btn-justify-start v2-p-16'
              onClick={() => history.push('/biblioteca')}
              aria-label='Ver biblioteca de conocimiento'
            >
              <i className='material-icons' aria-hidden='true'>menu_book</i>
              Biblioteca
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default V2PlayerDashboard;