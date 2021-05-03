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

class Account extends React.PureComponent {
  constructor(props) {
    super(props);

    this.userData = (({ nickname, lastName }) => {
      return { nickname, lastName };
    })(this.props.user);

    this.state = {
      error: false,
    };
  }

  async submitButton() {
    console.log(this.userData);
    try {
      const res = await axios.post(
        "http://localhost:8080/blackboard/account/update",
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

      this.props.updateAccount(this.userData);

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
        <h1>Account</h1>

        {/* username */}
        {/* <div className="inputContainer">
          <label className="label" htmlFor="username">
            Username{" "}
          </label>
          <input
            className="input"
            id="username"
            type="text"
            // placeholder="Username"
            defaultValue={this.userData.username}
            onChange={(e) => {
              this.userData.username = e.target.value;
            }}
          />
        </div> */}

        {/* nickname */}
        <div className="inputContainer">
          <label className="label" htmlFor="nickname">
            Nickname{" "}
          </label>
          <input
            className="input"
            id="nickname"
            type="text"
            // placeholder="Nickname"
            defaultValue={this.userData.nickname}
            onChange={(e) => {
              this.userData.nickname = e.target.value;
            }}
          />
        </div>

        {/* lastName */}
        <div className="inputContainer">
          <label className="label" htmlFor="lastName">
            Last Name{" "}
          </label>
          <input
            className="input"
            id="lastName"
            type="text"
            // placeholder="Last Name"
            defaultValue={this.userData.lastName}
            onChange={(e) => {
              this.userData.lastName = e.target.value;
            }}
          />
        </div>

        {/* password
        <div className="inputContainer">
          <label className="label" htmlFor="password">
            Password{" "}
          </label>
          <input
            className="input"
            id="password"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              this.userData.password = e.target.value;
            }}
            required
          />
        </div> */}

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

export default connect(mapStateToProps, mapDispatchToProps)(Account);
