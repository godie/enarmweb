import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomButton, CustomCard, CustomPreloader } from "../../components/custom";
import FlashcardService from "../../services/FlashcardService";
import UserFlashcardDraftService from "../../services/UserFlashcardDraftService";
import { alertError, alertSuccess } from "../../services/AlertService";

const qualityOptions = [
  { value: 0, label: "0 - Olvidada" },
  { value: 1, label: "1 - Muy difícil" },
  { value: 2, label: "2 - Difícil" },
  { value: 3, label: "3 - Regular" },
  { value: 4, label: "4 - Bien" },
  { value: 5, label: "5 - Perfecta" },
];

const extractCard = (dueItem) => dueItem?.flashcard || dueItem;

export default function Flashcards() {
  const history = useHistory();
  const [dueCards, setDueCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  const current = useMemo(() => {
    if (!dueCards.length) return null;
    return extractCard(dueCards[0]);
  }, [dueCards]);

  const loadDueCards = async () => {
    setLoading(true);
    let apiCards = [];
    try {
      const response = await FlashcardService.getDueFlashcards();
      apiCards = Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error loading due flashcards", error);
      alertError("Flashcards", "No se pudieron cargar las flashcards pendientes.");
    }

    const localCards = UserFlashcardDraftService.listDue();
    setDueCards([ ...localCards, ...apiCards ]);
    setLoading(false);
  };

  useEffect(() => {
    loadDueCards();
  }, []);

  const handleReview = async (quality) => {
    if (!current?.id) return;

    try {
      setReviewing(true);
      if (current.source === "local") {
        UserFlashcardDraftService.review(current.id, quality);
      } else {
        await FlashcardService.reviewFlashcard(current.id, quality);
      }

      setDueCards((prev) => prev.slice(1));
      if (dueCards.length <= 1) {
        alertSuccess("Excelente", "Terminaste todas tus flashcards pendientes por hoy.");
      }
    } catch (error) {
      console.error("Error reviewing flashcard", error);
      alertError("Flashcards", "No se pudo guardar la revisión. Intenta de nuevo.");
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="section center enarm-loading-wrapper">
        <CustomPreloader active size="big" color="green" />
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="row valign-wrapper" style={{ marginBottom: "1rem" }}>
          <div className="col s12 m8">
            <h4 style={{ margin: 0 }}>Repaso con Flashcards</h4>
            <p className="grey-text text-darken-1">
              Evalúa tu recuerdo y el sistema programará el siguiente repaso.
            </p>
          </div>
          <div className="col s12 m4 right-align">
            <CustomButton flat className="green-text" onClick={() => history.push("/flashcards/nueva")}>
              Crear flashcard
            </CustomButton>
            <CustomButton flat className="green-text" onClick={() => history.push("/")}>
              Volver al inicio
            </CustomButton>
          </div>
        </div>

        {!current ? (
          <CustomCard title="Sin pendientes por ahora" icon="check_circle">
            <p className="grey-text text-darken-1">
              No tienes flashcards vencidas. Regresa más tarde para continuar tu repetición espaciada.
            </p>
            <CustomButton className="green" onClick={loadDueCards}>
              Actualizar
            </CustomButton>
            <CustomButton
              flat
              className="green-text"
              style={{ marginLeft: "0.5rem" }}
              onClick={() => history.push("/flashcards/nueva")}
            >
              Crear flashcard
            </CustomButton>
          </CustomCard>
        ) : (
          <CustomCard title={`Pendientes: ${dueCards.length}`} icon="school">
            <h5 className="green-text text-darken-1">{current.question || current.front || "Pregunta"}</h5>
            {current.source === "local" && (
              <p className="amber-text text-darken-3" style={{ marginBottom: "0.5rem" }}>
                Flashcard personalizada
              </p>
            )}
            <p style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>
              {current.answer || current.back || "Sin respuesta disponible"}
            </p>

            <div className="row" style={{ marginTop: "1rem" }}>
              {qualityOptions.map((option) => (
                <div key={option.value} className="col s12 m6 l4" style={{ marginBottom: "0.75rem" }}>
                  <CustomButton
                    className="green lighten-1"
                    disabled={reviewing}
                    onClick={() => handleReview(option.value)}
                    style={{ width: "100%" }}
                  >
                    {option.label}
                  </CustomButton>
                </div>
              ))}
            </div>
          </CustomCard>
        )}
      </div>
    </div>
  );
}
