import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest';
import CasoTable from './CasoTable';
import ExamService from '../../services/ExamService';
import EnarmUtil from '../../modules/EnarmUtil';
import Util from '../../commons/Util';

// --- Router mock ---
const mockHistoryPush = vi.fn();
let mockUrlParams = { page: '1' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUrlParams,
    useHistory: () => ({ push: mockHistoryPush }),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

// --- Service / util mocks ---
vi.mock('../../services/ExamService');
vi.mock('../../modules/EnarmUtil');
vi.mock('../../commons/Util');

// --- Test data ---
const mockCases = [
  {
    id: 1,
    name: 'Caso Cardio 1',
    description: 'Case 1 Description',
    category_id: 101,
    status: 'published',
    questions: [{ id: 10 }, { id: 11 }],
  },
  {
    id: 2,
    name: 'Caso Neuro 2',
    description: 'Case 2 Description',
    category_id: 102,
    status: 'pending',
    questions: [{ id: 20 }],
  },
  {
    id: 3,
    name: 'Caso Sin Preguntas',
    description: 'Case 3 Description',
    category_id: 103,
    status: 'rejected',
    questions: [],
  },
];

const mockCategories = [
  { id: 101, name: 'Cardiología' },
  { id: 102, name: 'Neurología' },
  { id: 103, name: 'Pediatría' },
];

// --- Helper ---
const renderCasoTable = (initialPath = '/dashboard/casos/1') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Route path="/dashboard/casos/:page">
        <CasoTable />
      </Route>
    </MemoryRouter>,
  );

