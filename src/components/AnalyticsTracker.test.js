import React from 'react';
import { render, act } from '@testing-library/react'; // Adjusted to include act
import { MemoryRouter, Route } from 'react-router-dom'; // MemoryRouter for providing location
import AnalyticsTracker from './AnalyticsTracker'; // The component to test
import ReactGA from 'react-ga'; // To mock its methods

// Mock react-ga
jest.mock('react-ga', () => ({
  initialize: jest.fn(),
  set: jest.fn(),
  pageview: jest.fn(),
}));

describe('AnalyticsTracker', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    // ReactGA.initialize.mockClear(); // Removed to retain the initial module load call
    ReactGA.set.mockClear();
    ReactGA.pageview.mockClear();
  });

  test('initializes ReactGA on module load', () => {
    // This test specifically checks the module-level initialization.
    // We need to ensure we're observing the effect of AnalyticsTracker.js's import.
    // jest.resetModules() can be used to clear the cache and re-import.
    jest.resetModules(); // Reset module cache
    const ReactGAMock = require('react-ga'); // Get the fresh mock for react-ga
    require('./AnalyticsTracker'); // Re-import AnalyticsTracker to trigger its top-level code
    expect(ReactGAMock.initialize).toHaveBeenCalledWith("UA-2989088-15");
  });

  test('calls ReactGA.set and ReactGA.pageview on mount with initial location', () => {
    const initialPath = '/initial-path';
    // Render the component within MemoryRouter to provide a location object
    // AnalyticsTracker is wrapped with `withRouter`, so it gets `location` as a prop.
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <AnalyticsTracker />
      </MemoryRouter>
    );

    expect(ReactGA.set).toHaveBeenCalledTimes(1);
    expect(ReactGA.set).toHaveBeenCalledWith({ page: initialPath });
    expect(ReactGA.pageview).toHaveBeenCalledTimes(1);
    expect(ReactGA.pageview).toHaveBeenCalledWith(initialPath);
  });

  test('calls ReactGA.set and ReactGA.pageview when location changes', () => {
    const initialPath = '/first-path';
    const newPath = '/second-path';

    // Use a Route to easily change the location prop passed to AnalyticsTracker
    let testHistory;

    const { rerender } = render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Route
          path="*"
          render={({ history, location }) => {
            testHistory = history; // Capture history to programmatically navigate
            // Pass location directly because AnalyticsTracker is already wrapped with `withRouter`
            // If AnalyticsTracker was NOT wrapped, we would pass location={location}
            return <AnalyticsTracker location={location}/>;
          }}
        />
      </MemoryRouter>
    );

    // Initial calls
    expect(ReactGA.set).toHaveBeenCalledTimes(1);
    expect(ReactGA.set).toHaveBeenCalledWith({ page: initialPath });
    expect(ReactGA.pageview).toHaveBeenCalledTimes(1);
    expect(ReactGA.pageview).toHaveBeenCalledWith(initialPath);

    // Clear mocks to check for calls only due to location change
    ReactGA.set.mockClear();
    ReactGA.pageview.mockClear();

    // Change the location
    act(() => {
      testHistory.push(newPath);
    });

    // Need to explicitly pass the new location via rerender if not using a mechanism
    // that automatically updates the `location` prop of the tested instance of AnalyticsTracker.
    // Since AnalyticsTracker is child of Route, and Route re-renders on path change,
    // AnalyticsTracker should receive new location prop.

    expect(ReactGA.set).toHaveBeenCalledTimes(1);
    expect(ReactGA.set).toHaveBeenCalledWith({ page: newPath });
    expect(ReactGA.pageview).toHaveBeenCalledTimes(1);
    expect(ReactGA.pageview).toHaveBeenCalledWith(newPath);
  });

  test('component renders null', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <AnalyticsTracker />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});
