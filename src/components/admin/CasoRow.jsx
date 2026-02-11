import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CustomCollectionItem from '../custom/CustomCollectionItem';
import CustomRow from '../custom/CustomRow';
import CustomCol from '../custom/CustomCol';
import CustomSelect from '../custom/CustomSelect';
import CustomButton from '../custom/CustomButton';

const CasoRow = ({ caso, categories, onChangeCategory }) => {
    const especialidadesOptions = categories.map((esp) => (
        <option key={esp.id} value={esp.id}>
            {esp.name}
        </option>
    ));

    return (
        <CustomCollectionItem>
            <CustomRow>
                <CustomCol m={4} s={12}>
                    <CustomSelect
                        label="Especialidad"
                        value={caso.category_id?.toString() || "0"}
                        onChange={(e) => onChangeCategory(caso, e.target.value)}
                        id={`select-especialidad-${caso.id}`}
                        className="black-text"
                    >
                        <option value="0" disabled={(caso.category_id?.toString() || "0") !== "0"}>
                            Sin Especialidad
                        </option>
                        {especialidadesOptions}
                    </CustomSelect>
                </CustomCol>
                <CustomCol m={7} s={12}>
                    {caso.description}
                </CustomCol>
                <Link to={`/dashboard/edit/caso/${caso.id}`} className="secondary-content">
                    <CustomButton
                        tooltip="Editar Caso clinico"
                        className="btn-flat"
                        icon="edit"
                        waves="light"
                    />
                </Link>
            </CustomRow>
        </CustomCollectionItem>
    );
};

CasoRow.propTypes = {
    caso: PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string,
        category_id: PropTypes.number,
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
