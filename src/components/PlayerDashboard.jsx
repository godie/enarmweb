import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    CustomRow,
    CustomCol,
    CustomButton,
    CustomPreloader,
    StatCard,
    CustomCard
} from './custom';
import ExamService from '../services/ExamService';
import UserService from '../services/UserService';
import Auth from '../modules/Auth';

const PlayerDashboard = () => {
    const history = useHistory();
    const [stats, setStats] = useState({
        completedCases: 0,
        accuracy: 0,
        streak: 0,
        recentAchievements: []
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = Auth.getUserInfo();
    const userId = user?.id;
    const specialties = user?.preferences?.specialties;

    useEffect(() => {
        // Redirigir a onboarding si no hay especialidades seleccionadas
        if (!specialties || specialties.length === 0) {
            history.push('/onboarding');
            return;
        }

        const fetchData = async () => {
            try {
                // En un futuro estos datos vendrían de un endpoint de stats
                // Por ahora simulamos o traemos lo disponible
                const [catRes, achRes] = await Promise.all([
                    ExamService.loadCategories(),
                    UserService.getAchievements(userId)
                ]);

                setCategories(catRes.data);
                setStats(prev => ({
                    ...prev,
                    recentAchievements: achRes.data.slice(0, 3),
                    completedCases: 12, // Mock
                    accuracy: 75, // Mock
                    streak: 3 // Mock
                }));
                setLoading(false);
            } catch (error) {
                console.error("Error loading dashboard data", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [history, specialties, userId]);

    if (loading) {
        return (
            <div className="center-align" style={{ padding: '100px' }}>
                <CustomPreloader active color="green" size="big" />
            </div>
        );
    }

    return (
        <div className="player-dashboard">
            {/* Hero Section */}
            <div className="hero-section" style={{ padding: '40px 0', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
                <CustomRow className="valign-wrapper">
                    <CustomCol s={12} m={8}>
                        <h3 className="grey-text text-darken-3" style={{ fontWeight: '300', margin: 0 }}>
                            ¡Hola, <span style={{ fontWeight: '600', color: 'var(--medical-green)' }}>{user?.name || 'Doctor'}</span>!
                        </h3>
                        <p className="grey-text text-darken-1" style={{ fontSize: '1.2rem' }}>
                            Tu camino al ENARM continúa hoy. ¿Qué quieres repasar?
                        </p>
                    </CustomCol>
                    <CustomCol s={12} m={4} className="right-align hide-on-small-only">
                        <CustomButton
                            large
                            className="green pulse"
                            onClick={() => history.push('/caso/random')}
                        >
                            Entrenamiento Rápido
                        </CustomButton>
                    </CustomCol>
                </CustomRow>
            </div>

            {/* Stats Row */}
            <CustomRow>
                <CustomCol s={12} m={4}>
                    <StatCard title="Casos Resueltos" count={stats.completedCases} icon="assignment_turned_in" />
                </CustomCol>
                <CustomCol s={12} m={4}>
                    <StatCard title="Precisión" count={`${stats.accuracy}%`} icon="track_changes" />
                </CustomCol>
                <CustomCol s={12} m={4}>
                    <StatCard title="Días Seguidos" count={stats.streak} icon="local_fire_department" />
                </CustomCol>
            </CustomRow>

            <CustomRow>
                {/* Main Study Area */}
                <CustomCol s={12} l={8}>
                    <CustomCard title="Explorar por Especialidad" className="white z-depth-1">
                        <div className="specialties-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', marginTop: '10px' }}>
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    className="specialty-item center-align hoverable"
                                    onClick={() => history.push(`/especialidad/${cat.id}`)}
                                    style={{
                                        padding: '20px',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="material-icons green-text text-lighten-2" style={{ fontSize: '2.5rem' }}>medical_services</i>
                                    <p className="grey-text text-darken-2" style={{ fontWeight: '500', margin: '10px 0 0' }}>{cat.name}</p>
                                </div>
                            ))}
                        </div>
                    </CustomCard>
                </CustomCol>

                {/* Achievements & Activity */}
                <CustomCol s={12} l={4}>
                    <CustomCard title="Logros Recientes" className="white z-depth-1">
                        {stats.recentAchievements.length > 0 ? (
                            <ul className="collection" style={{ border: 'none' }}>
                                {stats.recentAchievements.map(ach => (
                                    <li key={ach.id} className="collection-item avatar" style={{ border: 'none', paddingLeft: '60px' }}>
                                        <i className="material-icons circle green">emoji_events</i>
                                        <span className="title" style={{ fontWeight: '500' }}>{ach.name}</span>
                                        <p className="grey-text truncate">{ach.description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="center-align grey-text" style={{ padding: '20px' }}>
                                <i className="material-icons" style={{ fontSize: '3rem', opacity: 0.2 }}>lock</i>
                                <p>Sigue practicando para desbloquear logros.</p>
                            </div>
                        )}
                        <div className="center-align" style={{ marginTop: '10px' }}>
                            <CustomButton flat className="green-text" onClick={() => history.push('/profile')}>
                                Ver todos mis logros
                            </CustomButton>
                        </div>
                    </CustomCard>
                </CustomCol>
            </CustomRow>
        </div>
    );
};

export default PlayerDashboard;
