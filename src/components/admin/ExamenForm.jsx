import { useState, useEffect, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import ExamService from "../../services/ExamService";
import {
  CustomButton,
  CustomTextInput,
  CustomTextarea,
  CustomSelect,
  CustomRow,
  CustomCol,
  CustomPreloader,
  CustomTable,
  CustomCard,
} from "../custom";
import { alertSuccess, alertError } from "../../services/AlertService";

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const ExamenForm = () => {
  const { identificador } = useParams();
  const history = useHistory();
  const isEdit = !!identificador;

  const [exam, setExam] = useState({
    name: "",
    description: "",
    category_id: "",
    exam_questions_attributes: [],
  });
  const [categories, setCategories] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Load categories and exam data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catsRes = await ExamService.loadCategories();
        setCategories(catsRes.data);

        if (isEdit) {
          const examRes = await ExamService.getExam(identificador);
          const examData = examRes.data;
          setExam({
            id: examData.id,
            name: examData.name || "",
            description: examData.description || "",
            category_id: examData.category_id ? examData.category_id.toString() : "",
            exam_questions_attributes: examData.exam_questions ? examData.exam_questions.map(eq => ({
                id: eq.id,
                question_id: eq.question.id,
                text: eq.question.text,
                points: eq.points,
                position: eq.position,
                _destroy: false
            })).sort((a, b) => a.position - b.position) : [],
          });
        }
      } catch (error) {
        console.error("Error fetching data", error);
        alertError("Error", "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [identificador, isEdit]);

  // Debounced search for available questions
  const debouncedSearchQuestions = useMemo(
    () => debounce(async (search) => {
      if (search.trim() === "") {
        setAvailableQuestions([]);
        return;
      }
      setLoadingQuestions(true);
      try {
        const response = await ExamService.getAllQuestions(1);
        const filtered = response.data.questions.filter(q =>
            q.text.toLowerCase().includes(search.toLowerCase()) &&
            !exam.exam_questions_attributes.find(eq => eq.question_id === q.id && !eq._destroy)
        );
        setAvailableQuestions(filtered);
      } catch (error) {
        console.error("Error searching questions:", error);
      } finally {
        setLoadingQuestions(false);
      }
    }, 500),
    [exam.exam_questions_attributes]
  );

  useEffect(() => {
    debouncedSearchQuestions(searchTerm);
  }, [searchTerm, debouncedSearchQuestions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExam((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestionToExam = (question) => {
    const previouslyDestroyed = exam.exam_questions_attributes.find(eq => eq.question_id === question.id && eq._destroy);
    if(previouslyDestroyed){
        setExam(prev => ({
            ...prev,
            exam_questions_attributes: prev.exam_questions_attributes.map(eq =>
                eq.question_id === question.id ? {...previouslyDestroyed, _destroy: false, points: 1, position: prev.exam_questions_attributes.filter(q => !q._destroy).length + 1 } : eq
            )
        }));
    } else {
        const newExamQuestion = {
          question_id: question.id,
          text: question.text,
          points: 1,
          position: exam.exam_questions_attributes.filter(q => !q._destroy).length + 1,
          _destroy: false,
        };
        setExam((prev) => ({
          ...prev,
          exam_questions_attributes: [...prev.exam_questions_attributes, newExamQuestion],
        }));
    }
    setSearchTerm("");
    setAvailableQuestions([]);
  };

  const handleQuestionAttributeChange = (index, field, value) => {
    const updatedQuestions = exam.exam_questions_attributes.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setExam((prev) => ({ ...prev, exam_questions_attributes: updatedQuestions }));
  };

  const removeQuestionFromExam = (index) => {
    const questionToRemove = exam.exam_questions_attributes[index];
    if (questionToRemove.id) {
        handleQuestionAttributeChange(index, "_destroy", true);
    } else {
        setExam(prev => ({
            ...prev,
            exam_questions_attributes: prev.exam_questions_attributes.filter((_, i) => i !== index)
        }));
    }
    recalculatePositions();
  };

  const recalculatePositions = () => {
    setExam(prev => {
        let currentPosition = 1;
        const updatedAttrs = prev.exam_questions_attributes
            .filter(eq => !eq._destroy)
            .sort((a, b) => a.position - b.position)
            .map(eq => ({ ...eq, position: currentPosition++ }));

        const destroyedAttrs = prev.exam_questions_attributes.filter(eq => eq._destroy);
        return { ...prev, exam_questions_attributes: [...updatedAttrs, ...destroyedAttrs] };
    });
  };

  const moveQuestion = (index, direction) => {
    const activeQuestions = exam.exam_questions_attributes.filter(q => !q._destroy);
    if (activeQuestions.length < 2) return;

    const questionToMove = exam.exam_questions_attributes[index];
    const currentPosition = questionToMove.position;
    let newPosition = currentPosition;

    if (direction === "up" && currentPosition > 1) {
        newPosition = currentPosition - 1;
    } else if (direction === "down" && currentPosition < activeQuestions.length) {
        newPosition = currentPosition + 1;
    } else {
        return;
    }

    const otherQuestionIndex = exam.exam_questions_attributes.findIndex(q => q.position === newPosition && !q._destroy);

    const updatedAttrs = [...exam.exam_questions_attributes];
    if (otherQuestionIndex !== -1) {
        updatedAttrs[otherQuestionIndex] = { ...updatedAttrs[otherQuestionIndex], position: currentPosition };
    }
    updatedAttrs[index] = { ...questionToMove, position: newPosition };

    setExam(prev => ({ ...prev, exam_questions_attributes: updatedAttrs.sort((a,b) => a.position - b.position) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (exam.exam_questions_attributes.filter(q => !q._destroy).length === 0) {
        alertError("Error", "El examen debe tener al menos una pregunta.");
        setLoading(false);
        return;
    }

    let currentPosition = 1;
    const activeQuestions = exam.exam_questions_attributes
        .filter(eq => !eq._destroy)
        .sort((a, b) => a.position - b.position)
        .map(eq => ({
            id: eq.id,
            question_id: eq.question_id,
            points: parseInt(eq.points, 10) || 0,
            position: currentPosition++,
            _destroy: false
        }));

    const questionsToDestroy = exam.exam_questions_attributes
        .filter(eq => eq._destroy && eq.id)
        .map(eq => ({
            id: eq.id,
            _destroy: true
        }));

    const final_exam_questions_attributes = [...activeQuestions, ...questionsToDestroy];

    const examPayload = {
      name: exam.name,
      description: exam.description,
      category_id: exam.category_id,
      exam_questions_attributes: final_exam_questions_attributes,
    };

    if (isEdit) {
        examPayload.id = identificador;
    }

    try {
      if (isEdit) {
        await ExamService.updateExam(identificador, examPayload);
        alertSuccess("Éxito", "Examen actualizado correctamente.");
      } else {
        await ExamService.createExam(examPayload);
        alertSuccess("Éxito", "Examen creado correctamente.");
      }
      history.push("/dashboard/examenes");
    } catch (error) {
      console.error("Error saving exam:", error);
      alertError("Error", "No se pudo guardar el examen.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <div className="center-align" style={{ padding: '50px' }}><CustomPreloader active /></div>;

  return (
    <CustomRow>
      <CustomCol s={12}>
        <CustomCard title={isEdit ? "Editar Examen" : "Crear Nuevo Examen"} className="white">
          <form onSubmit={handleSubmit}>
            <CustomRow>
              <CustomCol s={12} m={6}>
                <CustomTextInput
                  id="name"
                  name="name"
                  label="Nombre del Examen *"
                  value={exam.name}
                  onChange={handleInputChange}
                  required
                />
              </CustomCol>
              <CustomCol s={12} m={6}>
                <CustomSelect
                    id="category_id"
                    label="Categoría *"
                    name="category_id"
                    value={exam.category_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="" disabled>Seleccionar Categoría</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                    ))}
                </CustomSelect>
              </CustomCol>
              <CustomCol s={12}>
                <CustomTextarea
                  id="description"
                  name="description"
                  label="Descripción del Examen"
                  value={exam.description}
                  onChange={handleInputChange}
                />
              </CustomCol>
            </CustomRow>

            <div className="divider" style={{ margin: "20px 0" }}></div>
            <h5>Constructor de Preguntas</h5>

            <CustomRow>
              <CustomCol s={12}>
                <CustomTextInput
                  id="searchTerm"
                  label="Buscar preguntas para añadir..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon="search"
                />
                {loadingQuestions && <CustomPreloader small />}
                {availableQuestions.length > 0 && (
                  <CustomTable bordered responsive className="highlight">
                    <thead>
                      <tr>
                        <th>Pregunta</th>
                        <th className="right-align">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableQuestions.map((q) => (
                        <tr key={q.id}>
                          <td>{q.text.substring(0,150)}{q.text.length > 150 && "..."}</td>
                          <td className="right-align">
                            <CustomButton
                              type="button"
                              flat
                              className="green-text"
                              onClick={() => addQuestionToExam(q)}
                              icon="add"
                              tooltip={{ text: "Añadir", position: 'top' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </CustomTable>
                )}
              </CustomCol>
            </CustomRow>

            <div className="divider" style={{ margin: "20px 0" }}></div>
            <h6>Preguntas en el Examen</h6>
            {exam.exam_questions_attributes.filter(q => !q._destroy).length === 0 ? (
              <p className="center grey-text">No hay preguntas añadidas.</p>
            ) : (
              <CustomTable responsive striped className="white z-depth-1">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Pregunta</th>
                    <th>Puntos</th>
                    <th>Posición</th>
                    <th className="right-align">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.exam_questions_attributes.map((eq, index) => !eq._destroy && (
                    <tr key={eq.question_id || `new-${index}`}>
                      <td>{index + 1}</td>
                      <td style={{maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{eq.text}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={eq.points}
                          onChange={(e) => handleQuestionAttributeChange(index, "points", e.target.value)}
                          style={{ width: "60px", height:"2rem", marginBottom: 0 }}
                        />
                      </td>
                      <td>{eq.position}</td>
                      <td className="right-align">
                        <CustomButton
                          type="button"
                          flat
                          className="blue-text"
                          onClick={() => moveQuestion(index, "up")}
                          disabled={eq.position === 1}
                          icon="arrow_upward"
                        />
                        <CustomButton
                          type="button"
                          flat
                          className="blue-text"
                          onClick={() => moveQuestion(index, "down")}
                          disabled={eq.position === exam.exam_questions_attributes.filter(q => !q._destroy).length}
                          icon="arrow_downward"
                        />
                        <CustomButton
                          type="button"
                          flat
                          className="red-text"
                          onClick={() => removeQuestionFromExam(index)}
                          icon="delete"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </CustomTable>
            )}

            <div className="right-align" style={{ marginTop: "30px" }}>
              <CustomButton type="button" flat onClick={() => history.push("/dashboard/examenes")} style={{marginRight: "10px"}}>
                Cancelar
              </CustomButton>
              <CustomButton type="submit" className="green" disabled={loading}>
                {loading ? 'Guardando...' : (isEdit ? "Actualizar Examen" : "Guardar Examen")}
              </CustomButton>
            </div>
          </form>
        </CustomCard>
      </CustomCol>
    </CustomRow>
  );
};

export default ExamenForm;
