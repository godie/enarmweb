import React, { useActionState } from "react"; // Added useActionState
import PropTypes from "prop-types";
import { CustomCheckbox, CustomButton, CustomTextInput, CustomTextarea, CustomRow, CustomCol } from "../custom";
import { alertError, alertSuccess } from "../../services/AlertService"; // For user feedback

// Removed onSubmit from props as it will be handled by useActionState
const CasoForm = ({
  onChange,
  caso,
  onChangeAnswer,
  onChangeQuestion,
  addQuestion,
  deleteQuestion,
  addAnswer,
  deleteAnswer,
  onCancel,
  saveCasoAction // This will be the action passed from the parent container
}) => {

  // useActionState will be used in the parent component (CasoContainer)
  // For now, we assume saveCasoAction is the action ready to be used by the form
  // and error/isPending would be passed as props if needed here, or handl sved in parent.
  // This component will now expect `saveCasoAction` which is the `submitAction` from `useActionState`
  // and potentially `error` and `isPending` if they need to affect UI within this form directly.

  // The actual form submission logic (calling service, handling response)
  // will be part of the action function defined in CasoContainer.
  // Here, we just wire the form to it.

  // If error display and pending state for the button are needed *within* this component,
  // they would need to be passed as props from CasoContainer.
  // For this example, let's assume they are passed:
  // error: The error message from useActionState
  // isPending: The pending state from useActionState

  // However, to keep this component simpler and focused on rendering,
  // let's assume error display and button state are managed by the parent
  // or that the parent passes down a consolidated `isSubmitting` prop.
  // For now, we'll just use `saveCasoAction` for the form.

  // The `onSubmit` prop is removed. The form now uses the `action` prop.
  // The parent component (`CasoContainer`) will be responsible for:
  // 1. Defining the actual async action function.
  // 2. Using `useActionState` with that function.
  // 3. Passing the `submitAction` (returned by `useActionState`) to this component as `saveCasoAction`.
  // 4. Optionally, passing `error` and `isPending` if needed for UI changes within `CasoForm`.

  return (
    <div className="col s12 m12 l12">
      {/* The form now uses the `action` prop with `saveCasoAction` */}
      {/* FormData will be automatically collected. Ensure input fields have `name` attributes. */}
      <form className="" action={saveCasoAction}>
        <h3 className="center">Caso Clinico</h3>

        <CustomRow>
          <CustomCol s={12}>
            <CustomTextarea
              id="description"
              label="Caso clinico"
              value={caso.description} // Still controlled by parent state for dynamic changes
              onChange={onChange} // onChange still needed for parent to update its state
              name="description" // Crucial for FormData
              textareaClassName="z-depth-1"
            />
          </CustomCol>
        </CustomRow>
        <CustomRow>
          <CustomCol s={12}>
            <h4 className="center">Preguntas:</h4>
          </CustomCol>
          <CustomCol s={12}>
            <CustomButton
              onClick={addQuestion} // These buttons do not submit the form
              type="button"
              className=""
              large
              icon="add"
              iconPosition="right"
              waves="light"
            >
              Agregar Pregunta
            </CustomButton>
          </CustomCol>
          {/* processQuestions needs to be aware of `name` attributes if its inputs are part of the form submission */}
          {/* For complex nested data like questions/answers, it's often better to serialize `caso` state manually in the action */}
          {/* For this refactor, we assume `caso` state is up-to-date in parent, and action will use that. */}
          {/* Inputs within `processQuestions` should ideally get `name` attributes if they are to be submitted via FormData */}
          {/* However, given the dynamic nature, it's more robust if the action in CasoContainer stringifies `caso` object. */}
          {/* Let's add a hidden input to carry the main `caso` data if not relying on FormData for everything. */}
          <input type="hidden" name="casoData" value={JSON.stringify(caso)} />

          {processQuestions(
            caso.questions,
            onChangeAnswer,
            onChangeQuestion,
            deleteQuestion,
            addAnswer,
            deleteAnswer
          )}
        </CustomRow>

        <div className="divider"></div>

        <CustomCol s={12}>
          <CustomRow>
            <CustomCol s={6}>
              <p className="left-align">
                <CustomButton
                  large
                  type="button" // Important: not a submit button
                  waves="light"
                  onClick={onCancel}
                >
                  Cancelar
                </CustomButton>
              </p>
            </CustomCol>
            <CustomCol s={6}>
              <p className="right-align">
                {/* This button will now trigger the form action */}
                <CustomButton large type="submit" waves="light" tooltip="Guardar Caso"
                // isPending prop would be used here if passed down
                // disabled={isPending}
                >
                  {/* {isPending ? "Guardando..." : "Guardar"} */}
                  Guardar
                </CustomButton>
              </p>
            </CustomCol>
          </CustomRow>
        </CustomCol>
      </form>
    </div>
  );
};

