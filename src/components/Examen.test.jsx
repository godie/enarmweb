import { vi, describe, beforeEach, expect, afterEach, test } from "vitest";

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import Examen from './Examen';
import EnarmUtil from '../modules/EnarmUtil';

// Mock react-router-dom
let mockRouterParams = {};
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => mockRouterParams,
  };
});

// Mock EnarmUtil.getCategory
vi.mock('../modules/EnarmUtil', () => ({
  default: {
    getCategory: vi.fn(),
  },
}));

// Mock child components
vi.mock('./Caso', () => ({
  default: (props) => (
    <div data-testid="mock-caso" data-cliniccaseid={props.clinicCaseId}>
      Mocked Caso Component
    </div>
  )
}));

vi.mock('./facebook/FacebookComments', () => ({
  default: (props) => (
    <div data-testid="mock-fb-comments" data-href={props.href} data-width={props.width}>
      Mocked FacebookComments Component
    </div>
  )
}));

// Helper function to render
const renderExamen = () => {
  return render(<Examen />);
};

describe('Examen Component', () => {
  const originalInnerWidth = global.innerWidth;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouterParams = { identificador: '1' };
    // Default mock implementations
    EnarmUtil.getCategory.mockImplementation((propsWithMatch) => {
      if (propsWithMatch?.match?.params?.identificador) {
        return propsWithMatch.match.params.identificador;
      }
      return 'defaultMockId';
    });
    global.innerWidth = 1024; // Default large screen
    window.dispatchEvent(new Event('resize'));
  });

  afterEach(() => {
    global.innerWidth = originalInnerWidth; // Restore original innerWidth
  });

  test('renders Caso and FacebookComments with initial props', async () => {
    renderExamen();

    // Verify EnarmUtil.getCategory call structure
    // It's called twice initially due to useState initializer + useEffect in Examen
    expect(EnarmUtil.getCategory).toHaveBeenCalledWith({ match: { params: { identificador: '1' } } });

    await waitFor(() => {
      const casoComponent = screen.getByTestId('mock-caso');
      expect(casoComponent).toBeInTheDocument();
      expect(casoComponent).toHaveAttribute('data-cliniccaseid', '1');

      const fbCommentsComponent = screen.getByTestId('mock-fb-comments');
      expect(fbCommentsComponent).toBeInTheDocument();
      expect(fbCommentsComponent).toHaveAttribute('data-href', 'http://enarm.godieboy.com/#/caso/1');
      // Initial width calculation: window.innerWidth - 500 = 1024 - 500 = 524
      expect(fbCommentsComponent).toHaveAttribute('data-width', '524');
    });
  });

  test('updates FacebookComments width on window resize (large to small)', async () => {
    renderExamen();

    await waitFor(() => {
      expect(screen.getByTestId('mock-fb-comments')).toHaveAttribute('data-width', '524');
    });

    // Simulate small screen
    global.innerWidth = 400;
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      const fbCommentsComponent = screen.getByTestId('mock-fb-comments');
      expect(fbCommentsComponent).toHaveAttribute('data-width', '300');
    });
  });

  test('updates FacebookComments width on window resize (small to large)', async () => {
    global.innerWidth = 400; // Start small
    fireEvent(window, new Event('resize'));
    renderExamen();

    await waitFor(() => {
      expect(screen.getByTestId('mock-fb-comments')).toHaveAttribute('data-width', '300');
    });

    // Simulate large screen
    global.innerWidth = 1200;
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      const fbCommentsComponent = screen.getByTestId('mock-fb-comments');
      // 1200 - 500 = 700
      expect(fbCommentsComponent).toHaveAttribute('data-width', '700');
    });
  });

  test('updates clinicCaseId and commentUrl when URL parameters change', async () => {
    // Initial render with identificador '1'
    mockRouterParams = { identificador: '1' };
    const { rerender } = renderExamen();

    await waitFor(() => {
      expect(screen.getByTestId('mock-caso')).toHaveAttribute('data-cliniccaseid', '1');
      expect(screen.getByTestId('mock-fb-comments')).toHaveAttribute('data-href', 'http://enarm.godieboy.com/#/caso/1');
    });

    EnarmUtil.getCategory.mockClear(); // Clear previous calls to check the new one

    // Change params and rerender
    mockRouterParams = { identificador: 'alpha99' };
    rerender(<Examen />);

    // Verify EnarmUtil.getCategory was called with new params
    // It will be called by the useEffect hook that depends on `params`
    expect(EnarmUtil.getCategory).toHaveBeenCalledWith({ match: { params: { identificador: 'alpha99' } } });

    await waitFor(() => {
      const casoComponent = screen.getByTestId('mock-caso');
      expect(casoComponent).toHaveAttribute('data-cliniccaseid', 'alpha99');

      const fbCommentsComponent = screen.getByTestId('mock-fb-comments');
      expect(fbCommentsComponent).toHaveAttribute('data-href', 'http://enarm.godieboy.com/#/caso/alpha99');
    });
  });

  test('EnarmUtil.getCategory correctly uses default if params are missing', async () => {
    EnarmUtil.getCategory.mockImplementation((propsWithMatch) => {
      if (propsWithMatch && propsWithMatch.match && propsWithMatch.match.params && propsWithMatch.match.params.identificador) {
        return propsWithMatch.match.params.identificador;
      }
      return 'fallbackId123'; // Specific default for this test
    });
    mockRouterParams = {}; // No 'identificador'
    renderExamen();

    await waitFor(() => {
      const casoComponent = screen.getByTestId('mock-caso');
      expect(casoComponent).toBeInTheDocument();
      expect(casoComponent).toHaveAttribute('data-cliniccaseid', 'fallbackId123');

      const fbCommentsComponent = screen.getByTestId('mock-fb-comments');
      expect(fbCommentsComponent).toBeInTheDocument();
      expect(fbCommentsComponent).toHaveAttribute('data-href', 'http://enarm.godieboy.com/#/caso/fallbackId123');
    });
  });

});
