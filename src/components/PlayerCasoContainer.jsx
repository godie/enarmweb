import { useState, useEffect, useRef, useActionState, useMemo } from "react";
import CasoForm from "./admin/CasoForm";
import PlayerQuestionForm from "./PlayerQuestionForm";
import ExamService from "../services/ExamService";
import { useHistory } from 'react-router-dom';
import { alertError, alertSuccess } from "../services/AlertService";
import CasoContext from "../context/CasoContext";
import { CustomButton, CustomTable, CustomPreloader } from "./custom";
import EnarmUtil from "../modules/EnarmUtil";

const STATUS_LABELS = {
    pending: <span className="badge yellow darken-1 white-text" style={{ borderRadius: '4px', float: 'none', marginLeft: 0 }}>Pendiente</span>,
    published: <span className="badge green darken-1 white-text" style={{ borderRadius: '4px', float: 'none', marginLeft: 0 }}>Publicado</span>,
    rejected: <span className="badge red darken-1 white-text" style={{ borderRadius: '4px', float: 'none', marginLeft: 0 }}>Rechazado</span>,
};

const PlayerCasoContainer = () => {
    const history = useHistory();
    const currentIdRef = useRef(null);
    const [contributionType, setContributionType] = useState('caso');
    const [contributions, setContributions] = useState({ clinical_cases: [], questions: [] });
    const [loadingContribs, setLoadingContribs] = useState(true);
    const [categories, setCategories] = useState(() => {
        const cached = EnarmUtil.getCategories();
        return cached ? JSON.parse(cached) : [];
    });
    const initialCategoriesRef = useRef(categories);

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

    const [, submitCasoAction, isPending] = useActionState(handleSaveCaso, null);

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

    useEffect(() => {
        const fetchContributions = async () => {
            const initialCategories = initialCategoriesRef.current;
            try {
                const [contribRes, catRes] = await Promise.all([
                    ExamService.getUserContributions(),
                    initialCategories.length === 0 ? ExamService.loadCategories() : Promise.resolve({ data: initialCategories })
                ]);
                setContributions(contribRes.data);
                if (initialCategories.length === 0) {
                    setCategories(catRes.data);
                    EnarmUtil.setCategories(JSON.stringify(catRes.data));
                }
            } catch (err) {
                console.error("Error fetching contributions summary:", err);
            } finally {
                setLoadingContribs(false);
            }
        };
        fetchContributions();
    }, []);

    const especialidadesMap = useMemo(() => new Map(
        categories.map((esp) => [`${esp.id}`, esp.name])
    ), [categories]);

    const lastContributions = useMemo(() => {
        const all = [
            ...(contributions.clinical_cases || []).map(c => ({ ...c, type: 'Caso Clínico', display_name: c.name, date: new Date(c.created_at || 0) })),
            ...(contributions.questions || []).map(q => ({ ...q, type: 'Pregunta Individual', display_name: q.text, date: new Date(q.created_at || 0) }))
        ];
        return all.sort((a, b) => b.date - a.date).slice(0, 5);
    }, [contributions]);

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

            <div className="divider" style={{ margin: '3rem 0' }}></div>

            <div className="contributions-summary">
                <h5 className="grey-text text-darken-3">Tus últimas contribuciones</h5>
                {loadingContribs ? (
                    <div className="center-align"><CustomPreloader size="small" /></div>
                ) : (
                    <>
                        <CustomTable striped hoverable className="z-depth-1">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Nombre / Texto</th>
                                    <th>Especialidad</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lastContributions.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="center-align grey-text">No has realizado contribuciones aún.</td>
                                    </tr>
                                ) : (
                                    lastContributions.map((item, idx) => (
                                        <tr key={`${item.type}-${item.id || idx}`}>
                                            <td><strong>{item.type}</strong></td>
                                            <td className="truncate" style={{ maxWidth: '300px' }}>{item.display_name}</td>
                                            <td>
                                                <span className="badge white border darken-1" style={{ float: 'none', marginLeft: 0 }}>
                                                    {especialidadesMap.get(item.category_id?.toString()) || 'N/A'}
                                                </span>
                                            </td>
                                            <td>{STATUS_LABELS[item.status] || item.status}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </CustomTable>
                        <div className="right-align" style={{ marginTop: '1rem' }}>
                            <CustomButton flat className="green-text" onClick={() => history.push('/mis-contribuciones')}>
                                Ver todas <i className="material-icons right">arrow_forward</i>
                            </CustomButton>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PlayerCasoContainer;
