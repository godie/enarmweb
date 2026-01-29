import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExamService from "../../services/ExamService";
import {
    CustomTable,
    CustomButton,
    CustomPagination,
    CustomPreloader,
    CustomRow,
    CustomCol,
    CustomIcon
} from "../custom";
import { alertError } from "../../services/AlertService";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchQuestions = async (currentPage) => {
    setLoading(true);
    try {
      const response = await ExamService.getAllQuestions(currentPage);
      setQuestions(response.data.questions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alertError("Error", "No se pudieron cargar las preguntas.");
      setQuestions([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading && questions.length === 0) {
    return (
        <div className="center-align" style={{ padding: '50px' }}>
            <CustomPreloader active color="green" size="big" />
        </div>
    );
  }

  return (
    <div className="question-list-container">
      <CustomRow>
        <CustomCol s={12}>
          <h4 className="grey-text text-darken-3">Listado de Preguntas</h4>
          <CustomTable className="highlight z-depth-1 white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Texto de la Pregunta</th>
                <th>¿Pertenece a Caso Clínico?</th>
                <th>Caso Clínico Asociado</th>
                <th className="right-align">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td>{question.id}</td>
                  <td>{question.text.substring(0, 100)}{question.text.length > 100 ? "..." : ""}</td>
                  <td>{question.clinicalCaseId ? "Sí" : "No"}</td>
                  <td>
                    {question.clinicalCaseId ? (
                      <Link to={`/dashboard/edit/caso/${question.clinicalCaseId}`}>
                        {question.clinicalCaseName || `Caso ID: ${question.clinicalCaseId}`}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="right-align">
                    <CustomButton
                        flat
                        href={`#/dashboard/question/${question.id}`}
                        icon="visibility"
                        className="blue-text"
                        tooltip={{ text: "Ver detalle", position: 'top' }}
                    />
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                    <td colSpan="5" className="center-align">No hay preguntas disponibles</td>
                </tr>
              )}
            </tbody>
          </CustomTable>
          {totalPages > 1 && (
            <div className="center-align" style={{ marginTop: '20px' }}>
                <CustomPagination
                    activePage={page}
                    items={totalPages}
                    leftBtn={<CustomButton waves="light" flat> <CustomIcon>chevron_left</CustomIcon></CustomButton>}
                    rightBtn={<CustomButton waves="light" flat><CustomIcon>chevron_right</CustomIcon></CustomButton>}
                    onSelect={handlePageChange}
                />
            </div>
          )}
        </CustomCol>
      </CustomRow>
      {loading && questions.length > 0 && (
        <div className="center-align">
            <CustomPreloader active color="green" size="small" />
        </div>
      )}
    </div>
  );
};

export default QuestionList;
