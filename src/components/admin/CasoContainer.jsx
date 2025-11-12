import React, { useState, useEffect, useRef, useActionState } from "react"; // Added useActionState
import CasoForm from "./CasoForm";
import ExamService from "../../services/ExamService";
import { useHistory, useParams } from 'react-router-dom';
import { alertError, alertSuccess } from "../../services/AlertService";

const CasoContainer = () => {
  const history = useHistory();
  const { identificador } = useParams();
  const currentIdRef = useRef(null);

  const [caso, setCaso] = useState({
    description: "Un caso clinico nuevo",
    questions: [],
  });

  // Action function for saving the caso
  const handleSaveCaso = async (previousState, formData) => {
    // The `caso` state is the most up-to-date source of truth for questions/answers
    // as they are managed by complex interactions (add/delete question/answer).
    // FormData might contain 'description', but nested questions/answers are tricky with FormData directly for dynamic lists.
    // So, we rely on the `caso` state object.
    // The `casoData` hidden field in form can pass this if needed, or we can just use the `caso` state from closure.
    
    // Option 1: Parse from hidden field (if used)
    // const casoFromFormData = JSON.parse(formData.get('casoData'));
    // let clinicalCaseToSave = prepareClinicalCase(casoFromFormData);
    
    // Option 2: Use `caso` state directly (simpler if `prepareClinicalCase` can access it)
    // Ensure `prepareClinicalCase` uses the most current `caso` state.
    // For useActionState, the action should ideally get all it needs from formData or be pure.
    // To make it work cleanly with useActionState, it's better if `prepareClinicalCase`
    // can be called with the current `caso` state from this component's scope.
    // The `formData` argument in an action is typically for simple form fields.
    // Since our `caso` state is complex and managed interactively,
    // we will use the `caso` state directly from the `CasoContainer`'s scope.
    // The `formData` will primarily be used by React to trigger the action.
    // We can still extract top-level fields like 'description' from formData if desired,
    // but the core logic will use the `caso` state.

    let clinicalCaseToSave = prepareClinicalCase(caso); // Uses `caso` state from component scope

    try {
      await ExamService.saveCaso(clinicalCaseToSave);
      alertSuccess('Caso Clinico', 'Se ha guardado correctamente').then(() => history.goBack());
      return null; // Success
    } catch (error) {
      console.error("ocurrio un error", error);
      alertError('Caso Clinico', 'Ha ocurrido un error, no se pudo guardar');
      return 'Ha ocurrido un error, no se pudo guardar'; // Error message
    }
  };

  const [error, submitCasoAction, isPending] = useActionState(handleSaveCaso, null);


  const prepareClinicalCase = (currentCaso) => {
    // This function now correctly uses the `currentCaso` argument passed to it
    let questions = currentCaso.questions;
    let questions_attributes = [];

    for (var question of questions) {
      let processedAnswers = processAnswers(question.answers);
      let preparedQuestion = {
        text: question.text,
        answers_attributes: processedAnswers,
      };
      if (!question.id || question.id === 0) { // Check for undefined or 0
        questions_attributes.push(preparedQuestion);
      } else {
        questions_attributes.push(
          Object.assign({}, { id: question.id }, preparedQuestion)
        );
      }
    }
    let clinicalCaseToSave = {
      id: currentCaso.id,
      description: currentCaso.description, // This should ideally come from formData if it's a direct input
                                          // or ensure `caso.description` is updated by `changeCaso`
      category_id: 1, 
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
      if (answer.id && answer.id > 0) { // Check for defined and > 0
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
    // currentIdRef.current = "question-" + caso.questions.length; // Id for focus, ensure it's unique
    // The id for focus should be on the input itself, e.g., `question-text-${caso.questions.length}`
    currentIdRef.current = `question-text-${caso.questions.length}`;
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
    // currentIdRef.current = "answer-" + questionIndex + "-" + caso.questions[questionIndex].answers.length;
    // The id for focus should be on the input itself, e.g., `answer-text-${questionIndex}-${caso.questions[questionIndex].answers.length}`
    currentIdRef.current = `answer-text-${questionIndex}-${caso.questions[questionIndex].answers.length}`;
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
      [field]: value // This updates description directly from its input field
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

    if (idFromParams > 0) {
      ExamService.getCaso(idFromParams)
        .then((response) => {
          setCaso(response.data);
        })
        .catch((error) => {
          console.log("OCurrio un error loading caso", error);
          alertError('Error','No se pudo cargar el caso clínico.' );
        });
    } else {
      setCaso({ description: "Un caso clinico nuevo", questions: [] });
    }
  }, [identificador]);

  useEffect(() => {
    if (currentIdRef.current) {
      const elementToFocus = document.getElementById(currentIdRef.current);
      if (elementToFocus) {
        elementToFocus.focus();
      }
      currentIdRef.current = null; 
    }
  }, [caso.questions]); // Trigger when questions array changes (add/delete)
                        // For answers, we might need a more granular dependency if focus is needed there.
                        // A simple way is to depend on `caso` but that might run too often.
                        // For now, focusing on new questions and answers should be covered if `currentIdRef.current` has the right ID.

  // Display error from useActionState if it exists
  useEffect(() => {
    if (error) {
      // alertError('Error al Guardar', error); // Already handled in the action
    }
  }, [error]);

  return (
    <div>
      <CasoForm
        // onSubmit is removed, saveCasoAction is passed
        saveCasoAction={submitCasoAction}
        onChange={changeCaso}
        caso={caso}
        addQuestion={addQuestion}
        deleteQuestion={deleteQuestion}
        onChangeAnswer={onChangeAnswer}
        onChangeQuestion={onChangeQuestion}
        addAnswer={addAnswer}
        deleteAnswer={deleteAnswer}
        onCancel={onCancel}
        // Pass error and isPending if CasoForm needs to react to them (e.g., disable button, show message)
        // error={error}
        // isPending={isPending}
      />
      {/* Example of displaying form-level error here, if not handled in CasoForm */}
      {/* {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} */}
    </div>
  );
};

export default CasoContainer;
