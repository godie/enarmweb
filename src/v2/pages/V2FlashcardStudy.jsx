import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import FlashcardService from '../../services/FlashcardService';
import '../styles/v2-theme.css';

// SM-2 Spaced Repetition Algorithm (for future implementation)
// const calculateNextReview = (card, quality) => {
//   const now = new Date();
//   
//   // Default values
//   let { ease_factor = 2.5, interval = 0, repetitions = 0 } = card.srs_data || {};
//   
//   // SM-2 algorithm
//   if (quality < 3) {
//     // Failed - reset
//     repetitions = 0;
//     interval = 1;
//   } else {
//     // Passed
//     if (repetitions === 0) {
//       interval = 1;
//     } else if (repetitions === 1) {
//       interval = 6;
//     } else {
//       interval = Math.round(interval * ease_factor);
//     }
//     repetitions++;
//   }
//   
//   // Update ease factor (minimum 1.3)
//   ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
//   ease_factor = Math.max(1.3, ease_factor);
//   
//   // Calculate next review date
//   const nextReview = new Date(now);
//   nextReview.setDate(nextReview.getDate() + interval);
//   
//   return {
//     ease_factor: Math.round(ease_factor * 100) / 100,
//     interval,
//     repetitions,
//     next_review: nextReview.toISOString(),
//     last_reviewed: now.toISOString()
//   };
// };

// Mock data for fallback when API is unavailable
const MOCK_DUE_FLASHCARDS = [
  {
    id: 1,
    front: '¿Cuál es la tríada de Virchow?',
    back: '1. Estasis venosa\n2. Daño endotelial\n3. Hipercoagulabilidad',
    category: 'Fisiopatología',
    srs_data: { ease_factor: 2.5, interval: 1, repetitions: 0 }
  },
  {
    id: 2,
    front: 'Agente causal más común de epiglotitis',
    back: 'Haemophilus influenzae tipo b (Hib)',
    category: 'Pediatría',
    srs_data: { ease_factor: 2.5, interval: 3, repetitions: 1 }
  },
  {
    id: 3,
    front: 'Signo de Murphy positivo indica...',
    back: 'Colecistitis aguda',
    category: 'Cirugía',
    srs_data: { ease_factor: 2.3, interval: 7, repetitions: 2 }
  },
  {
    id: 4,
    front: 'Tratamiento de primera línea para la anafilaxia',
    back: '1. Adrenalina IM (0.01 mg/kg, máx 0.5 mg)\n2. Posición trendelenburg\n3. Oxígeno\n4. Acceso venoso\n5. Antihistamínicos + corticoides',
    category: 'Emergency',
    srs_data: { ease_factor: 2.5, interval: 1, repetitions: 0 }
  },
  {
    id: 5,
    front: '¿Qué indica el signo de Kehr?',
    back: 'Rotura esplénica - dolor referido al hombro izquierdo (irritación diafragmática)',
    category: 'Cirugía',
    srs_data: { ease_factor: 2.0, interval: 1, repetitions: 0 }
  }
];

// Loading skeleton
const LoadingSkeleton = () => (
  <div className='v2-flashcard-study-container'>
    <div className='v2-mb-24'>
      <div className='skeleton-title' style={{ height: '28px', width: '40%' }} />
      <div className='skeleton-text' style={{ height: '16px', width: '20%' }} />
    </div>
    <div className='skeleton-bar v2-mb-32' style={{ height: '8px' }} />
    <div className='v2-card v2-card-elevated v2-flex-center' style={{ minHeight: '300px' }}>
      <div className='skeleton-text' style={{ width: '80%' }} />
    </div>
  </div>
);

// Empty state - no cards due
const EmptyState = ({ onGoBack }) => (
  <div className='v2-center-state v2-min-h-60vh'>
    <div className='v2-icon-box-4xl v2-icon-box-primary'>
      <i className='material-icons' style={{ fontSize: '64px' }} aria-hidden='true'>
        check_circle
      </i>
    </div>
    <h2 className='v2-headline-medium'>¡Todo al día!</h2>
    <p className='v2-body-large v2-opacity-70' style={{ maxWidth: '400px' }}>
      No tienes flashcards pendientes para hoy. ¡Vuelve mañana para más repasos!
    </p>
    <div className='v2-flex v2-gap-12 v2-mt-16'>
      <Link to='/flashcards' className='v2-btn-tonal v2-text-decoration-none'>
        <i className='material-icons' aria-hidden='true'>style</i>
        Ver Todas
      </Link>
      <button className='v2-btn-filled' onClick={onGoBack}>
        <i className='material-icons' aria-hidden='true'>home</i>
        Volver al Inicio
      </button>
    </div>
  </div>
);

