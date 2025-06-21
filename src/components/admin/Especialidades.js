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

export default function Expecialidades({title}){
    const[isLoading, setIsLoading] = useState(true);
    const[especialidades, setEspecialidades] = useState([]);

    useEffect(() => {
        ExamService.loadCategories()
        .then((response) => {
            setIsLoading(false);
            setEspecialidades(response.data);
    });
    }, [])

    if(isLoading){
            return(
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
 
    return(
        <div className="white">
            <CustomRow className="collection-header valign-wrapper"> {/* Added valign-wrapper here if it applies to the row */}
                {/* Assuming collection-header might not be a full row, or if it is, it's fine. */}
                {/* The valign-wrapper was on the Col, moved to Row for better structure or keep on Col if specific. */}
                <CustomCol s={10}><h3>{title}</h3></CustomCol>
                <CustomCol s={2} className="valign-wrapper"> {/* Kept valign-wrapper on Col if it's for this Col only */}
                    <CustomButton onClick={clearCache}>clear cache</CustomButton>
                </CustomCol>
            </CustomRow>
            <CustomTable striped>
            <thead>
            <tr>
                <th data-field="name">Name</th>
                <th data-field="description">Description</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
            <tfoot></tfoot>
        </Table>

        </div>
    )

}

Expecialidades.propTypes = {
    title: PropTypes.string
}

Expecialidades.defaultProps = {
    title: 'Especialidades'
}