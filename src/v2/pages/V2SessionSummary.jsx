import { useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import LeaderboardService from '../../services/LeaderboardService';
import Auth from '../../modules/Auth';
import '../styles/v2-theme.css';

const V2SessionSummary = () => {
  const history = useHistory();
  const location = useLocation();
  
  // Get session data from navigation state
  const sessionData = location.state || {};
  const {
    totalQuestions = 5,
    correctAnswers = 0,
    xpEarned = 0,
    timeElapsed = 0
  } = sessionData;

  // Calculate derived stats
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const isGoodPerformance = accuracy >= 70;
  
  // Local state
  const [rankChange, setRankChange] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // User info
  const user = useMemo(() => Auth.getUserInfo(), []);
  
  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch rank change from leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await LeaderboardService.getTopUsers();
        const users = res.data || [];
        const currentUserIndex = users.findIndex(u => u.id === user?.id);
        
        if (currentUserIndex > 0 && users.length > 0) {
          // Calculate rank improvement (mock for now)
          setRankChange(12); // Placeholder: would calculate based on previous position
        } else if (currentUserIndex === 0) {
          setRankChange(0); // Already at top
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setRankChange(null); // null means no data
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchLeaderboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Get performance message
  const getPerformanceMessage = () => {
    if (accuracy >= 90) return '¡Excelente! Dominas este tema.';
    if (accuracy >= 70) return 'Buen trabajo, sigue así.';
    if (accuracy >= 50) return 'Necesitas más práctica en este tema.';
    return 'Sigue estudiando, mejorarás con el tiempo.';
  };

  // Get performance icon
  const getPerformanceIcon = () => {
    if (accuracy >= 80) return 'emoji_events';
    if (accuracy >= 60) return 'thumb_up';
    if (accuracy >= 40) return 'trending_up';
    return 'school';
  };

  // Get performance color
  const getPerformanceColor = () => {
    if (accuracy >= 80) return 'var(--md-sys-color-primary)';
    if (accuracy >= 60) return 'var(--md-sys-color-tertiary)';
    return 'var(--md-sys-color-error)';
  };

  const handleNewSession = () => {
    history.push('/practica');
  };

  const handleGoToDashboard = () => {
    history.push('/dashboard');
  };

  const handleReviewMistakes = () => {
    history.push('/errores');
  };

  return (
    <div className='v2-page-medium v2-text-center'>
      {/* Header / Celebration */}
      <header className='v2-mb-40'>
        <div className={`v2-icon-box-2xl ${isGoodPerformance ? 'v2-icon-box-primary' : 'v2-icon-box-tertiary'} v2-mx-auto v2-mb-20`}>
          <i className='material-icons' style={{ fontSize: '48px' }} aria-hidden='true'>
            {getPerformanceIcon()}
          </i>
        </div>
        <h1 className='v2-headline-medium v2-mb-8'>
          {isGoodPerformance ? '¡Sesión Completada!' : 'Sesión en Revisión'}
        </h1>
        <p className='v2-body-large v2-opacity-70'>
          {user?.name ? `Buen trabajo, Dr. ${user.name}.` : 'Buen trabajo, Doctor.'} {getPerformanceMessage()}
        </p>
      </header>

      {/* Stats Grid */}
      <div className='v2-grid-auto-fit-sm v2-gap-16 v2-mb-32' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {/* Accuracy */}
        <div className='v2-card v2-p-20'>
          <i className='material-icons' style={{ color: getPerformanceColor(), fontSize: '32px' }} aria-hidden='true'>track_changes</i>
          <h2 className='v2-headline-medium' style={{ margin: '12px 0 4px', color: getPerformanceColor() }}>
            {accuracy}%
          </h2>
          <span className='v2-label-large v2-opacity-70'>Precisión</span>
        </div>

        {/* XP Earned */}
        <div className='v2-card v2-p-20'>
          <i className='material-icons v2-text-primary' style={{ fontSize: '32px' }} aria-hidden='true'>bolt</i>
          <h2 className='v2-headline-medium' style={{ margin: '12px 0 4px' }}>
            +{xpEarned}
          </h2>
          <span className='v2-label-large v2-opacity-70'>XP Ganado</span>
        </div>

        {/* Time */}
        <div className='v2-card v2-p-20'>
          <i className='material-icons' style={{ color: 'var(--md-sys-color-tertiary)', fontSize: '32px' }} aria-hidden='true'>timer</i>
          <h2 className='v2-headline-medium' style={{ margin: '12px 0 4px' }}>
            {formatTime(timeElapsed)}
          </h2>
          <span className='v2-label-large v2-opacity-70'>Tiempo Total</span>
        </div>

        {/* Rank Change */}
        <div className='v2-card v2-p-20'>
          <i className='material-icons' style={{ color: rankChange > 0 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)', fontSize: '32px' }} aria-hidden='true'>leaderboard</i>
          <h2 className='v2-headline-medium' style={{ margin: '12px 0 4px' }}>
            {loading ? '...' : rankChange !== null && rankChange > 0 ? `+${rankChange}` : '-'}
          </h2>
          <span className='v2-label-large v2-opacity-70'>
            {loading ? 'Cargando' : rankChange !== null && rankChange > 0 ? 'Mejoraste' : 'Sin cambio'}
          </span>
        </div>
      </div>

      {/* Detailed Stats */}
      <section className='v2-card v2-text-left v2-mb-32'>
        <h2 className='v2-title-large v2-mb-16'>Resumen de la Sesión</h2>
        
        <div className='v2-flex-col v2-gap-16'>
          {/* Correct/Incorrect breakdown */}
          <div className='v2-card-outlined v2-flex-justify-between v2-flex-align-center v2-p-16'>
            <div className='v2-flex-align-center v2-gap-12'>
              <i className='material-icons v2-text-primary' aria-hidden='true'>check_circle</i>
              <span className='v2-label-large'>Respuestas Correctas</span>
            </div>
            <span className='v2-title-large v2-text-primary'>
              {correctAnswers}/{totalQuestions}
            </span>
          </div>

          <div className='v2-card-outlined v2-flex-justify-between v2-flex-align-center v2-p-16'>
            <div className='v2-flex-align-center v2-gap-12'>
              <i className='material-icons v2-text-error' aria-hidden='true'>cancel</i>
              <span className='v2-label-large'>Respuestas Incorrectas</span>
            </div>
            <span className='v2-title-large v2-text-error'>
              {totalQuestions - correctAnswers}/{totalQuestions}
            </span>
          </div>

          {/* Performance bar */}
          <div>
            <div className='v2-flex-justify-between v2-mb-8'>
              <span className='v2-label-large'>Rendimiento General</span>
              <span className='v2-label-large' style={{ color: getPerformanceColor() }}>{accuracy}%</span>
            </div>
            <div className='v2-linear-progress' style={{ height: '12px' }}>
              <div 
                className='v2-linear-progress-bar' 
                style={{ 
                  width: `${accuracy}%`,
                  backgroundColor: getPerformanceColor()
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className='v2-flex v2-gap-16 v2-flex-justify-center v2-flex-wrap'>
        <button 
          className='v2-btn-tonal v2-btn-h-56'
          onClick={handleGoToDashboard}
          style={{ padding: '0 32px' }}
          aria-label='Volver al inicio'
        >
          <i className='material-icons' aria-hidden='true'>home</i>
          Inicio
        </button>
        
        {totalQuestions - correctAnswers > 0 && (
          <button 
            className='v2-btn-tonal v2-btn-h-56'
            onClick={handleReviewMistakes}
            style={{ padding: '0 32px' }}
            aria-label='Revisar errores'
          >
            <i className='material-icons' aria-hidden='true'>error_outline</i>
            Revisar Errores
          </button>
        )}
        
        <button 
          className='v2-btn-filled v2-btn-h-56' 
          onClick={handleNewSession}
          style={{ padding: '0 32px' }}
          aria-label='Nueva sesión de práctica'
        >
          <i className='material-icons' aria-hidden='true'>refresh</i>
          Nueva Sesión
        </button>
      </div>

      {/* Quick Links */}
      <div className='v2-mt-40 v2-pt-24 v2-border-top'>
        <p className='v2-label-large v2-opacity-60 v2-mb-16'>
          Explora más contenido
        </p>
        <div className='v2-flex v2-gap-12 v2-flex-justify-center v2-flex-wrap'>
          <Link 
            to='/flashcards/repaso' 
            className='v2-btn-outlined'
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              textDecoration: 'none'
            }}
            aria-label='Estudiar flashcards'
          >
            <i className='material-icons' aria-hidden='true'>style</i>
            Flashcards
          </Link>
          
          <Link 
            to='/leaderboard' 
            className='v2-btn-outlined'
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              textDecoration: 'none'
            }}
            aria-label='Ver ranking'
          >
            <i className='material-icons' aria-hidden='true'>leaderboard</i>
            Ranking
          </Link>
          
          <Link 
            to='/biblioteca' 
            className='v2-btn-outlined'
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              textDecoration: 'none'
            }}
            aria-label='Ver biblioteca'
          >
            <i className='material-icons' aria-hidden='true'>menu_book</i>
            Biblioteca
          </Link>
        </div>
      </div>
    </div>
  );
};

export default V2SessionSummary;