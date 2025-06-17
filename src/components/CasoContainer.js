import React, { useState, useEffect, useRef } from "react";
import CasoForm from "./CasoForm";
import ExamService from "../services/ExamService";
import Util from "../commons/Util";
import Materialize from "materialize-css";
import SweetAlert from "sweetalert2-react";
import { useHistory, useParams, withRouter } from 'react-router-dom'; // Added withRouter for now, can be removed if props are not used from it directly.

import "sweetalert2/dist/sweetalert2.css";
// import { createBrowserHistory } from "history"; // Not needed

const CasoContainer = (props) => { // props might still be needed if withRouter provides something essential not covered by hooks
  const history = useHistory();
  const { identificador } = useParams();
  const currentIdRef = useRef(null);

  // State initialization
  const [clinicCaseId, setClinicCaseId] = useState(0);
  const [errors, setErrors] = useState({});
  // const [showAlert, setShowAlert] = useState(false); // Replaced by alert.show
  const [alert, setAlertState] = useState({ // Renamed setAlert to avoid conflict with window.alert
    title: "",
    type: "info",
    message: "",
    show: false,
  });
  const [caso, setCaso] = useState({
    description: "Un caso clinico nuevo",
    questions: [],
  });

  // Removed getCategory, logic incorporated into useEffect

  const processForm = (event) => {
    event.preventDefault();
    let clinicalCaseToSave = prepareClinicalCase(caso);
    ExamService.saveCaso(clinicalCaseToSave)
      .then((response) => {
        setAlertState({
          title: "Caso Clinico",
          message: "Se ha guardado correctamente",
          type: "success",
          show: true,
        });
      })
      .catch((error) => {
        console.log("ocurrio un erro", error);
        setAlertState({
          title: "Caso Clinico",
          message: "Ha ocurrido un error, no se pudo guardar",
          type: "error",
          show: true,
        });
      });
  };

  const prepareClinicalCase = (currentCaso) => {
    let questions = currentCaso.questions;
    let questions_attributes = [];

    for (var question of questions) {
      let processedAnswers = processAnswers(question.answers);
      let preparedQuestion = {
        text: question.text,
        answers_attributes: processedAnswers,
      };
      if (question.id === 0) {
        questions_attributes.push(preparedQuestion);
      } else {
        questions_attributes.push(
          Object.assign({}, { id: question.id }, preparedQuestion)
        );
      }
    }
    let clinicalCaseToSave = {
      id: currentCaso.id,
      description: currentCaso.description,
      category_id: 1, // Assuming category_id is static or handled elsewhere
      questions_attributes: questions_attributes,
    };
    return clinicalCaseToSave;
  };

  const processAnswers = (answersToProcess) => {
    let answers_attributes = [];
    for (var answer of answersToProcess) {
      let preparedAnswer = {
        text: answer.text,
        is_correct: answer.is_correct,
        description: answer.description,
      };
      if (answer.id > 0) {
        answers_attributes.push(
          Object.assign({}, { id: answer.id }, preparedAnswer)
        );
      } else {
        answers_attributes.push(preparedAnswer);
      }
    }
    return answers_attributes;
  };

  const addQuestion = () => {
    let newQuestion = { id: 0, text: "Pregunta", answers: [] };
    currentIdRef.current = "question-" + caso.questions.length;
    setCaso(prevCaso => ({
      ...prevCaso,
      questions: [...prevCaso.questions, newQuestion]
    }));
  };

  const deleteQuestion = (index) => {
    setCaso(prevCaso => ({
      ...prevCaso,
      questions: prevCaso.questions.filter((_, i) => i !== index)
    }));
  };

  const addAnswer = (questionIndex) => {
    let newAnswer = {
      id: 0,
      text: "Respuesta",
      is_correct: false,
      description: "",
    };
    currentIdRef.current = "answer-" + questionIndex + "-" + caso.questions[questionIndex].answers.length;
    setCaso(prevCaso => {
      const newQuestions = prevCaso.questions.map((q, i) => {
        if (i === questionIndex) {
          return {
            ...q,
            answers: [...q.answers, newAnswer]
          };
        }
        return q;
      });
      return { ...prevCaso, questions: newQuestions };
    });
  };

  const deleteAnswer = (questionIndex, answerIndex) => {
    setCaso(prevCaso => {
      const newQuestions = prevCaso.questions.map((q, i) => {
        if (i === questionIndex) {
          return {
            ...q,
            answers: q.answers.filter((_, ansIdx) => ansIdx !== answerIndex)
          };
        }
        return q;
      });
      return { ...prevCaso, questions: newQuestions };
    });
  };

  const changeCaso = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    setCaso(prevCaso => ({
      ...prevCaso,
      [field]: value
    }));
  };

  const onChangeAnswer = (questionIndex, answerIndex, field, event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    setCaso(prevCaso => {
      const newQuestions = prevCaso.questions.map((q, qIdx) => {
        if (qIdx === questionIndex) {
          const newAnswers = q.answers.map((ans, ansIdx) => {
            if (ansIdx === answerIndex) {
              return { ...ans, [field]: value };
            }
            return ans;
          });
          return { ...q, answers: newAnswers };
        }
        return q;
      });
      return { ...prevCaso, questions: newQuestions };
    });
  };

  const onChangeQuestion = (questionIndex, event) => {
    const value = event.target.value;
    setCaso(prevCaso => {
      const newQuestions = prevCaso.questions.map((q, qIdx) => {
        if (qIdx === questionIndex) {
          return { ...q, text: value };
        }
        return q;
      });
      return { ...prevCaso, questions: newQuestions };
    });
  };

  const onCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  useEffect(() => {
    let idFromParams = 0;
    if (identificador && !isNaN(parseInt(identificador))) {
      idFromParams = parseInt(identificador);
    }
    // setClinicCaseId(idFromParams); // This line is not strictly necessary as clinicCaseId state is not used elsewhere directly for now.

    if (idFromParams > 0) {
      ExamService.getCaso(idFromParams)
        .then((response) => {
          setCaso(response.data);
          // Ensure Materialize updates fields after data is loaded
          setTimeout(() => Materialize.updateTextFields(), 0);
        })
        .catch((error) => {
          console.log("OCurrio un error loading caso", error);
          setAlertState({ title: "Error", message: "No se pudo cargar el caso clínico.", type: "error", show: true });
        });
    } else {
      // Reset form for new case
      setCaso({ description: "Un caso clinico nuevo", questions: [] });
       setTimeout(() => Materialize.updateTextFields(), 0);
    }
  }, [identificador]); // Depends on the route parameter

  useEffect(() => {
    if (currentIdRef.current) {
      const elementToFocus = document.getElementById(currentIdRef.current);
      if (elementToFocus) {
        elementToFocus.focus();
      }
      currentIdRef.current = null; // Reset after focusing
    }
    // This effect should run whenever 'caso' state might have changed in a way that requires focusing.
    // Specifically, after adding a question or an answer.
  }, [caso]);


  return (
    <div>
      <CasoForm
        onSubmit={processForm}
        onChange={changeCaso}
        errors={errors}
        caso={caso}
        addQuestion={addQuestion}
        deleteQuestion={deleteQuestion}
        onChangeAnswer={onChangeAnswer}
        onChangeQuestion={onChangeQuestion}
        addAnswer={addAnswer}
        deleteAnswer={deleteAnswer}
        onCancel={onCancel}
      />
      <SweetAlert
        show={alert.show}
        title={alert.title}
        type={alert.type}
        text={alert.message}
        onConfirm={() => setAlertState(prevAlert => ({ ...prevAlert, show: false }))}
      />
    </div>
  );
};

export default withRouter(CasoContainer); // Keep withRouter if props like location or match are used by CasoForm or needed for some other HOC interaction.
// If not, it can be removed and props drilling can be managed or Context API used.
