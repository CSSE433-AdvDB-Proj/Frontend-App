import React from "react";
import { connect } from "react-redux";
import { sendMessage } from "../../redux/testChatReducer";

import css from "styled-jsx/css";

const mapStateToProps = (state, props) => {
  return {
    messages: state.testChatReducer.messages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessage: (content, send) => sendMessage(content, send)(dispatch),
  };
};

class TestChat extends React.Component {
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

  render() {
    return (
      <div className="chatBox">
        {/* read message logic */}
        <div className="messages">
          {this.props.messages.map((rawData) => {
            const data = JSON.parse(rawData);
            // console.log(data);
            let className = "chatItem";
            let content;
            if (data.sender == "You") {
              content = data.content;
              className += " right";
            } else {
              content = data.sender + ": " + data.content;
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
          <button
            onClick={() => {
              this.setState({ content: "" });
              this.props.sendMessage(this.state.content, this.props.send);
            }}
          >
            Send Message
          </button>
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
    width: 70%;
    align-items: center;
    flex-direction: column;
    padding: 15px 0px;
    background-color: #111;
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

export default connect(mapStateToProps, mapDispatchToProps)(TestChat);