// Session complete state
const SessionComplete = ({ stats, onStudyMore, onGoHome }) => (
  <div className='v2-center-state v2-min-h-60vh' style={{ gap: '24px' }}>
    <div className='v2-icon-box-3xl v2-icon-box-primary v2-pulse-animation'>
      <i className='material-icons' style={{ fontSize: '56px' }} aria-hidden='true'>
        emoji_events
      </i>
    </div>
    
    <div>
      <h2 className='v2-headline-medium'>¡Sesión Completada!</h2>
      <p className='v2-body-large v2-opacity-70 v2-mt-8'>
        Excelente trabajo en tu sesión de estudio
      </p>
    </div>
    
    {/* Stats grid */}
    <div className='v2-grid-2 v2-gap-16 v2-mt-16'>
      <div className='v2-card v2-p-20 v2-text-center'>
        <div className='v2-headline-large v2-text-primary v2-text-bold'>
          {stats.total}
        </div>
        <div className='v2-label-large v2-opacity-70'>Total repasadas</div>
      </div>
      <div className='v2-card v2-p-20 v2-text-center'>
        <div className='v2-headline-large v2-text-primary v2-text-bold'>
          {stats.good}
        </div>
        <div className='v2-label-large v2-opacity-70'>Conocidas</div>
      </div>
      <div className='v2-card v2-p-20 v2-text-center'>
        <div className='v2-headline-large v2-text-error v2-text-bold'>
          {stats.again}
        </div>
        <div className='v2-label-large v2-opacity-70'>Para repasar</div>
      </div>
      <div className='v2-card v2-p-20 v2-text-center'>
        <div className='v2-headline-large v2-text-secondary v2-text-bold'>
          {Math.round((stats.good / Math.max(stats.total, 1)) * 100)}%
        </div>
        <div className='v2-label-large v2-opacity-70'>Tasa de acierto</div>
      </div>
    </div>
    
    <div className='v2-flex v2-gap-12 v2-mt-16'>
      <button className='v2-btn-tonal' onClick={onStudyMore}>
        <i className='material-icons' aria-hidden='true'>refresh</i>
        Repasar Más
      </button>
      <button className='v2-btn-filled' onClick={onGoHome}>
        <i className='material-icons' aria-hidden='true'>home</i>
        Volver al Inicio
      </button>
    </div>
  </div>
);

// Flashcard component with flip animation
const Flashcard = ({ card, isFlipped, onFlip }) => (
  <div 
    className='flashcard-container v2-cursor-pointer v2-w-full'
    style={{ minHeight: '300px' }}
    onClick={onFlip}
    role='button'
    tabIndex={0}
    aria-label={isFlipped ? 'Tarjeta volteada, respuesta visible' : 'Toca para ver la respuesta'}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFlip(); } }}
  >
    <div className='v2-position-relative v2-w-full' style={{
      minHeight: '300px',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
    }}>
      {/* Front */}
      <div className='v2-position-absolute v2-w-full v2-flex-col v2-flex-center v2-p-32 v2-text-center' style={{
        minHeight: '300px',
        backfaceVisibility: 'hidden'
      }}>
        {card.category && (
          <span className='v2-label-large v2-badge-primary v2-mb-24'>
            {card.category}
          </span>
        )}
        <h2 className='v2-title-large' style={{ fontSize: '24px', lineHeight: '1.4' }}>
          {card.front}
        </h2>
        {!isFlipped && (
          <p className='v2-label-large v2-flex-align-center v2-gap-8 v2-mt-40 v2-opacity-50'>
            <i className='material-icons' style={{ fontSize: '18px' }} aria-hidden='true'>touch_app</i>
            Toca para ver la respuesta
          </p>
        )}
      </div>
      
      {/* Back */}
      <div className='v2-position-absolute v2-w-full v2-flex-col v2-flex-center v2-p-32 v2-text-center' style={{
        minHeight: '300px',
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)'
      }}>
        <div className='v2-bg-primary-container v2-p-24' style={{ borderRadius: '16px' }}>
          <p className='v2-body-large v2-text-semibold v2-whitespace-preline v2-line-height-relaxed'>
            {card.back}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Quality rating buttons (SM-2 mapped to UI)
