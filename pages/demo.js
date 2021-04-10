import React from "react";
import { connect } from "react-redux";
import { useSelector, shallowEqual } from "react-redux";

import DemoComp from "../components/demo";

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      secretClicks: 2,
    };
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: "black",
          borderRadius: 5,
          color: "white",
          textAlign: "center",
        }}
      >
        <h1>Demo Test</h1>
        <p>States: {this.state.clicks}</p>
        <button
          onClick={() => this.setState({ clicks: this.state.clicks + 1 })}
        >
          Click me
        </button>
        <DemoComp id={this.state.clicks} />
      </div>
    );
  }
}
