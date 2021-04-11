import React from "react";

import DemoComp from "../../components/demo/demo";
import CustomHead from "../../components/general/customHead";

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
      <div>
        <CustomHead title="Demo page" />
        <div
          style={{
            // backgroundColor: "black",
            borderRadius: 5,
            color: "black",
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
          <DemoComp id={this.state.clicks} client={this.props.client} />
        </div>
      </div>
    );
  }
}
