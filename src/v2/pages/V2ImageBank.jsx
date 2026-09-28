import { useState, useEffect } from 'react';
import '../styles/v2-theme.css';

const V2ImageBank = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [selectedImage, setSelectedImage] = useState(null);

    const [data] = useState({
        images: [
            { id: '1', title: 'Radiografía Tórax - Neumonía', category: 'Radiología', url: 'https://placehold.co/400x300/0fa397/ffffff?text=Radiografia+1' },
            { id: '2', title: 'TC de Cráneo - Hemorragia', category: 'Neurología', url: 'https://placehold.co/400x300/4a6360/ffffff?text=TC+Craneo' },
            { id: '3', title: 'EKG - Infarto Miocardio', category: 'Cardiología', url: 'https://placehold.co/400x300/456179/ffffff?text=EKG+Infarto' },
            { id: '4', title: 'Dermatoscopia - Melanoma', category: 'Dermatología', url: 'https://placehold.co/400x300/ba1a1a/ffffff?text=Dermatoscopia' },
            { id: '5', title: 'Eco Abdominal - Colelitiasis', category: 'Gastroenterología', url: 'https://placehold.co/400x300/0fa397/ffffff?text=Eco+Abdominal' },
            { id: '6', title: 'RX Ósea - Fractura de Colles', category: 'Traumatología', url: 'https://placehold.co/400x300/4a6360/ffffff?text=Fractura' },
        ]
    });

    const categories = ['All', 'Radiología', 'Cardiología', 'Neurología', 'Dermatología', 'Gastroenterología'];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedImage) {
                setSelectedImage(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    const filteredImages = data.images.filter(img =>
        (category === 'All' || img.category === category) &&
        img.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="v2-image-bank-container">
            <header className='v2-mb-32'>
                <h1 className='v2-headline-medium'>Banco de Imágenes</h1>
                <p className='v2-body-large v2-opacity-70'>Recursos visuales para tu estudio clínico</p>
            </header>

            {/* Search and Filter */}
            <div className='v2-flex-col v2-gap-20 v2-mb-32'>
                <div className="v2-input-outlined">
                    <label htmlFor='img-search'>Buscar imagen</label>
                    <input
                        id='img-search'
                        type="text"
                        placeholder="Ej. Neumonía, EKG..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className='v2-flex v2-gap-8' style={{ overflowX: 'auto', paddingBottom: '8px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={category === cat ? "v2-btn-filled" : "v2-btn-tonal"}
                            onClick={() => setCategory(cat)}
                            style={{ whiteSpace: 'nowrap', padding: '8px 16px', fontSize: '14px' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Image Grid */}
            <div className='v2-grid-auto-fill v2-gap-24'>
                {filteredImages.map(img => (
                    <div key={img.id} className='v2-card v2-card-elevated v2-p-0 v2-overflow-hidden'>
                        <img
                            src={img.url}
                            alt={img.title}
                            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                        />
                        <div className='v2-p-16'>
                            <span className='v2-label-large v2-text-primary' style={{ display: 'block', marginBottom: '4px' }}>
                                {img.category}
                            </span>
                            <h3 className='v2-title-large v2-mb-12' style={{ fontSize: '18px', margin: 0 }}>{img.title}</h3>
                            <button
                                className='v2-btn-tonal v2-btn-full v2-btn-justify-center'
                                style={{ fontSize: '14px' }}
                                onClick={() => setSelectedImage(img)}
                                aria-label={`Ver detalle de ${img.title}`}
                            >
                                Ver Detalle
                                <i className="material-icons" aria-hidden="true" style={{ fontSize: '18px' }}>open_in_new</i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredImages.length === 0 && (
                <div className='v2-text-center v2-opacity-50' style={{ marginTop: '64px' }}>
                    <i className="material-icons" aria-hidden="true" style={{ fontSize: '64px' }}>search_off</i>
                    <p className="v2-body-large">No se encontraron imágenes que coincidan con tu búsqueda</p>
                </div>
            )}

            {/* Detail Modal Overlay */}
            {selectedImage && (
                <div
                    className="v2-nav-drawer-backdrop visible"
                    onClick={() => setSelectedImage(null)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        zIndex: 1200
                    }}
                >
                    <div
                        className="v2-card v2-p-24"
                        style={{
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-image-title"
                    >
                        <div className="v2-flex-justify-between v2-flex-align-center v2-mb-16">
                            <span className="v2-badge v2-badge-primary">{selectedImage.category}</span>
                            <button
                                className="v2-btn-icon"
                                onClick={() => setSelectedImage(null)}
                                aria-label="Cerrar detalle de imagen"
                                title="Cerrar [Esc]"
                            >
                                <i className="material-icons" aria-hidden="true">close</i>
                            </button>
                        </div>
                        <h2 id="modal-image-title" className="v2-headline-medium v2-mb-16">{selectedImage.title}</h2>
                        <div className="v2-card v2-p-0 v2-overflow-hidden v2-mb-16" style={{ background: 'var(--md-sys-color-surface-variant)' }}>
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.title}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block' }}
                            />
                        </div>
                        <div className="v2-flex-justify-between v2-flex-align-center">
                            <span className="v2-body-medium v2-opacity-70">Categoría: {selectedImage.category}</span>
                            <button
                                className="v2-btn-filled"
                                onClick={() => setSelectedImage(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default V2ImageBank;
