import React from "react";
import { Provider } from "react-redux";
import App from "next/app";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import getStore from "../redux/index";
import NavBar from "../components/general/navbar";

import Container from "../components/general/container";

export default class MyApp extends App {
  constructor(props) {
    super(props);

    this.store = getStore({});
    this.client = null;

    this.createClient = (token) => {
      console.log(token);
      this.client = new W3CWebSocket("ws://127.0.0.1:8000");

      this.client.onopen = () => {
        console.log("WebSocket: Connected");
      };

      this.client.onclose = () => {
        console.log("Websocket: Disconnected");
      };

      this.client.onmessage = (message) => {
        console.log("Websocket: Received Message");
        const dataFromServer = JSON.parse(message.data);
        dataFromServer.fromServer = true;
        this.store.dispatch(dataFromServer);
      };
    };
  }

  componentDidMount() {
    // this.client.onopen = () => {
    //   console.log("WebSocket: Connected");
    // };
    // this.client.onclose = () => {
    //   console.log("Websocket: Disconnected");
    // };
    // this.client.onmessage = (message) => {
    //   console.log("Websocket: Received Message");
    //   const dataFromServer = JSON.parse(message.data);
    //   dataFromServer.fromServer = true;
    //   this.store.dispatch(dataFromServer);
    // };
  }

  render() {
    const { Component, pageProps } = this.props;
    // console.log(styles);
    return (
      <Container>
        <Provider store={this.store}>
          <div>
            <NavBar createClient={(t) => this.createClient(t)} />
            <Component {...pageProps} client={this.client} />
          </div>
        </Provider>
      </Container>
    );
  }
}
