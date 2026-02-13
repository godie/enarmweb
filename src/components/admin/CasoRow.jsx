import PropTypes from 'prop-types';
import CustomButton from '../custom/CustomButton';
import CustomSelect from '../custom/CustomSelect';

const STATUS_LABELS = {
    pending: <span className="badge yellow darken-1">Pendiente</span>,
    published: <span className="badge green darken-1">Publicado</span>,
    rejected: <span className="badge red darken-1">Rechazado</span>,
};



const CasoRow = ({ caso, especialidadesOptions }) => {
   
    const questionsCount = caso.questions?.length ?? 0;
    const statusLabel = STATUS_LABELS[caso.status] || caso.status || '—';

    return (
        <tr>
            <td>{caso.name}</td>
            <td>
                <span className="badge white border darken-1">{especialidadesOptions.get(caso.category_id.toString())}</span>
            </td>
            <td>{STATUS_LABELS[caso.status]}</td>
            <td className="center-align">{questionsCount}</td>
            <td className="right-align">
                <CustomButton
                    flat
                    node="a"
                    href={`#/dashboard/edit/caso/${caso.id}`}
                    tooltip="Editar Caso clínico"
                    icon="edit"
                    className="blue-text"
                />
            </td>
        </tr>
    );
};

CasoRow.propTypes = {
    caso: PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string,
        category_id: PropTypes.number,
        status: PropTypes.string,
        questions: PropTypes.array,
    }).isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChangeCategory: PropTypes.func.isRequired,
};

export default CasoRow;
