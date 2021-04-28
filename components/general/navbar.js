/*  ./components/Navbar.jsx     */
import Link from "next/link";
import React from "react";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import css from "styled-jsx/css";
import axios from "axios";
import cookieCutter from "cookie-cutter";
import { connect } from "react-redux";

import AuthModal from "../auth/authModal";

const mapStateToProps = (state) => {
  return {
    token: state.authReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const SEARCHFRIEND = "Search Friend";
const ADDUSER = "Add User";

class Navbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.modal = React.createRef();

    this.state = {
      expandProfile: false,
      search: SEARCHFRIEND,
    };
  }

  openModal(state) {
    // this.props.createClient("test");
    // this.props.setToken("12314");
    // console.log("token set");
    this.modal.current.openModal(state);
  }

  toggleSearch() {
    if (this.state.search == SEARCHFRIEND) {
      this.setState({ search: ADDUSER });
    } else {
      this.setState({ search: SEARCHFRIEND });
    }
  }

  async logout() {
    await axios.post(
      "http://localhost:8080/blackboard/account/logout",
      {},
      {
        headers: {
          "Blackboard-Token": this.props.token,
        },
      }
    );
    this.props.setToken(null);
  }

  render() {
    return (
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/demo/demo">Demo</a>
          </li>
          <li>
            <div className="searchLabel" onClick={() => this.toggleSearch()}>
              {this.state.search}
            </div>
          </li>
          <li className="rightli authDropContainer">
            <a className="authDropBtn">
              <UserOutlined />
            </a>
            <div className="authDropContent">
              {this.props.token == null ? (
                [
                  <a key="login" onClick={() => this.openModal("login")}>
                    Login
                  </a>,
                  <a key="register" onClick={() => this.openModal("register")}>
                    Register
                  </a>,
                ]
              ) : (
                <a
                  onClick={() => {
                    this.logout();
                  }}
                >
                  Logout
                </a>
              )}
            </div>
          </li>
          <li className="rightli notiDropContainer">
            <a className="">
              <MessageOutlined />
            </a>
          </li>
        </ul>
        <AuthModal ref={this.modal} setToken={(t) => this.props.setToken(t)} />
        <style jsx>{styles}</style>
      </nav>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

const styles = css`
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
  }

  li {
    float: left;
    display: inline;
  }

  .searchLabel {
    width: 100%;
  }

  li a,
  li .searchLabel,
  .authDropBtn {
    display: inline-block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }

  li a:hover,
  li .searchLabel:hover,
  .authDropContainer:hover .authDropBtn {
    background-color: #111;
  }

  li.authDropContainer {
    display: inline-block;
  }

  .rightli {
    float: right;
  }

  .authDropContent {
    display: none;
    position: absolute;
    background-color: #111;
    min-width: 80px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    right: 0;
    border-radius: 0px 0px 5px 5px;
  }

  .authDropContent a {
    color: white;
    padding: 2px 4px;
    padding-bottom: 4px;
    text-decoration: none;
    display: block;
    text-align: left;
    border-radius: 0px 0px 5px 5px;
  }

  .authDropContent a:hover {
    background-color: #333;
    cursor: pointer;
  }

  .authDropContainer:hover .authDropContent {
    display: block;
  }
`;
