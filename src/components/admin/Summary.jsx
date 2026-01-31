import { useState, useEffect } from 'react';
import {
    CustomRow,
    CustomCol,
    CustomPreloader,
    StatCard
} from '../custom';
import ExamService from '../../services/ExamService';
import { Link } from 'react-router-dom';
import RecentSummaryTable from './RecentSummaryTable';

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
                // Corrected: call getClinicalCases instead of getExams for case stats
                const [cats, cases] = await Promise.all([
                    ExamService.loadCategories(),
                    ExamService.getClinicalCases(1)
                ]);

                // Assuming getClinicalCases returns { clinical_cases: [], total_entries: N }
                // and loadCategories returns array directly in data
                setStats({
                    categories: cats.data.length || 0,
                    clinicalCases: cases.data.total_entries || 0,
                    questions: 150, // This seems hardcoded in original, ideally should come from API
                    exams: 8 // Hardcoded in original
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
                <RecentSummaryTable
                    title="Especialidades"
                    items={recentCategories}
                    headers={['Nombre', 'Acciones']}
                    addItemLink="#/dashboard/new/especialidad"
                    viewAllLink="/dashboard/especialidades"
                    renderRow={(cat) => (
                        <tr key={cat.id}>
                            <td>{cat.name}</td>
                            <td className="right-align">
                                <Link to={`/dashboard/edit/especialidad/${cat.id}`}>
                                    <i className="material-icons grey-text">edit</i>
                                </Link>
                            </td>
                        </tr>
                    )}
                />

                <RecentSummaryTable
                    title="Casos Clínicos"
                    items={recentCases}
                    headers={['Título', 'Acciones']}
                    // Note: Original had 'Preguntas' column but data was just {caso.questions} which might be count? 
                    // Let's keep it simple or add if needed. The original code had nested td with center-align for questions.
                    // Let's add 'Preguntas' back to headers if needed.
                    addItemLink="#/dashboard/add/caso"
                    viewAllLink="/dashboard/casos/1"
                    renderRow={(caso) => (
                        <tr key={caso.id}>
                            <td>{caso.name || (caso.description ? caso.description.slice(0, 30) : 'Sin título')}</td>
                            <td className="right-align">
                                <Link to={`/dashboard/edit/caso/${caso.id}`}>
                                    <i className="material-icons grey-text">edit</i>
                                </Link>
                            </td>
                        </tr>
                    )}
                />
            </CustomRow>
        </div>
    );
};

export default Summary;
