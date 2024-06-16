import {Server} from "socket.io"
function sendMessage(event) {
    var inputMessage = "FROM HEADER"
    webSocket.send(inputMessage)
    
    event.preventDefault();
  }
var  webSocket = new WebSocket('ws://localhost:3042/');
webSocket.addEventListener("open", event => {
    webSocket.send("Connection established");
  })
  webSocket.onmessage = (event) => {
    console.log("\n\nIN HEADER:",event)
    
  };
  module.exports={webSocket}