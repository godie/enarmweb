import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    CustomRow,
    CustomCol,
    CustomButton,
    CustomPreloader,
} from './custom';
import ExamService from '../services/ExamService';
import UserService from '../services/UserService';
import Auth from '../modules/Auth';
import { alertError, alertSuccess } from '../services/AlertService';

const Onboarding = () => {
    const history = useHistory();
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const user = Auth.getUserInfo();

    useEffect(() => {
        ExamService.loadCategories()
            .then(res => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const toggleSpecialty = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(s => s !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSpecialty(id);
        }
    };

    const handleSave = async () => {
        if (selected.length === 0) {
            alertError("Selección vacía", "Por favor elige al menos una especialidad para comenzar.");
            return;
        }

        setSaving(true);
        try {
            const updatedPreferences = { ...user.preferences, specialties: selected };
            await UserService.updateUser(user.id, { preferences: updatedPreferences });

            // Actualizar info local
            Auth.savePlayerInfo({
                ...user,
                preferences: updatedPreferences
            });

            alertSuccess("¡Todo listo!", "Tus preferencias han sido guardadas. ¡A estudiar!");
            history.push('/');
        } catch (error) {
            console.error(error);
            alertError("Error", "No se pudieron guardar tus preferencias.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="center-align" style={{ padding: '100px' }}><CustomPreloader active /></div>;

    return (
        <div className="onboarding-container" style={{ padding: '40px 0' }}>
            <CustomRow>
                <CustomCol s={12} className="center-align">
                    <h3 className="grey-text text-darken-3" style={{ fontWeight: '300' }}>
                        ¡Bienvenido, <span style={{ fontWeight: '600', color: 'var(--medical-green)' }}>{user?.name}</span>!
                    </h3>
                    <p className="grey-text text-darken-1" style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
                        Para personalizar tu experiencia, selecciona las especialidades que más te interesan practicar.
                    </p>
                </CustomCol>
            </CustomRow>

            <CustomRow>
                {categories.map(cat => {
                    const isSelected = selected.includes(cat.id);
                    return (
                        <CustomCol s={12} m={4} l={3} key={cat.id}>
                            <div
                                className={`specialty-card center-align hoverable ${isSelected ? 'selected' : ''}`}
                                role="button"
                                tabIndex={0}
                                aria-pressed={isSelected}
                                onClick={() => toggleSpecialty(cat.id)}
                                onKeyDown={(e) => handleKeyDown(e, cat.id)}
                                style={{
                                    padding: '20px',
                                    borderRadius: '15px',
                                    border: isSelected ? '2px solid var(--medical-green)' : '2px solid transparent',
                                    backgroundColor: isSelected ? '#e8f5e9' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    marginBottom: '20px'
                                }}
                            >
                                <i
                                    className={`material-icons ${isSelected ? 'green-text' : 'grey-text text-lighten-1'}`}
                                    style={{ fontSize: '3rem' }}
                                    aria-hidden="true"
                                >
                                    {isSelected ? 'check_circle' : 'medical_services'}
                                </i>
                                <h6 style={{ fontWeight: isSelected ? '600' : '400', marginTop: '10px' }}>{cat.name}</h6>
                            </div>
                        </CustomCol>
                    );
                })}
            </CustomRow>

            <CustomRow className="center-align" style={{ marginTop: '40px' }}>
                <CustomCol s={12}>
                    <CustomButton
                        large
                        className="green"
                        onClick={handleSave}
                        disabled={saving || selected.length === 0}
                    >
                        {saving ? (
                            <span className="valign-wrapper" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
                                <CustomPreloader size="small" color="white" />
                                <span style={{ marginLeft: '10px' }}>Guardando...</span>
                            </span>
                        ) : "Comenzar mi Entrenamiento"}
                    </CustomButton>
                </CustomCol>
            </CustomRow>
        </div>
    );
};

export default Onboarding;
