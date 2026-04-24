import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

// --- Mock Control Variables ---
var mockIsAuthenticated = true;

// --- Helper function ---
const mockRenderComponentOrElement = (ComponentOrElement, props) => {
  if (React.isValidElement(ComponentOrElement)) {
    return ComponentOrElement;
  }
  if (typeof ComponentOrElement === 'function' || (typeof ComponentOrElement === 'object' && ComponentOrElement !== null && ComponentOrElement.$$typeof === Symbol.for('react.lazy'))) {
    return <ComponentOrElement {...props} />;
  }
  console.warn('Invalid component prop passed to mocked route guard:', ComponentOrElement);
  return <div data-testid="invalid-component-prop-mock">Invalid Prop</div>;
};

// --- Mock Auth Module ---
vi.mock('../modules/Auth', () => ({
  default: {
    isUserAuthenticated: vi.fn(() => mockIsAuthenticated),
    isPlayerAuthenticated: vi.fn(() => mockIsAuthenticated),
    isFacebookAuthenticated: vi.fn(() => mockIsAuthenticated),
    getToken: vi.fn().mockReturnValue('fake-token'),
    authenticateUser: vi.fn(),
    deauthenticateUser: vi.fn(),
    isFacebookUser: vi.fn().mockReturnValue(false),
    getFacebookUser: vi.fn().mockReturnValue(null),
    removeFacebookUser: vi.fn(),
    getUserInfo: vi.fn().mockReturnValue(null),
    getPlayerInfo: vi.fn().mockReturnValue(null),
    isAdmin: vi.fn().mockReturnValue(false),
  }
}));

// --- Mock V2 Public Pages ---
vi.mock('../v2/pages/V2Landing', () => ({ default: () => <div data-testid="v2-landing-mock">V2Landing</div> }));
vi.mock('../v2/pages/V2Login', () => ({ default: () => <div data-testid="v2-login-mock">V2Login</div> }));
vi.mock('../v2/pages/V2Signup', () => ({ default: () => <div data-testid="v2-signup-mock">V2Signup</div> }));
vi.mock('../v2/pages/V2ForgotPassword', () => ({ default: () => <div data-testid="v2-forgot-password-mock">V2ForgotPassword</div> }));

// --- Mock V2 Player Pages ---
vi.mock('../v2/pages/V2PlayerDashboard', () => ({ default: () => <div data-testid="v2-dashboard-mock">V2PlayerDashboard</div> }));
vi.mock('../v2/pages/V2Examen', () => ({ default: () => <div data-testid="v2-examen-mock">V2Examen</div> }));
vi.mock('../v2/pages/V2Profile', () => ({ default: () => <div data-testid="v2-profile-mock">V2Profile</div> }));
vi.mock('../v2/pages/V2PracticaLanding', () => ({ default: () => <div data-testid="v2-practica-mock">V2PracticaLanding</div> }));
vi.mock('../v2/pages/V2Contribuir', () => ({ default: () => <div data-testid="v2-contribuir-mock">V2Contribuir</div> }));
vi.mock('../v2/pages/V2MisContribuciones', () => ({ default: () => <div data-testid="v2-mis-contribuciones-mock">V2MisContribuciones</div> }));
vi.mock('../v2/pages/V2Onboarding', () => ({ default: () => <div data-testid="v2-onboarding-mock">V2Onboarding</div> }));
vi.mock('../v2/pages/V2MockExamSetup', () => ({ default: () => <div data-testid="v2-simulacro-mock">V2MockExamSetup</div> }));
vi.mock('../v2/pages/V2SessionSummary', () => ({ default: () => <div data-testid="v2-session-mock">V2SessionSummary</div> }));
vi.mock('../v2/pages/V2NationalLeaderboard', () => ({ default: () => <div data-testid="v2-leaderboard-mock">V2NationalLeaderboard</div> }));
vi.mock('../v2/pages/V2ImageBank', () => ({ default: () => <div data-testid="v2-imagenes-mock">V2ImageBank</div> }));
vi.mock('../v2/pages/V2FlashcardStudy', () => ({ default: () => <div data-testid="v2-flashcards-repaso-mock">V2FlashcardStudy</div> }));
vi.mock('../v2/pages/V2KnowledgeBase', () => ({ default: () => <div data-testid="v2-biblioteca-mock">V2KnowledgeBase</div> }));
vi.mock('../v2/pages/V2ErrorReview', () => ({ default: () => <div data-testid="v2-errores-mock">V2ErrorReview</div> }));
vi.mock('../v2/pages/V2PublicProfile', () => ({ default: () => <div data-testid="v2-public-profile-mock">V2PublicProfile</div> }));
vi.mock('../v2/pages/V2Checkout', () => ({ default: () => <div data-testid="v2-checkout-mock">V2Checkout</div> }));
vi.mock('../v2/pages/V2CaseStudy', () => ({ default: () => <div data-testid="v2-caso-estudio-mock">V2CaseStudy</div> }));
vi.mock('../v2/pages/V2DirectMessaging', () => ({ default: () => <div data-testid="v2-mensajes-mock">V2DirectMessaging</div> }));
vi.mock('../v2/pages/V2SubscriptionManagement', () => ({ default: () => <div data-testid="v2-suscripcion-mock">V2SubscriptionManagement</div> }));
vi.mock('../v2/pages/V2CouponCenter', () => ({ default: () => <div data-testid="v2-cupones-mock">V2CouponCenter</div> }));
vi.mock('../v2/pages/V2FlashcardCreator', () => ({ default: () => <div data-testid="v2-flashcards-crear-mock">V2FlashcardCreator</div> }));
vi.mock('../v2/pages/V2AIFlashcardGenerator', () => ({ default: () => <div data-testid="v2-flashcards-generar-mock">V2AIFlashcardGenerator</div> }));

