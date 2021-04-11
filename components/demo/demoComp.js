import React from "react";
import { connect } from "react-redux";
import { changeCurNum } from "../../redux/demoReducer";

const mapStateToProps = (state, props) => {
  return {
    demo: state.demoReducer[props.id],
    curNum: state.demoReducer.curNum,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurNum: (newNum, client) => changeCurNum(newNum, client)(dispatch),
    dispatch,
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
    this.props.changeCurNum(e.target.value, this.props.client);
  }

  render() {
    return (
      <div>
        <h3>Demo Component</h3>

        {/* reducer state (on_message) */}
        <p>Current Num: {this.props.curNum.value}</p>

        {/* reducer state (from parent) */}
        <p>{this.props.demo ? this.props.demo : "Dunno"}</p>

        {/* map changes */}
        <input type="number" onChange={(e) => this.onChange(e)} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Demo);