const QualityButtons = ({ onRate, disabled }) => {
  const buttons = [
    { quality: 1, label: 'Otra vez', shortcut: '1', sublabel: '< 1 día', color: '#ba1a1a', icon: 'replay' },
    { quality: 3, label: 'Difícil', shortcut: '2', sublabel: '2-3 días', color: '#9c4247', icon: 'sentiment_dissatisfied' },
    { quality: 4, label: 'Bien', shortcut: '3 / Espacio', sublabel: '4-6 días', color: '#0fa397', icon: 'sentiment_satisfied' },
    { quality: 5, label: 'Fácil', shortcut: '4', sublabel: '7+ días', color: '#4a6360', icon: 'sentiment_very_satisfied' }
  ];
  
  return (
    <div className='v2-mt-32 v2-grid v2-gap-12' style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {buttons.map(btn => (
        <button
          key={btn.quality}
          className='v2-card v2-flex-col v2-flex-center v2-gap-4 v2-p-16'
          onClick={() => onRate(btn.quality)}
          disabled={disabled}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            border: 'none'
          }}
          aria-label={`Calificar como ${btn.label} (atajo: tecla ${btn.shortcut})`}
          title={`Atajo: ${btn.shortcut}`}
        >
          <i className='material-icons' style={{ fontSize: '28px', color: btn.color }} aria-hidden='true'>
            {btn.icon}
          </i>
          <span className='v2-label-large v2-text-semibold' style={{ color: btn.color }}>
            {btn.label} <span className='v2-opacity-50' style={{ fontSize: '0.8em' }}>[{btn.quality === 4 ? '3' : btn.shortcut}]</span>
          </span>
          <span className='v2-label-small v2-opacity-70'>
            {btn.sublabel}
          </span>
        </button>
      ))}
    </div>
  );
};

// Error state
const ErrorState = ({ message, onRetry }) => (
  <div className='v2-error-state'>
    <div className='v2-icon-box-md v2-icon-box-error'>
      <i className='material-icons' style={{ fontSize: '40px' }} aria-hidden='true'>
        error_outline
      </i>
    </div>
    <h2 className='v2-title-large'>No se pudieron cargar las flashcards</h2>
    <p className='v2-body-large v2-opacity-70'>{message}</p>
    <button className='v2-btn-filled' onClick={onRetry}>
      <i className='material-icons' aria-hidden='true'>refresh</i>
      Reintentar
    </button>
  </div>
);

