import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExamService from "../../services/ExamService";
import { CustomTable, CustomButton, CustomPagination, CustomPreloader, CustomIcon } from "../custom";
import { alertError, alertSuccess, alertConfirm } from "../../services/AlertService";
import Materialize from "materialize-css";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchExams = async (currentPage) => {
    setLoading(true);
    try {
      const response = await ExamService.getExams(currentPage); // Uses the new getExams for entity Exam
      setExams(response.data.exams || response.data); // Adapt based on actual API response structure
      setTotalPages(response.data.total_pages || 0); // Adapt based on actual API response structure
    } catch (error) {
      console.error("Error fetching exams:", error);
      // Check if error.response exists, as network errors might not have it
      const errorMessage = error.response && error.response.data && error.response.data.message
                           ? error.response.data.message
                           : "No se pudieron cargar los exámenes.";
      alertError("Error", errorMessage);
      setExams([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams(page);
  }, [page]);

  useEffect(() => {
    // For tooltips on dynamically added buttons if any, or general initialization
    const tooltipElems = document.querySelectorAll('.tooltipped');
    Materialize.Tooltip.init(tooltipElems);
    return () => {
        tooltipElems.forEach(el => {
            const instance = Materialize.Tooltip.getInstance(el);
            if (instance) {
                instance.destroy();
            }
        });
    }
  });


  const handleDeleteExam = (examId) => {
    alertConfirm("Confirmar", "¿Estás seguro de que deseas eliminar este examen?", async () => {
      setLoading(true);
      try {
        await ExamService.deleteExam(examId);
        alertSuccess("Éxito", "Examen eliminado correctamente.");
        fetchExams(page); // Refresh list
      } catch (error) {
        console.error("Error deleting exam:", error);
        alertError("Error", "No se pudo eliminar el examen.");
        setLoading(false);
      }
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading && exams.length === 0) { // Show preloader only on initial load or if exams are empty
    return <CustomPreloader />;
  }

  return (
    <div className="container">
      <CustomRow className="valign-wrapper">
        <CustomCol s={8}> <h3 className="center-align" style={{marginLeft:"15%"}}>Listado de Exámenes</h3> </CustomCol>
        <CustomCol s={4} className="right-align">
            <CustomButton
                component={Link}
                to="/admin/exams/new"
                className="green"
                waves="light"
                tooltip="Crear Nuevo Examen"
                icon="add"
            >
                Nuevo Examen
            </CustomButton>
        </CustomCol>
      </CustomRow>

      {exams.length === 0 && !loading ? (
        <p className="center">No hay exámenes para mostrar. ¡Crea uno nuevo!</p>
      ) : (
        <>
          <CustomTable responsive striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Preguntas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.name}</td>
                  <td>{exam.description ? exam.description.substring(0, 50) + (exam.description.length > 50 ? "..." : "") : "N/A"}</td>
                  <td>{exam.category ? exam.category.name : "N/A"}</td>
                  <td>{exam.exam_questions ? exam.exam_questions.length : (exam.questions_count || 0)}</td>
                  <td>
                    <CustomButton
                      component={Link}
                      to={`/exam/${exam.id}`} // Link to user-facing exam view
                      className="blue-grey lighten-1 tooltipped"
                      small
                      icon="visibility"
                      tooltip="Ver Examen (Usuario)"
                      data-position="top"
                      style={{marginRight: "5px"}}
                    />
                    <CustomButton
                      component={Link}
                      to={`/admin/exams/${exam.id}/edit`}
                      className="amber darken-2 tooltipped"
                      small
                      icon="edit"
                      tooltip="Editar Examen"
                      data-position="top"
                      style={{marginRight: "5px"}}
                    />
                    <CustomButton
                      onClick={() => handleDeleteExam(exam.id)}
                      className="red tooltipped"
                      small
                      icon="delete"
                      tooltip="Eliminar Examen"
                      data-position="top"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </CustomTable>
          {totalPages > 1 && (
            <CustomPagination
              activePage={page}
              items={totalPages}
              leftBtn={<CustomButton waves="light" flat> <CustomIcon>chevron_left</CustomIcon></CustomButton>}
              rightBtn={<CustomButton waves="light" flat><CustomIcon>chevron_right</CustomIcon></CustomButton>}
              onSelect={handlePageChange}
            />
          )}
        </>
      )}
       {loading && exams.length > 0 && <CustomPreloader />} {/* Show preloader at bottom if loading more pages */}
    </div>
  );
};

export default ExamList;
