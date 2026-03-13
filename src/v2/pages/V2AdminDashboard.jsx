import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2AdminDashboard = () => {
    const history = useHistory();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking API call for admin stats
        setTimeout(() => {
            setStats({
                totalUsers: 15420,
                activeUsersToday: 1205,
                newSubscriptions: 45,
                revenueToday: ',250.00'
            });
            setLoading(false);
        }, 800);
    }, []);

    if (loading) return <div className="center-align" style={{ padding: '40px' }}><div className="preloader-wrapper big active"><div className="spinner-layer spinner-green-only"><div className="circle-clipper left"><div className="circle"></div></div><div className="gap-patch"><div className="circle"></div></div><div className="circle-clipper right"><div className="circle"></div></div></div></div></div>;

    return (
        <div className="v2-page-container">
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-small">Panel de Administración</h1>
                <p className="v2-body-medium" style={{ opacity: 0.7 }}>Resumen general de la plataforma</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div className="v2-card">
                    <div className="v2-label-medium">Usuarios Totales</div>
                    <div className="v2-headline-medium">{stats.totalUsers}</div>
                </div>
                <div className="v2-card">
                    <div className="v2-label-medium">Activos Hoy</div>
                    <div className="v2-headline-medium">{stats.activeUsersToday}</div>
                </div>
                <div className="v2-card">
                    <div className="v2-label-medium">Nuevas Suscripciones</div>
                    <div className="v2-headline-medium">+{stats.newSubscriptions}</div>
                </div>
                <div className="v2-card">
                    <div className="v2-label-medium">Ingresos Hoy</div>
                    <div className="v2-headline-medium" style={{ color: 'var(--md-sys-color-primary)' }}>{stats.revenueToday}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
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
