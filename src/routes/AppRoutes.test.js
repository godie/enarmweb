import React from 'react'; // Import React at the top
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

// --- Mock Control Variables ---
// Using var for hoisting compatibility with jest.mock factory functions
var mockIsAuthenticated = true;
var mockIsFacebookAuthenticated = true;

// --- Helper function (defined outside mocks) ---
// This function will be called by the PrivateRoute/FacebookRoute mocks
// We define it here hoping to bypass babel-plugin-jest-hoist issues with React.isValidElement
// Renamed to start with "mock" to satisfy babel-plugin-jest-hoist
const mockRenderComponentOrElement = (ComponentOrElement, props) => {
  if (React.isValidElement(ComponentOrElement)) {
    return ComponentOrElement; // It's already an element
  }
  if (typeof ComponentOrElement === 'function' || (typeof ComponentOrElement === 'object' && ComponentOrElement !== null && ComponentOrElement.$$typeof === Symbol.for('react.lazy'))) {
    // It's a component type (function, class, or React.lazy)
    return <ComponentOrElement {...props} />;
  }
  // If it's neither, it's problematic, but we'll return null or a placeholder
  // to avoid crashing the test runner, and the test will likely fail on assertions.
  console.warn('Invalid component prop passed to mocked PrivateRoute/FacebookRoute:', ComponentOrElement);
  return <div data-testid="invalid-component-prop-mock">Invalid Prop</div>;
};


// --- Mock Auth Module ---
jest.mock('../modules/Auth', () => {
  return {
    __esModule: true,
    default: {
      isUserAuthenticated: jest.fn(() => mockIsAuthenticated),
      isFacebookAuthenticated: jest.fn(() => mockIsFacebookAuthenticated),
      getToken: jest.fn().mockReturnValue('fake-token'),
      authenticateUser: jest.fn(),
      deauthenticateUser: jest.fn(),
      isFacebookUser: jest.fn().mockReturnValue(false),
      getFacebookUser: jest.fn().mockReturnValue(null),
      removeFacebookUser: jest.fn(),
    }
  };
});

// --- Mock Leaf Components ---
jest.mock('../components/Examen', () => () => <div data-testid="examen-mock">Examen Component</div>);
jest.mock('../components/CasoTable', () => () => <div data-testid="casotable-mock">CasoTable Component</div>);
jest.mock('../components/CasoContainer', () => () => <div data-testid="casocontainer-mock">CasoContainer Component</div>);
jest.mock('../components/Login', () => () => <div data-testid="login-mock">Login Component</div>);
jest.mock('../components/facebook/FacebookLoginContainer', () => () => <div data-testid="fb-login-container-mock">FacebookLoginContainer Component</div>);
jest.mock('../components/Profile', () => () => <div data-testid="profile-mock">Profile Component</div>);
jest.mock('../components/Logout', () => ({
    __esModule: true,
    default: () => <div data-testid="logout-mock">Logout Component</div>,
    AdminLogout: () => <div data-testid="admin-logout-mock">AdminLogout Component</div>,
}));
jest.mock('../components/admin/Especialidades', () => () => <div data-testid="especialidades-mock">Especialidades Component</div>);
jest.mock('../components/admin/EspecialidadForm', () => () => <div data-testid="especialidadform-mock">EspecialidadForm Component</div>);

// --- Mock Specific Materialize Components ---
// Mock SideNav from react-materialize to prevent 'destroy' error
jest.mock('react-materialize', () => {
  const actualMaterialize = jest.requireActual('react-materialize');
  return {
    ...actualMaterialize,
    SideNav: (props) => <div data-testid="mock-sidenav">{props.trigger}{props.children}</div>,
    // Add other components if they cause similar issues, e.g., Modal, Tooltip
    Modal: (props) => <div data-testid="mock-modal">{props.trigger}{props.children}</div>,
    Tooltip: (props) => <div data-testid="mock-tooltip">{props.children}</div>,
    Dropdown: (props) => <div data-testid="mock-dropdown">{props.trigger}{props.children}</div>,
    SideNavItem: (props) => <a href={props.href}>{props.children}</a>, // Make it a simple link
    Button: (props) => <button className={props.className} node={props.node} href={props.href} onClick={props.onClick}>{props.icon || props.children}</button>,
    Icon: (props) => <i className="material-icons">{props.children}</i>,
    TextInput: (props) => <input type={props.password ? 'password' : 'text'} aria-label={props.label} onChange={props.onChange} />,

  };
});