// --- Suite ---
describe('CasoTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    ExamService.getClinicalCases.mockResolvedValue({
      data: { clinical_cases: mockCases, total_entries: mockCases.length },
    });
    ExamService.loadCategories.mockResolvedValue({ data: mockCategories });

    EnarmUtil.getCategories.mockReturnValue(null);
    EnarmUtil.setCategories.mockImplementation(() => {});
    Util.showToast.mockImplementation(() => {});

    mockUrlParams = { page: '1' };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // =====================
  // Loading & error states
  // =====================

  test('shows preloader while data is loading', () => {
    // Promise that never resolves during this test
    ExamService.getClinicalCases.mockReturnValue(new Promise(() => {}));

    renderCasoTable();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('hides preloader after data loads', async () => {
    renderCasoTable();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  test('shows preloader then content once data resolves', async () => {
    vi.useFakeTimers();

    const delayed = new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            data: { clinical_cases: mockCases, total_entries: mockCases.length },
          }),
        200,
      ),
    );
    ExamService.getClinicalCases.mockReturnValue(delayed);

    renderCasoTable();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText(`Casos Clínicos (${mockCases.length})`)).toBeInTheDocument();
    });
  });

  test('shows error message and toast when API fails', async () => {
    vi.useFakeTimers();

    ExamService.getClinicalCases.mockImplementation(
      () =>
        new Promise((_resolve, reject) =>
          setTimeout(() => reject(new Error('Network Timeout')), 100),
        ),
    );

    renderCasoTable();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    vi.advanceTimersByTime(100);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('Error al cargar los casos. Intente de nuevo más tarde.')).toBeInTheDocument();
      expect(Util.showToast).toHaveBeenCalledWith('Error al cargar los casos clínicos.');
    });
  });

  // =====================
  // Rendering table data
  // =====================

  test('renders h4 title with total count', async () => {
    renderCasoTable();

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveTextContent(`Casos Clínicos (${mockCases.length})`);
    });
  });

  test('renders table headers: Nombre, Especialidad, Status, Preguntas, Acciones', async () => {
    renderCasoTable();

    await waitFor(() => {
      expect(screen.getByText('Nombre')).toBeInTheDocument();
      expect(screen.getByText('Especialidad')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Preguntas')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });
  });

  test('renders a row for each case with name', async () => {
    renderCasoTable();

    await waitFor(() => {
      mockCases.forEach((caso) => {
        expect(screen.getByText(caso.name)).toBeInTheDocument();
      });
    });
  });

  test('renders category name from especialidadesOptions map', async () => {
    renderCasoTable();

    await waitFor(() => {
      expect(screen.getByText('Cardiología')).toBeInTheDocument();
      expect(screen.getByText('Neurología')).toBeInTheDocument();
      expect(screen.getByText('Pediatría')).toBeInTheDocument();
    });
  });

  test('renders status badges with correct text', async () => {
    renderCasoTable();

    await waitFor(() => {
      expect(screen.getByText('Publicado')).toBeInTheDocument();
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('Rechazado')).toBeInTheDocument();
    });
  });

  test('renders correct question counts per row', async () => {
    renderCasoTable();

    await waitFor(() => {
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      // rows[0] = thead, rows[1..3] = data rows
      const dataRows = rows.slice(1);

      expect(dataRows).toHaveLength(mockCases.length);

      // First case: 2 questions
      expect(within(dataRows[0]).getByText('2')).toBeInTheDocument();
      // Second case: 1 question
      expect(within(dataRows[1]).getByText('1')).toBeInTheDocument();
      // Third case: 0 questions
      expect(within(dataRows[2]).getByText('0')).toBeInTheDocument();
    });
  });

  test('renders edit link for each case with correct href', async () => {
    renderCasoTable();

    await waitFor(() => {
      const editLinks = screen.getAllByRole('link', {
        name: /Editar Caso/i,
      });

      expect(editLinks).toHaveLength(mockCases.length);

      mockCases.forEach((caso, idx) => {
        expect(editLinks[idx]).toHaveAttribute(
          'href',
          `#/dashboard/edit/caso/${caso.id}`,
        );
      });
    });
  });

  // =====================
  // Empty state
  // =====================

  test('renders empty message when no cases returned', async () => {
    ExamService.getClinicalCases.mockResolvedValue({
      data: { clinical_cases: [], total_entries: 0 },
    });

    renderCasoTable();

    await waitFor(() => {
      expect(screen.getByText('No se encontraron casos clínicos.')).toBeInTheDocument();
      expect(screen.getByText('Casos Clínicos (0)')).toBeInTheDocument();
    });
  });

  // =====================
  // Category caching
  // =====================

  test('loads categories from API when cache is empty', async () => {
    EnarmUtil.getCategories.mockReturnValue(null);

    renderCasoTable();

    await waitFor(() => {
      expect(ExamService.loadCategories).toHaveBeenCalledTimes(1);
      expect(EnarmUtil.setCategories).toHaveBeenCalledWith(JSON.stringify(mockCategories));
    });
  });

  test('uses cached categories and skips API call', async () => {
    EnarmUtil.getCategories.mockReturnValue(JSON.stringify(mockCategories));

    renderCasoTable();

    await waitFor(() => {
      expect(ExamService.loadCategories).not.toHaveBeenCalled();
      // Categories should still render from cache
      expect(screen.getByText('Cardiología')).toBeInTheDocument();
    });
  });

  // =====================
  // Pagination
  // =====================

  test('calls getClinicalCases with page from URL params', async () => {
    mockUrlParams = { page: '5' };
    renderCasoTable('/dashboard/casos/5');

    await waitFor(() => {
      expect(ExamService.getClinicalCases).toHaveBeenCalledWith(5);
    });
  });

  test('defaults to page 1 for invalid page param', async () => {
    mockUrlParams = { page: 'abc' };
    renderCasoTable('/dashboard/casos/abc');

    await waitFor(() => {
      expect(ExamService.getClinicalCases).toHaveBeenCalledWith(1);
    });
  });

  test('re-fetches data when page param changes', async () => {
    const { rerender } = renderCasoTable();

    await waitFor(() => {
      expect(ExamService.getClinicalCases).toHaveBeenCalledWith(1);
    });

    ExamService.getClinicalCases.mockClear();
    mockUrlParams = { page: '3' };

    rerender(
      <MemoryRouter initialEntries={['/dashboard/casos/3']}>
        <Route path="/dashboard/casos/:page">
          <CasoTable />
        </Route>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(ExamService.getClinicalCases).toHaveBeenCalledWith(3);
    });
  });

  test('pagination click calls history.push with new page', async () => {
    ExamService.getClinicalCases.mockResolvedValue({
      data: { clinical_cases: mockCases, total_entries: 30 }, // 30 items / 10 per page = 3 pages
    });

    const { container } = renderCasoTable('/dashboard/casos/1');

    await waitFor(() => {
      expect(screen.getByText(`Casos Clínicos (30)`)).toBeInTheDocument();
    });

    const paginationLinks = container.querySelectorAll('.pagination li a');
    const page2Button = Array.from(paginationLinks).find(
      (el) => el.textContent === '2',
    );

    expect(page2Button).toBeTruthy();
    fireEvent.click(page2Button);

    expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard/casos/2');
  });
});
