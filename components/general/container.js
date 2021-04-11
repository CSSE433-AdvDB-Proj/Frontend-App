import React from "react";

import css from "styled-jsx/css";

export default class Container extends React.PureComponent {
  render() {
    return (
      <div>
        <div>{this.props.children}</div>

        <style global jsx>
          {`
            html,
            body {
              background-color: gray;
              padding: 0;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
            }

            * {
              box-sizing: border-box;
            }
          `}
        </style>
      </div>
    );
  }
}
