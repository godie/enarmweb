import { useEffect, useState, startTransition } from "react";
import { CustomButton, CustomTextInput, CustomTextarea, CustomRow, CustomCol, CustomSelect } from "../custom";
import ExamService from "../../services/ExamService";
import QuestionForm from "./QuestionForm";
import { useCaso } from "../../context/CasoContext";

const CasoForm = () => {

  const {
    onChange,
    caso,
    addQuestion,
    onCancel,
    saveCasoAction,
    isPending,
    isAdmin = false
  } = useCaso();

  const [categories, setCategories] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    startTransition(() => {
      saveCasoAction();
    });
  };

  useEffect(() => {
    ExamService.loadCategories().then(res => {
      setCategories(res.data);
    }).catch(err => console.error("Error loading categories", err));
  }, []);

  return (
    <div className="col s12 m12 l12">
      <form className="" onSubmit={handleSubmit}>
        <h3 className="center">Caso Clínico</h3>
        <CustomCol s={12} m={6}>
          <CustomTextInput
            id="name"
            label="Nombre Identificador del Caso"
            value={caso.name}
            name="name"
            onChange={onChange}
            required
            maxLength={100}
            data-length={100}
          />
        </CustomCol>
        <CustomCol s={12} m={6}>
          <CustomSelect
            id="category_id"
            label="Especialidad / Categoría"
            name="category_id"
            value={caso.category_id}
            onChange={onChange}
            required
          >
            <option value="" disabled>Selecciona Especialidad</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </CustomSelect>
        </CustomCol>
        {isAdmin && (
          <CustomCol s={12} m={12}>
            <CustomSelect
              id="status"
              label="Estado del Caso"
              name="status"
              value={caso.status}
              onChange={onChange}
              required
            >
              <option value="pending">Pendiente de Revisión</option>
              <option value="published">Publicado</option>
              <option value="rejected">Rechazado</option>
            </CustomSelect>
          </CustomCol>
        )}

        <CustomRow>
          <CustomCol s={12}>
            <CustomTextarea
              id="description"
              label="Caso clínico (descripción del caso)"
              value={caso.description}
              onChange={onChange}
              name="description"
              textareaClassName="z-depth-1 mt-3"
              maxLength={2000}
              data-length={2000}
            />
          </CustomCol>
        </CustomRow>
        <CustomRow>
          <CustomCol s={12}>
            <h4 className="center">Preguntas:</h4>
          </CustomCol>
          <CustomCol s={12} className="center">
            <CustomButton
              onClick={addQuestion}
              type="button"
              className=""
              medium
              flat={true}
              icon="add"
              iconPosition="right"
              waves="light"
            >
              Agregar Pregunta
            </CustomButton>
          </CustomCol>

          <input type="hidden" name="casoData" value={JSON.stringify(caso)} />

          {caso.questions.map((question, questionIndex) => (
            <QuestionForm
              key={questionIndex}
              question={question}
              questionIndex={questionIndex}
            />
          ))}

          {caso.questions.length > 0 && (
            <CustomCol s={12} className="mb-4 center">
              <CustomButton
                onClick={addQuestion}
                type="button"
                className=""
                flat={true}
                medium
                icon="add"
                iconPosition="right"
                waves="light"
              >
                Agregar Pregunta
              </CustomButton>
            </CustomCol>
          )}
        </CustomRow>

        <div className="divider"></div>

        <CustomCol s={12}>
          <CustomRow>
            <CustomCol s={6}>
              <p className="left-align">
                <CustomButton
                  flat={true}
                  type="button"
                  waves="light"
                  onClick={onCancel}
                >
                  CANCELAR
                </CustomButton>
              </p>
            </CustomCol>
            <CustomCol s={6}>
              <p className="right-align">
                <CustomButton
                  type="submit"
                  waves="light"
                  tooltip="Guardar Caso"
                  icon="save"
                  iconPosition="right"
                  className="green darken-1"
                  isPending={isPending}
                  isPendingText="GUARDANDO..."
                >
                  GUARDAR CASO CLÍNICO
                </CustomButton>
              </p>
            </CustomCol>
          </CustomRow>
        </CustomCol>
      </form>
    </div>
  );
};

CasoForm.propTypes = {
};

export default CasoForm;
