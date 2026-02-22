const StatCard = ({ title, count, icon, color = 'green' }) => (
    <div className="card-panel" style={{ borderLeft: `4px solid ${color === 'green' ? 'var(--medical-green)' : color}`, borderRadius: '8px' }}>
        <div className="valign-wrapper" style={{ justifyContent: 'space-between' }}>
            <div>
                <span className="grey-text text-darken-1" style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{title}</span>
                <h4 className={`${color}-text text-darken-2`} style={{ margin: '5px 0' }}>{count}</h4>
            </div>
            <i className="material-icons grey-text text-lighten-2" style={{ fontSize: '2.5rem' }} aria-hidden="true">{icon}</i>
        </div>
    </div>
);

const CustomCard = ({ title, children, className = "", actions, icon }) => (
    <div className={`card ${className}`}>
        <div className="card-content">
            {title && (
                <span className="card-title valign-wrapper">
                    {icon && <i className="material-icons left" aria-hidden="true">{icon}</i>}
                    {title}
                </span>
            )}
            {children}
        </div>
        {actions && <div className="card-action">{actions}</div>}
    </div>
);

export { StatCard, CustomCard };