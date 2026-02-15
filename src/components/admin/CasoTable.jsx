// src/components/admin/CasoTable.jsx
import { useState, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import ExamService from "../../services/ExamService";
import EnarmUtil from "../../modules/EnarmUtil";
import Util from "../../commons/Util";
import { CustomRow, CustomCol, CustomTable } from "../custom";
import CustomPagination from "../custom/CustomPagination";
import CustomPreloader from "../custom/CustomPreloader";
import CasoRow from "./CasoRow";

const ITEMS_PER_PAGE = 10;

const CasoTable = () => {
  const history = useHistory();
  const { page: pageParam } = useParams();

  const [casesData, setCasesData] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [loading, setLoading] = useState(true);
 
  const currentPage = (() => {
    const pageNum = parseInt(pageParam, 10);
    return !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
  })();

  const [categories, setCategories] = useState(() => {
    const cached = EnarmUtil.getCategories();
    return cached ? JSON.parse(cached) : [];
  });

  const [loadingError, setLoadingError] = useState(false);
  const perPage = ITEMS_PER_PAGE;

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

  // Track last page to reset state during render (avoids useEffect setState warning)
  const [lastPage, setLastPage] = useState(currentPage);
  if (currentPage !== lastPage) {
    setLastPage(currentPage);
    setCasesData([]);
    setLoadingError(false);
  }

  useEffect(() => {
    // Load cases data
    ExamService.getClinicalCases(currentPage)
      .then((response) => {
        setLoadingError(false);
        setCasesData(response.data.clinical_cases);
        setTotalCases(response.data.total_entries);
        setLoadingError(false);
      })
      .catch((error) => {
        setCasesData([]);
        setTotalCases(0);
        setLoadingError(true);
        console.error("Error loading exams", error);
        Util.showToast("Error al cargar los casos clínicos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageClick = (newPage) => {
    if (newPage === currentPage) return;
    setLoading(true);
    history.push(`/dashboard/casos/${newPage}`);
  };

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
          <h4 className="grey-text text-darken-3">{`Casos Clínicos (${totalCases})`}</h4>

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
              {casesData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="center-align">
                    No se encontraron casos clínicos.
                  </td>
                </tr>
              ) : (
                casesData.map((caso) => (
                  <CasoRow
                    key={caso.id}
                    caso={caso}
                      especialidadesOptions={especialidadesOptions}
                  />
                ))
              )}
            </tbody>
          </CustomTable>

          <CustomPagination
            activePage={currentPage}
            items={numPages}
            maxButtons={8}
            onSelect={handlePageClick}
            className="green-text text-darken-1"
          />
        </CustomCol>
      </CustomRow>
    </div>
  );
};

export default CasoTable;

