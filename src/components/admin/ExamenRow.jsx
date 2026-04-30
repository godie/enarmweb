import { CustomButton } from '../CustomButton';

export const ExamenRow = ({ exam, onDelete }) => {
    return (
        <tr>
            <td>{exam.name}</td>
            <td>{exam.description || 'Sin descripción'}</td>
            <td>{exam.clinical_cases_count ?? (exam.exam_questions?.length || 0)}</td>
            <td className="right-align">
                <CustomButton
                    variant="icon"
                    color="blue-text"
                    route={`#/dashboard/edit/exam/${exam.id}`}
                    icon="edit"
                />
                <CustomButton
                    variant="icon"
                    color="red-text"
                    onClick={() => onDelete(exam)}
                    icon="delete"
                />
            </td>
        </tr>
    );
};