// --- Mock V2 Admin Pages ---
vi.mock('../v2/pages/V2AdminDashboard', () => ({ default: () => <div data-testid="v2-admin-mock">V2AdminDashboard</div> }));
vi.mock('../v2/pages/V2AdminUsers', () => ({ default: () => <div data-testid="v2-admin-users-mock">V2AdminUsers</div> }));

// --- Mock V2 Layout ---
vi.mock('../v2/layouts/V2App', () => ({ default: ({ children }) => <div data-testid="v2-app-mock">{children}</div> }));

// --- Mock V1 Admin Components (still used by /dashboard routes) ---
vi.mock('../components/admin/CasoTable', () => ({ default: () => <div data-testid="casotable-mock">CasoTable</div> }));
vi.mock('../components/admin/CasoContainer', () => ({ default: () => <div data-testid="casocontainer-mock">CasoContainer</div> }));
vi.mock('../components/admin/Especialidades', () => ({ default: () => <div data-testid="especialidades-mock">Especialidades</div> }));
vi.mock('../components/admin/EspecialidadForm', () => ({ default: () => <div data-testid="especialidadform-mock">EspecialidadForm</div> }));
vi.mock('../components/admin/Summary', () => ({ default: () => <div data-testid="summary-mock">Summary</div> }));

// --- Mock Other Components ---
vi.mock('../components/Logout', () => ({
  default: () => <div data-testid="logout-mock">Logout</div>,
  AdminLogout: () => <div data-testid="admin-logout-mock">AdminLogout</div>,
}));
vi.mock('../pages/Player/FlashcardCreate', () => ({ default: () => <div data-testid="flashcardcreate-mock">FlashcardCreate</div> }));
vi.mock('../components/custom', async () => {
  const actualMaterialize = await vi.importActual('../components/custom');
  return {
    ...actualMaterialize,
    CustomSideNav: (props) => <div data-testid="mock-sidenav">{props.trigger}{props.children}</div>,
    ScrollToTop: () => null,
  };
});

// --- Mock Route Guards ---
vi.mock('./PrivateRoute', () => ({
  default: (props) => {
    const { component, ...rest } = props;
    if (mockIsAuthenticated) {
      return mockRenderComponentOrElement(component, rest);
    }
    return <div data-testid="private-route-redirect">Redirected by PrivateRoute</div>;
  }
}));

