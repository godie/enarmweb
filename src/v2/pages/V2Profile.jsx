import { useState, useMemo } from 'react';
import Auth from '../../modules/Auth';
import { alertSuccess } from '../../services/AlertService';
import '../styles/v2-theme.css';

const V2Profile = () => {
    // Mock user with potentially missing email for testing
    const [user] = useState(useMemo(() => Auth.getUserInfo() || { name: 'García', email: '' }, []));
    const [selectedSpecialties, setSelectedSpecialties] = useState(['Pediatría', 'Medicina Interna']);
    const allSpecialties = ['Cirugía General', 'Ginecología y Obstetricia', 'Medicina Interna', 'Pediatría', 'Traumatología'];
    const [isVerifying, setIsVerifying] = useState(false);

    const toggleSpecialty = (spec) => {
        setSelectedSpecialties(prev =>
            prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
        );
    };

    const handleAssignEmail = () => {
        setIsVerifying(true);
        // Simulate sending verification link
        setTimeout(() => {
            alertSuccess('Link enviado', 'Se ha enviado un enlace de verificación a tu nuevo correo.');
            setIsVerifying(false);
        }, 1500);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 className="v2-headline-medium">Perfil del Estudiante</h1>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Gestiona tus datos y preferencias de estudio.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                {/* User Info Card */}
                <section className="v2-card v2-card-elevated" style={{ textAlign: 'center' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                      <div style={{
                         width: '120px', height: '120px', borderRadius: '50%',
                         backgroundColor: 'var(--md-sys-color-primary-container)',
                         color: 'var(--md-sys-color-primary)',
                         display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                         <i className="material-icons" style={{ fontSize: '64px' }}>person</i>
                      </div>
                      <div>
                        <h2 className="v2-title-large">Dr. {user.name}</h2>
                        <p className="v2-label-large" style={{ opacity: 0.6 }}>{user.email || 'Correo no asignado'}</p>
                      </div>
                      <div className="v2-card-tonal" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '24px' }}>
                         <i className="material-icons v2-text-primary" style={{ fontSize: '20px' }}>workspace_premium</i>
                         <span className="v2-label-large">Aspirante: Pediatría</span>
                      </div>
                   </div>
                </section>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Specialty Preferences */}
                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '16px' }}>Preferencias de Especialidad</h3>
                        <p className="v2-body-large" style={{ opacity: 0.7, marginBottom: '24px' }}>
                            Selecciona las áreas en las que deseas enfocarte. Adaptaremos tus simulacros a estas elecciones.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {allSpecialties.map(spec => {
                                const active = selectedSpecialties.includes(spec);
                                return (
                                    <button
                                        key={spec}
                                        onClick={() => toggleSpecialty(spec)}
                                        className={active ? 'v2-btn-filled' : 'v2-card-outlined'}
                                        style={{ cursor: 'pointer', padding: '12px 20px' }}
                                    >
                                        {active && <i className="material-icons" style={{ fontSize: '18px' }}>check</i>}
                                        {spec}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Account Settings */}
                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Ajustes de Cuenta</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="v2-card-tonal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <i className="material-icons" style={{ opacity: 0.6 }}>mail</i>
                                    <span>Correo Electrónico</span>
                                </div>
                                {user.email ? (
                                    <span style={{ opacity: 0.6 }}>{user.email}</span>
                                ) : (
                                    <button
                                        className="v2-btn-tonal"
                                        style={{ height: '36px', padding: '0 16px', fontSize: '12px' }}
                                        onClick={handleAssignEmail}
                                        disabled={isVerifying}
                                    >
                                        {isVerifying ? 'Enviando...' : 'Asignar Correo'}
                                    </button>
                                )}
                            </div>
                            <div className="v2-card-tonal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <i className="material-icons" style={{ opacity: 0.6 }}>lock</i>
                                    <span>Seguridad y Contraseña</span>
                                </div>
                                <i className="material-icons">chevron_right</i>
                            </div>
                            <div className="v2-card-tonal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', cursor: 'pointer', color: 'var(--md-sys-color-error)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <i className="material-icons">logout</i>
                                    <span>Cerrar Sesión</span>
                                </div>
                                <i className="material-icons">chevron_right</i>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default V2Profile;
