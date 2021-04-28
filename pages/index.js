import React from "react";

import CustomHead from "../components/general/customHead";
import ChatModal from "../components/general/chatModal";

import css from "styled-jsx/css";

import cookieCutter from "cookie-cutter";

import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    token: state.authReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      secretClicks: 2,
      showToken: false,
    };

    this.modal = React.createRef();
    this.destination = "";
  }

  componentDidMount() {
    this.setState({ showToken: true });
  }

  render() {
    return (
      <div className="container">
        <CustomHead title="Index" />
        {this.state.showToken ? (
          <div>
            <p>Token</p>
            <p className="content"> {this.props.token} </p>
          </div>
        ) : null}
        Destination{" "}
        <input onChange={(e) => (this.destination = e.target.value)} />
        <button onClick={() => this.modal.current.openModal(this.destination)}>
          Start chat
        </button>
        <ChatModal ref={this.modal} />
        <style jsx>{styles}</style>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index);

const styles = css`
  .container {
    color: black;
    text-align: center;
    align-items: center;
    align-self: center;
    margin: 10px auto;
    width: 90%;
  }

  .content {
    word-wrap: break-word;
  }
`;
