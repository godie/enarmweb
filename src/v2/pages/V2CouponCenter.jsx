import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CouponService from '../../services/CouponService';
import Util from '../../commons/Util';
import CustomPreloader from '../../components/custom/CustomPreloader';
import '../styles/v2-theme.css';

const V2CouponCenter = () => {
    const history = useHistory();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await CouponService.getCoupons();
                setCoupons(response.data || []);
            } catch (err) {
                console.error("Error fetching coupons:", err);
                setError("No se pudieron cargar los cupones. Por favor, intenta de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        Util.showToast('Código copiado al portapapeles');
    };

    return (
        <div className="v2-page-container">
            <header className='v2-page-header-back v2-gap-16'>
                <button
                    className='v2-btn-icon'
                    onClick={() => history.goBack()}
                    aria-label='Volver'
                >
                    <i className='material-icons' aria-hidden='true'>arrow_back</i>
                </button>
                <h1 className="v2-headline-small">Centro de Cupones</h1>
            </header>

            {loading ? (
                <div className='v2-center-state v2-p-40'>
                    <CustomPreloader color="green" size="big" />
                </div>
            ) : error ? (
                <div className='v2-card v2-text-center v2-p-32'>
                    <i className='material-icons v2-error-icon v2-mb-16' aria-hidden='true'>error_outline</i>
                    <p className="v2-body-large">{error}</p>
                </div>
            ) : coupons.length === 0 ? (
                <div className='v2-card v2-text-center v2-p-32'>
                    <i className='material-icons v2-opacity-50 v2-mb-16' style={{ fontSize: '48px' }} aria-hidden='true'>confirmation_number</i>
                    <p className="v2-body-large">No tienes cupones disponibles en este momento.</p>
                </div>
            ) : (
                <div className='v2-grid-auto-fill v2-gap-24' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {coupons.map(coupon => (
                        <div key={coupon.id} className='v2-card v2-position-relative v2-overflow-hidden' style={{ opacity: coupon.status === 'expired' ? 0.6 : 1 }}>
                            {coupon.status === 'expired' && (
                                <div style={{ position: 'absolute', top: '10px', right: '-30px', background: 'var(--md-sys-color-error)', color: 'var(--md-sys-color-on-error)', padding: '4px 40px', transform: 'rotate(45deg)', fontSize: '10px', fontWeight: 'bold' }}>
                                    EXPIRADO
                                </div>
                            )}
                            <div className='v2-title-large v2-text-primary v2-mb-8'>{coupon.discount} OFF</div>
                            <div className='v2-label-large v2-mb-16 v2-text-center v2-text-bold v2-bg-surface-variant' style={{ letterSpacing: '2px', padding: '8px', borderRadius: '4px' }}>
                                {coupon.code}
                            </div>
                            <p className='v2-body-medium v2-mb-8'>{coupon.description}</p>
                            <div className='v2-label-small v2-opacity-70'>Vence: {coupon.expires}</div>

                            <button
                                className='v2-btn-filled v2-btn-full v2-mt-24'
                                disabled={coupon.status === 'expired'}
                                onClick={() => copyToClipboard(coupon.code)}
                            >
                                <i className="material-icons" style={{ marginRight: '8px' }} aria-hidden="true">content_copy</i>
                                Copiar Código
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default V2CouponCenter;
