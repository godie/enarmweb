import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/v2-theme.css';

const V2SubscriptionManagement = () => {
    const history = useHistory();
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    // Mock subscription data
    const subscription = {
        plan: "Premium Mensual",
        status: "Activa",
        nextBilling: "15 de Abril, 2024",
        price: "99.00 MXN",
        method: "**** 4242 (Visa)"
    };

    const handleCancel = () => {
        // In real app, call service to cancel
        alert("Suscripción cancelada correctamente.");
        setShowCancelDialog(false);
    };

    return (
        <div className="v2-subscription-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                    className="v2-btn-tonal"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, minWidth: '40px' }}
                    onClick={() => history.goBack()}
                >
                    <i className="material-icons">arrow_back</i>
                </button>
                <h1 className="v2-headline-medium" style={{ margin: 0 }}>Gestionar Suscripción</h1>
            </header>

            {/* Plan Info Card */}
            <section className="v2-card v2-card-elevated" style={{ backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="v2-label-large" style={{ opacity: 0.8, marginBottom: '4px' }}>Plan Actual</div>
                        <h2 className="v2-headline-small" style={{ margin: '0 0 8px 0' }}>{subscription.plan}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                backgroundColor: 'var(--md-sys-color-primary)', color: 'white',
                                padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                            }}>
                                {subscription.status}
                            </span>
                            <span className="v2-body-medium">{subscription.price} / mes</span>
                        </div>
                    </div>
                    <i className="material-icons" style={{ fontSize: '48px', opacity: 0.3 }}>workspace_premium</i>
                </div>
            </section>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <section className="v2-card">
                    <h3 className="v2-title-large" style={{ marginBottom: '16px' }}>Facturación</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="v2-label-large" style={{ opacity: 0.7 }}>Próximo cobro</span>
                            <span className="v2-body-large">{subscription.nextBilling}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="v2-label-large" style={{ opacity: 0.7 }}>Método de pago</span>
                            <span className="v2-body-large">{subscription.method}</span>
                        </div>
                    </div>
                    <button className="v2-btn-tonal" style={{ width: '100%', marginTop: '20px' }}>
                        <i className="material-icons" style={{ marginRight: '8px' }}>credit_card</i>
                        Actualizar método
                    </button>
                </section>

                <section className="v2-card">
                    <h3 className="v2-title-large" style={{ marginBottom: '16px' }}>Historial</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ padding: '8px 0', borderBottom: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div className="v2-body-medium">15 Feb, 2024</div>
                                <div className="v2-label-small">Factura #ENARM-4923</div>
                            </div>
                            <span className="v2-body-medium">99.00</span>
                        </div>
                        <div style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div className="v2-body-medium">15 Ene, 2024</div>
                                <div className="v2-label-small">Factura #ENARM-3812</div>
                            </div>
                            <span className="v2-body-medium">99.00</span>
                        </div>
                    </div>
                    <button className="v2-btn-tonal" style={{ width: '100%', marginTop: '20px' }}>
                        Ver todas las facturas
                    </button>
                </section>
            </div>

            {/* Danger Zone */}
            <section className="v2-card" style={{ border: '1px solid var(--md-sys-color-error)', backgroundColor: 'transparent' }}>
                <h3 className="v2-title-large" style={{ color: 'var(--md-sys-color-error)', marginBottom: '8px' }}>Zona de Peligro</h3>
                <p className="v2-body-medium" style={{ marginBottom: '20px' }}>
                    Si cancelas tu suscripción, perderás el acceso a los simuladores y analíticas al finalizar tu periodo actual.
                </p>
                <button
                    className="v2-btn-outlined"
                    style={{ borderColor: 'var(--md-sys-color-error)', color: 'var(--md-sys-color-error)' }}
                    onClick={() => setShowCancelDialog(true)}
                >
                    Cancelar Suscripción
                </button>
            </section>

            {/* Cancel Dialog Simulation */}
            {showCancelDialog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="v2-card" style={{ maxWidth: '400px', width: '90%' }}>
                        <h3 className="v2-headline-small">¿Estás seguro?</h3>
                        <p className="v2-body-medium" style={{ margin: '16px 0 24px 0' }}>
                            Tu acceso premium terminará el {subscription.nextBilling}. No se te cobrará de nuevo.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button className="v2-btn-tonal" onClick={() => setShowCancelDialog(false)}>Mantener</button>
                            <button className="v2-btn-primary" style={{ backgroundColor: 'var(--md-sys-color-error)' }} onClick={handleCancel}>Si, cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default V2SubscriptionManagement;
