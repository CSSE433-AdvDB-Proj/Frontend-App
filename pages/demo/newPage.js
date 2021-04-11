import React from "react";

import LiveDemo from "../../components/demo/liveDemo";

import css from "styled-jsx/css";

class NewPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <LiveDemo content="Hello World" />;
  }
}

export default NewPage;
