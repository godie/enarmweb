import { useEffect, useState } from "react";

import { createBrowserHistory } from "history";
import ExamService from "../../services/ExamService";
import { CustomRow, CustomCol, CustomTextInput, CustomButton, CustomTextarea } from "../custom"; // Added
import { alertError, alertSuccess } from "../../services/AlertService";
import { useParams } from "react-router-dom";


export default function EspecialidadForm() {
    const { identificador } = useParams();
    const [formData, setFormDData] = useState({
        id: '0',
        name: '',
        description: '',
    });

    useEffect(() => {
        if (identificador !== undefined && identificador > 0) {
            ExamService.getCategory(identificador).then(response => {
                const { data } = response;
                setFormDData({ id: data.id, name: data.name, description: data.description || '' });
            }).catch(err => console.log(err), alertError('ops!', 'ocurrio un error al cargar la especialidad'))
        }
    }, [identificador]);
    const handleChange = (event) => {
        setFormDData({ ...formData, [event.target.name]: event.target.value });
    }
    const browserHistory = createBrowserHistory();

    const onCancel = (e) => {
        e.preventDefault();
        browserHistory.goBack();
    }

    const onSubmit = (e) => {
        e.preventDefault();

        ExamService.saveCategory(formData)
            .then(() => alertSuccess('Especialidad!', 'creada correctamente').then(() => browserHistory.goBack()))
            .catch((err) => console.log(err), alertError('ops!', 'ocurrio un error'));

    }

    return (
        <CustomCol s={12} m={12} l={12} >
            <form onSubmit={onSubmit}>
                <h3 className="center">Especialidad</h3>
                {/* Hidden input for ID doesn't need Materialize styling or CustomTextInput */}
                <input type="hidden" name="id" value={formData.id.toString()} />

                <CustomRow>
                    <CustomCol s={10} offset='s2' > {/* Wrapped TextInput */}
                        <CustomTextInput
                            label="Especialidad"
                            name="name"
                            onChange={handleChange}
                            value={formData.name}
                            id="especialidad_name"
                        />
                    </CustomCol>
                </CustomRow>
                <CustomRow>
                    <CustomCol s={10} offset='s2'> {/* Wrapped Textarea */}
                        <CustomTextarea
                            label="Description"
                            name="description"
                            onChange={handleChange}
                            value={formData.description}
                            id="especialidad_description"
                        />
                    </CustomCol>
                </CustomRow>
                <CustomRow>
                    <CustomCol s={12}>
                        <CustomRow> {/* Inner row for button alignment */}
                            <CustomCol s={5} offset='s2'>
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
                            <CustomCol s={5}>
                                <p className="right-align">
                                    <CustomButton
                                        large
                                        type="submit"
                                        waves="light"
                                        tooltip="Guardar Especialidad" // Corrected tooltip text
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