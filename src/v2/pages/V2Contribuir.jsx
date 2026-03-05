import React, { useState } from 'react';

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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-medium">Contribuir Caso</h1>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Ayuda a la comunidad compartiendo casos clínicos de calidad.</p>
            </header>

            <section className="v2-card">
                <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Caso Clínico</h3>
                <textarea
                    className="v2-card-tonal"
                    style={{ width: '100%', minHeight: '150px', padding: '16px', border: 'none', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
                    placeholder="Describe el escenario clínico..."
                    value={form.caso}
                    onChange={(e) => handleChange('caso', e.target.value)}
                />
            </section>

            <section className="v2-card" style={{ marginTop: '24px' }}>
                <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>La Pregunta</h3>
                <input
                    className="v2-card-tonal"
                    style={{ width: '100%', padding: '16px', border: 'none', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
                    placeholder="¿Cuál es el siguiente paso?"
                    value={form.pregunta}
                    onChange={(e) => handleChange('pregunta', e.target.value)}
                />
            </section>

            <section className="v2-card" style={{ marginTop: '24px' }}>
                <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Respuestas</h3>
                {form.opciones.map((op, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <input
                            type="radio"
                            checked={form.correcta === idx}
                            onChange={() => handleChange('correcta', idx)}
                            style={{ width: '24px', height: '24px' }}
                        />
                        <input
                            className="v2-card-tonal"
                            style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', outline: 'none' }}
                            placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                            value={op}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                        />
                    </div>
                ))}
            </section>

            <section className="v2-card" style={{ marginTop: '24px' }}>
                <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Perla Médica (Retroalimentación)</h3>
                <textarea
                    className="v2-card-tonal"
                    style={{ width: '100%', minHeight: '100px', padding: '16px', border: 'none', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
                    placeholder="Explica la respuesta correcta..."
                    value={form.perla}
                    onChange={(e) => handleChange('perla', e.target.value)}
                />
            </section>

            <div style={{ marginTop: '32px', textAlign: 'right' }}>
                <button className="v2-fab v2-bg-primary" style={{ width: 'auto', padding: '0 48px', height: '56px', borderRadius: '16px' }}>
                    Enviar para Revisión <i className="material-icons" style={{ marginLeft: '8px' }}>send</i>
                </button>
            </div>
        </div>
    );
};

export default V2Contribuir;
