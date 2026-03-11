import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2Checkout = () => {
    const history = useHistory();
    const [promoCode, setPromoCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = () => {
        setLoading(true);
        // Simulate payment process or Stripe redirect
        setTimeout(() => {
            setLoading(false);
            alert('En una implementación real, serás redirigido a Stripe o se procesará el pago aquí.');
        }, 1500);
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
                            <div className="v2-card-tonal" style={{ flex: 1, textAlign: 'center', padding: '12px' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '20px' }} />
                            </div>
                            <div className="v2-card-tonal" style={{ flex: 1, textAlign: 'center', padding: '12px' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '20px' }} />
                            </div>
                            <div className="v2-card-tonal" style={{ flex: 1, textAlign: 'center', padding: '12px' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '20px' }} />
                            </div>
                        </div>

                        {/* Card Form Simulation */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="v2-input-outlined">
                                <label>Número de Tarjeta</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="material-icons" style={{ opacity: 0.5 }}>credit_card</i>
                                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" disabled />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div className="v2-input-outlined" style={{ flex: 1 }}>
                                    <label>Vencimiento</label>
                                    <input type="text" placeholder="MM/YY" disabled />
                                </div>
                                <div className="v2-input-outlined" style={{ flex: 1 }}>
                                    <label>CVC/CVV</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <input type="text" placeholder="123" disabled />
                                        <i className="material-icons" style={{ fontSize: '18px', opacity: 0.5 }}>help_outline</i>
                                    </div>
                                </div>
                            </div>

                            <div className="v2-input-outlined">
                                <label>Titular de la Tarjeta</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="material-icons" style={{ opacity: 0.5 }}>person</i>
                                    <input type="text" placeholder="Nombre completo" disabled />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '20px' }}>Resumen de Orden</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="v2-body-large">Suscripción Premium</span>
                                <span className="v2-body-large">$499.00 MXN</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--md-sys-color-tertiary)' }}>
                                <span className="v2-body-large">Descuento</span>
                                <span className="v2-body-large">-$0.00 MXN</span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span className="v2-title-large">Total a pagar</span>
                                <span className="v2-title-large" style={{ color: 'var(--md-sys-color-primary)' }}>$499.00 MXN</span>
                            </div>
                            <span className="v2-label-medium" style={{ textAlign: 'right', opacity: 0.6 }}>I.V.A Incluido</span>
                        </div>

                        {/* Promo Code */}
                        <div className="v2-input-outlined" style={{ marginBottom: '24px' }}>
                            <label>Código Promocional</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Introduce tu código"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button className="v2-btn-tonal" style={{ padding: '0 16px' }}>Aplicar</button>
                            </div>
                        </div>

                        <button
                            className="v2-btn-filled"
                            style={{ width: '100%', padding: '16px', justifyContent: 'center' }}
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            <i className="material-icons">security</i>
                            {loading ? 'Procesando...' : 'Confirmar Pago'}
                        </button>

                        {/* Security Badges */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', opacity: 0.6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className="material-icons" style={{ fontSize: '16px' }}>lock</i>
                                <span className="v2-label-small">SSL</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className="material-icons" style={{ fontSize: '16px' }}>verified_user</i>
                                <span className="v2-label-small">PCI-DSS</span>
                            </div>
                        </div>
                    </section>

                    <div style={{ textAlign: 'center', padding: '0 16px' }}>
                        <p className="v2-label-small" style={{ opacity: 0.6 }}>
                            Al confirmar el pago, aceptas nuestros Términos de Servicio y la Política de Privacidad. Puedes cancelar tu suscripción en cualquier momento desde tu perfil.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default V2Checkout;
