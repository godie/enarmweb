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
        <div className="section no-padding">
            <div className="card-panel">
                <CustomRow className="valign-wrapper">
                    <CustomCol s={12} m={8}>
                        <h5 className="grey-text text-darken-3" style={{ margin: '0' }}>{title}</h5>
                    </CustomCol>
                    <CustomCol s={12} m={4} className="right-align">
                        <CustomButton onClick={clearCache} className="green darken-1">
                            LIMPIAR CACHÉ
                        </CustomButton>
                    </CustomCol>
                </CustomRow>

                <div className="divider" style={{ margin: '1.5rem 0' }}></div>

                <CustomTable striped className="highlight">
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
        </div>
    )

}

Especialidades.propTypes = {
    title: PropTypes.string
}

Especialidades.defaultProps = {
    title: 'Especialidades'
}