// processQuestions remains largely a UI rendering function.
// The `name` attributes for inputs within it become more critical if relying purely on FormData.
// For complex/dynamic structures, sending the state object (`caso`) as JSON is often more straightforward.
let processQuestions = (
  questions,
  onChangeAnswer,
  onChangeQuestion,
  deleteQuestion,
  addAnswer,
  deleteAnswer
) => {
  return questions.map((question, questionIndex) => {
    let answers = question.answers.map((answer, answerIndex) => {
      let keyId = `${questionIndex}-${answerIndex}`;
      let description = answer.description || "";

      const answerTextName = `questions[${questionIndex}][answers][${answerIndex}][text]`;
      const answerIsCorrectName = `questions[${questionIndex}][answers][${answerIndex}][is_correct]`;
      const answerDescriptionName = `questions[${questionIndex}][answers][${answerIndex}][description]`;

      return (
        <CustomRow key={keyId} className="answer-wrapper" style={{ marginBottom: '15px', alignItems: 'center' }}>
          <CustomCol s={7}>
            <CustomTextInput
              id={`answer-text-${keyId}`}
              value={answer.text}
              label={`Respuesta ${answerIndex + 1}`}
              onChange={(event) =>
                onChangeAnswer(questionIndex, answerIndex, "text", event)
              }
              name={answerTextName}
            />
          </CustomCol>
          <CustomCol s={3}>
            <div style={{ marginTop: '20px' }}>
              <CustomCheckbox
                id={`answer-iscorrect-${keyId}`}
                label="¿Correcta?"
                checked={answer.is_correct}
                onChange={(event) => {
                  onChangeAnswer(
                    questionIndex,
                    answerIndex,
                    "is_correct",
                    event
                  );
                }}
                name={answerIsCorrectName}
                value="true"
              />
            </div>
          </CustomCol>
          <CustomCol s={2} className="right-align" style={{ marginTop: '10px' }}>
            <CustomButton
              type="button"
              floating
              small
              className="red"
              waves="light"
              onClick={(event) =>
                deleteAnswer(questionIndex, answerIndex, event)
              }
              icon="delete"
            />
          </CustomCol>

          {answer.is_correct && (
            <CustomCol s={10} offset="s1">
              <CustomTextarea
                id={`answer-description-${keyId}`}
                label="Justificación de la respuesta correcta"
                value={description}
                onChange={(event) =>
                  onChangeAnswer(questionIndex, answerIndex, "description", event)
                }
                name={answerDescriptionName}
                textareaClassName="z-depth-1"
              />
            </CustomCol>
          )}
        </CustomRow>
      );
    });

    const questionTextName = `questions[${questionIndex}][text]`;
    return (
      <CustomCol key={questionIndex} s={12} className="question-block" style={{
        marginBottom: '30px',
        padding: '25px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <CustomRow style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>
          <CustomCol s={10}>
            <h5 style={{ margin: '0', color: '#2e7d32' }}>Pregunta {questionIndex + 1}</h5>
          </CustomCol>
          <CustomCol s={2} className="right-align">
            <CustomButton
              type="button"
              onClick={(event) => deleteQuestion(questionIndex, event)}
              className="red-text btn-flat"
              icon="delete"
              tooltip="Eliminar pregunta"
            />
          </CustomCol>
        </CustomRow>

        <CustomRow>
          <CustomCol s={12}>
            <CustomTextarea
              id={`question-text-${questionIndex}`}
              label="Texto de la pregunta"
              name={questionTextName}
              value={question.text}
              onChange={(event) => onChangeQuestion(questionIndex, event)}
              textareaClassName="z-depth-1"
            />
          </CustomCol>
        </CustomRow>

        <div className="col s12" style={{ paddingLeft: '15px' }}>
          <h6 style={{ fontWeight: 'bold', color: '#666', marginBottom: '15px' }}>Opciones de respuesta:</h6>
          {answers}

          <div className="center-align" style={{ marginTop: '20px' }}>
            <CustomButton
              type="button"
              onClick={(event) => addAnswer(questionIndex, event)}
              className="green lighten-4 green-text text-darken-3"
              icon="add"
              iconPosition="left"
              small
              flat
            >
              Agregar Opción
            </CustomButton>
          </div>
        </div>
      </CustomCol>
    );
  });
};


CasoForm.propTypes = {
  // onSubmit is removed
  saveCasoAction: PropTypes.func.isRequired, // This is the action from useActionState
  onChange: PropTypes.func.isRequired,
  onChangeAnswer: PropTypes.func.isRequired,
  onChangeQuestion: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  caso: PropTypes.object.isRequired,
  addQuestion: PropTypes.func,
  addAnswer: PropTypes.func,
  deleteAnswer: PropTypes.func,
  onCancel: PropTypes.func,
  // error: PropTypes.string, // Optional: if displaying error messages inside form
  // isPending: PropTypes.bool, // Optional: if disabling submit button from inside form
};

export default CasoForm;
