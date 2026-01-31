import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ExamService from "../../services/ExamService";
import { CustomRow, CustomCol, CustomTextInput, CustomButton, CustomTextarea } from "../custom";
import { alertError, alertSuccess } from "../../services/AlertService";

export default function EspecialidadForm() {
    const { identificador } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState({
        id: '0',
        name: '',
        description: '',
    });

    useEffect(() => {
        if (identificador && parseInt(identificador) > 0) {
            ExamService.getCategory(identificador).then(response => {
                const { data } = response;
                setFormData({ id: data.id, name: data.name, description: data.description || '' });
            }).catch(err => {
                console.error(err);
                alertError('¡Ups!', 'Ocurrió un error al cargar la especialidad');
            });
        }
    }, [identificador]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const onCancel = (e) => {
        e.preventDefault();
        history.goBack();
    }

    const onSubmit = (e) => {
        e.preventDefault();

        ExamService.saveCategory(formData)
            .then(() => {
                alertSuccess('¡Especialidad!', 'Creada correctamente');
                history.goBack();
            })
            .catch((err) => {
                console.error(err);
                alertError('¡Ups!', 'Ocurrió un error al guardar');
            });
    }

    return (
        <CustomCol s={12} m={12} l={12} >
            <form onSubmit={onSubmit}>
                <h3 className="center">{formData.id !== '0' ? 'Editar Especialidad' : 'Nueva Especialidad'}</h3>
                <input type="hidden" name="id" value={formData.id.toString()} />

                <CustomRow>
                    <CustomCol s={12} m={8} offset="m2">
                        <CustomTextInput
                            label="Especialidad"
                            name="name"
                            onChange={handleChange}
                            value={formData.name}
                            id="especialidad_name"
                            required
                        />
                    </CustomCol>
                </CustomRow>
                <CustomRow>
                    <CustomCol s={12} m={8} offset="m2">
                        <CustomTextarea
                            label="Descripción"
                            name="description"
                            onChange={handleChange}
                            value={formData.description}
                            id="especialidad_description"
                        />
                    </CustomCol>
                </CustomRow>
                <CustomRow>
                    <CustomCol s={12} m={8} offset="m2">
                        <CustomRow>
                            <CustomCol s={6}>
                                <p className="left-align">
                                    <CustomButton
                                        large
                                        type="button"
                                        waves="light"
                                        onClick={onCancel}
                                    >
                                        Cancelar
                                    </CustomButton>
                                </p>
                            </CustomCol>
                            <CustomCol s={6}>
                                <p className="right-align">
                                    <CustomButton
                                        large
                                        type="submit"
                                        waves="light"
                                        tooltip="Guardar Especialidad"
                                        className="green darken-1"
                                    >
                                        Guardar
                                    </CustomButton>
                                </p>
                            </CustomCol>
                        </CustomRow>
                    </CustomCol>
                </CustomRow>
            </form>
        </CustomCol >
    );
}