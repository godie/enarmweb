import React from 'react';
import ExamService from '../services/ExamService';
import EnarmUtil from '../modules/EnarmUtil';
import Util from '../commons/Util';
import { Row, Select, Preloader, Pagination, Collection, CollectionItem, Col, Icon } from 'react-materialize';
import { Link } from "react-router-dom";



class CasoTable extends React.Component {

    constructor(props) {
        super(props);
        var page = 1;
        if(!EnarmUtil.isUndefined(props.match)){
            page = props.match.params.page;
        }

        this.state = {
            data: null,
            total_cases: 0,
            categories: [], 
            page : page,
            itemsPerPage : 10
        };
        //this.page = this.getPage(props.match);
        //this.itemsPerPage = 10;
        

        
    }

    componentDidMount() {
        ExamService.getExams(this.state.page)
            .then((response) => {
                this.setState({ data: response.data.clinical_cases, total_cases: response.data.total_entries });
            })
            .catch((error) => {
                console.log("ocurrio un erro", error);
            });

        let categories = EnarmUtil.getCategories()
        //console.log("categories=", categories);
        if (categories === null) {
            ExamService.loadCategories()
                .then((response) => {
                    EnarmUtil.setCategories(JSON.stringify(response.data));
                    this.setState({ categories: response.data });
                })
                .catch((error) => {
                    console.log("ocurrio un error", error);
                })
        } else {
            categories = JSON.parse(categories);
            this.setState({ categories: categories });
            //EnarmUtil.setCategories(categories);
        }
    }

    paginateCases(page, amount) {
        return this.state.data;
    }

    getPage(props) {
        let page = 1;
        if (!EnarmUtil.isEmpty(props.params)) {
            
             if(!isNaN(parseInt(props.params.page))){
               page = props.params.page;
             }
        }
        return page;
    }


    componentDidUpdate(prevProps, prevState){
        if(this.state.data === null){
            var currentPage = this.state.page;
            
        ExamService.getExams(currentPage)
                .then((response) => {
                    this.setState({ data: response.data.clinical_cases, total_cases: response.data.total_entries });
                })
                .catch((error) => {
                    console.log("ocurrio un erro", error);
                });
            }
            
    }

    static getDerivedStateFromProps(props, state) {
        var currentPage = state.page;
        if (props.match.params.page !== currentPage && props.match.params.page !== undefined) {
            return {
                data : null,
                page : props.match.params.page
            }
        }
        return null;


    }

    changeCategory = (caso, index, event) => { 

        let realIndex = ((this.page - 1) * this.itemsPerPage) + index;
        let category_id = parseInt(event.target.value);
        caso.category_id = category_id
        ExamService.saveCaso(caso)
            .then((response) => {
                Util.showToast('Se actualizo la especialidad');
                let casoUpdated = response.data;
                const casos = this.state.data;
                casos[realIndex] = casoUpdated;
                this.setState({ data: casos });
            })
            .catch((error) => {
                console.log("ocurrio un erro", error);
                Util.showToast('No se pudo actualizar la especialidad');
            })
    }

    nextPage = (index) => {
        this.props.history.push('/casos/'+index)
    }
    render() {
        
        if(this.state.data === null){
            return (<Preloader size="big" />)
        }
        var especialidadesOptions = this.state.categories.map((especialidad, index) => {
            return (
                <option value={especialidad.id} key={especialidad.id}>{especialidad.name}</option>
            )
        });

        var casos = this.state.data.map((caso,index) => {
            var category_id  = caso.category_id;
            console.log(category_id);
            return (<CollectionItem key={index}>
            <Row>
            <Col m={4} s={12}>
            <Select s={12} label="Especialidad" value={category_id.toString()} onChange={(event)=> this.changeCategory(caso,index,event)}>
                <option value="0" key="0">Sin Especialidad</option>
                {especialidadesOptions}
            </Select>
            </Col>
            <Col m={7} s={12}>
                {caso.description}
            </Col>
            <Link to={"/edit/caso/"+caso.id} alt="ver preguntas" className="secondary-content">
            <Icon>edit</Icon>
            </Link>
            </Row>
            </CollectionItem>);
        });
        var titleHeader = "Casos Clinicos("+this.state.total_cases+")";
        console.log(this.state);
        var page = 1;
        if(this.state.page){
            page = this.state.page;
        }
        return (
            <Collection header={titleHeader}>
            <Pagination activePage={parseInt(page)} maxButtons={8} items={this.state.itemsPerPage} onSelect={this.nextPage}/>
                {casos}
            <Pagination activePage={parseInt(page)} maxButtons={8} items={this.state.itemsPerPage} onSelect={this.nextPage}/>

            </Collection>
        )
    }
}

export default CasoTable;
