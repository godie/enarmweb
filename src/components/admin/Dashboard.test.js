import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Needed if Navi or SideNavItems use Link/NavLink
import Dashboard from './Dashboard';

// Mock Navi component as its internal details are not relevant to Dashboard's structure
jest.mock('../Navi', () => () => <div data-testid="navi-mock">Navigation Bar</div>);

// Mock react-materialize components used by Dashboard if they are not already broadly mocked
// If SideNav and SideNavItem are part of the broad 'react-materialize' mock from AppRoutes.test.js setup,
// this might not be strictly necessary here, but explicit mocking is safer.
jest.mock('react-materialize', () => {
  const actualMaterialize = jest.requireActual('react-materialize');
  return {
    ...actualMaterialize,
    SideNav: (props) => <div data-testid="sidenav-mock" className={props.className}>{props.children}{props.trigger}</div>,
    SideNavItem: (props) => (
      <a data-testid="sidenavitem-mock" href={props.href} className={props.className}>
        {/* If userView prop is true, render mock user view */}
        {props.userView && (
          <div data-testid="sidenavitem-userview-mock">
            User: {props.user && props.user.name}
          </div>
        )}
        {props.children}
      </a>
    ),
    // Add any other Materialize components Dashboard might directly use
  };
});

// Define or redefine global.M for Materialize JS for this test suite
const sidenavInstanceMock = { destroy: jest.fn(), open: jest.fn(), close: jest.fn() };
const modalInstanceMock = { destroy: jest.fn(), open: jest.fn(), close: jest.fn() };
const tooltipInstanceMock = { destroy: jest.fn() };
const dropdownInstanceMock = { destroy: jest.fn(), open: jest.fn(), close: jest.fn() };

global.M = {
  Sidenav: {
    init: jest.fn().mockReturnValue(sidenavInstanceMock),
    getInstance: jest.fn().mockReturnValue(sidenavInstanceMock),
  },
  Modal: {
    init: jest.fn().mockReturnValue(modalInstanceMock),
    getInstance: jest.fn().mockReturnValue(modalInstanceMock),
  },
  Tooltip: {
    init: jest.fn().mockReturnValue(tooltipInstanceMock),
    getInstance: jest.fn().mockReturnValue(tooltipInstanceMock),
  },
  Dropdown: {
    init: jest.fn().mockReturnValue(dropdownInstanceMock),
    getInstance: jest.fn().mockReturnValue(dropdownInstanceMock),
  },
  updateTextFields: jest.fn(),
  validate_field: jest.fn(),
};


describe('Dashboard Component', () => {
  const renderDashboard = (props) => {
    return render(
      <MemoryRouter> {/* Added MemoryRouter for Link/NavLink components */}
        <Dashboard {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Clear calls for all mocked M methods
    global.M.Sidenav.init.mockClear();
    global.M.Sidenav.getInstance.mockClear();
    sidenavInstanceMock.destroy.mockClear();
    sidenavInstanceMock.open.mockClear();
    sidenavInstanceMock.close.mockClear();

    global.M.Modal.init.mockClear();
    modalInstanceMock.destroy.mockClear();
    modalInstanceMock.open.mockClear();
    modalInstanceMock.close.mockClear();

    global.M.Tooltip.init.mockClear();
    tooltipInstanceMock.destroy.mockClear();

    global.M.Dropdown.init.mockClear();
    dropdownInstanceMock.destroy.mockClear();
    dropdownInstanceMock.open.mockClear();
    dropdownInstanceMock.close.mockClear();

    global.M.updateTextFields.mockClear();
    global.M.validate_field.mockClear();
  });

  it('should render the Navi component', () => {
    renderDashboard();
    expect(screen.getByTestId('navi-mock')).toBeInTheDocument();
  });

  it('should render a SideNav component', () => {
    renderDashboard();
    expect(screen.getByTestId('sidenav-mock')).toBeInTheDocument();
    // Check for the specific class passed in Dashboard.js
    expect(screen.getByTestId('sidenav-mock')).toHaveClass('green darken-3 white-text');
  });

  it('should render SideNavItems with correct links and text', () => {
    renderDashboard();

    // UserView (first item)
    const userViewItem = screen.getByTestId('sidenavitem-userview-mock');
    expect(userViewItem).toBeInTheDocument();
    expect(userViewItem).toHaveTextContent('User: diego mendoza');

    // Casos clinicos
    const casosLink = screen.getByText('Casos clinicos').closest('a');
    expect(casosLink).toBeInTheDocument();
    expect(casosLink).toHaveAttribute('href', '#/dashboard/casos/1');

    // Especialidades
    const especialidadesLink = screen.getByText('Especialidades').closest('a');
    expect(especialidadesLink).toBeInTheDocument();
    expect(especialidadesLink).toHaveAttribute('href', '#/dashboard/especialidades');

    // Salir
    const salirLink = screen.getByText('Salir').closest('a');
    expect(salirLink).toBeInTheDocument();
    expect(salirLink).toHaveAttribute('href', '#/dashboard/logout');
  });

  it('should render its children content', () => {
    const childText = 'This is child content';
    renderDashboard({ children: <div data-testid="child-content">{childText}</div> });

    const childDiv = screen.getByTestId('child-content');
    expect(childDiv).toBeInTheDocument();
    expect(childDiv).toHaveTextContent(childText);
  });

  it('should have a main container for children', () => {
    renderDashboard({ children: <div>Test</div> });
    // The structure is <main><div class="container"><div class="row">{props.children}</div></div></main>
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    // Check if a div with class 'container' is inside main
    const containerDiv = mainElement.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
    // Check if a div with class 'row' is inside container
    const rowDiv = containerDiv.querySelector('.row');
    expect(rowDiv).toBeInTheDocument();
    expect(rowDiv.firstChild).toHaveTextContent('Test'); // Assuming child is simple text node or wrapped
  });
});
