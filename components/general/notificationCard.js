import Link from "next/link";
import React from "react";
import css from "styled-jsx/css";

class NotificationCard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container" onClick={this.props.onPress}>
        <div className="header">{this.props.header}</div>
        {this.props.texts.map((t, i) => {
          return (
            <div className="content" key={i}>
              {t}
            </div>
          );
        })}
        {!this.props.showButtons ? null : (
          <div className="buttons">
            <button onClick={() => this.props.acceptCallback()}>yes</button>
            <button onClick={() => this.props.declineCallback()}>no</button>
          </div>
        )}
        <style jsx>{styles}</style>
      </div>
    );
  }
}

const styles = css`
  .container {
    justify-content: center;
    margin: 5px;
    padding: 5px;
    border-radius: 0 0 5px 5px;
    background-color: #333;
  }

  .buttons {
    flex-direction: row;
    justify-content: center;
  }

  .header,
  .content {
    color: white;
    margin: 0;
  }

  .header {
    padding-top: 0;
  }

  .content {
    padding-bottom: 0;
  }
`;

export default NotificationCard;
