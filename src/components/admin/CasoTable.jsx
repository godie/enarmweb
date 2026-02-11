// src/components/admin/CasoTable.jsx
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ExamService from "../../services/ExamService";
import EnarmUtil from "../../modules/EnarmUtil";
import Util from "../../commons/Util";
import CustomCollection from "../custom/CustomCollection";
import CustomCollectionItem from "../custom/CustomCollectionItem";
import CustomPagination from "../custom/CustomPagination";
import CustomPreloader from "../custom/CustomPreloader";
import CasoRow from "./CasoRow";

const ITEMS_PER_PAGE = 10;

const CasoTable = () => {
  const history = useHistory();
  const { page: pageParam } = useParams();

  const [casesData, setCasesData] = useState(null);
  const [totalCases, setTotalCases] = useState(0);

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

  // Track last page to reset state during render (avoids useEffect setState warning)
  const [lastPage, setLastPage] = useState(currentPage);
  if (currentPage !== lastPage) {
    setLastPage(currentPage);
    setCasesData(null);
    setLoadingError(false);
  }

  useEffect(() => {
    // Load cases data
    ExamService.getClinicalCases(currentPage)
      .then((response) => {
        setCasesData(response.data.clinical_cases);
        setTotalCases(response.data.total_entries);
      })
      .catch((error) => {
        setCasesData([]);
        setTotalCases(0);
        setLoadingError(true);
        console.error("Error loading exams", error);
        Util.showToast("Error al cargar los casos clínicos.");
      });
  }, [currentPage]);

  const changeCategory = (caso, newValue) => {
    const categoryId = parseInt(newValue, 10);
    const updatedCaso = { ...caso, category_id: categoryId };

    ExamService.saveCaso(updatedCaso)
      .then((response) => {
        Util.showToast("Se actualizó la especialidad");
        setCasesData((prevCasesData) =>
          prevCasesData.map(c => c.id === caso.id ? response.data : c)
        );
      })
      .catch((error) => {
        console.error("Error updating case", error);
        Util.showToast("No se pudo actualizar la especialidad");
      });
  };

  const handlePageClick = (newPage) => {
    if (newPage === currentPage) return;
    history.push(`/dashboard/casos/${newPage}`);
  };

  const numPages = Math.ceil(totalCases / perPage);

  if (casesData === null && !loadingError) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }} role="progressbar">
        <CustomPreloader size="big" active />
      </div>
    );
  }

  if (loadingError) {
    return (
      <CustomCollectionItem className="center-align red-text text-darken-4">
        Error al cargar los casos. Intente de nuevo más tarde.
      </CustomCollectionItem>
    );
  }

  return (
    <CustomCollection header={`Casos Clinicos (${totalCases})`} className="text-darken-1">
      <CustomPagination
        activePage={currentPage}
        items={numPages}
        maxButtons={8}
        onSelect={handlePageClick}
        className="green-text text-darken-1"
      />

      {casesData.length === 0 ? (
        <CustomCollectionItem className="center-align text-darken-1">
          No se encontraron casos clínicos.
        </CustomCollectionItem>
      ) : (
        casesData.map((caso) => (
          <CasoRow
            key={caso.id}
            caso={caso}
            categories={categories}
            onChangeCategory={changeCategory}
          />
        ))
      )}

      <CustomPagination
        activePage={currentPage}
        items={numPages}
        maxButtons={8}
        onSelect={handlePageClick}
        className="green-text text-darken-1"
      />
    </CustomCollection>
  );
};

export default CasoTable;

