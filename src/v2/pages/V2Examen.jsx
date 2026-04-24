import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ExamService from '../../services/ExamService';
import Auth from '../../modules/Auth';
import '../styles/v2-theme.css';

// Mock case for fallback
const MOCK_CASE = {
  identificador: 'Caso Clínico #124',
  texto: 'Paciente masculino de 45 años acudir a urgencias por dolor torácico opresivo de 30 minutos de evolución, irradiado a mandíbula y brazo izquierdo. Antecedentes de hipertensión y diabetes tipo 2. Sin antecedentes de cardiopatía previa. Fumador ocasional.',
  preguntas: [
    {
      texto: '¿Cuál es el primer paso diagnóstico más apropiado?',
      respuestas: [
        { texto: 'Electrocardiograma de 12 derivaciones', is_correct: true },
        { texto: 'Enzimas cardiacas (Troponinas)', is_correct: false },
        { texto: 'Radiografía de tórax', is_correct: false },
        { texto: 'Ecocardiograma transtorácico', is_correct: false }
      ]
    }
  ],
  pearl: 'Ante la sospecha de un Síndrome Coronario Agudo, el electrocardiograma es la herramienta diagnóstica inicial más importante para determinar la conducta terapéutica inmediata. Debe realizarse e interpretarse en menos de 10 minutos.'
};

