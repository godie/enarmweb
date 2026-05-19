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

export default ExamenRow;
