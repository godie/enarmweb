import { useState } from 'react';
import { alertSuccess, alertError } from '../../services/AlertService';
import CustomPreloader from '../../components/custom/CustomPreloader';
import '../styles/v2-theme.css';

const V2Contribuir = () => {
    const [form, setForm] = useState({
        caso: '',
        pregunta: '',
        opciones: ['', '', '', ''],
        correcta: 0,
        perla: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
    const handleOptionChange = (idx, value) => {
        const newOps = [...form.opciones];
        newOps[idx] = value;
        setForm(prev => ({ ...prev, opciones: newOps }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.caso.trim() || !form.pregunta.trim() || !form.perla.trim() || form.opciones.some(op => !op.trim())) {
            alertError('Campos vacíos', 'Por favor, completa todos los campos antes de enviar.');
            return;
        }
        setLoading(true);
        try {
            // Simular envío a revisión
            await new Promise(resolve => setTimeout(resolve, 1500));
            alertSuccess('¡Gracias por tu aporte!', 'Tu caso clínico ha sido enviado y será revisado por nuestro equipo médico.');
            setForm({
                caso: '',
                pregunta: '',
                opciones: ['', '', '', ''],
                correcta: 0,
                perla: ''
            });
        } catch {
            alertError('Error', 'No se pudo enviar tu contribución. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='v2-page-container'>
            <header className='v2-mb-32'>
                <h1 className='v2-headline-medium'>Contribuir Caso Clínico</h1>
                <p className='v2-body-large v2-opacity-70'>Tu aporte mejora la preparación de miles de colegas aspirantes.</p>
            </header>

            <form onSubmit={handleSubmit} className='v2-grid v2-gap-24' style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="v2-card">
                        <h2 className='v2-title-large v2-mb-20'>
                            <i className='material-icons' style={{ verticalAlign: 'middle', marginRight: '8px' }}>description</i>
                            Escenario Clínico
                        </h2>
                        <div className="v2-input-outlined" style={{ marginTop: '0' }}>
                            <label htmlFor='caso-input'>Descripción detallada</label>
                            <textarea
                                id='caso-input'
                                style={{ minHeight: '180px' }}
                                placeholder="Paciente masculino de 45 años..."
                                value={form.caso}
                                onChange={(e) => handleChange('caso', e.target.value)}
                            />
                        </div>
                    </section>

                    <section className="v2-card">
                        <h2 className='v2-title-large v2-mb-20'>
                            <i className='material-icons' style={{ verticalAlign: 'middle', marginRight: '8px' }}>quiz</i>
                            La Pregunta
                        </h2>
                        <div className="v2-input-outlined" style={{ marginTop: '0' }}>
                            <label htmlFor='pregunta-input'>Pregunta diagnóstica/terapéutica</label>
                            <input
                                id='pregunta-input'
                                placeholder="¿Cuál es el siguiente paso?"
                                value={form.pregunta}
                                onChange={(e) => handleChange('pregunta', e.target.value)}
                            />
                        </div>
                    </section>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="v2-card">
                        <h2 className='v2-title-large v2-mb-20'>
                            <i className='material-icons' style={{ verticalAlign: 'middle', marginRight: '8px' }}>list</i>
                            Opciones de Respuesta
                        </h2>
                        <div className='v2-flex-col v2-gap-12'>
                            {form.opciones.map((op, idx) => (
                                <div key={idx} className='v2-flex-align-center v2-gap-12'>
                                    <input
                                        id={`correcta-${idx}`}
                                        type="radio"
                                        name="correcta"
                                        checked={form.correcta === idx}
                                        onChange={() => handleChange('correcta', idx)}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--md-sys-color-primary)', cursor: 'pointer' }}
                                        aria-label={`Marcar opción ${String.fromCharCode(65 + idx)} como correcta`}
                                        title={`Marcar opción ${String.fromCharCode(65 + idx)} como correcta`}
                                    />
                                    <div className="v2-input-outlined" style={{ flex: 1, marginTop: '0' }}>
                                        <label htmlFor={`opcion-${idx}`}>{`Opción ${String.fromCharCode(65 + idx)}`}</label>
                                        <input
                                            id={`opcion-${idx}`}
                                            style={{ padding: '12px' }}
                                            placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                                            value={op}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="v2-card">
                        <h2 className='v2-title-large v2-mb-20'>
                            <i className='material-icons' style={{ verticalAlign: 'middle', marginRight: '8px' }}>lightbulb</i>
                            Perla Médica
                        </h2>
                        <div className="v2-input-outlined" style={{ marginTop: '0' }}>
                            <label htmlFor='perla-input'>Justificación académica</label>
                            <textarea
                                id='perla-input'
                                style={{ minHeight: '100px' }}
                                placeholder="Explica por qué la respuesta es correcta..."
                                value={form.perla}
                                onChange={(e) => handleChange('perla', e.target.value)}
                            />
                        </div>
                    </section>

                    <button type="submit" className='v2-btn-filled v2-btn-h-56 v2-btn-full v2-btn-justify-center' disabled={loading}>
                        {loading ? (
                            <span className='v2-flex-align-center v2-gap-12'>
                                <CustomPreloader size='small' />
                                Enviando...
                            </span>
                        ) : (
                            <>
                                Enviar para Revisión
                                <i className="material-icons" aria-hidden="true">send</i>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default V2Contribuir;
