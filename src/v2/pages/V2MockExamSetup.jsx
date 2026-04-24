import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ExamService from '../../services/ExamService';
import '../styles/v2-theme.css';

const V2MockExamSetup = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [numQuestions, setNumQuestions] = useState(20);
  const [timeLimit, setTimeLimit] = useState(30);
  const history = useHistory();

  useEffect(() => {
    ExamService.loadCategories().then(res => setCategories(res.data)).catch(err => console.error(err));
  }, []);

  const handleStart = () => {
    // In a real implementation, we would send these params to a session creation endpoint
    history.push('/caso/random');
  };

  return (
    <div className='v2-page-medium'>
      <header className='v2-mb-32'>
        <h1 className='v2-headline-medium'>Configurar Simulacro</h1>
        <p className='v2-body-large v2-opacity-70'>Personaliza tu sesión de estudio para el ENARM.</p>
      </header>

      <div className='v2-grid-auto-fit v2-gap-24 v2-mock-exam-grid'>
        <section className="v2-card">
          <h2 className='v2-title-large v2-mb-20'>
            <i className='material-icons' style={{ verticalAlign: 'middle', marginRight: '8px' }}>category</i>
            Especialidad
          </h2>
          <div className='v2-flex v2-flex-wrap' style={{ gap: '10px' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`v2-btn-selectable ${selectedCategory === cat.id ? 'v2-selected' : ''}`}
                style={{ borderRadius: '12px', padding: '8px 16px' }}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </section>

        <section className="v2-card">
          <h2 className='v2-title-large v2-mb-20'>
            <i className='material-icons' style={{ verticalAlign: 'middle', marginRight: '8px' }}>quiz</i>
            Número de Preguntas
          </h2>
          <div className='v2-grid-3 v2-gap-12'>
            {[10, 20, 50, 100, 200, 450].map(n => (
              <button
                key={n}
                onClick={() => setNumQuestions(n)}
                className={`v2-btn-selectable ${numQuestions === n ? 'v2-selected' : ''}`}
                style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}
              >
                {n}
              </button>
            ))}
          </div>
        </section>

        <section className="v2-card">
          <h2 className='v2-title-large v2-mb-20'>
            <i className='material-icons' style={{ verticalAlign: 'middle', marginRight: '8px' }}>timer</i>
            Límite de Tiempo (min)
          </h2>
          <input
            type="range"
            min="10"
            max="240"
            step="10"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--md-sys-color-primary)' }}
          />
          <div className='v2-flex-justify-between v2-mt-12'>
            <span className='v2-body-large'>{timeLimit} minutos</span>
            <span className='v2-body-large v2-opacity-50'>Máx: 4 horas</span>
          </div>
        </section>

        <section className='v2-card v2-bg-primary-container'>
          <h2 className='v2-title-large v2-mb-16'>Resumen</h2>
          <div className='v2-flex-col v2-gap-8'>
             <div className='v2-flex-justify-between'>
                <span>Preguntas</span>
                <span className='v2-text-bold'>{numQuestions}</span>
             </div>
             <div className='v2-flex-justify-between'>
                <span>Tiempo</span>
                <span className='v2-text-bold'>{timeLimit} min</span>
             </div>
             <div className='v2-flex-justify-between'>
                <span>Dificultad</span>
                <span className='v2-text-bold'>ENARM Real</span>
             </div>
          </div>
          <button
            className='v2-btn-filled v2-btn-full v2-btn-justify-center v2-mt-24'
            onClick={handleStart}
          >
            Comenzar Simulacro
            <i className="material-icons">play_arrow</i>
          </button>
        </section>
      </div>
    </div>
  );
};

export default V2MockExamSetup;
