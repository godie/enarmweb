
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import Dashboard from './Dashboard';

// Mock Navi component
vi.mock('../Navi', () => ({
  default: () => <div data-testid="navi-mock">Navigation Bar</div>
}));

// Mock SideNavAdmin
vi.mock('./SideNavAdmin', () => ({
  default: () => <div data-testid="sidenav-mock">SideNav Admin</div>
}));

// Mock Custom components if needed, but Dashboard uses Navi and SideNavAdmin mostly
// Dashboard.jsx structure is simple:
/*
    <div className="dashboard">
      <header>
        <div className="navbar-fixed">
          <Navi ... />
        </div>
        <SideNavAdmin />
      </header>
      <main className="main-content">
        ...
      </div>
    </div>
*/

describe('Dashboard Component', () => {
  const renderDashboard = (props = {}) => {
    return render(
      <MemoryRouter>
        <Dashboard {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Navi component', () => {
    renderDashboard();
    expect(screen.getByTestId('navi-mock')).toBeInTheDocument();
  });

  it('should render the SideNavAdmin component', () => {
    renderDashboard();
    expect(screen.getByTestId('sidenav-mock')).toBeInTheDocument();
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
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('main-content');

    const containerDiv = mainElement.querySelector('.dashboard-content');
    expect(containerDiv).toBeInTheDocument();

    const rowDiv = containerDiv.querySelector('.row');
    expect(rowDiv).toBeInTheDocument();
  });
});
