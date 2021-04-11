import React from "react";

import DemoComp from "../../components/demo/demoComp";
import TestChat from "../../components/demo/testChat";
import CustomHead from "../../components/general/customHead";

import css from "styled-jsx/css";

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      hello: "world",
    };
  }

  render() {
    return (
      <div>
        <CustomHead title="Demo page" />
        <div className="container">
          {/* header */}
          <h1>Demo Test</h1>

          {/* component state */}
          <p>States: {this.state.clicks}</p>
          <button
            onClick={() => this.setState({ clicks: this.state.clicks + 1 })}
          >
            Click me
          </button>

          {/* sub component */}
          <DemoComp id={this.state.clicks} client={this.props.client} />
          <TestChat client={this.props.client} />
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }
}

const styles = css`
  .container {
    border-radius: 5px;
    color: black;
    text-align: center;
    align-items: center;
  }
`;
