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
import styles from './Onboarding.module.css';

const Onboarding = () => {
    const history = useHistory();
    const [state, setState] = useState({
        categories: [],
        selected: [],
        loading: true,
        saving: false
    });
    const { categories, selected, loading, saving } = state;
    const user = Auth.getUserInfo();

    useEffect(() => {
        ExamService.loadCategories()
            .then(res => {
                setState(prev => ({
                    ...prev,
                    categories: res.data,
                    loading: false
                }));
            })
            .catch(err => {
                console.error(err);
                setState(prev => ({ ...prev, loading: false }));
            });
    }, []);

    const toggleSpecialty = (id) => {
        setState(prev => {
            const isSelected = prev.selected.includes(id);
            return {
                ...prev,
                selected: isSelected
                    ? prev.selected.filter(s => s !== id)
                    : [...prev.selected, id]
            };
        });
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSpecialty(id);
        }
    };

    const selectAll = () => setState(prev => ({ ...prev, selected: prev.categories.map(c => c.id) }));
    const deselectAll = () => setState(prev => ({ ...prev, selected: [] }));

    const handleSave = async () => {
        if (selected.length === 0) {
            alertError("Selección vacía", "Por favor elige al menos una especialidad para comenzar.");
            return;
        }

        setState(prev => ({ ...prev, saving: true }));
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
            setState(prev => ({ ...prev, saving: false }));
        }
    };

    if (loading) {
        return (
            <div className="center-align enarm-loading-wrapper">
                <CustomPreloader active />
            </div>
        );
    }

    return (
        <div className={`onboarding-container ${styles.container}`}>
            <CustomRow>
                <CustomCol s={12} className="center-align">
                    <h3 className="grey-text text-darken-3 enarm-heading-light">
                        ¡Bienvenido, <span className="enarm-user-name">{user?.name}</span>!
                    </h3>
                    <p className="grey-text text-darken-1 enarm-subtitle-mb">
                        Para personalizar tu experiencia, selecciona las especialidades que más te interesan practicar.
                    </p>
                    <div className="center-align">
                        <CustomButton flat small onClick={selectAll} icon="done_all" className="grey-text text-darken-1">Seleccionar todas</CustomButton>
                        <CustomButton flat small onClick={deselectAll} icon="remove_done" className="grey-text text-darken-1">Deseleccionar todas</CustomButton>
                    </div>
                </CustomCol>
            </CustomRow>

            <CustomRow>
                {categories.map(cat => {
                    const isSelected = selected.includes(cat.id);
                    return (
                        <CustomCol s={12} m={4} l={3} key={cat.id}>
                            <div
                                className={`specialty-card center-align hoverable ${styles.specialtyCard} ${isSelected ? styles.specialtyCardSelected : ''}`}
                                role="button"
                                tabIndex={0}
                                aria-label={`${isSelected ? 'Deseleccionar' : 'Seleccionar'} especialidad ${cat.name}`}
                                aria-pressed={isSelected}
                                onClick={() => toggleSpecialty(cat.id)}
                                onKeyDown={(e) => handleKeyDown(e, cat.id)}
                            >
                                <i
                                    className={`material-icons enarm-icon-xl ${styles.specialtyIcon} ${isSelected ? 'green-text' : 'grey-text text-lighten-1'}`}
                                    aria-hidden="true"
                                >
                                    {isSelected ? 'check_circle' : 'medical_services'}
                                </i>
                                <h6 className={`${styles.specialtyLabel} ${isSelected ? styles.specialtyLabelSelected : styles.specialtyLabelDefault}`}>{cat.name}</h6>
                            </div>
                        </CustomCol>
                    );
                })}
            </CustomRow>

            <CustomRow className={`center-align ${styles.rowMarginTop}`}>
                <CustomCol s={12}>
                    <CustomButton
                        large
                        className="green"
                        onClick={handleSave}
                        disabled={selected.length === 0}
                        isPending={saving}
                        isPendingText="Guardando..."
                        pendingColor="yellow"
                    >
                        Comenzar mi Entrenamiento
                    </CustomButton>
                </CustomCol>
            </CustomRow>
        </div>
    );
};

export default Onboarding;
