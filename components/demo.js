import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state, props) => {
  return {
    demo: state.demo[props.id],
  };
};

const mapDispatchToProps = (dispatch) => ({});

class Demo extends React.Component {
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
          color: "white",
          textAlign: "center",
        }}
      >
        <h3>Demo Component</h3>

        <p>{this.props.demo ? this.props.demo : "Dunno"}</p>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Demo);
