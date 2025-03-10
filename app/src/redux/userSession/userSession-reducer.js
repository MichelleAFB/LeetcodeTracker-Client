import { socket } from "../../socket";
import * as actionTypes from "./userSession-types";
import { io } from "socket.io-client";
const initialState = {
    sessionStatus:JSON.parse(sessionStorage.getItem("user"))!=null?"USER_LOGGED_IN":"USER_LOGGED_OUT"
};

export const userSessionReducer = (state = initialState, action) => {

  switch (action.type) {
    
      case actionTypes.SET_USER_SESSION_STATUS_LOGGED_OUT:
        return{
            ...state,
            sessionStatus:"USER_LOGGED_OUT"

        }
        case actionTypes.SET_USER_SESSION_STATUS_LOGGED_IN:
            return{
                ...state,
                sessionStatus:"USER_LOGGED_IN"
    
            }
   

    

    default:
      return state;
  }
};