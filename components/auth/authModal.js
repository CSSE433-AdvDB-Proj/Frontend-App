/*  ./components/Navbar.jsx     */
import Link from "next/link";
import React from "react";
import css from "styled-jsx/css";

import { UserOutlined } from "@ant-design/icons";

class AuthModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      state: null,
    };
  }
  openModal(state) {
    this.setState({ showModal: true, state });
  }
  hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    if (!this.state.showModal) {
      return null;
    }

    return <div>{this.props.children}</div>;
  }
}

const styles = css``;

export default AuthModal;
