import React from "react";
import { connect } from "react-redux";

import { wrapper } from "../redux/store";
import { changeCurNum } from "../redux/demoReducer";

const mapStateToProps = (state, props) => {
  return {
    demo: state.demoReducer[props.id],
    curNum: state.demoReducer.curNum,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurNum: (newNum) => changeCurNum(newNum)(dispatch),
  };
};

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      secretClicks: 2,
    };
  }

  onChange(e) {
    console.log("Changed num to: " + e.target.value);
    this.props.changeCurNum(e.target.value);
  }

  render() {
    // console.log(this.props.studentListServer);
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
        }}
      >
        <h3>Demo Component</h3>

        <p>{this.props.demo ? this.props.demo : "Dunno"}</p>
        <p>Current Num: {this.props.curNum.value}</p>
        <input type="number" onChange={(e) => this.onChange(e)} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Demo);
