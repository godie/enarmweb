// src/components/CasoTable.js
import React from "react";
import { withRouter, Link } from "react-router-dom";
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
  Button
} from "react-materialize";

class CasoTable extends React.Component {
  constructor(props) {
    super(props);
    this.itemsPerPage = 10;
    const pageParam = parseInt(props.match?.params.page, 10);
    this.state = {
      data: null,
      total_cases: 0,
      categories: [],
      page: !isNaN(pageParam) ? pageParam : 1,
    };
    this.nextPage = this.nextPage.bind(this);
  }

  componentDidMount() {
    this.loadData(this.state.page);
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const prevPage = parseInt(prevProps.match?.params.page, 10) || 1;
    const currPage = parseInt(this.props.match?.params.page, 10) || 1;
    if (prevPage !== currPage) {
      this.setState({ page: currPage }, () => this.loadData(currPage));
    }
  }

  loadData(page) {
    this.setState({ data: null }); // muestra Preloader
    ExamService.getExams(page)
      .then((response) => {
        this.setState({
          data: response.data.clinical_cases,
          total_cases: response.data.total_entries,
        });
      })
      .catch((error) => console.error("Error loading exams", error));
  }

  loadCategories() {
    const cached = EnarmUtil.getCategories();
    if (cached === null) {
      ExamService.loadCategories()
        .then((response) => {
          EnarmUtil.setCategories(JSON.stringify(response.data));
          this.setState({ categories: response.data });
        })
        .catch((error) => console.error("Error loading categories", error));
    } else {
      this.setState({ categories: JSON.parse(cached) });
    }
  }

  changeCategory(caso, index, event) {
    const categoryId = parseInt(event.target.value, 10);
    const updatedCaso = { ...caso, category_id: categoryId };
    ExamService.saveCaso(updatedCaso)
      .then((response) => {
        Util.showToast("Se actualizo la especialidad");
        const data = [...this.state.data];
        data[index] = response.data;
        this.setState({ data });
      })
      .catch((error) => {
        console.error("Error updating case", error);
        Util.showToast("No se pudo actualizar la especialidad");
      });
  }

  nextPage(newPage) {
    if(newPage === this.state.page) return
    // ajusta la URL según tu ruta: aquí asume /casos/:page
    this.props.history.push(`/dashboard/casos/${newPage}`);
  }

  render() {
    const { data, total_cases, categories, page } = this.state;

    if (data === null) {
      return <Preloader size="big" />;
    }

    // número total de páginas
    const numPages = Math.ceil(total_cases / this.itemsPerPage);

    // opciones de Select
    const especialidadesOptions = categories.map((esp) => (
      <option key={esp.id} value={esp.id}>
        {esp.name}
      </option>
    ));

    // filas de casos
    const casos = data.map((caso, idx) => (
      <CollectionItem key={caso.id}>
        <Row>
          <Col m={4} s={12}>
            <Select
              s={12}
              label="Especialidad"
              value={caso.category_id?.toString() || "0"}
              onChange={(e) => this.changeCategory(caso, idx, e)}
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

    return (
      <Collection header={`Casos Clinicos (${total_cases})`}>
        <Pagination
          activePage={page}
          items={numPages}
          maxButtons={8}
          onSelect={this.nextPage}
          className="white"
        />
        {casos}
        <Pagination
          activePage={page}
          items={numPages}
          maxButtons={8}
          onSelect={this.nextPage}
          className="white"
        />
      </Collection>
    );
  }
}

export default withRouter(CasoTable);
