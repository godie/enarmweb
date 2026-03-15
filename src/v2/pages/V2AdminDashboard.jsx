import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserService from '../../services/UserService';
import '../styles/v2-theme.css';

const V2AdminDashboard = () => {
    const history = useHistory();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await UserService.getAdminStats();
                setStats(response.data);
            } catch (err) {
                console.error("Error fetching admin stats:", err);
                setError("Error al cargar estadísticas generales.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="v2-page-container center-align" style={{ padding: '80px' }}>
            <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-green-only">
                    <div className="circle-clipper left"><div className="circle"></div></div>
                    <div className="gap-patch"><div className="circle"></div></div>
                    <div className="circle-clipper right"><div className="circle"></div></div>
                </div>
            </div>
        </div>
    );

    if (error || !stats) return (
        <div className="v2-page-container center-align">
            <div className="v2-card" style={{ padding: '32px' }}>
                <i className="material-icons" style={{ fontSize: '48px', color: 'var(--md-sys-color-error)', marginBottom: '16px' }}>error</i>
                <h2 className="v2-title-large">Error</h2>
                <p className="v2-body-large">{error || "No se pudieron obtener los datos."}</p>
                <button className="v2-btn-primary" style={{ marginTop: '24px' }} onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        </div>
    );

    return (
        <div className="v2-page-container">
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-small">Panel de Administración</h1>
                <p className="v2-body-medium" style={{ opacity: 0.7 }}>Resumen general de la plataforma</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="v2-card">
                    <div className="v2-label-medium">Usuarios Totales</div>
                    <div className="v2-headline-medium">{stats.totalUsers || 0}</div>
                </div>
                <div className="v2-card">
                    <div className="v2-label-medium">Activos Hoy</div>
                    <div className="v2-headline-medium">{stats.activeUsersToday || 0}</div>
                </div>
                <div className="v2-card">
                    <div className="v2-label-medium">Nuevas Suscripciones</div>
                    <div className="v2-headline-medium">+{stats.newSubscriptions || 0}</div>
                </div>
                <div className="v2-card">
                    <div className="v2-label-medium">Ingresos Hoy</div>
                    <div className="v2-headline-medium" style={{ color: 'var(--md-sys-color-primary)' }}>{stats.revenueToday || '$0.00'}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                <section className="v2-card">
                    <h2 className="v2-title-large" style={{ marginBottom: '24px' }}>Acciones Rápidas</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button className="v2-btn-tonal" style={{ justifyContent: 'flex-start' }} onClick={() => history.push('/v2/admin/usuarios')}>
                            <i className="material-icons" style={{ marginRight: '12px' }}>people</i>
                            Gestionar Usuarios
                        </button>
                        <button className="v2-btn-tonal" style={{ justifyContent: 'flex-start' }}>
                            <i className="material-icons" style={{ marginRight: '12px' }}>description</i>
                            Logs de Actividad
                        </button>
                        <button className="v2-btn-tonal" style={{ justifyContent: 'flex-start' }}>
                            <i className="material-icons" style={{ marginRight: '12px' }}>settings</i>
                            Configuración de Límites
                        </button>
                    </div>
                </section>

                <section className="v2-card">
                    <h2 className="v2-title-large" style={{ marginBottom: '24px' }}>Estado de Servicios</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span className="v2-body-medium">API Backend</span>
                            <span style={{ color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center' }}>
                                <i className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>check_circle</i> Online
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span className="v2-body-medium">IA Service</span>
                            <span style={{ color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center' }}>
                                <i className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>check_circle</i> Online
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span className="v2-body-medium">Stripe Integration</span>
                            <span style={{ color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center' }}>
                                <i className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>check_circle</i> Online
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default V2AdminDashboard;
