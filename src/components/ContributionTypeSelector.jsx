import PropTypes from 'prop-types';
import { CustomButton } from './custom';

const ContributionTypeSelector = ({ contributionType, setContributionType }) => {
    return (
        <div className="center-align mb-4" style={{ marginBottom: '2rem' }}>
            <h4 className="grey-text text-darken-3">¿Qué deseas contribuir hoy?</h4>
            <CustomButton
                flat={contributionType !== 'caso'}
                className={contributionType === 'caso' ? 'green darken-1 white-text' : 'green-text'}
                onClick={() => setContributionType('caso')}
                waves="light"
            >
                Caso Clínico
            </CustomButton>
            <CustomButton
                flat={contributionType !== 'pregunta'}
                className={contributionType === 'pregunta' ? 'green darken-1 white-text' : 'green-text'}
                onClick={() => setContributionType('pregunta')}
                style={{ marginLeft: '10px' }}
                waves="light"
            >
                Pregunta Individual
            </CustomButton>
        </div>
    );
};

ContributionTypeSelector.propTypes = {
    contributionType: PropTypes.string.isRequired,
    setContributionType: PropTypes.func.isRequired,
};

export default ContributionTypeSelector;
