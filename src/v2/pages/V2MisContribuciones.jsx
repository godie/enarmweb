const V2MisContribuciones = () => {
    const contributions = [
        { id: 1, title: 'Infarto Agudo al Miocardio', status: 'Approved', specialty: 'Medicina Interna', icon: 'favorite' },
        { id: 2, title: 'Cetoacidosis Diabética', status: 'Pending', specialty: 'Pediatría', icon: 'child_care' },
        { id: 3, title: 'Apendicitis Aguda', status: 'Rejected', specialty: 'Cirugía General', icon: 'precision_manufacturing' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'var(--md-sys-color-primary)';
            case 'Pending': return '#f39c12';
            case 'Rejected': return 'var(--md-sys-color-error)';
            default: return 'gray';
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-medium">Mis Contribuciones</h1>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contributions.map(item => (
                    <div key={item.id} className="v2-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="v2-card-tonal" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                                <i className="material-icons v2-text-primary">{item.icon}</i>
                            </div>
                            <div>
                                <h4 className="v2-title-large" style={{ margin: 0 }}>{item.title}</h4>
                                <span className="v2-body-large" style={{ opacity: 0.6 }}>{item.specialty}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: getStatusColor(item.status), fontWeight: 'bold' }}>
                            <i className="material-icons" style={{ fontSize: '18px' }}>
                                {item.status === 'Approved' ? 'check_circle' : item.status === 'Pending' ? 'schedule' : 'cancel'}
                            </i>
                            {item.status}
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="v2-fab v2-bg-primary"
                style={{ position: 'fixed', bottom: '32px', right: '32px' }}
                onClick={() => window.location.hash = '/v2/contribuir'}
            >
                <i className="material-icons">add</i>
            </button>
        </div>
    );
};

export default V2MisContribuciones;
