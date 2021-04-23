import React from "react";
import axios from "axios";

import styles from "./authFormStyles";

export default class Login extends React.PureComponent {
  constructor(props) {
    super(props);

    this.userData = {
      username: "",
      password: "",
    };

    this.state = {
      error: false,
    };
  }

  submitButton() {
    // console.log(this.userData);
    axios
      .post("http://localhost:8080/blackboard/sys/login", this.userData)
      .then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          console.log(res.headers["blackboard-token"]);
          this.props.setToken(res.headers["blackboard-token"]);
          this.setState({ error: false });
          this.props.hideModal();
        } else {
          throw `Error Code: ${res.data.code}, \n${res.data.msg}`;
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: err });
      });
    // this.props.hideModal();
  }

  render() {
    return (
      <div className="container">
        <h1>Login</h1>

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
