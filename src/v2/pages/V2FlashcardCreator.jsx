import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import FlashcardService from '../../services/FlashcardService';
import ExamService from '../../services/ExamService';
import AIService from '../../services/AIService';
import '../styles/v2-theme.css';

// Mock data for demo/fallback
const MOCK_SPECIALTIES = [
  { id: 1, name: 'Cardiología' },
  { id: 2, name: 'Ginecología y Obstetricia' },
  { id: 3, name: 'Pediatría' },
  { id: 4, name: 'Neurología' },
  { id: 5, name: 'Cirugía General' },
  { id: 6, name: 'Medicina Interna' },
  { id: 7, name: 'Dermatología' },
  { id: 8, name: 'Psiquiatría' }
];

// Loading skeleton for specialties
const SpecialtiesSkeleton = () => (
  <div className='v2-flashcard-creator-skeleton'>
    <div className='skeleton-bar' style={{ width: '120px', height: '20px', marginBottom: '8px' }}></div>
    <div className='skeleton-bar' style={{ width: '100%', height: '48px', borderRadius: '8px' }}></div>
  </div>
);

// Mini flashcard preview component
const FlashcardPreview = ({ front, back }) => (
  <div className='v2-flashcard-preview'>
    <div className='v2-flashcard-preview-inner'>
      <div className='v2-flashcard-preview-front'>
        <span className='v2-flashcard-preview-label'>Anverso</span>
        <p>{front || '...'}</p>
      </div>
      <div className='v2-flashcard-preview-divider'></div>
      <div className='v2-flashcard-preview-back'>
        <span className='v2-flashcard-preview-label'>Reverso</span>
        <p>{back || '...'}</p>
      </div>
    </div>
  </div>
);

// Error state component (for future use with API errors)
// const ErrorState = ({ message, onRetry }) => (
//   <div className='v2-error-state'>
//     <i className='material-icons v2-error-icon'>error_outline</i>
//     <p className='v2-body-large'>{message}</p>
//     {onRetry && (
//       <button className='v2-btn-tonal' onClick={onRetry}>
//         <i className='material-icons'>refresh</i>
//         Reintentar
//       </button>
//     )}
//   </div>
// );

// Success state component
const SuccessState = ({ onCreateAnother, onGoToStudy }) => (
  <div className='v2-success-state'>
    <div className='v2-success-icon-wrapper'>
      <i className='material-icons v2-success-icon'>check_circle</i>
    </div>
    <h2 className='v2-title-large'>¡Flashcard creada!</h2>
    <p className='v2-body-large'>Tu flashcard ha sido guardada exitosamente.</p>
    <div className='v2-success-actions'>
      <button className='v2-btn-tonal' onClick={onCreateAnother}>
        <i className='material-icons'>add</i>
        Crear otra
      </button>
      <button className='v2-btn-primary' onClick={onGoToStudy}>
        <i className='material-icons'>school</i>
        Estudiar ahora
      </button>
    </div>
  </div>
);

