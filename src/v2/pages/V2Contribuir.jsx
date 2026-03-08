import { useState } from 'react';
import '../styles/v2-theme.css';

const V2Contribuir = () => {
    const [form, setForm] = useState({
        caso: '',
        pregunta: '',
        opciones: ['', '', '', ''],
        correcta: 0,
        perla: ''
    });

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
    const handleOptionChange = (idx, value) => {
        const newOps = [...form.opciones];
        newOps[idx] = value;
        setForm(prev => ({ ...prev, opciones: newOps }));
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-medium">Contribuir Caso Clínico</h1>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Tu aporte mejora la preparación de miles de colegas aspirantes.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>
                            <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>description</i>
                            Escenario Clínico
                        </h3>
                        <div className="v2-input-outlined" style={{ marginTop: '0' }}>
                            <label>Descripción detallada</label>
                            <textarea
                                style={{ minHeight: '180px' }}
                                placeholder="Paciente masculino de 45 años..."
                                value={form.caso}
                                onChange={(e) => handleChange('caso', e.target.value)}
                            />
                        </div>
                    </section>

                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>
                            <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>quiz</i>
                            La Pregunta
                        </h3>
                        <div className="v2-input-outlined" style={{ marginTop: '0' }}>
                            <label>Pregunta diagnóstica/terapéutica</label>
                            <input
                                placeholder="¿Cuál es el siguiente paso?"
                                value={form.pregunta}
                                onChange={(e) => handleChange('pregunta', e.target.value)}
                            />
                        </div>
                    </section>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>
                            <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>list</i>
                            Opciones de Respuesta
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {form.opciones.map((op, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input
                                        type="radio"
                                        checked={form.correcta === idx}
                                        onChange={() => handleChange('correcta', idx)}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--md-sys-color-primary)' }}
                                    />
                                    <div className="v2-input-outlined" style={{ flex: 1, marginTop: '0' }}>
                                        <input
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
                        <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>
                            <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>lightbulb</i>
                            Perla Médica
                        </h3>
                        <div className="v2-input-outlined" style={{ marginTop: '0' }}>
                            <label>Justificación académica</label>
                            <textarea
                                style={{ minHeight: '100px' }}
                                placeholder="Explica por qué la respuesta es correcta..."
                                value={form.perla}
                                onChange={(e) => handleChange('perla', e.target.value)}
                            />
                        </div>
                    </section>

                    <button className="v2-btn-filled" style={{ height: '56px', width: '100%', justifyContent: 'center' }}>
                        Enviar para Revisión
                        <i className="material-icons">send</i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default V2Contribuir;
