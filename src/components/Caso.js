import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
//import FacebookProvider, { Comments } from 'react-facebook';
import ExamService from "../services/ExamService";
import Pregunta from "./Pregunta";
import Auth from "../modules/Auth";
import { useHistory } from 'react-router-dom';
import { alertError } from "../services/AlertService";

const Caso = (props) => {
  const { clinicCaseId } = props;
  const history = useHistory();

  const [next, setNext] = useState(2);
  const [data, setData] = useState([]);
  const [casoClinico, setCasoClinico] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [goNext, setGoNext] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

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
      return;
    } else {
      let shouldGoNext = true;
      const unansweredQuestions = selectedAnswers.filter(answer => !answer.id || answer.id === 0);
      if(unansweredQuestions.length > 0){
        shouldGoNext = false;
      }

      if (shouldGoNext) {
        sendAnswers(selectedAnswers);
      }
      setGoNext(shouldGoNext);
      setShowAnswers(shouldGoNext);
      if(!shouldGoNext){
        alertError('Espera', 'No has respondido todas las preguntas, respondelas para poder continuar');
      }
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
        alertError('Enarm simulator', 'Ocurrio un erro al guardar las respuestas');
        console.log("tronadera", error);
      });
  };

  const loadPreguntas = (currentClinicCaseId) => {
    let caseIdToLoad = currentClinicCaseId;
    var newNext = parseInt(caseIdToLoad) + 1;
  
    setNext(newNext);

    ExamService.getQuestions(caseIdToLoad)
      .then((response) => {
        var responseData = response.data;
        if(responseData.length === 0){
          alertError('Opps', 'No Se encontraron mas preguntas!');
          return;
        }
      
        const {questions, description} = responseData;
        var initialSelectedAnswers = [];
        for (var i = 0; i < questions.length; i++) {
          initialSelectedAnswers.push({ id: 0 });
        }

        setData(questions);
        setSelectedAnswers(initialSelectedAnswers);
        setCasoClinico(description);
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
    </div>
  );
};

Caso.propTypes = {
  clinicCaseId: PropTypes.number,
  history: PropTypes.object, // history is passed by withRouter
};

export default Caso;
