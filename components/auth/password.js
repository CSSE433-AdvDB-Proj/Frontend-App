import React from "react";
import axios from "axios";

import styles from "./authFormStyles";
import { connect } from "react-redux";

import { updateAccount } from "../../redux/authReducer";

const mapStateToProps = (state, props) => {
  return {
    user: state.authReducer.user,
    token: state.authReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAccount: (data) => updateAccount(data)(dispatch),
  };
};

class Password extends React.PureComponent {
  constructor(props) {
    super(props);

    this.userData = {
      password: "",
      username: this.props.user.username,
      newPassword: null,
    };
    this.state = {
      error: false,
    };
  }

  async submitButton() {
    if (this.userData.newPassword == null || this.userData.newPassword == "") {
      this.setState({ error: "Empty new password." });
      return;
    }
    console.log(this.userData);
    try {
      const res = await axios.post(
        "http://localhost:8080/blackboard/account/change_password",
        this.userData,
        {
          headers: {
            "Blackboard-Token": this.props.token,
          },
        }
      );

      if (res.data.code != 0) {
        throw `Error Code: ${res.data.code}, \n${res.data.msg}`;
      }

      this.setState({ error: false });
      this.props.hideModal();
    } catch (err) {
      console.log(err);
      this.setState({ error: err });
    }
  }

  render() {
    return (
      <div className="container">
        {/* <div>{JSON.stringify(this.props.user)}</div> */}
        <h1>Security</h1>

        {/* password */}
        <div className="inputContainer">
          <label className="label" htmlFor="password">
            Password{" "}
          </label>
          <input
            className="input"
            id="password"
            type="password"
            onChange={(e) => {
              this.userData.password = e.target.value;
            }}
            required
          />
        </div>

        {/* new password */}
        <div className="inputContainer">
          <label className="label" htmlFor="newpassword">
            New Password{" "}
          </label>
          <input
            className="input"
            id="newpassword"
            type="password"
            onChange={(e) => {
              this.userData.newPassword = e.target.value;
            }}
            required
          />
        </div>
        <div className="doneButton">
          <button onClick={() => this.submitButton()}>Update</button>
        </div>
        {this.state.error ? (
          <div className="error">{this.state.error}</div>
        ) : null}
        <style jsx>{styles}</style>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Password);
