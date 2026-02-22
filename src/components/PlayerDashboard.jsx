import { useState, useEffect, useMemo } from 'react';
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
import styles from './PlayerDashboard.module.css';

const PlayerDashboard = () => {
    const history = useHistory();
    const [state, setState] = useState({
        stats: {
            completedCases: 0,
            accuracy: 0,
            streak: 0,
            recentAchievements: []
        },
        categories: [],
        loading: true
    });
    const [focusedId, setFocusedId] = useState(null);
    const { stats, categories, loading } = state;

    // Memoize user info to avoid infinite loops in useEffect
    const user = useMemo(() => Auth.getUserInfo(), []);
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

                setState({
                    categories: catRes.data,
                    stats: {
                        recentAchievements: achRes.data.slice(0, 3),
                        completedCases: 12, // Mock
                        accuracy: 75, // Mock
                        streak: 3 // Mock
                    },
                    loading: false
                });
            } catch (error) {
                console.error("Error loading dashboard data", error);
                setState(prev => ({ ...prev, loading: false }));
            }
        };
        fetchData();
    }, [history, specialties, userId]);

    if (loading) {
        return (
            <div className="center-align enarm-loading-wrapper">
                <CustomPreloader active color="green" size="big" />
            </div>
        );
    }

    return (
        <div className="player-dashboard">
            {/* Hero Section */}
            <div className="hero-section enarm-hero-section">
                <CustomRow className="valign-wrapper">
                    <CustomCol s={12} m={8}>
                        <h3 className="grey-text text-darken-3 enarm-heading-light">
                            ¡Hola, <span className="enarm-user-name">{user?.name || 'Doctor'}</span>!
                        </h3>
                        <p className="grey-text text-darken-1 enarm-subtitle">
                            Tu camino al ENARM continúa hoy. ¿Qué quieres repasar?
                        </p>
                    </CustomCol>
                    <CustomCol s={12} m={4} className="right-align hide-on-small-only">
                        <CustomButton
                            large
                            className="green pulse"
                            onClick={() => history.push('/caso/random')}
                            tooltip="Comienza un caso aleatorio para practicar"
                            aria-label="Comenzar entrenamiento rápido con un caso aleatorio"
                            icon="bolt"
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
                    <CustomCard title="Explorar por Especialidad" className="z-depth-1">
                        <div className={styles.specialtiesGrid}>
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    className={`specialty-item center-align hoverable ${styles.specialtyItem} ${focusedId === cat.id ? styles.specialtyItemFocused : ''}`}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Explorar especialidad ${cat.name}`}
                                    onClick={() => history.push(`/especialidad/${cat.id}`)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            history.push(`/especialidad/${cat.id}`);
                                        }
                                    }}
                                    onMouseEnter={() => setFocusedId(cat.id)}
                                    onMouseLeave={() => setFocusedId(null)}
                                    onFocus={() => setFocusedId(cat.id)}
                                    onBlur={() => setFocusedId(null)}
                                >
                                    <i className="material-icons green-text text-lighten-2 enarm-icon-lg" aria-hidden="true">medical_services</i>
                                    <p className="grey-text text-darken-2 enarm-specialty-label">{cat.name}</p>
                                </div>
                            ))}
                        </div>
                    </CustomCard>
                </CustomCol>

                {/* Achievements & Activity */}
                <CustomCol s={12} l={4}>
                    <CustomCard title="Logros Recientes" className="z-depth-1">
                        {stats.recentAchievements.length > 0 ? (
                            <ul className={`collection ${styles.achievementsList}`}>
                                {stats.recentAchievements.map(ach => (
                                    <li key={ach.id} className={`collection-item avatar ${styles.achievementsListItem}`}>
                                        <i className="material-icons circle green" aria-hidden="true">emoji_events</i>
                                        <span className="title enarm-title-medium">{ach.name}</span>
                                        <p className="grey-text truncate">{ach.description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className={`center-align grey-text ${styles.achievementsEmpty}`}>
                                <i className={`material-icons ${styles.achievementsEmptyIcon}`} aria-hidden="true">lock</i>
                                <p>Sigue practicando para desbloquear logros.</p>
                            </div>
                        )}
                        <div className={`center-align ${styles.achievementsCta}`}>
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
