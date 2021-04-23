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
    if (token != null) {
      this.setState({ token });
      this.connect(token);
    }
  }

  connect(token) {
    var socket = new SockJS("http://localhost:8080/blackboard/msg");
    this.client = Stomp.over(socket);
    this.client.connect({ "Blackboard-Token": token }, (frame) => {
      console.log("Connected: " + frame);
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
    if (this.state.token == null) {
      return;
    }
    console.log("Sending: " + msg);
    // this.clientRef.sendMessage("/topics/all", msg);
  };

  onMessage = (msg) => {
    console.log(msg);
  };

  setToken = (token) => {
    console.log("Set token!");
    this.setState({ token });
    cookieCutter.set("blackboard-token", token);
    if (token == null) {
      this.disconnect();
    } else {
      this.connect(token);
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    // console.log(styles);
    return (
      <Container>
        <Provider store={this.store}>
          <div>
            {/* <div>{this.state.token}</div> */}
            {/* {this.state.token == null ? null : (
              <SockJsClient
                headers={{
                  "Blackboard-Token": this.state.token,
                }}
                key={this.state.token}
                url={`http://localhost:8080/blackboard/msg`}
                topics={["/topics/all"]}
                onMessage={(msg) => this.onMessage(msg)}
                ref={(client) => (this.clientRef = client)}
              />
            )} */}
            <NavBar
              setToken={(t) => this.setToken(t)}
              token={this.state.token}
            />
            <Component {...pageProps} send={(msg) => this.send(msg)} />
          </div>
        </Provider>
      </Container>
    );
  }
}
