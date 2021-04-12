/*  ./components/Navbar.jsx     */
import Link from "next/link";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import css from "styled-jsx/css";

import AuthModal from "../auth/authModal";

class Navbar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.modal = React.createRef();

    this.state = {
      expandProfile: false,
    };
  }

  openModal(state) {
    // this.props.createClient("test");
    this.modal.current.openModal(state);
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
          <li className="rightli dropdown">
            <a className="dropbtn">
              <UserOutlined />
            </a>
            <div className="dropdown-content">
              <a onClick={() => this.openModal("login")}>Login</a>
              <a onClick={() => this.openModal("register")}>Register</a>
            </div>
          </li>
        </ul>
        <AuthModal
          ref={this.modal}
          createClient={(t) => this.props.createClient(t)}
        />
        <style jsx>{styles}</style>
      </nav>
    );
  }
}

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

  li a,
  .dropbtn {
    display: inline-block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }

  li a:hover,
  .dropdown:hover .dropbtn {
    background-color: #111;
  }

  li.dropdown {
    display: inline-block;
  }

  .rightli {
    float: right;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #111;
    min-width: 80px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    right: 0;
    border-radius: 0px 0px 5px 5px;
  }

  .dropdown-content a {
    color: white;
    padding: 2px 4px;
    padding-bottom: 4px;
    text-decoration: none;
    display: block;
    text-align: left;
    border-radius: 0px 0px 5px 5px;
  }

  .dropdown-content a:hover {
    background-color: #333;
    cursor: pointer;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }
`;

export default Navbar;
