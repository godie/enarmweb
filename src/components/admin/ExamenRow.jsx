import PropTypes from 'prop-types';
import CustomButton from '../custom/CustomButton';

const ExamenRow = ({ exam, onDelete }) => {
    return (
        <tr>
            <td>{exam.name}</td>
            <td>{exam.description || 'Sin descripción'}</td>
            <td>{exam.exam_questions?.length || 0}</td>
            <td className="right-align">
                <CustomButton
                    flat
                    href={`#/dashboard/edit/exam/${exam.id}`}
                    icon="edit"
                    className="blue-text"
                    tooltip="Editar Examen"
                />
                <CustomButton
                    flat
                    className="red-text"
                    icon="delete"
                    onClick={() => onDelete(exam)}
                    tooltip="Eliminar Examen"
                />
            </td>
        </tr>
    );
};

ExamenRow.propTypes = {
    exam: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
        description: PropTypes.string,
        exam_questions: PropTypes.array,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default ExamenRow;
