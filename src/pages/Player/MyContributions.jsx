import { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import ExamService from "../../services/ExamService";
import {
    CustomRow,
    CustomCol,
    CustomTable,
    CustomPreloader,
    CustomCard,
    CustomButton
} from "../../components/custom";
import EnarmUtil from "../../modules/EnarmUtil";

const STATUS_LABELS = {
    pending: <span className="badge yellow darken-1 white-text enarm-badge-pill" style={{ float: 'none', marginLeft: 0 }}>Pendiente</span>,
    published: <span className="badge green darken-1 white-text enarm-badge-pill" style={{ float: 'none', marginLeft: 0 }}>Publicado</span>,
    rejected: <span className="badge red darken-1 white-text enarm-badge-pill" style={{ float: 'none', marginLeft: 0 }}>Rechazado</span>,
};

const MyContributions = () => {
    const history = useHistory();
    const [contributions, setContributions] = useState({ clinical_cases: [], questions: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState(() => {
        const cached = EnarmUtil.getCategories();
        return cached ? JSON.parse(cached) : [];
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    categories.length === 0 ? ExamService.loadCategories() : Promise.resolve({ data: categories }),
                    ExamService.getUserContributions()
                ]);

                if (results[0].status === 'fulfilled') {
                    const catData = results[0].value.data;
                    setCategories(catData);
                    EnarmUtil.setCategories(JSON.stringify(catData));
                }

                if (results[1].status === 'fulfilled') {
                    setContributions(results[1].value.data);
                } else {
                    console.error("Error fetching contributions:", results[1].reason);
                    setError("No se pudieron cargar tus contribuciones. Es posible que esta función aún no esté disponible en el servidor.");
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("Ocurrió un error inesperado al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories.length]);

    const especialidadesMap = useMemo(() => new Map(
        categories.map((esp) => [`${esp.id}`, esp.name])
    ), [categories]);

    if (loading) {
        return (
            <div className="center-align enarm-loading-wrapper">
                <CustomPreloader size="big" active color="green" />
            </div>
        );
    }

    const allContributions = [
        ...(contributions.clinical_cases || []).map(c => ({ ...c, type: 'Caso Clínico', display_name: c.name })),
        ...(contributions.questions || []).map(q => ({ ...q, type: 'Pregunta Individual', display_name: q.text }))
    ];

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h4 className="center grey-text text-darken-3">Mis Contribuciones</h4>

            {error ? (
                <div className="card-panel yellow lighten-4 brown-text center-align">
                    <i className="material-icons left" aria-hidden="true">info_outline</i>
                    {error}
                </div>
            ) : allContributions.length === 0 ? (
                <CustomRow>
                    <CustomCol s={12} m={8} offset="m2">
                        <CustomCard className="center-align enarm-card-rounded">
                            <i className="material-icons enarm-empty-state-icon grey-text" aria-hidden="true" style={{ fontSize: '4rem', marginBottom: '1rem' }}>history_edu</i>
                            <h5 className="grey-text text-darken-3">¿Aún no has contribuido?</h5>
                            <p className="grey-text text-darken-1">Tus aportaciones ayudan a miles de médicos a prepararse para el ENARM. ¡Comienza hoy mismo!</p>
                            <CustomButton
                                className="green darken-1 enarm-mt-10"
                                onClick={() => history.push('/contribuir')}
                                icon="add_circle_outline"
                                iconPosition="left"
                            >
                                Nueva Contribución
                            </CustomButton>
                        </CustomCard>
                    </CustomCol>
                </CustomRow>
            ) : (
                <CustomRow>
                    <CustomCol s={12}>
                        <CustomTable striped hoverable className="z-depth-1">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Nombre / Texto</th>
                                    <th>Especialidad</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allContributions.map((item, idx) => (
                                    <tr key={`${item.type}-${item.id || idx}`}>
                                        <td><strong>{item.type}</strong></td>
                                        <td className="truncate" style={{ maxWidth: '300px' }}>
                                            {item.display_name}
                                        </td>
                                        <td>
                                            <span className="badge white border darken-1 enarm-badge-pill" style={{ float: 'none', marginLeft: 0 }}>
                                                {especialidadesMap.get(item.category_id?.toString()) || 'N/A'}
                                            </span>
                                        </td>
                                        <td>{STATUS_LABELS[item.status] || item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </CustomTable>
                    </CustomCol>
                </CustomRow>
            )}
        </div>
    );
};

export default MyContributions;
