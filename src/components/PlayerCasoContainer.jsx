import { useState, useEffect, useRef, useActionState } from "react";
import CasoForm from "./admin/CasoForm";
import PlayerQuestionForm from "./PlayerQuestionForm";
import ExamService from "../services/ExamService";
import { useHistory } from 'react-router-dom';
import { alertError, alertSuccess } from "../services/AlertService";
import CasoContext from "../context/CasoContext";
import { CustomButton } from "./custom";

const PlayerCasoContainer = () => {
    const history = useHistory();
    const currentIdRef = useRef(null);
    const [contributionType, setContributionType] = useState('caso');

    const [caso, setCaso] = useState({
        name: "",
        category_id: "",
        description: "",
        status: "pending",
        questions: [
            {
                text: "Pregunta 1",
                answers: [
                    { id: 0, text: "Respuesta 1", is_correct: false, description: "" },
                    { id: 0, text: "Respuesta 2", is_correct: false, description: "" },
                    { id: 0, text: "Respuesta 3", is_correct: false, description: "" },
                    { id: 0, text: "Respuesta 4", is_correct: false, description: "" },
                ]
            }
        ],
    });

    const prepareClinicalCase = (currentCaso) => {
        let questions = currentCaso.questions;
        let questions_attributes = [];

        for (var question of questions) {
            let processedAnswers = [];
            for (var answer of question.answers) {
                processedAnswers.push({
                    text: answer.text,
                    is_correct: answer.is_correct,
                    description: answer.description,
                });
            }
            questions_attributes.push({
                text: question.text,
                answers_attributes: processedAnswers,
            });
        }
        return {
            name: currentCaso.name,
            description: currentCaso.description,
            status: "pending",
            category_id: currentCaso.category_id,
            questions_attributes: questions_attributes,
        };
    };

    const handleSaveCaso = async () => {
        let clinicalCaseToSave = prepareClinicalCase(caso);
        // Force status to pending for players
        clinicalCaseToSave.status = "pending";

        try {
            await ExamService.saveCaso(clinicalCaseToSave);
            alertSuccess('Contribución', 'Tu caso ha sido enviado para revisión. ¡Gracias!').then(() => history.push("/"));
            return null;
        } catch (error) {
            console.error("ocurrio un error", error);
            alertError('Error', 'No se pudo enviar el caso para revisión.');
            return 'Error al guardar';
        }
    };

    const [error, submitCasoAction] = useActionState(handleSaveCaso, null);
    if (error) {
        alertError('Error', 'No se pudo enviar el caso para revisión.');
    }

    const addQuestion = () => {
        let newQuestion = {
            id: 0, text: "Pregunta", answers: [
                { id: 0, text: "Respuesta", is_correct: false, description: "" },
                { id: 0, text: "Respuesta", is_correct: false, description: "" },
                { id: 0, text: "Respuesta", is_correct: false, description: "" },
                { id: 0, text: "Respuesta", is_correct: false, description: "" },
            ]
        };
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
            id: 0, text: "Respuesta", is_correct: false, description: "",
        };
        currentIdRef.current = `answer-text-${questionIndex}-${caso.questions[questionIndex].answers.length}`;
        setCaso(prevCaso => {
            const newQuestions = prevCaso.questions.map((q, i) => {
                if (i === questionIndex) {
                    return { ...q, answers: [...q.answers, newAnswer] };
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
                    return { ...q, answers: q.answers.filter((_, ansIdx) => ansIdx !== answerIndex) };
                }
                return q;
            });
            return { ...prevCaso, questions: newQuestions };
        });
    };

    const changeCaso = (event) => {
        const field = event.target.name;
        const value = event.target.value;
        setCaso(prevCaso => ({ ...prevCaso, [field]: value }));
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
            if (elementToFocus) elementToFocus.focus();
            currentIdRef.current = null;
        }
    }, [caso.questions]);

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
        isAdmin: false
    };

    return (
        <div className="" style={{ padding: '2rem' }}>
            <div className="center-align mb-4" style={{ marginBottom: '2rem' }}>
                <h4 className="grey-text text-darken-3">¿Qué deseas contribuir hoy?</h4>
                <CustomButton
                    flat={contributionType !== 'caso'}
                    className={contributionType === 'caso' ? 'green darken-1 white-text' : 'green-text'}
                    onClick={() => setContributionType('caso')}
                    waves="light"
                >
                    Caso Clínico
                </CustomButton>
                <CustomButton
                    flat={contributionType !== 'pregunta'}
                    className={contributionType === 'pregunta' ? 'green darken-1 white-text' : 'green-text'}
                    onClick={() => setContributionType('pregunta')}
                    style={{ marginLeft: '10px' }}
                    waves="light"
                >
                    Pregunta Individual
                </CustomButton>
            </div>

            {contributionType === 'caso' ? (
                <CasoContext.Provider value={value}>
                    <CasoForm />
                </CasoContext.Provider>
            ) : (
                <PlayerQuestionForm />
            )}
        </div>
    );
};

export default PlayerCasoContainer;