const V2FlashcardStudy = () => {
  const history = useHistory();
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Session stats
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    good: 0,
    again: 0
  });
  
  // Current card
  const currentCard = useMemo(() => {
    return flashcards[currentIndex] || null;
  }, [flashcards, currentIndex]);
  
  // Progress percentage
  const progress = useMemo(() => {
    if (flashcards.length === 0) return 0;
    return ((currentIndex) / flashcards.length) * 100;
  }, [currentIndex, flashcards.length]);
  
  // Fetch due flashcards
  const fetchDueFlashcards = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await FlashcardService.getDueFlashcards();
      const data = res.data || [];
      
      // If API returns empty array, show empty state (no due cards)
      if (data.length === 0) {
        setFlashcards([]); // Will trigger empty state
      } else {
        setFlashcards(data);
      }
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      // Only use mock data as fallback on error, not for empty results
      setFlashcards(MOCK_DUE_FLASHCARDS);
      setError('Modo de demostración. Los datos reales no están disponibles.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchDueFlashcards();
  }, [fetchDueFlashcards]);
  
  // Handle card flip
  const handleFlip = useCallback(() => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  }, [isFlipped]);
  
  // Handle quality rating
  const handleRate = useCallback(async (quality) => {
    if (isSubmitting || !currentCard) return;
    
    setIsSubmitting(true);
    
    try {
      // Send to API (fire and forget - don't block UI)
      FlashcardService.reviewFlashcard(currentCard.id, quality).catch(() => {
        // Silently fail - card progress is updated locally anyway
      });
      
      // Update session stats
      setSessionStats(prev => ({
        total: prev.total + 1,
        good: quality >= 4 ? prev.good + 1 : prev.good,
        again: quality < 3 ? prev.again + 1 : prev.again
      }));
      
      // Move to next card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      } else {
        setIsSessionComplete(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [currentCard, currentIndex, flashcards.length, isSubmitting]);
  
  // Restart session
  const handleRestartSession = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSessionComplete(false);
    setSessionStats({ total: 0, good: 0, again: 0 });
    fetchDueFlashcards();
  }, [fetchDueFlashcards]);
  
  // Go home
  const handleGoHome = useCallback(() => {
    history.push('/dashboard');
  }, [history]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if any overlay is active or if user is typing (though no inputs here yet)
      if (loading || isSubmitting || isSessionComplete || !currentCard) return;

      const { key } = e;

      if (!isFlipped) {
        if (key === ' ' || key === 'Enter') {
          e.preventDefault();
          handleFlip();
        }
      } else {
        if (key === '1') {
          handleRate(1);
        } else if (key === '2') {
          handleRate(3);
        } else if (key === '3' || key === ' ' || key === 'Enter') {
          e.preventDefault();
          handleRate(4);
        } else if (key === '4') {
          handleRate(5);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, isSubmitting, isSessionComplete, currentCard, isFlipped, handleFlip, handleRate]);
  
  // Loading state
  if (loading) {
    return (
      <div className='v2-flashcard-study-container'>
        <LoadingSkeleton />
      </div>
    );
  }
  
  // Error state
  if (error && flashcards.length === 0) {
    return (
      <div className='v2-flashcard-study-container'>
        <ErrorState message={error} onRetry={fetchDueFlashcards} />
      </div>
    );
  }
  
  // Empty state (no cards due)
  if (flashcards.length === 0) {
    return (
      <div className='v2-flashcard-study-container'>
        <EmptyState onGoBack={handleGoHome} />
      </div>
    );
  }
  
  // Session complete state
  if (isSessionComplete) {
    return (
      <div className='v2-flashcard-study-container'>
        <SessionComplete 
          stats={sessionStats}
          onStudyMore={handleRestartSession}
          onGoHome={handleGoHome}
        />
      </div>
    );
  }
  
  return (
    <div className='v2-flashcard-study-container'>
      {/* Header */}
      <header className='v2-flex-justify-between v2-flex-align-center v2-flex-wrap v2-gap-16 v2-mb-24'>
        <div>
          <h1 className='v2-headline-medium'>Repaso Flashcards</h1>
          <div className='v2-flex-align-center v2-gap-8 v2-mt-8'>
            <span className='v2-label-large v2-text-primary'>
              {currentCard?.category || 'General'}
            </span>
            {error && (
              <span className='v2-label-small v2-text-secondary'>
                (demostración)
              </span>
            )}
          </div>
        </div>
        <div className='v2-card v2-flex-align-center v2-gap-8' style={{ padding: '8px 16px' }}>
          <i className='material-icons v2-text-primary' style={{ fontSize: '20px' }} aria-hidden='true'>
            style
          </i>
          <span className='v2-label-large v2-text-semibold'>
            {currentIndex + 1} / {flashcards.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className='v2-linear-progress v2-mb-32'>
        <div 
          className='v2-linear-progress-bar' 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      {currentCard && (
        <>
          <div className='v2-card v2-card-elevated v2-overflow-hidden' style={{ minHeight: '350px', padding: 0 }}>
            <Flashcard 
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={handleFlip}
            />
          </div>
          
          {/* Quality rating buttons (shown after flip) */}
          {isFlipped && (
            <QualityButtons 
              onRate={handleRate}
              disabled={isSubmitting}
            />
          )}
          
          {/* Show flip hint when not flipped */}
          {!isFlipped && (
            <div className='v2-flex-justify-center v2-mt-24'>
              <button 
                className='v2-btn-tonal'
                onClick={handleFlip}
                aria-label='Mostrar Respuesta (atajo: Espacio)'
                title='Atajo: Espacio'
              >
                <i className='material-icons' aria-hidden='true'>visibility</i>
                Mostrar Respuesta <span className='v2-opacity-50' style={{ fontSize: '0.8em', marginLeft: '4px' }}>[Espacio]</span>
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Quick stats during session */}
      <div className='v2-flex-justify-center v2-gap-24 v2-mt-32'>
        <div className='v2-flex-align-center v2-gap-8'>
          <i className='material-icons v2-text-primary' style={{ fontSize: '16px' }} aria-hidden='true'>check_circle</i>
          <span className='v2-label-large v2-opacity-70'>
            Conocidas: {sessionStats.good}
          </span>
        </div>
        <div className='v2-flex-align-center v2-gap-8'>
          <i className='material-icons v2-text-error' style={{ fontSize: '16px' }} aria-hidden='true'>replay</i>
          <span className='v2-label-large v2-opacity-70'>
            Otra vez: {sessionStats.again}
          </span>
        </div>
      </div>
    </div>
  );
};

export default V2FlashcardStudy;