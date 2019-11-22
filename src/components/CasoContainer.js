import React from 'react';
import CasoForm from './CasoForm';
import ExamService from '../services/ExamService';
import Util from '../commons/Util';
import Materialize from 'materialize-css';
import SweetAlert from 'sweetalert2-react';
 
import 'sweetalert/dist/sweetalert.css';
import { createBrowserHistory } from "history";




class CasoContainer extends React.Component {
     browserHistory;

    constructor(props){
      super(props);
      var clinicCaseId = this.getCategory(this.props);
      this.state = {
        clinicCaseId:clinicCaseId,
        errors: {},
        showAlert:false,
        alert: {
          title:'',
          type:'info',
          message:'',
          show : false
        },
        caso:{
          description:'Un caso clinico nuevo',
          questions:[],
      }};
      this.processForm = this.processForm.bind(this);
      this.addQuestion = this.addQuestion.bind(this);
      this.changeCaso = this.changeCaso.bind(this);
      this.onChangeAnswer = this.onChangeAnswer.bind(this);
      this.onChangeQuestion = this.onChangeQuestion.bind(this);
      this.addAnswer = this.addAnswer.bind(this);
      this.deleteAnswer = this.deleteAnswer.bind(this);
      this.deleteQuestion = this.deleteQuestion.bind(this);
      this.inputElement = null;
      this.currentId = null;
      this.destroyQuestions = [];
      this.destroyAnswers = [];
      this.onCancel = this.onCancel.bind(this);
       this.browserHistory = createBrowserHistory();

    }
  /**
   * 
   * @param { nextPage = (index) => {
        this.props.history.push('/'+index)
    }} props 
   */
  
    getCategory = (props) => {
      var clinicCaseId = 0;
      console.log(props);
      if (!Util.isEmpty(props.match.params)) {
          if(!isNaN(parseInt(props.match.params.identificador))){
            clinicCaseId = props.match.params.identificador;
          }
      }
      return clinicCaseId;
    }
    processForm(event) {
      // prevent default action. in this case, action is the form submission event
      event.preventDefault();
      let clinicalCase = this.prepareClinicalCase(this.state.caso);
      ExamService.saveCaso(clinicalCase)
      .then((response) => {
          //console.log(response);
          //alert('se guardo correctamente');
          let alert = {  ...this.state.alert, title:'Caso Clinico', message:'Se ha guardado correctamente', type:'success', show: true }
          this.setState({ alert: alert});
      }).catch((error)=>{
        console.log("ocurrio un erro",error);
        //alert('ha ocurrido un error');
        let alert = {  ...this.state.alert, title:'Caso Clinico', message:'Ha ocurrido un error, no se pudo guardar', type:'error', show:true }
        this.setState({ alert: alert});
      });
    }
  
    prepareClinicalCase = (caso) => {
  
        let questions = caso.questions;
        let questions_attributes = [];
  
        for(var question of questions){
            //console.log(question);
            let answers = this.processAnswers(question.answers);
            let preparedQuestion = {text: question.text, answers_attributes: answers}
            if(question.id === 0 ){
              questions_attributes.push(preparedQuestion);
            }else{
              questions_attributes.push(Object.assign({},{id: question.id},preparedQuestion));
            }
        }
        let clinicalCase = {id: caso.id, description:caso.description, questions_attributes: questions_attributes};
        return clinicalCase;
    }
  
    processAnswers = (answers) => {
      let answers_attributes = [];
      for(var answer of answers){
        let prepareAnswer = {text:answer.text, is_correct:answer.is_correct, description:answer.description};
          if(answer.id > 0){
            answers_attributes.push(Object.assign({},{id:answer.id},prepareAnswer));
          } else{
            answers_attributes.push(prepareAnswer);
          }
      }
      return answers_attributes;
    }
  
    addQuestion(){
      let newQuestion = {id:0,text:'Pregunta',answers:[]};
      const caso = this.state.caso;
      this.currentId = 'question-'+caso.questions.length;
      caso.questions.push(newQuestion);
  
      this.setState({caso});
    }
  
    deleteQuestion(index){
      const caso = this.state.caso;
      caso.questions.splice(index,1);
  
      this.setState(
        {caso : caso}
      );
  
    }
  
    addAnswer(index,event){
      let newAnswer = {id:0,text:'Respuesta',is_correct:false, description:''};
      const caso = this.state.caso;
      this.currentId = 'answer-'+index+'-'+caso.questions[index].answers.length;
      caso.questions[index].answers.push(newAnswer);
      this.setState({caso});
  
    }
    deleteAnswer(questionIndex,index,event){
      const caso = this.state.caso;
      let answer = caso.questions[questionIndex].answers[index];
      if(answer.id > 0){
  
      }
      caso.questions[questionIndex].answers.splice(index,1);
  
      this.setState(
        {caso:caso}
      );
  
    }
    changeCaso(event){
  
      const field = event.target.name;
      const caso = this.state.caso;
      caso[field] = event.target.value;
  
  
      this.setState({
        caso:caso
      });
    }
  /**
   * 
   * @param {*} questionIndex 
   * @param {*} answerIndex 
   * @param {*} event 
   * When a value of answer change it invokes this method, to update the state
   */
    onChangeAnswer(questionIndex,index,field, event){
    
      const caso = this.state.caso;
      //const field = event.target.name;
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;

    console.log(field, target, questionIndex, index);
  
      caso.questions[questionIndex].answers[index][field] = value;
  
      this.setState({
        caso:caso
      });
    }
    onChangeQuestion(index,event){
      const caso = this.state.caso;
      caso.questions[index].text = event.target.value;
      this.setState({
        caso:caso
      });
    }
  
    onCancel(event){
      event.preventDefault();
      console.log(this.browserHistory);
      this.browserHistory.goBack();
  
    }
  
  
  
    componentDidMount() {
  
        if(this.state.clinicCaseId > 0){
          ExamService.getCaso(this.state.clinicCaseId)
          .then((response) => {
              this.setState({caso: response.data});
              Materialize.updateTextFields();
          })
          .catch((error) => {
            console.log("OCurrio un error",error)
          });
        }
    }
    componentDidUpdate(prevProps, prevState) {
      console.log('a');
      if(this.currentId != null){
          document.getElementById(this.currentId).focus();
          this.currentId = null;
        }
    }
  
    render () {
        return(
          <div>
          <CasoForm
          onSubmit={this.processForm}
          onChange={this.changeCaso}
          errors={this.state.errors}
          caso={this.state.caso}
          addQuestion={this.addQuestion}
          deleteQuestion={this.deleteQuestion}
          onChangeAnswer={this.onChangeAnswer}
          onChangeQuestion={this.onChangeQuestion}
          addAnswer={this.addAnswer}
          deleteAnswer={this.deleteAnswer}
          onCancel={this.onCancel}
  
          />
          <SweetAlert
              show={this.state.alert.show}
              title={this.state.alert.title}
              type={this.state.alert.type}
              text={this.state.alert.message}
              onConfirm={() => this.setState({ alert : {show :  false} })}
            />
      </div>
        )
    }
  }

  export default CasoContainer;
