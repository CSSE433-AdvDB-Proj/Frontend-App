import React from "react";

import CustomHead from "../components/general/customHead";
import ChatModal from "../components/general/chatModal";

import css from "styled-jsx/css";

import cookieCutter from "cookie-cutter";

import axios from "axios";

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
    let token = this.props.token;
    let user = this.props.user;
    let username = user["username"];

    // console.log(this.props.messages);
    return (
      <div className="container">
        <CustomHead title="Index" />
        <div>
          <p>Token</p>
          <p className="content"> {token} </p>
          <p className="content"> {username} </p>
          <p className="content"> {JSON.stringify(user)} </p>
        </div>

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
