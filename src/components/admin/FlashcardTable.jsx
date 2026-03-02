import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CustomRow,
  CustomCol,
  CustomTable,
  CustomPreloader,
  CustomSelect,
  CustomTextInput,
  CustomButton
} from "../custom";
import FlashcardService from "../../services/FlashcardService";
import ExamService from "../../services/ExamService";
import { alertError } from "../../services/AlertService";

const FlashcardTable = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    text: "",
    categoryId: ""
  });

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category.name])),
    [categories]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [flashcardsResponse, categoriesResponse] = await Promise.all([
        FlashcardService.getFlashcards(),
        ExamService.loadCategories()
      ]);
      setFlashcards(Array.isArray(flashcardsResponse.data) ? flashcardsResponse.data : []);
      setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
    } catch (error) {
      console.error("Error loading flashcards", error);
      alertError("Flashcards", "No se pudieron cargar las flashcards del sistema.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredFlashcards = useMemo(() => {
    const textFilter = filters.text.trim().toLowerCase();
    return flashcards.filter((flashcard) => {
      const text = `${flashcard.question || ""} ${flashcard.answer || ""}`.toLowerCase();
      const textMatch = !textFilter || text.includes(textFilter);
      const categoryMatch =
        !filters.categoryId || String(flashcard.category_id) === String(filters.categoryId);
      return textMatch && categoryMatch;
    });
  }, [flashcards, filters]);

  if (loading) {
    return (
      <div className="center-align" style={{ padding: "50px" }}>
        <CustomPreloader active color="green" size="big" />
      </div>
    );
  }

  return (
    <div className="flashcard-table-container">
      <CustomRow>
        <CustomCol s={12}>
          <h4 className="grey-text text-darken-3">{`Flashcards del Sistema (${filteredFlashcards.length})`}</h4>
          <div className="right-align" style={{ marginBottom: "1rem" }}>
            <CustomButton
              node="a"
              href="#/dashboard/flashcards/new"
              className="green"
              icon="add"
              iconPosition="right"
            >
              Agregar una nueva flashcard
            </CustomButton>
          </div>
        </CustomCol>
      </CustomRow>

      <CustomRow>
        <CustomCol s={12} m={6}>
          <CustomTextInput
            id="flashcard-search"
            label="Buscar en pregunta/respuesta"
            value={filters.text}
            onChange={(event) => setFilters((prev) => ({ ...prev, text: event.target.value }))}
          />
        </CustomCol>
        <CustomCol s={12} m={6}>
          <CustomSelect
            id="flashcard-filter-category"
            label="Especialidad"
            value={filters.categoryId}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, categoryId: event.target.value }))
            }
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </CustomSelect>
        </CustomCol>
      </CustomRow>

      <CustomRow>
        <CustomCol s={12}>
          <CustomTable className="highlight z-depth-1">
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Respuesta</th>
                <th>Especialidad</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlashcards.length === 0 ? (
                <tr>
                  <td colSpan="3" className="center-align">
                    No se encontraron flashcards con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filteredFlashcards.map((flashcard) => (
                  <tr key={flashcard.id}>
                    <td>{flashcard.question || "Sin pregunta"}</td>
                    <td>{flashcard.answer || "Sin respuesta"}</td>
                    <td>{categoryMap.get(String(flashcard.category_id)) || "Sin especialidad"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </CustomTable>
        </CustomCol>
      </CustomRow>
      <CustomButton
        node="a"
        href="#/dashboard/flashcards/new"
        className="red"
        large
        floating
        fab
        icon="add"
        tooltip={{ text: "Agregar una nueva flashcard", position: "top" }}
        waves="light"
      />
    </div>
  );
};

export default FlashcardTable;
