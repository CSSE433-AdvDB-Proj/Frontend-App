import React from "react";
import { connect } from "react-redux";
import css from "styled-jsx/css";

const mapStateToProps = (state, props) => {
  return {
    messages: state.messageReducer.messages[props.target],
    user: state.authReducer.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

class ChatBox extends React.Component {
  constructor(props) {
    super(props);

    this.inputBox = React.createRef();
    this.state = {
      content: "",
    };
  }

  onChange(e) {
    this.setState({ content: e.target.value });
  }

  sendMessage() {
    this.setState({ content: "" });
    this.props.send({
      from: this.props.user.username,
      to: this.props.target,
      content: this.state.content,
    });
  }

  render() {
    return (
      <div className="chatBox">
        <div>{this.props.target}</div>
        {/* read message logic */}
        <div className="messages">
          {this.props.messages == null
            ? null
            : this.props.messages.map((rawData) => {
                const data = rawData;
                console.log(data);
                let className = "chatItem";
                let content;
                if (data.self) {
                  content = data.content;
                  className += " right";
                } else {
                  content = data.from + ": " + data.content;
                  className += " left";
                }
                return (
                  <div className={className} key={data.timestamp}>
                    <p className="text">{content}</p>
                  </div>
                );
              })}
        </div>

        {/* message input + send logic */}
        <div className="inputBox">
          <input
            type="text"
            value={this.state.content}
            onChange={(e) => this.onChange(e)}
            ref={this.inputBox}
          />
          <button onClick={() => this.sendMessage()}>Send Message</button>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }
}

const styles = css`
  .messages {
    flex-direction: column;
  }

  .chatBox {
    margin-top: 30px;
    margin-right: auto;
    margin-left: auto;
    width: 90%;
    align-items: center;
    flex-direction: column;
    padding: 15px 0px;
    background-color: #111;
    color: white;
  }

  .inputBox {
    /* margin-top: 10px; */
    /* width: 100%; */
    padding: 0px 15px;
  }

  .text {
    color: white;
    margin: 0px 15px;
  }

  .left {
    text-align: start;
  }

  .right {
    text-align: end;
  }

  .chatItem {
    margin-bottom: 5px;
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);
