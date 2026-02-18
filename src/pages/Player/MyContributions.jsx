import { useState, useEffect, useMemo } from "react";
import ExamService from "../../services/ExamService";
import { CustomRow, CustomCol, CustomTable, CustomPreloader } from "../../components/custom";
import EnarmUtil from "../../modules/EnarmUtil";

const STATUS_LABELS = {
    pending: <span className="badge yellow darken-1 white-text" style={{ borderRadius: '4px', float: 'none', marginLeft: 0 }}>Pendiente</span>,
    published: <span className="badge green darken-1 white-text" style={{ borderRadius: '4px', float: 'none', marginLeft: 0 }}>Publicado</span>,
    rejected: <span className="badge red darken-1 white-text" style={{ borderRadius: '4px', float: 'none', marginLeft: 0 }}>Rechazado</span>,
};

const MyContributions = () => {
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
            <div className="center-align" style={{ padding: '3rem' }}>
                <CustomPreloader size="big" active />
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

            {error && (
                <div className="card-panel yellow lighten-4 brown-text center-align">
                    <i className="material-icons left">info_outline</i>
                    {error}
                </div>
            )}

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
                            {allContributions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="center-align grey-text">
                                        No has realizado ninguna contribución todavía.
                                    </td>
                                </tr>
                            ) : (
                                allContributions.map((item, idx) => (
                                    <tr key={`${item.type}-${item.id || idx}`}>
                                        <td><strong>{item.type}</strong></td>
                                        <td className="truncate" style={{ maxWidth: '300px' }}>
                                            {item.display_name}
                                        </td>
                                        <td>
                                            <span className="badge white border darken-1" style={{ float: 'none', marginLeft: 0 }}>
                                                {especialidadesMap.get(item.category_id?.toString()) || 'N/A'}
                                            </span>
                                        </td>
                                        <td>{STATUS_LABELS[item.status] || item.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </CustomTable>
                </CustomCol>
            </CustomRow>
        </div>
    );
};

export default MyContributions;
