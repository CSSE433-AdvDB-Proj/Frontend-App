import React from "react";
import getStore from "../redux/index";
import { Provider } from "react-redux";
import App from "next/app";

export default class MyApp extends App {
  store = getStore({});

  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    //Anything returned here can be access by the client
    return { pageProps: pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={this.store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}
