import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import CasoTable from './CasoTable';
import ExamService from '../services/ExamService';
import EnarmUtil from '../modules/EnarmUtil';
import Util from '../commons/Util';

// Mock react-router-dom
const mockHistoryPush = jest.fn();
let mockUrlParams = { page: '1' }; // Default params

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // important for Link
  useParams: () => mockUrlParams,
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

// Mock services and utils
jest.mock('../services/ExamService');
jest.mock('../modules/EnarmUtil');
jest.mock('../commons/Util');

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
const renderCasoTable = () => {
  return render(<CasoTable />);
};

describe('CasoTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    ExamService.getExams.mockResolvedValue({
      data: { clinical_cases: mockCases, total_entries: mockCases.length }
    });
    ExamService.loadCategories.mockResolvedValue({ data: mockCategories });
    ExamService.saveCaso.mockImplementation(async (caso) => ({ data: caso })); // Echo back the saved caso

    EnarmUtil.getCategories.mockReturnValue(null); // Default to no cache
    EnarmUtil.setCategories.mockImplementation(() => {});
    Util.showToast.mockImplementation(() => {});

    mockUrlParams = { page: '1' }; // Reset params
  });

  test('renders Preloader when data is initially null', () => {
    // Override default mock for this test to simulate loading
    ExamService.getExams.mockImplementation(() => new Promise(() => {})); // Pending promise
    renderCasoTable();
    // Preloader in react-materialize renders a div with class "preloader-wrapper"
    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // react-materialize Preloader has role="progressbar"
  });

  test('renders a list of cases and header', async () => {
    renderCasoTable();
    await waitFor(() => {
      expect(screen.getByText(`Casos Clinicos (${mockCases.length})`)).toBeInTheDocument();
      expect(screen.getByText('Case 1 Description')).toBeInTheDocument();
      expect(screen.getByText('Case 2 Description')).toBeInTheDocument();
    });
  });

  test('renders no cases message or empty state when data is empty', async () => {
    ExamService.getExams.mockResolvedValue({ data: { clinical_cases: [], total_entries: 0 } });
    renderCasoTable();
    await waitFor(() => {
      expect(screen.getByText('Casos Clinicos (0)')).toBeInTheDocument();
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
    await waitFor(() => expect(ExamService.getExams).toHaveBeenCalledWith(2));
  });

  // This test is more complex as it requires re-evaluating useParams.
  // Typically, you test this by wrapping the component in a router and changing the route.
  // For a unit test just checking useEffect dependency, we can change mockUrlParams and re-render.
  test('data is re-loaded when page parameter changes', async () => {
    // Initial render with page 1
    mockUrlParams = { page: '1' };
    const { rerender } = renderCasoTable();
    await waitFor(() => expect(ExamService.getExams).toHaveBeenCalledWith(1));
    ExamService.getExams.mockClear(); // Clear previous calls

    // Simulate page change by changing mockUrlParams and re-rendering
    mockUrlParams = { page: '3' };
    rerender(<CasoTable />); // Rerender with new params context
    await waitFor(() => expect(ExamService.getExams).toHaveBeenCalledWith(3));
  });


  test('pagination works and calls history.push', async () => {
    ExamService.getExams.mockResolvedValue({
      data: { clinical_cases: mockCases, total_entries: 20 } // 20 items, 10 per page = 2 pages
    });
    const { container } = renderCasoTable(); // ITEMS_PER_PAGE is 10

    await waitFor(() => {
      // react-materialize Pagination creates <li><a>Page number</a></li>
      // We need to find the link for page 2.
      // It usually has an <a> tag with text '2'.
      const pageLinks = screen.getAllByRole('link');
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

});
