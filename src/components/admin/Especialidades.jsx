import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {
    CustomButton,
    CustomPreloader,
    CustomTable,
    CustomRow,
    CustomCol
} from "../custom";
import ExamService from "../../services/ExamService";
import EnarmUtil from "../../modules/EnarmUtil";
import EspecialidadRow from "./EspecialidadRow";

export default function Especialidades({ title }) {
    const [isLoading, setIsLoading] = useState(true);
    const [especialidades, setEspecialidades] = useState([]);

    useEffect(() => {
        ExamService.loadCategories()
            .then((response) => {
                setIsLoading(false);
                setEspecialidades(response.data);
            });
    }, [])

    if (isLoading) {
        return (
            <div className="center-align" style={{ padding: '50px' }}>
                <CustomPreloader active color="green" size="big" />
            </div>
        )
    }

    const clearCache = () => {
        EnarmUtil.clearCategories();
    }

    return (
        <div className="especialidades-container">
            <CustomRow>
                <CustomCol s={12} m={8}>
                    <h4 className="grey-text text-darken-3">{title}</h4>
                </CustomCol>
                <CustomCol s={12} m={4} className="right-align valign-wrapper" style={{ justifyContent: 'flex-end' }}>
                    <CustomButton onClick={clearCache} className="green darken-1">
                        LIMPIAR CACHÉ
                    </CustomButton>
                </CustomCol>
            </CustomRow>

            <CustomTable striped className="highlight z-depth-1">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th className="right-align">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {especialidades.map(especialidad => (
                        <EspecialidadRow key={especialidad.id} especialidad={especialidad} />
                    ))}
                </tbody>
            </CustomTable>
        </div>
    )

}

Especialidades.propTypes = {
    title: PropTypes.string
}

Especialidades.defaultProps = {
    title: 'Especialidades'
}