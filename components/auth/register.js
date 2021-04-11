import React from "react";

import css from "styled-jsx/css";

export default class Register extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="container"
        action="http://www.acme.com/register"
        method="POST"
      >
        <h1>Register</h1>
        <div className="inputContainer">
          <label className="label" for="name">
            Name{" "}
          </label>
          <input
            className="input"
            id="name"
            type="text"
            autocomplete="name"
            required
          />
        </div>
        <div className="inputContainer">
          <label className="label" for="username">
            Username{" "}
          </label>
          <input
            className="input"
            id="username"
            type="text"
            autocomplete="username"
            required
          />
        </div>
        <div className="inputContainer">
          <label className="label" for="password">
            Password{" "}
          </label>
          <input
            className="input"
            id="password"
            type="password"
            autocomplete="password"
            required
          />
        </div>
        <div className="inputContainer">
          <label className="label" for="confirmPassword">
            Confirm Password{" "}
          </label>
          <input
            className="input"
            id="confirmPassword"
            type="password"
            autocomplete="confirmPassword"
            required
          />
        </div>
        <div className="inputContainer">
          <button>Register</button>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }
}

const styles = css`
  .container {
    flex-direction: column;
    align-items: center;
    align-content: center;
  }

  .inputContainer {
    width: 80%;

    flex-direction: row;
    align-items: flex-end;
    margin: 10px auto;
  }

  .label {
    width: 50%;
  }

  .input {
    /* float: right; */
    align-self: flex-end;
    width: 50%;
  }
`;
