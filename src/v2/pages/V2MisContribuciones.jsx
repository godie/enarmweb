
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
            case 'Approved': return { badgeClass: 'v2-badge v2-badge-primary', label: 'Aprobado', icon: 'check_circle' };
            case 'Pending': return { badgeClass: 'v2-badge v2-badge-secondary', label: 'En Revisión', icon: 'schedule' };
            case 'Rejected': return { badgeClass: 'v2-badge v2-badge-error', label: 'Rechazado', icon: 'cancel' };
            default: return { badgeClass: 'v2-badge v2-bg-surface-variant', label: 'Desconocido', icon: 'help' };
        }
    };

    return (
        <div className='v2-page-container'>
            <header className='v2-page-header-row v2-mb-40'>
                <div>
                    <h1 className="v2-headline-medium">Mis Contribuciones</h1>
                    <p className='v2-body-large v2-opacity-70'>Tu historial académico y aportes a la comunidad.</p>
                </div>
                <button
                    className="v2-btn-filled"
                    onClick={() => history.push('/contribuir')}
                    aria-label="Crear nueva contribución de caso clínico"
                >
                    Nueva Contribución
                    <i className="material-icons" aria-hidden="true">add</i>
                </button>
            </header>

            <div className='v2-flex-col v2-gap-16'>
                {contributions.map(item => {
                    const style = getStatusStyle(item.status);
                    const handleKeyDown = (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            history.push(`/contribuir?id=${item.id}`);
                        }
                    };
                    const handleClick = () => {
                        history.push(`/contribuir?id=${item.id}`);
                    };
                    return (
                        <article
                            key={item.id}
                            tabIndex={0}
                            role="button"
                            aria-label={`Ver detalles de contribución: ${item.title}, estado: ${style.label}`}
                            onClick={handleClick}
                            onKeyDown={handleKeyDown}
                            className='v2-card v2-card-outlined v2-selectable-card v2-flex-justify-between v2-flex-align-center'
                            style={{ padding: '20px 32px' }}
                        >
                            <div className='v2-flex-align-center' style={{ gap: '20px' }}>
                                <div className='v2-icon-box-lg v2-icon-box-surface'>
                                    <i className="material-icons v2-text-primary" style={{ fontSize: '28px' }} aria-hidden="true">{item.icon}</i>
                                </div>
                                <div>
                                    <h3 className='v2-title-large v2-m-0 v2-text-semibold'>{item.title}</h3>
                                    <div className='v2-flex-align-center v2-gap-12 v2-mt-4 v2-opacity-60'>
                                        <span className="v2-label-large">{item.specialty}</span>
                                        <span style={{ fontSize: '18px' }} aria-hidden="true">•</span>
                                        <span className="v2-label-large">{item.date}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={style.badgeClass}>
                                <i className="material-icons" style={{ fontSize: '18px' }} aria-hidden="true">{style.icon}</i>
                                {style.label}
                            </span>
                        </article>
                    );
                })}
            </div>

            {contributions.length === 0 && (
                <div className='v2-text-center v2-mt-48 v2-opacity-50'>
                    <i className="material-icons" style={{ fontSize: '64px', marginBottom: '16px' }} aria-hidden="true">history_edu</i>
                    <p className="v2-headline-medium">Aún no has contribuido casos clínicos.</p>
                    <p className="v2-body-large">Comparte tus conocimientos y gana reputación académica.</p>
                </div>
            )}
        </div>
    );
};

export default V2MisContribuciones;
