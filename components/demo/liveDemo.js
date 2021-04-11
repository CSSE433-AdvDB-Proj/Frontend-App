import React from "react";
import { connect } from "react-redux";

import { changeReducerContent } from "../../redux/liveDemoReducer";

import css from "styled-jsx/css";

const mapStateToProps = (reducerState, props) => {
  return {
    reducerContent: reducerState.liveDemoReducer.reducerContent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeReducerContent: (newContent) =>
      changeReducerContent(newContent)(dispatch),
  };
};

class LiveDemo extends React.Component {
  constructor(props) {
    super(props);

    this.inputBoxContent = "";
  }

  inputOnChange = (e) => {
    this.inputBoxContent = e.target.value;
    console.log(this.inputBoxContent);
    this.props.changeReducerContent(this.inputBoxContent);
  };

  render() {
    return (
      <div>
        <div className="text">{this.props.content}</div>
        <div className="text">{this.props.reducerContent}</div>
        <input type="text" onChange={(e) => this.inputOnChange(e)} />
        <style jsx>{styles}</style>
      </div>
    );
  }
}

const styles = css`
  .text {
    color: blue;
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(LiveDemo);
