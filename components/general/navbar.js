/*  ./components/Navbar.jsx     */
import Link from "next/link";
import React from "react";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import css from "styled-jsx/css";
import axios from "axios";
import cookieCutter from "cookie-cutter";
import { connect } from "react-redux";

import AuthModal from "../auth/authModal";
import ChatModal from "../chat/chatModal";
import FriendModal from "./friendModal";

import Notifications from "./notifications";

const mapStateToProps = (state) => {
  return {
    token: state.authReducer.token,
    notifications: state.notificationReducer.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  };
};

const SEARCHFRIEND = "Search Friend:";
const ADDUSER = "Add User:";
const SEARCHGROUP = "Search Group:";

class Navbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.authModal = React.createRef();
    this.chatModal = React.createRef();
    this.friendModal = React.createRef();

    this.state = {
      expandProfile: false,
      search: SEARCHFRIEND,
      target: "",
    };

    this.target = "";
  }

  enterPressed(user, forceFriend = false) {
    // console.log(user);
    if (forceFriend || this.state.search == SEARCHFRIEND) {
      this.chatModal.current.openModal(user);

      // axios
      //   .get("http://localhost:8080/blackboard/friend/search_friend", {
      //     params: { likeUsername: user },
      //     headers: {
      //       "Blackboard-Token": this.props.token,
      //     },
      //   })
      //   .then((res) => {
      //     if (res.data.code != 0) {
      //       throw "Error searching friend: " + res.data.msg;
      //     }
      //     if (res.data.data.length == 0) {
      //       alert("Friend not found: " + user);
      //     }

      // this.chatModal.current.openModal(res.data.data[0].username);
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
    } else if (this.state.search == SEARCHGROUP) {
      this.chatModal.current.openModal(user, true);
    } else if (this.state.search == ADDUSER) {
      axios
        .get("http://localhost:8080/blackboard/friend/send", {
          params: { toUsername: user },
          headers: {
            "Blackboard-Token": this.props.token,
          },
        })
        .then((res) => {
          if (res.data.code == 0) {
            alert(`Friend request to ${user} sent.`);
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  openAuthModal(state) {
    this.authModal.current.openModal(state);
  }

  toggleSearch() {
    if (this.state.search == SEARCHFRIEND) {
      this.setState({ search: ADDUSER });
    } else if (this.state.search == ADDUSER) {
      this.setState({ search: SEARCHGROUP });
    } else if (this.state.search == SEARCHGROUP) {
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
    this.props.dispatch({ type: "LOGOUT" });
  }

  render() {
    let displayNotifications =
      this.props.notifications.length != 0 ? "red" : "white";
    return (
      <nav className="container">
        <div className="leftBar">
          {/* Home */}
          <li>
            <a className="navbarItem" href="/">
              Home
            </a>
          </li>

          {/* Demo */}
          <li>
            <div
              className="navbarItem"
              onClick={() => this.friendModal.current.openModal()}
            >
              Friends
            </div>
          </li>
        </div>

        <div className="centerBar">
          {/* Search friend/ add user label */}
          <li className="searchLabelLi">
            <div className="searchLabel" onClick={() => this.toggleSearch()}>
              {this.state.search}
            </div>
          </li>

          {/* Search Input Box */}
          <li className="searchInputLi">
            <div className="searchInputContainer">
              <input
                className="searchInput"
                onChange={(e) => (this.target = e.target.value)}
                onKeyDown={(k) =>
                  k.keyCode == 13 ? this.enterPressed(this.target) : null
                }
              />
            </div>
          </li>
        </div>

        <div className="rightBar">
          {/* Notification Icon */}
          <li className="notiDropContainer">
            <a className="notiDropBtn">
              <MessageOutlined style={{ color: displayNotifications }} />
            </a>
            <div className="notiDropContent">
              <Notifications
                openChat={(user) => this.enterPressed(user, true)}
              />
            </div>
          </li>

          {/* Profile Icon */}
          <li className="authDropContainer">
            <a className="authDropBtn">
              <UserOutlined />
            </a>
            <div className="authDropContent">
              {this.props.token == null
                ? [
                    <a key="login" onClick={() => this.openAuthModal("login")}>
                      Login
                    </a>,
                    <a
                      key="register"
                      onClick={() => this.openAuthModal("register")}
                    >
                      Register
                    </a>,
                  ]
                : [
                    <a
                      key="account"
                      onClick={() => this.openAuthModal("account")}
                    >
                      Account
                    </a>,
                    <a
                      key="password"
                      onClick={() => this.openAuthModal("password")}
                    >
                      Security
                    </a>,
                    <a key="logout" onClick={() => this.logout()}>
                      Logout
                    </a>,
                  ]}
            </div>
          </li>
        </div>
        <AuthModal
          ref={this.authModal}
          setToken={(t, d) => this.props.setToken(t, d)}
        />
        <ChatModal ref={this.chatModal} send={(m, p) => this.props.send(m, p)} />
        <FriendModal
          ref={this.friendModal}
          token={this.props.token}
          openChat={(user) => this.enterPressed(user, true)}
        />
        <style jsx>{styles}</style>
      </nav>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

const styles = css`
  .container {
    flex-direction: row;
    /* width: 100%; */
    justify-content: space-between;
    text-align: center;
    background-color: #333;
  }

  .leftBar,
  .centerBar,
  .rightBar {
    height: 100%;
    /* list-style-type: none; */
    margin: 0;
    padding: 0;
    /* overflow: hidden; */
    display: inline-block;
    /* display: flex; */
    /* justify-content: center !important; */
    /* text-align: center; */
    /* text-align: center;
    justify-content: space-between; */
  }

  .leftBar {
    float: left;
  }

  .rightBar {
    float: right;
  }

  li {
    display: inline;
    align-items: center;
  }

  .stretch {
    flex: 1;
  }

  .searchInputLi {
    display: inline;
    align-items: center;
    /* background-color: green; */
    float: none;
    /* align-self: center !important; */
  }

  .searchInputLi div {
    display: inline-block;
    color: white;
  }

  .navbarItem,
  .searchLabel,
  .authDropBtn,
  .notiDropBtn {
    display: inline-block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }

  li .searchInputContainer {
    flex-direction: row;
    display: inline-block;
    padding: 14px 16px;
    /* background-color: green; */
  }

  .searchInputContainer .searchText {
    color: black !important;
    text-align: center;
  }

  .searchLabel:hover,
  .authDropContainer:hover .authDropBtn,
  .notiDropContainer:hover .notiDropBtn {
    background-color: #111;
  }

  .navbarItem:hover {
    background-color: #111 !important;
  }

  li.authDropContainer,
  li.notiDropContainer {
    display: inline-block;
  }

  .rightli {
    /* float: right; */
  }

  .authDropContent,
  .notiDropContent {
    display: none;
    position: absolute;
    background-color: #111;
    min-width: 100px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    right: 0;
    border-radius: 0px 0px 5px 5px;
  }

  .authDropContent a,
  .notiDropContent a {
    color: white;
    padding: 2px 4px;
    padding-bottom: 4px;
    text-decoration: none;
    display: block;
    text-align: left;
    border-radius: 0px 0px 5px 5px;
  }

  div li:hover,
  li a:hover {
    background-color: #333;
    cursor: pointer;
  }

  .authDropContainer:hover .authDropContent,
  .notiDropContainer:hover .notiDropContent {
    display: block;
  }
`;
