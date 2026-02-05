import { useState, useEffect } from "react";
import PropTypes from "prop-types";
//import FacebookProvider, { Comments } from 'react-facebook';
import ExamService from "../services/ExamService";
import Pregunta from "./Pregunta";
import Auth from "../modules/Auth";
import { useHistory } from 'react-router-dom';
import { alertError } from "../services/AlertService";
import Util from "../commons/Util";
import { CustomButton, CustomPreloader } from "./custom";

const Caso = (props) => {
  const { clinicCaseId } = props;
  const history = useHistory();

  const [next, setNext] = useState(2);
  const [data, setData] = useState([]);
  const [casoClinico, setCasoClinico] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [goNext, setGoNext] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectOption = (questionIndex, answerIndex) => {
    let newSelectedAnswers = [...selectedAnswers];
    let currentData = data;
    const answer = currentData[questionIndex].answers[answerIndex];
    const isMultiple = currentData[questionIndex].answers.filter(a => a.is_correct).length > 1;

    if (isMultiple) {
      let currentSelection = Array.isArray(newSelectedAnswers[questionIndex]) ? newSelectedAnswers[questionIndex] : [];
      if (currentSelection.some(a => a.id === answer.id)) {
        currentSelection = currentSelection.filter(a => a.id !== answer.id);
      } else {
        currentSelection = [...currentSelection, answer];
      }
      newSelectedAnswers[questionIndex] = currentSelection;
    } else {
      newSelectedAnswers[questionIndex] = answer;
    }

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

    setIsSaving(true);
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
        Util.showToast('<div class="valign-wrapper"><i class="material-icons left">check_circle</i> Respuestas guardadas</div>');
      })
      .catch((error) => {
        alertError('Enarm simulator', 'Ocurrio un erro al guardar las respuestas');
        console.log("tronadera", error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const loadPreguntas = (currentClinicCaseId) => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.log("OCurrio un error", error);
        setLoading(false);
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

  if (loading) {
    return (
      <div className="center-align" style={{ padding: '50px' }}>
        <CustomPreloader active color="green" size="big" />
      </div>
    );
  }

  return (
    <div className="col s12 m12 l12">
      <div className="col s12 m9 l9 offset-m1 offset-l1">
        <h6>Caso Clinico:</h6>
        <p>{casoClinico}</p>
      </div>
      {preguntas}
      <div className="row">
        <div className="col offset-s3 offset-m4 offset-l8">
          <CustomButton
            onClick={checkAnswers}
            aria-label={showAnswers ? "Ir al siguiente caso" : "Calificar respuestas"}
            isPending={isSaving}
            isPendingText="Guardando..."
            icon={showAnswers ? "navigate_next" : "assignment_turned_in"}
            iconPosition="right"
          >
            {showAnswers ? "Siguiente" : "Calificar"}
          </CustomButton>
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
