// src/components/admin/CasoTable.jsx
import { useState, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import ExamService from "../../services/ExamService";
import EnarmUtil from "../../modules/EnarmUtil";
import Util from "../../commons/Util";
import { CustomRow, CustomCol, CustomTable, CustomSelect, CustomTextInput, CustomButton } from "../custom";
import CustomPagination from "../custom/CustomPagination";
import CustomPreloader from "../custom/CustomPreloader";
import CasoRow from "./CasoRow";

const ITEMS_PER_PAGE = 10;

const CasoTable = () => {
  const history = useHistory();
  const { page: pageParam } = useParams();

  const currentPage = (() => {
    const pageNum = parseInt(pageParam, 10);
    return !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
  })();

  const [categories, setCategories] = useState(() => {
    const cached = EnarmUtil.getCategories();
    return cached ? JSON.parse(cached) : [];
  });

  const [state, setState] = useState({
    casesData: [],
    allCasesData: [],
    totalCases: 0,
    loading: true,
    loadingError: false,
    lastPage: currentPage
  });

  const { casesData, allCasesData, totalCases, loading, loadingError, lastPage } = state;
  const perPage = ITEMS_PER_PAGE;
  const [filters, setFilters] = useState({
    categoryId: "",
    status: "",
    questionsCount: ""
  });

  const hasActiveFilters = useMemo(
    () => Boolean(filters.categoryId || filters.status || filters.questionsCount !== ""),
    [filters]
  );

  useEffect(() => {
    // Load categories
    if (categories.length === 0) {
      ExamService.loadCategories()
        .then((response) => {
          EnarmUtil.setCategories(JSON.stringify(response.data));
          setCategories(response.data);
        })
        .catch((error) => console.error("Error loading categories", error));
    }
  }, [categories.length]);

  const especialidadesOptions = useMemo(() => new Map(
    categories.map((esp) => [`${esp.id}`, esp.name])
  ), [categories]);

  // Track last page to reset state during render
  if (currentPage !== lastPage) {
    setState(prev => ({
      ...prev,
      lastPage: currentPage,
      casesData: [],
      loadingError: false,
      loading: true
    }));
  }

  useEffect(() => {
    // Load cases data
    ExamService.getClinicalCases(currentPage)
      .then((response) => {
        setState(prev => ({
          ...prev,
          loadingError: false,
          casesData: response.data.clinical_cases,
          totalCases: response.data.total_entries,
          loading: false
        }));
      })
      .catch((error) => {
        console.error("Error loading exams", error);
        setState(prev => ({
          ...prev,
          casesData: [],
          totalCases: 0,
          loadingError: true,
          loading: false
        }));
        Util.showToast("Error al cargar los casos clínicos.");
      });
  }, [currentPage]);

  useEffect(() => {
    const loadAllCasesForFiltering = async () => {
      if (!hasActiveFilters || totalCases <= 0 || allCasesData.length >= totalCases) return;

      try {
        const pages = Math.ceil(totalCases / perPage);
        const requests = [];
        for (let page = 1; page <= pages; page += 1) {
          requests.push(ExamService.getClinicalCases(page));
        }

        const responses = await Promise.all(requests);
        const allCases = responses.flatMap((res) => res.data?.clinical_cases || []);

        setState(prev => ({
          ...prev,
          allCasesData: allCases
        }));
      } catch (error) {
        console.error("Error loading all cases for filters", error);
        Util.showToast("No se pudo cargar el total de casos para filtrar.");
      }
    };

    loadAllCasesForFiltering();
  }, [hasActiveFilters, totalCases, allCasesData.length, perPage]);

  const handlePageClick = (newPage) => {
    if (newPage === currentPage) return;
    setState(prev => ({ ...prev, loading: true }));
    history.push(`/dashboard/casos/${newPage}`);
  };

  const filteredCases = useMemo(() => {
    const sourceCases = hasActiveFilters && allCasesData.length > 0 ? allCasesData : casesData;
    return sourceCases.filter((caso) => {
      const categoryMatch = !filters.categoryId || String(caso.category_id) === filters.categoryId;
      const statusMatch = !filters.status || caso.status === filters.status;
      const questionsCount = caso.questions?.length ?? 0;
      const questionsMatch =
        filters.questionsCount === "" || questionsCount === Number(filters.questionsCount);

      return categoryMatch && statusMatch && questionsMatch;
    });
  }, [casesData, allCasesData, hasActiveFilters, filters]);

  const numPages = Math.ceil(totalCases / perPage);

  if (loading && !loadingError) {
    return (
      <div className="center-align enarm-loading-wrapper--compact">
        <CustomPreloader size="big" active />
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="center-align red-text text-darken-4" style={{ padding: '20px' }}>
        Error al cargar los casos. Intente de nuevo más tarde.
      </div>
    );
  }

  return (
    <div className="caso-table-container">
      <CustomRow>
        <CustomCol s={12}>
          <h4 className="grey-text text-darken-3">{`Casos Clínicos (${filteredCases.length}/${totalCases})`}</h4>
          <div className="right-align" style={{ marginBottom: "1rem" }}>
            <CustomButton
              node="a"
              href="#/dashboard/add/caso"
              className="green"
              icon="add"
              iconPosition="right"
            >
              Agregar un nuevo caso clínico
            </CustomButton>
          </div>

          <CustomRow>
            <CustomCol s={12} m={4}>
              <CustomSelect
                id="filter-category"
                label="Filtrar por especialidad"
                value={filters.categoryId}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, categoryId: event.target.value }))
                }
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ))}
              </CustomSelect>
            </CustomCol>

            <CustomCol s={12} m={4}>
              <CustomSelect
                id="filter-status"
                label="Filtrar por status"
                value={filters.status}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, status: event.target.value }))
                }
              >
                <option value="">Todos</option>
                <option value="pending">Pendiente</option>
                <option value="published">Publicado</option>
                <option value="rejected">Rechazado</option>
              </CustomSelect>
            </CustomCol>

            <CustomCol s={12} m={4}>
              <CustomTextInput
                id="filter-questions-count"
                type="number"
                min={0}
                label="No. de preguntas (exacto)"
                value={filters.questionsCount}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, questionsCount: event.target.value }))
                }
              />
            </CustomCol>
          </CustomRow>

          <CustomPagination
            activePage={currentPage}
            items={numPages}
            maxButtons={8}
            onSelect={handlePageClick}
            className="green-text text-darken-1"
          />

          <CustomTable striped className="highlight z-depth-1">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Status</th>
                <th>Preguntas</th>
                <th className="right-align">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="center-align">
                    No se encontraron casos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredCases.map((caso) => (
                  <CasoRow
                    key={caso.id}
                    caso={caso}
                      especialidadesOptions={especialidadesOptions}
                  />
                ))
              )}
            </tbody>
          </CustomTable>

          {!hasActiveFilters && (
            <CustomPagination
              activePage={currentPage}
              items={numPages}
              maxButtons={8}
              onSelect={handlePageClick}
              className="green-text text-darken-1"
            />
          )}
        </CustomCol>
      </CustomRow>
      <CustomButton
        node="a"
        href="#/dashboard/add/caso"
        className="red"
        large
        floating
        fab
        icon="add"
        tooltip={{ text: "Agregar un nuevo caso clínico", position: "top" }}
        waves="light"
      />
    </div>
  );
};

export default CasoTable;

