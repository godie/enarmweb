import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    CustomRow,
    CustomCol,
    CustomButton,
    CustomPreloader,
    CustomCard
} from '../../components/custom';
import ExamService from '../../services/ExamService';

const EspecialidadCasos = () => {
    const { id } = useParams();
    const history = useHistory();
    const [specialty, setSpecialty] = useState(null);
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [specRes, casesRes] = await Promise.all([
                    ExamService.getCategory(id),
                    ExamService.getClinicalCasesByCategory(id)
                ]);

                setSpecialty(specRes.data);
                // Based on CasoTable.jsx, the backend returns { clinical_cases: [...] }
                setCases(casesRes.data.clinical_cases || []);
                setLoading(false);
            } catch (err) {
                console.error("Error loading specialty cases", err);
                setError("Ocurrió un error al cargar los casos. Por favor, intenta de nuevo más tarde.");
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="center-align" style={{ padding: '100px' }}>
                <CustomPreloader active color="green" size="big" />
                <p className="grey-text">Cargando casos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="center-align" style={{ padding: '50px' }}>
                <i className="material-icons large red-text text-lighten-2">error_outline</i>
                <h5 className="grey-text text-darken-2">{error}</h5>
                <CustomButton
                    className="mt-20"
                    onClick={() => history.push('/')}
                >
                    Volver al Dashboard
                </CustomButton>
            </div>
        );
    }

    return (
        <div className="especialidad-casos-container">
            <div className="header-section" style={{ padding: '30px 0', marginBottom: '20px' }}>
                <CustomRow className="valign-wrapper">
                    <CustomCol s={12} m={8}>
                        <h4 className="grey-text text-darken-3" style={{ fontWeight: '300', margin: 0 }}>
                            Casos de <span style={{ fontWeight: '600', color: 'var(--medical-green)' }}>{specialty?.name || 'Especialidad'}</span>
                        </h4>
                        <p className="grey-text text-darken-1">
                            Selecciona un caso clínico para comenzar tu entrenamiento.
                        </p>
                    </CustomCol>
                    <CustomCol s={12} m={4} className="right-align">
                        <CustomButton
                            flat
                            className="grey-text text-darken-1"
                            onClick={() => history.push('/')}
                            icon="arrow_back"
                        >
                            Volver
                        </CustomButton>
                    </CustomCol>
                </CustomRow>
            </div>

            <CustomRow>
                {cases.length > 0 ? (
                    cases.map(caso => (
                        <CustomCol s={12} m={6} l={4} key={caso.id}>
                            <CustomCard
                                title={caso.name || `Caso #${caso.id}`}
                                className="hoverable"
                            >
                                <div style={{ minHeight: '80px' }}>
                                    <p className="grey-text text-darken-1 truncate-3" style={{ marginBottom: '20px' }}>
                                        {caso.description || 'Sin descripción disponible.'}
                                    </p>
                                </div>
                                <div className="card-action right-align" style={{ padding: '15px 0 0', borderTop: '1px solid #f0f0f0' }}>
                                    <CustomButton
                                        className="green"
                                        onClick={() => history.push(`/caso/${caso.id}`)}
                                        icon="play_arrow"
                                        iconPosition="right"
                                    >
                                        Comenzar Caso
                                    </CustomButton>
                                </div>
                            </CustomCard>
                        </CustomCol>
                    ))
                ) : (
                    <CustomCol s={12}>
                        <div className="center-align" style={{ padding: '80px 20px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
                            <i className="material-icons large grey-text text-lighten-1" style={{ opacity: 0.5 }}>assignment_late</i>
                            <h5 className="grey-text text-darken-1">No hay casos disponibles para esta especialidad todavía.</h5>
                            <p className="grey-text">¡Estamos trabajando para añadir más contenido pronto!</p>
                            <CustomButton
                                className="mt-20 green"
                                onClick={() => history.push('/')}
                            >
                                Explorar otras especialidades
                            </CustomButton>
                        </div>
                    </CustomCol>
                )}
            </CustomRow>

            <style>
                {`
                .truncate-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .mt-20 {
                    margin-top: 20px;
                }
                `}
            </style>
        </div>
    );
};

export default EspecialidadCasos;
