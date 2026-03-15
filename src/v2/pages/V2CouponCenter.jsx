import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CouponService from '../../services/CouponService';
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
        // Toast logic could be added here if a global toast exists
    };

    return (
        <div className="v2-page-container">
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button className="v2-btn-tonal" onClick={() => history.goBack()} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-small">Centro de Cupones</h1>
            </header>

            {loading ? (
                <div className="center-align" style={{ padding: '40px' }}>
                    <div className="preloader-wrapper big active">
                        <div className="spinner-layer spinner-green-only">
                            <div className="circle-clipper left"><div className="circle"></div></div>
                            <div className="gap-patch"><div className="circle"></div></div>
                            <div className="circle-clipper right"><div className="circle"></div></div>
                        </div>
                    </div>
                </div>
            ) : error ? (
                <div className="v2-card center-align" style={{ padding: '32px' }}>
                    <i className="material-icons" style={{ fontSize: '48px', color: 'var(--md-sys-color-error)', marginBottom: '16px' }}>error_outline</i>
                    <p className="v2-body-large">{error}</p>
                </div>
            ) : coupons.length === 0 ? (
                <div className="v2-card center-align" style={{ padding: '32px' }}>
                    <i className="material-icons" style={{ fontSize: '48px', opacity: 0.5, marginBottom: '16px' }}>confirmation_number</i>
                    <p className="v2-body-large">No tienes cupones disponibles en este momento.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {coupons.map(coupon => (
                        <div key={coupon.id} className="v2-card" style={{ opacity: coupon.status === 'expired' ? 0.6 : 1, position: 'relative', overflow: 'hidden' }}>
                            {coupon.status === 'expired' && (
                                <div style={{ position: 'absolute', top: '10px', right: '-30px', background: 'var(--md-sys-color-error)', color: 'white', padding: '4px 40px', transform: 'rotate(45deg)', fontSize: '10px', fontWeight: 'bold' }}>
                                    EXPIRADO
                                </div>
                            )}
                            <div className="v2-title-large" style={{ color: 'var(--md-sys-color-primary)', marginBottom: '8px' }}>{coupon.discount} OFF</div>
                            <div className="v2-label-large" style={{ marginBottom: '16px', letterSpacing: '2px', backgroundColor: 'var(--md-sys-color-surface-variant)', padding: '8px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                                {coupon.code}
                            </div>
                            <p className="v2-body-medium" style={{ marginBottom: '8px' }}>{coupon.description}</p>
                            <div className="v2-label-small" style={{ opacity: 0.7 }}>Vence: {coupon.expires}</div>

                            <button
                                className="v2-btn-primary"
                                style={{ width: '100%', marginTop: '24px' }}
                                disabled={coupon.status === 'expired'}
                                onClick={() => copyToClipboard(coupon.code)}
                            >
                                <i className="material-icons" style={{ marginRight: '8px' }}>content_copy</i>
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
