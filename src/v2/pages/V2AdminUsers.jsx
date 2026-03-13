import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2AdminUsers = () => {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking API call for user list
        setTimeout(() => {
            setUsers([
                { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Premium', status: 'active' },
                { id: 2, name: 'María García', email: 'maria@example.com', role: 'Free', status: 'active' },
                { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Premium', status: 'inactive' },
                { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'Admin', status: 'active' }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div className="v2-page-container">
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button className="v2-btn-tonal" onClick={() => history.push('/v2/admin')} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-small">Gestión de Usuarios</h1>
            </header>

            <div className="v2-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="highlight responsive-table" style={{ margin: 0 }}>
                    <thead style={{ backgroundColor: 'var(--md-sys-color-surface-variant)' }}>
                        <tr>
                            <th className="v2-label-medium" style={{ padding: '16px 24px' }}>Nombre</th>
                            <th className="v2-label-medium">Email</th>
                            <th className="v2-label-medium">Rol</th>
                            <th className="v2-label-medium">Estado</th>
                            <th className="v2-label-medium" style={{ textAlign: 'right', paddingRight: '24px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="center-align" style={{ padding: '40px' }}><div className="preloader-wrapper small active"><div className="spinner-layer spinner-green-only"><div className="circle-clipper left"><div className="circle"></div></div></div></div></td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="v2-body-medium" style={{ paddingLeft: '24px' }}>{user.name}</td>
                                    <td className="v2-body-medium">{user.email}</td>
                                    <td className="v2-body-medium">
                                        <span className="v2-badge" style={{ backgroundColor: user.role === 'Admin' ? 'var(--md-sys-color-error-container)' : user.role === 'Premium' ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-variant)', color: 'inherit', padding: '4px 12px', borderRadius: '16px', fontSize: '12px' }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="v2-body-medium">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.status === 'active' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)' }}></div>
                                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                        <button className="v2-btn-tonal" style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%', minWidth: '32px' }}>
                                            <i className="material-icons" style={{ fontSize: '18px' }}>edit</i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default V2AdminUsers;
