import React from "react";

import CustomHead from "../components/general/customHead";

export default class Index extends React.Component {
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
        <CustomHead title="Index" />
        <div
          style={{
            backgroundColor: "black",
            borderRadius: 5,
            color: "white",
            textAlign: "center",
          }}
        >
        </div>
      </div>
    );
  }
}
