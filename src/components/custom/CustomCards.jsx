const StatCard = ({ title, count, icon }) => (
    <div className="card-panel white" style={{ borderLeft: '4px solid var(--medical-green)', borderRadius: '8px' }}>
        <div className="valign-wrapper" style={{ justifyContent: 'space-between' }}>
            <div>
                <span className="grey-text text-darken-1" style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{title}</span>
                <h4 className="green-text text-darken-2" style={{ margin: '5px 0' }}>{count}</h4>
            </div>
            <i className="material-icons grey-text text-lighten-2" style={{ fontSize: '2.5rem' }}>{icon}</i>
        </div>
    </div>
);

const CustomCard = ({ title, children, className = "", actions }) => (
    <div className={`card ${className}`}>
        <div className="card-content">
            {title && <span className="card-title">{title}</span>}
            {children}
        </div>
        {actions && <div className="card-action">{actions}</div>}
    </div>
);

export { StatCard, CustomCard };