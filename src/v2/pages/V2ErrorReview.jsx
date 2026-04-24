import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ExamService from '../../services/ExamService';
import '../styles/v2-theme.css';

// Mock data for fallback
const MOCK_FAILED_ANSWERS = [
  {
    id: 1,
    question: {
      id: 101,
      texto: 'Paciente masculino de 45 años con dolor precordial opresivo de 30 minutos, irradiado a mandíbula,伴隨冷汗和噁心。ECG muestra elevación del ST en derivaciones V1-V4.',
      specialty: 'Cardiología',
      category_id: 1
    },
    user_answer: { texto: 'Angina Inestable' },
    correct_answer: { texto: 'Infarto Agudo al Miocardio con elevación del ST (IAMCEST)' },
    explanation: 'La elevación del segmento ST en el ECG es patognomónica de oclusión coronaria completa. El IAMCEST requiere reperfusión urgente (angioplastia primaria o trombólisis) en las primeras 12 horas. La diferenciación clave es: angina inestable no tiene elevación del ST sostenida.',
    created_at: '2025-01-15T10:30:00Z'
  },
  {
    id: 2,
    question: {
      id: 102,
      texto: 'Mujer de 28 años, embarazo de 38 semanas, presión arterial 160/110 mmHg, proteinuria 5g/24h, cefalea y fosfenos. ¿Cuál es el tratamiento de primera línea?',
      specialty: 'Ginecología y Obstetricia',
      category_id: 5
    },
    user_answer: { texto: 'Hidralazina IV' },
    correct_answer: { texto: 'Sulfato de Magnesio' },
    explanation: 'En preeclampsia con criterios de severidad, el sulfato de magnesio es el fármaco de elección para la prevención y tratamiento de eclampsia. La hidralazina es un antihipertensivo de segunda línea para controlar crisis hipertensivas, pero no previene las convulsiones eclámpticas.',
    created_at: '2025-01-14T14:20:00Z'
  },
  {
    id: 3,
    question: {
      id: 103,
      texto: 'Niño de 3 años con fiebre de 39°C, otalgia derecha, otoscopia revela membrana timpánica rojos, abombada y sin movilidad. Diagnóstico y tratamiento?',
      specialty: 'Pediatría',
      category_id: 2
    },
    user_answer: { texto: 'Observación y manejo expectante' },
    correct_answer: { texto: 'Amoxicilina 80-90 mg/kg/día por 10 días' },
    explanation: 'La otitis media aguda en niños mayores de 2 años con síntomas severos (fiebre >39°C, otalgia moderada-severa) requiere tratamiento antibiótico inmediato. La amoxicilina a dosis altas es el tratamiento de primera línea según las guías de la AAP.',
    created_at: '2025-01-13T09:15:00Z'
  },
  {
    id: 4,
    question: {
      id: 104,
      texto: 'Paciente diabético tipo 2 con creatinina 3.5 mg/dL, FG 25 mL/min. ¿Cuál antidiabético está CONTRAINDICADO?',
      specialty: 'Endocrinología',
      category_id: 1
    },
    user_answer: { texto: 'Metformina' },
    correct_answer: { texto: 'Metformina' },
    explanation: 'La metformina está contraindicada en enfermedad renal crónica severa (FG <30 mL/min) por riesgo de acidosis láctica. En FG 25 mL/min, debe suspenderse. Los inhibidores SGLT2 pueden usarse con precaución, y los agonistas GLP-1 son seguros.',
    created_at: '2025-01-12T16:45:00Z'
  },
  {
    id: 5,
    question: {
      id: 105,
      texto: 'Varón de 60 años con hemiplejía derecha súbita, desviación ocular izquierda, hemianopsia homónima derecha. ¿Dónde está la lesión?',
      specialty: 'Neurología',
      category_id: 1
    },
    user_answer: { texto: 'Corteza motora izquierda' },
    correct_answer: { texto: 'Cápsula interna izquierda' },
    explanation: 'La hemiplejía derecha + desviación ocular izquierda (mirando la lesión) + hemianopsia homónima derecha indica lesión en el hemisferio izquierdo. La combinación de hemiplejía pura (sin movimientos sacudidas) sugiere lesión en la cápsula interna, no en la corteza motora que causaría movimientos sacudidas (Jacksonian).',
    created_at: '2025-01-11T11:30:00Z'
  }
];

