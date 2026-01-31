import { Link } from 'react-router-dom';
import { CustomButton } from '../custom';

const EspecialidadRow = ({ especialidad }) => (
    <tr>
        <td>{especialidad.name}</td>
        <td>{especialidad.description}</td>
        <td className="right-align">
            <Link to={`/dashboard/edit/especialidad/${especialidad.id}`}>
                <CustomButton
                    flat
                    tooltip="Editar especialidad"
                    icon="edit"
                    className="grey-text"
                />
            </Link>
        </td>
    </tr>
);

export default EspecialidadRow;
