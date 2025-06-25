// src/components/CasoTable.js
import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ExamService from "../../services/ExamService";
import EnarmUtil from "../../modules/EnarmUtil";
import Util from "../../commons/Util";
// Icon might be needed if CustomButton didn't cover a case or for Pagination defaults, but Pagination handles its own.
import CustomCollection from "../custom/CustomCollection";
import CustomCollectionItem from "../custom/CustomCollectionItem";
import CustomPagination from "../custom/CustomPagination";
import CustomSelect from "../custom/CustomSelect";
import CustomRow from "../custom/CustomRow"; // Added
import CustomCol from "../custom/CustomCol"; // Added
import CustomButton from "../custom/CustomButton"; // Added
import CustomPreloader from "../custom/CustomPreloader"; // Added

const ITEMS_PER_PAGE = 10;

// This is outside the main component, so it doesn't get re-declared on each render.
// However, it references `casesData`, `changeCategory`, `especialidadesOptions` from the component's scope.
// This will cause issues if not handled correctly.
// For the purpose of this refactor, we assume this structure was working before
// and only replace CollectionItem. Ideally, this should be part of the component or passed props.
// To make it work, this definition needs to be inside the CasoTable component or receive these as props.
// For now, I will move it inside for the purpose of applying the diff, but this indicates a potential refactor needed for this file's structure.

const CasoTable = () => {
  const history = useHistory();
  const { page: pageParam } = useParams();

  const [casesData, setCasesData] = useState(null);
  const [totalCases, setTotalCases] = useState(0);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingError, setLoadingError] = useState(false);
  const [perPage, setPerpage] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const pageNum = parseInt(pageParam, 10);
    setCurrentPage(!isNaN(pageNum) && pageNum > 0 ? pageNum : 1);
  }, [pageParam]);

  useEffect(() => {
    // Load categories
    const cachedCategories = EnarmUtil.getCategories();
    if (cachedCategories === null) {
      ExamService.loadCategories()
        .then((response) => {
          EnarmUtil.setCategories(JSON.stringify(response.data));
          setCategories(response.data);
        })
        .catch((error) => console.error("Error loading categories", error));
    } else {
      setCategories(JSON.parse(cachedCategories));
    }
  }, []); // Runs once on mount

  useEffect(() => {
    // Load cases data
    setCasesData(null); // Show Preloader
    ExamService.getExams(currentPage)
      .then((response) => {
        setCasesData(response.data.clinical_cases);
        setTotalCases(response.data.total_entries);
      })
      .catch((error) => {
        setCasesData([]);
        setTotalCases(0);
        setLoadingError(true);
        console.error("Error loading exams", error)
        Util.showToast("Error al cargar los casos clínicos.");
      });
  }, [currentPage]);

  // Modified changeCategory to accept newValue directly
  const changeCategory = (caso, index, newValue) => {
    const categoryId = parseInt(newValue, 10);
    const updatedCaso = { ...caso, category_id: categoryId };

    ExamService.saveCaso(updatedCaso)
      .then((response) => {
        Util.showToast("Se actualizo la especialidad");
        setCasesData((prevCasesData) => {
          const newData = [...prevCasesData];
          newData[index] = response.data;
          return newData;
        });
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

  // Moved casosRows definition inside the component so it has access to component scope like casesData
  // This is a structural change that might be needed for the code to be correct after refactor.
  const CasosRowsComponent = () => {
    if (!casesData) return null;

    // Define especialidadesOptions here if it's used by CasosRowsComponent consistently
    // Or pass categories and let CasosRowsComponent compute it.
    // For this diff, assuming especialidadesOptions is computed before CasosRowsComponent is called or passed in.
    const especialidadesOptions = categories.map((esp) => (
      <option key={esp.id} value={esp.id}>
        {esp.name}
      </option>
    ));

    return casesData.map((caso, idx) => (
      <CustomCollectionItem key={caso.id}>
        <CustomRow>
          <CustomCol m={4} s={12}>
            <CustomSelect
              label="Especialidad"
              value={caso.category_id?.toString() || "0"}
              onChange={(newValue) => changeCategory(caso, idx, newValue)}
              // id prop could be useful for label association: e.g., `select-especialidad-${caso.id}`
            >
              <option value="0" disabled={ (caso.category_id?.toString() || "0") !== "0" }>Sin Especialidad</option>
              {especialidadesOptions}
            </CustomSelect>
          </CustomCol>
          <CustomCol m={7} s={12}>
            {caso.description}
          </CustomCol>
          <Link to={`/dashboard/edit/caso/${caso.id}`} className="secondary-content">
            <CustomButton
              tooltip="Editar Caso clinico"
              className="btn-flat"
              icon="edit"
              waves="light" // Added default waves for flat button
            />
          </Link>
        </CustomRow>
      </CustomCollectionItem>
    ));
  };

  if (casesData === null && !loadingError) {
    return (<div style={{ textAlign: 'center', marginTop: '20px' }} role="progressbar">
              <CustomPreloader size="big" active />
            </div>);
  }

  if(loadingError){
    return (<CustomCollectionItem className="center-align red-text text-darken-4">
          Error al cargar los casos. Intente de nuevo más tarde.
        </CustomCollectionItem>)
    // Note: This lonely CollectionItem should ideally be wrapped in a CustomCollection
    // for proper styling if it's the only thing rendered.
    // However, preserving original structure for now.
  }

  return (
    <CustomCollection header={`Casos Clinicos (${totalCases})`}>
      <CustomPagination
        activePage={currentPage}
        items={numPages}
        // leftBtn and rightBtn props omitted to use CustomPagination's defaults
        maxButtons={8}
        onSelect={handlePageClick}
        className="white"
      />
      {casesData !== null && !loadingError && casesData.length === 0 && (
        <CustomCollectionItem className="center-align grey-text text-darken-1">
          No se encontraron casos clínicos.
        </CustomCollectionItem>
      )}
      <CasosRowsComponent /> {/* Call the component here */}
      <CustomPagination
        activePage={currentPage}
        items={numPages}
        // leftBtn and rightBtn props omitted to use CustomPagination's defaults
        maxButtons={8}
        onSelect={handlePageClick}
        className="white"
      />
    </CustomCollection>
  );
};

export default CasoTable; // Removed withRouter
