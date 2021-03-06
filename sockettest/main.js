const webSocketsServerPort = 8000;
const inputServerPort = 9419;
const webSocketServer = require("websocket").server;

var prompt = require("prompt");

const http = require("http");
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server,
});

// I'm maintaining all active connections in this object
const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

const sendToOthers = (content, userID) => {
  for (let client in clients) {
    let conn = clients[client];
    if (client != userID) {
      conn.sendUTF(JSON.stringify(content));
    }
  }

  return null;
};

wsServer.on("request", function (request) {
  var userID = getUniqueID();
  // console.log(
  //   new Date() +
  //     " Recieved a new connection from origin " +
  //     request.origin +
  //     "."
  // );
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  // console.log(
  //   "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  // );

  connection.on("message", function (message) {
    console.log("Got a message!");
    if (message.type === "utf8") {
      const dataFromClient = JSON.parse(message.utf8Data);
      dataFromClient.sender = userID;

      console.log(dataFromClient);

      switch (dataFromClient.type) {
        case "TEST_CHAT_MESSAGE":
        case "DEMO_SET_CURNUM":
          return sendToOthers(dataFromClient, userID);
      }
    }
  });
});

let getPrompt = () => {
  prompt.get(["number"], (err, res) => {
    let num = parseInt(res.number);
    for (let client in clients) {
      let conn = clients[client];
      conn.sendUTF(
        JSON.stringify({
          type: "DEMO_SET_CURNUM",
          newNum: num,
        })
      );
    }
    getPrompt();
  });
};

getPrompt();
