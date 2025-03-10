import { socket } from "../../socket";
import * as actionTypes from "./socket-types";
import { io } from "socket.io-client";
const initialState = {
 socket:socket,
 toggle:false,
 groupChallenges:null
};

export const socketReducer = (state = initialState, action) => {

  switch (action.type) {
    case actionTypes.SET_SOCKET:
    
      return {
        ...state,
       socket:action.payload.socket
      };
    
      case actionTypes.TOGGLE_SOCKET:
      return {
        ...state,
       toggle:action.payload.toggle
      };
      case actionTypes.SET_GROUP_CHALLENGES:
      return{
        ...state,
        groupChallenges:action.payload.challenges,
      }

    

    default:
      return state;
  }
};