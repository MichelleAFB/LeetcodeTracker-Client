
import * as actionTypes from "./userSession-types";

export function setUserSessionStatusLoggedOut(){
    return{
        type:actionTypes.SET_USER_SESSION_STATUS_LOGGED_OUT
    }
}
export function setUserSessionStatusLoggedIn(){
    return{
        type:actionTypes.SET_USER_SESSION_STATUS_LOGGED_IN
    }
}