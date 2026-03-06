import { useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomButton, CustomCard, CustomTextInput, CustomTextarea } from "../../components/custom";
import { alertError, alertSuccess } from "../../services/AlertService";
import UserFlashcardDraftService from "../../services/UserFlashcardDraftService";

export default function FlashcardCreate() {
  const history = useHistory();
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const question = form.question.trim();
    const answer = form.answer.trim();

    if (!question || !answer) {
      alertError("Flashcards", "La pregunta y la respuesta son obligatorias.");
      return;
    }

    UserFlashcardDraftService.create({
      question,
      answer,
      category: form.category.trim()
    });

    await alertSuccess("Flashcards", "Flashcard creada. Ya aparece en tu repaso.");
    history.push("/flashcards");
  };

  return (
    <div className="section">
      <div className="container">
        <CustomCard title="Crear Flashcard" icon="note_add">
          <p className="grey-text text-darken-1">
            Crea una flashcard personalizada para practicarla en tu flujo de repaso.
          </p>
          <form onSubmit={handleSubmit}>
            <CustomTextInput
              id="flashcard-question"
              name="question"
              label="Pregunta"
              value={form.question}
              onChange={handleChange}
              required
              maxLength={200}
            />

            <CustomTextarea
              id="flashcard-answer"
              name="answer"
              label="Respuesta"
              value={form.answer}
              onChange={handleChange}
              textareaClassName="z-depth-1 mt-2"
              maxLength={1000}
            />

            <CustomTextInput
              id="flashcard-category"
              name="category"
              label="Categoría (opcional)"
              value={form.category}
              onChange={handleChange}
              maxLength={80}
            />

            <div className="right-align" style={{ marginTop: "1rem" }}>
              <CustomButton flat className="green-text" onClick={() => history.push("/flashcards")}>
                Cancelar
              </CustomButton>
              <CustomButton type="submit" className="green" style={{ marginLeft: "0.5rem" }}>
                Guardar Flashcard
              </CustomButton>
            </div>
          </form>
        </CustomCard>
      </div>
    </div>
  );
}
