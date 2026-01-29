import { useState, useEffect, useCallback } from 'react';
import {
    CustomRow,
    CustomCol,
    CustomTable,
    CustomPreloader,
    CustomButton,
    CustomPagination,
    CustomIcon
} from '../custom';
import ExamService from '../../services/ExamService';
import { alertError, alertSuccess, confirmDialog } from '../../services/AlertService';

const ExamenTable = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const loadExams = useCallback(async (currentPage = 1) => {
        setLoading(true);
        try {
            const res = await ExamService.getExams(currentPage);
            // Adapt to potential paginated or non-paginated response
            if (res.data && res.data.exams) {
                setExams(res.data.exams);
                setTotalPages(res.data.total_pages || 0);
            } else {
                setExams(res.data || []);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Error loading exams", error);
            alertError("Error", "No se pudieron cargar los exámenes");
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadExams(page);
    }, [loadExams, page]);

    const handleDeleteExam = async (exam) => {
        const confirm = await confirmDialog("¿Eliminar Examen?", `¿Estás seguro de que deseas eliminar ${exam.name}?`);
        if (confirm) {
            try {
                await ExamService.deleteExam(exam.id);
                alertSuccess("Examen Eliminado", "El examen ha sido eliminado");
                loadExams(page);
            } catch (error) {
                console.error("Error deleting exam", error);
                alertError("Error", "No se pudo eliminar el examen");
            }
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (loading && exams.length === 0) {
        return (
            <div className="center-align" style={{ padding: '50px' }}>
                <CustomPreloader active color="green" size="big" />
            </div>
        );
    }

    return (
        <div className="exam-table-container">
            <CustomRow>
                <CustomCol s={12}>
                    <h4 className="grey-text text-darken-3">Gestión de Exámenes</h4>
                    <CustomTable className="highlight z-depth-1 white">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Categoría</th>
                                <th>Preguntas</th>
                                <th className="right-align">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.name}</td>
                                    <td>{exam.description ? exam.description.substring(0, 50) + (exam.description.length > 50 ? "..." : "") : 'Sin descripción'}</td>
                                    <td>{exam.category ? exam.category.name : "N/A"}</td>
                                    <td>{exam.exam_questions?.length || exam.questions_count || 0}</td>
                                    <td className="right-align">
                                        <CustomButton
                                            flat
                                            href={`#/exam/${exam.id}`}
                                            icon="visibility"
                                            className="blue-grey-text"
                                            tooltip={{ text: "Ver Examen (Usuario)", position: 'top' }}
                                        />
                                        <CustomButton
                                            flat
                                            href={`#/dashboard/edit/exam/${exam.id}`}
                                            icon="edit"
                                            className="blue-text"
                                            tooltip={{ text: "Editar Examen", position: 'top' }}
                                        />
                                        <CustomButton
                                            flat
                                            className="red-text"
                                            icon="delete"
                                            onClick={() => handleDeleteExam(exam)}
                                            tooltip={{ text: "Eliminar Examen", position: 'top' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {exams.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="center-align">No hay exámenes configurados</td>
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
            {loading && exams.length > 0 && (
                <div className="center-align">
                    <CustomPreloader active color="green" size="small" />
                </div>
            )}
        </div>
    );
};

export default ExamenTable;
