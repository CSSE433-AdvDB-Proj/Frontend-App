import React from "react";
import getStore from "../redux/index";
import { Provider } from "react-redux";
import App from "next/app";
import root from "../redux";

class MyApp extends App {
  store = getStore({});

  render() {
    const { Component, pageProps } = this.props;
    console.log(this.props);
    return (
      <Provider store={this.store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default MyApp;
