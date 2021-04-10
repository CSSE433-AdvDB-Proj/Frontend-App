import React from "react";

import Socket from "../../components/socket/socket";
import DemoComp from "../../components/demo/demo";

export default class Demo extends Socket {
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
        <DemoComp id={this.state.clicks} client={this.client} />
      </div>
    );
  }
}
