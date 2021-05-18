import Link from "next/link";
import React from "react";
import css from "styled-jsx/css";
import axios from "axios";

import { CloseCircleOutlined } from "@ant-design/icons";

class GroupModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      closeButtonColor: "black",
      state: null,
      groups: [],
      username: "",
      groupid: "",
      groupname: "",
    };

    this.opening = false;
  }

  openModal() {
    if (this.opening) {
      //   alert("group list opening, no need to press again.");
      return;
    }
    if (this.props.token == null) {
      alert("Please login or register first.");
      return;
    }

    this.opening = true;

    axios
      .get("http://localhost:8080/blackboard/group/get_groups", {
        headers: {
          "Blackboard-Token": this.props.token,
        },
      })
      .then((res) => {
        if (res.data.code != 0) {
          throw "Error getting groups: " + res.data.msg;
        }
        this.opening = false;
        this.setState({ showModal: true, groups: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  hideModal() {
    this.opening = false;
    this.setState({ showModal: false, closeButtonColor: "black" });
  }

  inviteToGroup() {
    axios
      .get("http://localhost:8080/blackboard/group/invite", {
        headers: {
          "Blackboard-Token": this.props.token,
        },
        params: {
          username: this.state.username,
          groupId: this.state.groupid,
        },
      })
      .then((res) => {
        if (res.data.code != 0) {
          alert("Error inviting: " + res.data.msg);
          return;
        }
        alert("Invitation sent.");
        this.setState({ username: "", groupid: "" });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  createGroup() {
    axios
      .get("http://localhost:8080/blackboard/group/create", {
        headers: {
          "Blackboard-Token": this.props.token,
        },
        params: {
          groupName: this.state.groupname,
        },
      })
      .then((res) => {
        if (res.data.code != 0) {
          alert("Error creating group: " + res.data.msg);
          return;
        }
        alert("Group created");
        this.setState({ groupname: "" });
      })
      .catch((err) => {
        console.log(err);
      });
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
      content = this.state.groups.map((group) => {
        if (contains.includes(group.groupName)) {
          return null;
        }
        contains.push(group.groupName);
        return (
          <div
            className="group"
            key={group.groupId}
            onClick={() => {
              this.hideModal();
              this.props.openChat(group.groupName);
            }}
          >
            {`${group.groupName} (${group.groupId})`}
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
              {/* Group list */}
              <h1 className="header">Groups</h1>
              {content}

              {/* Invite */}
              <h1 className="header">Invite to group</h1>
              <input
                placeholder="username"
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
              <input
                placeholder="groupID"
                value={this.state.groupid}
                onChange={(e) => this.setState({ groupid: e.target.value })}
              />
              <button onClick={() => this.inviteToGroup()}>Invite</button>

              {/* Create */}
              <h1 className="header">Create group</h1>
              <input
                placeholder="group name"
                value={this.state.groupname}
                onChange={(e) => this.setState({ groupname: e.target.value })}
              />
              <button onClick={() => this.createGroup()}>Create</button>
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
  .group {
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

export default GroupModal;
