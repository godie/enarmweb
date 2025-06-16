import React, { Component } from "react";
import PropTypes from "prop-types";

class Pregunta extends Component {
  render() {
    let answers = this.props.answers.map((answer, index) => {
      let extraClass = "";
      let checked = this.props.selectedAnswer.id === answer.id;
      let answerIcon = "";
      let description = "";
      if (this.props.showCorrectAnswer) {
        if (answer.is_correct) {
          extraClass = "green";
          if (answer.description !== null && answer.description !== "")
            description = <p>{answer.description}</p>;
        }
        if (checked) {
          if (!answer.is_correct) {
            extraClass = "red";
            answerIcon = (
              <a href="#!" className="secondary-content black-text">
                <i className="material-icons">highlight_off</i>
              </a>
            );
          } else {
            answerIcon = (
              <a href="#!" className="secondary-content black-text">
                <i className="material-icons">check_circle</i>
              </a>
            );
          }
        }
      }

      return (
        <li className={"collection-item " + extraClass} key={index}>
          <label htmlFor={answer.id} className="black-text">
            <input
              type="radio"
              value={this.id}
              name={this.props.description}
              id={answer.id}
              className="with-gap"
              checked={checked}
              onChange={(event) =>
                this.props.handleSelectOption(this.props.index, index, event)
              }
            />
            <span>{answer.text}</span>
            {answerIcon}
            {description}
          </label>
        </li>
      );
    });
    return (
      <div className="col s12 m12 l12">
        <ul className="collection with-header">
          <li className="collection-header">
            <h5>{this.props.description}</h5>
          </li>
          {answers}
        </ul>
      </div>
    );
  }
}

Pregunta.defaultProps = {
  showCorrectAnswer: false,
};

Pregunta.propTypes = {
  answers: PropTypes.array,
  index: PropTypes.number,
  description: PropTypes.string,
  handleSelectOption: PropTypes.func,
  selectedAnswer: PropTypes.object,
  showCorrectAnswer: PropTypes.bool,
};

export default Pregunta;
