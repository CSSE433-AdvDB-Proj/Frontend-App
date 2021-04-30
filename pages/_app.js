import React from "react";
import { Provider } from "react-redux";
import App from "next/app";

import SockJsClient from "react-stomp";

import * as Stomp from "stompjs";
import SockJS from "sockjs-client";

import getStore from "../redux/index";
import NavBar from "../components/general/navbar";

import Container from "../components/general/container";

import cookieCutter from "cookie-cutter";
import { response } from "express";

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
    this.client.connect({ "Blackboard-Token": token }, (frame) => {
      // console.log("Connected: " + frame);
      this.client.subscribe(`/user/${username}/personal`, (res) => {
        // res = JSON.parse(res.body);
        // this.store.dispatch({
        //   type: "RECEIVED_MESSAGE",
        //   from: res.body["chatId"],
        //   payload: res.body,
        // });
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
    console.log("Sending: " + msg);
    // this.clientRef.sendMessage("/topics/all", msg);
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
            <NavBar setToken={(t, d) => this.setToken(t, d)} />
            <Component {...pageProps} send={(msg) => this.send(msg)} />
          </div>
        </Provider>
      </Container>
    );
  }
}
