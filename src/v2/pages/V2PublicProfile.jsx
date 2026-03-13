import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import UserService from '../../services/UserService';
import CustomPreloader from '../../components/custom/CustomPreloader';
import '../styles/v2-theme.css';

const V2PublicProfile = () => {
    const { userId } = useParams();
    const history = useHistory();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await UserService.getPublicProfile(userId);
                setUser(response.data.user);
                setError(null);
            } catch (err) {
                console.error("Error fetching public profile:", err);
                setError("No se pudo cargar el perfil del usuario.");
                // Fallback to mock data for demo purposes if API fails
                setUser({
                    nickname: "Dra. Elena Martínez",
                    specialty: "Aspirante a Pediatría",
                    avatar: "https://ui-avatars.com/api/?name=Elena+Martinez&background=0fa397&color=fff&size=128",
                    verified: true,
                    stats: { totalPoints: 12450, casesSolved: 342, accuracy: 88 },
                    recentActivity: [{ type: "exam", title: "Simulacro Cardiología", score: 90, date: "2024-05-20" }],
                    achievements: [
                        { id: "ach1", title: "Experto en Neonatología", icon: "workspace_premium", date: "Completado ayer", color: "var(--md-sys-color-primary)" },
                        { id: "ach2", title: "Racha de 30 Días", icon: "local_fire_department", date: "15 de Octubre, 2023", color: "#f44336" }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) return <div className="center-align" style={{ padding: '40px' }}><CustomPreloader /></div>;
    if (error && !user) return <div className="center-align red-text" style={{ padding: '40px' }}>{error}</div>;

    return (
        <div className="v2-public-profile-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header / Back Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <button
                    className="v2-btn-tonal"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, minWidth: '40px' }}
                    onClick={() => history.goBack()}
                >
                    <i className="material-icons">arrow_back</i>
                </button>
                <h2 className="v2-title-large" style={{ margin: 0 }}>Perfil Público</h2>
                <button className="v2-btn-tonal" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, minWidth: '40px' }}>
                    <i className="material-icons">more_vert</i>
                </button>
            </div>

            {/* Profile Header */}
            <section className="v2-card" style={{ textAlign: 'center', padding: '32px 16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                    <img
                        src={user.avatar}
                        alt={user.nickname}
                        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--md-sys-color-surface-variant)' }}
                    />
                    {user.verified && (
                        <div style={{
                            position: 'absolute', bottom: '5px', right: '5px',
                            backgroundColor: 'var(--md-sys-color-primary)', color: 'white',
                            borderRadius: '50%', width: '28px', height: '28px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid var(--md-sys-color-surface)'
                        }}>
                            <i className="material-icons" style={{ fontSize: '18px' }}>verified</i>
                        </div>
                    )}
                </div>
                <h1 className="v2-headline-medium" style={{ margin: '0 0 4px 0' }}>{user.nickname}</h1>
                <p className="v2-body-large" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '24px' }}>{user.specialty}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button
                        className={isFollowing ? "v2-btn-outlined" : "v2-btn-primary"}
                        onClick={() => setIsFollowing(!isFollowing)}
                        style={{ minWidth: '140px' }}
                    >
                        <i className="material-icons" style={{ marginRight: '8px' }}>
                            {isFollowing ? 'person_remove' : 'person_add'}
                        </i>
                        {isFollowing ? 'Siguiendo' : 'Seguir'}
                    </button>
                    <button className="v2-btn-tonal">
                        <i className="material-icons">mail</i>
                    </button>
                </div>
            </section>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <div className="v2-card-tonal" style={{ textAlign: 'center', padding: '16px 8px' }}>
                    <div className="v2-headline-small" style={{ color: 'var(--md-sys-color-primary)' }}>{user.stats.totalPoints.toLocaleString()}</div>
                    <div className="v2-label-medium">Puntos</div>
                </div>
                <div className="v2-card-tonal" style={{ textAlign: 'center', padding: '16px 8px' }}>
                    <div className="v2-headline-small" style={{ color: 'var(--md-sys-color-primary)' }}>{user.stats.casesSolved}</div>
                    <div className="v2-label-medium">Casos</div>
                </div>
                <div className="v2-card-tonal" style={{ textAlign: 'center', padding: '16px 8px' }}>
                    <div className="v2-headline-small" style={{ color: 'var(--md-sys-color-primary)' }}>{user.stats.accuracy}%</div>
                    <div className="v2-label-medium">Precisión</div>
                </div>
            </div>

            {/* Content Tabs (Simplified) */}
            <section className="v2-card" style={{ padding: '0' }}>
                <div style={{ borderBottom: '1px solid var(--md-sys-color-outline-variant)', display: 'flex' }}>
                    <div style={{
                        padding: '16px', flex: 1, textAlign: 'center',
                        borderBottom: '3px solid var(--md-sys-color-primary)',
                        color: 'var(--md-sys-color-primary)', fontWeight: 'bold'
                    }}>Logros</div>
                    <div style={{ padding: '16px', flex: 1, textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>Actividad</div>
                </div>

                <div style={{ padding: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                        {user.achievements.map((ach) => (
                            <div key={ach.id} className="v2-card-elevated" style={{ padding: '16px', textAlign: 'center', borderRadius: '16px' }}>
                                <i className="material-icons" style={{ fontSize: '40px', color: ach.color, marginBottom: '8px' }}>{ach.icon}</i>
                                <div className="v2-label-large" style={{ display: 'block', marginBottom: '4px' }}>{ach.title}</div>
                                <div className="v2-label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{ach.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default V2PublicProfile;
