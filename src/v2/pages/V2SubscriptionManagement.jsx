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
                <h1 className='v2-headline-medium v2-m-0'>Gestionar Suscripción</h1>
            </header>

            {/* Plan Info Card */}
            <section className='v2-card v2-card-elevated v2-bg-primary-container v2-mb-24'>
                <div className='v2-flex-justify-between' style={{ alignItems: 'flex-start' }}>
                    <div>
                        <div className='v2-label-large v2-opacity-80 v2-mb-4'>Plan Actual</div>
                        <h2 className='v2-headline-small v2-mb-8' style={{ margin: 0 }}>{subscription.plan}</h2>
                        <div className='v2-flex-align-center v2-gap-8'>
                            <span style={{
                                backgroundColor: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)',
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
            <div className='v2-grid-auto-fit v2-gap-24 v2-mb-32'>
                <section className="v2-card">
                    <h2 className='v2-title-large v2-mb-16'>Facturación</h2>
                    <div className='v2-flex-col v2-gap-12'>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className='v2-label-large v2-opacity-70'>Próximo cobro</span>
                            <span className="v2-body-large">{subscription.nextBilling}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="v2-label-large" style={{ opacity: 0.7 }}>Método de pago</span>
                            <span className="v2-body-large">{subscription.method}</span>
                        </div>
                    </div>
                    <button className='v2-btn-tonal v2-btn-full v2-mt-20'>
                        <i className="material-icons" style={{ marginRight: '8px' }}>credit_card</i>
                        Actualizar método
                    </button>
                </section>

                <section className="v2-card">
                    <h2 className='v2-title-large v2-mb-16'>Historial</h2>
                    <div className='v2-flex-col v2-gap-8'>
                        <div className='v2-pb-8 v2-border-bottom v2-flex-justify-between' style={{ padding: '8px 0' }}>
                            <div>
                                <div className="v2-body-medium">15 Feb, 2024</div>
                                <div className="v2-label-small">Factura #ENARM-4923</div>
                            </div>
                            <span className="v2-body-medium">99.00</span>
                        </div>
                        <div style={{ padding: '8px 0' }} className='v2-flex-justify-between'>
                            <div>
                                <div className="v2-body-medium">15 Ene, 2024</div>
                                <div className="v2-label-small">Factura #ENARM-3812</div>
                            </div>
                            <span className="v2-body-medium">99.00</span>
                        </div>
                    </div>
                    <button className='v2-btn-tonal v2-btn-full v2-mt-20'>
                        Ver todas las facturas
                    </button>
                </section>
            </div>

            {/* Danger Zone */}
            <section className='v2-card' style={{ border: '1px solid var(--md-sys-color-error)', backgroundColor: 'transparent' }}>
                <h2 className='v2-title-large v2-text-error v2-mb-8'>Zona de Peligro</h2>
                <p className='v2-body-medium v2-mb-20'>
                    Si cancelas tu suscripción, perderás el acceso a los simuladores y analíticas al finalizar tu periodo actual.
                </p>
                <button
                    className='v2-btn-destructive'
                    onClick={() => setShowCancelDialog(true)}
                >
                    <i className='material-icons' aria-hidden='true'>block</i>
                    Cancelar Suscripción
                </button>
            </section>

            {/* Cancel Dialog Simulation */}
            {showCancelDialog && (
                <div
                    role='presentation'
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'var(--v2-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowCancelDialog(false); }}
                    onKeyDown={(e) => { if (e.key === 'Escape') setShowCancelDialog(false); }}
                >
                    <div
                        className="v2-card"
                        style={{ maxWidth: '400px', width: '90%' }}
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='cancel-dialog-title'
                    >
                        <h3 id='cancel-dialog-title' className="v2-headline-small">¿Estás seguro?</h3>
                        <p className="v2-body-medium" style={{ margin: '16px 0 24px 0' }}>
                            Tu acceso premium terminará el {subscription.nextBilling}. No se te cobrará de nuevo.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button className="v2-btn-ghost" onClick={() => setShowCancelDialog(false)} autoFocus>Mantener</button>
                            <button className="v2-btn-destructive-filled" onClick={handleCancel}>Sí, cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default V2SubscriptionManagement;
