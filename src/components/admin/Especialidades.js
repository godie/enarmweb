import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Button, Col, Icon, Preloader, Row, Table } from "react-materialize";
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
                <Row>
                <Col s={5}>
                    <Preloader active color="green" flashing size="big" />
                </Col>
              ;  </Row>
            )
        }

    const rows = especialidades.map(especialidad => (
    <tr key={especialidad.id}>
        <td>{especialidad.name}</td>
        <td>{especialidad.description}</td>
        <td><Link to={`/dashboard/edit/especialidad/${especialidad.id}`} className="secondary-content">
            <Button
          tooltip="Editar especialidad"
          className="btn-flat"
          icon={<Icon>edit</Icon>}
          /> </Link></td>
    </tr>
    ));

    const clearCache = () => {
        EnarmUtil.clearCategories();
    }
 
    return(
        <div className="white">
            <div className="collection-header">
            <Col s={10}><h3>{title}</h3></Col>
            <Col s={2} className="valign-wrapper"><Button onClick={clearCache}>clear cache</Button></Col>
            </div>
        <Table striped>
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