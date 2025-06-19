// src/components/CasoTable.js
import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ExamService from "../services/ExamService";
import EnarmUtil from "../modules/EnarmUtil";
import Util from "../commons/Util";
import {
  Row,
  Select,
  Preloader,
  Pagination,
  Collection,
  CollectionItem,
  Col,
  Icon,
  Button,
} from "react-materialize";

const ITEMS_PER_PAGE = 10;

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

  const changeCategory = (caso, index, event) => {
    const categoryId = parseInt(event.target.value, 10);
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

  const especialidadesOptions = categories.map((esp) => (
    <option key={esp.id} value={esp.id}>
      {esp.name}
    </option>
  ));

  const casosRows = casesData?.map((caso, idx) => (
    <CollectionItem key={caso.id}>
      <Row>
        <Col m={4} s={12}>
          <Select
            s={12}
            label="Especialidad"
            value={caso.category_id?.toString() || "0"}
            onChange={(e) => changeCategory(caso, idx, e)}
            // Ensure Materialize Select is re-initialized if necessary, or value prop is enough
          >
            <option value="0">Sin Especialidad</option>
            {especialidadesOptions}
          </Select>
        </Col>
        <Col m={7} s={12}>
          {caso.description}
        </Col>
        <Link to={`/dashboard/edit/caso/${caso.id}`} className="secondary-content">
          <Button
            tooltip="Editar Caso clinico"
            className="btn-flat"
            icon={<Icon>edit</Icon>}
          />
        </Link>
      </Row>
    </CollectionItem>
  ));

  if (casesData === null && !loadingError) {
    return <div role="progressbar"><Preloader size="big" /></div>;
  }

  if(loadingError){
    return (<CollectionItem className="center-align red-text text-darken-4">
          Error al cargar los casos. Intente de nuevo más tarde.
        </CollectionItem>)
  }

  return (
    <Collection header={`Casos Clinicos (${totalCases})`}>
      <Pagination
        activePage={currentPage}
        items={numPages}
        leftBtn={<Icon>chevron_left</Icon>}
        rightBtn={<Icon>chevron_right</Icon>}
        maxButtons={8}
        onSelect={handlePageClick}
        className="white" // Added white class as in original
      />
      {casesData !== null && !loadingError && casesData.length === 0 && ( // Show "No data" message if loaded, no error, and empty
        <CollectionItem className="center-align grey-text text-darken-1">
          No se encontraron casos clínicos.
        </CollectionItem>
      )}
      {casosRows}
      <Pagination
        activePage={currentPage}
        items={numPages}
        leftBtn={<Icon>chevron_left</Icon>}
        rightBtn={<Icon>chevron_right</Icon>}
        maxButtons={8}
        onSelect={handlePageClick}
        className="white" // Added white class as in original
      />
    </Collection>
  );
};

export default CasoTable; // Removed withRouter
