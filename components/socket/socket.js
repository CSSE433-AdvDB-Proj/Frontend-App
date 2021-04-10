import React from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default class Socket extends React.Component {
  constructor(props) {
    super(props);
    this.client = new W3CWebSocket("ws://127.0.0.1:8000");
  }

  componentDidMount() {
    this.client.onopen = () => {
      console.log("WebSocket: Connected");
    };
    this.client.onclose = () => {
      console.log("Websocket: Disconnected");
    };
  }
}
