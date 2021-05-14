import Link from "next/link";
import React from "react";
import css from "styled-jsx/css";
import axios from "axios";

import { CloseCircleOutlined } from "@ant-design/icons";

class FriendModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      closeButtonColor: "black",
      state: null,
      friends: [],
    };

    this.opening = false;
  }

  openModal() {
    if (this.opening) {
      //   alert("Friend list opening, no need to press again.");
      return;
    }
    if (this.props.token == null) {
      alert("Please login or register first.");
      return;
    }

    this.opening = true;

    axios
      .get("http://localhost:8080/blackboard/friend/get_friends", {
        headers: {
          "Blackboard-Token": this.props.token,
        },
      })
      .then((res) => {
        if (res.data.code != 0) {
          throw "Error getting friends: " + res.data.msg;
        }
        this.opening = false;
        this.setState({ showModal: true, friends: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  hideModal() {
    this.opening = false;
    this.setState({ showModal: false, closeButtonColor: "black" });
  }

  render() {
    if (!this.state.showModal) {
      return null;
    }

    let content;
    let contains = [];
    if (this.opening) {
      content = <div></div>;
    } else {
      content = this.state.friends.map((friend) => {
        if (contains.includes(friend.username)) {
          return null;
        }
        contains.push(friend.username);
        return (
          <div
            className="friend"
            key={friend.username}
            onClick={() => {
              this.hideModal();
              this.props.openChat(friend.username);
            }}
          >
            {`${friend.firstName} ${friend.lastName} (${friend.nickname})`}
            <style jsx>{styles}</style>
          </div>
        );
      });
    }

    return (
      <div>
        <div className="modalOverlay">
          <div className="modal">
            <div className="modalHeader">
              <div
                className="closeButton"
                onClick={() => this.hideModal()}
                onMouseEnter={() => this.setState({ closeButtonColor: "red" })}
                onMouseLeave={() =>
                  this.setState({ closeButtonColor: "black" })
                }
              >
                <CloseCircleOutlined
                  style={{ color: this.state.closeButtonColor }}
                />
              </div>
            </div>
            <div className="modalBody">
              <h1 className="header">Friends</h1>
              {content}
            </div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }
}

const styles = css`
  .modalBody {
    padding-top: 10px;
    text-align: center;
  }
  .modalHeader {
    display: flex;
    justify-content: flex-end;
    font-size: 25px;
  }
  .modal {
    /* background: white; */
    width: 500px;
    height: 600px;
    border-radius: 15px;
    padding: 15px;
    background-color: #333;
  }
  .modalOverlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .header {
    color: white;
  }
  .friend {
    color: white;
    background-color: #111;
    padding: 8px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
  }

  .closeButton:hover {
    cursor: pointer;
  }
`;

export default FriendModal;
