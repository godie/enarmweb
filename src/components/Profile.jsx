import { useState, useEffect } from "react";
import Auth from "../modules/Auth";
import UserService from "../services/UserService";
import ExamService from "../services/ExamService";
import { alertSuccess, alertError } from "../services/AlertService";
import EnarmUtil from "../modules/EnarmUtil";
import {
    CustomPreloader,
    CustomRow,
    CustomCol,
    CustomCard,
    StatCard,
    CustomButton,
    CustomTextInput,
    CustomSelect,
    CustomCheckbox,
    CustomCollection,
    CustomCollectionItem,
    CustomProgressBar
} from "./custom";
import styles from "./Profile.module.css";

const Profile = () => {
    const user = Auth.getUserInfo() || { id: null, name: '', email: '', role: 'player', preferences: { specialties: [] } };
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        name: user.name || '',
        nickname: user.nickname || user.name?.toLowerCase().replace(/\s/g, '_') || 'doctor_anonimo',
        leaderboardVisible: user.preferences?.leaderboardVisible !== false,
        displayNameType: user.preferences?.displayNameType || 'nickname'
    });

    // User stats
    const [stats, setStats] = useState({
        total_answers: 0,
        accuracy: 0,
        points: 0,
        streak: 0,
        ranking: 0
    });

    const [selectedSpecialties, setSelectedSpecialties] = useState(user.preferences?.specialties || []);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, statsRes] = await Promise.all([
                    ExamService.loadCategories(),
                    UserService.getUserStats()
                ]);
                setCategories(catRes.data);
                setStats(statsRes.data);
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

    const toggleSpecialty = (id) => {
        setSelectedSpecialties(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updatedPreferences = {
                ...user.preferences,
                specialties: selectedSpecialties,
                leaderboardVisible: formData.leaderboardVisible,
                displayNameType: formData.displayNameType
            };

            const updateData = {
                name: formData.name,
                nickname: formData.nickname,
                preferences: updatedPreferences
            };

            await UserService.updateUser(user.id, updateData);

            // Update local info
            Auth.savePlayerInfo({
                ...user,
                name: formData.name,
                nickname: formData.nickname,
                preferences: updatedPreferences
            });

            alertSuccess("¡Éxito!", "Tu perfil ha sido actualizado correctamente.");
        } catch (error) {
            console.error("Error saving profile", error);
            alertError("Error", "No se pudieron guardar los cambios.");
        } finally {
            setSaving(false);
        }
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
                    <StatCard title="Respuestas Totales" count={stats.total_answers} icon="assignment_turned_in" color="blue" />
                </CustomCol>
                <CustomCol s={12} m={3}>
                    <StatCard title="Puntos" count={stats.points} icon="stars" color="orange" />
                </CustomCol>
                <CustomCol s={12} m={3}>
                    <StatCard title="Racha" count={`${stats.streak || 0} días`} icon="local_fire_department" color="red" />
                </CustomCol>
                <CustomCol s={12} m={3}>
                    <StatCard title="Precisión" count={`${stats.accuracy}%`} icon="track_changes" color="green" />
                </CustomCol>
            </CustomRow>

            <CustomRow style={{ marginTop: '2rem' }}>
                {/* 3. Form de Información Personal */}
                <CustomCol s={12} l={12}>
                    <CustomCard title="Información Personal" icon="person">
                        <div className="row">
                            <CustomTextInput
                                id="profile-name"
                                s={12}
                                m={6}
                                label="Nombre Completo"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                icon="person_outline"
                            />
                            <CustomTextInput
                                id="profile-nickname"
                                s={12}
                                m={6}
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
                <CustomCol s={12} l={12}>
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
                <CustomCol s={12} l={12}>
                    <CustomCard title="Progreso por Especialidad" icon="trending_up">
                        <CustomCollection>
                            {categories.map(cat => {
                                // Mock progress for each category for visual representation
                                const progress = Math.floor(Math.random() * 100);
                                return (
                                    <CustomCollectionItem key={cat.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 500 }}>{cat.name}</span>
                                            <span className="grey-text">{progress}%</span>
                                        </div>
                                        <CustomProgressBar progress={progress} height="8px" />
                                    </CustomCollectionItem>
                                );
                            })}
                        </CustomCollection>
                    </CustomCard>
                </CustomCol>

                {/* 6. Selección de Especialidades */}
                <CustomCol s={12} l={12}>
                    <CustomCard title="Selección de Especialidades" icon="medical_services">
                        <p className="grey-text">Selecciona las especialidades que deseas practicar.</p>
                        <div className="row">
                            {categories.map(cat => {
                                const isSelected = selectedSpecialties.includes(cat.id);
                                return (
                                    <div key={cat.id} className="col s12 m6 l4" style={{ marginBottom: '1rem' }}>
                                        <CustomCheckbox
                                            id={`spec-${cat.id}`}
                                            label={cat.name}
                                            checked={isSelected}
                                            onChange={() => toggleSpecialty(cat.id)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </CustomCard>
                </CustomCol>

                {/* 7. Subscription Type (Mock) */}
                <CustomCol s={12} l={12}>
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

            {/* 8. Botón para guardar cambios */}
            <div className="center-align" style={{ marginTop: '3rem', marginBottom: '4rem' }}>
                <CustomButton
                    large
                    className="green darken-1 z-depth-2"
                    onClick={handleSave}
                    isPending={saving}
                    isPendingText="Guardando..."
                    style={{ padding: '0 4rem' }}
                >
                    Guardar Cambios
                </CustomButton>
            </div>
        </div>
    );
};

export default Profile;
