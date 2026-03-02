import { useState, useMemo } from 'react';
import Auth from '../../modules/Auth';

const V2Profile = () => {
    const user = useMemo(() => Auth.getUserInfo(), []);
    const [selectedSpecialties, setSelectedSpecialties] = useState(['Pediatría', 'Medicina Interna']);
    const allSpecialties = ['Cirugía General', 'Ginecología y Obstetricia', 'Medicina Interna', 'Pediatría', 'Traumatología'];

    const toggleSpecialty = (spec) => {
        setSelectedSpecialties(prev =>
            prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
        );
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 className="v2-headline-medium">Perfil del Estudiante</h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                {/* User Info Card */}
                <section className="v2-card v2-card-elevated">
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                         width: '120px', height: '120px', borderRadius: '50%',
                         backgroundColor: 'var(--md-sys-color-primary-container)',
                         display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                         <i className="material-icons v2-text-primary" style={{ fontSize: '64px' }}>person</i>
                      </div>
                      <h2 className="v2-title-large">Dr. {user?.name || 'García'}</h2>
                      <div className="v2-card-tonal" style={{ padding: '8px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <i className="material-icons" style={{ fontSize: '16px' }}>workspace_premium</i>
                         <span className="v2-body-large">Aspirante: Pediatría</span>
                      </div>
                   </div>
                </section>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Specialty Preferences */}
                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Preferencias de Especialidad</h3>
                        <p className="v2-body-large" style={{ opacity: 0.7, marginBottom: '16px' }}>
                            Selecciona las especialidades en las que deseas enfocarte durante tu preparación.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {allSpecialties.map(spec => (
                                <button
                                    key={spec}
                                    onClick={() => toggleSpecialty(spec)}
                                    className={`v2-card-tonal ${selectedSpecialties.includes(spec) ? 'v2-bg-primary' : ''}`}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '16px',
                                        padding: '12px 20px',
                                        transition: 'all 0.3s',
                                        border: selectedSpecialties.includes(spec) ? 'none' : '1px solid var(--md-sys-color-outline)'
                                    }}
                                >
                                    {selectedSpecialties.includes(spec) && <i className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '8px' }}>check</i>}
                                    {spec}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Account Settings */}
                    <section className="v2-card">
                        <h3 className="v2-title-large" style={{ marginBottom: '24px' }}>Ajustes de Cuenta</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="v2-card-tonal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Correo Electrónico</span>
                                <span style={{ opacity: 0.6 }}>{user?.email || 'doctor@ejemplo.com'}</span>
                            </div>
                            <div className="v2-card-tonal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Cambiar Contraseña</span>
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
