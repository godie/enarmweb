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
        <div className="v2-page-container" aria-live="polite" aria-busy={loading}>
            <header className='v2-page-header-back'>
                <button className="v2-btn-icon" onClick={() => history.push('/admin')} aria-label='Volver al panel'>
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-small">Gestión de Usuarios</h1>
            </header>

            {error && (
                <div className="v2-card v2-bg-error-container v2-mb-24" role="alert">
                    <p className="v2-body-medium">{error}</p>
                </div>
            )}

            <div className="v2-card v2-p-0 v2-overflow-hidden">
                <table className="highlight responsive-table v2-table">
                    <thead className="v2-bg-surface-variant">
                        <tr>
                            <th className="v2-label-medium v2-px-24 v2-py-16">Nombre</th>
                            <th className="v2-label-medium">Email</th>
                            <th className="v2-label-medium">Rol</th>
                            <th className="v2-label-medium">Estado</th>
                            <th className="v2-label-medium v2-text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="v2-text-center v2-p-40">
                                    <div className="preloader-wrapper small active">
                                        <div className="spinner-layer spinner-green-only">
                                            <div className="circle-clipper left"><div className="circle"></div></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="v2-text-center v2-p-40">
                                    <p className="v2-body-medium v2-opacity-70">No hay usuarios registrados.</p>
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="v2-body-medium v2-px-24">{user.name || (user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Sin nombre')}</td>
                                    <td className="v2-body-medium">{user.email}</td>
                                    <td className="v2-body-medium">
                                        <span className={`v2-badge ${(user.role === 'Admin' || user.role === 'admin') ? 'v2-badge-error' : (user.role === 'Premium' || user.role === 'premium') ? 'v2-badge-primary' : ''}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="v2-body-medium">
                                        <div className="v2-flex-align-center v2-gap-8">
                                            <div className={`v2-status-dot ${(user.status === 'active' || user.active) ? 'v2-status-dot-active' : 'v2-status-dot-inactive'}`}></div>
                                            {(user.status === 'active' || user.active) ? 'Activo' : 'Inactivo'}
                                        </div>
                                    </td>
                                    <td className="v2-text-right v2-px-24">
                                        <button className="v2-btn-icon-lg" aria-label='Editar usuario'>
                                            <i className="material-icons">edit</i>
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
