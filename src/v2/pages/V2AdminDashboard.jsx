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
        <div className="v2-center-state v2-min-h-60vh" role="status" aria-live="polite" aria-label="Cargando estadísticas">
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
        <div className="v2-center-state v2-min-h-60vh" role="alert" aria-live="assertive">
            <div className="v2-card v2-text-center v2-p-32">
                <i className="material-icons v2-error-icon v2-mb-16">error</i>
                <h2 className="v2-title-large">Error</h2>
                <p className="v2-body-large">{error || "No se pudieron obtener los datos."}</p>
                <button className="v2-btn-primary v2-mt-24" onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        </div>
    );

    return (
        <div className="v2-page-container">
            <header className="v2-mb-32">
                <h1 className="v2-headline-small">Panel de Administración</h1>
                <p className="v2-body-medium v2-opacity-70">Resumen general de la plataforma</p>
            </header>

            <div className="v2-grid-auto-fill-sm v2-gap-24 v2-mb-40">
                <div className="v2-card v2-text-center">
                    <div className="v2-label-medium">Usuarios Totales</div>
                    <div className="v2-headline-medium v2-mt-8">{stats.totalUsers || 0}</div>
                </div>
                <div className="v2-card v2-text-center">
                    <div className="v2-label-medium">Activos Hoy</div>
                    <div className="v2-headline-medium v2-mt-8">{stats.activeUsersToday || 0}</div>
                </div>
                <div className="v2-card v2-text-center">
                    <div className="v2-label-medium">Nuevas Suscripciones</div>
                    <div className="v2-headline-medium v2-mt-8">+{stats.newSubscriptions || 0}</div>
                </div>
                <div className="v2-card v2-text-center">
                    <div className="v2-label-medium">Ingresos Hoy</div>
                    <div className="v2-headline-medium v2-mt-8 v2-text-primary">{stats.revenueToday || '$0.00'}</div>
                </div>
            </div>

            <div className="v2-grid-auto-fit v2-gap-32">
                <section className="v2-card">
                    <h2 className="v2-title-large v2-mb-24">Acciones Rápidas</h2>
                    <div className="v2-flex-col v2-gap-12">
                        <button className="v2-btn-tonal v2-btn-justify-start" onClick={() => history.push('/admin/usuarios')}>
                            <i className="material-icons" style={{ marginRight: '12px' }}>people</i>
                            Gestionar Usuarios
                        </button>
                        <button className="v2-btn-tonal v2-btn-justify-start">
                            <i className="material-icons" style={{ marginRight: '12px' }}>description</i>
                            Logs de Actividad
                        </button>
                        <button className="v2-btn-tonal v2-btn-justify-start">
                            <i className="material-icons" style={{ marginRight: '12px' }}>settings</i>
                            Configuración de Límites
                        </button>
                    </div>
                </section>

                <section className="v2-card">
                    <h2 className="v2-title-large v2-mb-24">Estado de Servicios</h2>
                    <div className="v2-flex-col v2-gap-16">
                        <div className="v2-flex-justify-between v2-flex-align-center">
                            <span className="v2-body-medium">API Backend</span>
                            <span className="v2-text-primary v2-flex-align-center v2-gap-4">
                                <i className="material-icons" style={{ fontSize: '16px' }}>check_circle</i> Online
                            </span>
                        </div>
                        <div className="v2-flex-justify-between v2-flex-align-center">
                            <span className="v2-body-medium">IA Service</span>
                            <span className="v2-text-primary v2-flex-align-center v2-gap-4">
                                <i className="material-icons" style={{ fontSize: '16px' }}>check_circle</i> Online
                            </span>
                        </div>
                        <div className="v2-flex-justify-between v2-flex-align-center">
                            <span className="v2-body-medium">Stripe Integration</span>
                            <span className="v2-text-primary v2-flex-align-center v2-gap-4">
                                <i className="material-icons" style={{ fontSize: '16px' }}>check_circle</i> Online
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default V2AdminDashboard;
