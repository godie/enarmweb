import React, { useState, useEffect, useActionState, startTransition } from "react";
import { useHistory } from "react-router-dom";
import {
    CustomButton,
    CustomTextInput,
    CustomTextarea,
    CustomRow,
    CustomCol,
    CustomSelect,
    CustomCheckbox
} from "../custom";
import ExamService from "../../services/ExamService";
import { alertError, alertSuccess } from "../../services/AlertService";

const CasoNuevo = () => {
    const history = useHistory();
    const [categories, setCategories] = useState([]);
    const [caso, setCaso] = useState({
        description: "",
        category_id: "",
        name: "",
        questions: [
            {
                text: "",
                answers: [
                    { text: "", is_correct: false, description: "" },
                    { text: "", is_correct: false, description: "" },
                    { text: "", is_correct: false, description: "" },
                    { text: "", is_correct: false, description: "" }
                ]
            }
        ]
    });

    useEffect(() => {
        ExamService.loadCategories().then(res => {
            setCategories(res.data);
        }).catch(err => console.error("Error loading categories", err));
    }, []);

    const handleSave = async (previousState, formData) => {
        try {
            // Ensure name is present as it's required by the backend validates :name
            const payload = { ...caso };
            if (!payload.name) {
                payload.name = payload.description.slice(0, 30);
            }
            await ExamService.saveCaso(payload);
            alertSuccess("¡Éxito!", "El caso clínico ha sido creado correctamente.");
            history.push("/dashboard");
            return null;
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || "Error al guardar el caso";
            alertError("Error", msg);
            return msg;
        }
    };

    const [error, submitAction, isPending] = useActionState(handleSave, null);

    const addQuestion = () => {
        setCaso({
            ...caso,
            questions: [
                ...caso.questions,
                {
                    text: "",
                    answers: [
                        { text: "", is_correct: false, description: "" },
                        { text: "", is_correct: false, description: "" },
                        { text: "", is_correct: false, description: "" },
                        { text: "", is_correct: false, description: "" }
                    ]
                }
            ]
        });
    };

    const updateQuestion = (index, text) => {
        const newQuestions = [...caso.questions];
        newQuestions[index].text = text;
        setCaso({ ...caso, questions: newQuestions });
    };

    const updateAnswer = (qIndex, aIndex, field, value) => {
        const newQuestions = [...caso.questions];
        newQuestions[qIndex].answers[aIndex][field] = value;

        if (field === 'is_correct' && value === true) {
            newQuestions[qIndex].answers.forEach((ans, i) => {
                if (i !== aIndex) ans.is_correct = false;
            });
        }

        setCaso({ ...caso, questions: newQuestions });
    };

    const addAnswer = (qIndex) => {
        const newQuestions = [...caso.questions];
        newQuestions[qIndex].answers.push({ text: "", is_correct: false, description: "" });
        setCaso({ ...caso, questions: newQuestions });
    };

    const removeAnswer = (qIndex, aIndex) => {
        const newQuestions = [...caso.questions];
        newQuestions[qIndex].answers.splice(aIndex, 1);
        setCaso({ ...caso, questions: newQuestions });
    };

    const removeQuestion = (qIndex) => {
        const newQuestions = [...caso.questions];
        newQuestions.splice(qIndex, 1);
        setCaso({ ...caso, questions: newQuestions });
    };

    return (
        <div className="section no-pad-bot">
            <div className="card-panel white no-padding">
                <div style={{ padding: '2rem' }}>
                    {/* Header section matching the medical layout */}
                    <CustomRow className="valign-wrapper">
                        <CustomCol s={12} m={8}>
                            <h5 className="grey-text text-darken-3" style={{ margin: '0' }}>Nuevo Caso Clínico</h5>
                            <p className="grey-text">Ingresa el enunciado del caso y sus preguntas asociadas.</p>
                        </CustomCol>
                        <CustomCol s={12} m={4} className="right-align">
                            <CustomButton flat className="grey-text" onClick={() => history.push("/dashboard")} icon="close">Cerrar</CustomButton>
                        </CustomCol>
                    </CustomRow>

                    <div className="divider" style={{ margin: '1.5rem 0' }}></div>

                    <form onSubmit={(e) => { e.preventDefault(); startTransition(() => submitAction()); }}>
                        <CustomRow>
                            <CustomCol s={12} m={6}>
                                <CustomTextInput
                                    id="name"
                                    label="Nombre Identificador del Caso *"
                                    value={caso.name}
                                    onChange={(e) => setCaso({ ...caso, name: e.target.value })}
                                    placeholder="Ej: Caso de Neumonía Típica"
                                />
                            </CustomCol>
                            <CustomCol s={12} m={6}>
                                <CustomSelect
                                    id="category_id"
                                    label="Especialidad / Categoría *"
                                    value={caso.category_id}
                                    onChange={(val) => setCaso({ ...caso, category_id: val })}
                                >
                                    <option value="" disabled>Selecciona Especialidad</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </CustomSelect>
                            </CustomCol>
                        </CustomRow>

                        <CustomRow>
                            <CustomCol s={12}>
                                <CustomTextarea
                                    id="description"
                                    label="Enunciado Clínico (La historia del paciente) *"
                                    value={caso.description}
                                    onChange={(e) => setCaso({ ...caso, description: e.target.value })}
                                    className="section"
                                />
                            </CustomCol>
                        </CustomRow>

                        <div className="divider" style={{ margin: '2rem 0' }}></div>
                        <h6 className="grey-text text-darken-1" style={{ fontWeight: 'bold' }}>PREGUNTAS DEL CASO</h6>

                        {/* Questions Section */}
                        <div className="section">
                            {caso.questions.map((q, qIndex) => (
                                <div key={qIndex} className="question-container" style={{ marginBottom: '3rem', padding: '1.5rem', border: '1px solid #e0ece6', borderRadius: '8px', background: '#fafcfb' }}>
                                    <div className="valign-wrapper" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span className="badge green white-text left" style={{ borderRadius: '4px', float: 'none', marginLeft: '0' }}>Pregunta {qIndex + 1}</span>
                                        {caso.questions.length > 1 && (
                                            <CustomButton
                                                flat
                                                small
                                                className="red-text text-lighten-2"
                                                onClick={() => removeQuestion(qIndex)}
                                                icon="delete"
                                            >
                                                Eliminar
                                            </CustomButton>
                                        )}
                                    </div>

                                    <CustomRow>
                                        <CustomCol s={12}>
                                            <CustomTextarea
                                                id={`q-text-${qIndex}`}
                                                label="Pregunta *"
                                                value={q.text}
                                                onChange={(e) => updateQuestion(qIndex, e.target.value)}
                                                textareaClassName="z-depth-0"
                                            />
                                        </CustomCol>
                                    </CustomRow>

                                    <div className="answers-container" style={{ marginTop: '1rem' }}>
                                        <p className="grey-text" style={{ fontSize: '0.9rem' }}>Opciones de respuesta:</p>
                                        {q.answers.map((a, aIndex) => (
                                            <CustomRow key={aIndex} className="valign-wrapper" style={{ marginBottom: '0.8rem' }}>
                                                <CustomCol s={1} className="center-align">
                                                    <CustomCheckbox
                                                        id={`correct-${qIndex}-${aIndex}`}
                                                        checked={a.is_correct}
                                                        onChange={(e) => updateAnswer(qIndex, aIndex, 'is_correct', e.target.checked)}
                                                        label=""
                                                        tooltip="Respuesta correcta"
                                                    />
                                                </CustomCol>
                                                <CustomCol s={10}>
                                                    <CustomTextInput
                                                        id={`a-text-${qIndex}-${aIndex}`}
                                                        value={a.text}
                                                        onChange={(e) => updateAnswer(qIndex, aIndex, 'text', e.target.value)}
                                                        placeholder=""
                                                        label={`Opcion ${aIndex + 1}`}
                                                        className="no-margin"
                                                    />
                                                </CustomCol>
                                                <CustomCol s={1} className="right-align">
                                                    <CustomButton
                                                        flat
                                                        small
                                                        icon="close"
                                                        className="grey-text text-lighten-2"
                                                        onClick={() => removeAnswer(qIndex, aIndex)}
                                                    />
                                                </CustomCol>
                                            </CustomRow>
                                        ))}
                                    </div>

                                    <CustomRow>
                                        <CustomCol s={12}>
                                            <CustomButton
                                                flat
                                                className="green-text text-darken-1"
                                                onClick={() => addAnswer(qIndex)}
                                                style={{ fontWeight: '600', fontSize: '12px' }}
                                                icon="add"
                                            >
                                                AÑADIR OPCIÓN
                                            </CustomButton>
                                        </CustomCol>
                                    </CustomRow>
                                </div>
                            ))}
                        </div>

                        <CustomRow className="center-align">
                            <CustomCol s={12}>
                                <CustomButton
                                    flat
                                    className="green-text text-darken-2"
                                    onClick={addQuestion}
                                    style={{ fontWeight: '600' }}
                                    icon="add_circle"
                                >
                                    AÑADIR OTRA PREGUNTA A ESTE CASO
                                </CustomButton>
                            </CustomCol>
                        </CustomRow>

                        {error && <p className="red-text center-align">{error}</p>}

                        <div className="divider" style={{ margin: '3rem 0' }}></div>

                        <CustomRow className="right-align">
                            <CustomCol s={12}>
                                <CustomButton
                                    flat
                                    className="grey-text"
                                    style={{ marginRight: '1.5rem' }}
                                    onClick={() => history.push("/dashboard")}
                                >
                                    CANCELAR
                                </CustomButton>
                                <CustomButton
                                    type="submit"
                                    className="green darken-1"
                                    style={{ padding: '0 3rem' }}
                                    disabled={isPending}
                                >
                                    {isPending ? "GUARDANDO..." : "GUARDAR CASO CLÍNICO"}
                                </CustomButton>
                            </CustomCol>
                        </CustomRow>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CasoNuevo;
