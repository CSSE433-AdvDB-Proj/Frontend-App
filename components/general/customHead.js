import React from "react";
import Head from "next/head";

export default class Demo extends React.PureComponent {
  render() {
    return (
      <Head>
        <title>{this.props.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    );
  }
}
