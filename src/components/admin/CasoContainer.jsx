import { useState, useEffect, useRef, useActionState } from "react"; // Added useActionState
import CasoForm from "./CasoForm";
import ExamService from "../../services/ExamService";
import { useHistory, useParams } from 'react-router-dom';
import { alertError, alertSuccess } from "../../services/AlertService";
import CasoContext from "../../context/CasoContext";

const INITIAL_CASO_STATE = {
  name: "",
  description: "Un caso clínico nuevo",
  status: "pending",
  category_id: "",
  questions: [
    {
      answers: [
        { id: 0, text: "Respuesta 1", is_correct: false, description: "" },
        { id: 0, text: "Respuesta 2", is_correct: false, description: "" },
        { id: 0, text: "Respuesta 3", is_correct: false, description: "" },
        { id: 0, text: "Respuesta 4", is_correct: false, description: "" },
      ]
    }
  ]
};

const CasoContainer = () => {
  const history = useHistory();
  const { identificador } = useParams();
  const currentIdRef = useRef(null);

  const [caso, setCaso] = useState(() => INITIAL_CASO_STATE);

  // Action function for saving the caso
  const handleSaveCaso = async () => {
    const prepareClinicalCase = (currentCaso) => {
      const processAnswers = (answers) => answers.map(ans => ({
        text: ans.text,
        is_correct: ans.is_correct,
        description: ans.description,
        ...(ans.id > 0 ? { id: ans.id } : {})
      }));

      return {
        id: currentCaso.id,
        name: currentCaso.name,
        description: currentCaso.description,
        status: currentCaso.status,
        category_id: currentCaso.category_id,
        questions_attributes: currentCaso.questions.map(q => ({
          text: q.text,
          answers_attributes: processAnswers(q.answers),
          ...(q.id > 0 ? { id: q.id } : {})
        }))
      };
    };

    let clinicalCaseToSave = prepareClinicalCase(caso); // Uses `caso` state from component scope
    console.log(clinicalCaseToSave);
    try {
      await ExamService.saveCaso(clinicalCaseToSave);
      await alertSuccess('Caso Clínico', 'Se ha guardado correctamente');
      history.goBack()
      return null; // Success
    } catch (error) {
      console.error("Ocurrió un error", error);
      alertError('Caso Clínico', 'Ha ocurrido un error, no se pudo guardar');
      return 'Ha ocurrido un error, no se pudo guardar'; // Error message
    }
  };

  const [, submitCasoAction, isPending] = useActionState(handleSaveCaso, null);

  useEffect(() => {
    let isMounted = true; // Para evitar actualizar estado si el componente se desmonta
    const idNum = parseInt(identificador, 10);

    if (idNum > 0) {
      ExamService.getCaso(idNum)
        .then(response => {
          if (isMounted) {
            setCaso(response.data);
          }
        })
        .catch(error => {
          console.error("Error loading caso", error);
          alertError('Error', 'No se pudo cargar el caso clínico.');
        });
    }
    else {
      Promise.resolve().then(() => {
        if (isMounted) {
          setCaso(prev => {
            if (prev.id) return INITIAL_CASO_STATE;
            return prev;
          });
        }
      });
    }

    return () => {
      isMounted = false; // Cleanup
    };
  }, [identificador]);

  const addQuestion = () => {
    let newQuestion = {
      id: 0, text: "Pregunta", answers: [
        { id: 0, text: "Respuesta", is_correct: false, description: "" },
        { id: 0, text: "Respuesta", is_correct: false, description: "" },
        { id: 0, text: "Respuesta", is_correct: false, description: "" },
        { id: 0, text: "Respuesta", is_correct: false, description: "" },
      ]
    };
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

  const value = {
    caso,
    addQuestion,
    deleteQuestion,
    addAnswer,
    deleteAnswer,
    onChangeAnswer,
    onChangeQuestion,
    onChange: changeCaso,
    saveCasoAction: submitCasoAction,
    onCancel,
    isPending,
    isAdmin: true
  };

  return (
    <CasoContext.Provider value={value}>
      <div style={{ padding: '2rem' }}>
        <CasoForm />
        {/* Example of displaying form-level error here, if not handled in CasoForm */}
        {/* {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} */}
      </div>
    </CasoContext.Provider>
  );
};

export default CasoContainer;
