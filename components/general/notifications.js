import Link from "next/link";
import React from "react";
import css from "styled-jsx/css";

import { connect } from "react-redux";

import { SEARCHFRIEND, SEARCHGROUP, SEARCHGROUPBYID } from "./navbar";

import NotificationCard from "./notificationCard";
import axios from "axios";

const mapStateToProps = (state) => {
  return {
    notifications: state.notificationReducer.notifications,
    token: state.authReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  };
};
class Notifications extends React.Component {
  constructor(props) {
    super(props);
  }

  respondFriend(user, value, timestamp) {
    axios
      .get("http://localhost:8080/blackboard/friend/respond", {
        params: { toUsername: user, accepted: value },
        headers: {
          "Blackboard-Token": this.props.token,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.code != 0) {
          throw "Error accepting friend: " + res.data.msg;
        }

        this.props.dispatch({
          type: "REMOVE_NOTIFICATION",
          timestamp,
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  respondGroup(user, groupid, value, timestamp) {
    axios
      .get("http://localhost:8080/blackboard/group/respond", {
        params: { groupId: groupid, accepted: value, inviter: user },
        headers: {
          "Blackboard-Token": this.props.token,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.code != 0) {
          throw "Error accepting group: " + res.data.msg;
        }

        this.props.dispatch({
          type: "REMOVE_NOTIFICATION",
          timestamp,
        });
      })
      .catch((err) => {
        alert(err);
      });
  }

  // async getGroupName(id) {
  //   let data = await axios.get("http://localhost:8080/blackboard/group/info", {
  //     headers: {
  //       "Blackboard-Token": this.props.token,
  //     },
  //     params: {
  //       groupId: id,
  //     },
  //   });
  //   return data.data["groupName"];
  // }

  render() {
    return (
      <div>
        <div className="header">Notifications</div>
        <div className="content">
          {this.props.notifications.map((k, i) => {
            switch (k.header) {
              case "MESSAGE":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header={"Messages: " + k.count}
                    texts={["From: " + k.from]}
                    onPress={() => {
                      this.props.openChat(
                        k.from,
                        k.isGroupChat ? SEARCHGROUPBYID : SEARCHFRIEND
                      );
                    }}
                  />
                );

              case "FRIEND_REQUEST":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header="Friend request:"
                    texts={["From: " + k.from]}
                    acceptCallback={() =>
                      this.respondFriend(k.from, true, k.timestamp)
                    }
                    declineCallback={() =>
                      this.respondFriend(k.from, false, k.timestamp)
                    }
                    showButtons
                  />
                );
              case "FRIEND_REQUEST_ACCEPTED":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header="New friend:"
                    texts={[k.from]}
                  />
                );
              case "FRIEND_REQUEST_REJECTED":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header="Friend rejected:"
                    texts={[k.from]}
                  />
                );
              case "GROUP_INVITATION":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header="Group request:"
                    texts={["Group: " + k.payload.groupId, "From: " + k.from]}
                    acceptCallback={() =>
                      this.respondGroup(
                        k.from,
                        k.payload.groupId,
                        true,
                        k.timestamp
                      )
                    }
                    declineCallback={() =>
                      this.respondGroup(
                        k.from,
                        k.payload.groupId,
                        false,
                        k.timestamp
                      )
                    }
                    showButtons
                  />
                );
              case "GROUP_INVITATION_ACCEPTED":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header="Group accepted:"
                    texts={[k.from]}
                  />
                );
              case "GROUP_INVITATION_REJECTED":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header="Group rejected:"
                    texts={[k.from]}
                  />
                );
              default:
                console.log(k);
                return <p key={i}>Invalid notification header: {k.header}</p>;
            }
          })}
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }
}

const styles = css`
  .content {
    /* flex-direction: column-reverse; */
  }

  .header {
    color: white;
    padding: 5px;
  }

  div {
    color: white;
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
