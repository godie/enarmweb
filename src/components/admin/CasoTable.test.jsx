
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import CasoTable from './CasoTable';
import ExamService from '../../services/ExamService';
import EnarmUtil from '../../modules/EnarmUtil';
import Util from '../../commons/Util';

// Mock react-router-dom
const mockHistoryPush = vi.fn();
// We'll use actual useParams and useHistory from react-router-dom within MemoryRouter
// so we don't need to mock them as extensively as before, but still control push.
// The useParams mock will be handled by the <Route path>
// For useHistory, we still might need to mock its `push` method if we want to assert on it.

// Update your useParams mock slightly if you intend to directly control it for specific tests,
// though MemoryRouter+Route is usually better for path params.
let mockUrlParams = { page: '1' }; // Default params

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUrlParams,
    useHistory: () => ({
      push: mockHistoryPush,
    }),
    Link: ({ to, children }) => <a href={to}>{children}</a>
  };
});

// Mock services and utils
vi.mock('../../services/ExamService');
vi.mock('../../modules/EnarmUtil');
vi.mock('../../commons/Util');

// Mock react-materialize components that might be problematic or we want to inspect
// For Preloader, we can just check for its default text or a role if it has one.
// For Pagination, we need to be ableto find and click page items.
// For Select, we need to be able to change its value.

const mockCases = [
  { id: 1, description: 'Case 1 Description', category_id: 101 },
  { id: 2, description: 'Case 2 Description', category_id: 102 },
];

const mockCategories = [
  { id: 101, name: 'Cardiología' },
  { id: 102, name: 'Neurología' },
  { id: 103, name: 'Pediatría' },
];

// Helper function to render the component
const renderCasoTable = (initialPath = '/dashboard/casos/1') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      {/* Route is necessary to make useParams work */}
      <Route path="/dashboard/casos/:page">
        <CasoTable />
      </Route>
      {/* Also add a route for the Link in CollectionItem if you plan to navigate to it */}
      <Route path="/dashboard/edit/caso/:id">
        {({ match }) =>
          match ? (<div>Edit Caso Page for ID: {match.params.id}</div>) : null
        }
      </Route>
    </MemoryRouter>
  );
};