// Group errors by specialty/category
const groupErrorsBySpecialty = (errors) => {
  const grouped = {};
  errors.forEach(error => {
    const specialty = error.question?.specialty || 'General';
    if (!grouped[specialty]) {
      grouped[specialty] = {
        name: specialty,
        count: 0,
        errors: [],
        color: getSpecialtyColor(specialty)
      };
    }
    grouped[specialty].count++;
    grouped[specialty].errors.push(error);
  });
  return Object.values(grouped).sort((a, b) => b.count - a.count);
};

// Get color based on specialty
const getSpecialtyColor = (specialty) => {
  const colors = {
    'Cardiología': '#ba1a1a',
    'Ginecología y Obstetricia': '#9c4247',
    'Pediatría': '#456179',
    'Neurología': '#7d5260',
    'Endocrinología': '#5d6b4b',
    'Medicina Interna': '#4a6360',
    'Cirugía': '#7a5c58',
    'Psiquiatría': '#63597c',
    'General': '#6f7976'
  };
  return colors[specialty] || '#6f7976';
};

// Helper function to check if answer is correct (used in QuestionCard)
const isAnswerCorrect = (error) => {
  const userAns = error.user_answer?.texto;
  const correctAns = error.correct_answer?.texto;
  return !!(userAns && correctAns && userAns === correctAns);
};

