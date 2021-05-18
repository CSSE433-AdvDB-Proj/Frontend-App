import Link from "next/link";
import React from "react";
import css from "styled-jsx/css";

import { connect } from "react-redux";

import { SEARCHFRIEND, SEARCHGROUP } from "./navbar";

import NotificationCard from "./notificationCard";
import axios from "axios";

const mapStateToProps = (state) => {
  return {
    notifications: state.notificationReducer.notifications,
    token: state.authReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
class Notifications extends React.Component {
  constructor(props) {
    super(props);
  }

  respondFriend(user, value) {
    axios
      .get("http://localhost:8080/blackboard/friend/respond", {
        params: { toUsername: user, accepted: value },
        headers: {
          "Blackboard-Token": this.props.token,
        },
      })
      .then((res) => {
        console.log(res);
        // if (res.data.code != 0) {
        //   throw "Error searching friend: " + res.data.msg;
        // }
        // if (res.data.data.length == 0) {
        //   alert("Friend not found: " + input);
        //   return;
        // }

        // this.props.dispatch({
        //   type: "LOAD_USER",
        //   username: input.toLowerCase(),
        //   name: res.data.data[0]["nickname"],
        // });

        // this.chatModal.current.openModal(res.data.data[0].username);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
                        k.isGroupChat ? SEARCHGROUP : SEARCHFRIEND
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
                    acceptCallback={() => this.respondFriend(k.from, true)}
                    declineCallback={() => this.respondFriend(k.from, false)}
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
                    header="Friend rejected by:"
                    texts={[k.from]}
                  />
                );
              case "GROUP_INVITATION":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header="Friend request:"
                    texts={["From: " + k.from]}
                    acceptCallback={() => this.respondFriend(k.from, true)}
                    declineCallback={() => this.respondFriend(k.from, false)}
                    showButtons
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
