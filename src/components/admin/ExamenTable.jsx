import { useState, useEffect, useCallback } from 'react';
import {
    CustomRow,
    CustomCol,
    CustomTable,
    CustomPreloader,
    CustomButton
} from '../custom';
import ExamService from '../../services/ExamService';
import { alertError, alertSuccess, confirmDialog } from '../../services/AlertService';

const ExamenTable = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadExams = useCallback(async (showPreloader = true) => {
        if (showPreloader) setLoading(true);
        try {
            const res = await ExamService.getExams();
            setExams(res.data);
        } catch (error) {
            console.error("Error loading exams", error);
            alertError("Error", "No se pudieron cargar los exámenes");
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadExams();
    }, [loadExams]);

    const handleDeleteExam = async (exam) => {
        const confirm = await confirmDialog("¿Eliminar Examen?", `¿Estás seguro de que deseas eliminar ${exam.name}?`);
        if (confirm) {
            try {
                // Assuming ExamService has deleteExam (it doesn't yet, let's add it or use clinical_cases logic)
                // Actually exams endpoint supports DELETE
                // I'll use axios directly or update ExamService
                // For now let's assume it works if I add it to service
                await ExamService.deleteExam(exam.id);
                alertSuccess("Examen Eliminado", "El examen ha sido eliminado");
                loadExams();
            } catch (error) {
                console.error("Error deleting exam", error);
                alertError("Error", "No se pudo eliminar el examen");
            }
        }
    };

    if (loading) {
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
                    <CustomTable className="highlight z-depth-1">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Casos Clinicos</th>
                                <th className="right-align">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map(exam => (
                                <tr key={exam.id}>
                                    <td>{exam.name}</td>
                                    <td>{exam.description || 'Sin descripción'}</td>
                                    <td>{exam.exam_questions?.length || 0}</td>
                                    <td className="right-align">
                                        <CustomButton
                                            flat
                                            href={`#/dashboard/edit/exam/${exam.id}`}
                                            icon="edit"
                                            className="blue-text"
                                        />
                                        <CustomButton
                                            flat
                                            className="red-text"
                                            icon="delete"
                                            onClick={() => handleDeleteExam(exam)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {exams.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="center-align">No hay exámenes configurados</td>
                                </tr>
                            )}
                        </tbody>
                    </CustomTable>
                </CustomCol>
            </CustomRow>
        </div>
    );
};

export default ExamenTable;