describe('CasoTable Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    // Default mock implementations
    ExamService.getClinicalCases.mockResolvedValue({
      data: { clinical_cases: mockCases, total_entries: mockCases.length }
    });
    ExamService.loadCategories.mockResolvedValue({ data: mockCategories });
    ExamService.saveCaso.mockImplementation(async (caso) => ({ data: caso })); // Echo back the saved caso

    EnarmUtil.getCategories.mockReturnValue(null); // Default to no cache
    EnarmUtil.setCategories.mockImplementation(() => { });
    Util.showToast.mockImplementation(() => { });

    mockUrlParams = { page: '1' }; // Reset params
  });

  test('renders Preloader when data is initially null', async () => {
    // Override default mock for this test to simulate loading
    //ExamService.getClinicalCases.mockResolvedValue(new Promise(() => {})); // Never resolves for this test
    ExamService.getClinicalCases.mockImplementation(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('NetWork Timeout'));
        }, 500);
      })
    });
    ExamService.loadCategories.mockResolvedValue({ data: mockCategories }); // Resolve categories synchronously

    renderCasoTable();
    // Preloader in react-materialize renders a div with class "preloader-wrapper"
    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // react-materialize Preloader has role="progressbar"

    vi.advanceTimersByTime(500);
    await waitFor(() => {
      // Afirmar que el Preloader ha desaparecido
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      // Afirmar que se mostró un toast de error (si tu componente lo maneja así)
      expect(Util.showToast).toHaveBeenCalledWith("Error al cargar los casos clínicos."); // Ajusta el mensaje si es diferente
      // O afirmar que se muestra algún mensaje de "no hay casos" o un estado de error en la UI
      // Dependerá de cómo CasoTable.js maneje el catch de ExamService.getExams
    });

  });

  test('renders a list of cases and header', async () => {
    renderCasoTable();
    await waitFor(() => {
      expect(screen.getByText(`Casos Clinicos (${mockCases.length})`)).toBeInTheDocument();
      expect(screen.getByText('Case 1 Description')).toBeInTheDocument();
      expect(screen.getByText('Case 2 Description')).toBeInTheDocument();
      expect(screen.getAllByRole('combobox')[0]).toHaveValue(mockCases[0].category_id.toString());

    });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  test('renders no cases message or empty state when data is empty', async () => {
    ExamService.getClinicalCases.mockResolvedValue({ data: { clinical_cases: [], total_entries: 0 } });
    ExamService.loadCategories.mockResolvedValue({ data: mockCategories }); // Categories load fine

    renderCasoTable();
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('No se encontraron casos clínicos.')).toBeInTheDocument();
      expect(screen.queryByText('Casos Clinicos (0)')).toBeInTheDocument();
      expect(screen.queryByText('Case 1 Description')).not.toBeInTheDocument();
    });
  });

  test('loads categories from API if not cached', async () => {
    EnarmUtil.getCategories.mockReturnValue(null); // Ensure cache is empty
    renderCasoTable();
    await waitFor(() => expect(ExamService.loadCategories).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(EnarmUtil.setCategories).toHaveBeenCalledWith(JSON.stringify(mockCategories)));
    // Check if select options are populated (indirectly checks setCategories)
    await waitFor(() => {
      // Get the first select rendered (assuming there's at least one case)
      const selects = screen.getAllByRole('combobox');
      expect(selects[0]).toHaveValue(mockCases[0].category_id.toString());
      // Check for one of the category options
      expect(screen.getAllByText(mockCategories[0].name, { selector: 'option' })[0]).toBeInTheDocument();
    });
  });

  test('loads categories from cache if available', async () => {
    EnarmUtil.getCategories.mockReturnValue(JSON.stringify(mockCategories));
    renderCasoTable();
    await waitFor(() => expect(ExamService.loadCategories).not.toHaveBeenCalled());
    // Check if select options are populated
    await waitFor(() => {
      const selects = screen.getAllByRole('combobox');
      expect(selects[0]).toHaveValue(mockCases[0].category_id.toString());
      expect(screen.getAllByText(mockCategories[0].name, { selector: 'option' })[0]).toBeInTheDocument();
    });
  });

  test('data is loaded on initial mount based on page param', async () => {
    mockUrlParams = { page: '2' };
    renderCasoTable();
    await waitFor(() => expect(ExamService.getClinicalCases).toHaveBeenCalledWith(2));
  });

  // This test is more complex as it requires re-evaluating useParams.
  // Typically, you test this by wrapping the component in a router and changing the route.
  // For a unit test just checking useEffect dependency, we can change mockUrlParams and re-render.
  test('data is re-loaded when page parameter changes', async () => {
    const { rerender } = renderCasoTable();
    await waitFor(() => expect(ExamService.getClinicalCases).toHaveBeenCalledWith(1));
    ExamService.getClinicalCases.mockClear(); // Clear previous calls

    // Simulate page change by changing mockUrlParams and re-rendering
    mockUrlParams = { page: '3' };
    rerender(<MemoryRouter initialEntries={['/dashboard/casos/3']}>
      <Route path="/dashboard/casos/:page">
        <CasoTable />
      </Route>
      <Route path="/dashboard/edit/caso/:id">
        {({ match }) =>
          match ? (<div data-testid="edit-page-mock">Edit Caso Page for ID: {match.params.id}</div>) : null
        }
      </Route>
    </MemoryRouter>); // Rerender with new params context
    await waitFor(() => {
      expect(ExamService.getClinicalCases).toHaveBeenCalledWith(3);
      expect(ExamService.getClinicalCases).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText(`Casos Clinicos (${mockCases.length})`)).toBeInTheDocument();
    });

  });


  test('pagination works and calls history.push', async () => {
    ExamService.getClinicalCases.mockResolvedValue({
      data: { clinical_cases: mockCases, total_entries: 20 } // 20 items, 10 per page = 2 pages
    });
    const { container } = renderCasoTable('/dashboard/casos/1'); // ITEMS_PER_PAGE is 10

    await waitFor(() => {
      // react-materialize Pagination creates <li><a>Page number</a></li>
      // We need to find the link for page 2.
      // It usually has an <a> tag with text '2'.
      //const pageLinks = screen.getAllByRole('link');
      // This is a bit fragile. A better way would be if Pagination items had data-testid.
      // Assuming page 2 link is present and identifiable.
      // The Pagination component will render page numbers. We're looking for the '2'.
      // It might be inside an <a> tag within an <li>.
      // Let's find all pagination items. react-materialize Pagination uses <li> with class "waves-effect"
      // The active page is 1. We want to click on page 2.
      const paginationItems = container.querySelectorAll('.pagination li a');
      const page2Button = Array.from(paginationItems).find(el => el.textContent === '2');
      expect(page2Button).toBeInTheDocument();
      fireEvent.click(page2Button);
    });

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard/casos/2');
    });
  });

  test('category change calls saveCaso and updates UI on success', async () => {
    renderCasoTable();
    await waitFor(() => expect(screen.getByText('Case 1 Description')).toBeInTheDocument());

    const firstSelect = screen.getAllByRole('combobox')[0];
    const newCategoryId = mockCategories[2].id.toString(); // Pediatría

    fireEvent.change(firstSelect, { target: { value: newCategoryId } });

    await waitFor(() => {
      expect(ExamService.saveCaso).toHaveBeenCalledTimes(1);
      expect(ExamService.saveCaso).toHaveBeenCalledWith(expect.objectContaining({
        id: mockCases[0].id,
        category_id: parseInt(newCategoryId, 10),
      }));
    });

    expect(Util.showToast).toHaveBeenCalledWith("Se actualizo la especialidad");
    // Check if the select's value is updated in the DOM
    expect(firstSelect).toHaveValue(newCategoryId);
  });

  test('category change shows error toast on saveCaso failure', async () => {
    ExamService.saveCaso.mockRejectedValue(new Error('Failed to save'));
    renderCasoTable();
    await waitFor(() => expect(screen.getByText('Case 1 Description')).toBeInTheDocument());

    const firstSelect = screen.getAllByRole('combobox')[0];
    const newCategoryId = mockCategories[2].id.toString();

    fireEvent.change(firstSelect, { target: { value: newCategoryId } });

    await waitFor(() => expect(ExamService.saveCaso).toHaveBeenCalledTimes(1));
    expect(Util.showToast).toHaveBeenCalledWith("No se pudo actualizar la especialidad");
  });

  test('renders Preloader initially and then content once data loads', async () => {
    const initialPromise = new Promise(resolve => setTimeout(() => resolve({
      data: { clinical_cases: mockCases, total_entries: mockCases.length }
    }), 100));
    ExamService.getClinicalCases.mockReturnValue(initialPromise);

    renderCasoTable();

    // Assert Preloader is visible initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Wait for the data to load and Preloader to disappear
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText(`Casos Clinicos (${mockCases.length})`)).toBeInTheDocument();
    });
  });

});
