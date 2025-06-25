import React from "react";
import PropTypes from "prop-types";
// All react-materialize imports will be removed
import { CustomCheckbox, CustomButton, CustomTextInput, CustomTextarea, CustomRow, CustomCol } from "../custom";

const CasoForm = ({
  onSubmit,
  onChange,
  caso,
  onChangeAnswer,
  onChangeQuestion,
  addQuestion,
  deleteQuestion,
  addAnswer,
  deleteAnswer,
  onCancel,
}) => (
  <div className="col s12 m12 l12 white">
    <form className="col s12" onSubmit={onSubmit}>
      <h3 className="center">Caso Clinico</h3>

      <CustomRow>
        <CustomCol s={10} offset="s1">
          <CustomTextarea
            id="description"
            label="Caso clinico"
            value={caso.description}
            onChange={onChange}
            name="description" // Pass name for onChange handler in parent
            textareaClassName="z-depth-1"
            // s={10} and offset="s1" are handled by the wrapping CustomCol
          />
        </CustomCol>
      </CustomRow>
      <CustomRow>
        <CustomRow> {/* This inner Row might be redundant if CustomCol handles margins correctly, but preserving structure for now */}
          <CustomCol s={8}>
            <h4 className="center">Preguntas:</h4>
          </CustomCol>
          <CustomCol s={4}>
            <CustomButton
              onClick={addQuestion}
              type="button"
              className="black" // Will be merged with btn classes
              large
              icon="add" // CustomButton handles icon string
              iconPosition="left" // Default is left, but explicit
            >
              Agregar Pregunta
            </CustomButton>
          </CustomCol>
        </CustomRow>
        {proccessQuestions( // This function also needs internal Row/Col/Button/Icon replaced
          caso.questions,
          onChangeAnswer,
          onChangeQuestion,
          deleteQuestion,
          addAnswer,
          deleteAnswer
        )}
      </CustomRow>


      <div className="divider"></div>

      <CustomRow>
        <CustomCol s={12}>
          <CustomRow> {/* Inner row for button alignment */}
            <CustomCol s={6}>
              <p className="left-align">
                <CustomButton
                  large
                  type="button"
                  waves="light"
                  onClick={onCancel}
                >
                  Cancelar
                </CustomButton>
              </p>
            </CustomCol>
            <CustomCol s={6}>
              <p className="right-align">
                <CustomButton large type="submit" waves="light" tooltip="Guardar Caso">
                  Guardar
                </CustomButton>
              </p>
            </CustomCol>
          </CustomRow>
        </CustomCol>
      </CustomRow>
    </form>
  </div>
);
//TODO Refactor.. v2
let proccessQuestions = (
  questions,
  onChangeAnswer,
  onChangeQuestion,
  deleteQuestion,
  addAnswer,
  deleteAnswer
) => {
  let theQuestions = questions.map((question, questionIndex) => {
    //const last = question.answers.length;
    let answers = question.answers.map((answer, answerIndex) => {
      let keyName =
        "questions[" + questionIndex + "][answers][" + answerIndex + "]";

      let keyId = questionIndex + "-" + answerIndex;
      let description = answer.description;
      if (description === null) {
        description = "";
      }
      const showOrHide = (answer.is_correct && description && description.length > 0 ? "show" : "hide");
      return (
        <CustomRow key={keyId}>
          <CustomCol s={10} offset="s1">
            <CustomRow> {/* Inner Row for layout */}
              <CustomCol s={8}>
                <CustomTextInput
                  id={"answer-" + keyId}
                  value={answer.text}
                  label="" // No label needed as per original
                  onChange={(event) =>
                    onChangeAnswer(questionIndex, answerIndex, "text", event)
                  }
                  // s={8} handled by wrapping CustomCol
                />
              </CustomCol>
              <CustomCol s={2}>
                <CustomCheckbox
                  id={keyName + "[is_correct]"}
                  label="¿correcta?"
                  checked={answer.is_correct}
                  onChange={(event) => {
                    onChangeAnswer(
                      questionIndex,
                      answerIndex,
                      "is_correct",
                      event
                    );
                  }}
                  value="is_correct" // HTML value attribute
                />
              </CustomCol>
              <CustomCol s={1} offset="s1" className="input-field"> {/* input-field might be redundant if button is only content */}
                <CustomButton
                  type="button"
                  floating
                  className="red" // Will be merged
                  waves="light"
                  tooltip="Borrar respuesta"
                  aria-label="Borrar respuesta"
                  onClick={(event) =>
                    deleteAnswer(questionIndex, answerIndex, event)
                  }
                  icon="delete"
                />
              </CustomCol>
            </CustomRow>
          </CustomCol>
          {/* Replacing raw textarea for answer description */}
          <CustomCol s={8} offset="s1" className={showOrHide}>
            {/* CustomTextarea handles the input-field wrapper itself */}
            <CustomTextarea
              className={showOrHide}
              id={"answer-description" + keyId}
              label="¿Por que es correcta?"
              value={description}
              onChange={(event) =>
                onChangeAnswer(questionIndex, answerIndex, "description", event)
              }
              textareaClassName="z-depth-1" // Pass specific class to textarea
              name="description"
            />
          </CustomCol>
        </CustomRow>
      );
    });
    return (
      <CustomRow key={questionIndex}>
        <CustomCol s={8} offset="s1">
          <CustomTextarea
            id={"question-" + questionIndex}
            label={`Pregunta ${questionIndex + 1}`}
            name={"questions[" + questionIndex + "][text]"}
            value={question.text}
            onChange={(event) => onChangeQuestion(questionIndex, event)}
          />
        </CustomCol>
        <CustomCol offset="s1" s={1} className="input-field"> {/* input-field might be redundant */}
          <CustomButton
            type="button"
            onClick={(event) => addAnswer(questionIndex, event)}
            floating
            tooltip="Agregar una respuesta"
            aria-label="Agregar una respuesta"
            icon="playlist_add"
          />
        </CustomCol>
        <CustomCol s={1} className="input-field">  {/* input-field might be redundant */}
          <CustomButton
            type="button"
            onClick={(event) => deleteQuestion(questionIndex, event)}
            floating
            className="red darken-1" // Will be merged
            icon="delete"
            tooltip="Borrar Pregunta"
            aria-label="Borrar Pregunta"
          />
        </CustomCol>
        {answers}
      </CustomRow>
    );
  });

  return theQuestions;
};

CasoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeAnswer: PropTypes.func.isRequired,
  onChangeQuestion: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  caso: PropTypes.object.isRequired,
  addQuestion: PropTypes.func,
  addAnswer: PropTypes.func,
  deleteAnswer: PropTypes.func,
  onCancel: PropTypes.func,
};

export default CasoForm;
