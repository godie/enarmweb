import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  CustomRow,
  CustomCol,
  CustomButton,
  CustomPreloader,
  CustomSelect,
  CustomTextInput,
  CustomTextarea
} from "../custom";
import ExamService from "../../services/ExamService";
import EnarmUtil from "../../modules/EnarmUtil";
import { alertError, alertSuccess } from "../../services/AlertService";

const QuestionDetail = ({ mode = "view" }) => {
  const { id } = useParams();
  const history = useHistory();
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";
  const isReadOnly = !isEditMode && !isCreateMode;

  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);
  const [question, setQuestion] = useState(null);
  const [categories, setCategories] = useState(() => {
    const cached = EnarmUtil.getCategories();
    return cached ? JSON.parse(cached) : [];
  });
  const [caseSearch, setCaseSearch] = useState("");
  const [caseSuggestions, setCaseSuggestions] = useState([]);
  const [searchingCases, setSearchingCases] = useState(false);

  const hasClinicalCase = useMemo(() => Boolean(question?.clinical_case_id), [question]);

  useEffect(() => {
    if (isCreateMode) {
      const bootstrapCreateMode = async () => {
        try {
          if (categories.length === 0) {
            const categoriesResponse = await ExamService.loadCategories();
            const parsedCategories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
            setCategories(parsedCategories);
            EnarmUtil.setCategories(JSON.stringify(parsedCategories));
          }
        } catch (error) {
          console.error("Error loading categories", error);
        } finally {
          setQuestion({
            id: 0,
            text: "",
            clinical_case_id: null,
            category_id: "",
            answers: [
              { id: 0, text: "", description: "", is_correct: true },
              { id: 0, text: "", description: "", is_correct: false }
            ]
          });
          setLoading(false);
        }
      };
      bootstrapCreateMode();
      return;
    }

    const loadData = async () => {
      try {
        const [questionResponse, categoriesResponse] = await Promise.all([
          ExamService.getQuestion(id),
          categories.length === 0 ? ExamService.loadCategories() : Promise.resolve({ data: categories })
        ]);

        const incomingQuestion = questionResponse.data || {};
        const normalizedAnswers = Array.isArray(incomingQuestion.answers) ? incomingQuestion.answers : [];
        setQuestion({
          ...incomingQuestion,
          category_id: incomingQuestion.category_id || "",
          answers: normalizedAnswers
        });
        setCaseSearch(incomingQuestion?.clinical_case?.name || "");

        if (categories.length === 0) {
          const parsedCategories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
          setCategories(parsedCategories);
          EnarmUtil.setCategories(JSON.stringify(parsedCategories));
        }
      } catch (error) {
        console.error("Error loading question", error);
        alertError("Preguntas", "No se pudo cargar el detalle de la pregunta.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, categories, isCreateMode]);

  useEffect(() => {
    if (!isEditMode && !isCreateMode) return;
    if (question?.clinical_case_id) return;
    if (caseSearch.trim().length < 2) {
      setCaseSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSearchingCases(true);
        const response = await ExamService.getClinicalCases({ page: 1, q: caseSearch.trim() });
        const cases = Array.isArray(response.data?.clinical_cases) ? response.data.clinical_cases : [];
        setCaseSuggestions(cases.slice(0, 8));
      } catch (error) {
        console.error("Error searching clinical cases", error);
      } finally {
        setSearchingCases(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [caseSearch, isEditMode, isCreateMode, question?.clinical_case_id]);

  const onQuestionTextChange = (event) => {
    const value = event.target.value;
    setQuestion((prev) => ({ ...prev, text: value }));
  };

  const onCategoryChange = (event) => {
    const value = event.target.value;
    setQuestion((prev) => ({
      ...prev,
      category_id: value
    }));
  };

  const onAnswerFieldChange = (index, field, value) => {
    setQuestion((prev) => {
      const updatedAnswers = prev.answers.map((answer, answerIndex) =>
        answerIndex === index ? { ...answer, [field]: value } : answer
      );
      return { ...prev, answers: updatedAnswers };
    });
  };

  const onAnswerCorrectChange = (selectedIndex) => {
    setQuestion((prev) => {
      const updatedAnswers = prev.answers.map((answer, answerIndex) => ({
        ...answer,
        is_correct: answerIndex === selectedIndex
      }));
      return { ...prev, answers: updatedAnswers };
    });
  };

  const addAnswer = () => {
    setQuestion((prev) => ({
      ...prev,
      answers: [
        ...(prev.answers || []),
        { id: 0, text: "", description: "", is_correct: false }
      ]
    }));
  };

  const removeAnswer = (index) => {
    setQuestion((prev) => ({
      ...prev,
      answers: prev.answers.filter((_, answerIndex) => answerIndex !== index)
    }));
  };

  const selectClinicalCase = (clinicalCase) => {
    setQuestion((prev) => ({
      ...prev,
      clinical_case_id: clinicalCase.id,
      category_id: "",
      clinical_case: clinicalCase
    }));
    setCaseSearch(clinicalCase.name || "");
    setCaseSuggestions([]);
  };

  const clearClinicalCaseAssociation = () => {
    setQuestion((prev) => ({
      ...prev,
      clinical_case_id: null,
      clinical_case: null
    }));
    setCaseSearch("");
    setCaseSuggestions([]);
  };

  const saveQuestion = async () => {
    if (!question) return;
    if (!question.text?.trim()) {
      alertError("Preguntas", "El texto de la pregunta es obligatorio.");
      return;
    }
    if (!question.clinical_case_id && !question.category_id) {
      alertError("Preguntas", "Asocia la pregunta a un caso clínico o a una especialidad.");
      return;
    }
    if (!Array.isArray(question.answers) || question.answers.length < 2) {
      alertError("Preguntas", "La pregunta debe tener al menos 2 respuestas.");
      return;
    }
    if (!question.answers.some((answer) => answer.is_correct)) {
      alertError("Preguntas", "Selecciona una respuesta correcta.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        id: question.id || 0,
        text: question.text,
        clinical_case_id: question.clinical_case_id || null,
        category_id: question.clinical_case_id ? null : (question.category_id || null),
        answers_attributes: question.answers.map((answer) => ({
          id: answer.id,
          text: answer.text,
          description: answer.description,
          is_correct: !!answer.is_correct
        }))
      };

      await ExamService.saveQuestion(payload);
      await alertSuccess("Preguntas", `Pregunta ${isCreateMode ? "creada" : "actualizada"} correctamente.`);
      if (isCreateMode) {
        history.push("/dashboard/questions");
      } else {
        history.push(`/dashboard/questions/${question.id}`);
      }
    } catch (error) {
      console.error("Error saving question", error);
      alertError("Preguntas", "No se pudo guardar la pregunta.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !question) {
    return (
      <div className="center-align" style={{ padding: "50px" }}>
        <CustomPreloader active color="green" size="big" />
      </div>
    );
  }

  return (
    <div className="question-detail-container">
      <CustomRow>
        <CustomCol s={12}>
          <h4 className="grey-text text-darken-3">
            {isCreateMode ? "Agregar una nueva pregunta" : isEditMode ? `Editar Pregunta #${question.id}` : `Ver Pregunta #${question.id}`}
          </h4>
        </CustomCol>
      </CustomRow>

      <CustomRow>
        <CustomCol s={12}>
          <CustomTextarea
            id="question-text-edit"
            label="Texto de la pregunta"
            value={question.text || ""}
            onChange={onQuestionTextChange}
            disabled={isReadOnly}
            textareaClassName="z-depth-1"
            maxLength={1000}
          />
        </CustomCol>
      </CustomRow>

      <CustomRow>
        <CustomCol s={12} m={6}>
          <CustomSelect
            id="question-category-edit"
            label="Especialidad (si no tiene caso clínico)"
            value={question.category_id || ""}
            onChange={onCategoryChange}
            disabled={isReadOnly || hasClinicalCase}
          >
            <option value="">Sin especialidad</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </CustomSelect>
        </CustomCol>
        <CustomCol s={12} m={6}>
          <CustomTextInput
            id="question-case-search"
            label="Caso clínico asociado"
            value={caseSearch}
            onChange={(event) => setCaseSearch(event.target.value)}
            disabled={isReadOnly || hasClinicalCase}
            helperText={hasClinicalCase ? "Caso seleccionado" : "Escribe 2+ letras para buscar"}
          />
          {!isReadOnly && !hasClinicalCase && (caseSuggestions.length > 0 || searchingCases) && (
            <div className="z-depth-1" style={{ background: "white", borderRadius: "8px", marginTop: "0.5rem" }}>
              {searchingCases ? (
                <div style={{ padding: "0.75rem" }} className="grey-text">
                  Buscando casos...
                </div>
              ) : (
                caseSuggestions.map((clinicalCase) => (
                  <button
                    key={clinicalCase.id}
                    type="button"
                    className="btn-flat left-align"
                    style={{ width: "100%", textTransform: "none", padding: "0.5rem 1rem" }}
                    onClick={() => selectClinicalCase(clinicalCase)}
                  >
                    {clinicalCase.name}
                  </button>
                ))
              )}
            </div>
          )}
          {hasClinicalCase && (
            <div style={{ marginTop: "0.5rem" }}>
              <span className="badge blue white-text" style={{ float: "none", marginRight: "0.5rem" }}>
                {question.clinical_case?.name || `Caso #${question.clinical_case_id}`}
              </span>
              {!isReadOnly && (
                <CustomButton flat className="red-text" onClick={clearClinicalCaseAssociation}>
                  Quitar asociación
                </CustomButton>
              )}
            </div>
          )}
        </CustomCol>
      </CustomRow>

      <CustomRow>
        <CustomCol s={12}>
          <h5>Respuestas</h5>
        </CustomCol>
      </CustomRow>

      {(question.answers || []).map((answer, index) => (
        <CustomRow key={answer.id || `answer-${index}`}>
          <CustomCol s={12} m={5}>
            <CustomTextInput
              id={`answer-text-${index}`}
              label={`Respuesta ${index + 1}`}
              value={answer.text || ""}
              onChange={(event) => onAnswerFieldChange(index, "text", event.target.value)}
              disabled={isReadOnly}
              maxLength={500}
            />
          </CustomCol>
          <CustomCol s={12} m={5}>
            <CustomTextInput
              id={`answer-description-${index}`}
              label="Explicación"
              value={answer.description || ""}
              onChange={(event) => onAnswerFieldChange(index, "description", event.target.value)}
              disabled={isReadOnly}
              maxLength={500}
            />
          </CustomCol>
          <CustomCol s={12} m={2}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Correcta</label>
            <label>
              <input
                type="radio"
                name="correct-answer"
                checked={!!answer.is_correct}
                disabled={isReadOnly}
                onChange={() => onAnswerCorrectChange(index)}
              />
              <span>Seleccionar</span>
            </label>
            {!isReadOnly && (
              <CustomButton
                flat
                className="red-text"
                icon="delete"
                tooltip="Eliminar respuesta"
                onClick={() => removeAnswer(index)}
                style={{ marginTop: "0.5rem" }}
              />
            )}
          </CustomCol>
        </CustomRow>
      ))}

      {!isReadOnly && (
        <CustomRow>
          <CustomCol s={12}>
            <CustomButton flat icon="add" className="green-text" onClick={addAnswer}>
              Agregar respuesta
            </CustomButton>
          </CustomCol>
        </CustomRow>
      )}

      <CustomRow>
        <CustomCol s={12} className="right-align">
          <CustomButton flat className="grey-text text-darken-2" onClick={() => history.push("/dashboard/questions")}>
            Volver
          </CustomButton>
          {!isEditMode && !isCreateMode ? (
            <CustomButton
              className="green"
              icon="edit"
              iconPosition="right"
              onClick={() => history.push(`/dashboard/questions/${question.id}/edit`)}
            >
              Editar
            </CustomButton>
          ) : (
            <CustomButton
              className="green"
              icon="save"
              iconPosition="right"
              onClick={saveQuestion}
              isPending={saving}
              isPendingText="GUARDANDO..."
            >
              {isCreateMode ? "Crear pregunta" : "Guardar cambios"}
            </CustomButton>
          )}
        </CustomCol>
      </CustomRow>
    </div>
  );
};

export default QuestionDetail;
