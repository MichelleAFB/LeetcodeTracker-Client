import * as actionTypes from "./socket-types";
import { io } from "socket.io-client";
export function setSocket(socket) {
  console.log("SOCKET IN ACTIONS",socket)
  if(socket==null){
  if(!socket.connected){
    console.log("SOCKET NOT CONNECTED")
   const newSocket= io.connect("http://localhost:3022")
  return {
    type: actionTypes.SET_SOCKET,
    payload: {
      socket:newSocket
    },
  };
}else{
  return {
    type: actionTypes.SET_SOCKET,
    payload: {
      socket:socket
    },
  };
}
}else{
  const s=io.connect("http://localhost:3042")
  console.log("lastcase")
  return {
    type: actionTypes.SET_SOCKET,
    payload: {
      socket:s
    },
  };
}
}

export function toggleSocket(toggle) {
  return {
    type: actionTypes.TOGGLE_SOCKET,
    payload: {
      toggle:toggle
    },
  };
}

