import Link from "next/link";
import React from "react";
import css from "styled-jsx/css";

import { connect } from "react-redux";

import NotificationCard from "./notificationCard";

const mapStateToProps = (state) => {
  return {
    notifications: state.notificationReducer.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
class Notifications extends React.Component {
  constructor(props) {
    super(props);
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
                    header="Message:"
                    texts={["From: " + k.sender]}
                  />
                );

              case "FRIEND_REQUEST":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header="Friend request:"
                    texts={["From: " + k.sender]}
                  />
                );
              case "FRIEND_REQUEST_ACCEPTED":
                return (
                  <NotificationCard
                    key={k.timestamp}
                    header="New friend:"
                    texts={[k.sender]}
                  />
                );
              default:
                return <p key={i}>Invalid notification header</p>;
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
