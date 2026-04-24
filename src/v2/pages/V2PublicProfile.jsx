import { useReducer, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import UserService from '../../services/UserService';
import CustomPreloader from '../../components/custom/CustomPreloader';
import '../styles/v2-theme.css';

const initialState = {
    isFollowing: false,
    loading: true,
    error: null,
    user: null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, user: action.payload, error: null };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload, user: action.userFallback };
        case 'TOGGLE_FOLLOW':
            return { ...state, isFollowing: !state.isFollowing };
        default:
            return state;
    }
}

const V2PublicProfile = () => {
    const { userId } = useParams();
    const history = useHistory();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchProfile = async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                const response = await UserService.getPublicProfile(userId);
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data.user });
            } catch (err) {
                console.error("Error fetching public profile:", err);
                const userFallback = {
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
                };
                dispatch({ type: 'FETCH_ERROR', payload: "No se pudo cargar el perfil del usuario.", userFallback });
            }
        };

        fetchProfile();
    }, [userId]);

    const { loading, error, user, isFollowing } = state;

    if (loading) return <div className='v2-center-state v2-p-40'><CustomPreloader /></div>;
    if (error && !user) return <div className='v2-error-state v2-p-40'>{error}</div>;

    return (
        <div className='v2-page-medium'>
            {/* Header / Back Navigation */}
            <div className='v2-page-header-back v2-flex-justify-between'>
                <button
                    className='v2-btn-icon'
                    onClick={() => history.goBack()}
                    aria-label='Volver'
                >
                    <i className='material-icons'>arrow_back</i>
                </button>
                <h2 className='v2-title-large v2-m-0'>Perfil Público</h2>
                <button className='v2-btn-icon' aria-label='Más opciones'>
                    <i className='material-icons'>more_vert</i>
                </button>
            </div>

            {/* Profile Header */}
            <section className='v2-card v2-text-center v2-mb-24' style={{ padding: '32px 16px' }}>
                <div className='v2-position-relative v2-mb-16' style={{ display: 'inline-block' }}>
                    <img
                        src={user.avatar}
                        alt={user.nickname}
                        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--md-sys-color-surface-variant)' }}
                    />
                    {user.verified && (
                        <div style={{
                            position: 'absolute', bottom: '5px', right: '5px',
                            backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)',
                            borderRadius: '50%', width: '28px', height: '28px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid var(--md-sys-color-surface)'
                        }}>
                            <i className='material-icons' style={{ fontSize: '18px' }}>verified</i>
                        </div>
                    )}
                </div>
                <h1 className='v2-headline-medium v2-mb-4'>{user.nickname}</h1>
                <p className='v2-body-large v2-text-secondary v2-mb-24'>{user.specialty}</p>

                <div className='v2-flex v2-flex-justify-center v2-gap-12'>
                    <button
                        className={isFollowing ? 'v2-btn-outlined' : 'v2-btn-primary'}
                        onClick={() => dispatch({ type: 'TOGGLE_FOLLOW' })}
                        style={{ minWidth: '140px' }}
                    >
                        <i className='material-icons' style={{ marginRight: '8px' }}>
                            {isFollowing ? 'person_remove' : 'person_add'}
                        </i>
                        {isFollowing ? 'Siguiendo' : 'Seguir'}
                    </button>
                    <button className='v2-btn-tonal'>
                        <i className='material-icons'>mail</i>
                    </button>
                </div>
            </section>

            {/* Stats Grid */}
            <div className='v2-grid-3 v2-gap-12 v2-mb-24'>
                <div className='v2-card-tonal v2-text-center' style={{ padding: '16px 8px' }}>
                    <div className='v2-headline-small v2-text-primary'>{user.stats.totalPoints.toLocaleString()}</div>
                    <div className='v2-label-medium'>Puntos</div>
                </div>
                <div className='v2-card-tonal v2-text-center' style={{ padding: '16px 8px' }}>
                    <div className='v2-headline-small v2-text-primary'>{user.stats.casesSolved}</div>
                    <div className='v2-label-medium'>Casos</div>
                </div>
                <div className='v2-card-tonal v2-text-center' style={{ padding: '16px 8px' }}>
                    <div className='v2-headline-small v2-text-primary'>{user.stats.accuracy}%</div>
                    <div className='v2-label-medium'>Precisión</div>
                </div>
            </div>

            {/* Content Tabs (Simplified) */}
            <section className='v2-card v2-p-0'>
                <div className='v2-border-bottom v2-flex'>
                    <div style={{
                        padding: '16px', flex: 1, textAlign: 'center',
                        borderBottom: '3px solid var(--md-sys-color-primary)',
                        color: 'var(--md-sys-color-primary)', fontWeight: 'bold'
                    }}>Logros</div>
                    <div style={{ padding: '16px', flex: 1, textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>Actividad</div>
                </div>

                <div className='v2-p-16'>
                    <div className='v2-grid-auto-fill v2-gap-16'>
                        {user.achievements.map((ach) => (
                            <div key={ach.id} className='v2-card-elevated v2-text-center' style={{ padding: '16px', borderRadius: '16px' }}>
                                <i className='material-icons' style={{ fontSize: '40px', color: ach.color, marginBottom: '8px' }}>{ach.icon}</i>
                                <div className='v2-label-large v2-mb-4' style={{ display: 'block' }}>{ach.title}</div>
                                <div className='v2-label-small v2-text-secondary'>{ach.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default V2PublicProfile;
