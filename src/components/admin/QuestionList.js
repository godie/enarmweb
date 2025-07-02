import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExamService from "../../services/ExamService"; // Assuming ExamService will have a method to fetch all questions
import { CustomTable, CustomButton, CustomPagination, CustomPreloader } from "../custom"; // Assuming custom components for UI
import { alertError } from "../../services/AlertService";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  const fetchQuestions = async (currentPage) => {
    setLoading(true);
    try {
      // TODO: Implement ExamService.getAllQuestions(currentPage)
      // For now, using a placeholder. Replace with actual API call.
      // const response = await ExamService.getAllQuestions(currentPage);
      // setQuestions(response.data.questions); // Assuming API returns { questions: [], totalPages: X }
      // setTotalPages(response.data.totalPages);

      // Placeholder data:
      console.warn("Using placeholder data for questions. Implement API call in ExamService.getAllQuestions");
      const placeholderData = {
        questions: [
          { id: 1, text: "Cual es la causa mas frecuente de hipertension arterial sistemica en el adulto?", clinicalCaseId: 1, clinicalCaseName: "Caso Hipertension Adulto" },
          { id: 2, text: "Paciente masculino de 34 anios de edad, con diagnostico de VIH hace 5 anios...", clinicalCaseId: 2, clinicalCaseName: "Caso VIH" },
          { id: 3, text: "Cual es el tratamiento de eleccion para la crisis hipertensiva tipo urgencia?", clinicalCaseId: null, clinicalCaseName: null },
          { id: 4, text: "Definicion de Preeclampsia", clinicalCaseId: 3, clinicalCaseName: "Caso Obstetricia" },
          { id: 5, text: "Cual es el tumor oseo maligno mas frecuente en ninos?", clinicalCaseId: null, clinicalCaseName: null },
        ],
        totalPages: 1,
      };
      setQuestions(placeholderData.questions);
      setTotalPages(placeholderData.totalPages);
      // End of placeholder data

    } catch (error) {
      console.error("Error fetching questions:", error);
      alertError("Error", "No se pudieron cargar las preguntas.");
      setQuestions([]); // Clear questions on error
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <CustomPreloader />;
  }

  return (
    <div className="container">
      <h3 className="center">Listado de Preguntas</h3>
      {questions.length === 0 && !loading ? (
        <p className="center">No hay preguntas para mostrar.</p>
      ) : (
        <>
          <CustomTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Texto de la Pregunta</th>
                <th>¿Pertenece a Caso Clínico?</th>
                <th>Caso Clínico Asociado</th>
                <th>Acciones</th>
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
                      // TODO: Update this link when the route for viewing a specific clinical case is confirmed/created
                      // For now, assuming a route like /admin/caso/:id
                      <Link to={`/admin/caso/${question.clinicalCaseId}`}>
                        {question.clinicalCaseName || `Caso ID: ${question.clinicalCaseId}`}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/question/${question.id}`}>
                      <CustomButton small tooltip="Ver detalle">Ver Detalle</CustomButton>
                    </Link>
                    {/* Future actions like edit/delete could go here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </CustomTable>
          {totalPages > 1 && (
            <CustomPagination
              activePage={page}
              items={totalPages}
              leftBtn={<CustomButton waves="light" flat> Anterior </CustomButton>}
              rightBtn={<CustomButton waves="light" flat> Siguiente </CustomButton>}
              onSelect={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default QuestionList;
