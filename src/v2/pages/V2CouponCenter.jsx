import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2CouponCenter = () => {
    const history = useHistory();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking API call to /v2/coupons/me
        setTimeout(() => {
            setCoupons([
                { id: 'c1', code: 'BIENVENIDO25', discount: '25%', description: 'Descuento de bienvenida', expires: '2025-12-31', status: 'active' },
                { id: 'c2', code: 'STUDENTLIFE', discount: '50%', description: 'Descuento para estudiantes', expires: '2025-06-30', status: 'active' },
                { id: 'c3', code: 'EXPIRED10', discount: '10%', description: 'Promoción antigua', expires: '2024-01-01', status: 'expired' }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        // Show some feedback here if needed, like a toast
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
