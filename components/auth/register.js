import React from "react";
import axios from "axios";

import styles from "./authFormStyles";

export default class Register extends React.PureComponent {
  constructor(props) {
    super(props);

    this.userData = {
      nickname: "",
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    };

    this.state = {
      error: false,
    };
  }

  async submitButton() {
    // console.log(this.userData);
    try {
      const registerRes = await axios.post(
        "http://localhost:8080/blackboard/sys/register",
        this.userData
      );

      if (registerRes.data.code != 0) {
        throw `Error Code: ${registerRes.data.code}, \n${registerRes.data.msg}`;
      }

      const loginRes = await axios.post(
        "http://localhost:8080/blackboard/sys/login",
        this.userData
      );

      // console.log(loginRes.headers["blackboard-token"]);
      // console.log(loginRes.data.data);
      this.props.setToken(loginRes.headers["blackboard-token"], loginRes.data.data);
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
        <h1>Register</h1>

        {/* name */}
        <div className="inputContainer">
          <label className="label" htmlFor="name">
            Nickname{" "}
          </label>
          <input
            className="input"
            id="name"
            type="text"
            placeholder="Nickname"
            onChange={(e) => {
              this.userData.nickname = e.target.value;
            }}
            required
          />
        </div>

        {/* first name */}
        <div className="inputContainer">
          <label className="label" htmlFor="firstname">
            First Name{" "}
          </label>
          <input
            className="input"
            id="firstname"
            type="text"
            placeholder="First name"
            onChange={(e) => {
              this.userData.firstName = e.target.value;
            }}
            required
          />
        </div>

        {/* last name */}
        <div className="inputContainer">
          <label className="label" htmlFor="lastname">
            Last Name{" "}
          </label>
          <input
            className="input"
            id="lastname"
            type="text"
            placeholder="Last name"
            onChange={(e) => {
              this.userData.lastName = e.target.value;
            }}
            required
          />
        </div>

        {/* username */}
        <div className="inputContainer">
          <label className="label" htmlFor="username">
            Username{" "}
          </label>
          <input
            className="input"
            id="username"
            type="text"
            placeholder="Username"
            onChange={(e) => {
              this.userData.username = e.target.value;
            }}
            required
          />
        </div>

        {/* email */}
        <div className="inputContainer">
          <label className="label" htmlFor="email">
            Email{" "}
          </label>
          <input
            className="input"
            id="email"
            type="text"
            placeholder="Email"
            onChange={(e) => {
              this.userData.email = e.target.value;
            }}
            required
          />
        </div>

        {/* password */}
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
        </div>

        {/* confirm password */}
        <div className="inputContainer">
          <label className="label" htmlFor="confirmPassword">
            Confirm Password{" "}
          </label>
          <input
            className="input"
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => {
              this.userData.confirmPassword = e.target.value;
            }}
            required
          />
        </div>
        <div className="doneButton">
          <button onClick={() => this.submitButton()}>Register</button>
        </div>
        {this.state.error ? (
          <div className="error">{this.state.error}</div>
        ) : null}
        <style jsx>{styles}</style>
      </div>
    );
  }
}
