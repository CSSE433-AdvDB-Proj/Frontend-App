import React from "react";
import { connect } from "react-redux";
import { changeCurNum } from "../../redux/demoReducer";

import { w3cwebsocket as W3CWebSocket } from "websocket";

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

  componentDidMount() {
    this.props.client.onmessage = (message) => {
      console.log("Websocket: Received Message");
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.type == "DEMO_SET_CURNUM") {
        this.props.changeCurNum(dataFromServer.newNum);
      }
    };
  }

  onChange(e) {
    this.props.changeCurNum(e.target.value, client);
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
