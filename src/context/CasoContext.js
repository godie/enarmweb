import { createContext, useContext } from 'react';

const CasoContext = createContext(null);

export const useCaso = () => {
    const context = useContext(CasoContext);
    if (!context) {
        throw new Error('useCaso must be used within a CasoProvider');
    }
    return context;
};

export default CasoContext;
