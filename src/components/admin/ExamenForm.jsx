import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    CustomRow,
    CustomCol,
    CustomCard,
    CustomButton,
    CustomSelect,
    CustomTextInput,
    CustomPreloader
} from '../custom';
import ExamService from '../../services/ExamService';
import { alertError, alertSuccess } from '../../services/AlertService';

const ExamenForm = () => {
    const { identificador } = useParams();
    const history = useHistory();
    const isEdit = !!identificador;

    const [loading, setLoading] = useState(isEdit);
    const [categories, setCategories] = useState([]);
    const [exam, setExam] = useState({
        name: '',
        description: '',
        category_id: '',
        exam_questions_attributes: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catsRes = await ExamService.loadCategories();
                setCategories(catsRes.data);

                if (isEdit) {
                    const examRes = await ExamService.getExam(identificador); // Need to add getExam to Service
                    setExam(examRes.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                alertError("Error", "No se pudieron cargar los datos");
                setLoading(false);
            }
        };
        fetchData();
    }, [identificador, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExam(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ExamService.saveExam(exam);
            alertSuccess("Éxito", `Examen ${isEdit ? 'actualizado' : 'creado'} correctamente`);
            history.push('/dashboard/examenes');
        } catch (error) {
            console.error("Error saving exam", error);
            alertError("Error", "No se pudo guardar el examen");
        }
    };

    if (loading) return <div className="center-align" style={{ padding: '50px' }}><CustomPreloader active /></div>;

    return (
        <CustomRow>
            <CustomCol s={12} m={8} offset="m2">
                <CustomCard
                    title={isEdit ? "Editar Examen" : "Nuevo Examen"}
                    className="white"
                >
                    <form onSubmit={handleSubmit}>
                        <CustomRow>
                            <CustomCol s={12}>
                                <CustomTextInput
                                    label="Nombre del Examen *"
                                    name="name"
                                    value={exam.name}
                                    onChange={handleChange}
                                    required
                                />
                            </CustomCol>
                            <CustomCol s={12}>
                                <CustomTextInput
                                    label="Descripción"
                                    name="description"
                                    value={exam.description}
                                    onChange={handleChange}
                                />
                            </CustomCol>
                            <CustomCol s={12}>
                                <CustomSelect
                                    label="Categoría/Especialidad *"
                                    name="category_id"
                                    value={exam.category_id}
                                    onChange={(e) => setExam(prev => ({ ...prev, category_id: e.target.value }))}
                                    required
                                >
                                    <option value="" disabled>Selecciona una especialidad</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </CustomSelect>
                            </CustomCol>
                        </CustomRow>
                        <div className="right-align" style={{ marginTop: '20px' }}>
                            <CustomButton
                                flat
                                className="grey-text"
                                onClick={() => history.push('/dashboard/examenes')}
                                type="button"
                            >
                                Cancelar
                            </CustomButton>
                            <CustomButton
                                className="green white-text"
                                type="submit"
                                waves="light"
                            >
                                {isEdit ? 'Actualizar' : 'Crear'} Examen
                            </CustomButton>
                        </div>
                    </form>
                </CustomCard>
            </CustomCol>
        </CustomRow>
    );
};

export default ExamenForm;
