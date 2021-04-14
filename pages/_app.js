import React from "react";
import { Provider } from "react-redux";
import App from "next/app";

import SockJsClient from "react-stomp";

import getStore from "../redux/index";
import NavBar from "../components/general/navbar";

import Container from "../components/general/container";

export default class MyApp extends App {
  constructor(props) {
    super(props);

    this.store = getStore({});

    this.state = {
      token: null,
    };
  }

  componentDidMount() {}

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
    this.setState({ token });
    if (token == null) {
      this.clientRef.disconnect();
    }
  };

  render() {
    const { Component, pageProps } = this.props;
    // console.log(styles);
    return (
      <Container>
        <Provider store={this.store}>
          <div>
            {this.state.token == null ? null : (
              <SockJsClient
                key={this.state.token}
                url={`http://localhost:8080/myUrl?token=${this.state.token}`}
                topics={["/topics/all"]}
                onMessage={(msg) => this.onMessage(msg)}
                ref={(client) => (this.clientRef = client)}
              />
            )}
            <NavBar setToken={(t) => this.setToken(t)} />
            <Component {...pageProps} send={(msg) => this.send(msg)} />

          </div>
        </Provider>
      </Container>
    );
  }
}
