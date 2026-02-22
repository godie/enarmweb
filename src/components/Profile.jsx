import { useState, useEffect } from "react";
import Auth from "../modules/Auth";
import ExamService from "../services/ExamService";
import {
    CustomPreloader,
    CustomRow,
    CustomCol,
    CustomCard,
    StatCard,
    CustomButton,
    CustomTextInput,
    CustomSelect
} from "./custom";

const Profile = () => {
    const user = Auth.getUserInfo() || { id: null, name: '', email: '', role: 'player' };
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        name: user.name || '',
        nickname: user.nickname || user.name?.toLowerCase().replace(/\s/g, '_') || 'doctor_anonimo',
        leaderboardVisible: true,
        displayNameType: 'nickname'
    });

    // Mock stats
    const stats = {
        resolvedCases: 156,
        streak: 5,
        ranking: 42,
        precision: 88
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await ExamService.loadCategories();
                setCategories(catRes.data);
            } catch (err) {
                console.error("Error loading profile data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) {
        return (
            <div className="section center enarm-loading-wrapper">
                <CustomPreloader size="big" active color="green" />
            </div>
        );
    }

    return (
        <div className="profile-page" style={{ padding: '2rem 0' }}>
            {/* 1. Información de Perfil (Header) */}
            <div className="profile-header center-align" style={{ marginBottom: '3rem' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=006d3e&color=fff&size=128`}
                        alt="Profile"
                        className="circle z-depth-2"
                        style={{ width: '128px', height: '128px', border: '4px solid var(--md-sys-color-primary)' }}
                    />
                    <span className="btn-floating btn-small halfway-fab waves-effect waves-light green" style={{ bottom: '10px', right: '10px' }}>
                        <i className="material-icons">edit</i>
                    </span>
                </div>
                <h4 style={{ marginTop: '1rem', fontWeight: 600 }}>@{formData.nickname}</h4>
                <h5 className="grey-text text-darken-1">{formData.name}</h5>
                <div style={{ marginTop: '0.5rem' }}>
                    <span className="badge green white-text enarm-badge-pill" style={{ float: 'none', padding: '5px 15px', height: 'auto' }}>
                        {user.role === 'admin' ? 'Administrador' : user.role === 'specialist' ? 'Especialista' : 'Player'}
                    </span>
                    <span className="badge blue white-text enarm-badge-pill" style={{ float: 'none', marginLeft: '10px', padding: '5px 15px', height: 'auto' }}>
                        Nivel: Principiante
                    </span>
                </div>
            </div>

            {/* 2. Cuadros de Estadísticas */}
            <CustomRow>
                <CustomCol s={12} m={3}>
                    <StatCard title="Casos Resueltos" count={stats.resolvedCases} icon="assignment_turned_in" color="blue" />
                </CustomCol>
                <CustomCol s={12} m={3}>
                    <StatCard title="Racha Activa" count={`${stats.streak} días`} icon="local_fire_department" color="orange" />
                </CustomCol>
                <CustomCol s={12} m={3}>
                    <StatCard title="Ranking Global" count={`#${stats.ranking}`} icon="emoji_events" color="yellow darken-2" />
                </CustomCol>
                <CustomCol s={12} m={3}>
                    <StatCard title="Precisión" count={`${stats.precision}%`} icon="track_changes" color="green" />
                </CustomCol>
            </CustomRow>

            <CustomRow style={{ marginTop: '2rem' }}>
                {/* 3. Form de Información Personal */}
                <CustomCol s={12} l={6}>
                    <CustomCard title="Información Personal" icon="person">
                        <div className="row">
                            <CustomTextInput
                                id="profile-name"
                                s={12}
                                label="Nombre Completo"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                icon="person_outline"
                            />
                            <CustomTextInput
                                id="profile-nickname"
                                s={12}
                                label="Nickname"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                icon="alternate_email"
                            />
                            <CustomTextInput
                                id="profile-email"
                                s={12}
                                label="Correo Electrónico"
                                value={user.email}
                                readOnly
                                icon="email"
                                helperText="El correo no puede ser modificado"
                            />
                        </div>
                    </CustomCard>
                </CustomCol>

                {/* 4. Configuración para Leaderboard */}
                <CustomCol s={12} l={6}>
                    <CustomCard title="Configuración de Clasificación" icon="leaderboard">
                        <p className="grey-text">Controla cómo apareces en las listas públicas de mejores puntuaciones.</p>
                        <div style={{ marginTop: '2rem' }}>
                            <div className="switch" style={{ marginBottom: '2rem' }}>
                                <label>
                                    Oculto
                                    <input
                                        type="checkbox"
                                        name="leaderboardVisible"
                                        checked={formData.leaderboardVisible}
                                        onChange={handleInputChange}
                                    />
                                    <span className="lever"></span>
                                    Público
                                </label>
                            </div>

                            <CustomSelect
                                id="profile-display-name-type"
                                label="Mostrarme como:"
                                name="displayNameType"
                                value={formData.displayNameType}
                                onChange={handleInputChange}
                                options={[
                                    { value: 'nickname', label: `@${formData.nickname} (Nickname)` },
                                    { value: 'name', label: `${formData.name} (Nombre Real)` }
                                ]}
                            />
                        </div>
                    </CustomCard>
                </CustomCol>
            </CustomRow>

            <CustomRow style={{ marginTop: '2rem' }}>
                {/* 5. Progreso por Especialidad */}
                <CustomCol s={12} l={8}>
                    <CustomCard title="Progreso por Especialidad" icon="trending_up">
                        <ul className="collection no-border">
                            {categories.map(cat => {
                                // Mock progress for each category
                                const progress = Math.floor(Math.random() * 100);
                                return (
                                    <li key={cat.id} className="collection-item" style={{ border: 'none', paddingLeft: 0, paddingRight: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 500 }}>{cat.name}</span>
                                            <span className="grey-text">{progress}%</span>
                                        </div>
                                        <div className="progress grey lighten-3" style={{ height: '8px', borderRadius: '4px' }}>
                                            <div
                                                className="determinate green darken-1"
                                                style={{ width: `${progress}%`, borderRadius: '4px' }}
                                            ></div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </CustomCard>
                </CustomCol>

                {/* 6. Subscription Type (Mock) */}
                <CustomCol s={12} l={4}>
                    <CustomCard title="Suscripción" icon="card_membership">
                        <div className="center-align" style={{ padding: '1rem 0' }}>
                            <i className="material-icons grey-text text-lighten-1" style={{ fontSize: '4rem' }}>stars</i>
                            <h6 style={{ margin: '1rem 0', fontWeight: 600 }}>Plan Gratuito</h6>
                            <p className="grey-text" style={{ marginBottom: '1.5rem' }}>
                                Suscríbete para desbloquear simulacros personalizados y estadísticas avanzadas.
                            </p>
                            <CustomButton className="green darken-1 pulse" style={{ width: '100%' }}>
                                Suscribirse ahora
                            </CustomButton>
                        </div>
                    </CustomCard>
                </CustomCol>
            </CustomRow>

            {/* 7. Botón para guardar cambios */}
            <div className="center-align" style={{ marginTop: '3rem', marginBottom: '4rem' }}>
                <CustomButton
                    large
                    className="green darken-1 z-depth-2"
                    onClick={() => alert('Cambios guardados (Mock)')}
                    style={{ padding: '0 4rem' }}
                >
                    Guardar Cambios
                </CustomButton>
            </div>
        </div>
    );
};

export default Profile;
