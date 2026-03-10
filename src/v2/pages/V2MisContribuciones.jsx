
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2MisContribuciones = () => {
    const history = useHistory();
    const contributions = [
        { id: 1, title: 'Infarto Agudo al Miocardio', status: 'Approved', specialty: 'Medicina Interna', icon: 'favorite', date: '01/03/2024' },
        { id: 2, title: 'Cetoacidosis Diabética', status: 'Pending', specialty: 'Pediatría', icon: 'child_care', date: '04/03/2024' },
        { id: 3, title: 'Apendicitis Aguda', status: 'Rejected', specialty: 'Cirugía General', icon: 'precision_manufacturing', date: '28/02/2024' }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return { bg: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', label: 'Aprobado', icon: 'check_circle' };
            case 'Pending': return { bg: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)', label: 'En Revisión', icon: 'schedule' };
            case 'Rejected': return { bg: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-on-error-container)', label: 'Rechazado', icon: 'cancel' };
            default: return { bg: 'gray', color: 'white', label: 'Desconocido', icon: 'help' };
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="v2-headline-medium">Mis Contribuciones</h1>
                    <p className="v2-body-large" style={{ opacity: 0.7 }}>Tu historial académico y aportes a la comunidad.</p>
                </div>
                <button
                    className="v2-btn-filled"
                    onClick={() => history.push('/v2/contribuir')}
                >
                    Nueva Contribución
                    <i className="material-icons">add</i>
                </button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contributions.map(item => {
                    const style = getStatusStyle(item.status);
                    return (
                        <div key={item.id} className="v2-card v2-card-elevated" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div className="v2-card-tonal" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', backgroundColor: 'var(--md-sys-color-surface-variant)' }}>
                                    <i className="material-icons v2-text-primary" style={{ fontSize: '28px' }}>{item.icon}</i>
                                </div>
                                <div>
                                    <h4 className="v2-title-large" style={{ margin: 0, fontWeight: '600' }}>{item.title}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', opacity: 0.6 }}>
                                        <span className="v2-label-large">{item.specialty}</span>
                                        <span style={{ fontSize: '18px' }}>•</span>
                                        <span className="v2-label-large">{item.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="v2-card-tonal" style={{
                                backgroundColor: style.bg,
                                color: style.color,
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px', borderRadius: '12px',
                                fontWeight: '600', fontSize: '14px'
                            }}>
                                <i className="material-icons" style={{ fontSize: '18px' }}>{style.icon}</i>
                                {style.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {contributions.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '80px', opacity: 0.5 }}>
                    <i className="material-icons" style={{ fontSize: '64px', marginBottom: '16px' }}>history_edu</i>
                    <p className="v2-headline-medium">Aún no has contribuido casos clínicos.</p>
                    <p className="v2-body-large">Comparte tus conocimientos y gana reputación académica.</p>
                </div>
            )}
        </div>
    );
};

export default V2MisContribuciones;