const V2FlashcardCreator = () => {
  const history = useHistory();
  
  // Form state
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  
  // Preview mode
  const [showPreview, setShowPreview] = useState(false);
  
  // AI generation state
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch specialties on mount
  const fetchSpecialties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ExamService.loadCategories();
      const data = response.data || [];
      setSpecialties(data.length > 0 ? data : MOCK_SPECIALTIES);
    } catch (err) {
      console.error('Error fetching specialties:', err);
      // Use mock data as fallback
      setSpecialties(MOCK_SPECIALTIES);
      setError('Modo de demostración. Los datos reales no están disponibles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecialties();
  }, [fetchSpecialties]);

  // Validate form
  const isFormValid = front.trim().length > 0 && back.trim().length > 0 && specialtyId;

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSaving(true);
    setError(null);
    
    try {
      await FlashcardService.createFlashcard({
        front: front.trim(),
        back: back.trim(),
        specialty_id: parseInt(specialtyId, 10)
      });
      setShowSuccess(true);
    } catch (err) {
      console.error('Error saving flashcard:', err);
      setError('Ocurrió un error al guardar. Por favor, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  // Handle AI generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim() || !specialtyId) {
      setAiError('Por favor, ingresa un tema y selecciona una especialidad.');
      return;
    }

    setGenerating(true);
    setAiError(null);

    try {
      const response = await AIService.generateFlashcards({
        topic: aiPrompt.trim(),
        specialty_id: parseInt(specialtyId, 10),
        count: 1
      });
      
      const data = response.data;
      if (data && data.front && data.back) {
        setFront(data.front);
        setBack(data.back);
        setShowAIGenerator(false);
        setAiPrompt('');
      } else {
        setAiError('No se pudo generar la flashcard. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error generating flashcard with AI:', err);
      setAiError('Error al conectar con el servicio de IA. Intenta de nuevo.');
    } finally {
      setGenerating(false);
    }
  };

  // Handle create another
  const handleCreateAnother = () => {
    setFront('');
    setBack('');
    setSpecialtyId('');
    setShowSuccess(false);
    setShowPreview(false);
  };

  // Handle go to study
  const handleGoToStudy = () => {
    history.push('/flashcards/repaso');
  };

  // Handle back navigation
  const handleBack = () => {
    history.goBack();
  };

  // Toggle preview
  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };

  // Toggle AI generator
  const toggleAIGenerator = () => {
    setShowAIGenerator(prev => !prev);
    setAiError(null);
  };

  // If showing success state
  if (showSuccess) {
    return (
      <div className='v2-page-container'>
        <div className='v2-flashcard-creator-container'>
          <SuccessState 
            onCreateAnother={handleCreateAnother}
            onGoToStudy={handleGoToStudy}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='v2-page-container'>
      <div className='v2-flashcard-creator-container'>
        {/* Header */}
        <header className='v2-flashcard-creator-header'>
          <button 
            className='v2-btn-icon v2-btn-back' 
            onClick={handleBack}
            aria-label='Volver atrás'
          >
            <i className='material-icons'>arrow_back</i>
          </button>
          <div className='v2-header-content'>
            <h1 className='v2-headline-medium'>Crear Flashcard</h1>
            <p className='v2-body-large v2-text-secondary'>Añade una nueva tarjeta de estudio</p>
          </div>
        </header>

        {/* AI Generator Toggle */}
        {!showAIGenerator && (
          <button 
            className='v2-btn-tonal v2-ai-toggle'
            onClick={toggleAIGenerator}
          >
            <i className='material-icons'>auto_awesome</i>
            Generar con IA
          </button>
        )}

        {/* AI Generator Panel */}
        {showAIGenerator && (
          <section className='v2-card v2-bg-primary-container v2-ai-panel' aria-labelledby='ai-panel-title'>
            <div className='v2-ai-panel-header'>
              <i className='material-icons'>auto_awesome</i>
              <h3 id='ai-panel-title'>Generador con Inteligencia Artificial</h3>
              <button 
                className='v2-btn-icon'
                onClick={toggleAIGenerator}
                aria-label='Cerrar'
              >
                <i className='material-icons'>close</i>
              </button>
            </div>
            <p className='v2-body-medium'>
              Describe el tema o concepto y la IA generará una flashcard automáticamente.
            </p>
            <div className='v2-ai-input-group'>
              <input
                type='text'
                className='v2-input'
                placeholder='Ej: Tríada de Virchow, manejo de IAMCEST, clasificación de anemias...'
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={generating}
              />
              <button 
                className='v2-btn-primary'
                onClick={handleAIGenerate}
                disabled={generating || !specialtyId || !aiPrompt.trim()}
              >
                {generating ? (
                  <>
                    <span className='v2-spinner'></span>
                    Generando...
                  </>
                ) : (
                  <>
                    <i className='material-icons'>auto_awesome</i>
                    Generar
                  </>
                )}
              </button>
            </div>
            {!specialtyId && (
              <p className='v2-ai-hint'>
                <i className='material-icons'>info</i>
                Selecciona una especialidad primero para usar el generador de IA
              </p>
            )}
            {aiError && (
              <p className='v2-error-text'>
                <i className='material-icons'>error</i>
                {aiError}
              </p>
            )}
          </section>
        )}

        {/* Main Form */}
        <form className='v2-card v2-flashcard-form' onSubmit={handleSave}>
          {/* Specialty Select */}
          <div className='v2-form-group'>
            <label htmlFor='specialty-select' className='v2-label-large'>
              <i className='material-icons'>medical_services</i>
              Especialidad
            </label>
            {loading ? (
              <SpecialtiesSkeleton />
            ) : (
              <select
                id='specialty-select'
                className='v2-input v2-select'
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
                required
              >
                <option value='' disabled>Seleccionar especialidad...</option>
                {specialties.map(spec => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Front (Question) */}
          <div className='v2-form-group'>
            <label htmlFor='front-input' className='v2-label-large'>
              <i className='material-icons'>quiz</i>
              Anverso (Pregunta)
            </label>
            <textarea
              id='front-input'
              className='v2-input v2-textarea'
              rows='4'
              placeholder='Escribe la pregunta o concepto que quieres recordar...'
              value={front}
              onChange={(e) => setFront(e.target.value)}
              required
            />
            <span className='v2-char-count'>
              {front.length} caracteres
            </span>
          </div>

          {/* Back (Answer) */}
          <div className='v2-form-group'>
            <label htmlFor='back-input' className='v2-label-large'>
              <i className='material-icons'>lightbulb</i>
              Reverso (Respuesta)
            </label>
            <textarea
              id='back-input'
              className='v2-input v2-textarea'
              rows='6'
              placeholder='Escribe la respuesta detallada, explicación o definición...'
              value={back}
              onChange={(e) => setBack(e.target.value)}
              required
            />
            <span className='v2-char-count'>
              {back.length} caracteres
            </span>
          </div>

          {/* Preview Toggle */}
          {isFormValid && (
            <button 
              type='button'
              className='v2-btn-tonal v2-preview-toggle'
              onClick={togglePreview}
            >
              <i className='material-icons'>{showPreview ? 'visibility_off' : 'visibility'}</i>
              {showPreview ? 'Ocultar' : 'Ver'} Vista previa
            </button>
          )}

          {/* Preview Card */}
          {showPreview && isFormValid && (
            <div className='v2-preview-section'>
              <h3 className='v2-label-large'>Vista previa</h3>
              <FlashcardPreview front={front} back={back} />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className='v2-form-error'>
              <i className='material-icons'>error_outline</i>
              <span>{error}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className='v2-form-actions'>
            <button 
              type='button' 
              className='v2-btn-tonal'
              onClick={handleBack}
            >
              Cancelar
            </button>
            <button 
              type='submit' 
              className='v2-btn-primary'
              disabled={!isFormValid || saving}
            >
              {saving ? (
                <>
                  <span className='v2-spinner'></span>
                  Guardando...
                </>
              ) : (
                <>
                  <i className='material-icons'>save</i>
                  Guardar Flashcard
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <aside className='v2-card v2-bg-secondary-container v2-tips-section'>
          <h3 className='v2-title-medium'>
            <i className='material-icons'>tips_and_updates</i>
            Consejos para crear buenas flashcards
          </h3>
          <ul className='v2-tips-list'>
            <li>
              <i className='material-icons'>check_circle</i>
              <span><strong>Una pregunta por tarjeta:</strong> Mantén el anverso simple y enfocdo en un solo concepto.</span>
            </li>
            <li>
              <i className='material-icons'>check_circle</i>
              <span><strong>Usa tus propias palabras:</strong> Esto ayuda a mejorar la retención y comprensión.</span>
            </li>
            <li>
              <i className='material-icons'>check_circle</i>
              <span><strong>Incluye contexto:</strong> El reverso debe tener suficiente información para recordar el tema completo.</span>
            </li>
            <li>
              <i className='material-icons'>check_circle</i>
              <span><strong>Sé específico:</strong> Evita preguntas vagas que puedan tener múltiples respuestas correctas.</span>
            </li>
          </ul>
        </aside>
      </div>

    </div>
  );
};

export default V2FlashcardCreator;