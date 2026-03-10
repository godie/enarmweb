import { useState } from 'react';
import '../styles/v2-theme.css';

const V2ImageBank = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

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

    const filteredImages = data.images.filter(img =>
        (category === 'All' || img.category === category) &&
        img.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="v2-image-bank-container">
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-medium">Banco de Imágenes</h1>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Recursos visuales para tu estudio clínico</p>
            </header>

            {/* Search and Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div className="v2-input-outlined">
                    <label>Buscar imagen</label>
                    <input
                        type="text"
                        placeholder="Ej. Neumonía, EKG..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                {filteredImages.map(img => (
                    <div key={img.id} className="v2-card v2-card-elevated" style={{ padding: '0', overflow: 'hidden' }}>
                        <img
                            src={img.url}
                            alt={img.title}
                            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '16px' }}>
                            <span className="v2-label-large" style={{ color: 'var(--md-sys-color-primary)', display: 'block', marginBottom: '4px' }}>
                                {img.category}
                            </span>
                            <h3 className="v2-title-large" style={{ fontSize: '18px', margin: '0 0 12px 0' }}>{img.title}</h3>
                            <button className="v2-btn-tonal" style={{ width: '100%', justifyContent: 'center', fontSize: '14px' }}>
                                Ver Detalle
                                <i className="material-icons" aria-hidden="true" style={{ fontSize: '18px' }}>open_in_new</i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredImages.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '64px', opacity: 0.5 }}>
                    <i className="material-icons" aria-hidden="true" style={{ fontSize: '64px' }}>search_off</i>
                    <p className="v2-body-large">No se encontraron imágenes que coincidan con tu búsqueda</p>
                </div>
            )}
        </div>
    );
};

export default V2ImageBank;
