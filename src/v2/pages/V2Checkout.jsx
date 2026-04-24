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
                successUrl: window.location.origin + '/dashboard?payment=success',
                cancelUrl: window.location.origin + '/checkout?payment=cancelled'
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
        <div className='v2-page-medium'>
            {/* Header */}
            <header className='v2-page-header-back v2-gap-16'>
                <button
                    className='v2-btn-icon'
                    onClick={() => history.goBack()}
                    aria-label='Volver'
                >
                    <i className='material-icons'>arrow_back</i>
                </button>
                <h1 className='v2-headline-medium v2-m-0'>Pago Seguro</h1>
            </header>

            {error && (
                <div className='v2-card v2-bg-error-container v2-mb-24'>
                    {error}
                </div>
            )}

            <div className='v2-grid-auto-fit v2-gap-24'>
                {/* Left Column: Plan & Form */}
                <div className='v2-flex-col v2-gap-24'>
                    {/* Plan Summary */}
                    <section className='v2-card v2-card-elevated v2-bg-primary-container'>
                        <div className='v2-label-large v2-opacity-80 v2-mb-8'>ENARM V2</div>
                        <h2 className='v2-headline-small v2-m-0 v2-mb-8'>Suscripción Premium Mensual</h2>
                        <p className='v2-body-large v2-opacity-80 v2-m-0'>
                            Acceso total a simuladores, bancos de preguntas y análisis detallado.
                        </p>
                    </section>

                    {/* Payment Method - Stripe Placeholder */}
                    <section className="v2-card">
                        <h3 className='v2-title-large v2-mb-20'>Método de Pago</h3>
                        <div className='v2-flex v2-gap-12 v2-mb-24'>
                            <div className='v2-card-tonal v2-text-center v2-p-16' style={{ flex: 1, border: '2px solid var(--md-sys-color-primary)' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '20px', marginBottom: '8px' }} />
                                <div className="v2-label-medium">Tarjeta</div>
                            </div>
                            <div className='v2-card-tonal v2-text-center v2-opacity-60' style={{ flex: 1, padding: '12px' }}>
                                <i className="material-icons" style={{ fontSize: '24px', marginBottom: '8px' }}>account_balance</i>
                                <div className="v2-label-medium">Transferencia</div>
                            </div>
                        </div>

                        <div className='v2-flex-col v2-gap-16'>
                            <button className='v2-btn-primary v2-btn-h-56' onClick={handlePayment} disabled={loading}>
                                {loading ? <CustomPreloader /> : 'Continuar con Stripe'}
                            </button>
                            <p className='v2-label-small v2-text-center v2-text-secondary'>
                                <i className="material-icons" style={{ fontSize: '12px', verticalAlign: 'middle', marginRight: '4px' }}>lock</i>
                                Transacción cifrada y segura
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div className='v2-flex-col v2-gap-24'>
                    <section className="v2-card">
                        <h3 className='v2-title-large v2-mb-20'>Resumen del pedido</h3>

                        <div className='v2-flex-col v2-gap-12 v2-mb-20'>
                            <div className='v2-flex-justify-between'>
                                <span className="v2-body-large">Suscripción Premium</span>
                                <span className="v2-body-large">99.00</span>
                            </div>
                            <div className='v2-flex-justify-between'>
                                <span className="v2-body-large">IVA (16%)</span>
                                <span className="v2-body-large">7.84</span>
                            </div>
                            {promoCode && (
                                <div className='v2-flex-justify-between v2-text-primary'>
                                    <span className="v2-body-large">Descuento</span>
                                    <span className="v2-body-large">-0.00</span>
                                </div>
                            )}
                        </div>

                        <div className='v2-border-top v2-pt-20 v2-mb-24'>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="v2-title-large">Total</span>
                                <span className='v2-headline-small v2-text-primary'>46.84</span>
                            </div>
                        </div>

                        <div className='v2-flex v2-gap-8'>
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
