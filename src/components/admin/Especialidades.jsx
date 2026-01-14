import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
// import { Col, Row } from "react-materialize"; // Removed
import CustomButton from "../custom/CustomButton";
import CustomPreloader from "../custom/CustomPreloader";
import CustomTable from "../custom/CustomTable";
import CustomRow from "../custom/CustomRow"; // Added
import CustomCol from "../custom/CustomCol"; // Added
// CustomIcon is not directly used here if CustomButton handles the icon prop
import ExamService from "../../services/ExamService";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import EnarmUtil from "../../modules/EnarmUtil";

export default function Expecialidades({ title }) {
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
            <CustomRow>
                <CustomCol s={5}>
                    <CustomPreloader active color="green" size="big" />
                </CustomCol>
            </CustomRow>
        )
    }

    const rows = especialidades.map(especialidad => (
        <tr key={especialidad.id}>
            <td>{especialidad.name}</td>
            <td>{especialidad.description}</td>
            <td><Link to={`/dashboard/edit/especialidad/${especialidad.id}`} className="secondary-content">
                <CustomButton
                    tooltip="Editar especialidad"
                    className="btn-flat"
                    icon="edit" // CustomButton takes icon name as a string prop
                    waves="light" // Adding default waves, can be adjusted
                /> </Link></td>
        </tr>
    ));

    const clearCache = () => {
        EnarmUtil.clearCategories();
    }

    return (
        <div className="section no-padding">
            <div className="card-panel white">
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
                    <tbody>{rows}</tbody>
                </CustomTable>
            </div>
        </div>
    )

}

Expecialidades.propTypes = {
    title: PropTypes.string
}

Expecialidades.defaultProps = {
    title: 'Especialidades'
}