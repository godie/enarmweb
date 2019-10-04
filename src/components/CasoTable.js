import React from 'react';
import ExamService from '../services/ExamService';
import EnarmUtil from '../modules/EnarmUtil';
import Util from '../commons/Util';
import { Select, Dropdown, Button } from 'react-materialize';


class CasoTable extends React.Component {

    constructor(props){
        super(props);
        this.state = {data:[
                          {
                            id:1,
                            name:"Caso clinico de prueba 1",
                            category_id:0
                          }
                          ],
                          total_cases:0,
                          categories:[]};
        this.page = this.getPage(props);
        this.itemsPerPage = 10;
      }

      componentDidMount() {
        ExamService.getExams(this.page)
        .then((response) => {
            this.setState({data : response.data.clinical_cases, total_cases:response.data.total_entries});
        })
        .catch((error) => {
          console.log("ocurrio un erro",error);
        });
  
        let categories = EnarmUtil.getCategories()
        console.log("categories=",categories);
        if(categories === null){
          ExamService.loadCategories()
          .then((response) => {
              EnarmUtil.setCategories(JSON.stringify(response.data));
              this.setState({categories:response.data});
          })
          .catch((error) => {
            console.log("ocurrio un error",error);
          })
        }else{
          categories = JSON.parse(categories);
          this.setState({categories:categories});
          //EnarmUtil.setCategories(categories);
        }
    }

    paginateCases(page,amount){
        return this.state.data;
  }

  getPage(props){
      let page = 1;
     if (!EnarmUtil.isEmpty(props.params)) {
         console.log(props.params);
       /* if(!isNaN(parseInt(props.params.page))){
          page = props.params.page;
        }*/
    }
    return page;
  }

  componentWillReceiveProps(nextProps) {
    var currentPage = this.getPage(nextProps);

    if(nextProps.location.action === "POP"){
          this.page = currentPage;
      ExamService.getExams(currentPage)
      .then((response) => {
          this.setState({data : response.data.clinical_cases, total_cases:response.data.total_entries});
      })
      .catch((error) => {
        console.log("ocurrio un erro",error);
      });          
    }
  }

  changeCategory(caso,index,event){
    
    let realIndex = ((this.page-1)*this.itemsPerPage)+index;
    let category_id = parseInt(event.target.value);
    caso.category_id = category_id
    ExamService.saveCaso(caso)
    .then((response) => {
        Util.showToast('Se actualizo la especialidad');
      let casoUpdated = response.data;
      const casos = this.state.data;
      casos[realIndex] = casoUpdated;
      this.setState({data:casos});
    })
    .catch((error)=>{
      console.log("ocurrio un erro",error);
        Util.showToast('No se pudo actualizar la especialidad');
    })
  }

  render() {
    var especialidadesOptions = this.state.categories.map((especialidad, index)=>{
        return(
          <option value={especialidad.id} key={especialidad.id}>{especialidad.name}</option>
        )
      });
console.log(especialidadesOptions);
      return(
        <Select label="Choose your option" value="0">
                        {especialidadesOptions}
                        </Select>
      )
  }
}

export default CasoTable;
