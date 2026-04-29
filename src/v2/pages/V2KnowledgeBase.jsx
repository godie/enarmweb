import { useState, useEffect } from 'react';
import { alertSuccess } from '../../services/AlertService';
import KnowledgeBaseService from '../../services/KnowledgeBaseService';
import '../styles/v2-theme.css';

const V2KnowledgeBase = () => {
    const [search, setSearch] = useState('');
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTopics();
    }, []);

    const loadTopics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await KnowledgeBaseService.getTopics();
            setTopics(response.data.topics || []);
        } catch (err) {
            console.error('Error loading knowledge base:', err);
            setError('Error al cargar la base de conocimientos');
            setTopics([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTopics = topics.filter(topic =>
        topic.title.toLowerCase().includes(search.toLowerCase()) ||
        topic.articles?.some(article => 
            article.title.toLowerCase().includes(search.toLowerCase())
        )
    );

    const handleArticleClick = (articleTitle) => {
        alertSuccess('Próximamente', `${articleTitle} estará disponible pronto.`);
    };

    if (loading) {
        return (
            <div className='v2-page-medium v2-text-center'>
                <div className='v2-mb-24'>
                    <i className="material-icons v2-text-primary" style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }}>sync</i>
                </div>
                <p className='v2-body-large v2-opacity-60'>Cargando base de conocimientos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='v2-page-medium v2-text-center'>
                <div className='v2-mb-24'>
                    <i className="material-icons v2-text-error" style={{ fontSize: '48px' }}>error_outline</i>
                </div>
                <p className='v2-body-large v2-opacity-60'>{error}</p>
                <button 
                    className='v2-button-primary v2-mt-16'
                    onClick={loadTopics}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className='v2-page-medium'>
            <header className='v2-mb-32'>
                <h1 className='v2-headline-medium'>Base de Conocimientos</h1>
                <p className='v2-body-large v2-opacity-70'>Consulta guías, esquemas y algoritmos actualizados</p>
            </header>

            {/* Search */}
            <div className='v2-input-outlined v2-mb-32'>
                <label htmlFor='kb-search'>Buscar tema o guía</label>
                <input
                    id='kb-search'
                    type="text"
                    placeholder="Ej. Diabetes, GPC, Vacunas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Topics List */}
            <div className='v2-flex-col v2-gap-16'>
                {filteredTopics.map(topic => (
                    <section key={topic.id} className='v2-card v2-p-0 v2-overflow-hidden'>
                        <div
                            className='v2-p-24 v2-cursor-pointer v2-flex-justify-between v2-flex-align-center'
                            onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                            role='button'
                            tabIndex={0}
                            aria-expanded={expandedTopic === topic.id}
                            aria-label={topic.title}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedTopic(expandedTopic === topic.id ? null : topic.id); } }}
                        >
                            <div className='v2-flex-1'>
                                <h3 className='v2-title-large v2-m-0 v2-mb-4'>{topic.title}</h3>
                                <p className='v2-body-medium v2-opacity-60 v2-m-0'>
                                    {topic.articles?.length || 0} artículo{topic.articles?.length !== 1 ? 's' : ''} disponible{topic.articles?.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <i className="material-icons" aria-hidden="true" style={{ transition: 'transform 0.3s', transform: expandedTopic === topic.id ? 'rotate(180deg)' : 'none' }}>
                                expand_more
                            </i>
                        </div>

                        {expandedTopic === topic.id && (
                            <div style={{ padding: '0 24px 24px 24px' }} className='v2-flex-col v2-gap-8'>
                                {topic.articles?.length > 0 ? (
                                    topic.articles.map(article => (
                                        <div
                                            key={article.id}
                                            className="v2-card-tonal v2-cursor-pointer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '12px 16px',
                                                borderRadius: '12px'
                                            }}
                                            role='button'
                                            tabIndex={0}
                                            aria-label={`${article.title} — próximamente`}
                                            onClick={() => handleArticleClick(article.title)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleArticleClick(article.title); } }}
                                        >
                                            <span className="v2-body-large" style={{ fontSize: '15px' }}>{article.title}</span>
                                            <i className="material-icons v2-text-primary" style={{ fontSize: '20px' }}>download</i>
                                        </div>
                                    ))
                                ) : (
                                    <p className='v2-body-medium v2-opacity-60 v2-text-center v2-p-16'>
                                        No hay artículos disponibles en este tema
                                    </p>
                                )}
                            </div>
                        )}
                    </section>
                ))}
            </div>

            {filteredTopics.length === 0 && (
                <div className='v2-text-center v2-opacity-50' style={{ marginTop: '64px' }}>
                    <i className="material-icons" aria-hidden="true" style={{ fontSize: '64px' }}>find_in_page</i>
                    <p className="v2-body-large">No se encontraron temas que coincidan con tu búsqueda</p>
                </div>
            )}
        </div>
    );
};

export default V2KnowledgeBase;