vi.mock('../components/PlayerRoute', () => ({
  default: (props) => {
    const { component, ...rest } = props;
    if (mockIsAuthenticated) {
      return mockRenderComponentOrElement(component, rest);
    }
    return <div data-testid="player-route-redirect">Redirected by PlayerRoute</div>;
  }
}));

// --- Global Materialize M object mock ---
global.M = {
  Sidenav: {
    init: vi.fn().mockReturnValue({ destroy: vi.fn(), open: vi.fn(), close: vi.fn() }),
    getInstance: vi.fn().mockReturnValue({ destroy: vi.fn(), open: vi.fn(), close: vi.fn() }),
  },
  Modal: {
    init: vi.fn().mockReturnValue({ destroy: vi.fn(), open: vi.fn(), close: vi.fn() }),
    getInstance: vi.fn().mockReturnValue({ destroy: vi.fn(), open: vi.fn(), close: vi.fn() }),
  },
  Tooltip: {
    init: vi.fn().mockReturnValue({ destroy: vi.fn() }),
    getInstance: vi.fn().mockReturnValue({ destroy: vi.fn() }),
  },
  Dropdown: {
    init: vi.fn().mockReturnValue({ destroy: vi.fn(), open: vi.fn(), close: vi.fn() }),
    getInstance: vi.fn().mockReturnValue({ destroy: vi.fn(), open: vi.fn(), close: vi.fn() }),
  },
  updateTextFields: vi.fn(),
  validate_field: vi.fn(),
};


