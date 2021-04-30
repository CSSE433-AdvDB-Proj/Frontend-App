import React from "react";
import { Provider } from "react-redux";
import App from "next/app";

import SockJsClient from "react-stomp";

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

  componentDidMount() {
    const token = cookieCutter.get("blackboard-token");
    const data = cookieCutter.get("user-data");

    if (token != null && data != null) {
      this.setToken(token, JSON.parse(data));
    }
  }

  connect(token, username) {
    if (username == null || token == null) {
      console.log("TOKEN OR USERNAME EMPTY");
      return;
    }
    var socket = new SockJS("http://localhost:8080/blackboard/msg");
    this.client = Stomp.over(socket);
    this.client.debug = () => {};
    this.client.connect({ "Blackboard-Token": token }, (frame) => {
      console.log("Connected: " + frame);
      this.client.subscribe(`/user/${username}/personal`, (hook) => {
        hook = JSON.parse(hook.body);
        if (hook.type == "MESSAGE") {
          axios
            .post(
              "http://localhost:8080/blackboard/message/getMessage",
              [hook],
              {
                headers: {
                  "Blackboard-Token": token,
                },
              }
            )
            .then((res) => {
              return res.data.data[hook["chatId"]];
            })
            .then((res) => {
              res.forEach((msg) => {
                this.store.dispatch({
                  type: "RECEIVED_MESSAGE",
                  from: msg.from,
                  payload: msg,
                });
              });
            })
            .catch((err) => {
              console.log("Error fetching message.");
              console.log(err);
            });
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
    console.log("Sending: ");
    console.log(msg);
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
