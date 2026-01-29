import { useState, useEffect } from 'react';
import {
    CustomRow,
    CustomCol,
    CustomButton,
    CustomTable,
    CustomPreloader,
    StatCard
} from '../custom';
import ExamService from '../../services/ExamService';
import { Link } from 'react-router-dom';

const Summary = () => {
    const [stats, setStats] = useState({
        categories: 0,
        clinicalCases: 0,
        questions: 0,
        exams: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentCategories, setRecentCategories] = useState([]);
    const [recentCases, setRecentCases] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [cats, cases] = await Promise.all([
                    ExamService.loadCategories(),
                    ExamService.getExams(1)
                ]);
                setStats({
                    categories: cats.data.length || 0,
                    clinicalCases: cases.data.total_entries || 0,
                    questions: 150,
                    exams: 8
                });

                setRecentCategories((cats.data || []).slice(0, 5));
                setRecentCases((cases.data.clinical_cases || []).slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="center-align" style={{ padding: '50px' }}>
                <CustomPreloader active color="green" size="big" />
            </div>
        );
    }

    return (
        <div className="dashboard-summary">
            <CustomRow>
                <CustomCol s={12} m={3}>
                    <StatCard title="Especialidades" count={stats.categories} icon="local_hospital" />
                </CustomCol>
                <CustomCol s={12} m={3}>
                    <StatCard title="Casos Clínicos" count={stats.clinicalCases} icon="assignment" />
                </CustomCol>
                <CustomCol s={12} m={3}>
                    <StatCard title="Preguntas" count={stats.questions} icon="help" />
                </CustomCol>
                <CustomCol s={12} m={3}>
                    <StatCard title="Exámenes" count={stats.exams} icon="library_books" />
                </CustomCol>
            </CustomRow>

            <CustomRow className="section">
                <CustomCol s={12} m={6}>
                    <div className="card-panel white">
                        <div className="valign-wrapper" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h5 className="grey-text text-darken-3" style={{ margin: 0 }}>Especialidades</h5>
                            <CustomButton
                                href="#/dashboard/new/especialidad"
                                node='a'
                                className="green darken-1 btn white-text"
                                icon="add"
                            />
                        </div>
                        <CustomTable className="highlight">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th className="right-align">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCategories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>{cat.name}</td>
                                        <td className="right-align">
                                            <Link to={`/dashboard/edit/especialidad/${cat.id}`}>
                                                <i className="material-icons grey-text">edit</i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </CustomTable>
                        <div className="center-align" style={{ marginTop: '1.5rem' }}>
                            <Link to="/dashboard/especialidades" className="green-text" style={{ fontWeight: '500' }}>VER TODAS</Link>
                        </div>
                    </div>
                </CustomCol>

                <CustomCol s={12} m={6}>
                    <div className="card-panel white">
                        <div className="valign-wrapper" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h5 className="grey-text text-darken-3" style={{ margin: 0 }}>Casos Clínicos</h5>
                            <CustomButton
                                href="#/dashboard/add/caso"
                                className="green darken-1 btn  white-text"
                                icon="add"
                                node="a"
                            />
                        </div>
                        <CustomTable className="highlight">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th className="center-align">Preguntas</th>
                                    <th className="right-align">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCases.map(caso => {
                                    return (
                                        <tr key={caso.id}>
                                            <td>{caso.name || (caso.description ? caso.description.slice(0, 30) : 'Sin título')}</td>

                                            <td className="center-align">{caso.questions}</td>
                                            <td className="right-align">
                                                <Link to={`/dashboard/edit/caso/${caso.id}`}>
                                                    <i className="material-icons grey-text">edit</i>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </CustomTable>
                        <div className="center-align" style={{ marginTop: '1.5rem' }}>
                            <Link to="/dashboard/casos/1" className="green-text" style={{ fontWeight: '500' }}>VER TODOS</Link>
                        </div>
                    </div>
                </CustomCol>
            </CustomRow>
        </div>
    );
};

export default Summary;
