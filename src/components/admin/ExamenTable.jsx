import { useState, useEffect, useCallback } from 'react';
import {
    CustomRow,
    CustomCol,
    CustomTable,
    CustomPreloader
} from '../custom';
import ExamService from '../../services/ExamService';
import { alertError, alertSuccess, confirmDialog } from '../../services/AlertService';
import ExamenRow from './ExamenRow';

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
                await ExamService.deleteExam(exam.id);
                alertSuccess("Examen Eliminado", "El examen ha sido eliminado");
                loadExams(false); // Don't show preloader for refresh after delete
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
                                <th>Casos Clínicos</th>
                                <th className="right-align">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="center-align">No hay exámenes configurados</td>
                                </tr>
                            ) : (
                                exams.map(exam => (
                                    <ExamenRow
                                        key={exam.id}
                                        exam={exam}
                                        onDelete={handleDeleteExam}
                                    />
                                ))
                            )}
                        </tbody>
                    </CustomTable>
                </CustomCol>
            </CustomRow>
        </div>
    );
};

export default ExamenTable;
