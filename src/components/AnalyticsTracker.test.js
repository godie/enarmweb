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

  test('initializes ReactGA on module load (implicitly tested by import)', () => {
    // Since ReactGA.initialize is called at the top level of AnalyticsTracker.js,
    // simply importing the module (which happens when this test file is loaded)
    // should have triggered the mocked initialize.
    // We need to ensure our mock setup correctly captures this.
    // The actual call happens when AnalyticsTracker.js is imported by the test runner.
    // For this test, we can re-require the module if necessary or rely on the fact
    // that it has been called once when the test suite starts.
    // Let's verify it was called (at least once due to module import).
    // Note: This kind of test can be a bit tricky depending on Jest's module caching and execution order.
    // A more direct way to test component logic is to focus on effects.
    // The initialize call in AnalyticsTracker.js is outside the component.
    // We'll assert it was called at least once from the initial module load.
    expect(ReactGA.initialize).toHaveBeenCalledWith("UA-2989088-15");
    // To be more precise for future re-imports/loads if that were a pattern:
    // const initialCallCount = ReactGA.initialize.mock.calls.length;
    // require('./AnalyticsTracker'); // or import
    // expect(ReactGA.initialize.mock.calls.length).toBeGreaterThanOrEqual(initialCallCount);
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
