import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CustomRow,
  CustomCol,
  CustomTable,
  CustomPreloader,
  CustomButton,
  CustomSelect,
  CustomTextInput
} from "../custom";
import ExamService from "../../services/ExamService";
import { alertError, alertSuccess, confirmDialog } from "../../services/AlertService";
import EnarmUtil from "../../modules/EnarmUtil";

const QuestionTable = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState(() => {
    const cached = EnarmUtil.getCategories();
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    text: "",
    categoryId: "",
    origin: "all"
  });

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category.name])),
    [categories]
  );

  const loadData = useCallback(async (showPreloader = true) => {
    if (showPreloader) setLoading(true);
    try {
      const questionsResponse = await ExamService.getAllQuestions();
      const questionsData = questionsResponse.data;
      const parsedQuestions = Array.isArray(questionsData)
        ? questionsData
        : Array.isArray(questionsData?.questions)
          ? questionsData.questions
          : [];
      setQuestions(parsedQuestions);

      if (categories.length === 0) {
        const categoriesResponse = await ExamService.loadCategories();
        const parsedCategories = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
        setCategories(parsedCategories);
        EnarmUtil.setCategories(JSON.stringify(parsedCategories));
      }
    } catch (error) {
      console.error("Error loading questions", error);
      alertError("Preguntas", "No se pudieron cargar las preguntas.");
    } finally {
      setLoading(false);
    }
  }, [categories.length]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredQuestions = useMemo(() => {
    const textFilter = filters.text.trim().toLowerCase();
    return questions.filter((question) => {
      const categoryMatch =
        !filters.categoryId || String(question.category_id) === String(filters.categoryId);
      const isStandalone = !question.clinical_case_id;
      const originMatch =
        filters.origin === "all" ||
        (filters.origin === "standalone" && isStandalone) ||
        (filters.origin === "clinical_case" && !isStandalone);
      const textMatch = !textFilter || (question.text || "").toLowerCase().includes(textFilter);
      return categoryMatch && originMatch && textMatch;
    });
  }, [questions, filters]);

  const handleDelete = async (question) => {
    const accepted = await confirmDialog(
      "Eliminar pregunta",
      "¿Seguro que deseas eliminar esta pregunta? Esta acción no se puede deshacer."
    );
    if (!accepted) return;

    try {
      await ExamService.deleteQuestion(question.id);
      await alertSuccess("Preguntas", "La pregunta fue eliminada.");
      loadData(false);
    } catch (error) {
      console.error("Error deleting question", error);
      alertError("Preguntas", "No se pudo eliminar la pregunta.");
    }
  };

  if (loading) {
    return (
      <div className="center-align" style={{ padding: "50px" }}>
        <CustomPreloader active color="green" size="big" />
      </div>
    );
  }

  return (
    <div className="question-table-container">
      <CustomRow>
        <CustomCol s={12}>
          <h4 className="grey-text text-darken-3">{`Gestión de Preguntas (${filteredQuestions.length})`}</h4>
          <div className="right-align" style={{ marginBottom: "1rem" }}>
            <CustomButton
              node="a"
              to="/dashboard/questions/new"
              className="green"
              icon="add"
              iconPosition="right"
            >
              Agregar una nueva pregunta
            </CustomButton>
          </div>
        </CustomCol>
      </CustomRow>

      <CustomRow>
        <CustomCol s={12} m={4}>
          <CustomTextInput
            id="question-search"
            label="Buscar por texto"
            value={filters.text}
            onChange={(event) => setFilters((prev) => ({ ...prev, text: event.target.value }))}
          />
        </CustomCol>
        <CustomCol s={12} m={4}>
          <CustomSelect
            id="question-filter-category"
            label="Especialidad"
            value={filters.categoryId}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, categoryId: event.target.value }))
            }
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </CustomSelect>
        </CustomCol>
        <CustomCol s={12} m={4}>
          <CustomSelect
            id="question-filter-origin"
            label="Tipo de pregunta"
            value={filters.origin}
            onChange={(event) => setFilters((prev) => ({ ...prev, origin: event.target.value }))}
          >
            <option value="all">Todas</option>
            <option value="standalone">Sueltas</option>
            <option value="clinical_case">En caso clínico</option>
          </CustomSelect>
        </CustomCol>
      </CustomRow>

      <CustomRow>
        <CustomCol s={12}>
          <CustomTable className="highlight z-depth-1">
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Especialidad</th>
                <th>Caso clínico</th>
                <th>Tipo</th>
                <th>Respuestas</th>
                <th className="right-align">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="center-align">
                    No se encontraron preguntas con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((question) => (
                  <tr key={question.id}>
                    <td>{question.text}</td>
                    <td>{categoryMap.get(String(question.category_id)) || "Sin especialidad"}</td>
                    <td>
                      {question.clinical_case?.name ||
                        (question.clinical_case_id ? `Caso #${question.clinical_case_id}` : "Sin caso")}
                    </td>
                    <td>
                      {question.clinical_case_id ? (
                        <span className="badge blue white-text">Caso clínico</span>
                      ) : (
                        <span className="badge green white-text">Suelta</span>
                      )}
                    </td>
                    <td className="center-align">{Array.isArray(question.answers) ? question.answers.length : 0}</td>
                    <td className="right-align">
                      <CustomButton
                        flat
                        node="a"
                        to={`/dashboard/questions/${question.id}`}
                        className="blue-text"
                        icon="visibility"
                        tooltip="Ver pregunta"
                      />
                      <CustomButton
                        flat
                        node="a"
                        to={`/dashboard/questions/${question.id}/edit`}
                        className="green-text text-darken-2"
                        icon="edit"
                        tooltip="Editar pregunta"
                      />
                      <CustomButton
                        flat
                        className="red-text"
                        icon="delete"
                        tooltip="Eliminar pregunta"
                        onClick={() => handleDelete(question)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </CustomTable>
        </CustomCol>
      </CustomRow>
      <CustomButton
        node="a"
        to="/dashboard/questions/new"
        className="red"
        large
        floating
        fab
        icon="add"
        tooltip={{ text: "Agregar una nueva pregunta", position: "top" }}
        waves="light"
      />
    </div>
  );
};

export default QuestionTable;
