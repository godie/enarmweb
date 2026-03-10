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
    history.push('/v2/caso/random');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="v2-headline-medium">Configurar Simulacro</h1>
        <p className="v2-body-large" style={{ opacity: 0.7 }}>Personaliza tu sesión de estudio para el ENARM.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <section className="v2-card">
          <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>
            <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>category</i>
            Especialidad
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? 'v2-btn-filled' : 'v2-btn-tonal'}
                style={{ borderRadius: '12px', padding: '8px 16px' }}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </section>

        <section className="v2-card">
          <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>
            <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>quiz</i>
            Número de Preguntas
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[10, 20, 50, 100, 200, 450].map(n => (
              <button
                key={n}
                onClick={() => setNumQuestions(n)}
                className={numQuestions === n ? 'v2-btn-filled' : 'v2-card-outlined'}
                style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {n}
              </button>
            ))}
          </div>
        </section>

        <section className="v2-card">
          <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>
            <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>timer</i>
            Límite de Tiempo (min)
          </h3>
          <input
            type="range"
            min="10"
            max="240"
            step="10"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--md-sys-color-primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
            <span className="v2-body-large">{timeLimit} minutos</span>
            <span className="v2-body-large" style={{ opacity: 0.5 }}>Máx: 4 horas</span>
          </div>
        </section>

        <section className="v2-card" style={{ backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)' }}>
          <h3 className="v2-title-large" style={{ marginBottom: '16px' }}>Resumen</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Preguntas</span>
                <span style={{ fontWeight: 'bold' }}>{numQuestions}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tiempo</span>
                <span style={{ fontWeight: 'bold' }}>{timeLimit} min</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Dificultad</span>
                <span style={{ fontWeight: 'bold' }}>ENARM Real</span>
             </div>
          </div>
          <button
            className="v2-btn-filled"
            style={{ width: '100%', marginTop: '24px', justifyContent: 'center', backgroundColor: 'var(--md-sys-color-primary)' }}
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
