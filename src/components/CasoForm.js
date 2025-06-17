import React from "react";
import PropTypes from "prop-types";
import {
  TextInput,
  Checkbox,
  Button,
  Icon,
  Row,
  Col,
  Textarea,
} from "react-materialize";

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

      <Row>
        <div className="input-field col s10 offset-s1">
          <Textarea
            s={10}
            onChange={onChange}
            offset={1}
            className="z-depth-1"
            name="description"
            id="description"
            value={caso.description}
          />
          <label>Caso clinico</label>
        </div>
      </Row>
      <Row>
        <Row>
          <Col s={8}>
            <h4 className="center">Preguntas:</h4>
          </Col>
          <Col s={4}>
            <Button
              onClick={addQuestion}
              type="button"
              className="black"
              large
              icon={<Icon left={true}>add</Icon>}
            >
              Agregar Pregunta
            </Button>
          </Col>
        </Row>
        {proccessQuestions(
          caso.questions,
          onChangeAnswer,
          onChangeQuestion,
          deleteQuestion,
          addAnswer,
          deleteAnswer
        )}
      </Row>

      <div className="divider"></div>

      <Row>
        <Col s={12}>
          <Col s={6}>
            <p className="left-align">
              <Button
                large
                label="Cancelar"
                type="button"
                waves="light"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </p>
          </Col>
          <Col s={6}>
            <p className="right-align">
              <Button large label="Guardar" type="submit" waves="light" tooltip="Guardar Caso">
                Guardar
              </Button>
            </p>
          </Col>
        </Col>
      </Row>
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

      return (
        <div className="row" key={keyId}>
          <div className="col s10 offset-s1">
            <TextInput
              id={"answer-" + keyId}
              value={answer.text}
              label=""
              s={8}
              onChange={(event) =>
                onChangeAnswer(questionIndex, answerIndex, "text", event)
              }
            />
            <div className="col s2">
              <Checkbox
                name="is_correct"
                className=""
                id={keyName + "[is_correct]"}
                value="is_correct"
                checked={answer.is_correct}
                label="¿correcta?"
                onChange={(event) => {
                  onChangeAnswer(
                    questionIndex,
                    answerIndex,
                    "is_correct",
                    event
                  );
                }}
              />
            </div>
            <div className="col s1 offset-s1 input-field">
              <Button
                type="button"
                floating
                className="red"
                waves="light"
                tooltip="Borrar respuesta"
                onClick={(event) =>
                  deleteAnswer(questionIndex, answerIndex, event)
                }
                icon={<Icon>delete</Icon>}
              />
            </div>
          </div>
          <div
            className={
              "input-field col s8 offset-s1 " +
              (answer.is_correct ? "show" : "hide")
            }
          >
            <textarea
              onChange={(event) =>
                onChangeAnswer(questionIndex, answerIndex, "description", event)
              }
              className="materialize-textarea z-depth-1"
              name="description"
              id={"answer-description" + keyId}
              value={description}
            />
            <label>¿Por que es correcta?</label>
          </div>
        </div>
      );
    });
    return (
      <div className="row" key={questionIndex}>
        <div className="input-field col s8 offset-s1">
          <textarea
            className="materialize-textarea"
            id={"question-" + questionIndex}
            name={"questions[" + questionIndex + "][text]"}
            value={question.text}
            onChange={(event) => onChangeQuestion(questionIndex, event)}
          ></textarea>
          <label>Pregunta {questionIndex + 1}</label>
        </div>
        <div className="input-field col offset-s1 s1">
          <Button
            type="button"
            onClick={(event) => addAnswer(questionIndex, event)}
            floating
            tooltip="Agregar una respuesta"
            
            icon={<Icon>playlist_add</Icon>}
          ></Button>
        </div>
        <div className="input-field col s1">
          <Button
            type="button"
            onClick={(event) => deleteQuestion(questionIndex, event)}
            floating
            className="red darken-1"
            icon={<Icon>delete</Icon>}
            tooltip="Borrar Pregunta"
          ></Button>
        </div>
        {answers}
      </div>
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