// Format date to relative time
const formatRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha no disponible';
    
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  } catch {
    return 'Fecha no disponible';
  }
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className='v2-page-container'>
    <div className='v2-mb-32'>
      <div className='v2-card' style={{ height: '120px' }}>
        <div className='skeleton-title' style={{ height: '28px', width: '60%' }} />
        <div className='skeleton-text' style={{ height: '16px', width: '80%' }} />
      </div>
    </div>
    <div className='v2-grid-auto-fit v2-gap-24'>
      <div className='v2-card v2-grid-span-2' style={{ height: '200px' }}>
        <div className='skeleton-title' style={{ height: '22px', width: '40%' }} />
        {[1, 2, 3].map(i => (
          <div key={i} className='v2-mb-16'>
            <div className='skeleton-text' style={{ height: '20px', width: '30%', marginBottom: '8px' }} />
            <div className='skeleton-bar' style={{ height: '8px', width: '100%' }} />
          </div>
        ))}
      </div>
    </div>
    <div className='v2-mt-40'>
      <div className='skeleton-title' style={{ height: '22px', width: '50%' }} />
      <div className='v2-flex-col v2-gap-24'>
        {[1, 2, 3].map(i => (
          <div key={i} className='v2-card v2-card-elevated' style={{ height: '200px' }}>
            <div className='skeleton-bar' style={{ height: '20px', width: '30%' }} />
            <div className='skeleton-text' style={{ height: '16px', width: '90%', marginBottom: '12px' }} />
            <div className='skeleton-text' style={{ height: '16px', width: '70%' }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error state component (for future use)
// const ErrorState = ({ message, onRetry }) => (
//   <div className='v2-error-state'>
//     <div className='v2-icon-box-md v2-icon-box-error'>
//       <i className='material-icons' style={{ fontSize: '40px' }} aria-hidden='true'>
//         error_outline
//       </i>
//     </div>
//     <h2 className='v2-title-large'>No se pudieron cargar los errores</h2>
//     <p className='v2-body-large v2-opacity-70' style={{ maxWidth: '400px' }}>{message}</p>
//     <button className='v2-btn-filled' onClick={onRetry}>
//       <i className='material-icons' aria-hidden='true'>refresh</i>
//       Reintentar
//     </button>
//   </div>
// );

// Empty state component
const EmptyState = () => (
  <div className='v2-empty-state'>
    <div className='v2-icon-box-3xl v2-icon-box-primary'>
      <i className='material-icons' style={{ fontSize: '56px' }} aria-hidden='true'>
        check_circle
      </i>
    </div>
    <h2 className='v2-headline-medium'>¡Excelente trabajo!</h2>
    <p className='v2-body-large v2-opacity-70' style={{ maxWidth: '500px' }}>
      No has cometido errores recientemente. ¡Sigue así! Practica más casos clínicos para mantener tu racha.
    </p>
    <div className='v2-flex v2-gap-16 v2-mt-16'>
      <Link to='/practica' className='v2-btn-filled v2-text-decoration-none'>
        <i className='material-icons' aria-hidden='true'>school</i>
        Practicar más
      </Link>
      <Link to='/dashboard' className='v2-btn-tonal v2-text-decoration-none'>
        <i className='material-icons' aria-hidden='true'>home</i>
        Ir al Inicio
      </Link>
    </div>
  </div>
);

// Expandable question card
const QuestionCard = ({ error, isExpanded, onToggle }) => {
  const isCorrect = isAnswerCorrect(error);
  
  return (
    <article 
      className='v2-card v2-card-elevated v2-mb-16 v2-cursor-pointer' 
      onClick={onToggle}
      role='button'
      tabIndex={0}
      aria-expanded={isExpanded}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
    >
      {/* Header with specialty badge */}
      <div className='v2-flex-justify-between v2-flex-align-center v2-mb-16'>
        <span 
          className='v2-label-large v2-badge-primary'
        >
          {error.question?.specialty || 'General'}
        </span>
        <span className='v2-label-large v2-opacity-60'>
          {formatRelativeTime(error.created_at)}
        </span>
      </div>

      {/* Question text */}
      <p className='v2-body-large v2-text-semibold v2-mb-20'>
        {error.question?.texto}
      </p>

      {/* Answer comparison (always visible) */}
      <div className='v2-flex-col v2-gap-12 v2-mb-16'>
        <div 
          className={`v2-card-tonal v2-flex-align-center v2-gap-12 ${isCorrect ? 'v2-bg-primary-container' : 'v2-bg-error-container'}`}
        >
          <i className='material-icons' aria-hidden='true' style={{ fontSize: '20px' }}>
            {isCorrect ? 'check' : 'close'}
          </i>
          <span className='v2-body-large'>
            Tu respuesta: <strong>{error.user_answer?.texto}</strong>
          </span>
        </div>
        {!isCorrect && (
          <div 
            className='v2-card-tonal v2-bg-primary-container v2-flex-align-center v2-gap-12'
          >
            <i className='material-icons' aria-hidden='true' style={{ fontSize: '20px' }}>
              check
            </i>
            <span className='v2-body-large'>
              Respuesta correcta: <strong>{error.correct_answer?.texto}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Expandable explanation */}
      <div 
        className='v2-border-top v2-pt-16'
        style={{ 
          maxHeight: isExpanded ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out, opacity 0.3s ease-out',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <h4 className='v2-label-large v2-text-primary v2-mb-8'>
          <i className='material-icons' aria-hidden='true' style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>
            lightbulb
          </i>
          EXPLICACIÓN
        </h4>
        <p className='v2-body-medium v2-line-height-relaxed v2-opacity-80'>
          {error.explanation}
        </p>
      </div>

      {/* Expand indicator */}
      <div className='v2-flex-justify-center v2-mt-12 v2-text-outline'>
        <i className='material-icons' aria-hidden='true' style={{ 
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>
          expand_more
        </i>
      </div>
    </article>
  );
};

// Specialty progress bar component
const SpecialtyProgress = ({ specialty, maxCount }) => {
  const percentage = (specialty.count / maxCount) * 100;
  
  return (
    <div className='v2-mb-16'>
      <div className='v2-flex-justify-between v2-mb-8'>
        <span className='v2-label-large'>{specialty.name}</span>
        <span className='v2-label-large' style={{ color: specialty.color }}>
          {specialty.count} {specialty.count === 1 ? 'error' : 'errores'}
        </span>
      </div>
      <div className='v2-linear-progress'>
        <div 
          className='v2-linear-progress-bar' 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: specialty.color
          }}
        />
      </div>
    </div>
  );
};

const V2ErrorReview = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedAnswers, setFailedAnswers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  
  // User info placeholder (for future features)
  // TODO: Implement user-specific error filtering when API supports it
  // const user = useMemo(() => Auth.getUserInfo(), []);
  
  // Grouped errors by specialty
  const groupedErrors = useMemo(() => {
    return groupErrorsBySpecialty(failedAnswers);
  }, [failedAnswers]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalErrors = failedAnswers.length;
    const mostFailedSpecialty = groupedErrors.length > 0 ? groupedErrors[0] : null;
    return { totalErrors, mostFailedSpecialty };
  }, [failedAnswers, groupedErrors]);
  
  // Fetch failed answers from API
  const fetchFailedAnswers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await ExamService.getUserAnswers();
      // Filter to only incorrect answers (is_correct: false)
      const answers = res.data || [];
      // Filter to only incorrect answers - check both is_correct field and user vs correct answer comparison
      const failed = answers.filter(a => {
        if (a.is_correct === false) return true;
        return a.user_answer?.texto && a.correct_answer?.texto && 
               a.user_answer.texto !== a.correct_answer.texto;
      }).slice(0, 20); // Limit to 20 most recent
      
      // If no failed answers from API, use mock data
      if (failed.length === 0) {
        setFailedAnswers(MOCK_FAILED_ANSWERS);
      } else {
        setFailedAnswers(failed);
      }
    } catch (err) {
      console.error('Error fetching failed answers:', err);
      // Use mock data as fallback
      setFailedAnswers(MOCK_FAILED_ANSWERS);
      setError('Usando datos de demostración. Los datos reales no están disponibles.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchFailedAnswers();
  }, [fetchFailedAnswers]);
  
  // Toggle expanded question
  const toggleExpanded = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);
  
  // Handle retry
  const handleRetry = () => {
    fetchFailedAnswers();
  };
  
  // Handle practice more
  const handlePracticeMore = () => {
    history.push('/practica');
  };

  // Loading state
  if (loading) {
    return (
      <div className='v2-error-review-container'>
        <LoadingSkeleton />
      </div>
    );
  }
  
  // Empty state (no errors)
  if (failedAnswers.length === 0) {
    return (
      <div className='v2-error-review-container'>
        <EmptyState />
      </div>
    );
  }
  
  return (
    <div className='v2-error-review-container'>
      {/* Header */}
      <header className='v2-page-header'>
        <div className='v2-page-header-row'>
          <div>
            <h1 className='v2-headline-medium'>
              Revisión de Errores
            </h1>
            <p className='v2-body-large v2-opacity-70'>
              Analiza tus debilidades para convertirlas en fortalezas
            </p>
          </div>
          {error && (
            <div 
              className='v2-card-tonal v2-label-medium' 
              role='alert'
            >
              <i className='material-icons' aria-hidden='true' style={{ fontSize: '14px', verticalAlign: 'middle' }}>
                info
              </i>
              {' '}{error}
            </div>
          )}
        </div>
      </header>

      {/* Stats and Weaknesses Grid */}
      <div className='v2-grid-auto-fit v2-gap-24 v2-mb-40'>
        {/* Most Failed Specialties */}
        <section className='v2-card v2-grid-span-2'>
          <h3 className='v2-title-large v2-flex-align-center v2-gap-8 v2-mb-24'>
            <i className='material-icons' aria-hidden='true'>analytics</i>
            Debilidades por Especialidad
          </h3>
          <div className='v2-flex-col v2-gap-16'>
            {groupedErrors.slice(0, 5).map(specialty => (
              <SpecialtyProgress 
                key={specialty.name} 
                specialty={specialty} 
                maxCount={groupedErrors[0]?.count || 1}
              />
            ))}
          </div>
        </section>

        {/* Summary Stats Card */}
        <section className='v2-card v2-flex-col v2-flex-center v2-text-center' style={{ 
          background: 'linear-gradient(135deg, var(--md-sys-color-error-container) 0%, var(--md-sys-color-surface) 100%)'
        }}>
          <div className='v2-icon-box-md v2-icon-box-error v2-mb-16'>
            <i className='material-icons' aria-hidden='true' style={{ fontSize: '40px' }}>warning</i>
          </div>
          <h4 className='v2-headline-medium v2-text-error' style={{ margin: '0 0 4px 0' }}>
            {stats.totalErrors}
          </h4>
          <span className='v2-label-large v2-opacity-70'>
            {stats.totalErrors === 1 ? 'Error registrado' : 'Errores totales'}
          </span>
          
          {stats.mostFailedSpecialty && (
            <div className='v2-card v2-mt-20' style={{ width: '100%' }}>
              <span className='v2-label-large v2-opacity-60'>Área más débil</span>
              <p className='v2-body-large v2-text-semibold' style={{ color: stats.mostFailedSpecialty.color }}>
                {stats.mostFailedSpecialty.name}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Action buttons */}
      <div className='v2-flex v2-gap-12 v2-mb-32 v2-flex-wrap'>
        <button 
          className='v2-btn-filled' 
          onClick={handlePracticeMore}
        >
          <i className='material-icons' aria-hidden='true'>school</i>
          Practicar Especialidad Débil
        </button>
        <button 
          className='v2-btn-tonal' 
          onClick={handleRetry}
        >
          <i className='material-icons' aria-hidden='true'>refresh</i>
          Actualizar
        </button>
        <Link 
          to='/dashboard' 
          className='v2-btn-outlined v2-text-decoration-none'
        >
          <i className='material-icons' aria-hidden='true'>home</i>
          Volver al Inicio
        </Link>
      </div>

      {/* Failed Questions List */}
      <h3 className='v2-title-large v2-flex-align-center v2-gap-8 v2-mb-24'>
        <i className='material-icons' aria-hidden='true'>quiz</i>
        Preguntas Falladas ({failedAnswers.length})
      </h3>
      
      <div className='v2-flex-col v2-gap-16'>
        {failedAnswers.map(error => (
          <QuestionCard 
            key={error.id} 
            error={error} 
            isExpanded={expandedId === error.id}
            onToggle={() => toggleExpanded(error.id)}
          />
        ))}
      </div>

      {/* Study tips section */}
      <section className='v2-card v2-tips-section v2-mt-40 v2-bg-primary-container'>
        <h3 className='v2-title-large v2-flex-align-center v2-gap-8 v2-mb-16'>
          <i className='material-icons' aria-hidden='true'>tips_and_updates</i>
          Consejos de Estudio
        </h3>
        <ul className='v2-tips-list'>
          <li>
            <i className='material-icons v2-text-primary' aria-hidden='true' style={{ fontSize: '20px' }}>
              check_circle
            </i>
            <span className='v2-body-large'>
              <strong>Revisa las explicaciones</strong> — Cada error es una oportunidad de aprendizaje. Lee la explicación completa antes de continuar.
            </span>
          </li>
          <li>
            <i className='material-icons v2-text-primary' aria-hidden='true' style={{ fontSize: '20px' }}>
              check_circle
            </i>
            <span className='v2-body-large'>
              <strong>Practica por especialidad</strong> — Enfócate en las áreas donde cometes más errores para mejorar más rápido.
            </span>
          </li>
          <li>
            <i className='material-icons v2-text-primary' aria-hidden='true' style={{ fontSize: '20px' }}>
              check_circle
            </i>
            <span className='v2-body-large'>
              <strong>Repite los casos difíciles</strong> — Volver a practicar casos similares te ayudará a consolidar el conocimiento.
            </span>
          </li>
        </ul>
      </section>


    </div>
  );
};

export default V2ErrorReview;