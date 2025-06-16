import React, { Component } from "react";
import PropTypes from "prop-types";
//import FacebookProvider, { Comments } from 'react-facebook';
import ExamService from "../services/ExamService";
import Pregunta from "./Pregunta";
import Auth from "../modules/Auth";
import SweetAlert from "sweetalert2-react";
import "sweetalert2/dist/sweetalert2.css";
import { withRouter } from 'react-router-dom';
import { alertError } from "../services/AlertService";

class Caso extends Component {
  constructor(props) {
    super(props);
    var clinicCaseId = this.props.clinicCaseId;

    this.state = {
      next: 2,
      current: clinicCaseId,
      prev: 0,
      data: [],
      caso_clinico: "",
      selectedAnswers: [],
      goNext: false,
      width: 300,
      height: 80,
      showAnswers: false,
    };
    this.handleSelectOption = this.handleSelectOption.bind(this);
  }

  handleSelectOption(questionIndex, answerIndex, changeEvent) {
    let selectedAnswers = this.state.selectedAnswers;
    let data = this.state.data;
    selectedAnswers[questionIndex] = data[questionIndex].answers[answerIndex];

    this.setState({
      selectedAnswers: selectedAnswers,
    });
  }

  componentDidMount() {
    var clinicCaseId = this.props.clinicCaseId;
    this.loadPreguntas(clinicCaseId);
  }

  componentWillReceiveProps(nextProps) {
    var clinicCaseId = nextProps.clinicCaseId;
    //console.log(nextProps);
    this.loadPreguntas(clinicCaseId);
  }

  checkAnswers(e) {
    e.preventDefault();
    if (this.state.goNext) {
      this.setState({ goNext: false, showAnswers: false });
      const { history } = this.props;
      history.push("/caso/" + this.state.next);
    } else {
      let selectedAnswers = this.state.selectedAnswers;
      let goNext = true;
      for (let selectedAnswer of selectedAnswers) {
        if (selectedAnswer.id === 0) {
          goNext = false;
        }
      }
      if (goNext) {
        this.sendAnswers(selectedAnswers);
      }
      this.setState({
        goNext: goNext,
        showAnswers: goNext,
        showAlert: !goNext,
      });
    }
  }

  sendAnswers(answers) {
    let fbUser = JSON.parse(Auth.getFacebookUser());
    let playerAnswers = { facebook_id: fbUser.facebook_id, player_answers: [] };
    for (let answer of answers) {
      playerAnswers.player_answers.push({
        question_id: answer.question_id,
        answer_id: answer.id,
      });
    }
    ExamService.sendAnswers(playerAnswers)
      .then((response) => {
        console.log("se guardaron las respuestas");
      })
      .catch((error) => {
        console.log("tronadera", error);
      });
  }

  loadPreguntas(clinicCaseId) {
    if (clinicCaseId > 40) {
      clinicCaseId = 1;
    }
    var next = parseInt(clinicCaseId) + 1;
    var prev = parseInt(clinicCaseId) - 1;

    this.setState({ current: clinicCaseId, next: next, prev: prev });

    ExamService.getQuestions(clinicCaseId)
      .then((response) => {
        //  console.log(response);
        var data = response.data;
        if(data.length === 0){
          alertError('Opps', 'No Se encontraron mas preguntas!');
          return;
        }
        var nombre = data[0].clinical_case.description;
        var selectedAnswers = [];
        for (var i = 0; i < data.length; i++) {
          selectedAnswers.push({ id: 0 });
        }

        this.setState({
          data: response.data,
          selectedAnswers: selectedAnswers,
        });
        this.setState({ caso_clinico: nombre });
      })
      .catch((error) => {
        console.log("OCurrio un error", error);
      });
  }

  render() {
    var preguntas = this.state.data.map((pregunta, index) => {
      return (
        <Pregunta
          key={index}
          index={index}
          description={pregunta.text}
          answers={pregunta.answers}
          selectedAnswer={this.state.selectedAnswers[index]}
          handleSelectOption={this.handleSelectOption}
          showCorrectAnswer={this.state.showAnswers}
        />
      );
    });

    return (
      <div className="col s12 m12 l12 white">
        <div className="col s12 m9 l9 offset-m1 offset-l1">
          <h6>Caso Clinico:</h6>
          <p>{this.state.caso_clinico}</p>
        </div>
        {preguntas}
        <div className="row">
          <div className="col offset-s3 offset-m4 offset-l8">
            <button
              onClick={this.checkAnswers.bind(this)}
              className="waves-effect btn"
            >
              <i className="material-icons right">navigate_next</i>Siguiente
            </button>
          </div>
        </div>
        <SweetAlert
          show={this.state.showAlert}
          title="Espera.."
          text="No has respondido todas las preguntas, respondelas para poder continuar"
          type="warning"
          onConfirm={() => this.setState({ showAlert: false })}
        />
      </div>
    );
  }
}

Caso.propTypes = {
  clinicCaseId: PropTypes.number,
  router: PropTypes.object,
};

export default withRouter(Caso);
