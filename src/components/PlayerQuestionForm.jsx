import { useState, useEffect, useRef, useActionState } from "react";
import { CustomButton, CustomRow, CustomCol, CustomSelect } from "./custom";
import ExamService from "../services/ExamService";
import QuestionForm from "./admin/QuestionForm";
import { useHistory } from 'react-router-dom';
import { alertError, alertSuccess } from "../services/AlertService";
import CasoContext from "../context/CasoContext";

const PlayerQuestionForm = () => {
    const history = useHistory();
    const currentIdRef = useRef(null);
    const [categories, setCategories] = useState([]);

    const [questionData, setQuestionData] = useState({
        category_id: "",
        status: "pending",
        text: "Pregunta",
        answers: [
            { id: 0, text: "Respuesta 1", is_correct: false, description: "" },
            { id: 0, text: "Respuesta 2", is_correct: false, description: "" },
            { id: 0, text: "Respuesta 3", is_correct: false, description: "" },
            { id: 0, text: "Respuesta 4", is_correct: false, description: "" },
        ]
    });

    useEffect(() => {
        ExamService.loadCategories().then(res => {
            setCategories(res.data);
        }).catch(err => console.error("Error loading categories", err));
    }, []);

    const handleSaveQuestion = async () => {
        if (!questionData.category_id) {
            alertError('Error', 'Por favor selecciona una especialidad.');
            return 'Selecciona una especialidad';
        }

        const processedAnswers = questionData.answers.map(ans => ({
            text: ans.text,
            is_correct: ans.is_correct,
            description: ans.description,
        }));

        const questionToSave = {
            text: questionData.text,
            category_id: questionData.category_id,
            status: "pending",
            answers_attributes: processedAnswers
        };

        try {
            await ExamService.saveQuestion(questionToSave);
            alertSuccess('Contribución', 'Tu pregunta ha sido enviada para revisión. ¡Gracias!').then(() => history.push("/"));
            return null;
        } catch (error) {
            console.error("ocurrio un error", error);
            alertError('Error', 'No se pudo enviar la pregunta para revisión.');
            return 'Error al guardar';
        }
    };

    const [, submitAction] = useActionState(handleSaveQuestion, null);

    const onChangeQuestion = (index, event) => {
        const value = event.target.value;
        setQuestionData(prev => ({ ...prev, text: value }));
    };

    const onChangeAnswer = (qIdx, aIdx, field, event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        setQuestionData(prev => {
            const newAnswers = prev.answers.map((ans, idx) => {
                if (idx === aIdx) {
                    return { ...ans, [field]: value };
                }
                return ans;
            });
            return { ...prev, answers: newAnswers };
        });
    };

    const addAnswer = () => {
        const newAnswer = { id: 0, text: "Nueva Respuesta", is_correct: false, description: "" };
        currentIdRef.current = `answer-text-0-${questionData.answers.length}`;
        setQuestionData(prev => ({ ...prev, answers: [...prev.answers, newAnswer] }));
    };

    const deleteAnswer = (qIdx, aIdx) => {
        setQuestionData(prev => ({
            ...prev,
            answers: prev.answers.filter((_, idx) => idx !== aIdx)
        }));
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
    }, [questionData.answers]);

    const value = {
        caso: { questions: [questionData] },
        onChangeQuestion,
        onChangeAnswer,
        addAnswer,
        deleteAnswer,
        deleteQuestion: () => {
            alertError('Error', 'Una pregunta individual debe tener al menos una pregunta.');
        },
        onCancel,
        saveCasoAction: submitAction,
        isAdmin: false
    };

    return (
        <CasoContext.Provider value={value}>
            <div className="col s12">
                <form action={submitAction} role="form">
                    <h3 className="center">Pregunta Individual</h3>
                    <CustomRow>
                        <CustomCol s={12}>
                            <CustomSelect
                                id="category_id"
                                label="Especialidad / Categoría"
                                name="category_id"
                                value={questionData.category_id}
                                onChange={(e) => setQuestionData(prev => ({ ...prev, category_id: e.target.value }))}
                                required
                            >
                                <option value="" disabled>Selecciona Especialidad</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </CustomSelect>
                        </CustomCol>
                    </CustomRow>

                    <QuestionForm question={questionData} questionIndex={0} />

                    <div className="divider" style={{ margin: '20px 0' }}></div>

                    <CustomCol s={12}>
                        <CustomRow>
                            <CustomCol s={6}>
                                <CustomButton flat type="button" onClick={onCancel} waves="light">
                                    CANCELAR
                                </CustomButton>
                            </CustomCol>
                            <CustomCol s={6} className="right-align">
                                <CustomButton
                                    type="submit"
                                    className="green darken-1"
                                    icon="save"
                                    iconPosition="right"
                                    waves="light"
                                >
                                    GUARDAR PREGUNTA
                                </CustomButton>
                            </CustomCol>
                        </CustomRow>
                    </CustomCol>
                </form>
            </div>
        </CasoContext.Provider>
    );
};

export default PlayerQuestionForm;
