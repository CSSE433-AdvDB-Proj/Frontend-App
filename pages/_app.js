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
            chat: sender,
            payload: msg,
          });
          this.store.dispatch({
            type: "RECEIVED_NOTIFICATION",
            from: sender,
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
    const chat = hook["chatId"];
    const timestamp = hook["timestamp"];
    const isGroupChat = hook["isGroupChat"];
    axios
      .post("http://localhost:8080/blackboard/message/getMessage", [hook], {
        headers: {
          "Blackboard-Token": token,
        },
      })
      .then((res) => {
        // console.log(res);
        return res.data.data[Object.keys(res.data.data)[0]];
      })
      .then((res) => {
        res.forEach((msg) => {
          this.store.dispatch({
            type: "RECEIVED_MESSAGE",
            from: msg.from,
            chat: chat,
            payload: msg,
          });
          this.store.dispatch({
            type: "RECEIVED_NOTIFICATION",
            from: chat,
            payload: msg,
            header: "MESSAGE",
            isGroupChat: isGroupChat,
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
      from: sender,
      payload: hook,
      header: "FRIEND_REQUEST",
      timestamp,
    });
  }

  handleGeneric(token, username, hook) {
    const sender = hook["chatId"];
    const timestamp = hook["timestamp"];
    this.store.dispatch({
      type: "RECEIVED_NOTIFICATION",
      from: sender,
      payload: hook,
      header: hook.type,
      timestamp,
    });
  }

  handleHook(token, username, hook, isGroup = false) {
    console.log(hook);
    hook = JSON.parse(hook.body);
    switch (hook.type) {
      case "MESSAGE":
        this.handleMessage(token, username, hook);
        break;
      case "FRIEND_REQUEST":
        this.handleFriendRequest(token, username, hook);
        break;
      default:
        this.handleGeneric(token, username, hook);
        break;
    }
  }

  setClient(client) {
    this.client = client;
  }

  connect(token, username) {
    if (username == null || token == null) {
      console.log("TOKEN OR USERNAME EMPTY");
      return;
    }
    var socket = new SockJS("http://localhost:8080/blackboard/msg");
    let client = Stomp.over(socket);
    client.debug = () => {};
    client.connect({ "Blackboard-Token": token }, async (frame) => {
      this.setClient(client);
      console.log("Connected: " + frame);
      this.setState({});
      await this.pullUnread(token);
      this.client.subscribe(`/user/${username}/group`, (hook) => {
        this.handleHook(token, username, hook, true);
      });
      this.client.subscribe(`/user/${username}/personal`, (hook) => {
        this.handleHook(token, username, hook);
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

  send = (msg, path = "/toUser") => {
    if (this.store.getState().authReducer.token == null) {
      return;
    }
    // console.log("Sending: ");
    // console.log(msg);
    this.store.dispatch({
      type: "RECEIVED_MESSAGE",
      from: msg.to,
      chat: msg.chat,
      payload: { ...msg, timestamp: new Date().getTime(), self: true },
    });
    this.client.send(path, {}, JSON.stringify({ ...msg, type: "message" }));
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
              send={(m, p) => this.send(m, p)}
            />
            <Component
              {...pageProps}
              getClient={() => this.client}
              send={(m, p) => this.send(m, p)}
            />
          </div>
        </Provider>
      </Container>
    );
  }
}