// --- Mocks for Protected Route Components ---
jest.mock('./PrivateRoute', () => (props) => {
  const { component, ...rest } = props; // component prop might be Component type or element
  if (mockIsAuthenticated) {
    return mockRenderComponentOrElement(component, rest); // Use renamed helper
  }
  return <div data-testid="private-route-redirect">Redirected by PrivateRoute</div>;
});

jest.mock('../components/facebook/FacebookRoute', () => (props) => {
  const { component, ...rest } = props;
  if (mockIsFacebookAuthenticated) {
    return mockRenderComponentOrElement(component, rest); // Use renamed helper
  }
  return <div data-testid="fb-route-redirect">Redirected by FacebookRoute</div>;
});

// --- Global Materialize M object mock ---
// This needs to be available globally for components that might call M.method()
global.M = {
  Sidenav: {
    init: jest.fn().mockReturnValue({ destroy: jest.fn(), open: jest.fn(), close: jest.fn() }),
    getInstance: jest.fn().mockReturnValue({ destroy: jest.fn(), open: jest.fn(), close: jest.fn() }),
  },
  Modal: {
    init: jest.fn().mockReturnValue({ destroy: jest.fn(), open: jest.fn(), close: jest.fn() }),
    getInstance: jest.fn().mockReturnValue({ destroy: jest.fn(), open: jest.fn(), close: jest.fn() }),
  },
  Tooltip: {
    init: jest.fn().mockReturnValue({ destroy: jest.fn() }),
    getInstance: jest.fn().mockReturnValue({ destroy: jest.fn() }),
  },
  Dropdown: {
    init: jest.fn().mockReturnValue({ destroy: jest.fn(), open: jest.fn(), close: jest.fn() }),
    getInstance: jest.fn().mockReturnValue({ destroy: jest.fn(), open: jest.fn(), close: jest.fn() }),
  },
  updateTextFields: jest.fn(),
  validate_field: jest.fn(), // From Login.test.js
};


