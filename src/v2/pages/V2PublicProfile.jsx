import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2PublicProfile = () => {
    const { userId } = useParams();
    const history = useHistory();
    const [isFollowing, setIsFollowing] = useState(false);

    // Mock data based on the requested backend response
    const [data] = useState({
        user: {
            nickname: "Dra. Elena Martínez",
            specialty: "Aspirante a Pediatría",
            avatar: "https://ui-avatars.com/api/?name=Elena+Martinez&background=0fa397&color=fff&size=128",
            verified: true,
            community: "ENARM V2 Community",
            stats: {
                totalPoints: 12450,
                casesSolved: 342,
                accuracy: 88
            },
            recentActivity: [
                { type: "exam", title: "Simulacro Cardiología", score: 90, date: "2024-05-20" }
            ],
            achievements: [
                { id: "ach1", title: "Experto en Neonatología", icon: "workspace_premium", date: "Completado ayer", color: "var(--md-sys-color-primary)" },
                { id: "ach2", title: "Racha de 30 Días", icon: "local_fire_department", date: "15 de Octubre, 2023", color: "#f44336" },
                { id: "ach3", title: "Master en Casos Clínicos", icon: "clinical_notes", date: "02 de Octubre, 2023", color: "#2196f3" },
                { id: "ach4", title: "Mentor de Comunidad", icon: "groups", date: "28 de Septiembre, 2023", color: "#4caf50" }
            ]
        }
    });

    const user = data.user;

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

            {/* Profile Info */}
            <section className="v2-card-elevated" style={{ textAlign: 'center', padding: '32px 24px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                    <img
                        src={user.avatar}
                        alt={user.nickname}
                        style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--md-sys-color-surface-container-highest)' }}
                    />
                    {user.verified && (
                        <i className="material-icons" style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            color: 'var(--md-sys-color-primary)',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            fontSize: '24px'
                        }}>verified</i>
                    )}
                </div>
                <h1 className="v2-headline-medium" style={{ margin: '0 0 4px 0' }}>{user.nickname}</h1>
                <p className="v2-body-large" style={{ margin: '0 0 8px 0', opacity: 0.7 }}>{user.specialty}</p>
                <div className="v2-label-large" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--md-sys-color-secondary-container)',
                    color: 'var(--md-sys-color-on-secondary-container)',
                    marginBottom: '24px'
                }}>
                    <i className="material-icons" style={{ fontSize: '16px' }}>shield</i>
                    {user.community}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <button
                        className={isFollowing ? "v2-btn-tonal" : "v2-btn-filled"}
                        onClick={() => setIsFollowing(!isFollowing)}
                        style={{ flex: 1, maxWidth: '150px' }}
                    >
                        <i className="material-icons">{isFollowing ? 'person_remove' : 'person_add'}</i>
                        {isFollowing ? 'Siguiendo' : 'Seguir'}
                    </button>
                    <button className="v2-btn-tonal" style={{ flex: 1, maxWidth: '150px' }}>
                        <i className="material-icons">chat_bubble</i>
                        Mensaje
                    </button>
                </div>
            </section>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
                <div className="v2-card-tonal" style={{ textAlign: 'center', padding: '16px' }}>
                    <div className="v2-label-large" style={{ opacity: 0.6, marginBottom: '4px' }}>XP</div>
                    <div className="v2-title-large" style={{ color: 'var(--md-sys-color-primary)' }}>{user.stats.totalPoints.toLocaleString()}</div>
                </div>
                <div className="v2-card-tonal" style={{ textAlign: 'center', padding: '16px' }}>
                    <div className="v2-label-large" style={{ opacity: 0.6, marginBottom: '4px' }}>Casos</div>
                    <div className="v2-title-large">{user.stats.casesSolved}</div>
                </div>
                <div className="v2-card-tonal" style={{ textAlign: 'center', padding: '16px' }}>
                    <div className="v2-label-large" style={{ opacity: 0.6, marginBottom: '4px' }}>% Acierto</div>
                    <div className="v2-title-large" style={{ color: 'var(--md-sys-color-tertiary)' }}>{user.stats.accuracy}%</div>
                </div>
            </div>

            {/* Achievements */}
            <section className="v2-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '8px' }}>
                    <i className="material-icons" style={{ color: '#ffd700' }}>emoji_events</i>
                    <h3 className="v2-title-large" style={{ margin: 0 }}>Logros Recientes</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {user.achievements.map((ach) => (
                        <div
                            key={ach.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid var(--md-sys-color-outline-variant)'
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="material-icons" style={{ color: ach.color }}>{ach.icon}</i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="v2-title-medium" style={{ fontSize: '16px', fontWeight: '600' }}>{ach.title}</div>
                                <div className="v2-label-medium" style={{ opacity: 0.6 }}>{ach.date}</div>
                            </div>
                            <i className="material-icons" style={{ opacity: 0.3 }}>chevron_right</i>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default V2PublicProfile;
