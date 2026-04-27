import { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Auth from '../../modules/Auth';
import { alertSuccess } from '../../services/AlertService';
import Util from '../../commons/Util';
import '../styles/v2-theme.css';

const V2Profile = () => {

    // Mock user with potentially missing email for testing
    const [user] = useState(useMemo(() => Auth.getUserInfo() || { name: 'García', email: '' }, []));

    const handleCopyEmail = () => {
        if (user.email) {
            navigator.clipboard.writeText(user.email);
            Util.showToast('Correo copiado al portapapeles');
        }
    };
    const [selectedSpecialties, setSelectedSpecialties] = useState(['Pediatría', 'Medicina Interna']);
    const allSpecialties = ['Cirugía General', 'Ginecología y Obstetricia', 'Medicina Interna', 'Pediatría', 'Traumatología'];
    const [isVerifying, setIsVerifying] = useState(false);

    const history = useHistory();

    const handleLogout = () => {
        Auth.deauthenticateUser();
        history.push('/login');
    };

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
        <div className='v2-page-wide'>
            <header className='v2-mb-40'>
                <h1 className='v2-headline-medium'>Perfil del Estudiante</h1>
                <p className='v2-body-large v2-opacity-70'>Gestiona tus datos y preferencias de estudio.</p>
            </header>

            <div className='v2-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                {/* User Info Card */}
                <section className='v2-card v2-card-elevated v2-text-center'>
                   <div className='v2-flex-col v2-flex-align-center v2-gap-20'>
                      <div className='v2-icon-box-4xl v2-icon-box-primary'>
                         <i className='material-icons' style={{ fontSize: '64px' }}>person</i>
                      </div>
                      <div>
                        <h2 className='v2-title-large'>Dr. {user.name}</h2>
                        <div className='v2-flex-align-center v2-flex-justify-center v2-gap-8'>
                            <p className='v2-label-large v2-opacity-60'>{user.email || 'Correo no asignado'}</p>
                            {user.email && (
                                <button
                                    className='v2-btn-icon v2-btn-icon-sm'
                                    style={{ width: '28px', height: '28px', minWidth: '28px' }}
                                    onClick={handleCopyEmail}
                                    aria-label='Copiar correo'
                                    title='Copiar correo'
                                >
                                    <i className='material-icons' style={{ fontSize: '16px' }}>content_copy</i>
                                </button>
                            )}
                        </div>
                      </div>
                      <div className='v2-card-tonal v2-flex-align-center v2-gap-8' style={{ padding: '12px 24px', borderRadius: '24px' }}>
                         <i className='material-icons v2-text-primary' style={{ fontSize: '20px' }}>workspace_premium</i>
                         <span className='v2-label-large'>Aspirante: Pediatría</span>
                      </div>
                   </div>
                </section>

                <div className='v2-flex-col v2-gap-32'>
                    {/* Specialty Preferences */}
                    <section className='v2-card'>
                        <h2 className='v2-title-large v2-mb-16'>Preferencias de Especialidad</h2>
                        <p className='v2-body-large v2-opacity-70 v2-mb-24'>
                            Selecciona las áreas en las que deseas enfocarte. Adaptaremos tus simulacros a estas elecciones.
                        </p>
                        <div className='v2-flex v2-flex-wrap v2-gap-12'>
                            {allSpecialties.map(spec => {
                                const active = selectedSpecialties.includes(spec);
                                return (
                                    <button
                                        key={spec}
                                        onClick={() => toggleSpecialty(spec)}
                                        className={`v2-btn-selectable ${active ? 'v2-selected' : ''}`}
                                    >
                                        {active && <i className='material-icons' style={{ fontSize: '18px' }}>check</i>}
                                        {spec}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Account Settings */}
                    <section className='v2-card'>
                        <h2 className='v2-title-large v2-mb-24'>Ajustes de Cuenta</h2>
                        <div className='v2-flex-col v2-gap-12'>
                            <div className='v2-card-tonal v2-flex-justify-between v2-flex-align-center' style={{ padding: '16px 24px' }}>
                                <div className='v2-flex-align-center v2-gap-12'>
                                    <i className='material-icons v2-opacity-60'>mail</i>
                                    <span>Correo Electrónico</span>
                                </div>
                                {user.email ? (
                                    <div className='v2-flex-align-center v2-gap-8'>
                                        <span className='v2-opacity-60'>{user.email}</span>
                                        <button
                                            className='v2-btn-icon v2-btn-icon-sm'
                                            style={{ width: '28px', height: '28px', minWidth: '28px' }}
                                            onClick={handleCopyEmail}
                                            aria-label='Copiar correo'
                                            title='Copiar correo'
                                        >
                                            <i className='material-icons' style={{ fontSize: '16px' }}>content_copy</i>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className='v2-btn-tonal'
                                        style={{ height: '44px', padding: '0 16px', fontSize: '12px' }}
                                        onClick={handleAssignEmail}
                                        disabled={isVerifying}
                                    >
                                        {isVerifying ? 'Enviando...' : 'Asignar Correo'}
                                    </button>
                                )}
                            </div>
                            <div
                                className='v2-card-tonal v2-flex-justify-between v2-flex-align-center v2-cursor-pointer'
                                style={{ padding: '16px 24px' }}
                                role='button'
                                tabIndex={0}
                                aria-label='Seguridad y contraseña — próximamente'
                                onClick={() => alertSuccess('Próximamente', 'La sección de seguridad estará disponible pronto.')}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alertSuccess('Próximamente', 'La sección de seguridad estará disponible pronto.'); } }}
                            >
                                <div className='v2-flex-align-center v2-gap-12'>
                                    <i className='material-icons v2-opacity-60'>lock</i>
                                    <span>Seguridad y Contraseña</span>
                                </div>
                                <i className='material-icons'>chevron_right</i>
                            </div>
                            <div
                                className='v2-card-tonal v2-flex-justify-between v2-flex-align-center v2-cursor-pointer v2-text-error'
                                style={{ padding: '16px 24px' }}
                                role='button'
                                tabIndex={0}
                                aria-label='Cerrar sesión'
                                onClick={handleLogout}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleLogout(); } }}
                            >
                                <div className='v2-flex-align-center v2-gap-12'>
                                    <i className='material-icons'>logout</i>
                                    <span>Cerrar Sesión</span>
                                </div>
                                <i className='material-icons'>chevron_right</i>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default V2Profile;