describe('AppRoutes', () => {
  const renderWithRouter = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    );
  };

  beforeEach(async () => {
    mockIsAuthenticated = true;

    const { default: AuthMock } = await import('../modules/Auth');
    vi.mocked(AuthMock.isUserAuthenticated).mockImplementation(() => mockIsAuthenticated);
    vi.mocked(AuthMock.isPlayerAuthenticated).mockImplementation(() => mockIsAuthenticated);
    vi.mocked(AuthMock.isFacebookAuthenticated).mockImplementation(() => mockIsAuthenticated);
    vi.mocked(AuthMock.isFacebookUser).mockImplementation(() => false);
    vi.mocked(AuthMock.getFacebookUser).mockImplementation(() => null);
    vi.mocked(AuthMock.isAdmin).mockImplementation(() => false);

    const methodsToClear = [
      AuthMock.getToken, AuthMock.authenticateUser, AuthMock.deauthenticateUser,
      AuthMock.removeFacebookUser
    ];
    methodsToClear.forEach(mockFn => { if (mockFn && mockFn.mockClear) mockFn.mockClear(); });

    Object.values(global.M).forEach(service => {
      if (typeof service === 'object' && service !== null) {
        Object.values(service).forEach(method => {
          if (method && method.mockClear) method.mockClear();
        });
      } else if (service && service.mockClear) {
        service.mockClear();
      }
    });

    delete window.location;
    window.location = { reload: vi.fn(), assign: vi.fn(), replace: vi.fn(), href: '' };
  });

  afterEach(() => {});

  // ── Public Routes ──
  describe('Public Routes', () => {
    it('renders V2Landing for / when not authenticated', async () => {
      mockIsAuthenticated = false;
      renderWithRouter(['/']);
      await waitFor(() => expect(screen.getByTestId('v2-landing-mock')).toBeInTheDocument());
    });

    it('redirects authenticated users from / to /dashboard', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/']);
      await waitFor(() => expect(screen.getByTestId('v2-dashboard-mock')).toBeInTheDocument());
    });

    it('renders V2Login for /login', async () => {
      renderWithRouter(['/login']);
      await waitFor(() => expect(screen.getByTestId('v2-login-mock')).toBeInTheDocument());
    });

    it('renders V2Signup for /signup', async () => {
      renderWithRouter(['/signup']);
      await waitFor(() => expect(screen.getByTestId('v2-signup-mock')).toBeInTheDocument());
    });

    it('renders V2ForgotPassword for /forgot-password', async () => {
      renderWithRouter(['/forgot-password']);
      await waitFor(() => expect(screen.getByTestId('v2-forgot-password-mock')).toBeInTheDocument());
    });

    it('renders Logout for /logout', async () => {
      renderWithRouter(['/logout']);
      await waitFor(() => expect(screen.getByTestId('logout-mock')).toBeInTheDocument());
    });

    it('renders AdminLogout for /dashboard/logout', async () => {
      renderWithRouter(['/dashboard/logout']);
      await waitFor(() => expect(screen.getByTestId('admin-logout-mock')).toBeInTheDocument());
    });
  });

  // ── Player Protected Routes ──
  describe('Player Protected Routes', () => {
    it('renders V2PlayerDashboard for /dashboard when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard']);
      await waitFor(() => expect(screen.getByTestId('v2-dashboard-mock')).toBeInTheDocument());
    });

    it('shows redirect for /dashboard when not authenticated', async () => {
      mockIsAuthenticated = false;
      renderWithRouter(['/dashboard']);
      await waitFor(() => expect(screen.getByTestId('player-route-redirect')).toBeInTheDocument());
    });

    it('renders V2Examen for /caso/:identificador when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/caso/some-case-id']);
      await waitFor(() => expect(screen.getByTestId('v2-examen-mock')).toBeInTheDocument());
    });

    it('renders V2Profile for /perfil when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/perfil']);
      await waitFor(() => expect(screen.getByTestId('v2-profile-mock')).toBeInTheDocument());
    });

    it('renders V2PracticaLanding for /practica when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/practica']);
      await waitFor(() => expect(screen.getByTestId('v2-practica-mock')).toBeInTheDocument());
    });
  });

  // ── V1 Admin Routes (temporary) ──
  describe('V1 Admin Protected Routes (PrivateRoute)', () => {
    it('renders Dashboard with CasoTable for /dashboard/casos/:page when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/casos/2']);
      await waitFor(() => expect(screen.getByTestId('casotable-mock')).toBeInTheDocument());
    });

    it('renders Dashboard with CasoContainer for /dashboard/edit/caso/:identificador when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/edit/caso/case123']);
      await waitFor(() => expect(screen.getByTestId('casocontainer-mock')).toBeInTheDocument());
    });

    it('renders Dashboard with CasoContainer for /dashboard/new/caso when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/new/caso']);
      await waitFor(() => expect(screen.getByTestId('casocontainer-mock')).toBeInTheDocument());
    });

    it('renders Dashboard with Especialidades for /dashboard/especialidades when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/especialidades']);
      await waitFor(() => expect(screen.getByTestId('especialidades-mock')).toBeInTheDocument());
    });

    it('renders Dashboard with EspecialidadForm for /dashboard/new/especialidad when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/new/especialidad']);
      await waitFor(() => expect(screen.getByTestId('especialidadform-mock')).toBeInTheDocument());
    });

    it('renders Dashboard with EspecialidadForm for /dashboard/edit/especialidad/:identificador when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/edit/especialidad/esp123']);
      await waitFor(() => expect(screen.getByTestId('especialidadform-mock')).toBeInTheDocument());
    });
  });

  // ── Redirects from old paths ──
  describe('Old Path Redirects', () => {
    it('redirects /v2/login to /login', async () => {
      renderWithRouter(['/v2/login']);
      await waitFor(() => expect(screen.getByTestId('v2-login-mock')).toBeInTheDocument());
    });

    it('redirects /v2/dashboard to /dashboard', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/v2/dashboard']);
      await waitFor(() => expect(screen.getByTestId('v2-dashboard-mock')).toBeInTheDocument());
    });

    it('redirects /v2/signup to /signup', async () => {
      renderWithRouter(['/v2/signup']);
      await waitFor(() => expect(screen.getByTestId('v2-signup-mock')).toBeInTheDocument());
    });

    it('redirects /loginfb to /login', async () => {
      renderWithRouter(['/loginfb']);
      await waitFor(() => expect(screen.getByTestId('v2-login-mock')).toBeInTheDocument());
    });
  });

  // ── Catch-all ──
  it('redirects unknown routes to / (V2Landing for unauthenticated)', async () => {
    mockIsAuthenticated = false;
    renderWithRouter(['/some/unknown/route']);
    await waitFor(() => expect(screen.getByTestId('v2-landing-mock')).toBeInTheDocument());
  });
});
