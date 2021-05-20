import React, { useState } from "react";

import CustomHead from "../components/general/customHead";
import ChatModal from "../components/general/chatModal";

import css from "styled-jsx/css";

import Board from "../components/draw/board";

import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    token: state.authReducer.token,
    user: state.authReducer.user,
    messages: state.messageReducer.messages,
    notifications: state.notificationReducer.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

class Draw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardID: "",
    };

    this.board = React.createRef();
    this.destination = "";
  }

  componentDidMount() {
    this.setState({ boardID: this.props.query["boardID"] });
  }

  connect() {
    console.log("called");
    // console.log(this.props.getClient());
    // this.props
    //   .getClient()
    //   .subscribe(`/toBoard/${this.state.boardID}`, (hook) => {});
  }

  static getInitialProps({ query }) {
    return { query };
  }

  render() {
    let connected = "Connected to Board: " + this.state.boardID;
    if (this.props.getClient() == null) {
      return <div>Loading...</div>;
    }

    // console.log(this.props.messages);
    return (
      <div className="container">
        <CustomHead title="Index" />
        <h1>{connected}</h1>
        {/* <button onClick={() => this.connect()}>Connect</button> */}
        <Board
          getClient={() => {
            return this.props.getClient();
          }}
          boardID={this.state.boardID}
          username={this.props.user.username}
          token={this.props.token}
        />
        <style jsx>{styles}</style>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Draw);

const styles = css`
  .container {
    color: black;
    text-align: center;
    align-items: center;
    align-self: center;
    margin: 10px auto;
    width: 100%;
  }

  .content {
    word-wrap: break-word;
  }
`;
