import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
//import FacebookProvider, { Comments } from 'react-facebook';
import ExamService from "../services/ExamService";
import Pregunta from "./Pregunta";
import Auth from "../modules/Auth";
import SweetAlert from "sweetalert2-react";
import "sweetalert2/dist/sweetalert2.css";
import { withRouter } from 'react-router-dom';
import { alertError } from "../services/AlertService";

const Caso = (props) => {
  const { clinicCaseId, history } = props;

  const [next, setNext] = useState(2);
  const [current, setCurrent] = useState(clinicCaseId);
  const [prev, setPrev] = useState(0);
  const [data, setData] = useState([]);
  const [casoClinico, setCasoClinico] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [goNext, setGoNext] = useState(false);
  const [width, setWidth] = useState(300); // Still included, as per analysis
  const [height, setHeight] = useState(80); // Still included, as per analysis
  const [showAnswers, setShowAnswers] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Added for SweetAlert

  const handleSelectOption = (questionIndex, answerIndex, changeEvent) => {
    let newSelectedAnswers = [...selectedAnswers];
    let currentData = data;
    newSelectedAnswers[questionIndex] = currentData[questionIndex].answers[answerIndex];

    setSelectedAnswers(newSelectedAnswers);
  };

  // componentDidMount and componentWillReceiveProps will be replaced by useEffect

  const checkAnswers = (e) => {
    e.preventDefault();
    if (goNext) {
      setGoNext(false);
      setShowAnswers(false);
      history.push("/caso/" + next);
    } else {
      let currentSelectedAnswers = selectedAnswers;
      let shouldGoNext = true;
      for (let selectedAnswer of currentSelectedAnswers) {
        if (selectedAnswer.id === 0) {
          shouldGoNext = false;
        }
      }
      if (shouldGoNext) {
        sendAnswers(currentSelectedAnswers);
      }
      setGoNext(shouldGoNext);
      setShowAnswers(shouldGoNext);
      setShowAlert(!shouldGoNext);
    }
  };

  const sendAnswers = (answers) => {
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
  };

  const loadPreguntas = (currentClinicCaseId) => {
    let caseIdToLoad = currentClinicCaseId;
    if (caseIdToLoad > 40) {
      caseIdToLoad = 1;
    }
    var newNext = parseInt(caseIdToLoad) + 1;
    var newPrev = parseInt(caseIdToLoad) - 1;

    setCurrent(caseIdToLoad);
    setNext(newNext);
    setPrev(newPrev);

    ExamService.getQuestions(caseIdToLoad)
      .then((response) => {
        var responseData = response.data;
        if(responseData.length === 0){
          alertError('Opps', 'No Se encontraron mas preguntas!');
          return;
        }
        var nombre = responseData[0].clinical_case.description;
        var initialSelectedAnswers = [];
        for (var i = 0; i < responseData.length; i++) {
          initialSelectedAnswers.push({ id: 0 });
        }

        setData(responseData);
        setSelectedAnswers(initialSelectedAnswers);
        setCasoClinico(nombre);
      })
      .catch((error) => {
        console.log("OCurrio un error", error);
      });
  };

  useEffect(() => {
    loadPreguntas(clinicCaseId);
  }, [clinicCaseId]); // Runs on mount and when clinicCaseId changes

  var preguntas = data.map((pregunta, index) => {
    return (
      <Pregunta
        key={index}
        index={index}
        description={pregunta.text}
        answers={pregunta.answers}
        selectedAnswer={selectedAnswers[index]}
        handleSelectOption={handleSelectOption}
        showCorrectAnswer={showAnswers}
      />
    );
  });

  return (
    <div className="col s12 m12 l12 white">
      <div className="col s12 m9 l9 offset-m1 offset-l1">
        <h6>Caso Clinico:</h6>
        <p>{casoClinico}</p>
      </div>
      {preguntas}
      <div className="row">
        <div className="col offset-s3 offset-m4 offset-l8">
          <button
            onClick={checkAnswers}
            className="waves-effect btn"
          >
            <i className="material-icons right">navigate_next</i>Siguiente
          </button>
        </div>
      </div>
      <SweetAlert
        show={showAlert}
        title="Espera.."
        text="No has respondido todas las preguntas, respondelas para poder continuar"
        type="warning"
        onConfirm={() => setShowAlert(false)}
      />
    </div>
  );
};

Caso.propTypes = {
  clinicCaseId: PropTypes.number,
  history: PropTypes.object, // history is passed by withRouter
};

export default withRouter(Caso);
