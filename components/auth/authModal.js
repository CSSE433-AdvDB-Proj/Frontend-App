/*  ./components/Navbar.jsx     */
import Link from "next/link";
import React from "react";
import css from "styled-jsx/css";
import axios from "axios";
import { CloseCircleOutlined } from "@ant-design/icons";

import Register from "./register";
import Login from "./login";

class AuthModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      closeButtonColor: "black",
      state: null,
    };
  }
  openModal(state) {
    this.setState({ showModal: true, state });
  }
  hideModal() {
    this.setState({ showModal: false, closeButtonColor: "black" });
  }

  render() {
    if (!this.state.showModal) {
      return null;
    }

    let content;

    switch (this.state.state) {
      case "register":
        content = (
          <Register
            setToken={(t, d) => this.props.setToken(t, d)}
            hideModal={() => this.hideModal()}
          />
        );
        break;
      case "login":
        content = (
          <Login
            setToken={(t, d) => this.props.setToken(t, d)}
            hideModal={() => this.hideModal()}
          />
        );
        break;
      default:
        content = null;
    }

    return (
      <div>
        <div className="modalOverlay">
          <div className="modal">
            <div className="modalHeader">
              <div
                className="closeButton"
                onClick={() => this.hideModal()}
                onMouseEnter={() => this.setState({ closeButtonColor: "red" })}
                onMouseLeave={() =>
                  this.setState({ closeButtonColor: "black" })
                }
              >
                <CloseCircleOutlined
                  style={{ color: this.state.closeButtonColor }}
                />
              </div>
            </div>
            <div className="modalBody">{content}</div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }
}

const styles = css`
  .modalBody {
    padding-top: 10px;
    text-align: center;
  }
  .modalHeader {
    display: flex;
    justify-content: flex-end;
    font-size: 25px;
  }
  .modal {
    /* background: white; */
    width: 500px;
    height: 600px;
    border-radius: 15px;
    padding: 15px;
    background-color: #333;
  }
  .modalOverlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .closeButton:hover {
    cursor: pointer;
  }
`;

export default AuthModal;
