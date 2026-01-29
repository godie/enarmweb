import { useState, useEffect } from "react";
import PropTypes from "prop-types";
//import FacebookProvider, { Comments } from 'react-facebook';
import ExamService from "../services/ExamService";
import Pregunta from "./Pregunta";
import Auth from "../modules/Auth";
import { useHistory } from 'react-router-dom';
import { alertError } from "../services/AlertService";
import Util from "../commons/Util";

const Caso = (props) => {
  const { clinicCaseId } = props;
  const history = useHistory();

  const [next, setNext] = useState(2);
  const [data, setData] = useState([]);
  const [casoClinico, setCasoClinico] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [goNext, setGoNext] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const checkAnswers = (e) => {
    e.preventDefault();
    if (goNext) {
      setGoNext(false);
      setShowAnswers(false);
      history.push("/caso/" + next);
      return;
    } else {
      let shouldGoNext = true;
      const unansweredQuestions = selectedAnswers.filter(answer => {
        if (Array.isArray(answer)) {
          return answer.length === 0;
        }
        return !answer.id || answer.id === 0;
      });
      if (unansweredQuestions.length > 0) {
        shouldGoNext = false;
      }

      if (shouldGoNext) {
        sendAnswers(selectedAnswers);
      }
      setGoNext(shouldGoNext);
      setShowAnswers(shouldGoNext);
      if (!shouldGoNext) {
        alertError('Espera', 'No has respondido todas las preguntas, respondelas para poder continuar');
      }
    }
  };

  const sendAnswers = (answers) => {
    const userInfo = Auth.getUserInfo();
    if (!userInfo) {
      alertError('Simulador', 'Debes iniciar sesión para guardar tus respuestas');
      return;
    }

    const userAnswers = [];
    answers.forEach(answer => {
      if (Array.isArray(answer)) {
        answer.forEach(a => {
          userAnswers.push({
            question_id: a.question_id,
            answer_id: a.id,
          });
        });
      } else if (answer.id > 0) {
        userAnswers.push({
          question_id: answer.question_id,
          answer_id: answer.id,
        });
      }
    });

    const payload = {
      user_answers: userAnswers
    };

    ExamService.sendAnswers(payload)
      .then(() => {
        Util.showToast("se guardaron las respuestas");
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
        if (responseData.length === 0) {
          alertError('Opps', 'No Se encontraron mas preguntas!');
          return;
        }

        const { questions, description } = responseData;
        var initialSelectedAnswers = [];
        for (var i = 0; i < questions.length; i++) {
          const isMultiple = questions[i].answers.filter(a => a.is_correct).length > 1;
          initialSelectedAnswers.push(isMultiple ? [] : { id: 0 });
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
    const currentSelection = selectedAnswers[index];
    const selectedAnswerProp = Array.isArray(currentSelection)
      ? currentSelection.map(a => a.id)
      : (currentSelection ? currentSelection.id : null);

    return (
      <Pregunta
        key={pregunta.id || index}
        pregunta={pregunta}
        question_id={pregunta.id}
        selectedAnswer={selectedAnswerProp}
        onAnswerSelected={(questionId, answerId) => {
          const question = data.find(q => q.id === questionId);
          const answer = question.answers.find(a => a.id === answerId);
          const qIndex = data.findIndex(q => q.id === questionId);

          if (qIndex !== -1 && answer) {
            const isMultiple = question.answers.filter(a => a.is_correct).length > 1;
            const newSelectedAnswers = [...selectedAnswers];

            if (isMultiple) {
                let currentArray = Array.isArray(newSelectedAnswers[qIndex]) ? newSelectedAnswers[qIndex] : [];
                if (currentArray.some(a => a.id === answer.id)) {
                    currentArray = currentArray.filter(a => a.id !== answer.id);
                } else {
                    currentArray = [...currentArray, answer];
                }
                newSelectedAnswers[qIndex] = currentArray;
            } else {
                newSelectedAnswers[qIndex] = answer;
            }
            setSelectedAnswers(newSelectedAnswers);
          }
        }}
        showFeedback={showAnswers}
        isExamMode={false}
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
  history: PropTypes.object,
};

export default Caso;
