import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserService from '../../services/UserService';
import '../styles/v2-theme.css';

const V2AdminUsers = () => {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await UserService.getUsers();
                // Ensure response data format is handled correctly (array or nested object)
                setUsers(Array.isArray(response.data) ? response.data : (response.data.users || []));
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("No se pudo cargar la lista de usuarios.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="v2-page-container">
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button className="v2-btn-tonal" onClick={() => history.push('/v2/admin')} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-small">Gestión de Usuarios</h1>
            </header>

            {error && (
                <div className="v2-card" style={{ marginBottom: '24px', backgroundColor: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-on-error-container)' }}>
                    <p className="v2-body-medium">{error}</p>
                </div>
            )}

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
                            <tr>
                                <td colSpan="5" className="center-align" style={{ padding: '40px' }}>
                                    <div className="preloader-wrapper small active">
                                        <div className="spinner-layer spinner-green-only">
                                            <div className="circle-clipper left"><div className="circle"></div></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="center-align" style={{ padding: '40px' }}>
                                    <p className="v2-body-medium" style={{ opacity: 0.7 }}>No hay usuarios registrados.</p>
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="v2-body-medium" style={{ paddingLeft: '24px' }}>{user.name || (user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Sin nombre')}</td>
                                    <td className="v2-body-medium">{user.email}</td>
                                    <td className="v2-body-medium">
                                        <span className="v2-badge" style={{
                                            backgroundColor: (user.role === 'Admin' || user.role === 'admin') ? 'var(--md-sys-color-error-container)' : (user.role === 'Premium' || user.role === 'premium') ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-variant)',
                                            color: 'inherit',
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="v2-body-medium">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: (user.status === 'active' || user.active) ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)' }}></div>
                                            {(user.status === 'active' || user.active) ? 'Activo' : 'Inactivo'}
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