describe('AppRoutes', () => {
  const renderWithRouter = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockIsAuthenticated = true;
    mockIsFacebookAuthenticated = true;

    const AuthMock = require('../modules/Auth').default;
    AuthMock.isUserAuthenticated.mockImplementation(() => mockIsAuthenticated);
    AuthMock.isFacebookAuthenticated.mockImplementation(() => mockIsFacebookAuthenticated);
    AuthMock.isFacebookUser.mockImplementation(() => false);
    AuthMock.getFacebookUser.mockImplementation(() => null);

    const methodsToClear = [
      AuthMock.getToken, AuthMock.authenticateUser, AuthMock.deauthenticateUser,
      AuthMock.removeFacebookUser
    ];
    methodsToClear.forEach(mockFn => { if (mockFn && mockFn.mockClear) mockFn.mockClear(); });

    // Clear calls to global.M methods
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
    window.location = { reload: jest.fn(), assign: jest.fn(), replace: jest.fn(), href: '' };
  });

  afterEach(() => {
    // Restore original window.location if necessary, or ensure it's clean for next test file
  });

  // --- Tests from before, should mostly work if element type issue is handled ---
  it('renders FacebookLoginContainer for /loginfb', async () => {
    renderWithRouter(['/loginfb']);
    await waitFor(() => expect(screen.getByTestId('fb-login-container-mock')).toBeInTheDocument());
  });

  it('renders Login component for /admin', async () => {
    renderWithRouter(['/admin']);
    await waitFor(() => expect(screen.getByTestId('login-mock')).toBeInTheDocument());
  });

  it('renders Logout component for /logout', async () => {
    renderWithRouter(['/logout']);
    await waitFor(() => expect(screen.getByTestId('logout-mock')).toBeInTheDocument());
  });

  it('renders AdminLogout component for /dashboard/logout', async () => {
    renderWithRouter(['/dashboard/logout']);
    await waitFor(() => expect(screen.getByTestId('admin-logout-mock')).toBeInTheDocument());
  });

  describe('Facebook Protected Routes', () => {
    it('renders Examen component for / when Facebook authenticated', async () => {
      mockIsFacebookAuthenticated = true;
      renderWithRouter(['/']);
      await waitFor(() => expect(screen.getByTestId('examen-mock')).toBeInTheDocument());
    });

    it('shows redirect content for / when not Facebook authenticated', async () => {
      mockIsFacebookAuthenticated = false;
      renderWithRouter(['/']);
      await waitFor(() => expect(screen.getByTestId('fb-route-redirect')).toBeInTheDocument());
      expect(screen.queryByTestId('examen-mock')).not.toBeInTheDocument();
    });

    it('renders Examen component for /caso/:identificador when Facebook authenticated', async () => {
      mockIsFacebookAuthenticated = true;
      renderWithRouter(['/caso/some-case-id']);
      await waitFor(() => expect(screen.getByTestId('examen-mock')).toBeInTheDocument());
    });

    it('renders Profile component for /profile when Facebook authenticated', async () => {
      mockIsFacebookAuthenticated = true;
      renderWithRouter(['/profile']);
      await waitFor(() => expect(screen.getByTestId('profile-mock')).toBeInTheDocument());
    });
  });

  describe('Admin Protected Routes (PrivateRoute)', () => {
    it('renders Dashboard with CasoTable for /dashboard when authenticated', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard']);
      await waitFor(() => expect(screen.getByTestId('casotable-mock')).toBeInTheDocument());
      // Check if our mock SideNav is rendered as part of Dashboard
      expect(screen.getByTestId('mock-sidenav')).toBeInTheDocument();
    });

    it('shows redirect content for /dashboard when not authenticated', async () => {
      mockIsAuthenticated = false;
      renderWithRouter(['/dashboard']);
      await waitFor(() => expect(screen.getByTestId('private-route-redirect')).toBeInTheDocument());
      expect(screen.queryByTestId('casotable-mock')).not.toBeInTheDocument();
    });

    it('renders Dashboard with CasoTable for /dashboard/casos/:page', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/casos/2']);
      await waitFor(() => expect(screen.getByTestId('casotable-mock')).toBeInTheDocument());
    });

    it('renders Dashboard with CasoContainer for /dashboard/edit/caso/:identificador', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/edit/caso/case123']);
      await waitFor(() => expect(screen.getByTestId('casocontainer-mock')).toBeInTheDocument());
    });

    it('renders Dashboard with CasoContainer for /dashboard/new/caso', async () => {
        mockIsAuthenticated = true;
        renderWithRouter(['/dashboard/new/caso']);
        await waitFor(() => expect(screen.getByTestId('casocontainer-mock')).toBeInTheDocument());
      });

    it('renders Dashboard with Especialidades for /dashboard/especialidades', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/especialidades']);
      await waitFor(() => expect(screen.getByTestId('especialidades-mock')).toBeInTheDocument());
    });

    it('renders Dashboard with EspecialidadForm for /dashboard/new/especialidad', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/new/especialidad']);
      await waitFor(() => expect(screen.getByTestId('especialidadform-mock')).toBeInTheDocument());
    });

    it('renders Dashboard with EspecialidadForm for /dashboard/edit/especialidad/:identificador', async () => {
      mockIsAuthenticated = true;
      renderWithRouter(['/dashboard/edit/especialidad/esp123']);
      await waitFor(() => expect(screen.getByTestId('especialidadform-mock')).toBeInTheDocument());
    });
  });

  it('redirects to / for an unknown route, then renders content for /', async () => {
    mockIsFacebookAuthenticated = true;
    renderWithRouter(['/some/unknown/route']);
    await waitFor(() => expect(screen.getByTestId('examen-mock')).toBeInTheDocument());
  });
});
