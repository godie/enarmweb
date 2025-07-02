import React, { useState, useEffect, useCallback } from "react";
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
  CustomIcon,
} from "../custom";
import { alertSuccess, alertError, alertWarning } from "../../services/AlertService";
import Materialize from "materialize-css";

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const ExamCreator = () => {
  const { id: examIdFromParams } = useParams(); // Renamed to avoid conflict
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
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

  // Load categories on mount
  useEffect(() => {
    ExamService.loadCategories()
      .then((response) => {
        setCategories(response.data);
        if (response.data.length > 0 && !isEditing) {
            // setExam(prevExam => ({ ...prevExam, category_id: response.data[0].id.toString() }));
        }
      })
      .catch((error) => {
        alertError("Error", "No se pudieron cargar las categorías.");
        console.error("Error loading categories:", error);
      })
      .finally(() => {
         // Initialization for Materialize select needs to happen after options are populated
        setTimeout(() => {
            const selectElems = document.querySelectorAll('select');
            Materialize.FormSelect.init(selectElems);
        }, 0);
      });
  }, [isEditing]);

  // Load exam data if editing
  useEffect(() => {
    if (examIdFromParams) {
      setIsEditing(true);
      setLoading(true);
      ExamService.getExam(examIdFromParams) // Assuming getExam will be implemented in ExamService
        .then((response) => {
          const examData = response.data;
          setExam({
            id: examData.id,
            name: examData.name || "",
            description: examData.description || "",
            category_id: examData.category_id ? examData.category_id.toString() : "",
            // exam_questions_attributes needs to be mapped from examData.exam_questions
            // preserving original question details for display
            exam_questions_attributes: examData.exam_questions ? examData.exam_questions.map(eq => ({
                id: eq.id, // This is exam_question_id
                question_id: eq.question.id,
                text: eq.question.text, // For display
                points: eq.points,
                position: eq.position,
                _destroy: false
            })).sort((a, b) => a.position - b.position) : [],
          });
          setTimeout(() => {
            Materialize.updateTextFields();
            const selectElems = document.querySelectorAll('select');
            Materialize.FormSelect.init(selectElems);
          }, 100);
        })
        .catch((error) => {
          alertError("Error", `No se pudo cargar el examen con ID: ${examIdFromParams}.`);
          console.error("Error loading exam:", error);
          history.push("/admin/exams"); // Redirect if exam not found or error
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
       setTimeout(() => {
            Materialize.updateTextFields();
            const selectElems = document.querySelectorAll('select');
            Materialize.FormSelect.init(selectElems);
        }, 100);
    }
  }, [examIdFromParams, history]);

  // Debounced search for available questions
  const debouncedSearchQuestions = useCallback(
    debounce(async (search) => {
      if (search.trim() === "") {
        setAvailableQuestions([]);
        return;
      }
      setLoadingQuestions(true);
      try {
        // Using getAllQuestions, which is currently simulated and not truly searching by text.
        // This will need backend support for actual text-based search.
        // For now, it will just list all questions.
        const response = await ExamService.getAllQuestions(1); // Assuming page 1 for now
        // Filter locally if backend doesn't support search by text yet
        const filtered = response.data.questions.filter(q =>
            q.text.toLowerCase().includes(search.toLowerCase()) &&
            !exam.exam_questions_attributes.find(eq => eq.question_id === q.id && !eq._destroy) // Exclude already added questions
        );
        setAvailableQuestions(filtered);
      } catch (error) {
        alertError("Error", "No se pudieron buscar las preguntas.");
        console.error("Error searching questions:", error);
      } finally {
        setLoadingQuestions(false);
      }
    }, 500),
    [exam.exam_questions_attributes] // Recreate if selected questions change
  );

  useEffect(() => {
    debouncedSearchQuestions(searchTerm);
  }, [searchTerm, debouncedSearchQuestions]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExam((prevExam) => ({ ...prevExam, [name]: value }));
  };

  const handleCategoryChange = (event) => {
    setExam((prevExam) => ({ ...prevExam, category_id: event.target.value }));
     setTimeout(() => { // Re-initialize select after state update if needed, though Materialize should handle it
        const selectElems = document.querySelectorAll('select');
        Materialize.FormSelect.init(selectElems);
    }, 0);
  };

  const addQuestionToExam = (question) => {
    const existingQuestion = exam.exam_questions_attributes.find(
      (eq) => eq.question_id === question.id && !eq._destroy
    );
    if (existingQuestion) {
      alertWarning("Advertencia", "Esta pregunta ya ha sido añadida al examen.");
      return;
    }

    // If question was previously added and then marked for destroy, unmark it
    const previouslyDestroyed = exam.exam_questions_attributes.find(eq => eq.question_id === question.id && eq._destroy);
    if(previouslyDestroyed){
        setExam(prevExam => ({
            ...prevExam,
            exam_questions_attributes: prevExam.exam_questions_attributes.map(eq =>
                eq.question_id === question.id ? {...previouslyDestroyed, _destroy: false, points: 1, position: prevExam.exam_questions_attributes.filter(q => !q._destroy).length + 1 } : eq
            )
        }));
    } else {
        const newExamQuestion = {
          question_id: question.id,
          text: question.text, // For display purposes in the creator
          points: 1, // Default points
          position: exam.exam_questions_attributes.filter(q => !q._destroy).length + 1, // Next position
          _destroy: false,
        };
        setExam((prevExam) => ({
          ...prevExam,
          exam_questions_attributes: [...prevExam.exam_questions_attributes, newExamQuestion],
        }));
    }
    setSearchTerm(""); // Clear search
    setAvailableQuestions([]); // Clear available questions list
  };

  const handleQuestionAttributeChange = (index, field, value) => {
    const updatedQuestions = exam.exam_questions_attributes.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setExam((prevExam) => ({ ...prevExam, exam_questions_attributes: updatedQuestions }));
  };

  const removeQuestionFromExam = (index) => {
    const questionToRemove = exam.exam_questions_attributes[index];
    if (questionToRemove.id) { // If it's an existing record from DB (has exam_question_id)
        handleQuestionAttributeChange(index, "_destroy", true);
    } else { // If it's a new question not yet saved
        setExam(prevExam => ({
            ...prevExam,
            exam_questions_attributes: prevExam.exam_questions_attributes.filter((_, i) => i !== index)
        }));
    }
    // Re-calculate positions for non-destroyed questions
    recalculatePositions();
  };

  const recalculatePositions = () => {
    setExam(prevExam => {
        let currentPosition = 1;
        const updatedAttrs = prevExam.exam_questions_attributes
            .filter(eq => !eq._destroy)
            .sort((a, b) => a.position - b.position) // Sort by current position first
            .map(eq => ({ ...eq, position: currentPosition++ }));

        // Add back the ones marked for destroy, without changing their position
        const destroyedAttrs = prevExam.exam_questions_attributes.filter(eq => eq._destroy);
        return { ...prevExam, exam_questions_attributes: [...updatedAttrs, ...destroyedAttrs] };
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
        return; // Cannot move further
    }

    // Find the question currently at newPosition and swap
    const otherQuestionIndex = exam.exam_questions_attributes.findIndex(q => q.position === newPosition && !q._destroy);

    const updatedAttrs = [...exam.exam_questions_attributes];
    if (otherQuestionIndex !== -1) {
        updatedAttrs[otherQuestionIndex] = { ...updatedAttrs[otherQuestionIndex], position: currentPosition };
    }
    updatedAttrs[index] = { ...questionToMove, position: newPosition };

    setExam(prev => ({ ...prev, exam_questions_attributes: updatedAttrs.sort((a,b) => a.position - b.position) }));
    // Positions will be recalculated visually by sorting for render, and finally before save.
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!exam.name.trim()) {
        alertError("Error", "El nombre del examen es obligatorio.");
        setLoading(false);
        return;
    }
    if (!exam.category_id) {
        alertError("Error", "Debe seleccionar una categoría.");
        setLoading(false);
        return;
    }
    if (exam.exam_questions_attributes.filter(q => !q._destroy).length === 0) {
        alertError("Error", "El examen debe tener al menos una pregunta.");
        setLoading(false);
        return;
    }

    // Ensure positions are sequential for non-destroyed items before saving
    let currentPosition = 1;
    // Process active questions first
    const activeQuestions = exam.exam_questions_attributes
        .filter(eq => !eq._destroy)
        .sort((a, b) => a.position - b.position) // Sort by current position first
        .map(eq => ({
            id: eq.id, // This is exam_question_id for existing ones being kept/updated
            question_id: eq.question_id,
            points: parseInt(eq.points, 10) || 0,
            position: currentPosition++, // Assign new sequential position
            _destroy: false
        }));

    // Process questions marked for destruction (only if they have an ID, meaning they exist in DB)
    const questionsToDestroy = exam.exam_questions_attributes
        .filter(eq => eq._destroy && eq.id) // Must have an ID to be destroyed on backend
        .map(eq => ({
            id: eq.id, // exam_question_id
            _destroy: true
            // No other attributes needed for destruction
        }));

    const final_exam_questions_attributes = [...activeQuestions, ...questionsToDestroy];

    const examPayload = {
      name: exam.name,
      description: exam.description,
      category_id: exam.category_id,
      exam_questions_attributes: final_exam_questions_attributes,
    };

    // Add exam ID to payload if editing
    if (isEditing && examIdFromParams) {
        examPayload.id = examIdFromParams;
    }

    try {
      if (isEditing) {
        await ExamService.updateExam(examIdFromParams, examPayload);
        alertSuccess("Éxito", "Examen actualizado correctamente.");
      } else {
        await ExamService.createExam(examPayload);
        alertSuccess("Éxito", "Examen creado correctamente.");
      }
      history.push("/admin/exams");
    } catch (error) {
      const errorMsg = error.response && error.response.data && error.response.data.errors
                        ? JSON.stringify(error.response.data.errors)
                        : `No se pudo ${isEditing ? 'actualizar' : 'crear'} el examen.`;
      alertError("Error", errorMsg);
      console.error("Error saving exam:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize Materialize components after data is loaded or changed
    Materialize.updateTextFields();
    const selectElems = document.querySelectorAll('select');
    Materialize.FormSelect.init(selectElems);
    const tooltipElems = document.querySelectorAll('.tooltipped');
    Materialize.Tooltip.init(tooltipElems);

    return () => { // Cleanup tooltips
        tooltipElems.forEach(el => {
            const instance = Materialize.Tooltip.getInstance(el);
            if (instance) {
                instance.destroy();
            }
        });
    }
  }); // Run on every render to catch dynamic elements

  if (loading && isEditing) return <CustomPreloader />;

  return (
    <div className="container">
      <h3 className="center">{isEditing ? "Editar Examen" : "Crear Nuevo Examen"}</h3>
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
            {categories.length > 0 ? (
                <CustomSelect
                    id="category_id"
                    label="Categoría *"
                    name="category_id"
                    value={exam.category_id}
                    onChange={handleCategoryChange}
                    required
                    >
                    <option value="" disabled>Seleccionar Categoría</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                    ))}
                </CustomSelect>
            ) : <p>Cargando categorías o no hay categorías disponibles...</p>}
          </CustomCol>
        </CustomRow>
        <CustomRow>
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

        <h5 className="center">Constructor de Preguntas del Examen</h5>

        {/* Search and Add Questions */}
        <CustomRow>
          <CustomCol s={12}>
            <CustomTextInput
              id="searchTerm"
              name="searchTerm"
              label="Buscar preguntas para añadir..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="search"
            />
            {loadingQuestions && <CustomPreloader small />}
            {availableQuestions.length > 0 && (
              <CustomTable bordered responsive className="search-results-table">
                <thead>
                  <tr>
                    <th>Pregunta</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {availableQuestions.map((q) => (
                    <tr key={q.id}>
                      <td>{q.text.substring(0,150)}{q.text.length > 150 && "..."}</td>
                      <td>
                        <CustomButton
                          type="button"
                          small
                          className="green"
                          onClick={() => addQuestionToExam(q)}
                          tooltip="Añadir esta pregunta"
                          icon="add"
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

        <h6>Preguntas Añadidas al Examen</h6>
        {exam.exam_questions_attributes.filter(q => !q._destroy).length === 0 ? (
          <p className="center grey-text">Aún no se han añadido preguntas a este examen.</p>
        ) : (
          <CustomTable responsive striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Pregunta</th>
                <th>Puntos</th>
                <th>Posición</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {exam.exam_questions_attributes.map((eq, index) => !eq._destroy && (
                <tr key={eq.question_id || `new-${index}`}> {/* Use unique key */}
                  <td>{index + 1}</td>
                  <td style={{maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{eq.text}</td>
                  <td>
                    <CustomTextInput
                      type="number"
                      min="0"
                      value={eq.points}
                      onChange={(e) => handleQuestionAttributeChange(index, "points", e.target.value)}
                      style={{ width: "80px", height:"2rem" }}
                    />
                  </td>
                  <td>
                     <CustomTextInput
                      type="number"
                      min="1"
                      value={eq.position}
                      onChange={(e) => handleQuestionAttributeChange(index, "position", parseInt(e.target.value))}
                      style={{ width: "80px", height:"2rem" }}
                    />
                  </td>
                  <td>
                    <CustomButton
                      type="button"
                      floating
                      small
                      className="blue lighten-1 tooltipped"
                      tooltip="Mover arriba"
                      data-position="top"
                      onClick={() => moveQuestion(index, "up")}
                      disabled={eq.position === 1}
                      icon="arrow_upward"
                    />
                    <CustomButton
                      type="button"
                      floating
                      small
                      className="blue lighten-1 tooltipped"
                      tooltip="Mover abajo"
                      data-position="top"
                      onClick={() => moveQuestion(index, "down")}
                      disabled={eq.position === exam.exam_questions_attributes.filter(q => !q._destroy).length}
                      icon="arrow_downward"
                    />
                    <CustomButton
                      type="button"
                      floating
                      small
                      className="red tooltipped"
                      tooltip="Eliminar pregunta"
                      data-position="top"
                      onClick={() => removeQuestionFromExam(index)}
                      icon="delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </CustomTable>
        )}

        <CustomRow style={{ marginTop: "30px" }}>
          <CustomCol s={12} className="center-align">
            <CustomButton type="button" large waves="light" className="grey" onClick={() => history.goBack()} style={{marginRight: "10px"}}>
              Cancelar
            </CustomButton>
            <CustomButton type="submit" large waves="light" className="green" disabled={loading}>
              {loading ? 'Guardando...' : (isEditing ? "Actualizar Examen" : "Guardar Examen")}
            </CustomButton>
          </CustomCol>
        </CustomRow>
      </form>
    </div>
  );
};

export default ExamCreator;
