import React from "react";
import { Provider } from "react-redux";
import App from "next/app";

import * as Stomp from "stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

import getStore from "../redux/index";
import NavBar from "../components/general/navbar";

import Container from "../components/general/container";

import cookieCutter from "cookie-cutter";

export default class MyApp extends App {
  constructor(props) {
    super(props);

    this.store = getStore({});

    this.state = {
      token: null,
    };

    this.client = null;
  }
  async pullUnread(token) {
    try {
      const rawMessages = await axios.post(
        "http://localhost:8080/blackboard/message/getOfflineMessage",
        {},
        {
          headers: {
            "Blackboard-Token": token,
          },
        }
      );
      const { code, msg, data } = rawMessages.data;
      if (code != 0) {
        throw `Status: ${code}, ${msg}`;
      }

      const toFetch = [];

      Object.keys(data).forEach((sender) => {
        data[sender].forEach((msg) => {
          toFetch.push({
            timestamp: msg.timestamp,
            chatId: sender,
          });
        });
      });

      if (toFetch.length == 0) {
        return;
      }

      const messages = await axios.post(
        "http://localhost:8080/blackboard/message/getMessage",
        toFetch,
        {
          headers: {
            "Blackboard-Token": token,
          },
        }
      );

      // console.log(messages);
      Object.keys(messages.data.data).forEach((sender) => {
        messages.data.data[sender].forEach((msg) => {
          this.store.dispatch({
            type: "RECEIVED_MESSAGE",
            from: msg.from,
            payload: msg,
          });
          this.store.dispatch({
            type: "RECEIVED_NOTIFICATION",
            sender,
            payload: msg,
            header: "MESSAGE",
            timestamp: msg.timestamp,
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async componentDidMount() {
    const token = cookieCutter.get("blackboard-token");
    const data = cookieCutter.get("user-data");

    if (token == null || data == null) {
      return;
    }

    this.setToken(token, JSON.parse(data));
  }

  handleMessage(token, username, hook) {
    const sender = hook["chatId"];
    const timestamp = hook["timestamp"];
    axios
      .post("http://localhost:8080/blackboard/message/getMessage", [hook], {
        headers: {
          "Blackboard-Token": token,
        },
      })
      .then((res) => {
        return res.data.data[sender];
      })
      .then((res) => {
        res.forEach((msg) => {
          this.store.dispatch({
            type: "RECEIVED_MESSAGE",
            from: msg.from,
            payload: msg,
          });
          this.store.dispatch({
            type: "RECEIVED_NOTIFICATION",
            sender,
            payload: msg,
            header: "MESSAGE",
            timestamp,
          });
        });
      })
      .catch((err) => {
        console.log("Error fetching message.");
        console.log(err);
      });
  }

  handleFriendRequest(token, username, hook) {
    const sender = hook["chatId"];
    const timestamp = hook["timestamp"];
    this.store.dispatch({
      type: "RECEIVED_NOTIFICATION",
      sender,
      payload: hook,
      header: "FRIEND_REQUEST",
      timestamp,
    });
  }

  handleFriendRequestAccepted(token, username, hook) {
    const sender = hook["chatId"];
    const timestamp = hook["timestamp"];
    this.store.dispatch({
      type: "RECEIVED_NOTIFICATION",
      sender,
      payload: hook,
      header: "FRIEND_REQUEST_ACCEPTED",
      timestamp,
    });
  }

  connect(token, username) {
    if (username == null || token == null) {
      console.log("TOKEN OR USERNAME EMPTY");
      return;
    }
    var socket = new SockJS("http://localhost:8080/blackboard/msg");
    this.client = Stomp.over(socket);
    this.client.debug = () => {};
    this.client.connect({ "Blackboard-Token": token }, async (frame) => {
      console.log("Connected: " + frame);
      await this.pullUnread(token);
      this.client.subscribe(`/user/${username}/personal`, (hook) => {
        hook = JSON.parse(hook.body);
        console.log("once, right");
        console.log(hook);
        switch (hook.type) {
          case "MESSAGE":
            this.handleMessage(token, username, hook);
            break;
          case "FRIEND_REQUEST":
            this.handleFriendRequest(token, username, hook);
            break;
          case "FRIEND_REQUEST_ACCEPTED":
            this.handleFriendRequestAccepted(token, username, hook);
            break;
          default:
            console.log("Invalid notification type: " + hook.type);
            break;
        }
      });
    });
  }

  disconnect() {
    if (this.client != null) {
      this.client.disconnect(() => {
        console.log("Disconnected");
      });
    }
  }

  send = (msg) => {
    if (this.store.getState().authReducer.token == null) {
      return;
    }
    // console.log("Sending: ");
    // console.log(msg);
    this.store.dispatch({
      type: "RECEIVED_MESSAGE",
      from: msg.to,
      payload: { ...msg, timestamp: new Date().getTime(), self: true },
    });
    this.client.send(
      "/toUser",
      {},
      JSON.stringify({ ...msg, type: "message" })
    );
  };

  onMessage = (msg) => {
    console.log(msg);
  };

  setToken = (token, data) => {
    this.store.dispatch({ type: "LOGIN" });
    if (token == null) {
      this.store.dispatch({ type: "SET_TOKEN", value: null });
      this.store.dispatch({ type: "SET_USER", payload: {} });

      cookieCutter.set("blackboard-token", "", {
        expires: new Date(0),
      });
      cookieCutter.set("user-data", "", {
        expires: new Date(0),
      });

      this.disconnect();
    } else {
      this.store.dispatch({ type: "SET_TOKEN", value: token });
      this.store.dispatch({ type: "SET_USER", payload: data });

      cookieCutter.set("blackboard-token", token);
      cookieCutter.set("user-data", JSON.stringify(data));

      this.connect(token, data.username);
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    // console.log(styles);
    return (
      <Container>
        <Provider store={this.store}>
          <div>
            <NavBar
              setToken={(t, d) => this.setToken(t, d)}
              send={(m) => this.send(m)}
            />
            <Component {...pageProps} send={(msg) => this.send(msg)} />
          </div>
        </Provider>
      </Container>
    );
  }
}
