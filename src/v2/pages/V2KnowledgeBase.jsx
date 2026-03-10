import { useState } from 'react';
import '../styles/v2-theme.css';

const V2KnowledgeBase = () => {
    const [search, setSearch] = useState('');
    const [expandedCategory, setExpandedCategory] = useState(null);

    const [data] = useState({
        categories: [
            {
                id: '1',
                title: 'Guías de Práctica Clínica',
                description: 'Repositorio oficial de GPCs vigentes en México',
                topics: [
                    { id: 't1', title: 'GPC Hipertensión Arterial Sistémica' },
                    { id: 't2', title: 'GPC Diabetes Mellitus Tipo 2' },
                    { id: 't3', title: 'GPC Insuficiencia Cardiaca' }
                ]
            },
            {
                id: '2',
                title: 'Esquemas de Vacunación',
                description: 'Actualización 2024 de cartillas nacionales de salud',
                topics: [
                    { id: 't4', title: 'Esquema Infantil (0-9 años)' },
                    { id: 't5', title: 'Esquema Adolescente (10-19 años)' },
                    { id: 't6', title: 'Esquema Adulto Mayor' }
                ]
            },
            {
                id: '3',
                title: 'Algoritmos Diagnósticos',
                description: 'Diagramas de flujo para toma de decisiones clínicas',
                topics: [
                    { id: 't7', title: 'Algoritmo Sepsis y Choque Séptico' },
                    { id: 't8', title: 'Algoritmo Manejo de Asma Aguda' },
                    { id: 't9', title: 'Algoritmo Código Infarto' }
                ]
            }
        ]
    });

    const filteredCategories = data.categories.map(cat => ({
        ...cat,
        topics: cat.topics.filter(topic =>
            topic.title.toLowerCase().includes(search.toLowerCase()) ||
            cat.title.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(cat => cat.topics.length > 0);

    return (
        <div className="v2-knowledge-base-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-medium">Base de Conocimientos</h1>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Consulta guías, esquemas y algoritmos actualizados</p>
            </header>

            {/* Search */}
            <div className="v2-input-outlined" style={{ marginBottom: '32px' }}>
                <label>Buscar tema o guía</label>
                <input
                    type="text"
                    placeholder="Ej. Diabetes, GPC, Vacunas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Categories List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredCategories.map(cat => (
                    <section key={cat.id} className="v2-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div
                            style={{ padding: '24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                        >
                            <div style={{ flex: 1 }}>
                                <h3 className="v2-title-large" style={{ margin: '0 0 4px 0' }}>{cat.title}</h3>
                                <p className="v2-body-large" style={{ margin: 0, opacity: 0.6, fontSize: '14px' }}>{cat.description}</p>
                            </div>
                            <i className="material-icons" aria-hidden="true" style={{ transition: 'transform 0.3s', transform: expandedCategory === cat.id ? 'rotate(180deg)' : 'none' }}>
                                expand_more
                            </i>
                        </div>

                        {expandedCategory === cat.id && (
                            <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {cat.topics.map(topic => (
                                    <div
                                        key={topic.id}
                                        className="v2-card-tonal"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <span className="v2-body-large" style={{ fontSize: '15px' }}>{topic.title}</span>
                                        <i className="material-icons v2-text-primary" style={{ fontSize: '20px' }}>download</i>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>

            {filteredCategories.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '64px', opacity: 0.5 }}>
                    <i className="material-icons" aria-hidden="true" style={{ fontSize: '64px' }}>find_in_page</i>
                    <p className="v2-body-large">No se encontraron temas que coincidan con tu búsqueda</p>
                </div>
            )}
        </div>
    );
};

export default V2KnowledgeBase;