const V2Examen = () => {
  const { identificador } = useParams();
  const history = useHistory();
  
  // Core state
  const [caso, setCaso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Session state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  
  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);
  
  // User info for future features (user id used in session summary navigation)
  const user = Auth.getUserInfo();

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Load case
  useEffect(() => {
    const loadCaso = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let res;
        if (identificador === 'random') {
          res = await ExamService.loadRandomCaso();
        } else {
          res = await ExamService.getCaso(identificador);
        }
        
        setCaso(res.data);
        setIsTimerRunning(true);
      } catch (err) {
        console.error('Error loading case:', err);
        // Use mock data as fallback
        setCaso(MOCK_CASE);
        setIsTimerRunning(true);
        setError('Modo de demostración');
      } finally {
        setLoading(false);
      }
    };
    
    loadCaso();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [identificador]);

  // Handle answer selection
  const handleSelectAnswer = useCallback((questionIndex, answerIndex) => {
    if (showFeedback) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  }, [showFeedback]);

  // Handle answer submission
  const handleSubmitAnswer = useCallback(async () => {
    const selectedAnswer = selectedAnswers[currentQuestionIndex];
    if (selectedAnswer === undefined || !caso) return;

    const currentQuestion = caso.preguntas[currentQuestionIndex];
    const isCorrect = currentQuestion.respuestas[selectedAnswer].is_correct;
    
    // Calculate XP
    const xpGain = isCorrect ? 50 : 10;
    setXpEarned(prev => prev + xpGain);
    setTotalXp(prev => prev + xpGain);

    // Send answer to backend
    try {
      const answerData = {
        clinical_case_id: caso.id,
        question_id: currentQuestion.id,
        selected_answer_index: selectedAnswer,
        is_correct: isCorrect,
        time_spent: timeElapsed
      };
      await ExamService.sendAnswers(answerData);
    } catch (err) {
      console.error('Error sending answer:', err);
    }

    setShowFeedback(true);
    setIsTimerRunning(false);
  }, [selectedAnswers, currentQuestionIndex, caso, timeElapsed]);

  // Handle next question / finish
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < caso.preguntas.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
      setIsTimerRunning(true);
    } else {
      // Navigate to session summary
      history.push({
        pathname: '/simulacro/resumen',
        state: {
          casoId: caso.id,
          totalQuestions: caso.preguntas.length,
          correctAnswers: Object.values(selectedAnswers).filter((ansIdx, qIdx) => {
            const question = caso.preguntas[qIdx];
            return question?.respuestas[ansIdx]?.is_correct;
          }).length,
          xpEarned: totalXp,
          timeElapsed,
          userId: user?.id
        }
      });
    }
  }, [currentQuestionIndex, caso, selectedAnswers, totalXp, timeElapsed, user, history]);

  // Skip / Exit session
  const handleExit = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    history.push('/dashboard');
  }, [history]);

  if (loading) {
    return (
      <div className='v2-center-state v2-min-h-60vh' role='status' aria-live='polite' aria-label='Cargando caso clínico'>
        <div className='v2-card-tonal v2-flex-align-center v2-gap-16' style={{ padding: '24px 48px' }}>
          <i className='material-icons v2-text-primary' style={{ fontSize: '32px' }}>quiz</i>
          <span className='v2-headline-medium'>Cargando caso...</span>
        </div>
        <div className='v2-linear-progress' role='progressbar' aria-label='Cargando caso clínico' style={{ width: '300px', height: '8px' }}>
          <div className='v2-linear-progress-bar' style={{ width: '60%', animation: 'v2-loading 1.5s ease-in-out infinite' }}></div>
        </div>
      </div>
    );
  }

  if (!caso) {
    return (
      <div className='v2-center-state v2-min-h-60vh v2-gap-16' role='alert' aria-live='assertive'>
        <i className='material-icons v2-text-primary' style={{ fontSize: '64px' }}>error_outline</i>
        <h2 className='v2-title-large'>No se pudo cargar el caso</h2>
        <button className='v2-btn-filled' onClick={() => history.push('/dashboard')}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  const currentQuestion = caso.preguntas[currentQuestionIndex];
  
  // Guard: if no question at current index, show error
  if (!currentQuestion) {
    return (
      <div className='v2-center-state v2-min-h-60vh v2-gap-16' role='alert' aria-live='assertive'>
        <i className='material-icons v2-text-primary' style={{ fontSize: '64px' }}>error_outline</i>
        <h2 className='v2-title-large'>Este caso no tiene preguntas</h2>
        <button className='v2-btn-filled' onClick={() => history.push('/dashboard')}>
          Volver al Inicio
        </button>
      </div>
    );
  }
  
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isCurrentCorrect = currentQuestion?.respuestas[selectedAnswer]?.is_correct;

  return (
    <div className='v2-page-container'>
      {/* Session Header */}
      <div className='v2-card-tonal v2-flex-justify-between v2-flex-align-center v2-mb-24' style={{ padding: '12px 24px', flexWrap: 'wrap' }}>
        <div className='v2-flex-align-center v2-gap-12'>
          <span className='v2-label-large v2-text-primary'>Sesión Activa</span>
          {error && (
            <span className='v2-label-large v2-badge-tertiary' style={{ borderRadius: '12px' }}>
              {error}
            </span>
          )}
        </div>
        
        <div className='v2-flex-align-center' style={{ gap: '20px' }}>
          <div className='v2-flex-align-center v2-gap-4' aria-label={`XP ganado: ${xpEarned}`}>
            <i className='material-icons v2-text-primary' style={{ fontSize: '18px' }} aria-hidden='true'>bolt</i>
            <span className='v2-label-large'>+{xpEarned} XP</span>
          </div>
          
          <div className='v2-flex-align-center v2-gap-4' aria-label={`Tiempo transcurrido: ${formatTime(timeElapsed)}`}>
            <i className='material-icons' style={{ fontSize: '18px', color: timeElapsed > 300 ? 'var(--md-sys-color-error)' : 'inherit' }} aria-hidden='true'>timer</i>
            <span className='v2-label-large' style={{ 
              color: timeElapsed > 300 ? 'var(--md-sys-color-error)' : 'inherit',
              fontWeight: timeElapsed > 300 ? 'bold' : 'normal'
            }}>
              {formatTime(timeElapsed)}
            </span>
          </div>
          
          <div className='v2-flex-align-center v2-gap-4' aria-label={`Pregunta ${currentQuestionIndex + 1} de ${caso.preguntas.length}`}>
            <i className='material-icons' style={{ fontSize: '18px' }} aria-hidden='true'>help_outline</i>
            <span className='v2-label-large'>{currentQuestionIndex + 1}/{caso.preguntas.length}</span>
          </div>
        </div>
      </div>

      {/* Case Text */}
      <section className='v2-card v2-card-elevated v2-mb-32'>
        <div className='v2-flex-justify-between' style={{ alignItems: 'flex-start', marginBottom: '16px' }}>
          <h2 className='v2-title-large v2-text-primary'>
            {caso.identificador || 'Caso Clínico'}
          </h2>
          <button 
            className='v2-btn-tonal' 
            style={{ padding: '8px 16px' }}
            onClick={handleExit}
            aria-label='Salir de la sesión'
          >
            <i className='material-icons' aria-hidden='true'>close</i>
            Salir
          </button>
        </div>
        <p className='v2-body-large' style={{ lineHeight: '1.8' }}>
          {caso.texto}
        </p>
      </section>

      {/* Question */}
      <section className='v2-card v2-p-32'>
        <div className='v2-flex-justify-between v2-flex-align-center v2-mb-24'>
          <p className='v2-title-large v2-text-semibold v2-m-0'>
            {currentQuestion.texto}
          </p>
          {showFeedback && (
            <div 
              className='v2-card-tonal' 
              style={{ 
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isCurrentCorrect 
                  ? 'var(--md-sys-color-primary-container)' 
                  : 'var(--md-sys-color-error-container)'
              }}
            >
              <i className='material-icons' style={{ 
                color: isCurrentCorrect 
                  ? 'var(--md-sys-color-primary)' 
                  : 'var(--md-sys-color-error)'
              }} aria-hidden='true'>
                {isCurrentCorrect ? 'check_circle' : 'cancel'}
              </i>
              <span className='v2-label-large'>
                {isCurrentCorrect ? '+50 XP' : '+10 XP'}
              </span>
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className='v2-flex-col v2-gap-12'>
          {currentQuestion.respuestas.map((resp, rIdx) => {
            const isSelected = selectedAnswer === rIdx;
            const isCorrectAnswer = resp.is_correct;
            
            let borderColor = 'var(--md-sys-color-outline-variant)';
            let bgColor = 'transparent';
            let iconBg = 'var(--md-sys-color-surface-variant)';
            let iconColor = 'inherit';
            let iconContent = String.fromCharCode(65 + rIdx);
            let opacity = 1;
            
            if (showFeedback) {
              if (isCorrectAnswer) {
                borderColor = 'var(--md-sys-color-primary)';
                bgColor = 'var(--md-sys-color-primary-container)';
                iconBg = 'var(--md-sys-color-primary)';
                iconColor = 'var(--md-sys-color-on-primary)';
                iconContent = '✓';
              } else if (isSelected) {
                borderColor = 'var(--md-sys-color-error)';
                bgColor = 'var(--md-sys-color-error-container)';
                iconBg = 'var(--md-sys-color-error)';
                iconColor = 'var(--md-sys-color-on-error)';
                iconContent = '✗';
              } else {
                opacity = 0.5;
              }
            } else if (isSelected) {
              borderColor = 'var(--md-sys-color-primary)';
              bgColor = 'var(--md-sys-color-primary-container)';
              iconBg = 'var(--md-sys-color-primary)';
              iconColor = 'var(--md-sys-color-on-primary)';
            }
            
            return (
              <button
                key={rIdx}
                onClick={() => !showFeedback && handleSelectAnswer(currentQuestionIndex, rIdx)}
                disabled={showFeedback}
                className='v2-card-outlined'
                aria-label={`Opción ${String.fromCharCode(65 + rIdx)}: ${resp.texto}${showFeedback ? (isCorrectAnswer ? ' - Correcta' : (isSelected ? ' - Incorrecta' : '')) : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left',
                  cursor: showFeedback ? 'default' : 'pointer',
                  borderColor,
                  backgroundColor: bgColor,
                  opacity,
                  width: '100%',
                  padding: '16px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: iconBg,
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {iconContent}
                </span>
                <span className='v2-body-large'>{resp.texto}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className='v2-mt-40'>
          {!showFeedback ? (
            <div className='v2-text-right'>
              <button
                className='v2-btn-filled v2-btn-h-56'
                style={{ padding: '0 40px' }}
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === undefined}
                aria-label='Confirmar respuesta'
              >
                Confirmar Respuesta
                <i className='material-icons' aria-hidden='true'>check_circle</i>
              </button>
              {selectedAnswer === undefined && (
                <p className='v2-label-large v2-mt-8 v2-opacity-60'>
                  Selecciona una respuesta para continuar
                </p>
              )}
            </div>
          ) : (
            <div>
              {/* Medical Pearl */}
              {caso.pearl && (
                <div className='v2-card-outlined v2-bg-tertiary-container v2-mb-24' style={{ padding: '24px', border: 'none' }}>
                  <h4 className='v2-title-large v2-flex-align-center v2-gap-8 v2-mb-12'>
                    <i className='material-icons' aria-hidden='true'>lightbulb</i>
                    Perla Médica
                  </h4>
                  <p className='v2-body-large v2-line-height-relaxed'>
                    {caso.pearl}
                  </p>
                </div>
              )}

              <div className='v2-flex v2-gap-12' style={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {currentQuestionIndex < caso.preguntas.length - 1 && (
                  <button
                    className='v2-btn-filled v2-btn-h-56'
                    style={{ padding: '0 40px' }}
                    onClick={handleNext}
                    aria-label='Siguiente pregunta'
                  >
                    Siguiente
                    <i className='material-icons' aria-hidden='true'>arrow_forward</i>
                  </button>
                )}
                {currentQuestionIndex === caso.preguntas.length - 1 && (
                  <button
                    className='v2-btn-filled v2-btn-h-56'
                    style={{ padding: '0 40px' }}
                    onClick={handleNext}
                    aria-label='Ver resumen de sesión'
                  >
                    Ver Resumen
                    <i className='material-icons' aria-hidden='true'>emoji_events</i>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Progress Indicator */}
      <div className='v2-flex v2-flex-justify-center v2-gap-8 v2-mt-24'>
        {caso.preguntas.map((_, qIdx) => (
          <div
            key={qIdx}
            style={{
              width: qIdx === currentQuestionIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: qIdx < currentQuestionIndex 
                ? 'var(--md-sys-color-primary)' 
                : qIdx === currentQuestionIndex 
                  ? 'var(--md-sys-color-secondary)' 
                  : 'var(--md-sys-color-surface-variant)',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Pregunta ${qIdx + 1}${qIdx < currentQuestionIndex ? ' - respondida' : qIdx === currentQuestionIndex ? ' - actual' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default V2Examen;