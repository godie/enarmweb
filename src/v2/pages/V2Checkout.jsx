import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PaymentService from '../../services/PaymentService';
import CustomPreloader from '../../components/custom/CustomPreloader';
import '../styles/v2-theme.css';

const V2Checkout = () => {
    const history = useHistory();
    const [promoCode, setPromoCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // In a real implementation, we send the planId to get a Stripe session
            const response = await PaymentService.createCheckoutSession({
                planId: 'premium_monthly',
                successUrl: window.location.origin + '/v2/dashboard?payment=success',
                cancelUrl: window.location.origin + '/v2/checkout?payment=cancelled'
            });

            if (response.data && response.data.url) {
                // Redirect to Stripe
                window.location.href = response.data.url;
            } else {
                throw new Error("Respuesta de pago inválida");
            }
        } catch (err) {
            console.error("Payment error:", err);
            setError("No se pudo iniciar el proceso de pago. Inténtalo de nuevo.");
            // For demo: simulation if service fails
            setTimeout(() => {
                setLoading(false);
                alert('Implementación simulada: Serías redirigido a Stripe.');
            }, 1000);
        }
    };

    return (
        <div className="v2-checkout-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                    className="v2-btn-tonal"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, minWidth: '40px' }}
                    onClick={() => history.goBack()}
                >
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-medium" style={{ margin: 0 }}>Pago Seguro</h1>
            </header>

            {error && (
                <div className="v2-card" style={{ backgroundColor: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-on-error-container)', marginBottom: '24px' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Left Column: Plan & Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Plan Summary */}
                    <section className="v2-card v2-card-elevated" style={{ backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)' }}>
                        <div className="v2-label-large" style={{ opacity: 0.8, marginBottom: '8px' }}>ENARM V2</div>
                        <h2 className="v2-headline-small" style={{ margin: '0 0 8px 0' }}>Suscripción Premium Mensual</h2>
                        <p className="v2-body-large" style={{ margin: 0, opacity: 0.9 }}>
                            Acceso total a simuladores, bancos de preguntas y análisis detallado.
                        </p>
                    </section>

                    {/* Payment Method - Stripe Placeholder */}
                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>Método de Pago</h3>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <div className="v2-card-tonal" style={{ flex: 1, textAlign: 'center', padding: '12px', border: '2px solid var(--md-sys-color-primary)' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '20px', marginBottom: '8px' }} />
                                <div className="v2-label-medium">Tarjeta</div>
                            </div>
                            <div className="v2-card-tonal" style={{ flex: 1, textAlign: 'center', padding: '12px', opacity: 0.6 }}>
                                <i className="material-icons" style={{ fontSize: '24px', marginBottom: '8px' }}>account_balance</i>
                                <div className="v2-label-medium">Transferencia</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <button className="v2-btn-primary" onClick={handlePayment} disabled={loading} style={{ height: '56px' }}>
                                {loading ? <CustomPreloader /> : 'Continuar con Stripe'}
                            </button>
                            <p className="v2-label-small" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                <i className="material-icons" style={{ fontSize: '12px', verticalAlign: 'middle', marginRight: '4px' }}>lock</i>
                                Transacción cifrada y segura
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>Resumen del pedido</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="v2-body-large">Suscripción Premium</span>
                                <span className="v2-body-large">99.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="v2-body-large">IVA (16%)</span>
                                <span className="v2-body-large">7.84</span>
                            </div>
                            {promoCode && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--md-sys-color-primary)' }}>
                                    <span className="v2-body-large">Descuento</span>
                                    <span className="v2-body-large">-0.00</span>
                                </div>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '20px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="v2-title-large">Total</span>
                                <span className="v2-headline-small" style={{ color: 'var(--md-sys-color-primary)' }}>46.84</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Código promo"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                style={{
                                    flex: 1, padding: '0 16px', borderRadius: '100px',
                                    border: '1px solid var(--md-sys-color-outline)',
                                    backgroundColor: 'transparent', color: 'var(--md-sys-color-on-surface)'
                                }}
                            />
                            <button className="v2-btn-tonal">Aplicar</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default V2Checkout;
