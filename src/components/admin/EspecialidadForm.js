import React, { useEffect, useState } from "react";
import { Row,Col, TextInput, Textarea, Button } from "react-materialize";
import { createBrowserHistory } from "history";
import ExamService from "../../services/ExamService";
import { alertError, alertSuccess} from "../../services/AlertService";
import { useParams } from "react-router-dom";


export default function EspecialidadForm(props){
    const{ identificador } = useParams();
    const[formData, setFormDData] = useState({
        id:'0',
        name: '',
        description: '',
    });

    useEffect(() => {
      if(identificador !== undefined && identificador > 0){
        ExamService.getCategory(identificador).then(response => {
          const {data} = response;
          setFormDData({id: data.id, name: data.name, description: data.description || ''});
        }).catch(err => alertError('ops!', 'ocurrio un error al cargar la especialidad'))
      }
    },[identificador]);
    const handleChange = (event) => {
        setFormDData({...formData, [event.target.name]:event.target.value});
    }
    const browserHistory = createBrowserHistory();

    const onCancel = (e) => {
        e.preventDefault();
        browserHistory.goBack();
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        console.log('sending form.')
        ExamService.saveCategory(formData)
        .then((response) => alertSuccess('Especialidad!', 'creada correctamente').then(() => browserHistory.goBack()))
        .catch((err)=> alertError('ops!', 'ocurrio un error'));
        
    }

    return(
        <Col s={12} m={12} l={12} className="white">
        <form onSubmit={onSubmit}>
            <h3 className="center">Especialidad</h3>
            <Row>
            <TextInput type="hidden" name="id" value={formData.id.toString()} s={1}/>
            </Row>
            <Row>
                <TextInput label="Especialidad" s={10} name="name" onChange={handleChange} value={formData.name} />
            </Row>
            <Row>
                <Textarea label="Description" s={10} onChange={handleChange} name="description" value={formData.description}/>
            </Row>
            <Row>
        <div className="divider"></div>
        <Col s={12}>
          <Col s={6}>
            <p className="left-align">
              <Button
                large
                label="Cancelar"
                type="button"
                waves="light"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </p>
          </Col>
          <Col s={6}>
            <p className="right-align">
              <Button large label="Guardar" type="submit" waves="light" tooltip="Guardar Caso">
                Guardar
              </Button>
            </p>
          </Col>
        </Col>
      </Row>
        </form>
        </Col>
    );

}