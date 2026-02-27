import PropTypes from 'prop-types';
import { CustomTable, CustomPreloader, CustomButton } from './custom';

const STATUS_LABELS = {
    pending: <span className="badge yellow darken-1 white-text" style={{ borderRadius: '4px', float: 'none', marginLeft: 0 }}>Pendiente</span>,
    published: <span className="badge green darken-1 white-text" style={{ borderRadius: '4px', float: 'none', marginLeft: 0 }}>Publicado</span>,
    rejected: <span className="badge red darken-1 white-text" style={{ borderRadius: '4px', float: 'none', marginLeft: 0 }}>Rechazado</span>,
};

const ContributionsSummary = ({ loading, contributions, especialidadesMap, onViewAll }) => {
    return (
        <div className="contributions-summary">
            <h5 className="grey-text text-darken-3">Tus últimas contribuciones</h5>
            {loading ? (
                <div className="center-align"><CustomPreloader size="small" /></div>
            ) : (
                <>
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
                            {contributions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="center-align grey-text">No has realizado contribuciones aún.</td>
                                </tr>
                            ) : (
                                contributions.map((item, index) => (
                                    <tr key={item.id || `contrib-${index}`}>
                                        <td><strong>{item.type}</strong></td>
                                        <td className="truncate" style={{ maxWidth: '300px' }}>{item.display_name}</td>
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
                    <div className="right-align" style={{ marginTop: '1rem' }}>
                        <CustomButton flat className="green-text" onClick={onViewAll}>
                            Ver todas <i className="material-icons right">arrow_forward</i>
                        </CustomButton>
                    </div>
                </>
            )}
        </div>
    );
};

ContributionsSummary.propTypes = {
    loading: PropTypes.bool.isRequired,
    contributions: PropTypes.array.isRequired,
    especialidadesMap: PropTypes.instanceOf(Map).isRequired,
    onViewAll: PropTypes.func.isRequired,
};

export default ContributionsSummary;
