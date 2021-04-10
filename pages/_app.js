import React from "react";
import { Provider } from "react-redux";
import App from "next/app";
import Head from "next/head";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import getStore from "../redux/index";
import NavBar from "../components/general/navbar";

export default class MyApp extends App {
  constructor(props) {
    super(props);
    this.client = new W3CWebSocket("ws://127.0.0.1:8000");
  }

  store = getStore({});

  // static async getInitialProps({ Component, ctx }) {
  //   const pageProps = Component.getInitialProps
  //     ? await Component.getInitialProps(ctx)
  //     : {};

  //   //Anything returned here can be access by the client
  //   return { pageProps: pageProps };
  // }

  componentDidMount() {
    this.client.onopen = () => {
      console.log("WebSocket: Connected");
    };
    this.client.onclose = () => {
      console.log("Websocket: Disconnected");
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={this.store}>
        <NavBar />
        <Component {...pageProps} client={this.client} />
      </Provider>
    );
  }
}
